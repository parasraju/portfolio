/* eslint-disable @next/next/no-img-element */
import { blogPosts, publication } from "./blogData";
import { Reveal } from "@/components/ui/Reveal";

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogSection() {
  return (
    <section id="blogs" className="scroll-mt-24 py-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
      <Reveal className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-[24px] sm:text-[28px] font-normal tracking-[0.005em] text-zinc-900 dark:text-white">Blogs</h2>
        <a href={publication.archiveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11.5px] font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
          Read all on Substack <ArrowUpRightIcon className="h-3 w-3" />
        </a>
      </Reveal>

      <p className="mt-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
        Essays and poems from{" "}
        <a href={publication.url} target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-700 underline decoration-dotted underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
          @{publication.handle}
        </a>
        .
      </p>

      <Reveal stagger delay={60} className="mt-2">
        {blogPosts.map((post, i) => (
          <a
            key={post.url}
            style={{ "--i": i } as React.CSSProperties}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 border-b border-dashed border-zinc-200 py-4 last:border-b-0 dark:border-zinc-800"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.08em] text-zinc-400 dark:text-zinc-500">
                <span>{formatDate(post.published)}</span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>{post.readTime} min read</span>
                {post.tags[0] && (
                  <>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{post.tags[0]}</span>
                  </>
                )}
              </div>
              <h3 className="mt-1 text-[14px] font-semibold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-white dark:group-hover:text-zinc-300">
                {post.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-[12.5px] leading-[1.6] text-zinc-500 dark:text-zinc-400">
                {post.excerpt}
              </p>
            </div>

            {post.cover ? (
              <div className="hidden h-[58px] w-[92px] shrink-0 overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 sm:block">
                <img
                  src={post.cover}
                  alt=""
                  width={184}
                  height={116}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              <div className="hidden h-[58px] w-[92px] shrink-0 items-center justify-center rounded-[6px] border border-dashed border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700 sm:flex">
                <span className="font-mono text-[15px]">¶</span>
              </div>
            )}

            <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-700 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
          </a>
        ))}
      </Reveal>
    </section>
  );
}
