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

/** ---------------- SLIDE 4 — DIAGNOSIS / REALITY (FINAL APPLE-SUBTLE VERSION) ---------------- */
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

  const fallbackObservation = t(
    lang,
    "Nog geen observatie toegevoegd",
    "No observation added yet"
  );
  const fallbackContext = t(
    lang,
    "Nog geen context toegevoegd",
    "No context added yet"
  );
  const fallbackEffect = t(
    lang,
    "Nog geen effect toegevoegd",
    "No effect added yet"
  );

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
        ? slot.title || t(lang, "Video", "Video")
        : "";

    const sub =
      slot.status === "active"
        ? videoMetaLine(slot)
        : t(lang, "Bewijs volgt", "Evidence pending");

    return `
      <div class="truthS4__videoCard truthS4__videoCard--${variant} ${
        slot.status === "active"
          ? "truthS4__videoCard--active"
          : "truthS4__videoCard--empty"
      }">
        <div class="truthS4__videoThumb">
          ${
  slot.status === "active"
    ? (
        slot.thumbnail_url
          ? `<img src="${esc(slot.thumbnail_url)}" alt="" />`
          : `<div class="truthS4__videoFallback truthS4__videoFallback--active"></div>`
      )
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
    <div class="truthS4__kicker">${esc(t(lang, "REALITEIT", "REALITY"))}</div>

    <div class="truthS4__hero">
      <div class="truthS4__headline">${esc(heroPrimary)}</div>
      <div class="truthS4__headlineSub">${esc(heroSecondary)}</div>
    </div>
  </div>

  <div class="truthS4__primary">
    <div class="truthS4__sectionLabel">${esc(
      t(lang, "WAT WE NU ZIEN", "WHAT WE SEE NOW")
    )}</div>

    <div class="truthS4__observations">
      ${renderObservationList(observations)}
    </div>
  </div>

  <div class="truthS4__secondary">
    <div class="truthS4__secondaryBlock truthS4__secondaryBlock--context">
      <div class="truthS4__sectionLabel">${esc(
        t(lang, "WAAR DIT ZICHTBAAR WORDT", "WHERE THIS BECOMES VISIBLE")
      )}</div>
      ${renderMiniList(contexts, fallbackContext, "context")}
    </div>

    <div class="truthS4__secondaryBlock truthS4__secondaryBlock--effect">
      <div class="truthS4__sectionLabel">${esc(
        t(lang, "GEVOLG VOOR HET SPEL", "EFFECT ON THE GAME")
      )}</div>
      ${renderMiniList(effects, fallbackEffect, "effect")}
    </div>
  </div>

  <div class="truthS4__evidence">
    <div class="truthS4__evidenceHead">
      <div class="truthS4__sectionLabel">${esc(
        t(lang, "BEWIJS / VIDEO", "EVIDENCE / VIDEO")
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
}

.truthS4__wm img{
  width:100%;
  height:100%;
  object-fit:contain;
}

    .truthS4__wm img{
  width:100%;
  height:100%;
  object-fit:contain;
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
      max-width:90%;
    }

    .truthS4__headline{
      max-width:100%;
      font-size:28.5pt;
      line-height:.95;
      letter-spacing:-.07em;
      font-weight:820;
      color:#FFFFFF;
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:balance;
    }

    .truthS4__headlineSub{
      margin-top:8px;
      max-width:95%;
      font-size:12.4pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      word-break:normal;
      overflow-wrap:break-word;
      text-wrap:balance;
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
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
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
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-height:0;
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
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .truthS4__videoSub--empty{
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

  const tt = (nl: string, en: string) => (lang === "nl" ? nl : en);

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

const fallbackTitle = tt(
  "Nog geen aanpak gedefinieerd",
  "No approach defined yet"
);

const fallbackSubtitle = tt(
  "Nog geen toelichting toegevoegd",
  "No explanation added yet"
);

const safeTitle = clean(title) || fallbackTitle;
const safeSubtitle = clean(subtitle) || fallbackSubtitle;

  const alignmentItems = [
    {
      label: tt("SPELER", "PLAYER"),
      text: clean(playerText || playerOwnText),
    },
    {
      label: tt("COACH", "COACH"),
      text: clean(coachText),
    },
    {
      label: tt("ANALIST", "ANALYST"),
      text: clean(analystText),
    },
    {
      label: tt("STAFF", "STAFF"),
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
          tt("AFSTEMMING", "ALIGNMENT")
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
    <div class="routeS5__kicker">${escapeHtml(tt("AANPAK", "APPROACH"))}</div>

    <div class="routeS5__hero">
      <div class="routeS5__title">${escapeHtml(safeTitle)}</div>
<div class="routeS5__subtitle">${escapeHtml(safeSubtitle)}</div>
    </div>
  </div>

  <div class="routeS5__grid">
    <div class="routeS5__block routeS5__block--primary">
      <div class="routeS5__label">${escapeHtml(tt("TRAINING", "TRAINING"))}</div>
      <div class="routeS5__list">
        ${renderList(
          trainingList,
          tt("Nog geen trainingsactie toegevoegd", "No training action added yet")
        )}
      </div>
    </div>

    <div class="routeS5__block routeS5__block--primary">
      <div class="routeS5__label">${escapeHtml(tt("MATCH", "MATCH"))}</div>
      <div class="routeS5__list">
        ${renderList(
          matchList,
          tt("Nog geen wedstrijdactie toegevoegd", "No match action added yet")
        )}
      </div>
    </div>

    <div class="routeS5__block">
      <div class="routeS5__label">${escapeHtml(tt("VIDEO", "VIDEO"))}</div>
      <div class="routeS5__list">
        ${renderList(
          videoList,
          tt("Nog geen videoactie toegevoegd", "No video action added yet")
        )}
      </div>
    </div>

    <div class="routeS5__block">
      <div class="routeS5__label">${escapeHtml(tt("OFF FIELD", "OFF FIELD"))}</div>
      <div class="routeS5__list">
        ${renderList(
          offFieldList,
          tt("Nog geen off-field actie toegevoegd", "No off-field action added yet")
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
}

.routeS5__wm img{
  width:100%;
  height:100%;
  object-fit:contain;
}

    .routeS5__wm img{
  width:100%;
  height:100%;
  object-fit:contain;
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
      max-width:78%;
    }

    .routeS5__title{
      max-width:100%;
      font-size:29pt;
      line-height:.95;
      letter-spacing:-.07em;
      font-weight:820;
      color:#FFFFFF;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
      text-wrap:balance;
    }

    .routeS5__subtitle{
      margin-top:8px;
      max-width:92%;
      font-size:12.2pt;
      line-height:1.18;
      letter-spacing:-.018em;
      font-weight:500;
      color:rgba(255,255,255,.58);
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      text-wrap:balance;
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
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
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
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
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