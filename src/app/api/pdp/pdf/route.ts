// src/app/api/pdp/pdf/route.ts

import { NextResponse } from "next/server";

import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { renderPdpHtml } from "@/app/development/player-development-plan/ui/lib/renderPdfHtml";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lang = "nl" | "en";
type PlanVersion = "staff" | "player";

type PdfRequest = {
  plan: DevelopmentPlanV1;
  lang?: Lang;
  version?: PlanVersion;
  filename?: string;
};

function safeStr(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return fallback;
  if (/^[-—–\s]+$/.test(s)) return fallback;
  return s;
}

function inferLang(bodyLang: unknown, plan: any): Lang {
  if (bodyLang === "en") return "en";
  if (plan?.meta?.lang === "en") return "en";
  return "nl";
}

function inferVersion(v: unknown): PlanVersion {
  return v === "player" ? "player" : "staff";
}

function safeAsciiFilename(input: string) {
  return input.replace(/[^\x20-\x7E]/g, "").replace(/["\\]/g, "");
}

function buildFilenameBase(
  plan: DevelopmentPlanV1,
  lang: Lang,
  version: PlanVersion
) {
  const club = safeStr(
    (plan as any)?.brand?.clubName || (plan as any)?.meta?.club,
    "Club"
  );
  const player = safeStr(
    (plan as any)?.player?.name,
    lang === "nl" ? "Speler" : "Player"
  );
  const v = version === "player" ? "Player" : "Staff";

  return `Player Development Plan - ${v} - ${player} - ${club}.pdf`;
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
      return NextResponse.json(
        { error: "Missing plan" },
        { status: 400 }
      );
    }

    const plan = body.plan as DevelopmentPlanV1;
    const lang: Lang = inferLang(body.lang, plan);
    const version: PlanVersion = inferVersion(body.version);

    const html = renderPdpHtml(plan, { lang, version });

    const apiKey = process.env.PDFSHIFT_API_KEY;

    if (!apiKey) {
      throw new Error("Missing PDFSHIFT_API_KEY");
    }

    const response = await fetch("https://api.pdfshift.io/v3/convert/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${apiKey}:`
        ).toString("base64")}`,
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