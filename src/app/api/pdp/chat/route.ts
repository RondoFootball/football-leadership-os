// src/app/api/pdp/chat/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { buildPlannerState, type PlannerState } from "./chatPlanner";
import { buildPdpSystemPrompt } from "./systemPrompt";

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
  maxTurns?: number;
  flowState?: unknown;
  plannerState?: {
    filledSlots?: Record<string, boolean>;
    missingFirstDraft?: string[];
    missingStrongDraft?: string[];
    intent?: "ask" | "summarise" | "draft_ready" | "strong_draft_ready";
    nextPrioritySlot?: string;
  } | null;
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

function mergePlannerState(
  basePlanner: PlannerState,
  slotPatch?: Record<string, boolean>
): PlannerState {
  if (!slotPatch || typeof slotPatch !== "object") {
    return basePlanner;
  }

  const nextFilledSlots: Record<string, boolean> = {
    ...(basePlanner.filledSlots || {}),
  };

  for (const [key, value] of Object.entries(slotPatch)) {
    if (value === true) {
      nextFilledSlots[key] = true;
    }
  }

  const missingFirstDraft = (basePlanner.missingFirstDraft || []).filter(
    (key) => !nextFilledSlots[key]
  );

  const missingStrongDraft = (basePlanner.missingStrongDraft || []).filter(
    (key) => !nextFilledSlots[key]
  );

  let intent: PlannerState["intent"] = "ask";
  if (missingStrongDraft.length === 0) {
    intent = "strong_draft_ready";
  } else if (missingFirstDraft.length === 0) {
    intent = "draft_ready";
  }

  const nextPrioritySlot =
    basePlanner.nextPrioritySlot && !nextFilledSlots[basePlanner.nextPrioritySlot]
      ? basePlanner.nextPrioritySlot
      : undefined;

  return {
    ...basePlanner,
    filledSlots: nextFilledSlots,
    missingFirstDraft,
    missingStrongDraft,
    intent,
    nextPrioritySlot,
  };
}

export async function POST(req: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        {
          type: "error",
          message: "OPENAI_API_KEY ontbreekt in je lokale environment.",
          done: false,
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ApiInput;

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const draftPlan = body.draftPlan || {};
    const lang: Lang = body.lang === "en" ? "en" : "nl";

    const basePlanner = buildPlannerState(draftPlan);
    const systemPrompt = buildPdpSystemPrompt({ lang, planner: basePlanner });

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.9,
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `
Current structured draft:
${JSON.stringify(draftPlan, null, 2)}

Conversation so far:
${conversation}

Return only valid JSON.
          `.trim(),
        },
      ],
    });

    const text =
      response.output_text?.trim() ||
      `{"type":"question","message":"${
        lang === "nl"
          ? "Ik heb nog iets meer context nodig. Waar zie je dit ontwikkelpunt het duidelijkst terug in het spel?"
          : "I need a bit more context. Where do you see this development point most clearly in the game?"
      }","done":false,"slotPatch":{}}`;

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({
        type: "question",
        message:
          lang === "nl"
            ? "Ik hoor de richting, maar wil het nog iets scherper maken. In welk wedstrijdmoment zie je dit het duidelijkst terug?"
            : "I hear the direction, but I want to sharpen it slightly. In which match moment do you see this most clearly?",
        done: false,
        derived: {
          planner: basePlanner,
        },
      });
    }

    const mergedPlanner = mergePlannerState(basePlanner, parsed.slotPatch);

    if (parsed.type === "plan") {
      const mergedPlan = deepMergePlan(
        draftPlan,
        parsed.planPatch || {}
      ) as DevelopmentPlanV1;

      return NextResponse.json({
        type: "plan",
        message:
          parsed.message ||
          (lang === "nl"
            ? "Ik heb een eerste versie van het plan opgebouwd."
            : "I built a first version of the plan."),
        plan: mergedPlan,
        done: true,
        derived: {
          planner: mergedPlanner,
        },
      });
    }

    if (parsed.type === "draft_ready") {
      return NextResponse.json({
        type: "question",
        message: parsed.message,
        done: false,
        derived: {
          planner: mergedPlanner,
        },
      });
    }

    return NextResponse.json({
      type: "question",
      message:
        parsed.message ||
        (lang === "nl"
          ? "Laten we het ontwikkelpunt nog iets scherper maken."
          : "Let’s sharpen the development point a bit more."),
      done: false,
      derived: {
        planner: mergedPlanner,
      },
    });
  } catch (error: any) {
    console.error("/api/pdp/chat error", error);

    return NextResponse.json(
      {
        type: "error",
        message:
          error?.message ||
          "Er ging iets mis tijdens het verwerken van het gesprek.",
        done: false,
      },
      { status: 500 }
    );
  }
}