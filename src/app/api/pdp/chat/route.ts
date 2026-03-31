import { NextResponse } from "next/server";
import OpenAI from "openai";

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { composeKnowledgeContext } from "../core/knowledgeComposer";
import { buildPlannerState, getSlotMeta, type PlannerState } from "./chatPlanner";
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
    usableSlots?: Record<string, boolean>;
    strongSlots?: Record<string, boolean>;
    slotStatuses?: Record<
      string,
      {
        quality?: "empty" | "draft" | "usable" | "strong";
        progress?: number;
        slide?:
          | "agreement"
          | "role_context"
          | "reality"
          | "approach"
          | "success";
      }
    >;
    missingFirstDraft?: string[];
    missingStrongDraft?: string[];
    intent?: "ask" | "summarise" | "draft_ready" | "strong_draft_ready";
    nextPrioritySlot?: string;
    nextPrioritySlide?:
      | "agreement"
      | "role_context"
      | "reality"
      | "approach"
      | "success";
    firstDraftProgress?: number;
    strongDraftProgress?: number;
  } | null;
};

type ParsedModelResponse = {
  type?: "question" | "draft_ready" | "plan";
  message?: string;
  planPatch?: Partial<DevelopmentPlanV1>;
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

function localMessage(lang: Lang, nl: string, en: string) {
  return lang === "nl" ? nl : en;
}

function hasMeaningfulUserInput(messages: ChatMsg[]) {
  const userMessages = (messages || [])
    .filter((m) => m.role === "user")
    .map((m) => (m.content || "").trim())
    .filter(Boolean);

  if (!userMessages.length) return false;

  const totalChars = userMessages.reduce((sum, msg) => sum + msg.length, 0);
  return totalChars >= 12;
}

function sanitizePlannerState(
  plannerState: ApiInput["plannerState"]
): Partial<PlannerState> | null {
  if (!plannerState) return null;

  return {
    filledSlots: (plannerState.filledSlots || {}) as PlannerState["filledSlots"],
    missingFirstDraft: Array.isArray(plannerState.missingFirstDraft)
      ? (plannerState.missingFirstDraft as PlannerState["missingFirstDraft"])
      : [],
    missingStrongDraft: Array.isArray(plannerState.missingStrongDraft)
      ? (plannerState.missingStrongDraft as PlannerState["missingStrongDraft"])
      : [],
    intent:
      plannerState.intent === "draft_ready" ||
      plannerState.intent === "strong_draft_ready" ||
      plannerState.intent === "summarise"
        ? plannerState.intent
        : "ask",
    nextPrioritySlot: plannerState.nextPrioritySlot as
      | PlannerState["nextPrioritySlot"]
      | undefined,
  };
}

function buildFallbackQuestion(lang: Lang, planner: PlannerState) {
  const slot = planner.nextPrioritySlot;
  const meta = getSlotMeta(slot);

  if (meta) {
    return lang === "nl" ? meta.questionPromptNl : meta.questionPromptEn;
  }

  return localMessage(
    lang,
    "Ik hoor de richting, maar wil het nog scherper maken. Wat zie je concreet gebeuren op het veld?",
    "I hear the direction, but I want to sharpen it further. What do you concretely see happening on the pitch?"
  );
}

function stripCodeFences(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith("```json")) {
    return trimmed.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  }

  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  }

  return trimmed;
}

function safeParseModelResponse(text: string): ParsedModelResponse | null {
  const cleaned = stripCodeFences(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start >= 0 && end > start) {
      const sliced = cleaned.slice(start, end + 1);
      try {
        return JSON.parse(sliced);
      } catch {
        return null;
      }
    }

    return null;
  }
}

function normalizeParsedResponse(
  parsed: ParsedModelResponse | null
): ParsedModelResponse {
  if (!parsed || typeof parsed !== "object") {
    return {
      type: "question",
      message: "",
      planPatch: {},
    };
  }

  return {
    type:
      parsed.type === "plan" ||
      parsed.type === "draft_ready" ||
      parsed.type === "question"
        ? parsed.type
        : "question",
    message: typeof parsed.message === "string" ? parsed.message.trim() : "",
    planPatch:
      parsed.planPatch && typeof parsed.planPatch === "object"
        ? parsed.planPatch
        : {},
  };
}

function buildRoutingInstruction(
  lang: Lang,
  planner: PlannerState,
  draftPlan: Partial<DevelopmentPlanV1>
) {
  const nextSlotMeta = getSlotMeta(planner.nextPrioritySlot);

  const slotLine = nextSlotMeta
    ? localMessage(
        lang,
        `Volgende prioriteit: ${nextSlotMeta.key} (${nextSlotMeta.label}) op slide ${nextSlotMeta.slide}.`,
        `Next priority: ${nextSlotMeta.key} (${nextSlotMeta.label}) on slide ${nextSlotMeta.slide}.`
      )
    : localMessage(
        lang,
        "Er is geen duidelijke volgende prioriteitsslot gevonden.",
        "No clear next priority slot was found."
      );

  const intensityLine =
    planner.intent === "strong_draft_ready"
      ? localMessage(
          lang,
          "De planbasis is sterk genoeg. Schrijf liever gericht mee dan opnieuw breed uitvragen.",
          "The plan base is strong enough. Prefer writing forward over broadly asking again."
        )
      : planner.intent === "draft_ready"
      ? localMessage(
          lang,
          "Er is genoeg basis voor een eerste draft. Vraag alleen nog door als dat echt iets toevoegt.",
          "There is enough backbone for a first draft. Only ask further if it clearly adds something."
        )
      : localMessage(
          lang,
          "De kern is nog niet scherp genoeg. Stel precies één vraag die de grootste inhoudelijke winst oplevert.",
          "The backbone is not yet sharp enough. Ask exactly one question that creates the biggest content gain."
        );

  const currentStateLine = localMessage(
    lang,
    `First draft progress: ${planner.firstDraftProgress}%. Strong draft progress: ${planner.strongDraftProgress}%.`,
    `First draft progress: ${planner.firstDraftProgress}%. Strong draft progress: ${planner.strongDraftProgress}%.`
  );

  const planSignal = JSON.stringify(
    {
      slide2: draftPlan.slide2,
      slideContext: draftPlan.slideContext,
      slide3: draftPlan.slide3,
      slide3Baseline: draftPlan.slide3Baseline,
      slide4DevelopmentRoute: draftPlan.slide4DevelopmentRoute,
      slide6SuccessDefinition: draftPlan.slide6SuccessDefinition,
    },
    null,
    2
  );

  return `
${slotLine}
${intensityLine}
${currentStateLine}

Current plan signal:
${planSignal}

Decision rules:
- Ask at most one question
- Prefer sharpening over repeating
- Prefer writing a sharper draft line into planPatch before asking again
- Never ask for information that is already usable in the plan
- Only return type "draft_ready" when the backbone is genuinely usable
- Only return type "plan" if you believe the generate route could build from this without obvious gaps
- If one slot is weak but already present, sharpen it instead of switching topic too early
  `.trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ApiInput;

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const draftPlan = body.draftPlan || {};
    const lang: Lang = body.lang === "en" ? "en" : "nl";

    if (!client) {
      return NextResponse.json(
        {
          type: "error",
          message: localMessage(
            lang,
            "OPENAI_API_KEY ontbreekt in je lokale environment.",
            "OPENAI_API_KEY is missing in your local environment."
          ),
          done: false,
        },
        { status: 500 }
      );
    }

    const plannerFromPlan = buildPlannerState(draftPlan);
    const incomingPlanner = sanitizePlannerState(body.plannerState);

    const basePlanner: PlannerState =
      incomingPlanner && Object.keys(incomingPlanner.filledSlots || {}).length
        ? {
            ...plannerFromPlan,
            ...incomingPlanner,
          }
        : plannerFromPlan;

    if (!hasMeaningfulUserInput(messages)) {
      return NextResponse.json({
        type: "question",
        message: buildFallbackQuestion(lang, basePlanner),
        done: false,
        derived: {
          planner: basePlanner,
        },
      });
    }

    const systemPrompt = buildPdpSystemPrompt({
      lang,
      planner: basePlanner,
    });

    const knowledgeContext = composeKnowledgeContext({
      lang,
      draftPlan,
      planner: basePlanner,
      messages,
    });

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const routingInstruction = buildRoutingInstruction(
      lang,
      basePlanner,
      draftPlan
    );

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.35,
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

Current planner state:
${JSON.stringify(basePlanner, null, 2)}

Relevant knowledge context:
${knowledgeContext.knowledgeText}

Knowledge routing metadata:
${JSON.stringify(
  {
    selectedContext: knowledgeContext.selectedContext,
    selectedFocus: knowledgeContext.selectedFocus,
    selectedRoleKey: knowledgeContext.selectedRoleKey,
    selectedRoleLabel: knowledgeContext.selectedRoleLabel,
  },
  null,
  2
)}

Conversation so far:
${conversation}

Routing instruction:
${routingInstruction}

Output rules:
- Return only valid JSON
- Use this shape:
  {
    "type": "question" | "draft_ready" | "plan",
    "message": "string",
    "planPatch": {}
  }
- Ask at most one high-value next question
- Prefer one sharp next question over broad summaries
- Prefer a small truthful planPatch over no planPatch
- Only mark progress forward when the conversation truly supports it
- Use the knowledge context as an internal football thinking frame, not as encyclopaedic output
- Stay specific to observable football behaviour, role demands and plan usefulness
- Do not invent plan content
- Do not output markdown
          `.trim(),
        },
      ],
    });

    const text = response.output_text?.trim();

    if (!text) {
      return NextResponse.json({
        type: "question",
        message: buildFallbackQuestion(lang, basePlanner),
        done: false,
        derived: {
          planner: basePlanner,
        },
      });
    }

    const parsed = normalizeParsedResponse(safeParseModelResponse(text));

    const patchedPlan = deepMergePlan(
      draftPlan,
      parsed.planPatch || {}
    ) as Partial<DevelopmentPlanV1>;

    const recomputedPlanner = buildPlannerState(patchedPlan);

    if (parsed.type === "plan") {
      return NextResponse.json({
        type: "question",
        message:
          parsed.message ||
          localMessage(
            lang,
            "De kern staat voldoende scherp om nu een eerste versie van het plan te maken.",
            "The core is sharp enough to generate a first draft now."
          ),
        done: false,
        derived: {
          planner: {
            ...recomputedPlanner,
            intent: "draft_ready",
          },
        },
      });
    }

    if (parsed.type === "draft_ready") {
      return NextResponse.json({
        type: "question",
        message:
          parsed.message ||
          localMessage(
            lang,
            "De kern staat voldoende scherp voor een eerste versie. Je kunt nu een eerste plan maken of nog één laag verder aanscherpen.",
            "The core is sharp enough for a first version. You can now build a first draft or sharpen it one layer further."
          ),
        done: false,
        derived: {
          planner: {
            ...recomputedPlanner,
            intent:
              recomputedPlanner.intent === "strong_draft_ready"
                ? "strong_draft_ready"
                : "draft_ready",
          },
        },
      });
    }

    return NextResponse.json({
      type: "question",
      message:
        parsed.message || buildFallbackQuestion(lang, recomputedPlanner),
      done: false,
      derived: {
        planner: recomputedPlanner,
      },
    });
  } catch (error: any) {
    console.error("/api/pdp/chat error", error);

    return NextResponse.json(
      {
        type: "error",
        message:
          error?.message ||
          localMessage(
            "nl",
            "Er ging iets mis tijdens het verwerken van het gesprek.",
            "Something went wrong while processing the conversation."
          ),
        done: false,
      },
      { status: 500 }
    );
  }
}