"use server";

import { headers } from "next/headers";

export type FormState = {
  status: "idle" | "success" | "error";
  /** true when the message was actually emailed to the Alumni Association */
  delivered: boolean;
  message?: string;
  /** submitted values echoed back on error so React's form reset doesn't wipe them */
  values?: Record<string, string>;
};

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

type Definition = {
  subject: (name: string) => string;
  fields: { name: string; label: string; maxLength: number; required?: boolean }[];
};

const FORMS: Record<"contact" | "pledge", Definition> = {
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
      { name: "message", label: "Message", maxLength: 5000 },
    ],
  },
};

async function submit(kind: "contact" | "pledge", formData: FormData): Promise<FormState> {
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

  // Only submissions that would actually be delivered count against the limit.
  if (isRateLimited(await clientIp())) {
    return {
      status: "error",
      delivered: false,
      message: "Too many submissions — please wait a few minutes and try again.",
      values,
    };
  }

  const text = def.fields
    .map((field) => `${field.label}:\n${values[field.name] || "—"}`)
    .join("\n\n");

  try {
    const delivered = await deliver(def.subject(values.name), text, values.email);
    return { status: "success", delivered };
  } catch (error) {
    console.error("Form delivery error:", error);
    return { status: "success", delivered: false };
  }
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("contact", formData);
}

export async function submitPledge(_prev: FormState, formData: FormData): Promise<FormState> {
  return submit("pledge", formData);
}
