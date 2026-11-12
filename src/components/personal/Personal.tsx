/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { withBasePath } from "@/lib/basePath";
import { Reveal } from "@/components/ui/Reveal";
import { books, movies, type Book, type Movie } from "./personalData";

export function BookCover({ book, className = "", eager = false }: { book: Book; className?: string; eager?: boolean }) {
  return (
    <div className={`book relative aspect-[2/3] ${className}`.trim()}>
      <img
        src={withBasePath(book.cover)}
        alt={`${book.title} by ${book.author}`}
        width={330}
        height={500}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full rounded-[2px_5px_5px_2px] object-cover"
      />
      <span aria-hidden="true" className="book-spine pointer-events-none absolute inset-y-0 left-0 w-[9%] rounded-l-[2px]" />
      <span aria-hidden="true" className="book-sheen pointer-events-none absolute inset-0 rounded-[2px_5px_5px_2px]" />
    </div>
  );
}

export function MoviePoster({ movie, className = "" }: { movie: Movie; className?: string }) {
  return (
    <div className={`relative aspect-[2/3] overflow-hidden rounded-[8px] bg-zinc-100 dark:bg-zinc-900 ${className}`.trim()}>
      <img
        src={withBasePath(movie.poster)}
        alt={`${movie.title} poster`}
        width={258}
        height={387}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06]"
      />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[8px] ring-1 ring-inset ring-black/10 dark:ring-white/10" />
    </div>
  );
}

export function BookShelf({ limit = 4 }: { limit?: number }) {
  return (
    <Reveal stagger delay={60} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {books.slice(0, limit).map((book, i) => (
        <Link key={book.slug} href={`/books/#${book.slug}`} style={{ "--i": i } as React.CSSProperties} className="group block" aria-label={`${book.title} by ${book.author}`}>
          <BookCover book={book} />
          <p className="mt-2.5 line-clamp-2 text-[11.5px] font-medium leading-snug text-zinc-800 dark:text-zinc-200">{book.title}</p>
          <p className="truncate font-ui text-[11.5px] font-semibold tracking-[-0.005em] text-zinc-400 dark:text-zinc-500">{book.author}</p>
        </Link>
      ))}
    </Reveal>
  );
}

export function MovieStrip({ limit = 4 }: { limit?: number }) {
  return (
    <Reveal stagger delay={60} className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {movies.slice(0, limit).map((movie, i) => (
        <Link key={movie.slug} href={`/movies/#${movie.slug}`} style={{ "--i": i } as React.CSSProperties} className="group block">
          <div className="relative">
            <MoviePoster movie={movie} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[8px] bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2.5 pt-10 pb-2.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <p className="font-serif text-[16px] leading-tight text-white">{movie.title}</p>
              <p className="mt-0.5 font-ui text-[11.5px] font-semibold tracking-[-0.005em] text-white/70">{movie.year}</p>
            </div>
          </div>
          <p className="mt-2 truncate text-[11.5px] font-medium text-zinc-800 dark:text-zinc-200 sm:hidden">{movie.title}</p>
        </Link>
      ))}
    </Reveal>
  );
}
