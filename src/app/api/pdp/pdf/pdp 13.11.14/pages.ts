function esc(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function bullets(list?: string[], max = 6, fallback = "To be confirmed in video review.") {
  const xs = Array.isArray(list) ? list.filter(Boolean).slice(0, max) : [];
  if (!xs.length) return `<div class="p muted">${esc(fallback)}</div>`;
  return `<ul class="list">${xs
    .map((x) => `<li class="li"><span class="dot"></span><span class="p">${esc(x)}</span></li>`)
    .join("")}</ul>`;
}

export function pageCover(args: {
  club: string;
  player: string;
  roleTeam: string;
  versionTag: string;
  horizonTag: string;
  review: string;
  logoUrl?: string;
  headshotUrl?: string;
  northStar?: string;
}) {
  const { club, player, roleTeam, versionTag, horizonTag, review, logoUrl, headshotUrl, northStar } = args;

  return `
  <section class="page cover">
    <div class="coverHero">
      ${headshotUrl ? `<img class="coverImg" src="${esc(headshotUrl)}" alt="" />` : ""}
      <div class="coverDark"></div>
      <div class="coverGrain"></div>
      <div class="coverAccentLine"></div>
    </div>

    <div class="coverInner">
      <div class="coverTop">
        ${
          logoUrl
            ? `<img class="logo" src="${esc(logoUrl)}" alt="${esc(club)} logo" />`
            : `<div class="kicker inverse">${esc(club)}</div>`
        }
        <div class="meta inverse">${esc(review)}</div>
      </div>

      <div class="coverTitle">
        <div class="kicker inverse">Development Plan</div>
        <div class="h1 inverse">${esc(player)}</div>
        <div class="meta inverse" style="margin-top:10px;">${esc(roleTeam)}</div>

        <div class="tagRow">
          <span class="tag inverse">${esc(versionTag)}</span>
          <span class="tag inverse">${esc(horizonTag)}</span>
        </div>

        ${
          northStar
            ? `<p class="p inverse" style="margin-top:16px; max-width: 62ch;">${esc(northStar)}</p>`
            : ""
        }
      </div>
    </div>
  </section>`;
}

/**
 * VISUAL OS: CONTEXT PAGE
 * - Doel: begrip, rust, geen sturing
 * - Mag NIET: doelen/prioriteiten, tijdshorizon, toetsmomenten
 */
export function pageContext(args: {
  title: string;
  playerContext: string[];
  matchContext: string[];
  constraints: string[];
  note: string;
}) {
  const { title, playerContext, matchContext, constraints, note } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">${esc(title)}</div>
      <div class="h2">Context to understand the player</div>
      <p class="p muted" style="margin-top:10px; max-width: 84ch;">
        This page explains the reality around the player. It does not push direction.
      </p>
    </div>

    <div class="grid2" style="margin-top: var(--s-5);">
      <div class="card">
        <div class="kicker">Player context</div>
        <div style="margin-top:10px;">
          ${bullets(playerContext, 7, "Add 3–5 bullets about role, strengths, development phase, confidence, routines.")}
        </div>
      </div>
      <div class="card">
        <div class="kicker">Match / game context</div>
        <div style="margin-top:10px;">
          ${bullets(matchContext, 7, "Add 3–5 bullets about typical situations, opponents, phase of play, role demands.")}
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: var(--s-4);">
      <div class="kicker">Constraints</div>
      <div style="margin-top:10px;">
        ${bullets(constraints, 7, "Add availability, load, schedule, role stability, training time, injury considerations.")}
      </div>
      <p class="p muted" style="margin-top:12px;">${esc(note)}</p>
    </div>
  </section>`;
}

/**
 * VISUAL OS: DIRECTION PAGE
 * - Doel: richting verankeren
 * - Mag: dominant object, waarom nu, not now
 * - Mag NIET: concrete oefenvormen / operationele details (die komen later)
 */
export function pageDirection(args: {
  dominantObject: string;
  whyNow: string;
  observableShift: string;
  notNowTags: string[];
  notNowReason: string;
}) {
  const { dominantObject, whyNow, observableShift, notNowTags, notNowReason } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">Direction</div>
      <div class="h2">One clear direction for this block</div>
    </div>

    <div class="card" style="margin-top: var(--s-5);">
      <div class="kicker">Dominant development object</div>
      <div class="h3" style="margin-top:12px; max-width: 80ch;">${esc(dominantObject)}</div>

      <div class="grid2" style="margin-top: var(--s-4);">
        <div>
          <div class="kicker">Why now</div>
          <p class="p" style="margin-top:10px;">${esc(whyNow)}</p>
        </div>
        <div>
          <div class="kicker">Observable shift</div>
          <p class="p" style="margin-top:10px;">${esc(observableShift)}</p>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: var(--s-4);">
      <div class="kicker">Not now</div>
      <div class="tagWrap" style="margin-top:10px;">
        ${(notNowTags || []).slice(0, 10).map((t) => `<span class="tag">${esc(t)}</span>`).join("") || `<span class="p muted">Nothing added.</span>`}
      </div>
      <p class="p muted" style="margin-top:12px;">${esc(notNowReason)}</p>
    </div>
  </section>`;
}

export function pageDiagnosis(args: {
  storyboardHtml: string;
  evidenceList: string[];
  pressure: string;
  matchMoment: string;
}) {
  const { storyboardHtml, evidenceList, pressure, matchMoment } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">Diagnosis</div>
      <div class="h2">Match moment + pressure</div>
    </div>

    <div class="card" style="margin-top: var(--s-5);">
      <div class="kicker">Match moment storyboard</div>
      <div style="margin-top:12px;">${storyboardHtml}</div>
      <div class="grid2" style="margin-top: var(--s-3);">
        <div><div class="kicker">Key match moment</div><p class="p" style="margin-top:8px;">${esc(matchMoment)}</p></div>
        <div><div class="kicker">Pressure type</div><p class="p" style="margin-top:8px;">${esc(pressure)}</p></div>
      </div>
    </div>

    <div class="card" style="margin-top: var(--s-4);">
      <div class="kicker">Video / analysis checklist</div>
      <div style="margin-top:10px;">${bullets(evidenceList, 8, "Add 3–6 clips or observation bullets.")}</div>
    </div>
  </section>`;
}

export function pageFocusOverview(args: {
  focus: Array<{ title: string; loadSvg?: string; oneLine?: string }>;
  note: string;
}) {
  const { focus, note } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">Behaviour</div>
      <div class="h2">Focus points (max 3)</div>
      <p class="p muted" style="margin-top:10px; max-width: 84ch;">${esc(note)}</p>
    </div>

    <div class="grid3" style="margin-top: var(--s-5);">
      ${(focus || []).slice(0, 3).map((f) => `
        <div class="pillar">
          <div class="kicker">Focus</div>
          <div class="h3" style="margin-top:12px;">${esc(f.title || "Focus")}</div>
          ${f.oneLine ? `<p class="p" style="margin-top:10px;">${esc(f.oneLine)}</p>` : ``}
          <div style="margin-top:12px;">${f.loadSvg || ""}</div>
        </div>
      `).join("")}
    </div>
  </section>`;
}

export function pageFocusDeepDive(args: {
  indexLabel: string;
  title: string;
  observableShift: string;
  ladderSvg: string;
  playerActions: string[];
  staffActions: string[];
  risk?: string;
}) {
  const { indexLabel, title, observableShift, ladderSvg, playerActions, staffActions, risk } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">${esc(indexLabel)}</div>
      <div class="h2">${esc(title || "Focus")}</div>
      <p class="p" style="margin-top:10px; max-width: 78ch;"><span class="strong">Observable shift:</span> ${esc(observableShift)}</p>
    </div>

    <div class="card" style="margin-top: var(--s-5);">
      <div class="kicker">Behaviour ladder</div>
      <div style="margin-top:12px;">${ladderSvg}</div>
    </div>

    <div class="grid2" style="margin-top: var(--s-4);">
      <div class="card">
        <div class="kicker">Player actions (weekly)</div>
        <div style="margin-top:10px;">${bullets(playerActions, 7, "Add 3–6 concrete weekly actions.")}</div>
      </div>
      <div class="card">
        <div class="kicker">Staff actions (weekly)</div>
        <div style="margin-top:10px;">${bullets(staffActions, 7, "Add 3–6 staff actions (coach, analyst, S&C).")}</div>
      </div>
    </div>

    ${
      risk
        ? `<div class="card warn" style="margin-top: var(--s-4);">
            <div class="kicker">Risk if overloaded</div>
            <p class="p" style="margin-top:10px;">${esc(risk)}</p>
          </div>`
        : ""
    }
  </section>`;
}

export function pageFocusCompact(args: {
  indexLabel: string;
  title: string;
  oneLine: string;
  playerActions: string[];
}) {
  const { indexLabel, title, oneLine, playerActions } = args;
  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">${esc(indexLabel)}</div>
      <div class="h2">${esc(title || "Focus")}</div>
      <p class="p" style="margin-top:10px; max-width: 78ch;">${esc(oneLine)}</p>
    </div>

    <div class="card" style="margin-top: var(--s-5);">
      <div class="kicker">Weekly player actions</div>
      <div style="margin-top:10px;">${bullets(playerActions, 8, "Add 3–6 simple weekly actions.")}</div>
    </div>

    <div class="footer">Keep it simple. Repeat under pressure.</div>
  </section>`;
}

/**
 * VISUAL OS: GOVERNANCE PAGE
 * - Hier pas tijdshorizon + toetsmomenten + afspraken.
 */
export function pageGovernance(args: { timelineSvg: string; notes: string; who: string[] }) {
  const { timelineSvg, notes, who } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">Governance</div>
      <div class="h2">Time horizon + checkpoints</div>
    </div>

    <div class="card" style="margin-top: var(--s-5);">
      <div class="kicker">8-week rhythm</div>
      <div style="margin-top:12px;">${timelineSvg}</div>
      <p class="p" style="margin-top:12px;">${esc(notes)}</p>
    </div>

    <div class="card" style="margin-top: var(--s-4);">
      <div class="kicker">Who is involved</div>
      <div style="margin-top:10px;">${bullets(who, 8, "Add responsible people + role.")}</div>
    </div>
  </section>`;
}

export function pageEvidence(args: {
  staffSignals: string[];
  playerSignals: string[];
  decisionCriteria: string;
}) {
  const { staffSignals, playerSignals, decisionCriteria } = args;

  return `
  <section class="page">
    <div class="sectionHead">
      <div class="kicker">Expected shift</div>
      <div class="h2">Signals over stats</div>
    </div>

    <div class="grid2" style="margin-top: var(--s-5);">
      <div class="card">
        <div class="kicker">Staff signals</div>
        <div style="margin-top:10px;">${bullets(staffSignals, 7, "Add 4–6 observable staff signals.")}</div>
      </div>
      <div class="card">
        <div class="kicker">Player signals</div>
        <div style="margin-top:10px;">${bullets(playerSignals, 7, "Add 3–5 simple player signals.")}</div>
      </div>
    </div>

    <div class="card" style="margin-top: var(--s-4);">
      <div class="kicker">Decision criteria</div>
      <p class="p" style="margin-top:10px;">${esc(decisionCriteria)}</p>
    </div>

    <div class="footer">Development Plan</div>
  </section>`;
}