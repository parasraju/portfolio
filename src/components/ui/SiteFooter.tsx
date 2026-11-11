export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer className={`flex items-center justify-between gap-4 pt-6 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-600 ${className}`.trim()}>
      <span>© {new Date().getFullYear()} Paras Raju</span>
      <a href="#top" className="group inline-flex items-center gap-1.5 uppercase tracking-[0.16em] transition-colors hover:text-zinc-900 dark:hover:text-zinc-200">
        Back to top
        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
      </a>
    </footer>
  );
}
