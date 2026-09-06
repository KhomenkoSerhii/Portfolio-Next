import {
  FIRST_CONTRIBUTION_YEAR,
  getGitHubActivityForYear,
} from "@/lib/github";

export async function GET(request: Request) {
  const year = Number(new URL(request.url).searchParams.get("year"));
  const currentYear = new Date().getUTCFullYear();

  if (
    !Number.isInteger(year) ||
    year < FIRST_CONTRIBUTION_YEAR ||
    year > currentYear
  ) {
    return Response.json({ error: "Invalid contribution year" }, { status: 400 });
  }

  const activity = await getGitHubActivityForYear(year);

  return Response.json(activity, {
    headers: {
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
