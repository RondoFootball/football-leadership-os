import type { DevelopmentPlanV1, FocusItemV1 } from "./engineSchema";

function pickMax3(focus: FocusItemV1[]) {
  return Array.isArray(focus) ? focus.slice(0, 3) : [];
}

/**
 * v1 generator: deterministic + closed output
 * - Gives a premium baseline
 * - Later we swap internals to LLM + your master library
 */
export function generatePlanV1(input: DevelopmentPlanV1): DevelopmentPlanV1 {
  const p = structuredClone(input);

  // Minimal guards
  p.meta = p.meta || ({} as DevelopmentPlanV1["meta"]);
  p.brand = p.brand || ({} as DevelopmentPlanV1["brand"]);
  p.player = p.player || ({} as DevelopmentPlanV1["player"]);
  p.diagnosis = p.diagnosis || ({} as DevelopmentPlanV1["diagnosis"]);
  p.priority = p.priority || ({} as DevelopmentPlanV1["priority"]);
  p.clubModel = p.clubModel || ({} as DevelopmentPlanV1["clubModel"]);
  p.notNow = p.notNow || ({} as DevelopmentPlanV1["notNow"]);
  p.focus = Array.isArray(p.focus) ? p.focus : [];

  if (!p.meta.club) p.meta.club = p.brand.clubName || "Club";
  if (!p.meta.team) p.meta.team = p.player.team || "First Team";

  // If trainer didn't write the sharp object yet, create a safe baseline
  const intent = (p.diagnosis.initialIntent || "").trim();
  if (!(p.diagnosis.dominantDevelopmentObject || "").trim()) {
    p.diagnosis.dominantDevelopmentObject = intent
      ? `Execution under pressure: ${intent}`
      : "Execution under pressure (define in intake)";
  }

  // Priority
  if (!(p.priority.title || "").trim()) {
    p.priority.title = "Execution under pressure";
  }

  if (!(p.priority.whyNow || "").trim()) {
    const model = (p.clubModel.criticalPhase || "").trim();
    p.priority.whyNow = model
      ? `This block protects clarity and repeatability in the player’s role — with focus on ${model}.`
      : "This block protects clarity and repeatability in the player’s role. Focus stays narrow to avoid overload.";
  }

  if (!(p.priority.observableShift || "").trim()) {
    p.priority.observableShift =
      "Within 8 weeks: stable, repeatable execution in match-like pressure moments.";
  }

  // Default focus suggestions (if empty)
  if (!p.focus.length) {
    const base: FocusItemV1[] = [
      {
        id: "SCAN_DECIDE_EXECUTE",
        title: "Scan → decide → execute",
        type: "tactical",
        context:
          "Build-up and progression moments where time is limited and options collapse.",
        goodLooksLike:
          "Chooses first or second option within ~2 seconds and commits without hesitation.",
        playerActions: [
          "2 decision reps per session (match-like constraints).",
          "One short clip review: identify trigger → pick option A/B.",
          "Pre-scan rule: shoulders before first touch (every rep).",
        ],
        staffActions: [
          "Design reps with time/space constraints (2-touch windows).",
          "Freeze + replay: reinforce correct trigger recognition.",
          "Protect reps volume: depth over variety this block.",
        ],
        constraints:
          "Reduce options to 2–3 in reps to train speed and clarity.",
        riskIfOverloaded:
          "Too many cues slows decisions and increases hesitation.",
      },
      {
        id: "ROLE_CLARITY_NONNEGOTIABLES",
        title: "Role clarity (non-negotiables)",
        type: "tactical",
        context:
          "Moments where the club model demands a consistent choice (spacing, cover, rest-defence).",
        goodLooksLike:
          "Hits the non-negotiable action without hesitation in chaotic moments.",
        playerActions: [
          "Before session: state the role rule in one line.",
          "After session: tag 2 moments where the rule was met/missed.",
        ],
        staffActions: [
          "Name the non-negotiable in one sentence (no extra coaching).",
          "Use 2–3 clips that show the rule under pressure.",
        ],
        constraints:
          "One rule only for this block. No expanding the role description.",
        riskIfOverloaded:
          "Role becomes ‘everything’ and the player loses clarity.",
      },
      {
        id: "STABILITY_AFTER_MISTAKE",
        title: "Stability after mistake",
        type: "behavioural",
        context:
          "Immediate next action after an error in a high-visibility moment.",
        goodLooksLike:
          "Resets within 5 seconds and executes the next action at normal speed.",
        playerActions: [
          "Reset routine: breath + cue word (every error rep).",
          "Next action rule: play the simple option immediately after error.",
        ],
        staffActions: [
          "Create controlled error reps (safe exposure).",
          "Reinforce the reset, not the emotion narrative.",
        ],
        constraints: "No post-error lectures. One cue, then next rep.",
        riskIfOverloaded:
          "Over-coaching increases shame and slows the reset.",
      },
    ];

    p.focus = pickMax3(base);
  } else {
    p.focus = pickMax3(p.focus);
  }

  // Not now
  if (!(p.notNow.reasoning || "").trim()) {
    p.notNow = {
      excludedFocus: ["Add extra focus points"],
      reasoning:
        "This block stays narrow to protect clarity and repeatability.",
    };
  } else {
    p.notNow.excludedFocus = Array.isArray(p.notNow.excludedFocus)
      ? p.notNow.excludedFocus
      : [];
  }

  // Evaluation
  const evaluation =
    p.evaluation ??
    (p.evaluation = {
      reviewMoment: "",
      decisionCriteria: "",
      shortTermMarker: "",
      midTermMarker: "",
    });

  if (!(evaluation.reviewMoment || "").trim()) {
    evaluation.reviewMoment = "Week 4 + Week 8";
  }

  if (!(evaluation.decisionCriteria || "").trim()) {
    evaluation.decisionCriteria =
      "Continue if behaviour is stable under pressure; adjust if instability persists or overload signals increase.";
  }

  if (!(evaluation.shortTermMarker || "").trim()) {
    evaluation.shortTermMarker = "Clarity starts: fewer hesitations in reps.";
  }

  if (!(evaluation.midTermMarker || "").trim()) {
    evaluation.midTermMarker =
      "Behaviour holds in match-like pressure moments.";
  }

  return p;
}