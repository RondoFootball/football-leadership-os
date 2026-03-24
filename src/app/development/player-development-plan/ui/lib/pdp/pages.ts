// src/app/development/player-development-plan/ui/lib/pdp/pages.ts

export type Lang = "nl" | "en";

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

function t(lang: Lang, nl: string, en: string) {
  return lang === "nl" ? nl : en;
}

function safeText(input: unknown) {
  return String(input ?? "").trim();
}

function notEmpty(items: unknown[]) {
  return items
    .map((x) => safeText(x))
    .filter(Boolean);
}

/** ---------------- SLIDE 2 ---------------- */
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

  const wm = safeText(logoUrl);
  const wmHtml = wm
    ? `<div class="pdpS2__wm" aria-hidden="true"><img src="${esc(
        wm
      )}" alt="${esc(clubName)} watermark" /></div>`
    : ``;

  const normalizeItems = (input: string | string[] | undefined | null) => {
    if (Array.isArray(input)) {
      return input
        .map((x) => safeText(x))
        .filter(Boolean)
        .slice(0, 2);
    }

    return String(input || "")
      .split(/\r?\n|;|•/g)
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 2);
  };

  const matchMoments = normalizeItems(matchSituation);
  const focusText = safeText(focusBehaviour);
  const targetText = safeText(targetBehaviour);
  const evalTxt = (evalLabel || t(lang, "EVALUATIE", "EVALUATION")).toUpperCase();
  const periodTxt = t(lang, "FOCUSPERIODE", "FOCUS PERIOD");

  const matchHtml =
    matchMoments.length > 0
      ? `<ul class="pdpS2__contextList">
          ${matchMoments
            .map(
              (item) => `
                <li class="pdpS2__contextItem">
                  <span class="pdpS2__contextDot"></span>
                  <span class="pdpS2__contextText">${esc(item)}</span>
                </li>
              `
            )
            .join("")}
        </ul>`
      : `<div class="pdpS2__contextEmpty"></div>`;

  return `
<section class="page pdpS2" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS2__wash" aria-hidden="true"></div>
  <div class="pdpS2__vignette" aria-hidden="true"></div>
  <div class="pdpS2__grain" aria-hidden="true"></div>
  <div class="pdpS2__axis" aria-hidden="true"></div>

  <div class="pdpS2__top">
    <div class="pdpS2__kicker">${esc(t(lang, "AFSPRAAK", "AGREEMENT"))}</div>

    <div class="pdpS2__hero">
      <div class="pdpS2__heroGrid" aria-hidden="true"></div>
      <div class="pdpS2__heroGlow" aria-hidden="true"></div>

      <div class="pdpS2__title">${esc(
        t(lang, "JOUW ONTWIKKELPUNT", "YOUR DEVELOPMENT POINT")
      )}</div>

      <div class="pdpS2__focusWrap">
        <div class="pdpS2__focus">${esc(focusText)}</div>
      </div>
    </div>
  </div>

  <div class="pdpS2__targetCard">
    <div class="pdpS2__sectionHead">${esc(
      t(lang, "GEWENST GEDRAG", "TARGET BEHAVIOUR")
    )}</div>
    <div class="pdpS2__targetBody">
      <div class="pdpS2__targetRail"></div>
      <div class="pdpS2__targetText ${targetText ? "" : "pdpS2__targetText--empty"}">${esc(
        targetText
      )}</div>
    </div>
  </div>

  <div class="pdpS2__contextCard">
    <div class="pdpS2__sectionHead">${esc(
      t(lang, "WEDSTRIJDMOMENTEN", "MATCH MOMENTS")
    )}</div>
    <div class="pdpS2__contextBody">
      ${matchHtml}
    </div>
  </div>

  <div class="pdpS2__bottomBar">
    <div class="pdpS2__bottomLine"></div>
    <div class="pdpS2__bottomProgress"></div>
    <div class="pdpS2__bottomMarker pdpS2__bottomMarker--start"></div>
    <div class="pdpS2__bottomMarker pdpS2__bottomMarker--end"></div>

    <div class="pdpS2__bottomGrid">
      <div class="pdpS2__bottomCol pdpS2__bottomCol--left">
        <div class="pdpS2__bottomLabel">${esc(t(lang, "START", "START"))}</div>
        <div class="pdpS2__bottomValue">${esc(startDateLabel)}</div>
      </div>

      <div class="pdpS2__bottomCol pdpS2__bottomCol--center">
        <div class="pdpS2__bottomLabel">${esc(periodTxt)}</div>
        <div class="pdpS2__bottomValue pdpS2__bottomValue--strong">${esc(
          durationWeeksLabel
        )}</div>
      </div>

      <div class="pdpS2__bottomCol pdpS2__bottomCol--right">
        <div class="pdpS2__bottomLabel">${esc(evalTxt)}</div>
        <div class="pdpS2__bottomValue">${esc(endDateLabel)}</div>
      </div>
    </div>
  </div>

  <style>
    .pdpS2{
      position:relative;
      height:100%;
      border-radius:18px;
      overflow:hidden;
      background:#0B0D10;
      color:#fff;
    }

    .pdpS2 *{
      box-sizing:border-box;
    }

    .pdpS2__wm{
      position:absolute;
      right:-18mm;
      bottom:-16mm;
      width:138mm;
      height:138mm;
      opacity:.04;
      filter:blur(.15px);
      z-index:0;
      pointer-events:none;
    }

    .pdpS2__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
    }

    .pdpS2__wash{
      position:absolute;
      inset:0;
      background:
        radial-gradient(
          circle at 20% 18%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, black 8%) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 76% 82%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 7%, black 18%) 0%,
          transparent 28%
        ),
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 6%, black 14%) 0%,
          transparent 58%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS2__vignette{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at center, transparent 48%, rgba(0,0,0,.18) 100%),
        linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.14));
      z-index:0;
      pointer-events:none;
    }

    .pdpS2__grain{
      position:absolute;
      inset:0;
      opacity:.028;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:5px 5px, 5px 5px;
      z-index:0;
      pointer-events:none;
    }

    .pdpS2__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:16mm;
      width:3px;
      border-radius:3px;
      background:
        linear-gradient(
          180deg,
          var(--accent-primary, var(--accent)) 0%,
          var(--accent-primary, var(--accent)) 65%,
          rgba(255,255,255,.08) 100%
        );
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-primary, var(--accent)) 16%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, transparent);
      opacity:.98;
      z-index:1;
    }

    .pdpS2__top{
      position:absolute;
      left:26mm;
      right:16mm;
      top:18mm;
      height:92mm;
      z-index:2;
      display:flex;
      flex-direction:column;
      overflow:hidden;
    }

    .pdpS2__kicker{
      font-size:9.5pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
      font-weight:640;
      line-height:1.1;
      margin-bottom:10px;
    }

    .pdpS2__hero{
      position:relative;
      display:flex;
      flex-direction:column;
      height:100%;
      min-height:0;
      padding:2mm 0 0 0;
      overflow:hidden;
    }

    .pdpS2__heroGrid{
      position:absolute;
      inset:0;
      opacity:.055;
      background-image:
        linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px);
      background-size:7px 7px, 7px 7px;
      mask-image:linear-gradient(180deg, rgba(0,0,0,.34), transparent 86%);
      pointer-events:none;
    }

    .pdpS2__heroGlow{
      position:absolute;
      left:-4mm;
      top:8mm;
      width:74mm;
      height:40mm;
      background:
        radial-gradient(
          circle,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, transparent) 0%,
          transparent 70%
        );
      opacity:.55;
      pointer-events:none;
      filter:blur(4px);
      transform:rotate(-8deg);
    }

    .pdpS2__title{
      position:relative;
      z-index:2;
      font-size:11pt;
      line-height:1.1;
      letter-spacing:.18em;
      font-weight:600;
      text-transform:uppercase;
      color:rgba(255,255,255,.58);
      max-width:24ch;
    }

    .pdpS2__focusWrap{
      margin-top:auto;
      position:relative;
      z-index:2;
      max-width:18ch;
    }

    .pdpS2__focusWrap::before{
      content:"";
      position:absolute;
      left:-14mm;
      top:50%;
      width:10mm;
      height:1px;
      background:linear-gradient(
        90deg,
        var(--accent-primary, var(--accent)),
        transparent
      );
      opacity:.4;
      transform:translateY(-50%);
    }

    .pdpS2__focus{
      font-size:22pt;
      line-height:1.08;
      letter-spacing:-0.02em;
      font-weight:820;
      color:rgba(255,255,255,.98);
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      overflow-wrap:anywhere;
      text-wrap:balance;
      min-height:0;
      text-shadow:0 0 18px rgba(255,255,255,.08);
    }

    .pdpS2__focusWrap::after{
      content:"";
      display:block;
      width:36px;
      height:2px;
      margin-top:10px;
      border-radius:999px;
      background:var(--accent-primary, var(--accent));
      opacity:.72;
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent);
    }

    .pdpS2__targetCard{
      position:absolute;
      left:26mm;
      right:16mm;
      top:118mm;
      height:56mm;
      z-index:2;
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:13px 16px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.05) 0%,
          rgba(255,255,255,.03) 100%
        );
      overflow:hidden;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.015),
        0 10px 30px rgba(0,0,0,.12);
    }

    .pdpS2__targetCard::after{
      content:"";
      position:absolute;
      left:50%;
      transform:translateX(-50%);
      bottom:-12px;
      width:1px;
      height:12px;
      background:rgba(255,255,255,.08);
    }

    .pdpS2__contextCard{
      position:absolute;
      left:26mm;
      right:16mm;
      top:182mm;
      height:48mm;
      z-index:2;
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:12px 16px;
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.16) 0%,
          rgba(0,0,0,.10) 100%
        );
      overflow:hidden;
    }

    .pdpS2__sectionHead{
      font-size:8.8pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.46);
      font-weight:720;
      margin-bottom:8px;
      line-height:1.1;
    }

    .pdpS2__targetBody{
      display:flex;
      gap:10px;
      align-items:flex-start;
      min-height:0;
    }

    .pdpS2__targetRail{
      width:2px;
      height:28mm;
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 46%, rgba(255,255,255,.18)) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 12%, transparent) 100%
        );
      flex:0 0 auto;
      opacity:.9;
    }

    .pdpS2__targetText{
      font-size:13.8pt;
      line-height:1.36;
      color:rgba(255,255,255,.86);
      font-weight:560;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
      text-wrap:balance;
      min-height:0;
      letter-spacing:.005em;
    }

    .pdpS2__targetText--empty{
      min-height:14px;
    }

    .pdpS2__contextBody{
      min-height:0;
    }

    .pdpS2__contextList{
      list-style:none;
      margin:0;
      padding:0;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .pdpS2__contextItem{
      display:flex;
      gap:9px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS2__contextDot{
      width:7px;
      height:7px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      margin-top:4px;
      flex:0 0 auto;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, transparent),
        0 0 10px color-mix(in srgb, var(--accent-mix, var(--accent)) 12%, transparent);
    }

    .pdpS2__contextText{
      font-size:12.2pt;
      line-height:1.28;
      color:rgba(255,255,255,.80);
      font-weight:500;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS2__contextEmpty{
      min-height:8px;
    }

    .pdpS2__bottomBar{
      position:absolute;
      left:26mm;
      right:16mm;
      bottom:14mm;
      height:18mm;
      z-index:2;
    }

    .pdpS2__bottomLine{
      position:absolute;
      left:0;
      right:0;
      top:0;
      height:1px;
      background:linear-gradient(
        90deg,
        rgba(255,255,255,.16) 0%,
        rgba(255,255,255,.12) 100%
      );
    }

    .pdpS2__bottomProgress{
      position:absolute;
      left:0;
      top:0;
      width:38%;
      height:2px;
      background:linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent-primary, var(--accent)) 84%, #ffffff 10%) 0%,
        color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, transparent) 100%
      );
      opacity:.55;
      border-radius:999px;
    }

    .pdpS2__bottomMarker{
      position:absolute;
      top:-1.4px;
      width:4px;
      height:4px;
      border-radius:999px;
      background:var(--accent-primary, var(--accent));
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent);
    }

    .pdpS2__bottomMarker--start{
      left:0;
    }

    .pdpS2__bottomMarker--end{
      right:0;
      opacity:.9;
    }

    .pdpS2__bottomGrid{
      position:absolute;
      left:0;
      right:0;
      top:4.2mm;
      display:grid;
      grid-template-columns:1fr auto 1fr;
      align-items:start;
      gap:14px;
    }

    .pdpS2__bottomCol{
      display:flex;
      flex-direction:column;
      gap:5px;
      min-width:0;
    }

    .pdpS2__bottomCol--left{
      align-items:flex-start;
      text-align:left;
    }

    .pdpS2__bottomCol--center{
      align-items:center;
      text-align:center;
    }

    .pdpS2__bottomCol--center::after{
      content:"WINDOW";
      display:block;
      font-size:7pt;
      letter-spacing:.2em;
      opacity:.35;
      margin-top:2px;
      text-transform:uppercase;
    }

    .pdpS2__bottomCol--right{
      align-items:flex-end;
      text-align:right;
    }

    .pdpS2__bottomLabel{
      font-size:8.3pt;
      letter-spacing:.18em;
      text-transform:uppercase;
      color:rgba(255,255,255,.44);
      font-weight:720;
      white-space:nowrap;
      line-height:1.1;
    }

    .pdpS2__bottomValue{
      font-size:10.8pt;
      line-height:1.1;
      letter-spacing:.05em;
      text-transform:uppercase;
      color:rgba(255,255,255,.84);
      font-weight:640;
      white-space:nowrap;
    }

    .pdpS2__bottomValue--strong{
      font-size:13pt;
      letter-spacing:.28em;
      color:#fff;
      font-weight:900;
      transform:scale(1.02);
      transform-origin:center;
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
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
    gameMoments,
    zones,
    principles,
  } = args;

  const wm = safeText(logoUrl);
  const wmHtml = wm
    ? `<div class="pdpS5__wm" aria-hidden="true">
         <img src="${esc(wm)}" alt="${esc(clubName)} watermark" />
       </div>`
    : ``;

  const roleItems = notEmpty(gameMoments).slice(0, 3);
  const phaseItems = notEmpty(zones).slice(0, 3);
  const principleItems = notEmpty(principles).slice(0, 6);
  const principleLeft = principleItems.slice(0, 3);
  const principleRight = principleItems.slice(3, 6);

  const bulletList = (
    items: string[],
    variant: "default" | "impact" = "default"
  ) =>
    items.length
      ? `<ul class="pdpS5__list">
          ${items
            .map(
              (x) => `
                <li class="pdpS5__li ${
                  variant === "impact" ? "pdpS5__li--impact" : ""
                }">
                  <span class="pdpS5__dot"></span>
                  <span>${esc(x)}</span>
                </li>`
            )
            .join("")}
        </ul>`
      : `<div class="pdpS5__empty"></div>`;

  return `
<section class="page pdpS5" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS5__wash" aria-hidden="true"></div>
  <div class="pdpS5__vignette" aria-hidden="true"></div>
  <div class="pdpS5__grain" aria-hidden="true"></div>
  <div class="pdpS5__axis" aria-hidden="true"></div>

  <div class="pdpS5__top">
    <div class="pdpS5__kicker">${esc(t(lang, "ROLCONTEXT", "ROLE CONTEXT"))}</div>
    <div class="pdpS5__title">
      ${esc(
        t(
          lang,
          "WAT DE ROL VRAAGT",
          "WHAT THE ROLE REQUIRES"
        )
      )}
    </div>
    <div class="pdpS5__titleMarker" aria-hidden="true"></div>
  </div>

  <div class="pdpS5__gridTop">
    <div class="pdpS5__card pdpS5__card--role">
      <div class="pdpS5__cardHead">
        ${esc(t(lang, "SPELMOMENTEN", "GAME MOMENTS"))}
      </div>
      ${bulletList(roleItems)}
    </div>

    <div class="pdpS5__card pdpS5__card--phase">
      <div class="pdpS5__cardHead">
        ${esc(
          t(
            lang,
            "ZONES / CONTEXT",
            "ZONES / CONTEXT"
          )
        )}
      </div>
      ${bulletList(phaseItems)}
    </div>
  </div>

  <div class="pdpS5__impactCard">
    <div class="pdpS5__cardHead pdpS5__cardHead--impact">
      ${esc(
        t(
          lang,
          "PRINCIPES DIE HIER GELDEN",
          "PRINCIPLES THAT MATTER HERE"
        )
      )}
    </div>

    <div class="pdpS5__impactGrid">
      <div class="pdpS5__impactCol pdpS5__impactCol--win">
        <div class="pdpS5__impactLabel">
          ${esc(t(lang, "PRINCIPES 1–3", "PRINCIPLES 1–3"))}
        </div>
        ${bulletList(principleLeft, "impact")}
      </div>

      <div class="pdpS5__impactDivider" aria-hidden="true"></div>

      <div class="pdpS5__impactCol pdpS5__impactCol--loss">
        <div class="pdpS5__impactLabel">
          ${esc(t(lang, "PRINCIPES 4–6", "PRINCIPLES 4–6"))}
        </div>
        ${bulletList(principleRight, "impact")}
      </div>
    </div>
  </div>

  <style>
    .pdpS5{
      position:relative;
      height:100%;
      border-radius:18px;
      overflow:hidden;
      background:#0B0D10;
      color:#fff;
    }

    .pdpS5 *{
      box-sizing:border-box;
    }

    .pdpS5__wm{
      position:absolute;
      right:-18mm;
      top:-12mm;
      width:132mm;
      height:132mm;
      opacity:.036;
      z-index:0;
      pointer-events:none;
      filter:blur(.2px);
    }

    .pdpS5__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
    }

    .pdpS5__wash{
      position:absolute;
      inset:0;
      background:
        radial-gradient(
          circle at 16% 84%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, black 10%) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 84% 18%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 8%, black 18%) 0%,
          transparent 28%
        ),
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 6%, black 16%) 0%,
          transparent 60%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS5__vignette{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at center, transparent 46%, rgba(0,0,0,.18) 100%),
        linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.14));
      z-index:0;
      pointer-events:none;
    }

    .pdpS5__grain{
      position:absolute;
      inset:0;
      opacity:.022;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:5px 5px, 5px 5px;
      z-index:0;
      pointer-events:none;
    }

    .pdpS5__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:16mm;
      width:4px;
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 96%, #fff 4%) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 76%, transparent) 58%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 16%, transparent) 100%
        );
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        0 0 28px color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, transparent);
      opacity:.98;
      z-index:1;
    }

    .pdpS5__top{
      position:absolute;
      left:26mm;
      right:16mm;
      top:18mm;
      height:27mm;
      z-index:2;
      overflow:hidden;
    }

    .pdpS5__kicker{
      font-size:9.5pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
      font-weight:640;
      line-height:1.1;
      margin-bottom:6px;
    }

    .pdpS5__title{
      font-size:22pt;
      line-height:1.02;
      letter-spacing:-0.02em;
      font-weight:840;
      text-transform:uppercase;
      color:#fff;
      max-width:16ch;
      text-shadow:0 8px 24px rgba(0,0,0,.18);
    }

    .pdpS5__titleMarker{
      width:22mm;
      height:2px;
      margin-top:6px;
      border-radius:999px;
      background:
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 94%, #fff 2%) 0%,
          transparent 100%
        );
      opacity:.82;
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent);
    }

    .pdpS5__gridTop{
      position:absolute;
      left:26mm;
      right:16mm;
      top:40mm;
      height:76mm;
      z-index:2;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    }

    .pdpS5__impactCard{
      position:absolute;
      left:26mm;
      right:16mm;
      top:122mm;
      bottom:14mm;
      z-index:2;
      border-radius:18px;
      padding:14px 16px;
      overflow:hidden;
      border:1px solid color-mix(in srgb, var(--accent-secondary, var(--accent)) 22%, rgba(255,255,255,.10));
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.18) 0%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 9%, rgba(0,0,0,.14)) 100%
        );
      box-shadow:
        0 14px 34px rgba(0,0,0,.30),
        inset 0 0 0 1px rgba(255,255,255,.02);
    }

    .pdpS5__impactGrid{
      display:grid;
      grid-template-columns:1fr 1px 1fr;
      gap:14px;
      align-items:stretch;
      min-height:0;
      height:calc(100% - 22px);
    }

    .pdpS5__impactCol{
      min-width:0;
      display:flex;
      flex-direction:column;
      justify-content:flex-start;
    }

    .pdpS5__impactCol--win{
      padding-right:4px;
    }

    .pdpS5__impactCol--loss{
      padding-left:4px;
    }

    .pdpS5__impactDivider{
      width:1px;
      align-self:stretch;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.04) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, rgba(255,255,255,.08)) 20%,
          rgba(255,255,255,.14) 50%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 12%, rgba(255,255,255,.08)) 80%,
          rgba(255,255,255,.04) 100%
        );
      border-radius:999px;
      opacity:.88;
    }

    .pdpS5__impactLabel{
      font-size:8.2pt;
      letter-spacing:.20em;
      text-transform:uppercase;
      color:rgba(255,255,255,.54);
      font-weight:760;
      margin-bottom:9px;
      line-height:1.1;
    }

    .pdpS5__card{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      overflow:hidden;
      min-height:0;
      padding:13px 14px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.04) 0%,
          rgba(255,255,255,.025) 100%
        );
      box-shadow:
        0 12px 32px rgba(0,0,0,.28),
        inset 0 0 0 1px rgba(255,255,255,.02);
    }

    .pdpS5__card--role{
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.045) 0%,
          rgba(255,255,255,.024) 100%
        );
    }

    .pdpS5__card--phase{
      border:1px solid color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, rgba(255,255,255,.08));
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.05) 0%,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 8%, rgba(255,255,255,.025)) 100%
        );
      box-shadow:
        0 14px 34px rgba(0,0,0,.30),
        inset 0 0 0 1px rgba(255,255,255,.022);
    }

    .pdpS5__cardHead{
      font-size:8.8pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.50);
      font-weight:720;
      margin-bottom:9px;
      line-height:1.1;
    }

    .pdpS5__cardHead--impact{
      color:rgba(255,255,255,.54);
      margin-bottom:12px;
    }

    .pdpS5__list{
      list-style:none;
      padding:0;
      margin:0;
      display:flex;
      flex-direction:column;
      gap:9px;
    }

    .pdpS5__li{
      display:flex;
      gap:9px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS5__dot{
      width:7px;
      height:7px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      margin-top:4px;
      flex:0 0 auto;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 22%, transparent),
        0 0 10px color-mix(in srgb, var(--accent-mix, var(--accent)) 14%, transparent);
    }

    .pdpS5__li span:last-child{
      font-size:12pt;
      line-height:1.28;
      color:rgba(255,255,255,.82);
      font-weight:500;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS5__li--impact span:last-child{
      font-size:12.4pt;
      line-height:1.30;
      color:rgba(255,255,255,.88);
      font-weight:560;
    }

    .pdpS5__empty{
      min-height:10px;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 4 ---------------- */
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

  const wm = safeText(logoUrl);
  const wmHtml = wm
    ? `<div class="pdpS3__wm" aria-hidden="true">
         <img src="${esc(wm)}" alt="${esc(clubName)} watermark" />
       </div>`
    : ``;

  const observations = notEmpty(whatWeSeeItems).slice(0, 3);
  const contexts = notEmpty(momentItems).slice(0, 3);
  const effects = notEmpty(effectItems).slice(0, 3);

  const videos = [...(videoSlots || []).slice(0, 3)];
  while (videos.length < 3) videos.push({ status: "pending" });

  const videoMetaLine = (slot: Slide3VideoSlot) => {
    const parts = [
      safeText(slot.match_or_session),
      safeText(slot.timestamp),
    ].filter(Boolean);

    return parts.length ? parts.join(" • ") : "";
  };

  const stripHead = t(lang, "VIDEO'S (VOORBEELDEN)", "VIDEOS (EXAMPLES)");

  const videoCard = (slot: Slide3VideoSlot) => {
    if (slot.status === "active") {
      const sub = videoMetaLine(slot);

      return `
        <a class="pdpS3__videoCard pdpS3__videoCard--active" href="${esc(
          slot.url || "#"
        )}">
          <div class="pdpS3__videoThumb">
            ${
              slot.thumbnail_url
                ? `<img src="${esc(slot.thumbnail_url)}" alt="" />`
                : `<div class="pdpS3__videoFallback"></div>`
            }
            <div class="pdpS3__videoShade"></div>
            <div class="pdpS3__playWrap">
              <div class="pdpS3__play"></div>
            </div>
          </div>

          <div class="pdpS3__videoMeta">
            <div class="pdpS3__videoTitle">${esc(
              slot.title || t(lang, "Video", "Video")
            )}</div>
            <div class="pdpS3__videoSub ${
              sub ? "" : "pdpS3__videoSub--empty"
            }">${esc(sub || "\u00A0")}</div>
          </div>
        </a>
      `;
    }

    return `
      <div class="pdpS3__videoCard pdpS3__videoCard--empty">
        <div class="pdpS3__videoThumb pdpS3__videoThumb--empty">
          <div class="pdpS3__videoShade"></div>
          <div class="pdpS3__playWrap">
            <div class="pdpS3__play pdpS3__play--disabled"></div>
          </div>
        </div>

        <div class="pdpS3__videoMeta">
          <div class="pdpS3__videoTitle">${esc(
            t(lang, "Geen video geüpload", "No video uploaded")
          )}</div>
          <div class="pdpS3__videoSub pdpS3__videoSub--empty">&nbsp;</div>
        </div>
      </div>
    `;
  };

  const bulletList = (items: string[], variant = "") =>
    items.length
      ? `<ul class="pdpS3__list">
          ${items
            .map(
              (x) => `
                <li class="pdpS3__li ${variant}">
                  <span class="pdpS3__dot"></span>
                  <span>${esc(x)}</span>
                </li>`
            )
            .join("")}
        </ul>`
      : `<div class="pdpS3__empty"></div>`;

  return `
<section class="page pdpS3" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS3__wash" aria-hidden="true"></div>
  <div class="pdpS3__vignette" aria-hidden="true"></div>
  <div class="pdpS3__grain" aria-hidden="true"></div>
  <div class="pdpS3__axis" aria-hidden="true"></div>

  <div class="pdpS3__top">
    <div class="pdpS3__kicker">${esc(t(lang, "REALITEIT", "REALITY"))}</div>
    <div class="pdpS3__title">${esc(
      t(lang, "WAAR STAAN WE NU", "WHERE ARE WE NOW")
    )}</div>
    <div class="pdpS3__titleMarker" aria-hidden="true"></div>
  </div>

  <div class="pdpS3__midRow">
    <div class="pdpS3__card pdpS3__card--moment">
      <div class="pdpS3__head">${esc(
        t(lang, "WANNEER ZIEN WE DIT", "WHEN DO WE SEE THIS")
      )}</div>
      ${bulletList(contexts)}
    </div>

    <div class="pdpS3__card pdpS3__card--behaviour">
      <div class="pdpS3__head">${esc(
        t(lang, "WAT ZIEN WE NU", "WHAT WE SEE NOW")
      )}</div>
      <div class="pdpS3__behaviourBody">
        <div class="pdpS3__behaviourRail"></div>
        <div class="pdpS3__behaviourText">
          ${bulletList(observations, "pdpS3__li--behaviour")}
        </div>
      </div>
    </div>
  </div>

  <div class="pdpS3__effectCard">
    <div class="pdpS3__head">${esc(
      t(lang, "EFFECT OP HET SPEL", "EFFECT ON THE GAME")
    )}</div>
    ${bulletList(effects, "pdpS3__li--effect")}
  </div>

  <div class="pdpS3__videoStrip">
    <div class="pdpS3__videoStripHead">${esc(stripHead)}</div>
    <div class="pdpS3__videoGrid">
      ${videoCard(videos[0])}
      ${videoCard(videos[1])}
      ${videoCard(videos[2])}
    </div>
  </div>

  <style>
    .pdpS3{
      position:relative;
      height:100%;
      background:#0B0D10;
      color:#fff;
      border-radius:18px;
      overflow:hidden;
    }

    .pdpS3 *{
      box-sizing:border-box;
    }

    .pdpS3__wm{
      position:absolute;
      right:-18mm;
      bottom:-18mm;
      width:136mm;
      height:136mm;
      opacity:.038;
      z-index:0;
      pointer-events:none;
      filter:blur(.2px);
    }

    .pdpS3__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
    }

    .pdpS3__wash{
      position:absolute;
      inset:0;
      background:
        radial-gradient(
          circle at 16% 18%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 11%, black 8%) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 84% 78%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 7%, black 18%) 0%,
          transparent 28%
        ),
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 6%, black 14%) 0%,
          transparent 60%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS3__vignette{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at center, transparent 46%, rgba(0,0,0,.18) 100%),
        linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.16));
      z-index:0;
      pointer-events:none;
    }

    .pdpS3__grain{
      position:absolute;
      inset:0;
      opacity:.022;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:5px 5px, 5px 5px;
      z-index:0;
      pointer-events:none;
    }

    .pdpS3__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:16mm;
      width:4px;
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 96%, #fff 4%) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 78%, transparent) 58%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 16%, transparent) 100%
        );
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        0 0 28px color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, transparent);
      opacity:.98;
      z-index:1;
    }

    .pdpS3__top{
      position:absolute;
      left:26mm;
      right:16mm;
      top:18mm;
      height:27mm;
      z-index:2;
      overflow:hidden;
    }

    .pdpS3__kicker{
      font-size:9.5pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
      font-weight:640;
      line-height:1.1;
      margin-bottom:6px;
    }

    .pdpS3__title{
      font-size:22pt;
      line-height:1.02;
      letter-spacing:-0.02em;
      font-weight:840;
      text-transform:uppercase;
      color:#fff;
      max-width:20ch;
      text-shadow:0 8px 24px rgba(0,0,0,.18);
    }

    .pdpS3__titleMarker{
      width:22mm;
      height:2px;
      margin-top:6px;
      border-radius:999px;
      background:
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 94%, #fff 2%) 0%,
          transparent 100%
        );
      opacity:.82;
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent);
    }

    .pdpS3__midRow{
      position:absolute;
      left:26mm;
      right:16mm;
      top:40mm;
      height:76mm;
      z-index:2;
      display:grid;
      grid-template-columns:1fr 1.18fr;
      gap:10px;
    }

    .pdpS3__effectCard{
      position:absolute;
      left:26mm;
      right:16mm;
      top:122mm;
      height:56mm;
      z-index:2;
      border:1px solid color-mix(in srgb, var(--accent-secondary, var(--accent)) 22%, rgba(255,255,255,.08));
      border-radius:18px;
      padding:13px 14px;
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.18) 0%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 9%, rgba(0,0,0,.12)) 100%
        );
      overflow:hidden;
      box-shadow:
        0 12px 32px rgba(0,0,0,.28),
        inset 0 0 0 1px rgba(255,255,255,.02);
    }

    .pdpS3__videoStrip{
      position:absolute;
      left:26mm;
      right:16mm;
      top:184mm;
      bottom:14mm;
      z-index:2;
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:10px 10px 9px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.035) 0%,
          rgba(255,255,255,.02) 100%
        );
      overflow:hidden;
      box-shadow:
        0 12px 32px rgba(0,0,0,.26),
        inset 0 0 0 1px rgba(255,255,255,.018);
    }

    .pdpS3__videoStripHead{
      font-size:8.6pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.50);
      font-weight:720;
      line-height:1.1;
      margin-bottom:6px;
    }

    .pdpS3__videoGrid{
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      gap:8px;
      height:calc(100% - 14px);
      align-items:stretch;
    }

    .pdpS3__card{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      overflow:hidden;
      min-height:0;
      padding:13px 14px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.04) 0%,
          rgba(255,255,255,.025) 100%
        );
      box-shadow:
        0 12px 32px rgba(0,0,0,.28),
        inset 0 0 0 1px rgba(255,255,255,.02);
    }

    .pdpS3__card--behaviour{
      border:1px solid color-mix(in srgb, var(--accent-primary, var(--accent)) 22%, rgba(255,255,255,.08));
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.05) 0%,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 9%, rgba(255,255,255,.025)) 100%
        );
      box-shadow:
        0 18px 40px rgba(0,0,0,.34),
        inset 0 0 0 1px rgba(255,255,255,.03);
    }

    .pdpS3__head{
      font-size:8.8pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.50);
      font-weight:720;
      margin-bottom:8px;
      line-height:1.1;
    }

    .pdpS3__list{
      list-style:none;
      margin:0;
      padding:0;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .pdpS3__li{
      display:flex;
      gap:9px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS3__dot{
      width:7px;
      height:7px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      margin-top:4px;
      flex:0 0 auto;
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 22%, transparent),
        0 0 10px color-mix(in srgb, var(--accent-mix, var(--accent)) 14%, transparent);
    }

    .pdpS3__li span:last-child{
      font-size:12pt;
      line-height:1.28;
      color:rgba(255,255,255,.80);
      font-weight:500;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS3__li--effect span:last-child{
      font-size:12.5pt;
      line-height:1.3;
      color:rgba(255,255,255,.86);
      font-weight:560;
    }

    .pdpS3__behaviourBody{
      display:flex;
      gap:10px;
      align-items:flex-start;
      min-height:0;
    }

    .pdpS3__behaviourRail{
      width:2px;
      height:38mm;
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 58%, rgba(255,255,255,.16)) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, transparent) 100%
        );
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, transparent);
      flex:0 0 auto;
      opacity:.98;
    }

    .pdpS3__behaviourText{
      min-width:0;
      flex:1 1 auto;
    }

    .pdpS3__li--behaviour span:last-child{
      font-size:13.4pt;
      line-height:1.28;
      color:rgba(255,255,255,.90);
      font-weight:600;
      letter-spacing:.003em;
    }

    .pdpS3__empty{
      min-height:10px;
    }

    .pdpS3__videoCard{
      display:grid;
      grid-template-rows:45mm minmax(12mm, 1fr);
      gap:3.2mm;
      width:100%;
      height:100%;
      border-radius:14px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.08);
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.04) 0%,
          rgba(255,255,255,.025) 100%
        );
      text-decoration:none;
      color:inherit;
      padding:8px 8px 10px;
      position:relative;
      min-height:0;
      box-shadow:
        0 10px 24px rgba(0,0,0,.22),
        inset 0 0 0 1px rgba(255,255,255,.018);
    }

    .pdpS3__videoCard--active{
      border:1px solid color-mix(in srgb, var(--accent-primary, var(--accent)) 26%, rgba(255,255,255,.08));
      box-shadow:
        0 14px 34px rgba(0,0,0,.35),
        0 0 0 1px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        inset 0 0 0 1px rgba(255,255,255,.018);
      transform:translateY(-1px);
    }

    .pdpS3__videoThumb{
      position:relative;
      height:100%;
      border-radius:9px;
      overflow:hidden;
      background:#121418;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.03),
        0 8px 20px rgba(0,0,0,.22);
    }

    .pdpS3__videoThumb img{
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .pdpS3__videoFallback{
      width:100%;
      height:100%;
      background:
        radial-gradient(circle at 30% 35%, rgba(255,255,255,.07), transparent 30%),
        linear-gradient(145deg, rgba(255,255,255,.04), rgba(0,0,0,.16));
    }

    .pdpS3__videoThumb--empty{
      background:
        radial-gradient(circle at 30% 35%, rgba(255,255,255,.07), transparent 30%),
        linear-gradient(145deg, rgba(255,255,255,.04), rgba(0,0,0,.16));
    }

    .pdpS3__videoShade{
      position:absolute;
      inset:0;
      background:
        linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.34)),
        linear-gradient(90deg, rgba(0,0,0,.08), rgba(0,0,0,.20));
      z-index:1;
    }

    .pdpS3__playWrap{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:3;
      pointer-events:none;
    }

    .pdpS3__play{
      width:11mm;
      height:11mm;
      border-radius:999px;
      position:relative;
      background:rgba(255,255,255,.16);
      border:1px solid rgba(255,255,255,.32);
      box-shadow:
        0 8px 18px rgba(0,0,0,.30),
        inset 0 0 0 1px rgba(255,255,255,.06);
      opacity:1;
    }

    .pdpS3__play::before{
      content:"";
      position:absolute;
      left:4.1mm;
      top:3.1mm;
      border-left:3mm solid rgba(255,255,255,.96);
      border-top:1.9mm solid transparent;
      border-bottom:1.9mm solid transparent;
    }

    .pdpS3__play--disabled{
      background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.26);
      box-shadow:
        0 8px 18px rgba(0,0,0,.28),
        inset 0 0 0 1px rgba(255,255,255,.04);
      opacity:1;
    }

    .pdpS3__play--disabled::before{
      border-left-color:rgba(255,255,255,.90);
    }

    .pdpS3__videoMeta{
      min-height:0;
      display:flex;
      flex-direction:column;
      justify-content:flex-start;
      gap:1.4mm;
      padding:0 2px 4px;
      overflow:visible;
    }

    .pdpS3__videoTitle{
      font-size:8.8pt;
      line-height:1.22;
      color:rgba(255,255,255,.92);
      font-weight:600;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-height:0;
      padding-bottom:1px;
    }

    .pdpS3__videoSub{
      font-size:7.3pt;
      line-height:1.22;
      color:rgba(255,255,255,.58);
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-height:0;
      padding-bottom:2px;
    }

    .pdpS3__videoSub--empty{
      opacity:0;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 5 ---------------- */
export function pageDevelopmentRoute(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;

  title: string;
  subtitle: string;

  trainingText: string;
  matchText: string;
  videoText: string;
  offFieldText: string;

  playerOwnText: string;

  playerText: string;
  coachText: string;
  analystText: string;
  staffText: string;
}) {
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
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

  const wm = safeText(logoUrl);
  const wmHtml = wm
    ? `<div class="pdpS4__wm" aria-hidden="true"><img src="${esc(
        wm
      )}" alt="${esc(clubName)} watermark" /></div>`
    : ``;

  const executionOwner = safeText(playerText);
  const guidanceOwner = [coachText, analystText, staffText]
    .map((x) => safeText(x))
    .filter(Boolean)
    .join(" / ");

  const safeOwn = safeText(playerOwnText);
  const safeTraining = safeText(trainingText);
  const safeMatch = safeText(matchText);
  const safeVideo = safeText(videoText);
  const safeOffField = safeText(offFieldText);

  return `
<section class="page pdpS4" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS4__wash" aria-hidden="true"></div>
  <div class="pdpS4__vignette" aria-hidden="true"></div>
  <div class="pdpS4__grain" aria-hidden="true"></div>
  <div class="pdpS4__axis" aria-hidden="true"></div>

  <div class="pdpS4__top">
    <div class="pdpS4__kicker">${esc(t(lang, "AANPAK", "APPROACH"))}</div>
    <div class="pdpS4__title">
      ${esc(t(lang, "HOE WE HIERAAN WERKEN", "HOW WE WORK ON THIS"))}
    </div>
    <div class="pdpS4__titleMarker" aria-hidden="true"></div>
  </div>

  <div class="pdpS4__heroCard">
    <div class="pdpS4__heroHead">
      ${esc(t(lang, "ZO GAAN WE DIT DOEN", "THIS IS HOW WE DO IT"))}
    </div>

    <div class="pdpS4__heroBody">
      <div class="pdpS4__heroRail"></div>
      <div class="pdpS4__heroText">${esc(safeOwn)}</div>
    </div>
  </div>

  <div class="pdpS4__midGrid">
    <div class="pdpS4__clusterCard pdpS4__clusterCard--left">
      <div class="pdpS4__clusterHead">
        ${esc(t(lang, "TRAINING + BEELDEN", "TRAINING + VIDEO"))}
      </div>

      <div class="pdpS4__subStack">
        <div class="pdpS4__subPanel">
          <div class="pdpS4__subHead">${esc(t(lang, "TRAINING", "TRAINING"))}</div>
          <div class="pdpS4__subText">${esc(safeTraining)}</div>
        </div>

        <div class="pdpS4__subPanel pdpS4__subPanel--secondary">
          <div class="pdpS4__subHead">${esc(t(lang, "BEELDEN", "VIDEO"))}</div>
          <div class="pdpS4__subText">${esc(safeVideo)}</div>
        </div>
      </div>
    </div>

    <div class="pdpS4__clusterCard pdpS4__clusterCard--right">
      <div class="pdpS4__clusterHead">
        ${esc(t(lang, "WEDSTRIJD + OFF-FIELD", "MATCH + OFF-FIELD"))}
      </div>

      <div class="pdpS4__subStack">
        <div class="pdpS4__subPanel">
          <div class="pdpS4__subHead">${esc(t(lang, "WEDSTRIJD", "MATCH"))}</div>
          <div class="pdpS4__subText">${esc(safeMatch)}</div>
        </div>

        <div class="pdpS4__subPanel pdpS4__subPanel--secondary">
          <div class="pdpS4__subHead">${esc(t(lang, "OFF-FIELD", "OFF-FIELD"))}</div>
          <div class="pdpS4__subText">${esc(safeOffField)}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="pdpS4__ownerStrip">
    <div class="pdpS4__ownerCol">
      <div class="pdpS4__ownerLabel">${esc(
        t(lang, "WIE VOERT HET UIT", "WHO EXECUTES")
      )}</div>
      <div class="pdpS4__ownerValue">${esc(executionOwner)}</div>
    </div>

    <div class="pdpS4__ownerDivider" aria-hidden="true"></div>

    <div class="pdpS4__ownerCol">
      <div class="pdpS4__ownerLabel">${esc(
        t(lang, "WIE STUURT DIT AAN", "WHO DRIVES THIS")
      )}</div>
      <div class="pdpS4__ownerValue pdpS4__ownerValue--secondary">${esc(
        guidanceOwner
      )}</div>
    </div>
  </div>

  <style>
    .pdpS4{
      position:relative;
      height:100%;
      background:#0B0D10;
      color:#fff;
      border-radius:18px;
      overflow:hidden;
    }

    .pdpS4 *{
      box-sizing:border-box;
    }

    .pdpS4__wm{
      position:absolute;
      right:-18mm;
      bottom:-14mm;
      width:132mm;
      height:132mm;
      opacity:.036;
      z-index:0;
      pointer-events:none;
      filter:blur(.2px);
    }

    .pdpS4__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
    }

    .pdpS4__wash{
      position:absolute;
      inset:0;
      background:
        radial-gradient(
          circle at 18% 82%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, black 10%) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 84% 18%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 8%, black 18%) 0%,
          transparent 28%
        ),
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 6%, black 14%) 0%,
          transparent 60%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS4__vignette{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at center, transparent 46%, rgba(0,0,0,.18) 100%),
        linear-gradient(180deg, rgba(0,0,0,.02), rgba(0,0,0,.15));
      z-index:0;
      pointer-events:none;
    }

    .pdpS4__grain{
      position:absolute;
      inset:0;
      opacity:.022;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:5px 5px, 5px 5px;
      z-index:0;
      pointer-events:none;
    }

    .pdpS4__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:16mm;
      width:4px;
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 96%, #fff 4%) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 78%, transparent) 58%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 16%, transparent) 100%
        );
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        0 0 14px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent),
        0 0 28px color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, transparent);
      opacity:.98;
      z-index:1;
    }

    .pdpS4__top{
      position:absolute;
      left:26mm;
      right:16mm;
      top:18mm;
      height:24mm;
      z-index:2;
      overflow:hidden;
    }

    .pdpS4__kicker{
      font-size:9.5pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
      font-weight:640;
      line-height:1.1;
      margin-bottom:6px;
    }

    .pdpS4__title{
      font-size:19.8pt;
      line-height:1.02;
      letter-spacing:-0.02em;
      font-weight:840;
      text-transform:uppercase;
      color:#fff;
      max-width:none;
      white-space:nowrap;
      text-shadow:0 8px 24px rgba(0,0,0,.18);
    }

    .pdpS4__titleMarker{
      width:22mm;
      height:2px;
      margin-top:6px;
      border-radius:999px;
      background:
        linear-gradient(
          90deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 94%, #fff 2%) 0%,
          transparent 100%
        );
      opacity:.82;
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, transparent);
    }

    .pdpS4__heroCard{
      position:absolute;
      left:26mm;
      right:16mm;
      top:40mm;
      height:46mm;
      z-index:2;
      border-radius:18px;
      padding:13px 15px;
      overflow:hidden;
      border:1px solid color-mix(in srgb, var(--accent-primary, var(--accent)) 24%, rgba(255,255,255,.10));
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.18) 0%,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 12%, rgba(0,0,0,.14)) 100%
        );
      box-shadow:
        0 16px 38px rgba(0,0,0,.34),
        inset 0 0 0 1px rgba(255,255,255,.025);
    }

    .pdpS4__heroHead{
      font-size:8.7pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.54);
      font-weight:720;
      margin-bottom:9px;
      line-height:1.1;
    }

    .pdpS4__heroBody{
      display:flex;
      gap:11px;
      align-items:flex-start;
      min-height:0;
    }

    .pdpS4__heroRail{
      width:2px;
      height:24mm;
      border-radius:999px;
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 60%, rgba(255,255,255,.18)) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, transparent) 100%
        );
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, transparent);
      flex:0 0 auto;
      opacity:.98;
    }

    .pdpS4__heroText{
      font-size:13.2pt;
      line-height:1.28;
      color:rgba(255,255,255,.92);
      font-weight:600;
      letter-spacing:.002em;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
      max-width:44ch;
    }

    .pdpS4__midGrid{
      position:absolute;
      left:26mm;
      right:16mm;
      top:92mm;
      bottom:48mm;
      z-index:2;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    }

    .pdpS4__clusterCard{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      overflow:hidden;
      min-height:0;
      padding:13px 14px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.04) 0%,
          rgba(255,255,255,.025) 100%
        );
      box-shadow:
        0 12px 32px rgba(0,0,0,.28),
        inset 0 0 0 1px rgba(255,255,255,.02);
      display:flex;
      flex-direction:column;
    }

    .pdpS4__clusterCard--left{
      border:1px solid color-mix(in srgb, var(--accent-primary, var(--accent)) 18%, rgba(255,255,255,.08));
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.045) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 7%, rgba(255,255,255,.025)) 100%
        );
    }

    .pdpS4__clusterCard--right{
      border:1px solid color-mix(in srgb, var(--accent-secondary, var(--accent)) 18%, rgba(255,255,255,.08));
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.045) 0%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 7%, rgba(255,255,255,.025)) 100%
        );
    }

    .pdpS4__clusterHead{
      font-size:8.8pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.52);
      font-weight:720;
      margin-bottom:10px;
      line-height:1.1;
      flex:0 0 auto;
    }

    .pdpS4__subStack{
      display:grid;
      grid-template-rows:1fr 1fr;
      gap:10px;
      min-height:0;
      flex:1 1 auto;
    }

    .pdpS4__subPanel{
      min-height:0;
      border-radius:14px;
      padding:11px 11px 10px;
      border:1px solid rgba(255,255,255,.06);
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.03) 0%,
          rgba(255,255,255,.015) 100%
        );
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.012);
      overflow:hidden;
    }

    .pdpS4__subPanel--secondary{
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.10) 0%,
          rgba(255,255,255,.012) 100%
        );
    }

    .pdpS4__subHead{
      font-size:8pt;
      letter-spacing:.20em;
      text-transform:uppercase;
      color:rgba(255,255,255,.42);
      font-weight:760;
      margin-bottom:7px;
      line-height:1.1;
    }

    .pdpS4__subText{
      font-size:11.3pt;
      line-height:1.28;
      color:rgba(255,255,255,.84);
      font-weight:520;
      display:-webkit-box;
      -webkit-line-clamp:5;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS4__ownerStrip{
      position:absolute;
      left:26mm;
      right:16mm;
      bottom:14mm;
      height:28mm;
      z-index:2;
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      overflow:hidden;
      padding:10px 14px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.035) 0%,
          rgba(255,255,255,.02) 100%
        );
      box-shadow:
        0 12px 30px rgba(0,0,0,.24),
        inset 0 0 0 1px rgba(255,255,255,.018);
      display:grid;
      grid-template-columns:1fr 1px 1fr;
      gap:12px;
      align-items:center;
    }

    .pdpS4__ownerCol{
      min-width:0;
    }

    .pdpS4__ownerDivider{
      width:1px;
      align-self:stretch;
      background:
        linear-gradient(
          180deg,
          rgba(255,255,255,.04) 0%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, rgba(255,255,255,.08)) 50%,
          rgba(255,255,255,.04) 100%
        );
      border-radius:999px;
      opacity:.9;
    }

    .pdpS4__ownerLabel{
      font-size:7.9pt;
      letter-spacing:.20em;
      text-transform:uppercase;
      color:rgba(255,255,255,.46);
      font-weight:760;
      margin-bottom:5px;
      line-height:1.1;
    }

    .pdpS4__ownerValue{
      font-size:10.9pt;
      line-height:1.20;
      color:rgba(255,255,255,.92);
      font-weight:620;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .pdpS4__ownerValue--secondary{
      color:rgba(255,255,255,.80);
      font-weight:560;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 6 ---------------- */
export function pageSuccess(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;

  inGame: string[];
  behaviour: string[];
  signals: string[];
}) {
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
    inGame,
    behaviour,
    signals,
  } = args;

  const wm = safeText(logoUrl);
  const wmHtml = wm
    ? `<div class="pdpS6__wm"><img src="${esc(wm)}" alt="${esc(
        clubName
      )} watermark" /></div>`
    : ``;

  const bullets = (items: string[], variant = "") => {
    const cleaned = notEmpty(items).slice(0, 4);

    return cleaned.length
      ? `<ul class="pdpS6__list">
          ${cleaned
            .map(
              (x) => `
              <li class="pdpS6__li ${variant}">
                <span class="pdpS6__dot"></span>
                <span>${esc(x)}</span>
              </li>`
            )
            .join("")}
        </ul>`
      : `<div class="pdpS6__empty"></div>`;
  };

  return `
<section class="page pdpS6" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS6__wash"></div>
  <div class="pdpS6__vignette"></div>
  <div class="pdpS6__grain"></div>
  <div class="pdpS6__axis"></div>

  <div class="pdpS6__top">
    <div class="pdpS6__kicker">${esc(t(lang, "SUCCES", "SUCCESS"))}</div>
    <div class="pdpS6__title">
      ${esc(t(lang, "WANNEER IS DIT GOED", "WHEN IS THIS GOOD"))}
    </div>
    <div class="pdpS6__titleMarker"></div>
  </div>

  <div class="pdpS6__midRow">
    <div class="pdpS6__card">
      <div class="pdpS6__head">
        ${esc(t(lang, "IN HET SPEL", "IN THE GAME"))}
      </div>
      ${bullets(inGame)}
    </div>

    <div class="pdpS6__card pdpS6__card--accent">
      <div class="pdpS6__head">
        ${esc(t(lang, "IN GEDRAG", "IN BEHAVIOUR"))}
      </div>
      ${bullets(behaviour, "pdpS6__li--strong")}
    </div>
  </div>

  <div class="pdpS6__signalsCard">
    <div class="pdpS6__head">
      ${esc(
        t(
          lang,
          "EERSTE SIGNALEN DAT HET LANDT",
          "EARLY SIGNALS IT IS LANDING"
        )
      )}
    </div>

    ${bullets(signals, "pdpS6__li--signal")}
  </div>

  <style>
    .pdpS6{
      position:relative;
      height:100%;
      background:#0B0D10;
      color:#fff;
      border-radius:18px;
      overflow:hidden;
    }

    .pdpS6 *{ box-sizing:border-box; }

    .pdpS6__wm{
      position:absolute;
      right:-18mm;
      bottom:-18mm;
      width:130mm;
      height:130mm;
      opacity:.035;
    }

    .pdpS6__wm img{
      width:100%;
      height:100%;
      object-fit:contain;
    }

    .pdpS6__wash{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 10%, black) 0%, transparent 35%),
        radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--accent) 8%, black) 0%, transparent 30%);
    }

    .pdpS6__vignette{
      position:absolute;
      inset:0;
      background:radial-gradient(circle, transparent 50%, rgba(0,0,0,.2));
    }

    .pdpS6__grain{
      position:absolute;
      inset:0;
      opacity:.02;
      background-image:
        linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px);
      background-size:4px 4px;
    }

    .pdpS6__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:16mm;
      width:3px;
      background:var(--accent);
      opacity:.9;
    }

    .pdpS6__top{
      position:absolute;
      left:26mm;
      right:16mm;
      top:18mm;
      height:22mm;
    }

    .pdpS6__kicker{
      font-size:9pt;
      letter-spacing:.25em;
      text-transform:uppercase;
      color:rgba(255,255,255,.7);
    }

    .pdpS6__title{
      font-size:22pt;
      font-weight:840;
      text-transform:uppercase;
      white-space:nowrap;
    }

    .pdpS6__titleMarker{
      width:22mm;
      height:2px;
      margin-top:6px;
      background:var(--accent);
    }

    .pdpS6__midRow{
      position:absolute;
      left:26mm;
      right:16mm;
      top:40mm;
      height:78mm;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    }

    .pdpS6__card{
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;
      padding:14px;
      background:rgba(255,255,255,.03);
    }

    .pdpS6__card--accent{
      border:1px solid color-mix(in srgb, var(--accent) 20%, rgba(255,255,255,.08));
      background:rgba(255,255,255,.05);
    }

    .pdpS6__signalsCard{
      position:absolute;
      left:26mm;
      right:16mm;
      top:122mm;
      bottom:16mm;
      border-radius:18px;
      padding:14px;
      border:1px solid color-mix(in srgb, var(--accent) 22%, rgba(255,255,255,.08));
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.2),
          color-mix(in srgb, var(--accent) 10%, rgba(0,0,0,.2))
        );
    }

    .pdpS6__head{
      font-size:8.5pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.5);
      margin-bottom:10px;
    }

    .pdpS6__list{
      list-style:none;
      padding:0;
      margin:0;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .pdpS6__li{
      display:flex;
      gap:8px;
    }

    .pdpS6__dot{
      width:6px;
      height:6px;
      border-radius:50%;
      background:var(--accent);
      margin-top:6px;
      flex:0 0 auto;
    }

    .pdpS6__li span:last-child{
      font-size:12pt;
      line-height:1.3;
      color:rgba(255,255,255,.85);
    }

    .pdpS6__li--strong span:last-child{
      font-weight:600;
      color:#fff;
    }

    .pdpS6__li--signal span:last-child{
      color:rgba(255,255,255,.9);
      font-weight:500;
    }

    .pdpS6__empty{
      min-height:10px;
    }
  </style>
</section>
`;
}