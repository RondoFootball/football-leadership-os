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

export type ChatSlotSlide =
  | "cover"
  | "agreement"
  | "role_context"
  | "reality"
  | "approach"
  | "success";

export type ChatSlotDefinition = {
  key: ChatSlotKey;
  label: string;
  description: string;
  slide: ChatSlotSlide;
  requiredForFirstDraft: boolean;
  requiredForStrongDraft: boolean;
  priority: number;
  questionPromptNl: string;
  questionPromptEn: string;
  sharpenPromptNl: string;
  sharpenPromptEn: string;
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
    priority: 1,
    questionPromptNl:
      "Wat is het concrete gedrag dat nu het meest in de weg zit?",
    questionPromptEn:
      "What is the concrete behaviour that currently gets in the way most?",
    sharpenPromptNl:
      "Maak het ontwikkelpunt concreter: wat doet de speler exact te laat, niet of verkeerd?",
    sharpenPromptEn:
      "Make the development point more concrete: what does the player do too late, not at all, or incorrectly?",
  },
  {
    key: "targetBehaviour",
    label: "Gewenst gedrag",
    description:
      "Welk observeerbaar gedrag willen we straks wél terugzien?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 3,
    questionPromptNl:
      "Welk gedrag willen we in deze situatie juist wél terugzien?",
    questionPromptEn:
      "What behaviour do we want to see in this situation instead?",
    sharpenPromptNl:
      "Maak het gewenste gedrag observeerbaar: wat moet de speler dan concreet doen?",
    sharpenPromptEn:
      "Make the target behaviour observable: what should the player concretely do then?",
  },
  {
    key: "matchSituation",
    label: "Wedstrijdmoment",
    description:
      "In welke wedstrijdsituatie of spelsituatie komt dit ontwikkelpunt het duidelijkst terug?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 2,
    questionPromptNl:
      "In welk specifiek wedstrijdmoment zie je dit het duidelijkst terug?",
    questionPromptEn:
      "In which specific match moment do you see this most clearly?",
    sharpenPromptNl:
      "Maak de situatie specifieker: waar op het veld, onder welke druk en in welke spelfase?",
    sharpenPromptEn:
      "Make the situation more specific: where on the pitch, under what pressure, and in which phase of play?",
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
    priority: 7,
    questionPromptNl:
      "Wat vraagt zijn rol of positie hier van hem in dit team?",
    questionPromptEn:
      "What does his role or position require from him here in this team?",
    sharpenPromptNl:
      "Maak de roleis scherper: wat moet hij in deze rol herkennen, kiezen of uitvoeren?",
    sharpenPromptEn:
      "Sharpen the role requirement: what must he recognise, choose, or execute in this role?",
  },
  {
    key: "decisiveTeamPhases",
    label: "Beslissende teamfases",
    description:
      "In welke teamfases of spelmomenten wordt dit gedrag echt beslissend?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 8,
    questionPromptNl:
      "In welke teamfases wordt dit gedrag echt beslissend?",
    questionPromptEn:
      "In which team phases does this behaviour become truly decisive?",
    sharpenPromptNl:
      "Noem de fases concreet: opbouw, druk zetten, restverdediging, omschakeling of iets anders?",
    sharpenPromptEn:
      "Name the phases concretely: build-up, pressing, rest defence, transition, or something else?",
  },
  {
    key: "teamImpact",
    label: "Teamimpact",
    description:
      "Wat wint of verliest het team als dit gedrag wel of niet lukt?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 9,
    questionPromptNl:
      "Wat wint of verliest het team als dit gedrag wel of niet lukt?",
    questionPromptEn:
      "What does the team gain or lose when this behaviour does or does not happen?",
    sharpenPromptNl:
      "Maak de teamimpact concreet: wat verandert er direct in tempo, controle, veldbezetting of kanskwaliteit?",
    sharpenPromptEn:
      "Make the team impact concrete: what changes directly in tempo, control, occupation, or chance quality?",
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
    priority: 4,
    questionPromptNl:
      "Wat zie je concreet terug in zijn gedrag of keuzes?",
    questionPromptEn:
      "What do you concretely see in his behaviour or decisions?",
    sharpenPromptNl:
      "Maak de observatie concreter: wat doet hij exact, en niet alleen wat ontbreekt?",
    sharpenPromptEn:
      "Make the observation more concrete: what exactly does he do, not just what is missing?",
  },
  {
    key: "whenObserved",
    label: "Wanneer zien we dit",
    description:
      "Onder welke triggers, omstandigheden of wedstrijdmomenten zien we dit terug?",
    slide: "reality",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 6,
    questionPromptNl:
      "Wanneer zie je dit vooral terug: onder welke trigger of omstandigheid?",
    questionPromptEn:
      "When do you mainly see this: under which trigger or condition?",
    sharpenPromptNl:
      "Maak de trigger scherper: tijd, druk, lichaamshouding, veldpositie of spelrichting?",
    sharpenPromptEn:
      "Sharpen the trigger: time, pressure, body orientation, pitch position, or direction of play?",
  },
  {
    key: "effectOnGame",
    label: "Effect op het spel",
    description:
      "Wat is het gevolg van dit gedrag voor het team of voor het spel?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 5,
    questionPromptNl:
      "Wat is het directe effect op het spel of op het team als dit gebeurt?",
    questionPromptEn:
      "What is the direct effect on the game or team when this happens?",
    sharpenPromptNl:
      "Maak het gevolg specifieker: wat gaat er direct verloren of juist niet door in het spel?",
    sharpenPromptEn:
      "Make the consequence more specific: what is directly lost or what no longer continues in the game?",
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
    priority: 10,
    questionPromptNl:
      "Wat moet de speler zelf concreet anders gaan doen?",
    questionPromptEn:
      "What must the player concretely start doing differently?",
    sharpenPromptNl:
      "Maak de speleractie concreet en uitvoerbaar: wat moet hij zien, kiezen of uitvoeren?",
    sharpenPromptEn:
      "Make the player action concrete and executable: what must he see, choose, or execute?",
  },
  {
    key: "trainingVideoPlan",
    label: "Training en beelden",
    description:
      "Hoe werken we hieraan in training en in het bekijken van beelden?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 11,
    questionPromptNl:
      "Hoe werk je hieraan in training of met beelden?",
    questionPromptEn:
      "How do you work on this in training or through video?",
    sharpenPromptNl:
      "Maak de route concreet: wat gebeurt in training en wat gebeurt in video?",
    sharpenPromptEn:
      "Make the route concrete: what happens in training and what happens in video?",
  },
  {
    key: "matchOffFieldPlan",
    label: "Wedstrijd en off-field",
    description:
      "Hoe moet dit zichtbaar worden in de wedstrijd en wat doet de speler buiten het veld?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 12,
    questionPromptNl:
      "Hoe wil je dit terugzien in de wedstrijd en buiten het veld?",
    questionPromptEn:
      "How do you want to see this back in matches and off the pitch?",
    sharpenPromptNl:
      "Maak dit specifieker: wat moet zichtbaar zijn in de wedstrijd, en wat doet de speler daarbuiten?",
    sharpenPromptEn:
      "Make this more specific: what should be visible in matches, and what does the player do off the pitch?",
  },
  {
    key: "ownership",
    label: "Eigenaarschap",
    description:
      "Wie voert dit uit en wie stuurt dit aan?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 13,
    questionPromptNl:
      "Wie draagt hier concreet wat in: speler, trainer, analist of staff?",
    questionPromptEn:
      "Who concretely owns what here: player, coach, analyst, or staff?",
    sharpenPromptNl:
      "Maak het eigenaarschap scherper: wie doet wat, en wie bewaakt de voortgang?",
    sharpenPromptEn:
      "Make ownership sharper: who does what, and who monitors progress?",
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
    priority: 14,
    questionPromptNl:
      "Waaraan zie je in het spel dat dit begint te landen?",
    questionPromptEn:
      "What do you see in the game that shows this is starting to land?",
    sharpenPromptNl:
      "Maak het wedstrijdsucces concreter: wat moet zichtbaar anders verlopen in het spel?",
    sharpenPromptEn:
      "Make in-game success more concrete: what should visibly unfold differently in the game?",
  },
  {
    key: "successBehaviour",
    label: "Succes in gedrag",
    description:
      "Welk gedrag van de speler laat zien dat het ontwikkelpunt echt landt?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 15,
    questionPromptNl:
      "Welk gedrag van de speler laat zien dat dit echt begint te landen?",
    questionPromptEn:
      "What player behaviour shows that this is truly starting to land?",
    sharpenPromptNl:
      "Maak dit observeerbaar: welk gedrag wil je letterlijk vaker terugzien?",
    sharpenPromptEn:
      "Make this observable: which behaviour do you literally want to see more often?",
  },
  {
    key: "successSignals",
    label: "Eerste signalen",
    description:
      "Wat zijn vroege geloofwaardige signalen dat dit plan begint te werken?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 16,
    questionPromptNl:
      "Wat zijn vroege signalen dat dit plan begint te werken?",
    questionPromptEn:
      "What are early signals that this plan is starting to work?",
    sharpenPromptNl:
      "Maak de signalen geloofwaardig en klein: wat zie je eerder dan een volledige doorbraak?",
    sharpenPromptEn:
      "Make the signals credible and small: what do you see before a full breakthrough?",
  },
];

export type SlotStatus = {
  key: ChatSlotKey;
  filled: boolean;
};

export function getRequiredFirstDraftSlots() {
  return CHAT_SLOTS.filter((slot) => slot.requiredForFirstDraft).sort(
    (a, b) => a.priority - b.priority
  );
}

export function getRequiredStrongDraftSlots() {
  return CHAT_SLOTS.filter((slot) => slot.requiredForStrongDraft).sort(
    (a, b) => a.priority - b.priority
  );
}