import { NextResponse, type NextRequest } from "next/server";
import { isAuthed } from "@/lib/admin/auth";
import { getAdminSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/* CSV export for the board — /admin/export?table=anniversary_rsvps
 *
 * This is the bridge to the tools the committee actually works in. The
 * save-the-date list, pledges, and dues records land in Google Sheets with
 * one click, where the events and finance committees can sort, call, and
 * reconcile without anyone needing an account here.
 *
 * Gated by the same admin session as /admin. The rows contain personal data
 * (names, emails), so the file is for the Association only — PRIVACY.md
 * rule 2 applies to the download exactly as it does to the roster. */

const TABLES: Record<string, { columns: string[]; order: string }> = {
  anniversary_rsvps: {
    columns: ["created_at", "edition", "name", "batch", "email", "attending", "guests", "interests", "message", "consent_updates"],
    order: "created_at",
  },
  pledges: {
    columns: ["created_at", "status", "name", "batch", "email", "cause", "amount", "reference", "message", "consent_public"],
    order: "created_at",
  },
  dues_payments: {
    columns: ["created_at", "status", "name", "batch", "email", "period", "amount", "method", "reference", "message"],
    order: "created_at",
  },
  contributions: {
    columns: ["created_at", "status", "name", "batch", "email", "kind", "title", "details", "links"],
    order: "created_at",
  },
  messages: {
    columns: ["created_at", "name", "email", "topic", "message"],
    order: "created_at",
  },
};

/* RFC 4180 quoting, plus a guard against spreadsheet formula injection: a
   cell beginning with = + - @ would otherwise execute when the sheet opens. */
function cell(value: unknown): string {
  let text =
    value == null
      ? ""
      : Array.isArray(value)
      ? value.join("; ")
      : typeof value === "boolean"
      ? value ? "yes" : "no"
      : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const table = request.nextUrl.searchParams.get("table") ?? "";
  const def = TABLES[table];
  if (!def) return new NextResponse("Unknown table", { status: 400 });

  const supabase = getAdminSupabase();
  if (!supabase) return new NextResponse("Supabase is not configured", { status: 503 });

  const { data, error } = await supabase
    .from(table)
    .select(def.columns.join(","))
    .order(def.order, { ascending: false })
    .limit(5000);
  if (error) return new NextResponse(error.message, { status: 500 });

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const lines = [
    def.columns.map(cell).join(","),
    ...rows.map((row) => def.columns.map((c) => cell(row[c])).join(",")),
  ];
  // BOM so Excel on Windows reads the UTF-8 (₱, ’, ²) correctly.
  const body = "﻿" + lines.join("\r\n") + "\r\n";
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="emc2-${table}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
