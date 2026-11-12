import Link from "next/link";

export function SeeAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="ios-btn group mt-4"
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
