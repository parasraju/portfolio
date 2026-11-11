import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { MoviePoster } from "@/components/personal/Personal";
import { movies } from "@/components/personal/personalData";

export const metadata: Metadata = {
  title: "Movies — Paras Raju",
  description: "Films Paras Raju loves.",
};

export default function MoviesPage() {
  return (
    <PageShell
      eyebrow="Personal · Movies"
      title="Films I love"
      description={
        <>
          Quiet romances and one that never lets go. Also see{" "}
          <Link href="/books/" className="font-medium text-zinc-900 underline decoration-dotted underline-offset-4 dark:text-zinc-100">
            books
          </Link>
          .
        </>
      }
    >
      <Reveal stagger delay={80} className="grid grid-cols-1 gap-8 py-7 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10">
        {movies.map((movie, i) => (
          <a
            key={movie.slug}
            id={movie.slug}
            href={movie.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--i": i } as React.CSSProperties}
            className="group block scroll-mt-24"
          >
            <div className="relative">
              <MoviePoster movie={movie} className="shadow-[0_18px_40px_-22px_rgba(0,0,0,0.55)]" />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm">
                {movie.year}
              </span>
            </div>
            <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
              {movie.genre} · dir. {movie.director}
            </p>
            <h2 className="mt-1 font-serif text-[26px] leading-[1.05] text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-50 dark:group-hover:text-zinc-300">
              {movie.title}
            </h2>
            <p className="mt-2 text-[12.5px] leading-[1.6] text-zinc-600 dark:text-zinc-300">{movie.about}</p>
          </a>
        ))}
      </Reveal>
    </PageShell>
  );
}
