"use client";
import { useEffect } from "react";
import { whenIntroDone } from "@/lib/intro";

export function EntranceTrigger() {
  useEffect(() => {
    let frame = 0;
    const cancel = whenIntroDone(() => {
      frame = requestAnimationFrame(() => document.documentElement.classList.add("is-loaded"));
    });
    return () => {
      cancel();
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
