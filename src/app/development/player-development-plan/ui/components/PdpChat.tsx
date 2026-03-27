"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DevelopmentPlanV1, Lang } from "../lib/engineSchema";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
};

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
  embedded = false,
  minimalHeader = false,
  hidePromptChips = false,
  externalPrompt,
}: {
  lang: Lang;
  draftPlan: Partial<DevelopmentPlanV1>;
  onPlanGenerated: (plan: DevelopmentPlanV1) => void;
  onPlannerStateChange?: (planner: ChatPlannerState | null) => void;
  onViewPlan?: () => void;
  onDownloadPdf?: (version: "player" | "staff") => Promise<void>;
  embedded?: boolean;
  minimalHeader?: boolean;
  hidePromptChips?: boolean;
  externalPrompt?: string;
}) {
  const isNl = lang === "nl";

  const copy = useMemo(
    () =>
      isNl
        ? {
            introQuestion: "Wat zie je concreet gebeuren bij deze speler?",
            layerLabel: "Conversation",
            title: "Werk vanuit wat je concreet ziet.",
            body:
              "Gebruik de chat om observatie, gedrag en context te vertalen naar een plan dat scherp genoeg is om mee te werken.",
            ready: "Plan ready",
            live: "Live",
            thinking: "Denkt…",
            building: "Bouwt plan…",
            createDraft: "Maak eerste versie",
            generated: "Plan gegenereerd",
            viewPlan: "Bekijk plan",
            downloadPdf: "Download PDF",
            placeholder: "Beschrijf concreet wat je ziet…",
            send: "Verstuur",
            sendHint: "CMD/CTRL + ENTER om te versturen",
            quickPrompts: [
              "Beschrijf het gedrag onder druk",
              "Beschrijf het moment in de wedstrijd",
              "Beschrijf het effect op het spel",
            ],
            errorChat: "Er ging iets mis in de chat.",
            errorGenerate: "Er ging iets mis bij het genereren van het plan.",
          }
        : {
            introQuestion: "What do you concretely see happening with this player?",
            layerLabel: "Conversation",
            title: "Work from what you concretely see.",
            body:
              "Use the chat to turn observation, behaviour and context into a plan sharp enough to actually work with.",
            ready: "Plan ready",
            live: "Live",
            thinking: "Thinking…",
            building: "Building plan…",
            createDraft: "Create first draft",
            generated: "Plan generated",
            viewPlan: "View plan",
            downloadPdf: "Download PDF",
            placeholder: "Describe concretely what you see…",
            send: "Send",
            sendHint: "CMD/CTRL + ENTER to send",
            quickPrompts: [
              "Describe the behaviour under pressure",
              "Describe the moment in the match",
              "Describe the effect on the game",
            ],
            errorChat: "Something went wrong in the chat.",
            errorGenerate: "Something went wrong while generating the plan.",
          },
    [isNl]
  );

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: copy.introQuestion,
    },
  ]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planReady, setPlanReady] = useState(false);
  const [planner, setPlanner] = useState<ChatPlannerState | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const shouldStickToBottomRef = useRef(true);
  const lastAppliedExternalPromptRef = useRef<string | null>(null);

  const showHeader = !minimalHeader;
  const showPromptChips = !hidePromptChips;

  useEffect(() => {
    onPlannerStateChange?.(planner);
  }, [planner, onPlannerStateChange]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: copy.introQuestion,
      },
    ]);
    setInput("");
    setBusy(false);
    setGenerating(false);
    setPlanReady(false);
    setPlanner(null);
    lastAppliedExternalPromptRef.current = null;
  }, [copy.introQuestion]);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!shouldStickToBottomRef.current) return;

    const el = scrollRef.current;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy, generating]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 48;
  }

  function autoResizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }

  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  function applyPrompt(text: string) {
    setInput(text);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      autoResizeTextarea();
    });
  }

  useEffect(() => {
    if (!externalPrompt?.trim()) return;
    if (externalPrompt === lastAppliedExternalPromptRef.current) return;

    lastAppliedExternalPromptRef.current = externalPrompt;
    applyPrompt(externalPrompt);
  }, [externalPrompt]);

  async function send() {
    if (!input.trim() || busy) return;

    const nextMessages: ChatMsg[] = [
      ...messages,
      { role: "user", content: input.trim() },
    ];

    shouldStickToBottomRef.current = true;
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

      if (!res.ok) {
        throw new Error(copy.errorChat);
      }

      const data = (await res.json()) as ApiQuestion | ApiPlan;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      if (data?.derived?.planner) {
        setPlanner(data.derived.planner);
      }

      if (data.type === "plan" && data.plan) {
        onPlanGenerated(data.plan);
        setPlanReady(true);
      }
    } catch (error) {
      console.error("PDP chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: copy.errorChat,
        },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  }

  async function generate() {
    setGenerating(true);
    shouldStickToBottomRef.current = true;

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

      if (!res.ok) {
        throw new Error(copy.errorGenerate);
      }

      const data = await res.json();

      if (!data?.plan) {
        throw new Error(copy.errorGenerate);
      }

      onPlanGenerated(data.plan);
      setPlanReady(true);

      if (data?.derived?.planner) {
        setPlanner(data.derived.planner);
      }

      if (data?.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (error) {
      console.error("PDP generate error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: copy.errorGenerate,
        },
      ]);
    } finally {
      setGenerating(false);
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div
      className={
        embedded
          ? "flex h-full flex-col bg-transparent"
          : "overflow-hidden rounded-[24px] border border-white/8 bg-[#0a0e13]"
      }
    >
      {showHeader ? (
        <div
          className={
            embedded
              ? "pb-4"
              : "border-b border-white/8 px-5 py-5 sm:px-6"
          }
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-[58ch]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/36">
                {copy.layerLabel}
              </div>

              <h3 className="mt-2 text-[24px] font-medium leading-[1.02] tracking-[-0.03em] text-white/92 sm:text-[28px]">
                {copy.title}
              </h3>

              <p className="mt-3 text-[14px] leading-relaxed text-white/52">
                {copy.body}
              </p>
            </div>

            {!embedded ? (
              <div
                className={[
                  "rounded-full border px-3 py-1.5 text-[11px] tracking-[0.18em]",
                  planReady
                    ? "border-emerald-300/20 bg-emerald-300/10 text-white/84"
                    : "border-white/10 bg-white/[0.03] text-white/48",
                ].join(" ")}
              >
                {planReady ? copy.ready : copy.live}
              </div>
            ) : null}
          </div>

          {showPromptChips ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => applyPrompt(prompt)}
                  className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/56 transition hover:border-white/16 hover:bg-white/[0.04] hover:text-white/84"
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {!showHeader && showPromptChips ? (
        <div className={embedded ? "pb-4" : "px-5 pb-4 pt-4 sm:px-6"}>
          <div className="flex flex-wrap gap-2">
            {copy.quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => applyPrompt(prompt)}
                className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/56 transition hover:border-white/16 hover:bg-white/[0.04] hover:text-white/84"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={[
          "overflow-y-auto",
          embedded
            ? "flex-1 min-h-[360px] max-h-[720px] border-t border-white/8 py-5"
            : "min-h-[240px] max-h-[420px] px-5 py-5 sm:px-6",
        ].join(" ")}
      >
        <div className="space-y-4">
          {messages.map((message, index) => {
            const assistant = message.role === "assistant";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${assistant ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={[
                    "max-w-[85%] rounded-[20px] px-4 py-3 text-[14px] leading-relaxed",
                    assistant
                      ? "border border-white/8 bg-white/[0.04] text-white/84"
                      : "bg-white text-black",
                  ].join(" ")}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

          {(busy || generating) && (
            <div className="flex justify-start">
              <div className="rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-[13px] text-white/46">
                {busy ? copy.thinking : copy.building}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={
          embedded
            ? "border-t border-white/8 py-4"
            : "border-t border-white/8 px-5 py-4 sm:px-6"
        }
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {planReady ? (
              <>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] text-white/82">
                  {copy.generated}
                </div>

                {onViewPlan ? (
                  <button
                    type="button"
                    onClick={onViewPlan}
                    className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/72 transition hover:border-white/20 hover:text-white"
                  >
                    {copy.viewPlan}
                  </button>
                ) : null}

                {onDownloadPdf ? (
                  <button
                    type="button"
                    onClick={() => onDownloadPdf("player")}
                    className="rounded-full border border-white/12 bg-white px-3 py-1.5 text-[12px] text-black transition hover:bg-white/90"
                  >
                    {copy.downloadPdf}
                  </button>
                ) : null}
              </>
            ) : (
              <button
                type="button"
                onClick={generate}
                disabled={generating}
                className="rounded-full bg-white px-4 py-2 text-[13px] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copy.createDraft}
              </button>
            )}
          </div>

          <div className="text-[10px] uppercase tracking-[0.18em] text-white/28">
            {copy.sendHint}
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1 rounded-[22px] border border-white/10 bg-black/28 px-4 py-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onInputKeyDown}
              rows={1}
              placeholder={copy.placeholder}
              className="max-h-[180px] min-h-[28px] w-full resize-none bg-transparent text-[14px] leading-relaxed text-white placeholder:text-white/26 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => void send()}
            disabled={busy || !input.trim()}
            className="rounded-[18px] bg-white px-4 py-3 text-[13px] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {copy.send}
          </button>
        </div>
      </div>
    </div>
  );
}