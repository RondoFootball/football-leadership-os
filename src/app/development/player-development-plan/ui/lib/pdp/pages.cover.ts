// src/app/development/player-development-plan/ui/lib/pdp/pages.cover.ts

function esc(input: unknown) {
  const s = String(input ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function t(lang: "nl" | "en", nl: string, en: string) {
  return lang === "nl" ? nl : en;
}

function safeText(v?: string) {
  return typeof v === "string" ? v.trim() : "";
}

export function pageCoverLocked(args: {
  lang: "nl" | "en";
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
    lang,
    clubName,
    logoUrl,
    accentHex,
    playerName,
    headshotUrl,
    headline,
    subjectLine,
    systemLine,
  } = args;

  const safeClub = safeText(clubName) || "Club";
  const safePlayer = safeText(playerName) || t(lang, "Speler", "Player");
  const safeLogo = safeText(logoUrl);
  const safePhoto = safeText(headshotUrl);
  const safeAccent = safeText(accentHex) || "#1D4ED8";

  const safeHeadline =
    safeText(headline) ||
    t(lang, "PERSOONLIJK ONTWIKKELPLAN", "PERSONAL DEVELOPMENT PLAN");

  const safeSubject =
    safeText(subjectLine) ||
    t(lang, "Player Development Plan", "Player Development Plan");

  const safeSystem =
    safeText(systemLine) || "PERFORMANCE DEVELOPMENT SYSTEM";

  const photoHtml = safePhoto
    ? `<img class="coverX__photo" src="${esc(safePhoto)}" alt="${esc(
        safePlayer
      )}" />`
    : `<div class="coverX__photoFallback" aria-hidden="true"></div>`;

  const logoHtml = safeLogo
    ? `<img class="coverX__logo" src="${esc(safeLogo)}" alt="${esc(
        safeClub
      )} logo" />`
    : `<div class="coverX__logoFallback" aria-hidden="true"></div>`;

  return `
<section class="page coverX" style="--accent:${esc(safeAccent)};">
  <div class="coverX__bgBase"></div>

  <div class="coverX__media">
    ${photoHtml}
    <div class="coverX__shade"></div>
    <div class="coverX__accentGlow"></div>
    <div class="coverX__accentGlowTwo"></div>
    <div class="coverX__grain"></div>
  </div>

  <div class="coverX__frame"></div>
  <div class="coverX__rail"></div>

  <!-- ✅ LOGO (gefixte positie) -->
  <div class="coverX__logoBox">
    ${logoHtml}
  </div>

  <!-- HERO -->
  <div class="coverX__hero">
    <div class="coverX__headline">${esc(safeHeadline)}</div>
    <div class="coverX__name">${esc(safePlayer)}</div>
    <div class="coverX__heroRule"></div>
  </div>

  <!-- FOOTER -->
  <div class="coverX__footer">
    <div class="coverX__system">${esc(safeSystem)}</div>
    <div class="coverX__footerRule"></div>
  </div>

  <style>
    .coverX{
      position:relative;
      height:100%;
      overflow:hidden;
      border-radius:18px;
      background:#07090C;
      color:#FFFFFF;
      font-family:"SF Pro Display","Inter",Arial,sans-serif;
    }

    .coverX *{
      box-sizing:border-box;
    }

    .coverX__bgBase{
      position:absolute;
      inset:0;
      background:#07090C;
      z-index:0;
    }

    .coverX__media{
      position:absolute;
      inset:0;
      z-index:1;
      overflow:hidden;
    }

    .coverX__photo{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center 22%;
      transform:scale(1.025);
      opacity:.88;
      filter:saturate(.94) contrast(1.03);
    }

    .coverX__photoFallback{
      position:absolute;
      inset:0;
      background:
        radial-gradient(circle at 74% 24%, rgba(255,255,255,.07) 0%, transparent 18%),
        radial-gradient(circle at 84% 78%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 28%),
        linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0)),
        #0A0D11;
    }

    .coverX__shade{
      position:absolute;
      inset:0;
      background:
        linear-gradient(90deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.58) 38%, rgba(0,0,0,.52) 58%, rgba(0,0,0,.76) 100%),
        linear-gradient(180deg, rgba(0,0,0,.08) 0%, rgba(0,0,0,.34) 100%);
      z-index:2;
    }

    .coverX__accentGlow{
      position:absolute;
      left:-8mm;
      top:-10mm;
      width:118mm;
      height:118mm;
      border-radius:999px;
      background:radial-gradient(
        circle,
        color-mix(in srgb, var(--accent) 34%, transparent) 0%,
        transparent 68%
      );
      opacity:.72;
      z-index:3;
    }

    .coverX__accentGlowTwo{
      position:absolute;
      right:-28mm;
      bottom:-22mm;
      width:128mm;
      height:128mm;
      border-radius:999px;
      background:radial-gradient(
        circle,
        color-mix(in srgb, var(--accent) 18%, transparent) 0%,
        transparent 72%
      );
      opacity:.34;
      z-index:3;
    }

    .coverX__grain{
      position:absolute;
      inset:0;
      opacity:.018;
      background-image:
        linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
      background-size:4px 4px, 4px 4px;
      z-index:4;
      pointer-events:none;
    }

    .coverX__frame{
      position:absolute;
      inset:18px;
      border:1px solid rgba(255,255,255,.08);
      border-radius:16px;
      z-index:5;
      pointer-events:none;
    }

    .coverX__rail{
      position:absolute;
      left:18mm;
      top:18mm;
      bottom:18mm;
      width:3px;
      border-radius:999px;
      background:linear-gradient(
        180deg,
        color-mix(in srgb, var(--accent) 94%, #fff 2%) 0%,
        color-mix(in srgb, var(--accent) 58%, transparent) 58%,
        transparent 100%
      );
      box-shadow:
        0 0 12px color-mix(in srgb, var(--accent) 18%, transparent),
        0 0 28px color-mix(in srgb, var(--accent) 8%, transparent);
      opacity:.98;
      z-index:6;
    }

    /* ✅ LOGO verder naar hoek */
    .coverX__logoBox{
      position:absolute;
      top:12mm;
      right:12mm;
      width:28mm;
      height:28mm;
      z-index:8;

      border-radius:14px;
      padding:3.2mm;

      background:rgba(255,255,255,.08);
      border:1px solid rgba(255,255,255,.18);

      box-shadow:
        0 10px 28px rgba(0,0,0,.28),
        inset 0 0 0 1px color-mix(in srgb, var(--accent) 16%, transparent);

      display:flex;
      align-items:center;
      justify-content:center;
      overflow:hidden;
    }

    .coverX__logo{
      width:100%;
      height:100%;
      object-fit:contain;
      display:block;
    }

    .coverX__logoFallback{
      width:100%;
      height:100%;
      border-radius:999px;
      background:rgba(255,255,255,.16);
    }

    .coverX__hero{
      position:absolute;
      left:26mm;
      right:16mm;
      bottom:38mm;
      z-index:7;
      max-width:78%;
    }

    .coverX__headline{
      margin-top:6mm;
      max-width:84%;
      font-size:10.5pt;
      line-height:1.24;
      letter-spacing:.26em;
      text-transform:uppercase;
      font-weight:620;
      color:color-mix(in srgb, var(--accent) 34%, rgba(255,255,255,.55));
    }

    .coverX__name{
      margin-top:6mm;
      max-width:94%;
      min-height:20mm;
      font-size:48pt;
      line-height:.94;
      letter-spacing:-.07em;
      font-weight:840;
      color:#FFFFFF;
    }

    .coverX__heroRule{
      width:32mm;
      height:2px;
      margin-top:8mm;
      border-radius:999px;
      background:linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent) 96%, #fff 2%) 0%,
        transparent 100%
      );
    }

    /* ✅ PERFECTE ALIGNMENT MET LOGO */
    .coverX__footer{
      position:absolute;
      left:26mm;
      right:12mm;
      bottom:18mm;
      z-index:7;

      display:flex;
      align-items:center;
      justify-content:space-between;
    }

    .coverX__system{
      max-width:78%;
      font-size:10pt;
      letter-spacing:.25em;
      text-transform:uppercase;
      color:rgba(255,255,255,.66);
    }

    .coverX__footerRule{
      margin-left:auto;
      width:18mm;
      height:2px;
      border-radius:999px;
      background:linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent) 92%, #fff 4%) 0%,
        color-mix(in srgb, var(--accent) 32%, transparent) 100%
      );
    }
  </style>
</section>
`;
}