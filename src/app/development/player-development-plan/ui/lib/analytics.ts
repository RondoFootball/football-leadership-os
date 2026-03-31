import { track } from "@vercel/analytics";

export type AnalyticsLang = "nl" | "en";
export type AnalyticsMode = "chat" | "manual";
export type AnalyticsDownloadVersion = "player" | "staff";

type Primitive = string | number | boolean | null | undefined;

type BaseMeta = {
  lang: AnalyticsLang;
  mode: AnalyticsMode;
};

type DownloadMeta = BaseMeta & {
  version: AnalyticsDownloadVersion;
  exportLang: AnalyticsLang;
  totalProgress: number;
  club: string;
  country?: string;
  league?: string;
  team?: string;
  hasPhoto: boolean;
  usedGeneratedPlan: boolean;
};

function cleanString(value: unknown, fallback = "unknown") {
  const s = typeof value === "string" ? value.trim() : "";
  return s || fallback;
}

function cleanOptionalString(value: unknown) {
  const s = typeof value === "string" ? value.trim() : "";
  return s || undefined;
}

function cleanNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.round(n);
}

function cleanBoolean(value: unknown) {
  return !!value;
}

function sanitizePayload<T extends Record<string, Primitive>>(payload: T) {
  const out: Record<string, Primitive> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;

    if (typeof value === "string") {
      out[key] = value.trim().slice(0, 120);
      continue;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      out[key] = value;
    }
  }

  return out;
}

function safeTrack(eventName: string, payload?: Record<string, Primitive>) {
  try {
    track(eventName, payload ? sanitizePayload(payload) : undefined);
  } catch {
    // analytics should never break product flow
  }
}

/**
 * Core builder visibility
 */
export function trackPdpBuilderViewed(meta: BaseMeta) {
  safeTrack("PDP Builder Viewed", {
    lang: meta.lang,
    mode: meta.mode,
  });
}

export function trackPdpModeChanged(meta: BaseMeta) {
  safeTrack("PDP Mode Changed", {
    lang: meta.lang,
    mode: meta.mode,
  });
}

export function trackPdpLanguageChanged(meta: BaseMeta) {
  safeTrack("PDP Language Changed", {
    lang: meta.lang,
    mode: meta.mode,
  });
}

/**
 * First meaningful intent
 */
export function trackPdpStarted(
  meta: BaseMeta & {
    source: string;
  }
) {
  safeTrack("PDP Started", {
    lang: meta.lang,
    mode: meta.mode,
    source: cleanString(meta.source),
  });
}

/**
 * Field-level signals
 * Use this only once per field in the session to avoid noise.
 */
export function trackPdpFieldStarted(
  meta: BaseMeta & {
    field: string;
    value?: string | number | boolean;
  }
) {
  safeTrack("PDP Field Started", {
    lang: meta.lang,
    mode: meta.mode,
    field: cleanString(meta.field),
    value:
      typeof meta.value === "string"
        ? cleanString(meta.value)
        : typeof meta.value === "number"
        ? cleanNumber(meta.value)
        : typeof meta.value === "boolean"
        ? cleanBoolean(meta.value)
        : undefined,
  });
}

/**
 * Stronger product/market signals
 */
export function trackPdpClubContextSelected(
  meta: BaseMeta & {
    country?: string;
    league?: string;
    club?: string;
    teamType?: string;
    team?: string;
    clubMode?: "preset" | "custom";
  }
) {
  safeTrack("PDP Club Context Selected", {
    lang: meta.lang,
    mode: meta.mode,
    country: cleanOptionalString(meta.country),
    league: cleanOptionalString(meta.league),
    club: cleanOptionalString(meta.club),
    teamType: cleanOptionalString(meta.teamType),
    team: cleanOptionalString(meta.team),
    clubMode: cleanOptionalString(meta.clubMode),
  });
}

export function trackPdpBrandingEdited(
  meta: BaseMeta & {
    changedField:
      | "primaryColor"
      | "secondaryColor"
      | "tertiaryColor"
      | "colorBalance"
      | "logoUrl";
  }
) {
  safeTrack("PDP Branding Edited", {
    lang: meta.lang,
    mode: meta.mode,
    changedField: meta.changedField,
  });
}

/**
 * Workspace behavior
 */
export function trackPdpHintUsed(meta: BaseMeta & { hintLabel?: string }) {
  safeTrack("PDP Hint Used", {
    lang: meta.lang,
    mode: meta.mode,
    hintLabel: cleanOptionalString(meta.hintLabel),
  });
}

export function trackPdpPlanGenerated(
  meta: BaseMeta & {
    via: "chat";
  }
) {
  safeTrack("PDP Plan Generated", {
    lang: meta.lang,
    mode: meta.mode,
    via: meta.via,
  });
}

export function trackPdpEvidenceAdded(
  meta: BaseMeta & {
    type: "video";
    clipIndex: number;
    method?: "upload" | "url";
  }
) {
  safeTrack("PDP Evidence Added", {
    lang: meta.lang,
    mode: meta.mode,
    type: meta.type,
    clipIndex: cleanNumber(meta.clipIndex),
    method: cleanOptionalString(meta.method),
  });
}

export function trackPdpEvidencePanelToggled(
  meta: BaseMeta & {
    panel: "video";
    state: "open" | "close";
  }
) {
  safeTrack("PDP Evidence Panel Toggled", {
    lang: meta.lang,
    mode: meta.mode,
    panel: meta.panel,
    state: meta.state,
  });
}

/**
 * Funnel progression
 */
export function trackPdpSectionCompleted(
  meta: BaseMeta & {
    section:
      | "basics"
      | "cover"
      | "agreement"
      | "context"
      | "reality"
      | "approach"
      | "success"
      | "evidence";
    totalProgress?: number;
  }
) {
  safeTrack("PDP Section Completed", {
    lang: meta.lang,
    mode: meta.mode,
    section: meta.section,
    totalProgress:
      meta.totalProgress !== undefined
        ? cleanNumber(meta.totalProgress)
        : undefined,
  });
}

export function trackPdpMilestoneReached(
  meta: BaseMeta & {
    milestone: 25 | 50 | 75 | 100;
    totalProgress: number;
  }
) {
  safeTrack("PDP Milestone Reached", {
    lang: meta.lang,
    mode: meta.mode,
    milestone: meta.milestone,
    totalProgress: cleanNumber(meta.totalProgress),
  });
}

export function trackPdpCompleted(meta: BaseMeta & { totalProgress: number }) {
  safeTrack("PDP Completed", {
    lang: meta.lang,
    mode: meta.mode,
    totalProgress: cleanNumber(meta.totalProgress),
  });
}

/**
 * Draft / export behavior
 * This is the most important commercial signal.
 */
export function trackPdpDownloadRequested(meta: DownloadMeta) {
  safeTrack("PDP Download Requested", {
    lang: meta.lang,
    mode: meta.mode,
    version: meta.version,
    exportLang: meta.exportLang,
    totalProgress: cleanNumber(meta.totalProgress),
    club: cleanString(meta.club),
    country: cleanOptionalString(meta.country),
    league: cleanOptionalString(meta.league),
    team: cleanOptionalString(meta.team),
    hasPhoto: cleanBoolean(meta.hasPhoto),
    usedGeneratedPlan: cleanBoolean(meta.usedGeneratedPlan),
    draftStage:
      meta.totalProgress < 40
        ? "early"
        : meta.totalProgress < 80
        ? "mid"
        : "late",
  });
}

export function trackPdpDownloaded(meta: DownloadMeta) {
  safeTrack("PDP Downloaded", {
    lang: meta.lang,
    mode: meta.mode,
    version: meta.version,
    exportLang: meta.exportLang,
    totalProgress: cleanNumber(meta.totalProgress),
    club: cleanString(meta.club),
    country: cleanOptionalString(meta.country),
    league: cleanOptionalString(meta.league),
    team: cleanOptionalString(meta.team),
    hasPhoto: cleanBoolean(meta.hasPhoto),
    usedGeneratedPlan: cleanBoolean(meta.usedGeneratedPlan),
    draftStage:
      meta.totalProgress < 40
        ? "early"
        : meta.totalProgress < 80
        ? "mid"
        : "late",
  });
}

export function trackPdpDownloadFailed(
  meta: BaseMeta & {
    version: AnalyticsDownloadVersion;
    exportLang: AnalyticsLang;
    status: string | number;
    totalProgress?: number;
  }
) {
  safeTrack("PDP Download Failed", {
    lang: meta.lang,
    mode: meta.mode,
    version: meta.version,
    exportLang: meta.exportLang,
    status:
      typeof meta.status === "number"
        ? cleanNumber(meta.status)
        : cleanString(meta.status),
    totalProgress:
      meta.totalProgress !== undefined
        ? cleanNumber(meta.totalProgress)
        : undefined,
  });
}