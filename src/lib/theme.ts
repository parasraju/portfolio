"use client";
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";
export type Origin = { x: number; y: number };

const STORAGE_KEY = "theme";
const DURATION = 850;
const EASING = "cubic-bezier(0.65, 0.05, 0.25, 1)";
const FEATHER_STOP = 0.86;

const listeners = new Set<() => void>();
let activeTransition: ViewTransition | null = null;
let fadeTimer = 0;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && (event.newValue === "dark" || event.newValue === "light")) {
      document.documentElement.classList.toggle("dark", event.newValue === "dark");
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {}
  flushSync(emit);
}

function toggleOrigin(): Origin {
  const button = document.querySelector<HTMLElement>("[data-theme-toggle]");
  if (button) {
    const rect = button.getBoundingClientRect();
    if (rect.width > 0) return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
  return { x: window.innerWidth / 2, y: 0 };
}

function fadeTo(next: Theme) {
  const root = document.documentElement;
  window.clearTimeout(fadeTimer);
  root.classList.add("theme-fade");
  applyTheme(next);
  fadeTimer = window.setTimeout(() => root.classList.remove("theme-fade"), 550);
}

function revealTo(next: Theme, { x, y }: Origin) {
  const root = document.documentElement;
  const edge = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const radius = Math.ceil(edge / FEATHER_STOP);
  const size = radius * 2;

  root.classList.add("theme-vt", "theme-switching");
  const transition = document.startViewTransition(() => applyTheme(next));
  activeTransition = transition;

  transition.ready
    .then(() => {
      const options = { duration: DURATION, easing: EASING, fill: "both" as const };
      root.animate(
        {
          maskSize: ["0px 0px", `${size}px ${size}px`],
          maskPosition: [`${x}px ${y}px`, `${x - radius}px ${y - radius}px`],
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          filter: ["blur(10px)", "blur(0px)"],
        },
        { ...options, pseudoElement: "::view-transition-new(root)" },
      );
      root.animate({ filter: ["blur(0px)", "blur(3px)"] }, { ...options, pseudoElement: "::view-transition-old(root)" });
    })
    .catch(() => {});

  transition.finished.finally(() => {
    if (activeTransition !== transition) return;
    activeTransition = null;
    root.classList.remove("theme-vt", "theme-switching");
  });
}

export function toggleTheme(origin?: Origin) {
  const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    applyTheme(next);
    return;
  }
  if (typeof document.startViewTransition !== "function") {
    fadeTo(next);
    return;
  }
  revealTo(next, origin ?? toggleOrigin());
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
