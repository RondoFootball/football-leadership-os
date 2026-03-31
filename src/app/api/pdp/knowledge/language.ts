export type CommunicationAudience =
  | "coach"
  | "player"
  | "staff"
  | "board"
  | "mixed";

export type CommunicationContext =
  | "chat"
  | "plan"
  | "review"
  | "observation"
  | "development";

export type ToneMode =
  | "direct"
  | "calm"
  | "sharp"
  | "supportive"
  | "neutral";

export type LanguageRule = {
  id: string;
  label: string;
  description: string;
  examplesGood?: string[];
  examplesBad?: string[];
};

export type LanguagePromptPattern = {
  id: string;
  intent:
    | "observation"
    | "clarification"
    | "diagnosis"
    | "intervention"
    | "success_definition"
    | "reflection";
  promptNl: string;
  promptEn: string;
};

export type LanguageReplacement = {
  weak: string;
  stronger: string;
  why: string;
};

export type LanguageFrame = {
  audience: CommunicationAudience;
  context: CommunicationContext;
  preferredTone: ToneMode[];

  principles: LanguageRule[];
  bannedPatterns: LanguageRule[];
  replacements: LanguageReplacement[];

  observationFrames: string[];
  diagnosisFrames: string[];
  interventionFrames: string[];
  successFrames: string[];

  trainerLanguage: string[];
  playerLanguage: string[];
  reviewLanguage: string[];

  questionPatterns: LanguagePromptPattern[];

  styleDirectives: {
    sentenceRules: string[];
    structureRules: string[];
    wordingRules: string[];
  };
};

export const footballLanguageSystem: LanguageFrame = {
  audience: "mixed",
  context: "development",
  preferredTone: ["direct", "calm", "sharp"],

  principles: [
    {
      id: "concrete_before_abstract",
      label: "Concrete before abstract",
      description:
        "Start altijd bij zichtbaar gedrag, moment en effect. Geen algemene beoordeling zonder concreet veldbeeld.",
      examplesGood: [
        "Bij balverlies reageert hij te laat op de tweede bal en komt hij pas in beweging nadat de tegenstander al kan openen.",
        "In de opbouw opent hij zijn lichaam te laat, waardoor de volgende pass alleen terug kan."
      ],
      examplesBad: [
        "Hij is niet alert genoeg.",
        "Hij moet beter verdedigen.",
        "Hij mist intensiteit."
      ]
    },
    {
      id: "behaviour_not_character",
      label: "Describe behaviour, not personality",
      description:
        "Duid gedrag in context, niet iemands karakter of mentale etiket.",
      examplesGood: [
        "Hij wacht te lang voordat hij uitstapt.",
        "Hij scant te laat voordat hij de bal ontvangt."
      ],
      examplesBad: [
        "Hij is lui.",
        "Hij is zwak in zijn hoofd.",
        "Hij is niet slim genoeg."
      ]
    },
    {
      id: "effect_must_be_named",
      label: "Name the effect on the game",
      description:
        "Elke observatie moet ergens toe leiden: wat gebeurt er daardoor in het spel?",
      examplesGood: [
        "Daardoor blijft de tegenstander open naar voren spelen.",
        "Daardoor moet de volgende speler terug in plaats van vooruit."
      ],
      examplesBad: [
        "Dat is niet goed.",
        "Daar moet hij beter in worden."
      ]
    },
    {
      id: "separate_signal_from_interpretation",
      label: "Separate signal from interpretation",
      description:
        "Eerst beschrijven wat zichtbaar is, daarna duiden wat dat waarschijnlijk betekent.",
      examplesGood: [
        "Hij komt steeds onder de bal in plaats van tussen de linies. Daardoor blijft hij wel aanspeelbaar, maar zonder echte progressiewaarde."
      ],
      examplesBad: [
        "Hij begrijpt zijn rol niet."
      ]
    },
    {
      id: "language_must_help_action",
      label: "Language must help action",
      description:
        "Formuleringen moeten coachbaar zijn. De lezer moet weten waar hij naar moet kijken of wat er ontwikkeld moet worden."
    },
    {
      id: "no_false_precision",
      label: "No false precision",
      description:
        "Niet doen alsof iets exact vaststaat als het om interpretatie gaat. Benoem onzekerheid waar nodig.",
      examplesGood: [
        "Het lijkt erop dat hij de druk te laat leest.",
        "Waarschijnlijk kiest hij te vroeg voor zekerheid in plaats van progressie."
      ],
      examplesBad: [
        "Het probleem is dat hij geen spelinzicht heeft."
      ]
    },
    {
      id: "football_words_must_mean_something",
      label: "Football words must stay functional",
      description:
        "Gebruik voetbalwoorden alleen als ze iets specifieks aanduiden in het moment."
    }
  ],

  bannedPatterns: [
    {
      id: "empty_judgement",
      label: "Empty judgement words",
      description:
        "Vermijd woorden die oordeel geven zonder inhoud.",
      examplesBad: [
        "goed",
        "matig",
        "slecht",
        "onvoldoende",
        "prima",
        "oké"
      ]
    },
    {
      id: "consultancy_language",
      label: "Consultancy language",
      description:
        "Geen management- of adviesbureauwoorden die voetbalinhoud vervagen.",
      examplesBad: [
        "optimaliseren",
        "stakeholders",
        "alignment",
        "efficiëntieslag",
        "holistische benadering",
        "strategische implementatie"
      ]
    },
    {
      id: "container_concepts",
      label: "Container concepts without football meaning",
      description:
        "Geen loze containerbegrippen zonder gedrag of moment.",
      examplesBad: [
        "meer focus",
        "meer scherpte",
        "meer agressie",
        "beter in duels",
        "meer coaching",
        "meer leiderschap"
      ]
    },
    {
      id: "moral_language",
      label: "Moralising language",
      description:
        "Geen morele toon richting speler of staf.",
      examplesBad: [
        "moet harder werken",
        "moet beter zijn best doen",
        "moet meer willen",
        "moet volwassen worden"
      ]
    },
    {
      id: "generic_plan_language",
      label: "Generic development language",
      description:
        "Geen ontwikkeltaal die overal op past en nergens echt iets zegt.",
      examplesBad: [
        "zich verder ontwikkelen in",
        "stappen maken in",
        "consistenter worden in",
        "meer rendement halen uit"
      ]
    },
    {
      id: "pseudo_scientific_language",
      label: "Pseudo-scientific language",
      description:
        "Geen academische of pseudo-wetenschappelijke formuleringen die de praktijk niet helpen.",
      examplesBad: [
        "cognitieve flexibiliteit vergroten",
        "executieve processen verbeteren",
        "informatieverwerking optimaliseren"
      ]
    }
  ],

  replacements: [
    {
      weak: "Hij is niet scherp genoeg",
      stronger:
        "Hij reageert te laat op het moment dat de bal vrijkomt, waardoor hij steeds achter het duel komt.",
      why: "Maakt zichtbaar wat er gebeurt en wat het gevolg is."
    },
    {
      weak: "Hij moet beter in zijn keuzes worden",
      stronger:
        "Na zijn eerste aanname kiest hij te vaak voor de veilige terugpass terwijl de volgende lijn open ligt.",
      why: "Maakt keuzeprobleem concreet en waarneembaar."
    },
    {
      weak: "Hij moet agressiever verdedigen",
      stronger:
        "Hij wacht te lang met uitstappen, waardoor de tegenstander open kan draaien in zijn zone.",
      why: "Vertaalt containerbegrip naar gedrag."
    },
    {
      weak: "Hij moet meer coachen",
      stronger:
        "Zijn coaching komt pas nadat de situatie al zichtbaar is, waardoor ploeggenoten te laat kunnen reageren.",
      why: "Laat zien wat functionele communicatie betekent."
    },
    {
      weak: "Hij moet rustiger aan de bal zijn",
      stronger:
        "Onder druk versnelt hij zijn eerste actie, waardoor hij de open vervolgoptie niet meer ziet.",
      why: "Verbindt gevoelstaal aan spelgedrag."
    },
    {
      weak: "Hij mist rendement",
      stronger:
        "Hij komt wel in een dreigende eindfase, maar kiest daar te vaak voor de moeilijke actie terwijl de simpele eindpass open ligt.",
      why: "Rendement wordt gekoppeld aan beslissing in context."
    },
    {
      weak: "Hij leest het spel niet goed",
      stronger:
        "Hij scant te laat voorafgaand aan de ontvangst en reageert daardoor pas nadat de druk al op hem zit.",
      why: "Voorkomt vage intelligentietaal."
    },
    {
      weak: "Hij moet dominanter zijn",
      stronger:
        "In verdedigende momenten wacht hij op het duel in plaats van de ruimte ervoor al te controleren.",
      why: "Maakt 'dominantie' voetbalinhoudelijk."
    },
    {
      weak: "Hij moet constanter worden",
      stronger:
        "In rustige fases kiest hij vaak de goede positie, maar zodra de druk toeneemt valt hij terug in reageren in plaats van sturen.",
      why: "Laat zien wanneer en waarin de variatie zit."
    },
    {
      weak: "Hij moet aan zijn mindset werken",
      stronger:
        "Na een fout is zijn volgende actie vaak te voorzichtig, waardoor hij uit het spelbeeld verdwijnt.",
      why: "Maakt mentale duiding observeerbaar."
    }
  ],

  observationFrames: [
    "In [moment/context] doet de speler [zichtbaar gedrag], waardoor [effect op spel/team].",
    "Wanneer [wedstrijdsituatie], kiest hij voor [actie], terwijl [betere of andere speloplossing].",
    "Bij [fase van het spel] is zichtbaar dat hij [gedrag], met als gevolg dat [effect].",
    "Zodra [trigger], reageert hij [manier van reageren], waardoor [vervolgprobleem]."
  ],

  diagnosisFrames: [
    "De kern lijkt niet te zitten in [oppervlakkige uitleg], maar in [waarschijnlijk onderliggend gedragsprobleem].",
    "Het terugkerende patroon is dat hij [gedrag], vooral wanneer [druk/context].",
    "De beperking lijkt minder technisch dan [alternatief], en meer te zitten in [waarneming / timing / besluit / uitvoering].",
    "Wat hier vooral zichtbaar wordt, is een tekort in [specifiek deelgedrag], niet alleen in de eindactie zelf."
  ],

  interventionFrames: [
    "De ontwikkelrichting zit daarom in [specifiek gedrag], zodat hij in [wedstrijdcontext] eerder/beter [gewenste actie].",
    "De interventie moet zich richten op [gedrag], niet alleen op [oppervlakkige uitkomst].",
    "De speler moet vooral leren om in [context] eerder/beter [actie], zodat [gewenst effect].",
    "De focus ligt op [klein en coachbaar gedragsdoel], omdat dat het grootste effect heeft op [spelprobleem]."
  ],

  successFrames: [
    "Succes is zichtbaar wanneer hij in [context] consequent [gewenst gedrag] laat zien.",
    "De ontwikkeling is herkenbaar als hij in vergelijkbare situaties eerder [actie] en daardoor [effect].",
    "Het plan werkt wanneer [gewenst gedrag] zichtbaar wordt zonder dat [nieuw risico].",
    "Voortgang is er als [specifieke gedraging] vaker en eerder optreedt in [wedstrijdsituatie]."
  ],

  trainerLanguage: [
    "eerder zien",
    "eerder komen",
    "openen voor de volgende actie",
    "de volgende lijn vrijspelen",
    "druk fixeren",
    "tempo van de actie bepalen",
    "de ruimte voor de bal verdedigen",
    "de lijn bedreigen",
    "onder de bal komen",
    "tussen de linies speelbaar worden",
    "de situatie controleren voor het duel",
    "niet alleen reageren maar sturen",
    "de tweede actie voorbereiden",
    "de volgende speler helpen",
    "rust brengen in plaats van vertragen",
    "versnellen wanneer het beeld open is",
    "het moment niet forceren",
    "het duel klaarzetten",
    "op tijd aansluiten",
    "de box bezetten met timing"
  ],

  playerLanguage: [
    "zie het moment eerder",
    "kom eerder vrij",
    "open je lichaam voordat de bal komt",
    "kies eerst de juiste positie",
    "speel wat je ziet, niet wat je hoopt",
    "bescherm eerst de volgende actie",
    "verdedig eerst de ruimte, dan het duel",
    "blijf dreigend zonder te forceren",
    "kom op tijd in plaats van veel te bewegen",
    "maak de eenvoudige goede actie"
  ],

  reviewLanguage: [
    "De keuze was verdedigbaar, ook al pakte de uitvoering niet goed uit.",
    "De uitkomst is negatief, maar de beslissing past wel bij het moment.",
    "De uitkomst lijkt redelijk, maar de onderliggende keuze is kwetsbaar.",
    "Het patroon zit niet in één fout, maar in dezelfde reactie op vergelijkbare momenten.",
    "Het probleem zit niet alleen in de eindactie, maar in wat eraan voorafgaat.",
    "De speler lost de situatie nu te laat op.",
    "Er is nog te veel variatie tussen rustige en onder-druk momenten.",
    "De volgende stap zit in eerder herkennen, niet alleen in beter uitvoeren."
  ],

  questionPatterns: [
    {
      id: "observation_start",
      intent: "observation",
      promptNl:
        "Welk concreet moment zie je terugkomen, en wat doet de speler daarin precies?",
      promptEn:
        "Which concrete moment keeps returning, and what exactly does the player do in it?"
    },
    {
      id: "effect_question",
      intent: "clarification",
      promptNl:
        "Wat is in dat moment het directe effect op het spel of op de volgende actie van het team?",
      promptEn:
        "In that moment, what is the direct effect on the game or on the team’s next action?"
    },
    {
      id: "timing_question",
      intent: "diagnosis",
      promptNl:
        "Zit het probleem vooral in te laat zien, te laat komen, de verkeerde keuze of in de uitvoering zelf?",
      promptEn:
        "Is the main issue about seeing too late, arriving too late, choosing wrongly, or the execution itself?"
    },
    {
      id: "pressure_question",
      intent: "diagnosis",
      promptNl:
        "Wordt dit vooral zichtbaar onder druk, in open ruimte, rond de box of juist in de opbouw?",
      promptEn:
        "Does this mainly show up under pressure, in open space, around the box, or in build-up?"
    },
    {
      id: "intervention_question",
      intent: "intervention",
      promptNl:
        "Welk kleiner gedragsdoel zou hier het meeste verschil maken in wedstrijden?",
      promptEn:
        "Which smaller behaviour target would make the biggest difference here in matches?"
    },
    {
      id: "success_question",
      intent: "success_definition",
      promptNl:
        "Waaraan zie je in wedstrijden dat dit echt beter gaat, nog voordat cijfers iets zeggen?",
      promptEn:
        "What would you see in matches that shows this is really improving, even before any numbers do?"
    },
    {
      id: "review_question",
      intent: "reflection",
      promptNl:
        "Was dit vooral een slechte uitkomst, of zat het probleem al eerder in het moment daarvoor?",
      promptEn:
        "Was this mainly a poor outcome, or did the problem already start in the moment before?"
    }
  ],

  styleDirectives: {
    sentenceRules: [
      "Schrijf kort tot middellang. Liever 1 scherpe zin dan 3 vage.",
      "Elke zin moet een duidelijk onderwerp en een voetbalinhoudelijke functie hebben.",
      "Vermijd stapeling van bijzinnen.",
      "Gebruik actieve formuleringen boven passieve formuleringen.",
      "Gebruik weinig bijvoeglijke naamwoorden; gebruik liever werkwoorden en gedragingen."
    ],
    structureRules: [
      "Werk van observatie naar duiding naar ontwikkelrichting.",
      "Noem eerst het zichtbare patroon, daarna pas de interpretatie.",
      "Maak ontwikkelpunten klein genoeg om coachbaar te zijn.",
      "Koppel succes altijd aan zichtbaar gedrag in wedstrijden of trainingen.",
      "Scheid besluitkwaliteit van uitkomst."
    ],
    wordingRules: [
      "Gebruik voetbaltaal die op het veld herkenbaar is.",
      "Vermijd AI-achtige samenvattingszinnen.",
      "Vermijd te veel synoniemen; kies het scherpste woord.",
      "Gebruik geen modieuze managementtaal.",
      "Gebruik geen psychologische etiketten als gedragstaal beschikbaar is."
    ]
  }
};

/**
 * Compacte sets die later in prompts of validators gebruikt kunnen worden
 */
export const bannedFootballWords = [
  "optimaliseren",
  "alignment",
  "stakeholders",
  "holistisch",
  "strategisch implementeren",
  "meer focus",
  "meer scherpte",
  "meer leiderschap",
  "mindset",
  "consistenter worden",
  "meer rendement halen",
  "meer agressie tonen",
  "moet harder werken",
  "moet beter zijn best doen"
] as const;

export const strongFootballVerbs = [
  "scant",
  "opent",
  "stapt uit",
  "houdt",
  "vertraagt",
  "versnelt",
  "fixeert",
  "speelt vrij",
  "beschermt",
  "valt terug",
  "sluit aan",
  "dreigt",
  "bezet",
  "stuurt",
  "reageert",
  "schermt af",
  "draait open",
  "komt los",
  "loopt door",
  "herstelt"
] as const;

export const weakToStrongExamples: LanguageReplacement[] =
  footballLanguageSystem.replacements;

export function buildAudienceTone(
  audience: CommunicationAudience,
  context: CommunicationContext
) {
  if (audience === "player") {
    return {
      tone: "clear_and_coachable",
      rules: [
        "Gebruik directe, eenvoudige en coachbare taal.",
        "Maak zinnen kort.",
        "Vermijd zware diagnosewoorden.",
        "Vertaal altijd naar zichtbaar gedrag."
      ]
    };
  }

  if (audience === "board") {
    return {
      tone: "clear_and_non_jargon",
      rules: [
        "Gebruik begrijpelijke voetbaltaal zonder trainersjargon te stapelen.",
        "Leg oorzaak en effect helder uit.",
        "Voorkom vaktaal die niet uitlegbaar is."
      ]
    };
  }

  if (context === "review") {
    return {
      tone: "calm_and_precise",
      rules: [
        "Scheid uitkomst van besluitkwaliteit.",
        "Geen schuldtaal.",
        "Werk richting volgende keuze."
      ]
    };
  }

  return {
    tone: "sharp_football_language",
    rules: [
      "Schrijf concreet.",
      "Verbind gedrag aan effect.",
      "Gebruik voetbalwoorden functioneel.",
      "Vermijd containerbegrippen."
    ]
  };
}

export function suggestSharperFootballPhrase(input: string): string | null {
  const normalized = input.trim().toLowerCase();

  const match = footballLanguageSystem.replacements.find(
    (item) => item.weak.toLowerCase() === normalized
  );

  return match ? match.stronger : null;
}

export function isLikelyWeakFootballLanguage(input: string): boolean {
  const text = input.toLowerCase();

  return bannedFootballWords.some((word) => text.includes(word));
}

export function getLanguagePromptPatterns(intent: LanguagePromptPattern["intent"]) {
  return footballLanguageSystem.questionPatterns.filter(
    (item) => item.intent === intent
  );
}