// src/app/api/pdp/pdf/route.ts

import { NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

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

function safeStr(v: any, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return fallback;
  if (/^[-—–\s]+$/.test(s)) return fallback;
  return s;
}

function inferLang(bodyLang: any, plan: any): Lang {
  if (bodyLang === "en") return "en";
  if (plan?.meta?.lang === "en") return "en";
  return "nl";
}

function inferVersion(v: any): PlanVersion {
  return v === "player" ? "player" : "staff";
}

function safeAsciiFilename(input: string) {
  const normalized = (input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const cleaned = normalized
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/["\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const name = cleaned || "pdp.pdf";
  return name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
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

function toTrueArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  return ab;
}

async function parseBody(req: Request): Promise<Partial<PdfRequest>> {
  const ct = (req.headers.get("content-type") || "").toLowerCase();

  if (ct.includes("application/json")) {
    try {
      return (await req.json()) as Partial<PdfRequest>;
    } catch {
      return {};
    }
  }

  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();

    const planStr = fd.get("plan");
    const lang = fd.get("lang");
    const version = fd.get("version");
    const filename = fd.get("filename");

    const out: Partial<PdfRequest> = {
      lang: typeof lang === "string" ? (lang as any) : undefined,
      version: typeof version === "string" ? (version as any) : undefined,
      filename: typeof filename === "string" ? filename : undefined,
    };

    if (typeof planStr === "string") {
      try {
        out.plan = JSON.parse(planStr) as DevelopmentPlanV1;
      } catch {}
    }

    return out;
  }

  try {
    return (await req.json()) as Partial<PdfRequest>;
  } catch {
    return {};
  }
}

export async function POST(req: Request) {
  let browser: any = null;

  try {
    const body = await parseBody(req);

    if (!body?.plan) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message:
            "[PDP] Missing 'plan' in request body. Expected POST JSON: { plan, lang?: 'nl'|'en', version?: 'staff'|'player', filename?: string }",
        },
        { status: 400 }
      );
    }

    const plan = body.plan as DevelopmentPlanV1;
    const lang: Lang = inferLang(body.lang, plan);
    const version: PlanVersion = inferVersion(body.version);

    const html = renderPdpHtml(plan, { lang, version });

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: {
        width: 1080,
        height: 1920,
        deviceScaleFactor: 2,
      },
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    const u8 =
      pdfBytes instanceof Uint8Array ? pdfBytes : new Uint8Array(pdfBytes);
    const arrayBuffer = toTrueArrayBuffer(u8);

    const base = safeStr(body.filename, buildFilenameBase(plan, lang, version));
    const filenameAscii = safeAsciiFilename(base);
    const filenameStar = `UTF-8''${encodeURIComponent(base)}`;

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameAscii}"; filename*=${filenameStar}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    const message =
      err?.message || (typeof err === "string" ? err : "Unknown error");
    console.error("PDP_PDF_ERROR:", err);
    return NextResponse.json(
      { error: "PDF generation failed", message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "Method Not Allowed",
      message: "[PDP] Use POST and send JSON body with { plan }.",
    },
    { status: 405 }
  );
}