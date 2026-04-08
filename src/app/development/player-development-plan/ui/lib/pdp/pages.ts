// src/app/development/player-development-plan/ui/lib/pdp/pages.ts
import { slideLabel, sectionLabel } from "./pdpLabels";

export type Lang = "nl" | "en" | "de" | "es" | "it" | "fr";

export type Slide3VideoSlot = {
  status: "active" | "pending";
  title?: string;
  match_or_session?: string;
  timestamp?: string;
  source?: "match" | "training";
  url?: string | null;
  thumbnail_url?: string | null;
  pendingTitle?: string;
  pendingSub?: string;
};

function esc(input: unknown) {
  const s = String(input ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function tx(lang: Lang, values: Record<Lang, string>) {
  return values[lang] || values.en;
}

function safeText(input: unknown) {
  return String(input ?? "").trim();
}

function notEmpty(items: unknown[]) {
  return items
    .map((x) => safeText(x))
    .filter(Boolean);
}

/** ---------------- SLIDE 2 — AGREEMENT / DEVELOPMENT POINT ---------------- */
export function pageAgreementContract(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;

  startDateLabel: string;
  endDateLabel: string;
  durationWeeksLabel: string;
  evalLabel?: string;

  focusBehaviour: string;
  targetBehaviour?: string;
  matchSituation: string | string[];
}) {
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
    startDateLabel,
    endDateLabel,
    durationWeeksLabel,
    evalLabel,
    focusBehaviour,
    targetBehaviour,
    matchSituation,
  } = args;

  const safeLogo = safeText(logoUrl);
  const safeFocus = safeText(focusBehaviour);
  const safeTarget = safeText(targetBehaviour);

  const fallbackFocus = tx(lang, {
    nl: "Nog geen ontwikkelpunt geformuleerd",
    en: "No development point defined yet",
    de: "Noch kein Entwicklungspunkt formuliert",
    es: "Aún no se ha definido un punto de desarrollo",
    it: "Nessun punto di sviluppo ancora definito",
    fr: "Aucun point de développement encore défini",
  });

  const fallbackTarget = tx(lang, {
    nl: "Nog geen gewenst gedrag toegevoegd",
    en: "No target behaviour added yet",
    de: "Noch kein Zielverhalten hinzugefügt",
    es: "Aún no se ha añadido la conducta objetivo",
    it: "Nessun comportamento obiettivo ancora aggiunto",
    fr: "Aucun comportement cible encore ajouté",
  });

  const fallbackMoment = tx(lang, {
    nl: "Nog geen wedstrijdmoment toegevoegd",
    en: "No match moment added yet",
    de: "Noch kein Spielmoment hinzugefügt",
    es: "Aún no se ha añadido un momento de partido",
    it: "Nessun momento di partita ancora aggiunto",
    fr: "Aucun moment de match encore ajouté",
  });

  const safeStart = safeText(startDateLabel) || "—";
  const safeEnd = safeText(endDateLabel) || "—";
  const safeDuration = safeText(durationWeeksLabel) || "—";
  const safeEval = safeText(evalLabel) || sectionLabel("evaluation", lang);

  const normalizeItems = (input: string | string[] | undefined | null) => {
    if (Array.isArray(input)) {
      return input
        .map((x) => safeText(x))
        .filter(Boolean)
        .slice(0, 3);
    }

    return String(input || "")
      .split(/\r?\n|;|•/g)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 3);
  };

  const matchMoments = normalizeItems(matchSituation);
  const focusText = safeFocus || fallbackFocus;
  const targetText = safeTarget || fallbackTarget;
  const heroSub =
    matchMoments[0] ||
    safeTarget ||
    tx(lang, {
      nl: "Maak scherp wat de speler anders moet gaan doen.",
      en: "Clarify what the player needs to start doing differently.",
      de: "Mache klar, was der Spieler anders machen muss.",
      es: "Aclara qué debe empezar a hacer diferente el jugador.",
      it: "Chiarisci che cosa il giocatore deve iniziare a fare diversamente.",
      fr: "Clarifie ce que le joueur doit commencer à faire différemment.",
    });

  const wmHtml = safeLogo
    ? `
      <div class="agreeS2__wm" aria-hidden="true">
        <img src="${esc(safeLogo)}" alt="${esc(clubName)} watermark" />
      </div>
    `
    : "";

  const renderMomentList = () => {
    const list = matchMoments.length ? matchMoments : [fallbackMoment];

    return `
      <ul class="agreeS2__miniList">
        ${list
          .map(
            (item) => `
              <li class="agreeS2__miniItem ${
                matchMoments.length ? "" : "agreeS2__miniItem--empty"
              }">
                <span class="agreeS2__miniBullet"></span>
                <span>${esc(item)}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    `;
  };

  return `
<section class="page agreeS2" style="--accent:${esc(accentHex)};">
  ${wmHtml}

  <div class="agreeS2__bg" aria-hidden="true"></div>
  <div class="agreeS2__vignette" aria-hidden="true"></div>
  <div class="agreeS2__gridFx" aria-hidden="true"></div>
  <div class="agreeS2__rail" aria-hidden="true"></div>

  <div class="agreeS2__header">
    <div class="agreeS2__kicker">${esc(slideLabel("agreement", lang))}</div>

    <div class="agreeS2__hero">
      <div class="agreeS2__headline ${safeFocus ? "" : "agreeS2__headline--empty"}">
        ${esc(focusText)}
      </div>
      <div class="agreeS2__headlineSub">
        ${esc(heroSub)}
      </div>
    </div>
  </div>

  <div class="agreeS2__primary">
    <div class="agreeS2__sectionLabel">${esc(
      sectionLabel("targetBehaviour", lang)
    )}</div>

    <div class="agreeS2__targetWrap">
      <div class="agreeS2__targetRail"></div>
      <div class="agreeS2__targetText ${safeTarget ? "" : "agreeS2__targetText--empty"}">
        ${esc(targetText)}
      </div>
    </div>
  </div>

  <div class="agreeS2__secondary">
    <div class="agreeS2__secondaryBlock">
      <div class="agreeS2__sectionLabel">${esc(
        sectionLabel("whereVisible", lang)
      )}</div>
      ${renderMomentList()}
    </div>
  </div>

  <div class="agreeS2__timeline">
    <div class="agreeS2__timelineLine"></div>
    <div class="agreeS2__timelineGlow"></div>
    <div class="agreeS2__timelineMarker agreeS2__timelineMarker--start"></div>
    <div class="agreeS2__timelineMarker agreeS2__timelineMarker--end"></div>

    <div class="agreeS2__timelineGrid">
      <div class="agreeS2__timelineCol agreeS2__timelineCol--left">
        <div class="agreeS2__timelineLabel">${esc(tx(lang, {
          nl: "START",
          en: "START",
          de: "START",
          es: "INICIO",
          it: "INIZIO",
          fr: "DÉBUT",
        }))}</div>
        <div class="agreeS2__timelineValue">${esc(safeStart)}</div>
      </div>

      <div class="agreeS2__timelineCol agreeS2__timelineCol--center">
        <div class="agreeS2__timelineLabel">${esc(
          tx(lang, {
            nl: "FOCUSPERIODE",
            en: "FOCUS PERIOD",
            de: "FOKUSPHASE",
            es: "PERIODO DE FOCO",
            it: "PERIODO DI FOCUS",
            fr: "PÉRIODE DE FOCUS",
          })
        )}</div>
        <div class="agreeS2__timelineValue agreeS2__timelineValue--strong">
          ${esc(safeDuration)}
        </div>
      </div>

      <div class="agreeS2__timelineCol agreeS2__timelineCol--right">
        <div class="agreeS2__timelineLabel">${esc(safeEval.toUpperCase())}</div>
        <div class="agreeS2__timelineValue">${esc(safeEnd)}</div>
      </div>
    </div>
  </div>

  <style>
    .agreeS2{
      position:relative;
      height:100%;
      overflow:hidden;
      border-radius:18px;
      background:#07090C;
      color:#FFFFFF;
      font-family:"SF Pro Display","Inter",Arial,sans-serif;
    }

    .agreeS2 *{
      box-sizing:border-box;
    }

    .agreeS2__wm{
      position:absolute;
      right:8mm;
      top:18mm;
      width:96mm;
      height:96mm;
      opacity:.045;
      z-index:1;
      pointer-events:none;
      filter:grayscale(1) blur(.04px);
      transform:rotate(-8deg);
      mix-blend-mode:screen;
    }

    .agreeS2__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
      opacity:.92;
    }

    .agreeS2__bg{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 10% 14%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 24%),
        radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 18%),
        linear-gradient(180deg, rgba(255,255,255,.006) 0%, rgba(255,255,255,0) 22%),
        #07090C;
      z-index:0;
      pointer-events:none;
    }

    .agreeS2__bg::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 18% 76%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 34%),
        radial-gradient(circle at 72% 84%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 26%);
      opacity:.26;
      pointer-events:none;
    }

    .agreeS2__vignette{
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, transparent 58%, rgba(0,0,0,.16) 100%);
      z-index:0;
      pointer-events:none;
    }

    .agreeS2__gridFx{
      position:absolute;
      inset:0;
      opacity:.004;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:6px 6px, 6px 6px;
      z-index:0;
      pointer-events:none;
    }

    .agreeS2__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 88%, #fff 2%) 0%,
        color-mix(in srgb, var(--accent) 42%, transparent) 56%,
        transparent 100%
      );
      box-shadow:
        0 0 12px color-mix(in srgb, var(--accent) 18%, transparent),
        0 0 26px color-mix(in srgb, var(--accent) 8%, transparent);
      opacity:.96;
      z-index:1;
    }

    .agreeS2__header{
      position:absolute;
      left:28mm;
      right:18mm;
      top:18mm;
      z-index:2;
    }

    .agreeS2__kicker{
      font-size:9pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:rgba(255,255,255,.48);
      white-space:nowrap;
    }

    .agreeS2__hero{
      margin-top:7px;
      padding-bottom:10px;
      border-bottom:1px solid rgba(255,255,255,.045);
      max-width:96%;
    }

    .agreeS2__headline{
      max-width:100%;
      font-size:29pt;
      line-height:.96;
      letter-spacing:-.065em;
      font-weight:820;
      color:#FFFFFF;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .agreeS2__headline--empty{
      color:rgba(255,255,255,.82);
    }

    .agreeS2__headlineSub{
      margin-top:8px;
      max-width:98%;
      font-size:12.4pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .agreeS2__sectionLabel{
      font-size:8.3pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.36);
      white-space:nowrap;
    }

    .agreeS2__primary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:72mm;
      z-index:2;
    }

    .agreeS2__targetWrap{
      margin-top:10px;
      display:flex;
      align-items:flex-start;
      gap:10px;
      max-width:82%;
    }

    .agreeS2__targetRail{
      width:2px;
      min-height:34mm;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 58%, rgba(255,255,255,.18)) 0%,
        color-mix(in srgb, var(--accent) 14%, transparent) 100%
      );
      box-shadow:0 0 10px color-mix(in srgb, var(--accent) 14%, transparent);
      flex:0 0 auto;
      opacity:.95;
    }

    .agreeS2__targetText{
      font-size:15.6pt;
      line-height:1.24;
      letter-spacing:-.018em;
      font-weight:620;
      color:rgba(255,255,255,.90);
      min-width:0;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .agreeS2__targetText--empty{
      color:rgba(255,255,255,.52);
      font-weight:500;
    }

    .agreeS2__secondary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:144mm;
      z-index:2;
      padding-top:10px;
      border-top:1px solid rgba(255,255,255,.045);
    }

    .agreeS2__secondaryBlock{
      min-width:0;
      max-width:70%;
    }

    .agreeS2__miniList{
      list-style:none;
      margin:9px 0 0 0;
      padding:0;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .agreeS2__miniItem{
      display:flex;
      align-items:flex-start;
      gap:8px;
    }

    .agreeS2__miniItem--empty span:last-child{
      color:rgba(255,255,255,.48);
      font-weight:500;
    }

    .agreeS2__miniBullet{
      width:5px;
      height:5px;
      margin-top:6px;
      border-radius:999px;
      background:color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,.22));
      flex:0 0 auto;
    }

    .agreeS2__miniItem span:last-child{
      font-size:11.4pt;
      line-height:1.3;
      font-weight:520;
      color:rgba(255,255,255,.72);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .agreeS2__timeline{
      position:absolute;
      left:28mm;
      right:18mm;
      bottom:16mm;
      z-index:2;
      padding-top:8px;
    }

    .agreeS2__timelineLine{
      position:absolute;
      left:0;
      right:0;
      top:0;
      height:1px;
      background:linear-gradient(
        90deg,
        rgba(255,255,255,.14) 0%,
        rgba(255,255,255,.06) 100%
      );
    }

    .agreeS2__timelineGlow{
      position:absolute;
      left:0;
      top:0;
      width:34%;
      height:2px;
      border-radius:999px;
      background:linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent) 84%, #ffffff 10%) 0%,
        color-mix(in srgb, var(--accent) 10%, transparent) 100%
      );
      opacity:.62;
    }

    .agreeS2__timelineMarker{
      position:absolute;
      top:-1.5px;
      width:4px;
      height:4px;
      border-radius:999px;
      background:var(--accent);
      box-shadow:0 0 10px color-mix(in srgb, var(--accent) 18%, transparent);
    }

    .agreeS2__timelineMarker--start{
      left:0;
    }

    .agreeS2__timelineMarker--end{
      right:0;
      opacity:.9;
    }

    .agreeS2__timelineGrid{
      position:relative;
      margin-top:7mm;
      display:grid;
      grid-template-columns:1fr auto 1fr;
      align-items:start;
      gap:14px;
    }

    .agreeS2__timelineCol{
      display:flex;
      flex-direction:column;
      gap:5px;
      min-width:0;
    }

    .agreeS2__timelineCol--left{
      align-items:flex-start;
      text-align:left;
    }

    .agreeS2__timelineCol--center{
      align-items:center;
      text-align:center;
    }

    .agreeS2__timelineCol--right{
      align-items:flex-end;
      text-align:right;
    }

    .agreeS2__timelineLabel{
      font-size:8.1pt;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:rgba(255,255,255,.42);
      font-weight:720;
      white-space:nowrap;
      line-height:1.1;
    }

    .agreeS2__timelineValue{
      font-size:10.8pt;
      line-height:1.1;
      letter-spacing:.05em;
      text-transform:uppercase;
      color:rgba(255,255,255,.84);
      font-weight:640;
      white-space:nowrap;
    }

    .agreeS2__timelineValue--strong{
      font-size:13pt;
      letter-spacing:.22em;
      color:#fff;
      font-weight:860;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 3 — CONTEXT ---------------- */
export function pageContext(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;

  gameMoments: string[];
  zones: string[];
  principles: string[];
}) {
  const { lang, accentHex, clubName, logoUrl, gameMoments, zones, principles } =
    args;

  const safeLogo = safeText(logoUrl);

  const roleItems = notEmpty(gameMoments).slice(0, 3);
  const zoneItems = notEmpty(zones).slice(0, 3);
  const principleItems = notEmpty(principles).slice(0, 6);

  const fallbackHero = tx(lang, {
    nl: "Wat de rol in deze context vraagt",
    en: "What the role requires in this context",
    de: "Was die Rolle in diesem Kontext verlangt",
    es: "Lo que exige el rol en este contexto",
    it: "Ciò che il ruolo richiede in questo contesto",
    fr: "Ce que le rôle exige dans ce contexte",
  });

  const fallbackSub = tx(lang, {
    nl: "Maak zichtbaar in welke spelmomenten, ruimtes en principes dit ontwikkelpunt betekenis krijgt.",
    en: "Clarify in which moments, spaces and principles this development point becomes meaningful.",
    de: "Mache sichtbar, in welchen Spielmomenten, Räumen und Prinzipien dieser Entwicklungspunkt Bedeutung bekommt.",
    es: "Aclara en qué momentos, espacios y principios este punto de desarrollo adquiere sentido.",
    it: "Rendi chiaro in quali momenti, spazi e principi questo punto di sviluppo acquista significato.",
    fr: "Clarifie dans quels moments, espaces et principes ce point de développement prend du sens.",
  });

  const fallbackMoment = tx(lang, {
    nl: "Nog geen spelmoment toegevoegd",
    en: "No game moment added yet",
    de: "Noch kein Spielmoment hinzugefügt",
    es: "Aún no se ha añadido un momento de juego",
    it: "Nessun momento di gioco ancora aggiunto",
    fr: "Aucun moment de jeu encore ajouté",
  });

  const fallbackZone = tx(lang, {
    nl: "Nog geen zone of context toegevoegd",
    en: "No zone or context added yet",
    de: "Noch keine Zone oder kein Kontext hinzugefügt",
    es: "Aún no se ha añadido una zona o contexto",
    it: "Nessuna zona o contesto ancora aggiunto",
    fr: "Aucune zone ou contexte encore ajouté",
  });

  const fallbackPrinciple = tx(lang, {
    nl: "Nog geen principe toegevoegd",
    en: "No principle added yet",
    de: "Noch kein Prinzip hinzugefügt",
    es: "Aún no se ha añadido un principio",
    it: "Nessun principio ancora aggiunto",
    fr: "Aucun principe encore ajouté",
  });

  const heroPrimary = principleItems[0] || roleItems[0] || fallbackHero;
  const heroSecondary = zoneItems[0] || fallbackSub;

  const wmHtml = safeLogo
    ? `
      <div class="contextS3__wm" aria-hidden="true">
        <img src="${esc(safeLogo)}" alt="${esc(clubName)} watermark" />
      </div>
    `
    : "";

  const renderMiniList = (
    items: string[],
    fallback: string,
    variant: "moment" | "zone"
  ) => {
    const list = items.length ? items : [fallback];

    return `
      <ul class="contextS3__miniList contextS3__miniList--${variant}">
        ${list
          .map(
            (item) => `
              <li class="contextS3__miniItem contextS3__miniItem--${variant} ${
                items.length ? "" : "contextS3__miniItem--empty"
              }">
                <span class="contextS3__miniBullet"></span>
                <span>${esc(item)}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    `;
  };

  const renderPrinciples = () => {
    const list = principleItems.length ? principleItems : [fallbackPrinciple];

    return list
      .map(
        (item, index) => `
          <div class="contextS3__principleItem ${
            index === 0 && principleItems.length
              ? "contextS3__principleItem--lead"
              : ""
          } ${principleItems.length ? "" : "contextS3__principleItem--empty"}">
            <span class="contextS3__principleDot"></span>
            <span class="contextS3__principleText">${esc(item)}</span>
          </div>
        `
      )
      .join("");
  };

  return `
<section class="page contextS3" style="--accent:${esc(accentHex)};">
  ${wmHtml}

  <div class="contextS3__bg" aria-hidden="true"></div>
  <div class="contextS3__vignette" aria-hidden="true"></div>
  <div class="contextS3__gridFx" aria-hidden="true"></div>
  <div class="contextS3__rail" aria-hidden="true"></div>

  <div class="contextS3__header">
    <div class="contextS3__kicker">${esc(
      slideLabel("role_context", lang)
    )}</div>

    <div class="contextS3__hero">
      <div class="contextS3__headline ${
        principleItems.length || roleItems.length ? "" : "contextS3__headline--empty"
      }">${esc(heroPrimary)}</div>
      <div class="contextS3__headlineSub">${esc(heroSecondary)}</div>
    </div>
  </div>

  <div class="contextS3__secondary">
    <div class="contextS3__secondaryBlock contextS3__secondaryBlock--moment">
      <div class="contextS3__sectionLabel">${esc(
        sectionLabel("gameMoments", lang)
      )}</div>
      ${renderMiniList(roleItems, fallbackMoment, "moment")}
    </div>

    <div class="contextS3__secondaryBlock contextS3__secondaryBlock--zone">
      <div class="contextS3__sectionLabel">${esc(
        sectionLabel("zones", lang)
      )}</div>
      ${renderMiniList(zoneItems, fallbackZone, "zone")}
    </div>
  </div>

  <div class="contextS3__primary">
    <div class="contextS3__sectionLabel">${esc(
      sectionLabel("principles", lang)
    )}</div>

    <div class="contextS3__principles">
      ${renderPrinciples()}
    </div>
  </div>

  <div class="contextS3__footerNote">
    <div class="contextS3__footerLine"></div>
    <div class="contextS3__footerText">
      ${esc(
        tx(lang, {
          nl: "Deze slide maakt duidelijk binnen welke rolcontext dit ontwikkelpunt betekenis krijgt.",
          en: "This slide clarifies the role context in which this development point becomes meaningful.",
          de: "Diese Folie macht deutlich, in welchem Rollenkontext dieser Entwicklungspunkt Bedeutung bekommt.",
          es: "Esta diapositiva aclara en qué contexto de rol este punto de desarrollo adquiere significado.",
          it: "Questa slide chiarisce in quale contesto di ruolo questo punto di sviluppo acquista significato.",
          fr: "Cette diapositive clarifie dans quel contexte de rôle ce point de développement prend du sens.",
        })
      )}
    </div>
  </div>

  <style>
    .contextS3{
      position:relative;
      height:100%;
      overflow:hidden;
      border-radius:18px;
      background:#07090C;
      color:#FFFFFF;
      font-family:"SF Pro Display","Inter",Arial,sans-serif;
    }

    .contextS3 *{
      box-sizing:border-box;
    }

    .contextS3__wm{
      position:absolute;
      left:-8mm;
      bottom:18mm;
      width:102mm;
      height:102mm;
      opacity:.042;
      z-index:1;
      pointer-events:none;
      filter:grayscale(1) blur(.04px);
      transform:rotate(8deg);
      mix-blend-mode:screen;
    }

    .contextS3__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
      opacity:.92;
    }

    .contextS3__bg{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 10% 16%, color-mix(in srgb, var(--accent) 9%, transparent) 0%, transparent 24%),
        radial-gradient(circle at 84% 14%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 18%),
        linear-gradient(180deg, rgba(255,255,255,.006) 0%, rgba(255,255,255,0) 22%),
        #07090C;
      z-index:0;
      pointer-events:none;
    }

    .contextS3__bg::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 18% 78%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 34%),
        radial-gradient(circle at 76% 76%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 24%);
      opacity:.24;
      pointer-events:none;
    }

    .contextS3__vignette{
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, transparent 58%, rgba(0,0,0,.16) 100%);
      z-index:0;
      pointer-events:none;
    }

    .contextS3__gridFx{
      position:absolute;
      inset:0;
      opacity:.004;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:6px 6px, 6px 6px;
      z-index:0;
      pointer-events:none;
    }

    .contextS3__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 88%, #fff 2%) 0%,
        color-mix(in srgb, var(--accent) 42%, transparent) 56%,
        transparent 100%
      );
      box-shadow:
        0 0 12px color-mix(in srgb, var(--accent) 18%, transparent),
        0 0 26px color-mix(in srgb, var(--accent) 8%, transparent);
      opacity:.96;
      z-index:1;
    }

    .contextS3__header{
      position:absolute;
      left:28mm;
      right:18mm;
      top:18mm;
      z-index:2;
    }

    .contextS3__kicker{
      font-size:9pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:rgba(255,255,255,.48);
      white-space:nowrap;
    }

    .contextS3__hero{
      margin-top:7px;
      padding-bottom:10px;
      border-bottom:1px solid rgba(255,255,255,.045);
      max-width:96%;
    }

    .contextS3__headline{
      max-width:100%;
      font-size:28.5pt;
      line-height:.97;
      letter-spacing:-.062em;
      font-weight:820;
      color:#FFFFFF;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .contextS3__headline--empty{
      color:rgba(255,255,255,.82);
    }

    .contextS3__headlineSub{
      margin-top:8px;
      max-width:98%;
      font-size:12.4pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .contextS3__sectionLabel{
      font-size:8.3pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.36);
      white-space:nowrap;
    }

    .contextS3__secondary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:76mm;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12mm;
      z-index:2;
      padding-top:10px;
      border-top:1px solid rgba(255,255,255,.045);
    }

    .contextS3__secondaryBlock{
      min-width:0;
    }

    .contextS3__miniList{
      list-style:none;
      margin:9px 0 0 0;
      padding:0;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .contextS3__miniItem{
      display:flex;
      align-items:flex-start;
      gap:8px;
    }

    .contextS3__miniItem--empty span:last-child{
      color:rgba(255,255,255,.48);
      font-weight:500;
    }

    .contextS3__miniBullet{
      width:5px;
      height:5px;
      margin-top:6px;
      border-radius:999px;
      background:color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,.22));
      flex:0 0 auto;
    }

    .contextS3__miniItem span:last-child{
      font-size:11.2pt;
      line-height:1.3;
      font-weight:520;
      color:rgba(255,255,255,.70);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .contextS3__primary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:138mm;
      bottom:34mm;
      z-index:2;
      padding-top:10px;
      border-top:1px solid rgba(255,255,255,.045);
    }

    .contextS3__principles{
      margin-top:10px;
      display:flex;
      flex-direction:column;
      gap:10px;
      max-width:82%;
    }

    .contextS3__principleItem{
      display:flex;
      align-items:flex-start;
      gap:10px;
    }

    .contextS3__principleItem--empty .contextS3__principleText{
      color:rgba(255,255,255,.52);
      font-weight:500;
    }

    .contextS3__principleDot{
      width:8px;
      height:8px;
      margin-top:8px;
      border-radius:999px;
      background:var(--accent);
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent),
        0 0 7px color-mix(in srgb, var(--accent) 12%, transparent);
      flex:0 0 auto;
    }

    .contextS3__principleText{
      font-size:15.2pt;
      line-height:1.24;
      letter-spacing:-.018em;
      font-weight:620;
      color:rgba(255,255,255,.88);
      min-width:0;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .contextS3__principleItem--lead .contextS3__principleText{
      font-size:16.8pt;
      line-height:1.16;
      color:#FFFFFF;
      font-weight:680;
    }

    .contextS3__footerNote{
      position:absolute;
      left:28mm;
      right:18mm;
      bottom:16mm;
      z-index:2;
    }

    .contextS3__footerLine{
      width:100%;
      height:1px;
      background:linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent) 30%, rgba(255,255,255,.10)) 0%,
        rgba(255,255,255,.04) 100%
      );
    }

    .contextS3__footerText{
      margin-top:8px;
      max-width:78%;
      font-size:9.6pt;
      line-height:1.3;
      letter-spacing:-.01em;
      color:rgba(255,255,255,.42);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 4 — DIAGNOSIS / REALITY ---------------- */
export function pageDiagnosis(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;
  playerName?: string;

  title: string;
  subtitle: string;
  intro: string;

  metricName: string;
  metricDefinition: string;
  currentValue: string;
  targetValue: string;
  progressPct01: number;
  startDateLabel: string;
  endDateLabel: string;

  momentItems: string[];
  whatWeSeeItems: string[];
  effectItems: string[];

  videoSlots: Slide3VideoSlot[];
}) {
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
    momentItems,
    whatWeSeeItems,
    effectItems,
    videoSlots,
  } = args;

  const observations = notEmpty(whatWeSeeItems).slice(0, 4);
  const contexts = notEmpty(momentItems).slice(0, 3);
  const effects = notEmpty(effectItems).slice(0, 3);

  const fallbackObservation = tx(lang, {
    nl: "Nog geen observatie toegevoegd",
    en: "No observation added yet",
    de: "Noch keine Beobachtung hinzugefügt",
    es: "Aún no se ha añadido una observación",
    it: "Nessuna osservazione ancora aggiunta",
    fr: "Aucune observation encore ajoutée",
  });

  const fallbackContext = tx(lang, {
    nl: "Nog geen context toegevoegd",
    en: "No context added yet",
    de: "Noch kein Kontext hinzugefügt",
    es: "Aún no se ha añadido un contexto",
    it: "Nessun contesto ancora aggiunto",
    fr: "Aucun contexte encore ajouté",
  });

  const fallbackEffect = tx(lang, {
    nl: "Nog geen effect toegevoegd",
    en: "No effect added yet",
    de: "Noch kein Effekt hinzugefügt",
    es: "Aún no se ha añadido un efecto",
    it: "Nessun effetto ancora aggiunto",
    fr: "Aucun effet encore ajouté",
  });

  const heroPrimary = observations[0] || fallbackObservation;
  const heroSecondary = effects[0] || fallbackEffect;

  const safeLogo = safeText(logoUrl);
  const wmHtml = safeLogo
    ? `
      <div class="truthS4__wm" aria-hidden="true">
        <img src="${esc(safeLogo)}" alt="${esc(clubName)} watermark" />
      </div>
    `
    : "";

  const videos = [...(videoSlots || []).slice(0, 3)];
  while (videos.length < 3) videos.push({ status: "pending" });

  const videoMetaLine = (slot: Slide3VideoSlot) => {
    const parts = [safeText(slot.match_or_session), safeText(slot.timestamp)].filter(
      Boolean
    );
    return parts.length ? parts.join(" • ") : "";
  };

  const renderObservationList = (items: string[]) => {
    const list = items.length ? items : [fallbackObservation];

    return list
      .map(
        (item, index) => `
          <div class="truthS4__obsItem ${index === 0 ? "truthS4__obsItem--lead" : ""}">
            <span class="truthS4__obsDot"></span>
            <span class="truthS4__obsText">${esc(item)}</span>
          </div>
        `
      )
      .join("");
  };

  const renderMiniList = (
    items: string[],
    fallback: string,
    variant: "context" | "effect"
  ) => {
    const list = items.length ? items : [fallback];

    return `
      <ul class="truthS4__miniList truthS4__miniList--${variant}">
        ${list
          .map(
            (item) => `
              <li class="truthS4__miniItem truthS4__miniItem--${variant}">
                <span class="truthS4__miniBullet"></span>
                <span>${esc(item)}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    `;
  };

  const videoCard = (slot: Slide3VideoSlot, variant: "hero" | "small") => {
    const title =
      slot.status === "active"
        ? slot.title || tx(lang, {
            nl: "Video",
            en: "Video",
            de: "Video",
            es: "Vídeo",
            it: "Video",
            fr: "Vidéo",
          })
        : "";

    const sub =
      slot.status === "active"
        ? videoMetaLine(slot)
        : tx(lang, {
            nl: "Bewijs volgt",
            en: "Evidence pending",
            de: "Nachweis folgt",
            es: "Evidencia pendiente",
            it: "Evidenza in arrivo",
            fr: "Preuve en attente",
          });

    return `
      <div class="truthS4__videoCard truthS4__videoCard--${variant} ${
        slot.status === "active"
          ? "truthS4__videoCard--active"
          : "truthS4__videoCard--empty"
      }">
        <div class="truthS4__videoThumb">
          ${
            slot.status === "active"
              ? slot.thumbnail_url
                ? `<img src="${esc(slot.thumbnail_url)}" alt="" />`
                : `<div class="truthS4__videoFallback truthS4__videoFallback--active"></div>`
              : `<div class="truthS4__videoFallback truthS4__videoFallback--empty"></div>`
          }
          <div class="truthS4__videoShade"></div>
          <div class="truthS4__playWrap">
            <div class="truthS4__play ${
              slot.status === "active" ? "" : "truthS4__play--disabled"
            }"></div>
          </div>
        </div>

        <div class="truthS4__videoMeta">
          <div class="truthS4__videoTitle ${
            title ? "" : "truthS4__videoTitle--empty"
          }">${esc(title || "\u00A0")}</div>
          <div class="truthS4__videoSub ${
            sub ? "" : "truthS4__videoSub--empty"
          }">${esc(sub || "\u00A0")}</div>
        </div>
      </div>
    `;
  };

  return `
<section class="page truthS4" style="--accent:${esc(accentHex)};">
  ${wmHtml}

  <div class="truthS4__bg" aria-hidden="true"></div>
  <div class="truthS4__vignette" aria-hidden="true"></div>
  <div class="truthS4__grid" aria-hidden="true"></div>
  <div class="truthS4__rail" aria-hidden="true"></div>

  <div class="truthS4__header">
    <div class="truthS4__kicker">${esc(slideLabel("reality", lang))}</div>

    <div class="truthS4__hero">
      <div class="truthS4__headline">${esc(heroPrimary)}</div>
      <div class="truthS4__headlineSub">${esc(heroSecondary)}</div>
    </div>
  </div>

  <div class="truthS4__primary">
    <div class="truthS4__sectionLabel">${esc(
      sectionLabel("observations", lang)
    )}</div>

    <div class="truthS4__observations">
      ${renderObservationList(observations)}
    </div>
  </div>

  <div class="truthS4__secondary">
    <div class="truthS4__secondaryBlock truthS4__secondaryBlock--context">
      <div class="truthS4__sectionLabel">${esc(
        sectionLabel("contextVisible", lang)
      )}</div>
      ${renderMiniList(contexts, fallbackContext, "context")}
    </div>

    <div class="truthS4__secondaryBlock truthS4__secondaryBlock--effect">
      <div class="truthS4__sectionLabel">${esc(
        sectionLabel("effect", lang)
      )}</div>
      ${renderMiniList(effects, fallbackEffect, "effect")}
    </div>
  </div>

  <div class="truthS4__evidence">
    <div class="truthS4__evidenceHead">
      <div class="truthS4__sectionLabel">${esc(
        sectionLabel("evidence", lang)
      )}</div>
    </div>

    <div class="truthS4__evidenceGrid">
      <div class="truthS4__evidenceMain">
        ${videoCard(videos[0], "hero")}
      </div>

      <div class="truthS4__evidenceSide">
        ${videoCard(videos[1], "small")}
        ${videoCard(videos[2], "small")}
      </div>
    </div>
  </div>

  <style>
    .truthS4{
      position:relative;
      height:100%;
      overflow:hidden;
      border-radius:18px;
      background:#07090C;
      color:#FFFFFF;
      font-family:"SF Pro Display","Inter",Arial,sans-serif;
    }

    .truthS4 *{
      box-sizing:border-box;
    }

    .truthS4__wm{
      position:absolute;
      right:6mm;
      top:22mm;
      width:96mm;
      height:96mm;
      opacity:.05;
      z-index:1;
      pointer-events:none;
      filter:grayscale(1) blur(.04px);
      transform:rotate(-8deg);
      mix-blend-mode:screen;
    }

    .truthS4__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
      opacity:.9;
    }

    .truthS4__bg{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 8% 12%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 26%),
        radial-gradient(circle at 78% 16%, rgba(255,255,255,.015) 0%, transparent 18%),
        linear-gradient(180deg, rgba(255,255,255,.006) 0%, rgba(255,255,255,0) 22%),
        #07090C;
      z-index:0;
      pointer-events:none;
    }

    .truthS4__bg::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 18% 72%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 34%);
      opacity:.26;
      pointer-events:none;
    }

    .truthS4__vignette{
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, transparent 58%, rgba(0,0,0,.16) 100%);
      z-index:0;
      pointer-events:none;
    }

    .truthS4__grid{
      position:absolute;
      inset:0;
      opacity:.004;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:6px 6px, 6px 6px;
      z-index:0;
      pointer-events:none;
    }

    .truthS4__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 86%, #fff 2%) 0%,
        color-mix(in srgb, var(--accent) 34%, transparent) 52%,
        transparent 100%
      );
      box-shadow:
        0 0 10px color-mix(in srgb, var(--accent) 14%, transparent),
        0 0 22px color-mix(in srgb, var(--accent) 5%, transparent);
      opacity:.92;
      z-index:2;
    }

    .truthS4__header{
      position:absolute;
      left:28mm;
      right:18mm;
      top:18mm;
      z-index:3;
    }

    .truthS4__kicker{
      font-size:9pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:rgba(255,255,255,.48);
      white-space:nowrap;
    }

    .truthS4__hero{
      margin-top:7px;
      padding-bottom:10px;
      border-bottom:1px solid rgba(255,255,255,.045);
      max-width:96%;
    }

    .truthS4__headline{
      max-width:100%;
      font-size:28.5pt;
      line-height:.98;
      letter-spacing:-.06em;
      font-weight:820;
      color:#FFFFFF;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .truthS4__headlineSub{
      margin-top:8px;
      max-width:98%;
      font-size:12.4pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .truthS4__sectionLabel{
      font-size:8.3pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.36);
      white-space:nowrap;
    }

    .truthS4__primary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:66mm;
      z-index:3;
    }

    .truthS4__observations{
      margin-top:10px;
      display:flex;
      flex-direction:column;
      gap:10px;
      max-width:76%;
    }

    .truthS4__obsItem{
      display:flex;
      align-items:flex-start;
      gap:10px;
    }

    .truthS4__obsDot{
      width:8px;
      height:8px;
      margin-top:8px;
      border-radius:999px;
      background:var(--accent);
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent),
        0 0 7px color-mix(in srgb, var(--accent) 10%, transparent);
      flex:0 0 auto;
    }

    .truthS4__obsText{
      font-size:15.8pt;
      line-height:1.23;
      letter-spacing:-.018em;
      font-weight:620;
      color:rgba(255,255,255,.9);
      min-width:0;
      overflow:hidden;
    }

    .truthS4__obsItem--lead .truthS4__obsText{
      font-size:17.2pt;
      line-height:1.16;
      color:#FFFFFF;
      font-weight:680;
    }

    .truthS4__secondary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:120mm;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12mm;
      z-index:3;
      padding-top:10px;
      border-top:1px solid rgba(255,255,255,.045);
    }

    .truthS4__secondaryBlock{
      min-width:0;
    }

    .truthS4__miniList{
      list-style:none;
      margin:9px 0 0 0;
      padding:0;
      display:flex;
      flex-direction:column;
      gap:7px;
    }

    .truthS4__miniItem{
      display:flex;
      align-items:flex-start;
      gap:8px;
    }

    .truthS4__miniBullet{
      width:5px;
      height:5px;
      margin-top:6px;
      border-radius:999px;
      background:rgba(255,255,255,.28);
      flex:0 0 auto;
    }

    .truthS4__miniItem--context span:last-child,
    .truthS4__miniItem--effect span:last-child{
      font-size:11.1pt;
      line-height:1.29;
      font-weight:520;
      color:rgba(255,255,255,.66);
    }

    .truthS4__miniItem--effect span:last-child{
      color:rgba(255,255,255,.76);
    }

    .truthS4__evidence{
      position:absolute;
      left:28mm;
      right:18mm;
      bottom:14mm;
      height:78mm;
      z-index:3;
      padding-top:8px;
      border-top:1px solid rgba(255,255,255,.045);
    }

    .truthS4__evidenceHead{
      margin-bottom:8px;
    }

    .truthS4__evidenceGrid{
      display:grid;
      grid-template-columns:1.45fr .95fr;
      gap:8px;
      height:calc(100% - 16px);
      min-height:0;
    }

    .truthS4__evidenceMain,
    .truthS4__evidenceSide{
      min-width:0;
      min-height:0;
    }

    .truthS4__evidenceSide{
      display:grid;
      grid-template-rows:1fr 1fr;
      gap:8px;
      min-height:0;
    }

    .truthS4__videoCard{
      width:100%;
      height:100%;
      border-radius:12px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.05);
      background:rgba(255,255,255,.014);
      box-shadow:
        0 6px 18px rgba(0,0,0,.12),
        inset 0 0 0 1px rgba(255,255,255,.008);
      display:grid;
      grid-template-rows:1fr auto;
    }

    .truthS4__videoCard--hero{
      background:rgba(255,255,255,.016);
    }

    .truthS4__videoCard--active{
      border-color:color-mix(in srgb, var(--accent) 28%, rgba(255,255,255,.05));
      box-shadow:
        0 8px 22px rgba(0,0,0,.14),
        0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent),
        0 0 22px color-mix(in srgb, var(--accent) 8%, transparent),
        inset 0 0 0 1px rgba(255,255,255,.008);
    }

    .truthS4__videoCard--empty{
      border-color:rgba(255,255,255,.04);
      box-shadow:
        0 6px 18px rgba(0,0,0,.11),
        inset 0 0 0 1px rgba(255,255,255,.006);
    }

    .truthS4__videoThumb{
      position:relative;
      overflow:hidden;
      background:#101317;
    }

    .truthS4__videoThumb img{
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .truthS4__videoFallback--active{
      background:
        radial-gradient(circle at 24% 38%, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 18%),
        linear-gradient(145deg, rgba(255,255,255,.035), rgba(0,0,0,.10));
      opacity:.9;
    }

    .truthS4__videoFallback--empty{
      background:
        radial-gradient(circle at 24% 38%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 18%),
        linear-gradient(145deg, rgba(255,255,255,.018), rgba(0,0,0,.08));
      opacity:.45;
    }

    .truthS4__videoShade{
      position:absolute;
      inset:0;
      background:
        linear-gradient(180deg, rgba(0,0,0,.03), rgba(0,0,0,.22));
      z-index:1;
    }

    .truthS4__playWrap{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:2;
      pointer-events:none;
    }

    .truthS4__play{
      width:9.5mm;
      height:9.5mm;
      border-radius:999px;
      position:relative;
      background:rgba(255,255,255,.11);
      border:1px solid rgba(255,255,255,.2);
      box-shadow:
        0 6px 14px rgba(0,0,0,.14),
        0 0 0 1px color-mix(in srgb, var(--accent) 6%, transparent);
    }

    .truthS4__play::before{
      content:"";
      position:absolute;
      left:3.75mm;
      top:2.7mm;
      border-left:2.7mm solid rgba(255,255,255,.92);
      border-top:1.7mm solid transparent;
      border-bottom:1.7mm solid transparent;
    }

    .truthS4__play--disabled{
      opacity:.58;
    }

    .truthS4__videoMeta{
      display:flex;
      flex-direction:column;
      justify-content:flex-end;
      gap:1mm;
      padding:8px 10px 9px;
      min-width:0;
      background:linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,.008));
    }

    .truthS4__videoTitle{
      font-size:8.1pt;
      line-height:1.22;
      font-weight:600;
      color:rgba(255,255,255,.8);
      min-height:0;
      overflow:hidden;
    }

    .truthS4__videoTitle--empty{
      opacity:0;
      height:0;
      min-height:0;
    }

    .truthS4__videoSub{
      font-size:7pt;
      line-height:1.22;
      color:rgba(255,255,255,.34);
      overflow:hidden;
    }

    .truthS4__videoSub--empty{
      opacity:0;
    }
  </style>
</section>
`;
}

export function pageDevelopmentRoute(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;
  playerName?: string;

  title: string;
  subtitle: string;

  trainingItems?: string[];
  matchItems?: string[];
  videoItems?: string[];
  offFieldItems?: string[];

  trainingText?: string;
  matchText?: string;
  videoText?: string;
  offFieldText?: string;

  playerOwnText?: string;
  playerText?: string;
  coachText?: string;
  analystText?: string;
  staffText?: string;
}) {
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
    title,
    subtitle,
    trainingItems,
    matchItems,
    videoItems,
    offFieldItems,
    trainingText,
    matchText,
    videoText,
    offFieldText,
    playerOwnText,
    playerText,
    coachText,
    analystText,
    staffText,
  } = args;

  const clean = (value?: string) =>
    typeof value === "string" ? value.trim() : "";

  const escapeHtml = (value?: string) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const normalizeItems = (items?: string[], text?: string) => {
    if (Array.isArray(items) && items.length > 0) {
      return items
        .filter((x) => typeof x === "string")
        .map((x) => x.trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    const raw = clean(text);
    if (!raw) return [];

    return raw
      .split(/[\n•;]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 3);
  };

  const trainingList = normalizeItems(trainingItems, trainingText);
  const matchList = normalizeItems(matchItems, matchText);
  const videoList = normalizeItems(videoItems, videoText);
  const offFieldList = normalizeItems(offFieldItems, offFieldText);

  const fallbackTitle = tx(lang, {
    nl: "Nog geen aanpak gedefinieerd",
    en: "No approach defined yet",
    de: "Noch kein Ansatz definiert",
    es: "Aún no se ha definido un enfoque",
    it: "Nessun approccio ancora definito",
    fr: "Aucune approche encore définie",
  });

  const fallbackSubtitle = tx(lang, {
    nl: "Nog geen toelichting toegevoegd",
    en: "No explanation added yet",
    de: "Noch keine Erläuterung hinzugefügt",
    es: "Aún no se ha añadido una explicación",
    it: "Nessuna spiegazione ancora aggiunta",
    fr: "Aucune explication encore ajoutée",
  });

  const safeTitle = clean(title) || fallbackTitle;
  const safeSubtitle = clean(subtitle) || fallbackSubtitle;

  const alignmentItems = [
    {
      label: tx(lang, {
        nl: "SPELER",
        en: "PLAYER",
        de: "SPIELER",
        es: "JUGADOR",
        it: "GIOCATORE",
        fr: "JOUEUR",
      }),
      text: clean(playerText || playerOwnText),
    },
    {
      label: tx(lang, {
        nl: "COACH",
        en: "COACH",
        de: "TRAINER",
        es: "ENTRENADOR",
        it: "ALLENATORE",
        fr: "COACH",
      }),
      text: clean(coachText),
    },
    {
      label: tx(lang, {
        nl: "ANALIST",
        en: "ANALYST",
        de: "ANALYST",
        es: "ANALISTA",
        it: "ANALISTA",
        fr: "ANALYSTE",
      }),
      text: clean(analystText),
    },
    {
      label: tx(lang, {
        nl: "STAFF",
        en: "STAFF",
        de: "STAFF",
        es: "STAFF",
        it: "STAFF",
        fr: "STAFF",
      }),
      text: clean(staffText),
    },
  ].filter((item) => item.text);

  const renderList = (items: string[], fallback: string) => {
    const finalItems = items.length ? items : [fallback];

    return finalItems
      .map(
        (item) => `
          <div class="routeS5__item">
            <span class="routeS5__dot"></span>
            <span class="routeS5__itemText">${escapeHtml(item)}</span>
          </div>
        `
      )
      .join("");
  };

  const watermarkHtml = clean(logoUrl)
    ? `
      <div class="routeS5__wm" aria-hidden="true">
        <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(clubName)} watermark" />
      </div>
    `
    : "";

  const alignmentHtml = alignmentItems.length
    ? `
      <div class="routeS5__alignment">
        <div class="routeS5__alignmentLabel">${escapeHtml(
          sectionLabel("alignment", lang)
        )}</div>

        <div class="routeS5__alignmentGrid">
          ${alignmentItems
            .map(
              (item) => `
                <div class="routeS5__alignmentItem">
                  <div class="routeS5__alignmentRole">${escapeHtml(
                    item.label
                  )}</div>
                  <div class="routeS5__alignmentText">${escapeHtml(
                    item.text
                  )}</div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `
    : "";

  return `
<section class="page routeS5" style="--accent:${escapeHtml(accentHex)};">
  ${watermarkHtml}

  <div class="routeS5__bg" aria-hidden="true"></div>
  <div class="routeS5__vignette" aria-hidden="true"></div>
  <div class="routeS5__gridFx" aria-hidden="true"></div>
  <div class="routeS5__rail" aria-hidden="true"></div>

  <div class="routeS5__header">
    <div class="routeS5__kicker">${escapeHtml(slideLabel("approach", lang))}</div>

    <div class="routeS5__hero">
      <div class="routeS5__title">${escapeHtml(safeTitle)}</div>
      <div class="routeS5__subtitle">${escapeHtml(safeSubtitle)}</div>
    </div>
  </div>

  <div class="routeS5__grid">
    <div class="routeS5__block routeS5__block--primary">
      <div class="routeS5__label">${escapeHtml(sectionLabel("training", lang))}</div>
      <div class="routeS5__list">
        ${renderList(
          trainingList,
          tx(lang, {
            nl: "Nog geen trainingsactie toegevoegd",
            en: "No training action added yet",
            de: "Noch keine Trainingsaktion hinzugefügt",
            es: "Aún no se ha añadido una acción de entrenamiento",
            it: "Nessuna azione di allenamento ancora aggiunta",
            fr: "Aucune action d’entraînement encore ajoutée",
          })
        )}
      </div>
    </div>

    <div class="routeS5__block routeS5__block--primary">
      <div class="routeS5__label">${escapeHtml(sectionLabel("match", lang))}</div>
      <div class="routeS5__list">
        ${renderList(
          matchList,
          tx(lang, {
            nl: "Nog geen wedstrijdactie toegevoegd",
            en: "No match action added yet",
            de: "Noch keine Spielaktion hinzugefügt",
            es: "Aún no se ha añadido una acción de partido",
            it: "Nessuna azione di partita ancora aggiunta",
            fr: "Aucune action de match encore ajoutée",
          })
        )}
      </div>
    </div>

    <div class="routeS5__block">
      <div class="routeS5__label">${escapeHtml(sectionLabel("video", lang))}</div>
      <div class="routeS5__list">
        ${renderList(
          videoList,
          tx(lang, {
            nl: "Nog geen videoactie toegevoegd",
            en: "No video action added yet",
            de: "Noch keine Videoaktion hinzugefügt",
            es: "Aún no se ha añadido una acción de vídeo",
            it: "Nessuna azione video ancora aggiunta",
            fr: "Aucune action vidéo encore ajoutée",
          })
        )}
      </div>
    </div>

    <div class="routeS5__block">
      <div class="routeS5__label">${escapeHtml(sectionLabel("offField", lang))}</div>
      <div class="routeS5__list">
        ${renderList(
          offFieldList,
          tx(lang, {
            nl: "Nog geen off-field actie toegevoegd",
            en: "No off-field action added yet",
            de: "Noch keine Off-Field-Aktion hinzugefügt",
            es: "Aún no se ha añadido una acción fuera del campo",
            it: "Nessuna azione fuori dal campo ancora aggiunta",
            fr: "Aucune action hors terrain encore ajoutée",
          })
        )}
      </div>
    </div>
  </div>

  ${alignmentHtml}

  <style>
    .routeS5{
      position:relative;
      height:100%;
      overflow:hidden;
      border-radius:18px;
      background:#07090C;
      color:#FFFFFF;
      font-family:"SF Pro Display","Inter",Arial,sans-serif;
    }

    .routeS5 *{
      box-sizing:border-box;
    }

    .routeS5__wm{
      position:absolute;
      right:12mm;
      bottom:18mm;
      width:104mm;
      height:104mm;
      opacity:.05;
      z-index:1;
      pointer-events:none;
      filter:grayscale(1) blur(.04px);
      transform:rotate(-8deg);
      mix-blend-mode:screen;
    }

    .routeS5__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
      opacity:.9;
    }

    .routeS5__bg{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 10% 18%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 24%),
        radial-gradient(circle at 82% 14%, rgba(255,255,255,.014) 0%, transparent 18%),
        linear-gradient(180deg, rgba(255,255,255,.006) 0%, rgba(255,255,255,0) 22%),
        #07090C;
      z-index:0;
      pointer-events:none;
    }

    .routeS5__bg::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 18% 74%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 34%);
      opacity:.2;
      pointer-events:none;
    }

    .routeS5__vignette{
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, transparent 58%, rgba(0,0,0,.16) 100%);
      z-index:0;
      pointer-events:none;
    }

    .routeS5__gridFx{
      position:absolute;
      inset:0;
      opacity:.004;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:6px 6px, 6px 6px;
      z-index:0;
      pointer-events:none;
    }

    .routeS5__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 86%, #fff 2%) 0%,
        color-mix(in srgb, var(--accent) 34%, transparent) 52%,
        transparent 100%
      );
      box-shadow:
        0 0 10px color-mix(in srgb, var(--accent) 14%, transparent),
        0 0 22px color-mix(in srgb, var(--accent) 5%, transparent);
      opacity:.92;
      z-index:2;
    }

    .routeS5__header{
      position:absolute;
      left:28mm;
      right:18mm;
      top:18mm;
      z-index:3;
    }

    .routeS5__kicker{
      font-size:9pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:rgba(255,255,255,.48);
      white-space:nowrap;
    }

    .routeS5__hero{
      margin-top:7px;
      padding-bottom:10px;
      border-bottom:1px solid rgba(255,255,255,.045);
      max-width:96%;
    }

    .routeS5__title{
      max-width:100%;
      font-size:29pt;
      line-height:.98;
      letter-spacing:-.06em;
      font-weight:820;
      color:#FFFFFF;
      overflow:hidden;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .routeS5__subtitle{
      margin-top:8px;
      max-width:98%;
      font-size:12.2pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      overflow:hidden;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .routeS5__grid{
      position:absolute;
      left:28mm;
      right:18mm;
      top:72mm;
      bottom:36mm;
      z-index:3;
      display:grid;
      grid-template-columns:1fr 1fr;
      grid-template-rows:1.05fr .92fr;
      gap:10mm 12mm;
    }

    .routeS5__block{
      min-width:0;
      border-top:1px solid rgba(255,255,255,.045);
      padding-top:8px;
    }

    .routeS5__block--primary{
      border-top-color:rgba(255,255,255,.06);
    }

    .routeS5__label{
      font-size:8.3pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.38);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .routeS5__block--primary .routeS5__label{
      color:rgba(255,255,255,.64);
    }

    .routeS5__list{
      margin-top:10px;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .routeS5__item{
      display:flex;
      align-items:flex-start;
      gap:9px;
      min-width:0;
    }

    .routeS5__dot{
      width:6px;
      height:6px;
      margin-top:6px;
      border-radius:999px;
      background:var(--accent);
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent),
        0 0 8px color-mix(in srgb, var(--accent) 10%, transparent);
      flex:0 0 auto;
    }

    .routeS5__itemText{
      font-size:12.8pt;
      line-height:1.24;
      letter-spacing:-.012em;
      font-weight:560;
      color:rgba(255,255,255,.84);
      min-width:0;
      overflow:hidden;
    }

    .routeS5__block:not(.routeS5__block--primary) .routeS5__itemText{
      font-size:11.6pt;
      line-height:1.24;
      font-weight:530;
      color:rgba(255,255,255,.66);
    }

    .routeS5__alignment{
      position:absolute;
      left:28mm;
      right:18mm;
      bottom:16mm;
      z-index:3;
      border-top:1px solid rgba(255,255,255,.045);
      padding-top:7px;
    }

    .routeS5__alignmentLabel{
      font-size:7.8pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.34);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .routeS5__alignmentGrid{
      margin-top:7px;
      display:grid;
      grid-template-columns:repeat(4, minmax(0, 1fr));
      gap:8px;
    }

    .routeS5__alignmentItem{
      min-width:0;
    }

    .routeS5__alignmentRole{
      font-size:7.2pt;
      line-height:1.1;
      font-weight:700;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:rgba(255,255,255,.44);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .routeS5__alignmentText{
      margin-top:4px;
      font-size:8.7pt;
      line-height:1.22;
      font-weight:500;
      color:rgba(255,255,255,.58);
      min-width:0;
      overflow:hidden;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 6 — SUCCESS ---------------- */
export function pageSuccess(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;

  inGame: string[];
  behaviour: string[];
  signals: string[];
}) {
  const { lang, accentHex, clubName, logoUrl, inGame, behaviour, signals } = args;

  const safeLogo = safeText(logoUrl);

  const wmHtml = safeLogo
    ? `
      <div class="successS6__wm" aria-hidden="true">
        <img src="${esc(safeLogo)}" alt="${esc(clubName)} watermark" />
      </div>
    `
    : ``;

  const gameItems = notEmpty(inGame).slice(0, 3);
  const behaviourItems = notEmpty(behaviour).slice(0, 4);
  const signalItems = notEmpty(signals).slice(0, 3);

  const emptyLine = tx(lang, {
    nl: "Nog niet ingevuld",
    en: "Not yet defined",
    de: "Noch nicht ausgefüllt",
    es: "Aún no definido",
    it: "Non ancora definito",
    fr: "Pas encore défini",
  });

  const emptyHero = tx(lang, {
    nl: "Wanneer het plan zichtbaar gelukt is",
    en: "When the plan has visibly landed",
    de: "Wenn der Plan sichtbar greift",
    es: "Cuando el plan empieza a verse claramente",
    it: "Quando il piano diventa visibilmente efficace",
    fr: "Quand le plan devient visiblement concret",
  });

  const emptySub = tx(lang, {
    nl: "Succes wordt zichtbaar in gedrag, uitvoering en wedstrijdeffect.",
    en: "Success becomes visible in behaviour, execution and match impact.",
    de: "Erfolg wird sichtbar in Verhalten, Ausführung und Spieleffekt.",
    es: "El éxito se hace visible en la conducta, la ejecución y el impacto en el juego.",
    it: "Il successo diventa visibile nel comportamento, nell’esecuzione e nell’impatto sulla partita.",
    fr: "La réussite devient visible dans le comportement, l’exécution et l’impact sur le match.",
  });

  const heroPrimary = behaviourItems[0] || emptyHero;
  const heroSecondary = gameItems[0] || signalItems[0] || emptySub;

  const renderBehaviourList = (items: string[]) => {
    const list = items.length ? items : [emptyLine];

    return list
      .map(
        (item, index) => `
          <div class="successS6__behaviourItem ${
            index === 0 && items.length ? "successS6__behaviourItem--lead" : ""
          } ${items.length ? "" : "successS6__behaviourItem--empty"}">
            <span class="successS6__behaviourDot"></span>
            <span class="successS6__behaviourText">${esc(item)}</span>
          </div>
        `
      )
      .join("");
  };

  const renderMiniList = (
    items: string[],
    variant: "game" | "signal"
  ) => {
    const list = items.length ? items : [emptyLine];

    return `
      <ul class="successS6__miniList successS6__miniList--${variant}">
        ${list
          .map(
            (item) => `
              <li class="successS6__miniItem successS6__miniItem--${variant} ${
                items.length ? "" : "successS6__miniItem--empty"
              }">
                <span class="successS6__miniBullet"></span>
                <span>${esc(item)}</span>
              </li>
            `
          )
          .join("")}
      </ul>
    `;
  };

  return `
<section class="page successS6" style="--accent:${esc(accentHex)};">
  ${wmHtml}

  <div class="successS6__bg" aria-hidden="true"></div>
  <div class="successS6__vignette" aria-hidden="true"></div>
  <div class="successS6__gridFx" aria-hidden="true"></div>
  <div class="successS6__rail" aria-hidden="true"></div>

  <div class="successS6__header">
    <div class="successS6__kicker">${esc(slideLabel("success", lang))}</div>

    <div class="successS6__hero">
      <div class="successS6__headline ${
        behaviourItems.length ? "" : "successS6__headline--empty"
      }">${esc(heroPrimary)}</div>
      <div class="successS6__headlineSub ${
        gameItems.length || signalItems.length ? "" : "successS6__headlineSub--empty"
      }">${esc(heroSecondary)}</div>
    </div>
  </div>

  <div class="successS6__primary">
    <div class="successS6__sectionLabel">${esc(
      tx(lang, {
        nl: "WANNEER HET GELUKT IS",
        en: "WHEN THE PLAN HAS LANDED",
        de: "WANN DER PLAN GREIFT",
        es: "CUANDO EL PLAN SE HACE VISIBLE",
        it: "QUANDO IL PIANO PRENDE FORMA",
        fr: "QUAND LE PLAN DEVIENT VISIBLE",
      })
    )}</div>

    <div class="successS6__behaviour">
      ${renderBehaviourList(behaviourItems)}
    </div>
  </div>

  <div class="successS6__secondary">
    <div class="successS6__secondaryBlock successS6__secondaryBlock--game">
      <div class="successS6__sectionLabel">${esc(
        sectionLabel("inGame", lang)
      )}</div>
      ${renderMiniList(gameItems, "game")}
    </div>

    <div class="successS6__secondaryBlock successS6__secondaryBlock--signal">
      <div class="successS6__sectionLabel">${esc(
        sectionLabel("signals", lang)
      )}</div>
      ${renderMiniList(signalItems, "signal")}
    </div>
  </div>

  <div class="successS6__footerNote">
    <div class="successS6__footerLine"></div>
    <div class="successS6__footerText">
      ${esc(
        tx(lang, {
          nl: "Deze slide laat zien wanneer ontwikkeling niet alleen besproken, maar ook zichtbaar is geworden.",
          en: "This slide shows when development is no longer discussed only, but becomes visible.",
          de: "Diese Folie zeigt, wann Entwicklung nicht nur besprochen wird, sondern auch sichtbar geworden ist.",
          es: "Esta diapositiva muestra cuándo el desarrollo deja de ser solo una conversación y se vuelve visible.",
          it: "Questa slide mostra quando lo sviluppo non viene solo discusso, ma diventa anche visibile.",
          fr: "Cette diapositive montre quand le développement n’est plus seulement discuté, mais devient visible.",
        })
      )}
    </div>
  </div>

  <style>
    .successS6{
      position:relative;
      height:100%;
      overflow:hidden;
      border-radius:18px;
      background:#07090C;
      color:#FFFFFF;
      font-family:"SF Pro Display","Inter",Arial,sans-serif;
    }

    .successS6 *{
      box-sizing:border-box;
    }

    .successS6__wm{
      position:absolute;
      right:2mm;
      top:12mm;
      width:96mm;
      height:96mm;
      opacity:.05;
      z-index:1;
      pointer-events:none;
      filter:grayscale(1) blur(.04px);
      transform:rotate(-8deg);
      mix-blend-mode:screen;
    }

    .successS6__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
      opacity:.9;
    }

    .successS6__bg{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 10% 14%, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 24%),
        radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--accent) 5%, transparent) 0%, transparent 18%),
        linear-gradient(180deg, rgba(255,255,255,.006) 0%, rgba(255,255,255,0) 22%),
        #07090C;
      z-index:0;
      pointer-events:none;
    }

    .successS6__bg::after{
      content:"";
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 18% 76%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 34%),
        radial-gradient(circle at 72% 84%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 26%);
      opacity:.28;
      pointer-events:none;
    }

    .successS6__vignette{
      position:absolute;
      inset:0;
      background:radial-gradient(circle at center, transparent 58%, rgba(0,0,0,.16) 100%);
      z-index:0;
      pointer-events:none;
    }

    .successS6__gridFx{
      position:absolute;
      inset:0;
      opacity:.004;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:6px 6px, 6px 6px;
      z-index:0;
      pointer-events:none;
    }

    .successS6__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 88%, #fff 2%) 0%,
        color-mix(in srgb, var(--accent) 42%, transparent) 56%,
        transparent 100%
      );
      box-shadow:
        0 0 12px color-mix(in srgb, var(--accent) 18%, transparent),
        0 0 26px color-mix(in srgb, var(--accent) 8%, transparent);
      opacity:.96;
      z-index:2;
    }

    .successS6__header{
      position:absolute;
      left:28mm;
      right:18mm;
      top:18mm;
      z-index:3;
    }

    .successS6__kicker{
      font-size:9pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:rgba(255,255,255,.48);
      white-space:nowrap;
    }

    .successS6__hero{
      margin-top:7px;
      padding-bottom:10px;
      border-bottom:1px solid rgba(255,255,255,.045);
      max-width:96%;
    }

    .successS6__headline{
      max-width:100%;
      font-size:28.5pt;
      line-height:.98;
      letter-spacing:-.06em;
      font-weight:820;
      color:#FFFFFF;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .successS6__headline--empty{
      color:rgba(255,255,255,.82);
    }

    .successS6__headlineSub{
      margin-top:8px;
      max-width:98%;
      font-size:12.4pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:pretty;
    }

    .successS6__headlineSub--empty{
      color:rgba(255,255,255,.46);
    }

    .successS6__sectionLabel{
      font-size:8.3pt;
      line-height:1.1;
      font-weight:720;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.36);
      white-space:nowrap;
    }

    .successS6__primary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:66mm;
      z-index:3;
    }

    .successS6__behaviour{
      margin-top:10px;
      display:flex;
      flex-direction:column;
      gap:10px;
      max-width:78%;
    }

    .successS6__behaviourItem{
      display:flex;
      align-items:flex-start;
      gap:10px;
    }

    .successS6__behaviourItem--empty .successS6__behaviourText{
      color:rgba(255,255,255,.52);
      font-weight:500;
    }

    .successS6__behaviourDot{
      width:8px;
      height:8px;
      margin-top:8px;
      border-radius:999px;
      background:var(--accent);
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent) 20%, transparent),
        0 0 7px color-mix(in srgb, var(--accent) 12%, transparent);
      flex:0 0 auto;
    }

    .successS6__behaviourText{
      font-size:15.4pt;
      line-height:1.23;
      letter-spacing:-.018em;
      font-weight:620;
      color:rgba(255,255,255,.88);
      min-width:0;
      overflow:hidden;
    }

    .successS6__behaviourItem--lead .successS6__behaviourText{
      font-size:17pt;
      line-height:1.16;
      color:#FFFFFF;
      font-weight:680;
    }

    .successS6__secondary{
      position:absolute;
      left:28mm;
      right:18mm;
      top:122mm;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12mm;
      z-index:3;
      padding-top:10px;
      border-top:1px solid rgba(255,255,255,.045);
    }

    .successS6__secondaryBlock{
      min-width:0;
    }

    .successS6__miniList{
      list-style:none;
      margin:9px 0 0 0;
      padding:0;
      display:flex;
      flex-direction:column;
      gap:7px;
    }

    .successS6__miniItem{
      display:flex;
      align-items:flex-start;
      gap:8px;
    }

    .successS6__miniItem--empty span:last-child{
      color:rgba(255,255,255,.48) !important;
      font-weight:500;
    }

    .successS6__miniBullet{
      width:5px;
      height:5px;
      margin-top:6px;
      border-radius:999px;
      background:color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,.22));
      flex:0 0 auto;
    }

    .successS6__miniItem--game span:last-child,
    .successS6__miniItem--signal span:last-child{
      font-size:11.2pt;
      line-height:1.29;
      font-weight:520;
      color:rgba(255,255,255,.68);
    }

    .successS6__miniItem--signal span:last-child{
      color:rgba(255,255,255,.76);
    }

    .successS6__footerNote{
      position:absolute;
      left:28mm;
      right:18mm;
      bottom:16mm;
      z-index:3;
    }

    .successS6__footerLine{
      width:100%;
      height:1px;
      background:linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent) 30%, rgba(255,255,255,.10)) 0%,
        rgba(255,255,255,.04) 100%
      );
    }

    .successS6__footerText{
      margin-top:8px;
      max-width:78%;
      font-size:9.6pt;
      line-height:1.3;
      letter-spacing:-.01em;
      color:rgba(255,255,255,.42);
      overflow:hidden;
    }
  </style>
</section>
`;
}