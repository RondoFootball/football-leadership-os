// src/app/api/pdp/pdf/route.ts

import { NextResponse } from "next/server";

import type {
  DevelopmentPlanV1,
  Lang,
  PlanVersion,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { renderPdpHtml } from "@/app/development/player-development-plan/ui/lib/renderPdfHtml";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PdfRequest = {
  plan: DevelopmentPlanV1;
  lang?: Lang;
  version?: PlanVersion;
  filename?: string;
};

const SUPPORTED_LANGS: Lang[] = ["nl", "en", "de", "es", "it", "fr"];

function safeStr(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return fallback;
  if (/^[-—–\s]+$/.test(s)) return fallback;
  return s;
}

function inferLang(bodyLang: unknown, plan: DevelopmentPlanV1): Lang {
  if (SUPPORTED_LANGS.includes(bodyLang as Lang)) {
    return bodyLang as Lang;
  }

  const planLang = plan?.meta?.lang;
  if (SUPPORTED_LANGS.includes(planLang as Lang)) {
    return planLang as Lang;
  }

  return "nl";
}

function inferVersion(v: unknown): PlanVersion {
  return v === "player" ? "player" : "staff";
}

function safeAsciiFilename(input: string) {
  return input.replace(/[^\x20-\x7E]/g, "").replace(/["\\]/g, "");
}

function getLocalizedPlayerFallback(lang: Lang) {
  switch (lang) {
    case "nl":
      return "Speler";
    case "de":
      return "Spieler";
    case "es":
      return "Jugador";
    case "it":
      return "Giocatore";
    case "fr":
      return "Joueur";
    case "en":
    default:
      return "Player";
  }
}

function getLocalizedPlanTitle(lang: Lang) {
  switch (lang) {
    case "nl":
      return "Speler Ontwikkelplan";
    case "de":
      return "Spieler-Entwicklungsplan";
    case "es":
      return "Plan de Desarrollo del Jugador";
    case "it":
      return "Piano di Sviluppo del Giocatore";
    case "fr":
      return "Plan de Développement du Joueur";
    case "en":
    default:
      return "Player Development Plan";
  }
}

function getLocalizedVersionLabel(lang: Lang, version: PlanVersion) {
  if (version === "player") {
    switch (lang) {
      case "nl":
        return "Speler";
      case "de":
        return "Spieler";
      case "es":
        return "Jugador";
      case "it":
        return "Giocatore";
      case "fr":
        return "Joueur";
      case "en":
      default:
        return "Player";
    }
  }

  switch (lang) {
    case "nl":
      return "Staff";
    case "de":
      return "Staff";
    case "es":
      return "Staff";
    case "it":
      return "Staff";
    case "fr":
      return "Staff";
    case "en":
    default:
      return "Staff";
  }
}

function buildFilenameBase(
  plan: DevelopmentPlanV1,
  lang: Lang,
  version: PlanVersion
) {
  const club = safeStr(plan?.brand?.clubName || plan?.meta?.club, "Club");
  const player = safeStr(plan?.player?.name, getLocalizedPlayerFallback(lang));
  const title = getLocalizedPlanTitle(lang);
  const versionLabel = getLocalizedVersionLabel(lang, version);

  return `${title} - ${versionLabel} - ${player} - ${club}.pdf`;
}

async function parseBody(req: Request): Promise<Partial<PdfRequest>> {
  try {
    return (await req.json()) as Partial<PdfRequest>;
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  try {
    const body = await parseBody(req);

    if (!body?.plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }

    const plan = body.plan as DevelopmentPlanV1;
    const lang = inferLang(body.lang, plan);
    const version = inferVersion(body.version);

    const html = renderPdpHtml(plan, { lang, version });

    const apiKey = (process.env.PDFSHIFT_API_KEY || "").trim();

    if (!apiKey) {
      throw new Error("Missing PDFSHIFT_API_KEY");
    }

    const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        source: html,
        landscape: false,
        use_print: true,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`PDFShift error: ${text}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    const base = safeStr(body.filename, buildFilenameBase(plan, lang, version));
    const filenameAscii = safeAsciiFilename(base);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameAscii}"`,
      },
    });
  } catch (err: any) {
    console.error("PDF ERROR:", err);

    return NextResponse.json(
      {
        error: "PDF generation failed",
        message: err?.message,
      },
      { status: 500 }
    );
  }
}