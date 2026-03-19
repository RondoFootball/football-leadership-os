"use client";

type Logo = { src: string; alt: string; scale?: number };

export function LogoMarquee({
  logos,
  height = 26,
  gapPx = 110,
  durationSeconds = 90,
  windowInsetPercent = 44,
}: {
  logos: Logo[];
  height?: number;
  gapPx?: number;
  durationSeconds?: number;
  windowInsetPercent?: number;
}) {
  if (!logos?.length) return null;

  const items = [...logos, ...logos];
  const clip = `inset(0 ${windowInsetPercent}% 0 ${windowInsetPercent}% round 12px)`;

  const baseImgClass =
    "opacity-70 grayscale brightness-125 contrast-110 transition-all duration-300 ease-out hover:opacity-100 hover:grayscale-0 hover:brightness-110 hover:contrast-110 hover:scale-[1.40] hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.45)]";

  return (
    <div className="relative w-full h-[52px] overflow-hidden">
      {/* EDGE FADES */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      {/* CENTER SPOTLIGHT */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-48 -translate-x-1/2 z-10 bg-[radial-gradient(closest-side,rgba(255,255,255,0.10),transparent)]" />

      {/* BASE TRACK */}
      <div
        className="absolute left-0 top-0 flex h-full items-center ftbll-track"
        style={
          {
            gap: `${gapPx}px`,
            ["--duration" as any]: `${durationSeconds}s`,
          } as React.CSSProperties
        }
      >
        {items.map((logo, i) => (
          <div key={`bw-${logo.src}-${i}`} className="flex-shrink-0">
            <img
              src={logo.src}
              alt={logo.alt}
              height={height}
              draggable={false}
              style={{
                height,
                width: "auto",
                display: "block",
                transform: `scale(${logo.scale ?? 1})`,
                transformOrigin: "center",
              }}
              className={baseImgClass}
            />
          </div>
        ))}
      </div>

      {/* COLOR WINDOW */}
      <div className="pointer-events-none absolute inset-0 z-30" style={{ clipPath: clip }}>
        <div
          className="absolute left-0 top-0 flex h-full items-center ftbll-track"
          style={
            {
              gap: `${gapPx}px`,
              ["--duration" as any]: `${durationSeconds}s`,
            } as React.CSSProperties
          }
        >
          {items.map((logo, i) => (
            <div key={`color-${logo.src}-${i}`} className="flex-shrink-0">
              <img
                src={logo.src}
                alt={logo.alt}
                height={height}
                draggable={false}
                style={{
                  height,
                  width: "auto",
                  display: "block",
                  transform: `scale(${logo.scale ?? 1})`,
                  transformOrigin: "center",
                }}
                className="opacity-100"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .ftbll-track {
          width: max-content;
          will-change: transform;
          animation: scroll var(--duration) linear infinite;
          /* critical: prevent subpixel overflow from expanding layout */
          transform: translateZ(0);
        }

        @keyframes scroll {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-50%,0,0); }
        }
      `}</style>
    </div>
  );
}