"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DevelopmentPlanV1, Lang } from "../lib/engineSchema";
import { slideLabel } from "../lib/pdp/pdpLabels";

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
    | "success"
    | "cover";
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
    | "success"
    | "cover";
  firstDraftProgress?: number;
  strongDraftProgress?: number;
};

type ApiQuestion = {
  type: "question";
  message: string;
  done: false;
  derived?: { planner?: ChatPlannerState };
  suggestedResponses?: string[];
};

type ApiPlan = {
  type: "plan";
  message: string;
  plan: DevelopmentPlanV1;
  done: true;
  derived?: { planner?: ChatPlannerState };
  suggestedResponses?: string[];
};

type ApiError = {
  type?: "error";
  message?: string;
  done?: false;
};

type PlanSlide =
  | "agreement"
  | "role_context"
  | "reality"
  | "approach"
  | "success";

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

function average(xs: number[]) {
  if (!xs.length) return 0;
  return Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
}

function getSafePlanSlide(
  slide?: ChatPlannerState["nextPrioritySlide"]
): PlanSlide {
  if (
    slide === "agreement" ||
    slide === "role_context" ||
    slide === "reality" ||
    slide === "approach" ||
    slide === "success"
  ) {
    return slide;
  }

  return "agreement";
}

function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
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
            layerLabel: "Plangesprek",
            title: "Bouw het plan vanuit wat je concreet ziet.",
            body:
              "Werk snel van observatie naar ontwikkelpunt, context, aanpak en succesdefinitie.",
            synced: "Plan bijgewerkt",
            live: "Live",
            thinking: "Denkt…",
            building: "Werkt plan bij…",
            updatePlan: "Werk plan bij",
            generated: "Plan bijgewerkt",
            viewPlan: "Bekijk plan",
            downloadPlan: "Download plan",
            placeholder:
              "Beschrijf concreet wat je ziet of kies hieronder een richting…",
            send: "Verstuur",
            sendHint: "CMD/CTRL + ENTER",
            nextFocus: "Nu bezig met",
            missing: "Open",
            progress: "Planvoortgang",
            section: "Onderdeel",
            quickPrompts: [
              "Beschrijf het gedrag onder druk",
              "Beschrijf de spelsituatie",
              "Beschrijf het effect op het team",
            ],
            errorChat: "Er ging iets mis in de chat.",
            errorGenerate: "Er ging iets mis bij het bijwerken van het plan.",
            sectionExplainers: {
              agreement: "Ontwikkelpunt, doelgedrag en wedstrijdbetekenis.",
              role_context: "Rol-, fase- en teamcontext.",
              reality: "Wat nu zichtbaar gebeurt op het veld.",
              approach: "Wat speler en staf concreet anders gaan doen.",
              success: "Waaraan progressie zichtbaar wordt.",
            } as Record<PlanSlide, string>,
            guided: {
              agreement: [
                "Beschrijf het kernprobleem",
                "Beschrijf het gewenste gedrag",
                "Beschrijf de wedstrijdsituatie",
              ],
              role_context: [
                "Wat vraagt de rol hier?",
                "In welke fase wordt dit beslissend?",
                "Wat verliest het team hier?",
              ],
              reality: [
                "Wat zie je als eerste gebeuren?",
                "Wanneer gebeurt dit het meest?",
                "Wat is het directe effect?",
              ],
              approach: [
                "Wat moet de speler direct anders doen?",
                "Wat pakt de coach op?",
                "Wat voeg je toe via video?",
              ],
              success: [
                "Waaraan zie je dit in de wedstrijd?",
                "Welk gedrag moet veranderen?",
                "Wat is een vroeg signaal?",
              ],
            } as Record<PlanSlide, string[]>,
          }
        : {
            introQuestion:
              "What do you concretely see happening with this player?",
            layerLabel: "Plan conversation",
            title: "Build the plan from what you concretely see.",
            body:
              "Move quickly from observation to development point, context, approach and success definition.",
            synced: "Plan synced",
            live: "Live",
            thinking: "Thinking…",
            building: "Updating plan…",
            updatePlan: "Update plan",
            generated: "Plan updated",
            viewPlan: "View plan",
            downloadPlan: "Download plan",
            placeholder:
              "Describe concretely what you see or choose a direction below…",
            send: "Send",
            sendHint: "CMD/CTRL + ENTER",
            nextFocus: "Now working on",
            missing: "Open",
            progress: "Plan progress",
            section: "Section",
            quickPrompts: [
              "Describe the behaviour under pressure",
              "Describe the match situation",
              "Describe the effect on the team",
            ],
            errorChat: "Something went wrong in the chat.",
            errorGenerate: "Something went wrong while updating the plan.",
            sectionExplainers: {
              agreement:
                "Development point, target behaviour and match meaning.",
              role_context: "Role, phase and team context.",
              reality: "What is currently visible on the pitch.",
              approach: "What player and staff will do differently.",
              success: "What visible progress will look like.",
            } as Record<PlanSlide, string>,
            guided: {
              agreement: [
                "Describe the core issue",
                "Describe the target behaviour",
                "Describe the match situation",
              ],
              role_context: [
                "What does the role ask here?",
                "In which phase is this decisive?",
                "What does the team lose here?",
              ],
              reality: [
                "What is the first visible behaviour?",
                "When does this happen most clearly?",
                "What is the direct effect?",
              ],
              approach: [
                "What must the player do differently right away?",
                "What should the coach own?",
                "What do you add through video?",
              ],
              success: [
                "What should become visible in games?",
                "What behaviour should change?",
                "What is an early signal?",
              ],
            } as Record<PlanSlide, string[]>,
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
  const [suggestedResponses, setSuggestedResponses] = useState<string[]>([]);

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
    setSuggestedResponses([]);
    lastAppliedExternalPromptRef.current = null;
  }, [copy.introQuestion]);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!shouldStickToBottomRef.current) return;

    const el = scrollRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy, generating]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldStickToBottomRef.current = distanceFromBottom < 24;
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

      setSuggestedResponses(
        Array.isArray(data?.suggestedResponses) ? data.suggestedResponses : []
      );

      if (data.type === "plan" && data.plan) {
        onPlanGenerated(data.plan);
        setPlanReady(true);
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : copy.errorChat;

      console.error("PDP chat error:", message);

      setSuggestedResponses([]);

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

      setSuggestedResponses([]);

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

      setSuggestedResponses([]);

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

  const currentSlide = getSafePlanSlide(planner?.nextPrioritySlide);
  const currentSectionLabel = slideLabel(currentSlide, lang);
  const currentSectionExplainer = copy.sectionExplainers[currentSlide];

  const slotStatuses = planner?.slotStatuses || {};

  const sectionProgress = useMemo(() => {
    const grouped: Record<PlanSlide, number[]> = {
      agreement: [],
      role_context: [],
      reality: [],
      approach: [],
      success: [],
    };

    Object.values(slotStatuses).forEach((status) => {
      if (!status?.slide) return;
      const slide = getSafePlanSlide(status.slide);
      grouped[slide].push(
        typeof status.progress === "number" ? status.progress : 0
      );
    });

    return {
      agreement: average(grouped.agreement),
      role_context: average(grouped.role_context),
      reality: average(grouped.reality),
      approach: average(grouped.approach),
      success: average(grouped.success),
    };
  }, [slotStatuses]);

  const planProgress = useMemo(() => {
    const fromSections = average([
      sectionProgress.agreement,
      sectionProgress.role_context,
      sectionProgress.reality,
      sectionProgress.approach,
      sectionProgress.success,
    ]);

    const fromPlanner =
      typeof planner?.strongDraftProgress === "number" &&
      planner.strongDraftProgress > 0
        ? planner.strongDraftProgress
        : typeof planner?.firstDraftProgress === "number"
        ? planner.firstDraftProgress
        : 0;

    return clampPct(Math.max(fromSections, fromPlanner));
  }, [
    planner?.firstDraftProgress,
    planner?.strongDraftProgress,
    sectionProgress,
  ]);

  const plannerMissingCount = planner?.missingStrongDraft?.length ?? 0;
  const guidedOptions = copy.guided[currentSlide] || [];
  const activeResponseOptions =
    suggestedResponses.length > 0 ? suggestedResponses : guidedOptions;

  const compactPromptChips = showPromptChips ? copy.quickPrompts : [];

  const statusTone = planReady
    ? "border-emerald-300/20 bg-emerald-300/10 text-white/86"
    : "border-white/10 bg-white/[0.04] text-white/72";

  return (
    <div
      className={
        embedded
          ? "flex h-full min-h-[720px] max-h-[720px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(5,10,18,0.96)_0%,rgba(3,8,15,0.98)_100%)] shadow-[0_30px_100px_rgba(0,0,0,0.28)]"
          : "flex h-[720px] min-h-[720px] max-h-[720px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,19,0.98)_0%,rgba(7,11,16,0.98)_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.34)]"
      }
    >
      {showHeader ? (
        <div className={embedded ? "px-6 pt-6 pb-5" : "px-6 pt-6 pb-5 sm:px-7"}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-[62ch]">
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

            <div
              className={`rounded-full border px-3 py-1.5 text-[11px] tracking-[0.18em] ${statusTone}`}
            >
              {planReady ? copy.synced : copy.live}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr]">
            <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/38">
                {copy.section}
              </div>
              <div className="mt-2 text-[14px] font-medium text-white/88">
                {currentSectionLabel}
              </div>
              <div className="mt-1 text-[12px] leading-relaxed text-white/52">
                {currentSectionExplainer}
              </div>
            </div>

            <div className="rounded-[18px] border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/38">
                  {copy.nextFocus}
                </div>
                <div className="text-[12px] text-white/76">{planProgress}%</div>
              </div>
              <div className="mt-2 text-[14px] font-medium text-white/88">
                {planner?.nextPrioritySlot || currentSectionLabel}
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full bg-white transition-all"
                  style={{
                    width: `${Math.max(4, Math.min(100, planProgress))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(
              [
                "agreement",
                "role_context",
                "reality",
                "approach",
                "success",
              ] as PlanSlide[]
            ).map((slide) => {
              const active = slide === currentSlide;
              return (
                <div
                  key={slide}
                  className={[
                    "rounded-full border px-3 py-1.5 text-[11px]",
                    active
                      ? "border-white/16 bg-white/[0.07] text-white/88"
                      : "border-white/8 bg-white/[0.02] text-white/52",
                  ].join(" ")}
                >
                  {slideLabel(slide, lang)} · {sectionProgress[slide]}%
                </div>
              );
            })}

            <div className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[11px] text-white/52">
              {copy.missing}: {plannerMissingCount}
            </div>
          </div>
        </div>
      ) : null}

      {!showHeader && showPromptChips ? (
        <div className={embedded ? "px-6 pt-5 pb-4" : "px-6 pt-5 pb-4 sm:px-7"}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.progress}: {planProgress}%
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/68">
              {copy.section}: {currentSectionLabel}
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
        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(2,9,20,0.97)_0%,rgba(3,8,16,0.98)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="border-b border-white/8 px-6 py-4 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/36">
                  {copy.section}
                </div>
                <div className="mt-1 text-[15px] font-medium text-white/90">
                  {currentSectionLabel}
                </div>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/64">
                {sectionProgress[currentSlide]}%
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 sm:px-7 sm:py-6"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="space-y-5">
              {messages.map((message, index) => {
                const assistant = message.role === "assistant";
                const isLastAssistant =
                  assistant &&
                  index ===
                    [...messages].map((m) => m.role).lastIndexOf("assistant");

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${assistant ? "justify-start" : "justify-end"}`}
                  >
                    <div className="max-w-[86%]">
                      {assistant && isLastAssistant ? (
                        <div className="mb-2">
                          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/56">
                            {currentSectionLabel}
                          </div>
                        </div>
                      ) : null}

                      <div
                        className={[
                          "rounded-[22px] px-5 py-4 text-[14px] leading-relaxed shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
                          assistant
                            ? "border border-white/8 bg-white/[0.05] text-white/84"
                            : "bg-white text-black",
                        ].join(" ")}
                      >
                        {message.content}
                      </div>
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
            <div className="mb-4 flex flex-wrap gap-2">
              {activeResponseOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => applyPrompt(option)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/72 transition hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
                >
                  {option}
                </button>
              ))}

              {compactPromptChips.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => applyPrompt(prompt)}
                  className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/50 transition hover:border-white/16 hover:bg-white/[0.04] hover:text-white/78"
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                        {copy.downloadPlan}
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
                    {copy.updatePlan}
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