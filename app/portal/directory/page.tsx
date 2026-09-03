import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { getServerSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/rsc";

export const metadata: Metadata = {
  title: "The Directory",
  description: "Brods who have opted in to be found by the brotherhood.",
};

type Row = {
  id: string;
  full_name: string;
  nickname: string | null;
  batch: string | null;
  course: string | null;
  current_role: string | null;
  company: string | null;
  city: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  show_email: boolean;
  show_phone: boolean;
};

export default async function DirectoryPage() {
  if (!SUPABASE_AUTH_CONFIGURED) redirect("/portal");
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!user || !supabase) redirect("/portal");

  const { data } = await supabase
    .from("members")
    .select(
      "id, full_name, nickname, batch, course, current_role, company, city, contact_email, contact_phone, show_email, show_phone"
    )
    .in("visibility", ["brods", "public"])
    .order("full_name");

  const rows = (data ?? []) as Row[];

  return (
    <>
      <PageHero
        eyebrow="The Directory"
        title="The Brotherhood, Found"
        description={`${rows.length} brod${rows.length === 1 ? "" : "s"} listed. Everyone here chose to be found, and each member controls their own visibility from their Portal record.`}
      />

      <section className="py-24">
        <Container>
          {rows.length === 0 ? (
            <Reveal>
              <Card className="p-10 text-center">
                <p className="text-[var(--fg)]/70">
                  No brods have opted into the directory yet. Be the first —{" "}
                  <Link href="/portal" className="text-[var(--brand)] underline underline-offset-4">
                    set your visibility on your Portal record
                  </Link>
                  .
                </p>
              </Card>
            </Reveal>
          ) : (
            <div className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((m, i) => (
                <Reveal key={m.id} delay={Math.min(i, 12) * 0.03} className="h-full">
                  <div className="group flex h-full flex-col gap-3 bg-[var(--paper)] p-6 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--frat-gold)]/[0.04]">
                    <div>
                      <p className="font-sans text-[19px] font-bold text-[var(--fg)]">
                        {m.full_name}
                        {m.nickname ? (
                          <span className="ml-2 text-sm font-normal text-[var(--fg)]/60">
                            &ldquo;{m.nickname}&rdquo;
                          </span>
                        ) : null}
                      </p>
                      {m.batch ? (
                        <p className="mt-1 label">
                          Batch {m.batch}
                        </p>
                      ) : null}
                    </div>
                    {(m.current_role || m.company) && (
                      <p className="text-sm text-[var(--fg)]/70">
                        {[m.current_role, m.company].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {m.city ? <p className="text-xs text-[var(--fg)]/50">{m.city}</p> : null}
                    {(m.show_email && m.contact_email) || (m.show_phone && m.contact_phone) ? (
                      <div className="mt-auto space-y-1 border-t border-[var(--hairline)] pt-3 text-xs text-[var(--fg)]/60">
                        {m.show_email && m.contact_email ? <p>{m.contact_email}</p> : null}
                        {m.show_phone && m.contact_phone ? <p>{m.contact_phone}</p> : null}
                      </div>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
