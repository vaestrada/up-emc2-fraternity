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

/* Which anniversary edition an RSVP belongs to. Mirrors `anniversary.edition`
   in lib/content.ts, restated here because a server action must not import
   client-facing content just to read one integer. */
const ANNIVERSARY_EDITION = 58;
const ATTENDING = ["yes", "maybe", "cannot"];

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
    if (kind === "dues") {
      // Set only by the Portal's dues form (a signed-in member); a visitor
      // recording dues without an account simply leaves this null.
      const memberId = readField(formData, "member_id", 64);
      const { error } = await supabase.from("dues_payments").insert({
        member_id: memberId || null,
        name: values.name,
        batch: values.batch || null,
        email: values.email,
        period: values.period,
        amount: values.amount || null,
        method: values.method || null,
        reference: values.reference || null,
        message: values.message || null,
        ip,
      });
      return !error;
    }
    if (kind === "sponsor") {
      const expected = Number(String(values.amount_expected ?? "").replace(/[^\d.]/g, ""));
      const { error } = await supabase.from("sponsor_enquiries").insert({
        organisation: values.organisation,
        contact_name: values.name,
        email: values.email,
        phone: values.phone || null,
        introduced_by: values.introduced_by || null,
        interest: values.interest || "sponsorship",
        tier: values.tier || null,
        // An expected amount is NOT revenue; the pipeline stage decides that.
        amount_expected: Number.isFinite(expected) && expected > 0 ? expected : null,
        message: values.message || null,
        ip,
      });
      if (error) console.error("sponsor_enquiries insert failed:", error.message);
      return !error;
    }
    if (kind === "rsvp") {
      // Checkboxes share a name, so these arrive as several entries rather
      // than one field — readField would silently keep only the first.
      const interests = formData
        .getAll("interests")
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim().slice(0, 60))
        .filter(Boolean)
        .slice(0, 12);

      // upsert, not insert: the unique (edition, lower(email)) index means a
      // brod who fills the form again is correcting their answer, not adding
      // a second RSVP. Failing them with a duplicate-key error would be the
      // worst possible response to someone trying to update their guest count.
      const { error } = await supabase
        .from("anniversary_rsvps")
        .upsert(
          {
            edition: ANNIVERSARY_EDITION,
            name: values.name,
            batch: values.batch || null,
            // lowercased to match the (edition, email) unique index the
            // upsert targets — see 0004_anniversary_rsvp.sql
            email: values.email.toLowerCase(),
            attending: ATTENDING.includes(values.attending) ? values.attending : "yes",
            guests: values.guests || null,
            interests,
            message: values.message || null,
            consent_updates: formData.get("consent_updates") === "on",
            ip,
          },
          { onConflict: "edition,email", ignoreDuplicates: false }
        );
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

type FormKind = "contact" | "pledge" | "contribute" | "dues" | "rsvp" | "sponsor";

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
  dues: {
    // Manual reconciliation, same shape as pledges — automated PayMongo
    // checkout is gated on KYB approval per the README roadmap, so this is
    // the honest interim: self-report, admin verifies against the reference
    // number in the Association's own GCash/Maya/bank transaction history.
    subject: (name) => `[Website] Dues payment from ${name}`,
    fields: [
      { name: "name", label: "Name", maxLength: 120, required: true },
      { name: "batch", label: "Batch", maxLength: 40 },
      { name: "email", label: "Email", maxLength: 254, required: true },
      { name: "period", label: "Membership period", maxLength: 40, required: true },
      { name: "amount", label: "Amount (PHP)", maxLength: 20 },
      { name: "method", label: "Payment method", maxLength: 40 },
      { name: "reference", label: "Transfer reference no.", maxLength: 64 },
      { name: "message", label: "Message", maxLength: 2000 },
    ],
  },
  sponsor: {
    // A sponsorship or souvenir-ad enquiry. Goes into a pipeline, not the
    // message queue, because PLAN §5 needs expected and collected kept apart.
    subject: (name) => `[Website] Sponsorship enquiry from ${name}`,
    fields: [
      { name: "organisation", label: "Organisation", maxLength: 160, required: true },
      { name: "name", label: "Your name", maxLength: 120, required: true },
      { name: "email", label: "Email", maxLength: 254, required: true },
      { name: "phone", label: "Mobile", maxLength: 40 },
      { name: "introduced_by", label: "Introduced by", maxLength: 160 },
      { name: "interest", label: "Interest", maxLength: 40 },
      { name: "tier", label: "Tier or placement", maxLength: 80 },
      { name: "amount_expected", label: "Indicative amount", maxLength: 20 },
      { name: "message", label: "Message", maxLength: 4000 },
    ],
  },
  rsvp: {
    // Save-the-date, not a ticket. Nothing here takes money — the Association's
    // merchant account is unresolved (PLAN.md D7), and an intent list gathered
    // six months early is worth more than a checkout gathered late.
    subject: (name) => `[Website] 58th Anniversary — save-the-date from ${name}`,
    fields: [
      { name: "name", label: "Name", maxLength: 120, required: true },
      { name: "batch", label: "Batch", maxLength: 40 },
      { name: "email", label: "Email", maxLength: 254, required: true },
      { name: "attending", label: "Intending to attend", maxLength: 20 },
      { name: "guests", label: "Guests expected", maxLength: 40 },
      { name: "message", label: "Message", maxLength: 2000 },
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

  let text = def.fields
    .map((field) => `${field.label}:\n${values[field.name] || "—"}`)
    .join("\n\n");

  // Multi-value checkboxes live outside the single-value `fields` list, so
  // they have to be appended by hand — and they are the most actionable part
  // of an RSVP for the committee, not an afterthought.
  if (kind === "rsvp") {
    const interests = formData.getAll("interests").filter((v) => typeof v === "string");
    text += `\n\nInterested in:\n${interests.length ? interests.join(", ") : "—"}`;
    text += `\n\nConsented to anniversary updates:\n${
      formData.get("consent_updates") === "on" ? "Yes" : "No"
    }`;
  }

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

export async function submitDues(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("dues", formData);
}

export async function submitRsvp(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("rsvp", formData);
}

export async function submitSponsor(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("sponsor", formData);
}
