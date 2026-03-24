"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function DevelopmentPage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  const backLabel = t.development.back;
  const eyebrow = "DEVELOPMENT";
  const titleLineA = t.development.titleA;
  const titleLineB =
    lang === "nl" ? "Gebouwd in ritme." : "Built into rhythm.";
  const introA =
    lang === "nl"
      ? "Ontwikkeling faalt zodra het generiek, instabiel of eigenaarloos wordt."
      : "Development fails when it stays generic, unstable or ownerless.";
  const introB =
    lang === "nl"
      ? "Deze omgeving vertaalt observatie, rolcontext en stafinput naar gestructureerde tools die meetbare gedragsverandering moeten dragen."
      : "This environment turns observation, role context and staff input into structured tools that create measurable behaviour change.";
  const openBuilder =
    lang === "nl"
      ? "Open Player Development Plan Builder"
      : "Open Player Development Plan Builder";
  const firstLiveTool =
    lang === "nl"
      ? "Eerste live tool binnen Development"
      : "First live tool inside Development";

  const inputTitle = lang === "nl" ? "Input" : "Input";
  const inputText =
    lang === "nl"
      ? "Observaties, roleisen, wedstrijd- en trainingscontext, stafinput en bewijs."
      : "Observations, role demands, match/training context, staff feedback and evidence.";
  const structureTitle = lang === "nl" ? "Structuur" : "Structure";
  const structureText =
    lang === "nl"
      ? "Scherpere focus, zichtbaar eigenaarschap, vast reviewritme en rolgebonden output."
      : "Sharper focus, visible ownership, fixed review rhythm and role-based output.";
  const outputTitle = lang === "nl" ? "Output" : "Output";
  const outputText =
    lang === "nl"
      ? "Concrete ontwikkeltools die van gesprek naar uitvoerbaar plan gaan."
      : "Concrete development tools that move from conversation to operational plan.";

  const liveTool = lang === "nl" ? "LIVE TOOL" : "LIVE TOOL";
  const liveToolDesc =
    lang === "nl"
      ? "Bouw individuele ontwikkelplannen vanuit observatie, wedstrijdcontext en verantwoordelijkheid."
      : "Build individual development plans from observation, match context and responsibility.";
  const openBuilderCta = lang === "nl" ? "Open builder" : "Open builder";

  const nextLabel = lang === "nl" ? "NEXT" : "NEXT";
  const nextTitle =
    lang === "nl" ? "Development Assessments" : "Development Assessments";
  const nextDesc =
    lang === "nl"
      ? "Rolgebonden assessment snapshots met bewijs, focuskeuze en evaluatieritme."
      : "Role-based assessment snapshots with evidence, focus selection and review rhythm.";
  const requestAccess = t.requestAccess;

  const liveLines =
    lang === "nl"
      ? [
          "Chat-gestuurde aanscherping",
          "Rolbewuste planstructuur",
          "Player + staff PDF output",
        ]
      : [
          "Chat-led sharpness",
          "Role-aware plan structure",
          "Player + staff PDF output",
        ];

  const nextLines =
    lang === "nl"
      ? [
          "Assessmentlogica",
          "Besluitwaardige snapshots",
          "Eerst bewijs, dan conclusie",
        ]
      : [
          "Assessment logic",
          "Decision-grade snapshots",
          "Evidence before conclusion",
        ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_72%_35%,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8">
        <SiteHeader
          lang={lang}
          setLang={setLang}
        />

        <section className="pt-16 pb-24">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] text-white/40 hover:text-white"
          >
            {backLabel}
          </Link>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="max-w-xl">
              <div className="text-xs tracking-[0.22em] text-white/45">
                {eyebrow}
              </div>

              <h1 className="mt-6 text-5xl md:text-6xl font-medium tracking-tight leading-[1.02]">
                {titleLineA}
                <span className="block text-white/45">{titleLineB}</span>
              </h1>

              <p className="mt-7 text-lg text-white/65 leading-relaxed">
                {introA}
              </p>

              <p className="mt-4 text-lg text-white/55 leading-relaxed">
                {introB}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/development/player-development-plan">
                    {openBuilder}
                  </Link>
                </Button>

                <div className="text-sm text-white/45">{firstLiveTool}</div>
              </div>

              <div className="mt-14 grid gap-6">
                <Mini title={inputTitle} text={inputText} />
                <Mini title={structureTitle} text={structureText} />
                <Mini title={outputTitle} text={outputText} />
              </div>
            </div>

            <div className="grid gap-6">
              <ToolCard
                kicker={liveTool}
                title="Player Development Plan Builder"
                desc={liveToolDesc}
                href="/development/player-development-plan"
                cta={openBuilderCta}
                lines={liveLines}
                featured
              />

              <ToolCard
                kicker={nextLabel}
                title={nextTitle}
                desc={nextDesc}
                href="/request-access"
                cta={requestAccess}
                lines={nextLines}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ToolCard({
  kicker,
  title,
  desc,
  href,
  cta,
  lines,
  featured = false,
}: {
  kicker: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  lines: string[];
  featured?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "group relative overflow-hidden rounded-3xl border p-7 md:p-8 transition-all duration-300 ease-out",
        featured
          ? "border-white/14 bg-white/[0.05] hover:bg-white/[0.07]"
          : "border-white/10 bg-white/[0.025] hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-white/15 transition duration-300" />

      <div className="text-xs tracking-[0.18em] text-white/40">{kicker}</div>

      <div className="mt-5 text-[24px] font-medium tracking-tight text-white/92">
        {title}
      </div>

      <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-white/60">
        {desc}
      </p>

      <div className="mt-8 space-y-2">
        {lines.map((line) => (
          <div key={line} className="flex items-center gap-2 text-sm text-white/55">
            <span className="h-[1px] w-4 bg-white/20" />
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-white/70 group-hover:text-white transition">
        {cta}
      </div>
    </Link>
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