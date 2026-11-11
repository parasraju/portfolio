"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toggleTheme, useTheme } from "@/lib/theme";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work/", label: "Work" },
  { href: "/blogs/", label: "Blogs" },
] as const;

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function Navbar() {
  const pathname = normalize(usePathname() ?? "/");
  const theme = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-nav fixed inset-x-0 top-0 z-[70] transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "border-b border-dashed border-zinc-200/80 bg-white/55 backdrop-blur-md dark:border-zinc-800/80 dark:bg-black/45"
          : "border-b border-transparent bg-transparent [text-shadow:0_0_10px_rgba(255,255,255,0.95),0_0_2px_rgba(255,255,255,0.9)] dark:[text-shadow:0_0_10px_rgba(0,0,0,0.9),0_0_2px_rgba(0,0,0,0.9)]"
      }`}
    >
      <nav aria-label="Primary" className="flex h-11 items-center justify-between px-4 md:mx-[30%] md:px-6">
        <Link href="/" className="font-serif text-[18px] leading-none tracking-[0.01em] text-zinc-900 transition-opacity hover:opacity-70 dark:text-zinc-100">
          Paras<span className="text-zinc-400 dark:text-zinc-600">.</span>
        </Link>

        <div className="flex items-center gap-0.5">
          {LINKS.map((link) => {
            const target = normalize(link.href);
            const active = target === "/" ? pathname === "/" : pathname.startsWith(target);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-2.5 py-1 font-mono text-[11px] tracking-[0.04em] transition-colors duration-300 ${
                  active ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-current transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
                />
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-1.5 h-3.5 w-px bg-zinc-200 dark:bg-zinc-800" />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5">
              {theme === "dark" ? (
                <>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </>
              ) : (
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              )}
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
