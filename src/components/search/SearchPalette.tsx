"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sections } from "@/lib/sections";
import { npmPackages, projects } from "@/components/projects/projectsData";
import { blogPosts } from "@/components/blog/blogData";
import { SOCIAL_CONFIG } from "@/components/socials/socialApi";

type SearchPaletteProps = {
  onClose: () => void;
  onToggleTheme: () => void;
};

type ItemKind = "section" | "action" | "project" | "npm" | "blog" | "social";

type Item = {
  id: string;
  group: string;
  title: string;
  subtitle?: string;
  hint?: string;
  kind: ItemKind;
  keywords?: string;
  href?: string;
  onSelect?: () => void;
};

type Group = { label: string; items: Item[] };

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ItemIcon({ kind }: { kind: ItemKind }) {
  const cls = "h-3.5 w-3.5";
  switch (kind) {
    case "section":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
        </svg>
      );
    case "action":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
        </svg>
      );
    case "project":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.9 4.2A2 2 0 0 0 8.2 3.3H4a2 2 0 0 0-2 2v12.7A2 2 0 0 0 4 20Z" />
        </svg>
      );
    case "npm":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
      );
    case "blog":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6M8 13h8M8 17h5" />
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

const EMAIL = "rajuparas766@gmail.com";

export function SearchPalette({ onClose, onToggleTheme }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      previouslyFocused?.focus?.();
    };
  }, []);

  const groups = useMemo<Group[]>(() => {
    const q = query.trim().toLowerCase();
    const matches = (item: Item) =>
      !q ||
      [item.title, item.subtitle, item.keywords, item.group]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);

    const jump: Item[] = sections.map((section) => ({
      id: `section-${section.id}`,
      group: "Jump to",
      title: section.label,
      subtitle: `Go to section · ${section.id}`,
      kind: "section",
      keywords: `section scroll ${section.id}`,
      onSelect: () => {
        document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }));

    const actions: Item[] = [
      {
        id: "action-theme",
        group: "Actions",
        title: "Toggle theme",
        subtitle: "Switch between light and dark",
        kind: "action",
        keywords: "dark light mode appearance",
        onSelect: onToggleTheme,
      },
      {
        id: "action-email",
        group: "Actions",
        title: "Copy email",
        subtitle: EMAIL,
        kind: "action",
        keywords: "contact mail clipboard",
        onSelect: () => {
          void navigator.clipboard?.writeText(EMAIL);
        },
      },
    ];

    const projectItems: Item[] = projects.map((project) => ({
      id: `project-${project.slug}`,
      group: "Projects",
      title: project.name,
      subtitle: project.description,
      hint: project.language,
      kind: "project",
      keywords: `${project.repo} ${project.tags.join(" ")}`,
      href: project.repoUrl,
    }));

    const npmItems: Item[] = npmPackages.map((pkg) => ({
      id: `npm-${pkg.name}`,
      group: "npm packages",
      title: pkg.name,
      subtitle: pkg.description,
      hint: `v${pkg.version}`,
      kind: "npm",
      keywords: "npm package node",
      href: pkg.npmUrl,
    }));

    const blogItems: Item[] = blogPosts.map((post) => ({
      id: `blog-${post.url}`,
      group: "Writing",
      title: post.title,
      subtitle: post.excerpt,
      hint: `${post.readTime} min`,
      kind: "blog",
      keywords: `${post.tags.join(" ")} substack essay poem`,
      href: post.url,
    }));

    const socialItems: Item[] = [
      { id: "social-github", group: "Socials", title: "GitHub", subtitle: `@${SOCIAL_CONFIG.github.username}`, kind: "social", href: SOCIAL_CONFIG.github.url },
      { id: "social-x", group: "Socials", title: "X", subtitle: `@${SOCIAL_CONFIG.twitter.username}`, kind: "social", href: SOCIAL_CONFIG.twitter.url },
      { id: "social-linkedin", group: "Socials", title: "LinkedIn", subtitle: SOCIAL_CONFIG.linkedin.name, kind: "social", href: SOCIAL_CONFIG.linkedin.url },
      { id: "social-discord", group: "Socials", title: "Discord", subtitle: `@${SOCIAL_CONFIG.discord.username}`, kind: "social", href: SOCIAL_CONFIG.discord.url },
      { id: "social-npm", group: "Socials", title: "npm", subtitle: "Published packages", kind: "social", href: "https://www.npmjs.com/~parasraju" },
      { id: "social-substack", group: "Socials", title: "Substack", subtitle: "@skepticmonk", kind: "social", href: "https://skepticmonk.substack.com" },
    ];

    if (!q) {
      return [
        { label: "Jump to", items: jump },
        { label: "Actions", items: actions },
        { label: "Projects", items: projectItems.slice(0, 4) },
        { label: "Writing", items: blogItems.slice(0, 3) },
      ];
    }

    return [
      { label: "Jump to", items: jump },
      { label: "Actions", items: actions },
      { label: "Projects", items: projectItems },
      { label: "npm packages", items: npmItems },
      { label: "Writing", items: blogItems },
      { label: "Socials", items: socialItems },
    ]
      .map((group) => ({ ...group, items: group.items.filter(matches) }))
      .filter((group) => group.items.length > 0);
  }, [query, onToggleTheme]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const indexOf = useMemo(() => new Map(flat.map((item, index) => [item.id, index])), [flat]);
  const safeActive = flat.length === 0 ? 0 : Math.min(active, flat.length - 1);

  useEffect(() => {
    if (flat.length === 0) return;
    document.getElementById(`search-item-${safeActive}`)?.scrollIntoView({ block: "nearest" });
  }, [safeActive, flat.length]);

  const select = (item: Item) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      item.onSelect?.();
    }
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flat.length) setActive((safeActive + 1) % flat.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flat.length) setActive((safeActive - 1 + flat.length) % flat.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = flat[safeActive];
      if (item) select(item);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>("input, button, a[href]")).filter(
        (element) => !element.hasAttribute("disabled")
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      <div ref={panelRef} onKeyDown={onKeyDown} className="relative w-full max-w-[560px] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-[#0b0b0c]">
        <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <SearchIcon className="h-4 w-4 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            placeholder="Search projects, packages, writing, actions…"
            className="flex-1 bg-transparent text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            aria-label="Search"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            ESC
          </kbd>
        </div>

        <div className="max-h-[min(420px,55vh)] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">No results for “{query.trim()}”</p>
              <p className="mt-1 text-[11.5px] text-zinc-500 dark:text-zinc-400">Try a project, package, post, or section name.</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mb-1 last:mb-0">
                <div className="px-2 pb-1 pt-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const index = indexOf.get(item.id) ?? 0;
                  const isActive = index === safeActive;
                  return (
                    <button
                      key={item.id}
                      id={`search-item-${index}`}
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => select(item)}
                      className={`flex w-full items-center gap-3 rounded-[7px] px-2.5 py-2 text-left transition-colors ${
                        isActive ? "bg-zinc-100 dark:bg-zinc-800/80" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] border ${
                          isActive
                            ? "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
                            : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                        }`}
                      >
                        <ItemIcon kind={item.kind} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px] font-medium text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="mt-0.5 block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                            {item.subtitle}
                          </span>
                        )}
                      </span>

                      {item.hint && (
                        <span className="hidden shrink-0 rounded-full border border-zinc-200 px-1.5 py-0.5 text-[9.5px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:inline">
                          {item.hint}
                        </span>
                      )}

                      {isActive && (
                        <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500" aria-hidden="true">
                          ↵
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-100 px-3 py-2 text-[10px] text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="rounded border border-zinc-200 px-1 py-0.5 dark:border-zinc-800">↑</span>
            <span className="rounded border border-zinc-200 px-1 py-0.5 dark:border-zinc-800">↓</span>
            navigate
          </span>
          <span className="flex items-center gap-2">
            <span className="rounded border border-zinc-200 px-1 py-0.5 dark:border-zinc-800">↵</span>
            open
            <span className="rounded border border-zinc-200 px-1 py-0.5 dark:border-zinc-800">esc</span>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
