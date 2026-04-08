import type {
  DevelopmentPlanV1,
  Lang,
  PlanVersion,
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
  pageSuccess,
  type Lang as PageLang,
  type Slide3VideoSlot,
} from "./pages";
import { pageCoverLocked } from "./pages.cover";

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

function localText(lang: Lang, values: Record<Lang, string>) {
  return values[lang] || values.en;
}

/**
 * Tijdelijke brug:
 * als ./pages nog alleen nl/en ondersteunt, vallen de overige talen terug op en.
 * Zodra ./pages ook 6-talig is, kan deze helper weg.
 */
function toPageLang(lang: Lang): PageLang {
  return lang === "nl" ? "nl" : "en";
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

function formatDateByLang(d: Date, lang: Lang) {
  if (lang === "nl") {
    const dd = pad2(d.getDate());
    const mm = pad2(d.getMonth() + 1);
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  const localeMap: Record<Lang, string> = {
    nl: "nl-NL",
    en: "en-GB",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    fr: "fr-FR",
  };

  return new Intl.DateTimeFormat(localeMap[lang], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function stripTrailingSlash(v: string) {
  return v.replace(/\/+$/, "");
}

function resolveAssetUrl(input: string, baseUrl: string) {
  const s = safeStr(input, "");
  if (!s) return "";

  if (/^data:/i.test(s)) return s;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^\/\//.test(s)) return `https:${s}`;

  const cleanBase = stripTrailingSlash(baseUrl || "");
  if (!cleanBase) return s;

  if (s.startsWith("/")) return `${cleanBase}${s}`;
  return `${cleanBase}/${s}`;
}

/**
 * -----------------------------
 * De-duplication helpers
 * -----------------------------
 */

function normalizeCompareText(input: string) {
  return safeStr(input, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(
      /\b(the|a|an|to|of|and|or|in|on|at|for|with|without|after|before|under|over|into|from|via|through|his|her|their)\b/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeCompareText(input: string) {
  return normalizeCompareText(input)
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x.length >= 3);
}

function similarityRatio(a: string, b: string) {
  const ta = tokenizeCompareText(a);
  const tb = tokenizeCompareText(b);

  if (!ta.length || !tb.length) return 0;

  const setA = new Set(ta);
  const setB = new Set(tb);

  let overlap = 0;
  for (const token of setA) {
    if (setB.has(token)) overlap += 1;
  }

  return overlap / Math.max(setA.size, setB.size);
}

function isNearDuplicate(a: string, b: string) {
  const na = normalizeCompareText(a);
  const nb = normalizeCompareText(b);

  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) {
    if (Math.min(na.length, nb.length) >= 18) return true;
  }

  return similarityRatio(a, b) >= 0.72;
}

function uniqueMeaningfulList(
  items: string[],
  opts?: {
    max?: number;
    minKeep?: number;
    against?: string[];
  }
) {
  const max = opts?.max ?? items.length;
  const minKeep = opts?.minKeep ?? 0;
  const against = (opts?.against || []).filter(Boolean);

  const cleaned = items.map((x) => safeStr(x)).filter(Boolean);

  const kept: string[] = [];

  for (const item of cleaned) {
    const duplicateInOwn = kept.some((k) => isNearDuplicate(item, k));
    if (duplicateInOwn) continue;

    const duplicateAgainst = against.some((ref) => isNearDuplicate(item, ref));
    if (duplicateAgainst) continue;

    kept.push(item);
    if (kept.length >= max) break;
  }

  if (kept.length >= minKeep) return kept.slice(0, max);

  const fallback: string[] = [];
  for (const item of cleaned) {
    if (fallback.some((k) => isNearDuplicate(item, k))) continue;
    fallback.push(item);
    if (fallback.length >= Math.max(minKeep, max)) break;
  }

  return fallback.slice(0, max);
}

function collectReferenceStrings(values: unknown[]): string[] {
  const out: string[] = [];

  for (const value of values) {
    if (typeof value === "string") {
      const s = safeStr(value);
      if (s) out.push(s);
      continue;
    }

    if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === "string") {
          const s = safeStr(v);
          if (s) out.push(s);
        }
      }
    }
  }

  return out;
}

function normalizeVideoSlots(
  clips: Slide3VideoClip[] | undefined,
  lang: Lang,
  baseUrl: string
): Slide3VideoSlot[] {
  const raw: Slide3VideoClip[] = Array.isArray(clips) ? clips.slice(0, 2) : [];
  const xs = [...raw];
  while (xs.length < 2) xs.push({ status: "pending" });

  return xs.map((c) => {
    const resolvedUrl = resolveAssetUrl(
      typeof c?.url === "string" ? c.url : "",
      baseUrl
    );
    const resolvedThumb = resolveAssetUrl(
      typeof c?.thumbnail_url === "string" ? c.thumbnail_url : "",
      baseUrl
    );

    const isActive =
      c?.status === "active" &&
      typeof resolvedUrl === "string" &&
      resolvedUrl.trim().length > 0;

    return {
      status: isActive ? "active" : "pending",
      title: safeStr(c?.title, ""),
      match_or_session: safeStr(c?.match_or_session, ""),
      timestamp: safeStr(c?.timestamp, ""),
      source:
        c?.source === "match" || c?.source === "training"
          ? c.source
          : undefined,
      url: resolvedUrl || null,
      thumbnail_url: resolvedThumb || null,
      pendingTitle: localText(lang, {
        nl: "Video pending",
        en: "Video pending",
        de: "Video ausstehend",
        es: "Vídeo pendiente",
        it: "Video in sospeso",
        fr: "Vidéo en attente",
      }),
      pendingSub: localText(lang, {
        nl: "Observatie loopt",
        en: "Observation in progress",
        de: "Beobachtung läuft",
        es: "Observación en curso",
        it: "Osservazione in corso",
        fr: "Observation en cours",
      }),
    };
  });
}

function deriveBaselineFromLegacy(
  legacy: Slide3Diagnosis | undefined,
  lang: Lang,
  baseUrl: string
) {
  const s3 = legacy || ({} as Slide3Diagnosis);

  return {
    title: safeStr(s3?.title, ""),
    subtitle: safeStr(s3?.subtitle, ""),
    intro: "",
    momentItems: asArray(s3?.moment?.items).slice(0, 3),
    whatWeSeeItems: asArray(s3?.what_we_see?.items).slice(0, 3),
    effectItems: asArray(s3?.effect_on_match?.items).slice(0, 3),
    videoSlots: normalizeVideoSlots(s3?.video_clips, lang, baseUrl),
  };
}

function deriveBaselineFromPreferred(
  baseline: Slide3Baseline | undefined,
  lang: Lang,
  baseUrl: string
) {
  if (!baseline) return null;

  return {
    title: safeStr(baseline.title, ""),
    subtitle: safeStr(baseline.subtitle, ""),
    intro: safeStr(baseline.intro, ""),
    momentItems: asArray(baseline.moments).slice(0, 3),
    whatWeSeeItems: asArray(baseline.observations).slice(0, 3),
    effectItems: asArray(baseline.matchEffects).slice(0, 3),
    videoSlots: normalizeVideoSlots(baseline.videoClips, lang, baseUrl),
  };
}

export function renderPdpHtmlPro(
  plan: DevelopmentPlanV1,
  opts?: { version?: PlanVersion; lang?: Lang; baseUrl?: string }
) {
  const inferredLang = plan?.meta?.lang;
  const lang: Lang =
    opts?.lang ||
    (inferredLang === "nl" ||
    inferredLang === "en" ||
    inferredLang === "de" ||
    inferredLang === "es" ||
    inferredLang === "it" ||
    inferredLang === "fr"
      ? inferredLang
      : "nl");

  const pageLang = toPageLang(lang);
  const baseUrl = stripTrailingSlash(opts?.baseUrl || "https://www.ftbll.ai");

  const theme = buildTheme({
    primaryHex: plan?.brand?.primaryColor || "#111111",
    secondaryHex: plan?.brand?.secondaryColor || "#FFFFFF",
    colorBalance: plan?.brand?.colorBalance ?? 75,
  });

  const clubName = safeStr(plan.brand?.clubName || plan.meta?.club, "Club");
  const logoUrl = resolveAssetUrl(safeStr(plan.brand?.logoUrl, ""), baseUrl);
  const headshotUrl = resolveAssetUrl(
    safeStr(plan.player?.headshotUrl, ""),
    baseUrl
  );

  const playerName = safeStr(
    plan.player?.name,
    localText(lang, {
      nl: "Speler",
      en: "Player",
      de: "Spieler",
      es: "Jugador",
      it: "Giocatore",
      fr: "Joueur",
    })
  );

  const accentHex = plan?.brand?.primaryColor || "#111111";

  const headline = upperClean(safeStr((plan as any)?.cover?.headline, ""));

  const s2: Partial<Slide2Agreement> = plan.slide2 ?? {};

  const weeks = Number(plan?.meta?.blockLengthWeeks || 8);
  const safeWeeks = Number.isFinite(weeks)
    ? Math.max(1, Math.min(52, weeks))
    : 8;

  const durationWeeksLabel = localText(lang, {
    nl: `${safeWeeks} WEKEN`,
    en: `${safeWeeks} WEEKS`,
    de: `${safeWeeks} WOCHEN`,
    es: `${safeWeeks} SEMANAS`,
    it: `${safeWeeks} SETTIMANE`,
    fr: `${safeWeeks} SEMAINES`,
  });

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

  const startDateLabel = formatDateByLang(startDate, lang);
  const endDateLabel = formatDateByLang(endDate, lang);

  const focusBehaviour = safeStr(s2.focusBehaviour, "");
  const targetBehaviour = safeStr(s2.developmentGoal, "");
  const matchSituation =
    typeof s2.matchSituation === "string" ? safeStr(s2.matchSituation, "") : "";

  const slide2Refs = collectReferenceStrings([
    focusBehaviour,
    targetBehaviour,
    matchSituation,
    safeStr(s2.positionRole, ""),
    safeStr(s2.roleDescription, ""),
    safeStr(s2.teamContext, ""),
  ]);

  const slideContext = plan.slideContext || {};

  const contextGameMomentsRaw = asArray(slideContext.gameMoments).slice(0, 3);
  const contextZonesRaw = asArray(slideContext.zones).slice(0, 3);
  const contextPrinciplesRaw = asArray(slideContext.principles).slice(0, 3);

  const contextGameMoments = uniqueMeaningfulList(contextGameMomentsRaw, {
    max: 3,
    against: [matchSituation],
  });

  const contextZones = uniqueMeaningfulList(contextZonesRaw, {
    max: 3,
  });

  const contextPrinciples = uniqueMeaningfulList(contextPrinciplesRaw, {
    max: 3,
    against: [...slide2Refs, ...contextGameMoments],
  });

  const preferred = deriveBaselineFromPreferred(
    plan.slide3Baseline,
    lang,
    baseUrl
  );
  const baselineRaw =
    preferred || deriveBaselineFromLegacy(plan.slide3, lang, baseUrl);

  const baselineMomentItems = uniqueMeaningfulList(baselineRaw.momentItems, {
    max: 3,
    against: [matchSituation, ...contextGameMoments],
  });

  const baselineWhatWeSeeItems = uniqueMeaningfulList(
    baselineRaw.whatWeSeeItems,
    {
      max: 3,
      against: [focusBehaviour, targetBehaviour],
    }
  );

  const baselineEffectItems = uniqueMeaningfulList(baselineRaw.effectItems, {
    max: 3,
    against: [focusBehaviour, ...baselineWhatWeSeeItems],
  });

  const baseline = {
    ...baselineRaw,
    momentItems: baselineMomentItems,
    whatWeSeeItems: baselineWhatWeSeeItems,
    effectItems: baselineEffectItems,
  };

  const baselineRefs = collectReferenceStrings([
    baselineMomentItems,
    baselineWhatWeSeeItems,
    baselineEffectItems,
  ]);

  const s4: Slide4DevelopmentRoute = plan.slide4DevelopmentRoute || {};
  const route = s4.developmentRoute || {};
  const responsibilities = s4.responsibilities || {};

  const s4Title = safeStr(s4.title, "");
  const s4Subtitle = safeStr(s4.subtitle, "");

  let trainingText = safeStr(route.training, "");
  let matchText = safeStr(route.match, "");
  let videoText = safeStr(route.video, "");
  let offFieldText = safeStr(route.off_field, "");

  const playerOwnText = safeStr(s4.playerOwnText, "");

  const playerText = safeStr(responsibilities.player, "");
  const coachText = safeStr(responsibilities.coach, "");
  const analystText = safeStr(responsibilities.analyst, "");
  const staffText = safeStr(responsibilities.staff, "");

  const routeTextsRaw = [trainingText, matchText, videoText, offFieldText].filter(
    Boolean
  );

  const dedupedRouteTexts = uniqueMeaningfulList(routeTextsRaw, {
    max: 4,
    against: [...slide2Refs, ...baselineRefs],
  });

  const routePool = [...dedupedRouteTexts];
  const orderedOriginals = [trainingText, matchText, videoText, offFieldText];

  function takeBestRouteValue(original: string) {
    const idx = routePool.findIndex(
      (x) =>
        isNearDuplicate(x, original) ||
        normalizeCompareText(x) === normalizeCompareText(original)
    );

    if (idx >= 0) {
      const [value] = routePool.splice(idx, 1);
      return value;
    }

    return "";
  }

  trainingText = takeBestRouteValue(orderedOriginals[0]);
  matchText = takeBestRouteValue(orderedOriginals[1]);
  videoText = takeBestRouteValue(orderedOriginals[2]);
  offFieldText = takeBestRouteValue(orderedOriginals[3]);

  const routeRefs = collectReferenceStrings([
    trainingText,
    matchText,
    videoText,
    offFieldText,
    playerOwnText,
    playerText,
    coachText,
    analystText,
    staffText,
  ]);

  const s6: Slide6SuccessDefinition = plan.slide6SuccessDefinition || {};

  const successInGameRaw = asArray(s6.inGame).slice(0, 3);
  const successBehaviourRaw = asArray(s6.behaviour).slice(0, 3);
  const successSignalsRaw = asArray(s6.signals).slice(0, 3);

  const successInGame = uniqueMeaningfulList(successInGameRaw, {
    max: 3,
    against: [...slide2Refs, ...baselineEffectItems],
  });

  const successBehaviour = uniqueMeaningfulList(successBehaviourRaw, {
    max: 3,
    against: [...slide2Refs, ...baselineWhatWeSeeItems, ...routeRefs],
  });

  const successSignals = uniqueMeaningfulList(successSignalsRaw, {
    max: 3,
    against: [...slide2Refs, ...routeRefs, ...successBehaviour, ...successInGame],
  });

  const pages = [
    pageCoverLocked({
      lang: pageLang,
      clubName,
      logoUrl,
      accentHex,
      playerName,
      headshotUrl,
      headline,
      systemLine: localText(lang, {
        nl: "PERFORMANCE DEVELOPMENT SYSTEM",
        en: "PERFORMANCE DEVELOPMENT SYSTEM",
        de: "PERFORMANCE DEVELOPMENT SYSTEM",
        es: "PERFORMANCE DEVELOPMENT SYSTEM",
        it: "PERFORMANCE DEVELOPMENT SYSTEM",
        fr: "PERFORMANCE DEVELOPMENT SYSTEM",
      }),
    }),

    pageAgreementContract({
      lang: pageLang,
      accentHex,
      clubName,
      logoUrl,
      startDateLabel,
      endDateLabel,
      durationWeeksLabel,
      evalLabel: localText(lang, {
        nl: "EVALUATIE",
        en: "EVALUATION",
        de: "BEWERTUNG",
        es: "EVALUACIÓN",
        it: "VALUTAZIONE",
        fr: "ÉVALUATION",
      }),
      focusBehaviour,
      targetBehaviour,
      matchSituation,
    }),

    pageContext({
      lang: pageLang,
      accentHex,
      clubName,
      logoUrl,
      gameMoments: contextGameMoments,
      zones: contextZones,
      principles: contextPrinciples,
    }),

    pageDiagnosis({
      lang: pageLang,
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
      lang: pageLang,
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

    pageSuccess({
      lang: pageLang,
      accentHex,
      clubName,
      logoUrl,
      inGame: successInGame,
      behaviour: successBehaviour,
      signals: successSignals,
    }),
  ];

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${localText(lang, {
    nl: "Persoonlijk Ontwikkelplan",
    en: "Player Development Plan",
    de: "Persönlicher Entwicklungsplan",
    es: "Plan Personal de Desarrollo",
    it: "Piano Personale di Sviluppo",
    fr: "Plan Personnel de Développement",
  })}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm;
    }

    ${theme.cssVarBlock}

    :root{
      --page-w: 210mm;
      --page-h: 297mm;
      --page-margin: 14mm;
      --page-inner-w: calc(var(--page-w) - (2 * var(--page-margin)));
      --page-inner-h: calc(var(--page-h) - (2 * var(--page-margin)));
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: var(--ink);
      width: 100%;
    }

    body {
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    * {
      box-sizing: border-box;
    }

    img, svg {
      max-width: 100%;
      display: block;
      image-rendering: auto;
    }

    .page{
      break-before: page;
      page-break-before: always;
      position: relative;
      width: 100%;
      height: var(--page-inner-h);
      min-height: var(--page-inner-h);
      max-height: var(--page-inner-h);
      overflow: hidden;
      box-sizing: border-box;
      isolation: isolate;
    }

    .page:first-child{
      break-before: auto;
      page-break-before: auto;
    }

    .kicker {
      font-size: 9.5pt;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--ink-soft);
    }

    .h2 {
      font-size: 22pt;
      line-height: 1.08;
      letter-spacing: -0.01em;
      margin: 0;
    }

    .h3 {
      font-size: 16pt;
      line-height: 1.15;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .p {
      font-size: 12.8pt;
      line-height: 1.55;
      color: var(--ink-muted);
      margin: 0;
    }

    .strong {
      color: var(--ink);
      font-weight: 600;
    }

    .avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .clip {
      overflow: hidden;
    }

    @media print {
      html, body {
        background: #ffffff !important;
      }

      .page {
        overflow: hidden !important;
      }

      a, a:visited {
        color: inherit;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  ${pages.join("\n")}
</body>
</html>`;
}

export const renderPdpHtml = renderPdpHtmlPro;