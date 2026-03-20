// src/app/api/pdp/chat/chatSlots.ts

export type ChatSlotKey =
  | "developmentPoint"
  | "targetBehaviour"
  | "matchSituation"
  | "roleContext"
  | "gameMoments"
  | "zones"
  | "principles"
  | "observations"
  | "whenObserved"
  | "effectOnGame"
  | "playerActions"
  | "staffResponsibilities"
  | "successSignals";

export type ChatSlotDefinition = {
  key: ChatSlotKey;
  label: string;
  description: string;
  slide: "cover" | "agreement" | "context" | "reality" | "approach" | "success";
  requiredForFirstDraft: boolean;
  requiredForStrongDraft: boolean;
};

export const CHAT_SLOTS: ChatSlotDefinition[] = [
  {
    key: "developmentPoint",
    label: "Ontwikkelpunt",
    description: "Wat is het concrete ontwikkelpunt van de speler?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "targetBehaviour",
    label: "Gewenst gedrag",
    description: "Welk observeerbaar gedrag willen we straks wél zien?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "matchSituation",
    label: "Wedstrijdmoment",
    description: "In welke wedstrijdsituatie komt dit ontwikkelpunt vooral terug?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "roleContext",
    label: "Rolcontext",
    description: "Wat betekent dit ontwikkelpunt binnen de rol van de speler in het team?",
    slide: "context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "gameMoments",
    label: "Spelmomenten",
    description: "Wanneer in het spel is dit relevant?",
    slide: "context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "zones",
    label: "Zones",
    description: "Waar op het veld speelt dit probleem of gedrag zich vooral af?",
    slide: "context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "principles",
    label: "Principes",
    description: "Welke teamprincipes of rolprincipes zijn hier relevant?",
    slide: "context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "observations",
    label: "Wat zien we",
    description: "Wat zien we concreet terug in gedrag of uitvoering?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "whenObserved",
    label: "Wanneer zien we dit",
    description: "Onder welke omstandigheden of triggers zien we dit?",
    slide: "reality",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "effectOnGame",
    label: "Effect op spel",
    description: "Wat is het gevolg van dit gedrag voor het team of spel?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "playerActions",
    label: "Speleracties",
    description: "Wat moet de speler zelf concreet doen in het plan?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "staffResponsibilities",
    label: "Verantwoordelijkheden staf",
    description: "Wie doet wat in begeleiding, training, video en opvolging?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "successSignals",
    label: "Succesdefinitie",
    description: "Wanneer weten we dat het plan begint te landen?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
];

export type SlotStatus = {
  key: ChatSlotKey;
  filled: boolean;
};

export function getRequiredFirstDraftSlots() {
  return CHAT_SLOTS.filter((slot) => slot.requiredForFirstDraft);
}

export function getRequiredStrongDraftSlots() {
  return CHAT_SLOTS.filter((slot) => slot.requiredForStrongDraft);
}