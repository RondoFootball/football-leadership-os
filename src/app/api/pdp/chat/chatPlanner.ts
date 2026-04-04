import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import {
  CHAT_SLOTS,
  type ChatSlotKey,
  type ChatSlotSlide,
  getRequiredFirstDraftSlots,
  getRequiredStrongDraftSlots,
} from "./chatSlots";

type Slide4Route = NonNullable<DevelopmentPlanV1["slide4DevelopmentRoute"]>;
type Slide4Responsibilities = Slide4Route["responsibilities"];
type Slide4DevelopmentRouteFields = Slide4Route["developmentRoute"];

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
      return 45;
    case "usable":
      return 78;
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

function normalizeText(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function qualityFromText(v: unknown): SlotQuality {
  const t = normalizeText(v);
  if (!t) return "empty";

  const lowered = t.toLowerCase();
  if (["-", "n.v.t.", "none", "n/a", "tbd"].includes(lowered)) {
    return "empty";
  }

  const words = t.split(/\s+/).filter(Boolean).length;
  const length = t.length;

  if (length < 6 || words < 1) return "empty";
  if (length < 18 || words < 3) return "draft";
  if (length < 42 || words < 7) return "usable";
  return "strong";
}

function qualityFromList(v: unknown, minItemLength = 6): SlotQuality {
  if (!Array.isArray(v)) return "empty";

  const items = v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((x) => x.length >= minItemLength);

  if (items.length === 0) return "empty";

  if (items.length === 1) {
    return qualityFromText(items[0]) === "strong" ? "usable" : "draft";
  }

  if (items.length === 2) return "usable";
  return "strong";
}

function qualityFromOwnership(
  responsibilities: Slide4Responsibilities | undefined
): SlotQuality {
  if (!responsibilities) return "empty";

  const entries = [
    responsibilities.player,
    responsibilities.coach,
    responsibilities.analyst,
    responsibilities.staff,
  ]
    .map((x) => normalizeText(x))
    .filter(Boolean);

  if (entries.length === 0) return "empty";
  if (entries.length === 1) return qualityFromText(entries[0]);
  if (entries.length === 2) return "usable";
  return "strong";
}

function qualityFromTrainingVideo(
  route: Slide4DevelopmentRouteFields | undefined
): SlotQuality {
  if (!route) return "empty";

  return maxQuality(
    qualityFromText(route.training),
    qualityFromText(route.video)
  );
}

function qualityFromMatchOffField(
  route: Slide4DevelopmentRouteFields | undefined
): SlotQuality {
  if (!route) return "empty";

  return maxQuality(
    qualityFromText(route.match),
    qualityFromText(route.off_field)
  );
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
     * SLIDE 2 — AGREEMENT
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
     * SLIDE 3 — ROLE CONTEXT
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
     * SLIDE 4 — REALITY
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
     * SLIDE 5 — APPROACH
     */
    playerExecution: {
      key: "playerExecution",
      quality: qualityFromText(plan.slide4DevelopmentRoute?.playerOwnText),
      progress: 0,
      slide: "approach",
    },

    trainingVideoPlan: {
      key: "trainingVideoPlan",
      quality: qualityFromTrainingVideo(
        plan.slide4DevelopmentRoute?.developmentRoute
      ),
      progress: 0,
      slide: "approach",
    },

    matchOffFieldPlan: {
      key: "matchOffFieldPlan",
      quality: qualityFromMatchOffField(
        plan.slide4DevelopmentRoute?.developmentRoute
      ),
      progress: 0,
      slide: "approach",
    },

    ownership: {
      key: "ownership",
      quality: qualityFromOwnership(
        plan.slide4DevelopmentRoute?.responsibilities
      ),
      progress: 0,
      slide: "approach",
    },

    /**
     * SLIDE 6 — SUCCESS
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
  statuses: Record<ChatSlotKey, SlotStatus>,
  usableSlots: Record<ChatSlotKey, boolean>,
  strongSlots: Record<ChatSlotKey, boolean>
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

  const strongDraftUsableButNotStrong = PRIORITY_ORDER.find(
    (key) => strongDraftKeys.includes(key) && usableSlots[key] && !strongSlots[key]
  );
  if (strongDraftUsableButNotStrong) return strongDraftUsableButNotStrong;

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
  const missingStrongDraft = strongDraftKeys.filter((key) => !strongSlots[key]);

  const nextPrioritySlot = pickNextPrioritySlot(
    slotStatuses,
    usableSlots,
    strongSlots
  );

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
    usableSlots.matchOffFieldPlan ||
    usableSlots.ownership;

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