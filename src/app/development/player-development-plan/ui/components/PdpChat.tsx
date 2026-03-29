"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DevelopmentPlanV1, Lang } from "../lib/engineSchema";

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
};

export type ChatPlannerSlotQuality =
  | "empty"
  | "draft"
  | "usable"
  | "strong";

export type ChatPlannerSlotStatus = {
  quality: ChatPlannerSlotQuality;
  progress: number;
  slide?:
    | "agreement"
    | "role_context"
    | "reality"
    | "approach"
    | "success";
};

export type ChatPlannerState = {
  filledSlots?: Record<string, boolean>;
  usableSlots?: Record<string, boolean>;
  strongSlots?: Record<string, boolean>;
  slotStatuses?: Record<string, ChatPlannerSlotStatus>;
  missingFirstDraft?: string[];
  missingStrongDraft?: string[];
  intent?: "ask" | "summarise" | "draft_ready" | "strong_draft_ready";
  nextPrioritySlot?: string;
  nextPrioritySlide?:
    | "agreement"
    | "role_context"
    | "reality"
    | "approach"
    | "success";
  firstDraftProgress?: number;
  strongDraftProgress?: number;
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

type ApiError = {
  type?: "error";
  message?: string;
  done?: false;
};

function extractReadableErrorMessage(
  raw: string | null | undefined,
  fallback: string
) {
  if (!raw) return fallback;

  const trimmed = raw.trim();

  try {
    const parsed = JSON.parse(trimmed) as ApiError;
    if (parsed?.message && typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    // ignore
  }

  return trimmed || fallback;
}

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
            draftReady: "Eerste draft mogelijk",
            thinking: "Denkt…",
            building: "Bouwt plan…",
            createDraft: "Maak eerste versie",
            generated: "Plan gegenereerd",
            viewPlan: "Bekijk plan",
            downloadPdf: "Download PDF",
            placeholder: "Beschrijf concreet wat je ziet…",
            send: "Verstuur",
            sendHint: "CMD/CTRL + ENTER om te versturen",
            nextFocus: "Volgende focus",
            missing: "Ontbreekt",
            firstDraft: "First draft",
            strongDraft: "Sterke draft",
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
            draftReady: "First draft ready",
            thinking: "Thinking…",
            building: "Building plan…",
            createDraft: "Create first draft",
            generated: "Plan generated",
            viewPlan: "View plan",
            downloadPdf: "Download PDF",
            placeholder: "Describe concretely what you see…",
            send: "Send",
            sendHint: "CMD/CTRL + ENTER to send",
            nextFocus: "Next focus",
            missing: "Missing",
            firstDraft: "First draft",
            strongDraft: "Strong draft",
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
    if (!input.trim() || busy || generating) return;

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
        const errorText = await res.text();
        throw new Error(extractReadableErrorMessage(errorText, copy.errorChat));
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
      const message =
        error instanceof Error && error.message ? error.message : copy.errorChat;

      console.error("PDP chat error:", message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
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
    if (generating || busy) return;

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
          plannerState: planner,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          extractReadableErrorMessage(errorText, copy.errorGenerate)
        );
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
      const message =
        error instanceof Error && error.message
          ? error.message
          : copy.errorGenerate;

      console.error("PDP generate error:", message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
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

  const plannerIntentLabel = useMemo(() => {
    if (!planner?.intent) return copy.live;
    if (planner.intent === "strong_draft_ready") return copy.ready;
    if (planner.intent === "draft_ready") return copy.draftReady;
    return copy.live;
  }, [planner?.intent, copy]);

  const plannerMissingCount = planner?.missingStrongDraft?.length ?? 0;
  const firstDraftProgress = planner?.firstDraftProgress ?? 0;
  const strongDraftProgress = planner?.strongDraftProgress ?? 0;

  return (
    <div
      className={
        embedded
          ? "flex h-full min-h-[620px] flex-col rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,10,18,0.96)_0%,rgba(3,8,15,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.28)]"
          : "flex min-h-[620px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,19,0.98)_0%,rgba(7,11,16,0.98)_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.34)]"
      }
    >
      {showHeader ? (
        <div className={embedded ? "px-6 pt-6 pb-5" : "px-6 pt-6 pb-5 sm:px-7"}>
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
                    : planner?.intent === "draft_ready" ||
                      planner?.intent === "strong_draft_ready"
                    ? "border-white/12 bg-white/[0.05] text-white/84"
                    : "border-white/10 bg-white/[0.03] text-white/48",
                ].join(" ")}
              >
                {planReady ? copy.ready : plannerIntentLabel}
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.firstDraft}: {firstDraftProgress}%
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.strongDraft}: {strongDraftProgress}%
            </div>

            {planner?.nextPrioritySlot ? (
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
                {copy.nextFocus}: {planner.nextPrioritySlot}
              </div>
            ) : null}

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.missing}: {plannerMissingCount}
            </div>
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
        <div className={embedded ? "px-6 pt-5 pb-4" : "px-6 pt-5 pb-4 sm:px-7"}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.firstDraft}: {firstDraftProgress}%
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.strongDraft}: {strongDraftProgress}%
            </div>

            {planner?.nextPrioritySlot ? (
              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
                {copy.nextFocus}: {planner.nextPrioritySlot}
              </div>
            ) : null}
          </div>

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

      <div className="relative flex-1 px-6 pt-2 pb-6 sm:px-7 sm:pt-3 sm:pb-7">
        <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,9,20,0.97)_0%,rgba(3,8,16,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="px-6 pt-5 sm:px-7 sm:pt-6">
            <div className="h-px w-full rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.10)_18%,rgba(255,255,255,0.04)_55%,transparent_100%)]" />
            <div className="mt-1 h-px w-[72%] rounded-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_20%,transparent_100%)]" />
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6"
          >
            <div className="space-y-5">
              {messages.map((message, index) => {
                const assistant = message.role === "assistant";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${assistant ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={[
                        "max-w-[84%] rounded-[22px] px-5 py-4 text-[14px] leading-relaxed shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
                        assistant
                          ? "border border-white/8 bg-white/[0.05] text-white/84"
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
                  <div className="rounded-[22px] border border-white/8 bg-white/[0.05] px-5 py-4 text-[13px] text-white/46">
                    {busy ? copy.thinking : copy.building}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/8 px-6 py-5 sm:px-7 sm:py-6">
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
                    disabled={generating || busy}
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
              <div className="flex-1 rounded-[24px] border border-white/10 bg-black/30 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
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
                disabled={busy || generating || !input.trim()}
                className="rounded-[20px] bg-white px-5 py-3.5 text-[13px] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {copy.send}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}