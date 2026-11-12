import Link from "next/link";
import { PageShell } from "@/components/ui/PageShell";
import { Reveal } from "@/components/ui/Reveal";
import { setupGroups, type SetupGroup, type SetupIcon, type SetupItem, type SetupSection } from "./setupData";

const ICON_PATHS: Record<SetupIcon, React.ReactNode> = {
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <path d="M2 19h20" />
    </>
  ),
  mouse: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 7v4" />
    </>
  ),
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  notes: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h7M9 17h5" />
    </>
  ),
  browser: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  agent: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 11h.01M14 11h.01M10 14h4" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </>
  ),
};

function SetupIconGlyph({ icon }: { icon: SetupIcon }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5">
        {ICON_PATHS[icon]}
      </svg>
    </span>
  );
}

function ItemName({ item, className }: { item: SetupItem; className: string }) {
  if (!item.url) return <span className={className}>{item.name}</span>;
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className={`${className} underline decoration-dotted decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-current dark:decoration-zinc-700`}>
      {item.name}
    </a>
  );
}

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

function PointList({ section }: { section: SetupSection }) {
  return (
    <section aria-label={section.title}>
      <h2 className="font-ui text-[12.5px] font-semibold tracking-[-0.005em] text-zinc-500 dark:text-zinc-400">{section.title}</h2>
      <ul className="mt-3 list-disc space-y-2.5 pl-5 marker:text-zinc-400 dark:marker:text-zinc-600">
        {section.items.map((item) => (
          <li key={item.name} className="text-[13.5px] leading-[1.6] text-zinc-600 dark:text-zinc-400">
            <ItemName item={item} className="font-medium text-zinc-900 dark:text-zinc-100" />
            {item.detail && <> — {item.detail}</>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function HardwareCard({ section }: { section: SetupSection }) {
  return (
    <section aria-label={section.title} className="rounded-[10px] border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-[#0b0b0c]">
      <div className="flex items-center gap-2.5">
        {section.icon && <SetupIconGlyph icon={section.icon} />}
        <h2 className="font-ui text-[12.5px] font-semibold tracking-[-0.005em] text-zinc-500 dark:text-zinc-400">{section.title}</h2>
      </div>
      {section.items.map((item) => (
        <div key={item.name} className="mt-4">
          <ItemName item={item} className="font-serif text-[24px] leading-[1.1] text-zinc-900 dark:text-zinc-50" />
          {item.specs && (
            <dl className="mt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800">
              {item.specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-4 border-b border-dashed border-zinc-200 py-2 dark:border-zinc-800">
                  <dt className="font-ui text-[12px] font-semibold tracking-[-0.005em] text-zinc-400 dark:text-zinc-500">{spec.label}</dt>
                  <dd className="text-right text-[13px] font-medium text-zinc-800 dark:text-zinc-200">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      ))}
    </section>
  );
}

function SoftwareRow({ section }: { section: SetupSection }) {
  return (
    <section aria-label={section.title} className="grid gap-3 border-b border-dashed border-zinc-200 py-4 dark:border-zinc-800 sm:grid-cols-[170px_1fr]">
      <div className="flex items-center gap-2.5 self-start">
        {section.icon && <SetupIconGlyph icon={section.icon} />}
        <h2 className="font-ui text-[12.5px] font-semibold tracking-[-0.005em] text-zinc-500 dark:text-zinc-400">{section.title}</h2>
      </div>
      <ul className="space-y-2.5">
        {section.items.map((item) => (
          <li key={item.name}>
            <ItemName item={item} className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100" />
            {item.detail && <p className="mt-0.5 text-[12.5px] text-zinc-500 dark:text-zinc-400">{item.detail}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

function GroupContent({ group }: { group: SetupGroup }) {
  if (group.slug === "terminal") {
    return (
      <Reveal stagger delay={60} className="grid gap-7">
        {group.sections.map((section, i) => (
          <div key={section.title} style={{ "--i": i } as React.CSSProperties}>
            <PointList section={section} />
          </div>
        ))}
      </Reveal>
    );
  }
  if (group.slug === "gear") {
    return (
      <Reveal stagger delay={60} className="grid gap-4 sm:grid-cols-2">
        {group.sections.map((section, i) => (
          <div key={section.title} style={{ "--i": i } as React.CSSProperties}>
            <HardwareCard section={section} />
          </div>
        ))}
      </Reveal>
    );
  }
  return (
    <Reveal stagger delay={60} className="border-t border-dashed border-zinc-200 dark:border-zinc-800">
      {group.sections.map((section, i) => (
        <div key={section.title} style={{ "--i": i } as React.CSSProperties}>
          <SoftwareRow section={section} />
        </div>
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
      <div className="py-7">
        {group.note && (
          <Reveal className="mb-7">
            <figure className="relative border-l border-zinc-300 pl-4 dark:border-zinc-700">
              <blockquote className="font-serif text-[21px] italic leading-[1.35] text-zinc-700 dark:text-zinc-200 sm:text-[23px]">{group.note}</blockquote>
            </figure>
          </Reveal>
        )}
        <GroupContent group={group} />
        {group.comingSoon && (
          <Reveal className="mt-4">
            <div className="rounded-[10px] border border-dashed border-zinc-200 px-4 py-5 dark:border-zinc-800">
              <p className="font-ui text-[12px] font-semibold tracking-[-0.005em] text-zinc-400 dark:text-zinc-500">
                Coming soon · {group.comingSoon.title}
              </p>
              <p className="mt-1.5 text-[13px] text-zinc-600 dark:text-zinc-400">{group.comingSoon.text}</p>
            </div>
          </Reveal>
        )}
        <Reveal>
          <OtherPages current={group.slug} />
        </Reveal>
      </div>
    </PageShell>
  );
}
