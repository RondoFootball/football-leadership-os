"use client";

import Link from "next/link";
import { useMemo } from "react";
import PlayerDevelopmentPlanBuilder from "./ui/PlayerDevelopmentPlanBuilder";
import { SiteHeader } from "@/components/SiteHeader";
import { COPY } from "@/lib/copy";
import { useLang } from "@/lib/useLang";

export default function Page() {
  const { lang, setLang } = useLang("en");
  const t = useMemo(() => COPY[lang], [lang]);

  const eyebrow = lang === "nl" ? "Development Tool" : "Development Tool";
  const footerLeft =
    lang === "nl"
      ? "FTBLL.ai — Development tools for football environments"
      : "FTBLL.ai — Development tools for football environments";
  const footerDevelopment =
    lang === "nl" ? "Development" : "Development";
  const footerHome = "Home";

  return (
    <main className="min-h-screen bg-[#0B0D10] text-white">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8">
        <SiteHeader
          lang={lang}
          setLang={setLang}
          requestAccessLabel={t.requestAccess}
          brandLabel={t.brand}
        />
      </div>

      <div className="border-y border-white/6 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/development"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/72 transition hover:border-white/20 hover:text-white"
            >
              <span aria-hidden="true">←</span>
              <span>{t.developmentBuilderBack}</span>
            </Link>

            <div className="hidden h-5 w-px bg-white/10 sm:block" />

            <Link
              href="/"
              className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/40 transition hover:text-white/70"
            >
              FTBLL.AI
            </Link>
          </div>

          <div className="hidden text-right sm:block">
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/32">
              Development
            </div>
            <div className="mt-1 text-[13px] text-white/68">
              {t.developmentBuilderTitle}
            </div>
          </div>
        </div>
      </div>

      <section className="border-b border-white/6">
        <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-8">
          <div className="max-w-[760px]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">
              {eyebrow}
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[36px]">
              {t.developmentBuilderTitle}
            </h1>

            <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/52 sm:text-[15px]">
              {t.developmentBuilderSubtitle}
            </p>
          </div>
        </div>
      </section>

      <PlayerDevelopmentPlanBuilder />

      <footer className="border-t border-white/6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-5 text-[12px] text-white/34 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>{footerLeft}</div>

          <div className="flex items-center gap-4">
            <Link href="/development" className="transition hover:text-white/60">
              {footerDevelopment}
            </Link>
            <Link href="/" className="transition hover:text-white/60">
              {footerHome}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}