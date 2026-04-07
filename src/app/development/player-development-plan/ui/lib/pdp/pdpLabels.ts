export type Lang = "nl" | "en" | "de" | "es" | "it" | "fr";

type LabelMap = Record<string, Record<Lang, string>>;

/**
 * -----------------------------------------
 * CORE SLIDE LABELS (1:1 met flow keys)
 * -----------------------------------------
 */

const SLIDE_LABELS = {
  cover: {
    nl: "",
    en: "",
    de: "",
    es: "",
    it: "",
    fr: "",
  },

  agreement: {
    nl: "AFSPRAAK",
    en: "AGREEMENT",
    de: "VEREINBARUNG",
    es: "ACUERDO",
    it: "ACCORDO",
    fr: "ACCORD",
  },

  role_context: {
    nl: "ROL IN CONTEXT",
    en: "ROLE CONTEXT",
    de: "ROLLE IM KONTEXT",
    es: "ROL EN CONTEXTO",
    it: "RUOLO NEL CONTESTO",
    fr: "RÔLE DANS LE CONTEXTE",
  },

  reality: {
    nl: "REALITEIT",
    en: "REALITY",
    de: "REALITÄT",
    es: "REALIDAD",
    it: "REALTÀ",
    fr: "RÉALITÉ",
  },

  approach: {
    nl: "AANPAK",
    en: "APPROACH",
    de: "AUSFÜHRUNG",
    es: "ENFOQUE",
    it: "APPROCCIO",
    fr: "APPROCHE",
  },

  success: {
    nl: "SUCCES",
    en: "SUCCESS",
    de: "ERFOLG",
    es: "ÉXITO",
    it: "SUCCESSO",
    fr: "RÉUSSITE",
  },
} as const;

/**
 * -----------------------------------------
 * SECTION LABELS (slides / PDF)
 * -----------------------------------------
 */

const SECTION_LABELS = {
  targetBehaviour: {
    nl: "GEWENST GEDRAG",
    en: "TARGET BEHAVIOUR",
    de: "GEWÜNSCHTES VERHALTEN",
    es: "CONDUCTA OBJETIVO",
    it: "COMPORTAMENTO OBIETTIVO",
    fr: "COMPORTEMENT CIBLE",
  },
  whereVisible: {
    nl: "WAAR DIT ZICHTBAAR MOET WORDEN",
    en: "WHERE THIS SHOULD BECOME VISIBLE",
    de: "WO DAS SICHTBAR WERDEN MUSS",
    es: "DÓNDE DEBE VERSE ESTO",
    it: "DOVE QUESTO DEVE VEDERSI",
    fr: "OÙ CELA DOIT SE VOIR",
  },
  focusPeriod: {
    nl: "FOCUSPERIODE",
    en: "FOCUS PERIOD",
    de: "FOKUSPHASE",
    es: "PERIODO DE FOCO",
    it: "PERIODO DI FOCUS",
    fr: "PÉRIODE DE FOCUS",
  },
  evaluation: {
    nl: "EVALUATIE",
    en: "EVALUATION",
    de: "AUSWERTUNG",
    es: "EVALUACIÓN",
    it: "VALUTAZIONE",
    fr: "ÉVALUATION",
  },
  start: {
    nl: "START",
    en: "START",
    de: "START",
    es: "INICIO",
    it: "INIZIO",
    fr: "DÉBUT",
  },

  gameMoments: {
    nl: "SPELMOMENTEN",
    en: "GAME MOMENTS",
    de: "SPIELMOMENTE",
    es: "MOMENTOS DEL JUEGO",
    it: "MOMENTI DI GIOCO",
    fr: "MOMENTS DE JEU",
  },
  zones: {
    nl: "ZONES / CONTEXT",
    en: "ZONES / CONTEXT",
    de: "ZONEN / KONTEXT",
    es: "ZONAS / CONTEXTO",
    it: "ZONE / CONTESTO",
    fr: "ZONES / CONTEXTE",
  },
  principles: {
    nl: "PRINCIPES",
    en: "PRINCIPLES",
    de: "PRINZIPIEN",
    es: "PRINCIPIOS",
    it: "PRINCIPI",
    fr: "PRINCIPES",
  },

  observations: {
    nl: "WAT WE NU ZIEN",
    en: "WHAT WE SEE NOW",
    de: "WAS WIR JETZT SEHEN",
    es: "LO QUE VEMOS AHORA",
    it: "COSA VEDIAMO ORA",
    fr: "CE QUE L’ON VOIT MAINTENANT",
  },
  contextVisible: {
    nl: "WAAR DIT ZICHTBAAR WORDT",
    en: "WHERE THIS BECOMES VISIBLE",
    de: "WO DAS SICHTBAR WIRD",
    es: "DÓNDE SE VE ESTO",
    it: "DOVE QUESTO SI VEDE",
    fr: "OÙ CELA DEVIENT VISIBLE",
  },
  effect: {
    nl: "GEVOLG VOOR HET SPEL",
    en: "EFFECT ON THE GAME",
    de: "AUSWIRKUNG AUF DAS SPIEL",
    es: "EFECTO EN EL JUEGO",
    it: "EFFETTO SUL GIOCO",
    fr: "EFFET SUR LE JEU",
  },
  evidence: {
    nl: "BEWIJS / VIDEO",
    en: "EVIDENCE / VIDEO",
    de: "BELEG / VIDEO",
    es: "EVIDENCIA / VÍDEO",
    it: "EVIDENZA / VIDEO",
    fr: "PREUVE / VIDÉO",
  },

  training: {
    nl: "TRAINING",
    en: "TRAINING",
    de: "TRAINING",
    es: "ENTRENAMIENTO",
    it: "ALLENAMENTO",
    fr: "ENTRAÎNEMENT",
  },
  match: {
    nl: "WEDSTRIJD",
    en: "MATCH",
    de: "SPIEL",
    es: "PARTIDO",
    it: "PARTITA",
    fr: "MATCH",
  },
  video: {
    nl: "VIDEO",
    en: "VIDEO",
    de: "VIDEO",
    es: "VÍDEO",
    it: "VIDEO",
    fr: "VIDÉO",
  },
  offField: {
    nl: "BUITEN HET VELD",
    en: "OFF FIELD",
    de: "AUSSERHALB DES FELDES",
    es: "FUERA DEL CAMPO",
    it: "FUORI DAL CAMPO",
    fr: "HORS TERRAIN",
  },
  alignment: {
    nl: "AFSTEMMING",
    en: "ALIGNMENT",
    de: "ABSTIMMUNG",
    es: "ALINEACIÓN",
    it: "ALLINEAMENTO",
    fr: "ALIGNEMENT",
  },

  inGame: {
    nl: "ZICHTBAAR IN HET SPEL",
    en: "VISIBLE IN THE GAME",
    de: "IM SPIEL SICHTBAR",
    es: "VISIBLE EN EL JUEGO",
    it: "VISIBILE NEL GIOCO",
    fr: "VISIBLE DANS LE JEU",
  },
  behaviour: {
    nl: "GEDRAG",
    en: "BEHAVIOUR",
    de: "VERHALTEN",
    es: "COMPORTAMIENTO",
    it: "COMPORTAMENTO",
    fr: "COMPORTEMENT",
  },
  signals: {
    nl: "EERSTE SIGNALEN",
    en: "EARLY SIGNALS",
    de: "ERSTE SIGNALE",
    es: "PRIMERAS SEÑALES",
    it: "PRIMI SEGNALI",
    fr: "PREMIERS SIGNAUX",
  },
} as const;

/**
 * -----------------------------------------
 * UI LABELS (builder / side panels / shell)
 * -----------------------------------------
 */

const UI_LABELS = {
  workspace: {
    nl: "Werkruimte",
    en: "Workspace",
    de: "Arbeitsbereich",
    es: "Espacio de trabajo",
    it: "Spazio di lavoro",
    fr: "Espace de travail",
  },
  workspaceBody: {
    nl: "Van observatie naar plan. Bouw eerst het gesprek of ontwikkelpunt, voeg daarna onderbouwing toe.",
    en: "From observation to plan. Build the conversation or development point first, then add supporting evidence.",
    de: "Von der Beobachtung zum Plan. Baue zuerst das Gespräch oder den Entwicklungspunkt auf und füge danach Belege hinzu.",
    es: "De la observación al plan. Primero construye la conversación o el punto de desarrollo y después añade evidencia.",
    it: "Dall’osservazione al piano. Costruisci prima la conversazione o il punto di sviluppo e poi aggiungi supporto.",
    fr: "De l’observation au plan. Construis d’abord l’échange ou le point de développement, puis ajoute des éléments d’appui.",
  },

  planStatus: {
    nl: "Planstatus",
    en: "Plan status",
    de: "Planstatus",
    es: "Estado del plan",
    it: "Stato del piano",
    fr: "État du plan",
  },
  playerIdentity: {
    nl: "Spelersprofiel",
    en: "Player identity",
    de: "Spielerprofil",
    es: "Perfil del jugador",
    it: "Profilo del giocatore",
    fr: "Profil du joueur",
  },

  evidence: {
    nl: "Onderbouwing",
    en: "Evidence",
    de: "Belege",
    es: "Evidencia",
    it: "Evidenza",
    fr: "Éléments d’appui",
  },
  evidenceBody: {
    nl: "Voeg onderbouwing toe wanneer dat helpt om observatie, context en opvolging scherper te maken.",
    en: "Add evidence when it helps sharpen observation, context and follow-up.",
    de: "Füge Belege hinzu, wenn sie helfen, Beobachtung, Kontext und Nachverfolgung zu schärfen.",
    es: "Añade evidencia cuando ayude a concretar mejor la observación, el contexto y el seguimiento.",
    it: "Aggiungi evidenza quando aiuta a rendere più chiari osservazione, contesto e seguito.",
    fr: "Ajoute des éléments d’appui quand cela aide à rendre plus précis l’observation, le contexte et le suivi.",
  },

  video: {
    nl: "Video",
    en: "Video",
    de: "Video",
    es: "Vídeo",
    it: "Video",
    fr: "Vidéo",
  },
  videoBody: {
    nl: "Voeg clips toe als visueel bewijs voor het ontwikkelpunt. Houd het concreet en relevant.",
    en: "Add clips as visual evidence for the development point. Keep it concrete and relevant.",
    de: "Füge Clips als visuellen Beleg für den Entwicklungspunkt hinzu. Halte es konkret und passend.",
    es: "Añade clips como evidencia visual del punto de desarrollo. Que sea concreto y relevante.",
    it: "Aggiungi clip come evidenza visiva del punto di sviluppo. Tienilo concreto e pertinente.",
    fr: "Ajoute des clips comme preuve visuelle du point de développement. Garde cela concret et pertinent.",
  },

  data: {
    nl: "Data",
    en: "Data",
    de: "Daten",
    es: "Datos",
    it: "Dati",
    fr: "Données",
  },
  dataBody: {
    nl: "Koppel later databronnen en indicatoren aan het plan.",
    en: "Later you can connect data sources and indicators to the plan.",
    de: "Später kannst du Datenquellen und Kennzahlen mit dem Plan verknüpfen.",
    es: "Más adelante puedes conectar fuentes de datos e indicadores al plan.",
    it: "Più avanti puoi collegare fonti dati e indicatori al piano.",
    fr: "Plus tard, tu pourras relier des sources de données et des indicateurs au plan.",
  },

  notes: {
    nl: "Notities",
    en: "Notes",
    de: "Notizen",
    es: "Notas",
    it: "Note",
    fr: "Notes",
  },
  insights: {
    nl: "Inzichten",
    en: "Insights",
    de: "Erkenntnisse",
    es: "Conclusiones",
    it: "Spunti",
    fr: "Points clés",
  },

  progress: {
    nl: "Voortgang",
    en: "Progress",
    de: "Fortschritt",
    es: "Progreso",
    it: "Avanzamento",
    fr: "Progression",
  },
  planProgress: {
    nl: "Planvoortgang",
    en: "Plan progress",
    de: "Planfortschritt",
    es: "Progreso del plan",
    it: "Avanzamento del piano",
    fr: "Progression du plan",
  },

  section: {
    nl: "Onderdeel",
    en: "Section",
    de: "Bereich",
    es: "Bloque",
    it: "Sezione",
    fr: "Section",
  },
  sections: {
    nl: "Onderdelen",
    en: "Sections",
    de: "Bereiche",
    es: "Bloques",
    it: "Sezioni",
    fr: "Sections",
  },

  status: {
    nl: "Status",
    en: "Status",
    de: "Status",
    es: "Estado",
    it: "Stato",
    fr: "Statut",
  },
  live: {
    nl: "Live",
    en: "Live",
    de: "Live",
    es: "En directo",
    it: "Live",
    fr: "En direct",
  },
  synced: {
    nl: "Plan bijgewerkt",
    en: "Plan synced",
    de: "Plan aktualisiert",
    es: "Plan actualizado",
    it: "Piano aggiornato",
    fr: "Plan mis à jour",
  },

  open: {
    nl: "Open",
    en: "Open",
    de: "Offen",
    es: "Abierto",
    it: "Aperto",
    fr: "Ouvert",
  },
  availableOther: {
    nl: "Ook beschikbaar in een andere taal",
    en: "Also available in another language",
    de: "Auch in einer anderen Sprache verfügbar",
    es: "También disponible en otro idioma",
    it: "Disponibile anche in un’altra lingua",
    fr: "Disponible aussi dans une autre langue",
  },
  pdfReady: {
    nl: "Klaar voor PDF",
    en: "PDF ready",
    de: "Bereit für PDF",
    es: "Listo para PDF",
    it: "Pronto per PDF",
    fr: "Prêt pour le PDF",
  },
  clubContext: {
    nl: "Clubcontext",
    en: "Club context",
    de: "Klubkontext",
    es: "Contexto del club",
    it: "Contesto del club",
    fr: "Contexte du club",
  },
  completion: {
    nl: "Compleet",
    en: "Completion",
    de: "Abschluss",
    es: "Completado",
    it: "Completamento",
    fr: "Avancement",
  },
  completed: {
    nl: "Voltooid",
    en: "Completed",
    de: "Abgeschlossen",
    es: "Completado",
    it: "Completato",
    fr: "Terminé",
  },
  notYetAvailable: {
    nl: "Nog niet beschikbaar",
    en: "Not yet available",
    de: "Noch nicht verfügbar",
    es: "Aún no disponible",
    it: "Non ancora disponibile",
    fr: "Pas encore disponible",
  },
} as const;

/**
 * -----------------------------------------
 * CHAT LABELS
 * -----------------------------------------
 */

const CHAT_LABELS = {
  introQuestion: {
    nl: "Wat zie je concreet gebeuren bij deze speler?",
    en: "What do you concretely see happening with this player?",
    de: "Was siehst du bei diesem Spieler konkret passieren?",
    es: "¿Qué ves exactamente que pasa con este jugador?",
    it: "Che cosa vedi concretamente succedere con questo giocatore?",
    fr: "Que vois-tu concrètement chez ce joueur ?",
  },
  layerLabel: {
    nl: "Plangesprek",
    en: "Plan conversation",
    de: "Plangespräch",
    es: "Conversación del plan",
    it: "Conversazione del piano",
    fr: "Échange sur le plan",
  },
  title: {
    nl: "Bouw het plan vanuit wat je concreet ziet.",
    en: "Build the plan from what you concretely see.",
    de: "Baue den Plan aus dem auf, was du konkret siehst.",
    es: "Construye el plan desde lo que ves de forma concreta.",
    it: "Costruisci il piano da quello che vedi in modo concreto.",
    fr: "Construis le plan à partir de ce que tu vois concrètement.",
  },
  body: {
    nl: "Werk snel van observatie naar ontwikkelpunt, context, aanpak en succesdefinitie.",
    en: "Move quickly from observation to development point, context, approach and success definition.",
    de: "Gehe schnell von der Beobachtung zum Entwicklungspunkt, Kontext, Vorgehen und Erfolgsbild.",
    es: "Pasa rápido de la observación al punto de desarrollo, contexto, enfoque y definición de éxito.",
    it: "Passa in fretta dall’osservazione al punto di sviluppo, al contesto, all’approccio e alla definizione di successo.",
    fr: "Passe vite de l’observation au point de développement, au contexte, à l’approche et à la définition de la réussite.",
  },
  thinking: {
    nl: "Denkt…",
    en: "Thinking…",
    de: "Denkt nach…",
    es: "Pensando…",
    it: "Sta pensando…",
    fr: "Réflexion…",
  },
  building: {
    nl: "Werkt plan bij…",
    en: "Updating plan…",
    de: "Plan wird aktualisiert…",
    es: "Actualizando plan…",
    it: "Aggiornamento del piano…",
    fr: "Mise à jour du plan…",
  },
  placeholder: {
    nl: "Beschrijf concreet wat je ziet of kies hieronder een richting…",
    en: "Describe concretely what you see or choose a direction below…",
    de: "Beschreibe konkret, was du siehst, oder wähle unten eine Richtung…",
    es: "Describe de forma concreta lo que ves o elige abajo una dirección…",
    it: "Descrivi in modo concreto quello che vedi oppure scegli sotto una direzione…",
    fr: "Décris concrètement ce que tu vois ou choisis une direction ci-dessous…",
  },
  send: {
    nl: "Verstuur",
    en: "Send",
    de: "Senden",
    es: "Enviar",
    it: "Invia",
    fr: "Envoyer",
  },
  sendHint: {
    nl: "CMD/CTRL + ENTER",
    en: "CMD/CTRL + ENTER",
    de: "CMD/CTRL + ENTER",
    es: "CMD/CTRL + ENTER",
    it: "CMD/CTRL + ENTER",
    fr: "CMD/CTRL + ENTER",
  },
  errorChat: {
    nl: "Er ging iets mis in de chat.",
    en: "Something went wrong in the chat.",
    de: "Im Chat ist etwas schiefgelaufen.",
    es: "Algo ha fallado en el chat.",
    it: "Qualcosa è andato storto nella chat.",
    fr: "Quelque chose n’a pas fonctionné dans le chat.",
  },
  errorGenerate: {
    nl: "Er ging iets mis bij het bijwerken van het plan.",
    en: "Something went wrong while updating the plan.",
    de: "Beim Aktualisieren des Plans ist etwas schiefgelaufen.",
    es: "Algo ha fallado al actualizar el plan.",
    it: "Qualcosa è andato storto durante l’aggiornamento del piano.",
    fr: "Quelque chose n’a pas fonctionné pendant la mise à jour du plan.",
  },

  quickPromptBehaviourPressure: {
    nl: "Beschrijf het gedrag onder druk",
    en: "Describe the behaviour under pressure",
    de: "Beschreibe das Verhalten unter Druck",
    es: "Describe el comportamiento bajo presión",
    it: "Descrivi il comportamento sotto pressione",
    fr: "Décris le comportement sous pression",
  },
  quickPromptMatchSituation: {
    nl: "Beschrijf de spelsituatie",
    en: "Describe the match situation",
    de: "Beschreibe die Spielsituation",
    es: "Describe la situación de juego",
    it: "Descrivi la situazione di gioco",
    fr: "Décris la situation de jeu",
  },
  quickPromptTeamEffect: {
    nl: "Beschrijf het effect op het team",
    en: "Describe the effect on the team",
    de: "Beschreibe die Auswirkung auf das Team",
    es: "Describe el efecto en el equipo",
    it: "Descrivi l’effetto sulla squadra",
    fr: "Décris l’effet sur l’équipe",
  },

  guidedAgreementCore: {
    nl: "Beschrijf het kernprobleem",
    en: "Describe the core issue",
    de: "Beschreibe das Kernproblem",
    es: "Describe el problema principal",
    it: "Descrivi il problema principale",
    fr: "Décris le problème principal",
  },
  guidedAgreementTarget: {
    nl: "Beschrijf het gewenste gedrag",
    en: "Describe the target behaviour",
    de: "Beschreibe das gewünschte Verhalten",
    es: "Describe la conducta objetivo",
    it: "Descrivi il comportamento obiettivo",
    fr: "Décris le comportement cible",
  },
  guidedAgreementMoment: {
    nl: "Beschrijf de wedstrijdsituatie",
    en: "Describe the match situation",
    de: "Beschreibe die Spielsituation",
    es: "Describe la situación de partido",
    it: "Descrivi la situazione di partita",
    fr: "Décris la situation de match",
  },

  guidedContextRole: {
    nl: "Wat vraagt de rol hier?",
    en: "What does the role ask here?",
    de: "Was verlangt die Rolle hier?",
    es: "¿Qué pide aquí el rol?",
    it: "Che cosa richiede qui il ruolo?",
    fr: "Qu’est-ce que le rôle demande ici ?",
  },
  guidedContextPhase: {
    nl: "In welke fase wordt dit beslissend?",
    en: "In which phase is this decisive?",
    de: "In welcher Phase wird das entscheidend?",
    es: "¿En qué fase es esto decisivo?",
    it: "In quale fase questo diventa decisivo?",
    fr: "Dans quelle phase cela devient-il décisif ?",
  },
  guidedContextLoss: {
    nl: "Wat verliest het team hier?",
    en: "What does the team lose here?",
    de: "Was verliert das Team hier?",
    es: "¿Qué pierde aquí el equipo?",
    it: "Che cosa perde qui la squadra?",
    fr: "Qu’est-ce que l’équipe perd ici ?",
  },

  guidedRealityFirst: {
    nl: "Wat zie je als eerste gebeuren?",
    en: "What is the first visible behaviour?",
    de: "Was siehst du als Erstes passieren?",
    es: "¿Qué es lo primero que ves pasar?",
    it: "Qual è la prima cosa che vedi succedere?",
    fr: "Qu’est-ce que tu vois d’abord ?",
  },
  guidedRealityWhen: {
    nl: "Wanneer gebeurt dit het meest?",
    en: "When does this happen most clearly?",
    de: "Wann passiert das am deutlichsten?",
    es: "¿Cuándo pasa esto con más claridad?",
    it: "Quando succede questo in modo più chiaro?",
    fr: "Quand est-ce que cela se voit le plus ?",
  },
  guidedRealityEffect: {
    nl: "Wat is het directe effect?",
    en: "What is the direct effect?",
    de: "Was ist die direkte Auswirkung?",
    es: "¿Cuál es el efecto directo?",
    it: "Qual è l’effetto diretto?",
    fr: "Quel est l’effet direct ?",
  },

  guidedApproachPlayer: {
    nl: "Wat moet de speler direct anders doen?",
    en: "What must the player do differently right away?",
    de: "Was muss der Spieler sofort anders machen?",
    es: "¿Qué debe hacer el jugador diferente de inmediato?",
    it: "Che cosa deve fare il giocatore in modo diverso da subito?",
    fr: "Que doit faire le joueur différemment tout de suite ?",
  },
  guidedApproachCoach: {
    nl: "Wat pakt de coach op?",
    en: "What should the coach own?",
    de: "Was übernimmt der Trainer?",
    es: "¿Qué asume el entrenador?",
    it: "Di cosa si occupa l’allenatore?",
    fr: "Qu’est-ce que le coach prend en charge ?",
  },
  guidedApproachVideo: {
    nl: "Wat voeg je toe via video?",
    en: "What do you add through video?",
    de: "Was fügst du über Video hinzu?",
    es: "¿Qué añades a través del vídeo?",
    it: "Che cosa aggiungi attraverso il video?",
    fr: "Qu’ajoutes-tu avec la vidéo ?",
  },

  guidedSuccessGame: {
    nl: "Waaraan zie je dit in de wedstrijd?",
    en: "What should become visible in games?",
    de: "Woran siehst du das im Spiel?",
    es: "¿En qué se ve esto en el partido?",
    it: "Da cosa lo vedi in partita?",
    fr: "À quoi vois-tu cela dans le match ?",
  },
  guidedSuccessBehaviour: {
    nl: "Welk gedrag moet veranderen?",
    en: "What behaviour should change?",
    de: "Welches Verhalten muss sich ändern?",
    es: "¿Qué comportamiento debe cambiar?",
    it: "Quale comportamento deve cambiare?",
    fr: "Quel comportement doit changer ?",
  },
  guidedSuccessSignal: {
    nl: "Wat is een vroeg signaal?",
    en: "What is an early signal?",
    de: "Was ist ein frühes Signal?",
    es: "¿Cuál es una primera señal?",
    it: "Qual è un primo segnale?",
    fr: "Quel est un premier signal ?",
  },
} as const;

/**
 * -----------------------------------------
 * PLANNER / PROGRESS LABELS
 * -----------------------------------------
 */

const PLANNER_LABELS = {
  currentFocus: {
    nl: "Nu bezig met",
    en: "Now working on",
    de: "Nu bezig met",
    es: "Ahora trabajando en",
    it: "Ora al lavoro su",
    fr: "En train de travailler sur",
  },
  nextFocus: {
    nl: "Nu bezig met",
    en: "Now working on",
    de: "Jetzt im Fokus",
    es: "Ahora trabajando en",
    it: "Ora al lavoro su",
    fr: "En cours sur",
  },
  progress: {
    nl: "Voortgang",
    en: "Progress",
    de: "Fortschritt",
    es: "Progreso",
    it: "Avanzamento",
    fr: "Progression",
  },
  planProgress: {
    nl: "Planvoortgang",
    en: "Plan progress",
    de: "Planfortschritt",
    es: "Progreso del plan",
    it: "Avanzamento del piano",
    fr: "Progression du plan",
  },
  missing: {
    nl: "Open",
    en: "Open",
    de: "Offen",
    es: "Abierto",
    it: "Aperto",
    fr: "Ouvert",
  },
  section: {
    nl: "Onderdeel",
    en: "Section",
    de: "Bereich",
    es: "Bloque",
    it: "Sezione",
    fr: "Section",
  },
  sections: {
    nl: "Onderdelen",
    en: "Sections",
    de: "Bereiche",
    es: "Bloques",
    it: "Sezioni",
    fr: "Sections",
  },
} as const;

/**
 * -----------------------------------------
 * ACTION LABELS (buttons / CTA)
 * -----------------------------------------
 */

const ACTION_LABELS = {
  updatePlan: {
    nl: "Werk plan bij",
    en: "Update plan",
    de: "Plan aktualisieren",
    es: "Actualizar plan",
    it: "Aggiorna piano",
    fr: "Mettre à jour le plan",
  },
  viewPlan: {
    nl: "Bekijk plan",
    en: "View plan",
    de: "Plan ansehen",
    es: "Ver plan",
    it: "Vedi piano",
    fr: "Voir le plan",
  },
  downloadPlan: {
    nl: "Download plan",
    en: "Download plan",
    de: "Plan herunterladen",
    es: "Descargar plan",
    it: "Scarica piano",
    fr: "Télécharger le plan",
  },
  downloadPlayerPlan: {
    nl: "Download spelerplan",
    en: "Download player plan",
    de: "Spielerplan herunterladen",
    es: "Descargar plan del jugador",
    it: "Scarica piano del giocatore",
    fr: "Télécharger le plan du joueur",
  },
  generate: {
    nl: "Genereer",
    en: "Generate",
    de: "Erstellen",
    es: "Generar",
    it: "Genera",
    fr: "Générer",
  },
  save: {
    nl: "Opslaan",
    en: "Save",
    de: "Speichern",
    es: "Guardar",
    it: "Salva",
    fr: "Enregistrer",
  },
  close: {
    nl: "Sluiten",
    en: "Close",
    de: "Schließen",
    es: "Cerrar",
    it: "Chiudi",
    fr: "Fermer",
  },
  open: {
    nl: "Openen",
    en: "Open",
    de: "Öffnen",
    es: "Abrir",
    it: "Apri",
    fr: "Ouvrir",
  },
} as const;

/**
 * -----------------------------------------
 * STATUS LABELS
 * -----------------------------------------
 */

const STATUS_LABELS = {
  empty: {
    nl: "Leeg",
    en: "Empty",
    de: "Leer",
    es: "Vacío",
    it: "Vuoto",
    fr: "Vide",
  },
  draft: {
    nl: "Concept",
    en: "Draft",
    de: "Entwurf",
    es: "Borrador",
    it: "Bozza",
    fr: "Brouillon",
  },
  usable: {
    nl: "Bruikbaar",
    en: "Usable",
    de: "Brauchbar",
    es: "Útil",
    it: "Utilizzabile",
    fr: "Utilisable",
  },
  strong: {
    nl: "Sterk",
    en: "Strong",
    de: "Stark",
    es: "Fuerte",
    it: "Forte",
    fr: "Fort",
  },
} as const;

/**
 * -----------------------------------------
 * PDF LABELS
 * -----------------------------------------
 */

const PDF_LABELS = {
  title: {
    nl: "Speler Ontwikkelplan",
    en: "Player Development Plan",
    de: "Spieler-Entwicklungsplan",
    es: "Plan de Desarrollo del Jugador",
    it: "Piano di Sviluppo del Giocatore",
    fr: "Plan de Développement du Joueur",
  },
  generatedOn: {
    nl: "Gegenereerd op",
    en: "Generated on",
    de: "Erstellt am",
    es: "Generado el",
    it: "Generato il",
    fr: "Généré le",
  },
  summary: {
    nl: "Samenvatting",
    en: "Summary",
    de: "Zusammenfassung",
    es: "Resumen",
    it: "Sintesi",
    fr: "Résumé",
  },
  conclusions: {
    nl: "Conclusies",
    en: "Conclusions",
    de: "Schlussfolgerungen",
    es: "Conclusiones",
    it: "Conclusioni",
    fr: "Conclusions",
  },
  systemLine: {
    nl: "PERSOONLIJK ONTWIKKELPLAN",
    en: "PERSONAL DEVELOPMENT PLAN",
    de: "PERSÖNLICHER ENTWICKLUNGSPLAN",
    es: "PLAN PERSONAL DE DESARROLLO",
    it: "PIANO PERSONALE DI SVILUPPO",
    fr: "PLAN PERSONNEL DE DÉVELOPPEMENT",
  },
} as const;

/**
 * -----------------------------------------
 * FALLBACK / EMPTY STATES
 * -----------------------------------------
 */

const FALLBACK_LABELS = {
  empty: {
    nl: "Nog niet ingevuld",
    en: "Not yet defined",
    de: "Noch nicht ausgefüllt",
    es: "Aún no definido",
    it: "Non ancora definito",
    fr: "Pas encore défini",
  },
  notAddedYet: {
    nl: "Nog niet toegevoegd",
    en: "Not added yet",
    de: "Noch nicht hinzugefügt",
    es: "Aún no añadido",
    it: "Non ancora aggiunto",
    fr: "Pas encore ajouté",
  },
  noVideoYet: {
    nl: "Nog geen video toegevoegd",
    en: "No video added yet",
    de: "Noch kein Video hinzugefügt",
    es: "Aún no se ha añadido vídeo",
    it: "Nessun video ancora aggiunto",
    fr: "Aucune vidéo ajoutée pour le moment",
  },
  noDataYet: {
    nl: "Nog geen data toegevoegd",
    en: "No data added yet",
    de: "Noch keine Daten hinzugefügt",
    es: "Aún no se han añadido datos",
    it: "Nessun dato ancora aggiunto",
    fr: "Aucune donnée ajoutée pour le moment",
  },
} as const;

/**
 * -----------------------------------------
 * INTERNAL RESOLVER
 * -----------------------------------------
 */

function resolveLabel<T extends LabelMap>(
  map: T,
  key: keyof T,
  lang: Lang,
  fallback = ""
) {
  const value = map[key]?.[lang];

  if (!value && fallback === "") {
    console.warn(`[pdpLabels] Missing label for "${String(key)}" in "${lang}"`);
  }

  return value ?? fallback;
}

/**
 * -----------------------------------------
 * PUBLIC API
 * -----------------------------------------
 */

export function slideLabel(key: keyof typeof SLIDE_LABELS, lang: Lang) {
  return resolveLabel(SLIDE_LABELS, key, lang, "");
}

export function sectionLabel(key: keyof typeof SECTION_LABELS, lang: Lang) {
  return resolveLabel(SECTION_LABELS, key, lang, "");
}

export function uiLabel(key: keyof typeof UI_LABELS, lang: Lang) {
  return resolveLabel(UI_LABELS, key, lang, "");
}

export function chatLabel(key: keyof typeof CHAT_LABELS, lang: Lang) {
  return resolveLabel(CHAT_LABELS, key, lang, "");
}

export function plannerLabel(key: keyof typeof PLANNER_LABELS, lang: Lang) {
  return resolveLabel(PLANNER_LABELS, key, lang, "");
}

export function actionLabel(key: keyof typeof ACTION_LABELS, lang: Lang) {
  return resolveLabel(ACTION_LABELS, key, lang, "");
}

export function statusLabel(key: keyof typeof STATUS_LABELS, lang: Lang) {
  return resolveLabel(STATUS_LABELS, key, lang, "");
}

export function pdfLabel(key: keyof typeof PDF_LABELS, lang: Lang) {
  return resolveLabel(PDF_LABELS, key, lang, "");
}

export function fallbackLabel(key: keyof typeof FALLBACK_LABELS, lang: Lang) {
  return resolveLabel(FALLBACK_LABELS, key, lang, "");
}