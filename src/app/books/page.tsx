import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { BookCover } from "@/components/personal/Personal";
import { books } from "@/components/personal/personalData";

export const metadata: Metadata = {
  title: "Books — Paras Raju",
  description: "Books Paras Raju keeps coming back to.",
};

export default function BooksPage() {
  return (
    <PageShell
      eyebrow="Personal · Books"
      title="On my shelf"
      description={
        <>
          Myths, Stoics, science fiction, letters and the classics — the books that stayed with me. Also see{" "}
          <Link href="/movies/" className="font-medium text-zinc-900 underline decoration-dotted underline-offset-4 dark:text-zinc-100">
            movies
          </Link>
          .
        </>
      }
    >
      <Reveal stagger delay={60} className="grid grid-cols-1 gap-x-6 gap-y-2 py-7 sm:grid-cols-2">
        {books.map((book, i) => (
          <a
            key={book.slug}
            id={book.slug}
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--i": i } as React.CSSProperties}
            className="group flex scroll-mt-24 gap-4 rounded-[10px] p-3 -mx-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            <BookCover book={book} className="w-[92px] shrink-0 sm:w-[100px]" eager={i < 4} />
            <div className="min-w-0 pt-1">
              <p className="font-ui text-[11.5px] font-semibold tracking-[-0.005em] text-zinc-400 dark:text-zinc-500">
                {book.genre} · {book.year}
              </p>
              <h2 className="mt-1 font-serif text-[22px] leading-[1.1] text-zinc-900 dark:text-zinc-50">{book.title}</h2>
              <p className="mt-0.5 text-[12px] text-zinc-500 dark:text-zinc-400">{book.author}</p>
              <p className="mt-2.5 text-[12.5px] leading-[1.6] text-zinc-600 dark:text-zinc-300">{book.about}</p>
            </div>
          </a>
        ))}
      </Reveal>
    </PageShell>
  );
}
