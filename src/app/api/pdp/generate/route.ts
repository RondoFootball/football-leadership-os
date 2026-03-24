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

function buildGeneratePrompt(lang: Lang) {
  return `
You generate a high-quality football Player Development Plan patch.

IMPORTANT
The conversation may be messy, informal, repetitive or incomplete.
Your task is not to copy the user literally.
Your task is to turn the user's meaning into sharper, shorter, more usable development-plan language.

You must improve the wording while staying faithful to the conversation.

WHAT YOU ARE ALLOWED TO DO
- rewrite rough user language into sharper professional football language
- compress long explanations into short usable plan text
- turn implicit meaning into explicit structured plan content
- summarise repeated evidence into one stronger line
- improve the Dutch or English so it reads naturally and professionally
- make the output fit visual slide blocks

WHAT YOU MAY NOT DO
- invent facts that are not supported by the conversation
- fabricate match situations, responsibilities or success criteria out of nowhere
- exaggerate certainty
- make the plan look more complete than the conversation allows

QUALITY STANDARD
The output should feel:
- shorter
- sharper
- more football-specific
- more methodically useful
- more like a strong staff-written development plan
- less like raw user input
- less like generic AI language
- less explanatory

VERY IMPORTANT
Do not mirror the user's wording too literally.
Rewrite it into stronger plan language.

This is the slide order:
1. Agreement
2. Role context
3. Reality
4. Approach
5. Success

SLIDE MEANING

Agreement
- What is the real development point?
- What behaviour do we want instead?
- In which situation does this show up most clearly?

Role context
- What does the role ask here?
- In which team phase does this become decisive?
- What does the team gain or lose?

Reality
- What do we currently see?
- When do we see it?
- What is the effect on the game or development?

Approach
- What should the player concretely start doing differently?
- How do we work on this in training and video?
- How should it become visible in match and off-field?
- Who executes and who drives it?

Success
- What should become visible in the game?
- What should become visible in behaviour?
- What are the early signals that it is landing?

SLIDE-FIT RULES
Keep everything concise and visually usable.

Use these limits:

slide2.focusBehaviour:
- max 9 words
- should sound like a sharp development theme

slide2.developmentGoal:
- max 18 words
- should describe desired visible behaviour

slide2.matchSituation:
- max 16 words
- if there is no true match situation, translate to the clearest working context

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
- may be conceptual if not literal field zones

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
- this should be the core behavioural route

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

SCHEMA FIELDS TO FILL

Agreement:
- slide2.focusBehaviour
- slide2.developmentGoal
- slide2.matchSituation
- slide2.positionRole
- slide2.roleDescription
- slide2.teamContext

Role context:
- slideContext.gameMoments
- slideContext.zones
- slideContext.principles

Reality:
- slide3Baseline.moments
- slide3Baseline.observations
- slide3Baseline.matchEffects

Approach:
- slide4DevelopmentRoute.playerOwnText
- slide4DevelopmentRoute.developmentRoute.training
- slide4DevelopmentRoute.developmentRoute.video
- slide4DevelopmentRoute.developmentRoute.match
- slide4DevelopmentRoute.developmentRoute.off_field
- slide4DevelopmentRoute.responsibilities.player
- slide4DevelopmentRoute.responsibilities.coach
- slide4DevelopmentRoute.responsibilities.analyst
- slide4DevelopmentRoute.responsibilities.staff

Success:
- slide6SuccessDefinition.inGame
- slide6SuccessDefinition.behaviour
- slide6SuccessDefinition.signals

IMPORTANT INTERPRETATION RULE
If the user does not speak in exact schema language, translate the intent.

Examples:
- "he always has an excuse" can become:
  "neemt verantwoordelijkheid te weinig zelf"
- "he does enough but never more than asked" can become:
  "toont te weinig proactief topsportgedrag"
- "it is not really in matches but more in training and daily habits" can still produce:
  - agreement
  - role context
  - reality
  - approach
  - success

If the issue is mainly behavioural and not purely tactical:
- still build a football development plan
- translate general behaviour into football-development language
- do not leave core slides empty just because the issue is not one exact match action

LANGUAGE
${lang === "nl" ? "Write everything in natural, sharp Dutch." : "Write everything in natural, sharp English."}

For Dutch specifically:
- avoid stiff AI Dutch
- avoid consultant words
- avoid vague terms like 'meer focus' unless made concrete
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
    if (!client) {
      return NextResponse.json(
        {
          message: localMessage(
            "nl",
            "OPENAI_API_KEY ontbreekt in je lokale environment.",
            "OPENAI_API_KEY is missing in your local environment."
          ),
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

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.2,
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

Build a strong first draft patch from this conversation.

Important:
- improve the wording significantly
- keep the meaning faithful
- do not merely repeat the user's phrasing
- if the conversation supports a useful interpretation, use it
- do not leave core slides empty if the meaning is clearly there
- keep all output compact and slide-ready

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

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        localMessage(
          lang,
          "De generate route gaf geen geldige JSON terug.",
          "The generate route returned invalid JSON."
        )
      );
    }

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