"use client";

import { useEffect, useMemo, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { GitHubContributions } from "./GitHubContributions";

type ApiDay = { date: string; contributionCount: number; contributionLevel?: string };
type Week = { contributionDays: ApiDay[] };
type ApiData = { totalContributions: number; weeks: Week[] };

type Cell = { date: string; count: number; inRange: boolean };

// GitHub's own contribution palette — green in both themes.
const GREEN: Record<number, string> = {
  0: "bg-[#ebedf0] dark:bg-[#161b22]",
  1: "bg-[#9be9a8] dark:bg-[#0e4429]",
  2: "bg-[#40c463] dark:bg-[#006d32]",
  3: "bg-[#30a14e] dark:bg-[#26a641]",
  4: "bg-[#216e39] dark:bg-[#39d353]",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const iso = (date: Date) => date.toISOString().slice(0, 10);

function levelFor(count: number, max: number) {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function formatTooltip(count: number, dateStr: string) {
  const date = new Date(dateStr + "T00:00:00Z");
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  if (count === 0) return `No contributions on ${formatted}`;
  return `${count} contribution${count === 1 ? "" : "s"} on ${formatted}`;
}

function ContributionDay({
  cell,
  level,
  column,
  totalColumns,
}: {
  cell: Cell;
  level: number;
  column: number;
  totalColumns: number;
}) {
  const [show, setShow] = useState(false);
  const alignment =
    column <= 1 ? "left-0" : column >= totalColumns - 2 ? "right-0" : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative aspect-square w-full">
      <div
        role="img"
        aria-label={formatTooltip(cell.count, cell.date)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={`h-full w-full rounded-[2px] ${GREEN[level]} ${
          level === 0 ? "ring-1 ring-inset ring-black/[0.04] dark:ring-white/[0.03]" : ""
        }`}
      />
      {show && (
        <div className={`pointer-events-none absolute bottom-full z-30 mb-1.5 ${alignment}`}>
          <div className="whitespace-nowrap rounded-[5px] border border-zinc-700 bg-[#1a1a1a] px-2 py-1 text-[10px] leading-none text-zinc-100 shadow-lg">
            {formatTooltip(cell.count, cell.date)}
          </div>
        </div>
      )}
    </div>
  );
}

export function GitHubActivity() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(withBasePath("/api/github/contributions"));
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        if (json.error && (!json.weeks || json.weeks.length === 0)) throw new Error(json.error);
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const model = useMemo(() => {
    const currentYear = new Date().getFullYear();
    if (!data) {
      return { weeks: [] as Cell[][], total: 0, max: 0, year: currentYear, labels: [] as { index: number; label: string }[] };
    }

    const counts = new Map<string, number>();
    for (const week of data.weeks) {
      for (const day of week.contributionDays) counts.set(day.date, day.contributionCount);
    }

    // Show Jan 1 of the current year through today, but keep every column a full
    // Sunday–Saturday week so the calendar never shifts out of alignment.
    const now = new Date();
    const year = now.getFullYear();
    const start = new Date(Date.UTC(year, 0, 1));
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + (6 - end.getUTCDay()));

    const cursor = new Date(start);
    cursor.setUTCDate(cursor.getUTCDate() - cursor.getUTCDay());

    const weeks: Cell[][] = [];
    let total = 0;
    let max = 0;

    while (cursor <= end) {
      const week: Cell[] = [];
      for (let i = 0; i < 7; i += 1) {
        const day = new Date(cursor);
        day.setUTCDate(cursor.getUTCDate() + i);
        const key = iso(day);
        const inRange = day >= start && day <= today;
        const count = inRange ? counts.get(key) ?? 0 : 0;
        if (inRange) {
          total += count;
          if (count > max) max = count;
        }
        week.push({ date: key, count, inRange });
      }
      weeks.push(week);
      cursor.setUTCDate(cursor.getUTCDate() + 7);
    }

    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const first = week.find((cell) => cell.inRange);
      if (!first) return;
      const month = new Date(first.date + "T00:00:00Z").getUTCMonth();
      if (month !== lastMonth) {
        labels.push({ index, label: MONTHS[month] });
        lastMonth = month;
      }
    });

    return { weeks, total, max, year, labels };
  }, [data]);

  if (loading) {
    return (
      <section id="opensource" className="scroll-mt-24 border-t border-dashed border-zinc-200 py-6 dark:border-zinc-800">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-white sm:text-[20px]">GitHub Activity</h2>
          <span className="text-[12px] text-zinc-500">Loading…</span>
        </div>
        <div className="w-full animate-pulse">
          <div className="mb-2 flex w-full gap-[2px] sm:gap-[3px]">
            {Array.from({ length: 45 }).map((_, index) => (
              <div key={index} className="h-2.5 flex-1 rounded bg-zinc-200/70 dark:bg-zinc-800/60" />
            ))}
          </div>
          <div className="flex w-full gap-[2px] sm:gap-[3px]">
            {Array.from({ length: 45 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-1 flex-col gap-[2px] sm:gap-[3px]">
                {Array.from({ length: 7 }).map((__, dayIndex) => (
                  <div key={dayIndex} className="aspect-square w-full rounded-[2px] bg-zinc-200/70 dark:bg-zinc-800/60" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !data || model.weeks.length === 0) {
    return (
      <section id="opensource" className="scroll-mt-24 border-t border-dashed border-zinc-200 py-6 dark:border-zinc-800">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-white sm:text-[20px]">GitHub Activity</h2>
          <a href="https://github.com/parasraju" target="_blank" rel="noopener noreferrer" className="text-[12px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            View profile ↗
          </a>
        </div>
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
          Unable to load contributions right now. The live calendar is on{" "}
          <a href="https://github.com/parasraju" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-4">
            github.com/parasraju
          </a>
          .
        </p>
      </section>
    );
  }

  return (
    <section id="opensource" className="scroll-mt-24 border-t border-dashed border-zinc-200 py-6 dark:border-zinc-800">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-white sm:text-[20px]">GitHub Activity</h2>
        <div className="flex items-baseline gap-2.5">
          <span className="text-[12px] text-zinc-500 dark:text-zinc-400 sm:text-[13px]">
            {model.total.toLocaleString()} contributions in {model.year}
          </span>
          <a href="https://github.com/parasraju" target="_blank" rel="noopener noreferrer" className="text-[11.5px] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            View profile ↗
          </a>
        </div>
      </div>

      <div className="w-full">
        {/* Month labels share the same column geometry as the grid. */}
        <div className="mb-1.5 flex h-3.5 w-full gap-[2px] sm:gap-[3px]">
          {model.weeks.map((_, index) => {
            const label = model.labels.find((entry) => entry.index === index);
            return (
              <div key={index} className="relative min-w-0 flex-1">
                {label && (
                  <span className="absolute left-0 top-0 whitespace-nowrap text-[9.5px] leading-none text-zinc-500 dark:text-zinc-400 sm:text-[10.5px]">
                    {label.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Full 7-row columns, flexed to fit the column width — no scrolling. */}
        <div className="flex w-full gap-[2px] sm:gap-[3px]">
          {model.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex min-w-0 flex-1 flex-col gap-[2px] sm:gap-[3px]">
              {week.map((cell) =>
                cell.inRange ? (
                  <ContributionDay
                    key={cell.date}
                    cell={cell}
                    level={levelFor(cell.count, model.max)}
                    column={weekIndex}
                    totalColumns={model.weeks.length}
                  />
                ) : (
                  <div key={cell.date} className="aspect-square w-full" />
                )
              )}
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">Less active</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-[2px] sm:gap-[3px]">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`h-[10px] w-[10px] rounded-[2px] sm:h-3 sm:w-3 ${GREEN[level]}`} />
              ))}
            </div>
            <span className="text-[10.5px] text-zinc-500 dark:text-zinc-400">More active</span>
          </div>
        </div>
      </div>

      <GitHubContributions />
    </section>
  );
}
