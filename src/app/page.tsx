"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LogoMarquee } from "@/components/LogoMarquee";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function Home() {
  const { lang, setLang } = useLang("en");
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

  const tracks = [
    {
      href: "/vision",
      n: "01",
      title: t.tracks[0].title,
      desc: t.tracks[0].desc,
      meta: "VISION SYSTEM",
    },
    {
      href: "/recruitment",
      n: "02",
      title: t.tracks[1].title,
      desc: t.tracks[1].desc,
      meta: "RECRUITMENT SYSTEM",
    },
    {
      href: "/development",
      n: "03",
      title: t.tracks[2].title,
      desc: t.tracks[2].desc,
      meta: "DEVELOPMENT SYSTEM",
    },
  ] as const;

  const headlineA =
    lang === "nl" ? "Helderheid voor mensen" : "Clarity for the people";
  const headlineB =
    lang === "nl"
      ? "die beslissingen moeten dragen."
      : "who carry the decisions.";
  const sub =
    lang === "nl"
      ? "Een besluitplatform voor profclubs — en de mensen die richting geven."
      : "A decision platform for professional football clubs — and the people who lead them.";
  const tracksTitle =
    lang === "nl" ? "Drie kernomgevingen." : "Three core environments.";
  const selectedClubsLabel =
    lang === "nl"
      ? "GESELECTEERDE CLUBS (PRIVATE BETA)"
      : "SELECTED CLUBS (PRIVATE BETA)";
  const openLabel = t.homeOpenLabel;
  const copyrightLabel = `© ${new Date().getFullYear()} Football Leadership`;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SiteHeader
          lang={lang}
          setLang={setLang}
          requestAccessLabel={t.requestAccess}
          brandLabel={t.brand}
        />

        <section className="pt-6 pb-20">
          <div className="max-w-4xl">
            <h1 className="font-medium tracking-tight leading-[1.05] text-[34px] sm:text-[44px] md:text-[84px] break-words">
              {headlineA}
              <span className="block text-white/55 break-words">
                {headlineB}
              </span>
            </h1>

            <p className="mt-6 text-[16px] sm:text-[18px] md:text-xl text-white/60 max-w-[42ch]">
              {sub}
            </p>

            <div className="mt-10">
              <Button
                asChild
                className="bg-white text-black hover:bg-white/90"
              >
                <Link href="/request-access">{t.requestAccess}</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-xs tracking-[0.18em] text-white/45">
              {tracksTitle}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tracks.map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className={[
                    "group relative overflow-hidden rounded-3xl",
                    "border border-white/10 bg-white/[0.025]",
                    "p-7 md:p-8",
                    "transition-all duration-300 ease-out",
                    "hover:bg-white/[0.045] hover:-translate-y-0.5",
                  ].join(" ")}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-white/15 transition duration-300" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="text-xs tracking-[0.18em] text-white/45">
                      {x.n}
                    </div>

                    <div className="text-xs tracking-[0.18em] text-white/30">
                      {x.meta}
                    </div>
                  </div>

                  <div className="relative mt-5 text-lg font-medium">
                    {x.title}
                  </div>

                  <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                    {x.desc}
                  </p>

                  <div className="relative mt-8 text-sm text-white/55 group-hover:text-white transition">
                    {openLabel}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <div className="text-xs tracking-[0.18em] text-white/45">
              {t.whatYouGet}
            </div>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
              {t.whatYouGetBullets.map((u) => (
                <span key={u}>{u}</span>
              ))}
            </div>
          </div>

          <div className="mt-16 mb-2">
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

          <div className="mt-10 text-xs text-white/35">{t.footerLine}</div>

          <div className="mt-14 pb-10 text-xs text-white/30">
            {copyrightLabel}
          </div>
        </section>
      </div>
    </main>
  );
}