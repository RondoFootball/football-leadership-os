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

    chooseClub: "Kies club",
    otherClub: "Andere club / handmatig invoeren",

    clubSearchPlaceholder: "Zoek club...",
    noClubResults: "Geen clubs gevonden",

    primaryColor: "Primaire kleur",
    secondaryColor: "Secundaire kleur",
    colorBalance: "Kleurverdeling (%)",
    logoUrl: "Clublogo URL",

    heroChatTitle: "Werk vanuit observaties, ideeën of wedstrijden.",
    heroChatBody:
      "De chat vertaalt dit naar een concreet ontwikkelplan dat je daarna aanscherpt en exporteert.",

    heroManualTitle: "Werk handmatig vanuit een scherp ontwikkelpunt.",
    heroManualBody:
      "Vul stap voor stap de kern van het plan in. Begin bij het ontwikkelpunt.",

    hintObservation: "Observatie",
    hintMoment: "Moment",
    hintGoal: "Doel",

    developmentPoint: "Ontwikkelpunt",

    statusPoint: "Afspraak",
    statusContext: "Context",
    statusReality: "Realiteit",
    statusApproach: "Aanpak",
    statusSuccess: "Succes",

    noPlayerYet: "Speler",
    noPointYet: "Nog geen ontwikkelpunt",

    downloadPlayer: "Download spelerplan",
    downloadStaff: "Download staffplan",
    availableOther: "Ook beschikbaar in Engels",
    downloadOther: "Download EN",

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
    exportTitle: "Export",
    exportBody:
      "Je kunt het plan op elk moment uitdraaien, ook als nog niet alle onderdelen volledig zijn ingevuld.",
    coverSlide: "Cover",
    builderSnapshot: "Snapshot",
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

    chooseClub: "Select club",
    otherClub: "Other club / manual entry",

    clubSearchPlaceholder: "Search club...",
    noClubResults: "No clubs found",

    primaryColor: "Primary color",
    secondaryColor: "Secondary color",
    colorBalance: "Color balance (%)",
    logoUrl: "Club logo URL",

    heroChatTitle: "Work from observations, ideas or matches.",
    heroChatBody:
      "The chat translates this into a concrete development plan that you refine and export afterwards.",

    heroManualTitle: "Work manually from a sharp development point.",
    heroManualBody:
      "Fill in the core of the plan step by step. Start with the development point.",

    hintObservation: "Observation",
    hintMoment: "Moment",
    hintGoal: "Goal",

    developmentPoint: "Development point",

    statusPoint: "Agreement",
    statusContext: "Context",
    statusReality: "Reality",
    statusApproach: "Approach",
    statusSuccess: "Success",

    noPlayerYet: "Player",
    noPointYet: "No development point yet",

    downloadPlayer: "Download player plan",
    downloadStaff: "Download staff plan",
    availableOther: "Also available in Dutch",
    downloadOther: "Download NL",

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
    exportTitle: "Export",
    exportBody:
      "You can export the plan at any moment, even if not all sections are fully completed yet.",
    coverSlide: "Cover",
    builderSnapshot: "Snapshot",
    ready: "Ready",
  },
} as const;

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
  const [lang, setLang] = useState<Lang>("nl");
  const [mode, setMode] = useState<Mode>("chat");
  const [hasPlan, setHasPlan] = useState(false);
  const [chatPlannerState, setChatPlannerState] =
    useState<ChatPlannerState | null>(null);

  const [basicsOpen, setBasicsOpen] = useState(true);
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [identityPhotoOpen, setIdentityPhotoOpen] = useState(false);

  const t = UI[lang];
  const otherLang: Lang = lang === "nl" ? "en" : "nl";

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

  const eredivisieClubs = useMemo(
    () =>
      clubPresets.filter(
        (club) => club.league?.toLowerCase() === "eredivisie"
      ),
    []
  );

  const kkdClubs = useMemo(
    () => clubPresets.filter((club) => club.league?.toLowerCase() === "kkd"),
    []
  );

  const activePreset = getClubPresetByName(plan.brand.clubName);

  function onPlanGenerated(next: DevelopmentPlanV1) {
    const merged = mergeGeneratedPlanWithLockedBasics(plan, next);
    setPlan(merged);
    setHasPlan(true);
  }

  function applyClubPreset(clubName: string) {
    const preset = getClubPresetByName(clubName);

    setPlan((prev) => {
      const next = structuredClone(prev);

      next.brand.clubName = clubName;
      next.meta.club = clubName;

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

  async function download(version: "player" | "staff", exportLang: Lang) {
    const res = await fetch(`/api/pdp/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan: {
          ...plan,
          meta: {
            ...plan.meta,
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

            {/* TOP AREA — 50 / 50 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch relative z-0">
              {/* LEFT — BASICS */}
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
                    {/* STEP 1 — PLAYER IDENTITY */}
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

                    {/* REST OF PLAYER + CLUB FORM */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <ClubSelect
                          label={t.club}
                          value={plan.brand.clubName || ""}
                          placeholder={t.chooseClub}
                          searchPlaceholder={t.clubSearchPlaceholder}
                          noResultsLabel={t.noClubResults}
                          otherLabel={t.otherClub}
                          eredivisieClubs={eredivisieClubs}
                          kkdClubs={kkdClubs}
                          onChange={(value) => {
                            if (value === "custom") {
                              setPlan((prev) => ({
                                ...prev,
                                brand: {
                                  ...prev.brand,
                                  clubName: "custom",
                                  logoUrl: "",
                                },
                                meta: { ...prev.meta, club: "" },
                              }));
                              setBrandingOpen(true);
                              return;
                            }

                            applyClubPreset(value);
                          }}
                        />
                      </div>

                      {(plan.brand.clubName === "custom" || !plan.brand.clubName) && (
                        <div className="sm:col-span-2">
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
                        </div>
                      )}

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

              {/* RIGHT — COVER PREVIEW */}
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

            {/* BOTTOM AREA — 75 / 25 */}
            <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-6 items-start">
              {/* MAIN BUILDER AREA */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                {mode === "chat" ? (
                  <>
                    <div className="text-[15px] text-white/88 max-w-[40ch]">
                      {t.heroChatTitle}
                    </div>
                    <div className="text-[13px] text-white/55 max-w-[52ch] mt-2 mb-6">
                      {t.heroChatBody}
                    </div>

                    <div className="flex gap-2 flex-wrap mb-6">
                      <Hint onClick={() => insertPrompt("Observatie")}>
                        {t.hintObservation}
                      </Hint>
                      <Hint onClick={() => insertPrompt("Moment")}>
                        {t.hintMoment}
                      </Hint>
                      <Hint onClick={() => insertPrompt("Doel")}>
                        {t.hintGoal}
                      </Hint>
                    </div>

                    <PdpChat
                      draftPlan={plan}
                      onPlanGenerated={onPlanGenerated}
                      onPlannerStateChange={setChatPlannerState}
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

              {/* STICKY PROGRESS PANEL */}
              <div className="sticky top-6 space-y-4">
                {/* PLAYER HEADER */}
                <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.03]">
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

                {/* TOTAL PROGRESS */}
                <div className="border border-white/10 rounded-2xl p-5 bg-white/[0.03]">
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

                {/* SECTION PROGRESS */}
                <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
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

                {/* EXPORT ALWAYS AVAILABLE */}
                <div className="space-y-3 border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
                  <div>
                    <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                      {t.exportTitle}
                    </div>
                    <div className="text-[12px] text-white/45 mt-2 leading-relaxed">
                      {t.exportBody}
                    </div>
                  </div>

                  <button
                    onClick={() => download("player", lang)}
                    className="w-full bg-white text-black py-2.5 rounded-full text-sm font-medium"
                  >
                    {t.downloadPlayer}
                  </button>

                  <button
                    onClick={() => download("staff", lang)}
                    className="w-full border border-white/20 py-2.5 rounded-full text-sm"
                  >
                    {t.downloadStaff}
                  </button>

                  <div className="text-center text-[11px] text-white/35 pt-2">
                    {t.availableOther}
                  </div>

                  <button
                    onClick={() => download("player", otherLang)}
                    className="w-full text-[12px] text-white/70"
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

function ClubSelect({
  label,
  value,
  placeholder,
  searchPlaceholder,
  noResultsLabel,
  otherLabel,
  eredivisieClubs,
  kkdClubs,
  onChange,
}: {
  label: string;
  value?: string;
  placeholder: string;
  searchPlaceholder: string;
  noResultsLabel: string;
  otherLabel: string;
  eredivisieClubs: Array<{
    id: string;
    name: string;
    logoUrl?: string;
    league?: string;
  }>;
  kkdClubs: Array<{
    id: string;
    name: string;
    logoUrl?: string;
    league?: string;
  }>;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (!rootRef.current?.contains(document.activeElement)) return;

      if (e.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  const selectedClub =
    [...eredivisieClubs, ...kkdClubs].find((club) => club.name === value) || null;

  const q = query.trim().toLowerCase();

  const filteredEredivisie = eredivisieClubs.filter((club) =>
    club.name.toLowerCase().includes(q)
  );
  const filteredKkd = kkdClubs.filter((club) =>
    club.name.toLowerCase().includes(q)
  );

  const flatItems: Array<
    | {
        type: "club";
        key: string;
        club: {
          id: string;
          name: string;
          logoUrl?: string;
          league?: string;
        };
      }
    | {
        type: "custom";
        key: string;
      }
  > = [
    ...filteredEredivisie.map((club) => ({
      type: "club" as const,
      key: `eredivisie-${club.id}`,
      club,
    })),
    ...filteredKkd.map((club) => ({
      type: "club" as const,
      key: `kkd-${club.id}`,
      club,
    })),
    { type: "custom" as const, key: "custom" },
  ];

  useEffect(() => {
    if (!open) return;
    if (!flatItems.length) {
      setActiveIndex(-1);
      return;
    }

    const selectedIdx = flatItems.findIndex(
      (item) => item.type === "club" && item.club.name === value
    );

    if (selectedIdx >= 0) {
      setActiveIndex(selectedIdx);
    } else {
      setActiveIndex(0);
    }
  }, [open, value, query]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;

    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function commitActive() {
    const item = flatItems[activeIndex];
    if (!item) return;

    if (item.type === "custom") {
      onChange("custom");
    } else {
      onChange(item.club.name);
    }

    setOpen(false);
    setQuery("");
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
      setActiveIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
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

  const hasResults =
    filteredEredivisie.length > 0 || filteredKkd.length > 0 || !q.length;

  return (
    <div ref={rootRef}>
      <div className="text-[11px] text-white/40 mb-2 uppercase tracking-wide">
        {label}
      </div>

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
            <div className="flex items-center gap-3 min-w-0">
              {selectedClub?.logoUrl ? (
                <img
                  src={selectedClub.logoUrl}
                  alt=""
                  className="w-5 h-5 object-contain shrink-0 opacity-90"
                />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/10 bg-white/[0.03] shrink-0" />
              )}

              <div className="min-w-0">
                <div className="text-[14px] text-white/90 truncate">
                  {selectedClub?.name || placeholder}
                </div>
                {selectedClub?.league ? (
                  <div className="text-[11px] text-white/35 mt-0.5 truncate">
                    {selectedClub.league}
                  </div>
                ) : null}
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

        {open && (
          <div className="absolute z-[999] mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101317] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="p-3 border-b border-white/6">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white/90 outline-none placeholder:text-white/25 focus:border-white/20"
              />
            </div>

            <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2" role="listbox">
              {filteredEredivisie.length > 0 && (
                <ClubSection
                  title="Eredivisie"
                  competitionLogoUrl="/logos/netherlands/eredivisie/eredivisie.png"
                  items={filteredEredivisie}
                  selectedValue={value}
                  activeIndex={activeIndex}
                  startIndex={0}
                  query={query}
                  onHoverIndex={setActiveIndex}
                  onSelect={(clubName) => {
                    onChange(clubName);
                    setOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                  }}
                />
              )}

              {filteredKkd.length > 0 && (
                <ClubSection
                  title="KKD"
                  competitionLogoUrl="/logos/netherlands/kkd/kkd.png"
                  items={filteredKkd}
                  selectedValue={value}
                  activeIndex={activeIndex}
                  startIndex={filteredEredivisie.length}
                  query={query}
                  onHoverIndex={setActiveIndex}
                  onSelect={(clubName) => {
                    onChange(clubName);
                    setOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                  }}
                />
              )}

              {!hasResults && (
                <div className="px-3 py-4 text-[13px] text-white/35">
                  {noResultsLabel}
                </div>
              )}

              <div className="mt-1 pt-2 border-t border-white/6">
                <button
                  type="button"
                  data-option-index={flatItems.length - 1}
                  onMouseEnter={() => setActiveIndex(flatItems.length - 1)}
                  onClick={() => {
                    onChange("custom");
                    setOpen(false);
                    setQuery("");
                    setActiveIndex(-1);
                  }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    activeIndex === flatItems.length - 1
                      ? "bg-white/[0.08] border border-white/10"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-white/45 shrink-0">
                    +
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] text-white/88">{otherLabel}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ClubSection({
  title,
  competitionLogoUrl,
  items,
  selectedValue,
  activeIndex,
  startIndex,
  query,
  onHoverIndex,
  onSelect,
}: {
  title: string;
  competitionLogoUrl?: string;
  items: Array<{
    id: string;
    name: string;
    logoUrl?: string;
  }>;
  selectedValue?: string;
  activeIndex: number;
  startIndex: number;
  query: string;
  onHoverIndex: (index: number) => void;
  onSelect: (clubName: string) => void;
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 px-3 py-2">
        {competitionLogoUrl ? (
          <img
            src={competitionLogoUrl}
            alt=""
            className="w-4 h-4 object-contain opacity-70"
          />
        ) : null}
        <div className="text-[11px] uppercase tracking-[0.16em] text-white/30">
          {title}
        </div>
      </div>

      <div className="space-y-1">
        {items.map((club, idx) => {
          const selected = selectedValue === club.name;
          const absoluteIndex = startIndex + idx;
          const active = activeIndex === absoluteIndex;

          return (
            <button
              key={club.id}
              type="button"
              data-option-index={absoluteIndex}
              onMouseEnter={() => onHoverIndex(absoluteIndex)}
              onClick={() => onSelect(club.name)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                active || selected
                  ? "bg-white/[0.08] border border-white/10"
                  : "hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              {club.logoUrl ? (
                <img
                  src={club.logoUrl}
                  alt=""
                  className="w-8 h-8 object-contain shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <div className="text-[14px] text-white/90 truncate">
                  {highlightMatch(club.name, query)}
                </div>
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
  );
}

function SimpleDropdown({
  label,
  value,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  value?: string;
  placeholder: string;
  items: Array<{ value: string; label: string }>;
  onChange: (v: string) => void;
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
      <div className="text-[11px] text-white/40 mb-2 uppercase tracking-wide">
        {label}
      </div>

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
            <div className="min-w-0">
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

        {open && (
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
                    <span className="text-[14px] text-white/90 truncate">
                      {item.label}
                    </span>

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
        )}
      </div>
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;

  const lower = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  const idx = lower.indexOf(lowerQ);

  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);

  return (
    <>
      {before}
      <span className="text-white font-medium">{match}</span>
      {after}
    </>
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