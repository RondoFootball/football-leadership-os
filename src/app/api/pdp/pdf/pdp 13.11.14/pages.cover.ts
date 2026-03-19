// src/app/api/pdp/pdf/pdp/pages.cover.ts
function esc(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clampWords(s: string, max = 8) {
  const t = (s || "").trim().replace(/\s+/g, " ");
  if (!t) return "";
  const parts = t.split(" ");
  return parts.length > max ? parts.slice(0, max).join(" ") : t;
}

export type CoverInput = {
  clubName: string;
  logoUrl?: string;
  accentHex: string; // already clamped upstream to #RRGGBB
  playerName: string;
  roleLine: string; // e.g. "CV · 1e Elftal"
  blockLine: string; // e.g. "8-week performance block" (NL/EN)
  headshotUrl?: string;

  systemLine?: string; // e.g. "Performance Development System"
  code?: string; // e.g. "PDP-2403-CV"
  phaseLabel?: string; // e.g. "STABILISATION"
  headline?: string; // max ~7 words
};

export function pageCoverSignature(input: CoverInput) {
  const club = esc(input.clubName || "Club");
  const player = esc(input.playerName || "Player");
  const roleLine = esc(input.roleLine || "");
  const blockLine = esc(input.blockLine || "");
  const systemLine = esc(input.systemLine || "Performance Development System");
  const code = esc(input.code || "");
  const phase = esc(input.phaseLabel || "");
  const headline = esc(clampWords(input.headline || "", 7));

  const logoUrl = (input.logoUrl || "").trim();
  const headshotUrl = (input.headshotUrl || "").trim();

  return `
<section class="pdpPage pdpCover">
  <div class="pdpCover__bg">
    ${headshotUrl ? `<img class="pdpCover__img" src="${esc(headshotUrl)}" alt="" />` : ``}
    <div class="pdpCover__shade"></div>
    <div class="pdpCover__grain"></div>
    <div class="pdpCover__waves"></div>
    <div class="pdpCover__axis"></div>
    <div class="pdpCover__stamp"></div>
  </div>

  <div class="pdpCover__inner">
    <header class="pdpCover__header">
      <div class="pdpCover__brand">
        ${
          logoUrl
            ? `<img class="pdpCover__logo" src="${esc(logoUrl)}" alt="${club} logo" />`
            : `<div class="pdpKicker pdpKicker--inv">${club}</div>`
        }
        <div class="pdpMeta pdpMeta--inv">
          <div class="pdpKicker pdpKicker--inv">${club}</div>
          <div class="pdpMetaLine">${systemLine}</div>
        </div>
      </div>

      <div class="pdpCover__meta">
        ${phase ? `<div class="pdpMetaChip pdpMetaChip--inv">${phase}</div>` : ``}
        ${code ? `<div class="pdpMetaChip pdpMetaChip--inv">${code}</div>` : ``}
      </div>
    </header>

    <div class="pdpCover__hero">
      <div class="pdpCover__name" aria-label="Player name">${player}</div>
      ${headline ? `<div class="pdpCover__headline">${headline}</div>` : ``}
      <div class="pdpCover__sub">
        ${roleLine ? `<div class="pdpCover__role">${roleLine}</div>` : ``}
        ${blockLine ? `<div class="pdpCover__block">${blockLine}</div>` : ``}
      </div>
    </div>

    <footer class="pdpCover__footer">
      <div class="pdpCover__watermark" aria-hidden="true">PDP</div>
      <div class="pdpCover__micro">
        <span class="pdpDot"></span>
        <span>Player Development Plan</span>
        <span class="pdpDot"></span>
        <span>${club}</span>
      </div>
    </footer>
  </div>
</section>
`;
}