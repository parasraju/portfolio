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

        <div className="flex items-center gap-1.5">
          {LINKS.map((link) => {
            const target = normalize(link.href);
            const active = target === "/" ? pathname === "/" : pathname.startsWith(target);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`ios-btn px-3 sm:px-3.5 ${active ? "" : "ios-btn-muted"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <button
            type="button"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
            }}
            data-theme-toggle=""
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="ios-btn ios-btn-icon"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
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
