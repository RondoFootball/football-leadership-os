import { NextResponse } from "next/server";
import OpenAI from "openai";

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { composeKnowledgeContext } from "../core/knowledgeComposer";
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
  plannerState?: {
    filledSlots?: Record<string, boolean>;
    usableSlots?: Record<string, boolean>;
    strongSlots?: Record<string, boolean>;
    slotStatuses?: Record<
      string,
      {
        quality?: string;
        progress?: number;
        slide?: string;
      }
    >;
    missingFirstDraft?: string[];
    missingStrongDraft?: string[];
    intent?: string;
    nextPrioritySlot?: string;
    nextPrioritySlide?: string;
    firstDraftProgress?: number;
    strongDraftProgress?: number;
  } | null;
};

type ParsedGenerateResponse = {
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
  return totalChars >= 20;
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

function safeParseGenerateResponse(text: string): ParsedGenerateResponse | null {
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

function normalizeGenerateResponse(
  parsed: ParsedGenerateResponse | null
): ParsedGenerateResponse {
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
): Record<string, unknown> | null {
  if (!plannerState) return null;

  return {
    filledSlots: plannerState.filledSlots || {},
    usableSlots: plannerState.usableSlots || {},
    strongSlots: plannerState.strongSlots || {},
    slotStatuses: plannerState.slotStatuses || {},
    missingFirstDraft: Array.isArray(plannerState.missingFirstDraft)
      ? plannerState.missingFirstDraft
      : [],
    missingStrongDraft: Array.isArray(plannerState.missingStrongDraft)
      ? plannerState.missingStrongDraft
      : [],
    intent: plannerState.intent || "ask",
    nextPrioritySlot: plannerState.nextPrioritySlot,
    nextPrioritySlide: plannerState.nextPrioritySlide,
    firstDraftProgress: plannerState.firstDraftProgress || 0,
    strongDraftProgress: plannerState.strongDraftProgress || 0,
  };
}

function buildGeneratePrompt(lang: Lang) {
  return `
You generate a high-quality football Player Development Plan patch.

You are not a summariser.
You are not a chatbot.
You are not supposed to mirror the conversation literally.

You are a football planning writer who turns messy conversation into a compact, credible, slide-ready first draft.

PRIMARY TASK
Build the strongest truthful first-draft patch possible from:
- the current structured draft
- the conversation
- the planner state
- the relevant football knowledge context

Your output must:
- improve wording
- compress meaning
- stay faithful to the conversation
- fit fixed visual slide blocks
- remain usable for direct PDF rendering

NON-NEGOTIABLE TRUTH RULE
Do not invent facts.
Do not fabricate certainty.
Do not fill sections just because the schema has room.
Do not create responsibilities, success criteria, role demands or team principles unless the conversation supports them.

If something is weak:
- keep it partial
- keep it compact
- leave it out if needed

Prefer omission over fabrication.

WHAT YOU SHOULD DO
- rewrite rough user language into sharper football language
- compress repeated explanation into one stronger line
- turn implicit meaning into explicit plan wording when clearly supported
- choose the best slide-fit formulation
- make the result sound like strong football staff language
- use the knowledge context as an internal reasoning frame, not as visible theory dumping

WHAT YOU SHOULD NOT DO
- copy raw user sentences literally
- sound generic or AI-written
- produce broad consultant text
- produce motivational filler
- duplicate the same idea across multiple slides
- force full completeness
- dump principles or theory into the plan

QUALITY STANDARD
The patch should feel:
- shorter
- sharper
- more football-specific
- more operational
- more renderable
- more staff-written
- less explanatory
- less repetitive
- less generic

SLIDE ORDER
1. Agreement
2. Role context
3. Reality
4. Approach
5. Success

SLIDE PURPOSE

Agreement
- what is the real development point?
- what behaviour do we want instead?
- in which situation does this show up most clearly?

Role context
- what does the role ask here?
- in which team phase does this become decisive?
- what does the team gain or lose?

Reality
- what do we currently see?
- when do we see it?
- what is the effect on the game?

Approach
- what should the player concretely do differently?
- how do training and video support this?
- how should it become visible in match and off-field?
- who executes and who drives it?

Success
- what should become visible in the game?
- what should become visible in behaviour?
- what are early credible signals?

SLIDE-FIT RULES
Keep everything concise and visually usable.

Use these limits:

slide2.focusBehaviour:
- max 9 words
- must sound like a sharp development theme

slide2.developmentGoal:
- max 18 words
- must describe visible desired behaviour

slide2.matchSituation:
- max 16 words
- if no literal match situation exists, use the clearest performance context

slide2.positionRole:
- max 10 words

slide2.roleDescription:
- max 16 words

slide2.teamContext:
- max 18 words

slideContext.gameMoments:
- max 3 items
- max 10 words each

slideContext.zones:
- max 3 items
- max 8 words each

slideContext.principles:
- max 3 items
- max 12 words each

slide3Baseline.moments:
- max 3 items
- max 10 words each

slide3Baseline.observations:
- max 3 items
- max 12 words each

slide3Baseline.matchEffects:
- max 3 items
- max 12 words each

slide4DevelopmentRoute.playerOwnText:
- max 30 words

slide4DevelopmentRoute.developmentRoute.training:
- max 22 words

slide4DevelopmentRoute.developmentRoute.video:
- max 22 words

slide4DevelopmentRoute.developmentRoute.match:
- max 22 words

slide4DevelopmentRoute.developmentRoute.off_field:
- max 22 words

slide4DevelopmentRoute.responsibilities.player:
- max 14 words

slide4DevelopmentRoute.responsibilities.coach:
- max 14 words

slide4DevelopmentRoute.responsibilities.analyst:
- max 14 words

slide4DevelopmentRoute.responsibilities.staff:
- max 14 words

slide6SuccessDefinition.inGame:
- max 3 items
- max 12 words each

slide6SuccessDefinition.behaviour:
- max 3 items
- max 12 words each

slide6SuccessDefinition.signals:
- max 3 items
- max 12 words each

FILLING DISCIPLINE
Core slides should only be filled if supported:
- Agreement should usually be filled when the backbone is present
- Reality should reflect what is actually observed
- Role context can remain partial if only partly supported
- Approach must stay concrete and evidence-based
- Success must stay credible and early-stage if evidence is limited

TRANSLATION RULE
If the user does not speak in exact schema language, translate the intent into football-development language.

Examples:
- "he always has an excuse" can become:
  "neemt verantwoordelijkheid te weinig zelf"
- "he does enough but never more than asked" can become:
  "toont te weinig proactief topsportgedrag"

If the issue is behavioural, relational or performance-habit based rather than one clear match action:
- still build a football development plan
- translate it into performance language
- do not force fake tactical specificity

ANTI-GENERIC RULE
Avoid output such as:
- needs more focus
- must improve intensity
- should communicate better
- needs more confidence
unless the conversation clearly supports a sharper football version and you use that sharper version.

LANGUAGE
${lang === "nl" ? "Write everything in natural, sharp Dutch." : "Write everything in natural, sharp English."}

For Dutch:
- avoid stiff AI Dutch
- avoid consultant Dutch
- avoid over-formal wording
- write like strong football staff language

RETURN ONLY VALID JSON
Return exactly this shape:
{
  "message": "short user-facing note",
  "planPatch": {
    "slide2": {},
    "slideContext": {},
    "slide3Baseline": {},
    "slide4DevelopmentRoute": {},
    "slide6SuccessDefinition": {}
  }
}
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
          message: localMessage(
            lang,
            "OPENAI_API_KEY ontbreekt in je lokale environment.",
            "OPENAI_API_KEY is missing in your local environment."
          ),
        },
        { status: 500 }
      );
    }

    if (!hasMeaningfulUserInput(messages)) {
      const planner = buildPlannerState(draftPlan);

      return NextResponse.json({
        message: localMessage(
          lang,
          "Er is nog te weinig gesprekinput om een eerste versie van het plan op te bouwen.",
          "There is not enough conversation input yet to build a first draft of the plan."
        ),
        plan: draftPlan,
        derived: {
          planner,
        },
      });
    }

    const plannerBefore = buildPlannerState(draftPlan);
    const incomingPlanner = sanitizePlannerState(body.plannerState);

    const basePlanner =
      incomingPlanner &&
      Object.keys(
        (incomingPlanner.filledSlots as Record<string, boolean>) || {}
      ).length
        ? {
            ...plannerBefore,
            ...incomingPlanner,
          }
        : plannerBefore;

    const knowledgeContext = composeKnowledgeContext({
      lang,
      draftPlan,
      planner: basePlanner,
      messages,
    });

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.15,
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

Build the strongest truthful first-draft patch from this conversation.

Rules:
- improve the wording significantly
- keep the meaning faithful
- do not merely repeat the user's phrasing
- do not fill unsupported sections
- do not force completeness
- keep all output compact and slide-ready
- if a section is weak, keep it partial rather than fabricated
- use the knowledge context only as internal football intelligence

Return only valid JSON.
          `.trim(),
        },
      ],
    });

    const text = response.output_text?.trim();

    if (!text) {
      throw new Error(
        localMessage(
          lang,
          "Geen output ontvangen uit de generate route.",
          "No output returned from the generate route."
        )
      );
    }

    const parsed = normalizeGenerateResponse(safeParseGenerateResponse(text));

    const mergedPlan = deepMergePlan(
      draftPlan,
      parsed.planPatch || {}
    ) as DevelopmentPlanV1;

    const planner = buildPlannerState(mergedPlan);

    return NextResponse.json({
      message:
        parsed.message ||
        localMessage(
          lang,
          "Ik heb op basis van het gesprek een eerste planversie opgebouwd en aangescherpt.",
          "I built and sharpened a first draft plan based on the conversation."
        ),
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
          localMessage(
            "nl",
            "Er ging iets mis tijdens het opbouwen van de eerste versie.",
            "Something went wrong while building the first draft."
          ),
      },
      { status: 500 }
    );
  }
}