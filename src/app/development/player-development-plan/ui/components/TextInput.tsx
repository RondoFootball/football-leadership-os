"use client";

export default function TextInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[12px] tracking-wide text-white/60">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/15"
      />
    </label>
  );
}