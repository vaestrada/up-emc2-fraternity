"use server";

import { headers } from "next/headers";
import { getAdminSupabase, CONTRIB_BUCKET } from "@/lib/supabase/server";

export type FormState = {
  status: "idle" | "success" | "error";
  /** true when the message was actually emailed to the Alumni Association */
  delivered: boolean;
  /** true when the submission was persisted to the database (survives even if email is off) */
  stored?: boolean;
  message?: string;
  /** submitted values echoed back on error so React's form reset doesn't wipe them */
  values?: Record<string, string>;
};

const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

/** Upload contributed photos to the private bucket; returns storage paths. */
async function uploadPhotos(formData: FormData, submissionId: string): Promise<string[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const files = formData
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0 && f.type.startsWith("image/"))
    .slice(0, MAX_PHOTOS);

  const paths: string[] = [];
  for (const [i, file] of files.entries()) {
    if (file.size > MAX_PHOTO_BYTES) continue;
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80) || "photo";
    const path = `${submissionId}/${i}-${safe}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(CONTRIB_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (!error) paths.push(path);
    else console.error("Photo upload failed:", error.message);
  }
  return paths;
}

/** Persist a submission. Returns true when a row was written. */
async function persist(
  kind: FormKind,
  values: Record<string, string>,
  ip: string,
  formData: FormData
): Promise<boolean> {
  const supabase = getAdminSupabase();
  if (!supabase) return false;
  try {
    if (kind === "contribute") {
      const id = crypto.randomUUID();
      const photo_paths = await uploadPhotos(formData, id);
      const { error } = await supabase.from("contributions").insert({
        id,
        name: values.name,
        batch: values.batch || null,
        email: values.email,
        kind: values.kind || null,
        title: values.title,
        details: values.details,
        links: values.links || null,
        photo_paths,
        ip,
      });
      return !error;
    }
    if (kind === "pledge") {
      const { error } = await supabase.from("pledges").insert({
        name: values.name,
        batch: values.batch || null,
        email: values.email,
        cause: values.cause || null,
        amount: values.amount || null,
        reference: values.reference || null,
        message: values.message || null,
        consent_public: formData.get("consent_public") === "on",
        ip,
      });
      return !error;
    }
    const { error } = await supabase.from("messages").insert({
      name: values.name,
      email: values.email,
      topic: values.topic || null,
      message: values.message,
      ip,
    });
    return !error;
  } catch (error) {
    console.error("Persist error:", error);
    return false;
  }
}

/* ── Rate limiting ─────────────────────────────────────────────
   In-memory sliding window. Under Vercel's Fluid Compute, instances are
   reused across requests, so this is a meaningful (if best-effort) guard. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const submissionLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissionLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    submissionLog.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionLog.set(ip, recent);
  if (submissionLog.size > 1000) {
    for (const [key, times] of submissionLog) {
      if (times.every((t) => now - t >= WINDOW_MS)) submissionLog.delete(key);
    }
  }
  return false;
}

/* ── Helpers ─────────────────────────────────────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readField(formData: FormData, name: string, maxLength: number): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

async function deliver(subject: string, text: string, replyTo: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return false;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "EMC² Website <onboarding@resend.dev>",
      to: [to],
      reply_to: replyTo,
      subject,
      // plain text only — form input never becomes HTML, so nothing to inject
      text,
    }),
  });
  if (!res.ok) {
    console.error("Resend delivery failed:", res.status, await res.text());
    return false;
  }
  return true;
}

type FormKind = "contact" | "pledge" | "contribute";

type Definition = {
  subject: (name: string) => string;
  fields: { name: string; label: string; maxLength: number; required?: boolean }[];
  /** when true, the "consent" checkbox must be checked to submit */
  requireConsent?: boolean;
};

const FORMS: Record<FormKind, Definition> = {
  contact: {
    subject: (name) => `[Website] Message from ${name}`,
    fields: [
      { name: "name", label: "Name", maxLength: 120, required: true },
      { name: "email", label: "Email", maxLength: 254, required: true },
      { name: "topic", label: "Topic", maxLength: 80 },
      { name: "message", label: "Message", maxLength: 5000, required: true },
    ],
  },
  pledge: {
    subject: (name) => `[Website] Pledge from ${name}`,
    fields: [
      { name: "name", label: "Name", maxLength: 120, required: true },
      { name: "batch", label: "Batch", maxLength: 40 },
      { name: "email", label: "Email", maxLength: 254, required: true },
      { name: "cause", label: "Cause", maxLength: 80 },
      { name: "amount", label: "Amount (PHP)", maxLength: 20 },
      { name: "reference", label: "Transfer reference no.", maxLength: 64 },
      { name: "message", label: "Message", maxLength: 5000 },
    ],
  },
  contribute: {
    subject: (name) => `[Website] Archive contribution from ${name}`,
    requireConsent: true,
    fields: [
      { name: "name", label: "Name", maxLength: 120, required: true },
      { name: "batch", label: "Batch", maxLength: 40 },
      { name: "email", label: "Email", maxLength: 254, required: true },
      { name: "kind", label: "Type of contribution", maxLength: 80 },
      { name: "title", label: "Title", maxLength: 200, required: true },
      { name: "details", label: "Details", maxLength: 8000, required: true },
      { name: "links", label: "Links (photos / album / source)", maxLength: 500 },
    ],
  },
};

async function submit(kind: FormKind, formData: FormData): Promise<FormState> {
  // honeypot — invisible to humans; bots that fill it get a quiet fake success
  if (readField(formData, "website", 200) !== "") {
    return { status: "success", delivered: false };
  }

  const def = FORMS[kind];
  const values: Record<string, string> = {};
  for (const field of def.fields) {
    values[field.name] = readField(formData, field.name, field.maxLength);
  }

  // Validate first, so a fixable typo (e.g. missing ".com") doesn't burn a
  // rate-limit slot — otherwise a fumbling alumnus can lock themselves out
  // before ever sending a valid message.
  for (const field of def.fields) {
    if (field.required && values[field.name] === "") {
      return {
        status: "error",
        delivered: false,
        message: `Please fill in the ${field.label.toLowerCase()} field.`,
        values,
      };
    }
  }
  if (!EMAIL_RE.test(values.email)) {
    return {
      status: "error",
      delivered: false,
      message: "Please enter a valid email address.",
      values,
    };
  }
  if (def.requireConsent && formData.get("consent") !== "on") {
    return {
      status: "error",
      delivered: false,
      message: "Please confirm the consent checkbox so we may edit and publish your contribution.",
      values,
    };
  }

  // Only submissions that would actually be delivered count against the limit.
  const ip = await clientIp();
  if (isRateLimited(ip)) {
    return {
      status: "error",
      delivered: false,
      message: "Too many submissions — please wait a few minutes and try again.",
      values,
    };
  }

  // Persist first so the record survives even when email delivery is off.
  const stored = await persist(kind, values, ip, formData);

  const text = def.fields
    .map((field) => `${field.label}:\n${values[field.name] || "—"}`)
    .join("\n\n");

  try {
    const delivered = await deliver(def.subject(values.name), text, values.email);
    return { status: "success", delivered, stored };
  } catch (error) {
    console.error("Form delivery error:", error);
    return { status: "success", delivered: false, stored };
  }
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("contact", formData);
}

export async function submitPledge(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("pledge", formData);
}

export async function submitContribution(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("contribute", formData);
}
