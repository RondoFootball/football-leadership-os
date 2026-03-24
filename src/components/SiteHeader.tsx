"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export type Lang = "en" | "de" | "es" | "fr" | "it" | "nl";

const LANGUAGE_OPTIONS: Array<{
  value: Lang;
  short: string;
  label: string;
}> = [
  { value: "en", short: "EN", label: "English" },
  { value: "nl", short: "NL", label: "Nederlands" },
  { value: "de", short: "DE", label: "Deutsch" },
  { value: "es", short: "ES", label: "Español" },
  { value: "fr", short: "FR", label: "Français" },
  { value: "it", short: "IT", label: "Italiano" },
];

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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === lang) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onDocumentKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onDocumentKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, []);

  return (
    <header className="flex items-center justify-between py-10">
      <Link
        href="/"
        className="text-xs tracking-[0.22em] text-white/70 transition hover:text-white"
      >
        {brandLabel}
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        <div ref={rootRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 text-sm text-white/82 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label="Language"
          >
            <span className="text-[12px] font-medium tracking-[0.14em]">
              {activeLanguage.short}
            </span>

            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className={`transition ${open ? "rotate-180" : ""}`}
            >
              <path
                d="M3 5.25L7 9.25L11 5.25"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open ? (
            <div className="absolute right-0 z-[1000] mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#101317] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="p-2" role="listbox" aria-label="Language options">
                {LANGUAGE_OPTIONS.map((option) => {
                  const active = option.value === lang;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setLang(option.value);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                        active
                          ? "border border-white/10 bg-white/[0.08]"
                          : "border border-transparent hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-medium tracking-[0.14em] text-white/78">
                          {option.short}
                        </span>
                        <span className="text-[14px] text-white/88">
                          {option.label}
                        </span>
                      </div>

                      {active ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden="true"
                          className="shrink-0 text-white/50"
                        >
                          <path
                            d="M3 7.5L5.5 10L11 4.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <Button
          asChild
          variant="secondary"
          className="border border-white/15 bg-transparent text-white hover:bg-white/10"
        >
          <Link href="/request-access">{requestAccessLabel}</Link>
        </Button>
      </div>
    </header>
  );
}