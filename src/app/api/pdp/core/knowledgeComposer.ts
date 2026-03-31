import { clubPrinciples } from "../knowledge/principles";
import {
  footballLanguageSystem,
  getLanguagePromptPatterns,
} from "../knowledge/language";
import {
  roleProfiles,
  type RoleProfile as ImportedRoleProfile,
} from "../knowledge/profiles";

type Lang = "nl" | "en";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
};

type PlannerIntent =
  | "ask"
  | "summarise"
  | "draft_ready"
  | "strong_draft_ready";

type PlannerSlide =
  | "cover"
  | "basics"
  | "agreement"
  | "role_context"
  | "reality"
  | "approach"
  | "success"
  | "context"
  | "evidence"
  | string;

type PlannerState = {
  filledSlots?: Record<string, boolean>;
  usableSlots?: Record<string, boolean>;
  strongSlots?: Record<string, boolean>;
  slotStatuses?: Record<
    string,
    {
      quality?: "empty" | "draft" | "usable" | "strong" | string;
      progress?: number;
      slide?: PlannerSlide;
    }
  >;
  missingFirstDraft?: string[];
  missingStrongDraft?: string[];
  intent?: PlannerIntent | string;
  nextPrioritySlot?: string;
  nextPrioritySlide?: PlannerSlide;
  firstDraftProgress?: number;
  strongDraftProgress?: number;
};

type DevelopmentPlanLike = {
  meta?: {
    team?: string;
    blockLengthWeeks?: number;
    [key: string]: unknown;
  };
  player?: {
    name?: string;
    role?: string;
    team?: string;
    teamType?: "academy" | "first_team" | string;
    academyAgeCategory?: string;
    [key: string]: unknown;
  };
  brand?: {
    clubName?: string;
    [key: string]: unknown;
  };
  slide2?: Record<string, unknown>;
  slide3?: Record<string, unknown>;
  slide3Baseline?: Record<string, unknown>;
  slide4DevelopmentRoute?: Record<string, unknown>;
  slide6SuccessDefinition?: Record<string, unknown>;
  slideContext?: Record<string, unknown>;
  [key: string]: unknown;
};

type KnowledgeContext =
  | "academy"
  | "first_team"
  | "elite_schedule"
  | "low_resource_environment";

type KnowledgeFocus =
  | "observation"
  | "diagnosis"
  | "intervention"
  | "success_definition"
  | "plan_construction"
  | "language_precision";

type ComposerRoleProfile = {
  id?: string;
  key?: string;
  name?: string;
  label?: string;
  aliases?: string[];

  shortDescription?: string;
  description?: string;

  gameModelFunction?: string[];
  coreTasks?: string[];
  tacticalDemands?: string[];
  gameDemands?: string[];
  behaviouralIndicators?: string[];
  keyBehaviours?: string[];
  commonBreakdowns?: string[];
  breakdowns?: string[];
  coachingCues?: string[];
  successSignals?: string[];
  tensions?: string[];

  interventionDirections?:
    | string[]
    | {
        individual?: string[];
        tactical?: string[];
        coaching?: string[];
        review?: string[];
      };

  [key: string]: unknown;
};

type ComposeKnowledgeInput = {
  lang: Lang;
  draftPlan?: Partial<DevelopmentPlanLike>;
  planner?: Partial<PlannerState> | null;
  messages?: ChatMsg[];
};

export type ComposedKnowledgeResult = {
  selectedContext: KnowledgeContext;
  selectedFocus: KnowledgeFocus;
  selectedRoleKey: string | null;
  selectedRoleLabel: string | null;
  knowledgeText: string;
  debug: {
    roleInput: string;
    teamType: string;
    lastUserSignal: string;
  };
};

const MAX_BULLETS_PER_SECTION = 6;
const MAX_LANGUAGE_REPLACEMENTS = 4;
const MAX_QUESTION_PATTERNS = 3;

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => safeString(item)).filter(Boolean);
}

function toTitleCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compactLines(
  lines: readonly string[],
  max = MAX_BULLETS_PER_SECTION
) {
  return Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean))).slice(
    0,
    max
  );
}

function getLastUserMessage(messages: ChatMsg[] = []) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return safeString(lastUser?.content);
}

function inferTeamType(plan?: Partial<DevelopmentPlanLike>): string {
  const explicit = safeString(plan?.player?.teamType);
  if (explicit) return explicit;

  const team = safeString(plan?.meta?.team || plan?.player?.team).toLowerCase();
  if (!team) return "";

  if (team.includes("o13")) return "academy";
  if (team.includes("o14")) return "academy";
  if (team.includes("o15")) return "academy";
  if (team.includes("o16")) return "academy";
  if (team.includes("o17")) return "academy";
  if (team.includes("o18")) return "academy";
  if (team.includes("o19")) return "academy";
  if (team.includes("o21")) return "academy";
  if (team.includes("jong")) return "academy";
  if (team.includes("academy")) return "academy";
  if (team.includes("1e")) return "first_team";
  if (team.includes("first")) return "first_team";

  return "";
}

function inferDevelopmentContext(
  draftPlan?: Partial<DevelopmentPlanLike>
): KnowledgeContext {
  const teamType = inferTeamType(draftPlan);
  const weeks = Number(draftPlan?.meta?.blockLengthWeeks || 0);

  if (teamType === "academy") return "academy";
  if (teamType === "first_team") {
    if (weeks > 0 && weeks <= 2) return "elite_schedule";
    return "first_team";
  }

  if (weeks > 0 && weeks <= 2) return "elite_schedule";
  return "first_team";
}

function inferKnowledgeFocus(
  planner?: Partial<PlannerState> | null,
  messages: ChatMsg[] = [],
  draftPlan?: Partial<DevelopmentPlanLike>
): KnowledgeFocus {
  const nextSlide = planner?.nextPrioritySlide;
  const slot = safeString(planner?.nextPrioritySlot).toLowerCase();
  const lastUser = getLastUserMessage(messages).toLowerCase();

  if (nextSlide === "success") return "success_definition";
  if (nextSlide === "approach") return "intervention";
  if (nextSlide === "agreement") return "plan_construction";
  if (nextSlide === "role_context") return "diagnosis";
  if (nextSlide === "reality") return "observation";

  if (
    slot.includes("success") ||
    slot.includes("signal") ||
    slot.includes("definition")
  ) {
    return "success_definition";
  }

  if (
    slot.includes("action") ||
    slot.includes("responsibil") ||
    slot.includes("route") ||
    slot.includes("approach")
  ) {
    return "intervention";
  }

  if (
    slot.includes("goal") ||
    slot.includes("focus") ||
    slot.includes("matchsituation") ||
    slot.includes("developmentpoint")
  ) {
    return "plan_construction";
  }

  if (
    lastUser.includes("why") ||
    lastUser.includes("waarom") ||
    lastUser.includes("problem") ||
    lastUser.includes("probleem") ||
    lastUser.includes("oorzaak") ||
    lastUser.includes("cause")
  ) {
    return "diagnosis";
  }

  if (
    lastUser.includes("how") ||
    lastUser.includes("train") ||
    lastUser.includes("coachen") ||
    lastUser.includes("intervent") ||
    lastUser.includes("aanpak")
  ) {
    return "intervention";
  }

  if (
    lastUser.includes("wanneer") ||
    lastUser.includes("moment") ||
    lastUser.includes("see") ||
    lastUser.includes("zie") ||
    lastUser.includes("gebeurt")
  ) {
    return "observation";
  }

  const hasSlide2 = !!draftPlan?.slide2;
  const hasSlide3 = !!draftPlan?.slide3 || !!draftPlan?.slide3Baseline;
  const hasSlide4 = !!draftPlan?.slide4DevelopmentRoute;
  const hasSlide6 = !!draftPlan?.slide6SuccessDefinition;

  if (!hasSlide2 || !hasSlide3) return "observation";
  if (!hasSlide4) return "intervention";
  if (!hasSlide6) return "success_definition";

  return "plan_construction";
}

function normalizeRoleInput(role: string) {
  const raw = safeString(role);
  const lower = raw.toLowerCase();

  const cleaned = lower
    .replace(/\./g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    raw,
    normalized: cleaned,
    slug: slugify(cleaned),
  };
}

function toComposerRoleProfile(
  profile: ImportedRoleProfile | null | undefined
): ComposerRoleProfile | null {
  if (!profile || typeof profile !== "object") return null;
  return profile as unknown as ComposerRoleProfile;
}

function extractProfilesMap(): Record<string, ImportedRoleProfile> {
  return roleProfiles as Record<string, ImportedRoleProfile>;
}

function collectProfileAliases(
  profile: ComposerRoleProfile,
  fallbackKey: string
): string[] {
  return compactLines([
    fallbackKey,
    safeString(profile.id),
    safeString(profile.key),
    safeString(profile.name),
    safeString(profile.label),
    ...safeArray(profile.aliases),
  ]).map((item) => slugify(item));
}

function scoreRoleMatch(
  inputRole: string,
  profile: ComposerRoleProfile,
  profileKey: string
): number {
  if (!inputRole) return 0;

  const normalizedInput = normalizeRoleInput(inputRole);
  const aliases = collectProfileAliases(profile, profileKey);

  let score = 0;

  for (const alias of aliases) {
    if (!alias) continue;

    if (alias === normalizedInput.slug) score += 100;
    if (normalizedInput.slug.includes(alias)) score += 40;
    if (alias.includes(normalizedInput.slug)) score += 30;

    const aliasReadable = alias.replace(/-/g, " ");
    if (normalizedInput.normalized === aliasReadable) score += 80;
    if (normalizedInput.normalized.includes(aliasReadable)) score += 25;
  }

  const n = normalizedInput.normalized;

  if (
    (n === "6" || n.includes("number 6") || n.includes("holding midfielder")) &&
    aliases.some((a) =>
      ["6", "number-6", "holding-midfielder", "defensive-midfielder", "pivot"].includes(a)
    )
  ) {
    score += 120;
  }

  if (
    (n === "8" || n.includes("number 8") || n.includes("box to box")) &&
    aliases.some((a) =>
      ["8", "number-8", "box-to-box-midfielder", "central-midfielder"].includes(a)
    )
  ) {
    score += 120;
  }

  if (
    (n === "10" || n.includes("number 10") || n.includes("attacking midfielder")) &&
    aliases.some((a) =>
      ["10", "number-10", "attacking-midfielder", "playmaker"].includes(a)
    )
  ) {
    score += 120;
  }

  if (
    (n.includes("left winger") || n.includes("right winger") || n === "winger") &&
    aliases.some((a) =>
      ["winger", "left-winger", "right-winger", "wide-forward"].includes(a)
    )
  ) {
    score += 120;
  }

  if (
    (n.includes("striker") || n.includes("9") || n.includes("centre forward")) &&
    aliases.some((a) =>
      ["9", "number-9", "striker", "centre-forward", "center-forward"].includes(a)
    )
  ) {
    score += 120;
  }

  if (
    (n.includes("centre back") || n.includes("center back") || n.includes("central defender")) &&
    aliases.some((a) =>
      ["centre-back", "center-back", "central-defender"].includes(a)
    )
  ) {
    score += 120;
  }

  if (
    (n.includes("fullback") || n.includes("full back") || n.includes("back")) &&
    aliases.some((a) =>
      ["fullback", "left-back", "right-back", "wingback", "wing-back"].includes(a)
    )
  ) {
    score += 100;
  }

  return score;
}

function findBestRoleProfile(roleInput: string): {
  key: string | null;
  label: string | null;
  profile: ComposerRoleProfile | null;
} {
  const profilesMap = extractProfilesMap();
  const entries = Object.entries(profilesMap);

  if (!roleInput || !entries.length) {
    return {
      key: null,
      label: null,
      profile: null,
    };
  }

  let best: { key: string; profile: ComposerRoleProfile; score: number } | null = null;

  for (const [key, rawProfile] of entries) {
    const profile = toComposerRoleProfile(rawProfile);
    if (!profile) continue;

    const score = scoreRoleMatch(roleInput, profile, key);

    if (!best || score > best.score) {
      best = { key, profile, score };
    }
  }

  if (!best || best.score < 40) {
    return {
      key: null,
      label: null,
      profile: null,
    };
  }

  return {
    key: best.key,
    label:
      safeString(best.profile.label) ||
      safeString(best.profile.name) ||
      toTitleCase(best.key.replace(/-/g, " ")),
    profile: best.profile,
  };
}

function takePrincipleCluster(cluster: unknown): string[] {
  if (!cluster || typeof cluster !== "object") return [];
  const maybe = cluster as { principles?: unknown };
  return compactLines(safeArray(maybe.principles));
}

function getUniversalPrinciplesByFocus(focus: KnowledgeFocus): string[] {
  const universal = clubPrinciples.universal;

  switch (focus) {
    case "observation":
      return compactLines([
        ...takePrincipleCluster(universal.developmentPhilosophy),
        ...takePrincipleCluster(universal.observationPrinciples),
        ...takePrincipleCluster(universal.contextPrinciples),
      ]);

    case "diagnosis":
      return compactLines([
        ...takePrincipleCluster(universal.observationPrinciples),
        ...takePrincipleCluster(universal.diagnosisPrinciples),
        ...takePrincipleCluster(universal.contextPrinciples),
      ]);

    case "intervention":
      return compactLines([
        ...takePrincipleCluster(universal.diagnosisPrinciples),
        ...takePrincipleCluster(universal.interventionPrinciples),
        ...takePrincipleCluster(universal.coachingPrinciples),
      ]);

    case "success_definition":
      return compactLines([
        ...takePrincipleCluster(universal.planConstructionPrinciples),
        ...takePrincipleCluster(universal.evaluationPrinciples),
      ]);

    case "language_precision":
      return compactLines([
        ...takePrincipleCluster(universal.languagePrinciples),
        ...takePrincipleCluster(universal.observationPrinciples),
      ]);

    case "plan_construction":
    default:
      return compactLines([
        ...takePrincipleCluster(universal.developmentPhilosophy),
        ...takePrincipleCluster(universal.planConstructionPrinciples),
        ...takePrincipleCluster(universal.evaluationPrinciples),
      ]);
  }
}

function getContextPrinciples(context: KnowledgeContext): string[] {
  const adaptation = clubPrinciples.contextAdaptations?.[context];
  if (!adaptation || typeof adaptation !== "object") return [];
  return compactLines(safeArray((adaptation as { principles?: unknown }).principles));
}

function getMetaRules(focus: KnowledgeFocus): string[] {
  const base = compactLines(clubPrinciples.metaIntelligence);
  const chatRules = compactLines(clubPrinciples.chatDecisionRules);
  const reality = compactLines(clubPrinciples.footballRealityChecks);

  switch (focus) {
    case "observation":
    case "diagnosis":
      return compactLines([...base, ...chatRules, ...reality]);

    case "intervention":
      return compactLines([...base, ...chatRules]);

    case "success_definition":
      return compactLines([...base, ...reality]);

    default:
      return compactLines([...base, ...chatRules]);
  }
}

function getLanguageGuidance(focus: KnowledgeFocus, lang: Lang): string[] {
  const principles = compactLines(
    footballLanguageSystem.principles.map((item) => item.description)
  );

  const banned = compactLines(
    footballLanguageSystem.bannedPatterns.map((item) => item.description)
  );

  const replacements = footballLanguageSystem.replacements
    .slice(0, MAX_LANGUAGE_REPLACEMENTS)
    .map((item) =>
      lang === "nl"
        ? `Vermijd: "${item.weak}" → Scherper: "${item.stronger}"`
        : `Avoid: "${item.weak}" → Sharper: "${item.stronger}"`
    );

  const observationFrames = compactLines(footballLanguageSystem.observationFrames, 3);
  const diagnosisFrames = compactLines(footballLanguageSystem.diagnosisFrames, 3);
  const interventionFrames = compactLines(footballLanguageSystem.interventionFrames, 3);
  const successFrames = compactLines(footballLanguageSystem.successFrames, 3);

  const promptPatterns = getLanguagePromptPatterns(
    focus === "plan_construction"
      ? "clarification"
      : focus === "success_definition"
      ? "success_definition"
      : focus === "intervention"
      ? "intervention"
      : focus === "diagnosis"
      ? "diagnosis"
      : "observation"
  )
    .slice(0, MAX_QUESTION_PATTERNS)
    .map((item) => (lang === "nl" ? item.promptNl : item.promptEn));

  const wordingRules = compactLines(footballLanguageSystem.styleDirectives.wordingRules, 5);
  const structureRules = compactLines(footballLanguageSystem.styleDirectives.structureRules, 5);

  const selectedFrames =
    focus === "observation"
      ? observationFrames
      : focus === "diagnosis"
      ? diagnosisFrames
      : focus === "intervention"
      ? interventionFrames
      : focus === "success_definition"
      ? successFrames
      : [...diagnosisFrames.slice(0, 2), ...interventionFrames.slice(0, 2)];

  return compactLines(
    [
      ...principles.slice(0, 4),
      ...banned.slice(0, 3),
      ...wordingRules.slice(0, 3),
      ...structureRules.slice(0, 3),
      ...selectedFrames,
      ...promptPatterns,
      ...replacements,
    ],
    12
  );
}

function extractInterventionDirections(profile: ComposerRoleProfile): string[] {
  const value = profile.interventionDirections;

  if (!value) return [];

  if (Array.isArray(value)) {
    return safeArray(value);
  }

  if (typeof value === "object") {
    return compactLines([
      ...safeArray((value as { individual?: string[] }).individual),
      ...safeArray((value as { tactical?: string[] }).tactical),
      ...safeArray((value as { coaching?: string[] }).coaching),
      ...safeArray((value as { review?: string[] }).review),
    ]);
  }

  return [];
}

function readProfileStrings(profile: ComposerRoleProfile, keys: string[]): string[] {
  const out: string[] = [];

  for (const key of keys) {
    const value = profile[key];

    if (typeof value === "string") {
      if (value.trim()) out.push(value.trim());
      continue;
    }

    if (Array.isArray(value)) {
      out.push(...safeArray(value));
      continue;
    }

    if (value && typeof value === "object") {
      for (const nested of Object.values(value as Record<string, unknown>)) {
        if (typeof nested === "string" && nested.trim()) out.push(nested.trim());
        if (Array.isArray(nested)) out.push(...safeArray(nested));
      }
    }
  }

  return compactLines(out, 12);
}

function getProfileGuidance(
  profile: ComposerRoleProfile | null,
  focus: KnowledgeFocus
): string[] {
  if (!profile) return [];

  const roleDescription = safeString(profile.shortDescription) || safeString(profile.description);

  const base = compactLines([
    roleDescription,
    ...readProfileStrings(profile, [
      "gameModelFunction",
      "coreTasks",
      "tacticalDemands",
      "gameDemands",
      "keyBehaviours",
      "behaviouralIndicators",
      "responsibilities",
      "mainResponsibilities",
      "roleEssence",
      "roleFocus",
    ]),
  ]);

  const breakdowns = compactLines([
    ...safeArray(profile.commonBreakdowns),
    ...safeArray(profile.breakdowns),
    ...readProfileStrings(profile, [
      "commonBreakdowns",
      "breakdowns",
      "risks",
      "failurePatterns",
      "weakSignals",
    ]),
  ]);

  const interventions = compactLines([
    ...safeArray(profile.coachingCues),
    ...extractInterventionDirections(profile),
    ...readProfileStrings(profile, [
      "coachingCues",
      "interventions",
      "trainingDirections",
      "coachActions",
    ]),
  ]);

  const success = compactLines([
    ...safeArray(profile.successSignals),
    ...safeArray(profile.tensions),
    ...readProfileStrings(profile, [
      "successSignals",
      "tensions",
      "successIndicators",
      "qualitySignals",
    ]),
  ]);

  switch (focus) {
    case "observation":
      return compactLines([...base.slice(0, 4), ...breakdowns.slice(0, 4)]);

    case "diagnosis":
      return compactLines([
        ...base.slice(0, 3),
        ...breakdowns.slice(0, 5),
        ...success.slice(0, 2),
      ]);

    case "intervention":
      return compactLines([
        ...base.slice(0, 2),
        ...breakdowns.slice(0, 3),
        ...interventions.slice(0, 5),
      ]);

    case "success_definition":
      return compactLines([...base.slice(0, 2), ...success.slice(0, 5)]);

    case "plan_construction":
    default:
      return compactLines([
        ...base.slice(0, 3),
        ...breakdowns.slice(0, 3),
        ...interventions.slice(0, 3),
        ...success.slice(0, 3),
      ]);
  }
}

function formatSection(title: string, lines: string[]) {
  if (!lines.length) return "";
  return `${title}:\n${lines.map((line) => `- ${line}`).join("\n")}`;
}

function buildKnowledgeText(args: {
  lang: Lang;
  selectedContext: KnowledgeContext;
  selectedFocus: KnowledgeFocus;
  selectedRoleLabel: string | null;
  universalPrinciples: string[];
  contextPrinciples: string[];
  profileGuidance: string[];
  languageGuidance: string[];
  metaRules: string[];
}) {
  const {
    lang,
    selectedContext,
    selectedFocus,
    selectedRoleLabel,
    universalPrinciples,
    contextPrinciples,
    profileGuidance,
    languageGuidance,
    metaRules,
  } = args;

  const intro =
    lang === "nl"
      ? [
          "Gebruik onderstaande knowledge als intern denkkader voor het gesprek en de planbouw.",
          `Context: ${selectedContext}.`,
          `Gespreksfocus: ${selectedFocus}.`,
          selectedRoleLabel ? `Rolfocus: ${selectedRoleLabel}.` : "",
          "Gebruik deze knowledge selectief: scherp gedrag aan, vermijd encyclopedische uitleg en blijf dicht bij het spel.",
        ]
      : [
          "Use the knowledge below as an internal thinking frame for the conversation and plan construction.",
          `Context: ${selectedContext}.`,
          `Conversation focus: ${selectedFocus}.`,
          selectedRoleLabel ? `Role focus: ${selectedRoleLabel}.` : "",
          "Use this knowledge selectively: sharpen behaviour, avoid encyclopaedic explanation and stay close to the game.",
        ];

  const sections = [
    formatSection("Universal principles", universalPrinciples),
    formatSection("Context principles", contextPrinciples),
    formatSection("Role guidance", profileGuidance),
    formatSection("Language guidance", languageGuidance),
    formatSection("Meta decision rules", metaRules),
  ].filter(Boolean);

  return [...intro.filter(Boolean), "", ...sections].join("\n");
}

export function composeKnowledgeContext({
  lang,
  draftPlan,
  planner,
  messages = [],
}: ComposeKnowledgeInput): ComposedKnowledgeResult {
  const roleInput = safeString(draftPlan?.player?.role);
  const teamType = inferTeamType(draftPlan);
  const selectedContext = inferDevelopmentContext(draftPlan);
  const selectedFocus = inferKnowledgeFocus(planner, messages, draftPlan);
  const lastUserSignal = getLastUserMessage(messages);

  const roleMatch = findBestRoleProfile(roleInput);

  const universalPrinciples = getUniversalPrinciplesByFocus(selectedFocus);
  const contextPrinciples = getContextPrinciples(selectedContext);
  const profileGuidance = getProfileGuidance(roleMatch.profile, selectedFocus);
  const languageGuidance = getLanguageGuidance(selectedFocus, lang);
  const metaRules = getMetaRules(selectedFocus);

  const knowledgeText = buildKnowledgeText({
    lang,
    selectedContext,
    selectedFocus,
    selectedRoleLabel: roleMatch.label,
    universalPrinciples,
    contextPrinciples,
    profileGuidance,
    languageGuidance,
    metaRules,
  });

  return {
    selectedContext,
    selectedFocus,
    selectedRoleKey: roleMatch.key,
    selectedRoleLabel: roleMatch.label,
    knowledgeText,
    debug: {
      roleInput,
      teamType,
      lastUserSignal,
    },
  };
}