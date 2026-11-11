/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/basePath";

export type LastPlayedTrack = {
  title: string;
  artists: string;
  album: string;
  image: string | null;
  url: string;
  playedAt: string;
};

function timeAgo(iso: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14C9.6 9.9 15 10.56 18.72 12.84c.36.18.54.78.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  );
}

export function SpotifyLastPlayed() {
  const [track, setTrack] = useState<LastPlayedTrack | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(withBasePath("/api/spotify"))
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { track?: LastPlayedTrack | null } | null) => {
        if (alive && data?.track) setTrack(data.track);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (!track) return null;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${track.title} — ${track.artists} · ${track.album}`}
      className="spotify-pill group mt-1.5 inline-flex max-w-[210px] items-center gap-1.5 text-[11px] leading-none text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:max-w-[320px]"
    >
      {track.image ? (
        <img src={track.image} alt="" width={16} height={16} className="h-4 w-4 shrink-0 rounded-[3px] object-cover" />
      ) : (
        <SpotifyIcon className="h-3.5 w-3.5 shrink-0 text-[#1DB954]" />
      )}
      <span aria-hidden="true" className="eq flex h-2.5 shrink-0 items-end gap-[2px]">
        <span />
        <span />
        <span />
      </span>
      <span className="truncate">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">{track.title}</span>
        <span className="text-zinc-400 dark:text-zinc-500"> · {track.artists}</span>
      </span>
      <span suppressHydrationWarning className="hidden shrink-0 font-mono text-[9.5px] text-zinc-400 dark:text-zinc-600 sm:inline">
        {timeAgo(track.playedAt)}
      </span>
    </a>
  );
}
