"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/copy";

const KEY = "ftbll_lang";

function isValidLang(value: string | null): value is Lang {
  return (
    value === "en" ||
    value === "nl" ||
    value === "de" ||
    value === "es" ||
    value === "fr" ||
    value === "it"
  );
}

export function useLang(defaultLang: Lang = "en") {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (isValidLang(saved)) {
        setLangState(saved);
      }
    } catch {}

    setReady(true);
  }, []);

  function setLang(next: Lang) {
    setLangState(next);

    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }

  return { lang, setLang, ready };
}