export default function SectionTitle({
  title,
  note,
}: {
  title: string;
  note?: string;
}) {
  return (
    <div>
      <div className="text-[13px] font-medium tracking-wide text-white/90">
        {title}
      </div>
      {note ? <div className="mt-1 text-[12px] text-white/45">{note}</div> : null}
    </div>
  );
}