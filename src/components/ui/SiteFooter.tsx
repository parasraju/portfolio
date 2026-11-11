import Link from "next/link";
import { CurrentYear } from "./CurrentYear";

const COLUMNS = [
  {
    title: "Pages",
    links: [
      { href: "/", label: "Home" },
      { href: "/work/", label: "Work" },
      { href: "/blogs/", label: "Blogs" },
      { href: "/experience/", label: "Experience" },
    ],
  },
  {
    title: "Development",
    links: [
      { href: "/terminal/", label: "Terminal" },
      { href: "/gear/", label: "Gear" },
      { href: "/setup/", label: "Setup" },
    ],
  },
  {
    title: "Personal",
    links: [
      { href: "/books/", label: "Books" },
      { href: "/movies/", label: "Movies" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { href: "https://github.com/parasraju", label: "GitHub", external: true },
      { href: "https://x.com/parashawtyy", label: "X / Twitter", external: true },
      { href: "https://www.linkedin.com/in/paras-raju-96427933a/", label: "LinkedIn", external: true },
      { href: "https://www.npmjs.com/~parasraju", label: "npm", external: true },
      { href: "mailto:rajuparas766@gmail.com", label: "Email", external: true },
    ],
  },
] as const;

const linkClass = "text-[12.5px] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100";

export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`pt-8 pb-2 ${className}`.trim()}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <Link href="/" className="font-serif text-[30px] leading-none tracking-[0.01em] text-zinc-900 transition-opacity hover:opacity-70 dark:text-zinc-100">
          Paras Raju<span className="text-zinc-400 dark:text-zinc-600">.</span>
        </Link>
      </div>

      <nav aria-label="Footer" className="mt-7 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h2 className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-600">{column.title}</h2>
            <ul className="mt-2.5 space-y-1.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  {"external" in link ? (
                    <a href={link.href} className={linkClass} {...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-dashed border-zinc-200 pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:border-zinc-800 dark:text-zinc-600">
        <span>
          © <CurrentYear /> Paras Raju
        </span>
        <a href="#top" className="group inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-200">
          Back to top
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
        </a>
      </div>
    </footer>
  );
}
