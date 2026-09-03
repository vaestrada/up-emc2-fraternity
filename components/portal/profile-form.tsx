"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase } from "@/lib/supabase/client";

export type MemberProfile = {
  id: string;
  full_name: string;
  nickname: string | null;
  batch: string | null;
  course: string | null;
  current_role: string | null;
  company: string | null;
  city: string | null;
  bio: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  show_email: boolean;
  show_phone: boolean;
  visibility: "private" | "brods" | "public";
};

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/60 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--ink)]";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80";

export function ProfileForm({ userId, profile }: { userId: string; profile: MemberProfile | null }) {
  const router = useRouter();
  const [form, setForm] = useState<Omit<MemberProfile, "id">>({
    full_name: profile?.full_name ?? "",
    nickname: profile?.nickname ?? "",
    batch: profile?.batch ?? "",
    course: profile?.course ?? "",
    current_role: profile?.current_role ?? "",
    company: profile?.company ?? "",
    city: profile?.city ?? "",
    bio: profile?.bio ?? "",
    contact_email: profile?.contact_email ?? "",
    contact_phone: profile?.contact_phone ?? "",
    show_email: profile?.show_email ?? false,
    show_phone: profile?.show_phone ?? false,
    visibility: profile?.visibility ?? "private",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function field<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;

    if (!form.full_name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }

    setStatus("saving");
    setErrorMessage("");

    const { error } = await supabase.from("members").upsert({
      id: userId,
      full_name: form.full_name.trim(),
      nickname: form.nickname?.trim() || null,
      batch: form.batch?.trim() || null,
      course: form.course?.trim() || null,
      current_role: form.current_role?.trim() || null,
      company: form.company?.trim() || null,
      city: form.city?.trim() || null,
      bio: form.bio?.trim() || null,
      contact_email: form.contact_email?.trim() || null,
      contact_phone: form.contact_phone?.trim() || null,
      show_email: form.show_email,
      show_phone: form.show_phone,
      visibility: form.visibility,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("saved");
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/portal");
    router.refresh();
  }

  return (
    <Card className="p-8 md:p-10">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-name" className={labelClass}>
              Full name
            </label>
            <input
              id="p-name"
              required
              maxLength={120}
              value={form.full_name}
              onChange={(e) => field("full_name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="p-nickname" className={labelClass}>
              Nickname
            </label>
            <input
              id="p-nickname"
              maxLength={60}
              value={form.nickname ?? ""}
              onChange={(e) => field("nickname", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-batch" className={labelClass}>
              Batch <span className="font-normal text-[var(--frat-cream)]/50">(e.g. &rsquo;84-F)</span>
            </label>
            <input
              id="p-batch"
              maxLength={40}
              placeholder="&rsquo;84-F"
              value={form.batch ?? ""}
              onChange={(e) => field("batch", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="p-course" className={labelClass}>
              Course
            </label>
            <input
              id="p-course"
              maxLength={80}
              placeholder="BS Civil Engineering"
              value={form.course ?? ""}
              onChange={(e) => field("course", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-role" className={labelClass}>
              Current role
            </label>
            <input
              id="p-role"
              maxLength={120}
              placeholder="Structural Engineer"
              value={form.current_role ?? ""}
              onChange={(e) => field("current_role", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="p-company" className={labelClass}>
              Company
            </label>
            <input
              id="p-company"
              maxLength={120}
              value={form.company ?? ""}
              onChange={(e) => field("company", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="p-city" className={labelClass}>
            City / area <span className="font-normal text-[var(--frat-cream)]/50">(general — not a full address)</span>
          </label>
          <input
            id="p-city"
            maxLength={80}
            placeholder="Quezon City"
            value={form.city ?? ""}
            onChange={(e) => field("city", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="p-bio" className={labelClass}>
            About <span className="font-normal text-[var(--frat-cream)]/50">(optional)</span>
          </label>
          <textarea
            id="p-bio"
            rows={3}
            maxLength={600}
            placeholder="A line or two for the brotherhood"
            value={form.bio ?? ""}
            onChange={(e) => field("bio", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="border-t border-[var(--hairline)] pt-6">
          <p className="label">
            Portal-only contact
          </p>
          <p className="mt-2 text-xs text-[var(--frat-cream)]/50">
            Separate from your sign-in email. Shown to other members only if you turn on the toggle
            beside it — off by default.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="p-contact-email" className={labelClass}>
                Contact email
              </label>
              <input
                id="p-contact-email"
                type="email"
                maxLength={254}
                value={form.contact_email ?? ""}
                onChange={(e) => field("contact_email", e.target.value)}
                className={inputClass}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-[var(--frat-cream)]/70">
                <input
                  type="checkbox"
                  checked={form.show_email}
                  onChange={(e) => field("show_email", e.target.checked)}
                  className="h-4 w-4 accent-[var(--frat-gold)]"
                />
                Show this to other signed-in brods
              </label>
            </div>
            <div>
              <label htmlFor="p-contact-phone" className={labelClass}>
                Contact phone
              </label>
              <input
                id="p-contact-phone"
                type="tel"
                maxLength={40}
                value={form.contact_phone ?? ""}
                onChange={(e) => field("contact_phone", e.target.value)}
                className={inputClass}
              />
              <label className="mt-2 flex items-center gap-2 text-xs text-[var(--frat-cream)]/70">
                <input
                  type="checkbox"
                  checked={form.show_phone}
                  onChange={(e) => field("show_phone", e.target.checked)}
                  className="h-4 w-4 accent-[var(--frat-gold)]"
                />
                Show this to other signed-in brods
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--hairline)] pt-6">
          <label htmlFor="p-visibility" className={labelClass}>
            Directory visibility
          </label>
          <select
            id="p-visibility"
            value={form.visibility}
            onChange={(e) => field("visibility", e.target.value as MemberProfile["visibility"])}
            className={inputClass}
          >
            <option value="private">Private — only I can see my profile</option>
            <option value="brods">Brods only — visible to signed-in members</option>
            <option value="public">Public — also visible to visitors on the site</option>
          </select>
          <p className="mt-2 text-xs text-[var(--frat-cream)]/50">
            Default is private. Your portal-only contact details stay hidden either way unless you
            also turn on the toggles above.
          </p>
        </div>

        {status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        ) : null}
        <AnimatePresence>
          {status === "saved" ? (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 text-sm text-[var(--frat-gold-light)]"
            >
              <motion.span
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
              </motion.span>
              Saved.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-4 border-t border-[var(--hairline)] pt-6">
          <Button type="submit" variant="accent" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save Profile"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </form>
    </Card>
  );
}
