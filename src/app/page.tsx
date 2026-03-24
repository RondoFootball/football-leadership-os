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
    lang === "nl" ? "Plannen die echt" : "Plans that actually";
  const headlineB =
    lang === "nl" ? "uitgevoerd worden." : "get executed.";

  const sub =
    lang === "nl"
      ? "Gebouwd voor clubs waar helderheid, eigenaarschap en ritme ook onder druk moeten blijven staan."
      : "Built for clubs where clarity, ownership and rhythm have to hold under pressure.";

  const tracksTitle =
    lang === "nl" ? "Drie kernomgevingen." : "Three core environments.";

  const selectedClubsLabel =
    lang === "nl"
      ? "GESELECTEERDE CLUBS (PRIVATE BETA)"
      : "SELECTED CLUBS (PRIVATE BETA)";

  const openLabel = t.homeOpenLabel;
  const copyrightLabel = `© ${new Date().getFullYear()} Football Leadership`;

  const primaryCta = lang === "nl" ? "Open Development" : "Open Development";
  const secondaryCta = lang === "nl" ? "Bekijk platform" : "View platform";
  const heroEyebrow =
    lang === "nl"
      ? "BESLUITPLATFORM VOOR PROFCLUBS"
      : "DECISION PLATFORM FOR PROFESSIONAL CLUBS";

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_72%_18%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_500px_at_18%_30%,rgba(255,255,255,0.04),transparent_65%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SiteHeader lang={lang} setLang={setLang} />

        <section className="pt-6 pb-24">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="text-[11px] tracking-[0.22em] text-white/38">
                {heroEyebrow}
              </div>

              <h1 className="mt-6 font-medium tracking-tight leading-[0.98] text-[42px] sm:text-[56px] md:text-[76px] lg:text-[88px]">
                {headlineA}
                <span className="block text-white/52">{headlineB}</span>
              </h1>

              <p className="mt-7 max-w-[34ch] text-[16px] leading-relaxed text-white/62 sm:text-[18px] md:text-[19px]">
                {sub}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Link href="/development">{primaryCta}</Link>
                </Button>

                <Button
                  asChild
                  variant="secondary"
                  className="border border-white/15 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href="#platform">{secondaryCta}</Link>
                </Button>
              </div>
            </div>

            <div className="lg:pl-6">
              <HeroPlanPreview lang={lang} />
            </div>
          </div>

          <div id="platform" className="mt-24">
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

                  <div className="relative mt-5 text-lg font-medium text-white/92">
                    {x.title}
                  </div>

                  <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                    {x.desc}
                  </p>

                  <div className="relative mt-8 text-sm text-white/55 transition group-hover:text-white">
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

function HeroPlanPreview({ lang }: { lang: "en" | "de" | "es" | "fr" | "it" | "nl" }) {
  const isNl = lang === "nl";

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[36px] bg-white/[0.03] blur-3xl" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0E1116] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="border-b border-white/8 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.18em] text-white/34">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/38">
              Vision
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-white/38">
              Recruitment
            </span>
            <span className="rounded-full border border-white/14 bg-white/[0.08] px-2.5 py-1 text-white/82">
              Development
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-white/36">
                {isNl ? "ONTWIKKELING — INDIVIDUEEL PLAN" : "DEVELOPMENT — INDIVIDUAL PLAN"}
              </div>
              <div className="mt-2 text-[24px] font-medium tracking-tight text-white/94 sm:text-[28px]">
                {isNl ? "Middenvelder #8" : "Midfielder #8"}
              </div>
            </div>

            <div className="text-right text-[12px] text-white/42">
              <div>{isNl ? "Cyclus: 6 weken" : "Cycle: 6 weeks"}</div>
              <div className="mt-1">{isNl ? "Eigenaar: Middenveldcoach" : "Owner: Midfield coach"}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <PlanBlock
              label={isNl ? "Focusgebied" : "Focus area"}
              value={
                isNl
                  ? "Vooruit spelen onder druk"
                  : "Forward passing under pressure"
              }
            />

            <PlanBlock
              label={isNl ? "Gedragsdoel" : "Behaviour target"}
              value={
                isNl
                  ? "Open aannemen en binnen twee balcontacten vooruit spelen wanneer de as open is."
                  : "Receive on the half-turn and play forward within two touches when the central lane is open."
              }
            />

            <PlanList
              label={isNl ? "Interventies" : "Interventions"}
              items={
                isNl
                  ? [
                      "Voororiëntatie vóór aanname",
                      "Positie kiezen tussen linies",
                      "Rondo met richting en tijdsdruk",
                    ]
                  : [
                      "Pre-receive scanning behaviour",
                      "Positioning between lines",
                      "Rondo with directional and time pressure",
                    ]
              }
            />

            <PlanBlock
              label={isNl ? "Wedstrijdtransfer" : "Match transfer"}
              value={
                isNl
                  ? "Na balwinst in het midden direct eerst vooruit kijken en de eerste pass door de as zoeken."
                  : "After regain in the middle third, look forward first and search for the first pass through the central lane."
              }
            />
          </div>

          <div className="border-t border-white/8 px-5 py-5 md:border-l md:border-t-0 sm:px-6 sm:py-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] tracking-[0.18em] text-white/40">
                {isNl ? "Ritme & beoordeling" : "Rhythm & review"}
              </div>

              <div className="mt-4 space-y-4">
                <MetaRow
                  k={isNl ? "Wekelijks ritme" : "Weekly rhythm"}
                  v={isNl ? "MD+1 review / MD-2 transfer" : "MD+1 review / MD-2 transfer"}
                />
                <MetaRow
                  k={isNl ? "Bewijs" : "Evidence"}
                  v={isNl ? "Video + training clips" : "Video + training clips"}
                />
                <MetaRow
                  k={isNl ? "Evaluatie" : "Evaluation"}
                  v={isNl ? "Speler + coach + staf" : "Player + coach + staff"}
                />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[11px] tracking-[0.18em] text-white/40">
                {isNl ? "Uitvoeringssignalen" : "Execution signals"}
              </div>

              <div className="mt-4 space-y-3">
                <Signal
                  title={isNl ? "Scannen vóór aanname" : "Scans before receive"}
                  note={isNl ? "zichtbaar frequenter" : "visibly more frequent"}
                />
                <Signal
                  title={isNl ? "Open lichaamsstand" : "Open body shape"}
                  note={isNl ? "eerder voorbereid" : "prepared earlier"}
                />
                <Signal
                  title={isNl ? "Eerste blik vooruit" : "First look forward"}
                  note={isNl ? "consistenter na balwinst" : "more consistent after regain"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/8 py-4 first:pt-0 last:border-b-0">
      <div className="text-[11px] tracking-[0.18em] text-white/38">{label}</div>
      <div className="mt-2 text-[15px] leading-relaxed text-white/86 sm:text-[16px]">
        {value}
      </div>
    </div>
  );
}

function PlanList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border-b border-white/8 py-4">
      <div className="text-[11px] tracking-[0.18em] text-white/38">{label}</div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 text-[15px] text-white/84">
            <span className="mt-[9px] h-[1px] w-4 shrink-0 bg-white/22" />
            <span className="leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
      <div className="text-[12px] text-white/45">{k}</div>
      <div className="max-w-[58%] text-right text-[12px] text-white/78">{v}</div>
    </div>
  );
}

function Signal({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-3">
      <div className="text-[13px] text-white/86">{title}</div>
      <div className="mt-1 text-[12px] text-white/46">{note}</div>
    </div>
  );
}