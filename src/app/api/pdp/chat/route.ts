// src/app/api/pdp/chat/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { DevelopmentPlanV1 } from "@/app/development/player-development-plan/ui/lib/engineSchema";
import { retrieveKnowledge } from "@/app/development/player-development-plan/ui/lib/knowledgeIndex";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lang = "nl" | "en";
type Role = "user" | "assistant";
type ChatMsg = { role: Role; content: string };

type ChatRequest = {
  messages: ChatMsg[];
  draftPlan?: Partial<DevelopmentPlanV1>;
  maxTurns?: number;
  lang?: Lang;
};

type ChatProgress = { step: number; total: number; label: string };

type ChatResponse =
  | {
      type: "question";
      message: string;
      progress: ChatProgress;
      derived?: Partial<DevelopmentPlanV1>;
      done: false;
    }
  | {
      type: "plan";
      message: string;
      plan: DevelopmentPlanV1;
      progress: ChatProgress;
      done: true;
    };

function safeStr(v: unknown, fallback = ""): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return fallback;
  if (/^[-—–\s]+$/.test(s)) return fallback;
  return s;
}

function clampHex(v: unknown) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return "#111111";
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#111111";
}

function lastOf(messages: ChatMsg[], role: Role) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i]?.role === role) return messages[i].content.trim();
  }
  return "";
}

function countTurns(messages: ChatMsg[], role: Role) {
  return (messages || []).filter((m) => m.role === role && m.content.trim()).length;
}

function isFinishRequest(text: string) {
  const t = (text || "").toLowerCase();
  return (
    t.includes("finish") ||
    t.includes("afronden") ||
    t.includes("maak het plan") ||
    t.includes("plan maken") ||
    t.includes("generate") ||
    t.includes("create the plan") ||
    t === "ja" ||
    t === "yes"
  );
}

function buildKnowledgeContext(query: string) {
  const hits = retrieveKnowledge({ query, topK: 6 });
  const ctx = hits
    .slice(0, 6)
    .map((h) => `- (${h.source}${h.page ? ` p.${h.page}` : ""}) ${h.text}`)
    .join("\n");
  return { hits, ctx };
}

type QuestionId =
  | "dev_point"
  | "context_level"
  | "minutes_status"
  | "position_role"
  | "role_description"
  | "team_context"
  | "moments"
  | "trigger"
  | "behaviour_observable"
  | "match_situation"
  | "development_goal"
  | "route_training"
  | "route_match"
  | "route_video"
  | "route_off_field"
  | "resp_player"
  | "resp_coach"
  | "resp_analyst"
  | "resp_staff"
  | "domain_tag"
  | "position_zone"
  | "finish";

const FLOW_ORDER: QuestionId[] = [
  "dev_point",
  "context_level",
  "minutes_status",
  "position_role",
  "role_description",
  "team_context",
  "moments",
  "trigger",
  "behaviour_observable",
  "match_situation",
  "development_goal",
  "route_training",
  "route_match",
  "route_video",
  "route_off_field",
  "resp_player",
  "resp_coach",
  "resp_analyst",
  "resp_staff",
  "domain_tag",
  "position_zone",
  "finish",
];

const LABEL_NL: Record<QuestionId, string> = {
  dev_point: "Ontwikkelpunt",
  context_level: "Context",
  minutes_status: "Speelminuten",
  position_role: "Positie / rol",
  role_description: "Rolbeschrijving",
  team_context: "Teamcontext",
  moments: "Momenten",
  trigger: "Trigger",
  behaviour_observable: "Observeerbaar gedrag",
  match_situation: "Wedstrijdsituatie",
  development_goal: "Ontwikkeldoel",
  route_training: "Route training",
  route_match: "Route wedstrijd",
  route_video: "Route video",
  route_off_field: "Route buiten het veld",
  resp_player: "Rol speler",
  resp_coach: "Rol trainer",
  resp_analyst: "Rol analist",
  resp_staff: "Rol staf",
  domain_tag: "Domein",
  position_zone: "Zone op het veld",
  finish: "Afronden",
};

const LABEL_EN: Record<QuestionId, string> = {
  dev_point: "Development point",
  context_level: "Context",
  minutes_status: "Minutes",
  position_role: "Position / role",
  role_description: "Role description",
  team_context: "Team context",
  moments: "Moments",
  trigger: "Trigger",
  behaviour_observable: "Observable behaviour",
  match_situation: "Match situation",
  development_goal: "Development goal",
  route_training: "Training route",
  route_match: "Match route",
  route_video: "Video route",
  route_off_field: "Off-field route",
  resp_player: "Player role",
  resp_coach: "Coach role",
  resp_analyst: "Analyst role",
  resp_staff: "Staff role",
  domain_tag: "Domain",
  position_zone: "Pitch zone",
  finish: "Finish",
};

function promptFor(id: QuestionId, lang: Lang) {
  if (lang === "en") {
    switch (id) {
      case "dev_point":
        return "What is the main development point you see right now? Keep it short (1–2 lines).";
      case "context_level":
        return "Is this academy or first team? And what stage is he in right now? (1–2 lines)";
      case "minutes_status":
        return "Minutes status: starter / rotation / impact sub / young talent with low minutes. Which fits best + why (1 line)?";
      case "position_role":
        return "What is his position/role? (e.g., 6 / CB / fullback / winger / 9)";
      case "role_description":
        return "In your game model: what is the main job of this role? (1 short sentence)";
      case "team_context":
        return "Why does this behaviour matter for your team? (1 sentence: ‘We want … therefore …’)";
      case "moments":
        return "When do you see this most? Name 2–3 moments (match/training).";
      case "trigger":
        return "What is usually the trigger? What happens right before it? (1–2 lines)";
      case "behaviour_observable":
        return "What do we SEE him do? Give 2–4 observable behaviours (no judgement).";
      case "match_situation":
        return "In what match situation does this mainly show up? (1 line)";
      case "development_goal":
        return "Over 4–8 weeks: what is the direction we want? (1 sentence, concrete, no metric)";
      case "route_training":
        return "How do we work on this in training? Keep it compact (max 2 lines).";
      case "route_match":
        return "How should this return in matches? Keep it compact (max 2 lines).";
      case "route_video":
        return "How does video help here? Keep it compact (max 2 lines).";
      case "route_off_field":
        return "What do we do outside training and matches? Keep it compact (max 2 lines).";
      case "resp_player":
        return "What is the player's responsibility? Keep it concrete (max 2 lines).";
      case "resp_coach":
        return "What is the coach's responsibility? Keep it concrete (max 2 lines).";
      case "resp_analyst":
        return "What is the analyst's responsibility? Keep it concrete (max 2 lines).";
      case "resp_staff":
        return "What is the wider staff responsibility? Keep it concrete (max 2 lines).";
      case "domain_tag":
        return "Pick the domain that fits best: FOOTBALL / PERFORMANCE / PROFESSIONAL (one word).";
      case "position_zone":
        return "Which zone should we highlight on the pitch? (1 line)";
      case "finish":
        return "Good. Type: finish (or add anything important we missed in 1–2 lines).";
    }
  }

  switch (id) {
    case "dev_point":
      return "Wat is het belangrijkste ontwikkelpunt dat je nu ziet? Beschrijf kort (1–2 zinnen).";
    case "context_level":
      return "Is dit opleiding of 1e elftal? En in welke fase zit hij nu? (1–2 zinnen)";
    case "minutes_status":
      return "Speelminuten-status: basisspeler / rotatie / invaller / talent met weinig minuten. Welke past het best + waarom (1 zin)?";
    case "position_role":
      return "Wat is zijn positie/rol? (bijv. 6 / CV / back / winger / 9)";
    case "role_description":
      return "In jullie speelwijze: wat is de hoofdtaak van deze rol? (1 korte zin)";
    case "team_context":
      return "Waarom telt dit gedrag voor jullie team? (1 zin: ‘Wij willen … daarom …’)";
    case "moments":
      return "Wanneer zie je dit het meest? Noem 2–3 momenten (wedstrijd/training).";
    case "trigger":
      return "Wat is meestal de trigger? Wat gebeurt er nét daarvoor? (1–2 zinnen)";
    case "behaviour_observable":
      return "Wat ZIEN we hem doen? Geef 2–4 observeerbare gedragingen (geen oordeel).";
    case "match_situation":
      return "In welke wedstrijdsituatie komt dit vooral terug? (1 zin)";
    case "development_goal":
      return "Over 4–8 weken: wat is de richting die we willen zien? (1 zin, concreet, geen metric)";
    case "route_training":
      return "Hoe werken we hieraan in training? Houd het compact (max 2 regels).";
    case "route_match":
      return "Hoe moet dit terugkomen in wedstrijden? Houd het compact (max 2 regels).";
    case "route_video":
      return "Hoe helpt video hierbij? Houd het compact (max 2 regels).";
    case "route_off_field":
      return "Wat doen we buiten training en wedstrijd? Houd het compact (max 2 regels).";
    case "resp_player":
      return "Wat is de verantwoordelijkheid van de speler? Concreet en kort (max 2 regels).";
    case "resp_coach":
      return "Wat is de verantwoordelijkheid van de trainer? Concreet en kort (max 2 regels).";
    case "resp_analyst":
      return "Wat is de verantwoordelijkheid van de analist? Concreet en kort (max 2 regels).";
    case "resp_staff":
      return "Wat is de verantwoordelijkheid van de staf? Concreet en kort (max 2 regels).";
    case "domain_tag":
      return "Kies het domein dat het best past: VOETBAL / PRESTATIE / PROFESSIONEEL (1 woord).";
    case "position_zone":
      return "Welke zone wil je highlighten op het veld? (1 zin)";
    case "finish":
      return "Top. Typ ‘finish’ (of voeg nog 1–2 zinnen toe die écht belangrijk zijn).";
  }
}

function progressFor(id: QuestionId, lang: Lang): ChatProgress {
  const idx = Math.max(0, FLOW_ORDER.indexOf(id));
  const step = idx + 1;
  const total = FLOW_ORDER.length;
  const label = lang === "nl" ? LABEL_NL[id] : LABEL_EN[id];
  return { step, total, label };
}

function formatQuestion(id: QuestionId, lang: Lang) {
  const p = progressFor(id, lang);
  const header =
    lang === "nl"
      ? `Vraag ${p.step}/${p.total} — ${p.label}`
      : `Question ${p.step}/${p.total} — ${p.label}`;
  return `${header}\n\n${promptFor(id, lang)}`;
}

function getNextQuestionIdFromMessages(messages: ChatMsg[]): QuestionId {
  const userTurns = countTurns(messages, "user");
  const idx = Math.max(0, Math.min(FLOW_ORDER.length - 1, userTurns));
  return FLOW_ORDER[idx];
}

function isFlowComplete(messages: ChatMsg[]) {
  return countTurns(messages, "user") >= FLOW_ORDER.length;
}

function seedPlan(draft: Partial<DevelopmentPlanV1> | undefined, lang: Lang): DevelopmentPlanV1 {
  const club = safeStr((draft as any)?.brand?.clubName || (draft as any)?.meta?.club, "Club");
  const team = safeStr((draft as any)?.player?.team || (draft as any)?.meta?.team, "Team");

  const blockLengthWeeks =
    typeof (draft as any)?.meta?.blockLengthWeeks === "number"
      ? (draft as any)?.meta?.blockLengthWeeks
      : 8;

  return {
    meta: {
      club,
      team,
      createdAtISO: new Date().toISOString(),
      blockLengthWeeks,
      ...( { lang } as any ),
      blockStartISO: (draft as any)?.meta?.blockStartISO,
      blockStartLabel: (draft as any)?.meta?.blockStartLabel,
      blockEndLabel: (draft as any)?.meta?.blockEndLabel,
    } as any,
    brand: {
      clubName: club,
      primaryColor: clampHex((draft as any)?.brand?.primaryColor || "#111111"),
      logoUrl: (draft as any)?.brand?.logoUrl,
    } as any,
    player: {
      name: safeStr((draft as any)?.player?.name, lang === "nl" ? "Speler" : "Player"),
      role: safeStr((draft as any)?.player?.role, lang === "nl" ? "Rol" : "Role"),
      team,
      phase: (draft as any)?.player?.phase || "stabilisation",
      headshotUrl: (draft as any)?.player?.headshotUrl,
    } as any,
    clubModel: (draft as any)?.clubModel || ({} as any),
    diagnosis: (draft as any)?.diagnosis || ({} as any),
    priority: (draft as any)?.priority || ({} as any),
    focus: Array.isArray((draft as any)?.focus) ? (draft as any)?.focus : [],
    notNow: (draft as any)?.notNow || ({ reasoning: "", excludedFocus: [] } as any),
    slide4DevelopmentRoute: (draft as any)?.slide4DevelopmentRoute || {
      title: "",
      subtitle: "",
      developmentGoal: "",
      developmentRoute: {
        training: "",
        match: "",
        video: "",
        off_field: "",
      },
      responsibilities: {
        player: "",
        coach: "",
        analyst: "",
        staff: "",
      },
    },
  } as DevelopmentPlanV1;
}

const JSON_RULES = `Return JSON only. No markdown. No code fences.`;

function systemPrompt(lang: Lang) {
  if (lang === "nl") {
    return `
Je bent Head of Player Development in profvoetbal.
Je output is volledig in normaal, begrijpelijk Nederlands.

BELANGRIJK:
- Verzín geen feiten. Gebruik alleen wat in transcript/knowledge staat.
- Als info ontbreekt: zet veld leeg ("") of gebruik status "pending".
- LETTERLIJK kopiëren van user-antwoorden is niet de bedoeling: vertaal naar heldere plan-taal.
- Slide 2 is de contractpagina.
- Slide 3 is de reality/baseline-pagina.
- Slide 4 is de uitvoeringsslide: kort, scanbaar, concreet.
- Slide 4 toont:
  1) ontwikkeldoel
  2) waar we eraan werken: training / wedstrijd / video / buiten het veld
  3) wie doet wat: speler / trainer / analist / staf
- Max 2 regels per slide 4 card.
- Geen abstracte managementtaal.
- Gebruik concrete, uitvoerbare taal.
- DomainTag is 1 woord: VOETBAL / PRESTATIE / PROFESSIONEEL.

${JSON_RULES}
`.trim();
  }

  return `
You are Head of Player Development in professional football.
Output must be clear, normal English.

IMPORTANT:
- Do not fabricate facts. Use only transcript/knowledge.
- If missing: leave empty ("") or use status "pending".
- Do NOT copy-paste answers: translate to clear plan language.
- Slide 2 is the contract page.
- Slide 3 is the baseline page.
- Slide 4 is the execution page: short, scannable, concrete.
- Slide 4 shows:
  1) development goal
  2) where we work on it: training / match / video / off field
  3) who does what: player / coach / analyst / staff
- Max 2 lines per slide 4 card.
- No abstract management language.
- DomainTag is 1 word: FOOTBALL / PERFORMANCE / PROFESSIONAL.

${JSON_RULES}
`.trim();
}

async function generateWithLLM(args: {
  lang: Lang;
  seed: DevelopmentPlanV1;
  transcript: string;
  knowledgeText: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const { lang, seed, transcript, knowledgeText } = args;

  const userPrompt =
    lang === "nl"
      ? `
TRANSCRIPT:
${transcript}

KNOWLEDGE SNIPPETS:
${knowledgeText}

SEED PLAN:
${JSON.stringify(seed, null, 2)}

OPDRACHT:
Maak een plan-object. Verzín geen feiten.
Vul vooral slide2, slide3 en slide4 als er input is.
Gebruik GEEN letterlijk copy-paste; vertaal naar heldere plan-taal.

Return JSON:
{
  "type":"plan",
  "message":"string",
  "plan":{
    ...seed,
    "slide2":{
      "focusBehaviour":"string",
      "domainTag":"VOETBAL|PRESTATIE|PROFESSIONEEL|''",
      "matchSituation":"string",
      "developmentGoal":"string",
      "positionRole":"string",
      "roleDescription":"string",
      "positionZone":"string",
      "teamContext":"string"
    },
    "slide3Baseline":{
      "title":"string",
      "subtitle":"string",
      "intro":"string",
      "primaryMetric":{
        "name":"string",
        "definition":"string",
        "currentValue":"string",
        "targetValue":"string"
      },
      "moments":["string","string"],
      "observations":["string","string"],
      "matchEffects":["string"],
      "videoClips":[{ "status":"pending" },{ "status":"pending" }]
    },
    "slide4DevelopmentRoute":{
      "title":"ONTWIKKELROUTE",
      "subtitle":"Hoe we hieraan werken",
      "developmentGoal":"string",
      "developmentRoute":{
        "training":"string",
        "match":"string",
        "video":"string",
        "off_field":"string"
      },
      "responsibilities":{
        "player":"string",
        "coach":"string",
        "analyst":"string",
        "staff":"string"
      }
    }
  }
}
`.trim()
      : `
TRANSCRIPT:
${transcript}

KNOWLEDGE SNIPPETS:
${knowledgeText}

SEED PLAN:
${JSON.stringify(seed, null, 2)}

TASK:
Create a plan object. Do not fabricate facts.
Fill slide2, slide3 and slide4 only if supported by input.
Do NOT copy-paste answers; translate to clear plan language.

Return JSON:
{
  "type":"plan",
  "message":"string",
  "plan":{
    ...seed,
    "slide2":{
      "focusBehaviour":"string",
      "domainTag":"FOOTBALL|PERFORMANCE|PROFESSIONAL|''",
      "matchSituation":"string",
      "developmentGoal":"string",
      "positionRole":"string",
      "roleDescription":"string",
      "positionZone":"string",
      "teamContext":"string"
    },
    "slide3Baseline":{
      "title":"string",
      "subtitle":"string",
      "intro":"string",
      "primaryMetric":{
        "name":"string",
        "definition":"string",
        "currentValue":"string",
        "targetValue":"string"
      },
      "moments":["string","string"],
      "observations":["string","string"],
      "matchEffects":["string"],
      "videoClips":[{ "status":"pending" },{ "status":"pending" }]
    },
    "slide4DevelopmentRoute":{
      "title":"DEVELOPMENT ROUTE",
      "subtitle":"How we work on this",
      "developmentGoal":"string",
      "developmentRoute":{
        "training":"string",
        "match":"string",
        "video":"string",
        "off_field":"string"
      },
      "responsibilities":{
        "player":"string",
        "coach":"string",
        "analyst":"string",
        "staff":"string"
      }
    }
  }
}
`.trim();

  const resp = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt(lang) },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" } as any,
  });

  const raw = resp.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;

    const messages: ChatMsg[] = Array.isArray(body.messages) ? body.messages : [];
    const lang: Lang = body.lang === "en" ? "en" : "nl";
    const maxTurns = Math.max(6, Math.min(80, body.maxTurns ?? 30));

    const assistantTurns = countTurns(messages, "assistant");
    const mustGenerateNow = assistantTurns >= maxTurns;

    const userLast = lastOf(messages, "user");
    const userWantsFinish = isFinishRequest(userLast);

    const flowComplete = isFlowComplete(messages);

    if (!mustGenerateNow && !userWantsFinish && !flowComplete) {
      const id = getNextQuestionIdFromMessages(messages);
      const out: ChatResponse = {
        type: "question",
        message: formatQuestion(id, lang),
        progress: progressFor(id, lang),
        derived: {},
        done: false,
      };
      return NextResponse.json(out);
    }

    const seed = seedPlan(body.draftPlan || {}, lang);

    const transcript = messages
      .map((m) =>
        `${m.role === "user" ? (lang === "nl" ? "GEBRUIKER" : "USER") : (lang === "nl" ? "ASSISTENT" : "ASSISTANT")}: ${m.content}`
      )
      .join("\n")
      .slice(0, 12000);

    const knowledgeQuery =
      lang === "nl"
        ? `roldefinitie individuele ontwikkeling focusgedrag coaching cues wedstrijdsituaties training transfer video review verantwoordelijkheden staf speler trainer analist`
        : `role definition individual development focus behaviour coaching cues match situations training transfer video review responsibilities staff player coach analyst`;

    const { ctx: knowledgeText } = buildKnowledgeContext(knowledgeQuery);

    const parsed = await generateWithLLM({ lang, seed, transcript, knowledgeText });

    const plan: DevelopmentPlanV1 =
      parsed && parsed.type === "plan" && parsed.plan ? (parsed.plan as DevelopmentPlanV1) : seed;

    (plan as any).meta = (plan as any).meta || {};
    (plan as any).meta.lang = lang;

    const out: ChatResponse = {
      type: "plan",
      message: safeStr(parsed?.message, lang === "nl" ? "Plan is klaar." : "Plan is ready."),
      plan,
      progress: { step: FLOW_ORDER.length, total: FLOW_ORDER.length, label: lang === "nl" ? "Plan" : "Plan" },
      done: true,
    };

    return NextResponse.json(out);
  } catch (err: any) {
    const message = err?.message || (typeof err === "string" ? err : "Unknown error");
    console.error("PDP_CHAT_ERROR:", message);
    return NextResponse.json({ error: "Chat failed", message }, { status: 500 });
  }
}