"use server";

import { headers } from "next/headers";
import { getServerSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/rsc";
import { getAdminSupabase } from "@/lib/supabase/server";

export type AssistanceState = {
  status: "idle" | "success" | "error";
  message?: string;
  values?: Record<string, string>;
};

const RELATIONS = ["self", "spouse", "parent", "child", "sibling", "other"];
const KINDS = ["hospitalisation", "accident", "bereavement", "calamity", "other"];
const URGENCIES = ["immediate", "weeks", "planning"];

function read(formData: FormData, name: string, max: number): string {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/* The one intake on this site that is not open to the public. A request may
   describe a brod's illness or a death in their family, so:
     * the caller must hold a valid Portal session, checked here on the server
       and not merely by the page that rendered the form;
     * the row is written with the service role into a table with RLS on and
       no policies, so it is readable only through /admin;
     * the member's own auth id is recorded, which is what lets the board come
       back to them without storing anything extra. */
export async function submitAssistanceRequest(
  _prev: AssistanceState,
  formData: FormData
): Promise<AssistanceState> {
  if (read(formData, "website", 200) !== "") {
    return { status: "success" }; // honeypot
  }

  if (!SUPABASE_AUTH_CONFIGURED) {
    return { status: "error", message: "The Portal is not configured on this deployment." };
  }

  const auth = await getServerSupabase();
  const {
    data: { user },
  } = (await auth?.auth.getUser()) ?? { data: { user: null } };
  if (!user) {
    return {
      status: "error",
      message: "Your session has expired. Please sign in again and resend.",
    };
  }

  const values = {
    name: read(formData, "name", 120),
    batch: read(formData, "batch", 40),
    email: read(formData, "email", 254) || (user.email ?? ""),
    phone: read(formData, "phone", 40),
    relation: read(formData, "relation", 20),
    kind: read(formData, "kind", 30),
    summary: read(formData, "summary", 5000),
    amount_needed: read(formData, "amount_needed", 40),
    urgency: read(formData, "urgency", 20),
  };

  if (!values.name || !values.summary) {
    return {
      status: "error",
      message: "Please give your name and a short description of what has happened.",
      values,
    };
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return { status: "error", message: "The register is unavailable just now." };
  }

  const h = await headers();
  const { error } = await supabase.from("assistance_requests").insert({
    member_id: user.id,
    name: values.name,
    batch: values.batch || null,
    email: values.email,
    phone: values.phone || null,
    relation: RELATIONS.includes(values.relation) ? values.relation : "self",
    kind: KINDS.includes(values.kind) ? values.kind : "other",
    summary: values.summary,
    amount_needed: values.amount_needed || null,
    urgency: URGENCIES.includes(values.urgency) ? values.urgency : null,
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
  });

  if (error) {
    console.error("assistance_requests insert failed:", error.message);
    return {
      status: "error",
      message: "We could not record that. Please message the fraternity directly so it is not lost.",
      values,
    };
  }

  return { status: "success" };
}
