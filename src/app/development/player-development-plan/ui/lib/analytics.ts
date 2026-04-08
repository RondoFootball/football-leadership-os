import posthog from "posthog-js";
import { track } from "@vercel/analytics";

export type AnalyticsLang = "nl" | "en" | "de" | "es" | "it" | "fr";
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

type ClubContextMeta = BaseMeta & {
  country?: string;
  league?: string;
  club?: string;
  teamType?: string;
  team?: string;
  clubMode?: "preset" | "custom";
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

function bucketTextLength(value: unknown) {
  const s = typeof value === "string" ? value.trim() : "";
  const len = s.length;

  if (len === 0) return "empty";
  if (len <= 10) return "1_10";
  if (len <= 25) return "11_25";
  if (len <= 50) return "26_50";
  if (len <= 100) return "51_100";
  return "100_plus";
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
    const clean = payload ? sanitizePayload(payload) : undefined;

    track(eventName, clean);
    posthog.capture(eventName, clean);
  } catch {
    // never break UX
  }
}

function getDraftStage(totalProgress: number) {
  if (totalProgress < 40) return "early";
  if (totalProgress < 80) return "mid";
  return "late";
}

/**
 * Core builder visibility
 */
export function trackPdpBuilderViewed(
  meta: BaseMeta & {
    entryPoint?: string;
  }
) {
  safeTrack("PDP Builder Viewed", {
    lang: meta.lang,
    mode: meta.mode,
    entryPoint: cleanOptionalString(meta.entryPoint),
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

export function trackPdpSectionViewed(
  meta: BaseMeta & {
    section:
      | "basics"
      | "branding"
      | "workspace"
      | "evidence"
      | "export"
      | "video_panel";
    state?: "open" | "close" | "view";
  }
) {
  safeTrack("PDP Section Viewed", {
    lang: meta.lang,
    mode: meta.mode,
    section: meta.section,
    state: cleanOptionalString(meta.state),
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
 * Do not send full player names.
 * This tracks whether a name was entered and the rough length bucket.
 */
export function trackPdpPlayerIdentityProvided(
  meta: BaseMeta & {
    hasPlayerName: boolean;
    playerNameLengthBucket?: string;
    hasPlayerRole?: boolean;
    hasPhoto?: boolean;
  }
) {
  safeTrack("PDP Player Identity Provided", {
    lang: meta.lang,
    mode: meta.mode,
    hasPlayerName: cleanBoolean(meta.hasPlayerName),
    playerNameLengthBucket: cleanOptionalString(meta.playerNameLengthBucket),
    hasPlayerRole: cleanBoolean(meta.hasPlayerRole),
    hasPhoto: cleanBoolean(meta.hasPhoto),
  });
}

export function trackPdpDevelopmentPointStarted(
  meta: BaseMeta & {
    textLengthBucket?: string;
  }
) {
  safeTrack("PDP Development Point Started", {
    lang: meta.lang,
    mode: meta.mode,
    textLengthBucket: cleanOptionalString(meta.textLengthBucket),
  });
}

export function getTextLengthBucket(value: unknown) {
  return bucketTextLength(value);
}

/**
 * Stronger product/market signals
 */
export function trackPdpClubContextSelected(meta: ClubContextMeta) {
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
export function trackPdpHintUsed(
  meta: BaseMeta & {
    hintLabel?: string;
  }
) {
  safeTrack("PDP Hint Used", {
    lang: meta.lang,
    mode: meta.mode,
    hintLabel: cleanOptionalString(meta.hintLabel),
  });
}

/**
 * For now: do not send raw free-text user questions.
 * Use a category/bucket if you classify them in the builder.
 */
export function trackPdpQuestionTypeDetected(
  meta: BaseMeta & {
    questionType:
      | "observation"
      | "moment"
      | "effect"
      | "development_point"
      | "other";
  }
) {
  safeTrack("PDP Question Type Detected", {
    lang: meta.lang,
    mode: meta.mode,
    questionType: meta.questionType,
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
      | "evidence"
      | "conversation";
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
 * Time-on-builder style signal.
 * Fire this from the builder after timers (30s / 60s / 120s for example).
 */
export function trackPdpTimeOnBuilder(
  meta: BaseMeta & {
    seconds: number;
  }
) {
  safeTrack("PDP Time On Builder", {
    lang: meta.lang,
    mode: meta.mode,
    seconds: cleanNumber(meta.seconds),
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
    draftStage: getDraftStage(meta.totalProgress),
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
    draftStage: getDraftStage(meta.totalProgress),
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