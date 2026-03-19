// src/app/development/player-development-plan/ui/lib/pdp/theme.ts

export type PdpThemeInput = {
  accentHex?: string;
  primaryHex?: string;
  secondaryHex?: string;
  colorBalance?: number; // 0..100 = aandeel primary
};

function clampHex(v: string) {
  const s = (v || "").trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#111111";
}

function clampPercent(v: unknown, fallback = 75) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function hexToRgb(hex: string) {
  const h = clampHex(hex).slice(1);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  const aa = Math.max(0, Math.min(1, a));
  return `rgba(${r},${g},${b},${aa})`;
}

function mixHex(primary: string, secondary: string, primaryPct: number) {
  const p = Math.max(0, Math.min(1, primaryPct));
  const s = 1 - p;

  const a = hexToRgb(primary);
  const b = hexToRgb(secondary);

  const r = Math.round(a.r * p + b.r * s);
  const g = Math.round(a.g * p + b.g * s);
  const bb = Math.round(a.b * p + b.b * s);

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bb)}`;
}

export function buildTheme(input: PdpThemeInput) {
  const fallbackPrimary = clampHex(input.accentHex || "#111111");
  const primary = clampHex(input.primaryHex || fallbackPrimary);
  const secondary = clampHex(input.secondaryHex || "#FFFFFF");
  const balance = clampPercent(input.colorBalance, 75);
  const primaryRatio01 = balance / 100;

  const accent = primary;
  const accentSecondary = secondary;
  const accentMix = mixHex(primary, secondary, primaryRatio01);
  const accentMixSoft = mixHex(primary, secondary, Math.max(0.15, primaryRatio01 * 0.7));
  const accentMixStrong = mixHex(primary, secondary, Math.min(0.92, primaryRatio01 * 1.12));

  const vars = {
    "--accent": accent,
    "--accent-primary": primary,
    "--accent-secondary": secondary,
    "--accent-mix": accentMix,
    "--accent-mix-soft": accentMixSoft,
    "--accent-mix-strong": accentMixStrong,

    "--accent-soft": rgba(accentMix, 0.14),
    "--accent-faint": rgba(accentMix, 0.08),
    "--accent-primary-soft": rgba(primary, 0.18),
    "--accent-secondary-soft": rgba(secondary, 0.18),

    "--accent-gradient": `linear-gradient(90deg, ${primary} 0%, ${accentMix} 58%, ${secondary} 100%)`,

    "--ink": "#0B0B0B",
    "--ink-muted": "rgba(0,0,0,.68)",
    "--ink-soft": "rgba(0,0,0,.52)",

    "--paper": "#FFFFFF",
    "--surface-1": "#F6F6F6",
    "--surface-2": "#F1F1F1",

    "--border": "rgba(0,0,0,.10)",
    "--hairline": "rgba(0,0,0,.08)",

    "--r-1": "10px",
    "--r-2": "14px",
    "--r-3": "18px",

    "--s-1": "6px",
    "--s-2": "10px",
    "--s-3": "14px",
    "--s-4": "18px",
    "--s-5": "24px",
    "--s-6": "32px",
    "--s-7": "40px",
  } as const;

  const cssVarBlock = `:root{${Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;

  return {
    accent,
    primary,
    secondary,
    balance,
    accentMix,
    vars,
    cssVarBlock,
  };
}