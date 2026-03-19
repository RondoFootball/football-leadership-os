"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function RecruitmentPage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  // Subtle lift on mount
  useEffect(() => {
    const el = document.getElementById("recruitment-document");
    if (!el) return;
    const id = setTimeout(() => {
      el.classList.remove("opacity-0", "translate-y-4");
    }, 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Background: single controlled spotlight */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_72%_35%,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8">
        <SiteHeader
          lang={lang}
          setLang={setLang}
          requestAccessLabel={t.requestAccess}
          brandLabel={t.brand}
        />

        <section className="pt-16 pb-28">
          <Link
            href="/explore"
            className="text-xs tracking-[0.2em] text-white/40 hover:text-white"
          >
            ← {t.explore}
          </Link>

          <div className="mt-14 grid lg:grid-cols-2 gap-16 items-start">
            {/* LEFT */}
            <div className="max-w-xl">
              <div className="text-xs tracking-[0.22em] text-white/45">
                RECRUITMENT
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl font-medium tracking-tight leading-[1.02]">
                Recruitment.
                <span className="block text-white/45">Made disciplined.</span>
              </h1>

              <p className="mt-7 text-lg text-white/65 leading-relaxed">
                Great scouting does not save a weak process.
                Recruitment needs constraints, ownership and timing.
              </p>

              <p className="mt-4 text-lg text-white/55 leading-relaxed">
                We take your current approach — lists, opinions, budgets —
                and upgrade it into a window system that protects decision quality.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/request-access">{t.requestAccess}</Link>
                </Button>

                <div className="text-sm text-white/45">
                  Coherent windows. No panic signings.
                </div>
              </div>

              <div className="mt-14 text-sm text-white/35">
                Process beats urgency.
              </div>

              <div className="mt-16 grid gap-10">
                <Mini
                  title="Input"
                  text="Your squad picture, scouting outputs, constraints, budget, timelines."
                />
                <Mini
                  title="Upgrade"
                  text="Profile logic, shortlists with evidence, mandate rules, risk thresholds."
                />
                <Mini
                  title="Output"
                  text="A window plan: roles, priorities, trade-offs, and decision rhythm."
                />
              </div>
            </div>

            {/* RIGHT: Document */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(520px_440px_at_50%_45%,rgba(255,255,255,0.10),transparent_70%)]" />

              <div
                id="recruitment-document"
                className="relative bg-[#f4f4f1] text-black rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.65)] p-12 md:p-14 transition-all duration-700 ease-out opacity-0 translate-y-4"
              >
                {/* Meta */}
                <div className="flex items-start justify-between gap-6 pb-7 border-b border-black/10">
                  <div>
                    <div className="text-xs tracking-[0.18em] text-black/55">
                      RECRUITMENT PLAN
                    </div>
                    <div className="mt-2 text-sm text-black/45">
                      Club: Example FC
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs tracking-[0.18em] text-black/45">
                      SUMMER WINDOW
                    </div>
                    <div className="mt-2 text-sm text-black/45">
                      Cycle: 2026–2029 · v0.9
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="mt-10 space-y-3">
                  <DocSection
                    number="01"
                    title="Squad Thesis"
                    body={
                      <>
                        Build positional depth for the playing model. Prioritise
                        <b className="font-medium text-black/85"> decision reliability </b>
                        over highlight potential. Every signing must strengthen
                        the squad architecture — not just the XI.
                      </>
                    }
                  />

                  <DocSection
                    number="02"
                    title="Priority Roles (Top 3)"
                    body={
                      <>
                        <span className="text-black/75">
                          1) Left 8 · 2) Right CB · 3) Wide forward
                        </span>
                        <br />
                        Each role has an agreed profile, budget band, and fallback plan.
                      </>
                    }
                  />

                  <DocSection
                    number="03"
                    title="Profile Constraints"
                    body={
                      <>
                        <b className="font-medium text-black/85">Model fit overrides reputation</b>.
                        Age curve aligns to cycle. Injury risk assessed structurally.
                        Psychological robustness is screened before ceiling projection.
                      </>
                    }
                  />

                  <DocSection
                    number="04"
                    title="Decision System"
                    body={
                      <>
                        Mandate is explicit:
                        <span className="text-black/70">
                          {" "}
                          Sporting Director owns final decision; Head Coach owns tactical fit;
                          Finance owns downside limits.
                        </span>
                        <br />
                        No decision without a stated trade-off and risk threshold.
                      </>
                    }
                  />

                  <DocSection
                    number="05"
                    title="Window Rhythm"
                    body={
                      <>
                        Weekly decision meeting. Two deadlines:
                        <span className="text-black/70">
                          {" "}
                          “commit date” and “walk-away date”.
                        </span>
                        <br />
                        No late-window escalation without pre-defined criteria.
                      </>
                    }
                  />
                </div>
              </div>

              <div className="mt-6 text-sm text-white/50 leading-relaxed">
                Full, expanded version becomes available{" "}
                <span className="text-white/75">in-product</span> after access —
                customised to your squad, model, and budget constraints.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DocSection({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div
      className={[
        "group grid grid-cols-6 gap-6 rounded-lg px-4 py-4 -mx-4",
        "transition-all duration-200 ease-out",
        "hover:bg-black/[0.04] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:scale-[1.01]",
      ].join(" ")}
    >
      <div className="col-span-1 text-3xl text-black/20 font-light transition-colors group-hover:text-black/35">
        {number}
      </div>

      <div className="col-span-5 border-l border-black/10 pl-6 transition-colors group-hover:border-black/20">
        <div className="text-xs tracking-[0.18em] text-black/55">{title}</div>
        <div className="mt-3 text-[15px] leading-relaxed text-black/80 max-w-2xl">
          {body}
        </div>
      </div>
    </div>
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