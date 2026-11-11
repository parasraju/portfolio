"use client";
import { useEffect, useRef } from "react";

const LOOP_MS = [5200, 6800];
const MAX_RATE = 8;
const SCROLL_GAIN = 3;
const SMOOTHING = 0.18;

export function GridBeams() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const beams = [...el.querySelectorAll<HTMLElement>(".beam-v")];
    const own = beams.map((beam, i) => {
      const down = [{ transform: "translate3d(0, -100%, 0)" }, { transform: "translate3d(0, 100vh, 0)" }];
      return beam.animate(i % 2 ? [...down].reverse() : down, {
        duration: LOOP_MS[i % LOOP_MS.length],
        iterations: Infinity,
        delay: -i * 2300,
      });
    });
    const horizontal = document
      .getAnimations()
      .filter((animation): animation is CSSAnimation => "animationName" in animation && (animation as CSSAnimation).animationName === "beam-x");
    const animations: Animation[] = [...own, ...horizontal];

    let raf = 0;
    let rate = 1;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const apply = (value: number) => {
      rate = value;
      for (const animation of animations) animation.playbackRate = value;
    };

    const tick = (now: number) => {
      const y = window.scrollY;
      const velocity = (y - lastY) / Math.max(now - lastT, 1);
      lastY = y;
      lastT = now;
      const target = Math.max(-MAX_RATE, Math.min(MAX_RATE, 1 + velocity * SCROLL_GAIN));
      const next = rate + (target - rate) * SMOOTHING;
      if (velocity === 0 && Math.abs(next - 1) < 0.02) {
        apply(1);
        raf = 0;
        return;
      }
      apply(next);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (raf) return;
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      for (const animation of own) {
        if (document.hidden) animation.pause();
        else animation.play();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const animation of horizontal) animation.playbackRate = 1;
      for (const animation of own) animation.cancel();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="grid-beams hidden md:block">
      <span className="beam-v left-[30%]" />
      <span className="beam-v right-[30%]" />
    </div>
  );
}
