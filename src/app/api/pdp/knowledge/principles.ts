export type DevelopmentContext =
  | "academy"
  | "first_team"
  | "elite_schedule"
  | "low_resource_environment";

export type GamePhase =
  | "in_possession"
  | "out_of_possession"
  | "offensive_transition"
  | "defensive_transition";

export type BehaviourLayer =
  | "perception"
  | "decision"
  | "execution"
  | "communication"
  | "emotional_control";

export type PrincipleCluster = {
  label: string;
  principles: string[];
};

export type ContextAdaptation = {
  label: string;
  principles: string[];
};

export type MetaRule = {
  id: string;
  rule: string;
};

export const clubPrinciples = {
  /**
   * 1. UNIVERSAL PRINCIPLES
   * Geldt altijd — ongeacht niveau, club of leeftijd
   */
  universal: {
    developmentPhilosophy: {
      label: "Development philosophy",
      principles: [
        "Player development is the improvement of repeatable football behaviour under realistic game conditions, not the accumulation of isolated qualities.",
        "Behaviour only has value when it survives time pressure, space pressure, opponent interaction and emotional load.",
        "Development starts from reality: what the player actually does, not from preference, reputation or ideology.",
        "A development plan exists to reduce uncertainty: it clarifies current behaviour, desired behaviour and the shortest useful route between them.",
        "Not everything can be developed at once. Prioritisation is a football decision, not an administrative compromise.",
        "The value of a development point is defined by two tests: impact on the game and trainability in the current environment.",
        "Consistency of useful behaviour matters more than occasional peak execution.",
        "Clarity beats volume: one sharp behavioural line is stronger than multiple vague themes.",
        "A player should not be developed in the abstract, but in relation to role, phase, context and level.",
        "Development is never neutral: every intervention strengthens one behaviour while not prioritising another.",
        "A good plan narrows the focus enough to become actionable, without narrowing so much that it loses football meaning.",
        "The purpose of development is not to create a complete player in theory, but a more effective player in his actual football context."
      ]
    },

    observationPrinciples: {
      label: "Observation principles",
      principles: [
        "Start with visible behaviour, not interpretation.",
        "Describe actions in relation to game context: role, phase, pressure, space, teammate relations and objective.",
        "Separate structural behaviour from incidental events.",
        "Distinguish symptom from cause: what is visible is not always the underlying problem.",
        "Observe decision → action → effect as one chain, not as isolated moments.",
        "What repeats under pressure defines the real level.",
        "Avoid generalisations when specific moments can be described.",
        "A valid observation explains what happens, when it happens, why it matters and what better looks like.",
        "Do not confuse action volume with influence: more movement or more touches does not automatically mean more value.",
        "Do not confuse outcome with quality: a successful outcome can hide a weak decision, and a failed outcome can still come from the right decision.",
        "Good observation looks earlier than the visible mistake: often the problem starts before the final action.",
        "The sharper the observation, the smaller the need for abstract explanation."
      ]
    },

    diagnosisPrinciples: {
      label: "Diagnosis principles",
      principles: [
        "Diagnosis should identify the most likely limiting behaviour, not produce the most impressive explanation.",
        "The core question is not 'what went wrong?' but 'what repeatedly breaks down under realistic pressure?'",
        "Separate perception problems, decision problems, execution problems and role-discipline problems before choosing interventions.",
        "Do not treat every weak action as a technical issue; many visible errors start earlier in scanning, timing or decision quality.",
        "A diagnosis must explain why the current behaviour appears and why it keeps returning.",
        "The best diagnosis creates direction: it helps decide what should be trained, simplified, reinforced or left alone.",
        "A weak diagnosis describes symptoms; a strong diagnosis identifies the behavioural bottleneck.",
        "If multiple problems are visible, choose the one that most strongly shapes the rest.",
        "Diagnosis must stay close enough to the pitch that coaches can recognise it and act on it.",
        "Uncertainty should be named when necessary. False certainty weakens decision quality more than an explicit assumption.",
        "The diagnosis should fit the context: the same behaviour can be acceptable at one level and limiting at another.",
        "The role of diagnosis is not to sound intelligent, but to make the next football decision more accurate."
      ]
    },

    contextPrinciples: {
      label: "Context principles",
      principles: [
        "Behaviour is only meaningful in relation to role and game model.",
        "The same action can be correct or incorrect depending on timing, pressure, alternatives and game state.",
        "Every development point must be anchored in game phases: in possession, out of possession, offensive transition or defensive transition.",
        "Role demands define what 'good' behaviour means — not generic football ideals.",
        "Context determines training design: without it, interventions lose transfer to the game.",
        "Competition level and opponent quality influence what is realistic and what is necessary.",
        "Development must align with how the team wants to play, otherwise it creates friction instead of progress.",
        "Game context includes teammates: individual behaviour is often only functional in relation to surrounding roles.",
        "A plan should reflect whether the player is being asked to stabilise, connect, accelerate, protect or finish.",
        "The narrower the role, the sharper the development line can be.",
        "Context is not background information; it is part of the meaning of the behaviour itself.",
        "A plan without context produces clean language and poor transfer."
      ]
    },

    planConstructionPrinciples: {
      label: "Plan construction principles",
      principles: [
        "A development point should capture one behavioural theme with high game relevance.",
        "Describe target behaviour in observable terms: what the player does differently on the pitch.",
        "Move from current behaviour → desired behaviour → intervention → evaluation.",
        "Avoid stacking multiple unrelated problems into one plan.",
        "Interventions must logically connect to the observed behaviour and diagnosed bottleneck.",
        "Success criteria must be visible in matches or representative training.",
        "A first draft is usable when the behavioural line is clear; a strong draft is coherent across all layers.",
        "Plans should be directly actionable within the next training cycle.",
        "A plan is only strong when it is selective: what is left out matters as much as what is included.",
        "The sharper the focus, the easier it becomes to coach, review and evaluate.",
        "A development point should sit at the level of behaviour, not at the level of theme labels.",
        "A plan should improve the player without blurring the role.",
        "One plan should never try to solve the whole player.",
        "A plan should be specific enough to guide training, but broad enough to still matter in real matches."
      ]
    },

    interventionPrinciples: {
      label: "Intervention principles",
      principles: [
        "Training must recreate the information and pressure of the real game moment.",
        "Players learn through perception–decision–action coupling, not isolated repetition.",
        "Constraints (space, time, rules, player relations) shape behaviour more effectively than instructions alone.",
        "Video supports recognition, not overload.",
        "Coaching interventions should guide attention, not solve the situation for the player.",
        "Repetition must be representative, not just frequent.",
        "Interventions should increase the probability of correct behaviour appearing in real matches.",
        "Transfer to the game is the only real validation of an intervention.",
        "Good interventions reduce noise: they make the desired behaviour easier to recognise and repeat.",
        "A drill is only useful when it preserves the behavioural logic of the game moment.",
        "Interventions should target the limiting layer: seeing, deciding, executing, coordinating or emotionally stabilising.",
        "The coach should manipulate the task before increasing verbal correction.",
        "The more complex the football problem, the more important it is to simplify the task without losing its meaning.",
        "An intervention should not just produce good repetitions in training; it should improve action quality when the game becomes unstable."
      ]
    },

    coachingPrinciples: {
      label: "Coaching principles",
      principles: [
        "Coach attention before coaching detail: what the player notices shapes what the player can choose.",
        "Good coaching points toward the moment, the cue and the next behaviour.",
        "Do not over-explain. One useful cue is often stronger than five correct sentences.",
        "Coaching should clarify what matters most in the situation, not narrate everything.",
        "Use language that can survive the speed of the game.",
        "Intervene early enough to shape behaviour, but not so often that the player stops solving.",
        "The coach should sharpen recognition, not create dependency.",
        "Correction is strongest when it is linked to a repeated pattern, not a single isolated event.",
        "A coaching cue should be brief enough to repeat and specific enough to matter.",
        "The best coaching language improves future action, not past description.",
        "Do not coach personality when behaviour can be coached.",
        "Coaching should reduce confusion, preserve ownership and increase transfer."
      ]
    },

    evaluationPrinciples: {
      label: "Evaluation principles",
      principles: [
        "Evaluate behaviour, not intention.",
        "Separate outcome from decision quality.",
        "Look for recurring behavioural change, not isolated improvement.",
        "Progress is visible when the player recognises earlier, chooses better or executes more effectively.",
        "Evaluation should be specific enough to be shared across staff.",
        "If progress is unclear, refine observation before changing direction.",
        "A plan evolves when the initial assumption proves incomplete or incorrect.",
        "Evaluation is input for the next decision, not a judgement moment.",
        "A better result does not automatically mean better behaviour.",
        "A difficult match context does not automatically mean poor development.",
        "Review should ask whether the chosen focus still explains the main problem.",
        "If the player improves in training but not in matches, the transfer layer remains unresolved.",
        "Good evaluation protects against random conclusions.",
        "Evaluation should make the next choice easier, narrower and more honest."
      ]
    },

    languagePrinciples: {
      label: "Language principles",
      principles: [
        "Use concrete football language.",
        "Avoid abstract or generic coaching phrases.",
        "Describe behaviour, not personality.",
        "Use observable verbs: scan, fix, release, delay, track, protect, accelerate, step, arrive, support, recover.",
        "Keep sentences sharp and functional.",
        "Avoid moral or emotional judgement when behaviour language is available.",
        "Clarity over complexity.",
        "Write in a way that can be translated directly to training and match coaching.",
        "Start with what is visible before moving to what it likely means.",
        "Avoid language that sounds impressive but does not help action.",
        "A good football sentence should help someone watch, coach or build.",
        "Do not hide uncertainty behind confident language."
      ]
    }
  },

  /**
   * 2. CONTEXT ADAPTATIONS
   * Verschillen per doelgroep / fase
   */
  contextAdaptations: {
    academy: {
      label: "Academy",
      principles: [
        "Development focuses on learning capacity and behavioural foundation, not immediate short-term performance.",
        "Broader exploration is allowed, but each plan still needs one clear behavioural focus.",
        "Repetition and clarity are more important than tactical complexity.",
        "Mistakes are part of learning, but must still be understood in football context.",
        "Coaching should prioritise recognition and understanding before execution perfection.",
        "Physical and cognitive development stage must shape both expectations and intervention choice.",
        "The environment should maximise decisions, involvement and representative ball actions.",
        "Do not confuse early dominance with strong long-term development potential.",
        "Plans should be narrow enough to coach, but wide enough to support long-term role growth.",
        "In academy, the key question is often not only 'can he do it now?' but also 'is he learning to recognise it earlier?'"
      ]
    },

    first_team: {
      label: "First team",
      principles: [
        "Development is directly linked to performance and selection.",
        "Development points must have immediate match relevance.",
        "Interventions must fit within limited training time and competitive pressure.",
        "Clarity and simplicity are critical due to time pressure.",
        "Behaviour must be stable under high pressure and higher opponent quality.",
        "Trade-offs between development and performance are constant and should be made explicit.",
        "Focus is narrower and more role-specific than in academy.",
        "A first-team plan should strengthen the player without reducing immediate reliability.",
        "Short-term usefulness matters more than broad developmental completeness.",
        "The best first-team development plans improve role execution without adding unnecessary complexity."
      ]
    },

    elite_schedule: {
      label: "Elite schedule",
      principles: [
        "Training time is limited; matches often become the primary learning environment.",
        "Recovery and freshness influence decision quality, emotional control and behavioural consistency.",
        "Interventions must be highly efficient and low in unnecessary volume.",
        "Video, micro-coaching and tactical clarity become more important than extensive field repetition.",
        "Load management affects development speed, depth and available intervention choices.",
        "Consistency under fatigue becomes a key indicator of level.",
        "Do not overload the player with too many active themes in dense schedules.",
        "In elite schedules, the strongest intervention is often simplification rather than expansion.",
        "The behavioural line must survive travel, rotation, physical fatigue and emotional fluctuation.",
        "Development in this context should focus on repeatability, clarity and efficiency."
      ]
    },

    low_resource_environment: {
      label: "Low resource environment",
      principles: [
        "Simplicity and clarity are critical due to limited support structures.",
        "Coaching must maximise impact with minimal tools.",
        "Game-like training is preferred over complex setups that depend on large staff or specialist resources.",
        "Feedback must be concise, actionable and easy to repeat.",
        "Development relies more on representative repetition within training games and matches than on layered support systems.",
        "Staff capacity shapes how detailed plans can realistically be executed.",
        "A simpler plan that is truly coached is stronger than a rich plan that lives only on paper.",
        "Use few cues, high repetition and clear success behaviour.",
        "Build plans that survive imperfect conditions.",
        "In lower-resource settings, execution discipline and coaching consistency matter even more."
      ]
    }
  },

  /**
   * 3. ENVIRONMENT FACTORS
   * Wordt impliciet meegenomen in redenering
   */
  environmentFactors: [
    "Team playing style and core principles",
    "Coach communication style and coaching consistency",
    "Competition level, tempo and opponent quality",
    "Training frequency, density and available field time",
    "Staff expertise, alignment and observational precision",
    "Player age, maturation and development phase",
    "Cultural context of the club and tolerance for mistakes",
    "Available data, video and review structure",
    "Squad status, selection pressure and role stability",
    "Schedule congestion, travel load and fatigue exposure"
  ],

  /**
   * 4. FOOTBALL REALITY CHECKS
   * Extra ondergrens voor goede POP-logica
   */
  footballRealityChecks: [
    "If the development point cannot be observed in matches, it is too vague.",
    "If the intervention does not recreate the real information of the moment, it is too far from the game.",
    "If the desired behaviour is not role-specific, it is too generic.",
    "If too many themes are combined, the plan will lose coaching clarity.",
    "If success cannot be recognised without numbers, the behavioural target is still too abstract.",
    "If a staff member cannot explain the plan in simple football language, the plan is not sharp enough.",
    "If the behaviour changes in exercises but not in matches, the transfer problem is still unresolved.",
    "If the diagnosis sounds impressive but does not guide action, it is not useful enough.",
    "If the player needs too much explanation to understand the focus, the focus is probably too broad.",
    "If the plan does not change what the coach will actually say or train this week, it is not operational enough."
  ],

  /**
   * 5. META INTELLIGENCE
   * Hoe de chat moet denken
   */
  metaIntelligence: [
    "Prefer sharpening over expanding.",
    "Ask one high-value question instead of multiple generic ones.",
    "Do not move to a new topic if the current one is not yet sharp.",
    "Translate user input into football behaviour, not abstract summaries.",
    "Detect vagueness and push toward specificity.",
    "Only build forward when the foundation is usable.",
    "Avoid over-coaching: keep focus on the highest-impact behaviour.",
    "Balance completeness with usability: a usable plan beats a perfect but unusable one.",
    "Prefer the smallest truthful behavioural line that still matters in the game.",
    "If several problems are visible, choose the one most likely to organise the rest.",
    "Stay close to football reality: role, phase, pressure, consequence.",
    "Do not confuse elegant wording with real clarity.",
    "When uncertain, narrow the claim rather than inflate the conclusion.",
    "Good questions reduce ambiguity; they do not merely prolong the conversation.",
    "Build from visible behaviour toward diagnosis, then toward intervention and success.",
    "The purpose of the system is not to sound intelligent, but to produce better football decisions."
  ],

  /**
   * 6. CHAT DECISION RULES
   * Praktische regels voor routing en planbouw
   */
  chatDecisionRules: [
    "Start from the user's concrete football signal, not from the full theory base.",
    "Only bring in principles when they help sharpen the actual behaviour under discussion.",
    "Prefer one strong behavioural hypothesis over several weak parallel hypotheses.",
    "Do not generate a full plan if the behavioural bottleneck is still unclear.",
    "If the observation is still generic, ask for the moment, the action and the effect.",
    "If the moment is clear but the meaning is vague, sharpen the diagnosis.",
    "If the diagnosis is clear but the plan is weak, sharpen the intervention and success criteria.",
    "Use role and context to narrow the question, not to make the answer more complex.",
    "When enough is known for a usable first draft, move from questioning to building.",
    "Do not ask for information that the existing evidence already supports."
  ]
} as const;

/**
 * Handige exports voor latere koppeling
 */
export const principleContextOrder: DevelopmentContext[] = [
  "academy",
  "first_team",
  "elite_schedule",
  "low_resource_environment",
];

export const principleGamePhases: GamePhase[] = [
  "in_possession",
  "out_of_possession",
  "offensive_transition",
  "defensive_transition",
];

export const principleBehaviourLayers: BehaviourLayer[] = [
  "perception",
  "decision",
  "execution",
  "communication",
  "emotional_control",
];