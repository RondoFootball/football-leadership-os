import { NextResponse } from "next/server";
import OpenAI from "openai";

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { composeKnowledgeContext } from "../core/knowledgeComposer";
import {
  buildPlannerState,
  getSlotMeta,
  type PlannerState,
} from "./chatPlanner";
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
        slide?: string;
      }
    >;
    missingFirstDraft?: string[];
    missingStrongDraft?: string[];
    intent?: "ask" | "summarise" | "draft_ready" | "strong_draft_ready";
    nextPrioritySlot?: string;
    nextPrioritySlide?: string;
    firstDraftProgress?: number;
    strongDraftProgress?: number;
  } | null;
};

type ParsedModelResponse = {
  type?: "question";
  message?: string;
  planPatch?: Partial<DevelopmentPlanV1>;
  suggestedResponses?: string[];
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
    firstDraftProgress:
      typeof plannerState.firstDraftProgress === "number"
        ? plannerState.firstDraftProgress
        : undefined,
    strongDraftProgress:
      typeof plannerState.strongDraftProgress === "number"
        ? plannerState.strongDraftProgress
        : undefined,
  };
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

function sanitizeSuggestedResponses(input: unknown) {
  if (!Array.isArray(input)) return [] as string[];

  return input
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 4);
}

function normalizeParsedResponse(
  parsed: ParsedModelResponse | null
): ParsedModelResponse {
  if (!parsed || typeof parsed !== "object") {
    return {
      type: "question",
      message: "",
      planPatch: {},
      suggestedResponses: [],
    };
  }

  return {
    type: "question",
    message: typeof parsed.message === "string" ? parsed.message.trim() : "",
    planPatch:
      parsed.planPatch && typeof parsed.planPatch === "object"
        ? parsed.planPatch
        : {},
    suggestedResponses: sanitizeSuggestedResponses(parsed.suggestedResponses),
  };
}

function getSectionLabel(lang: Lang, slide?: string) {
  switch (slide) {
    case "agreement":
      return "Agreement";
    case "role_context":
      return lang === "nl" ? "Context" : "Context";
    case "reality":
      return "Reality";
    case "approach":
      return "Approach";
    case "success":
      return "Success";
    default:
      return "";
  }
}

function getSafeNextSlide(
  draftPlan: Partial<DevelopmentPlanV1>,
  planner: PlannerState
) {
  const explicit = (draftPlan as any)?.meta?.nextPrioritySlide;
  const fromPlanner = (planner as any)?.nextPrioritySlide;
  const value = explicit || fromPlanner;

  if (
    value === "agreement" ||
    value === "role_context" ||
    value === "reality" ||
    value === "approach" ||
    value === "success"
  ) {
    return value;
  }

  return undefined;
}

function buildFallbackQuestion(
  lang: Lang,
  planner: PlannerState,
  draftPlan: Partial<DevelopmentPlanV1>
) {
  const slot = planner.nextPrioritySlot;
  const meta = getSlotMeta(slot);
  const sectionLabel = getSectionLabel(
    lang,
    getSafeNextSlide(draftPlan, planner)
  );

  if (meta) {
    const q = lang === "nl" ? meta.questionPromptNl : meta.questionPromptEn;
    return sectionLabel ? `${sectionLabel} — ${q}` : q;
  }

  return localMessage(
    lang,
    "Agreement — wat zie je concreet gebeuren op het veld?",
    "Agreement — what do you concretely see happening on the pitch?"
  );
}

function getLastUserMessage(messages: ChatMsg[]) {
  const reversed = [...messages].reverse();
  return reversed.find((m) => m.role === "user")?.content?.trim() || "";
}

function buildRoutingInstruction(
  lang: Lang,
  planner: PlannerState,
  draftPlan: Partial<DevelopmentPlanV1>,
  messages: ChatMsg[]
) {
  const nextSlotMeta = getSlotMeta(planner.nextPrioritySlot);
  const nextSectionLabel = getSectionLabel(
    lang,
    getSafeNextSlide(draftPlan, planner)
  );

  const slotLine = nextSlotMeta
    ? localMessage(
        lang,
        `Huidige prioriteit: ${nextSlotMeta.key} (${nextSlotMeta.label}) binnen ${nextSectionLabel || "de volgende sectie"}.`,
        `Current priority: ${nextSlotMeta.key} (${nextSlotMeta.label}) within ${nextSectionLabel || "the next section"}.`
      )
    : localMessage(
        lang,
        "Er is geen duidelijke volgende prioriteit gevonden.",
        "No clear next priority was found."
      );

  const planSignal = JSON.stringify(
    {
      slide2: draftPlan.slide2,
      slideContext: draftPlan.slideContext,
      slide3Baseline: draftPlan.slide3Baseline,
      slide4DevelopmentRoute: draftPlan.slide4DevelopmentRoute,
      slide6SuccessDefinition: draftPlan.slide6SuccessDefinition,
    },
    null,
    2
  );

  const recentUserMessages = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content)
    .join(" | ");

  const lastUserMessage = getLastUserMessage(messages);

  return `
${slotLine}

Recent user direction:
${recentUserMessages || "-"}

Last user message:
${lastUserMessage || "-"}

Current plan signal:
${planSignal}

Decision rules:
- Do not use draft language in user-facing output
- If a section is already usable, lock it and move forward
- If the user says move on, actually move on
- If the user says this was already answered, do not ask it again
- Prefer writing a usable line into planPatch before asking again
- Use short section-led phrasing when helpful
- Use suggestedResponses when the UI would benefit from compact click options
- Keep questions short
- Keep options very short
- Build the full plan progressively, not just the core
- Prefer ownership, intervention, evidence and success once the core is usable
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
        message: buildFallbackQuestion(lang, basePlanner, draftPlan),
        done: false,
        derived: {
          planner: basePlanner,
        },
        suggestedResponses: [],
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
      draftPlan,
      messages
    );

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.2,
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
- Use exactly this shape:
  {
    "type": "question",
    "message": "string",
    "planPatch": {},
    "suggestedResponses": []
  }
- Do not use draft language
- Build forward through the plan
- Ask at most one short high-value question
- Prefer planPatch over repetition
- Use the knowledge context only as internal football intelligence
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
        message: buildFallbackQuestion(lang, basePlanner, draftPlan),
        done: false,
        derived: {
          planner: basePlanner,
        },
        suggestedResponses: [],
      });
    }

    const parsed = normalizeParsedResponse(safeParseModelResponse(text));

    const patchedPlan = deepMergePlan(
      draftPlan,
      parsed.planPatch || {}
    ) as Partial<DevelopmentPlanV1>;

    const recomputedPlanner = buildPlannerState(patchedPlan);

    return NextResponse.json({
      type: "question",
      message:
        parsed.message || buildFallbackQuestion(lang, recomputedPlanner, patchedPlan),
      done: false,
      derived: {
        planner: recomputedPlanner,
      },
      suggestedResponses: parsed.suggestedResponses || [],
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