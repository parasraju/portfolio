"use client";
import { useEffect, useState } from "react";
import { useLoading } from "./LoadingProvider";
import { PRELOADER_SEEN_KEY } from "@/lib/preloader";

const DASH_V = {
  maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)",
};
const DASH_H = {
  maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const NAME = "PARAS RAJU";
const STAGES = ["Booting up", "Fetching assets", "Compiling ideas", "Polishing pixels", "Ready"];

type Phase = "loading" | "exiting" | "done";

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Preloader() {
  const { finish } = useLoading();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_SEEN_KEY) === "1";
    } catch {}
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 400 : 3600;
    const holdMs = reduceMotion ? 0 : 650;
    const exitMs = reduceMotion ? 300 : 1600;

    let raf = 0;
    let hold: number | undefined;
    let exit: number | undefined;
    const start = performance.now();

    const tick = (now: number) => {
      if (seen) {
        setPhase("done");
        finish();
        return;
      }
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(easeInOut(t) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      try {
        sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
      } catch {}
      hold = window.setTimeout(() => {
        setPhase("exiting");
        finish();
        exit = window.setTimeout(() => setPhase("done"), exitMs);
      }, holdMs);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hold);
      window.clearTimeout(exit);
    };
  }, [finish]);

  if (phase === "done") return null;

  const stage = progress >= 100 ? STAGES.length - 1 : Math.min(Math.floor(progress / 25), STAGES.length - 2);
  const counter = String(progress).padStart(3, "0");

  return (
    <div
      id="preloader"
      aria-hidden="true"
      className={`fixed inset-0 z-[100] overflow-hidden bg-white text-zinc-900 dark:bg-black dark:text-zinc-100 ${phase === "exiting" ? "preloader-exit" : ""}`}
    >
      <div className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/25 dark:border-white/[0.14] hidden md:block" style={DASH_V} />
      <div className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/25 dark:border-white/[0.14] hidden md:block" style={DASH_V} />
      <div className="absolute inset-x-0 top-[22vh] h-0 border-b border-black/25 dark:border-white/[0.14]" style={DASH_H} />
      <div className="absolute inset-x-0 bottom-[22vh] h-0 border-b border-black/25 dark:border-white/[0.14]" style={DASH_H} />

      <div className="absolute inset-x-0 bottom-[22vh] h-px origin-left bg-zinc-900 dark:bg-zinc-100" style={{ transform: `scaleX(${progress / 100})` }} />

      <div className="absolute top-6 left-5 sm:left-8 md:left-[calc(30%+24px)] font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-500">
        Portfolio — {new Date().getFullYear()}
      </div>
      <div className="absolute top-6 right-5 sm:right-8 md:right-[calc(30%+24px)] flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-400 dark:text-zinc-500">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-900 dark:bg-zinc-100" />
        Loading
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <div className="flex overflow-hidden font-serif text-[20px] tracking-[0.3em] text-zinc-600 dark:text-zinc-300 sm:text-[26px]">
          {NAME.split("").map((ch, i) => (
            <span key={i} className="preloader-letter" style={{ "--i": i } as React.CSSProperties}>
              {ch === " " ? "\u00a0" : ch}
            </span>
          ))}
        </div>
        <div className="select-none font-mono text-[88px] leading-none tracking-[0.02em] tabular-nums sm:text-[140px] md:text-[168px]">
          {counter}
        </div>
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 sm:w-56">
          <div className="h-full origin-left rounded-full bg-zinc-900 dark:bg-zinc-100" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>

      <div className="absolute bottom-[calc(22vh-28px)] left-5 sm:left-8 md:left-[calc(30%+24px)] overflow-hidden font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
        <span key={stage} className="preloader-stage inline-block">
          {STAGES[stage]}
          {stage < STAGES.length - 1 && <span className="animate-pulse">…</span>}
        </span>
      </div>
      <div
        className="absolute bottom-[calc(22vh-28px)] right-5 sm:right-8 md:right-[calc(30%+24px)] font-mono text-[11px] tracking-[0.18em] text-zinc-500 dark:text-zinc-400"
      >
        {counter}%
      </div>
    </div>
  );
}
