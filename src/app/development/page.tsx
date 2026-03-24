"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function DevelopmentPage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);
  const isNl = lang === "nl";

  const backLabel = t.development.back;

  const eyebrow = isNl ? "DEVELOPMENT SYSTEM" : "DEVELOPMENT SYSTEM";

  const headlineA = isNl ? "Development." : "Development.";
  const headlineB = isNl ? "Gebouwd in ritme." : "Built into rhythm.";

  const intro = isNl
    ? "Ontwikkeling verliest waarde zodra focus generiek wordt, eigenaarschap vervaagt en opvolging uit beeld raakt."
    : "Development loses value when focus turns generic, ownership fades and follow-through disappears.";

  const sub = isNl
    ? "Deze omgeving vertaalt observatie, rolcontext en stafinput naar plannen en assessments die scherp genoeg zijn om gedrag te veranderen."
    : "This environment turns observation, role context and staff input into plans and assessments sharp enough to change behaviour.";

  const microProof = isNl
    ? ["ROLGEBONDEN", "GESTRUCTUREERD", "IN RITME"]
    : ["ROLE-BASED", "STRUCTURED", "RHYTHM-BUILT"];

  const primaryCta = isNl ? "Maak je plan" : "Create your plan";

  const systemCards = isNl
    ? [
        {
          title: "Input",
          text: "Observaties, roleisen, wedstrijdcontext, trainingscontext, stafinput en bewijs.",
        },
        {
          title: "Structuur",
          text: "Scherpe focus, zichtbaar eigenaarschap, vast reviewritme en rolgebonden output.",
        },
        {
          title: "Output",
          text: "Plannen en assessments die niet blijven hangen in gesprek, maar richting geven aan uitvoering.",
        },
      ]
    : [
        {
          title: "Input",
          text: "Observations, role demands, match context, training context, staff input and evidence.",
        },
        {
          title: "Structure",
          text: "Sharp focus, visible ownership, fixed review rhythm and role-based output.",
        },
        {
          title: "Output",
          text: "Plans and assessments that do not stay in conversation, but shape execution.",
        },
      ];

  const featuredTool = isNl
    ? {
        kicker: "LIVE TOOL",
        title: "Player Development Plan Builder",
        desc: "Bouw individuele ontwikkelplannen vanuit observatie, wedstrijdcontext en verantwoordelijkheid.",
        href: "/development/player-development-plan",
        cta: "Open builder",
        lines: [
          "Chat-gestuurde aanscherping",
          "Rolbewuste planstructuur",
          "Player + staff PDF output",
        ],
      }
    : {
        kicker: "LIVE TOOL",
        title: "Player Development Plan Builder",
        desc: "Build individual development plans from observation, match context and responsibility.",
        href: "/development/player-development-plan",
        cta: "Open builder",
        lines: [
          "Chat-led sharpness",
          "Role-aware plan structure",
          "Player + staff PDF output",
        ],
      };

  const nextTool = isNl
    ? {
        kicker: "NEXT",
        title: "Development Assessments",
        desc: "Rolgebonden assessment snapshots met bewijs, focuskeuze en evaluatieritme.",
        href: "/request-access",
        cta: "Vraag toegang aan",
        lines: [
          "Assessmentlogica",
          "Besluitwaardige snapshots",
          "Eerst bewijs, dan conclusie",
        ],
      }
    : {
        kicker: "NEXT",
        title: "Development Assessments",
        desc: "Role-based assessment snapshots with evidence, focus selection and review rhythm.",
        href: "/request-access",
        cta: "Request access",
        lines: [
          "Assessment logic",
          "Decision-grade snapshots",
          "Evidence before conclusion",
        ],
      };

  const sectionLabel = isNl ? "TOOLS IN DEVELOPMENT" : "TOOLS IN DEVELOPMENT";
  const sectionIntro = isNl
    ? "Development draait hier niet om losse formulieren, maar om systemen die observatie naar opvolging brengen."
    : "Development here is not built around isolated forms, but around systems that carry observation into follow-through.";

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_620px_at_72%_16%,rgba(60,255,170,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(720px_520px_at_16%_26%,rgba(255,255,255,0.045),transparent_62%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SiteHeader lang={lang} setLang={setLang} />

        <section className="pb-24 pt-6 md:pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-white/40 transition hover:text-white/70"
          >
            <span aria-hidden="true">←</span>
            <span>{backLabel}</span>
          </Link>

          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="text-[11px] tracking-[0.24em] text-white/34">
                {eyebrow}
              </div>

              <h1 className="mt-6 text-[44px] font-medium leading-[0.9] tracking-[-0.03em] sm:text-[60px] md:text-[76px] lg:text-[84px]">
                {headlineA}
                <span className="block text-white/48">{headlineB}</span>
              </h1>

              <p className="mt-7 max-w-[34ch] text-[16px] leading-relaxed text-white/62 sm:text-[18px] md:text-[19px]">
                {intro}
              </p>

              <p className="mt-4 max-w-[36ch] text-[16px] leading-relaxed text-white/52 sm:text-[18px] md:text-[19px]">
                {sub}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[9px] tracking-[0.18em] text-white/34">
                {microProof.map((item, index) => (
                  <span key={item} className="inline-flex items-center gap-5">
                    <span>{item}</span>
                    {index < microProof.length - 1 ? (
                      <span className="h-[1px] w-4 bg-white/14" />
                    ) : null}
                  </span>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-black hover:bg-white/90"
                >
                  <Link href="/development/player-development-plan">
                    {primaryCta}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="lg:pl-2">
              <DevelopmentShowcase lang={lang} />
            </div>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {systemCards.map((card) => (
              <SystemCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>

          <div className="mt-24">
            <div className="text-[11px] tracking-[0.22em] text-white/42">
              {sectionLabel}
            </div>

            <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-white/56">
              {sectionIntro}
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
              <ToolCard
                kicker={featuredTool.kicker}
                title={featuredTool.title}
                desc={featuredTool.desc}
                href={featuredTool.href}
                cta={featuredTool.cta}
                lines={featuredTool.lines}
                featured
              />

              <ToolCard
                kicker={nextTool.kicker}
                title={nextTool.title}
                desc={nextTool.desc}
                href={nextTool.href}
                cta={nextTool.cta}
                lines={nextTool.lines}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DevelopmentShowcase({
  lang,
}: {
  lang: "en" | "de" | "es" | "fr" | "it" | "nl";
}) {
  const isNl = lang === "nl";

  const chips = isNl
    ? ["OBSERVATIE", "RITME", "OUTPUT"]
    : ["OBSERVATION", "RHYTHM", "OUTPUT"];

  const label = isNl
    ? "DEVELOPMENT — LIVE OUTPUT"
    : "DEVELOPMENT — LIVE OUTPUT";

  const copy = isNl
    ? "Plannen en assessments die in vorm én inhoud laten voelen dat ze gebouwd zijn voor gebruik, niet voor opslag."
    : "Plans and assessments that feel built for use, not storage — in both form and substance.";

  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <div className="absolute left-[16%] top-[8%] h-52 w-52 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="absolute bottom-[8%] right-[12%] h-56 w-56 rounded-full bg-white/6 blur-3xl" />

      <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[760px]">
        <div className="pointer-events-none absolute inset-x-[4%] top-[6%] bottom-[8%] rounded-[44px] border border-white/7 bg-white/[0.015]" />
        <div className="pointer-events-none absolute inset-x-[4%] top-[6%] bottom-[8%] rounded-[44px] bg-[radial-gradient(72%_72%_at_68%_18%,rgba(35,211,120,0.09),transparent_62%)]" />

        <div className="absolute left-6 top-6 z-20 flex flex-wrap items-center gap-2 sm:left-8 sm:top-8">
          {chips.map((chip, index) => (
            <span
              key={chip}
              className={[
                "rounded-full px-3 py-1 text-[10px] tracking-[0.18em] backdrop-blur-md",
                index === 1
                  ? "border border-emerald-300/20 bg-emerald-300/12 text-white"
                  : "border border-white/12 bg-black/25 text-white/72",
              ].join(" ")}
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="hidden lg:block absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute z-10 translate-x-[-19%] translate-y-[4%] scale-[0.82] opacity-38 grayscale">
              <div className="overflow-hidden rounded-[30px] ring-1 ring-white/6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <Image
                  src="/hero/pdp-cover-v2.png"
                  alt="Development cover preview"
                  width={860}
                  height={1146}
                  className="h-auto w-[320px] xl:w-[360px] rounded-[30px]"
                  sizes="(min-width: 1280px) 360px, 320px"
                />
                <div className="absolute inset-0 bg-black/42" />
              </div>
            </div>

            <div className="absolute z-30">
              <div className="overflow-hidden rounded-[30px] ring-1 ring-white/12 shadow-[0_45px_120px_rgba(0,0,0,0.62)]">
                <Image
                  src="/hero/pdp-focus-v2.png"
                  alt="Development focus preview"
                  width={860}
                  height={1146}
                  className="h-auto w-[350px] xl:w-[400px] rounded-[30px]"
                  sizes="(min-width: 1280px) 400px, 350px"
                />
                <div className="absolute inset-0 bg-black/6" />
              </div>
            </div>

            <div className="absolute z-10 translate-x-[19%] translate-y-[4%] scale-[0.82] opacity-38 grayscale">
              <div className="overflow-hidden rounded-[30px] ring-1 ring-white/6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <Image
                  src="/hero/pdp-detail-v2.png"
                  alt="Development detail preview"
                  width={860}
                  height={1146}
                  className="h-auto w-[320px] xl:w-[360px] rounded-[30px]"
                  sizes="(min-width: 1280px) 360px, 320px"
                />
                <div className="absolute inset-0 bg-black/42" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden absolute inset-0 flex items-center justify-center px-6 pb-28 pt-20 sm:px-10">
          <div className="overflow-hidden rounded-[28px] ring-1 ring-white/8 shadow-[0_32px_90px_rgba(0,0,0,0.5)]">
            <Image
              src="/hero/pdp-focus-v2.png"
              alt="Development focus preview"
              width={860}
              height={1146}
              className="h-auto w-full max-w-[460px] rounded-[28px]"
              sizes="90vw"
            />
            <div className="absolute inset-0 bg-black/8" />
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20 sm:bottom-8 sm:left-8">
          <div className="text-[10px] tracking-[0.18em] text-white/48">{label}</div>
          <p className="mt-3 max-w-[28rem] text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
            {copy}
          </p>
        </div>
      </div>
    </div>
  );
}

function SystemCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 sm:p-7">
      <div className="text-[11px] tracking-[0.18em] text-white/38">{title}</div>
      <div className="mt-4 text-[16px] leading-relaxed text-white/70">{text}</div>
    </div>
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
        "group relative overflow-hidden rounded-[32px] border p-7 md:p-8 transition-all duration-300 ease-out",
        featured
          ? "border-white/14 bg-white/[0.05] hover:-translate-y-0.5 hover:bg-white/[0.07]"
          : "border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-transparent transition duration-300 group-hover:border-white/15" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="text-[11px] tracking-[0.18em] text-white/40">{kicker}</div>
        {featured ? (
          <div className="rounded-full border border-emerald-300/18 bg-emerald-300/10 px-3 py-1 text-[10px] tracking-[0.18em] text-white/78">
            LIVE
          </div>
        ) : null}
      </div>

      <div className="relative mt-6 text-[28px] font-medium tracking-tight text-white/92">
        {title}
      </div>

      <p className="relative mt-4 max-w-[44ch] text-[15px] leading-relaxed text-white/60">
        {desc}
      </p>

      <div className="relative mt-8 space-y-2.5">
        {lines.map((line) => (
          <div key={line} className="flex items-center gap-3 text-sm text-white/55">
            <span className="h-[1px] w-4 bg-white/20" />
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-10 text-sm text-white/72 transition group-hover:text-white">
        {cta}
      </div>
    </Link>
  );
}