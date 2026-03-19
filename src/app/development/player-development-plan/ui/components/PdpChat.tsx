"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DevelopmentPlanV1, Lang } from "../lib/engineSchema";

type ChatMsg = { role: "user" | "assistant"; content: string };

type QuestionId =
  | "dev_point"
  | "focus_behaviour"
  | "domain_tag"
  | "match_situation"
  | "team_context"
  | "position_role"
  | "role_description"
  | "zone_key"
  | "development_goal"
  | "block_timing"
  | "slide3_moment"
  | "slide3_what_we_see"
  | "slide3_metric"
  | "slide3_effect"
  | "done";

type FlowState = {
  lang: Lang;
  track: "performance" | "mental" | "unknown";
  asked: string[];
  answered: string[];
  currentQuestionId?: QuestionId;
};

type ApiProgress = { step: number; total: number; label: string };

type ApiQuestion = {
  type: "question";
  message: string;
  progress?: ApiProgress;
  done: false;
  derived?: {
    flowState: FlowState;
    currentQuestionId: QuestionId;
  };
};

type ApiPlan = {
  type: "plan";
  message: string;
  plan: DevelopmentPlanV1;
  progress?: ApiProgress;
  done: true;
  derived?: { flowState: FlowState };
};

function initialAssistantMessage(lang: Lang) {
  return lang === "nl"
    ? "Wat is het belangrijkste ontwikkelpunt dat je nu ziet? Beschrijf kort (1–2 zinnen)."
    : "What is the main development point you see right now? Keep it short (1–2 lines).";
}

function uiStrings(lang: Lang) {
  return {
    title: lang === "nl" ? "Gesprek" : "Conversation",
    subtitle:
      lang === "nl"
        ? "Kort, concreet. We bouwen stap voor stap richting een plan."
        : "Short, specific. Step by step towards a plan.",
    reset: "Reset",
    thinking: lang === "nl" ? "Denken…" : "Thinking…",
    inProgress: lang === "nl" ? "In gesprek" : "In progress",
    planReadyPill: lang === "nl" ? "Plan klaar" : "Plan ready",
    planReadyText:
      lang === "nl"
        ? "Plan is klaar. Bekijk rechts en download de PDF’s."
        : "Plan is ready. Preview on the right and download the PDFs.",
    viewPlan: "View plan",
    downloadStaff: "Download Staff PDF",
    downloadPlayer: "Download Player PDF",
    placeholderType: lang === "nl" ? "Typ je antwoord…" : "Type your answer…",
    placeholderThinking: lang === "nl" ? "Denken…" : "Thinking…",
    placeholderReady:
      lang === "nl"
        ? "Plan is klaar. Reset om opnieuw te starten."
        : "Plan is ready. Reset to start again.",
    send: "Send",
    footer:
      lang === "nl"
        ? "Zodra de kerninformatie compleet is, maakt het systeem automatisch een plan."
        : "Once the core information is complete, the system generates the plan automatically.",
    fallbackOk: lang === "nl" ? "Oké." : "Okay.",
  };
}

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function PdpChat({
  draftPlan,
  onPlanGenerated,
  onViewPlan,
  onDownloadPdf,
}: {
  draftPlan: Partial<DevelopmentPlanV1>;
  onPlanGenerated: (plan: DevelopmentPlanV1) => void;
  onViewPlan?: () => void;
  onDownloadPdf?: (version: "staff" | "player") => void;
}) {
  const [lang, setLang] = useState<Lang>("nl");
  const s = uiStrings(lang);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: initialAssistantMessage("nl") },
  ]);

  const [flowState, setFlowState] = useState<FlowState>({
    lang: "nl",
    track: "unknown",
    asked: [],
    answered: [],
    currentQuestionId: "dev_point",
  });

  const [currentQuestionId, setCurrentQuestionId] =
    useState<QuestionId>("dev_point");

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ApiProgress | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy, error, planReady]);

  useEffect(() => {
    setPlanReady(false);
    setError(null);
    setBusy(false);
    setProgress(null);
    setMessages([{ role: "assistant", content: initialAssistantMessage(lang) }]);
    setInput("");

    setFlowState({
      lang,
      track: "unknown",
      asked: [],
      answered: [],
      currentQuestionId: "dev_point",
    });
    setCurrentQuestionId("dev_point");
  }, [lang]);

  const canSend = useMemo(
    () => !!input.trim() && !busy && !planReady,
    [input, busy, planReady]
  );

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
          flowState: { ...flowState, lang, currentQuestionId },
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Chat failed");
      }

      const data = (await res.json()) as ApiQuestion | ApiPlan;

      if (data.progress) setProgress(data.progress);

      setMessages((m) => [
        ...m,
        { role: "assistant", content: (data?.message || "").trim() || s.fallbackOk },
      ]);

      if ("derived" in data && data.derived?.flowState) {
        setFlowState(data.derived.flowState);
      }

      if (data.type === "question" && data.derived?.currentQuestionId) {
        setCurrentQuestionId(data.derived.currentQuestionId);
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

  function resetChat() {
    setPlanReady(false);
    setError(null);
    setBusy(false);
    setProgress(null);
    setMessages([{ role: "assistant", content: initialAssistantMessage(lang) }]);
    setInput("");
    setFlowState({
      lang,
      track: "unknown",
      asked: [],
      answered: [],
      currentQuestionId: "dev_point",
    });
    setCurrentQuestionId("dev_point");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-medium tracking-wide text-white/90">
            {s.title}
          </div>
          <div className="mt-1 text-[12px] text-white/50">{s.subtitle}</div>
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

      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
        <div className="text-[12px] text-white/70">
          {progress ? (
            <>
              <span className="text-white/90">{progress.label}</span>
              <span className="text-white/45">
                {" "}
                · {progress.step}/{progress.total}
              </span>
            </>
          ) : (
            <span className="text-white/55">
              {lang === "nl"
                ? "We verzamelen scherp bewijs → dan bouwen we het plan."
                : "We collect clear evidence → then we generate the plan."}
            </span>
          )}
        </div>

        {planReady ? (
          <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-black">
            {s.planReadyPill}
          </span>
        ) : (
          <span className="text-[12px] text-white/45">
            {busy ? s.thinking : s.inProgress}
          </span>
        )}
      </div>

      <div className="mt-4 max-h-[46vh] overflow-auto pr-1 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={`${m.role}-${idx}`}
            className={cx(
              "rounded-xl border border-white/10 px-3 py-2 text-[13px] leading-relaxed",
              m.role === "assistant"
                ? "bg-black/35 text-white/85"
                : "bg-white/5 text-white/90"
            )}
          >
            {m.content}
          </div>
        ))}

        {busy ? (
          <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[13px] text-white/60">
            {s.thinking}
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

      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            planReady
              ? s.placeholderReady
              : busy
              ? s.placeholderThinking
              : s.placeholderType
          }
          className="min-h-11 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-[14px] text-white/90 outline-none placeholder:text-white/30 focus:border-white/25 focus:ring-2 focus:ring-white/10"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={busy || planReady}
          rows={2}
        />
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          className={cx(
            "h-11 shrink-0 rounded-xl px-4 text-[13px] font-medium",
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