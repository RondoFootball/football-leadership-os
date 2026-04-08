// src/app/api/pdp/chat/chatSlots.ts

import type { Lang } from "@/app/development/player-development-plan/ui/lib/engineSchema";

export type ChatSlotKey =
  | "developmentPoint"
  | "targetBehaviour"
  | "matchSituation"
  | "roleRequirements"
  | "decisiveTeamPhases"
  | "teamImpact"
  | "observations"
  | "whenObserved"
  | "effectOnGame"
  | "playerExecution"
  | "trainingVideoPlan"
  | "matchOffFieldPlan"
  | "ownership"
  | "successInGame"
  | "successBehaviour"
  | "successSignals";

export type ChatSlotSlide =
  | "agreement"
  | "role_context"
  | "reality"
  | "approach"
  | "success";

type LocalizedText = Record<Lang, string>;

export type ChatSlotDefinition = {
  key: ChatSlotKey;
  label: string;
  description: string;
  slide: ChatSlotSlide;
  requiredForFirstDraft: boolean;
  requiredForStrongDraft: boolean;
  priority: number;
  questionPrompt: LocalizedText;
  sharpenPrompt: LocalizedText;
};

export const CHAT_SLOTS: ChatSlotDefinition[] = [
  /**
   * SLIDE 2 — AGREEMENT
   */
  {
    key: "developmentPoint",
    label: "Ontwikkelpunt",
    description:
      "Wat is het dominante en concrete ontwikkelpunt van deze speler?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 1,
    questionPrompt: {
      nl: "Wat is het concrete gedrag dat nu het meest in de weg zit?",
      en: "What is the concrete behaviour that currently gets in the way most?",
      de: "Welches konkrete Verhalten steht aktuell am meisten im Weg?",
      es: "¿Cuál es el comportamiento concreto que ahora más se interpone?",
      it: "Qual è il comportamento concreto che in questo momento ostacola di più?",
      fr: "Quel est le comportement concret qui gêne actuellement le plus ?",
    },
    sharpenPrompt: {
      nl: "Maak het ontwikkelpunt concreter: wat doet de speler exact te laat, niet of verkeerd?",
      en: "Make the development point more concrete: what does the player do too late, not at all, or incorrectly?",
      de: "Mach den Entwicklungspunkt konkreter: Was macht der Spieler genau zu spät, gar nicht oder falsch?",
      es: "Haz más concreto el punto de desarrollo: ¿qué hace el jugador exactamente demasiado tarde, no hace o hace mal?",
      it: "Rendi più concreto il punto di sviluppo: cosa fa il giocatore esattamente troppo tardi, non fa o fa in modo errato?",
      fr: "Rends le point de développement plus concret : que fait exactement le joueur trop tard, pas du tout ou de manière incorrecte ?",
    },
  },
  {
    key: "targetBehaviour",
    label: "Gewenst gedrag",
    description:
      "Welk observeerbaar gedrag willen we straks wél terugzien?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 3,
    questionPrompt: {
      nl: "Welk gedrag willen we in deze situatie juist wél terugzien?",
      en: "What behaviour do we want to see in this situation instead?",
      de: "Welches Verhalten wollen wir in dieser Situation stattdessen sehen?",
      es: "¿Qué comportamiento queremos ver en esta situación en su lugar?",
      it: "Quale comportamento vogliamo invece vedere in questa situazione?",
      fr: "Quel comportement voulons-nous voir dans cette situation à la place ?",
    },
    sharpenPrompt: {
      nl: "Maak het gewenste gedrag observeerbaar: wat moet de speler dan concreet doen?",
      en: "Make the target behaviour observable: what should the player concretely do then?",
      de: "Mach das gewünschte Verhalten beobachtbar: Was soll der Spieler dann konkret tun?",
      es: "Haz observable la conducta objetivo: ¿qué debe hacer concretamente el jugador entonces?",
      it: "Rendi osservabile il comportamento obiettivo: cosa deve fare concretamente il giocatore in quel momento?",
      fr: "Rends le comportement cible observable : que doit concrètement faire le joueur alors ?",
    },
  },
  {
    key: "matchSituation",
    label: "Wedstrijdmoment",
    description:
      "In welke wedstrijdsituatie of spelsituatie komt dit ontwikkelpunt het duidelijkst terug?",
    slide: "agreement",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 2,
    questionPrompt: {
      nl: "In welk specifiek wedstrijdmoment zie je dit het duidelijkst terug?",
      en: "In which specific match moment do you see this most clearly?",
      de: "In welchem konkreten Spielmoment siehst du das am deutlichsten?",
      es: "¿En qué momento concreto del partido ves esto con más claridad?",
      it: "In quale momento specifico della partita lo vedi più chiaramente?",
      fr: "Dans quel moment précis du match vois-tu cela le plus clairement ?",
    },
    sharpenPrompt: {
      nl: "Maak de situatie specifieker: waar op het veld, onder welke druk en in welke spelfase?",
      en: "Make the situation more specific: where on the pitch, under what pressure, and in which phase of play?",
      de: "Mach die Situation spezifischer: Wo auf dem Feld, unter welchem Druck und in welcher Spielphase?",
      es: "Haz la situación más específica: ¿en qué zona del campo, bajo qué presión y en qué fase del juego?",
      it: "Rendi la situazione più specifica: dove in campo, sotto quale pressione e in quale fase di gioco?",
      fr: "Rends la situation plus spécifique : où sur le terrain, sous quelle pression et dans quelle phase de jeu ?",
    },
  },

  /**
   * SLIDE 3 — ROLE CONTEXT
   */
  {
    key: "roleRequirements",
    label: "Wat de rol vraagt",
    description:
      "Wat vraagt de positie of rol van de speler in dit team op dit punt?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 7,
    questionPrompt: {
      nl: "Wat vraagt zijn rol of positie hier van hem in dit team?",
      en: "What does his role or position require from him here in this team?",
      de: "Was verlangt seine Rolle oder Position hier in diesem Team von ihm?",
      es: "¿Qué le exige aquí su rol o posición en este equipo?",
      it: "Che cosa richiede qui il suo ruolo o la sua posizione in questa squadra?",
      fr: "Qu’est-ce que son rôle ou son poste exige de lui ici dans cette équipe ?",
    },
    sharpenPrompt: {
      nl: "Maak de roleis scherper: wat moet hij in deze rol herkennen, kiezen of uitvoeren?",
      en: "Sharpen the role requirement: what must he recognise, choose, or execute in this role?",
      de: "Schärfe die Rollenanforderung: Was muss er in dieser Rolle erkennen, wählen oder ausführen?",
      es: "Afina la exigencia del rol: ¿qué debe reconocer, elegir o ejecutar en este rol?",
      it: "Rendi più precisa la richiesta del ruolo: cosa deve riconoscere, scegliere o eseguire in questo ruolo?",
      fr: "Affûte l’exigence du rôle : que doit-il reconnaître, choisir ou exécuter dans ce rôle ?",
    },
  },
  {
    key: "decisiveTeamPhases",
    label: "Beslissende teamfases",
    description:
      "In welke teamfases of spelmomenten wordt dit gedrag echt beslissend?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 8,
    questionPrompt: {
      nl: "In welke teamfases wordt dit gedrag echt beslissend?",
      en: "In which team phases does this behaviour become truly decisive?",
      de: "In welchen Teamphasen wird dieses Verhalten wirklich entscheidend?",
      es: "¿En qué fases del equipo este comportamiento se vuelve realmente decisivo?",
      it: "In quali fasi della squadra questo comportamento diventa davvero decisivo?",
      fr: "Dans quelles phases de l’équipe ce comportement devient-il vraiment décisif ?",
    },
    sharpenPrompt: {
      nl: "Noem de fases concreet: opbouw, druk zetten, restverdediging, omschakeling of iets anders?",
      en: "Name the phases concretely: build-up, pressing, rest defence, transition, or something else?",
      de: "Benenne die Phasen konkret: Aufbau, Pressing, Restverteidigung, Umschalten oder etwas anderes?",
      es: "Nombra las fases de forma concreta: salida, presión, defensa de rest, transición u otra cosa.",
      it: "Nomina le fasi in modo concreto: costruzione, pressione, rest defence, transizione o altro?",
      fr: "Nomme les phases concrètement : construction, pressing, défense de rest, transition ou autre chose ?",
    },
  },
  {
    key: "teamImpact",
    label: "Teamimpact",
    description:
      "Wat wint of verliest het team als dit gedrag wel of niet lukt?",
    slide: "role_context",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 9,
    questionPrompt: {
      nl: "Wat wint of verliest het team als dit gedrag wel of niet lukt?",
      en: "What does the team gain or lose when this behaviour does or does not happen?",
      de: "Was gewinnt oder verliert das Team, wenn dieses Verhalten gelingt oder nicht gelingt?",
      es: "¿Qué gana o pierde el equipo cuando este comportamiento se da o no se da?",
      it: "Che cosa guadagna o perde la squadra quando questo comportamento riesce o non riesce?",
      fr: "Que gagne ou perd l’équipe lorsque ce comportement se produit ou non ?",
    },
    sharpenPrompt: {
      nl: "Maak de teamimpact concreet: wat verandert er direct in tempo, controle, veldbezetting of kanskwaliteit?",
      en: "Make the team impact concrete: what changes directly in tempo, control, occupation, or chance quality?",
      de: "Mach den Teameffekt konkret: Was verändert sich direkt bei Tempo, Kontrolle, Feldbesetzung oder Chancenqualität?",
      es: "Haz concreto el impacto en el equipo: ¿qué cambia directamente en ritmo, control, ocupación de espacios o calidad de ocasiones?",
      it: "Rendi concreto l’impatto sulla squadra: cosa cambia direttamente in ritmo, controllo, occupazione del campo o qualità delle occasioni?",
      fr: "Rends l’impact sur l’équipe concret : qu’est-ce qui change directement dans le tempo, le contrôle, l’occupation du terrain ou la qualité des occasions ?",
    },
  },

  /**
   * SLIDE 4 — REALITY
   */
  {
    key: "observations",
    label: "Wat zien we nu",
    description:
      "Wat zien we concreet terug in gedrag, uitvoering of keuzes van de speler?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 4,
    questionPrompt: {
      nl: "Wat zie je concreet terug in zijn gedrag of keuzes?",
      en: "What do you concretely see in his behaviour or decisions?",
      de: "Was siehst du konkret in seinem Verhalten oder seinen Entscheidungen?",
      es: "¿Qué ves de forma concreta en su comportamiento o en sus decisiones?",
      it: "Che cosa vedi concretamente nel suo comportamento o nelle sue scelte?",
      fr: "Que vois-tu concrètement dans son comportement ou ses choix ?",
    },
    sharpenPrompt: {
      nl: "Maak de observatie concreter: wat doet hij exact, en niet alleen wat ontbreekt?",
      en: "Make the observation more concrete: what exactly does he do, not just what is missing?",
      de: "Mach die Beobachtung konkreter: Was macht er genau, und nicht nur, was fehlt?",
      es: "Haz la observación más concreta: ¿qué hace exactamente, y no solo qué falta?",
      it: "Rendi più concreta l’osservazione: che cosa fa esattamente, non solo ciò che manca?",
      fr: "Rends l’observation plus concrète : que fait-il exactement, et pas seulement ce qui manque ?",
    },
  },
  {
    key: "whenObserved",
    label: "Wanneer zien we dit",
    description:
      "Onder welke triggers, omstandigheden of wedstrijdmomenten zien we dit terug?",
    slide: "reality",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 6,
    questionPrompt: {
      nl: "Wanneer zie je dit vooral terug: onder welke trigger of omstandigheid?",
      en: "When do you mainly see this: under which trigger or condition?",
      de: "Wann siehst du das vor allem: unter welchem Auslöser oder welcher Bedingung?",
      es: "¿Cuándo lo ves sobre todo: bajo qué desencadenante o condición?",
      it: "Quando lo vedi soprattutto: sotto quale trigger o condizione?",
      fr: "Quand vois-tu cela surtout : sous quel déclencheur ou dans quelle condition ?",
    },
    sharpenPrompt: {
      nl: "Maak de trigger scherper: tijd, druk, lichaamshouding, veldpositie of spelrichting?",
      en: "Sharpen the trigger: time, pressure, body orientation, pitch position, or direction of play?",
      de: "Schärfe den Auslöser: Zeit, Druck, Körperstellung, Feldposition oder Spielrichtung?",
      es: "Afina el desencadenante: tiempo, presión, orientación corporal, posición en el campo o dirección del juego.",
      it: "Rendi più preciso il trigger: tempo, pressione, orientamento del corpo, posizione in campo o direzione del gioco?",
      fr: "Affûte le déclencheur : temps, pression, orientation du corps, position sur le terrain ou direction du jeu ?",
    },
  },
  {
    key: "effectOnGame",
    label: "Effect op het spel",
    description:
      "Wat is het gevolg van dit gedrag voor het team of voor het spel?",
    slide: "reality",
    requiredForFirstDraft: true,
    requiredForStrongDraft: true,
    priority: 5,
    questionPrompt: {
      nl: "Wat is het directe effect op het spel of op het team als dit gebeurt?",
      en: "What is the direct effect on the game or team when this happens?",
      de: "Was ist die direkte Auswirkung auf das Spiel oder auf das Team, wenn das passiert?",
      es: "¿Cuál es el efecto directo en el juego o en el equipo cuando esto ocurre?",
      it: "Qual è l’effetto diretto sul gioco o sulla squadra quando questo accade?",
      fr: "Quel est l’effet direct sur le jeu ou l’équipe lorsque cela se produit ?",
    },
    sharpenPrompt: {
      nl: "Maak het gevolg specifieker: wat gaat er direct verloren of juist niet door in het spel?",
      en: "Make the consequence more specific: what is directly lost or what no longer continues in the game?",
      de: "Mach die Folge konkreter: Was geht direkt verloren oder läuft im Spiel nicht weiter?",
      es: "Haz la consecuencia más específica: ¿qué se pierde directamente o qué deja de continuar en el juego?",
      it: "Rendi la conseguenza più specifica: cosa si perde direttamente o cosa non prosegue più nel gioco?",
      fr: "Rends la conséquence plus spécifique : qu’est-ce qui est directement perdu ou qu’est-ce qui ne se poursuit plus dans le jeu ?",
    },
  },

  /**
   * SLIDE 5 — APPROACH
   */
  {
    key: "playerExecution",
    label: "Speleruitvoering",
    description:
      "Wat moet de speler zelf concreet anders doen vanaf nu?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 10,
    questionPrompt: {
      nl: "Wat moet de speler zelf concreet anders gaan doen?",
      en: "What must the player concretely start doing differently?",
      de: "Was muss der Spieler selbst konkret anders machen?",
      es: "¿Qué debe empezar a hacer el jugador de forma concreta y diferente?",
      it: "Che cosa deve iniziare a fare il giocatore in modo concretamente diverso?",
      fr: "Que doit concrètement commencer à faire le joueur différemment ?",
    },
    sharpenPrompt: {
      nl: "Maak de speleractie concreet en uitvoerbaar: wat moet hij zien, kiezen of uitvoeren?",
      en: "Make the player action concrete and executable: what must he see, choose, or execute?",
      de: "Mach die Spieleraktion konkret und umsetzbar: Was muss er sehen, wählen oder ausführen?",
      es: "Haz la acción del jugador concreta y ejecutable: ¿qué debe ver, elegir o ejecutar?",
      it: "Rendi l’azione del giocatore concreta ed eseguibile: cosa deve vedere, scegliere o eseguire?",
      fr: "Rends l’action du joueur concrète et exécutable : que doit-il voir, choisir ou exécuter ?",
    },
  },
  {
    key: "trainingVideoPlan",
    label: "Training en beelden",
    description:
      "Hoe werken we hieraan in training en in het bekijken van beelden?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 11,
    questionPrompt: {
      nl: "Hoe werk je hieraan in training of met beelden?",
      en: "How do you work on this in training or through video?",
      de: "Wie arbeitest du daran im Training oder mit Video?",
      es: "¿Cómo trabajas esto en entrenamiento o a través del vídeo?",
      it: "Come lavori su questo in allenamento o attraverso il video?",
      fr: "Comment travailles-tu cela à l’entraînement ou via la vidéo ?",
    },
    sharpenPrompt: {
      nl: "Maak de route concreet: wat gebeurt in training en wat gebeurt in video?",
      en: "Make the route concrete: what happens in training and what happens in video?",
      de: "Mach den Weg konkret: Was passiert im Training und was passiert im Video?",
      es: "Haz concreta la ruta: ¿qué pasa en entrenamiento y qué pasa en vídeo?",
      it: "Rendi concreto il percorso: cosa succede in allenamento e cosa succede nel video?",
      fr: "Rends le parcours concret : qu’est-ce qui se passe à l’entraînement et qu’est-ce qui se passe en vidéo ?",
    },
  },
  {
    key: "matchOffFieldPlan",
    label: "Wedstrijd en off-field",
    description:
      "Hoe moet dit zichtbaar worden in de wedstrijd en wat doet de speler buiten het veld?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 12,
    questionPrompt: {
      nl: "Hoe wil je dit terugzien in de wedstrijd en buiten het veld?",
      en: "How do you want to see this back in matches and off the pitch?",
      de: "Wie möchtest du das im Spiel und außerhalb des Feldes sehen?",
      es: "¿Cómo quieres verlo reflejado en el partido y fuera del campo?",
      it: "Come vuoi rivederlo in partita e fuori dal campo?",
      fr: "Comment veux-tu revoir cela en match et en dehors du terrain ?",
    },
    sharpenPrompt: {
      nl: "Maak dit specifieker: wat moet zichtbaar zijn in de wedstrijd, en wat doet de speler daarbuiten?",
      en: "Make this more specific: what should be visible in matches, and what does the player do off the pitch?",
      de: "Mach das konkreter: Was soll im Spiel sichtbar sein und was macht der Spieler außerhalb des Feldes?",
      es: "Hazlo más específico: ¿qué debe ser visible en el partido y qué hace el jugador fuera del campo?",
      it: "Rendilo più specifico: cosa deve essere visibile in partita e cosa fa il giocatore fuori dal campo?",
      fr: "Rends cela plus spécifique : qu’est-ce qui doit être visible en match et que fait le joueur en dehors du terrain ?",
    },
  },
  {
    key: "ownership",
    label: "Eigenaarschap",
    description:
      "Wie voert dit uit en wie stuurt dit aan?",
    slide: "approach",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 13,
    questionPrompt: {
      nl: "Wie draagt hier concreet wat in: speler, trainer, analist of staff?",
      en: "Who concretely owns what here: player, coach, analyst, or staff?",
      de: "Wer übernimmt hier konkret was: Spieler, Trainer, Analyst oder Staff?",
      es: "¿Quién asume concretamente qué aquí: jugador, entrenador, analista o staff?",
      it: "Chi ha concretamente la responsabilità di cosa qui: giocatore, allenatore, analista o staff?",
      fr: "Qui porte concrètement quoi ici : joueur, coach, analyste ou staff ?",
    },
    sharpenPrompt: {
      nl: "Maak het eigenaarschap scherper: wie doet wat, en wie bewaakt de voortgang?",
      en: "Make ownership sharper: who does what, and who monitors progress?",
      de: "Schärfe die Verantwortung: Wer macht was und wer überwacht den Fortschritt?",
      es: "Afina la responsabilidad: ¿quién hace qué y quién controla el progreso?",
      it: "Rendi più chiara la responsabilità: chi fa cosa e chi monitora il progresso?",
      fr: "Précise la responsabilité : qui fait quoi et qui suit la progression ?",
    },
  },

  /**
   * SLIDE 6 — SUCCESS
   */
  {
    key: "successInGame",
    label: "Succes in het spel",
    description:
      "Waaraan zien we in het spel dat dit ontwikkelpunt begint te landen?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 14,
    questionPrompt: {
      nl: "Waaraan zie je in het spel dat dit begint te landen?",
      en: "What do you see in the game that shows this is starting to land?",
      de: "Woran siehst du im Spiel, dass das beginnt zu greifen?",
      es: "¿Qué ves en el juego que muestra que esto empieza a asentarse?",
      it: "Da cosa vedi nel gioco che questo sta iniziando a consolidarsi?",
      fr: "Qu’est-ce que tu vois dans le jeu qui montre que cela commence à prendre ?",
    },
    sharpenPrompt: {
      nl: "Maak het wedstrijdsucces concreter: wat moet zichtbaar anders verlopen in het spel?",
      en: "Make in-game success more concrete: what should visibly unfold differently in the game?",
      de: "Mach den Erfolg im Spiel konkreter: Was soll im Spiel sichtbar anders verlaufen?",
      es: "Haz más concreto el éxito en el juego: ¿qué debería desarrollarse de forma visiblemente diferente?",
      it: "Rendi più concreto il successo in partita: cosa dovrebbe svilupparsi in modo visibilmente diverso nel gioco?",
      fr: "Rends la réussite en match plus concrète : qu’est-ce qui doit se dérouler visiblement différemment dans le jeu ?",
    },
  },
  {
    key: "successBehaviour",
    label: "Succes in gedrag",
    description:
      "Welk gedrag van de speler laat zien dat het ontwikkelpunt echt landt?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 15,
    questionPrompt: {
      nl: "Welk gedrag van de speler laat zien dat dit echt begint te landen?",
      en: "What player behaviour shows that this is truly starting to land?",
      de: "Welches Verhalten des Spielers zeigt, dass das wirklich beginnt zu greifen?",
      es: "¿Qué comportamiento del jugador muestra que esto realmente empieza a asentarse?",
      it: "Quale comportamento del giocatore mostra che questo sta davvero iniziando a consolidarsi?",
      fr: "Quel comportement du joueur montre que cela commence vraiment à prendre ?",
    },
    sharpenPrompt: {
      nl: "Maak dit observeerbaar: welk gedrag wil je letterlijk vaker terugzien?",
      en: "Make this observable: which behaviour do you literally want to see more often?",
      de: "Mach das beobachtbar: Welches Verhalten möchtest du buchstäblich häufiger sehen?",
      es: "Hazlo observable: ¿qué comportamiento quieres ver literalmente con más frecuencia?",
      it: "Rendilo osservabile: quale comportamento vuoi vedere letteralmente più spesso?",
      fr: "Rends cela observable : quel comportement veux-tu littéralement voir plus souvent ?",
    },
  },
  {
    key: "successSignals",
    label: "Eerste signalen",
    description:
      "Wat zijn vroege geloofwaardige signalen dat dit plan begint te werken?",
    slide: "success",
    requiredForFirstDraft: false,
    requiredForStrongDraft: true,
    priority: 16,
    questionPrompt: {
      nl: "Wat zijn vroege signalen dat dit plan begint te werken?",
      en: "What are early signals that this plan is starting to work?",
      de: "Was sind frühe Signale dafür, dass dieser Plan zu wirken beginnt?",
      es: "¿Cuáles son las primeras señales de que este plan empieza a funcionar?",
      it: "Quali sono i primi segnali che questo piano sta iniziando a funzionare?",
      fr: "Quels sont les premiers signaux que ce plan commence à fonctionner ?",
    },
    sharpenPrompt: {
      nl: "Maak de signalen geloofwaardig en klein: wat zie je eerder dan een volledige doorbraak?",
      en: "Make the signals credible and small: what do you see before a full breakthrough?",
      de: "Mach die Signale glaubwürdig und klein: Was siehst du schon vor einem vollständigen Durchbruch?",
      es: "Haz que las señales sean creíbles y pequeñas: ¿qué ves antes de un avance completo?",
      it: "Rendi i segnali credibili e piccoli: cosa vedi prima di una svolta completa?",
      fr: "Rends les signaux crédibles et modestes : qu’est-ce que tu vois avant une percée complète ?",
    },
  },
];

export type SlotStatus = {
  key: ChatSlotKey;
  filled: boolean;
};

export function getRequiredFirstDraftSlots() {
  return CHAT_SLOTS.filter((slot) => slot.requiredForFirstDraft).sort(
    (a, b) => a.priority - b.priority
  );
}

export function getRequiredStrongDraftSlots() {
  return CHAT_SLOTS.filter((slot) => slot.requiredForStrongDraft).sort(
    (a, b) => a.priority - b.priority
  );
}