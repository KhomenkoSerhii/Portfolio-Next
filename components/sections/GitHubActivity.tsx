"use client";

import { useMemo, useState } from "react";
import type { ContributionDay, GitHubActivityData } from "@/lib/github";

const FIRST_CONTRIBUTION_YEAR = 2019;
const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });
const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function normaliseCalendar(days: ContributionDay[]) {
  if (days.length === 0) return [];

  const result = [...days];
  const first = new Date(`${result[0].date}T00:00:00Z`);
  const last = new Date(`${result[result.length - 1].date}T00:00:00Z`);
  const leading: ContributionDay[] = [];

  for (let offset = first.getUTCDay(); offset > 0; offset -= 1) {
    const date = new Date(first);
    date.setUTCDate(first.getUTCDate() - offset);
    leading.push({ date: date.toISOString().slice(0, 10), count: 0, level: 0 });
  }

  for (let day = last.getUTCDay() + 1; day <= 6; day += 1) {
    const date = new Date(last);
    date.setUTCDate(last.getUTCDate() + day - last.getUTCDay());
    result.push({ date: date.toISOString().slice(0, 10), count: 0, level: 0 });
  }

  return [...leading, ...result];
}

function monthLabels(days: ContributionDay[]) {
  if (days.length === 0) return [];
  const labels: string[] = [];
  let previous = "";

  for (let monthOffset = 0; monthOffset < 12; monthOffset += 1) {
    const index = Math.min(
      days.length - 1,
      Math.floor((monthOffset / 11) * (days.length - 1))
    );
    const date = new Date(`${days[index].date}T00:00:00Z`);
    const next = monthFormatter.format(date).toUpperCase();
    labels.push(next === previous ? "" : next);
    previous = next;
  }

  return labels;
}

function Stat({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="min-w-0 border-l border-[var(--line)] pl-3 sm:pl-4">
      <p className="font-display text-2xl font-extrabold tracking-[-0.05em] sm:text-4xl">
        {value ?? "—"}
      </p>
      <p className="mt-1 break-words font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.18em]">
        {label}
      </p>
    </div>
  );
}

export default function GitHubActivity({
  activity,
  username,
}: {
  activity: GitHubActivityData;
  username: string;
}) {
  const currentYear = new Date().getUTCFullYear();
  const years = useMemo(
    () =>
      Array.from(
        { length: currentYear - FIRST_CONTRIBUTION_YEAR + 1 },
        (_, index) => currentYear - index
      ),
    [currentYear]
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activityByYear, setActivityByYear] = useState<
    Record<number, GitHubActivityData>
  >({ [currentYear]: activity });
  const [loadingYear, setLoadingYear] = useState<number | null>(null);
  const [failedYears, setFailedYears] = useState<Record<number, boolean>>({});

  const selectedActivity = activityByYear[selectedYear];
  const days = useMemo(
    () => normaliseCalendar(selectedActivity?.days ?? []),
    [selectedActivity]
  );
  const labels = useMemo(() => monthLabels(days), [days]);
  const dateRange = useMemo(() => {
    if (!selectedActivity?.days.length) return `LOADING ${selectedYear}`;
    const first = new Date(`${selectedActivity.days[0].date}T00:00:00Z`);
    const last = new Date(
      `${selectedActivity.days[selectedActivity.days.length - 1].date}T00:00:00Z`
    );
    return `${dateFormatter.format(first).toUpperCase()} — ${dateFormatter
      .format(last)
      .toUpperCase()}`;
  }, [selectedActivity, selectedYear]);

  async function selectYear(year: number) {
    setSelectedYear(year);
    setFailedYears((current) => ({ ...current, [year]: false }));
    if (activityByYear[year]) return;

    setLoadingYear(year);
    try {
      const response = await fetch(`/api/github-activity?year=${year}`);
      if (!response.ok) throw new Error("Unable to load GitHub activity");
      const nextActivity = (await response.json()) as GitHubActivityData;
      setActivityByYear((current) => ({ ...current, [year]: nextActivity }));
    } catch {
      setFailedYears((current) => ({ ...current, [year]: true }));
    } finally {
      setLoadingYear((current) => (current === year ? null : current));
    }
  }

  const isLoading = loadingYear === selectedYear && !selectedActivity;
  const isLive = selectedActivity?.live ?? false;
  const loadError = failedYears[selectedYear] ?? false;
  const periodLabel = selectedYear === currentYear ? "THE LAST YEAR" : selectedYear;

  return (
    <section id="activity" className="section-shell section-pad content-auto">
      <div className="section-heading">
        <div>
          <p className="section-index">05 / GITHUB ACTIVITY</p>
          <h2>Shipping leaves a trace.</h2>
        </div>
        <div className="max-w-md md:pt-3">
          <p className="text-base leading-relaxed text-[var(--muted)]">
            Public GitHub contributions by year. Choose a year to inspect the
            work rhythm without rearranging the timeline.
          </p>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="button-secondary button-inline mt-5"
          >
            <span>GitHub / @{username}</span>
            <span aria-hidden="true" className="shrink-0">↗</span>
          </a>
        </div>
      </div>

      <div className="activity-panel mt-12 border-y border-[var(--line)] py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_7rem] lg:gap-8">
          <div className="min-w-0">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-xl font-extrabold uppercase tracking-[-0.03em] sm:text-2xl">
                  {selectedActivity?.total ?? "—"} contributions in {periodLabel}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isLive ? "pulse-dot bg-[var(--accent)]" : "bg-[var(--muted)]"
                    }`}
                  />
                  <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[var(--muted)] sm:text-[10px]">
                    {isLoading
                      ? `Loading ${selectedYear}`
                      : loadError
                        ? "Could not load this year"
                        : isLive
                          ? "Live public activity"
                          : "Activity temporarily unavailable"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--muted)] sm:text-[9px] sm:tracking-[0.16em]">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <span key={level} className={`contribution-day level-${level}`} />
                ))}
                <span>More</span>
              </div>
            </div>

            <div className="mb-6 border-y border-[var(--line)] py-4">
              <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Visible date range
              </p>
              <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.12em]">
                {dateRange}
              </p>
            </div>

            <div
              className={`min-h-[148px] overflow-x-auto pb-3 transition-opacity [scrollbar-width:thin] ${
                isLoading ? "opacity-35" : "opacity-100"
              }`}
              aria-busy={isLoading}
            >
              {days.length > 0 ? (
                <div className="min-w-[760px]">
                  <div className="mb-2 grid grid-cols-12 gap-3 px-1 font-mono text-[9px] tracking-[0.16em] text-[var(--muted)]">
                    {labels.map((label, index) => (
                      <span key={`${label}-${index}`}>{label}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="grid h-[108px] shrink-0 grid-rows-7 gap-1 pt-[17px] font-mono text-[9px] text-[var(--muted)]">
                      <span />
                      <span>MON</span>
                      <span />
                      <span>WED</span>
                      <span />
                      <span>FRI</span>
                      <span />
                    </div>
                    <div
                      className="contribution-calendar flex-1"
                      role="img"
                      aria-label={`GitHub contribution calendar for ${selectedYear}, chronological order`}
                    >
                      {days.map((day, index) => (
                        <span
                          key={`${day.date}-${index}`}
                          className={`contribution-day level-${day.level}`}
                          title={`${day.count} contribution${
                            day.count === 1 ? "" : "s"
                          } on ${day.date}`}
                          style={{ animationDelay: `${Math.min(index * 4, 900)}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[132px] items-center justify-center border border-dashed border-[var(--line)] font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted)]">
                  {loadError ? "Select the year to retry" : `Loading ${selectedYear}`}
                </div>
              )}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Stat value={isLive ? selectedActivity.total : null} label="contributions" />
              <Stat value={isLive ? selectedActivity.activeDays : null} label="active days" />
              <Stat
                value={isLive ? selectedActivity.currentStreak : null}
                label={selectedYear === currentYear ? "current streak" : "year-end streak"}
              />
              <Stat value={isLive ? selectedActivity.longestStreak : null} label="longest streak" />
            </div>
          </div>

          <nav
            aria-label="Contribution year"
            className="order-first -mx-1 flex gap-1 overflow-x-auto px-1 pb-2 [scrollbar-width:thin] lg:order-none lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-l lg:border-[var(--line)] lg:px-0 lg:pb-0 lg:pl-4"
          >
            {years.map((year) => {
              const active = selectedYear === year;
              const loading = loadingYear === year && !activityByYear[year];

              return (
                <button
                  key={year}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectYear(year)}
                  className={`min-h-11 min-w-[5.25rem] shrink-0 px-4 text-left font-mono text-xs transition-colors focus-visible:outline-offset-2 lg:w-full lg:min-w-0 ${
                    active
                      ? "bg-[var(--accent)] text-[#11150d]"
                      : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {year}
                  {loading ? (
                    <span className="ml-2" aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
