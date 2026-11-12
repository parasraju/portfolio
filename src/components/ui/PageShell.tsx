import Link from "next/link";
import { Reveal } from "./Reveal";
import { ScrollProgress } from "./ScrollProgress";
import { GridBeams } from "./GridBeams";
import { SiteFooter } from "./SiteFooter";

const DASH_V = "repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  focusScope?: boolean;
  children: React.ReactNode;
};

export function PageShell({ eyebrow, title, description, back = { href: "/", label: "Home" }, focusScope = false, children }: PageShellProps) {
  const dim = focusScope ? "focus-dim" : "";
  return (
    <div id="top" className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-black">
      <div className="grid-line-v pointer-events-none absolute top-0 bottom-0 left-[30%] hidden w-0 border-r border-black/30 dark:border-white/[0.15] md:block" style={{ maskImage: DASH_V, WebkitMaskImage: DASH_V }} />
      <div className="grid-line-v pointer-events-none absolute top-0 bottom-0 right-[30%] hidden w-0 border-r border-black/30 dark:border-white/[0.15] md:block" style={{ maskImage: DASH_V, WebkitMaskImage: DASH_V }} />
      <GridBeams />
      <ScrollProgress />

      <main className={`relative max-w-full overflow-x-clip px-4 pt-24 pb-10 md:mx-[30%] md:px-6 sm:pt-28 ${focusScope ? "focus-scope" : ""}`.trim()}>
        <Reveal className={`border-b border-dashed border-zinc-200 pb-7 dark:border-zinc-800 ${dim}`.trim()}>
          <Link href={back.href} className="ios-btn ios-btn-sm ios-btn-muted group">
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
            {back.label}
          </Link>
          <p className="mt-6 font-ui text-[12.5px] font-semibold tracking-[-0.005em] text-zinc-400 dark:text-zinc-500">{eyebrow}</p>
          <h1 className="mt-2 font-serif text-[40px] font-normal leading-[1] tracking-[-0.01em] text-zinc-900 dark:text-zinc-50 sm:text-[52px]">{title}</h1>
          {description && <div className="mt-4 max-w-[540px] text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</div>}
        </Reveal>

        {children}

        <SiteFooter className={`mt-10 border-t border-dashed border-zinc-200 dark:border-zinc-800 ${dim}`.trim()} />
      </main>
    </div>
  );
}
