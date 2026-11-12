/* eslint-disable @next/next/no-img-element */
import { blogPosts, publication, type BlogPost } from "./blogData";
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

export function SubstackNote() {
  return (
    <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
      Essays and poems from{" "}
      <a href={publication.url} target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-700 underline decoration-dotted underline-offset-4 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
        @{publication.handle}
      </a>{" "}
      on Substack.
    </p>
  );
}

function BlogRow({ post, large }: { post: BlogPost; large: boolean }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`focus-item group flex items-center gap-4 border-b border-dashed border-zinc-200 dark:border-zinc-800 ${large ? "py-6" : "py-4"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-ui text-[12px] font-semibold tracking-[-0.005em] text-zinc-400 dark:text-zinc-500">
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
        <h3 className={`mt-1 leading-snug text-zinc-900 dark:text-white ${large ? "font-serif text-[24px] font-normal sm:text-[27px]" : "text-[14px] font-semibold tracking-tight"}`}>
          {post.title}
        </h3>
        <p className={`mt-1 line-clamp-2 leading-[1.6] text-zinc-500 dark:text-zinc-400 ${large ? "text-[13.5px]" : "text-[12.5px]"}`}>{post.excerpt}</p>
      </div>

      {post.cover ? (
        <div className={`hidden shrink-0 overflow-hidden rounded-[6px] border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 sm:block ${large ? "h-[78px] w-[124px]" : "h-[58px] w-[92px]"}`}>
          <img src={post.cover} alt="" width={248} height={156} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-[1.05]" />
        </div>
      ) : (
        <div className={`hidden shrink-0 items-center justify-center rounded-[6px] border border-dashed border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-700 sm:flex ${large ? "h-[78px] w-[124px]" : "h-[58px] w-[92px]"}`}>
          <span className="font-mono text-[15px]">¶</span>
        </div>
      )}

      <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-zinc-300 transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-700 dark:text-zinc-600 dark:group-hover:text-zinc-300" />
    </a>
  );
}

export function BlogList({ limit, large = false, scoped = true }: { limit?: number; large?: boolean; scoped?: boolean }) {
  const posts = limit ? blogPosts.slice(0, limit) : blogPosts;
  return (
    <Reveal stagger delay={60} className={`mt-2 [&>*:last-child>a]:border-b-0 ${scoped ? "focus-scope" : ""}`.trim()}>
      {posts.map((post, i) => (
        <div key={post.url} style={{ "--i": i } as React.CSSProperties}>
          <BlogRow post={post} large={large} />
        </div>
      ))}
    </Reveal>
  );
}
