export type PdpThemeInput = {
  accentHex?: string; // plan.brand.primaryColor
};

function clampHex(v: string) {
  const s = (v || "").trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s}`;
  return "#111111";
}

function hexToRgb(hex: string) {
  const h = clampHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
}

function rgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  const aa = Math.max(0, Math.min(1, a));
  return `rgba(${r},${g},${b},${aa})`;
}

export function buildTheme(input: PdpThemeInput) {
  const accent = clampHex(input.accentHex || "#111111");

  const vars = {
    "--accent": accent,
    "--accent-soft": rgba(accent, 0.14),
    "--accent-faint": rgba(accent, 0.08),

    "--ink": "#0B0B0B",
    "--ink-muted": "rgba(0,0,0,.70)",
    "--ink-soft": "rgba(0,0,0,.54)",

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

  return { accent, vars, cssVarBlock };
}