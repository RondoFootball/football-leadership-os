import type { DevelopmentPlanV1, FocusItemV1 } from "./engineSchema";

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeStringArray(value: unknown, max = 3): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => safeString(item))
    .filter(Boolean)
    .slice(0, max);
}

function pickMax3(focus: FocusItemV1[]) {
  return Array.isArray(focus) ? focus.slice(0, 3) : [];
}

function normalizeFocusItem(item: FocusItemV1): FocusItemV1 {
  return {
    ...item,
    id: safeString(item?.id),
    title: safeString(item?.title),
    type: item?.type,
    context: safeString(item?.context),
    goodLooksLike: safeString(item?.goodLooksLike),
    playerActions: safeStringArray(item?.playerActions, 6),
    staffActions: safeStringArray(item?.staffActions, 6),
    constraints: safeString(item?.constraints),
    riskIfOverloaded: safeString(item?.riskIfOverloaded),
  };
}

/**
 * v1 generator: evidence-based + non-inventing
 * - Structures only what is already present
 * - Leaves fields empty if they are not supported by user input / chat evidence
 * - Never auto-fills substantive football content without basis
 */
export function generatePlanV1(input: DevelopmentPlanV1): DevelopmentPlanV1 {
  const p = structuredClone(input);

  // Defensive object guards
  p.meta = p.meta || ({} as DevelopmentPlanV1["meta"]);
  p.brand = p.brand || ({} as DevelopmentPlanV1["brand"]);
  p.player = p.player || ({} as DevelopmentPlanV1["player"]);
  p.diagnosis = p.diagnosis || ({} as DevelopmentPlanV1["diagnosis"]);
  p.priority = p.priority || ({} as DevelopmentPlanV1["priority"]);
  p.clubModel = p.clubModel || ({} as DevelopmentPlanV1["clubModel"]);
  p.notNow = p.notNow || ({} as DevelopmentPlanV1["notNow"]);
  p.focus = Array.isArray(p.focus) ? p.focus : [];

  // Minimal non-substantive guards only
  p.meta.club = safeString(p.meta.club) || safeString(p.brand.clubName);
  p.meta.team = safeString(p.meta.team) || safeString(p.player.team);

  p.brand.clubName = safeString(p.brand.clubName);
  p.brand.logoUrl = safeString(p.brand.logoUrl);
  p.brand.primaryColor = safeString(p.brand.primaryColor);
  p.brand.secondaryColor = safeString(p.brand.secondaryColor);

  p.player.name = safeString(p.player.name);
  p.player.role = safeString(p.player.role);
  p.player.team = safeString(p.player.team);
  p.player.headshotUrl = safeString(p.player.headshotUrl);
  // p.player.phase intentionally left untouched:
  // this is a typed domain field, not a free string

  p.diagnosis.initialIntent = safeString(p.diagnosis.initialIntent);
  p.diagnosis.dominantDevelopmentObject = safeString(
    p.diagnosis.dominantDevelopmentObject
  );

  p.priority.title = safeString(p.priority.title);
  p.priority.whyNow = safeString(p.priority.whyNow);
  p.priority.observableShift = safeString(p.priority.observableShift);

  p.clubModel.dominantGameModel = safeString(p.clubModel.dominantGameModel);
  p.clubModel.roleInModel = safeString(p.clubModel.roleInModel);
  p.clubModel.nonNegotiables = safeString(p.clubModel.nonNegotiables);
  p.clubModel.criticalPhase = safeString(p.clubModel.criticalPhase);

  // Focus: keep only what exists, max 3, normalized
  p.focus = pickMax3(p.focus)
    .map(normalizeFocusItem)
    .filter((item) => {
      return !!(
        safeString(item.id) ||
        safeString(item.title) ||
        safeString(item.context) ||
        safeString(item.goodLooksLike) ||
        item.playerActions?.length ||
        item.staffActions?.length ||
        safeString(item.constraints) ||
        safeString(item.riskIfOverloaded)
      );
    });

  // Not now: keep only if present, never invent reasoning
  p.notNow.excludedFocus = safeStringArray(p.notNow.excludedFocus, 6);
  p.notNow.reasoning = safeString(p.notNow.reasoning);

  // Evaluation: initialize safely, but do not invent substantive content
  const evaluation =
    p.evaluation ??
    (p.evaluation = {
      reviewMoment: "",
      decisionCriteria: "",
      shortTermMarker: "",
      midTermMarker: "",
    });

  evaluation.reviewMoment = safeString(evaluation.reviewMoment);
  evaluation.decisionCriteria = safeString(evaluation.decisionCriteria);
  evaluation.shortTermMarker = safeString(evaluation.shortTermMarker);
  evaluation.midTermMarker = safeString(evaluation.midTermMarker);

  return p;
}