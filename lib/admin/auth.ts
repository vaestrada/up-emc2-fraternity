import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

/* Lightweight password gate for /admin. No user accounts: the shared
   ADMIN_PASSWORD (server-only env) unlocks the review queue. The session
   cookie is an HMAC derived from the password, so changing the password
   invalidates every existing session. */

const COOKIE = "emc2_admin";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHmac("sha256", pw).update("emc2-admin-v1").digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return safeEqual(input, pw);
}

export async function isAuthed(): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;
  const cookie = (await cookies()).get(COOKIE)?.value;
  return Boolean(cookie && safeEqual(cookie, token));
}

export async function startSession(): Promise<void> {
  const token = sessionToken();
  if (!token) return;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}
