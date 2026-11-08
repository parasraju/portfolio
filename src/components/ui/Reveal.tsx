"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLoading } from "./LoadingProvider";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  id?: string;
};

export function Reveal({ children, className = "", delay = 0, stagger = false, id }: RevealProps) {
  const { loaded } = useLoading();
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visible = loaded && inView;
  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={`${stagger ? "reveal-stagger" : "reveal"} ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
