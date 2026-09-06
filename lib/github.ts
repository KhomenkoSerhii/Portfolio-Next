import "server-only";

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type GitHubActivityData = {
  days: ContributionDay[];
  total: number | null;
  activeDays: number | null;
  currentStreak: number | null;
  longestStreak: number | null;
  live: boolean;
};

const USERNAME = "KhomenkoSerhii";
const REVALIDATE_SECONDS = 21_600;
export const FIRST_CONTRIBUTION_YEAR = 2019;

const levelMap = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

function calculateStreaks(days: ContributionDay[]) {
  let longest = 0;
  let running = 0;

  for (const day of days) {
    if (day.count > 0) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 0;
    }
  }

  let cursor = days.length - 1;
  const today = new Date().toISOString().slice(0, 10);
  if (cursor >= 0 && days[cursor].date === today && days[cursor].count === 0) {
    cursor -= 1;
  }

  let current = 0;
  while (cursor >= 0 && days[cursor].count > 0) {
    current += 1;
    cursor -= 1;
  }

  return { current, longest };
}

function toActivity(days: ContributionDay[], total?: number): GitHubActivityData {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const streaks = calculateStreaks(sorted);

  return {
    days: sorted,
    total: total ?? sorted.reduce((sum, day) => sum + day.count, 0),
    activeDays: sorted.filter((day) => day.count > 0).length,
    currentStreak: streaks.current,
    longestStreak: streaks.longest,
    live: true,
  };
}

function yearRange(year?: number) {
  if (year === undefined) return null;

  return {
    from: `${year}-01-01T00:00:00.000Z`,
    to: `${year}-12-31T23:59:59.999Z`,
  };
}

async function fetchWithGraphQL(
  token: string,
  year?: number
): Promise<GitHubActivityData | null> {
  const range = yearRange(year);
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "serhii-khomenko-portfolio",
    },
    body: JSON.stringify({
      query: `
        query PortfolioContributions($login: String!, $from: DateTime, $to: DateTime) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    contributionLevel
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        login: USERNAME,
        from: range?.from ?? null,
        to: range?.to ?? null,
      },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(7_000),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions?: number;
            weeks?: Array<{
              contributionDays?: Array<{
                contributionCount: number;
                contributionLevel: keyof typeof levelMap;
                date: string;
              }>;
            }>;
          };
        };
      };
    };
  };

  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar?.weeks) return null;

  const days = calendar.weeks.flatMap((week) =>
    (week.contributionDays ?? []).map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: levelMap[day.contributionLevel] ?? 0,
    }))
  );

  return toActivity(days, calendar.totalContributions);
}

async function fetchPublicCalendar(year?: number): Promise<GitHubActivityData | null> {
  const query = year ? `?from=${year}-01-01&to=${year}-12-31` : "";
  const response = await fetch(
    `https://github.com/users/${USERNAME}/contributions${query}`,
    {
      headers: {
        Accept: "text/html",
        "User-Agent": "serhii-khomenko-portfolio",
      },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(7_000),
    }
  );

  if (!response.ok) return null;
  const html = await response.text();
  const totalMatch = html.match(
    /<h2[^>]*id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s*contributions/i
  );
  const total = totalMatch ? Number(totalMatch[1].replaceAll(",", "")) : undefined;
  const days: ContributionDay[] = [];
  const dayPattern =
    /<td\b([^>]*\bclass="ContributionCalendar-day"[^>]*)><\/td>\s*<tool-tip\b[^>]*>([^<]*)<\/tool-tip>/g;

  for (const match of html.matchAll(dayPattern)) {
    const attributes = match[1];
    const date = attributes.match(/data-date="([^"]+)"/)?.[1];
    const rawLevel = attributes.match(/data-level="([0-4])"/)?.[1];
    if (!date || rawLevel === undefined) continue;

    const countMatch = match[2].match(/^([\d,]+) contribution/);
    days.push({
      date,
      count: countMatch ? Number(countMatch[1].replaceAll(",", "")) : 0,
      level: Number(rawLevel) as ContributionDay["level"],
    });
  }

  return days.length > 300 ? toActivity(days, total) : null;
}

function unavailableCalendar(year?: number): GitHubActivityData {
  const days: ContributionDay[] = [];
  const start = year
    ? new Date(Date.UTC(year, 0, 1))
    : new Date(Date.now() - 370 * 86_400_000);
  const end = year ? new Date(Date.UTC(year, 11, 31)) : new Date();

  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    days.push({
      date: cursor.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    });
  }

  return {
    days,
    total: null,
    activeDays: null,
    currentStreak: null,
    longestStreak: null,
    live: false,
  };
}

async function loadGitHubActivity(year?: number): Promise<GitHubActivityData> {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const graphData = await fetchWithGraphQL(token, year);
      if (graphData) return graphData;
    }

    return (await fetchPublicCalendar(year)) ?? unavailableCalendar(year);
  } catch {
    return unavailableCalendar(year);
  }
}

export async function getGitHubActivity(): Promise<GitHubActivityData> {
  return loadGitHubActivity();
}

export async function getGitHubActivityForYear(
  year: number
): Promise<GitHubActivityData> {
  return loadGitHubActivity(year);
}

export const githubUsername = USERNAME;
