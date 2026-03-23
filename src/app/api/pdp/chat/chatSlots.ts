// src/app/api/pdp/chat/chatSlots.ts

export type ChatSlotKey =
  | "developmentPoint"
  | "targetBehaviour"
  | "matchSituation"
  | "roleRequirements"
  | "decisiveTeamPhases"
  | "teamImpact"
  | "observations"
  | "whenObserved"
  | "effectOnGame"
  | "playerExecution"
  | "trainingVideoPlan"
  | "matchOffFieldPlan"
  | "ownership"
  | "successInGame"
  | "successBehaviour"
  | "successSignals";

export type ChatSlotDefinition = {
  key: ChatSlotKey;
  label: string;
  description: string;
  slide:
    | "cover"
    | "agreement"
    | "role_context"
    | "reality"
    | "approach"
    | "success";
  requiredForFirstDraft: boolean;
  requiredForStrongDraft: boolean;
};

export const CHAT_SLOTS: ChatSlotDefinition[] = [
  /**
   * SLIDE 2 — AFSPRAAK
   */
  {
    key: "developmentPoint",
    label: "Ontwikkelpunt",
    description:
      "Wat is het dominante en concrete ontwikkelpunt van deze speler?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "targetBehaviour",
    label: "Gewenst gedrag",
    description:
      "Welk observeerbaar gedrag willen we straks wél terugzien?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "matchSituation",
    label: "Wedstrijdmoment",
    description:
      "In welke wedstrijdsituatie of spelsituatie komt dit ontwikkelpunt het duidelijkst terug?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },

  /**
   * SLIDE 3 — ROLCONTEXT
   */
  {
    key: "roleRequirements",
    label: "Wat de rol vraagt",
    description:
      "Wat vraagt de positie of rol van de speler in dit team op dit punt?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "decisiveTeamPhases",
    label: "Beslissende teamfases",
    description:
      "In welke teamfases of spelmomenten wordt dit gedrag echt beslissend?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "teamImpact",
    label: "Teamimpact",
    description:
      "Wat wint of verliest het team als dit gedrag wel of niet lukt?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },

  /**
   * SLIDE 4 — REALITEIT
   */
  {
    key: "observations",
    label: "Wat zien we nu",
    description:
      "Wat zien we concreet terug in gedrag, uitvoering of keuzes van de speler?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },
  {
    key: "whenObserved",
    label: "Wanneer zien we dit",
    description:
      "Onder welke triggers, omstandigheden of wedstrijdmomenten zien we dit terug?",
    slide: "reality",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "effectOnGame",
    label: "Effect op het spel",
    description:
      "Wat is het gevolg van dit gedrag voor het team of voor het spel?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
  },

  /**
   * SLIDE 5 — AANPAK
   */
  {
    key: "playerExecution",
    label: "Speleruitvoering",
    description:
      "Wat moet de speler zelf concreet anders doen vanaf nu?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "trainingVideoPlan",
    label: "Training en beelden",
    description:
      "Hoe werken we hieraan in training en in het bekijken van beelden?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "matchOffFieldPlan",
    label: "Wedstrijd en off-field",
    description:
      "Hoe moet dit zichtbaar worden in de wedstrijd en wat doet de speler buiten het veld?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "ownership",
    label: "Eigenaarschap",
    description:
      "Wie voert dit uit en wie stuurt dit aan?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },

  /**
   * SLIDE 6 — SUCCES
   */
  {
    key: "successInGame",
    label: "Succes in het spel",
    description:
      "Waaraan zien we in het spel dat dit ontwikkelpunt begint te landen?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "successBehaviour",
    label: "Succes in gedrag",
    description:
      "Welk gedrag van de speler laat zien dat het ontwikkelpunt echt landt?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
  },
  {
    key: "successSignals",
    label: "Eerste signalen",
    description:
      "Wat zijn vroege geloofwaardige signalen dat dit plan begint te werken?",
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