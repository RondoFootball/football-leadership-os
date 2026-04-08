import { NextResponse } from "next/server";
import OpenAI from "openai";

import type {
  DevelopmentPlanV1,
  Lang,
} from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { slideLabel } from "@/app/development/player-development-plan/ui/lib/pdp/pdpLabels";
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

const SUPPORTED_LANGS: Lang[] = ["nl", "en", "de", "es", "it", "fr"];

function normalizeLang(lang?: unknown): Lang {
  return SUPPORTED_LANGS.includes(lang as Lang) ? (lang as Lang) : "nl";
}

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

function localMessage(lang: Lang, messages: Record<Lang, string>) {
  return messages[lang] || messages.nl;
}

function readLocalizedValue(
  value: unknown,
  lang: Lang,
  fallbackOrder: Lang[] = ["nl", "en", "de", "es", "it", "fr"]
): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const record = value as Partial<Record<Lang, string>>;

  const direct = record[lang];
  if (typeof direct === "string" && direct.trim()) {
    return direct.trim();
  }

  for (const key of fallbackOrder) {
    const candidate = record[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
}

function getSlotQuestionPrompt(meta: ReturnType<typeof getSlotMeta>, lang: Lang) {
  if (!meta) return "";
  return readLocalizedValue((meta as any).questionPrompt, lang);
}

function getSlotSharpenPrompt(meta: ReturnType<typeof getSlotMeta>, lang: Lang) {
  if (!meta) return "";
  return readLocalizedValue((meta as any).sharpenPrompt, lang);
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

function getPlanSlideLabel(
  lang: Lang,
  slide?:
    | "agreement"
    | "role_context"
    | "reality"
    | "approach"
    | "success"
) {
  return slide ? slideLabel(slide, lang) : "Plan";
}

function buildFallbackQuestion(lang: Lang, planner: PlannerState) {
  const slot = planner.nextPrioritySlot;
  const meta = getSlotMeta(slot);
  const currentSlideLabel = getPlanSlideLabel(lang, planner.currentSlide);

  if (meta) {
    const prompt = getSlotQuestionPrompt(meta, lang);
    if (prompt) {
      return `${currentSlideLabel} — ${prompt}`;
    }
  }

  return localMessage(lang, {
    nl: "Afspraak — Ik hoor de richting, maar wil het nog scherper maken. Wat zie je concreet gebeuren op het veld?",
    en: "Agreement — I hear the direction, but I want to sharpen it further. What do you concretely see happening on the pitch?",
    de: "Vereinbarung — Ich höre die Richtung, aber ich möchte sie noch schärfer machen. Was siehst du konkret auf dem Feld passieren?",
    es: "Acuerdo — Entiendo la dirección, pero quiero afinarla más. ¿Qué ves concretamente que ocurre en el campo?",
    it: "Accordo — Capisco la direzione, ma voglio renderla ancora più precisa. Cosa vedi concretamente succedere in campo?",
    fr: "Accord — Je vois la direction, mais je veux encore l’affiner. Que vois-tu concrètement se passer sur le terrain ?",
  });
}

function buildRoutingInstruction(
  lang: Lang,
  planner: PlannerState,
  draftPlan: Partial<DevelopmentPlanV1>
) {
  const nextSlotMeta = getSlotMeta(planner.nextPrioritySlot);

  const currentSlideLine = localMessage(lang, {
    nl: `Huidig zichtbaar planonderdeel: ${getPlanSlideLabel(
      lang,
      planner.currentSlide
    )}.`,
    en: `Current visible plan section: ${getPlanSlideLabel(
      lang,
      planner.currentSlide
    )}.`,
    de: `Aktuell sichtbarer Planbereich: ${getPlanSlideLabel(
      lang,
      planner.currentSlide
    )}.`,
    es: `Sección visible actual del plan: ${getPlanSlideLabel(
      lang,
      planner.currentSlide
    )}.`,
    it: `Sezione attualmente visibile del piano: ${getPlanSlideLabel(
      lang,
      planner.currentSlide
    )}.`,
    fr: `Section actuellement visible du plan : ${getPlanSlideLabel(
      lang,
      planner.currentSlide
    )}.`,
  });

  const nextSlideLine = localMessage(lang, {
    nl: `Volgend beoogd planonderdeel: ${getPlanSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
    en: `Next intended plan section: ${getPlanSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
    de: `Nächster vorgesehener Planbereich: ${getPlanSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
    es: `Siguiente sección prevista del plan: ${getPlanSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
    it: `Prossima sezione prevista del piano: ${getPlanSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
    fr: `Prochaine section visée du plan : ${getPlanSlideLabel(
      lang,
      planner.nextPrioritySlide
    )}.`,
  });

  const slotLine = nextSlotMeta
    ? localMessage(lang, {
        nl: `Volgende prioriteit: ${nextSlotMeta.key} (${nextSlotMeta.label}) op ${getPlanSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
        en: `Next priority: ${nextSlotMeta.key} (${nextSlotMeta.label}) on ${getPlanSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
        de: `Nächste Priorität: ${nextSlotMeta.key} (${nextSlotMeta.label}) in ${getPlanSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
        es: `Siguiente prioridad: ${nextSlotMeta.key} (${nextSlotMeta.label}) en ${getPlanSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
        it: `Priorità successiva: ${nextSlotMeta.key} (${nextSlotMeta.label}) in ${getPlanSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
        fr: `Prochaine priorité : ${nextSlotMeta.key} (${nextSlotMeta.label}) dans ${getPlanSlideLabel(
          lang,
          nextSlotMeta.slide
        )}.`,
      })
    : localMessage(lang, {
        nl: "Er is geen duidelijke volgende prioriteitsslot gevonden.",
        en: "No clear next priority slot was found.",
        de: "Es wurde kein klarer nächster Prioritätsslot gefunden.",
        es: "No se encontró un siguiente slot de prioridad claro.",
        it: "Non è stato trovato uno slot di priorità successivo chiaro.",
        fr: "Aucun slot de priorité suivant clair n’a été trouvé.",
      });

  const intensityLine =
    planner.intent === "strong_plan_ready"
      ? localMessage(lang, {
          nl: "Het plan is inhoudelijk al sterk. Bouw gericht verder en voorkom herhaling.",
          en: "The plan is already strong. Build forward selectively and avoid repetition.",
          de: "Der Plan ist inhaltlich bereits stark. Baue gezielt weiter und vermeide Wiederholung.",
          es: "El plan ya es sólido en contenido. Avanza de forma selectiva y evita repeticiones.",
          it: "Il piano è già solido nei contenuti. Procedi in modo mirato ed evita ripetizioni.",
          fr: "Le plan est déjà solide sur le fond. Avance de manière ciblée et évite les répétitions.",
        })
      : planner.intent === "backbone_ready"
        ? localMessage(lang, {
            nl: "De basis staat. Ga door naar de volgende planlagen in plaats van de kern opnieuw te openen.",
            en: "The backbone is there. Move into the next plan layers instead of reopening the core.",
            de: "Die Basis steht. Gehe zu den nächsten Planungsebenen über, statt den Kern erneut zu öffnen.",
            es: "La base ya está. Avanza hacia las siguientes capas del plan en lugar de reabrir el núcleo.",
            it: "La base è presente. Passa ai livelli successivi del piano invece di riaprire il nucleo.",
            fr: "La base est en place. Passe aux couches suivantes du plan au lieu de rouvrir le noyau.",
          })
        : localMessage(lang, {
            nl: "De kern is nog niet scherp genoeg. Zet de grootste inhoudelijke stap vooruit met minimale frictie.",
            en: "The core is not sharp enough yet. Create the biggest content gain with minimal friction.",
            de: "Der Kern ist noch nicht scharf genug. Mache den größten inhaltlichen Schritt mit minimaler Reibung.",
            es: "El núcleo aún no es lo bastante claro. Da el mayor paso de contenido con la menor fricción posible.",
            it: "Il nucleo non è ancora abbastanza chiaro. Fai il più grande passo in avanti con il minimo attrito.",
            fr: "Le noyau n’est pas encore assez précis. Fais le plus grand pas de contenu avec un minimum de friction.",
          });

  const progressLine = localMessage(lang, {
    nl: `Live progress: ${planner.liveProgress}%. Basis: ${planner.backboneProgress}%. Sterk plan: ${planner.strongPlanProgress}%.`,
    en: `Live progress: ${planner.liveProgress}%. Backbone: ${planner.backboneProgress}%. Strong plan: ${planner.strongPlanProgress}%.`,
    de: `Live-Fortschritt: ${planner.liveProgress}%. Basis: ${planner.backboneProgress}%. Starker Plan: ${planner.strongPlanProgress}%.`,
    es: `Progreso en vivo: ${planner.liveProgress}%. Base: ${planner.backboneProgress}%. Plan sólido: ${planner.strongPlanProgress}%.`,
    it: `Avanzamento live: ${planner.liveProgress}%. Base: ${planner.backboneProgress}%. Piano solido: ${planner.strongPlanProgress}%.`,
    fr: `Progression en direct : ${planner.liveProgress}%. Base : ${planner.backboneProgress}%. Plan solide : ${planner.strongPlanProgress}%.`,
  });

  const questionFamily = nextSlotMeta
    ? getSlotQuestionPrompt(nextSlotMeta, lang)
    : "";
  const sharpenFamily = nextSlotMeta
    ? getSlotSharpenPrompt(nextSlotMeta, lang)
    : "";

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

${
  nextSlotMeta
    ? `Current slot guidance:
- slot key: ${nextSlotMeta.key}
- slot label: ${nextSlotMeta.label}
- question family: ${questionFamily || "n/a"}
- sharpen family: ${sharpenFamily || "n/a"}`
    : ""
}

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
    const lang = normalizeLang(body.lang);

    if (!client) {
      return NextResponse.json(
        {
          type: "error",
          message: localMessage(lang, {
            nl: "OPENAI_API_KEY ontbreekt in je lokale environment.",
            en: "OPENAI_API_KEY is missing in your local environment.",
            de: "OPENAI_API_KEY fehlt in deiner lokalen Umgebung.",
            es: "Falta OPENAI_API_KEY en tu entorno local.",
            it: "OPENAI_API_KEY manca nel tuo ambiente locale.",
            fr: "OPENAI_API_KEY est absent de votre environnement local.",
          }),
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
          localMessage("nl", {
            nl: "Er ging iets mis tijdens het verwerken van het gesprek.",
            en: "Something went wrong while processing the conversation.",
            de: "Beim Verarbeiten des Gesprächs ist etwas schiefgelaufen.",
            es: "Se produjo un error al procesar la conversación.",
            it: "Si è verificato un errore durante l’elaborazione della conversazione.",
            fr: "Une erreur s’est produite lors du traitement de l’échange.",
          }),
        done: false,
      },
      { status: 500 }
    );
  }
}