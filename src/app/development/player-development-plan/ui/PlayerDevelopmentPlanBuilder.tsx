"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  defaultDevelopmentPlan,
  type DevelopmentPlanV1,
} from "./lib/engineSchema";
import { clubPresets, getClubPresetByName } from "./lib/clubPresets";
import { PdpChat, type ChatPlannerState } from "./components/PdpChat";

type Lang = "nl" | "en";
type Mode = "chat" | "manual";
type TeamType = "academy" | "first_team";
type ClubMode = "preset" | "custom";

type LocalVideoUpload = {
  fileName: string;
  objectUrl: string;
};

const ACADEMY_AGES = ["O13", "O14", "O15", "O16", "O17", "O18", "O19", "O21", "Jong"];

const UI = {
  nl: {
    eyebrow: "PLAYER DEVELOPMENT PLAN",
    subtitle: "Van gesprek naar gestructureerd plan",

    modeChat: "Gesprek",
    modeManual: "Handmatig",

    basicsTitle: "Planbasis",
    basicsSubtitle:
      "Leg eerst vast voor wie dit plan geldt. Club, team en branding bepalen daarna automatisch de juiste context.",

    brandingTitle: "Visuele preview",
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
    chooseTeamType: "Kies team",
    chooseAgeCategory: "Kies leeftijdscategorie",
    periodWeeks: "Periode ontwikkelplan (weken)",

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
    colorBalance: "Kleurverdeling (%)",
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

    developmentPoint: "Ontwikkelpunt",

    statusPoint: "Afspraak",
    statusContext: "Context",
    statusReality: "Realiteit",
    statusApproach: "Aanpak",
    statusSuccess: "Succes",

    noPlayerYet: "Speler",

    downloadPlayer: "Download spelerplan",
    downloadStaff: "Download staffplan",
    availableOther: "Ook beschikbaar in het Engels",
    downloadOther: "Download EN",
    exportAlways: "Altijd beschikbaar",
    exportStrong:
      "Je kunt het plan op ieder moment exporteren — ook als het nog niet volledig is afgerond.",

    videoTitle: "Video / clips",
    videoBody:
      "Voeg relevante wedstrijd- of trainingsbeelden toe. Werk met een link of kies direct een bestand vanaf je laptop.",
    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Titel",
    videoUrl: "Video URL",
    videoMoment: "Datum / voorbeeldmoment",
    videoSource: "Bron",
    videoMatch: "Wedstrijd",
    videoTraining: "Training",
    videoUpload: "Upload video",
    videoChosen: "Gekozen bestand",
    videoOr: "of",
    videoUploadHelp:
      "Upload werkt in deze versie binnen je sessie. Voor vaste opslag koppelen we later een upload-API.",

    langNl: "NL",
    langEn: "EN",

    step1Eyebrow: "Stap 1",
    step1Title: "Voor wie is dit plan?",
    step1Body:
      "Leg vast voor welke speler dit plan wordt gebouwd. Naam en positie vormen de basis. Een foto is optioneel, maar helpt om het plan visueel eigen en direct herkenbaar te maken in preview en PDF.",
    addPhoto: "Foto toevoegen",
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

    progressHeader: "We maken dit plan voor",
    totalProgress: "Totale voortgang",
    planProgress: "Planvoortgang",
    exportTitle: "Download plan",
    coverSlide: "Cover",
    ready: "Klaar",
  },
  en: {
    eyebrow: "PLAYER DEVELOPMENT PLAN",
    subtitle: "From conversation to structured plan",

    modeChat: "Conversation",
    modeManual: "Manual",

    basicsTitle: "Plan basics",
    basicsSubtitle:
      "First define who this plan is for. Club, team and branding then shape the right context automatically.",

    brandingTitle: "Visual preview",
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
    chooseTeamType: "Choose team",
    chooseAgeCategory: "Choose age category",
    periodWeeks: "Development plan period (weeks)",

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
    colorBalance: "Color balance (%)",
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

    developmentPoint: "Development point",

    statusPoint: "Agreement",
    statusContext: "Context",
    statusReality: "Reality",
    statusApproach: "Approach",
    statusSuccess: "Success",

    noPlayerYet: "Player",

    downloadPlayer: "Download player plan",
    downloadStaff: "Download staff plan",
    availableOther: "Also available in Dutch",
    downloadOther: "Download NL",
    exportAlways: "Always available",
    exportStrong:
      "You can export the plan at any moment — even if it is not fully completed yet.",

    videoTitle: "Video / clips",
    videoBody:
      "Add relevant match or training footage. Work with a link or choose a file directly from your laptop.",
    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Title",
    videoUrl: "Video URL",
    videoMoment: "Date / example moment",
    videoSource: "Source",
    videoMatch: "Match",
    videoTraining: "Training",
    videoUpload: "Upload video",
    videoChosen: "Chosen file",
    videoOr: "or",
    videoUploadHelp:
      "Upload works in this version within your session. We can connect fixed storage later with an upload API.",

    langNl: "NL",
    langEn: "EN",

    step1Eyebrow: "Step 1",
    step1Title: "Who is this plan for?",
    step1Body:
      "Define the player this plan is built for. Name and position set the foundation. A photo is optional, but helps make the plan feel personal and instantly recognizable in preview and PDF.",
    addPhoto: "Add photo",
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

    progressHeader: "We build this plan for",
    totalProgress: "Overall progress",
    planProgress: "Plan progress",
    exportTitle: "Download plan",
    coverSlide: "Cover",
    ready: "Ready",
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
  Other: { nl: "Overig", en: "Other" },
};

function countryLabel(country: string, lang: Lang) {
  const found = COUNTRY_LABELS[country];
  if (found) return found[lang];
  return country;
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

function getCountryLogoUrl(country: string) {
  return `/logos/countries/${slugify(country)}.png`;
}

function getLeagueLogoUrl(country: string, league: string) {
  return `/logos/${slugify(country)}/${slugify(league)}/${slugify(league)}.png`;
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

function getSectionProgress(items: boolean[]) {
  const total = items.length;
  const filled = items.filter(Boolean).length;
  const progress = total === 0 ? 0 : Math.round((filled / total) * 100);

  return {
    total,
    filled,
    progress,
  };
}

function plannerFilled(planner: ChatPlannerState | null, key: string) {
  return !!planner?.filledSlots?.[key];
}

export default function PlayerDevelopmentPlanBuilder() {
  const [plan, setPlan] = useState<DevelopmentPlanV1>(createInitialPlan());
  const [generatedPlan, setGeneratedPlan] =
    useState<DevelopmentPlanV1 | null>(null);

  const [lang, setLang] = useState<Lang>("nl");
  const [mode, setMode] = useState<Mode>("chat");
  const [chatPlannerState, setChatPlannerState] =
    useState<ChatPlannerState | null>(null);

  const [basicsOpen, setBasicsOpen] = useState(true);
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [identityPhotoOpen, setIdentityPhotoOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("Netherlands");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [clubMode, setClubMode] = useState<ClubMode>("preset");

  const [localVideoUploads, setLocalVideoUploads] = useState<
    Record<number, LocalVideoUpload | undefined>
  >({});

  const t = UI[lang];
  const otherLang: Lang = lang === "nl" ? "en" : "nl";

  useEffect(() => {
    setGeneratedPlan(null);
  }, [
    plan.player.name,
    plan.player.role,
    plan.meta.club,
    plan.meta.team,
    plan.meta.blockLengthWeeks,
  ]);

  const primary = clampHex(plan.brand.primaryColor, "#111111");
  const secondary = clampHex(plan.brand.secondaryColor, "#FFFFFF");
  const balance = clampPercent(plan.brand.colorBalance, 70);

  const teamType = (((plan.player as any)?.teamType || "") as TeamType | "");
  const academyAge = (((plan.player as any)?.academyAgeCategory || "") as string);

  const coverReady =
    !!plan.player.name?.trim() &&
    !!plan.brand.clubName?.trim() &&
    !!plan.meta.team?.trim() &&
    !!plan.brand.primaryColor?.trim();

  const agreementProgress = getSectionProgress([
    !!plan.slide2?.focusBehaviour?.trim() ||
      plannerFilled(chatPlannerState, "developmentPoint"),
    !!plan.slide2?.developmentGoal?.trim() ||
      plannerFilled(chatPlannerState, "targetBehaviour"),
    !!plan.slide2?.matchSituation?.trim() ||
      plannerFilled(chatPlannerState, "matchSituation"),
  ]);

  const contextProgress = getSectionProgress([
    !!plan.slideContext?.gameMoments?.length ||
      plannerFilled(chatPlannerState, "gameMoments"),
    !!plan.slideContext?.zones?.length ||
      plannerFilled(chatPlannerState, "zones"),
    !!plan.slideContext?.principles?.length ||
      plannerFilled(chatPlannerState, "principles"),
  ]);

  const realityProgress = getSectionProgress([
    !!plan.slide3Baseline?.intro?.trim() ||
      !!plan.slide3Baseline?.observations?.length ||
      plannerFilled(chatPlannerState, "observations"),
    !!plan.slide3?.what_we_see?.items?.length ||
      plannerFilled(chatPlannerState, "observations"),
    !!plan.slide3?.moment?.items?.length ||
      !!plan.slide3Baseline?.moments?.length ||
      plannerFilled(chatPlannerState, "whenObserved"),
    !!plan.slide3?.effect_on_match?.items?.length ||
      !!plan.slide3Baseline?.matchEffects?.length ||
      plannerFilled(chatPlannerState, "effectOnGame"),
  ]);

  const approachProgress = getSectionProgress([
    !!plan.slide4DevelopmentRoute?.developmentRoute?.training?.trim() ||
      plannerFilled(chatPlannerState, "playerActions"),
    !!plan.slide4DevelopmentRoute?.developmentRoute?.match?.trim() ||
      plannerFilled(chatPlannerState, "playerActions"),
    !!plan.slide4DevelopmentRoute?.developmentRoute?.video?.trim() ||
      plannerFilled(chatPlannerState, "staffResponsibilities"),
    !!plan.slide4DevelopmentRoute?.developmentRoute?.off_field?.trim() ||
      plannerFilled(chatPlannerState, "staffResponsibilities"),
    !!plan.slide4DevelopmentRoute?.playerOwnText?.trim() ||
      plannerFilled(chatPlannerState, "playerActions"),
  ]);

  const successProgress = getSectionProgress([
    !!plan.slide6SuccessDefinition?.inGame?.length ||
      plannerFilled(chatPlannerState, "successSignals"),
    !!plan.slide6SuccessDefinition?.behaviour?.length ||
      plannerFilled(chatPlannerState, "successSignals"),
    !!plan.slide6SuccessDefinition?.signals?.length ||
      plannerFilled(chatPlannerState, "successSignals"),
  ]);

  const sections = [
    {
      key: "cover",
      label: t.coverSlide,
      progress: coverReady ? 100 : 0,
      filled: coverReady ? 4 : 0,
      total: 4,
    },
    {
      key: "agreement",
      label: t.statusPoint,
      progress: agreementProgress.progress,
      filled: agreementProgress.filled,
      total: agreementProgress.total,
    },
    {
      key: "context",
      label: t.statusContext,
      progress: contextProgress.progress,
      filled: contextProgress.filled,
      total: contextProgress.total,
    },
    {
      key: "reality",
      label: t.statusReality,
      progress: realityProgress.progress,
      filled: realityProgress.filled,
      total: realityProgress.total,
    },
    {
      key: "approach",
      label: t.statusApproach,
      progress: approachProgress.progress,
      filled: approachProgress.filled,
      total: approachProgress.total,
    },
    {
      key: "success",
      label: t.statusSuccess,
      progress: successProgress.progress,
      filled: successProgress.filled,
      total: successProgress.total,
    },
  ];

  const totalProgress = Math.round(
    sections.reduce((sum, section) => sum + section.progress, 0) / sections.length
  );

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
    return Array.from(
      new Set(
        selectableClubPresets
          .filter((club) => club.country === selectedCountry)
          .map((club) => club.league)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
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

  const activePreset = getClubPresetByName(plan.brand.clubName);

  function onPlanGenerated(next: DevelopmentPlanV1) {
    const merged = mergeGeneratedPlanWithLockedBasics(plan, next);
    setPlan(merged);
    setGeneratedPlan(merged);

    console.log("✅ GENERATED PLAN BINNEN");
    console.log("slide2", merged.slide2);
    console.log("context", merged.slideContext);
    console.log("baseline", merged.slide3Baseline);
    console.log("approach", merged.slide4DevelopmentRoute);
    console.log("success", merged.slide6SuccessDefinition);
  }

  function applyClubPreset(clubName: string) {
    const preset = getClubPresetByName(clubName);

    setPlan((prev) => {
      const next = structuredClone(prev);

      next.brand.clubName = clubName;
      next.meta.club = clubName;
      setGeneratedPlan(null);

      if (preset) {
        next.brand.logoUrl = preset.logoUrl || "";
        next.brand.primaryColor = preset.primaryColor;
        next.brand.secondaryColor = preset.secondaryColor;
        next.brand.colorBalance = preset.colorBalance ?? 70;
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
    const exportPlan = generatedPlan || plan;

    console.log("📤 EXPORT PLAN");
    console.log(exportPlan);

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

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `pdp-${version}-${exportLang}.pdf`;
    a.click();
  }

  function insertPrompt(_text: string) {
    // later koppelen aan chat input
  }

  return (
    <div className="min-h-dvh bg-[#0B0D10] text-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div>
          <div className="text-[11px] tracking-[0.18em] text-white/40">
            {t.eyebrow}
          </div>
          <div className="text-[15px] text-white/80 mt-1">{t.subtitle}</div>
        </div>

        <LangPill lang={lang} setLang={setLang} t={t} />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8">
          <div className="max-w-[1240px] mx-auto space-y-8">
            <div className="flex justify-center">
              <div className="bg-white/5 rounded-full p-1 flex gap-1">
                <ModeBtn active={mode === "chat"} onClick={() => setMode("chat")}>
                  {t.modeChat}
                </ModeBtn>
                <ModeBtn active={mode === "manual"} onClick={() => setMode("manual")}>
                  {t.modeManual}
                </ModeBtn>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch relative z-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-visible h-full">
                <button
                  onClick={() => setBasicsOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div>
                    <div className="text-[12px] tracking-[0.16em] uppercase text-white/40">
                      {t.basicsTitle}
                    </div>
                    <div className="text-[13px] text-white/55 mt-1">
                      {t.basicsSubtitle}
                    </div>
                  </div>

                  <div className="text-white/45 text-sm">{basicsOpen ? "▾" : "▸"}</div>
                </button>

                {basicsOpen && (
                  <div className="px-6 pb-6 space-y-5">
                    <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
                      <div className="mb-5">
                        <div className="text-[11px] tracking-[0.18em] uppercase text-white/38">
                          {t.step1Eyebrow}
                        </div>

                        <div className="text-[20px] leading-none text-white/92 mt-2">
                          {t.step1Title}
                        </div>

                        <div className="text-[13px] text-white/50 mt-2 max-w-[46ch] leading-relaxed">
                          {t.step1Body}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[110px_minmax(0,1fr)] gap-5 items-start">
                        <div className="flex flex-col items-center md:items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setIdentityPhotoOpen((v) => !v)}
                            className="group relative w-[96px] h-[96px] rounded-[22px] overflow-hidden border border-white/10 bg-white/[0.04] hover:border-white/20 transition"
                          >
                            {plan.player.headshotUrl ? (
                              <img
                                src={plan.player.headshotUrl}
                                className="w-full h-full object-cover"
                                alt={plan.player.name || ""}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/70 text-sm">
                                    +
                                  </div>
                                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                                    {t.photoPill}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1 opacity-0 group-hover:opacity-100 transition">
                              <div className="text-[9px] uppercase tracking-[0.16em] text-white/70">
                                {plan.player.headshotUrl ? t.avatarEdit : t.avatarAdd}
                              </div>
                            </div>
                          </button>

                          <div className="text-center md:text-left">
                            <div className="text-[12px] text-white/75">
                              {plan.player.name || t.newPlayer}
                            </div>
                            <div className="text-[11px] text-white/35 mt-1">
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
                            <button
                              type="button"
                              onClick={() => setIdentityPhotoOpen((v) => !v)}
                              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/78 hover:border-white/24 hover:text-white"
                            >
                              {plan.player.headshotUrl ? t.editPhoto : t.addPhoto}
                            </button>

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
                              <div className="text-[11px] text-white/35 mt-2 leading-relaxed">
                                {t.photoHelp}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SimpleDropdown
                        label={t.country}
                        value={selectedCountry}
                        placeholder={t.chooseCountry}
                        items={availableCountries.map((country) => ({
                          value: country,
                          label: countryLabel(country, lang),
                          iconUrl: getCountryLogoUrl(country),
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

                      <SimpleDropdown
                        label={t.league}
                        value={selectedLeague}
                        placeholder={t.chooseLeague}
                        items={availableLeagues.map((league) => ({
                          value: league,
                          label: league,
                          iconUrl: getLeagueLogoUrl(selectedCountry, league),
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

                      <div className="sm:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-[11px] text-white/40 mb-3 uppercase tracking-wide">
                          {t.club}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
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
                            <div className="text-[11px] text-white/35 mt-2 leading-relaxed">
                              {t.customClubHelp}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <SimpleDropdown
                          label={t.teamType}
                          value={teamType}
                          placeholder={t.chooseTeamType}
                          items={[
                            { value: "academy", label: t.academy },
                            { value: "first_team", label: t.firstTeam },
                          ]}
                          onChange={(value) =>
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
                            })
                          }
                        />
                      </div>

                      {teamType === "academy" ? (
                        <div>
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
                        </div>
                      ) : (
                        <div />
                      )}

                      <Input
                        label={t.periodWeeks}
                        value={String(plan.meta.blockLengthWeeks || 8)}
                        onChange={(v) =>
                          setPlan((prev) => ({
                            ...prev,
                            meta: {
                              ...prev.meta,
                              blockLengthWeeks: Number(v) || 8,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 h-full flex flex-col min-h-[760px]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                      {t.brandingTitle}
                    </div>
                    <div className="text-[12px] text-white/45 mt-1">
                      {t.coverPreviewSub}
                    </div>
                  </div>

                  <button
                    onClick={() => setBrandingOpen((v) => !v)}
                    className="text-[12px] text-white/45 hover:text-white/80"
                  >
                    {brandingOpen ? t.brandingCollapse : t.brandingEdit}
                  </button>
                </div>

                <div className="mt-4 flex-1 min-h-0 flex items-center justify-center">
                  <div className="h-full w-full flex items-center justify-center">
                    <CoverPreviewCard
                      clubName={plan.brand.clubName || t.club}
                      logoUrl={plan.brand.logoUrl}
                      playerName={plan.player.name || t.noPlayerYet}
                      playerImageUrl={plan.player.headshotUrl}
                      primary={primary}
                      secondary={secondary}
                      balance={balance}
                      systemLine={t.coverSystemLine}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 min-h-[20px]">
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
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      label={t.colorBalance}
                      value={String(plan.brand.colorBalance || 70)}
                      onChange={(v) =>
                        setPlan((prev) => ({
                          ...prev,
                          brand: {
                            ...prev.brand,
                            colorBalance: Number(v),
                          },
                        }))
                      }
                    />

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
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[3.25fr_1fr] gap-6 items-stretch">
              <div className="flex flex-col gap-6 h-full">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 min-h-[760px]">
                  {mode === "chat" ? (
                    <>
                      <div className="max-w-[52ch] mb-6">
                        <div className="text-[18px] leading-tight text-white/92 font-medium">
                          {t.heroChatTitle}
                        </div>
                        <div className="text-[13px] text-white/52 mt-2 leading-relaxed">
                          {t.heroChatBody}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap mb-6">
                        <Hint onClick={() => insertPrompt("Beschrijf wat je concreet ziet in gedrag")}>
                          {t.hintObservation}
                        </Hint>
                        <Hint onClick={() => insertPrompt("Beschrijf in welk wedstrijdmoment dit gebeurt")}>
                          {t.hintMoment}
                        </Hint>
                        <Hint onClick={() => insertPrompt("Beschrijf wat het effect is op het spel")}>
                          {t.hintGoal}
                        </Hint>
                      </div>

                      <PdpChat
                        draftPlan={plan}
                        onPlanGenerated={onPlanGenerated}
                        onPlannerStateChange={setChatPlannerState}
                        onViewPlan={() => {
                          console.log("Current builder plan:", generatedPlan || plan);
                        }}
                        onDownloadPdf={(version) => download(version, lang)}
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-[15px] text-white/88 max-w-[40ch]">
                        {t.heroManualTitle}
                      </div>
                      <div className="text-[13px] text-white/55 max-w-[52ch] mt-2 mb-6">
                        {t.heroManualBody}
                      </div>

                      <div className="max-w-[520px]">
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
                    </>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                    {t.videoTitle}
                  </div>
                  <div className="text-[13px] text-white/50 mt-2 max-w-[64ch] leading-relaxed">
                    {t.videoBody}
                  </div>

                  <div className="mt-2 text-[11px] text-white/32 leading-relaxed">
                    {t.videoUploadHelp}
                  </div>

                  <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <VideoCardCompact
                      title={t.videoClip1}
                      clip={(plan as any)?.slide3Baseline?.videoClips?.[0]}
                      upload={localVideoUploads[0]}
                      t={t}
                      onChange={(patch) => updateVideoClip(0, patch)}
                      onUpload={(file) => handleVideoUpload(0, file)}
                    />

                    <VideoCardCompact
                      title={t.videoClip2}
                      clip={(plan as any)?.slide3Baseline?.videoClips?.[1]}
                      upload={localVideoUploads[1]}
                      t={t}
                      onChange={(patch) => updateVideoClip(1, patch)}
                      onUpload={(file) => handleVideoUpload(1, file)}
                    />

                    <VideoCardCompact
                      title={t.videoClip3}
                      clip={(plan as any)?.slide3Baseline?.videoClips?.[2]}
                      upload={localVideoUploads[2]}
                      t={t}
                      onChange={(patch) => updateVideoClip(2, patch)}
                      onUpload={(file) => handleVideoUpload(2, file)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 h-full">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                        {t.exportTitle}
                      </div>
                      <div className="mt-3 text-[22px] leading-tight text-white/92 font-medium">
                        {t.exportAlways}
                      </div>
                      <div className="mt-2 text-[12px] text-white/50 leading-relaxed max-w-[26ch]">
                        {t.exportStrong}
                      </div>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/68">
                      PDF
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button
                      onClick={() => download("player", lang)}
                      className="w-full bg-white text-black py-3 rounded-xl text-sm font-medium hover:bg-white/90"
                    >
                      {t.downloadPlayer}
                    </button>

                    <button
                      onClick={() => download("staff", lang)}
                      className="w-full border border-white/20 py-3 rounded-xl text-sm text-white/88 hover:border-white/30"
                    >
                      {t.downloadStaff}
                    </button>

                    <div className="pt-1 text-center text-[11px] text-white/35">
                      {t.availableOther}
                    </div>

                    <button
                      onClick={() => download("player", otherLang)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-[12px] text-white/72 hover:text-white hover:border-white/20"
                    >
                      {t.downloadOther}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                    {t.progressHeader}
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[22px] leading-tight text-white/92 font-medium">
                        {plan.player.name || t.noPlayerYet}
                      </div>

                      <div className="text-[13px] text-white/48 mt-2">
                        {plan.brand.clubName || t.club}
                      </div>

                      <div className="text-[12px] text-white/34 mt-1">
                        {plan.meta.team || t.teamType}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {plan.player.headshotUrl ? (
                        <img
                          src={plan.player.headshotUrl}
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                          alt=""
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04]" />
                      )}
                    </div>
                  </div>

                  <div className="mt-5 h-[1px] w-full overflow-hidden rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "42%",
                        background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                        {t.totalProgress}
                      </div>
                      <div className="text-[30px] leading-none tracking-[-0.03em] text-white/92 font-semibold mt-3">
                        {totalProgress}%
                      </div>
                    </div>

                    <div className="text-[12px] text-white/38">
                      {sections.filter((s) => s.progress === 100).length}/{sections.length}
                    </div>
                  </div>

                  <div className="mt-4 h-[8px] rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${totalProgress}%`,
                        background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex-1">
                  <div className="text-[11px] tracking-[0.18em] text-white/40 mb-4 uppercase">
                    {t.planProgress}
                  </div>

                  <div className="space-y-3">
                    {sections.map((section) => (
                      <ProgressRow
                        key={section.key}
                        label={section.label}
                        progress={section.progress}
                        filled={section.filled}
                        total={section.total}
                        primary={primary}
                        secondary={secondary}
                        readyLabel={t.ready}
                      />
                    ))}
                  </div>
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
}: {
  label: string;
  value?: string;
  placeholder: string;
  items: Array<{ value: string; label: string; iconUrl?: string }>;
  onChange: (v: string) => void;
  hideLabel?: boolean;
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
    return () => {
      document.removeEventListener("mousedown", onDocClick);
    };
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

  function commitActive() {
    const item = items[activeIndex];
    if (!item) return;
    onChange(item.value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
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
        <div className="text-[11px] text-white/40 mb-2 uppercase tracking-wide">
          {label}
        </div>
      ) : null}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/16 focus:outline-none focus:border-white/24 focus:bg-white/[0.06]"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-center gap-3">
              {selectedItem?.iconUrl ? (
                <img
                  src={selectedItem.iconUrl}
                  alt=""
                  className="w-5 h-5 object-contain shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.03] shrink-0" />
              )}

              <div className="text-[14px] text-white/90 truncate">
                {selectedItem?.label || placeholder}
              </div>
            </div>

            <div className="text-white/35 shrink-0">
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
            <div ref={listRef} className="max-h-[280px] overflow-y-auto p-2" role="listbox">
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
                    className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-left transition ${
                      active || selected
                        ? "bg-white/[0.08] border border-white/10"
                        : "hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.iconUrl ? (
                        <img
                          src={item.iconUrl}
                          alt=""
                          className="w-5 h-5 object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.03] shrink-0" />
                      )}

                      <span className="text-[14px] text-white/90 truncate">
                        {item.label}
                      </span>
                    </div>

                    {selected ? (
                      <div className="text-white/45 shrink-0">
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

function VideoCardCompact({
  title,
  clip,
  upload,
  t,
  onChange,
  onUpload,
}: {
  title: string;
  clip?: any;
  upload?: LocalVideoUpload;
  t: (typeof UI)["nl"] | (typeof UI)["en"];
  onChange: (patch: Record<string, string>) => void;
  onUpload: (file: File | null) => void;
}) {
  const source = clip?.source === "training" ? "training" : "match";
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="text-[12px] text-white/82 font-medium">{title}</div>

      <div className="mt-3 space-y-3">
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

        <div className="text-[10px] text-white/28 uppercase tracking-[0.14em]">
          {t.videoOr}
        </div>

        <div>
          <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wide">
            {t.videoUpload}
          </div>

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

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-[12px] text-white/80 hover:border-white/20 hover:text-white"
          >
            {t.videoUpload}
          </button>

          {upload?.fileName ? (
            <div className="mt-1.5 text-[10px] text-white/45 leading-relaxed">
              {t.videoChosen}: <span className="text-white/72">{upload.fileName}</span>
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
      <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wide">
        {label}
      </div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-white/20 py-1.5 text-[12px] focus:outline-none focus:border-white"
      />
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
          : "border border-white/10 bg-white/[0.04] text-white/72 hover:text-white hover:border-white/20"
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
      className={`px-4 py-1.5 text-sm rounded-full transition ${
        active ? "bg-white text-black" : "text-white/50 hover:text-white/80"
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
      <div className="text-[11px] text-white/40 mb-1 uppercase tracking-wide">
        {label}
      </div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-white/20 py-2 text-[14px] focus:outline-none focus:border-white"
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
    <div className="flex bg-white/5 rounded-full p-1 text-[12px]">
      <button
        onClick={() => setLang("nl")}
        className={`px-3 py-1 rounded-full ${
          lang === "nl" ? "bg-white text-black" : "text-white/50"
        }`}
      >
        {t.langNl}
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 rounded-full ${
          lang === "en" ? "bg-white text-black" : "text-white/50"
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
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/60 hover:text-white"
    >
      + {children}
    </button>
  );
}

function ProgressRow({
  label,
  progress,
  filled,
  total,
  primary,
  secondary,
  readyLabel,
}: {
  label: string;
  progress: number;
  filled: number;
  total: number;
  primary: string;
  secondary: string;
  readyLabel: string;
}) {
  const done = progress === 100;

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[13px] text-white/82">{label}</div>
        <div className="text-[11px] text-white/38">
          {done ? readyLabel : `${filled}/${total}`}
        </div>
      </div>

      <div className="mt-3 h-[6px] rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 100%)`,
          }}
        />
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
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div
        className="relative h-full max-h-[760px] aspect-[210/297] w-auto max-w-full overflow-hidden rounded-[18px] border border-white/10"
        style={{
          background: `linear-gradient(135deg, ${primary} ${balance}%, ${secondary} 100%)`,
        }}
      >
        {playerImageUrl ? (
          <img
            src={playerImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.9]"
            style={{
              objectPosition: "center 22%",
              transform: "scale(1.02)",
              filter: "saturate(.94) contrast(1.02)",
            }}
          />
        ) : null}

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(90deg, rgba(0,0,0,.74) 0%, rgba(0,0,0,.34) 42%, rgba(0,0,0,.62) 100%),
              linear-gradient(180deg, rgba(0,0,0,.16) 0%, rgba(0,0,0,.46) 100%)
            `,
          }}
        />

        <div
          className="absolute inset-0 mix-blend-screen opacity-[0.96]"
          style={{
            background: `
              radial-gradient(circle at 14% 26%, ${primary}55 0%, transparent 44%),
              radial-gradient(circle at 82% 74%, ${secondary}33 0%, transparent 34%),
              linear-gradient(135deg, ${primary}22 0%, transparent 42%, ${secondary}22 100%)
            `,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at center, transparent 38%, rgba(0,0,0,.22) 100%),
              linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.22))
            `,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
            backgroundSize: "4px 4px",
          }}
        />

        <div className="relative z-10 w-full h-full">
          <div
            className="absolute left-[18px] top-[18px] bottom-[18px] w-[3px] rounded-full"
            style={{ background: primary }}
          />

          <div className="absolute top-[22px] left-[32px]">
            <div className="text-[11px] tracking-[0.16em] uppercase text-white/90 font-semibold">
              {clubName}
            </div>
            <div className="text-[10px] text-white/70 mt-1">
              {systemLine}
            </div>
          </div>

          {logoUrl ? (
            <div className="absolute top-[16px] right-[16px] w-[44px] h-[44px] rounded-[12px] border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_22px_rgba(0,0,0,0.22)]">
              <img
                src={logoUrl}
                className="w-[24px] h-[24px] object-contain"
                alt=""
              />
            </div>
          ) : null}

          <div className="absolute left-[32px] right-[20px] bottom-[90px]">
            <div className="text-[32px] leading-none tracking-[-0.03em] font-extrabold text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)] break-words">
              {playerName}
            </div>
          </div>

          <div className="absolute left-[32px] right-[20px] bottom-[20px] flex items-center justify-between">
            <div className="text-[10px] tracking-[0.26em] uppercase text-white/70">
              {systemLine}
            </div>

            <div
              className="w-[36px] h-[2px] rounded-full"
              style={{ background: primary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}