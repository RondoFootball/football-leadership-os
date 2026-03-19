export type Lang = "en" | "nl";

export type PlayerDevPlan = {
  os: {
    context: string;
    decisionType: string;
    timeHorizon: string;
    owner: string;
    mandate: string;
  };
  player: {
    name: string;
    role: string;
    team: string;
    phase: string;
    contextDrivers: string;
    constraintsOpportunities: string;
  };
  overallGoal: string;
  notNow: string;
  focus: Array<{
    title: string;
    whyNow: string;
    goodLooksLike: string;
    playerActions: string;
    staffActions: string;
  }>;
  rhythm: {
    shortTerm: string;
    midTerm: string;
    longTerm: string;
  };
  testMoments: string;
};

export function defaultPlan(): PlayerDevPlan {
  return {
    os: {
      context: "",
      decisionType: "",
      timeHorizon: "",
      owner: "",
      mandate: "",
    },
    player: {
      name: "",
      role: "",
      team: "",
      phase: "",
      contextDrivers: "",
      constraintsOpportunities: "",
    },
    overallGoal: "",
    notNow: "",
    focus: [
      {
        title: "",
        whyNow: "",
        goodLooksLike: "",
        playerActions: "",
        staffActions: "",
      },
    ],
    rhythm: {
      shortTerm: "",
      midTerm: "",
      longTerm: "",
    },
    testMoments: "",
  };
}

export function clampFocusItems(
  focus: PlayerDevPlan["focus"]
): PlayerDevPlan["focus"] {
  if (!Array.isArray(focus)) return [];
  return focus.slice(0, 3);
}

export const i18n: Record<Lang, Record<string, string>> = {
  en: {
    productTitle: "Player Development Plan",
    productSubtitle: "Closed plan. Clear decisions. No noise.",
    reset: "Reset",
    print: "Print / PDF",
    printHint: "Tip: use ‘Save as PDF’ in your print dialog.",
    osHeaderTitle: "OS header",
    osHeaderNote: "Make context and ownership explicit before content.",
    context: "Context",
    contextPh: "e.g. First team integration window / role shift",
    decisionType: "Decision type",
    decisionTypePh: "e.g. Development focus / role stabilisation",
    timeHorizon: "Time horizon",
    timeHorizonPh: "e.g. 6–10 weeks / this block",
    owner: "Owner",
    ownerPh: "e.g. Head Coach / HOO / Performance Lead",
    mandate: "Mandate & boundaries",
    mandatePh:
      "Who decides what? What is explicitly out of scope? When does this escalate?",
    playerContextTitle: "Player context",
    playerContextNote: "Functional context only. No biography. No ranking.",
    playerName: "Player",
    playerNamePh: "Name",
    role: "Current role",
    rolePh: "e.g. 8/10 hybrid, inverted winger",
    team: "Team / environment",
    teamPh: "e.g. U21 / First Team / Loan",
    phase: "Development phase",
    phasePh: "e.g. Transition / Stabilisation / Breakthrough",
    contextDrivers: "Key context drivers",
    contextDriversPh:
      "What in the current situation shapes this plan? (minutes, role clarity, pressure, environment)",
    constraintsOpportunities: "Constraints / opportunities",
    constraintsOpportunitiesPh:
      "What limits or enables progress right now? Be concrete.",
    overallGoalTitle: "Overall development goal",
    overallGoalNote:
      "One dominant direction. Everything else is secondary for now.",
    oneGoal: "One goal (explicit)",
    oneGoalPh:
      "Write one direction that can steer decisions. Keep it sharp and testable.",
    notNowTitle: "Explicitly not now",
    notNowPh:
      "What is consciously excluded in this phase (even if it's important later)?",
    focusTitle: "Focus points",
    focusNote:
      "Max 3. Depth over breadth. Each point must change behaviour in context.",
    maxThree: "Max 3",
    addFocus: "Add",
    focusItem: "Focus",
    removeFocus: "Remove focus point",
    remove: "Remove",
    focusTitleLabel: "Focus title",
    focusTitlePh: "e.g. Scan–decide speed under pressure",
    whyNow: "Why now (context-driven)",
    whyNowPh: "Why is this the right focus in this phase and role?",
    goodLooksLike: "What good looks like",
    goodLooksLikePh:
      "Describe observable behaviour in match-like situations. No vague traits.",
    playerActions: "Player actions (weekly)",
    playerActionsPh: "2–4 concrete actions the player can execute this week.",
    staffActions: "Staff actions (weekly)",
    staffActionsPh:
      "How the staff creates reps, constraints, feedback and protection.",
    noFocusYet:
      "No focus points yet. Add 1–3 points or keep it empty until the goal is clear.",
    rhythmTitle: "Rhythm: time horizon & test moments",
    rhythmNote:
      "Time horizon sets focus, not deadlines. Test moments keep it honest.",
    shortTerm: "Short term",
    shortTermPh:
      "What should start showing? (adaptation, not perfection)",
    midTerm: "Mid term",
    midTermPh: "What should stabilise under pressure?",
    longTerm: "Long term",
    longTermPh: "What direction beyond this block (no promises)?",
    testMoments: "Test moments (explicit)",
    testMomentsPh:
      "When do we weigh progress, with whom, and based on what evidence?",
    footerNote:
      "This is a product output. If it needs explanation, it’s not finished.",
  },
  nl: {
    productTitle: "Speler Ontwikkelplan",
    productSubtitle: "Gesloten plan. Heldere keuzes. Geen ruis.",
    reset: "Reset",
    print: "Print / PDF",
    printHint: "Tip: kies ‘Opslaan als PDF’ in je printdialoog.",
    osHeaderTitle: "OS-header",
    osHeaderNote: "Maak context en eigenaarschap expliciet vóór inhoud.",
    context: "Context",
    contextPh: "bijv. instroomwindow 1e elftal / rolverschuiving",
    decisionType: "Beslistype",
    decisionTypePh: "bijv. ontwikkelfocus / rolstabilisatie",
    timeHorizon: "Tijdshorizon",
    timeHorizonPh: "bijv. 6–10 weken / dit blok",
    owner: "Eigenaar",
    ownerPh: "bijv. hoofdtrainer / HJO / performance lead",
    mandate: "Mandaat & grenzen",
    mandatePh:
      "Wie beslist waarover? Wat is expliciet buiten scope? Wanneer escaleert dit?",
    playerContextTitle: "Spelercontext",
    playerContextNote: "Alleen functionele context. Geen biografie. Geen ranking.",
    playerName: "Speler",
    playerNamePh: "Naam",
    role: "Huidige rol",
    rolePh: "bijv. 8/10 hybride, inverted winger",
    team: "Team / omgeving",
    teamPh: "bijv. O21 / 1e elftal / verhuur",
    phase: "Ontwikkelfase",
    phasePh: "bijv. overgang / stabilisatie / doorbraak",
    contextDrivers: "Kernfactoren in de context",
    contextDriversPh:
      "Wat in de huidige situatie stuurt dit plan? (minuten, rolhelderheid, druk, omgeving)",
    constraintsOpportunities: "Beperkingen / kansen",
    constraintsOpportunitiesPh:
      "Wat remt of versnelt vooruitgang nu? Wees concreet.",
    overallGoalTitle: "Overkoepelend ontwikkeldoel",
    overallGoalNote:
      "Eén dominante richting. Alles daarbuiten is nu secundair.",
    oneGoal: "Eén doel (expliciet)",
    oneGoalPh:
      "Formuleer één richting die keuzes kan sturen. Scherp en toetsbaar.",
    notNowTitle: "Expliciet niet nu",
    notNowPh:
      "Wat is in deze fase bewust uitgesloten (ook al is het later belangrijk)?",
    focusTitle: "Focuspunten",
    focusNote:
      "Max 3. Diepte boven breedte. Elk punt moet gedrag in context veranderen.",
    maxThree: "Max 3",
    addFocus: "Toevoegen",
    focusItem: "Focus",
    removeFocus: "Verwijder focuspunt",
    remove: "Verwijder",
    focusTitleLabel: "Titel focuspunt",
    focusTitlePh: "bijv. scan–beslis snelheid onder druk",
    whyNow: "Waarom nu (contextgedreven)",
    whyNowPh: "Waarom is dit de juiste focus in deze fase en rol?",
    goodLooksLike: "Hoe ‘goed’ eruitziet",
    goodLooksLikePh:
      "Beschrijf observeerbaar gedrag in wedstrijd-achtige situaties. Geen vage traits.",
    playerActions: "Acties speler (wekelijks)",
    playerActionsPh: "2–4 concrete acties die de speler deze week uitvoert.",
    staffActions: "Acties staf (wekelijks)",
    staffActionsPh:
      "Hoe staf reps, constraints, feedback en bescherming organiseert.",
    noFocusYet:
      "Nog geen focuspunten. Voeg 1–3 toe, of laat leeg tot het doel scherp is.",
    rhythmTitle: "Ritme: tijdshorizon & toetsmomenten",
    rhythmNote:
      "Tijdshorizon stuurt focus, geen deadlines. Toetsmomenten houden het eerlijk.",
    shortTerm: "Korte termijn",
    shortTermPh: "Wat moet zichtbaar starten? (aanpassing, geen perfectie)",
    midTerm: "Middellange termijn",
    midTermPh: "Wat moet stabieler worden onder druk?",
    longTerm: "Lange termijn",
    longTermPh: "Welke richting voorbij dit blok (geen belofte)?",
    testMoments: "Toetsmomenten (expliciet)",
    testMomentsPh:
      "Wanneer wegen we voortgang, met wie, en op basis van welk bewijs?",
    footerNote:
      "Dit is product-output. Als het uitleg nodig heeft, is het niet af.",
  },
};