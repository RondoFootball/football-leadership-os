"use client";

import React from "react";
import type { Lang, PlayerDevPlan } from "../lib/plan";
import { i18n } from "../lib/plan";

type SupportedLang = "nl" | "en" | "de" | "es" | "it" | "fr";

function isSupportedLang(value: unknown): value is SupportedLang {
  return (
    value === "nl" ||
    value === "en" ||
    value === "de" ||
    value === "es" ||
    value === "it" ||
    value === "fr"
  );
}

function tx(
  lang: SupportedLang,
  labels: Record<SupportedLang, string>
): string {
  return labels[lang];
}

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
      <div className="mt-2 text-[13px] leading-relaxed text-black">
        {children}
      </div>
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

export default function PlanPreview({
  lang,
  plan,
}: {
  lang: Lang;
  plan: PlayerDevPlan;
}) {
  const safeLang: SupportedLang = isSupportedLang(lang) ? lang : "nl";
  const t = i18n[safeLang];

  return (
    <div className="print-card overflow-hidden rounded-2xl bg-white text-black shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <div className="border-b border-black/10 px-4 py-4">
        <div className="text-[12px] tracking-wide text-black/60">
          {t.productTitle}
        </div>

        <div className="mt-1 text-[18px] font-medium leading-tight">
          <Value
            v={plan.player.name}
            fallback={tx(safeLang, {
              nl: "Spelernaam",
              en: "Player name",
              de: "Spielername",
              es: 'Nombre del jugador',
              it: "Nome del giocatore",
              fr: "Nom du joueur",
            })}
          />
        </div>

        <div className="mt-1 text-[12px] text-black/55">
          <span className="mr-2">
            <Value
              v={plan.player.team}
              fallback={tx(safeLang, {
                nl: "Team",
                en: "Team",
                de: "Team",
                es: "Equipo",
                it: "Squadra",
                fr: "Équipe",
              })}
            />
          </span>

          <span className="text-black/30">·</span>

          <span className="ml-2">
            <Value
              v={plan.player.role}
              fallback={tx(safeLang, {
                nl: "Rol",
                en: "Role",
                de: "Rolle",
                es: "Rol",
                it: "Ruolo",
                fr: "Rôle",
              })}
            />
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <Block title={t.osHeaderTitle}>
          <div className="grid grid-cols-1 gap-2 text-[13px]">
            <div>
              <span className="text-black/50">{t.context}: </span>
              <Value v={plan.os.context} fallback="—" />
            </div>

            <div>
              <span className="text-black/50">{t.decisionType}: </span>
              <Value v={plan.os.decisionType} fallback="—" />
            </div>

            <div>
              <span className="text-black/50">{t.timeHorizon}: </span>
              <Value v={plan.os.timeHorizon} fallback="—" />
            </div>

            <div>
              <span className="text-black/50">{t.owner}: </span>
              <Value v={plan.os.owner} fallback="—" />
            </div>

            <div>
              <span className="text-black/50">{t.mandate}: </span>
              <Value v={plan.os.mandate} fallback="—" />
            </div>
          </div>
        </Block>

        <Block title={t.playerContextTitle}>
          <div className="space-y-2">
            <div>
              <span className="text-black/50">{t.phase}: </span>
              <Value v={plan.player.phase} fallback="—" />
            </div>

            <div>
              <div className="text-black/50">{t.contextDrivers}</div>
              <Value
                v={plan.player.contextDrivers}
                fallback={tx(safeLang, {
                  nl: "Nog geen context.",
                  en: "No context yet.",
                  de: "Noch kein Kontext.",
                  es: "Aún no hay contexto.",
                  it: "Nessun contesto ancora.",
                  fr: "Pas encore de contexte.",
                })}
              />
            </div>

            <div>
              <div className="text-black/50">{t.constraintsOpportunities}</div>
              <Value
                v={plan.player.constraintsOpportunities}
                fallback="—"
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
                fallback={tx(safeLang, {
                  nl: "Formuleer één dominante richting.",
                  en: "Write one dominant direction.",
                  de: "Formuliere eine dominante Richtung.",
                  es: "Formula una dirección dominante.",
                  it: "Formula una direzione dominante.",
                  fr: "Formule une direction dominante.",
                })}
              />
            </div>

            <div>
              <div className="text-black/50">{t.notNowTitle}</div>
              <Value
                v={plan.notNow}
                fallback={tx(safeLang, {
                  nl: "Wat is bewust uitgesloten (voor nu).",
                  en: "What is consciously excluded (for now).",
                  de: "Was bewusst ausgeschlossen ist (vorerst).",
                  es: "Qué queda conscientemente excluido (por ahora).",
                  it: "Cosa viene escluso consapevolmente (per ora).",
                  fr: "Ce qui est volontairement exclu (pour l’instant).",
                })}
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
                    <Value
                      v={f.title}
                      fallback={tx(safeLang, {
                        nl: "Zonder titel",
                        en: "Untitled",
                        de: "Ohne Titel",
                        es: "Sin título",
                        it: "Senza titolo",
                        fr: "Sans titre",
                      })}
                    />
                  </span>
                </div>

                <div className="mt-2 space-y-2 text-[13px]">
                  <div>
                    <div className="text-black/50">{t.whyNow}</div>
                    <Value v={f.whyNow} fallback="—" />
                  </div>

                  <div>
                    <div className="text-black/50">{t.goodLooksLike}</div>
                    <Value v={f.goodLooksLike} fallback="—" />
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <div className="text-black/50">{t.playerActions}</div>
                      <Value v={f.playerActions} fallback="—" />
                    </div>

                    <div>
                      <div className="text-black/50">{t.staffActions}</div>
                      <Value v={f.staffActions} fallback="—" />
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
              <Value v={plan.rhythm.shortTerm} fallback="—" />
            </div>

            <div>
              <div className="text-black/50">{t.midTerm}</div>
              <Value v={plan.rhythm.midTerm} fallback="—" />
            </div>

            <div>
              <div className="text-black/50">{t.longTerm}</div>
              <Value v={plan.rhythm.longTerm} fallback="—" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-black/50">{t.testMoments}</div>
            <Value
              v={plan.testMoments}
              fallback={tx(safeLang, {
                nl: "Definieer expliciete toetsmomenten.",
                en: "Define explicit test moments.",
                de: "Definiere klare Prüfzeitpunkte.",
                es: "Define momentos de evaluación explícitos.",
                it: "Definisci momenti di verifica espliciti.",
                fr: "Définis des moments d’évaluation explicites.",
              })}
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