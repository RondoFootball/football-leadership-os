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
): PlannerState | null {
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

  if (lang === "nl") {
    if (slot === "developmentPoint") {
      return "Wat is het concrete ontwikkelpunt dat je nu het duidelijkst ziet bij deze speler?";
    }

    if (slot === "matchSituation") {
      return "In welk wedstrijdmoment of welke spelsituatie zie je dit ontwikkelpunt het duidelijkst terug?";
    }

    if (slot === "targetBehaviour") {
      return "Welk observeerbaar gedrag wil je straks wél terugzien in die situatie?";
    }

    if (slot === "roleRequirements") {
      return "Wat vraagt de rol of positie van deze speler hier eigenlijk op dit punt?";
    }

    if (slot === "decisiveTeamPhases") {
      return "In welke teamfase of welk spelmoment wordt dit echt beslissend?";
    }

    if (slot === "teamImpact") {
      return "Wat wint of verliest het team als dit gedrag wel of niet lukt?";
    }

    if (slot === "observations") {
      return "Wat zien jullie nu concreet terug in gedrag, uitvoering of keuzes van de speler?";
    }

    if (slot === "whenObserved") {
      return "Wanneer of onder welke trigger zie je dit vooral terug?";
    }

    if (slot === "effectOnGame") {
      return "Wat is op dit moment het effect hiervan op het team of op het spel?";
    }

    if (slot === "playerExecution") {
      return "Wat moet de speler zelf vanaf nu concreet anders gaan doen?";
    }

    if (slot === "trainingVideoPlan") {
      return "Hoe willen jullie hier concreet aan werken in training en in beelden?";
    }

    if (slot === "matchOffFieldPlan") {
      return "Hoe moet dit zichtbaar worden in de wedstrijd en wat kan de speler hier off-field mee doen?";
    }

    if (slot === "ownership") {
      return "Wie voert dit uit en wie stuurt dit in de praktijk aan?";
    }

    if (slot === "successInGame") {
      return "Waaraan zie je in het spel dat dit ontwikkelpunt begint te landen?";
    }

    if (slot === "successBehaviour") {
      return "Welk gedrag van de speler laat straks zien dat dit echt beter wordt?";
    }

    if (slot === "successSignals") {
      return "Wat zijn de eerste geloofwaardige signalen dat het plan begint te werken?";
    }

    return "Ik hoor de richting, maar wil het nog scherper maken. Wat zie je concreet gebeuren op het veld?";
  }

  if (slot === "developmentPoint") {
    return "What is the clearest concrete development point you currently see in this player?";
  }

  if (slot === "matchSituation") {
    return "In which match moment or game situation do you see this development point most clearly?";
  }

  if (slot === "targetBehaviour") {
    return "What observable behaviour do you want to see instead in that situation?";
  }

  if (slot === "roleRequirements") {
    return "What does the player's role or position actually require here?";
  }

  if (slot === "decisiveTeamPhases") {
    return "In which team phase or game phase does this become decisive?";
  }

  if (slot === "teamImpact") {
    return "What does the team gain or lose when this behaviour does or does not happen?";
  }

  if (slot === "observations") {
    return "What do you currently observe concretely in the player's behaviour, execution or choices?";
  }

  if (slot === "whenObserved") {
    return "When or under which trigger do you mainly see this?";
  }

  if (slot === "effectOnGame") {
    return "What is the current effect of this on the team or on the game?";
  }

  if (slot === "playerExecution") {
    return "What should the player concretely start doing differently from now on?";
  }

  if (slot === "trainingVideoPlan") {
    return "How do you want to work on this in training and in video review?";
  }

  if (slot === "matchOffFieldPlan") {
    return "How should this show up in the match, and what can the player do off the pitch?";
  }

  if (slot === "ownership") {
    return "Who executes this, and who drives it in practice?";
  }

  if (slot === "successInGame") {
    return "What would you see in the game that shows this is starting to land?";
  }

  if (slot === "successBehaviour") {
    return "What player behaviour would show that this is genuinely improving?";
  }

  if (slot === "successSignals") {
    return "What are the first credible signals that this plan is starting to work?";
  }

  return "I hear the direction, but I want to sharpen it further. What do you concretely see happening on the pitch?";
}

export async function POST(req: Request) {
  try {
    if (!client) {
      return NextResponse.json(
        {
          type: "error",
          message: localMessage(
            "nl",
            "OPENAI_API_KEY ontbreekt in je lokale environment.",
            "OPENAI_API_KEY is missing in your local environment."
          ),
          done: false,
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as ApiInput;

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const draftPlan = body.draftPlan || {};
    const lang: Lang = body.lang === "en" ? "en" : "nl";

    const plannerFromPlan = buildPlannerState(draftPlan);
    const incomingPlanner = sanitizePlannerState(body.plannerState);

    const basePlanner =
      incomingPlanner && Object.keys(incomingPlanner.filledSlots || {}).length
        ? incomingPlanner
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

    const conversation = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await client.responses.create({
      model: "gpt-4.1",
      temperature: 0.45,
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

Conversation so far:
${conversation}

Rules:
- Return only valid JSON
- Ask at most one high-value next question
- Prefer one sharp next question over broad summaries
- Only mark slots as filled if the conversation clearly supports them at slide level
- Do not invent plan content
- Do not generate a finished plan unless the evidence is genuinely sufficient
- A first usable draft needs a believable backbone, not a full plan
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

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({
        type: "question",
        message: buildFallbackQuestion(lang, basePlanner),
        done: false,
        derived: {
          planner: basePlanner,
        },
      });
    }

    const patchedPlan = deepMergePlan(
      draftPlan,
      parsed.planPatch || {}
    ) as Partial<DevelopmentPlanV1>;

    const recomputedPlanner = buildPlannerState(patchedPlan);

    if (parsed.type === "plan") {
      return NextResponse.json({
        type: "question",
        message: localMessage(
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