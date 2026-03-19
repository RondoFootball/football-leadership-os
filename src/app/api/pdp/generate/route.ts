import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { retrieveKnowledge } from "@/app/development/player-development-plan/ui/lib/knowledgeIndex";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function safeString(v: any, fallback = "") {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function clampHex(v: string) {
  const s = (v || "").trim();
  if (!s) return "#111111";
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#111111";
}

function normalizePlan(seed: DevelopmentPlanV1, ai: any): DevelopmentPlanV1 {
  const merged: any = { ...seed, ...(ai || {}) };

  // Ensure required blocks exist
  merged.meta = merged.meta || seed.meta;
  merged.brand = merged.brand || seed.brand;
  merged.player = merged.player || seed.player;
  merged.clubModel = merged.clubModel || seed.clubModel;
  merged.diagnosis = merged.diagnosis || seed.diagnosis;
  merged.priority = merged.priority || seed.priority;
  merged.notNow = merged.notNow || seed.notNow;

  merged.meta.blockLengthWeeks =
    Number(merged.meta.blockLengthWeeks) || seed.meta.blockLengthWeeks || 8;
  merged.brand.primaryColor = clampHex(
    merged.brand.primaryColor || seed.brand.primaryColor
  );

  // Focus normalize
  const rawFocus = Array.isArray(merged.focus) ? merged.focus : [];
  merged.focus = rawFocus.slice(0, 3).map((f: any, idx: number) => ({
    id: safeString(f?.id, `f_${idx}_${safeString(f?.title, "focus").slice(0, 18)}`),
    title: safeString(f?.title, `Focus ${idx + 1}`),
    context: safeString(f?.context, ""),
    type: safeString(f?.type, "focus"),
    goodLooksLike: Array.isArray(f?.goodLooksLike)
      ? f.goodLooksLike.filter((x: any) => typeof x === "string").join(" • ")
      : safeString(f?.goodLooksLike, ""),
    constraints: safeString(f?.constraints, ""),
    playerActions: Array.isArray(f?.playerActions)
      ? f.playerActions.filter((x: any) => typeof x === "string").slice(0, 8)
      : [],
    staffActions: Array.isArray(f?.staffActions)
      ? f.staffActions.filter((x: any) => typeof x === "string").slice(0, 8)
      : [],
    riskIfOverloaded: safeString(f?.riskIfOverloaded, ""),
  }));

  // Context/stakeholders/governance/expectedShift/evaluation/versions
  merged.context = merged.context || seed.context;
  merged.stakeholders = merged.stakeholders || seed.stakeholders;
  merged.governance = merged.governance || seed.governance;
  merged.expectedShift = merged.expectedShift || seed.expectedShift;
  merged.evaluation = merged.evaluation || seed.evaluation;
  merged.versions = merged.versions || seed.versions;

  if (!merged.governance?.horizonWeeks) merged.governance.horizonWeeks = merged.meta.blockLengthWeeks || 8;
  if (!Array.isArray(merged.governance?.checkpoints)) merged.governance.checkpoints = [];

  if (!Array.isArray(merged.expectedShift?.staffSignals)) merged.expectedShift.staffSignals = [];
  if (!Array.isArray(merged.expectedShift?.playerSignals)) merged.expectedShift.playerSignals = [];

  if (!merged.evaluation?.reviewMoment) merged.evaluation.reviewMoment = seed.evaluation?.reviewMoment || "End of block.";
  if (!merged.evaluation?.decisionCriteria) merged.evaluation.decisionCriteria = seed.evaluation?.decisionCriteria || "Observable shift is visible.";

  if (!merged.versions?.staff) merged.versions.staff = { summary: "", keyMessages: [] };
  if (!merged.versions?.player) merged.versions.player = { summary: "", keyMessages: [] };
  if (!Array.isArray(merged.versions.staff.keyMessages)) merged.versions.staff.keyMessages = [];
  if (!Array.isArray(merged.versions.player.keyMessages)) merged.versions.player.keyMessages = [];

  // Ensure createdAtISO
  if (!merged.meta.createdAtISO) merged.meta.createdAtISO = new Date().toISOString();

  return merged as DevelopmentPlanV1;
}

const SYSTEM = `
You are an elite Head of Player Development in professional football.

Write a decision-grade 8-week Player Development Plan.
Language: simple English for football industry (MBO/HBO level). Short sentences. No academic jargon.

Output requirements:
- Output JSON ONLY (no markdown).
- Produce a full plan object matching the provided schema shape.
- The plan must include:
  (1) context (match + training + video)
  (2) stakeholders (who is involved)
  (3) governance (time horizon + checkpoints)
  (4) expectedShift (signals for staff + player)
  (5) focus blocks (max 3) with practical training + actions
  (6) two versions: staff + player summaries and key messages.

Quality rules:
- Do not ask questions. Make reasonable assumptions if something is missing.
- Focus on ONE dominant match moment under pressure.
- Make it executable: weekly rhythm, clear observables, simple constraints.
- Avoid red/green judgement language.
`;

export async function POST(req: Request) {
  try {
    const seed = (await req.json()) as DevelopmentPlanV1;

    // RAG hits (Dutch query allowed; model output stays English)
    const ragQueryParts = [
      seed?.diagnosis?.initialIntent,
      seed?.diagnosis?.breakdownMoment,
      seed?.diagnosis?.pressureType,
      seed?.player?.role,
    ].filter(Boolean);
    const ragQuery = ragQueryParts.join(" | ").slice(0, 400);

    const hits = retrieveKnowledge({ query: ragQuery || "player development plan time horizon checkpoints", topK: 6 });
    const knowledge = hits
      .map((h) => `SOURCE: ${h.source}${h.page ? ` p.${h.page}` : ""}\n${h.text}`)
      .join("\n\n---\n\n")
      .slice(0, 9000);

    const userPrompt = `
PLAN INPUT (seed):
${JSON.stringify(seed, null, 2)}

MASTER KNOWLEDGE (use as principles, not quotes):
${knowledge || "(no hits)"}

Write the full plan now.
`.trim();

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.35,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" } as any,
    });

    const raw = resp.choices?.[0]?.message?.content || "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Generate failed", message: "Model returned non-JSON." },
        { status: 500 }
      );
    }

    const out = normalizePlan(seed, parsed);
    return NextResponse.json(out);
  } catch (err: any) {
    const message =
      err?.message || (typeof err === "string" ? err : "Unknown error");
    console.error("PDP_GENERATE_ERROR:", message);
    return NextResponse.json({ error: "Generate failed", message }, { status: 500 });
  }
}