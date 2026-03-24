"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

type FormState = {
  name: string;
  email: string;
  role: string;
  club: string;
  note: string;
};

const initial: FormState = {
  name: "",
  email: "",
  role: "",
  club: "",
  note: "",
};

export default function RequestAccessPage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // Phase 1: localStorage (Phase 2: Supabase + email)
    const payload = { ...form, lang, createdAt: new Date().toISOString() };
    const key = "ftbll_access_requests";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(payload);
    localStorage.setItem(key, JSON.stringify(existing));

    setSubmitted(true);
    setForm(initial);
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Background: same controlled spotlight */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_72%_35%,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <SiteHeader
          lang={lang}
          setLang={setLang}
        />

        <section className="pt-16 pb-28">
          <Link
            href="/explore"
            className="text-xs tracking-[0.2em] text-white/40 hover:text-white"
          >
            ← {t.explore}
          </Link>

          <div className="mt-14 grid lg:grid-cols-2 gap-16 items-start">
            {/* LEFT: editorial */}
            <div className="max-w-xl">
              <div className="text-xs tracking-[0.22em] text-white/45">
                REQUEST ACCESS
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl font-medium tracking-tight leading-[1.02]">
                {t.requestTitle}
              </h1>

              <p className="mt-7 text-lg text-white/65 leading-relaxed">
                {t.requestSubtitle}
              </p>

              <div className="mt-12 grid gap-10">
                <Mini
                  title="What happens next"
                  text="We review requests. If accepted, you’ll receive access and the expanded versions of the tools."
                />
                <Mini
                  title="What we need"
                  text="Name, email, role and club. Optional note helps us understand your context."
                />
                <Mini
                  title="No spam"
                  text="One purpose: access. Nothing else."
                />
              </div>
            </div>

            {/* RIGHT: paper form card */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(520px_440px_at_50%_45%,rgba(255,255,255,0.10),transparent_70%)]" />

              <div
                className={[
                  "relative rounded-2xl bg-[#f4f4f1] text-black",
                  "shadow-[0_40px_120px_rgba(0,0,0,0.65)]",
                  "p-10 md:p-12",
                  "border border-black/5",
                ].join(" ")}
              >
                {/* Inner highlight border (micro Apple detail) */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent hover:border-black/10 transition duration-300" />

                <div className="flex items-start justify-between gap-6 pb-8 border-b border-black/10">
                  <div>
                    <div className="text-xs tracking-[0.18em] text-black/55">
                      ACCESS REQUEST
                    </div>
                    <div className="mt-2 text-sm text-black/45">
                      Minimal details. Serious intent.
                    </div>
                  </div>
                  <div className="text-right text-xs tracking-[0.18em] text-black/40">
                    v0.1
                  </div>
                </div>

                <form onSubmit={submit} className="mt-10 space-y-6">
                  <Field label={t.fName}>
                    <Input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder={t.fNamePh}
                      required
                    />
                  </Field>

                  <Field label={t.fEmail}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder={t.fEmailPh}
                      required
                    />
                  </Field>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label={t.fRole}>
                      <Input
                        value={form.role}
                        onChange={(e) => update("role", e.target.value)}
                        placeholder={t.fRolePh}
                        required
                      />
                    </Field>

                    <Field label={t.fClub}>
                      <Input
                        value={form.club}
                        onChange={(e) => update("club", e.target.value)}
                        placeholder={t.fClubPh}
                      />
                    </Field>
                  </div>

                  <Field label={t.fNote}>
                    <Textarea
                      value={form.note}
                      onChange={(e) => update("note", e.target.value)}
                      placeholder={t.fNotePh}
                    />
                  </Field>

                  <div className="pt-2 flex items-center gap-4">
                    <Button className="bg-black text-white hover:bg-black/90">
                      {t.requestSubmit}
                    </Button>

                    <div className="text-sm text-black/45">
                      Stored for review.
                    </div>
                  </div>

                  {submitted && (
                    <div className="mt-6 rounded-xl bg-black/[0.04] p-5 border border-black/10">
                      <div className="text-sm text-black/80">
                        {t.submittedTitle}
                      </div>
                      <div className="mt-2 text-sm text-black/55">
                        {t.submittedBody}
                      </div>

                      <div className="mt-4">
                        <Button asChild className="bg-black text-white hover:bg-black/90">
                          <Link href="/explore">{t.explore}</Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 text-xs text-black/45 leading-relaxed">
                    Full access unlocks the expanded, club-specific versions of
                    Vision, Recruitment and Development tools.
                  </div>
                </form>
              </div>

              <div className="mt-6 text-xs text-white/35">
                Access is granted selectively.
              </div>
            </div>
          </div>

          <div className="mt-20 text-xs text-white/30">
            © {new Date().getFullYear()} Football Leadership
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs tracking-[0.18em] text-black/55">{label}</div>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-11 w-full rounded-xl border border-black/10 bg-white/70 px-4",
        "text-sm text-black/85 placeholder:text-black/35 outline-none",
        "focus:border-black/20 focus:bg-white",
      ].join(" ")}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={4}
      className={[
        "w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3",
        "text-sm text-black/85 placeholder:text-black/35 outline-none",
        "focus:border-black/20 focus:bg-white",
      ].join(" ")}
    />
  );
}

function Mini({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="text-xs tracking-[0.18em] text-white/45">{title}</div>
      <div className="mt-3 text-base text-white/70 leading-relaxed">{text}</div>
    </div>
  );
}