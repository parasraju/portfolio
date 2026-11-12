/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { fetchProfile, SOCIAL_CONFIG, type NormalizedProfile } from "./socialApi";

type Platform = "github" | "twitter" | "linkedin" | "discord" | "npm" | "substack";

const PLATFORMS: Platform[] = ["github", "twitter", "linkedin", "discord", "npm", "substack"];

const platformMeta: Record<
  Platform,
  { label: string; handle: string; url: string; blurb: string; icon: React.ReactNode }
> = {
  github: {
    label: "GitHub",
    handle: `@${SOCIAL_CONFIG.github.username}`,
    url: SOCIAL_CONFIG.github.url,
    blurb: "Open source, developer tools, and the things I ship.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  twitter: {
    label: "X",
    handle: `@${SOCIAL_CONFIG.twitter.username}`,
    url: SOCIAL_CONFIG.twitter.url,
    blurb: "Notes, builds, and occasional thoughts.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    handle: SOCIAL_CONFIG.linkedin.username,
    url: SOCIAL_CONFIG.linkedin.url,
    blurb: "Work, experience, and the professional side.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.777 13.019H3.56V9h3.554v11.452z" />
      </svg>
    ),
  },
  discord: {
    label: "Discord",
    handle: `@${SOCIAL_CONFIG.discord.username}`,
    url: SOCIAL_CONFIG.discord.url,
    blurb: "Reach me at @parasraju.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
        <path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.07.07 0 00-.078.037c-.211.375-.444.865-.608 1.25-2.183-.327-4.355-.327-6.503 0-.164-.385-.398-.875-.609-1.25a.07.07 0 00-.078-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.028C.533 9.046-.32 13.58.099 18.058a.08.08 0 00.031.056c2.053 1.508 4.041 2.423 5.993 3.03a.08.08 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.08.08 0 00-.041-.106 11.11 11.11 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.07.07 0 01.078-.01c3.928 1.793 8.18 1.793 12.061 0a.07.07 0 01.079.01c.12.099.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.08.08 0 00.084.029c1.961-.607 3.95-1.522 6.002-3.03a.08.08 0 00.031-.056c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.029zM8.02 15.331c-1.183 0-2.157-1.068-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.175 1.077 2.157 2.38 0 1.312-.947 2.38-2.157 2.38zm7.974 0c-1.183 0-2.157-1.068-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.175 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
      </svg>
    ),
  },
  npm: {
    label: "npm",
    handle: "npmjs.com/~parasraju",
    url: "https://www.npmjs.com/~parasraju",
    blurb: "Small, focused packages for developer workflows.",
    icon: <img src="https://cdn.simpleicons.org/npm/CB3837" alt="" width={16} height={16} loading="lazy" className="h-4 w-4 shrink-0" />,
  },
  substack: {
    label: "Substack",
    handle: "@skepticmonk",
    url: "https://skepticmonk.substack.com",
    blurb: "Essays and poems — the quieter side of the work.",
    icon: <img src="https://cdn.simpleicons.org/substack/FF6719" alt="" width={16} height={16} loading="lazy" className="h-4 w-4 shrink-0" />,
  },
};

type Anchor = { top: number; left: number };

const CARD_WIDTH = 300;
const CARD_HEIGHT = 168;

function HoverPreview({
  platform,
  profile,
  anchor,
  onEnter,
  onLeave,
}: {
  platform: Platform;
  profile?: NormalizedProfile;
  anchor: Anchor;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const meta = platformMeta[platform];
  const avatar = profile?.avatar ?? withBasePath("/assets/avatar.webp");
  const stats = profile?.stats;

  return (
    <div
      className="fixed z-[95] w-[300px]"
      style={{ top: anchor.top, left: anchor.left }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.16)] dark:border-zinc-700 dark:bg-[#0f0f0f]">
        <a href={meta.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="h-10 w-full bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900" />
        <div className="px-3.5 pb-3">
          <div className="-mt-5 flex items-end gap-2.5">
            <img
              src={avatar}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full border-2 border-white bg-zinc-200 object-cover dark:border-[#0f0f0f] dark:bg-zinc-800"
            />
            <div className="min-w-0 pb-0.5">
              <p className="truncate text-[12.5px] font-semibold text-zinc-900 dark:text-white">Paras Raju</p>
              <p className="truncate text-[10.5px] text-zinc-500 dark:text-zinc-400">{meta.handle}</p>
            </div>
          </div>

          <p className="mt-2 line-clamp-2 text-[11.5px] leading-[1.5] text-zinc-600 dark:text-zinc-400">
            {profile?.bio ?? meta.blurb}
          </p>

          {platform === "github" && stats && stats.length > 0 && (
            <div className="mt-2 flex items-center gap-4 border-t border-dashed border-zinc-200 pt-2 dark:border-zinc-800">
              {stats.slice(0, 2).map((stat) => (
                <span key={stat.label} className="text-[10.5px] text-zinc-500 dark:text-zinc-400">
                  <b className="font-semibold text-zinc-900 dark:text-zinc-100">{stat.value}</b> {stat.label.toLowerCase()}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Click to open</span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-zinc-700 dark:text-zinc-300">
              Visit {meta.label} <span aria-hidden="true">↗</span>
            </span>
          </div>
        </div>
        </a>
      </div>
    </div>
  );
}

export function SocialsSection() {
  const [hovered, setHovered] = useState<Platform | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [githubProfile, setGithubProfile] = useState<NormalizedProfile | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setHovered(null), 140);
  };

  useEffect(() => {
    if (!hovered) return;
    const onScroll = () => setHovered(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [hovered]);

  useEffect(() => {
    return () => cancelClose();
  }, []);

  const openPreview = (platform: Platform, element: HTMLElement) => {
    // Touch devices have no hover — tapping should just follow the link.
    if (!window.matchMedia("(hover: hover)").matches) return;
    cancelClose();
    const rect = element.getBoundingClientRect();
    const left = Math.min(Math.max(rect.left + rect.width / 2 - CARD_WIDTH / 2, 12), window.innerWidth - CARD_WIDTH - 12);
    const below = rect.bottom + 10;
    const top = below + CARD_HEIGHT > window.innerHeight - 12 ? Math.max(rect.top - CARD_HEIGHT - 10, 12) : below;

    setAnchor({ top, left });
    setHovered(platform);

    if (platform === "github" && !githubProfile) {
      fetchProfile("github")
        .then((data) => setGithubProfile(data))
        .catch(() => undefined);
    }
  };

  return (
    <div className="mt-7 w-full">
      <p className="text-center text-[13px] tracking-wide">
        <span className="text-zinc-500 dark:text-zinc-400">Here are my </span>
        <span className="font-bold text-zinc-900 dark:text-white">socials</span>
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {PLATFORMS.map((platform) => {
          const meta = platformMeta[platform];
          return (
            <a
              key={platform}
              href={meta.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(event) => openPreview(platform, event.currentTarget)}
              onMouseLeave={scheduleClose}
              onTouchEnd={scheduleClose}
              onFocus={(event) => openPreview(platform, event.currentTarget)}
              onBlur={scheduleClose}
              className="ios-btn h-9 select-none gap-2 px-3.5"
            >
              {meta.icon}
              {meta.label}
            </a>
          );
        })}
      </div>

      {hovered && anchor && (
        <HoverPreview
          platform={hovered}
          profile={hovered === "github" ? githubProfile ?? undefined : undefined}
          anchor={anchor}
          onEnter={cancelClose}
          onLeave={scheduleClose}
        />
      )}
    </div>
  );
}
