// src/app/development/player-development-plan/ui/lib/renderPdfHtml.ts

import type {
  DevelopmentPlanV1,
  Lang,
  PlanVersion,
} from "./engineSchema";
import * as pdpRender from "./pdp/render";

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
  const planLang = plan?.meta?.lang;
  const inferredLang: Lang =
    opts?.lang ||
    (planLang === "nl" ||
    planLang === "en" ||
    planLang === "de" ||
    planLang === "es" ||
    planLang === "it" ||
    planLang === "fr"
      ? planLang
      : "nl");

  const version: PlanVersion = opts?.version || "staff";

  const fnPro = (pdpRender as any).renderPdpHtmlPro;
  if (typeof fnPro === "function") {
    return fnPro(plan, { version, lang: inferredLang });
  }

  const fn = (pdpRender as any).renderPdpHtml;
  if (typeof fn === "function") {
    return fn(plan, { version, lang: inferredLang });
  }

  const def = (pdpRender as any).default;
  if (typeof def === "function") {
    return def(plan, { version, lang: inferredLang });
  }

  throw new Error("[PDP] No renderer export found in ./pdp/render.ts");
}