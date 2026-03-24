"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function VisionPage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  // Subtle lift on mount (not on scroll)
  useEffect(() => {
    const el = document.getElementById("vision-document");
    if (!el) return;
    const id = setTimeout(() => {
      el.classList.remove("opacity-0", "translate-y-4");
    }, 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Background: single controlled spotlight, no grid */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_72%_35%,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8">
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
            {/* LEFT: Editorial intro + product logic */}
            <div className="max-w-xl">
              <div className="text-xs tracking-[0.22em] text-white/45">
                VISION / STRATEGY
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl font-medium tracking-tight leading-[1.02]">
                Vision.
                <span className="block text-white/45">Made governable.</span>
              </h1>

              <p className="mt-7 text-lg text-white/65 leading-relaxed">
                We start with what you already think and already have — your
                current plan, your language, your constraints.
              </p>

              <p className="mt-4 text-lg text-white/55 leading-relaxed">
                Then we upgrade it into a decision system that holds when
                pressure peaks.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/request-access">{t.requestAccess}</Link>
                </Button>

                <div className="text-sm text-white/45">
                  No templates. Your reality — structured.
                </div>
              </div>

              <div className="mt-14 text-sm text-white/35">
                Coherence beats intensity.
              </div>

              {/* Strong “Input / Upgrade / Output” left side for balance */}
              <div className="mt-16 grid gap-10">
                <Mini
                  title="Input"
                  text="Your current plan, language, constraints, context."
                />
                <Mini
                  title="Upgrade"
                  text="Structure, governance, recruitment logic, measurable indicators."
                />
                <Mini title="Output" text="A board-ready vision system. Versioned." />
              </div>
            </div>

            {/* RIGHT: Document object */}
            <div className="relative">
              {/* micro spotlight behind paper (kept, but subtle) */}
              <div className="pointer-events-none absolute -inset-10 bg-[radial-gradient(520px_440px_at_50%_45%,rgba(255,255,255,0.10),transparent_70%)]" />

              <div
                id="vision-document"
                className="relative bg-[#f4f4f1] text-black rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.65)] p-12 md:p-14 transition-all duration-700 ease-out opacity-0 translate-y-4"
              >
                {/* Meta */}
                <div className="flex items-start justify-between gap-6 pb-7 border-b border-black/10">
                  <div>
                    <div className="text-xs tracking-[0.18em] text-black/55">
                      SPORTING VISION
                    </div>
                    <div className="mt-2 text-sm text-black/45">
                      Club: Example FC
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs tracking-[0.18em] text-black/45">
                      2026–2029
                    </div>
                    <div className="mt-2 text-sm text-black/45">Board v1.2</div>
                  </div>
                </div>

                {/* Body */}
                <div className="mt-10 space-y-3">
                  <DocSection
                    number="01"
                    title="Competitive Thesis"
                    body={
                      <>
                        Advantage compounds through{" "}
                        <b className="font-medium text-black/85">
                          identity stability
                        </b>{" "}
                        and{" "}
                        <b className="font-medium text-black/85">
                          decision alignment
                        </b>
                        . Constraints are defined ex-ante — to reduce variance
                        when pressure peaks.
                      </>
                    }
                  />

                  <DocSection
                    number="02"
                    title="Governance Architecture"
                    body={
                      <>
                        Mandates are explicit. Escalation logic is defined{" "}
                        <b className="font-medium text-black/85">ex-ante</b>.
                        <br />
                        <span className="text-black/70">
                          Head Coach: execution · Sporting Director: structural
                          integrity · Board: continuity & capital discipline.
                        </span>
                      </>
                    }
                  />

                  <DocSection
                    number="03"
                    title="Recruitment Constraints"
                    body={
                      <>
                        <b className="font-medium text-black/85">
                          Model fit overrides reputation
                        </b>
                        . Age curve aligns with cycle. Psychological robustness
                        is screened structurally. Every signing states its
                        trade-off.
                      </>
                    }
                  />

                  <DocSection
                    number="04"
                    title="Indicators (examples)"
                    body={
                      <>
                        Style consistency index · Model-fit ratio · Decision
                        alignment score · Execution variance vs expected model.
                      </>
                    }
                  />
                </div>
              </div>

              {/* Single availability note (only here) */}
              <div className="mt-6 text-sm text-white/50 leading-relaxed">
                Full, expanded version becomes available{" "}
                <span className="text-white/75">in-product</span> after access —
                customised to your club’s current materials.
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