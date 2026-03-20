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

function hasText(v: unknown) {
  return typeof v === "string" && v.trim().length > 0;
}

function hasList(v: unknown) {
  return Array.isArray(v) && v.length > 0;
}

export function getFilledSlotsFromPlan(plan: Partial<DevelopmentPlanV1>) {
  const filled: Record<ChatSlotKey, boolean> = {
    developmentPoint: !!plan.slide2?.focusBehaviour?.trim(),
    targetBehaviour: !!plan.slide2?.developmentGoal?.trim(),
    matchSituation: !!plan.slide2?.matchSituation?.trim(),

    roleContext:
      !!plan.slide2?.positionRole?.trim() ||
      !!plan.slide2?.roleDescription?.trim() ||
      !!plan.slide2?.teamContext?.trim(),

    gameMoments: hasList(plan.slideContext?.gameMoments),
    zones: hasList(plan.slideContext?.zones),
    principles: hasList(plan.slideContext?.principles),

    observations:
      !!plan.slide3Baseline?.observations?.length ||
      !!plan.slide3?.what_we_see?.items?.length,

    whenObserved:
      !!plan.slide3Baseline?.moments?.length ||
      !!plan.slide3?.moment?.items?.length,

    effectOnGame:
      !!plan.slide3Baseline?.matchEffects?.length ||
      !!plan.slide3?.effect_on_match?.items?.length,

    playerActions:
      !!plan.slide4DevelopmentRoute?.playerOwnText?.trim() ||
      !!plan.slide4DevelopmentRoute?.responsibilities?.player?.trim(),

    staffResponsibilities:
      !!plan.slide4DevelopmentRoute?.responsibilities?.coach?.trim() ||
      !!plan.slide4DevelopmentRoute?.responsibilities?.analyst?.trim() ||
      !!plan.slide4DevelopmentRoute?.responsibilities?.staff?.trim(),

    successSignals:
      !!plan.slide6SuccessDefinition?.signals?.length ||
      !!plan.slide6SuccessDefinition?.inGame?.length ||
      !!plan.slide6SuccessDefinition?.behaviour?.length,
  };

  return filled;
}

const PRIORITY_ORDER: ChatSlotKey[] = [
  "developmentPoint",
  "matchSituation",
  "targetBehaviour",
  "observations",
  "effectOnGame",
  "roleContext",
  "gameMoments",
  "zones",
  "principles",
  "whenObserved",
  "playerActions",
  "staffResponsibilities",
  "successSignals",
];

export function buildPlannerState(plan: Partial<DevelopmentPlanV1>): PlannerState {
  const filledSlots = getFilledSlotsFromPlan(plan);

  const missingFirstDraft = getRequiredFirstDraftSlots()
    .map((slot) => slot.key)
    .filter((key) => !filledSlots[key]);

  const missingStrongDraft = getRequiredStrongDraftSlots()
    .map((slot) => slot.key)
    .filter((key) => !filledSlots[key]);

  const nextPrioritySlot = PRIORITY_ORDER.find((key) => !filledSlots[key]);

  let intent: PlannerIntent = "ask";

  if (missingStrongDraft.length === 0) {
    intent = "strong_draft_ready";
  } else if (missingFirstDraft.length === 0) {
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