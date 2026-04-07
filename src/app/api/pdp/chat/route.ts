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
    missingBackbone?: string[];
    missingStrongPlan?: string[];
    intent?: "ask" | "backbone_ready" | "strong_plan_ready";
    nextPrioritySlot?: string;
    nextPrioritySlide?:
      | "agreement"
      | "role_context"
      | "reality"
      | "approach"
      | "success";
    backboneProgress?: number;
    strongPlanProgress?: number;
    liveProgress?: number;
    currentSlide?:
      | "agreement"
      | "role_context"
      | "reality"
      | "approach"
      | "success";
  } | null;
};

type ParsedModelResponse = {
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
      message: "",
      planPatch: {},
    };
  }

  return {
    message: typeof parsed.message === "string" ? parsed.message.trim() : "",
    planPatch:
      parsed.planPatch && typeof parsed.planPatch === "object"
        ? parsed.planPatch
        : {},
  };
}

function sanitizePlannerState(
  plannerState: ApiInput["plannerState"]
): Partial<PlannerState> | null {
  if (!plannerState) return null;

  return {
    filledSlots: (plannerState.filledSlots || {}) as PlannerState["filledSlots"],
    usableSlots: (plannerState.usableSlots || {}) as PlannerState["usableSlots"],
    strongSlots: (plannerState.strongSlots || {}) as PlannerState["strongSlots"],
    slotStatuses: (plannerState.slotStatuses ||
      {}) as PlannerState["slotStatuses"],
    missingBackbone: Array.isArray(plannerState.missingBackbone)
      ? (plannerState.missingBackbone as PlannerState["missingBackbone"])
      : [],
    missingStrongPlan: Array.isArray(plannerState.missingStrongPlan)
      ? (plannerState.missingStrongPlan as PlannerState["missingStrongPlan"])
      : [],
    intent:
      plannerState.intent === "backbone_ready" ||
      plannerState.intent === "strong_plan_ready"
        ? plannerState.intent
        : "ask",
    nextPrioritySlot: plannerState.nextPrioritySlot as
      | PlannerState["nextPrioritySlot"]
      | undefined,
    nextPrioritySlide: plannerState.nextPrioritySlide as
      | PlannerState["nextPrioritySlide"]
      | undefined,
    backboneProgress:
      typeof plannerState.backboneProgress === "number"
        ? plannerState.backboneProgress
        : undefined,
    strongPlanProgress:
      typeof plannerState.strongPlanProgress === "number"
        ? plannerState.strongPlanProgress
        : undefined,
    liveProgress:
      typeof plannerState.liveProgress === "number"
        ? plannerState.liveProgress
        : undefined,
    currentSlide: plannerState.currentSlide as
      | PlannerState["currentSlide"]
      | undefined,
  };
}

function getSlideLabel(
  lang: Lang,
  slide?:
    | "agreement"
    | "role_context"
    | "reality"
    | "approach"
    | "success"
) {
  if (!slide) return lang === "nl" ? "Plan" : "Plan";

  const labels = {
    agreement: { nl: "Afspraak", en: "agreement" },
    role_context: { nl: "Rolcontext", en: "Role context" },
    reality: { nl: "Realiteit", en: "Reality" },
    approach: { nl: "Aanpak", en: "Approach" },
    success: { nl: "Succes", en: "Success" },
  } as const;

  return labels[slide][lang];
}

function buildFallbackQuestion(lang: Lang, planner: PlannerState) {
  const slot = planner.nextPrioritySlot;
  const meta = getSlotMeta(slot);
  const slideLabel = getSlideLabel(lang, planner.currentSlide);

  if (meta) {
    return `${slideLabel} — ${
      lang === "nl" ? meta.questionPromptNl : meta.questionPromptEn
    }`;
  }

  return localMessage(
    lang,
    "Afspraak — Ik hoor de richting, maar wil het nog scherper maken. Wat zie je concreet gebeuren op het veld?",
    "Agreement — I hear the direction, but I want to sharpen it further. What do you concretely see happening on the pitch?"
  );
}

function buildRoutingInstruction(
  lang: Lang,
  planner: PlannerState,
  draftPlan: Partial<DevelopmentPlanV1>
) {
  const nextSlotMeta = getSlotMeta(planner.nextPrioritySlot);

  const currentSlideLine = localMessage(
    lang,
    `Huidig zichtbaar planonderdeel: ${getSlideLabel(lang, planner.currentSlide)}.`,
    `Current visible plan section: ${getSlideLabel(lang, planner.currentSlide)}.`
  );

  const nextSlideLine = localMessage(
    lang,
    `Volgend beoogd planonderdeel: ${getSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
    `Next intended plan section: ${getSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`
  );

  const slotLine = nextSlotMeta
    ? localMessage(
        lang,
        `Volgende prioriteit: ${nextSlotMeta.key} (${nextSlotMeta.label}) op ${getSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
        `Next priority: ${nextSlotMeta.key} (${nextSlotMeta.label}) on ${getSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`
      )
    : localMessage(
        lang,
        "Er is geen duidelijke volgende prioriteitsslot gevonden.",
        "No clear next priority slot was found."
      );

  const intensityLine =
    planner.intent === "strong_plan_ready"
      ? localMessage(
          lang,
          "Het plan is inhoudelijk al sterk. Bouw gericht verder en voorkom herhaling.",
          "The plan is already strong. Build forward selectively and avoid repetition."
        )
      : planner.intent === "backbone_ready"
      ? localMessage(
          lang,
          "De basis staat. Ga door naar de volgende planlagen in plaats van de kern opnieuw te openen.",
          "The backbone is there. Move into the next plan layers instead of reopening the core."
        )
      : localMessage(
          lang,
          "De kern is nog niet scherp genoeg. Zet de grootste inhoudelijke stap vooruit met minimale frictie.",
          "The core is not sharp enough yet. Create the biggest content gain with minimal friction."
        );

  const progressLine = localMessage(
    lang,
    `Live progress: ${planner.liveProgress}%. Basis: ${planner.backboneProgress}%. Sterk plan: ${planner.strongPlanProgress}%.`,
    `Live progress: ${planner.liveProgress}%. Backbone: ${planner.backboneProgress}%. Strong plan: ${planner.strongPlanProgress}%.`
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
${currentSlideLine}
${nextSlideLine}
${slotLine}
${intensityLine}
${progressLine}

Current plan signal:
${planSignal}

Decision rules:
- Keep the visible section label aligned with the actual content of the turn
- Ask at most one question
- Prefer writing a sharper draft line into planPatch before asking again
- Do not repeat or re-ask usable information
- Do not keep the user inside one section too long after it is usable
- Prefer movement through the full plan over over-refining one slot
- If one section is usable, move into the next relevant section
- Only ask for narrowing detail if it materially improves plan quality
- If the user says distinctions are not important, abstract to the strongest supported pattern and move on
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
      incomingPlanner &&
      Object.keys(incomingPlanner.filledSlots || {}).length
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
      temperature: 0.28,
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
- Keep the section label aligned with the real step
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