"use client";

import Link from "next/link";
import { useMemo } from "react";
import PlayerDevelopmentPlanBuilder from "./ui/PlayerDevelopmentPlanBuilder";
import { SiteHeader } from "@/components/SiteHeader";
import { useLang } from "@/lib/useLang";

export default function Page() {
  const { lang, setLang } = useLang("en");
  const isNl = lang === "nl";

  const backLabel = isNl ? "Terug naar Development" : "Back to Development";
  const eyebrow = isNl ? "DEVELOPMENT TOOL" : "DEVELOPMENT TOOL";
  const title = isNl
    ? "Player Development Plan Builder"
    : "Player Development Plan Builder";

  const subtitle = isNl
    ? "Bouw individuele ontwikkelplannen vanuit observatie, rolcontext en verantwoordelijkheid — in een vorm die direct bruikbaar is voor speler en staf."
    : "Build individual development plans from observation, role context and responsibility — in a form directly usable by player and staff.";

  const microProof = isNl
    ? ["ROLGEBONDEN", "GESTRUCTUREERD", "PDF-READY"]
    : ["ROLE-BASED", "STRUCTURED", "PDF-READY"];

  const footerLeft = isNl
    ? "FTBLL.ai — Development tools for football environments"
    : "FTBLL.ai — Development tools for football environments";

  const footerDevelopment = isNl ? "Development" : "Development";
  const footerHome = isNl ? "Home" : "Home";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0D10] text-white selection:bg-white selection:text-black">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[#090b0e]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_620px_at_76%_10%,rgba(60,255,170,0.08),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(640px_480px_at_18%_20%,rgba(255,255,255,0.04),transparent_62%)]" />
      </div>

      <div className="relative z-10">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8">
          <SiteHeader lang={lang} setLang={setLang} />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 sm:px-8">
          <div className="rounded-[30px] border border-white/8 bg-white/[0.02] px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[820px]">
                <Link
                  href="/development"
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-white/40 transition hover:text-white/72"
                >
                  <span aria-hidden="true">←</span>
                  <span>{backLabel}</span>
                </Link>

                <div className="mt-6 text-[11px] tracking-[0.22em] text-white/36">
                  {eyebrow}
                </div>

                <h1 className="mt-4 text-[30px] font-medium tracking-[-0.03em] text-white sm:text-[40px] md:text-[48px]">
                  {title}
                </h1>

                <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-white/58 sm:text-[16px]">
                  {subtitle}
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
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.18em] text-white/42">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  DEVELOPMENT
                </span>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-white/80">
                  LIVE BUILDER
                </span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <PlayerDevelopmentPlanBuilder />
        </section>

        <footer className="mt-10 border-t border-white/6">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-6 text-[12px] text-white/34 sm:px-8 md:flex-row md:items-center md:justify-between">
            <div>{footerLeft}</div>

            <div className="flex items-center gap-5">
              <Link
                href="/development"
                className="transition hover:text-white/60"
              >
                {footerDevelopment}
              </Link>
              <Link href="/" className="transition hover:text-white/60">
                {footerHome}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}