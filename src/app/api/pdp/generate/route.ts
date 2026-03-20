// src/app/api/pdp/generate/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { buildPlannerState } from "../chat/chatPlanner";

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
  ? new OpenAI({
      apiKey,
    })
  : null;

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
};

type ApiInput = {
  messages: ChatMsg[];
  draftPlan?: Partial<DevelopmentPlanV1>;
  lang?: Lang;
};

function deepMergePlan(
  base: Partial<DevelopmentPlanV1>,
  patch: Partial<DevelopmentPlanV1>
): Partial<DevelopmentPlanV1> {
  const out = structuredClone(base || {});

  function merge(target: any, source: any) {
    for (const key of Object.keys(source || {})) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue)
      ) {
        target[key] = merge(targetValue || {}, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
    return target;
  }

  return merge(out, patch || {});
}

function buildGeneratePrompt(lang: Lang) {
  return `
You generate a structured football Player Development Plan patch.

Rules:
- Return only valid JSON
- Output only fields you are confident about
- Be concrete, football-specific and observable
- Keep one dominant development line
- Responsibilities must be explicit
- Avoid generic coaching language
- Use role and match context where available
- Output must fit these areas:
  - slide2
  - slideContext
  - slide3Baseline and/or slide3
  - slide4DevelopmentRoute
  - slide6SuccessDefinition

Very important:
- This is an INDIVIDUAL player development plan inside a team context
- The player's role and the effect on the team matter
- Responsibilities must not stay vague
- Success must be observable in football behaviour and game impact

Language:
${lang === "nl" ? "Write all content in Dutch." : "Write all content in English."}

Return exactly this shape:
{
  "message": "short user-facing note",
  "planPatch": {
    "slide2": {},
    "slideContext": {},
    "slide3Baseline": {},
    "slide3": {},
    "slide4DevelopmentRoute": {},
    "slide6SuccessDefinition": {}
  }
}
  `.trim();
}

export async function POST(req: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        {
          message: "OPENAI_API_KEY ontbreekt in je lokale environment.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ApiInput;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const draftPlan = body.draftPlan || {};
    const lang: Lang = body.lang === "en" ? "en" : "nl";

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.7,
      input: [
        {
          role: "system",
          content: buildGeneratePrompt(lang),
        },
        {
          role: "user",
          content: `
Current structured draft:
${JSON.stringify(draftPlan, null, 2)}

Conversation so far:
${conversation}

Build the strongest possible first draft from this conversation.
Return only valid JSON.
          `.trim(),
        },
      ],
    });

    const text = response.output_text?.trim();
    if (!text) {
      throw new Error("No output returned from generate route.");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Generate route returned invalid JSON.");
    }

    const mergedPlan = deepMergePlan(
      draftPlan,
      parsed.planPatch || {}
    ) as DevelopmentPlanV1;

    const planner = buildPlannerState(mergedPlan);

    return NextResponse.json({
      message:
        parsed.message ||
        (lang === "nl"
          ? "Ik heb een eerste versie van het plan opgebouwd."
          : "I built a first version of the plan."),
      plan: mergedPlan,
      derived: {
        planner,
      },
    });
  } catch (error: any) {
    console.error("/api/pdp/generate error", error);

    return NextResponse.json(
      {
        message:
          error?.message ||
          "Er ging iets mis tijdens het opbouwen van de eerste versie.",
      },
      { status: 500 }
    );
  }
}