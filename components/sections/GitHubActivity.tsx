"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { CountUp } from "@/components/fx/CountUp";
import { Blueprint } from "@/components/motion/Blueprint";
import { DecodeText } from "@/components/motion/DecodeText";
import { DrawnText } from "@/components/motion/DrawnText";
import type { ContributionDay, GitHubActivityData } from "@/lib/github";

// three.js only loads when the 3D view actually renders
const ContributionSkyline = dynamic(
  () => import("@/components/three/ContributionSkyline"),
  {
    ssr: false,
    loading: () => <div className="h-[180px] sm:h-[300px]" />,
  }
);

type View = "3d" | "grid";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

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
    const next = monthFormatter.format(date);
    labels.push(next === previous ? "" : next);
    previous = next;
  }

  return labels;
}

function Stat({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="min-w-0 border-l border-[var(--line)] pl-3 sm:pl-4">
      <p className="display text-3xl sm:text-4xl">
        {value === null ? "-" : <CountUp to={value} />}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-[var(--muted)] sm:text-base">
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
  // reduced-motion visitors get the flat grid unless they pick 3D themselves
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
  const [chosenView, setView] = useState<View | null>(null);
  const view: View = chosenView ?? (reducedMotion ? "grid" : "3d");

  const selectedActivity = activityByYear[selectedYear];
  const days = useMemo(
    () => normaliseCalendar(selectedActivity?.days ?? []),
    [selectedActivity]
  );
  const labels = useMemo(() => monthLabels(days), [days]);
  const dateRange = useMemo(() => {
    if (!selectedActivity?.days.length) return `Loading ${selectedYear}`;
    const first = new Date(`${selectedActivity.days[0].date}T00:00:00Z`);
    const last = new Date(
      `${selectedActivity.days[selectedActivity.days.length - 1].date}T00:00:00Z`
    );
    return `${dateFormatter.format(first)} - ${dateFormatter.format(last)}`;
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
  const periodLabel =
    selectedYear === currentYear ? "the last year" : selectedYear;

  return (
    <section id="activity" className="section-shell section-pad">
      <Blueprint className="section-heading">
        <div>
          <h2 data-bp-box>
            <DrawnText>Shipping leaves a trace.</DrawnText>
          </h2>
        </div>
        <div className="max-w-md">
          <p
            className="text-lg leading-snug text-[var(--muted)]"
            data-bp-box
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <DecodeText
              delay={700}
              text="Public GitHub contributions by year. Choose a year to inspect the work rhythm without rearranging the timeline."
            />
          </p>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="button-secondary button-inline mt-5"
          >
            <span>GitHub / @{username}</span>
            <span aria-hidden="true" className="shrink-0">
              ↗
            </span>
          </a>
        </div>
      </Blueprint>

      <div className="activity-panel border-b-4 border-[var(--foreground)] py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_7rem] lg:gap-8">
          <div className="min-w-0">
            <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="display text-2xl sm:text-3xl">
                  {selectedActivity?.total ?? "-"} contributions in{" "}
                  {periodLabel}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isLive
                        ? "pulse-dot bg-[var(--signal)]"
                        : "bg-[var(--muted)]"
                    }`}
                  />
                  <p className="text-sm font-medium text-[var(--muted)] sm:text-base">
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
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <div
                  role="group"
                  aria-label="Calendar view"
                  className="flex border-2 border-[var(--foreground)]"
                >
                  {(["3d", "grid"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={view === option}
                      onClick={() => setView(option)}
                      className={`min-h-10 px-4 text-sm font-bold transition-colors ${
                        view === option
                          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                    >
                      {option === "3d" ? "3D" : "Grid"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={`contribution-day level-${level}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="mb-6 border-y border-[var(--line)] py-4">
              <p className="text-sm font-medium text-[var(--muted)]">
                Visible date range
              </p>
              <p className="mt-1 text-base font-semibold">{dateRange}</p>
            </div>

            <div
              className={`min-h-[148px] overflow-x-auto pb-3 transition-opacity [scrollbar-width:thin] ${
                isLoading ? "opacity-35" : "opacity-100"
              }`}
              aria-busy={isLoading}
            >
              {days.length > 0 && view === "3d" ? (
                <ContributionSkyline days={days} />
              ) : days.length > 0 ? (
                <div className="min-w-[760px]">
                  <div className="mb-2 grid grid-cols-12 gap-3 px-1 text-xs font-medium text-[var(--muted)]">
                    {labels.map((label, index) => (
                      <span key={`${label}-${index}`}>{label}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="grid h-[108px] shrink-0 grid-rows-7 gap-1 pt-[17px] text-[11px] font-medium leading-none text-[var(--muted)]">
                      <span />
                      <span>Mon</span>
                      <span />
                      <span>Wed</span>
                      <span />
                      <span>Fri</span>
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
                          style={{
                            animationDelay: `${Math.min(index * 4, 900)}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-[132px] items-center justify-center border border-dashed border-[var(--line)] text-sm font-medium text-[var(--muted)]">
                  {loadError
                    ? "Select the year to retry"
                    : `Loading ${selectedYear}`}
                </div>
              )}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <Stat
                value={isLive ? selectedActivity.total : null}
                label="contributions"
              />
              <Stat
                value={isLive ? selectedActivity.activeDays : null}
                label="active days"
              />
              <Stat
                value={isLive ? selectedActivity.currentStreak : null}
                label={
                  selectedYear === currentYear
                    ? "current streak"
                    : "year-end streak"
                }
              />
              <Stat
                value={isLive ? selectedActivity.longestStreak : null}
                label="longest streak"
              />
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
                  className={`min-h-11 min-w-[5.25rem] shrink-0 px-4 text-left text-base font-bold tabular-nums transition-colors focus-visible:outline-offset-2 lg:w-full lg:min-w-0 ${
                    active
                      ? "bg-[var(--accent)] text-[var(--accent-ink)]"
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
