import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { setupGroups, type SetupGroup } from "./setupData";

export function DevelopmentLinks() {
  return (
    <Reveal stagger delay={60} className="mt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800">
      {setupGroups.map((group, i) => (
        <Link
          key={group.slug}
          href={`/${group.slug}/`}
          style={{ "--i": i } as React.CSSProperties}
          className="group flex items-center gap-4 border-b border-dashed border-zinc-200 py-3.5 dark:border-zinc-800"
        >
          <span className="w-6 shrink-0 font-mono text-[10.5px] text-zinc-400 dark:text-zinc-600">0{i + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[21px] leading-tight text-zinc-900 transition-transform duration-300 group-hover:translate-x-1 dark:text-zinc-50">{group.title}</p>
            <p className="mt-0.5 truncate text-[12px] text-zinc-500 dark:text-zinc-400">{group.blurb}</p>
          </div>
          <span aria-hidden="true" className="shrink-0 text-zinc-300 transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-zinc-800 dark:text-zinc-600 dark:group-hover:text-zinc-200">
            →
          </span>
        </Link>
      ))}
    </Reveal>
  );
}

function OtherPages({ current }: { current: SetupGroup["slug"] }) {
  return (
    <p className="mt-8 text-[12.5px] text-zinc-500 dark:text-zinc-400">
      Also in Development:{" "}
      {setupGroups
        .filter((group) => group.slug !== current)
        .map((group, i) => (
          <span key={group.slug}>
            {i > 0 && " · "}
            <Link href={`/${group.slug}/`} className="font-medium text-zinc-900 underline decoration-dotted underline-offset-4 dark:text-zinc-100">
              {group.title}
            </Link>
          </span>
        ))}
    </p>
  );
}

export function SetupPage({ group }: { group: SetupGroup }) {
  return (
    <PageShell eyebrow={`Development · ${group.title}`} title={group.heading} description={group.blurb} back={{ href: "/#development", label: "Development" }}>
      <Reveal className="py-7">
        {group.items.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-zinc-200 px-4 py-6 text-center text-[13px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            Coming soon — I&apos;m still writing this one up.
          </p>
        ) : (
          <ul className="border-t border-dashed border-zinc-200 dark:border-zinc-800">
            {group.items.map((item) => (
              <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-dashed border-zinc-200 py-3 dark:border-zinc-800">
                <span className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </span>
                {item.detail && <span className="text-[12.5px] text-zinc-500 dark:text-zinc-400">{item.detail}</span>}
              </li>
            ))}
          </ul>
        )}
        <OtherPages current={group.slug} />
      </Reveal>
    </PageShell>
  );
}
