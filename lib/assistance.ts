import { getAdminSupabase } from "@/lib/supabase/server";

export type AssistanceTotals = {
  raised: number;
  disbursed: number;
  balance: number;
  brodsAssisted: number;
  entries: number;
};

export type LedgerEntry = {
  entry_date: string;
  direction: "raised" | "disbursed";
  amount: number;
  note: string | null;
  beneficiaries: number;
};

const EMPTY: AssistanceTotals = {
  raised: 0,
  disbursed: 0,
  balance: 0,
  brodsAssisted: 0,
  entries: 0,
};

/* The public ledger. PLAN.md §3: raised, disbursed, balance, brods assisted,
   and never a name on either side — the table has no column for one.
   Returning zeros when the fund has not been endowed yet is the honest
   answer, and the page says so in words rather than showing a hopeful bar. */
export async function getAssistanceTotals(): Promise<AssistanceTotals> {
  const supabase = getAdminSupabase();
  if (!supabase) return EMPTY;
  const { data, error } = await supabase.from("assistance_totals").select("*").maybeSingle();
  if (error || !data) return EMPTY;
  return {
    raised: Number(data.raised ?? 0),
    disbursed: Number(data.disbursed ?? 0),
    balance: Number(data.balance ?? 0),
    brodsAssisted: Number(data.brods_assisted ?? 0),
    entries: Number(data.entries ?? 0),
  };
}

/** Individual entries, newest first. Impersonal by construction. */
export async function getLedgerEntries(limit = 40): Promise<LedgerEntry[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("assistance_ledger")
    .select("entry_date,direction,amount,note,beneficiaries")
    .order("entry_date", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map((r) => ({ ...r, amount: Number(r.amount) })) as LedgerEntry[];
}

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(n);
