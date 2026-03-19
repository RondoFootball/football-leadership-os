"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function ExplorePage() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  const tiles = [
    {
      href: "/explore/vision",
      n: t.tracks[0].n,
      title: t.tracks[0].title,
      desc: t.tracks[0].desc,
      meta: "VISION SYSTEM · EXTRACT",
      lines: ["Competitive thesis", "Governance architecture", "Indicators"],
    },
    {
      href: "/explore/recruitment",
      n: t.tracks[1].n,
      title: t.tracks[1].title,
      desc: t.tracks[1].desc,
      meta: "WINDOW PLAN · EXTRACT",
      lines: ["Priority roles", "Profile constraints", "Decision rhythm"],
    },
    {
      href: "/explore/development",
      n: t.tracks[2].n,
      title: t.tracks[2].title,
      desc: t.tracks[2].desc,
      meta: "ASSESSMENT + PLAN · EXTRACT",
      lines: ["Role standard", "Assessment snapshot", "12-week plan"],
    },
  ] as const;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(700px_520px_at_72%_35%,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-8">
        <SiteHeader
          lang={lang}
          setLang={setLang}
          requestAccessLabel={t.requestAccess}
          brandLabel={t.brand}
        />

        <section className="pt-14 pb-20">
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight">
            {t.exploreTitleA}
            <span className="block text-white/45">{t.exploreTitleB}</span>
          </h1>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tiles.map((x) => (
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
                {/* Inner highlight border (Apple detail) */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent group-hover:border-white/15 transition duration-300" />

                {/* Subtle surface sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_40%)]" />
                </div>

                {/* Soft radial highlight */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="absolute -inset-10 bg-[radial-gradient(420px_260px_at_80%_75%,rgba(255,255,255,0.10),transparent_60%)]" />
                </div>

                {/* Header row */}
                <div className="relative flex items-start justify-between gap-4">
                  <div className="text-xs tracking-[0.18em] text-white/45">
                    {x.n}
                  </div>

                  <div className="hidden md:block text-xs tracking-[0.18em] text-white/30">
                    {x.meta}
                  </div>
                </div>

                <div className="relative mt-5 text-lg font-medium">
                  {x.title}
                </div>

                <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                  {x.desc}
                </p>

                <div className="relative mt-8 flex items-center justify-between">
                  <div className="text-sm text-white/55 group-hover:text-white transition">
                    {t.tracksCta}
                  </div>

                  <div className="md:hidden text-white/35 group-hover:text-white/70 transition">
                    →
                  </div>
                </div>

                {/* Paper preview — desktop only */}
                <div
                  className={[
                    "hidden md:block",
                    "pointer-events-none absolute right-5 bottom-5",
                    "w-[180px] h-[128px] rounded-2xl",
                    "bg-[#f4f4f1] text-black",
                    "shadow-[0_30px_80px_rgba(0,0,0,0.55)]",
                    "opacity-0 translate-y-2 rotate-[1deg]",
                    "transition-all duration-300 ease-out",
                    "group-hover:opacity-100 group-hover:translate-y-0",
                  ].join(" ")}
                >
                  <div className="p-4">
                    <div className="text-[10px] tracking-[0.18em] text-black/50">
                      EXTRACT
                    </div>

                    <div className="mt-3 space-y-2">
                      {x.lines.map((l) => (
                        <div key={l} className="flex items-center gap-2">
                          <span className="h-[1px] w-4 bg-black/15" />
                          <span className="text-[11px] text-black/70">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-xs text-white/35">
            Minimal interface. Serious standard.
          </div>
        </section>
      </div>
    </main>
  );
}