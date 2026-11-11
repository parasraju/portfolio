"use client";
import { useEffect } from "react";

export function EntranceTrigger() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => document.documentElement.classList.add("is-loaded"));
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
