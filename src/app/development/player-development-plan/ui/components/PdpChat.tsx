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
  derived?: { planner?: ChatPlannerState };
};

type ApiPlan = {
  type: "plan";
  message: string;
  plan: DevelopmentPlanV1;
  done: true;
  derived?: { planner?: ChatPlannerState };
};

function uiStrings(lang: Lang) {
  return {
    title: lang === "nl" ? "Gesprek" : "Conversation",
    initialAssistant:
      lang === "nl"
        ? "Wat zie je concreet gebeuren bij deze speler?"
        : "What do you concretely see happening with this player?",
    thinking: lang === "nl" ? "Denkt…" : "Thinking…",
    buildingPlan: lang === "nl" ? "Bouwt plan…" : "Building plan…",
    generateFirstDraft:
      lang === "nl" ? "Maak eerste versie" : "Generate first draft",
    generated: lang === "nl" ? "Plan gegenereerd ✔" : "Plan generated ✔",
    viewPlan: lang === "nl" ? "Bekijk plan" : "View plan",
    downloadPdf: lang === "nl" ? "Download PDF" : "Download PDF",
    inputPlaceholder:
      lang === "nl"
        ? "Beschrijf gedrag, moment en effect..."
        : "Describe behaviour, moment and effect...",
    send: lang === "nl" ? "Verstuur" : "Send",
    generateError:
      lang === "nl"
        ? "Er ging iets mis bij het genereren van het plan."
        : "Something went wrong while generating the plan.",
    genericError:
      lang === "nl" ? "Fout bij genereren." : "Error while generating.",
  };
}

export function PdpChat({
  lang,
  draftPlan,
  onPlanGenerated,
  onPlannerStateChange,
  onViewPlan,
  onDownloadPdf,
}: {
  lang: Lang;
  draftPlan: Partial<DevelopmentPlanV1>;
  onPlanGenerated: (plan: DevelopmentPlanV1) => void;
  onPlannerStateChange?: (planner: ChatPlannerState | null) => void;
  onViewPlan?: () => void;
  onDownloadPdf?: (version: "player" | "staff") => Promise<void>;
}) {
  const s = useMemo(() => uiStrings(lang), [lang]);

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: s.initialAssistant,
    },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [planner, setPlanner] = useState<ChatPlannerState | null>(null);

  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, generating, planReady]);

  useEffect(() => {
    onPlannerStateChange?.(planner);
  }, [planner, onPlannerStateChange]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: s.initialAssistant,
      },
    ]);
    setInput("");
    setBusy(false);
    setGenerating(false);
    setPlanReady(false);
    setPlanner(null);
    onPlannerStateChange?.(null);
  }, [s.initialAssistant, onPlannerStateChange]);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || busy || generating) return;

    const nextMessages: ChatMsg[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/pdp/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          draftPlan,
          lang,
          plannerState: planner,
        }),
      });

      const data = (await res.json()) as ApiQuestion | ApiPlan;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.message,
        },
      ]);

      if (data?.derived?.planner) {
        setPlanner(data.derived.planner);
      }

      if (data.type === "plan") {
        if (!data.plan) {
          console.error("PLAN MISSING IN CHAT RESPONSE", data);
          return;
        }

        onPlanGenerated(data.plan);
        setPlanReady(true);
      }
    } catch (error) {
      console.error("CHAT ERROR", error);
    } finally {
      setBusy(false);
    }
  }

  async function generate() {
    if (busy || generating) return;

    setGenerating(true);

    try {
      const res = await fetch("/api/pdp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          draftPlan,
          lang,
        }),
      });

      const data = await res.json();

      if (!data || !data.plan) {
        console.error("GENERATE FAILED — NO PLAN", data);
        alert(s.generateError);
        return;
      }

      onPlanGenerated(data.plan);
      setPlanReady(true);

      if (data?.derived?.planner) {
        setPlanner(data.derived.planner);
      }

      if (typeof data?.message === "string" && data.message.trim()) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: data.message.trim(),
          },
        ]);
      }
    } catch (error) {
      console.error("GENERATE ERROR", error);
      alert(s.genericError);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/90">{s.title}</div>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-xl p-3 text-sm ${
              message.role === "assistant" ? "bg-black/30" : "bg-white/5"
            }`}
          >
            {message.content}
          </div>
        ))}

        {(busy || generating) && (
          <div className="text-sm text-white/50">
            {busy ? s.thinking : s.buildingPlan}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {!planReady && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={generate}
            disabled={busy || generating}
            className="rounded-lg bg-white px-4 py-2 text-sm text-black disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-black/60"
          >
            {s.generateFirstDraft}
          </button>
        </div>
      )}

      {planReady && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-green-400">{s.generated}</div>

          <div className="flex gap-2">
            {onViewPlan ? (
              <button
                type="button"
                onClick={onViewPlan}
                className="rounded-lg border border-white/20 px-3 py-2 text-sm"
              >
                {s.viewPlan}
              </button>
            ) : null}

            {onDownloadPdf ? (
              <button
                type="button"
                onClick={() => onDownloadPdf("player")}
                className="rounded-lg bg-white px-3 py-2 text-sm text-black"
              >
                {s.downloadPdf}
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={s.inputPlaceholder}
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
        />

        <button
          type="button"
          onClick={send}
          disabled={busy || generating || !input.trim()}
          className="rounded-lg bg-white px-4 text-black disabled:cursor-not-allowed disabled:bg-white/30 disabled:text-black/60"
        >
          {s.send}
        </button>
      </div>
    </div>
  );
}