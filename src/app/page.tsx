"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoMarquee } from "@/components/LogoMarquee";

type Lang = "en" | "de" | "es" | "fr" | "it" | "nl";

const ENABLE_VIDEO = true;

const COPY_EN = {
  brand: "FOOTBALL LEADERSHIP",
  requestAccess: "Request access",
  explore: "Explore",
  headlineA: "Clarity for the people",
  headlineB: "who carry the decisions.",
  sub: "A decision platform for professional football clubs — and the people who lead them.",
  usesLabel: "Use it for:",
  uses: [
    "Club vision",
    "Sporting strategy",
    "Recruitment plans",
    "Squad planning",
    "Assessments",
    "Development plans",
    "Performance structure",
    "Governance reviews",
  ],
  footer: "A product company. Built to become the standard.",
};

const COPY_NL = {
  brand: "FOOTBALL LEADERSHIP",
  requestAccess: "Toegang aanvragen",
  explore: "Verkennen",
  headlineA: "Helderheid voor mensen",
  headlineB: "die beslissingen moeten dragen.",
  sub: "Een besluitplatform voor profclubs — en de mensen die richting geven.",
  usesLabel: "Voorbeelden:",
  uses: [
    "Clubvisie",
    "Sportieve strategie",
    "Recruitmentplannen",
    "Selectieplanning",
    "Assessments",
    "Ontwikkelplannen",
    "Prestatie-structuur",
    "Governance-evaluaties",
  ],
  footer: "Productbedrijf. Gebouwd om de standaard te worden.",
};

const COPY: Record<Lang, typeof COPY_EN> = {
  en: COPY_EN,
  nl: COPY_NL,
  de: COPY_EN,
  es: COPY_EN,
  fr: COPY_EN,
  it: COPY_EN,
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const t = useMemo(() => COPY[lang], [lang]);

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

  return (
    <main className="h-screen overflow-hidden overflow-x-hidden bg-black text-white selection:bg-white selection:text-black">
      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col px-6 overflow-x-hidden">
        <header className="flex items-center justify-between py-10">
          <div className="text-xs tracking-[0.22em] text-white/70">
            {t.brand}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="h-10 rounded-md border border-white/15 bg-transparent px-3 text-sm text-white/80 outline-none hover:bg-white/10"
            >
              <option className="bg-black" value="en">EN</option>
              <option className="bg-black" value="de">DE</option>
              <option className="bg-black" value="es">ES</option>
              <option className="bg-black" value="fr">FR</option>
              <option className="bg-black" value="it">IT</option>
              <option className="bg-black" value="nl">NL</option>
            </select>

            <Button
              asChild
              variant="secondary"
              className="bg-transparent text-white hover:bg-white/10 border border-white/15"
            >
              <Link href="/request-access">{t.requestAccess}</Link>
            </Button>
          </div>
        </header>

        <section className="flex flex-1 items-center">
          <div className="max-w-4xl">
            <h1 className="font-medium tracking-tight leading-[1.05] text-[34px] sm:text-[44px] md:text-[84px] break-words">
              {t.headlineA}
              <span className="block text-white/55 break-words">
                {t.headlineB}
              </span>
            </h1>

            <p className="mt-6 text-[16px] sm:text-[18px] md:text-xl text-white/60 max-w-[42ch]">
              {t.sub}
            </p>

            <div className="mt-10">
              <Button asChild className="bg-white text-black hover:bg-white/90">
                <Link href="/explore">{t.explore}</Link>
              </Button>
            </div>

            <div className="mt-12">
              <div className="text-xs tracking-[0.18em] text-white/45">
                {t.usesLabel}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
                {t.uses.map((u) => (
                  <span key={u}>{u}</span>
                ))}
              </div>
            </div>

            <div className="mt-16 mb-2">
              <div className="mb-4 text-xs tracking-[0.22em] text-white/35">
                SELECTED CLUBS (PRIVATE BETA)
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

            <div className="mt-10 text-xs text-white/35">{t.footer}</div>

            <div className="mt-14 text-xs text-white/30">
              © {new Date().getFullYear()} Football Leadership
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}