"use client";

import {
  trackPdpBuilderViewed,
  trackPdpStarted,
  trackPdpFieldStarted,
  trackPdpModeChanged,
  trackPdpLanguageChanged,
  trackPdpSectionCompleted,
  trackPdpCompleted,
  trackPdpHintUsed,
  trackPdpEvidenceAdded,
  trackPdpDownloadRequested,
  trackPdpDownloaded,
  trackPdpDownloadFailed,
} from "./lib/analytics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  defaultDevelopmentPlan,
  type DevelopmentPlanV1,
} from "./lib/engineSchema";
import { clubPresets, getClubPresetByName } from "./lib/clubPresets";
import { PdpChat, type ChatPlannerState } from "./components/PdpChat";
import {
  getCompetitionLogoUrl,
  getCountryLogoUrl as getCountryLogoFromDb,
  competitionsById,
  countriesById,
} from "./lib/clubDatabase";

type Lang = "nl" | "en";
type Mode = "chat" | "manual";
type TeamType = "academy" | "first_team";
type ClubMode = "preset" | "custom";

type LocalVideoUpload = {
  fileName: string;
  objectUrl: string;
};

const ACADEMY_AGES = [
  "O13",
  "O14",
  "O15",
  "O16",
  "O17",
  "O18",
  "O19",
  "O21",
  "Jong",
];

const UI = {
  nl: {
    modeChat: "Gesprek",
    modeManual: "Handmatig",

    basicsTitle: "Planbasis",
    basicsSubtitle:
      "Leg eerst vast voor wie dit plan geldt. Club, team en branding bepalen daarna automatisch de juiste context.",

    basicsSectionClubContext: "Clubcontext",
    basicsSectionPlanSetup: "Planinstelling",

    brandingTitle: "Live cover preview",
    brandingEdit: "Branding aanpassen",
    brandingCollapse: "Inklappen",

    playerName: "Naam speler",
    playerPosition: "Positie",
    playerPhoto: "Spelerfoto URL",
    club: "Club",
    customClub: "Clubnaam handmatig",
    teamType: "Team",
    academy: "Academie",
    firstTeam: "1e elftal",
    ageCategory: "Leeftijdscategorie",
    chooseAgeCategory: "Kies leeftijdscategorie",
    periodWeeks: "Periode ontwikkelplan",

    country: "Land",
    chooseCountry: "Kies land",
    league: "Competitie",
    chooseLeague: "Kies competitie",
    chooseClub: "Kies club",
    clubModePreset: "Club uit lijst",
    clubModeCustom: "Eigen club",
    customClubHelp:
      "Gebruik dit voor een club die niet in de lijst staat. Je kunt daarna handmatig logo en kleuren invullen.",

    primaryColor: "Primaire kleur",
    secondaryColor: "Secundaire kleur",
    tertiaryColor: "Tertiaire kleur",
    colorBalance: "Primaire balans (%)",
    logoUrl: "Clublogo URL",

    heroChatTitle: "Werk vanuit wat je concreet ziet.",
    heroChatBody:
      "Beschrijf één situatie, het gedrag van de speler en het effect op het spel.",

    heroManualTitle: "Werk handmatig vanuit een scherp ontwikkelpunt.",
    heroManualBody:
      "Vul stap voor stap de kern van het plan in. Begin bij het ontwikkelpunt.",

    hintObservation: "Observatie",
    hintMoment: "Moment",
    hintGoal: "Effect",
    hintRefine: "Verdiep",

    developmentPoint: "Ontwikkelpunt",

    statusPoint: "Afspraak",
    statusContext: "Context",
    statusReality: "Realiteit",
    statusApproach: "Aanpak",
    statusSuccess: "Succes",

    noPlayerYet: "Speler",

    downloadPlayer: "Download spelerplan",
    availableOther: "Ook beschikbaar in het Engels",
    downloadOther: "Download EN",
    exportTitle: "Download Plan",
    exportAlways: "Direct exporteerbaar",
    exportStrong:
      "Je kunt op elk moment een bruikbare PDF downloaden, ook als het plan nog niet volledig is uitgewerkt.",

    progressTitle: "Planvoortgang",
    progressBody:
      "Deze voortgang combineert planbasis, inhoudelijke uitwerking en bewijs.",

    evidenceTitle: "Evidence",
    evidenceBody:
      "Voeg bewijs toe wanneer het helpt om observatie, context en opvolging scherper te maken.",

    videoTitle: "Video evidence",
    videoBody:
      "Voeg clips toe als visueel bewijs voor het ontwikkelpunt. Houd het concreet en relevant.",
    dataTitle: "Data evidence",
    dataBody:
      "Koppel later databronnen en indicatoren aan het plan. Deze functie komt in een volgende versie.",
    notYetAvailable: "Nog niet beschikbaar",

    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Titel",
    videoUrl: "Video URL",
    videoMoment: "Datum / moment",
    videoSource: "Bron",
    videoMatch: "Wedstrijd",
    videoTraining: "Training",
    videoUpload: "Upload video",
    videoUploadHelp:
      "Upload werkt in deze versie binnen je sessie. Voor vaste opslag koppelen we later een upload-API.",
    compactVideoOpen: "Open",
    compactVideoClose: "Sluit",
    compactVideoEmpty: "Geen clips",
    compactVideoCount: "clips",
    openClip: "Open clip",
    closeClip: "Sluit clip",

    langNl: "NL",
    langEn: "EN",

    step1Eyebrow: "Stap 1",
    step1Title: "Voor wie is dit plan?",
    step1Body:
      "Leg vast voor welke speler dit plan wordt gebouwd. Naam en positie vormen de basis. Een foto is optioneel, maar helpt om het plan visueel eigen en direct herkenbaar te maken in preview en PDF.",
    editPhoto: "Foto aanpassen",
    removePhoto: "Verwijderen",
    playerVisualIdentity: "Visuele identiteit",
    newPlayer: "Nieuwe speler",
    photoHelp:
      "Gebruik voorlopig een afbeelding-URL. Deze foto wordt gebruikt in de visuele preview en in de PDF-cover.",
    photoPill: "Foto",
    avatarAdd: "Toevoegen",
    avatarEdit: "Aanpassen",

    coverPreviewSub:
      "Deze preview gebruikt hetzelfde staande coverformat als de uiteindelijke PDF.",
    presetActive: "Clubpreset actief",
    coverSystemLine: "Persoonlijk Ontwikkelplan",

    workspaceTitle: "Workspace",
    workspaceBody:
      "Van observatie naar plan. Bouw eerst het gesprek of ontwikkelpunt, voeg daarna bewijs toe.",

    controlLayer: "Planstatus",
    clubContext: "Club context",
    pdfReady: "PDF-ready",
    playerIdentity: "Player identity",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Team",
    completion: "Compleet",
    completed: "Voltooid",
  },

  en: {
    modeChat: "Conversation",
    modeManual: "Manual",

    basicsTitle: "Plan basics",
    basicsSubtitle:
      "First define who this plan is for. Club, team and branding then shape the right context automatically.",

    basicsSectionClubContext: "Club context",
    basicsSectionPlanSetup: "Plan setup",

    brandingTitle: "Live cover preview",
    brandingEdit: "Adjust branding",
    brandingCollapse: "Collapse",

    playerName: "Player name",
    playerPosition: "Position",
    playerPhoto: "Player photo URL",
    club: "Club",
    customClub: "Club name manually",
    teamType: "Team",
    academy: "Academy",
    firstTeam: "First team",
    ageCategory: "Age category",
    chooseAgeCategory: "Choose age category",
    periodWeeks: "Development plan period",

    country: "Country",
    chooseCountry: "Choose country",
    league: "League",
    chooseLeague: "Choose league",
    chooseClub: "Choose club",
    clubModePreset: "Club from list",
    clubModeCustom: "Custom club",
    customClubHelp:
      "Use this for a club that is not in the list. You can then enter logo and colours manually.",

    primaryColor: "Primary color",
    secondaryColor: "Secondary color",
    tertiaryColor: "Tertiary color",
    colorBalance: "Primary balance (%)",
    logoUrl: "Club logo URL",

    heroChatTitle: "Work from what you concretely see.",
    heroChatBody:
      "Describe one situation, the player's behaviour and the effect on the game.",

    heroManualTitle: "Work manually from a sharp development point.",
    heroManualBody:
      "Fill in the core of the plan step by step. Start with the development point.",

    hintObservation: "Observation",
    hintMoment: "Moment",
    hintGoal: "Effect",
    hintRefine: "Refine",

    developmentPoint: "Development point",

    statusPoint: "Agreement",
    statusContext: "Context",
    statusReality: "Reality",
    statusApproach: "Approach",
    statusSuccess: "Success",

    noPlayerYet: "Player",

    downloadPlayer: "Download player plan",
    availableOther: "Also available in Dutch",
    downloadOther: "Download NL",
    exportTitle: "Download Plan",
    exportAlways: "Directly exportable",
    exportStrong:
      "You can download a usable PDF at any moment, even if the plan is not fully completed yet.",

    progressTitle: "Plan progress",
    progressBody:
      "This progress combines basics, content completion and supporting evidence.",

    evidenceTitle: "Evidence",
    evidenceBody:
      "Add evidence when it helps sharpen observation, context and follow-up.",

    videoTitle: "Video evidence",
    videoBody:
      "Add clips as visual evidence for the development point. Keep them concrete and relevant.",
    dataTitle: "Data evidence",
    dataBody:
      "Later you can connect data sources and indicators to the plan. This feature will be added in a future version.",
    notYetAvailable: "Not yet available",

    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Title",
    videoUrl: "Video URL",
    videoMoment: "Date / moment",
    videoSource: "Source",
    videoMatch: "Match",
    videoTraining: "Training",
    videoUpload: "Upload video",
    videoUploadHelp:
      "Upload works in this version within your session. We can connect fixed storage later with an upload API.",
    compactVideoOpen: "Open",
    compactVideoClose: "Close",
    compactVideoEmpty: "No clips",
    compactVideoCount: "clips",
    openClip: "Open clip",
    closeClip: "Close clip",

    langNl: "NL",
    langEn: "EN",

    step1Eyebrow: "Step 1",
    step1Title: "Who is this plan for?",
    step1Body:
      "Define the player this plan is built for. Name and position set the foundation. A photo is optional, but helps make the plan feel personal and instantly recognizable in preview and PDF.",
    editPhoto: "Edit photo",
    removePhoto: "Remove",
    playerVisualIdentity: "Visual identity",
    newPlayer: "New player",
    photoHelp:
      "For now, use an image URL. This photo is used in the visual preview and on the PDF cover.",
    photoPill: "Photo",
    avatarAdd: "Add",
    avatarEdit: "Edit",

    coverPreviewSub:
      "This preview uses the same portrait cover format as the final PDF.",
    presetActive: "Club preset active",
    coverSystemLine: "Personal Development Plan",

    workspaceTitle: "Workspace",
    workspaceBody:
      "From observation to plan. Build the conversation or development point first, then add evidence.",

    controlLayer: "Plan status",
    clubContext: "Club context",
    pdfReady: "PDF-ready",
    playerIdentity: "Player identity",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Team",
    completion: "Completion",
    completed: "Completed",
  },
} as const;

const COUNTRY_LABELS: Record<string, { nl: string; en: string }> = {
  Netherlands: { nl: "Nederland", en: "Netherlands" },
  Belgium: { nl: "België", en: "Belgium" },
  Germany: { nl: "Duitsland", en: "Germany" },
  England: { nl: "Engeland", en: "England" },
  France: { nl: "Frankrijk", en: "France" },
  Spain: { nl: "Spanje", en: "Spain" },
  Italy: { nl: "Italië", en: "Italy" },
  Portugal: { nl: "Portugal", en: "Portugal" },
  Sweden: { nl: "Zweden", en: "Sweden" },
  Other: { nl: "Overig", en: "Other" },
};

function countryLabel(country: string, lang: Lang) {
  const found = COUNTRY_LABELS[country];
  if (found) return found[lang];
  return country;
}

function getCountryLogoUrlByName(countryName: string) {
  const country = Object.values(countriesById).find(
    (c) => c.name === countryName
  );
  return country ? getCountryLogoFromDb(country.id) : "";
}

function getLeagueLogoUrlByName(leagueName: string) {
  const competition = Object.values(competitionsById).find(
    (c) => c.name === leagueName
  );
  return competition ? getCompetitionLogoUrl(competition.id) : "";
}

function createInitialPlan(): DevelopmentPlanV1 {
  const p = defaultDevelopmentPlan();
  p.meta.createdAtISO = "";
  p.player.name = "";
  p.player.role = "";
  p.player.team = "";
  p.brand.clubName = "";
  p.meta.club = "";
  p.meta.team = "";
  return p;
}

function clampHex(v: string | undefined, fallback = "#111111") {
  const s = String(v || "").trim();
  if (!s) return fallback;
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return fallback;
}

function clampPercent(v: string | number | undefined, fallback = 70) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function withAlpha(hex: string, alphaHex: string) {
  const safe = clampHex(hex, "#111111");
  return `${safe}${alphaHex}`;
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function textProgress(value: unknown, thresholds = { light: 8, medium: 24 }) {
  if (typeof value !== "string") return 0;
  const length = value.trim().length;
  if (length === 0) return 0;
  if (length < thresholds.light) return 0.33;
  if (length < thresholds.medium) return 0.66;
  return 1;
}

function arrayProgress(value: unknown, maxItems = 3) {
  if (!Array.isArray(value) || value.length === 0) return 0;
  return Math.min(value.length / maxItems, 1);
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function plannerFilled(planner: ChatPlannerState | null, key: string) {
  return !!planner?.filledSlots?.[key];
}

function mergeGeneratedPlanWithLockedBasics(
  current: DevelopmentPlanV1,
  generated: DevelopmentPlanV1
): DevelopmentPlanV1 {
  const next = structuredClone(generated);

  next.meta = {
    ...next.meta,
    club: current.meta.club,
    team: current.meta.team,
    blockLengthWeeks: current.meta.blockLengthWeeks,
    createdAtISO: current.meta.createdAtISO || next.meta.createdAtISO,
    lang: current.meta.lang || next.meta.lang,
  };

  next.brand = {
    ...next.brand,
    clubName: current.brand.clubName,
    primaryColor: current.brand.primaryColor,
    secondaryColor: current.brand.secondaryColor,
    colorBalance: current.brand.colorBalance,
    logoUrl: current.brand.logoUrl,
    ...(current.brand as any),
  };

  next.player = {
    ...next.player,
    name: current.player.name,
    role: current.player.role,
    team: current.player.team,
    phase: current.player.phase,
    headshotUrl: current.player.headshotUrl,
    ...(current.player as any),
  };

  return next;
}

const LEAGUE_ORDER: Record<string, string[]> = {
  Netherlands: ["Eredivisie", "KKD"],
  Belgium: ["Jupiler Pro League", "Challenger Pro League"],
  Germany: ["Bundesliga", "2. Bundesliga"],
  England: ["Premier League", "Championship", "League One"],
  France: ["Ligue 1", "Ligue 2"],
  Spain: ["La Liga", "Segunda División"],
  Italy: ["Serie A", "Serie B"],
  Portugal: ["Primeira Liga", "Liga Portugal 2"],
  Sweden: ["Allsvenskan", "Superettan"],
  Other: [],
};

export default function PlayerDevelopmentPlanBuilder() {
  const [plan, setPlan] = useState<DevelopmentPlanV1>(createInitialPlan());
  const [generatedPlan, setGeneratedPlan] =
    useState<DevelopmentPlanV1 | null>(null);

  const [lang, setLang] = useState<Lang>("en");
  const [mode, setMode] = useState<Mode>("chat");
  const prevModeRef = useRef(mode);

useEffect(() => {
  if (prevModeRef.current !== mode) {
    trackPdpModeChanged({ mode, lang });
    prevModeRef.current = mode;
  }
}, [mode, lang]);
  const [chatPlannerState, setChatPlannerState] =
    useState<ChatPlannerState | null>(null);
  const [pendingChatPrompt, setPendingChatPrompt] = useState("");

  const [basicsOpen, setBasicsOpen] = useState(true);
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [identityPhotoOpen, setIdentityPhotoOpen] = useState(false);
  const [videoPanelOpen, setVideoPanelOpen] = useState(false);
  const [openClipIndex, setOpenClipIndex] = useState<number | null>(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [clubMode, setClubMode] = useState<ClubMode>("preset");

  const [localVideoUploads, setLocalVideoUploads] = useState<
    Record<number, LocalVideoUpload | undefined>
  >({});

  const t = UI[lang];
  const otherLang: Lang = lang === "nl" ? "en" : "nl";
  const hasStartedRef = useRef(false);
const trackedFieldsRef = useRef<Record<string, boolean>>({});
const trackedSectionsRef = useRef<Record<string, boolean>>({});
const hasCompletedRef = useRef(false);

function ensureStarted(source: string) {
  if (hasStartedRef.current) return;

  hasStartedRef.current = true;

  trackPdpStarted({
    source,
    mode,
    lang,
  });
}

function trackFieldOnce(field: string, value?: any) {
  ensureStarted(field);

  if (trackedFieldsRef.current[field]) return;
  trackedFieldsRef.current[field] = true;

  trackPdpFieldStarted({
    field,
    value,
    mode,
    lang,
  });
}

  useEffect(() => {
    setGeneratedPlan(null);
  }, [
    plan.player.name,
    plan.player.role,
    plan.meta.club,
    plan.meta.team,
    plan.meta.blockLengthWeeks,
  ]);

  const activePreset = getClubPresetByName(plan.brand.clubName);
  const activePresetAny = activePreset as any;

  const primary = clampHex(plan.brand.primaryColor, "#111111");
  const secondary = clampHex(plan.brand.secondaryColor, "#FFFFFF");
  const tertiary = clampHex(activePresetAny?.tertiaryColor, primary);
  const balance = clampPercent((plan.brand as any).colorBalance, 70);

  const teamType = (((plan.player as any)?.teamType || "") as TeamType | "");
  const academyAge = (((plan.player as any)?.academyAgeCategory || "") as string);

  const coverReady =
    hasText(plan.player.name) &&
    hasText(plan.brand.clubName) &&
    hasText(plan.meta.team) &&
    hasText(plan.brand.primaryColor);

  const selectableClubPresets = useMemo(
    () => clubPresets.filter((club) => club.id !== "custom-club"),
    []
  );

  const availableCountries = useMemo(() => {
    return Array.from(
      new Set(selectableClubPresets.map((club) => club.country).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [selectableClubPresets]);

  const availableLeagues = useMemo(() => {
    if (!selectedCountry) return [];

    const leagues = Array.from(
      new Set(
        selectableClubPresets
          .filter((club) => club.country === selectedCountry)
          .map((club) => club.league)
          .filter(Boolean)
      )
    );

    const order = LEAGUE_ORDER[selectedCountry] || [];

    return leagues.sort((a, b) => {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);

      const aRank = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const bRank = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;

      if (aRank !== bRank) return aRank - bRank;
      return a.localeCompare(b);
    });
  }, [selectableClubPresets, selectedCountry]);

  const availableClubs = useMemo(() => {
    if (!selectedCountry || !selectedLeague) return [];
    return selectableClubPresets
      .filter(
        (club) =>
          club.country === selectedCountry && club.league === selectedLeague
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectableClubPresets, selectedCountry, selectedLeague]);

  const basicsProgress = useMemo(() => {
    let score = 0;
    let total = 0;

    const add = (weight: number, progress: number) => {
      total += weight;
      score += weight * progress;
    };

    add(18, textProgress(plan.player.name));
    add(12, textProgress(plan.player.role));
    add(6, hasText(plan.player.headshotUrl) ? 1 : 0);
    add(10, hasText(selectedCountry) ? 1 : 0);
    add(10, hasText(selectedLeague) ? 1 : 0);
    add(16, textProgress(plan.brand.clubName || plan.meta.club));
    add(10, hasText(teamType) ? 1 : 0);

    const teamDetailProgress =
      teamType === "academy"
        ? hasText(academyAge)
          ? 1
          : 0
        : teamType === "first_team"
        ? 1
        : 0;

    add(8, teamDetailProgress);

    add(
      10,
      [1, 2, 4, 6, 8].includes(Number(plan.meta.blockLengthWeeks)) ? 1 : 0
    );

    const progress = total === 0 ? 0 : clampProgress((score / total) * 100);

    return {
      progress,
      filled: Math.round(score),
      total,
    };
  }, [
    plan.player.name,
    plan.player.role,
    plan.player.headshotUrl,
    plan.brand.clubName,
    plan.meta.club,
    plan.meta.blockLengthWeeks,
    selectedCountry,
    selectedLeague,
    teamType,
    academyAge,
  ]);

  const agreementProgress = useMemo(() => {
    let score = 0;
    let total = 0;

    const add = (weight: number, progress: number) => {
      total += weight;
      score += weight * progress;
    };

    add(
      40,
      Math.max(
        textProgress(plan.slide2?.focusBehaviour),
        plannerFilled(chatPlannerState, "developmentPoint") ? 0.66 : 0
      )
    );

    add(
      35,
      Math.max(
        textProgress(plan.slide2?.developmentGoal),
        plannerFilled(chatPlannerState, "targetBehaviour") ? 0.66 : 0
      )
    );

    add(
      25,
      Math.max(
        textProgress(plan.slide2?.matchSituation),
        plannerFilled(chatPlannerState, "matchSituation") ? 0.66 : 0
      )
    );

    return {
      total,
      filled: Math.round(score),
      progress: total === 0 ? 0 : clampProgress((score / total) * 100),
    };
  }, [
    plan.slide2?.focusBehaviour,
    plan.slide2?.developmentGoal,
    plan.slide2?.matchSituation,
    chatPlannerState,
  ]);

  const contextProgress = useMemo(() => {
    let score = 0;
    let total = 0;

    const add = (weight: number, progress: number) => {
      total += weight;
      score += weight * progress;
    };

    add(
      34,
      Math.max(
        arrayProgress(plan.slideContext?.gameMoments),
        plannerFilled(chatPlannerState, "gameMoments") ? 0.66 : 0
      )
    );

    add(
      33,
      Math.max(
        arrayProgress(plan.slideContext?.zones),
        plannerFilled(chatPlannerState, "zones") ? 0.66 : 0
      )
    );

    add(
      33,
      Math.max(
        arrayProgress(plan.slideContext?.principles),
        plannerFilled(chatPlannerState, "principles") ? 0.66 : 0
      )
    );

    return {
      total,
      filled: Math.round(score),
      progress: total === 0 ? 0 : clampProgress((score / total) * 100),
    };
  }, [
    plan.slideContext?.gameMoments,
    plan.slideContext?.zones,
    plan.slideContext?.principles,
    chatPlannerState,
  ]);

  const realityProgress = useMemo(() => {
    let score = 0;
    let total = 0;

    const add = (weight: number, progress: number) => {
      total += weight;
      score += weight * progress;
    };

    add(
      28,
      Math.max(
        textProgress(plan.slide3Baseline?.intro),
        arrayProgress(plan.slide3Baseline?.observations),
        plannerFilled(chatPlannerState, "observations") ? 0.66 : 0
      )
    );

    add(
      24,
      Math.max(
        arrayProgress(plan.slide3?.what_we_see?.items),
        plannerFilled(chatPlannerState, "observations") ? 0.66 : 0
      )
    );

    add(
      24,
      Math.max(
        arrayProgress(plan.slide3?.moment?.items),
        arrayProgress(plan.slide3Baseline?.moments),
        plannerFilled(chatPlannerState, "whenObserved") ? 0.66 : 0
      )
    );

    add(
      24,
      Math.max(
        arrayProgress(plan.slide3?.effect_on_match?.items),
        arrayProgress(plan.slide3Baseline?.matchEffects),
        plannerFilled(chatPlannerState, "effectOnGame") ? 0.66 : 0
      )
    );

    return {
      total,
      filled: Math.round(score),
      progress: total === 0 ? 0 : clampProgress((score / total) * 100),
    };
  }, [
    plan.slide3Baseline?.intro,
    plan.slide3Baseline?.observations,
    plan.slide3?.what_we_see?.items,
    plan.slide3?.moment?.items,
    plan.slide3Baseline?.moments,
    plan.slide3?.effect_on_match?.items,
    plan.slide3Baseline?.matchEffects,
    chatPlannerState,
  ]);

  const approachProgress = useMemo(() => {
    let score = 0;
    let total = 0;

    const add = (weight: number, progress: number) => {
      total += weight;
      score += weight * progress;
    };

    add(
      20,
      Math.max(
        textProgress(plan.slide4DevelopmentRoute?.developmentRoute?.training),
        plannerFilled(chatPlannerState, "playerActions") ? 0.66 : 0
      )
    );

    add(
      20,
      Math.max(
        textProgress(plan.slide4DevelopmentRoute?.developmentRoute?.match),
        plannerFilled(chatPlannerState, "playerActions") ? 0.66 : 0
      )
    );

    add(
      20,
      Math.max(
        textProgress(plan.slide4DevelopmentRoute?.developmentRoute?.video),
        plannerFilled(chatPlannerState, "staffResponsibilities") ? 0.66 : 0
      )
    );

    add(
      20,
      Math.max(
        textProgress(plan.slide4DevelopmentRoute?.developmentRoute?.off_field),
        plannerFilled(chatPlannerState, "staffResponsibilities") ? 0.66 : 0
      )
    );

    add(
      20,
      Math.max(
        textProgress(plan.slide4DevelopmentRoute?.playerOwnText),
        plannerFilled(chatPlannerState, "playerActions") ? 0.66 : 0
      )
    );

    return {
      total,
      filled: Math.round(score),
      progress: total === 0 ? 0 : clampProgress((score / total) * 100),
    };
  }, [
    plan.slide4DevelopmentRoute?.developmentRoute?.training,
    plan.slide4DevelopmentRoute?.developmentRoute?.match,
    plan.slide4DevelopmentRoute?.developmentRoute?.video,
    plan.slide4DevelopmentRoute?.developmentRoute?.off_field,
    plan.slide4DevelopmentRoute?.playerOwnText,
    chatPlannerState,
  ]);

  const successProgress = useMemo(() => {
    let score = 0;
    let total = 0;

    const add = (weight: number, progress: number) => {
      total += weight;
      score += weight * progress;
    };

    add(
      34,
      Math.max(
        arrayProgress(plan.slide6SuccessDefinition?.inGame),
        plannerFilled(chatPlannerState, "successSignals") ? 0.66 : 0
      )
    );

    add(
      33,
      Math.max(
        arrayProgress(plan.slide6SuccessDefinition?.behaviour),
        plannerFilled(chatPlannerState, "successSignals") ? 0.66 : 0
      )
    );

    add(
      33,
      Math.max(
        arrayProgress(plan.slide6SuccessDefinition?.signals),
        plannerFilled(chatPlannerState, "successSignals") ? 0.66 : 0
      )
    );

    return {
      total,
      filled: Math.round(score),
      progress: total === 0 ? 0 : clampProgress((score / total) * 100),
    };
  }, [
    plan.slide6SuccessDefinition?.inGame,
    plan.slide6SuccessDefinition?.behaviour,
    plan.slide6SuccessDefinition?.signals,
    chatPlannerState,
  ]);

  const evidenceProgress = useMemo(() => {
    const clips: number[] = [0, 1, 2].map((idx) => {
      const hasUrl = !!(plan as any)?.slide3Baseline?.videoClips?.[idx]?.url;
      const hasUpload = !!localVideoUploads[idx];
      return hasUrl || hasUpload ? 1 : 0;
    });

    const total = 3;
    const score = clips.reduce((sum, item) => sum + item, 0);

    return {
      total,
      filled: score,
      progress: clampProgress((score / total) * 100),
    };
  }, [plan, localVideoUploads]);

  const sections = [
    { key: "basics", progress: basicsProgress.progress, weight: 18 },
    { key: "cover", progress: coverReady ? 100 : 0, weight: 7 },
    { key: "agreement", progress: agreementProgress.progress, weight: 14 },
    { key: "context", progress: contextProgress.progress, weight: 14 },
    { key: "reality", progress: realityProgress.progress, weight: 17 },
    { key: "approach", progress: approachProgress.progress, weight: 14 },
    { key: "success", progress: successProgress.progress, weight: 10 },
    { key: "evidence", progress: evidenceProgress.progress, weight: 6 },
  ];

  const totalProgress = Math.round(
    sections.reduce((sum, section) => {
      return sum + (section.progress * section.weight) / 100;
    }, 0)
  );

  const completedSections = sections.filter((s) => s.progress === 100).length;

  const clipCount = [0, 1, 2].filter(
    (idx) =>
      !!(plan as any)?.slide3Baseline?.videoClips?.[idx]?.url ||
      !!localVideoUploads[idx]
  ).length;

  const chatShellStyle = useMemo(() => {
    return {
      background: `
        radial-gradient(circle at 8% 8%, ${withAlpha(primary, "18")} 0%, transparent 22%),
        radial-gradient(circle at 92% 14%, ${withAlpha(secondary, "12")} 0%, transparent 18%),
        radial-gradient(circle at 86% 88%, ${withAlpha(tertiary, "0B")} 0%, transparent 16%),
        linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)),
        rgba(255,255,255,0.02)
      `,
      borderColor: withAlpha(primary, "22"),
      boxShadow: `inset 0 1px 0 ${withAlpha(primary, "22")}`,
    } as React.CSSProperties;
  }, [primary, secondary, tertiary]);

  function onPlanGenerated(next: DevelopmentPlanV1) {
    const merged = mergeGeneratedPlanWithLockedBasics(plan, next);
    setPlan(merged);
    setGeneratedPlan(merged);
  }

  function setTeamTypeValue(value: TeamType | "") {
    setPlan((prev) => {
      const next = structuredClone(prev);
      setGeneratedPlan(null);

      (next.player as any).teamType = value as TeamType;

      if (value === "first_team") {
        (next.player as any).academyAgeCategory = "";
        next.player.team = t.firstTeam;
        next.meta.team = t.firstTeam;
      }

      if (value === "academy") {
        next.player.team = "";
        next.meta.team = "";
      }

      if (!value) {
        next.player.team = "";
        next.meta.team = "";
        (next.player as any).academyAgeCategory = "";
      }

      return next;
    });
  }

  function applyClubPreset(clubName: string) {
    const preset = getClubPresetByName(clubName);
    const presetAny = preset as any;

    setPlan((prev) => {
      const next = structuredClone(prev);

      next.brand.clubName = clubName;
      next.meta.club = clubName;
      setGeneratedPlan(null);

      if (preset) {
        next.brand.logoUrl = preset.logoUrl || "";
        next.brand.primaryColor = preset.primaryColor;
        next.brand.secondaryColor = preset.secondaryColor;
        (next.brand as any).tertiaryColor = presetAny?.tertiaryColor || "";
        (next.brand as any).colorBalance = presetAny?.colorBalance ?? 70;
        setBrandingOpen(false);
      } else {
        setBrandingOpen(true);
      }

      return next;
    });
  }

  function updateVideoClip(index: number, patch: Record<string, string>) {
    setPlan((prev) => {
      const next = structuredClone(prev) as any;

      if (!next.slide3Baseline) next.slide3Baseline = {};
      if (!Array.isArray(next.slide3Baseline.videoClips)) {
        next.slide3Baseline.videoClips = [];
      }

      while (next.slide3Baseline.videoClips.length < 3) {
        next.slide3Baseline.videoClips.push({
          status: "pending",
          source: "match",
          title: "",
          url: "",
          timestamp: "",
          match_or_session: "",
        });
      }

      const current = next.slide3Baseline.videoClips[index] || {};
      const merged = {
        ...current,
        ...patch,
      };

      const hasUrl =
        typeof merged.url === "string" && merged.url.trim().length > 0;
      const hasUpload = !!localVideoUploads[index]?.fileName;

      merged.status = hasUrl || hasUpload ? "active" : "pending";
      next.slide3Baseline.videoClips[index] = merged;

      return next;
    });
  }

  function handleVideoUpload(index: number, file: File | null) {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);

    setLocalVideoUploads((prev) => {
      const old = prev[index];
      if (old?.objectUrl) {
        try {
          URL.revokeObjectURL(old.objectUrl);
        } catch {}
      }

      return {
        ...prev,
        [index]: {
          fileName: file.name,
          objectUrl,
        },
      };
    });

    setPlan((prev) => {
      const next = structuredClone(prev) as any;

      if (!next.slide3Baseline) next.slide3Baseline = {};
      if (!Array.isArray(next.slide3Baseline.videoClips)) {
        next.slide3Baseline.videoClips = [];
      }

      while (next.slide3Baseline.videoClips.length < 3) {
        next.slide3Baseline.videoClips.push({
          status: "pending",
          source: "match",
          title: "",
          url: "",
          timestamp: "",
          match_or_session: "",
        });
      }

      const current = next.slide3Baseline.videoClips[index] || {};
      next.slide3Baseline.videoClips[index] = {
        ...current,
        status: "active",
        title:
          current?.title && String(current.title).trim()
            ? current.title
            : file.name.replace(/\.[^/.]+$/, ""),
      };

      return next;
    });
  }

  async function download(version: "player" | "staff", exportLang: Lang) {
    try {
      const exportPlan = generatedPlan || plan;

      const res = await fetch(`/api/pdp/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: {
            ...exportPlan,
            meta: {
              ...exportPlan.meta,
              lang: exportLang,
            },
          },
          version,
          lang: exportLang,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText);
        return;
      }

      if (!contentType.toLowerCase().includes("pdf")) {
        const errorText = await res.text();
        alert(errorText);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `pdp-${version}-${exportLang}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Er ging iets mis bij het downloaden van de PDF.");
    }
  }

  function insertPrompt(text: string) {
    setPendingChatPrompt(`${text} `);
  }

  const contextualHints = useMemo(() => {
    const hints: Array<{ label: string; prompt: string }> = [];
    const planner = chatPlannerState;

    if (!planner) {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Beschrijf 1 concreet moment: wat doet de speler en wat gebeurt er daarna?"
              : "Describe 1 concrete moment: what does the player do and what happens next?",
        },
      ];
    }

    if (!plannerFilled(planner, "observations")) {
      hints.push({
        label: t.hintObservation,
        prompt:
          lang === "nl"
            ? "Beschrijf 1 concreet moment: wat doet de speler en wat gebeurt er daarna?"
            : "Describe 1 concrete moment: what does the player do and what happens next?",
      });
    }

    if (!plannerFilled(planner, "whenObserved")) {
      hints.push({
        label: t.hintMoment,
        prompt:
          lang === "nl"
            ? "Wanneer in de wedstrijd gebeurt dit? (fase, positie, context)"
            : "When in the match does this happen? (phase, position, context)",
      });
    }

    if (!plannerFilled(planner, "effectOnGame")) {
      hints.push({
        label: t.hintGoal,
        prompt:
          lang === "nl"
            ? "Wat is het effect op het spel of team als dit gebeurt?"
            : "What is the effect on the game or team when this happens?",
      });
    }

    if (hints.length === 0) {
      hints.push({
        label: t.hintRefine,
        prompt:
          lang === "nl"
            ? "Maak het scherper: wat doet de speler exact anders dan nodig en wat is direct het gevolg?"
            : "Make it sharper: what exactly does the player do differently than needed, and what is the direct consequence?",
      });
    }

    return hints.slice(0, 3);
  }, [chatPlannerState, t, lang]);

  return (
    <div className="bg-transparent text-white">
      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1340px] space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex justify-start sm:justify-center">
              <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
                <ModeBtn active={mode === "chat"} onClick={() => setMode("chat")}>
                  {t.modeChat}
                </ModeBtn>
                <ModeBtn
                  active={mode === "manual"}
                  onClick={() => setMode("manual")}
                >
                  {t.modeManual}
                </ModeBtn>
              </div>
            </div>

            <LangPill lang={lang} setLang={setLang} t={t} />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
            <div className="h-full overflow-visible rounded-[32px] border border-white/10 bg-white/[0.02]">
              <button
                onClick={() => setBasicsOpen((v) => !v)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/40">
                    {t.basicsTitle}
                  </div>
                  <div className="mt-1 text-[13px] text-white/55">
                    {t.basicsSubtitle}
                  </div>
                </div>

                <div className="text-sm text-white/45">{basicsOpen ? "▾" : "▸"}</div>
              </button>

              {basicsOpen && (
                <div className="space-y-5 px-6 pb-6">
                  <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                    <div className="mb-5">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">
                        {t.step1Eyebrow}
                      </div>

                      <div className="mt-2 text-[20px] leading-none text-white/92">
                        {t.step1Title}
                      </div>

                      <div className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-white/50">
                        {t.step1Body}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[110px_minmax(0,1fr)]">
                      <div className="flex flex-col items-center gap-3 md:items-start">
                        <button
                          type="button"
                          onClick={() => setIdentityPhotoOpen((v) => !v)}
                          className="group relative h-[96px] w-[96px] overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] transition hover:border-white/20"
                        >
                          {plan.player.headshotUrl ? (
                            <img
                              src={plan.player.headshotUrl}
                              className="h-full w-full object-cover"
                              alt={plan.player.name || ""}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <div className="flex flex-col items-center gap-1">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-sm text-white/70">
                                  +
                                </div>
                                <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                                  {t.photoPill}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1 opacity-0 transition group-hover:opacity-100">
                            <div className="text-[9px] uppercase tracking-[0.16em] text-white/70">
                              {plan.player.headshotUrl ? t.avatarEdit : t.avatarAdd}
                            </div>
                          </div>
                        </button>

                        <div className="text-center md:text-left">
                          <div className="text-[12px] text-white/75">
                            {plan.player.name || t.newPlayer}
                          </div>
                          <div className="mt-1 text-[11px] text-white/35">
                            {t.playerVisualIdentity}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Input
                          label={t.playerName}
                          value={plan.player.name}
                          onChange={(v) =>
                            setPlan((prev) => ({
                              ...prev,
                              player: { ...prev.player, name: v },
                            }))
                          }
                        />

                        <Input
                          label={t.playerPosition}
                          value={plan.player.role}
                          onChange={(v) =>
                            setPlan((prev) => ({
                              ...prev,
                              player: { ...prev.player, role: v },
                            }))
                          }
                        />

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {plan.player.headshotUrl && (
                            <button
                              type="button"
                              onClick={() => setIdentityPhotoOpen((v) => !v)}
                              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/78 hover:border-white/24 hover:text-white"
                            >
                              {t.editPhoto}
                            </button>
                          )}

                          {plan.player.headshotUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPlan((prev) => ({
                                  ...prev,
                                  player: { ...prev.player, headshotUrl: "" },
                                }))
                              }
                              className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/45 hover:text-white/75"
                            >
                              {t.removePhoto}
                            </button>
                          )}
                        </div>

                        {identityPhotoOpen && (
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <Input
                              label={t.playerPhoto}
                              value={plan.player.headshotUrl}
                              onChange={(v) =>
                                setPlan((prev) => ({
                                  ...prev,
                                  player: { ...prev.player, headshotUrl: v },
                                }))
                              }
                            />
                            <div className="mt-2 text-[11px] leading-relaxed text-white/35">
                              {t.photoHelp}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2 pt-1">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/34">
                        {t.basicsSectionClubContext}
                      </div>
                    </div>

                    <SimpleDropdown
                      label={t.country}
                      value={selectedCountry}
                      placeholder={t.chooseCountry}
                      items={availableCountries.map((country) => ({
                        value: country,
                        label: countryLabel(country, lang),
                        iconUrl: getCountryLogoUrlByName(country),
                      }))}
                      onChange={(value) => {
                        setSelectedCountry(value);
                        setSelectedLeague("");
                        setClubMode("preset");
                        setGeneratedPlan(null);
                        setPlan((prev) => ({
                          ...prev,
                          brand: {
                            ...prev.brand,
                            clubName: "",
                            logoUrl: "",
                          },
                          meta: {
                            ...prev.meta,
                            club: "",
                          },
                        }));
                      }}
                    />

                    {selectedCountry ? (
                      <SimpleDropdown
                        label={t.league}
                        value={selectedLeague}
                        placeholder={t.chooseLeague}
                        disabled={!selectedCountry}
                        items={availableLeagues.map((league) => ({
                          value: league,
                          label: league,
                          iconUrl: getLeagueLogoUrlByName(league),
                        }))}
                        onChange={(value) => {
                          setSelectedLeague(value);
                          setClubMode("preset");
                          setGeneratedPlan(null);
                          setPlan((prev) => ({
                            ...prev,
                            brand: {
                              ...prev.brand,
                              clubName: "",
                              logoUrl: "",
                            },
                            meta: {
                              ...prev.meta,
                              club: "",
                            },
                          }));
                        }}
                      />
                    ) : (
                      <div />
                    )}

                    {(selectedCountry || selectedLeague) && (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                        <div className="mb-3 text-[11px] uppercase tracking-wide text-white/40">
                          {t.club}
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                          <ChoicePill
                            active={clubMode === "preset"}
                            onClick={() => {
                              setClubMode("preset");
                              setGeneratedPlan(null);
                              setPlan((prev) => ({
                                ...prev,
                                brand: {
                                  ...prev.brand,
                                  clubName: "",
                                  logoUrl: "",
                                },
                                meta: {
                                  ...prev.meta,
                                  club: "",
                                },
                              }));
                            }}
                          >
                            {t.clubModePreset}
                          </ChoicePill>

                          <ChoicePill
                            active={clubMode === "custom"}
                            onClick={() => {
                              setClubMode("custom");
                              setBrandingOpen(true);
                              setGeneratedPlan(null);
                              setPlan((prev) => ({
                                ...prev,
                                brand: {
                                  ...prev.brand,
                                  clubName: "",
                                  logoUrl: "",
                                },
                                meta: {
                                  ...prev.meta,
                                  club: "",
                                },
                              }));
                            }}
                          >
                            {t.clubModeCustom}
                          </ChoicePill>
                        </div>

                        {clubMode === "preset" ? (
                          <SimpleDropdown
                            label=""
                            value={plan.brand.clubName || ""}
                            placeholder={t.chooseClub}
                            disabled={!selectedLeague}
                            items={availableClubs.map((club) => ({
                              value: club.name,
                              label: club.name,
                              iconUrl: club.logoUrl,
                            }))}
                            onChange={(value) => {
                              applyClubPreset(value);
                            }}
                            hideLabel
                          />
                        ) : (
                          <div>
                            <Input
                              label={t.customClub}
                              value={plan.meta.club || ""}
                              onChange={(v) =>
                                setPlan((prev) => ({
                                  ...prev,
                                  meta: { ...prev.meta, club: v },
                                  brand: { ...prev.brand, clubName: v },
                                }))
                              }
                            />
                            <div className="mt-2 text-[11px] leading-relaxed text-white/35">
                              {t.customClubHelp}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="sm:col-span-2 pt-2">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/34">
                        {t.basicsSectionPlanSetup}
                      </div>
                    </div>

                    <SegmentedToggle
                      label={t.teamType}
                      value={teamType}
                      leftValue="academy"
                      rightValue="first_team"
                      leftLabel={t.academy}
                      rightLabel={t.firstTeam}
                      onChange={(value) => setTeamTypeValue(value as TeamType)}
                    />

                    {teamType === "academy" ? (
                      <SimpleDropdown
                        label={t.ageCategory}
                        value={academyAge}
                        placeholder={t.chooseAgeCategory}
                        items={ACADEMY_AGES.map((age) => ({
                          value: age,
                          label: age,
                        }))}
                        onChange={(value) =>
                          setPlan((prev) => ({
                            ...prev,
                            player: {
                              ...prev.player,
                              academyAgeCategory: value,
                              team: value,
                            } as any,
                            meta: {
                              ...prev.meta,
                              team: value,
                            },
                          }))
                        }
                      />
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    <div className="sm:col-span-2">
                      <WeekLengthPicker
                        label={t.periodWeeks}
                        value={plan.meta.blockLengthWeeks || 8}
                        lang={lang}
                        onChange={(value) =>
                          setPlan((prev) => ({
                            ...prev,
                            meta: {
                              ...prev.meta,
                              blockLengthWeeks: value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-full rounded-[32px] border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-white/38">
                    {t.brandingTitle}
                  </div>
                  <div className="mt-2 max-w-[34ch] text-[13px] leading-relaxed text-white/55">
                    {t.coverPreviewSub}
                  </div>
                </div>

                <button
                  onClick={() => setBrandingOpen((v) => !v)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[12px] text-white/72 transition hover:border-white/18 hover:text-white"
                >
                  {brandingOpen ? t.brandingCollapse : t.brandingEdit}
                </button>
              </div>

              <div className="mt-6">
                <CoverPreviewStage
                  t={t}
                  clubName={plan.brand.clubName || t.club}
                  logoUrl={plan.brand.logoUrl}
                  playerName={plan.player.name || t.noPlayerYet}
                  playerImageUrl={plan.player.headshotUrl}
                  primary={primary}
                  secondary={secondary}
                  balance={balance}
                  systemLine={t.coverSystemLine}
                  teamLabel={plan.meta.team || t.teamType}
                />
              </div>

              <div className="mt-4 flex min-h-[20px] items-center gap-2">
                <div className="text-[12px] text-white/50">
                  {plan.brand.clubName || t.club}
                </div>

                {activePreset ? (
                  <div className="text-[11px] text-white/28">
                    • {t.presetActive}
                  </div>
                ) : null}
              </div>

              {brandingOpen && (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label={t.primaryColor}
                    value={plan.brand.primaryColor}
                    onChange={(v) =>
                      setPlan((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, primaryColor: v },
                      }))
                    }
                  />

                  <Input
                    label={t.secondaryColor}
                    value={plan.brand.secondaryColor}
                    onChange={(v) =>
                      setPlan((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, secondaryColor: v },
                      }))
                    }
                  />

                  <Input
                    label={t.tertiaryColor}
                    value={(plan.brand as any).tertiaryColor || ""}
                    onChange={(v) =>
                      setPlan((prev) => ({
                        ...prev,
                        brand: { ...(prev.brand as any), tertiaryColor: v },
                      }))
                    }
                  />

                  <Input
                    label={t.colorBalance}
                    value={String((plan.brand as any).colorBalance || 70)}
                    onChange={(v) =>
                      setPlan((prev) => ({
                        ...prev,
                        brand: {
                          ...(prev.brand as any),
                          colorBalance: Number(v),
                        },
                      }))
                    }
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label={t.logoUrl}
                      value={plan.brand.logoUrl}
                      onChange={(v) =>
                        setPlan((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, logoUrl: v },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,1.42fr)_360px]">
            <div
              className="flex min-h-[760px] flex-col rounded-[30px] border bg-white/[0.02]"
              style={chatShellStyle}
            >
              <div className="border-b border-white/8 px-6 py-5">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/38">
                  {t.workspaceTitle}
                </div>
                <div className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-white/56">
                  {t.workspaceBody}
                </div>
              </div>

              <div className="flex flex-1 flex-col px-6 py-5">
                {mode === "chat" ? (
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="max-w-[62ch]">
                      <div className="text-[28px] font-medium tracking-[-0.03em] text-white/92">
                        {t.heroChatTitle}
                      </div>
                      <div className="mt-3 text-[14px] leading-relaxed text-white/52">
                        {t.heroChatBody}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {contextualHints.map((hint) => (
                        <Hint
                          key={hint.label}
                          onClick={() => insertPrompt(hint.prompt)}
                          subtleColor={primary}
                        >
                          {hint.label}
                        </Hint>
                      ))}
                    </div>

                    <div className="mt-1 flex-1 overflow-hidden rounded-[26px] border border-white/10 bg-[#0d1117]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <div
                        className="h-full w-full"
                        style={{
                          background: `
                            linear-gradient(180deg, ${withAlpha(primary, "0E")} 0%, transparent 18%),
                            radial-gradient(circle at 100% 0%, ${withAlpha(secondary, "0A")} 0%, transparent 22%)
                          `,
                        }}
                      >
                        <div className="h-full min-h-[560px]">
                          <PdpChat
                            lang={lang}
                            draftPlan={plan}
                            onPlanGenerated={onPlanGenerated}
                            onPlannerStateChange={setChatPlannerState}
                            onViewPlan={() => {
                              console.log("Current builder plan:", generatedPlan || plan);
                            }}
                            onDownloadPdf={(version) => download(version, lang)}
                            embedded
                            minimalHeader
                            hidePromptChips
                            externalPrompt={pendingChatPrompt}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-1">
                    <div className="max-w-[40ch] text-[20px] font-medium text-white/92">
                      {t.heroManualTitle}
                    </div>
                    <div className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/55">
                      {t.heroManualBody}
                    </div>

                    <div className="mt-8 max-w-[520px]">
                      <Input
                        label={t.developmentPoint}
                        value={plan.slide2?.focusBehaviour}
                        onChange={(v) =>
                          setPlan((prev) => ({
                            ...prev,
                            slide2: { ...prev.slide2, focusBehaviour: v },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-h-[760px] flex-col gap-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/38">
                  {t.progressTitle}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-white/52">
                  {t.progressBody}
                </div>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-white/94">
                      {totalProgress}%
                    </div>
                    <div className="mt-2 text-[12px] text-white/40">
                      {completedSections}/{sections.length} {t.completed.toLowerCase()}
                    </div>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
                    {t.completion}
                  </div>
                </div>

                <div className="mt-4 h-[10px] overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${totalProgress}%`,
                      background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 72%, ${tertiary} 100%)`,
                      boxShadow: `0 0 16px ${withAlpha(primary, "40")}`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/38">
                  {t.evidenceTitle}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-white/52">
                  {t.evidenceBody}
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-[18px] border border-white/8 bg-[#0b0f14]">
                    <button
                      type="button"
                      onClick={() => setVideoPanelOpen((v) => !v)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                    >
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-white/88">
                          {t.videoTitle}
                        </div>
                        <div className="mt-1 text-[12px] leading-relaxed text-white/45">
                          {t.videoBody}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <MiniMetaPill>
                          {clipCount > 0
                            ? `${clipCount} ${t.compactVideoCount}`
                            : t.compactVideoEmpty}
                        </MiniMetaPill>
                        <div className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/72">
                          {videoPanelOpen ? t.compactVideoClose : t.compactVideoOpen}
                        </div>
                      </div>
                    </button>

                    {videoPanelOpen && (
                      <div className="border-t border-white/8 px-4 pb-4 pt-3">
                        <div className="space-y-3">
                          {[0, 1, 2].map((idx) => {
                            const titles = [t.videoClip1, t.videoClip2, t.videoClip3];
                            const clip = (plan as any)?.slide3Baseline?.videoClips?.[idx];
                            const upload = localVideoUploads[idx];
                            const isOpen = openClipIndex === idx;
                            const isActive = !!upload?.fileName || !!clip?.url;

                            return (
                              <div
                                key={idx}
                                className="overflow-hidden rounded-[16px] border border-white/8 bg-white/[0.02]"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenClipIndex((prev) => (prev === idx ? null : idx))
                                  }
                                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                >
                                  <div className="min-w-0">
                                    <div className="text-[13px] font-medium text-white/86">
                                      {titles[idx]}
                                    </div>
                                    <div className="mt-1 text-[11px] text-white/40">
                                      {isActive ? "Active" : "Optional"}
                                    </div>
                                  </div>

                                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
                                    {isOpen ? t.closeClip : t.openClip}
                                  </div>
                                </button>

                                {isOpen && (
                                  <div className="border-t border-white/8 px-4 pb-4 pt-3">
                                    <VideoCardCompact
                                      title={titles[idx]}
                                      clip={clip}
                                      upload={upload}
                                      t={t}
                                      onChange={(patch) => updateVideoClip(idx, patch)}
                                      onUpload={(file) => handleVideoUpload(idx, file)}
                                      compact
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 text-[12px] leading-relaxed text-white/34">
                          {t.videoUploadHelp}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-[18px] border border-white/8 bg-white/[0.02] p-4 opacity-65">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[13px] font-medium text-white/82">
                          {t.dataTitle}
                        </div>
                        <div className="mt-1 text-[12px] leading-relaxed text-white/42">
                          {t.dataBody}
                        </div>
                      </div>

                      <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/60">
                        {t.notYetAvailable}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/38">
                  {t.exportTitle}
                </div>
                <div className="mt-2 text-[16px] font-medium leading-tight text-white/92">
                  {t.exportAlways}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-white/50">
                  {t.exportStrong}
                </div>

                <div className="mt-4 space-y-2.5">
                  <button
                    onClick={() => download("player", lang)}
                    className="w-full rounded-full bg-white py-3 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    {t.downloadPlayer}
                  </button>

                  <div className="pt-1 text-center text-[11px] text-white/35">
                    {t.availableOther}
                  </div>

                  <button
                    onClick={() => download("player", otherLang)}
                    className="w-full rounded-full border border-white/10 bg-white/[0.02] py-2.5 text-[12px] text-white/72 transition hover:border-white/18 hover:text-white"
                  >
                    {t.downloadOther}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleDropdown({
  label,
  value,
  placeholder,
  items,
  onChange,
  hideLabel = false,
  disabled = false,
}: {
  label: string;
  value?: string;
  placeholder: string;
  items: Array<{ value: string; label: string; iconUrl?: string }>;
  onChange: (v: string) => void;
  hideLabel?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedItem = items.find((item) => item.value === value) || null;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const idx = items.findIndex((item) => item.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
  }, [open, value, items]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-simple-option-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  useEffect(() => {
    if (disabled && open) {
      setOpen(false);
      setActiveIndex(-1);
    }
  }, [disabled, open]);

  function commitActive() {
    const item = items[activeIndex];
    if (!item) return;
    onChange(item.value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      commitActive();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={rootRef}>
      {!hideLabel ? (
        <div className="mb-2 text-[11px] uppercase tracking-wide text-white/40">
          {label}
        </div>
      ) : null}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setOpen((v) => !v);
          }}
          onKeyDown={onKeyDown}
          className={`min-h-[52px] w-full rounded-xl px-4 py-3 text-left transition focus:outline-none ${
            disabled
              ? "cursor-not-allowed border border-white/6 bg-white/[0.02]"
              : "border border-white/10 bg-white/[0.04] hover:border-white/16 focus:border-white/24 focus:bg-white/[0.06]"
          }`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3">
              {selectedItem?.iconUrl ? (
                <img
                  src={selectedItem.iconUrl}
                  alt=""
                  className="h-5 w-5 shrink-0 object-contain"
                />
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full border border-white/10 bg-white/[0.03]" />
              )}

              <div
                className={`truncate text-[14px] ${
                  disabled ? "text-white/28" : "text-white/90"
                }`}
              >
                {selectedItem?.label || placeholder}
              </div>
            </div>

            <div className={`shrink-0 ${disabled ? "text-white/20" : "text-white/35"}`}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 5.25L7 9.25L11 5.25"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </button>

        {open ? (
          <div className="absolute z-[999] mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101317] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div
              ref={listRef}
              className="max-h-[280px] overflow-y-auto p-2"
              role="listbox"
            >
              {items.map((item, idx) => {
                const active = idx === activeIndex;
                const selected = item.value === value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    data-simple-option-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => {
                      onChange(item.value);
                      setOpen(false);
                      setActiveIndex(-1);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                      active || selected
                        ? "border border-white/10 bg-white/[0.08]"
                        : "border border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {item.iconUrl ? (
                        <img
                          src={item.iconUrl}
                          alt=""
                          className="h-5 w-5 shrink-0 object-contain"
                        />
                      ) : (
                        <div className="h-5 w-5 shrink-0 rounded-full border border-white/10 bg-white/[0.03]" />
                      )}

                      <span className="truncate text-[14px] text-white/90">
                        {item.label}
                      </span>
                    </div>

                    {selected ? (
                      <div className="shrink-0 text-white/45">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 7.5L5.5 10L11 4.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SegmentedToggle({
  label,
  value,
  leftValue,
  rightValue,
  leftLabel,
  rightLabel,
  onChange,
}: {
  label: string;
  value?: string;
  leftValue: string;
  rightValue: string;
  leftLabel: string;
  rightLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-wide text-white/40">
        {label}
      </div>
      <div className="flex min-h-[52px] items-center rounded-xl border border-white/10 bg-white/[0.04] p-1">
        <button
          type="button"
          onClick={() => onChange(leftValue)}
          className={`flex-1 rounded-[10px] px-4 py-3 text-[13px] transition ${
            value === leftValue
              ? "bg-white text-black"
              : "text-white/72 hover:text-white"
          }`}
        >
          {leftLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(rightValue)}
          className={`flex-1 rounded-[10px] px-4 py-3 text-[13px] transition ${
            value === rightValue
              ? "bg-white text-black"
              : "text-white/72 hover:text-white"
          }`}
        >
          {rightLabel}
        </button>
      </div>
    </div>
  );
}

function VideoCardCompact({
  title,
  clip,
  upload,
  t,
  onChange,
  onUpload,
  compact = false,
}: {
  title: string;
  clip?: any;
  upload?: LocalVideoUpload;
  t: (typeof UI)["nl"] | (typeof UI)["en"];
  onChange: (patch: Record<string, string>) => void;
  onUpload: (file: File | null) => void;
  compact?: boolean;
}) {
  const source = clip?.source === "training" ? "training" : "match";
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={compact ? "space-y-2.5" : "rounded-[18px] border border-white/10 bg-white/[0.02] p-3"}>
      {!compact && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-[13px] font-medium text-white/86">{title}</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/34">
            {upload?.fileName || clip?.url ? "Active" : "Optional"}
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        <InputCompact
          label={t.videoName}
          value={clip?.title || ""}
          onChange={(v) => onChange({ title: v })}
        />

        <InputCompact
          label={t.videoUrl}
          value={clip?.url || ""}
          onChange={(v) => onChange({ url: v })}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/78 transition hover:border-white/18 hover:text-white"
          >
            {t.videoUpload}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onUpload(file);
            }}
          />

          {upload?.fileName ? (
            <div className="min-w-0 truncate text-[11px] text-white/42">
              {upload.fileName}
            </div>
          ) : null}
        </div>

        <InputCompact
          label={t.videoMoment}
          value={clip?.timestamp || ""}
          onChange={(v) => onChange({ timestamp: v })}
        />

        <SimpleDropdown
          label={t.videoSource}
          value={source}
          placeholder={t.videoSource}
          items={[
            { value: "match", label: t.videoMatch },
            { value: "training", label: t.videoTraining },
          ]}
          onChange={(v) => onChange({ source: v })}
        />
      </div>
    </div>
  );
}

function InputCompact({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-[10px] uppercase tracking-wide text-white/40">
        {label}
      </div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-white/20 bg-transparent py-1.5 text-[12px] focus:border-white focus:outline-none"
      />
    </div>
  );
}

function WeekLengthPicker({
  label,
  value,
  lang,
  onChange,
}: {
  label: string;
  value?: number;
  lang: Lang;
  onChange: (v: number) => void;
}) {
  const options = [1, 2, 4, 6, 8];
  const current = value || 8;

  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-wide text-white/40">
        {label}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = current === option;
          const suffix =
            lang === "nl"
              ? option === 1
                ? "week"
                : "weken"
              : option === 1
              ? "week"
              : "weeks";

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-full px-3 py-2 text-[13px] transition ${
                active
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/[0.04] text-white/72 hover:border-white/20 hover:text-white"
              }`}
            >
              {option} {suffix}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoicePill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[12px] transition ${
        active
          ? "bg-white text-black"
          : "border border-white/10 bg-white/[0.04] text-white/72 hover:border-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function ModeBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[13px] transition ${
        active ? "bg-white text-black" : "text-white/52 hover:text-white/82"
      }`}
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] uppercase tracking-wide text-white/40">
        {label}
      </div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-white/20 bg-transparent py-2 text-[14px] focus:border-white focus:outline-none"
      />
    </div>
  );
}

function LangPill({
  lang,
  setLang,
  t,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof UI)["nl"] | (typeof UI)["en"];
}) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 text-[11px] tracking-[0.14em]">
      <button
        onClick={() => setLang("nl")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "nl" ? "bg-white text-black" : "text-white/48 hover:text-white/78"
        }`}
      >
        {t.langNl}
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "en" ? "bg-white text-black" : "text-white/48 hover:text-white/78"
        }`}
      >
        {t.langEn}
      </button>
    </div>
  );
}

function Hint({
  children,
  onClick,
  subtleColor,
}: {
  children: React.ReactNode;
  onClick: () => void;
  subtleColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-[12px] transition hover:text-white"
      style={{
        borderColor: subtleColor ? withAlpha(subtleColor, "2E") : "rgba(255,255,255,0.1)",
        background: subtleColor
          ? `linear-gradient(180deg, ${withAlpha(subtleColor, "14")} 0%, rgba(255,255,255,0.03) 100%)`
          : "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.72)",
      }}
    >
      {children}
    </button>
  );
}

function MiniMetaPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] tracking-[0.18em] text-white/54">
      {children}
    </div>
  );
}

function CoverPreviewStage({
  t,
  clubName,
  logoUrl,
  playerName,
  playerImageUrl,
  primary,
  secondary,
  balance,
  systemLine,
  teamLabel,
}: {
  t: (typeof UI)["nl"] | (typeof UI)["en"];
  clubName: string;
  logoUrl?: string;
  playerName: string;
  playerImageUrl?: string;
  primary: string;
  secondary: string;
  balance: number;
  systemLine: string;
  teamLabel: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/8 bg-[rgba(255,255,255,0.02)] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <MiniMetaPill>{t.clubContext}</MiniMetaPill>
        <MiniMetaPill>{t.pdfReady}</MiniMetaPill>
      </div>

      <div className="rounded-[24px] border border-white/8 bg-black/20 p-3 sm:p-4">
        <CoverPreviewCard
          clubName={clubName}
          logoUrl={logoUrl}
          playerName={playerName}
          playerImageUrl={playerImageUrl}
          primary={primary}
          secondary={secondary}
          balance={balance}
          systemLine={systemLine}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <MiniMetaPill>{t.playerIdentity}</MiniMetaPill>
        <MiniMetaPill>
          {t.brandingMetaClub}: {clubName}
        </MiniMetaPill>
        <MiniMetaPill>
          {t.brandingMetaTeam}: {teamLabel}
        </MiniMetaPill>
      </div>
    </div>
  );
}

function CoverPreviewCard({
  clubName,
  logoUrl,
  playerName,
  playerImageUrl,
  primary,
  secondary,
  balance,
  systemLine,
}: {
  clubName: string;
  logoUrl?: string;
  playerName: string;
  playerImageUrl?: string;
  primary: string;
  secondary: string;
  balance: number;
  systemLine: string;
}) {
  const safePlayer = playerName?.trim() || "Player";
  const safeSystem =
    systemLine?.trim() || "Performance Development System";
  const safeFooterClub = clubName?.trim() || "Club";

  return (
    <div className="relative mx-auto aspect-[210/297] w-full max-w-[540px] overflow-hidden rounded-[26px] border border-white/12 bg-[#07090C] shadow-[0_30px_100px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-0 bg-[#07090C]" />

      {playerImageUrl ? (
        <img
          src={playerImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: "center 22%",
            transform: "scale(1.03)",
            opacity: 0.9,
            filter: "saturate(.94) contrast(1.03)",
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 74% 24%, rgba(255,255,255,.07) 0%, transparent 18%),
              radial-gradient(circle at 84% 78%, ${primary}33 0%, transparent 28%),
              linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0)),
              #0A0D11
            `,
          }}
        />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.88)_0%,rgba(0,0,0,.58)_38%,rgba(0,0,0,.52)_58%,rgba(0,0,0,.76)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08)_0%,rgba(0,0,0,.34)_100%)]" />

      <div
        className="absolute -left-[8%] -top-[8%] h-[48%] w-[48%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primary}55 0%, transparent 68%)`,
          opacity: 0.5,
        }}
      />

      <div
        className="absolute -bottom-[12%] -right-[12%] h-[46%] w-[46%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${secondary}22 0%, transparent 72%)`,
          opacity: 0.22,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "4px 4px",
        }}
      />

      <div className="absolute inset-[14px] rounded-[22px] border border-white/8" />

      <div
        className="absolute bottom-[6%] left-[8.5%] top-[6%] w-[3px] rounded-full"
        style={{
          background: `linear-gradient(180deg, ${primary} 0%, rgba(255,255,255,0.08) 100%)`,
          boxShadow: `0 0 12px ${primary}33`,
        }}
      />

      {logoUrl ? (
        <div className="absolute right-[5.5%] top-[5%] z-20 flex h-[12.5%] w-[12.5%] min-h-[50px] min-w-[50px] max-h-[72px] max-w-[72px] items-center justify-center overflow-hidden rounded-[18px] border border-white/16 bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <img
            src={logoUrl}
            alt=""
            className="h-[56%] w-[56%] object-contain"
          />
        </div>
      ) : (
        <div className="absolute right-[5.5%] top-[5%] z-20 flex h-[12.5%] w-[12.5%] min-h-[50px] min-w-[50px] max-h-[72px] max-w-[72px] items-center justify-center overflow-hidden rounded-[18px] border border-white/12 bg-white/[0.06] backdrop-blur-md">
          <div className="h-[44%] w-[44%] rounded-full bg-white/20" />
        </div>
      )}

      <div className="absolute left-[12.5%] right-[18%] bottom-[12%] z-20">
        <div className="text-[clamp(7px,0.8vw,9px)] uppercase tracking-[0.22em] text-white/55">
          {safeSystem}
        </div>

        <div className="mt-[5.2%] max-w-[94%] break-words text-[clamp(22px,4.6vw,44px)] font-semibold leading-[0.92] tracking-[-0.06em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.24)]">
          {safePlayer}
        </div>

        <div
          className="mt-[7%] h-[2px] w-[24%] min-w-[48px] max-w-[84px] rounded-full"
          style={{
            background: `linear-gradient(90deg, ${primary} 0%, transparent 100%)`,
            boxShadow: `0 0 12px ${primary}2E`,
          }}
        />
      </div>

      <div className="absolute bottom-[5.4%] left-[12.5%] right-[5.5%] z-20 flex items-center justify-between gap-4">
        <div className="min-w-0 max-w-[74%] truncate text-[clamp(7px,0.82vw,9.5px)] uppercase tracking-[0.22em] text-white/68">
          {safeFooterClub}
        </div>

        <div
          className="ml-auto h-[2px] w-[18%] min-w-[42px] max-w-[74px] rounded-full"
          style={{
            background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 100%)`,
            boxShadow: `0 0 10px ${primary}24`,
          }}
        />
      </div>
    </div>
  );
}