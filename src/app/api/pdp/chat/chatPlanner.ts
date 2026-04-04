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
  | "backbone_ready"
  | "strong_plan_ready";

export type SlotQuality = "empty" | "draft" | "usable" | "strong";

export type PlannerSlide =
  | "agreement"
  | "role_context"
  | "reality"
  | "approach"
  | "success";

export type SlotStatus = {
  key: ChatSlotKey;
  quality: SlotQuality;
  progress: number; // 0..100
  slide: PlannerSlide;
};

export type PlannerState = {
  filledSlots: Record<ChatSlotKey, boolean>;
  usableSlots: Record<ChatSlotKey, boolean>;
  strongSlots: Record<ChatSlotKey, boolean>;
  slotStatuses: Record<ChatSlotKey, SlotStatus>;

  missingBackbone: ChatSlotKey[];
  missingStrongPlan: ChatSlotKey[];

  intent: PlannerIntent;

  nextPrioritySlot?: ChatSlotKey;
  nextPrioritySlide?: PlannerSlide;

  backboneProgress: number;
  strongPlanProgress: number;
  liveProgress: number;

  currentSlide?: PlannerSlide;
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

function normalizeSlotSlide(slide: ChatSlotSlide): PlannerSlide {
  return slide;
}

/** ---------------- SLOT DETECTION ---------------- */

export function getSlotStatusesFromPlan(
  plan: Partial<DevelopmentPlanV1>
): Record<ChatSlotKey, SlotStatus> {
  const s4 = plan.slide4DevelopmentRoute;
  const s4Route = s4?.developmentRoute;
  const s4Responsibilities = s4?.responsibilities;

  const slotMap: Record<ChatSlotKey, SlotStatus> = {
    /**
     * AGREEMENT
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
     * ROLE CONTEXT
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
     * REALITY
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
     * APPROACH
     */
    playerExecution: {
      key: "playerExecution",
      quality: qualityFromText(s4?.playerOwnText),
      progress: 0,
      slide: "approach",
    },

    trainingVideoPlan: {
      key: "trainingVideoPlan",
      quality: maxQuality(
        qualityFromText(s4Route?.training),
        qualityFromText(s4Route?.video)
      ),
      progress: 0,
      slide: "approach",
    },

    matchOffFieldPlan: {
      key: "matchOffFieldPlan",
      quality: maxQuality(
        qualityFromText(s4Route?.match),
        qualityFromText(s4Route?.off_field)
      ),
      progress: 0,
      slide: "approach",
    },

    ownership: {
      key: "ownership",
      quality: maxQuality(
        qualityFromText(s4Responsibilities?.player),
        qualityFromText(s4Responsibilities?.coach),
        qualityFromText(s4Responsibilities?.analyst),
        qualityFromText(s4Responsibilities?.staff)
      ),
      progress: 0,
      slide: "approach",
    },

    /**
     * SUCCESS
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
  const backboneKeys = getRequiredFirstDraftSlots().map((slot) => slot.key);
  const strongPlanKeys = getRequiredStrongDraftSlots().map((slot) => slot.key);

  const backboneEmpty = PRIORITY_ORDER.find(
    (key) => backboneKeys.includes(key) && statuses[key].quality === "empty"
  );
  if (backboneEmpty) return backboneEmpty;

  const backboneWeak = PRIORITY_ORDER.find(
    (key) => backboneKeys.includes(key) && statuses[key].quality === "draft"
  );
  if (backboneWeak) return backboneWeak;

  const strongEmpty = PRIORITY_ORDER.find(
    (key) => strongPlanKeys.includes(key) && statuses[key].quality === "empty"
  );
  if (strongEmpty) return strongEmpty;

  const strongWeak = PRIORITY_ORDER.find(
    (key) => strongPlanKeys.includes(key) && statuses[key].quality === "draft"
  );
  if (strongWeak) return strongWeak;

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

function computeLiveProgress(
  backboneProgress: number,
  strongPlanProgress: number
) {
  return clampProgress(backboneProgress * 0.55 + strongPlanProgress * 0.45);
}

function pickCurrentSlide(args: {
  nextPrioritySlide?: PlannerSlide;
  usableSlots: Record<ChatSlotKey, boolean>;
}): PlannerSlide {
  const { nextPrioritySlide, usableSlots } = args;

  if (nextPrioritySlide) return nextPrioritySlide;

  const hasAgreementCore =
    usableSlots.developmentPoint &&
    usableSlots.matchSituation &&
    usableSlots.targetBehaviour;

  if (!hasAgreementCore) return "agreement";

  const hasRealityCore =
    usableSlots.observations && usableSlots.effectOnGame;

  if (!hasRealityCore) return "reality";

  const hasRoleLayer =
    usableSlots.roleRequirements ||
    usableSlots.decisiveTeamPhases ||
    usableSlots.teamImpact;

  if (!hasRoleLayer) return "role_context";

  const hasApproachLayer =
    usableSlots.playerExecution ||
    usableSlots.trainingVideoPlan ||
    usableSlots.matchOffFieldPlan ||
    usableSlots.ownership;

  if (!hasApproachLayer) return "approach";

  const hasSuccessLayer =
    usableSlots.successInGame ||
    usableSlots.successBehaviour ||
    usableSlots.successSignals;

  if (!hasSuccessLayer) return "success";

  return "success";
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

  const backboneKeys = getRequiredFirstDraftSlots().map((slot) => slot.key);
  const strongPlanKeys = getRequiredStrongDraftSlots().map((slot) => slot.key);

  const missingBackbone = backboneKeys.filter((key) => !usableSlots[key]);
  const missingStrongPlan = strongPlanKeys.filter((key) => !usableSlots[key]);

  const nextPrioritySlot = pickNextPrioritySlot(slotStatuses);
  const nextPrioritySlide = nextPrioritySlot
    ? normalizeSlotSlide(slotStatuses[nextPrioritySlot].slide)
    : undefined;

  const hasAgreementCore =
    usableSlots.developmentPoint &&
    usableSlots.matchSituation &&
    usableSlots.targetBehaviour;

  const hasRealityCore =
    usableSlots.observations && usableSlots.effectOnGame;

  let intent: PlannerIntent = "ask";

  if (missingStrongPlan.length === 0) {
    intent = "strong_plan_ready";
  } else if (hasAgreementCore && hasRealityCore) {
    intent = "backbone_ready";
  } else {
    intent = "ask";
  }

  const backboneProgress = computeProgress(slotStatuses, backboneKeys);
  const strongPlanProgress = computeProgress(slotStatuses, strongPlanKeys);
  const liveProgress = computeLiveProgress(backboneProgress, strongPlanProgress);

  const currentSlide = pickCurrentSlide({
    nextPrioritySlide,
    usableSlots,
  });

  return {
    filledSlots,
    usableSlots,
    strongSlots,
    slotStatuses,

    missingBackbone,
    missingStrongPlan,

    intent,

    nextPrioritySlot,
    nextPrioritySlide,

    backboneProgress,
    strongPlanProgress,
    liveProgress,

    currentSlide,
  };
}

export function getSlotMeta(slotKey?: ChatSlotKey) {
  if (!slotKey) return null;
  return CHAT_SLOTS.find((slot) => slot.key === slotKey) || null;
}