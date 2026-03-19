"use client";

export default function TextArea({
  label,
  value,
  placeholder,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] tracking-wide text-white/60">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[13px] leading-relaxed text-white placeholder:text-white/30 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/15"
      />
    </label>
  );
}