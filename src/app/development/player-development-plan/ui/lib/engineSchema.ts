// src/app/development/player-development-plan/ui/lib/engineSchema.ts

export type DevelopmentPhase =
  | "adaptation"
  | "stabilisation"
  | "acceleration"
  | "return"
  | "roleShift";

export type ExecutionLayer = "understanding" | "skill" | "stability";

export type PlanVersion = "staff" | "player";

export type Lang = "nl" | "en" | "de" | "es" | "it" | "fr";

export type FocusItemV1 = {
  id: string;
  title: string;
  context: string;
  type?: string;
  goodLooksLike?: string;
  constraints?: string;
  playerActions?: string[];
  staffActions?: string[];
  riskIfOverloaded?: string;
};

export type Slide3MetricSource = "match" | "training" | "combined";

export type Slide3NumberMetric = {
  label: string;
  metric_definition: string;
  current: number | string;
  unit: string;
  sample?: string;
  source: Slide3MetricSource;
};

export type Slide3ReferenceMetric = {
  label: string;
  target: number | string;
  unit: string;
};

export type Slide3VideoClip = {
  status: "active" | "pending";
  title?: string;
  match_or_session?: string;
  timestamp?: string;
  source?: "match" | "training";
  url?: string | null;
  thumbnail_url?: string | null;
};

export type Slide2Agreement = {
  startDate?: string;
  endDate?: string;
  focusBehaviour?: string;
  domainTag?: string;
  matchSituation?: string;
  developmentGoal?: string;
  positionRole?: string;
  roleDescription?: string;
  zoneKey?: string;
  teamContext?: string;
};

export type Slide3Context = {
  gameMoments?: string[];
  zones?: string[];
  principles?: string[];
};

export type Slide3BaselinePrimaryMetric = {
  name?: string;
  definition?: string;
  currentValue?: string;
  targetValue?: string;
};

export type Slide3Baseline = {
  title?: string;
  subtitle?: string;
  intro?: string;
  primaryMetric?: Slide3BaselinePrimaryMetric;
  moments?: string[];
  observations?: string[];
  matchEffects?: string[];
  videoClips?: Slide3VideoClip[];
};

export type Slide3Diagnosis = {
  title?: string;
  subtitle?: string;
  moment: {
    items: string[];
  };
  what_we_see: {
    items: string[];
  };
  numbers: Slide3NumberMetric[];
  reference: Slide3ReferenceMetric[];
  effect_on_match: {
    items: string[];
  };
  video_clips?: Slide3VideoClip[];
};

export type Slide4DevelopmentRouteBlock = {
  training?: string;
  match?: string;
  video?: string;
  off_field?: string;
};

export type Slide4Responsibilities = {
  player?: string;
  coach?: string;
  analyst?: string;
  staff?: string;
};

export type Slide4DevelopmentRoute = {
  title?: string;
  subtitle?: string;
  developmentGoal?: string;
  playerOwnText?: string;
  developmentRoute?: Slide4DevelopmentRouteBlock;
  responsibilities?: Slide4Responsibilities;
};

export type Slide6SuccessDefinition = {
  inGame?: string[];
  behaviour?: string[];
  signals?: string[];
};

export type GovernanceCheckpoint = {
  week: number;
  moment: string;
  who: string;
  whatToObserve: string;
};

export type DevelopmentPlanV1 = {
  meta: {
    club: string;
    team: string;
    createdAtISO: string;
    blockLengthWeeks: number;
    lang?: Lang;
  };

  brand: {
    clubName: string;
    primaryColor: string;
    secondaryColor?: string;
    colorBalance?: number;
    logoUrl?: string;
    tertiaryColor?: string;
  };

  player: {
    name: string;
    role: string;
    team: string;
    phase: DevelopmentPhase;
    headshotUrl?: string;
    teamType?: "academy" | "first_team";
    academyAgeCategory?: string;
  };

  clubModel: {
    dominantGameModel?: string;
    roleInModel?: string;
    criticalPhase?: string;
    nonNegotiables?: string;
  };

  diagnosis: {
    initialIntent: string;
    executionLayer: ExecutionLayer;
    breakdownMoment: string;
    pressureType: string;
    dominantDevelopmentObject: string;
    developmentPhase: DevelopmentPhase;
  };

  priority: {
    title: string;
    whyNow: string;
    observableShift: string;
  };

  focus: FocusItemV1[];

  notNow: {
    reasoning: string;
    excludedFocus: string[];
  };

  context?: {
    selectedMatchMoment?: string;
    typicalTriggers?: string[];
    videoExamples?: string[];
    trainingContext?: string;
    roleSummary?: string;
    constraints?: string[];
  };

  stakeholders?: {
    staff?: string[];
    playerSupport?: string[];
    owner?: string;
  };

  governance?: {
    horizonWeeks: number;
    checkpoints: GovernanceCheckpoint[];
  };

  expectedShift?: {
    staffSignals: string[];
    playerSignals?: string[];
  };

  evaluation?: {
    shortTermMarker: string;
    midTermMarker: string;
    reviewMoment: string;
    decisionCriteria: string;
  };

  versions?: {
    staff: {
      summary: string;
      keyMessages: string[];
    };
    player: {
      summary: string;
      keyMessages: string[];
    };
  };

  slide2?: Slide2Agreement;
  slideContext?: Slide3Context;
  slide3?: Slide3Diagnosis;
  slide3Baseline?: Slide3Baseline;
  slide4DevelopmentRoute?: Slide4DevelopmentRoute;
  slide6SuccessDefinition?: Slide6SuccessDefinition;
};

function clampHex(v: string) {
  const s = (v || "").trim();
  if (!s) return "#111111";
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#111111";
}

function clampPercent(v: unknown, fallback = 75) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function defaultDevelopmentPlan(): DevelopmentPlanV1 {
  return {
    meta: {
      club: "",
      team: "",
      createdAtISO: "",
      blockLengthWeeks: 8,
      lang: "nl",
    },

    brand: {
      clubName: "",
      primaryColor: "#111111",
      secondaryColor: "#FFFFFF",
      tertiaryColor: "",
      colorBalance: 75,
      logoUrl: "",
    },

    player: {
      name: "",
      role: "",
      team: "",
      phase: "stabilisation",
      headshotUrl: "",
      teamType: undefined,
      academyAgeCategory: "",
    },

    clubModel: {
      dominantGameModel: "",
      roleInModel: "",
      criticalPhase: "",
      nonNegotiables: "",
    },

    diagnosis: {
      initialIntent: "",
      executionLayer: "stability",
      breakdownMoment: "",
      pressureType: "",
      dominantDevelopmentObject: "",
      developmentPhase: "stabilisation",
    },

    priority: {
      title: "",
      whyNow: "",
      observableShift: "",
    },

    focus: [],

    notNow: {
      reasoning: "",
      excludedFocus: [],
    },

    context: {
      selectedMatchMoment: "",
      typicalTriggers: [],
      videoExamples: [],
      trainingContext: "",
      roleSummary: "",
      constraints: [],
    },

    stakeholders: {
      staff: [],
      playerSupport: [],
      owner: "",
    },

    governance: {
      horizonWeeks: 8,
      checkpoints: [],
    },

    expectedShift: {
      staffSignals: [],
      playerSignals: [],
    },

    evaluation: {
      shortTermMarker: "",
      midTermMarker: "",
      reviewMoment: "",
      decisionCriteria: "",
    },

    versions: {
      staff: {
        summary: "",
        keyMessages: [],
      },
      player: {
        summary: "",
        keyMessages: [],
      },
    },

    slide2: {
      startDate: "",
      endDate: "",
      focusBehaviour: "",
      domainTag: "",
      matchSituation: "",
      developmentGoal: "",
      positionRole: "",
      roleDescription: "",
      zoneKey: "",
      teamContext: "",
    },

    slideContext: {
      gameMoments: [],
      zones: [],
      principles: [],
    },

    slide3: {
      title: "",
      subtitle: "",
      moment: { items: [] },
      what_we_see: { items: [] },
      numbers: [],
      reference: [],
      effect_on_match: { items: [] },
      video_clips: [],
    },

    slide3Baseline: {
      title: "",
      subtitle: "",
      intro: "",
      primaryMetric: {
        name: "",
        definition: "",
        currentValue: "",
        targetValue: "",
      },
      moments: [],
      observations: [],
      matchEffects: [],
      videoClips: [],
    },

    slide4DevelopmentRoute: {
      title: "",
      subtitle: "",
      developmentGoal: "",
      playerOwnText: "",
      developmentRoute: {
        training: "",
        match: "",
        video: "",
        off_field: "",
      },
      responsibilities: {
        player: "",
        coach: "",
        analyst: "",
        staff: "",
      },
    },

    slide6SuccessDefinition: {
      inGame: [],
      behaviour: [],
      signals: [],
    },
  };
}

export function clampBrand(plan: DevelopmentPlanV1): DevelopmentPlanV1 {
  const next: DevelopmentPlanV1 = structuredClone(plan);

  next.brand = next.brand || {
    clubName: "Club",
    primaryColor: "#111111",
  };

  next.brand.primaryColor = clampHex(next.brand.primaryColor || "#111111");
  next.brand.secondaryColor = clampHex(next.brand.secondaryColor || "#FFFFFF");
  next.brand.tertiaryColor = next.brand.tertiaryColor
    ? clampHex(next.brand.tertiaryColor)
    : "";
  next.brand.colorBalance = clampPercent(next.brand.colorBalance, 75);

  if (!next.meta.lang) {
    next.meta.lang = "nl";
  }

  return next;
}