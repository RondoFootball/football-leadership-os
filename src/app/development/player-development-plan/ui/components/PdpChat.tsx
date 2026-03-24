"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const isNl = lang === "nl";

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: isNl
        ? "Wat zie je concreet gebeuren bij deze speler?"
        : "What do you concretely see happening with this player?",
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
  }, [messages, busy, generating]);

  useEffect(() => {
    onPlannerStateChange?.(planner);
  }, [planner, onPlannerStateChange]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: isNl
          ? "Wat zie je concreet gebeuren bij deze speler?"
          : "What do you concretely see happening with this player?",
      },
    ]);
    setInput("");
    setBusy(false);
    setGenerating(false);
    setPlanReady(false);
    setPlanner(null);
  }, [isNl]);

  async function send() {
    if (!input.trim() || busy) return;

    const next = [...messages, { role: "user" as const, content: input }];

    setMessages(next);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/pdp/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: next,
          draftPlan,
          lang,
          plannerState: planner,
        }),
      });

      const data = (await res.json()) as ApiQuestion | ApiPlan;

      console.log("💬 CHAT RESPONSE", data);

      setMessages((m) => [...m, { role: "assistant", content: data.message }]);

      if (data?.derived?.planner) setPlanner(data.derived.planner);

      if (data.type === "plan") {
        if (!data.plan) {
          console.error("❌ PLAN MISSING IN CHAT RESPONSE", data);
          return;
        }

        console.log("✅ PLAN RECEIVED FROM CHAT", data.plan);

        onPlanGenerated(data.plan);
        setPlanReady(true);
      }
    } catch (e) {
      console.error("❌ CHAT ERROR", e);
    } finally {
      setBusy(false);
    }
  }

  async function generate() {
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

      console.log("⚙️ GENERATE RESPONSE", data);

      if (!data || !data.plan) {
        console.error("❌ GENERATE FAILED — NO PLAN", data);
        alert(
          isNl
            ? "Er ging iets mis bij het genereren van het plan."
            : "Something went wrong while generating the plan."
        );
        return;
      }

      console.log("✅ PLAN RECEIVED FROM GENERATE", data.plan);

      onPlanGenerated(data.plan);
      setPlanReady(true);

      if (data?.derived?.planner) setPlanner(data.derived.planner);
    } catch (e) {
      console.error("❌ GENERATE ERROR", e);
      alert(isNl ? "Fout bij genereren." : "Error while generating.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm text-white/90">
        {isNl ? "Gesprek" : "Conversation"}
      </div>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 text-sm ${
              m.role === "assistant" ? "bg-black/30" : "bg-white/5"
            }`}
          >
            {m.content}
          </div>
        ))}

        {(busy || generating) && (
          <div className="text-sm text-white/50">
            {busy
              ? isNl
                ? "Denkt…"
                : "Thinking…"
              : isNl
                ? "Bouwt plan…"
                : "Building plan…"}
          </div>
        )}

        <div ref={endRef} />
      </div>

      {!planReady && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={generate}
            className="rounded-lg bg-white px-4 py-2 text-sm text-black"
          >
            {isNl ? "Maak eerste versie" : "Create first draft"}
          </button>
        </div>
      )}

      {planReady && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-green-400">
            {isNl ? "Plan gegenereerd ✔" : "Plan generated ✔"}
          </div>

          <div className="flex gap-2">
            {onViewPlan && (
              <button
                onClick={onViewPlan}
                className="rounded-lg border border-white/20 px-3 py-2 text-sm"
              >
                {isNl ? "Bekijk plan" : "View plan"}
              </button>
            )}

            {onDownloadPdf && (
              <button
                onClick={() => onDownloadPdf("player")}
                className="rounded-lg bg-white px-3 py-2 text-sm text-black"
              >
                {isNl ? "Download PDF" : "Download PDF"}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isNl ? "Beschrijf gedrag..." : "Describe behaviour..."}
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
        />

        <button
          onClick={send}
          className="rounded-lg bg-white px-4 text-black"
        >
          {isNl ? "Verstuur" : "Send"}
        </button>
      </div>
    </div>
  );
}