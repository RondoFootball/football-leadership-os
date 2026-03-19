// src/app/development/player-development-plan/ui/lib/pdp/diagrams.ts
type SvgOpts = { width?: number; height?: number; accent?: string };

function esc(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function svgTimeline8Weeks(
  checkpoints: Array<{ week: number; label: string }>,
  opts: SvgOpts = {}
) {
  const w = opts.width ?? 760;
  const h = opts.height ?? 130;
  const accent = opts.accent ?? "var(--accent)";
  const padX = 26;
  const y = 64;
  const x1 = padX;
  const x2 = w - padX;
  const weeks = 8;

  const xForWeek = (wk: number) =>
    x1 + ((Math.max(1, Math.min(weeks, wk)) - 1) / (weeks - 1)) * (x2 - x1);

  const nodes = (checkpoints || []).slice(0, 10).map((c) => {
    const x = xForWeek(c.week);
    return `
      <g>
        <circle cx="${x}" cy="${y}" r="7" fill="${accent}" opacity="0.95"/>
        <circle cx="${x}" cy="${y}" r="12" fill="${accent}" opacity="0.12"/>
        <text x="${x}" y="${y - 16}" text-anchor="middle" font-size="10" fill="rgba(0,0,0,.55)">W${c.week}</text>
        <text x="${x}" y="${y + 30}" text-anchor="middle" font-size="10" fill="rgba(0,0,0,.70)">${esc(
          c.label
        )}</text>
      </g>`;
  }).join("");

  const ticks = Array.from({ length: weeks }).map((_, i) => {
    const wk = i + 1;
    const x = xForWeek(wk);
    return `<circle cx="${x}" cy="${y}" r="2" fill="rgba(0,0,0,.20)"/>`;
  }).join("");

  return `
  <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="var(--surface-1)"/>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="rgba(0,0,0,.18)" stroke-width="2" stroke-linecap="round"/>
    ${ticks}
    ${nodes}
  </svg>`;
}

export function svgBehaviourLadder(
  steps: { from: string; bridge: string; to: string },
  opts: SvgOpts = {}
) {
  const w = opts.width ?? 760;
  const h = opts.height ?? 180;
  const accent = opts.accent ?? "var(--accent)";

  const xLine = 76;
  const ys = [52, 92, 132];
  const labels = [steps.from, steps.bridge, steps.to];

  const nodes = labels.map((t, idx) => {
    const y = ys[idx];
    const active = idx === 2;
    return `
      <g>
        <circle cx="${xLine}" cy="${y}" r="8" fill="${active ? accent : "rgba(0,0,0,.15)"}"/>
        <circle cx="${xLine}" cy="${y}" r="14" fill="${accent}" opacity="${active ? 0.12 : 0.06}"/>
        <text x="${xLine + 26}" y="${y + 4}" font-size="12" fill="rgba(0,0,0,.78)">${esc(t)}</text>
      </g>`;
  }).join("");

  return `
  <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="var(--paper)" stroke="var(--hairline)"/>
    <line x1="${xLine}" y1="${ys[0]}" x2="${xLine}" y2="${ys[2]}" stroke="rgba(0,0,0,.20)" stroke-width="2" stroke-linecap="round"/>
    ${nodes}
    <text x="${xLine}" y="24" text-anchor="middle" font-size="9" fill="rgba(0,0,0,.50)" letter-spacing="2">SHIFT</text>
  </svg>`;
}

export function svgConstraintsQuadrant(
  q: { time: string[]; space: string[]; opponent: string[]; role: string[] },
  opts: SvgOpts = {}
) {
  const w = opts.width ?? 760;
  const h = opts.height ?? 220;

  const bw = (w - 60) / 2;
  const bh = (h - 50) / 2;

  const box = (x: number, y: number, title: string, items: string[]) => {
    const list = (items || []).slice(0, 3).map((t, i) =>
      `<text x="${x + 16}" y="${y + 54 + i * 18}" font-size="11" fill="rgba(0,0,0,.72)">• ${esc(t)}</text>`
    ).join("");

    return `
      <g>
        <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="12" fill="var(--surface-1)"/>
        <text x="${x + 16}" y="${y + 26}" font-size="10" fill="rgba(0,0,0,.55)" letter-spacing="2">${esc(
          title.toUpperCase()
        )}</text>
        ${list || `<text x="${x + 16}" y="${y + 56}" font-size="11" fill="rgba(0,0,0,.45)">—</text>`}
      </g>`;
  };

  return `
  <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="var(--paper)" stroke="var(--hairline)"/>
    ${box(20, 18, "Time", q.time)}
    ${box(40 + bw, 18, "Space", q.space)}
    ${box(20, 30 + bh, "Opponent", q.opponent)}
    ${box(40 + bw, 30 + bh, "Role", q.role)}
  </svg>`;
}

export function svgStoryboard3(
  frames: { a: string; b: string; c: string },
  opts: SvgOpts = {}
) {
  const w = opts.width ?? 760;
  const h = opts.height ?? 160;
  const accent = opts.accent ?? "var(--accent)";
  const pad = 18;
  const gap = 12;
  const fw = (w - pad * 2 - gap * 2) / 3;
  const fy = 22;
  const fh = 108;

  const frame = (x: number, title: string, body: string) => `
    <g>
      <rect x="${x}" y="${fy}" width="${fw}" height="${fh}" rx="12" fill="var(--surface-1)"/>
      <rect x="${x}" y="${fy}" width="3" height="${fh}" rx="2" fill="${accent}" opacity="0.9"/>
      <text x="${x + 14}" y="${fy + 26}" font-size="10" fill="rgba(0,0,0,.55)" letter-spacing="2">${esc(title)}</text>
      <text x="${x + 14}" y="${fy + 52}" font-size="12" fill="rgba(0,0,0,.78)">${esc(body)}</text>
    </g>`;

  return `
  <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${w}" height="${h}" rx="14" fill="var(--paper)" stroke="var(--hairline)"/>
    ${frame(pad, "BEFORE", frames.a)}
    ${frame(pad + fw + gap, "DURING", frames.b)}
    ${frame(pad + (fw + gap) * 2, "AFTER", frames.c)}
  </svg>`;
}

export function svgLoadIndicator(value01: number, opts: SvgOpts = {}) {
  const w = opts.width ?? 260;
  const h = opts.height ?? 44;
  const accent = opts.accent ?? "var(--accent)";
  const t = Math.max(0, Math.min(1, value01));
  const fillW = 14 + t * (w - 28);

  return `
  <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${w}" height="${h}" rx="12" fill="var(--surface-1)"/>
    <rect x="14" y="18" width="${w - 28}" height="8" rx="6" fill="rgba(0,0,0,.10)"/>
    <rect x="14" y="18" width="${fillW}" height="8" rx="6" fill="${accent}"/>
  </svg>`;
}