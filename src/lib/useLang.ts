"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/copy";

const KEY = "ftbll_lang";

export function useLang(defaultLang: Lang = "en") {
  const [lang, setLangState] = useState<Lang>(defaultLang);
  const [ready, setReady] = useState(false);

  // Load saved language once on first render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY) as Lang | null;
      if (saved) setLangState(saved);
    } catch {}
    setReady(true);
  }, []);

  // Persist language
  function setLang(next: Lang) {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }

  return { lang, setLang, ready };
}