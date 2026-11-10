/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { sections } from "@/lib/sections";
import { SocialsSection } from "@/components/socials/SocialButton";
import { ExperienceAccordion } from "@/components/experiences/ExperienceAccordion";
import { GitHubActivity } from "@/components/github/GitHubActivity";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { BlogSection } from "@/components/blog/BlogSection";
import { SearchPalette } from "@/components/search/SearchPalette";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const SKILLS: [string, string][] = [
  ["React","https://cdn.simpleicons.org/react/71717a"],
  ["Node.js","https://cdn.simpleicons.org/nodedotjs/71717a"],
  ["Redis","https://cdn.simpleicons.org/redis/71717a"],
  ["TanStack Query","https://cdn.simpleicons.org/reactquery/71717a"],
  ["Tailwind CSS","https://cdn.simpleicons.org/tailwindcss/71717a"],
  ["shadcn/ui","https://cdn.simpleicons.org/shadcnui/71717a"],
  ["Motion","https://cdn.simpleicons.org/framer/71717a"],
  ["JavaScript","https://cdn.simpleicons.org/javascript/71717a"],
  ["TypeScript","https://cdn.simpleicons.org/typescript/71717a"],
  ["Python","https://cdn.simpleicons.org/python/71717a"],
  ["C / C++","https://cdn.simpleicons.org/cplusplus/71717a"],
  ["SQL","https://cdn.simpleicons.org/mysql/71717a"],
  ["Git","https://cdn.simpleicons.org/git/71717a"],
  ["GitHub","https://cdn.simpleicons.org/github/71717a"],
  ["Figma","https://cdn.simpleicons.org/figma/71717a"],
  ["Docker","https://cdn.simpleicons.org/docker/71717a"],
  ["Linux","https://cdn.simpleicons.org/linux/71717a"],
];

const SKILL_ROWS = [SKILLS.slice(0, 9), SKILLS.slice(9)];

function Icon({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const CalendarIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Icon>
);

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </Icon>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
);

const SunIcon = ({ className }: { className?: string }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </Icon>
);

export default function Home() {
  const [active, setActive] = useState("");
  const [time, setTime] = useState("00.00.00");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme((value) => (value === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- hydrate theme from localStorage / system preference once on mount */
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      setTime(`${h}.${m}.${s}`);
    };
    const t = setInterval(tick, 1000);
    const first = requestAnimationFrame(tick);
    return () => {
      clearInterval(t);
      cancelAnimationFrame(first);
    };
  }, []);

  // keyboard for cmdk
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === "Escape") setCmdOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div id="top" className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden">
      {/* Grid lines */}
      <div className="grid-line-v absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)", WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)" }} />
      <div className="grid-line-v absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)", WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)" }} />
      <div className="grid-line-h absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)", WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)" }} />
      <div className="grid-line-h absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)", WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)" }} />
      <div className="grid-dot absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block" style={{ top: "22vh", left: "30%", transform: "translate(-50%, -50%)" }} />
      <div className="grid-dot absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block" style={{ top: "22vh", right: "30%", transform: "translate(50%, -50%)" }} />
      <div className="grid-dot absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block" style={{ top: "calc(22vh + 112px)", left: "30%", transform: "translate(-50%, -50%)" }} />
      <div className="grid-dot absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block" style={{ top: "calc(22vh + 112px)", right: "30%", transform: "translate(50%, -50%)" }} />
      <div className="beam-h absolute left-0 right-0 top-[22vh] h-px pointer-events-none" />
      <div className="beam-h beam-h-alt absolute left-0 right-0 top-[calc(22vh+112px)] h-px pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none hidden md:block">
        <div className="beam-v absolute top-0 bottom-0 left-[30%] w-px" />
        <div className="beam-v beam-v-alt absolute top-0 bottom-0 right-[30%] w-px" />
      </div>
      <ScrollProgress />

      {/* Index nav */}
      <div className="fixed inset-0 z-50 pointer-events-none hidden lg:block" style={{ width: "calc(100vw - var(--removed-body-scroll-bar-size, 0px))" }}>
        <nav className="index-nav absolute top-[22vh] left-[calc(69%+32px)] pointer-events-auto flex flex-col gap-4 mt-2">
          <h3 className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase mb-1">Index</h3>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setActive(s.id)} className={`font-mono text-[11.5px] tracking-[0.02em] transition-all duration-300 ease-out flex items-center gap-3 ${active === s.id ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400"}`}>
              <span className={`h-[1px] transition-all duration-300 ease-out ${active === s.id ? "w-4 bg-zinc-900 dark:bg-zinc-100" : "w-0 bg-transparent"}`} />
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Header banner background — bg-white / bg-black */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] -z-0 overflow-hidden bg-white dark:bg-black shadow-[0_4px_12px_rgba(2,6,23,0.04)]">
        <div className="banner-drift absolute inset-0">
        <img src={withBasePath("/assets/bg-white.webp")} alt="" width={1600} height={533} fetchPriority="high" className="banner-img absolute inset-0 w-full h-full object-cover object-center dark:hidden" />
        <img src={withBasePath("/assets/bg-black.webp")} alt="" width={1600} height={533} className="banner-img absolute inset-0 w-full h-full object-cover object-center hidden dark:block" />
        </div>
        <div className="absolute inset-0 pointer-events-none z-[5] bg-gradient-to-t from-white/80 to-transparent dark:from-black/40" />
        <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-r from-white/60 to-transparent dark:from-black/30" />
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-l from-white/60 to-transparent dark:from-black/30" />
        <div className="absolute bottom-3 right-2 z-10">
          <div suppressHydrationWarning className="font-mono text-[18px] sm:text-[21px] font-medium tracking-[0.08em] text-zinc-500 dark:text-zinc-400">{time}</div>
        </div>
      </div>

      {/* Top identity bar */}
      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-40 bg-white/0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <Reveal className="shrink-0">
              <div className="group relative p-[3px] rounded-[6px] sm:rounded-[8px] border-[1.5px] border-black/30 dark:border-white/[0.15] bg-white dark:bg-black transition-colors duration-500 hover:border-black/60 dark:hover:border-white/40">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[3px] sm:rounded-[5px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img src={withBasePath("/assets/avatar.webp")} alt="Profile" width={256} height={233} className="h-full w-full origin-center translate-y-1 scale-[1.1] object-cover opacity-90 grayscale contrast-100 mix-blend-multiply dark:mix-blend-normal transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.16]" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={90} className="flex flex-col justify-center">
              <h1 className="font-serif text-[27px] sm:text-[35px] font-normal leading-[1.02] tracking-[-0.015em] text-zinc-900 dark:text-zinc-50 mb-1"><span className="name-glitch">Paras Raju</span></h1>
              <p className="text-[13px] sm:text-[14px] text-zinc-500 dark:text-zinc-400">20</p>
            </Reveal>
          </div>
          <Reveal delay={180} className="flex items-start justify-end gap-2 sm:gap-3 h-16 sm:h-24 py-1">
            <button onClick={() => setCmdOpen(true)} className="relative group cursor-pointer transition-all duration-300 active:scale-95" aria-label="Search" aria-haspopup="dialog">
              <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors group-hover:border-black/10 dark:group-hover:border-white/10" />
              <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] text-[11px] font-medium transition-colors border border-black/5 dark:border-white/5 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-3 h-3">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden sm:inline rounded border border-black/10 dark:border-white/10 px-1 py-0.5 text-[9.5px] leading-none">⌘K</kbd>
              </div>
            </button>
            <button suppressHydrationWarning onClick={toggleTheme} className="relative group cursor-pointer transition-all duration-300 active:scale-95" aria-label="Toggle dark mode">
              <div className="absolute -inset-[4.5px] border border-black/5 dark:border-white/5 rounded-[9px] pointer-events-none transition-colors group-hover:border-black/10 dark:group-hover:border-white/10" />
              <div className="relative flex items-center justify-center w-[32px] h-[28px] bg-zinc-50 hover:bg-zinc-100 dark:bg-[#09090b] dark:hover:bg-[#121214] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] transition-colors border border-black/5 dark:border-white/5 shadow-sm">
                <span suppressHydrationWarning>{theme === "dark" ? <SunIcon className="w-3.5 h-3.5" /> : <MoonIcon className="w-3.5 h-3.5" />}</span>
              </div>
            </button>
          </Reveal>
        </div>
      </div>

      {/* Main content column */}
      <div className="relative pt-[calc(22vh+112px+16px)] md:mx-[30%] px-4 md:px-6 pb-10 max-w-full overflow-x-clip">
        {/* Hero */}
        <section className="pt-3 pb-6 border-b border-dashed border-zinc-200 dark:border-zinc-800 -mt-2">
          <Reveal delay={240}>
            <p className="text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-[560px]">
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">Engineer.</span> I love building, and shipping things.
            </p>
          </Reveal>
          <Reveal delay={300}>
          <ul className="mt-3 space-y-1.5 text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-[560px] list-disc pl-5 marker:text-zinc-400">
            <li>AI, open source, and developer tools are where I like to break things.</li>
            <li>I trust shipped code more than polished words.</li>
          </ul>
          </Reveal>
          <Reveal delay={360}>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-3">
            <span className="relative mr-2 inline-flex h-1.5 w-1.5 align-middle"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:animate-none" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>Currently building <a href="https://github.com/parasraju/LeakedAPIs" target="_blank" className="font-semibold text-zinc-900 dark:text-zinc-100 underline decoration-dotted underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">ApiInstructor</a>, <a href="https://github.com/parasraju/locus" target="_blank" className="font-semibold text-zinc-900 dark:text-zinc-100 underline decoration-dotted underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">Locus</a>, <a href="https://www.npmjs.com/package/hexlens" target="_blank" className="font-semibold text-zinc-900 dark:text-zinc-100 underline decoration-dotted underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300">Hexlens</a>, and a collection of experimental Python tools.
          </p>
          </Reveal>
          <Reveal delay={420}>
          <div className="flex flex-wrap gap-2 mt-5 max-w-full">
            <a href="https://cal.com/paras-raju/meeting" target="_blank" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[12px] font-medium hover:opacity-90 hover:-translate-y-px transition-[opacity,transform] duration-300">
              <CalendarIcon className="w-3.5 h-3.5" /> Book an intro call <span className="text-white/60 dark:text-zinc-500 text-[10px]">cal.com</span>
            </a>
            <a href="mailto:rajuparas766@gmail.com" className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[12px] font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:-translate-y-px transition-[background-color,transform] duration-300">
              Send an email <ArrowUpRightIcon className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
          </Reveal>
          <Reveal delay={500}>
            <SocialsSection />
          </Reveal>
        </section>

        {/* Experiences */}
        <section id="experience" className="scroll-mt-24 py-6">
          <Reveal>
            <h2 className="font-serif text-[24px] sm:text-[28px] font-normal tracking-[0.005em] text-zinc-900 dark:text-white mb-4">Experiences</h2>
          </Reveal>
          <ExperienceAccordion />
        </section>

        <ProjectsSection />

        <Reveal>
          <GitHubActivity />
        </Reveal>

        {/* Skills */}
        <section id="skills" className="scroll-mt-24 py-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
          <Reveal>
            <h2 className="font-serif text-[24px] sm:text-[28px] font-normal tracking-[0.005em] text-zinc-900 dark:text-white mb-3">Skills &amp; Technologies</h2>
          </Reveal>
          <Reveal className="space-y-2">
            {SKILL_ROWS.map((row, r) => (
              <div key={r} className={`marquee${r ? " marquee-reverse" : ""}`}>
                <div className="marquee-track">
                  {[0, 1].map((copy) =>
                    row.map(([label, src]) => (
                      <span key={`${copy}-${label}`} aria-hidden={copy === 1 ? "true" : undefined} className="inline-flex shrink-0 items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[12px] text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700">
                        <img src={src} alt={copy === 1 ? "" : label} width={14} height={14} loading="lazy" decoding="async" className="h-3.5 w-3.5 opacity-80" /> {label}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        <BlogSection />

        {/* Editorial quote — minimal, cinematic, centered — sits well below Blogs */}
        <section className="mt-14 sm:mt-20 py-[72px] sm:py-[84px] bg-white dark:bg-black -mx-4 md:-mx-6 border-y border-dashed border-zinc-200 dark:border-zinc-800">
          <Reveal className="max-w-[520px] mx-auto px-4 md:px-6 text-center">
            <blockquote className="font-serif text-[24px] sm:text-[30px] md:text-[34px] italic font-normal leading-[1.25] tracking-[0.005em] text-zinc-700 dark:text-zinc-200">
              “Power belongs to those who take it.”
            </blockquote>
            <div className="mt-8 sm:mt-9 flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-px w-7 sm:w-10 bg-zinc-300 dark:bg-zinc-700" />
              <span className="font-mono text-[10px] tracking-[0.28em] text-zinc-500 uppercase">Tyrell Wellick</span>
              <span className="h-px w-7 sm:w-10 bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </Reveal>
        </section>

        <footer className="flex items-center justify-between gap-4 pt-6 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-600">
          <span>© {new Date().getFullYear()} Paras Raju</span>
          <a href="#top" className="group inline-flex items-center gap-1.5 uppercase tracking-[0.16em] transition-colors hover:text-zinc-900 dark:hover:text-zinc-200">
            Back to top
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </a>
        </footer>
      </div>

      {cmdOpen && (
        <SearchPalette
          onClose={() => setCmdOpen(false)}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

