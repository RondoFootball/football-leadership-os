"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  defaultDevelopmentPlan,
  type DevelopmentPlanV1,
} from "./lib/engineSchema";
import { clubPresets, getClubPresetByName } from "./lib/clubPresets";
import { PdpChat } from "./components/PdpChat";

type Lang = "nl" | "en";
type Mode = "chat" | "manual";
type TeamType = "academy" | "first_team";

const ACADEMY_AGES = ["O13", "O14", "O15", "O16", "O17", "O18", "O19", "O21"];

const UI = {
  nl: {
    eyebrow: "PLAYER DEVELOPMENT PLAN",
    subtitle: "Van gesprek naar gestructureerd plan",

    modeChat: "Gesprek",
    modeManual: "Handmatig",

    basicsTitle: "Planbasis",
    basicsSubtitle:
      "Leg eerst vast voor wie dit plan geldt. Club, team en branding bepalen daarna automatisch de juiste context.",

    playerClubTitle: "Speler en club",
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
    other: "Overig",

    clubSearchPlaceholder: "Zoek club...",
    selectedLeague: "Competitie",
    noClubResults: "Geen clubs gevonden",
    clubPresetLoaded: "Clubpreset actief",

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

    rightIdentity: "Visuele identiteit",
    rightStatus: "Planstatus",
    rightSnapshot: "Snapshot",

    statusPoint: "Ontwikkelpunt",
    statusContext: "Context",
    statusReality: "Realiteit",
    statusApproach: "Aanpak",
    statusSuccess: "Succes",

    noPlayerYet: "Speler",
    noPointYet: "Nog geen ontwikkelpunt",

    downloadPlayer: "Download spelerplan",
    downloadStaff: "Download staffplan",
    availableOther: "Ook beschikbaar in English",
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

    coverPreviewTitle: "Live cover preview",
    coverPreviewSub:
      "Deze preview gebruikt hetzelfde staande coverformat als de uiteindelijke PDF.",
    presetActive: "Clubpreset actief",
    coverSystemLine: "Persoonlijk Ontwikkelplan",

    progressTitle: "Voortgang",
    progressBody:
      "Tijdens het beantwoorden van de vragen zie je hier direct welke delen van het plan al voldoende zijn ingevuld.",
    slideCoverage: "Slide dekking",
    builderSnapshot: "Builder snapshot",
  },
  en: {
    eyebrow: "PLAYER DEVELOPMENT PLAN",
    subtitle: "From conversation to structured plan",

    modeChat: "Conversation",
    modeManual: "Manual",

    basicsTitle: "Plan basics",
    basicsSubtitle:
      "First define who this plan is for. Club, team and branding then shape the right context automatically.",

    playerClubTitle: "Player and club",
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
    other: "Other",

    clubSearchPlaceholder: "Search club...",
    selectedLeague: "Competition",
    noClubResults: "No clubs found",
    clubPresetLoaded: "Club preset active",

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

    rightIdentity: "Visual identity",
    rightStatus: "Plan status",
    rightSnapshot: "Snapshot",

    statusPoint: "Development point",
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

    coverPreviewTitle: "Live cover preview",
    coverPreviewSub:
      "This preview uses the same portrait cover format as the final PDF.",
    presetActive: "Club preset active",
    coverSystemLine: "Personal Development Plan",

    progressTitle: "Progress",
    progressBody:
      "While answering the questions, this panel shows which parts of the plan are already sufficiently covered.",
    slideCoverage: "Slide coverage",
    builderSnapshot: "Builder snapshot",
  },
} as const;

function createInitialPlan(): DevelopmentPlanV1 {
  const p = defaultDevelopmentPlan();
  p.meta.createdAtISO = "";
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

/**
 * Houdt speler-, club- en brandinggegevens vast
 * wanneer de chat een nieuw plan terugstuurt.
 */
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

export default function PlayerDevelopmentPlanBuilder() {
  const [plan, setPlan] = useState<DevelopmentPlanV1>(createInitialPlan());
  const [lang, setLang] = useState<Lang>("nl");
  const [mode, setMode] = useState<Mode>("chat");
  const [hasPlan, setHasPlan] = useState(false);

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

  const filledPoint = !!plan.slide2?.focusBehaviour?.trim();
  const filledContext =
    !!plan.slideContext?.gameMoments?.length ||
    !!plan.slideContext?.zones?.length ||
    !!plan.slideContext?.principles?.length;
  const filledReality =
    !!plan.slide3Baseline?.intro?.trim() ||
    !!plan.slide3?.what_we_see?.items?.length;
  const filledApproach =
    !!plan.slide4DevelopmentRoute?.developmentRoute?.training?.trim() ||
    !!plan.slide4DevelopmentRoute?.developmentRoute?.match?.trim() ||
    !!plan.slide4DevelopmentRoute?.developmentRoute?.video?.trim() ||
    !!plan.slide4DevelopmentRoute?.developmentRoute?.off_field?.trim();
  const filledSuccess =
    !!plan.slide6SuccessDefinition?.inGame?.length ||
    !!plan.slide6SuccessDefinition?.behaviour?.length ||
    !!plan.slide6SuccessDefinition?.signals?.length;

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
                        {/* AVATAR */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setIdentityPhotoOpen((v) => !v)}
                            className="group relative w-[96px] h-[96px] rounded-[22px] overflow-visible border border-white/10 bg-white/[0.04] hover:border-white/20 transition"
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

                        {/* INPUTS */}
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

                    <PdpChat draftPlan={plan} onPlanGenerated={onPlanGenerated} />
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
                <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
                  <div className="text-[11px] tracking-[0.16em] uppercase text-white/38">
                    {t.progressTitle}
                  </div>
                  <div className="text-[12px] text-white/48 mt-2 leading-relaxed">
                    {t.progressBody}
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03] space-y-3">
                  <div className="text-[11px] text-white/40 uppercase tracking-wide">
                    {t.rightIdentity}
                  </div>

                  <div
                    className="h-12 rounded-lg border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${primary} ${balance}%, ${secondary} 100%)`,
                    }}
                  />

                  <div className="flex items-center gap-3 min-h-[32px]">
                    {plan.brand.logoUrl ? (
                      <img
                        src={plan.brand.logoUrl}
                        className="w-8 h-8 object-contain opacity-85"
                        alt=""
                      />
                    ) : null}

                    {plan.player.headshotUrl ? (
                      <img
                        src={plan.player.headshotUrl}
                        className="w-8 h-8 rounded-full object-cover"
                        alt=""
                      />
                    ) : null}

                    <div className="text-[12px] text-white/50">
                      {plan.brand.clubName || t.club}
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
                  <div className="text-[11px] tracking-[0.18em] text-white/40 mb-3 uppercase">
                    {t.slideCoverage}
                  </div>

                  <StatusItem label={t.statusPoint} filled={filledPoint} />
                  <StatusItem label={t.statusContext} filled={filledContext} />
                  <StatusItem label={t.statusReality} filled={filledReality} />
                  <StatusItem label={t.statusApproach} filled={filledApproach} />
                  <StatusItem label={t.statusSuccess} filled={filledSuccess} />
                </div>

                <div className="border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
                  <div className="text-[11px] text-white/40 mb-2 uppercase tracking-wide">
                    {t.builderSnapshot}
                  </div>

                  <div className="text-[14px] text-white/85">
                    {plan.player.name || t.noPlayerYet}
                  </div>

                  <div className="text-[12px] text-white/50 mt-1">
                    {plan.player.role || t.playerPosition} ·{" "}
                    {plan.player.team || t.teamType}
                  </div>

                  <div className="text-[12px] text-white/40 mt-3">
                    {plan.slide2?.focusBehaviour || t.noPointYet}
                  </div>
                </div>

                {hasPlan && (
                  <div className="space-y-3 border border-white/10 rounded-2xl p-4 bg-white/[0.03]">
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
                )}
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
                  competitionLogoUrl="/logos/competitions/eredivisie.png"
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
                  competitionLogoUrl="/logos/competitions/kkd.png"
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
          <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101317] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
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

function StatusItem({
  label,
  filled,
}: {
  label: string;
  filled: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[13px] py-1">
      <span className="text-white/70">{label}</span>
      <span
        className={`w-2 h-2 rounded-full ${
          filled ? "bg-white" : "bg-white/20"
        }`}
      />
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
        className="relative w-full max-w-[420px] aspect-[210/297] rounded-[18px] overflow-hidden border border-white/10"
        style={
          {
            "--accent": primary,
            "--accent-primary": primary,
            "--accent-secondary": secondary,
            "--accent-mix": primary,
          } as React.CSSProperties
        }
      >
        {/* MEDIA */}
        <div className="absolute inset-0 bg-[#050608]">
          {playerImageUrl ? (
            <img
              src={playerImageUrl}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: "center 22%",
                transform: "scale(1.02)",
                filter: "saturate(.94) contrast(1.02)",
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#0B0D10]" />
          )}

          {/* SHADE */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, rgba(0,0,0,.74) 0%, rgba(0,0,0,.34) 42%, rgba(0,0,0,.62) 100%),
                linear-gradient(180deg, rgba(0,0,0,.16) 0%, rgba(0,0,0,.46) 100%)
              `,
            }}
          />

          {/* WASH */}
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

          {/* VIGNETTE */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at center, transparent 38%, rgba(0,0,0,.22) 100%),
                linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.22))
              `,
            }}
          />

          {/* GRAIN */}
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
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full h-full">
          {/* RAIL */}
          <div
            className="absolute left-[18px] top-[18px] bottom-[18px] w-[3px] rounded-full"
            style={{ background: primary }}
          />

          {/* TOP TEXT */}
          <div className="absolute top-[22px] left-[32px]">
            <div className="text-[11px] tracking-[0.16em] uppercase text-white/90 font-semibold">
              {clubName}
            </div>
            <div className="text-[10px] text-white/70 mt-1">
              Persoonlijk Ontwikkelplan
            </div>
          </div>

          {/* LOGO */}
          {logoUrl && (
            <div className="absolute top-[16px] right-[16px] w-[44px] h-[44px] rounded-[12px] border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center shadow">
              <img
                src={logoUrl}
                className="w-[24px] h-[24px] object-contain"
              />
            </div>
          )}

          {/* NAME */}
          <div className="absolute left-[32px] right-[20px] bottom-[50px]">
            <div className="text-[32px] leading-none tracking-[-0.03em] font-extrabold text-white drop-shadow">
              {playerName}
            </div>
          </div>

          {/* FOOTER */}
          <div className="absolute left-[32px] right-[20px] bottom-[20px] flex items-center justify-between">
            <div className="text-[10px] tracking-[0.26em] uppercase text-white/70">
              Performance Development System
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