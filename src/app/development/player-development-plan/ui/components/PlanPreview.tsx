"use client";

import type { Lang, PlayerDevPlan } from "../lib/plan";
import { i18n } from "../lib/plan";

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-medium tracking-wide text-black/60">
        {title}
      </div>
      <div className="mt-2 text-[13px] leading-relaxed text-black">{children}</div>
    </div>
  );
}

function Value({ v, fallback }: { v?: string; fallback: string }) {
  const val = (v ?? "").trim();
  return val.length ? (
    <span className="whitespace-pre-wrap">{val}</span>
  ) : (
    <span className="text-black/35">{fallback}</span>
  );
}

export default function PlanPreview({ lang, plan }: { lang: Lang; plan: PlayerDevPlan }) {
  const t = i18n[lang];

  return (
    <div className="print-card overflow-hidden rounded-2xl bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      {/* Preview header */}
      <div className="border-b border-black/10 px-4 py-4">
        <div className="text-[12px] tracking-wide text-black/60">
          {t.productTitle}
        </div>
        <div className="mt-1 text-[18px] font-medium leading-tight">
          <Value v={plan.player.name} fallback={lang === "en" ? "Player name" : "Spelernaam"} />
        </div>
        <div className="mt-1 text-[12px] text-black/55">
          <span className="mr-2">
            <Value v={plan.player.team} fallback={lang === "en" ? "Team" : "Team"} />
          </span>
          <span className="text-black/30">·</span>
          <span className="ml-2">
            <Value v={plan.player.role} fallback={lang === "en" ? "Role" : "Rol"} />
          </span>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-3 p-4">
        <Block title={t.osHeaderTitle}>
          <div className="grid grid-cols-1 gap-2 text-[13px]">
            <div>
              <span className="text-black/50">{t.context}: </span>
              <Value v={plan.os.context} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <span className="text-black/50">{t.decisionType}: </span>
              <Value v={plan.os.decisionType} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <span className="text-black/50">{t.timeHorizon}: </span>
              <Value v={plan.os.timeHorizon} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <span className="text-black/50">{t.owner}: </span>
              <Value v={plan.os.owner} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <span className="text-black/50">{t.mandate}: </span>
              <Value v={plan.os.mandate} fallback={lang === "en" ? "—" : "—"} />
            </div>
          </div>
        </Block>

        <Block title={t.playerContextTitle}>
          <div className="space-y-2">
            <div>
              <span className="text-black/50">{t.phase}: </span>
              <Value v={plan.player.phase} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <div className="text-black/50">{t.contextDrivers}</div>
              <Value
                v={plan.player.contextDrivers}
                fallback={lang === "en" ? "No context yet." : "Nog geen context."}
              />
            </div>
            <div>
              <div className="text-black/50">{t.constraintsOpportunities}</div>
              <Value
                v={plan.player.constraintsOpportunities}
                fallback={lang === "en" ? "—" : "—"}
              />
            </div>
          </div>
        </Block>

        <Block title={t.overallGoalTitle}>
          <div className="space-y-2">
            <div>
              <div className="text-black/50">{t.oneGoal}</div>
              <Value
                v={plan.overallGoal}
                fallback={
                  lang === "en"
                    ? "Write one dominant direction."
                    : "Formuleer één dominante richting."
                }
              />
            </div>
            <div>
              <div className="text-black/50">{t.notNowTitle}</div>
              <Value
                v={plan.notNow}
                fallback={
                  lang === "en"
                    ? "What is consciously excluded (for now)."
                    : "Wat is bewust uitgesloten (voor nu)."
                }
              />
            </div>
          </div>
        </Block>

        <Block title={t.focusTitle}>
          <div className="space-y-3">
            {plan.focus.slice(0, 3).map((f, i) => (
              <div key={i} className="rounded-lg border border-black/10 p-3">
                <div className="text-[12px] font-medium text-black/70">
                  {t.focusItem} {i + 1}:{" "}
                  <span className="text-black">
                    <Value v={f.title} fallback={lang === "en" ? "Untitled" : "Zonder titel"} />
                  </span>
                </div>
                <div className="mt-2 space-y-2 text-[13px]">
                  <div>
                    <div className="text-black/50">{t.whyNow}</div>
                    <Value v={f.whyNow} fallback={lang === "en" ? "—" : "—"} />
                  </div>
                  <div>
                    <div className="text-black/50">{t.goodLooksLike}</div>
                    <Value v={f.goodLooksLike} fallback={lang === "en" ? "—" : "—"} />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <div className="text-black/50">{t.playerActions}</div>
                      <Value v={f.playerActions} fallback={lang === "en" ? "—" : "—"} />
                    </div>
                    <div>
                      <div className="text-black/50">{t.staffActions}</div>
                      <Value v={f.staffActions} fallback={lang === "en" ? "—" : "—"} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {plan.focus.length === 0 && (
              <div className="text-black/45">{t.noFocusYet}</div>
            )}
          </div>
        </Block>

        <Block title={t.rhythmTitle}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <div className="text-black/50">{t.shortTerm}</div>
              <Value v={plan.rhythm.shortTerm} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <div className="text-black/50">{t.midTerm}</div>
              <Value v={plan.rhythm.midTerm} fallback={lang === "en" ? "—" : "—"} />
            </div>
            <div>
              <div className="text-black/50">{t.longTerm}</div>
              <Value v={plan.rhythm.longTerm} fallback={lang === "en" ? "—" : "—"} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-black/50">{t.testMoments}</div>
            <Value
              v={plan.testMoments}
              fallback={
                lang === "en"
                  ? "Define explicit test moments."
                  : "Definieer expliciete toetsmomenten."
              }
            />
          </div>
        </Block>

        <div className="pt-2 text-[11px] text-black/40" data-no-print="true">
          {t.footerNote}
        </div>
      </div>
    </div>
  );
}