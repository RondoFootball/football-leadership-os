import { DevelopmentPlanV1 } from "../lib/engineSchema";

/* ---------------- TYPES ---------------- */

type Lang = "nl" | "en";

/* ---------------- UI ---------------- */

const UI = {
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
    agreement: "agreement",
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
};

/* ---------------- MAIN ---------------- */

export function PlanReview({
  plan,
  lang = "nl",
}: {
  plan: DevelopmentPlanV1;
  lang?: Lang;
}) {
  const t = UI[lang];

  return (
    <div className="space-y-6">

      {/* ---------- SLIDE 2 ---------- */}
      <Slide title={t.agreement} accent>

        <BigText>
          {plan.slide2?.focusBehaviour}
        </BigText>

        <Divider />

        <Item label={t.behaviour}>
          {plan.slide2?.developmentGoal}
        </Item>

        <List label={t.moments} items={plan.slide2?.matchSituation} />
      </Slide>

      {/* ---------- SLIDE 3 ---------- */}
      <Slide title={t.context}>
        <Grid2>
          <List label={t.gameMoments} items={plan.slideContext?.gameMoments} />
          <List label={t.zones} items={plan.slideContext?.zones} />
        </Grid2>

        <Divider />

        <List label={t.principles} items={plan.slideContext?.principles} />
      </Slide>

      {/* ---------- SLIDE 4 ---------- */}
      <Slide title={t.reality}>
        <BigText small>
          {plan.slide3Baseline?.intro}
        </BigText>

        <Grid2>
          <List label={t.what} items={plan.slide3?.what_we_see?.items} />
          <List label={t.when} items={plan.slide3?.moment?.items} />
        </Grid2>

        <Divider />

        <List label={t.effect} items={plan.slide3?.effect_on_match?.items} />
      </Slide>

      {/* ---------- SLIDE 5 ---------- */}
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

      {/* ---------- SLIDE 6 ---------- */}
      <Slide title={t.success}>
        <Grid2>
          <List label={t.inGame} items={plan.slide6SuccessDefinition?.inGame} />
          <List label={t.behaviourShort} items={plan.slide6SuccessDefinition?.behaviour} />
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
    <div className="border border-white/10 rounded-2xl p-5 bg-white/5 space-y-4">
      <div className="flex items-center gap-3">
        {accent && (
          <div className="w-1.5 h-5 bg-white rounded-full opacity-80" />
        )}
        <div className="text-sm font-semibold tracking-wide opacity-80">
          {title}
        </div>
      </div>

      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {children}
    </div>
  );
}

function BigText({
  children,
  small = false,
}: {
  children?: React.ReactNode;
  small?: boolean;
}) {
  return (
    <div
      className={`${
        small ? "text-base" : "text-lg"
      } font-medium leading-snug`}
    >
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
      <div className="text-xs uppercase tracking-wide opacity-40 mb-1">
        {label}
      </div>
      <div className="text-sm leading-relaxed">
        {children || "—"}
      </div>
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
  const arr = Array.isArray(items)
    ? items
    : typeof items === "string"
    ? [items]
    : [];

  return (
    <div>
      <div className="text-xs uppercase tracking-wide opacity-40 mb-1">
        {label}
      </div>

      <div className="space-y-1 text-sm">
        {arr.length ? (
          arr.map((x, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-40">•</span>
              <span>{x}</span>
            </div>
          ))
        ) : (
          <div className="opacity-30">—</div>
        )}
      </div>
    </div>
  );
}