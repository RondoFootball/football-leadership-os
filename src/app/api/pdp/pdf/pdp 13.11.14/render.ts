// src/app/api/pdp/pdf/pdp/render.ts
import type { DevelopmentPlanV1 } from "../engineSchema";
import { buildTheme } from "./theme";
import {
  svgTimeline8Weeks,
  svgBehaviourLadder,
  svgConstraintsQuadrant,
  svgStoryboard3,
  svgLoadIndicator,
} from "./diagrams";
import {
  pageSnapshot,
  pageDiagnosis,
  pageFocusOverview,
  pageFocusDetail,
  pageGovernance,
  pageEvidence,
} from "./pages";
import { pageCoverSignature } from "./pages.cover";

type PlanVersion = "staff" | "player";
type Lang = "nl" | "en";

function esc(s: string) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function safeStr(v: any, fallback = "") {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function toPdpCode(createdAtISO?: string) {
  const iso = safeStr(createdAtISO, "");
  if (!iso) return "";
  // PDP-YYMMDD
  const d = iso.slice(2, 10).replaceAll("-", "");
  return `PDP-${d}`;
}

export function renderPdpHtmlPro(
  plan: DevelopmentPlanV1,
  opts?: { version?: PlanVersion; lang?: Lang }
) {
  const version: PlanVersion = opts?.version || "staff";
  const lang: Lang = opts?.lang || "nl";

  const theme = buildTheme({ accentHex: plan?.brand?.primaryColor || "#111111" });

  const club = esc(plan.brand.clubName || plan.meta.club || "Club");
  const player = esc(plan.player.name || "Player");
  const role = esc(plan.player.role || "Role");
  const team = esc(plan.player.team || plan.meta.team || "Team");
  const logoUrl = plan.brand.logoUrl?.trim() || "";
  const headshotUrl = plan.player.headshotUrl?.trim() || "";
  const horizon = plan.meta.blockLengthWeeks || 8;

  // ---- Language strings (hard separated) ----
  const L = lang === "nl"
    ? {
        systemLine: "Performance Development System",
        blockLine: `${horizon} week performance block`,
        versionTag: version === "player" ? "Speler" : "Staf",
        reviewPrefix: "Review",
      }
    : {
        systemLine: "Performance Development System",
        blockLine: `${horizon}-week performance block`,
        versionTag: version === "player" ? "Player" : "Staff",
        reviewPrefix: "Review",
      };

  // “headline”: ultra short, don’t use raw user sentence if it’s long
  const headline = safeStr(plan.priority?.title, "").slice(0, 52);

  // Cover line for role/team
  const roleLine = `${role} · ${team}`;

  const cover = pageCoverSignature({
    clubName: club,
    logoUrl,
    accentHex: theme.accent,
    playerName: player,
    roleLine,
    blockLine: `${L.versionTag} · ${L.blockLine}`,
    headshotUrl,
    systemLine: L.systemLine,
    phaseLabel: safeStr(plan.player.phase, "").toUpperCase(),
    code: toPdpCode(plan.meta.createdAtISO),
    headline,
  });

  // Medals / snapshot content
  const medals = [
    { k: lang === "nl" ? "Dominant object" : "Dominant object", v: plan.diagnosis?.dominantDevelopmentObject || "—" },
    { k: lang === "nl" ? "Matchmoment" : "Match moment", v: plan.diagnosis?.breakdownMoment || "—" },
    { k: lang === "nl" ? "Druk" : "Pressure", v: plan.diagnosis?.pressureType || "—" },
  ];

  const vKeys =
    version === "player"
      ? ((plan as any)?.versions?.player?.keyMessages || [])
      : ((plan as any)?.versions?.staff?.keyMessages || []);

  const whatChanges = plan.priority?.observableShift || plan.priority?.whyNow || "—";

  // Diagnosis visuals (safe fallbacks)
  const mm = safeStr((plan as any)?.context?.selectedMatchMoment, "") || safeStr(plan.diagnosis?.breakdownMoment, "");
  const storyboard = {
    a: mm ? "Voor" : "Before",
    b: mm ? mm.slice(0, 40) : "During",
    c: mm ? "Na" : "After",
  };

  const constraintsSvg = svgConstraintsQuadrant(
    {
      time: ((plan as any)?.context?.constraints || []).slice(0, 2),
      space: ((plan as any)?.context?.constraints || []).slice(2, 4),
      opponent: ((plan as any)?.context?.constraints || []).slice(4, 6),
      role: [safeStr((plan as any)?.context?.roleSummary, "")].filter(Boolean),
    },
    { accent: "var(--accent)" }
  );

  const storyboardSvg = svgStoryboard3(storyboard, { accent: "var(--accent)" });

  const focus = (plan.focus || []).slice(0, 3).map((f: any, i: number) => {
    const actions = (f.playerActions?.length || 0) + (f.staffActions?.length || 0);
    const load01 = Math.max(0, Math.min(1, actions / 14));
    return {
      title: f.title || `Focus ${i + 1}`,
      type: f.type || "focus",
      loadSvg: svgLoadIndicator(load01, { accent: "var(--accent)" }),
    };
  });

  // Ladder: ensure always filled (never blank)
  const ladderForFocus = (idx: number) => {
    const f: any = (plan.focus || [])[idx] || {};
    const from = safeStr(plan.diagnosis?.initialIntent, "Current behaviour").slice(0, 70);
    const bridge = safeStr(plan.priority?.whyNow, "Bridge").slice(0, 70);
    const to = safeStr(plan.priority?.observableShift, "Desired behaviour").slice(0, 70);

    const overrideFrom = safeStr(f.context, "");
    const overrideTo = safeStr(f.goodLooksLike, "");
    return svgBehaviourLadder(
      {
        from: overrideFrom ? overrideFrom.slice(0, 70) : from,
        bridge,
        to: overrideTo ? overrideTo.slice(0, 70) : to,
      },
      { accent: "var(--accent)" }
    );
  };

  const checkpoints = ((plan as any)?.governance?.checkpoints || [])
    .slice(0, 8)
    .map((c: any) => ({
      week: c.week || 1,
      label: safeStr(c.moment, "Checkpoint").slice(0, 16),
    }));

  const timelineSvg = svgTimeline8Weeks(
    checkpoints.length
      ? checkpoints
      : [
          { week: 2, label: lang === "nl" ? "Observeren" : "Observe" },
          { week: 4, label: lang === "nl" ? "Bijsturen" : "Adjust" },
          { week: 6, label: lang === "nl" ? "Toetsen" : "Check" },
          { week: 8, label: lang === "nl" ? "Evalueren" : "Evaluate" },
        ],
    { accent: "var(--accent)" }
  );

  const pages = [
    cover,

    pageSnapshot({
      keyMessages: Array.isArray(vKeys) ? vKeys : [],
      medals,
      whatChanges,
    }),

    pageDiagnosis({
      storyboard,
      storyboardHtml: storyboardSvg,
      constraintsHtml: constraintsSvg,
      evidenceList: ((plan as any)?.context?.videoExamples || []).slice(0, 6),
    }),

    pageFocusOverview({
      focus,
      notNowTags: plan.notNow?.excludedFocus || [],
    }),

    pageFocusDetail({
      indexLabel: lang === "nl" ? "Focus 1" : "Focus 1",
      title: plan.focus?.[0]?.title || "—",
      observableShift: plan.priority?.observableShift || "—",
      ladderSvg: ladderForFocus(0),
      playerActions: plan.focus?.[0]?.playerActions || [],
      staffActions: plan.focus?.[0]?.staffActions || [],
      risk: plan.focus?.[0]?.riskIfOverloaded || "",
    }),

    pageFocusDetail({
      indexLabel: lang === "nl" ? "Focus 2" : "Focus 2",
      title: plan.focus?.[1]?.title || (lang === "nl" ? "Compact focus" : "Compact focus"),
      observableShift: plan.focus?.[1]?.goodLooksLike || plan.priority?.observableShift || "—",
      ladderSvg: ladderForFocus(1),
      playerActions: plan.focus?.[1]?.playerActions || [],
      staffActions: plan.focus?.[1]?.staffActions || [],
      risk: plan.focus?.[1]?.riskIfOverloaded || "",
    }),

    pageGovernance({
      timelineSvg,
      notes: `${L.reviewPrefix}: ${plan.evaluation?.reviewMoment || (lang === "nl" ? "Einde blok" : "End of block")}`,
    }),

    pageEvidence({
      staffSignals: ((plan as any)?.expectedShift?.staffSignals || []).slice(0, 6),
      playerSignals: ((plan as any)?.expectedShift?.playerSignals || []).slice(0, 6),
      evidence: (((plan as any)?.context?.videoExamples || []) as string[]).slice(0, 8),
    }),
  ];

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Player Development Plan</title>
  <style>
    @page { size: A4; margin: 14mm; }
    ${theme.cssVarBlock}

    html, body { margin: 0; padding: 0; background: #fff; color: var(--ink); }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
    * { box-sizing: border-box; }

    /* Base type */
    .kicker { font-size: 9.5pt; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-soft); }
    .h1 { font-size: 42pt; line-height: 1.02; letter-spacing: -0.02em; margin: 10px 0 0; }
    .h2 { font-size: 22pt; line-height: 1.08; letter-spacing: -0.01em; margin: 0; }
    .h3 { font-size: 16pt; line-height: 1.15; margin: 0; letter-spacing: -0.01em; }
    .p { font-size: 12.8pt; line-height: 1.55; color: var(--ink-muted); margin: 0; }
    .meta { font-size: 10.8pt; color: var(--ink-soft); }
    .strong { color: var(--ink); font-weight: 600; }

    /* Page */
    .page { break-before: page; page-break-before: always; }
    .page:first-child { break-before: auto; page-break-before: auto; }
    .sectionHead { padding-top: 2mm; }
    .footer { margin-top: var(--s-6); padding-top: var(--s-2); border-top: 1px solid var(--hairline); font-size: 9pt; letter-spacing: .14em; text-transform: uppercase; color: rgba(0,0,0,.45); }

    /* Cards / grids */
    .card { border: 1px solid var(--hairline); border-radius: var(--r-3); padding: var(--s-4); background: var(--paper); }
    .card.warn { border-color: rgba(0,0,0,.14); background: linear-gradient(0deg, var(--accent-faint), rgba(255,255,255,0)); }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-3); }
    .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--s-3); }

    .list { margin: 8px 0 0; padding: 0; list-style: none; }
    .li { display: flex; gap: 8px; margin-top: 6px; }
    .dot { width: 6px; height: 6px; border-radius: 999px; background: rgba(0,0,0,.35); margin-top: 8px; flex: 0 0 auto; }
    .muted { color: var(--ink-soft); }

    .tagRow { display:flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
    .tagWrap { display:flex; gap: 8px; flex-wrap: wrap; }
    .tag { display:inline-block; padding: 7px 10px; border-radius: 999px; border: 1px solid var(--hairline); background: var(--surface-1); font-size: 9.8pt; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }

    .bigItem { font-size: 16pt; line-height: 1.25; letter-spacing: -0.01em; color: var(--ink); margin-top: 10px; }
    .medal { border: 1px solid var(--hairline); border-radius: var(--r-3); padding: var(--s-4); background: var(--surface-1); }
    .pillar { border: 1px solid var(--hairline); border-radius: var(--r-3); padding: var(--s-4); background: var(--paper); }

    /* Avoid awkward breaks */
    .card, .medal, .pillar { break-inside: avoid; page-break-inside: avoid; }

    /* ===== PDP COVER SIGNATURE (Bold Club Identity) ===== */

    .pdpPage { break-before: page; page-break-before: always; }
    .pdpPage:first-child { break-before: auto; page-break-before: auto; }

    .pdpKicker{
      font-size: 9.2pt;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: rgba(0,0,0,.55);
    }
    .pdpKicker--inv{ color: rgba(255,255,255,.70); }

    .pdpMeta{
      font-size: 10.8pt;
      color: rgba(0,0,0,.55);
    }
    .pdpMeta--inv{ color: rgba(255,255,255,.70); }
    .pdpMetaLine{ margin-top: 3px; color: rgba(255,255,255,.62); }

    .pdpMetaChip{
      display:inline-block;
      padding: 7px 10px;
      border-radius: 999px;
      font-size: 9.2pt;
      letter-spacing: .12em;
      text-transform: uppercase;
      border: 1px solid rgba(0,0,0,.12);
      background: rgba(0,0,0,.03);
      color: rgba(0,0,0,.60);
    }
    .pdpMetaChip--inv{
      border-color: rgba(255,255,255,.16);
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.74);
    }

    .pdpDot{
      width: 4px; height: 4px; border-radius: 999px;
      background: rgba(255,255,255,.55);
      display:inline-block;
      transform: translateY(-2px);
    }

    /* Cover wrapper — EXACT printable content height (A4 minus margins) */
    .pdpCover{
      position: relative;
      height: 269mm;         /* 297mm - 28mm margins */
      min-height: 269mm;
      border-radius: 18px;
      overflow: hidden;
      background: #0B0B0B;
    }

    .pdpCover__bg{ position:absolute; inset:0; }
    .pdpCover__img{
      position:absolute; inset:0;
      width:100%; height:100%;
      object-fit: cover;
      opacity: .60;
      filter: contrast(1.08) saturate(1.04);
    }
    .pdpCover__shade{
      position:absolute; inset:0;
      background: radial-gradient(1200px 600px at 20% 25%, rgba(0,0,0,.25), rgba(0,0,0,.75)),
                  linear-gradient(0deg, rgba(0,0,0,.70), rgba(0,0,0,.35));
    }
    .pdpCover__grain{
      position:absolute; inset:-30%;
      background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px);
      background-size: 7px 7px;
      opacity: .10;
      transform: rotate(9deg);
      mix-blend-mode: overlay;
    }
    .pdpCover__waves{
      position:absolute; inset:0;
      background:
        linear-gradient(115deg, var(--accent) 0%, rgba(0,0,0,0) 55%),
        radial-gradient(900px 500px at 85% 35%, var(--accent-soft), rgba(0,0,0,0) 60%);
      opacity: .22;
    }
    .pdpCover__axis{
      position:absolute;
      top:-10%; bottom:-10%;
      left: 26mm;
      width: 3px;
      background: var(--accent);
      opacity: .95;
      border-radius: 3px;
      box-shadow: 0 0 0 10px rgba(255,255,255,.02);
    }
    .pdpCover__stamp{
      position:absolute;
      right:-40mm;
      top: 18mm;
      width: 160mm;
      height: 160mm;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.10);
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.06), rgba(255,255,255,0));
      opacity: .55;
    }

    .pdpCover__inner{
      position:relative;
      height: 269mm;
      padding: 18mm 16mm;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
    }

    .pdpCover__header{
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap: 12px;
    }

    .pdpCover__brand{
      display:flex;
      align-items:flex-start;
      gap: 12px;
      min-width: 0;
    }
    .pdpCover__logo{
      max-height: 44px;
      max-width: 180px;
      opacity: .96;
      filter: drop-shadow(0 6px 18px rgba(0,0,0,.45));
    }

    .pdpCover__meta{ display:flex; gap: 8px; flex-wrap:wrap; justify-content:flex-end; }

    .pdpCover__hero{
      margin-left: 26mm;
      max-width: 140mm;
      padding-bottom: 12mm;
    }
    .pdpCover__name{
      font-size: 48pt;
      line-height: 0.98;
      letter-spacing: -0.03em;
      color: rgba(255,255,255,.94);
      font-weight: 650;
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    .pdpCover__headline{
      margin-top: 10px;
      font-size: 15pt;
      letter-spacing: .10em;
      text-transform: uppercase;
      color: rgba(255,255,255,.78);
      max-width: 90ch;
      overflow-wrap: anywhere;
    }
    .pdpCover__sub{
      margin-top: 14px;
      display:flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: baseline;
    }
    .pdpCover__role{
      font-size: 12.5pt;
      color: rgba(255,255,255,.75);
    }
    .pdpCover__block{
      font-size: 10.5pt;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: rgba(255,255,255,.62);
    }

    .pdpCover__footer{
      display:flex;
      align-items:flex-end;
      justify-content:space-between;
      gap: 12px;
    }
    .pdpCover__watermark{
      font-size: 72pt;
      letter-spacing: .06em;
      font-weight: 800;
      color: rgba(255,255,255,.06);
      line-height: 1;
    }
    .pdpCover__micro{
      display:flex;
      gap: 10px;
      align-items:center;
      font-size: 9.2pt;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: rgba(255,255,255,.58);
      white-space: nowrap;
    }
  </style>
</head>
<body>
  ${pages.join("\n")}
</body>
</html>`;
}