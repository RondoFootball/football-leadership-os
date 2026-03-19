// src/app/development/player-development-plan/ui/lib/questionBank.ts

export type Lang = "nl" | "en";

export type Track = "performance" | "mental" | "unknown";

export type QuestionId =
  // core
  | "dev_point"
  | "context_level"
  | "minutes_status"
  // role (performance only, optional)
  | "role_expectation"
  // mental branch
  | "mental_when"
  | "mental_trigger"
  | "mental_behaviours"
  | "mental_training_example"
  | "mental_support"
  // performance branch
  | "perf_moments"
  | "perf_behaviours"
  // shared outcome questions
  | "impact"
  | "metric_definition"
  | "metric_current"
  | "metric_target"
  | "constraints"
  | "evidence_scope";

export type Question = {
  id: QuestionId;
  label: { nl: string; en: string };
  prompt: { nl: string; en: string };
  /** If true, we allow skipping this question automatically when not relevant. */
  optional?: boolean;
};

export type FlowState = {
  lang: Lang;
  track: Track;
  asked: QuestionId[];
  answered: QuestionId[];
};

const Q: Record<QuestionId, Question> = {
  dev_point: {
    id: "dev_point",
    label: { nl: "Ontwikkelpunt", en: "Development point" },
    prompt: {
      nl: "Wat is het belangrijkste ontwikkelpunt dat je nu ziet? Beschrijf kort (1–2 zinnen).",
      en: "What is the main development point you see right now? Keep it short (1–2 lines).",
    },
  },

  context_level: {
    id: "context_level",
    label: { nl: "Context", en: "Context" },
    prompt: {
      nl: "Gaat dit om opleiding of 1e elftal? En wat is zijn fase nu? (1–2 zinnen)",
      en: "Is this academy or first team? And what stage is he in right now? (1–2 lines)",
    },
  },

  minutes_status: {
    id: "minutes_status",
    label: { nl: "Speelminuten", en: "Minutes" },
    prompt: {
      nl: "Speelminuten-status: basisspeler / rotatie / invaller / talent met weinig minuten. Welke past het best + waarom (1 zin)?",
      en: "Minutes status: starter / rotation / impact sub / young talent with low minutes. Which fits best + why (1 line)?",
    },
  },

  role_expectation: {
    id: "role_expectation",
    label: { nl: "Rol in het team", en: "Role in the team" },
    optional: true,
    prompt: {
      nl: "Wat moet deze rol vooral opleveren in wedstrijden bij jullie? (1–2 zinnen, praktisch)",
      en: "What should this role mainly deliver in matches for your team? (1–2 practical lines)",
    },
  },

  // -------- mental branch --------
  mental_when: {
    id: "mental_when",
    label: { nl: "Wanneer merk je dit", en: "When you notice it" },
    prompt: {
      nl: "Wanneer merk je dit het meest? (bijv. na niet-selectie, na fout, na warming-up, op training). Noem 2–3 momenten.",
      en: "When do you notice it most? (e.g. after not being selected, after a mistake, after warm-up, in training). Name 2–3 moments.",
    },
  },

  mental_trigger: {
    id: "mental_trigger",
    label: { nl: "Trigger", en: "Trigger" },
    prompt: {
      nl: "Wat is meestal de trigger? Wat gebeurt er nét daarvoor? (1–2 zinnen)",
      en: "What is usually the trigger? What happens right before it? (1–2 lines)",
    },
  },

  mental_behaviours: {
    id: "mental_behaviours",
    label: { nl: "Gedrag dat je ziet", en: "Behaviour you see" },
    prompt: {
      nl: "Hoe reageert hij dan op het veld? Geef 2–4 observeerbare gedragingen (geen oordeel, geen 'moet/beter').",
      en: "How does he respond on the pitch? Give 2–4 observable behaviours (no judgement, no 'must/should').",
    },
  },

  mental_training_example: {
    id: "mental_training_example",
    label: { nl: "Voorbeeld training", en: "Training example" },
    prompt: {
      nl: "Noem 1 concreet trainingsvoorbeeld van afgelopen 2 weken waar dit zichtbaar was. (oefening/partijvorm + wat deed hij)",
      en: "Give 1 concrete training example from the last 2 weeks where this showed up. (drill/game + what did he do)",
    },
  },

  mental_support: {
    id: "mental_support",
    label: { nl: "Begeleiding", en: "Support" },
    optional: true,
    prompt: {
      nl: "Wie kan hier het meest bij helpen de komende 8 weken? (bijv. performance coach / sportpsych / mentor / hoofdtrainer). 1–2 opties.",
      en: "Who can help most over the next 8 weeks? (e.g. performance coach / sport psych / mentor / head coach). 1–2 options.",
    },
  },

  // -------- performance branch --------
  perf_moments: {
    id: "perf_moments",
    label: { nl: "Momenten", en: "Moments" },
    prompt: {
      nl: "Noem 2–4 typische momenten waarin dit terugkomt. (wedstrijd of training · situatie · zone).",
      en: "Name 2–4 typical moments where this shows up. (match or training · situation · zone).",
    },
  },

  perf_behaviours: {
    id: "perf_behaviours",
    label: { nl: "Wat zien we", en: "What we see" },
    prompt: {
      nl: "Wat zien we dan concreet gebeuren? 2–4 bullets, alleen observeerbaar gedrag (geen oordeel/advies).",
      en: "What do we see happen exactly? 2–4 bullets, observable only (no judgement/advice).",
    },
  },

  // -------- shared --------
  evidence_scope: {
    id: "evidence_scope",
    label: { nl: "Bron", en: "Evidence" },
    optional: true,
    prompt: {
      nl: "Waar baseren we dit vooral op: wedstrijden, training, of allebei? (en over welke periode ongeveer?)",
      en: "What is this mainly based on: matches, training, or both? (and roughly what time period?)",
    },
  },

  impact: {
    id: "impact",
    label: { nl: "Impact", en: "Impact" },
    prompt: {
      nl: "Wat is het concrete effect op de wedstrijd/het team als dit gebeurt? 1–3 bullets, zo feitelijk mogelijk.",
      en: "What is the concrete impact on the match/team when this happens? 1–3 bullets, as factual as possible.",
    },
  },

  metric_definition: {
    id: "metric_definition",
    label: { nl: "Gedragsmetric", en: "Behaviour metric" },
    prompt: {
      nl: "Welke ÉÉN gedragsmetric gebruiken we precies? Schrijf de definitie zó dat iemand ’m kan meten. (1 zin) \n\nAls je het niet weet: typ 'help'.",
      en: "Which ONE behaviour metric do we use exactly? Write the definition so someone can measure it. (1 sentence)\n\nIf you don't know: type 'help'.",
    },
  },

  metric_current: {
    id: "metric_current",
    label: { nl: "Huidige waarde", en: "Current value" },
    prompt: {
      nl: "Wat is de huidige waarde voor die metric? + sample size (aantal momenten/wedstrijden/trainingen).",
      en: "What is the current value for that metric? + sample size (moments/matches/trainings).",
    },
  },

  metric_target: {
    id: "metric_target",
    label: { nl: "Target (8 weken)", en: "Target (8 weeks)" },
    prompt: {
      nl: "Wat is de target voor diezelfde metric na 8 weken?",
      en: "What is the target for the same metric after 8 weeks?",
    },
  },

  constraints: {
    id: "constraints",
    label: { nl: "Randvoorwaarden", en: "Constraints" },
    prompt: {
      nl: "Wat zijn de randvoorwaarden voor de komende 8 weken? (trainingsmomenten per week + wat mag níet slechter worden)",
      en: "What are the constraints for the next 8 weeks? (training moments per week + what must NOT get worse)",
    },
  },
};

export function getQuestion(id: QuestionId): Question {
  return Q[id];
}

export function labelFor(id: QuestionId, lang: Lang) {
  const q = getQuestion(id);
  return lang === "nl" ? q.label.nl : q.label.en;
}

export function promptFor(id: QuestionId, lang: Lang) {
  const q = getQuestion(id);
  return lang === "nl" ? q.prompt.nl : q.prompt.en;
}

export function formatQuestion(id: QuestionId, lang: Lang, step: number, total: number) {
  const header = `${labelFor(id, lang)} · ${step}/${total}`;
  return `${header}\n\n${promptFor(id, lang)}`;
}

/**
 * Track detection: very simple heuristic. We refine later.
 * We only need a good-enough default.
 */
export function detectTrackFromText(text: string): Track {
  const t = (text || "").toLowerCase();

  const mentalHits = [
    "mentaal",
    "motiv",
    "frustr",
    "zelfvertr",
    "stress",
    "druk",
    "teleurg",
    "boos",
    "focus",
    "concentr",
    "kopje",
    "bank",
    "niet spelen",
    "speelminuten",
    "onrust",
    "emot",
    "weerstand",
  ];

  const perfHits = [
    "positie",
    "positioneer",
    "druk zetten",
    "press",
    "omscha",
    "scannen",
    "aanname",
    "pass",
    "1v1",
    "duel",
    "afwerken",
    "loopactie",
    "timing",
    "opbouw",
  ];

  const mentalScore = mentalHits.reduce((acc, k) => acc + (t.includes(k) ? 1 : 0), 0);
  const perfScore = perfHits.reduce((acc, k) => acc + (t.includes(k) ? 1 : 0), 0);

  if (mentalScore === 0 && perfScore === 0) return "unknown";
  return mentalScore >= perfScore ? "mental" : "performance";
}

/**
 * Build the next-question flow order given track.
 * Key idea:
 * - First 3 are ALWAYS asked (dev/context/minutes)
 * - role_expectation is asked ONLY for performance (or if user already talked role)
 * - mental/performance branch differs
 * - then shared outcome questions
 */
export function buildFlow(track: Track): QuestionId[] {
  const base: QuestionId[] = ["dev_point", "context_level", "minutes_status"];

  const sharedTail: QuestionId[] = [
    "evidence_scope",
    "impact",
    "metric_definition",
    "metric_current",
    "metric_target",
    "constraints",
  ];

  if (track === "mental") {
    return [
      ...base,
      "mental_when",
      "mental_trigger",
      "mental_behaviours",
      "mental_training_example",
      "mental_support",
      ...sharedTail,
    ];
  }

  // performance default (also for unknown)
  return [
    ...base,
    "role_expectation",
    "perf_moments",
    "perf_behaviours",
    ...sharedTail,
  ];
}

/**
 * If the user types "help" on metric_definition, we return a mini helper prompt.
 */
export function isHelpForMetric(text: string) {
  const t = (text || "").trim().toLowerCase();
  return t === "help" || t === "wat is een gedragsmetric?" || t.includes("gedragsmetric");
}

export function metricHelp(lang: Lang) {
  if (lang === "en") {
    return (
      "A behaviour metric is ONE measurable action you can count.\n" +
      "Examples:\n" +
      "- 'Pressing: within 3 seconds after losing the ball, sprints to close the ball-carrier' (count % of moments)\n" +
      "- 'Training intensity: completes high-speed actions in small-sided games' (count per session)\n" +
      "Now: pick ONE metric that matches your point and write it as a measurable sentence."
    );
  }

  return (
    "Een gedragsmetric is ÉÉN meetbare actie die je kunt tellen.\n" +
    "Voorbeelden:\n" +
    "- 'Na balverlies: binnen 3 seconden sprint hij door om druk op de bal te krijgen' (tel % van momenten)\n" +
    "- 'Training-intensiteit: aantal hoge-intensiteit acties in partijvorm' (aantal per training)\n" +
    "Kies nu ÉÉN metric die past bij jouw punt en schrijf ’m als meetbare zin."
  );
}