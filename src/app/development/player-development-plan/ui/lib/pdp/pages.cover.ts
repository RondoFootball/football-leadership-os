// src/app/development/player-development-plan/ui/lib/pdp/pages.cover.ts

function esc(input: unknown) {
  const s = String(input ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function pageCoverLocked(args: {
  clubName: string;
  logoUrl?: string;
  accentHex: string;
  playerName: string;
  headshotUrl?: string;
  headline?: string;
  subjectLine?: string;
  systemLine?: string;
}) {
  const {
    clubName,
    logoUrl,
    accentHex,
    playerName,
    headshotUrl,
    headline,
    systemLine,
  } = args;

  const logo = (logoUrl || "").trim();
  const photo = (headshotUrl || "").trim();

  const photoHtml = photo
    ? `<img class="pdpCover__photo" src="${esc(photo)}" alt="${esc(
        playerName
      )}" />`
    : `<div class="pdpCover__photoFallback"></div>`;

  return `
<section class="page pdpCover" style="--accent:${esc(accentHex)};">
  <div class="pdpCover__media">
    ${photoHtml}
    <div class="pdpCover__shade"></div>
    <div class="pdpCover__wash"></div>
    <div class="pdpCover__vignette"></div>
    <div class="pdpCover__grain"></div>
  </div>

  <div class="pdpCover__content">
    <div class="pdpCover__rail"></div>

    <div class="pdpCover__topText">
      <div class="pdpCover__club">${esc(clubName)}</div>
      <div class="pdpCover__subject">${esc("Persoonlijk Ontwikkelplan")}</div>
    </div>

    <div class="pdpCover__logoWrap" aria-hidden="true">
      <div class="pdpCover__logoBox">
        ${
          logo
            ? `<img class="pdpCover__logo" src="${esc(logo)}" alt="${esc(
                clubName
              )} logo" />`
            : `<div class="pdpCover__logoFallback"></div>`
        }
      </div>
    </div>

    <div class="pdpCover__nameWrap">
      ${
        headline
          ? `<div class="pdpCover__headline">${esc(headline)}</div>`
          : ``
      }
      <div class="pdpCover__playerName">${esc(playerName)}</div>
    </div>

    <div class="pdpCover__footer">
      <div class="pdpCover__system">${esc(
        systemLine || "PERFORMANCE DEVELOPMENT SYSTEM"
      )}</div>
      <div class="pdpCover__footerLine"></div>
    </div>
  </div>

  <style>
    .pdpCover{
      position:relative;
      height:var(--page-inner-h);
      border-radius:18px;
      overflow:hidden;
      background:#050608;
      color:#fff;
    }

    .pdpCover__media{
      position:absolute;
      inset:0;
      overflow:hidden;
      background:#050608;
    }

    .pdpCover__photo{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center 22%;
      transform:scale(1.02);
      filter:saturate(.94) contrast(1.02);
    }

    .pdpCover__photoFallback{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 68% 35%, rgba(255,255,255,.08), transparent 26%),
        linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,0)),
        #0B0D10;
    }

    .pdpCover__shade{
      position:absolute;
      inset:0;
      background:
        linear-gradient(90deg, rgba(0,0,0,.74) 0%, rgba(0,0,0,.34) 42%, rgba(0,0,0,.62) 100%),
        linear-gradient(180deg, rgba(0,0,0,.16) 0%, rgba(0,0,0,.46) 100%);
      z-index:1;
    }

    .pdpCover__wash{
      position:absolute;
      inset:0;
      background:
        radial-gradient(
          circle at 14% 26%,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 34%, black 12%) 0%,
          transparent 44%
        ),
        radial-gradient(
          circle at 82% 74%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 18%, black 18%) 0%,
          transparent 34%
        ),
        linear-gradient(
          135deg,
          color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, black 12%) 0%,
          transparent 42%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 10%, black 22%) 100%
        );
      mix-blend-mode:screen;
      opacity:.96;
      z-index:2;
      pointer-events:none;
    }

    .pdpCover__vignette{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at center, transparent 38%, rgba(0,0,0,.22) 100%),
        linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.22));
      z-index:3;
    }

    .pdpCover__grain{
      position:absolute;
      inset:0;
      opacity:.04;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:4px 4px, 4px 4px;
      z-index:4;
      pointer-events:none;
    }

    .pdpCover__content{
      position:relative;
      z-index:5;
      width:100%;
      height:100%;
      box-sizing:border-box;
    }

    .pdpCover__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:3px;
      background:var(--accent-primary, var(--accent));
      opacity:.96;
      z-index:6;
    }

    .pdpCover__topText{
      position:absolute;
      top:18mm;
      left:26mm;
      z-index:7;
      text-align:left;
    }

    .pdpCover__club{
      font-size:12.3pt;
      line-height:1.08;
      letter-spacing:.14em;
      text-transform:uppercase;
      color:rgba(255,255,255,.90);
      font-weight:780;
    }

    .pdpCover__subject{
      margin-top:1.2mm;
      font-size:10.6pt;
      line-height:1.2;
      color:rgba(255,255,255,.76);
      font-weight:500;
    }

    .pdpCover__logoWrap{
      position:absolute;
      top:10mm;
      right:10mm;
      width:24mm;
      height:24mm;
      z-index:50;
      pointer-events:none;
    }

    .pdpCover__logoBox{
      position:absolute;
      inset:0;
      box-sizing:border-box;
      padding:3mm;
      border-radius:14px;
      background:
        linear-gradient(
          145deg,
          color-mix(in srgb, var(--accent-primary, var(--accent)) 14%, rgba(255,255,255,.08)) 0%,
          rgba(255,255,255,.08) 48%,
          color-mix(in srgb, var(--accent-secondary, var(--accent)) 12%, rgba(255,255,255,.06)) 100%
        );
      border:1px solid rgba(255,255,255,.18);
      box-shadow:
        0 8px 22px rgba(0,0,0,.22),
        inset 0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, transparent);
      display:flex;
      align-items:center;
      justify-content:center;
      overflow:hidden;
    }

    .pdpCover__logo{
      display:block;
      width:100%;
      height:100%;
      max-width:100%;
      max-height:100%;
      object-fit:contain;
      object-position:center;
    }

    .pdpCover__logoFallback{
      width:100%;
      height:100%;
      border-radius:999px;
      background:rgba(255,255,255,.16);
      display:block;
    }

    .pdpCover__nameWrap{
      position:absolute;
      left:26mm;
      right:16mm;
      bottom:40mm;
      z-index:7;
      max-width:78%;
      text-align:left;
    }

    .pdpCover__headline{
      margin-bottom:8mm;
      font-size:12pt;
      line-height:1.2;
      letter-spacing:.24em;
      text-transform:uppercase;
      color:color-mix(in srgb, var(--accent-secondary, #ffffff) 34%, rgba(255,255,255,.72));
    }

    .pdpCover__playerName{
      font-size:36pt;
      line-height:1.0;
      letter-spacing:-0.03em;
      font-weight:860;
      color:#fff;
      text-shadow:0 4px 18px rgba(0,0,0,.28);
      text-align:left;
      display:block;
    }

    .pdpCover__footer{
      position:absolute;
      left:26mm;
      right:16mm;
      bottom:18mm;
      z-index:7;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
    }

    .pdpCover__system{
      font-size:10.5pt;
      line-height:1.1;
      letter-spacing:.26em;
      text-transform:uppercase;
      color:rgba(255,255,255,.72);
      white-space:nowrap;
      text-align:left;
      display:block;
    }

    .pdpCover__footerLine{
      width:16mm;
      height:2px;
      border-radius:999px;
      background:var(--accent-gradient);
      box-shadow:
        0 0 0 1px color-mix(in srgb, var(--accent-mix, var(--accent)) 28%, transparent),
        0 0 12px color-mix(in srgb, var(--accent-mix, var(--accent)) 18%, transparent);
      opacity:.98;
      flex:0 0 auto;
      margin-left:auto;
      display:block;
    }
  </style>
</section>
`;
}