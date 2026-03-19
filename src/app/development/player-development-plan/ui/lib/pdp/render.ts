// src/app/development/player-development-plan/ui/lib/pdp/render.ts

import type {
  DevelopmentPlanV1,
  Slide2Agreement,
  Slide3Baseline,
  Slide3Diagnosis,
  Slide3VideoClip,
  Slide4DevelopmentRoute,
  Slide6SuccessDefinition,
} from "../engineSchema";
import { buildTheme } from "./theme";
import {
  pageAgreementContract,
  pageContext,
  pageDiagnosis,
  pageDevelopmentRoute,
  pageSuccessDefinition,
  type Lang,
  type Slide3VideoSlot,
} from "./pages";
import { pageCoverLocked } from "./pages.cover";

type PlanVersion = "staff" | "player";

function asArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x) => typeof x === "string" && x.trim()).map((x) => x.trim())
    : [];
}

function safeStr(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return fallback;
  if (/^[-—–\s]+$/.test(s)) return fallback;
  return s;
}

function upperClean(s: string) {
  return (s || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function t(lang: Lang, nl: string, en: string) {
  return lang === "nl" ? nl : en;
}

function parseDateLoose(s: string): Date | null {
  const v = (s || "").trim();
  if (!v) return null;

  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return Number.isFinite(d.getTime()) ? d : null;
  }

  const dmy = v.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dmy) {
    const d = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    return Number.isFinite(d.getTime()) ? d : null;
  }

  const parsed = Date.parse(v);
  if (Number.isFinite(parsed)) return new Date(parsed);

  return null;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateNL(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function normalizeVideoSlots(
  clips: Slide3VideoClip[] | undefined,
  lang: Lang
): Slide3VideoSlot[] {
  const raw: Slide3VideoClip[] = Array.isArray(clips) ? clips.slice(0, 2) : [];
  const xs = [...raw];
  while (xs.length < 2) xs.push({ status: "pending" });

  return xs.map((c) => {
    const isActive =
      c?.status === "active" &&
      typeof c?.url === "string" &&
      c.url.trim().length > 0;

    return {
      status: isActive ? "active" : "pending",
      title: safeStr(c?.title, ""),
      match_or_session: safeStr(c?.match_or_session, ""),
      timestamp: safeStr(c?.timestamp, ""),
      source:
        c?.source === "match" || c?.source === "training"
          ? c.source
          : undefined,
      url: typeof c?.url === "string" ? c.url : null,
      thumbnail_url:
        typeof c?.thumbnail_url === "string" ? c.thumbnail_url : null,
      pendingTitle: t(lang, "Video pending", "Video pending"),
      pendingSub: t(lang, "Observatie loopt", "Observation in progress"),
    };
  });
}

function deriveBaselineFromLegacy(
  legacy: Slide3Diagnosis | undefined,
  lang: Lang
) {
  const s3 = legacy || ({} as Slide3Diagnosis);

  return {
    title: safeStr(s3?.title, ""),
    subtitle: safeStr(s3?.subtitle, ""),
    intro: "",
    momentItems: asArray(s3?.moment?.items).slice(0, 3),
    whatWeSeeItems: asArray(s3?.what_we_see?.items).slice(0, 3),
    effectItems: asArray(s3?.effect_on_match?.items).slice(0, 3),
    videoSlots: normalizeVideoSlots(s3?.video_clips, lang),
  };
}

function deriveBaselineFromPreferred(
  baseline: Slide3Baseline | undefined,
  lang: Lang
) {
  if (!baseline) return null;

  return {
    title: safeStr(baseline.title, ""),
    subtitle: safeStr(baseline.subtitle, ""),
    intro: safeStr(baseline.intro, ""),
    momentItems: asArray(baseline.moments).slice(0, 3),
    whatWeSeeItems: asArray(baseline.observations).slice(0, 3),
    effectItems: asArray(baseline.matchEffects).slice(0, 3),
    videoSlots: normalizeVideoSlots(baseline.videoClips, lang),
  };
}

export function renderPdpHtmlPro(
  plan: DevelopmentPlanV1,
  opts?: { version?: PlanVersion; lang?: Lang }
) {
  const lang: Lang =
    opts?.lang || ((plan?.meta?.lang === "en" ? "en" : "nl") as Lang);

  const theme = buildTheme({
    primaryHex: plan?.brand?.primaryColor || "#111111",
    secondaryHex: plan?.brand?.secondaryColor || "#FFFFFF",
    colorBalance: plan?.brand?.colorBalance ?? 75,
  });

  const clubName = safeStr(plan.brand?.clubName || plan.meta?.club, "Club");
  const logoUrl = safeStr(plan.brand?.logoUrl, "");
  const headshotUrl = safeStr(plan.player?.headshotUrl, "");
  const playerName = safeStr(
    plan.player?.name,
    lang === "nl" ? "Speler" : "Player"
  );
  const accentHex = plan?.brand?.primaryColor || "#111111";

  const headline = upperClean(safeStr((plan as any)?.cover?.headline, ""));

  const s2: Partial<Slide2Agreement> = plan.slide2 ?? {};

  const weeks = Number(plan?.meta?.blockLengthWeeks || 8);
  const safeWeeks = Number.isFinite(weeks)
    ? Math.max(1, Math.min(52, weeks))
    : 8;

  const durationWeeksLabel =
    lang === "nl" ? `${safeWeeks} WEKEN` : `${safeWeeks} WEEKS`;

  const rawStart =
    safeStr(s2.startDate, "") ||
    safeStr((plan as any)?.meta?.blockStartISO, "") ||
    safeStr((plan as any)?.meta?.blockStartLabel, "");

  const rawEnd =
    safeStr(s2.endDate, "") ||
    safeStr((plan as any)?.meta?.blockEndISO, "") ||
    safeStr((plan as any)?.meta?.blockEndLabel, "");

  const startDate = parseDateLoose(rawStart) || new Date();
  const endDate = parseDateLoose(rawEnd) || addDays(startDate, safeWeeks * 7);

  const startDateLabel = formatDateNL(startDate);
  const endDateLabel = formatDateNL(endDate);

  /**
   * Slide 2
   */
  const focusBehaviour = safeStr(s2.focusBehaviour, "");
  const targetBehaviour = safeStr(s2.developmentGoal, "");
  const matchSituation =
    typeof s2.matchSituation === "string" ? s2.matchSituation : "";

  /**
   * Slide 3 - Context
   */
  const slideContext = plan.slideContext || {};
  const contextGameMoments = asArray(slideContext.gameMoments).slice(0, 3);
  const contextZones = asArray(slideContext.zones).slice(0, 3);
  const contextPrinciples = asArray(slideContext.principles).slice(0, 3);

  /**
   * Slide 4 - Realiteit
   */
  const preferred = deriveBaselineFromPreferred(plan.slide3Baseline, lang);
  const baseline = preferred || deriveBaselineFromLegacy(plan.slide3, lang);

  /**
   * Slide 5 - Aanpak
   */
  const s4: Slide4DevelopmentRoute = plan.slide4DevelopmentRoute || {};
  const route = s4.developmentRoute || {};
  const responsibilities = s4.responsibilities || {};

  const s4Title = safeStr(s4.title, "");
  const s4Subtitle = safeStr(s4.subtitle, "");

  const trainingText = safeStr(route.training, "");
  const matchText = safeStr(route.match, "");
  const videoText = safeStr(route.video, "");
  const offFieldText = safeStr(route.off_field, "");

  const playerOwnText = safeStr(s4.playerOwnText, "");

  const playerText = safeStr(responsibilities.player, "");
  const coachText = safeStr(responsibilities.coach, "");
  const analystText = safeStr(responsibilities.analyst, "");
  const staffText = safeStr(responsibilities.staff, "");

  /**
   * Slide 6 - Succesdefinitie
   */
  const s6: Slide6SuccessDefinition = plan.slide6SuccessDefinition || {};
  const successInGame = asArray(s6.inGame).slice(0, 3);
  const successBehaviour = asArray(s6.behaviour).slice(0, 3);
  const successSignals = asArray(s6.signals).slice(0, 3);

  const pages = [
    pageCoverLocked({
      clubName,
      logoUrl,
      accentHex,
      playerName,
      headshotUrl,
      headline,
      systemLine: "PERFORMANCE DEVELOPMENT SYSTEM",
    }),

    pageAgreementContract({
      lang,
      accentHex,
      clubName,
      logoUrl,
      startDateLabel,
      endDateLabel,
      durationWeeksLabel,
      evalLabel: lang === "nl" ? "EVALUATIE" : "EVALUATION",
      focusBehaviour,
      targetBehaviour,
      matchSituation,
    }),

    pageContext({
      lang,
      accentHex,
      clubName,
      logoUrl,
      gameMoments: contextGameMoments,
      zones: contextZones,
      principles: contextPrinciples,
    }),

    pageDiagnosis({
      lang,
      accentHex,
      clubName,
      logoUrl,
      playerName,
      title: baseline.title,
      subtitle: baseline.subtitle,
      intro: baseline.intro,
      metricName: "",
      metricDefinition: "",
      currentValue: "",
      targetValue: "",
      progressPct01: 0,
      startDateLabel,
      endDateLabel,
      momentItems: baseline.momentItems,
      whatWeSeeItems: baseline.whatWeSeeItems,
      effectItems: baseline.effectItems,
      videoSlots: baseline.videoSlots,
    }),

    pageDevelopmentRoute({
      lang,
      accentHex,
      clubName,
      logoUrl,
      title: s4Title,
      subtitle: s4Subtitle,
      trainingText,
      matchText,
      videoText,
      offFieldText,
      playerOwnText,
      playerText,
      coachText,
      analystText,
      staffText,
    }),

    pageSuccessDefinition({
      lang,
      accentHex,
      clubName,
      logoUrl,
      inGameItems: successInGame,
      behaviourItems: successBehaviour,
      signalItems: successSignals,
    }),
  ];

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${lang === "nl" ? "Persoonlijk Ontwikkelplan" : "Player Development Plan"}</title>
  <style>
    @page { size: A4; margin: 14mm; }

    ${theme.cssVarBlock}

    :root{
      --page-h: 297mm;
      --page-margin: 14mm;
      --page-inner-h: calc(var(--page-h) - (2 * var(--page-margin)));
    }

    html, body { margin: 0; padding: 0; background: #fff; color: var(--ink); }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }

    .page{
      break-before: page;
      page-break-before: always;
      height: var(--page-inner-h);
      box-sizing: border-box;
    }

    .page:first-child{
      break-before: auto;
      page-break-before: auto;
    }

    .kicker { font-size: 9.5pt; letter-spacing: .18em; text-transform: uppercase; color: var(--ink-soft); }
    .h2 { font-size: 22pt; line-height: 1.08; letter-spacing: -0.01em; margin: 0; }
    .h3 { font-size: 16pt; line-height: 1.15; margin: 0; letter-spacing: -0.01em; }
    .p { font-size: 12.8pt; line-height: 1.55; color: var(--ink-muted); margin: 0; }
    .strong { color: var(--ink); font-weight: 600; }
  </style>
</head>
<body>
  ${pages.join("\n")}
</body>
</html>`;
}

export const renderPdpHtml = renderPdpHtmlPro;