"use client";
import { useSyncExternalStore } from "react";

const BUILD_YEAR = new Date().getFullYear();
const noop = () => () => {};

export function CurrentYear() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <span suppressHydrationWarning>{year}</span>;
}
