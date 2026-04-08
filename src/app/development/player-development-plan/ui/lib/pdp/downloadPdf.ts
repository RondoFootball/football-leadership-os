// src/app/development/player-development-plan/ui/lib/pdp/downloadPdf.ts

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";

export type PlanVersion = "staff" | "player";

function isSupportedLang(value: unknown): value is Lang {
  return (
    value === "nl" ||
    value === "en" ||
    value === "de" ||
    value === "es" ||
    value === "it" ||
    value === "fr"
  );
}

function inferLang(
  plan: DevelopmentPlanV1 | null | undefined,
  fallback: Lang = "nl"
): Lang {
  const metaLang = plan?.meta?.lang;
  return isSupportedLang(metaLang) ? metaLang : fallback;
}

function localNoPlanMessage(lang: Lang) {
  switch (lang) {
    case "de":
      return "Kein Plan verfügbar. Starte zuerst das Gespräch und generiere den Plan.";
    case "es":
      return "No hay ningún plan disponible. Inicia primero la conversación y genera el plan.";
    case "it":
      return "Nessun piano disponibile. Avvia prima la conversazione e genera il piano.";
    case "fr":
      return "Aucun plan disponible. Commence d’abord la conversation et génère le plan.";
    case "en":
      return "No plan available. Start the conversation first and generate the plan.";
    case "nl":
    default:
      return "Geen plan beschikbaar. Start eerst het gesprek en genereer het plan.";
  }
}

function fallbackFilename(lang: Lang, version: PlanVersion) {
  const versionByLang: Record<Lang, Record<PlanVersion, string>> = {
    nl: {
      player: "spelerplan",
      staff: "staffplan",
    },
    en: {
      player: "player-plan",
      staff: "staff-plan",
    },
    de: {
      player: "spielerplan",
      staff: "mitarbeiterplan",
    },
    es: {
      player: "plan-jugador",
      staff: "plan-staff",
    },
    it: {
      player: "piano-giocatore",
      staff: "piano-staff",
    },
    fr: {
      player: "plan-joueur",
      staff: "plan-staff",
    },
  };

  return `${versionByLang[lang][version]}.pdf`;
}

function filenameFromContentDisposition(cd: string): string | null {
  const header = cd || "";

  const star = /filename\*\s*=\s*([^;]+)/i.exec(header);
  if (star?.[1]) {
    const value = star[1].trim();
    const utf8Match = /^UTF-8''(.+)$/i.exec(value);

    if (utf8Match?.[1]) {
      try {
        return decodeURIComponent(utf8Match[1]);
      } catch {
        // ignore malformed header encoding
      }
    }
  }

  const normal = /filename\s*=\s*"([^"]+)"/i.exec(header);
  if (normal?.[1]) return normal[1];

  return null;
}

/**
 * Downloads the PDP PDF by calling /api/pdp/pdf.
 * Expects the API to accept JSON: { plan, version, lang?, filename? }
 */
export async function downloadPdpPdf(args: {
  plan: DevelopmentPlanV1 | null | undefined;
  version: PlanVersion;
  lang?: Lang;
  filename?: string;
}) {
  const requestedLang = args.lang ?? inferLang(args.plan, "nl");
  const { plan, version, filename } = args;

  if (!plan) {
    throw new Error(localNoPlanMessage(requestedLang));
  }

  const lang = args.lang ?? inferLang(plan, "nl");

  const res = await fetch("/api/pdp/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan,
      version,
      lang,
      filename,
    }),
  });

  if (!res.ok) {
    let message = `PDF download failed (HTTP ${res.status}).`;

    try {
      const json = await res.json();
      message = json?.message || json?.error || message;
    } catch {
      try {
        const text = await res.text();
        if (text?.trim()) {
          message = `${message}\n\n${text.slice(0, 1200)}`;
        }
      } catch {
        // ignore secondary parsing errors
      }
    }

    throw new Error(message);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const contentDisposition = res.headers.get("content-disposition") || "";
  const headerFilename = filenameFromContentDisposition(contentDisposition);
  const downloadName =
    filename || headerFilename || fallbackFilename(lang, version);

  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = downloadName;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(objectUrl);
}