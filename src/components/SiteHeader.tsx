"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export type Lang = "en" | "de" | "es" | "fr" | "it" | "nl";

export function SiteHeader({
  lang,
  setLang,
  requestAccessLabel = "Request access",
  brandLabel = "FOOTBALL LEADERSHIP",
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  requestAccessLabel?: string;
  brandLabel?: string;
}) {
  return (
    <header className="flex items-center justify-between py-10">
      <Link href="/" className="text-xs tracking-[0.22em] text-white/70 hover:text-white">
        {brandLabel}
      </Link>

      <div className="flex items-center gap-4">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="h-10 rounded-md border border-white/15 bg-transparent px-3 text-sm text-white/80 outline-none hover:bg-white/10"
          aria-label="Language"
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
          <Link href="/request-access">{requestAccessLabel}</Link>
        </Button>
      </div>
    </header>
  );
}