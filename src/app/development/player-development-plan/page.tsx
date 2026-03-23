import Link from "next/link";
import PlayerDevelopmentPlanBuilder from "./ui/PlayerDevelopmentPlanBuilder";

export const metadata = {
  title: "Player Development Plan — ftbll.ai",
  description:
    "A closed, decision-grade player development plan builder for professional football leadership.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0B0D10] text-white">
      <div className="border-b border-white/6 bg-black/20 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/development"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/72 transition hover:border-white/20 hover:text-white"
            >
              <span aria-hidden="true">←</span>
              <span>Terug naar Development</span>
            </Link>

            <div className="hidden h-5 w-px bg-white/10 sm:block" />

            <Link
              href="/"
              className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/40 transition hover:text-white/70"
            >
              FTBLL.AI
            </Link>
          </div>

          <div className="hidden text-right sm:block">
            <div className="text-[11px] uppercase tracking-[0.16em] text-white/32">
              Development
            </div>
            <div className="mt-1 text-[13px] text-white/68">
              Player Development Plan Builder
            </div>
          </div>
        </div>
      </div>

      <section className="border-b border-white/6">
        <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-8">
          <div className="max-w-[760px]">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/38">
              Development Tool
            </div>

            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-white sm:text-[36px]">
              Player Development Plan Builder
            </h1>

            <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/52 sm:text-[15px]">
              Bouw vanuit observatie, wedstrijdcontext en verantwoordelijkheid
              naar een concreet ontwikkelplan voor speler en staf.
            </p>
          </div>
        </div>
      </section>

      <PlayerDevelopmentPlanBuilder />

      <footer className="border-t border-white/6">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-5 text-[12px] text-white/34 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>FTBLL.ai — Development tools for football environments</div>

          <div className="flex items-center gap-4">
            <Link href="/development" className="transition hover:text-white/60">
              Development
            </Link>
            <Link href="/" className="transition hover:text-white/60">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}