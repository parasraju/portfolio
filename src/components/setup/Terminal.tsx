import Link from "next/link";
import { setupGroups, type SetupGroup } from "./setupData";

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800">
      <span className="flex gap-1.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </span>
      <span className="flex-1 text-center font-mono text-[10.5px] text-zinc-400 dark:text-zinc-500">{title}</span>
      <span className="w-[42px]" aria-hidden="true" />
    </div>
  );
}

function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p className="whitespace-nowrap">
      <span className="text-emerald-600 dark:text-emerald-400">paras</span>
      <span className="text-zinc-400 dark:text-zinc-500">@dev</span> <span className="text-sky-600 dark:text-sky-400">~</span>{" "}
      <span className="text-zinc-400 dark:text-zinc-500">%</span> {children}
    </p>
  );
}

export function TerminalPreview() {
  return (
    <div className="mt-4 overflow-hidden rounded-[10px] border border-zinc-200 bg-zinc-50/80 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] dark:border-zinc-800 dark:bg-[#0b0b0c]">
      <WindowChrome title="paras — zsh — 80×12" />
      <div className="space-y-1.5 overflow-x-auto px-4 py-3.5 font-mono text-[11.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        <Prompt>
          <span className="typewriter" style={{ "--chars": 10 } as React.CSSProperties}>
            ls ~/setup
          </span>
        </Prompt>
        <div className="terminal-output flex flex-wrap gap-x-6 gap-y-1 pl-0.5">
          {setupGroups.map((group) => (
            <Link key={group.id} href={`/setup/#${group.id}`} className="group inline-flex items-center gap-1.5 text-zinc-900 transition-colors hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400">
              <span className="text-zinc-400 transition-colors group-hover:text-current dark:text-zinc-600">▸</span>
              {group.id}/
            </Link>
          ))}
        </div>
        <Prompt>
          <span className="terminal-caret inline-block h-[13px] w-[7px] translate-y-[2px] bg-zinc-800 dark:bg-zinc-200" />
        </Prompt>
      </div>
    </div>
  );
}

function GroupBody({ group }: { group: SetupGroup }) {
  if (group.items.length === 0) {
    return (
      <p className="text-zinc-400 dark:text-zinc-500">
        <span className="text-amber-600 dark:text-amber-400">warn</span> nothing here yet — being written, check back soon.
      </p>
    );
  }
  return (
    <ul className="space-y-1">
      {group.items.map((item) => (
        <li key={item.name} className="flex gap-3">
          <span className="text-zinc-400 dark:text-zinc-600">–</span>
          <span className="text-zinc-900 dark:text-zinc-100">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4">
                {item.name}
              </a>
            ) : (
              item.name
            )}
          </span>
          {item.detail && <span className="text-zinc-500 dark:text-zinc-400">{item.detail}</span>}
        </li>
      ))}
    </ul>
  );
}

export function SetupWindow({ group }: { group: SetupGroup }) {
  return (
    <section id={group.id} className="scroll-mt-24 overflow-hidden rounded-[10px] border border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-[#0b0b0c]">
      <WindowChrome title={`~/${group.id}`} />
      <div className="px-4 py-4">
        <h2 className="font-serif text-[26px] leading-none text-zinc-900 dark:text-zinc-50">{group.title}</h2>
        <p className="mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400">{group.blurb}</p>
        <div className="mt-4 space-y-2 overflow-x-auto font-mono text-[11.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          <Prompt>{group.command}</Prompt>
          <GroupBody group={group} />
        </div>
      </div>
    </section>
  );
}
