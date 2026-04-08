import React from "react";
import type { DevelopmentPlanV1, Lang } from "../lib/engineSchema";

/* ---------------- UI ---------------- */

const UI: Record<
  Lang,
  {
    agreement: string;
    context: string;
    reality: string;
    approach: string;
    success: string;

    focus: string;
    behaviour: string;
    moments: string;

    gameMoments: string;
    zones: string;
    principles: string;

    intro: string;
    what: string;
    when: string;
    effect: string;

    training: string;
    match: string;
    video: string;
    offField: string;

    inGame: string;
    behaviourShort: string;
    signals: string;
  }
> = {
  nl: {
    agreement: "Afspraak",
    context: "Context",
    reality: "Realiteit",
    approach: "Aanpak",
    success: "Succesdefinitie",

    focus: "Ontwikkelpunt",
    behaviour: "Gewenst gedrag",
    moments: "Wedstrijdmomenten",

    gameMoments: "Wanneer in het spel",
    zones: "Waar op het veld",
    principles: "Wat het team vraagt",

    intro: "Context",
    what: "Wat zien we",
    when: "Wanneer zien we dit",
    effect: "Effect op het spel",

    training: "Training",
    match: "Wedstrijd",
    video: "Video",
    offField: "Buiten het veld",

    inGame: "In het spel",
    behaviourShort: "In gedrag",
    signals: "Signalen",
  },

  en: {
    agreement: "Agreement",
    context: "Context",
    reality: "Reality",
    approach: "Approach",
    success: "Success definition",

    focus: "Development point",
    behaviour: "Target behaviour",
    moments: "Match moments",

    gameMoments: "When in the game",
    zones: "Where on the pitch",
    principles: "What the team requires",

    intro: "Context",
    what: "What we see",
    when: "When we see this",
    effect: "Effect on the game",

    training: "Training",
    match: "Match",
    video: "Video",
    offField: "Off field",

    inGame: "In the game",
    behaviourShort: "In behaviour",
    signals: "Signals",
  },

  de: {
    agreement: "Vereinbarung",
    context: "Kontext",
    reality: "Realität",
    approach: "Ansatz",
    success: "Erfolgsdefinition",

    focus: "Entwicklungspunkt",
    behaviour: "Zielverhalten",
    moments: "Spielmomente",

    gameMoments: "Wann im Spiel",
    zones: "Wo auf dem Feld",
    principles: "Was das Team verlangt",

    intro: "Kontext",
    what: "Was wir sehen",
    when: "Wann wir das sehen",
    effect: "Auswirkung auf das Spiel",

    training: "Training",
    match: "Spiel",
    video: "Video",
    offField: "Außerhalb des Feldes",

    inGame: "Im Spiel",
    behaviourShort: "Im Verhalten",
    signals: "Signale",
  },

  es: {
    agreement: "Acuerdo",
    context: "Contexto",
    reality: "Realidad",
    approach: "Enfoque",
    success: "Definición de éxito",

    focus: "Punto de desarrollo",
    behaviour: "Conducta objetivo",
    moments: "Momentos de partido",

    gameMoments: "Cuándo en el juego",
    zones: "Dónde en el campo",
    principles: "Qué exige el equipo",

    intro: "Contexto",
    what: "Qué vemos",
    when: "Cuándo vemos esto",
    effect: "Efecto en el juego",

    training: "Entrenamiento",
    match: "Partido",
    video: "Vídeo",
    offField: "Fuera del campo",

    inGame: "En el juego",
    behaviourShort: "En la conducta",
    signals: "Señales",
  },

  it: {
    agreement: "Accordo",
    context: "Contesto",
    reality: "Realtà",
    approach: "Approccio",
    success: "Definizione del successo",

    focus: "Punto di sviluppo",
    behaviour: "Comportamento obiettivo",
    moments: "Momenti di partita",

    gameMoments: "Quando nel gioco",
    zones: "Dove in campo",
    principles: "Cosa richiede la squadra",

    intro: "Contesto",
    what: "Cosa vediamo",
    when: "Quando lo vediamo",
    effect: "Effetto sul gioco",

    training: "Allenamento",
    match: "Partita",
    video: "Video",
    offField: "Fuori dal campo",

    inGame: "Nel gioco",
    behaviourShort: "Nel comportamento",
    signals: "Segnali",
  },

  fr: {
    agreement: "Accord",
    context: "Contexte",
    reality: "Réalité",
    approach: "Approche",
    success: "Définition de la réussite",

    focus: "Point de développement",
    behaviour: "Comportement cible",
    moments: "Moments de match",

    gameMoments: "Quand dans le jeu",
    zones: "Où sur le terrain",
    principles: "Ce que l’équipe demande",

    intro: "Contexte",
    what: "Ce que l’on voit",
    when: "Quand on voit cela",
    effect: "Effet sur le jeu",

    training: "Entraînement",
    match: "Match",
    video: "Vidéo",
    offField: "Hors terrain",

    inGame: "Dans le jeu",
    behaviourShort: "Dans le comportement",
    signals: "Signaux",
  },
};

/* ---------------- HELPERS ---------------- */

function isSupportedLang(value: unknown): value is Lang {
  return (
    value === "nl" ||
    value === "en" ||
    value === "de" ||
    value === "es" ||
    value === "it" ||
    value === "fr"
  );
}

function normalizeList(items?: string[] | string): string[] {
  if (Array.isArray(items)) {
    return items.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof items === "string") {
    const value = items.trim();
    return value ? [value] : [];
  }

  return [];
}

/* ---------------- MAIN ---------------- */

export function PlanReview({
  plan,
  lang = "nl",
}: {
  plan: DevelopmentPlanV1;
  lang?: Lang;
}) {
  const safeLang: Lang = isSupportedLang(lang) ? lang : "nl";
  const t = UI[safeLang];

  return (
    <div className="space-y-6">
      <Slide title={t.agreement} accent>
        <BigText>{plan.slide2?.focusBehaviour}</BigText>

        <Divider />

        <Item label={t.behaviour}>{plan.slide2?.developmentGoal}</Item>

        <List label={t.moments} items={plan.slide2?.matchSituation} />
      </Slide>

      <Slide title={t.context}>
        <Grid2>
          <List label={t.gameMoments} items={plan.slideContext?.gameMoments} />
          <List label={t.zones} items={plan.slideContext?.zones} />
        </Grid2>

        <Divider />

        <List label={t.principles} items={plan.slideContext?.principles} />
      </Slide>

      <Slide title={t.reality}>
        <BigText small>{plan.slide3Baseline?.intro}</BigText>

        <Grid2>
          <List label={t.what} items={plan.slide3?.what_we_see?.items} />
          <List label={t.when} items={plan.slide3?.moment?.items} />
        </Grid2>

        <Divider />

        <List label={t.effect} items={plan.slide3?.effect_on_match?.items} />
      </Slide>

      <Slide title={t.approach}>
        <Grid2>
          <Item label={t.training}>
            {plan.slide4DevelopmentRoute?.developmentRoute?.training}
          </Item>

          <Item label={t.match}>
            {plan.slide4DevelopmentRoute?.developmentRoute?.match}
          </Item>

          <Item label={t.video}>
            {plan.slide4DevelopmentRoute?.developmentRoute?.video}
          </Item>

          <Item label={t.offField}>
            {plan.slide4DevelopmentRoute?.developmentRoute?.off_field}
          </Item>
        </Grid2>
      </Slide>

      <Slide title={t.success}>
        <Grid2>
          <List
            label={t.inGame}
            items={plan.slide6SuccessDefinition?.inGame}
          />
          <List
            label={t.behaviourShort}
            items={plan.slide6SuccessDefinition?.behaviour}
          />
        </Grid2>

        <Divider />

        <List label={t.signals} items={plan.slide6SuccessDefinition?.signals} />
      </Slide>
    </div>
  );
}

/* ---------------- UI COMPONENTS ---------------- */

function Slide({
  title,
  children,
  accent = false,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        {accent ? (
          <div className="h-5 w-1.5 rounded-full bg-white opacity-80" />
        ) : null}

        <div className="text-sm font-semibold tracking-wide opacity-80">
          {title}
        </div>
      </div>

      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function BigText({
  children,
  small = false,
}: {
  children?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div className={`${small ? "text-base" : "text-lg"} font-medium leading-snug`}>
      {children || "—"}
    </div>
  );
}

function Divider() {
  return <div className="border-t border-white/10" />;
}

function Item({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wide opacity-40">
        {label}
      </div>
      <div className="text-sm leading-relaxed">{children || "—"}</div>
    </div>
  );
}

function List({
  label,
  items,
}: {
  label: string;
  items?: string[] | string;
}) {
  const normalizedItems = normalizeList(items);

  return (
    <div>
      <div className="mb-1 text-xs uppercase tracking-wide opacity-40">
        {label}
      </div>

      <div className="space-y-1 text-sm">
        {normalizedItems.length ? (
          normalizedItems.map((item, index) => (
            <div key={`${label}-${index}`} className="flex gap-2">
              <span className="opacity-40">•</span>
              <span>{item}</span>
            </div>
          ))
        ) : (
          <div className="opacity-30">—</div>
        )}
      </div>
    </div>
  );
}