// src/app/api/pdp/chat/chatPlanner.ts

import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import {
  CHAT_SLOTS,
  type ChatSlotKey,
  getRequiredFirstDraftSlots,
  getRequiredStrongDraftSlots,
} from "./chatSlots";

export type PlannerIntent =
  | "ask"
  | "summarise"
  | "draft_ready"
  | "strong_draft_ready";

export type PlannerState = {
  filledSlots: Record<ChatSlotKey, boolean>;
  missingFirstDraft: ChatSlotKey[];
  missingStrongDraft: ChatSlotKey[];
  intent: PlannerIntent;
  nextPrioritySlot?: ChatSlotKey;
};

/** ---------------- STRICT HELPERS ---------------- */

function hasMeaningfulText(v: unknown, minLength = 12) {
  if (typeof v !== "string") return false;
  const t = v.trim();
  if (t.length < minLength) return false;

  const lowered = t.toLowerCase();
  if (["-", "n.v.t.", "none", "n/a", "tbd"].includes(lowered)) {
    return false;
  }

  return true;
}

function hasMeaningfulList(v: unknown, minItems = 1, minLengthPerItem = 6) {
  if (!Array.isArray(v)) return false;
  const items = v
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter((x) => x.length >= minLengthPerItem);

  return items.length >= minItems;
}

/** ---------------- SLOT DETECTION ---------------- */

export function getFilledSlotsFromPlan(plan: Partial<DevelopmentPlanV1>) {
  const filled: Record<ChatSlotKey, boolean> = {
    /**
     * SLIDE 2 — AFSPRAAK
     */
    developmentPoint: hasMeaningfulText(plan.slide2?.focusBehaviour),

    targetBehaviour: hasMeaningfulText(plan.slide2?.developmentGoal),

    matchSituation: hasMeaningfulText(plan.slide2?.matchSituation),

    /**
     * SLIDE 3 — ROLCONTEXT
     * We map the new slot names onto the current plan structure
     * until the underlying schema is renamed later.
     */
    roleRequirements:
      hasMeaningfulText(plan.slide2?.positionRole) ||
      hasMeaningfulText(plan.slide2?.roleDescription),

    decisiveTeamPhases: hasMeaningfulList(plan.slideContext?.gameMoments),

    teamImpact:
      hasMeaningfulList(plan.slideContext?.principles) ||
      hasMeaningfulText(plan.slide2?.teamContext),

    /**
     * SLIDE 4 — REALITEIT
     */
    observations:
      hasMeaningfulList(plan.slide3Baseline?.observations) ||
      hasMeaningfulList(plan.slide3?.what_we_see?.items),

    whenObserved:
      hasMeaningfulList(plan.slide3Baseline?.moments) ||
      hasMeaningfulList(plan.slide3?.moment?.items),

    effectOnGame:
      hasMeaningfulList(plan.slide3Baseline?.matchEffects) ||
      hasMeaningfulList(plan.slide3?.effect_on_match?.items),

    /**
     * SLIDE 5 — AANPAK
     */
    playerExecution: hasMeaningfulText(
      plan.slide4DevelopmentRoute?.playerOwnText
    ),

    trainingVideoPlan:
      hasMeaningfulText(plan.slide4DevelopmentRoute?.developmentRoute?.training) ||
      hasMeaningfulText(plan.slide4DevelopmentRoute?.developmentRoute?.video),

    matchOffFieldPlan:
      hasMeaningfulText(plan.slide4DevelopmentRoute?.developmentRoute?.match) ||
      hasMeaningfulText(plan.slide4DevelopmentRoute?.developmentRoute?.off_field),

    ownership:
      hasMeaningfulText(plan.slide4DevelopmentRoute?.responsibilities?.player) ||
      hasMeaningfulText(plan.slide4DevelopmentRoute?.responsibilities?.coach) ||
      hasMeaningfulText(plan.slide4DevelopmentRoute?.responsibilities?.analyst) ||
      hasMeaningfulText(plan.slide4DevelopmentRoute?.responsibilities?.staff),

    /**
     * SLIDE 6 — SUCCES
     */
    successInGame: hasMeaningfulList(plan.slide6SuccessDefinition?.inGame),

    successBehaviour: hasMeaningfulList(plan.slide6SuccessDefinition?.behaviour),

    successSignals: hasMeaningfulList(plan.slide6SuccessDefinition?.signals),
  };

  return filled;
}

/** ---------------- PRIORITY ---------------- */

/**
 * Priority order should reflect the narrative logic of the deck:
 * 1. first define the agreement
 * 2. then why it matters in role/team context
 * 3. then what reality looks like now
 * 4. then how we work on it
 * 5. then how we judge success
 *
 * We still keep "reality" fairly high because a first draft needs
 * both direction and evidence, not only ambition.
 */
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

/** ---------------- CORE LOGIC ---------------- */

export function buildPlannerState(
  plan: Partial<DevelopmentPlanV1>
): PlannerState {
  const filledSlots = getFilledSlotsFromPlan(plan);

  const missingFirstDraft = getRequiredFirstDraftSlots()
    .map((slot) => slot.key)
    .filter((key) => !filledSlots[key]);

  const missingStrongDraft = getRequiredStrongDraftSlots()
    .map((slot) => slot.key)
    .filter((key) => !filledSlots[key]);

  const nextPrioritySlot = PRIORITY_ORDER.find((key) => !filledSlots[key]);

  /**
   * -------- QUALITY LAYERS --------
   *
   * We distinguish between:
   * - core line: can we state the development point sharply?
   * - reality link: is there evidence and game consequence?
   * - route layer: do we already know how we will work on it?
   * - success layer: do we already know what "good" looks like?
   *
   * A first draft does NOT need to be complete,
   * but it must have a believable backbone.
   */

  const hasAgreementCore =
    filledSlots.developmentPoint &&
    filledSlots.matchSituation &&
    filledSlots.targetBehaviour;

  const hasRealityCore =
    filledSlots.observations &&
    filledSlots.effectOnGame;

  const hasContextAnchor =
    filledSlots.roleRequirements ||
    filledSlots.decisiveTeamPhases ||
    filledSlots.teamImpact;

  const hasApproachAnchor =
    filledSlots.playerExecution ||
    filledSlots.trainingVideoPlan ||
    filledSlots.matchOffFieldPlan;

  const hasSuccessAnchor =
    filledSlots.successInGame ||
    filledSlots.successBehaviour ||
    filledSlots.successSignals;

  /**
   * Minimal believable first draft:
   * - agreement is sharp
   * - there is at least some grounded reality
   *
   * Better first draft:
   * - plus at least one supporting layer from context / approach / success
   *
   * Strong draft:
   * - all strong-draft slots are filled
   */

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
    missingFirstDraft,
    missingStrongDraft,
    intent,
    nextPrioritySlot,
  };
}

export function getSlotMeta(slotKey?: ChatSlotKey) {
  if (!slotKey) return null;
  return CHAT_SLOTS.find((slot) => slot.key === slotKey) || null;
}