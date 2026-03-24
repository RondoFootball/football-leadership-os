"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoMarquee } from "@/components/LogoMarquee";
import { SiteHeader } from "@/components/SiteHeader";
import { useLang } from "@/lib/useLang";

type HeroSlide = {
  src: string;
  alt: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/hero/pdp-cover-v2.png",
    alt: "Development plan cover preview",
  },
  {
    src: "/hero/pdp-focus-v2.png",
    alt: "Development plan focus preview",
  },
  {
    src: "/hero/pdp-detail-v2.png",
    alt: "Development plan detail preview",
  },
];

export default function Home() {
  const { lang, setLang } = useLang("en");

  const isNl = lang === "nl";

  const logos = [
    { src: "/logos/club1.png", alt: "Club 1" },
    { src: "/logos/club2.png", alt: "Club 2" },
    { src: "/logos/club3.png", alt: "Club 3" },
    { src: "/logos/club4.png", alt: "Club 4" },
    { src: "/logos/club5.png", alt: "Club 5" },
    { src: "/logos/club6.png", alt: "Club 6" },
    { src: "/logos/club7.png", alt: "Club 7" },
    { src: "/logos/club8.png", alt: "Club 8" },
    { src: "/logos/club9.png", alt: "Club 9" },
    { src: "/logos/club10.png", alt: "Club 10" },
    { src: "/logos/club11.png", alt: "Club 11" },
    { src: "/logos/club12.png", alt: "Club 12" },
    { src: "/logos/club13.png", alt: "Club 13" },
    { src: "/logos/club14.png", alt: "Club 14" },
    { src: "/logos/club15.png", alt: "Club 15" },
    { src: "/logos/club16.png", alt: "Club 16" },
    { src: "/logos/club17.png", alt: "Club 17" },
    { src: "/logos/club18.png", alt: "Club 18" },
    { src: "/logos/club19.png", alt: "Club 19" },
    { src: "/logos/club20.png", alt: "Club 20" },
    { src: "/logos/club21.png", alt: "Club 21" },
    { src: "/logos/club22.png", alt: "Club 22" },
    { src: "/logos/club23.png", alt: "Club 23" },
    { src: "/logos/club24.png", alt: "Club 24" },
    { src: "/logos/club25.png", alt: "Club 25" },
    { src: "/logos/club26.png", alt: "Club 26" },
    { src: "/logos/club27.png", alt: "Club 27" },
    { src: "/logos/club28.png", alt: "Club 28", scale: 0.8 },
    { src: "/logos/club29.png", alt: "Club 29" },
    { src: "/logos/club30.png", alt: "Club 30" },
    { src: "/logos/club31.png", alt: "Club 31" },
  ];

  const headlineA = isNl ? "Plannen." : "Plans.";
  const headlineB = isNl ? "Uitgevoerd." : "Executed.";

  const sub = isNl
    ? "Van jouw context naar een uitgewerkt plan - in minuten."
    : "Built from your context into a structured plan - in minutes.";

  const microProof = isNl
    ? ["ROLGEBONDEN", "GESTRUCTUREERD", "KLAAR VOOR GEBRUIK"]
    : ["ROLE-BASED", "STRUCTURED", "EXECUTION-READY"];

  const heroEyebrow = isNl
    ? "PLATFORM VOOR PROFCLUBS"
    : "PLATFORM FOR PROFESSIONAL CLUBS";

  const primaryCta = isNl ? "Maak je plan" : "Create your plan";

  const tracksTitle = isNl
    ? "Drie omgevingen."
    : "Three core environments.";

  const selectedClubsLabel = isNl
    ? "GESELECTEERDE CLUBS (PRIVATE BETA)"
    : "SELECTED CLUBS (PRIVATE BETA)";

  const bottomLine = isNl
    ? "Gebouwd voor clubs die standaard serieus nemen."
    : "Built for clubs that take standards seriously.";

  const copyrightLabel = `© ${new Date().getFullYear()} Football Leadership`;

  const tracks = isNl
    ? [
        {
          href: "/vision",
          n: "01",
          title: "Visie & Strategie",
          desc: "Richting bepalen. Koers houden onder druk.",
          meta: "VISION SYSTEM",
          cta: "Open omgeving",
        },
        {
          href: "/recruitment",
          n: "02",
          title: "Recruitment",
          desc: "Windows plannen. Profielen aanscherpen. Rust brengen in keuzes.",
          meta: "RECRUITMENT SYSTEM",
          cta: "Open omgeving",
        },
        {
          href: "/development",
          n: "03",
          title: "Ontwikkeling & Assessments",
          desc: "Ontwikkelplannen bouwen. Assessments onderbouwen. Verandering volgen.",
          meta: "DEVELOPMENT SYSTEM",
          cta: "Open omgeving",
        },
      ]
    : [
        {
          href: "/vision",
          n: "01",
          title: "Vision & Strategy",
          desc: "Set direction. Keep course under pressure.",
          meta: "VISION SYSTEM",
          cta: "Open environment",
        },
        {
          href: "/recruitment",
          n: "02",
          title: "Recruitment",
          desc: "Plan windows. Sharpen profiles. Bring calm to decisions.",
          meta: "RECRUITMENT SYSTEM",
          cta: "Open environment",
        },
        {
          href: "/development",
          n: "03",
          title: "Development & Assessments",
          desc: "Build development plans. Ground assessments. Track change.",
          meta: "DEVELOPMENT SYSTEM",
          cta: "Open environment",
        },
      ];

  const whatYouGetTitle = isNl ? "WAT JE KRIJGT" : "WHAT YOU GET";

  const whatYouGetItems = isNl
    ? [
        "Richting zonder ruis",
        "Recruitment met eigenaarschap",
        "Assessments en plannen die blijven hangen",
        "Minimal interface. Serieuze standaard.",
      ]
    : [
        "Direction without noise",
        "Recruitment with ownership",
        "Assessments and plans that stick",
        "Minimal interface. Serious standard.",
      ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#040404]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_620px_at_70%_16%,rgba(60,255,170,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_20%_24%,rgba(255,255,255,0.05),transparent_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_28%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SiteHeader lang={lang} setLang={setLang} />

        <section className="pb-24 pt-6 md:pt-8">
          <div className="grid items-center gap-12 lg:grid-cols-[0.66fr_1.34fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="text-[11px] tracking-[0.24em] text-white/34">
                {heroEyebrow}
              </div>

              <h1 className="mt-6 text-[44px] font-medium leading-[0.9] tracking-[-0.03em] sm:text-[60px] md:text-[76px] lg:text-[84px]">
                {headlineA}
                <span className="block text-white/48">{headlineB}</span>
              </h1>

              <p className="mt-7 max-w-[34ch] text-[16px] leading-relaxed text-white/62 sm:text-[18px] md:text-[19px]">
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
              <HeroSlides slides={HERO_SLIDES} />
            </div>
          </div>

          <div id="platform" className="mt-28">
            <div className="text-xs tracking-[0.18em] text-white/45">
              {tracksTitle}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tracks.map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className={[
                    "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 md:p-8",
                    "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white/[0.045]",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition duration-300 group-hover:border-white/15" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="text-xs tracking-[0.18em] text-white/45">
                      {x.n}
                    </div>

                    <div className="text-xs tracking-[0.18em] text-white/30">
                      {x.meta}
                    </div>
                  </div>

                  <div className="relative mt-7 text-[22px] font-medium tracking-tight text-white/92">
                    {x.title}
                  </div>

                  <p className="relative mt-4 max-w-[30ch] text-[15px] leading-relaxed text-white/60">
                    {x.desc}
                  </p>

                  <div className="relative mt-10 text-sm text-white/55 transition group-hover:text-white">
                    {x.cta}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <div className="text-[11px] tracking-[0.22em] text-white/42">
              {whatYouGetTitle}
            </div>

            <div className="mt-6 grid gap-y-4 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-8">
              {whatYouGetItems.map((item) => (
                <div
                  key={item}
                  className="text-[15px] leading-relaxed text-white/62"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-2 mt-20">
            <div className="mb-4 text-xs tracking-[0.22em] text-white/35">
              {selectedClubsLabel}
            </div>

            <div className="hidden sm:block">
              <LogoMarquee
                logos={logos}
                height={28}
                gapPx={120}
                durationSeconds={110}
                windowInsetPercent={45}
              />
            </div>

            <div className="block sm:hidden">
              <LogoMarquee
                logos={logos}
                height={22}
                gapPx={84}
                durationSeconds={85}
                windowInsetPercent={47}
              />
            </div>
          </div>

          <div className="mt-10 text-sm text-white/35">{bottomLine}</div>

          <div className="mt-14 pb-10 text-xs text-white/30">
            {copyrightLabel}
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroSlides({
  slides,
}: {
  slides: HeroSlide[];
}) {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <div className="absolute left-[16%] top-[8%] h-52 w-52 rounded-full bg-emerald-400/12 blur-3xl" />
      <div className="absolute bottom-[8%] right-[12%] h-56 w-56 rounded-full bg-white/6 blur-3xl" />

      <div className="relative min-h-[520px] sm:min-h-[620px] lg:min-h-[760px]">
        <div className="pointer-events-none absolute inset-x-[4%] top-[6%] bottom-[8%] rounded-[44px] border border-white/7 bg-white/[0.015]" />
        <div className="pointer-events-none absolute inset-x-[4%] top-[6%] bottom-[8%] rounded-[44px] bg-[radial-gradient(72%_72%_at_68%_18%,rgba(35,211,120,0.09),transparent_62%)]" />

        <div className="absolute left-6 top-6 z-20 flex flex-wrap items-center gap-2 sm:left-8 sm:top-8">
          <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[10px] tracking-[0.18em] text-white/72 backdrop-blur-md">
            VISION
          </span>
          <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-[10px] tracking-[0.18em] text-white/72 backdrop-blur-md">
            RECRUITMENT
          </span>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-[10px] tracking-[0.18em] text-white backdrop-blur-md">
            DEVELOPMENT
          </span>
        </div>

        <div className="hidden lg:block absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              const positionClass =
                index === activeIndex
                  ? "z-30 translate-y-0 scale-100 opacity-100"
                  : index < activeIndex
                    ? "z-10 -translate-x-[18%] translate-y-[5%] scale-[0.82] opacity-40 grayscale"
                    : "z-10 translate-x-[18%] translate-y-[5%] scale-[0.82] opacity-40 grayscale";

              return (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show slide ${index + 1}`}
                  className={[
                    "absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    positionClass,
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative overflow-hidden rounded-[30px] transition-all duration-700",
                      isActive
                        ? "shadow-[0_45px_120px_rgba(0,0,0,0.62)] ring-1 ring-white/12"
                        : "shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/6",
                    ].join(" ")}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={860}
                      height={1146}
                      priority={index === 0}
                      className={[
                        "h-auto w-[340px] xl:w-[390px] rounded-[30px] transition-all duration-700",
                        isActive ? "" : "blur-[0.2px]",
                      ].join(" ")}
                      sizes="(min-width: 1280px) 390px, 340px"
                    />

                    <div
                      className={[
                        "absolute inset-0 transition-all duration-700",
                        isActive ? "bg-black/6" : "bg-black/42",
                      ].join(" ")}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden absolute inset-0 flex items-center justify-center px-6 pb-20 pt-20 sm:px-10">
          <div className="relative w-full max-w-[460px]">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={slide.src}
                  className={[
                    "absolute inset-0 transition-all duration-[1200ms] ease-out",
                    isActive ? "scale-100 opacity-100" : "scale-[1.02] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden rounded-[28px] ring-1 ring-white/8 shadow-[0_32px_90px_rgba(0,0,0,0.5)]">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      width={860}
                      height={1146}
                      priority={index === 0}
                      className="h-auto w-full rounded-[28px]"
                      sizes="90vw"
                    />
                    <div className="absolute inset-0 bg-black/8" />
                  </div>
                </div>
              );
            })}

            <Image
              src={slides[activeIndex].src}
              alt={slides[activeIndex].alt}
              width={860}
              height={1146}
              className="h-auto w-full opacity-0"
              sizes="90vw"
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 sm:bottom-8 sm:left-8">
          {slides.map((slide, index) => {
            const active = index === activeIndex;

            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  active
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/35 hover:bg-white/55",
                ].join(" ")}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}