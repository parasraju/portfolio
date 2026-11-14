"use client";
import { useCallback, useEffect, useState, type ComponentType } from "react";
import { isIntroPending } from "@/lib/intro";

type IntroComponent = ComponentType<{ onDone: () => void }>;

export function IntroGate() {
  const [Intro, setIntro] = useState<IntroComponent | null>(null);

  useEffect(() => {
    if (!isIntroPending()) return;
    let alive = true;
    import("./TerminalIntro").then((mod) => {
      if (alive) setIntro(() => mod.TerminalIntro);
    });
    return () => {
      alive = false;
    };
  }, []);

  const done = useCallback(() => setIntro(null), []);

  return Intro ? <Intro onDone={done} /> : null;
}
