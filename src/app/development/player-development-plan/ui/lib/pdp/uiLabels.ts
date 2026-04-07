// src/app/development/player-development-plan/ui/lib/pdp/pdpLabels.ts

export type Lang = "nl" | "en";

/**
 * -----------------------------------------
 * CORE SLIDE LABELS (1:1 met flow keys)
 * -----------------------------------------
 */

const SLIDE_LABELS = {
  cover: {
    nl: "",
    en: "",
  },

  agreement: {
    nl: "AFSPRAAK",
    en: "agreement",
  },

  role_context: {
    nl: "ROL IN CONTEXT",
    en: "ROLE CONTEXT",
  },

  reality: {
    nl: "REALITEIT",
    en: "REALITY",
  },

  approach: {
    nl: "AANPAK",
    en: "APPROACH",
  },

  success: {
    nl: "SUCCES",
    en: "SUCCESS",
  },
} as const;

/**
 * -----------------------------------------
 * SECTION LABELS (binnen slides)
 * -----------------------------------------
 */

const SECTION_LABELS = {
  // AGREEMENT
  targetBehaviour: {
    nl: "GEWENST GEDRAG",
    en: "TARGET BEHAVIOUR",
  },
  whereVisible: {
    nl: "WAAR DIT ZICHTBAAR MOET WORDEN",
    en: "WHERE THIS SHOULD BECOME VISIBLE",
  },
  focusPeriod: {
    nl: "FOCUSPERIODE",
    en: "FOCUS PERIOD",
  },
  evaluation: {
    nl: "EVALUATIE",
    en: "EVALUATION",
  },

  // ROLE CONTEXT
  gameMoments: {
    nl: "SPELMOMENTEN",
    en: "GAME MOMENTS",
  },
  zones: {
    nl: "ZONES / CONTEXT",
    en: "ZONES / CONTEXT",
  },
  principles: {
    nl: "PRINCIPES",
    en: "PRINCIPLES",
  },

  // REALITY
  observations: {
    nl: "WAT WE NU ZIEN",
    en: "WHAT WE SEE NOW",
  },
  effect: {
    nl: "GEVOLG VOOR HET SPEL",
    en: "EFFECT ON THE GAME",
  },
  evidence: {
    nl: "BEWIJS / VIDEO",
    en: "EVIDENCE / VIDEO",
  },

  // APPROACH
  training: {
    nl: "TRAINING",
    en: "TRAINING",
  },
  match: {
    nl: "WEDSTRIJD",
    en: "MATCH",
  },
  video: {
    nl: "VIDEO",
    en: "VIDEO",
  },
  offField: {
    nl: "BUITEN HET VELD",
    en: "OFF FIELD",
  },
  alignment: {
    nl: "AFSTEMMING",
    en: "ALIGNMENT",
  },

  // SUCCESS
  inGame: {
    nl: "ZICHTBAAR IN HET SPEL",
    en: "VISIBLE IN THE GAME",
  },
  behaviour: {
    nl: "GEDRAG",
    en: "BEHAVIOUR",
  },
  signals: {
    nl: "EERSTE SIGNALEN",
    en: "EARLY SIGNALS",
  },
} as const;

/**
 * -----------------------------------------
 * FALLBACK / EMPTY STATES
 * -----------------------------------------
 */

const FALLBACKS = {
  empty: {
    nl: "Nog niet ingevuld",
    en: "Not yet defined",
  },
} as const;

/**
 * -----------------------------------------
 * PUBLIC API
 * -----------------------------------------
 */

export function slideLabel(
  slide: keyof typeof SLIDE_LABELS,
  lang: Lang
) {
  return SLIDE_LABELS[slide]?.[lang] ?? "";
}

export function sectionLabel(
  key: keyof typeof SECTION_LABELS,
  lang: Lang
) {
  return SECTION_LABELS[key]?.[lang] ?? "";
}

export function fallbackLabel(
  key: keyof typeof FALLBACKS,
  lang: Lang
) {
  return FALLBACKS[key]?.[lang] ?? "";
}