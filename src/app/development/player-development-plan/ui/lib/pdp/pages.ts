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

  const wm = (logoUrl || "").trim();
  const wmHtml = wm
    ? `<div class="pdpS2__wm" aria-hidden="true"><img src="${esc(
        wm
      )}" alt="${esc(clubName)} watermark" /></div>`
    : ``;

  const normalizeItems = (input: string | string[] | undefined | null) => {
    if (Array.isArray(input)) {
      return input
        .map((x) => String(x || "").trim())
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
  const focusText = String(focusBehaviour || "").trim();
  const targetText = String(targetBehaviour || "").trim();
  const hasTarget = !!targetText;
  const hasMoments = matchMoments.length > 0;
  const evalTxt = (evalLabel || t(lang, "EVALUATIE", "EVALUATION")).toUpperCase();

  const momentListHtml = hasMoments
    ? `<ul class="pdpS2__momentList">
        ${matchMoments
          .map(
            (item) => `
              <li class="pdpS2__momentItem">
                <span class="pdpS2__momentDot"></span>
                <span class="pdpS2__momentText">${esc(item)}</span>
              </li>
            `
          )
          .join("")}
      </ul>`
    : `<div class="pdpS2__momentEmpty"></div>`;

  return `
<section class="page pdpS2" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS2__wash" aria-hidden="true"></div>
  <div class="pdpS2__axis" aria-hidden="true"></div>

  <div class="pdpS2__inner">
    <div class="pdpS2__top">
      <div class="pdpS2__kicker">${esc(t(lang, "AFSPRAAK", "AGREEMENT"))}</div>

      <div class="pdpS2__hero">
        <div class="pdpS2__title">${esc(
          t(lang, "JOUW ONTWIKKELPUNT", "YOUR DEVELOPMENT POINT")
        )}</div>
        <div class="pdpS2__focus">${esc(focusText)}</div>
      </div>
    </div>

    <div class="pdpS2__middle">
      <div class="pdpS2__contentCard pdpS2__contentCard--target">
        <div class="pdpS2__sectionHead">${esc(
          t(lang, "GEWENST GEDRAG", "TARGET BEHAVIOUR")
        )}</div>
        <div class="pdpS2__targetText ${hasTarget ? "" : "pdpS2__targetText--empty"}">${esc(
          targetText
        )}</div>
      </div>

      <div class="pdpS2__contentCard pdpS2__contentCard--moments">
        <div class="pdpS2__sectionHead">${esc(
          t(lang, "WEDSTRIJDMOMENTEN", "MATCH MOMENTS")
        )}</div>
        ${momentListHtml}
      </div>
    </div>

    <div class="pdpS2__bottom">
      <div class="pdpS2__periodCard">
        <div class="pdpS2__periodTop">
          <div class="pdpS2__sectionHead pdpS2__sectionHead--period">${esc(
            t(lang, "ONTWIKKELPERIODE", "DEVELOPMENT PERIOD")
          )}</div>
          <div class="pdpS2__periodPill">${esc(durationWeeksLabel)}</div>
        </div>

        <div class="pdpS2__timeline" aria-hidden="true">
          <div class="pdpS2__timelineTrack"></div>
          <div class="pdpS2__timelineFill"></div>
          <div class="pdpS2__timelineDot pdpS2__timelineDot--start"></div>
          <div class="pdpS2__timelineDot pdpS2__timelineDot--end"></div>
        </div>

        <div class="pdpS2__periodMeta">
          <div class="pdpS2__periodCol">
            <div class="pdpS2__periodK">${esc(t(lang, "START", "START"))}</div>
            <div class="pdpS2__periodV">${esc(startDateLabel)}</div>
          </div>

          <div class="pdpS2__periodCol pdpS2__periodCol--right">
            <div class="pdpS2__periodK">${esc(evalTxt)}</div>
            <div class="pdpS2__periodV">${esc(endDateLabel)}</div>
          </div>
        </div>
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
      opacity:.038;
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
          circle at 22% 20%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 8%, black 10%) 0%,
          transparent 36%
        ),
        radial-gradient(
          circle at 74% 82%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 7%, black 18%) 0%,
          transparent 30%
        ),
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 6%, black 14%) 0%,
          transparent 58%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS2__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:12mm;
      width:3px;
      border-radius:3px;
      background:var(--accent-primary, var(--accent));
      opacity:.95;
      z-index:1;
    }

    .pdpS2__inner{
      position:relative;
      z-index:2;
      padding:18mm 16mm;
      padding-left:26mm;
      height:100%;
      display:grid;
      grid-template-rows:auto minmax(0,1fr) auto;
      gap:18px;
    }

    .pdpS2__top{
      display:flex;
      flex-direction:column;
      gap:14px;
      padding-top:.5mm;
    }

    .pdpS2__kicker{
      font-size:10.2pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
    }

    .pdpS2__hero{
      display:flex;
      flex-direction:column;
      gap:18px;
    }

    .pdpS2__title{
      font-size:26pt;
      line-height:1.02;
      letter-spacing:-0.02em;
      font-weight:860;
      text-transform:uppercase;
      max-width:20ch;
      text-wrap:balance;
    }

    .pdpS2__focus{
      font-size:22.2pt;
      line-height:1.16;
      letter-spacing:-0.022em;
      font-weight:780;
      color:rgba(255,255,255,.97);
      max-width:19ch;
      text-wrap:balance;
      overflow-wrap:anywhere;
      min-height:14mm;
    }

    .pdpS2__middle{
      min-height:0;
      display:grid;
      grid-template-rows:minmax(42mm, auto) minmax(28mm, 1fr);
      gap:18px;
      align-content:start;
      padding-top:2px;
    }

    .pdpS2__contentCard{
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:14px 16px;
      min-height:0;
      overflow:hidden;
    }

    .pdpS2__contentCard--target{
      background:rgba(255,255,255,.04);
    }

    .pdpS2__contentCard--moments{
      background:rgba(0,0,0,.12);
    }

    .pdpS2__sectionHead{
      font-size:9.3pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.46);
      font-weight:720;
      margin-bottom:10px;
    }

    .pdpS2__sectionHead--period{
      margin-bottom:0;
    }

    .pdpS2__targetText{
      font-size:16.6pt;
      line-height:1.44;
      color:rgba(255,255,255,.80);
      font-weight:520;
      text-wrap:balance;
      display:-webkit-box;
      -webkit-line-clamp:4;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-height:0;
    }

    .pdpS2__targetText--empty{
      min-height:24px;
    }

    .pdpS2__momentList{
      list-style:none;
      padding:0;
      margin:0;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .pdpS2__momentItem{
      display:flex;
      gap:10px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS2__momentDot{
      width:7px;
      height:7px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      box-shadow:0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, transparent);
      margin-top:9px;
      flex:0 0 auto;
    }

    .pdpS2__momentText{
      font-size:13.8pt;
      line-height:1.38;
      color:rgba(255,255,255,.78);
      font-weight:500;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS2__momentEmpty{
      min-height:20px;
    }

    .pdpS2__bottom{
      align-self:end;
    }

    .pdpS2__periodCard{
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      background:rgba(255,255,255,.04);
      padding:14px 16px 15px;
      display:grid;
      grid-template-rows:auto auto auto;
      gap:10px;
    }

    .pdpS2__periodTop{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:12px;
      min-width:0;
    }

    .pdpS2__periodPill{
      padding:4px 11px;
      border-radius:999px;
      border:1px solid color-mix(in srgb, var(--accent-mix, var(--accent)) 22%, rgba(255,255,255,.10));
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.18) 0%,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 10%, rgba(0,0,0,.18)) 100%
        );
      font-size:10pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      color:rgba(255,255,255,.84);
      font-weight:780;
      white-space:nowrap;
      flex:0 0 auto;
    }

    .pdpS2__timeline{
      position:relative;
      height:22px;
    }

    .pdpS2__timelineTrack{
      position:absolute;
      left:10px;
      right:10px;
      top:10px;
      height:3px;
      border-radius:999px;
      background:linear-gradient(
        90deg,
        rgba(255,255,255,.20) 0%,
        rgba(255,255,255,.16) 100%
      );
    }

    .pdpS2__timelineFill{
      position:absolute;
      left:10px;
      right:10px;
      top:10px;
      height:3px;
      border-radius:999px;
      background:var(--accent-gradient);
      opacity:.98;
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-mix, var(--accent)) 14%, transparent);
    }

    .pdpS2__timelineDot{
      position:absolute;
      top:3px;
      width:16px;
      height:16px;
      border-radius:999px;
      border:2px solid rgba(255,255,255,.16);
    }

    .pdpS2__timelineDot--start{
      left:0;
      background:rgba(255,255,255,.92);
      border-color:rgba(255,255,255,.28);
    }

    .pdpS2__timelineDot--end{
      right:0;
      background:var(--accent-secondary, var(--accent));
      border-color:color-mix(in srgb, var(--accent-secondary, var(--accent)) 74%, rgba(255,255,255,.24));
      box-shadow:0 0 0 4px color-mix(in srgb, var(--accent-mix, var(--accent)) 16%, transparent);
    }

    .pdpS2__periodMeta{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
      align-items:end;
    }

    .pdpS2__periodCol--right{
      text-align:right;
    }

    .pdpS2__periodK{
      font-size:8.9pt;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:rgba(255,255,255,.52);
      font-weight:720;
    }

    .pdpS2__periodV{
      margin-top:4px;
      font-size:13pt;
      line-height:1.1;
      letter-spacing:.10em;
      text-transform:uppercase;
      color:rgba(255,255,255,.88);
      font-weight:760;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
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

  const wm = (logoUrl || "").trim();
  const wmHtml = wm
    ? `<div class="pdpS5__wm" aria-hidden="true">
         <img src="${esc(wm)}" alt="${esc(clubName)} watermark" />
       </div>`
    : ``;

  const bullets = (items: string[]) =>
    `<ul class="pdpS5__list">
      ${(items || [])
        .slice(0, 3)
        .map(
          (x) =>
            `<li class="pdpS5__li">
              <span class="pdpS5__dot"></span>
              <span>${esc(x)}</span>
            </li>`
        )
        .join("")}
    </ul>`;

  return `
<section class="page pdpS5" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS5__wash"></div>
  <div class="pdpS5__axis"></div>

  <div class="pdpS5__inner">
    <div class="pdpS5__top">
      <div class="pdpS5__kicker">${esc(t(lang, "CONTEXT", "CONTEXT"))}</div>

      <div class="pdpS5__hero">
        <div class="pdpS5__title">
          ${esc(
            t(
              lang,
              "WAAROM DIT BELANGRIJK IS",
              "WHY THIS MATTERS"
            )
          )}
        </div>
      </div>
    </div>

    <div class="pdpS5__gridTop">
      <div class="pdpS5__card">
        <div class="pdpS5__cardHead">
          ${esc(t(lang, "WANNEER IN HET SPEL", "WHEN IN THE GAME"))}
        </div>
        ${bullets(gameMoments)}
      </div>

      <div class="pdpS5__card">
        <div class="pdpS5__cardHead">
          ${esc(t(lang, "WAAR OP HET VELD", "WHERE ON THE PITCH"))}
        </div>
        ${bullets(zones)}
      </div>
    </div>

    <div class="pdpS5__card pdpS5__card--bottom">
      <div class="pdpS5__cardHead">
        ${esc(
          t(
            lang,
            "WAT HET TEAM VRAAGT",
            "WHAT THE TEAM REQUIRES"
          )
        )}
      </div>
      ${bullets(principles)}
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
      right:-14mm;
      top:-12mm;
      width:120mm;
      height:120mm;
      opacity:.04;
      z-index:0;
      pointer-events:none;
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
          circle at 20% 80%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, black 12%) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 80% 20%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 8%, black 18%) 0%,
          transparent 30%
        ),
        linear-gradient(
          140deg,
          transparent 0%,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 6%, black 16%) 100%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS5__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:16mm;
      width:3px;
      border-radius:3px;
      background:var(--accent-primary, var(--accent));
      z-index:1;
      opacity:.95;
    }

    .pdpS5__inner{
      position:relative;
      z-index:2;
      padding:18mm 16mm;
      padding-left:26mm;
      height:100%;
      display:grid;
      grid-template-rows:auto minmax(64mm, auto) minmax(0,1fr);
      gap:14px;
    }

    .pdpS5__top{
      display:flex;
      flex-direction:column;
      gap:14px;
      padding-top:.5mm;
    }

    .pdpS5__kicker{
      font-size:10pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
    }

    .pdpS5__title{
      font-size:26pt;
      line-height:1.02;
      letter-spacing:-0.02em;
      font-weight:860;
      text-transform:uppercase;
      max-width:20ch;
      text-wrap:balance;
    }

    .pdpS5__gridTop{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
      align-items:stretch;
      min-height:0;
    }

    .pdpS5__card{
      border:1px solid rgba(255,255,255,.10);
      border-radius:16px;
      background:rgba(255,255,255,.04);
      padding:14px;
      height:100%;
      overflow:hidden;
    }

    .pdpS5__card--bottom{
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.18) 0%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 10%, rgba(0,0,0,.18)) 100%
        );
      border:1px solid color-mix(in srgb, var(--accent-secondary, var(--accent)) 22%, rgba(255,255,255,.10));
      min-height:0;
      align-self:stretch;
    }

    .pdpS5__cardHead{
      font-size:9.5pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.46);
      margin-bottom:10px;
      font-weight:720;
    }

    .pdpS5__list{
      list-style:none;
      padding:0;
      margin:0;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .pdpS5__li{
      display:flex;
      gap:8px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS5__li span:last-child{
      font-size:12.4pt;
      line-height:1.36;
      color:rgba(255,255,255,.82);
      font-weight:450;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS5__dot{
      width:6px;
      height:6px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      margin-top:7px;
      flex:0 0 auto;
      box-shadow:0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 20%, transparent);
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
    intro,
    momentItems,
    whatWeSeeItems,
    effectItems,
    videoSlots,
  } = args;

  const wm = (logoUrl || "").trim();
  const wmHtml = wm
    ? `<div class="pdpS3__wm" aria-hidden="true"><img src="${esc(
        wm
      )}" alt="${esc(clubName)} watermark" /></div>`
    : ``;

  const observations = (whatWeSeeItems || []).slice(0, 3);
  const contexts = (momentItems || []).slice(0, 3);
  const effects = (effectItems || []).slice(0, 3);

  const videos = [...(videoSlots || []).slice(0, 2)];
  while (videos.length < 2) videos.push({ status: "pending" });

  const bulletList = (items: string[], variant = "") =>
    `<ul class="pdpS3__list">
      ${items
        .map(
          (x) => `
            <li class="pdpS3__li ${variant}">
              <span class="pdpS3__dot"></span>
              <span>${esc(x)}</span>
            </li>`
        )
        .join("")}
    </ul>`;

  const videoCard = (slot: Slide3VideoSlot) => {
    if (slot.status === "active") {
      return `
        <a class="pdpS3__videoCard pdpS3__videoCard--active" href="${esc(
          slot.url || "#"
        )}">
          <div class="pdpS3__videoThumb">
            ${
              slot.thumbnail_url
                ? `<img src="${esc(slot.thumbnail_url)}" alt="" />`
                : ""
            }
            <div class="pdpS3__play"></div>
          </div>
          <div class="pdpS3__videoTitle">${esc(slot.title || "")}</div>
        </a>
      `;
    }

    return `
      <div class="pdpS3__videoCard pdpS3__videoCard--empty">
        <div class="pdpS3__videoThumb pdpS3__videoThumb--empty">
          <div class="pdpS3__play pdpS3__play--disabled"></div>
        </div>
        <div class="pdpS3__videoTitle">${esc(
          t(lang, "Geen video", "No video")
        )}</div>
      </div>
    `;
  };

  return `
<section class="page pdpS3" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS3__wash" aria-hidden="true"></div>
  <div class="pdpS3__axis" aria-hidden="true"></div>

  <div class="pdpS3__inner">
    <div class="pdpS3__top">
      <div class="pdpS3__kicker">${esc(t(lang, "REALITEIT", "REALITY"))}</div>

      <div class="pdpS3__title">
        ${esc(t(lang, "WAAR STAAN WE NU", "WHERE ARE WE NOW"))}
      </div>

      <div class="pdpS3__intro">${esc(intro)}</div>
    </div>

    <div class="pdpS3__analysisRow">
      <div class="pdpS3__card pdpS3__card--obs">
        <div class="pdpS3__head">${esc(t(lang, "WAT ZIEN WE", "WHAT WE SEE"))}</div>
        ${bulletList(observations)}
      </div>

      <div class="pdpS3__card pdpS3__card--ctx">
        <div class="pdpS3__head">${esc(
          t(lang, "WANNEER ZIEN WE DIT", "WHEN DO WE SEE THIS")
        )}</div>
        ${bulletList(contexts)}
      </div>
    </div>

    <div class="pdpS3__card pdpS3__card--effect">
      <div class="pdpS3__head">${esc(
        t(lang, "EFFECT OP HET SPEL", "EFFECT ON THE GAME")
      )}</div>
      ${bulletList(effects, "pdpS3__li--effect")}
    </div>

    <div class="pdpS3__videoRow">
      ${videoCard(videos[0])}
      ${videoCard(videos[1])}
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
      right:-16mm;
      bottom:-14mm;
      width:126mm;
      height:126mm;
      opacity:.038;
      z-index:0;
      pointer-events:none;
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
        radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent-primary, var(--accent)) 8%, black) 0%, transparent 30%),
        radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--accent-secondary, var(--accent)) 8%, black) 0%, transparent 30%);
    }

    .pdpS3__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:12mm;
      width:3px;
      background:var(--accent-primary, var(--accent));
    }

    .pdpS3__inner{
      position:relative;
      z-index:2;
      padding:18mm 16mm 16mm 26mm;
      height:100%;
      display:grid;
      grid-template-rows:auto minmax(0,1fr) auto auto;
      gap:12px;
    }

    .pdpS3__top{
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .pdpS3__kicker{
      font-size:10pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
    }

    .pdpS3__title{
      font-size:26pt;
      line-height:1.02;
      font-weight:860;
      letter-spacing:-0.02em;
      max-width:20ch;
      text-transform:uppercase;
    }

    .pdpS3__intro{
      font-size:15.2pt;
      line-height:1.34;
      opacity:.9;
      max-width:28ch;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .pdpS3__analysisRow{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:14px;
      align-items:stretch;
      min-height:0;
    }

    .pdpS3__card{
      border-radius:16px;
      padding:14px;
      border:1px solid rgba(255,255,255,.1);
      overflow:hidden;
    }

    .pdpS3__card--obs{
      background:rgba(255,255,255,.04);
    }

    .pdpS3__card--ctx{
      background:rgba(255,255,255,.03);
    }

    .pdpS3__card--effect{
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.2),
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 12%, black)
        );
      border:1px solid color-mix(in srgb, var(--accent-secondary, var(--accent)) 25%, rgba(255,255,255,.1));
      min-height:0;
    }

    .pdpS3__head{
      font-size:9pt;
      letter-spacing:.24em;
      text-transform:uppercase;
      opacity:.6;
      margin-bottom:8px;
    }

    .pdpS3__list{
      display:flex;
      flex-direction:column;
      gap:9px;
      padding:0;
      margin:0;
      list-style:none;
    }

    .pdpS3__li{
      display:flex;
      gap:8px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS3__dot{
      width:6px;
      height:6px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      margin-top:6px;
      flex:0 0 auto;
    }

    .pdpS3__li span:last-child{
      font-size:12.8pt;
      line-height:1.34;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS3__li--effect span:last-child{
      font-size:14pt;
      line-height:1.36;
      font-weight:520;
    }

    .pdpS3__videoRow{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      align-items:stretch;
    }

    .pdpS3__videoCard{
      border-radius:14px;
      overflow:hidden;
      border:1px solid rgba(255,255,255,.1);
      padding:10px;
      background:rgba(0,0,0,.12);
      min-height:0;
      text-decoration:none;
      color:inherit;
    }

    .pdpS3__videoCard--active{
      border:1px solid var(--accent-primary, var(--accent));
      box-shadow:0 0 10px color-mix(in srgb, var(--accent-primary, var(--accent)) 20%, transparent);
    }

    .pdpS3__videoThumb{
      aspect-ratio:16/9;
      background:#111;
      border-radius:10px;
      position:relative;
      overflow:hidden;
    }

    .pdpS3__videoThumb img{
      width:100%;
      height:100%;
      object-fit:cover;
    }

    .pdpS3__play{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
    }

    .pdpS3__play:before{
      content:"";
      border-left:10px solid white;
      border-top:6px solid transparent;
      border-bottom:6px solid transparent;
    }

    .pdpS3__play--disabled:before{
      border-left-color:rgba(255,255,255,.3);
    }

    .pdpS3__videoTitle{
      font-size:11pt;
      line-height:1.28;
      margin-top:6px;
      opacity:.8;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
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

  const wm = (logoUrl || "").trim();
  const wmHtml = wm
    ? `<div class="pdpS4__wm" aria-hidden="true"><img src="${esc(
        wm
      )}" alt="${esc(clubName)} watermark" /></div>`
    : ``;

  const planCard = (titleTxt: string, body: string) => `
    <div class="pdpS4__card pdpS4__card--plan">
      <div class="pdpS4__cardHead">${esc(titleTxt)}</div>
      <div class="pdpS4__cardBody pdpS4__cardBody--plan">${esc(body)}</div>
    </div>
  `;

  const roleCard = (titleTxt: string, body: string) => `
    <div class="pdpS4__card pdpS4__card--role">
      <div class="pdpS4__cardHead">${esc(titleTxt)}</div>
      <div class="pdpS4__cardBody pdpS4__cardBody--role">${esc(body)}</div>
    </div>
  `;

  return `
<section class="page pdpS4" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS4__wash" aria-hidden="true"></div>
  <div class="pdpS4__axis" aria-hidden="true"></div>

  <div class="pdpS4__inner">
    <div class="pdpS4__top">
      <div class="pdpS4__kicker">${esc(t(lang, "AANPAK", "APPROACH"))}</div>
      <div class="pdpS4__title">
        ${esc(t(lang, "HOE WE HIERAAN WERKEN", "HOW WE WORK ON THIS"))}
      </div>
    </div>

    <div class="pdpS4__card pdpS4__card--self">
      <div class="pdpS4__sectionHead">
        ${esc(t(lang, "WAT JIJ DOET", "WHAT YOU DO"))}
      </div>
      <div class="pdpS4__cardBody pdpS4__cardBody--self">
        ${esc(playerOwnText)}
      </div>
    </div>

    <div class="pdpS4__grid pdpS4__grid--plan">
      ${planCard(t(lang, "TRAINING", "TRAINING"), trainingText)}
      ${planCard(t(lang, "WEDSTRIJD", "MATCH"), matchText)}
      ${planCard(t(lang, "VIDEO", "VIDEO"), videoText)}
      ${planCard(t(lang, "BUITEN HET VELD", "OFF FIELD"), offFieldText)}
    </div>

    <div class="pdpS4__grid pdpS4__grid--roles">
      ${roleCard(t(lang, "SPELER", "PLAYER"), playerText)}
      ${roleCard(t(lang, "TRAINER", "COACH"), coachText)}
      ${roleCard(t(lang, "ANALIST", "ANALYST"), analystText)}
      ${roleCard(t(lang, "STAF", "STAFF"), staffText)}
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
      opacity:.038;
      z-index:0;
      pointer-events:none;
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
        radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--accent-primary, var(--accent)) 10%, black) 0%, transparent 34%),
        radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--accent-secondary, var(--accent)) 8%, black) 0%, transparent 30%);
    }

    .pdpS4__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:12mm;
      width:3px;
      background:var(--accent-primary, var(--accent));
    }

    .pdpS4__inner{
      position:relative;
      z-index:2;
      padding:18mm 16mm 16mm 26mm;
      height:100%;
      display:grid;
      grid-template-rows:auto auto minmax(0,1fr) auto;
      gap:12px;
      align-content:start;
    }

    .pdpS4__top{
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .pdpS4__kicker{
      font-size:10pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
    }

    .pdpS4__title{
      font-size:26pt;
      line-height:1.02;
      font-weight:860;
      letter-spacing:-0.02em;
      max-width:21ch;
      text-transform:uppercase;
    }

    .pdpS4__card--self{
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.2),
          color-mix(in srgb, var(--accent-mix, var(--accent)) 16%, black)
        );
      border:1px solid color-mix(in srgb, var(--accent-mix, var(--accent)) 30%, rgba(255,255,255,.1));
      padding:14px 16px;
      border-radius:16px;
      box-shadow:0 0 18px color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, transparent);
      overflow:hidden;
    }

    .pdpS4__cardBody--self{
      font-size:15.2pt;
      line-height:1.38;
      font-weight:520;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .pdpS4__grid--plan{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
      align-items:stretch;
      min-height:0;
    }

    .pdpS4__card--plan{
      background:rgba(255,255,255,.04);
      padding:12px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.08);
      overflow:hidden;
      min-height:0;
    }

    .pdpS4__cardBody--plan{
      font-size:12.5pt;
      line-height:1.34;
      opacity:.85;
      display:-webkit-box;
      -webkit-line-clamp:4;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .pdpS4__grid--roles{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
      align-items:stretch;
    }

    .pdpS4__card--role{
      background:rgba(0,0,0,.14);
      border:1px solid rgba(255,255,255,.06);
      padding:10px;
      border-radius:12px;
      overflow:hidden;
      min-height:0;
    }

    .pdpS4__cardBody--role{
      font-size:11.2pt;
      line-height:1.28;
      opacity:.75;
      display:-webkit-box;
      -webkit-line-clamp:3;
      -webkit-box-orient:vertical;
      overflow:hidden;
    }

    .pdpS4__cardHead{
      font-size:9pt;
      letter-spacing:.22em;
      text-transform:uppercase;
      opacity:.6;
      margin-bottom:6px;
    }

    .pdpS4__sectionHead{
      font-size:9pt;
      letter-spacing:.24em;
      text-transform:uppercase;
      opacity:.6;
      margin-bottom:6px;
    }
  </style>
</section>
`;
}

/** ---------------- SLIDE 6 ---------------- */
export function pageSuccessDefinition(args: {
  lang: Lang;
  accentHex: string;
  clubName: string;
  logoUrl?: string;

  inGameItems: string[];
  behaviourItems: string[];
  signalItems: string[];
}) {
  const {
    lang,
    accentHex,
    clubName,
    logoUrl,
    inGameItems,
    behaviourItems,
    signalItems,
  } = args;

  const wm = (logoUrl || "").trim();
  const wmHtml = wm
    ? `<div class="pdpS6__wm" aria-hidden="true"><img src="${esc(
        wm
      )}" alt="${esc(clubName)} watermark" /></div>`
    : ``;

  const bulletList = (items: string[], itemClass = "pdpS6__li") =>
    items.length
      ? `<ul class="pdpS6__list">
          ${items
            .slice(0, 3)
            .map(
              (x) => `
                <li class="${itemClass}">
                  <span class="pdpS6__dot"></span>
                  <span>${esc(x)}</span>
                </li>
              `
            )
            .join("")}
        </ul>`
      : `<div class="pdpS6__empty"></div>`;

  return `
<section class="page pdpS6" style="--accent:${esc(accentHex)};">
  ${wmHtml}
  <div class="pdpS6__wash" aria-hidden="true"></div>
  <div class="pdpS6__axis" aria-hidden="true"></div>

  <div class="pdpS6__inner">
    <div class="pdpS6__top">
      <div class="pdpS6__kicker">${esc(
        t(lang, "SUCCESDEFINITIE", "SUCCESS DEFINITION")
      )}</div>

      <div class="pdpS6__hero">
        <div class="pdpS6__title">${esc(
          t(lang, "WANNEER IS DIT GOED", "WHEN IS THIS GOOD")
        )}</div>
      </div>
    </div>

    <div class="pdpS6__topGrid">
      <div class="pdpS6__card pdpS6__card--top">
        <div class="pdpS6__head">${esc(
          t(lang, "IN HET SPEL", "IN THE GAME")
        )}</div>
        ${bulletList(inGameItems, "pdpS6__li pdpS6__li--game")}
      </div>

      <div class="pdpS6__card pdpS6__card--top">
        <div class="pdpS6__head">${esc(
          t(lang, "IN GEDRAG", "IN BEHAVIOUR")
        )}</div>
        ${bulletList(behaviourItems, "pdpS6__li pdpS6__li--behaviour")}
      </div>
    </div>

    <div class="pdpS6__card pdpS6__card--bottom">
      <div class="pdpS6__head">${esc(
        t(lang, "EERSTE SIGNALEN DAT HET LANDT", "FIRST SIGNS THAT IT IS LANDING")
      )}</div>
      ${bulletList(signalItems, "pdpS6__li pdpS6__li--signal")}
    </div>
  </div>

  <style>
    .pdpS6{
      position:relative;
      height:100%;
      border-radius:18px;
      overflow:hidden;
      background:#0B0D10;
      color:#fff;
    }

    .pdpS6 *{
      box-sizing:border-box;
    }

    .pdpS6__wm{
      position:absolute;
      right:-18mm;
      bottom:-16mm;
      width:136mm;
      height:136mm;
      opacity:.038;
      filter:blur(.15px);
      z-index:0;
      pointer-events:none;
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
        radial-gradient(
          circle at 80% 78%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 8%, black 12%) 0%,
          transparent 34%
        ),
        radial-gradient(
          circle at 20% 20%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 7%, black 18%) 0%,
          transparent 28%
        ),
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 5%, black 14%) 0%,
          transparent 58%
        );
      z-index:0;
      pointer-events:none;
    }

    .pdpS6__axis{
      position:absolute;
      left:18mm;
      top:16mm;
      bottom:12mm;
      width:3px;
      border-radius:3px;
      background:var(--accent-primary, var(--accent));
      opacity:.95;
      z-index:1;
    }

    .pdpS6__inner{
      position:relative;
      z-index:2;
      padding:18mm 16mm;
      padding-left:26mm;
      height:100%;
      display:grid;
      grid-template-rows:auto minmax(66mm, auto) minmax(0,1fr);
      gap:16px;
    }

    .pdpS6__top{
      display:flex;
      flex-direction:column;
      gap:14px;
      padding-top:.5mm;
    }

    .pdpS6__kicker{
      font-size:10.2pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
    }

    .pdpS6__hero{
      display:flex;
      flex-direction:column;
      gap:0;
    }

    .pdpS6__title{
      font-size:26pt;
      line-height:1.02;
      letter-spacing:-0.02em;
      font-weight:860;
      text-transform:uppercase;
      max-width:22ch;
      text-wrap:balance;
    }

    .pdpS6__topGrid{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:16px;
      align-items:stretch;
      min-height:0;
    }

    .pdpS6__card{
      border:1px solid rgba(255,255,255,.10);
      border-radius:18px;
      padding:14px 16px;
      overflow:hidden;
      height:100%;
    }

    .pdpS6__card--top{
      background:rgba(255,255,255,.04);
      min-height:66mm;
    }

    .pdpS6__card--bottom{
      background:
        linear-gradient(
          145deg,
          rgba(0,0,0,.14) 0%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 10%, rgba(0,0,0,.16)) 100%
        );
      min-height:0;
      border:1px solid color-mix(in srgb, var(--accent-secondary, var(--accent)) 20%, rgba(255,255,255,.10));
    }

    .pdpS6__head{
      font-size:9.3pt;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.46);
      font-weight:720;
      margin-bottom:10px;
    }

    .pdpS6__list{
      list-style:none;
      padding:0;
      margin:0;
      display:flex;
      flex-direction:column;
      gap:10px;
    }

    .pdpS6__li{
      display:flex;
      gap:10px;
      align-items:flex-start;
      min-width:0;
    }

    .pdpS6__dot{
      width:7px;
      height:7px;
      border-radius:999px;
      background:var(--accent-mix, var(--accent));
      box-shadow:0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, transparent);
      margin-top:9px;
      flex:0 0 auto;
    }

    .pdpS6__li span:last-child{
      font-size:13.8pt;
      line-height:1.38;
      color:rgba(255,255,255,.80);
      font-weight:500;
      display:-webkit-box;
      -webkit-line-clamp:2;
      -webkit-box-orient:vertical;
      overflow:hidden;
      min-width:0;
    }

    .pdpS6__li--signal span:last-child{
      font-size:14.6pt;
      line-height:1.40;
      color:rgba(255,255,255,.84);
      font-weight:520;
    }

    .pdpS6__empty{
      min-height:20px;
    }
  </style>
</section>
`;
}