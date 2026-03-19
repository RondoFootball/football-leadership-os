// src/app/development/player-development-plan/ui/lib/renderPdfHtml.ts

import type { DevelopmentPlanV1 } from "./engineSchema";
import * as pdpRender from "./pdp/render";

export type PlanVersion = "staff" | "player";
export type Lang = "nl" | "en";

/**
 * Backwards-compatible export used by /api/pdp/pdf
 * Default = staff.
 *
 * Works with either:
 * - renderPdpHtmlPro (preferred)
 * - renderPdpHtml
 * - default export
 */
export function renderPdpHtml(
  plan: DevelopmentPlanV1,
  opts?: { version?: PlanVersion; lang?: Lang }
) {
  const inferredLang: Lang =
    opts?.lang ||
    ((plan as any)?.meta?.lang === "en" ? "en" : "nl");

  const version: PlanVersion = opts?.version || "staff";

  const fnPro = (pdpRender as any).renderPdpHtmlPro;
  if (typeof fnPro === "function") return fnPro(plan, { version, lang: inferredLang });

  const fn = (pdpRender as any).renderPdpHtml;
  if (typeof fn === "function") return fn(plan, { version, lang: inferredLang });

  const def = (pdpRender as any).default;
  if (typeof def === "function") return def(plan, { version, lang: inferredLang });

  throw new Error("[PDP] No renderer export found in ./pdp/render.ts");
}