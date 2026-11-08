"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type LoadingContextValue = {
  loaded: boolean;
  finish: () => void;
};

const LoadingContext = createContext<LoadingContextValue>({ loaded: true, finish: () => undefined });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const finish = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    if (loaded) document.documentElement.classList.add("is-loaded");
  }, [loaded]);

  const value = useMemo(() => ({ loaded, finish }), [loaded, finish]);
  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export const useLoading = () => useContext(LoadingContext);
