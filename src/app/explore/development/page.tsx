"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function DevelopmentPage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  // Subtle lift on mount
  useEffect(() => {
    const el = document.getElementById("development-document");
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
                DEVELOPMENT / ASSESSMENTS
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl font-medium tracking-tight leading-[1.02]">
                Development.
                <span className="block text-white/45">Made measurable.</span>
              </h1>

              <p className="mt-7 text-lg text-white/65 leading-relaxed">
                Development fails when it becomes intention.
                Elite environments make progress visible — and owned.
              </p>

              <p className="mt-4 text-lg text-white/55 leading-relaxed">
                We take your current observations, reviews and performance data —
                and upgrade them into role-based assessments and development plans
                with rhythm, ownership and follow-through.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/request-access">{t.requestAccess}</Link>
                </Button>

                <div className="text-sm text-white/45">
                  Less theatre. More change.
                </div>
              </div>

              <div className="mt-14 text-sm text-white/35">
                Progress is a system.
              </div>

              <div className="mt-16 grid gap-10">
                <Mini
                  title="Input"
                  text="Observations, role demands, match/training data, staff feedback, context."
                />
                <Mini
                  title="Upgrade"
                  text="Assessment logic, focus selection, evidence standards, cadence & ownership."
                />
                <Mini
                  title="Output"
                  text="A development plan with measurable behaviours — reviewed on a fixed rhythm."
                />
              </div>
            </div>

            {/* RIGHT: Document */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(520px_440px_at_50%_45%,rgba(255,255,255,0.10),transparent_70%)]" />

              <div
                id="development-document"
                className="relative bg-[#f4f4f1] text-black rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.65)] p-12 md:p-14 transition-all duration-700 ease-out opacity-0 translate-y-4"
              >
                {/* Meta */}
                <div className="flex items-start justify-between gap-6 pb-7 border-b border-black/10">
                  <div>
                    <div className="text-xs tracking-[0.18em] text-black/55">
                      ASSESSMENT + DEVELOPMENT PLAN
                    </div>
                    <div className="mt-2 text-sm text-black/45">
                      Subject: Head Coach (example)
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs tracking-[0.18em] text-black/45">
                      CYCLE: 12 WEEKS
                    </div>
                    <div className="mt-2 text-sm text-black/45">Review v0.6</div>
                  </div>
                </div>

                {/* Body */}
                <div className="mt-10 space-y-3">
                  <DocSection
                    number="01"
                    title="Role Standard"
                    body={
                      <>
                        Defines the non-negotiables for the role in this club:
                        decision rhythm, clarity of model, staff alignment and
                        behavioural leadership.
                      </>
                    }
                  />

                  <DocSection
                    number="02"
                    title="Assessment Snapshot"
                    body={
                      <>
                        <span className="text-black/75">
                          Model clarity: 8.2 · Staff alignment: 6.4 · Decision cadence: 7.1 · Pressure behaviour: 6.8
                        </span>
                        <br />
                        Evidence is required: observed moments, patterns, and examples —
                        not impressions.
                      </>
                    }
                  />

                  <DocSection
                    number="03"
                    title="Priority Focus (1–2 only)"
                    body={
                      <>
                        <b className="font-medium text-black/85">
                          Alignment between staff and board-facing language
                        </b>
                        . Reduce mixed messaging by defining one shared narrative
                        and one weekly decision checkpoint.
                      </>
                    }
                  />

                  <DocSection
                    number="04"
                    title="Plan (12-week)"
                    body={
                      <>
                        Weekly: staff alignment meeting (30 min).  
                        Bi-weekly: decision review (pressure moments).  
                        Month-end: leadership feedback loop.
                        <br />
                        Every action links to a measurable behaviour.
                      </>
                    }
                  />

                  <DocSection
                    number="05"
                    title="Ownership & Review"
                    body={
                      <>
                        Owner: Sporting Director.  
                        Partner: CEO / Board liaison.  
                        Review cadence: Week 4 / 8 / 12.
                        <br />
                        No review without evidence — and a decision.
                      </>
                    }
                  />
                </div>
              </div>

              <div className="mt-6 text-sm text-white/50 leading-relaxed">
                Full, expanded version becomes available{" "}
                <span className="text-white/75">in-product</span> after access —
                customised to your roles, staff structure and performance context.
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