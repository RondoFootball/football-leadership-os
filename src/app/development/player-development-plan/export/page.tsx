"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { DevelopmentPlanV1, FocusItemV1 } from "../ui/lib/engineSchema";

const STORAGE_KEY = "ftbll:pdp:v1";

function clampHex(v: string) {
  const s = (v || "").trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#111111";
}

function safeText(v?: string) {
  return (v || "").trim();
}

function ToolbarButton({
  children,
  onClick,
  variant = "ghost",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "ghost" | "solid";
}) {
  const base =
    "h-10 rounded-full px-4 text-[12px] font-medium tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20";
  const ghost =
    "border border-black/10 bg-white text-black/80 hover:bg-black/[0.04]";
  const solid = "bg-black text-white hover:bg-black/90";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${variant === "solid" ? solid : ghost}`}
    >
      {children}
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[12px] text-black/70">
      {children}
    </span>
  );
}

function FocusBlock({
  f,
  accent,
}: {
  f: FocusItemV1;
  accent: string;
}) {
  return (
    <section className="relative rounded-2xl border border-black/10 bg-white p-5">
      {/* Accent keyline (safe even if red) */}
      <div
        className="absolute left-0 top-0 h-full w-[2px] rounded-l-2xl"
        style={{ backgroundColor: accent, opacity: 0.9 }}
        aria-hidden="true"
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-[0.18em] text-black/45">
              FOCUS
            </div>
            <h3 className="mt-2 text-[18px] font-semibold tracking-tight text-black">
              {f.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-black/70">
              {f.context || "—"}
            </p>
          </div>

          <div className="shrink-0">
            <Tag>{f.type.toUpperCase()}</Tag>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
            <div className="text-[11px] tracking-[0.14em] text-black/50">
              WHAT GOOD LOOKS LIKE
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-black/80">
              {f.goodLooksLike || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4">
            <div className="text-[11px] tracking-[0.14em] text-black/50">
              CONSTRAINTS
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-black/80">
              {f.constraints || "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-[11px] tracking-[0.14em] text-black/50">
              PLAYER ACTIONS (WEEKLY)
            </div>
            <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-black/80">
              {(f.playerActions || []).slice(0, 6).map((x, i) => (
                <li key={i} className="flex gap-2">
                  {/* Neutral bullet — not accent (avoids “red = bad”) */}
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/40" aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
              {!f.playerActions?.length ? <li>—</li> : null}
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="text-[11px] tracking-[0.14em] text-black/50">
              STAFF ACTIONS (WEEKLY)
            </div>
            <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-black/80">
              {(f.staffActions || []).slice(0, 6).map((x, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/40" aria-hidden="true" />
                  <span>{x}</span>
                </li>
              ))}
              {!f.staffActions?.length ? <li>—</li> : null}
            </ul>
          </div>
        </div>

        {f.riskIfOverloaded ? (
          <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.03] p-4">
            <div className="text-[11px] tracking-[0.14em] text-black/50">
              RISK IF OVERLOADED
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-black/80">
              {f.riskIfOverloaded}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ExportPage() {
  const [plan, setPlan] = useState<DevelopmentPlanV1 | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setPlan(JSON.parse(raw) as DevelopmentPlanV1);
    } catch {
      // ignore
    }
  }, []);

  const accent = useMemo(
    () => clampHex(plan?.brand?.primaryColor || "#111111"),
    [plan?.brand?.primaryColor]
  );

  function onDownloadPdf() {
    window.print();
  }

  if (!plan) {
    return (
      <main className="min-h-dvh bg-white text-black">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="text-[12px] tracking-[0.22em] text-black/40">
            FTBLL.AI
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Export not ready
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-black/70">
            Open the builder, click <span className="font-medium">Generate</span>,
            then click <span className="font-medium">Export PDF</span>.
          </p>
        </div>
      </main>
    );
  }

  const club = safeText(plan.brand.clubName) || safeText(plan.meta.club) || "Club";
  const player = safeText(plan.player.name) || "Player";
  const role = safeText(plan.player.role) || "Role";
  const team = safeText(plan.player.team) || safeText(plan.meta.team) || "Team";
  const object = safeText(plan.diagnosis.dominantDevelopmentObject) || "—";

  return (
    <div className="min-h-dvh bg-white text-black">
      {/* Toolbar (screen only) */}
      <div className="no-print sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            <div className="text-[12px] tracking-[0.18em] text-black/60">
              EXPORT
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ToolbarButton onClick={onDownloadPdf} variant="solid">
              Download PDF
            </ToolbarButton>
            <ToolbarButton onClick={() => window.print()}>Print</ToolbarButton>
            <ToolbarButton onClick={() => window.close()}>Close</ToolbarButton>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-3 text-[11px] text-black/50">
          Tip: in the dialog, choose <span className="font-medium">Save as PDF</span>.
        </div>
      </div>

      {/* COVER */}
      <section className="relative overflow-hidden bg-black text-white">
        {plan.player.headshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plan.player.headshotUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-[0.55]"
          />
        ) : null}

        {/* overlays */}
        <div className="absolute inset-0 bg-black/55" />
        <div
          className="absolute inset-0 opacity-[0.20]"
          style={{
            background:
              "radial-gradient(1200px_700px_at_30%_10%,rgba(255,255,255,0.12),transparent_60%)",
          }}
        />
        {/* club-color wash (subtle; not status) */}
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            background: `linear-gradient(120deg, ${accent} 0%, transparent 55%)`,
          }}
        />
        {/* accent top keyline */}
        <div
          className="absolute left-0 top-0 h-1 w-full"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl px-6 py-14">
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-3xl">
              <div className="text-[11px] tracking-[0.28em] text-white/60">
                DEVELOPMENT PLAN
              </div>

              <h1 className="mt-4 text-[42px] font-semibold tracking-tight leading-[1.02]">
                {player}
              </h1>

              <div className="mt-3 text-[14px] text-white/70">
                {role} · {team}
              </div>

              <div className="mt-8 max-w-2xl text-[14px] leading-relaxed text-white/85">
                <span className="text-white/55">Dominant focus:</span>{" "}
                <span className="font-medium text-white">{object}</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              {plan.brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={plan.brand.logoUrl}
                  alt={`${club} logo`}
                  className="h-12 w-auto opacity-[0.95]"
                />
              ) : (
                <div className="text-[12px] tracking-[0.22em] text-white/60">
                  {club.toUpperCase()}
                </div>
              )}

              <div className="mt-3 text-[12px] text-white/50">
                {plan.meta.blockLengthWeeks}-week block · {plan.evaluation.reviewMoment || "Review"}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                CLUB MODEL
              </div>
              <div className="mt-2 text-[13px] text-white/85">
                {plan.clubModel.dominantGameModel || "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                ROLE IN MODEL
              </div>
              <div className="mt-2 text-[13px] text-white/85">
                {plan.clubModel.roleInModel || "—"}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-[11px] tracking-[0.18em] text-white/55">
                NON-NEGOTIABLE
              </div>
              <div className="mt-2 text-[13px] text-white/85">
                {plan.clubModel.nonNegotiables || "—"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Priority */}
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[11px] tracking-[0.18em] text-black/45">
                PRIORITY
              </div>
              <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-black">
                {plan.priority.title || "—"}
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-black/70">
                {plan.priority.whyNow || "—"}
              </p>
            </div>
            <div className="hidden sm:block w-[1px] bg-black/10" />
            <div className="sm:max-w-[280px]">
              <div className="text-[11px] tracking-[0.18em] text-black/45">
                WHAT MUST CHANGE
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-black/80">
                {plan.priority.observableShift || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Focus */}
        <div className="mt-8 space-y-6">
          {plan.focus.slice(0, 3).map((f) => (
            <FocusBlock key={f.id} f={f} accent={accent} />
          ))}
        </div>

        {/* Not now + evaluation */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <section className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-[11px] tracking-[0.18em] text-black/45">
              NOT NOW
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-black/80">
              {plan.notNow.reasoning || "—"}
            </p>
            {plan.notNow.excludedFocus?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.notNow.excludedFocus.map((x) => (
                  <Tag key={x}>{x}</Tag>
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-[11px] tracking-[0.18em] text-black/45">
              EVALUATION
            </div>

            <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-black/80">
              <div>
                <div className="text-[11px] tracking-[0.14em] text-black/45">
                  SHORT TERM
                </div>
                <div className="mt-1">{plan.evaluation.shortTermMarker || "—"}</div>
              </div>
              <div>
                <div className="text-[11px] tracking-[0.14em] text-black/45">
                  MID TERM
                </div>
                <div className="mt-1">{plan.evaluation.midTermMarker || "—"}</div>
              </div>
              <div>
                <div className="text-[11px] tracking-[0.14em] text-black/45">
                  REVIEW MOMENTS
                </div>
                <div className="mt-1">{plan.evaluation.reviewMoment || "—"}</div>
              </div>
              <div>
                <div className="text-[11px] tracking-[0.14em] text-black/45">
                  DECISION CRITERIA
                </div>
                <div className="mt-1">{plan.evaluation.decisionCriteria || "—"}</div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-10 border-t border-black/10 pt-6 text-[11px] tracking-[0.16em] text-black/40">
          FTBLL.AI · Development Plan · {club}
        </footer>
      </main>

      {/* Print rules */}
      <style>{`
        /* keep exports consistent */
        @page { margin: 14mm; }

        /* toolbar never prints */
        @media print {
          .no-print { display: none !important; }
          html, body { background: #fff !important; }
          a { color: inherit; text-decoration: none; }
        }
          @media print {
  a[href]:after { content: "" !important; }
  a[href]:before { content: "" !important; }
}
      `}</style>
    </div>
  );
}