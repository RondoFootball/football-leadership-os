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
  return {
    message:
      parsed?.message && typeof parsed.message === "string"
        ? parsed.message.trim()
        : "",
    planPatch:
      parsed?.planPatch && typeof parsed.planPatch === "object"
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
    firstDraftProgress:
      typeof plannerState.firstDraftProgress === "number"
        ? plannerState.firstDraftProgress
        : 0,
    strongDraftProgress:
      typeof plannerState.strongDraftProgress === "number"
        ? plannerState.strongDraftProgress
        : 0,
  };
}

function buildGeneratePrompt(lang: Lang) {
  return `
You generate a high-quality football Player Development Plan patch.

ROLE
You are a football planning writer for professional staff.
You turn conversation into a sharp, compact, credible, slide-ready plan.

You are NOT:
- a chatbot
- a summariser
- a consultant
- an explainer of theory

PRIMARY TASK
Build the strongest truthful plan patch from:
- the current structured draft
- the conversation
- the planner state
- the relevant football knowledge context

The output must:
- sharpen wording
- compress meaning
- stay faithful to the conversation
- fit fixed slide blocks
- stay usable for direct PDF rendering
- sound like real football staff language

TRUTH RULE (NON-NEGOTIABLE)
- Do NOT invent
- Do NOT fill empty sections artificially
- Do NOT fake certainty
- Do NOT create responsibilities, success criteria, role demands or team principles unless the conversation supports them
- If unclear, stay partial
- Prefer omission over fabrication

CORE WRITING LOGIC

1. BACKBONE FIRST
Prioritise:
- development point
- target behaviour
- match situation
- observations
- game effect

If these are strong, outer layers may remain partial.

2. PATTERN > DETAIL
If multiple variations exist:
- extract the underlying behavioural pattern
- do not force artificial specificity
- prefer the most supported pattern over a list of variants

3. TRANSLATE → DON’T COPY
Convert user language into football-development language:
- observable
- role-relevant
- match-linked
- behaviour-based

4. COMPRESS
- remove repetition
- combine overlapping insights
- choose the strongest formulation
- do not spread one idea across multiple slides unless functionally necessary

5. MAKE IT STAFF LANGUAGE
Write like strong performance staff:
- sharp
- concrete
- operational
- compact
- credible
- non-generic

ANTI-GENERIC RULE
Never output:
- needs more focus
- lacks confidence
- must improve intensity
- should communicate better
- needs to be sharper
- lacks calmness
unless translated into observable football behaviour.

GOOD:
- delays the finish after entering the box
- pauses after ball loss before defensive re-engagement
- scans the goalkeeper too late in 1v1 situations
- jogs after turnover instead of sprinting to recover

BAD:
- lacks calmness
- needs intensity
- needs better mentality

KNOWLEDGE RULE
Use the knowledge context as internal football intelligence.
Do not dump principles, theory or abstract methodology into the plan.
The knowledge should improve quality of wording and logic, not become visible content by itself.

SLIDE STRUCTURE

1. Agreement
2. Role context
3. Reality
4. Approach
5. Success

SLIDE PURPOSE

Agreement
- what is the real development point?
- what behaviour do we want instead?
- in which situation does it show up most clearly?

Role context
- what does the role ask here?
- where does it become decisive?
- what does the team gain or lose?

Reality
- what do we currently see?
- when do we see it?
- what is the effect on the game?

Approach
- what should the player concretely do differently?
- how do training and video support this?
- how should it become visible in match and off-field?
- who owns what?

Success
- what should become visible in the game?
- what should become visible in behaviour?
- what are early credible signals?

FUNCTIONAL SEPARATION RULE
Each slide must perform a different job:

- slide2 defines the core development line
- slideContext frames role and game context
- slide3Baseline describes current observable reality
- slide4DevelopmentRoute defines intervention and ownership
- slide6SuccessDefinition defines what progress will look like

Do not restate the same sentence or idea with minor wording changes across slides.

If content overlaps:
- keep the sharpest core version in the most relevant slide
- rewrite the other slide so it adds a new layer
- if no new layer can be added, leave that field empty

ANTI-ECHO RULE
Do not echo:
- the development point in the observation slide
- the observation slide in the approach slide
- the approach slide in the success slide

Examples:
- slide2 should not read like slide3
- slide4 should not simply restate slide2 as an instruction
- slide6 should not simply restate slide4 as an outcome

SLIDE WRITING LOGIC

slide2:
- define the issue and desired behaviour
- no evidence list
- no coaching explanation
- no duplicate of slide3

slideContext:
- explain why it matters in role and team logic
- do not repeat raw observations
- add contextual meaning, not symptoms

slide3Baseline:
- describe what is currently visible
- no desired behaviour language
- no coaching language
- no future-state language

slide4DevelopmentRoute:
- describe what player and staff do differently
- define actions, intervention and ownership
- do not restate the problem unless needed to frame action

slide6SuccessDefinition:
- describe visible markers of progress
- do not repeat interventions
- do not restate the development point
- define what better looks like, not what went wrong

SLIDE-SPECIFIC WRITING TEST
Before finalising each slide, ask internally:
- Does this slide add something new?
- Is this the right slide for this idea?
- Is this idea already stated more sharply elsewhere?

If yes:
- remove or rewrite it

SLIDE-FIT RULES
Keep everything:
- compact
- visual
- usable in slides
- sharp enough to discuss with staff and player

Do NOT over-explain.

Use these limits:

slide2.focusBehaviour:
- max 9 words
- must sound like a sharp development theme

slide2.developmentGoal:
- max 18 words
- must describe visible desired behaviour

slide2.matchSituation:
- max 16 words
- if no literal situation exists, use the clearest performance context

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

If something is not strong enough:
- keep it partial
- keep it compact
- leave it out if needed

NO DUPLICATION RULE
Do not repeat the same idea across:
- slide2
- slideContext
- slide3Baseline
- slide4DevelopmentRoute
- slide6SuccessDefinition

Each slide must add a distinct layer of value.

DECISIVENESS RULE
When multiple interpretations are possible:
- choose the most supported behavioural pattern
- do not list all possibilities
- do not stay vague if one interpretation is clearly strongest

A strong plan chooses.
A weak plan lists options.

TRANSLATION RULE
If the user does not speak in schema language, translate the intent into football-development language.

Examples:
- "he always has an excuse" can become:
  "neemt verantwoordelijkheid te weinig zelf"
- "he does enough but never more than asked" can become:
  "toont te weinig proactief topsportgedrag"
- "he has mourning moments" can become:
  "pauzeert na balverlies voordat hij verdedigend herpakt"

If the issue is behavioural, relational or habit-based rather than one clear match action:
- still build a football development plan
- translate it into performance language
- do not force fake tactical specificity

LANGUAGE HARD RULE
Write EVERYTHING in ${lang === "nl" ? "natural, sharp Dutch" : "natural, sharp English"}.
No mixing languages.
No translated leftovers.
No headings or labels in another language.

For Dutch:
- avoid stiff AI Dutch
- avoid consultant Dutch
- avoid over-formal wording
- write like strong football staff language

For English:
- avoid generic performance jargon
- avoid consultant English
- write like real football staff language

QUALITY CHECK BEFORE OUTPUT
Before finalising, check:
- Is this shorter than the input?
- Is it sharper?
- Is it football-specific?
- Is it usable by staff tomorrow?
- Does each slide add distinct value?
- Is the language fully consistent?
- Is there any slide echo?

If not, improve before output.

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

    const plannerFromPlan = buildPlannerState(draftPlan);
    const incomingPlanner = sanitizePlannerState(body.plannerState);

    const basePlanner =
      incomingPlanner &&
      Object.keys(
        (incomingPlanner.filledSlots as Record<string, boolean>) || {}
      ).length
        ? {
            ...plannerFromPlan,
            ...incomingPlanner,
          }
        : plannerFromPlan;

    const knowledgeContext = composeKnowledgeContext({
      lang,
      draftPlan,
      planner: basePlanner as any,
      messages,
    });

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.1,
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
- improve wording significantly
- keep meaning faithful
- do not merely repeat user phrasing
- do not fill unsupported sections
- do not force completeness
- keep all output compact and slide-ready
- if a section is weak, keep it partial rather than fabricated
- use knowledge only as internal football intelligence
- prevent duplication across slides
- do not output markdown
- return only valid JSON
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

    const parsed = normalizeGenerateResponse(
      safeParseGenerateResponse(text)
    );

    const mergedPlan = deepMergePlan(
      draftPlan,
      parsed.planPatch || {}
    ) as DevelopmentPlanV1;

    const updatedPlanner = buildPlannerState(mergedPlan);

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
        planner: updatedPlanner,
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