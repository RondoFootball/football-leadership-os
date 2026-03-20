"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DevelopmentPlanV1, Lang } from "../lib/engineSchema";

type ChatMsg = { role: "user" | "assistant"; content: string };

export type ChatPlannerState = {
  filledSlots?: Record<string, boolean>;
  missingFirstDraft?: string[];
  missingStrongDraft?: string[];
  intent?: "ask" | "summarise" | "draft_ready" | "strong_draft_ready";
  nextPrioritySlot?: string;
};

type ApiQuestion = {
  type: "question";
  message: string;
  done: false;
  derived?: {
    planner?: ChatPlannerState;
  };
};

type ApiPlan = {
  type: "plan";
  message: string;
  plan: DevelopmentPlanV1;
  done: true;
  derived?: {
    planner?: ChatPlannerState;
  };
};

function initialAssistantMessage(lang: Lang) {
  return lang === "nl"
    ? "Wat is het belangrijkste ontwikkelpunt dat je nu ziet? Beschrijf het kort en zo concreet mogelijk in voetbalgedrag."
    : "What is the main development point you see right now? Keep it short and as concrete as possible in football behaviour.";
}

function uiStrings(lang: Lang) {
  return {
    title: lang === "nl" ? "Gesprek" : "Conversation",
    subtitle:
      lang === "nl"
        ? "Werk vanuit wat je ziet. De chat helpt je dit vertalen naar een scherp ontwikkelplan."
        : "Work from what you see. The chat helps turn that into a sharp development plan.",

    reset: lang === "nl" ? "Reset" : "Reset",
    thinking: lang === "nl" ? "Denkt…" : "Thinking…",
    generating: lang === "nl" ? "Bouwt plan…" : "Building plan…",

    statusFirstDraftReady:
      lang === "nl" ? "Eerste versie mogelijk" : "First draft possible",
    statusStrongDraftReady:
      lang === "nl" ? "Sterke versie mogelijk" : "Strong draft possible",
    statusNeedMore:
      lang === "nl" ? "Nog niet scherp genoeg" : "Not sharp enough yet",

    qualityTitle: lang === "nl" ? "Plansterkte" : "Plan quality",
    qualityHintBase:
      lang === "nl"
        ? "Hoe meer scherpe context, hoe sterker het plan."
        : "The sharper the context, the stronger the plan.",
    missingForDraft:
      lang === "nl"
        ? "Nog nodig voor eerste versie"
        : "Still needed for first draft",
    missingForStrong:
      lang === "nl"
        ? "Voor een sterkere versie"
        : "For a stronger version",

    firstDraftButton:
      lang === "nl" ? "Maak eerste versie" : "Generate first draft",
    firstDraftHintLight:
      lang === "nl"
        ? "Kan al, maar nog met beperkte scherpte."
        : "Possible already, but still limited in sharpness.",
    firstDraftHintReady:
      lang === "nl"
        ? "Genoeg input voor een eerste versie."
        : "Enough input for a first version.",
    firstDraftHintStrong:
      lang === "nl"
        ? "Klaar voor een sterke eerste versie."
        : "Ready for a strong first version.",

    planReadyPill: lang === "nl" ? "Plan klaar" : "Plan ready",
    planReadyText:
      lang === "nl"
        ? "De eerste versie van het plan staat klaar. Je kunt verder aanscherpen of direct door."
        : "The first version of the plan is ready. You can refine it further or continue immediately.",

    viewPlan: lang === "nl" ? "Bekijk plan" : "View plan",
    downloadStaff:
      lang === "nl" ? "Download staff PDF" : "Download staff PDF",
    downloadPlayer:
      lang === "nl" ? "Download speler PDF" : "Download player PDF",

    placeholderType:
      lang === "nl"
        ? "Beschrijf wat je ziet, waar het gebeurt en wat het effect is…"
        : "Describe what you see, where it happens and what the effect is…",
    placeholderThinking: lang === "nl" ? "Denkt…" : "Thinking…",

    send: lang === "nl" ? "Verstuur" : "Send",

    footer:
      lang === "nl"
        ? "De chat bewaakt scherpte, context en verantwoordelijkheid — niet alleen tekst."
        : "The chat guards sharpness, context and responsibility — not just text.",

    fallbackOk: lang === "nl" ? "Oké." : "Okay.",
  };
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function getPlannerScore(planner: ChatPlannerState | null) {
  if (!planner?.filledSlots) return 0;
  const entries = Object.values(planner.filledSlots);
  if (!entries.length) return 0;
  const filled = entries.filter(Boolean).length;
  return Math.round((filled / entries.length) * 100);
}

function humanizeSlot(slot: string, lang: Lang) {
  const mapNl: Record<string, string> = {
    developmentPoint: "ontwikkelpunt",
    targetBehaviour: "gewenst gedrag",
    matchSituation: "wedstrijdmoment",
    roleContext: "rolcontext",
    gameMoments: "spelmomenten",
    zones: "zones",
    principles: "principes",
    observations: "wat we zien",
    whenObserved: "wanneer we dit zien",
    effectOnGame: "effect op het spel",
    playerActions: "speleracties",
    staffResponsibilities: "verantwoordelijkheden",
    successSignals: "succesdefinitie",
  };

  const mapEn: Record<string, string> = {
    developmentPoint: "development point",
    targetBehaviour: "target behaviour",
    matchSituation: "match situation",
    roleContext: "role context",
    gameMoments: "game moments",
    zones: "zones",
    principles: "principles",
    observations: "observations",
    whenObserved: "when we see it",
    effectOnGame: "effect on the game",
    playerActions: "player actions",
    staffResponsibilities: "responsibilities",
    successSignals: "success definition",
  };

  return lang === "nl" ? mapNl[slot] || slot : mapEn[slot] || slot;
}

export function PdpChat({
  draftPlan,
  onPlanGenerated,
  onPlannerStateChange,
  onViewPlan,
  onDownloadPdf,
}: {
  draftPlan: Partial<DevelopmentPlanV1>;
  onPlanGenerated: (plan: DevelopmentPlanV1) => void;
  onPlannerStateChange?: (planner: ChatPlannerState | null) => void;
  onViewPlan?: () => void;
  onDownloadPdf?: (version: "staff" | "player") => void;
}) {
  const [lang, setLang] = useState<Lang>("nl");
  const s = uiStrings(lang);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: initialAssistantMessage("nl") },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planner, setPlanner] = useState<ChatPlannerState | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy, generating, error, planReady, planner]);

  useEffect(() => {
    setPlanReady(false);
    setError(null);
    setBusy(false);
    setGenerating(false);
    setPlanner(null);
    onPlannerStateChange?.(null);
    setMessages([{ role: "assistant", content: initialAssistantMessage(lang) }]);
    setInput("");
  }, [lang, onPlannerStateChange]);

  useEffect(() => {
    onPlannerStateChange?.(planner);
  }, [planner, onPlannerStateChange]);

  const canSend = useMemo(
    () => !!input.trim() && !busy && !generating,
    [input, busy, generating]
  );

  const plannerScore = useMemo(() => getPlannerScore(planner), [planner]);

  const plannerIntent = planner?.intent || "ask";
  const missingFirstDraft = planner?.missingFirstDraft || [];
  const missingStrongDraft = planner?.missingStrongDraft || [];

  const statusLabel = useMemo(() => {
    if (planReady) return s.planReadyPill;
    if (plannerIntent === "strong_draft_ready") return s.statusStrongDraftReady;
    if (plannerIntent === "draft_ready") return s.statusFirstDraftReady;
    if (busy) return s.thinking;
    if (generating) return s.generating;
    return s.statusNeedMore;
  }, [planReady, plannerIntent, busy, generating, s]);

  const draftHint = useMemo(() => {
    if (plannerIntent === "strong_draft_ready") return s.firstDraftHintStrong;
    if (plannerIntent === "draft_ready") return s.firstDraftHintReady;
    return s.firstDraftHintLight;
  }, [plannerIntent, s]);

  async function send() {
    if (!canSend) return;

    const userMsg: ChatMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];

    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/pdp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          draftPlan,
          lang,
          maxTurns: 60,
          plannerState: planner,
        }),
      });

      if (!res.ok) {
        let message = "Chat failed";

        try {
          const err = await res.json();
          message = err?.message || message;
        } catch {
          const txt = await res.text();
          message = txt || message;
        }

        throw new Error(message);
      }

      const data = (await res.json()) as ApiQuestion | ApiPlan;

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: (data?.message || "").trim() || s.fallbackOk,
        },
      ]);

      if (data?.derived?.planner) {
        setPlanner(data.derived.planner);
      }

      if (data.type === "plan" && data.plan) {
        onPlanGenerated(data.plan);
        setPlanReady(true);
        setTimeout(() => onViewPlan?.(), 120);
      }
    } catch (e: any) {
      setError(e?.message || "Chat failed");
    } finally {
      setBusy(false);
    }
  }

  async function generateFirstDraft() {
    if (generating || busy) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/pdp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          draftPlan,
          lang,
        }),
      });

      if (!res.ok) {
        let message = "Generate failed";

        try {
          const err = await res.json();
          message = err?.message || message;
        } catch {
          const txt = await res.text();
          message = txt || message;
        }

        throw new Error(message);
      }

      const data = (await res.json()) as {
        message?: string;
        plan: DevelopmentPlanV1;
        derived?: { planner?: ChatPlannerState };
      };

      if (data?.derived?.planner) {
        setPlanner(data.derived.planner);
      }

      if (typeof data?.message === "string" && data.message.trim()) {
  setMessages((m) => [
    ...m,
    {
      role: "assistant",
      content: (data.message || "").trim(),
    },
  ]);
}

      if (data?.plan) {
        onPlanGenerated(data.plan);
        setPlanReady(true);
        setTimeout(() => onViewPlan?.(), 120);
      }
    } catch (e: any) {
      setError(e?.message || "Generate failed");
    } finally {
      setGenerating(false);
    }
  }

  function resetChat() {
    setPlanReady(false);
    setError(null);
    setBusy(false);
    setGenerating(false);
    setPlanner(null);
    onPlannerStateChange?.(null);
    setMessages([{ role: "assistant", content: initialAssistantMessage(lang) }]);
    setInput("");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-medium tracking-wide text-white/90">
            {s.title}
          </div>
          <div className="mt-1 text-[12px] text-white/50 max-w-[58ch]">
            {s.subtitle}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full border border-white/10 bg-black/30 p-1">
            <button
              type="button"
              onClick={() => setLang("nl")}
              className={cx(
                "rounded-full px-3 py-1 text-[12px]",
                lang === "nl"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              )}
            >
              NL
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cx(
                "rounded-full px-3 py-1 text-[12px]",
                lang === "en"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              )}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/80 hover:border-white/30 hover:text-white"
          >
            {s.reset}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-3">
        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[12px] text-white/55">
              {busy ? s.thinking : generating ? s.generating : s.qualityHintBase}
            </div>
            <div
              className={cx(
                "rounded-full px-3 py-1 text-[12px] font-medium",
                planReady
                  ? "bg-white text-black"
                  : plannerIntent === "strong_draft_ready"
                  ? "bg-white/90 text-black"
                  : plannerIntent === "draft_ready"
                  ? "bg-white/15 text-white"
                  : "bg-white/8 text-white/70"
              )}
            >
              {statusLabel}
            </div>
          </div>

          <div className="mt-4 h-[8px] rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${plannerScore}%` }}
            />
          </div>

          <div className="mt-2 text-[11px] text-white/35">
            {s.qualityTitle} · {plannerScore}%
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
          {missingFirstDraft.length > 0 ? (
            <>
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                {s.missingForDraft}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {missingFirstDraft.slice(0, 3).map((slot) => (
                  <span
                    key={slot}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/72"
                  >
                    {humanizeSlot(slot, lang)}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">
                {s.missingForStrong}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {missingStrongDraft.length > 0 ? (
                  missingStrongDraft.slice(0, 3).map((slot) => (
                    <span
                      key={slot}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/72"
                    >
                      {humanizeSlot(slot, lang)}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/72">
                    {lang === "nl"
                      ? "Alles scherp genoeg"
                      : "Everything is sharp enough"}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/35">
              {lang === "nl" ? "Eerste versie" : "First draft"}
            </div>
            <div className="mt-1 text-[12px] text-white/60">{draftHint}</div>
          </div>

          <button
            type="button"
            onClick={generateFirstDraft}
            disabled={generating || busy}
            className={cx(
              "rounded-xl px-4 py-2 text-[12px] font-medium transition",
              generating || busy
                ? "bg-white/20 text-white/45"
                : "bg-white text-black hover:bg-white/90"
            )}
          >
            {generating ? s.generating : s.firstDraftButton}
          </button>
        </div>
      </div>

      <div className="mt-4 max-h-[46vh] overflow-auto pr-1 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={`${m.role}-${idx}`}
            className={cx(
              "rounded-xl border border-white/10 px-3 py-2.5 text-[13px] leading-relaxed",
              m.role === "assistant"
                ? "bg-black/35 text-white/85"
                : "bg-white/5 text-white/92"
            )}
          >
            {m.content}
          </div>
        ))}

        {busy || generating ? (
          <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[13px] text-white/60">
            {busy ? s.thinking : s.generating}
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      {planReady ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3">
          <div className="text-[13px] text-white/90">{s.planReadyText}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onViewPlan?.()}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-[12px] text-white/85 hover:border-white/30"
            >
              {s.viewPlan}
            </button>

            <button
              type="button"
              onClick={() => onDownloadPdf?.("staff")}
              className="rounded-xl bg-white px-3 py-2 text-[12px] font-medium text-black hover:bg-white/90"
            >
              {s.downloadStaff}
            </button>

            <button
              type="button"
              onClick={() => onDownloadPdf?.("player")}
              className="rounded-xl bg-white px-3 py-2 text-[12px] font-medium text-black hover:bg-white/90"
            >
              {s.downloadPlayer}
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-3 rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-200/90">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            busy || generating ? s.placeholderThinking : s.placeholderType
          }
          className="min-h-12 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[14px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/25 focus:ring-2 focus:ring-white/10"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={busy || generating}
          rows={3}
        />

        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className={cx(
            "h-12 shrink-0 rounded-xl px-4 text-[13px] font-medium",
            canSend
              ? "bg-white text-black hover:bg-white/90"
              : "bg-white/20 text-white/50"
          )}
        >
          {s.send}
        </button>
      </div>

      <div className="mt-3 text-[11px] text-white/35">{s.footer}</div>
    </div>
  );
}