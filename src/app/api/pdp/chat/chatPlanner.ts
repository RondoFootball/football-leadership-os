// src/app/api/pdp/chat/chatPlanner.ts

import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import {
  CHAT_SLOTS,
  type ChatSlotKey,
  type ChatSlotSlide,
  getRequiredFirstDraftSlots,
  getRequiredStrongDraftSlots,
} from "./chatSlots";

export type PlannerIntent =
  | "ask"
  | "summarise"
  | "draft_ready"
  | "strong_draft_ready";

export type SlotQuality = "empty" | "draft" | "usable" | "strong";

export type SlotStatus = {
  key: ChatSlotKey;
  quality: SlotQuality;
  progress: number; // 0..100
  slide: ChatSlotSlide;
};

export type PlannerState = {
  filledSlots: Record<ChatSlotKey, boolean>;
  usableSlots: Record<ChatSlotKey, boolean>;
  strongSlots: Record<ChatSlotKey, boolean>;
  slotStatuses: Record<ChatSlotKey, SlotStatus>;
  missingFirstDraft: ChatSlotKey[];
  missingStrongDraft: ChatSlotKey[];
  intent: PlannerIntent;
  nextPrioritySlot?: ChatSlotKey;
  nextPrioritySlide?: ChatSlotSlide;
  firstDraftProgress: number;
  strongDraftProgress: number;
};

/** ---------------- HELPERS ---------------- */

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function qualityToProgress(quality: SlotQuality) {
  switch (quality) {
    case "empty":
      return 0;
    case "draft":
      return 35;
    case "usable":
      return 70;
    case "strong":
      return 100;
    default:
      return 0;
  }
}

function maxQuality(...qualities: SlotQuality[]): SlotQuality {
  if (qualities.includes("strong")) return "strong";
  if (qualities.includes("usable")) return "usable";
  if (qualities.includes("draft")) return "draft";
  return "empty";
}

function qualityFromText(v: unknown): SlotQuality {
  if (typeof v !== "string") return "empty";

  const t = v.trim();
  if (!t) return "empty";

  const lowered = t.toLowerCase();
  if (["-", "n.v.t.", "none", "n/a", "tbd"].includes(lowered)) {
    return "empty";
  }

  const words = t.split(/\s+/).filter(Boolean).length;
  const length = t.length;

  if (length < 8 || words < 2) return "draft";
  if (length < 28 || words < 5) return "usable";
  return "strong";
}

function qualityFromList(
  v: unknown,
  minItemLength = 6,
  strongCount = 3
): SlotQuality {
  if (!Array.isArray(v)) return "empty";

  const items = v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((x) => x.length >= minItemLength);

  if (items.length === 0) return "empty";
  if (items.length === 1) return "draft";
  if (items.length < strongCount) return "usable";
  return "strong";
}

function toBool(quality: SlotQuality) {
  return quality !== "empty";
}

function toUsable(quality: SlotQuality) {
  return quality === "usable" || quality === "strong";
}

function toStrong(quality: SlotQuality) {
  return quality === "strong";
}

/** ---------------- SLOT DETECTION ---------------- */

export function getSlotStatusesFromPlan(
  plan: Partial<DevelopmentPlanV1>
): Record<ChatSlotKey, SlotStatus> {
  const slotMap: Record<ChatSlotKey, SlotStatus> = {
    /**
     * SLIDE 2 — AFSPRAAK
     */
    developmentPoint: {
      key: "developmentPoint",
      quality: qualityFromText(plan.slide2?.focusBehaviour),
      progress: 0,
      slide: "agreement",
    },

    targetBehaviour: {
      key: "targetBehaviour",
      quality: qualityFromText(plan.slide2?.developmentGoal),
      progress: 0,
      slide: "agreement",
    },

    matchSituation: {
      key: "matchSituation",
      quality: qualityFromText(plan.slide2?.matchSituation),
      progress: 0,
      slide: "agreement",
    },

    /**
     * SLIDE 3 — ROLCONTEXT
     */
    roleRequirements: {
      key: "roleRequirements",
      quality: maxQuality(
        qualityFromText(plan.slide2?.positionRole),
        qualityFromText(plan.slide2?.roleDescription)
      ),
      progress: 0,
      slide: "role_context",
    },

    decisiveTeamPhases: {
      key: "decisiveTeamPhases",
      quality: qualityFromList(plan.slideContext?.gameMoments),
      progress: 0,
      slide: "role_context",
    },

    teamImpact: {
      key: "teamImpact",
      quality: maxQuality(
        qualityFromList(plan.slideContext?.principles),
        qualityFromText(plan.slide2?.teamContext)
      ),
      progress: 0,
      slide: "role_context",
    },

    /**
     * SLIDE 4 — REALITEIT
     */
    observations: {
      key: "observations",
      quality: maxQuality(
        qualityFromList(plan.slide3Baseline?.observations),
        qualityFromList(plan.slide3?.what_we_see?.items)
      ),
      progress: 0,
      slide: "reality",
    },

    whenObserved: {
      key: "whenObserved",
      quality: maxQuality(
        qualityFromList(plan.slide3Baseline?.moments),
        qualityFromList(plan.slide3?.moment?.items)
      ),
      progress: 0,
      slide: "reality",
    },

    effectOnGame: {
      key: "effectOnGame",
      quality: maxQuality(
        qualityFromList(plan.slide3Baseline?.matchEffects),
        qualityFromList(plan.slide3?.effect_on_match?.items)
      ),
      progress: 0,
      slide: "reality",
    },

    /**
     * SLIDE 5 — AANPAK
     */
    playerExecution: {
      key: "playerExecution",
      quality: qualityFromText(plan.slide4DevelopmentRoute?.playerOwnText),
      progress: 0,
      slide: "approach",
    },

    trainingVideoPlan: {
      key: "trainingVideoPlan",
      quality: maxQuality(
        qualityFromText(plan.slide4DevelopmentRoute?.developmentRoute?.training),
        qualityFromText(plan.slide4DevelopmentRoute?.developmentRoute?.video)
      ),
      progress: 0,
      slide: "approach",
    },

    matchOffFieldPlan: {
      key: "matchOffFieldPlan",
      quality: maxQuality(
        qualityFromText(plan.slide4DevelopmentRoute?.developmentRoute?.match),
        qualityFromText(plan.slide4DevelopmentRoute?.developmentRoute?.off_field)
      ),
      progress: 0,
      slide: "approach",
    },

    ownership: {
      key: "ownership",
      quality: maxQuality(
        qualityFromText(plan.slide4DevelopmentRoute?.responsibilities?.player),
        qualityFromText(plan.slide4DevelopmentRoute?.responsibilities?.coach),
        qualityFromText(plan.slide4DevelopmentRoute?.responsibilities?.analyst),
        qualityFromText(plan.slide4DevelopmentRoute?.responsibilities?.staff)
      ),
      progress: 0,
      slide: "approach",
    },

    /**
     * SLIDE 6 — SUCCES
     */
    successInGame: {
      key: "successInGame",
      quality: qualityFromList(plan.slide6SuccessDefinition?.inGame),
      progress: 0,
      slide: "success",
    },

    successBehaviour: {
      key: "successBehaviour",
      quality: qualityFromList(plan.slide6SuccessDefinition?.behaviour),
      progress: 0,
      slide: "success",
    },

    successSignals: {
      key: "successSignals",
      quality: qualityFromList(plan.slide6SuccessDefinition?.signals),
      progress: 0,
      slide: "success",
    },
  };

  for (const key of Object.keys(slotMap) as ChatSlotKey[]) {
    slotMap[key].progress = qualityToProgress(slotMap[key].quality);
  }

  return slotMap;
}

export function getFilledSlotsFromPlan(plan: Partial<DevelopmentPlanV1>) {
  const statuses = getSlotStatusesFromPlan(plan);

  const filled = {} as Record<ChatSlotKey, boolean>;
  for (const key of Object.keys(statuses) as ChatSlotKey[]) {
    filled[key] = toBool(statuses[key].quality);
  }

  return filled;
}

/** ---------------- PRIORITY ---------------- */

const PRIORITY_ORDER: ChatSlotKey[] = [
  "developmentPoint",
  "matchSituation",
  "targetBehaviour",

  "observations",
  "effectOnGame",
  "whenObserved",

  "roleRequirements",
  "decisiveTeamPhases",
  "teamImpact",

  "playerExecution",
  "trainingVideoPlan",
  "matchOffFieldPlan",
  "ownership",

  "successInGame",
  "successBehaviour",
  "successSignals",
];

function pickNextPrioritySlot(
  statuses: Record<ChatSlotKey, SlotStatus>
): ChatSlotKey | undefined {
  const firstDraftKeys = getRequiredFirstDraftSlots().map((slot) => slot.key);
  const strongDraftKeys = getRequiredStrongDraftSlots().map((slot) => slot.key);

  const firstDraftEmpty = PRIORITY_ORDER.find(
    (key) => firstDraftKeys.includes(key) && statuses[key].quality === "empty"
  );
  if (firstDraftEmpty) return firstDraftEmpty;

  const firstDraftWeak = PRIORITY_ORDER.find(
    (key) => firstDraftKeys.includes(key) && statuses[key].quality === "draft"
  );
  if (firstDraftWeak) return firstDraftWeak;

  const strongDraftEmpty = PRIORITY_ORDER.find(
    (key) => strongDraftKeys.includes(key) && statuses[key].quality === "empty"
  );
  if (strongDraftEmpty) return strongDraftEmpty;

  const strongDraftWeak = PRIORITY_ORDER.find(
    (key) => strongDraftKeys.includes(key) && statuses[key].quality === "draft"
  );
  if (strongDraftWeak) return strongDraftWeak;

  const usableButWeak = PRIORITY_ORDER.find(
    (key) => statuses[key].quality === "usable"
  );
  if (usableButWeak) return usableButWeak;

  return undefined;
}

function computeProgress(
  statuses: Record<ChatSlotKey, SlotStatus>,
  keys: ChatSlotKey[]
) {
  if (keys.length === 0) return 0;
  const total = keys.length * 100;
  const score = keys.reduce((sum, key) => sum + statuses[key].progress, 0);
  return clampProgress((score / total) * 100);
}

/** ---------------- CORE LOGIC ---------------- */

export function buildPlannerState(
  plan: Partial<DevelopmentPlanV1>
): PlannerState {
  const slotStatuses = getSlotStatusesFromPlan(plan);

  const filledSlots = {} as Record<ChatSlotKey, boolean>;
  const usableSlots = {} as Record<ChatSlotKey, boolean>;
  const strongSlots = {} as Record<ChatSlotKey, boolean>;

  for (const key of Object.keys(slotStatuses) as ChatSlotKey[]) {
    const quality = slotStatuses[key].quality;
    filledSlots[key] = toBool(quality);
    usableSlots[key] = toUsable(quality);
    strongSlots[key] = toStrong(quality);
  }

  const firstDraftKeys = getRequiredFirstDraftSlots().map((slot) => slot.key);
  const strongDraftKeys = getRequiredStrongDraftSlots().map((slot) => slot.key);

  const missingFirstDraft = firstDraftKeys.filter((key) => !usableSlots[key]);
  const missingStrongDraft = strongDraftKeys.filter((key) => !usableSlots[key]);

  const nextPrioritySlot = pickNextPrioritySlot(slotStatuses);
  const nextPrioritySlide = nextPrioritySlot
    ? slotStatuses[nextPrioritySlot].slide
    : undefined;

  const hasAgreementCore =
    usableSlots.developmentPoint &&
    usableSlots.matchSituation &&
    usableSlots.targetBehaviour;

  const hasRealityCore =
    usableSlots.observations && usableSlots.effectOnGame;

  const hasContextAnchor =
    usableSlots.roleRequirements ||
    usableSlots.decisiveTeamPhases ||
    usableSlots.teamImpact;

  const hasApproachAnchor =
    usableSlots.playerExecution ||
    usableSlots.trainingVideoPlan ||
    usableSlots.matchOffFieldPlan;

  const hasSuccessAnchor =
    usableSlots.successInGame ||
    usableSlots.successBehaviour ||
    usableSlots.successSignals;

  let intent: PlannerIntent = "ask";

  if (missingStrongDraft.length === 0) {
    intent = "strong_draft_ready";
  } else if (
    hasAgreementCore &&
    hasRealityCore &&
    (hasContextAnchor || hasApproachAnchor || hasSuccessAnchor)
  ) {
    intent = "draft_ready";
  } else {
    intent = "ask";
  }

  return {
    filledSlots,
    usableSlots,
    strongSlots,
    slotStatuses,
    missingFirstDraft,
    missingStrongDraft,
    intent,
    nextPrioritySlot,
    nextPrioritySlide,
    firstDraftProgress: computeProgress(slotStatuses, firstDraftKeys),
    strongDraftProgress: computeProgress(slotStatuses, strongDraftKeys),
  };
}

export function getSlotMeta(slotKey?: ChatSlotKey) {
  if (!slotKey) return null;
  return CHAT_SLOTS.find((slot) => slot.key === slotKey) || null;
}