import Link from "next/link";

export function SeeAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 font-mono text-[11px] tracking-[0.03em] text-zinc-600 transition-[border-color,color,transform] duration-300 hover:-translate-y-px hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
    >
      {children}
      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  );
}

export function SectionHeading({ id, title, action }: { id?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id={id} className="font-serif text-[24px] font-normal tracking-[0.005em] text-zinc-900 dark:text-white sm:text-[28px]">
        {title}
      </h2>
      {action}
    </div>
  );
}
