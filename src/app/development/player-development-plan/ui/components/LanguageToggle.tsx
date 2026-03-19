"use client";

import type { Lang } from "../lib/plan";

export default function LanguageToggle({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-white/15 p-0.5">
      <button
        type="button"
        onClick={() => setLang("en")}
        className={[
          "rounded-full px-2.5 py-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-white/30",
          lang === "en" ? "bg-white text-black" : "text-white/70 hover:text-white",
        ].join(" ")}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("nl")}
        className={[
          "rounded-full px-2.5 py-1 text-[12px] focus:outline-none focus:ring-2 focus:ring-white/30",
          lang === "nl" ? "bg-white text-black" : "text-white/70 hover:text-white",
        ].join(" ")}
        aria-pressed={lang === "nl"}
      >
        NL
      </button>
    </div>
  );
}