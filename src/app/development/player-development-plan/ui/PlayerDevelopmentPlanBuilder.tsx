"use client";

import {
  trackPdpBuilderViewed,
  trackPdpStarted,
  trackPdpFieldStarted,
  trackPdpClubContextSelected,
  trackPdpBrandingEdited,
  trackPdpHintUsed,
  trackPdpPlanGenerated,
  trackPdpEvidenceAdded,
  trackPdpEvidencePanelToggled,
  trackPdpSectionCompleted,
  trackPdpMilestoneReached,
  trackPdpCompleted,
  trackPdpModeChanged,
  trackPdpLanguageChanged,
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
import {
  uiLabel,
  sectionLabel,
  actionLabel,
  plannerLabel,
  fallbackLabel,
} from "./lib/pdp/pdpLabels";

type Lang = "nl" | "en" | "de" | "es" | "it" | "fr";
type Mode = "chat" | "manual";
type TeamType = "academy" | "first_team";
type ClubMode = "preset" | "custom";

type LocalVideoUpload = {
  fileName: string;
  objectUrl: string;
};

const SUPPORTED_LANGS: Lang[] = ["nl", "en", "de", "es", "it", "fr"];

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
    availableOther: "Ook beschikbaar in andere talen",
    exportTitle: "Download Plan",
    exportAlways: "Direct exporteerbaar",
    exportStrong:
      "Je kunt op elk moment een bruikbare PDF downloaden, ook als het plan nog niet volledig is uitgewerkt.",

    progressTitle: "Planvoortgang",
    progressBody:
      "Deze voortgang combineert planbasis, inhoudelijke uitwerking en bewijs.",

    evidenceTitle: "Bewijs",
    evidenceBody:
      "Voeg bewijs toe wanneer het helpt om observatie, context en opvolging scherper te maken.",

    videoTitle: "Video-bewijs",
    videoBody:
      "Voeg clips toe als visueel bewijs voor het ontwikkelpunt. Houd het concreet en relevant.",
    dataTitle: "Data-bewijs",
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
    activeLabel: "Actief",
    optionalLabel: "Optioneel",

    langNl: "NL",
    langEn: "EN",
    langDe: "DE",
    langEs: "ES",
    langIt: "IT",
    langFr: "FR",

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

    workspaceTitle: "Werkveld",
    workspaceBody:
      "Van observatie naar plan. Bouw eerst het gesprek of ontwikkelpunt, voeg daarna bewijs toe.",

    controlLayer: "Planstatus",
    controlLayerBody:
      "Setup, bewijs en export blijven hier. De chat stuurt de inhoudelijke planopbouw.",
    clubContext: "Clubcontext",
    pdfReady: "PDF-klaar",
    playerIdentity: "Spelerprofiel",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Team",
    completion: "Compleet",
    completed: "Voltooid",

    weekSingle: "week",
    weekPlural: "weken",

    downloadFailedAlert: "Er ging iets mis bij het downloaden van de PDF.",
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
    availableOther: "Also available in other languages",
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
    activeLabel: "Active",
    optionalLabel: "Optional",

    langNl: "NL",
    langEn: "EN",
    langDe: "DE",
    langEs: "ES",
    langIt: "IT",
    langFr: "FR",

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
    controlLayerBody:
      "Setup, evidence and export stay here. The chat drives the content build-up of the plan.",
    clubContext: "Club context",
    pdfReady: "PDF-ready",
    playerIdentity: "Player identity",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Team",
    completion: "Completion",
    completed: "Completed",

    weekSingle: "week",
    weekPlural: "weeks",

    downloadFailedAlert: "Something went wrong while downloading the PDF.",
  },

  de: {
    modeChat: "Gespräch",
    modeManual: "Manuell",

    basicsTitle: "Planbasis",
    basicsSubtitle:
      "Lege zuerst fest, für wen dieser Plan gilt. Verein, Team und Branding bestimmen danach automatisch den richtigen Kontext.",

    basicsSectionClubContext: "Vereinskontext",
    basicsSectionPlanSetup: "Planeinstellung",

    brandingTitle: "Live-Cover-Vorschau",
    brandingEdit: "Branding anpassen",
    brandingCollapse: "Einklappen",

    playerName: "Name des Spielers",
    playerPosition: "Position",
    playerPhoto: "Spielerfoto URL",
    club: "Verein",
    customClub: "Vereinsname manuell",
    teamType: "Team",
    academy: "Akademie",
    firstTeam: "1. Mannschaft",
    ageCategory: "Alterskategorie",
    chooseAgeCategory: "Alterskategorie wählen",
    periodWeeks: "Zeitraum Entwicklungsplan",

    country: "Land",
    chooseCountry: "Land wählen",
    league: "Liga",
    chooseLeague: "Liga wählen",
    chooseClub: "Verein wählen",
    clubModePreset: "Verein aus Liste",
    clubModeCustom: "Eigener Verein",
    customClubHelp:
      "Nutze dies für einen Verein, der nicht in der Liste steht. Danach kannst du Logo und Farben manuell ausfüllen.",

    primaryColor: "Primärfarbe",
    secondaryColor: "Sekundärfarbe",
    tertiaryColor: "Tertiärfarbe",
    colorBalance: "Primärbalance (%)",
    logoUrl: "Vereinslogo URL",

    heroChatTitle: "Arbeite von dem aus, was du konkret siehst.",
    heroChatBody:
      "Beschreibe eine Situation, das Verhalten des Spielers und die Auswirkung auf das Spiel.",

    heroManualTitle: "Arbeite manuell von einem klaren Entwicklungspunkt aus.",
    heroManualBody:
      "Fülle Schritt für Schritt den Kern des Plans aus. Beginne mit dem Entwicklungspunkt.",

    hintObservation: "Beobachtung",
    hintMoment: "Moment",
    hintGoal: "Effekt",
    hintRefine: "Vertiefen",

    developmentPoint: "Entwicklungspunkt",

    statusPoint: "Vereinbarung",
    statusContext: "Kontext",
    statusReality: "Realität",
    statusApproach: "Ansatz",
    statusSuccess: "Erfolg",

    noPlayerYet: "Spieler",

    downloadPlayer: "Spielerplan herunterladen",
    availableOther: "Auch in anderen Sprachen verfügbar",
    exportTitle: "Plan herunterladen",
    exportAlways: "Direkt exportierbar",
    exportStrong:
      "Du kannst jederzeit ein brauchbares PDF herunterladen, auch wenn der Plan noch nicht vollständig ausgearbeitet ist.",

    progressTitle: "Planfortschritt",
    progressBody:
      "Dieser Fortschritt kombiniert Planbasis, inhaltliche Ausarbeitung und Nachweise.",

    evidenceTitle: "Nachweise",
    evidenceBody:
      "Füge Nachweise hinzu, wenn sie helfen, Beobachtung, Kontext und Nachverfolgung zu schärfen.",

    videoTitle: "Video-Nachweis",
    videoBody:
      "Füge Clips als visuellen Nachweis für den Entwicklungspunkt hinzu. Halte es konkret und relevant.",
    dataTitle: "Daten-Nachweis",
    dataBody:
      "Später kannst du Datenquellen und Indikatoren mit dem Plan verknüpfen. Diese Funktion kommt in einer späteren Version.",
    notYetAvailable: "Noch nicht verfügbar",

    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Titel",
    videoUrl: "Video URL",
    videoMoment: "Datum / Moment",
    videoSource: "Quelle",
    videoMatch: "Spiel",
    videoTraining: "Training",
    videoUpload: "Video hochladen",
    videoUploadHelp:
      "Der Upload funktioniert in dieser Version innerhalb deiner Sitzung. Für feste Speicherung binden wir später eine Upload-API an.",
    compactVideoOpen: "Öffnen",
    compactVideoClose: "Schließen",
    compactVideoEmpty: "Keine Clips",
    compactVideoCount: "Clips",
    openClip: "Clip öffnen",
    closeClip: "Clip schließen",
    activeLabel: "Aktiv",
    optionalLabel: "Optional",

    langNl: "NL",
    langEn: "EN",
    langDe: "DE",
    langEs: "ES",
    langIt: "IT",
    langFr: "FR",

    step1Eyebrow: "Schritt 1",
    step1Title: "Für wen ist dieser Plan?",
    step1Body:
      "Lege fest, für welchen Spieler dieser Plan erstellt wird. Name und Position bilden die Basis. Ein Foto ist optional, hilft aber dabei, den Plan in Vorschau und PDF visuell klarer und direkt erkennbar zu machen.",
    editPhoto: "Foto anpassen",
    removePhoto: "Entfernen",
    playerVisualIdentity: "Visuelle Identität",
    newPlayer: "Neuer Spieler",
    photoHelp:
      "Verwende vorerst eine Bild-URL. Dieses Foto wird in der visuellen Vorschau und auf dem PDF-Cover verwendet.",
    photoPill: "Foto",
    avatarAdd: "Hinzufügen",
    avatarEdit: "Anpassen",

    coverPreviewSub:
      "Diese Vorschau nutzt dasselbe Hochformat wie das endgültige PDF.",
    presetActive: "Vereinspreset aktiv",
    coverSystemLine: "Persönlicher Entwicklungsplan",

    workspaceTitle: "Arbeitsbereich",
    workspaceBody:
      "Von Beobachtung zu Plan. Erstelle zuerst das Gespräch oder den Entwicklungspunkt und füge danach Nachweise hinzu.",

    controlLayer: "Planstatus",
    controlLayerBody:
      "Setup, Nachweise und Export bleiben hier. Der Chat steuert den inhaltlichen Planaufbau.",
    clubContext: "Vereinskontext",
    pdfReady: "PDF-bereit",
    playerIdentity: "Spielerprofil",
    brandingMetaClub: "Verein",
    brandingMetaTeam: "Team",
    completion: "Fertig",
    completed: "Abgeschlossen",

    weekSingle: "Woche",
    weekPlural: "Wochen",

    downloadFailedAlert:
      "Beim Herunterladen der PDF ist ein Fehler aufgetreten.",
  },

  es: {
    modeChat: "Conversación",
    modeManual: "Manual",

    basicsTitle: "Base del plan",
    basicsSubtitle:
      "Primero define para quién es este plan. Club, equipo y branding determinan después automáticamente el contexto adecuado.",

    basicsSectionClubContext: "Contexto del club",
    basicsSectionPlanSetup: "Configuración del plan",

    brandingTitle: "Vista previa de portada en vivo",
    brandingEdit: "Ajustar branding",
    brandingCollapse: "Contraer",

    playerName: "Nombre del jugador",
    playerPosition: "Posición",
    playerPhoto: "URL de la foto del jugador",
    club: "Club",
    customClub: "Nombre del club manualmente",
    teamType: "Equipo",
    academy: "Academia",
    firstTeam: "Primer equipo",
    ageCategory: "Categoría de edad",
    chooseAgeCategory: "Elegir categoría de edad",
    periodWeeks: "Periodo del plan de desarrollo",

    country: "País",
    chooseCountry: "Elegir país",
    league: "Liga",
    chooseLeague: "Elegir liga",
    chooseClub: "Elegir club",
    clubModePreset: "Club de la lista",
    clubModeCustom: "Club propio",
    customClubHelp:
      "Usa esto para un club que no está en la lista. Después puedes completar manualmente el logo y los colores.",

    primaryColor: "Color principal",
    secondaryColor: "Color secundario",
    tertiaryColor: "Color terciario",
    colorBalance: "Balance principal (%)",
    logoUrl: "URL del logo del club",

    heroChatTitle: "Trabaja desde lo que ves de forma concreta.",
    heroChatBody:
      "Describe una situación, el comportamiento del jugador y el efecto sobre el juego.",

    heroManualTitle: "Trabaja manualmente desde un punto de desarrollo claro.",
    heroManualBody:
      "Completa paso a paso el núcleo del plan. Empieza por el punto de desarrollo.",

    hintObservation: "Observación",
    hintMoment: "Momento",
    hintGoal: "Efecto",
    hintRefine: "Profundizar",

    developmentPoint: "Punto de desarrollo",

    statusPoint: "Acuerdo",
    statusContext: "Contexto",
    statusReality: "Realidad",
    statusApproach: "Enfoque",
    statusSuccess: "Éxito",

    noPlayerYet: "Jugador",

    downloadPlayer: "Descargar plan del jugador",
    availableOther: "También disponible en otros idiomas",
    exportTitle: "Descargar plan",
    exportAlways: "Directamente exportable",
    exportStrong:
      "Puedes descargar un PDF útil en cualquier momento, incluso si el plan todavía no está completamente desarrollado.",

    progressTitle: "Progreso del plan",
    progressBody:
      "Este progreso combina base del plan, desarrollo de contenido y evidencia.",

    evidenceTitle: "Evidencia",
    evidenceBody:
      "Añade evidencia cuando ayude a concretar mejor la observación, el contexto y el seguimiento.",

    videoTitle: "Evidencia en vídeo",
    videoBody:
      "Añade clips como evidencia visual del punto de desarrollo. Mantenlo concreto y relevante.",
    dataTitle: "Evidencia de datos",
    dataBody:
      "Más adelante podrás conectar fuentes de datos e indicadores al plan. Esta función llegará en una versión futura.",
    notYetAvailable: "Aún no disponible",

    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Título",
    videoUrl: "URL del vídeo",
    videoMoment: "Fecha / momento",
    videoSource: "Fuente",
    videoMatch: "Partido",
    videoTraining: "Entrenamiento",
    videoUpload: "Subir vídeo",
    videoUploadHelp:
      "La subida funciona en esta versión dentro de tu sesión. Más adelante conectaremos una API de subida para almacenamiento fijo.",
    compactVideoOpen: "Abrir",
    compactVideoClose: "Cerrar",
    compactVideoEmpty: "Sin clips",
    compactVideoCount: "clips",
    openClip: "Abrir clip",
    closeClip: "Cerrar clip",
    activeLabel: "Activo",
    optionalLabel: "Opcional",

    langNl: "NL",
    langEn: "EN",
    langDe: "DE",
    langEs: "ES",
    langIt: "IT",
    langFr: "FR",

    step1Eyebrow: "Paso 1",
    step1Title: "¿Para quién es este plan?",
    step1Body:
      "Define para qué jugador se construye este plan. El nombre y la posición forman la base. Una foto es opcional, pero ayuda a que el plan sea visualmente propio y reconocible de inmediato en la vista previa y en el PDF.",
    editPhoto: "Ajustar foto",
    removePhoto: "Eliminar",
    playerVisualIdentity: "Identidad visual",
    newPlayer: "Nuevo jugador",
    photoHelp:
      "Por ahora utiliza una URL de imagen. Esta foto se usa en la vista previa visual y en la portada del PDF.",
    photoPill: "Foto",
    avatarAdd: "Añadir",
    avatarEdit: "Editar",

    coverPreviewSub:
      "Esta vista previa utiliza el mismo formato vertical que el PDF final.",
    presetActive: "Preset del club activo",
    coverSystemLine: "Plan Personal de Desarrollo",

    workspaceTitle: "Espacio de trabajo",
    workspaceBody:
      "De la observación al plan. Construye primero la conversación o el punto de desarrollo y añade después la evidencia.",

    controlLayer: "Estado del plan",
    controlLayerBody:
      "Configuración, evidencia y exportación se quedan aquí. El chat impulsa la construcción del contenido del plan.",
    clubContext: "Contexto del club",
    pdfReady: "PDF listo",
    playerIdentity: "Perfil del jugador",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Equipo",
    completion: "Completado",
    completed: "Terminado",

    weekSingle: "semana",
    weekPlural: "semanas",

    downloadFailedAlert:
      "Ha ocurrido un error al descargar el PDF.",
  },

  it: {
    modeChat: "Conversazione",
    modeManual: "Manuale",

    basicsTitle: "Base del piano",
    basicsSubtitle:
      "Definisci prima per chi è questo piano. Club, squadra e branding determinano poi automaticamente il contesto corretto.",

    basicsSectionClubContext: "Contesto del club",
    basicsSectionPlanSetup: "Impostazione del piano",

    brandingTitle: "Anteprima live della copertina",
    brandingEdit: "Modifica branding",
    brandingCollapse: "Riduci",

    playerName: "Nome del giocatore",
    playerPosition: "Posizione",
    playerPhoto: "URL della foto del giocatore",
    club: "Club",
    customClub: "Nome del club manualmente",
    teamType: "Squadra",
    academy: "Academy",
    firstTeam: "Prima squadra",
    ageCategory: "Categoria d'età",
    chooseAgeCategory: "Scegli categoria d'età",
    periodWeeks: "Periodo del piano di sviluppo",

    country: "Paese",
    chooseCountry: "Scegli paese",
    league: "Campionato",
    chooseLeague: "Scegli campionato",
    chooseClub: "Scegli club",
    clubModePreset: "Club dalla lista",
    clubModeCustom: "Club personalizzato",
    customClubHelp:
      "Usa questa opzione per un club che non è nella lista. Poi puoi compilare manualmente logo e colori.",

    primaryColor: "Colore primario",
    secondaryColor: "Colore secondario",
    tertiaryColor: "Colore terziario",
    colorBalance: "Bilanciamento primario (%)",
    logoUrl: "URL del logo del club",

    heroChatTitle: "Lavora da ciò che vedi concretamente.",
    heroChatBody:
      "Descrivi una situazione, il comportamento del giocatore e l'effetto sul gioco.",

    heroManualTitle: "Lavora manualmente da un punto di sviluppo chiaro.",
    heroManualBody:
      "Compila passo dopo passo il nucleo del piano. Inizia dal punto di sviluppo.",

    hintObservation: "Osservazione",
    hintMoment: "Momento",
    hintGoal: "Effetto",
    hintRefine: "Approfondire",

    developmentPoint: "Punto di sviluppo",

    statusPoint: "Accordo",
    statusContext: "Contesto",
    statusReality: "Realtà",
    statusApproach: "Approccio",
    statusSuccess: "Successo",

    noPlayerYet: "Giocatore",

    downloadPlayer: "Scarica piano del giocatore",
    availableOther: "Disponibile anche in altre lingue",
    exportTitle: "Scarica piano",
    exportAlways: "Direttamente esportabile",
    exportStrong:
      "Puoi scaricare un PDF utile in qualsiasi momento, anche se il piano non è ancora completamente sviluppato.",

    progressTitle: "Avanzamento del piano",
    progressBody:
      "Questo avanzamento combina base del piano, sviluppo del contenuto ed evidenze.",

    evidenceTitle: "Evidenze",
    evidenceBody:
      "Aggiungi evidenze quando aiutano a rendere più precise osservazione, contesto e seguito.",

    videoTitle: "Evidenza video",
    videoBody:
      "Aggiungi clip come evidenza visiva del punto di sviluppo. Mantienilo concreto e rilevante.",
    dataTitle: "Evidenza dati",
    dataBody:
      "Più avanti potrai collegare fonti dati e indicatori al piano. Questa funzione arriverà in una versione successiva.",
    notYetAvailable: "Non ancora disponibile",

    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Titolo",
    videoUrl: "URL del video",
    videoMoment: "Data / momento",
    videoSource: "Fonte",
    videoMatch: "Partita",
    videoTraining: "Allenamento",
    videoUpload: "Carica video",
    videoUploadHelp:
      "L'upload funziona in questa versione all'interno della tua sessione. Per uno storage fisso collegheremo più avanti una upload API.",
    compactVideoOpen: "Apri",
    compactVideoClose: "Chiudi",
    compactVideoEmpty: "Nessuna clip",
    compactVideoCount: "clip",
    openClip: "Apri clip",
    closeClip: "Chiudi clip",
    activeLabel: "Attivo",
    optionalLabel: "Opzionale",

    langNl: "NL",
    langEn: "EN",
    langDe: "DE",
    langEs: "ES",
    langIt: "IT",
    langFr: "FR",

    step1Eyebrow: "Passo 1",
    step1Title: "Per chi è questo piano?",
    step1Body:
      "Definisci per quale giocatore viene costruito questo piano. Nome e posizione formano la base. Una foto è opzionale, ma aiuta a rendere il piano visivamente più personale e subito riconoscibile nell'anteprima e nel PDF.",
    editPhoto: "Modifica foto",
    removePhoto: "Rimuovi",
    playerVisualIdentity: "Identità visiva",
    newPlayer: "Nuovo giocatore",
    photoHelp:
      "Per ora usa un URL immagine. Questa foto viene utilizzata nell'anteprima visiva e nella copertina PDF.",
    photoPill: "Foto",
    avatarAdd: "Aggiungi",
    avatarEdit: "Modifica",

    coverPreviewSub:
      "Questa anteprima usa lo stesso formato verticale del PDF finale.",
    presetActive: "Preset club attivo",
    coverSystemLine: "Piano Personale di Sviluppo",

    workspaceTitle: "Spazio di lavoro",
    workspaceBody:
      "Dall'osservazione al piano. Costruisci prima la conversazione o il punto di sviluppo e aggiungi poi le evidenze.",

    controlLayer: "Stato del piano",
    controlLayerBody:
      "Setup, evidenze ed export restano qui. La chat guida la costruzione del contenuto del piano.",
    clubContext: "Contesto del club",
    pdfReady: "PDF pronto",
    playerIdentity: "Profilo del giocatore",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Squadra",
    completion: "Completamento",
    completed: "Completato",

    weekSingle: "settimana",
    weekPlural: "settimane",

    downloadFailedAlert:
      "Si è verificato un errore durante il download del PDF.",
  },

  fr: {
    modeChat: "Conversation",
    modeManual: "Manuel",

    basicsTitle: "Base du plan",
    basicsSubtitle:
      "Définis d'abord pour qui ce plan est destiné. Club, équipe et branding déterminent ensuite automatiquement le bon contexte.",

    basicsSectionClubContext: "Contexte du club",
    basicsSectionPlanSetup: "Configuration du plan",

    brandingTitle: "Aperçu live de la couverture",
    brandingEdit: "Ajuster le branding",
    brandingCollapse: "Réduire",

    playerName: "Nom du joueur",
    playerPosition: "Poste",
    playerPhoto: "URL de la photo du joueur",
    club: "Club",
    customClub: "Nom du club manuellement",
    teamType: "Équipe",
    academy: "Académie",
    firstTeam: "Équipe première",
    ageCategory: "Catégorie d'âge",
    chooseAgeCategory: "Choisir la catégorie d'âge",
    periodWeeks: "Période du plan de développement",

    country: "Pays",
    chooseCountry: "Choisir le pays",
    league: "Championnat",
    chooseLeague: "Choisir le championnat",
    chooseClub: "Choisir le club",
    clubModePreset: "Club de la liste",
    clubModeCustom: "Club personnalisé",
    customClubHelp:
      "Utilise ceci pour un club qui n'est pas dans la liste. Tu peux ensuite remplir manuellement le logo et les couleurs.",

    primaryColor: "Couleur principale",
    secondaryColor: "Couleur secondaire",
    tertiaryColor: "Couleur tertiaire",
    colorBalance: "Balance principale (%)",
    logoUrl: "URL du logo du club",

    heroChatTitle: "Travaille à partir de ce que tu vois concrètement.",
    heroChatBody:
      "Décris une situation, le comportement du joueur et l'effet sur le jeu.",

    heroManualTitle: "Travaille manuellement à partir d'un point de développement clair.",
    heroManualBody:
      "Remplis étape par étape le noyau du plan. Commence par le point de développement.",

    hintObservation: "Observation",
    hintMoment: "Moment",
    hintGoal: "Effet",
    hintRefine: "Affiner",

    developmentPoint: "Point de développement",

    statusPoint: "Accord",
    statusContext: "Contexte",
    statusReality: "Réalité",
    statusApproach: "Approche",
    statusSuccess: "Réussite",

    noPlayerYet: "Joueur",

    downloadPlayer: "Télécharger le plan du joueur",
    availableOther: "Aussi disponible dans d'autres langues",
    exportTitle: "Télécharger le plan",
    exportAlways: "Directement exportable",
    exportStrong:
      "Tu peux télécharger un PDF exploitable à tout moment, même si le plan n'est pas encore complètement développé.",

    progressTitle: "Progression du plan",
    progressBody:
      "Cette progression combine base du plan, élaboration du contenu et preuves.",

    evidenceTitle: "Preuves",
    evidenceBody:
      "Ajoute des preuves quand cela aide à rendre plus précis l'observation, le contexte et le suivi.",

    videoTitle: "Preuve vidéo",
    videoBody:
      "Ajoute des clips comme preuve visuelle du point de développement. Garde cela concret et pertinent.",
    dataTitle: "Preuve de données",
    dataBody:
      "Plus tard, tu pourras relier des sources de données et des indicateurs au plan. Cette fonction arrivera dans une version suivante.",
    notYetAvailable: "Pas encore disponible",

    videoClip1: "Clip 1",
    videoClip2: "Clip 2",
    videoClip3: "Clip 3",
    videoName: "Titre",
    videoUrl: "URL vidéo",
    videoMoment: "Date / moment",
    videoSource: "Source",
    videoMatch: "Match",
    videoTraining: "Entraînement",
    videoUpload: "Téléverser une vidéo",
    videoUploadHelp:
      "L'upload fonctionne dans cette version au sein de ta session. Pour un stockage fixe, nous relierons plus tard une API d'upload.",
    compactVideoOpen: "Ouvrir",
    compactVideoClose: "Fermer",
    compactVideoEmpty: "Aucun clip",
    compactVideoCount: "clips",
    openClip: "Ouvrir le clip",
    closeClip: "Fermer le clip",
    activeLabel: "Actif",
    optionalLabel: "Optionnel",

    langNl: "NL",
    langEn: "EN",
    langDe: "DE",
    langEs: "ES",
    langIt: "IT",
    langFr: "FR",

    step1Eyebrow: "Étape 1",
    step1Title: "Pour qui est ce plan ?",
    step1Body:
      "Définis pour quel joueur ce plan est construit. Le nom et le poste forment la base. Une photo est optionnelle, mais elle aide à rendre le plan visuellement identifiable et immédiatement reconnaissable dans l'aperçu et le PDF.",
    editPhoto: "Modifier la photo",
    removePhoto: "Supprimer",
    playerVisualIdentity: "Identité visuelle",
    newPlayer: "Nouveau joueur",
    photoHelp:
      "Utilise pour l'instant une URL d'image. Cette photo est utilisée dans l'aperçu visuel et sur la couverture du PDF.",
    photoPill: "Photo",
    avatarAdd: "Ajouter",
    avatarEdit: "Modifier",

    coverPreviewSub:
      "Cet aperçu utilise le même format portrait que le PDF final.",
    presetActive: "Preset club actif",
    coverSystemLine: "Plan Personnel de Développement",

    workspaceTitle: "Espace de travail",
    workspaceBody:
      "De l'observation au plan. Construis d'abord l'échange ou le point de développement, puis ajoute les preuves.",

    controlLayer: "Statut du plan",
    controlLayerBody:
      "Setup, preuves et export restent ici. Le chat guide la construction du contenu du plan.",
    clubContext: "Contexte du club",
    pdfReady: "PDF prêt",
    playerIdentity: "Profil du joueur",
    brandingMetaClub: "Club",
    brandingMetaTeam: "Équipe",
    completion: "Avancement",
    completed: "Terminé",

    weekSingle: "semaine",
    weekPlural: "semaines",

    downloadFailedAlert:
      "Une erreur s'est produite lors du téléchargement du PDF.",
  },
} as const;

const COUNTRY_LABELS: Record<
  string,
  { nl: string; en: string; de: string; es: string; it: string; fr: string }
> = {
  Netherlands: {
    nl: "Nederland",
    en: "Netherlands",
    de: "Niederlande",
    es: "Países Bajos",
    it: "Paesi Bassi",
    fr: "Pays-Bas",
  },
  Belgium: {
    nl: "België",
    en: "Belgium",
    de: "Belgien",
    es: "Bélgica",
    it: "Belgio",
    fr: "Belgique",
  },
  Germany: {
    nl: "Duitsland",
    en: "Germany",
    de: "Deutschland",
    es: "Alemania",
    it: "Germania",
    fr: "Allemagne",
  },
  England: {
    nl: "Engeland",
    en: "England",
    de: "England",
    es: "Inglaterra",
    it: "Inghilterra",
    fr: "Angleterre",
  },
  France: {
    nl: "Frankrijk",
    en: "France",
    de: "Frankreich",
    es: "Francia",
    it: "Francia",
    fr: "France",
  },
  Spain: {
    nl: "Spanje",
    en: "Spain",
    de: "Spanien",
    es: "España",
    it: "Spagna",
    fr: "Espagne",
  },
  Italy: {
    nl: "Italië",
    en: "Italy",
    de: "Italien",
    es: "Italia",
    it: "Italia",
    fr: "Italie",
  },
  Portugal: {
    nl: "Portugal",
    en: "Portugal",
    de: "Portugal",
    es: "Portugal",
    it: "Portogallo",
    fr: "Portugal",
  },
  Sweden: {
    nl: "Zweden",
    en: "Sweden",
    de: "Schweden",
    es: "Suecia",
    it: "Svezia",
    fr: "Suède",
  },
  "United States": {
    nl: "Verenigde Staten",
    en: "United States",
    de: "Vereinigte Staaten",
    es: "Estados Unidos",
    it: "Stati Uniti",
    fr: "États-Unis",
  },
  Other: {
    nl: "Overig",
    en: "Other",
    de: "Andere",
    es: "Otro",
    it: "Altro",
    fr: "Autre",
  },
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

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
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
  const exportAlternativeLangs = SUPPORTED_LANGS.filter((l) => l !== lang);

  const hasTrackedViewRef = useRef(false);
  const hasTrackedStartRef = useRef(false);
  const hasTrackedCompleteRef = useRef(false);
  const trackedFieldsRef = useRef<Record<string, boolean>>({});
  const trackedSectionsRef = useRef<Record<string, boolean>>({});
  const trackedMilestonesRef = useRef<Record<string, boolean>>({});
  const prevModeRef = useRef<Mode>(mode);
  const prevLangRef = useRef<Lang>(lang);

  function ensureStarted(source: string) {
    if (hasTrackedStartRef.current) return;

    hasTrackedStartRef.current = true;
    trackPdpStarted({
      source,
      mode,
      lang,
    });
  }

  function trackFieldOnce(field: string, value?: string | number | boolean) {
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
    if (hasTrackedViewRef.current) return;

    hasTrackedViewRef.current = true;
    trackPdpBuilderViewed({
      mode,
      lang,
    });
  }, [mode, lang]);

  useEffect(() => {
    if (prevModeRef.current === mode) return;

    prevModeRef.current = mode;
    trackPdpModeChanged({
      mode,
      lang,
    });
  }, [mode, lang]);

  useEffect(() => {
    if (prevLangRef.current === lang) return;

    prevLangRef.current = lang;
    trackPdpLanguageChanged({
      mode,
      lang,
    });
  }, [lang, mode]);

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

  const conversationProgress = useMemo(() => {
    if (!chatPlannerState) return 0;

    if (
      typeof chatPlannerState.strongDraftProgress === "number" &&
      chatPlannerState.strongDraftProgress > 0
    ) {
      return chatPlannerState.strongDraftProgress;
    }

    if (typeof chatPlannerState.firstDraftProgress === "number") {
      return chatPlannerState.firstDraftProgress;
    }

    return 0;
  }, [chatPlannerState]);

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
    { key: "basics", progress: basicsProgress.progress, weight: 28 },
    { key: "cover", progress: coverReady ? 100 : 0, weight: 8 },
    { key: "conversation", progress: conversationProgress, weight: 48 },
    { key: "evidence", progress: evidenceProgress.progress, weight: 16 },
  ] as const;

  const totalProgress = Math.round(
    sections.reduce((sum, section) => {
      return sum + (section.progress * section.weight) / 100;
    }, 0)
  );

  useEffect(() => {
    const sectionMap = [
      { key: "basics", value: basicsProgress.progress },
      { key: "cover", value: coverReady ? 100 : 0 },
      { key: "conversation", value: conversationProgress },
      { key: "evidence", value: evidenceProgress.progress },
    ] as const;

    sectionMap.forEach(({ key, value }) => {
      if (value === 100 && !trackedSectionsRef.current[key]) {
        trackedSectionsRef.current[key] = true;

        ensureStarted(`section_${key}`);

        trackPdpSectionCompleted({
          section: key,
          totalProgress,
          mode,
          lang,
        });
      }
    });

    const milestones = [25, 50, 75, 100] as const;

    milestones.forEach((milestone) => {
      const milestoneKey = String(milestone);

      if (
        totalProgress >= milestone &&
        !trackedMilestonesRef.current[milestoneKey]
      ) {
        trackedMilestonesRef.current[milestoneKey] = true;

        trackPdpMilestoneReached({
          milestone,
          totalProgress,
          mode,
          lang,
        });
      }
    });

    if (totalProgress === 100 && !hasTrackedCompleteRef.current) {
      hasTrackedCompleteRef.current = true;

      trackPdpCompleted({
        totalProgress,
        mode,
        lang,
      });
    }
  }, [
    basicsProgress.progress,
    coverReady,
    conversationProgress,
    evidenceProgress.progress,
    totalProgress,
    mode,
    lang,
  ]);

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
    ensureStarted("chat_generation");

    trackPdpPlanGenerated({
      via: "chat",
      mode,
      lang,
    });

    const merged = mergeGeneratedPlanWithLockedBasics(plan, next);
    setPlan(merged);
    setGeneratedPlan(merged);
  }

  function setTeamTypeValue(value: TeamType | "") {
    trackFieldOnce("team_type", value);

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
    trackFieldOnce("club_preset", clubName);

    trackPdpClubContextSelected({
      country: selectedCountry || undefined,
      league: selectedLeague || undefined,
      club: clubName,
      teamType: teamType || undefined,
      team: plan.meta.team || undefined,
      clubMode: "preset",
      mode,
      lang,
    });

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

      if (patch.url && String(patch.url).trim()) {
        ensureStarted("video_url");

        trackPdpEvidenceAdded({
          type: "video",
          clipIndex: index + 1,
          method: "url",
          mode,
          lang,
        });
      }

      return next;
    });
  }

  function handleVideoUpload(index: number, file: File | null) {
    if (!file) return;

    ensureStarted("video_upload");

    trackPdpEvidenceAdded({
      type: "video",
      clipIndex: index + 1,
      method: "upload",
      mode,
      lang,
    });

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

      ensureStarted("download");

      trackPdpDownloadRequested({
        version,
        exportLang,
        totalProgress,
        club: exportPlan.brand?.clubName || "unknown",
        country: selectedCountry || undefined,
        league: selectedLeague || undefined,
        team: exportPlan.meta?.team || undefined,
        hasPhoto: !!exportPlan.player?.headshotUrl,
        usedGeneratedPlan: !!generatedPlan,
        mode,
        lang,
      });

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

        trackPdpDownloadFailed({
          version,
          exportLang,
          status: res.status,
          totalProgress,
          mode,
          lang,
        });

        alert(errorText);
        return;
      }

      if (!contentType.toLowerCase().includes("pdf")) {
        const errorText = await res.text();

        trackPdpDownloadFailed({
          version,
          exportLang,
          status: "invalid_content_type",
          totalProgress,
          mode,
          lang,
        });

        alert(errorText);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const safeClub = (
        exportPlan.brand?.clubName ||
        exportPlan.meta?.club ||
        "club"
      )
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const safePlayer = (exportPlan.player?.name || "player")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const planLabelMap: Record<Lang, string> = {
        nl: "ontwikkelplan",
        en: "development-plan",
        de: "entwicklungsplan",
        es: "plan-de-desarrollo",
        it: "piano-di-sviluppo",
        fr: "plan-de-developpement",
      };

      const planLabel = planLabelMap[exportLang];

      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeClub}-${safePlayer}-${planLabel}-${exportLang}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      trackPdpDownloaded({
        version,
        exportLang,
        totalProgress,
        club: exportPlan.brand?.clubName || "unknown",
        country: selectedCountry || undefined,
        league: selectedLeague || undefined,
        team: exportPlan.meta?.team || undefined,
        hasPhoto: !!exportPlan.player?.headshotUrl,
        usedGeneratedPlan: !!generatedPlan,
        mode,
        lang,
      });
    } catch (error) {
      console.error("Download failed:", error);

      trackPdpDownloadFailed({
        version,
        exportLang,
        status: "client_exception",
        totalProgress,
        mode,
        lang,
      });

      alert(t.downloadFailedAlert);
    }
  }

    function insertPrompt(text: string) {
    ensureStarted("hint");

    trackPdpHintUsed({
      hintLabel: text.slice(0, 80),
      mode,
      lang,
    });

    setPendingChatPrompt(`${text} `);
  }

  const contextualHints = useMemo(() => {
    const planner = chatPlannerState;
    const nextSlide = planner?.nextPrioritySlide;

    if (!planner) {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Beschrijf 1 concreet moment: wat doet de speler en wat gebeurt er daarna?"
              : lang === "de"
                ? "Beschreibe 1 konkreten Moment: Was macht der Spieler und was passiert danach?"
                : lang === "es"
                  ? "Describe 1 momento concreto: ¿qué hace el jugador y qué ocurre después?"
                  : lang === "it"
                    ? "Descrivi 1 momento concreto: cosa fa il giocatore e cosa succede dopo?"
                    : lang === "fr"
                      ? "Décris 1 moment concret : que fait le joueur et que se passe-t-il ensuite ?"
                      : "Describe 1 concrete moment: what does the player do and what happens next?",
        },
      ];
    }

    if (nextSlide === "agreement") {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Wat is het concrete gedrag dat nu het meest in de weg zit?"
              : lang === "de"
                ? "Welches konkrete Verhalten steht momenteel het meest im Weg?"
                : lang === "es"
                  ? "¿Qué comportamiento concreto está interfiriendo más en este momento?"
                  : lang === "it"
                    ? "Qual è il comportamento concreto che in questo momento ostacola di più?"
                    : lang === "fr"
                      ? "Quel comportement concret gêne le plus actuellement ?"
                      : "What is the concrete behaviour that currently gets in the way most?",
        },
        {
          label: t.hintMoment,
          prompt:
            lang === "nl"
              ? "In welk specifiek wedstrijdmoment zie je dit het duidelijkst?"
              : lang === "de"
                ? "In welchem konkreten Spielmoment siehst du das am deutlichsten?"
                : lang === "es"
                  ? "¿En qué momento específico del partido se ve esto con más claridad?"
                  : lang === "it"
                    ? "In quale momento specifico della partita lo vedi più chiaramente?"
                    : lang === "fr"
                      ? "Dans quel moment précis du match vois-tu cela le plus clairement ?"
                      : "In which specific match moment do you see this most clearly?",
        },
        {
          label: t.hintGoal,
          prompt:
            lang === "nl"
              ? "Welk gedrag wil je in deze situatie juist wél terugzien?"
              : lang === "de"
                ? "Welches Verhalten möchtest du in dieser Situation stattdessen sehen?"
                : lang === "es"
                  ? "¿Qué comportamiento quieres ver en esta situación en su lugar?"
                  : lang === "it"
                    ? "Quale comportamento vuoi vedere invece in questa situazione?"
                    : lang === "fr"
                      ? "Quel comportement veux-tu voir à la place dans cette situation ?"
                      : "What behaviour do you want to see in this situation instead?",
        },
      ];
    }

    if (nextSlide === "role_context") {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Wat vraagt zijn rol of positie hier van hem in dit team?"
              : lang === "de"
                ? "Was verlangt seine Rolle oder Position hier in diesem Team von ihm?"
                : lang === "es"
                  ? "¿Qué exige aquí su rol o posición dentro de este equipo?"
                  : lang === "it"
                    ? "Cosa richiede qui il suo ruolo o la sua posizione in questa squadra?"
                    : lang === "fr"
                      ? "Qu’est-ce que son rôle ou son poste exige ici dans cette équipe ?"
                      : "What does his role or position require from him here in this team?",
        },
        {
          label: t.hintMoment,
          prompt:
            lang === "nl"
              ? "In welke teamfase wordt dit echt beslissend?"
              : lang === "de"
                ? "In welcher Teamphase wird das wirklich entscheidend?"
                : lang === "es"
                  ? "¿En qué fase del equipo se vuelve esto realmente decisivo?"
                  : lang === "it"
                    ? "In quale fase della squadra questo diventa davvero decisivo?"
                    : lang === "fr"
                      ? "Dans quelle phase de l’équipe cela devient-il vraiment décisif ?"
                      : "In which team phase does this become truly decisive?",
        },
        {
          label: t.hintGoal,
          prompt:
            lang === "nl"
              ? "Wat wint of verliest het team als dit gedrag wel of niet lukt?"
              : lang === "de"
                ? "Was gewinnt oder verliert das Team, wenn dieses Verhalten gelingt oder nicht gelingt?"
                : lang === "es"
                  ? "¿Qué gana o pierde el equipo si este comportamiento ocurre o no ocurre?"
                  : lang === "it"
                    ? "Cosa guadagna o perde la squadra se questo comportamento riesce o non riesce?"
                    : lang === "fr"
                      ? "Que gagne ou perd l’équipe si ce comportement réussit ou non ?"
                      : "What does the team gain or lose when this behaviour does or does not happen?",
        },
      ];
    }

    if (nextSlide === "reality") {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Wat zie je concreet terug in zijn gedrag of keuzes?"
              : lang === "de"
                ? "Was siehst du konkret in seinem Verhalten oder seinen Entscheidungen?"
                : lang === "es"
                  ? "¿Qué ves de forma concreta en su comportamiento o en sus decisiones?"
                  : lang === "it"
                    ? "Cosa vedi concretamente nel suo comportamento o nelle sue scelte?"
                    : lang === "fr"
                      ? "Que vois-tu concrètement dans son comportement ou ses choix ?"
                      : "What do you concretely see in his behaviour or decisions?",
        },
        {
          label: t.hintMoment,
          prompt:
            lang === "nl"
              ? "Wanneer zie je dit vooral terug: onder welke trigger of omstandigheid?"
              : lang === "de"
                ? "Wann siehst du das vor allem: unter welchem Auslöser oder unter welchen Umständen?"
                : lang === "es"
                  ? "¿Cuándo lo ves sobre todo: bajo qué detonante o circunstancia?"
                  : lang === "it"
                    ? "Quando lo vedi soprattutto: con quale trigger o in quale circostanza?"
                    : lang === "fr"
                      ? "Quand vois-tu cela surtout : sous quel déclencheur ou dans quelle circonstance ?"
                      : "When do you mainly see this: under which trigger or condition?",
        },
        {
          label: t.hintGoal,
          prompt:
            lang === "nl"
              ? "Wat is het directe effect op het spel of team als dit gebeurt?"
              : lang === "de"
                ? "Was ist die direkte Auswirkung auf das Spiel oder das Team, wenn das passiert?"
                : lang === "es"
                  ? "¿Cuál es el efecto directo en el juego o en el equipo cuando esto ocurre?"
                  : lang === "it"
                    ? "Qual è l’effetto diretto sul gioco o sulla squadra quando succede?"
                    : lang === "fr"
                      ? "Quel est l’effet direct sur le jeu ou l’équipe quand cela se produit ?"
                      : "What is the direct effect on the game or team when this happens?",
        },
      ];
    }

    if (nextSlide === "approach") {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Wat moet de speler zelf concreet anders gaan doen?"
              : lang === "de"
                ? "Was muss der Spieler konkret anders machen?"
                : lang === "es"
                  ? "¿Qué debe hacer el jugador de forma concreta de manera diferente?"
                  : lang === "it"
                    ? "Cosa deve fare concretamente il giocatore in modo diverso?"
                    : lang === "fr"
                      ? "Que doit concrètement faire le joueur différemment ?"
                      : "What must the player concretely start doing differently?",
        },
        {
          label: t.hintMoment,
          prompt:
            lang === "nl"
              ? "Hoe werk je hieraan in training of met beelden?"
              : lang === "de"
                ? "Wie arbeitest du daran im Training oder mit Videos?"
                : lang === "es"
                  ? "¿Cómo trabajas esto en el entrenamiento o con vídeo?"
                  : lang === "it"
                    ? "Come lavori su questo in allenamento o con il video?"
                    : lang === "fr"
                      ? "Comment travailles-tu cela à l’entraînement ou avec la vidéo ?"
                      : "How do you work on this in training or through video?",
        },
        {
          label: t.hintGoal,
          prompt:
            lang === "nl"
              ? "Wie draagt hier concreet wat in: speler, trainer, analist of staff?"
              : lang === "de"
                ? "Wer übernimmt hier konkret was: Spieler, Trainer, Analyst oder Staff?"
                : lang === "es"
                  ? "¿Quién asume aquí concretamente qué: jugador, entrenador, analista o staff?"
                  : lang === "it"
                    ? "Chi si occupa concretamente di cosa qui: giocatore, allenatore, analista o staff?"
                    : lang === "fr"
                      ? "Qui prend concrètement quoi en charge ici : joueur, coach, analyste ou staff ?"
                      : "Who concretely owns what here: player, coach, analyst or staff?",
        },
      ];
    }

    if (nextSlide === "success") {
      return [
        {
          label: t.hintObservation,
          prompt:
            lang === "nl"
              ? "Waaraan zie je in het spel dat dit begint te landen?"
              : lang === "de"
                ? "Woran siehst du im Spiel, dass das anfängt zu greifen?"
                : lang === "es"
                  ? "¿En qué ves dentro del juego que esto empieza a asentarse?"
                  : lang === "it"
                    ? "Da cosa vedi in partita che questo sta iniziando a funzionare?"
                    : lang === "fr"
                      ? "À quoi vois-tu dans le jeu que cela commence à s’installer ?"
                      : "What do you see in the game that shows this is starting to land?",
        },
        {
          label: t.hintMoment,
          prompt:
            lang === "nl"
              ? "Welk gedrag van de speler laat zien dat dit echt begint te landen?"
              : lang === "de"
                ? "Welches Verhalten des Spielers zeigt, dass das wirklich anfängt zu greifen?"
                : lang === "es"
                  ? "¿Qué comportamiento del jugador muestra que esto realmente empieza a asentarse?"
                  : lang === "it"
                    ? "Quale comportamento del giocatore mostra che questo sta davvero iniziando a consolidarsi?"
                    : lang === "fr"
                      ? "Quel comportement du joueur montre que cela commence vraiment à s’installer ?"
                      : "What player behaviour shows that this is truly starting to land?",
        },
        {
          label: t.hintGoal,
          prompt:
            lang === "nl"
              ? "Wat zijn vroege signalen dat dit plan begint te werken?"
              : lang === "de"
                ? "Was sind frühe Signale dafür, dass dieser Plan zu wirken beginnt?"
                : lang === "es"
                  ? "¿Cuáles son señales tempranas de que este plan empieza a funcionar?"
                  : lang === "it"
                    ? "Quali sono i primi segnali che questo piano sta iniziando a funzionare?"
                    : lang === "fr"
                      ? "Quels sont les premiers signaux que ce plan commence à fonctionner ?"
                      : "What are early signals that this plan is starting to work?",
        },
      ];
    }

    return [
      {
        label: t.hintRefine,
        prompt:
          lang === "nl"
            ? "Maak het scherper: wat doet de speler exact anders dan nodig en wat is direct het gevolg?"
            : lang === "de"
              ? "Mach es schärfer: Was genau macht der Spieler anders als nötig und was ist die direkte Folge?"
              : lang === "es"
                ? "Hazlo más preciso: ¿qué hace exactamente el jugador distinto de lo que se necesita y cuál es la consecuencia directa?"
                : lang === "it"
                  ? "Rendilo più preciso: cosa fa esattamente il giocatore in modo diverso da quanto serve e qual è la conseguenza diretta?"
                  : lang === "fr"
                    ? "Affine : que fait exactement le joueur différemment de ce qu’il faudrait, et quelle en est la conséquence directe ?"
                    : "Make it sharper: what exactly does the player do differently than needed, and what is the direct consequence?",
      },
    ];
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
                          onChange={(v) => {
                            trackFieldOnce("player_name");
                            setPlan((prev) => ({
                              ...prev,
                              player: { ...prev.player, name: v },
                            }));
                          }}
                        />

                        <Input
                          label={t.playerPosition}
                          value={plan.player.role}
                          onChange={(v) => {
                            trackFieldOnce("player_role");
                            setPlan((prev) => ({
                              ...prev,
                              player: { ...prev.player, role: v },
                            }));
                          }}
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
                              onChange={(v) => {
                                trackFieldOnce("player_photo");
                                setPlan((prev) => ({
                                  ...prev,
                                  player: { ...prev.player, headshotUrl: v },
                                }));
                              }}
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
                        trackFieldOnce("country", value);

                        trackPdpClubContextSelected({
                          country: value,
                          league: undefined,
                          club: undefined,
                          teamType: teamType || undefined,
                          team: plan.meta.team || undefined,
                          clubMode: "preset",
                          mode,
                          lang,
                        });

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
                          trackFieldOnce("league", value);

                          trackPdpClubContextSelected({
                            country: selectedCountry || undefined,
                            league: value,
                            club: undefined,
                            teamType: teamType || undefined,
                            team: plan.meta.team || undefined,
                            clubMode: "preset",
                            mode,
                            lang,
                          });

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
                              onChange={(v) => {
                                trackFieldOnce("club_custom");

                                trackPdpClubContextSelected({
                                  country: selectedCountry || undefined,
                                  league: selectedLeague || undefined,
                                  club: v || undefined,
                                  teamType: teamType || undefined,
                                  team: plan.meta.team || undefined,
                                  clubMode: "custom",
                                  mode,
                                  lang,
                                });

                                setPlan((prev) => ({
                                  ...prev,
                                  meta: { ...prev.meta, club: v },
                                  brand: { ...prev.brand, clubName: v },
                                }));
                              }}
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
                        onChange={(value) => {
                          trackFieldOnce("academy_age", value);

                          trackPdpClubContextSelected({
                            country: selectedCountry || undefined,
                            league: selectedLeague || undefined,
                            club: plan.brand.clubName || plan.meta.club || undefined,
                            teamType: teamType || undefined,
                            team: value,
                            clubMode,
                            mode,
                            lang,
                          });

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
                          }));
                        }}
                      />
                    ) : (
                      <div className="hidden sm:block" />
                    )}

                    <div className="sm:col-span-2">
                      <WeekLengthPicker
                        label={t.periodWeeks}
                        value={plan.meta.blockLengthWeeks || 8}
                        lang={lang}
                        onChange={(value) => {
                          trackFieldOnce("block_length_weeks", value);
                          setPlan((prev) => ({
                            ...prev,
                            meta: {
                              ...prev.meta,
                              blockLengthWeeks: value,
                            },
                          }));
                        }}
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
                    onChange={(v) => {
                      trackFieldOnce("primary_color");
                      trackPdpBrandingEdited({
                        changedField: "primaryColor",
                        mode,
                        lang,
                      });

                      setPlan((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, primaryColor: v },
                      }));
                    }}
                  />

                  <Input
                    label={t.secondaryColor}
                    value={plan.brand.secondaryColor}
                    onChange={(v) => {
                      trackFieldOnce("secondary_color");
                      trackPdpBrandingEdited({
                        changedField: "secondaryColor",
                        mode,
                        lang,
                      });

                      setPlan((prev) => ({
                        ...prev,
                        brand: { ...prev.brand, secondaryColor: v },
                      }));
                    }}
                  />

                  <Input
                    label={t.tertiaryColor}
                    value={(plan.brand as any).tertiaryColor || ""}
                    onChange={(v) => {
                      trackFieldOnce("tertiary_color");
                      trackPdpBrandingEdited({
                        changedField: "tertiaryColor",
                        mode,
                        lang,
                      });

                      setPlan((prev) => ({
                        ...prev,
                        brand: { ...(prev.brand as any), tertiaryColor: v },
                      }));
                    }}
                  />

                  <Input
                    label={t.colorBalance}
                    value={String((plan.brand as any).colorBalance || 70)}
                    onChange={(v) => {
                      trackFieldOnce("color_balance");
                      trackPdpBrandingEdited({
                        changedField: "colorBalance",
                        mode,
                        lang,
                      });

                      setPlan((prev) => ({
                        ...prev,
                        brand: {
                          ...(prev.brand as any),
                          colorBalance: Number(v),
                        },
                      }));
                    }}
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label={t.logoUrl}
                      value={plan.brand.logoUrl}
                      onChange={(v) => {
                        trackFieldOnce("logo_url");
                        trackPdpBrandingEdited({
                          changedField: "logoUrl",
                          mode,
                          lang,
                        });

                        setPlan((prev) => ({
                          ...prev,
                          brand: { ...prev.brand, logoUrl: v },
                        }));
                      }}
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
                        onChange={(v) => {
                          trackFieldOnce("manual_development_point");
                          setPlan((prev) => ({
                            ...prev,
                            slide2: { ...prev.slide2, focusBehaviour: v },
                          }));
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-h-[760px] flex-col gap-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[12px] uppercase tracking-[0.18em] text-white/38">
                  {t.controlLayer}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-white/52">
                  {t.controlLayerBody}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <MiniMetaPill>
                    {t.clubContext}: {plan.meta.club || "—"}
                  </MiniMetaPill>

                  <MiniMetaPill>
                    {t.brandingMetaTeam}: {plan.meta.team || "—"}
                  </MiniMetaPill>

                  <MiniMetaPill>
                    {t.playerIdentity}: {plan.player.name || "—"}
                  </MiniMetaPill>

                  <MiniMetaPill>Evidence: {clipCount}/3</MiniMetaPill>

                  <MiniMetaPill>
                    {t.completion}: {totalProgress}%
                  </MiniMetaPill>
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
                      onClick={() =>
                        setVideoPanelOpen((v) => {
                          const next = !v;

                          trackPdpEvidencePanelToggled({
                            panel: "video",
                            state: next ? "open" : "close",
                            mode,
                            lang,
                          });

                          return next;
                        })
                      }
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
                                      {isActive ? t.activeLabel : t.optionalLabel}
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

                  <div className="flex flex-wrap gap-2">
                    {exportAlternativeLangs.map((exportLang) => (
                      <button
                        key={exportLang}
                        onClick={() => download("player", exportLang)}
                        className="flex-1 rounded-full border border-white/10 bg-white/[0.02] py-2.5 text-[12px] text-white/72 transition hover:border-white/18 hover:text-white"
                      >
                        {exportLang.toUpperCase()}
                      </button>
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
  t: (typeof UI)[Lang];
  onChange: (patch: Record<string, string>) => void;
  onUpload: (file: File | null) => void;
  compact?: boolean;
}) {
  const source = clip?.source === "training" ? "training" : "match";
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      className={
        compact
          ? "space-y-2.5"
          : "rounded-[18px] border border-white/10 bg-white/[0.02] p-3"
      }
    >
      {!compact && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-[13px] font-medium text-white/86">{title}</div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/34">
            {upload?.fileName || clip?.url ? t.activeLabel : t.optionalLabel}
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
  const t = UI[lang];

  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-wide text-white/40">
        {label}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = current === option;
          const suffix = option === 1 ? t.weekSingle : t.weekPlural;

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
  t: (typeof UI)[Lang];
}) {
  return (
    <div className="inline-flex flex-wrap rounded-full border border-white/10 bg-white/[0.04] p-1 text-[11px] tracking-[0.14em]">
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
      <button
        onClick={() => setLang("de")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "de" ? "bg-white text-black" : "text-white/48 hover:text-white/78"
        }`}
      >
        {t.langDe}
      </button>
      <button
        onClick={() => setLang("es")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "es" ? "bg-white text-black" : "text-white/48 hover:text-white/78"
        }`}
      >
        {t.langEs}
      </button>
      <button
        onClick={() => setLang("it")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "it" ? "bg-white text-black" : "text-white/48 hover:text-white/78"
        }`}
      >
        {t.langIt}
      </button>
      <button
        onClick={() => setLang("fr")}
        className={`rounded-full px-3 py-1.5 transition ${
          lang === "fr" ? "bg-white text-black" : "text-white/48 hover:text-white/78"
        }`}
      >
        {t.langFr}
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
  t: (typeof UI)[Lang];
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