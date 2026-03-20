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

function hasMeaningfulUserInput(messages: ChatMsg[]) {
  const userMessages = (messages || [])
    .filter((m) => m.role === "user")
    .map((m) => (m.content || "").trim())
    .filter(Boolean);

  if (!userMessages.length) return false;

  const totalChars = userMessages.reduce((sum, msg) => sum + msg.length, 0);
  return totalChars >= 20;
}

function buildGeneratePrompt(lang: Lang) {
  return `
You generate a structured football Player Development Plan patch.

Your role:
- Convert conversation evidence into a structured first draft
- Only write what is supported by the conversation or current draft
- Leave sections empty if there is not enough basis

Hard rules:
- Return only valid JSON
- Output only fields you are genuinely confident about
- Do not invent football content
- Do not add generic filler text
- Do not create coaching plans, responsibilities or success criteria unless they are supported by the conversation
- Do not guess missing match context, role context, actions, timelines or evaluation criteria
- If the evidence is weak or incomplete, keep the patch partial
- It is allowed to return an almost empty patch
- Prefer omission over fabrication

Quality rules:
- Be concrete, football-specific and observable
- Keep one dominant development line if the conversation supports one
- Responsibilities must be explicit only if actually discussed or directly inferable
- Success criteria must be observable only if grounded in the conversation
- This is an INDIVIDUAL player development plan in a team context
- The player role and team effect matter, but may only be included if supported

Allowed output areas:
- slide2
- slideContext
- slide3Baseline
- slide3
- slide4DevelopmentRoute
- slide6SuccessDefinition

Important distinction:
- You may summarise what the user already made clear
- You may not add new content just because it would make the plan look more complete

Language:
${lang === "nl" ? "Write all content in Dutch." : "Write all content in English."}

Return exactly this JSON shape:
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

    if (!hasMeaningfulUserInput(messages)) {
      const planner = buildPlannerState(draftPlan);

      return NextResponse.json({
        message:
          lang === "nl"
            ? "Er is nog te weinig gesprekinput om een eerste versie van het plan op te bouwen."
            : "There is not enough conversation input yet to build a first draft of the plan.",
        plan: draftPlan,
        derived: {
          planner,
        },
      });
    }

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.3,
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

Build a first draft patch from supported evidence only.
Do not fill unsupported fields.
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
          ? "Ik heb een eerste versie opgebouwd op basis van wat in het gesprek voldoende duidelijk was."
          : "I built a first draft based on what was sufficiently clear in the conversation."),
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