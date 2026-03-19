// src/app/development/player-development-plan/ui/lib/pdp/downloadPdf.ts

import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";

export type Lang = "nl" | "en";
export type PlanVersion = "staff" | "player";

function inferLang(plan: any, fallback: Lang = "nl"): Lang {
  return plan?.meta?.lang === "en" ? "en" : fallback;
}

function filenameFromContentDisposition(cd: string): string | null {
  const header = cd || "";

  // Prefer RFC5987 filename*
  // Example: filename*=UTF-8''Player%20Development%20Plan%20-%20Staff%20-%20...
  const star = /filename\*\s*=\s*([^;]+)/i.exec(header);
  if (star?.[1]) {
    const v = star[1].trim();
    const m = /^UTF-8''(.+)$/i.exec(v);
    if (m?.[1]) {
      try {
        return decodeURIComponent(m[1]);
      } catch {
        // ignore
      }
    }
  }

  // Fallback: filename="..."
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
  const { plan, version } = args;

  // Hard gate: no plan = no request (prevents 400)
  if (!plan) {
    throw new Error("Geen plan beschikbaar. Start eerst het gesprek en genereer het plan.");
  }

  const lang = args.lang ?? inferLang(plan, "nl");
  const filename = args.filename;

  const res = await fetch("/api/pdp/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, version, lang, filename }),
  });

  if (!res.ok) {
    // Best-effort: try JSON, else try text
    let msg = `PDF download failed (HTTP ${res.status}).`;
    try {
      const j = await res.json();
      msg = j?.message || j?.error || msg;
    } catch {
      try {
        const t = await res.text();
        if (t?.trim()) msg = `${msg}\n\n${t.slice(0, 1200)}`;
      } catch {
        // ignore
      }
    }
    throw new Error(msg);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  // Filename priority:
  // 1) explicit arg.filename
  // 2) header Content-Disposition (filename* or filename)
  // 3) fallback
  const cd = res.headers.get("content-disposition") || "";
  const headerName = filenameFromContentDisposition(cd);
  const dlName = filename || headerName || `pdp-${version}.pdf`;

  const a = document.createElement("a");
  a.href = url;
  a.download = dlName;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}