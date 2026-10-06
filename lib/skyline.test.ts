import { describe, expect, it } from "vitest";
import { monthMarkers, toSkyline } from "@/lib/skyline";

const day = (date: string, count: number, level: 0 | 1 | 2 | 3 | 4) => ({ date, count, level });

describe("toSkyline", () => {
  it("returns nothing for an empty calendar", () => {
    expect(toSkyline([])).toEqual({ stacks: [], columns: 0, cubeCount: 0 });
  });

  it("lays days out week by week, Sunday to Saturday", () => {
    const days = Array.from({ length: 14 }, (_, i) =>
      day(`2026-01-${String(i + 4).padStart(2, "0")}`, 0, 0)
    );
    const { stacks, columns } = toSkyline(days);
    expect(columns).toBe(2);
    expect(stacks[0]).toMatchObject({ column: 0, row: 0 });
    expect(stacks[6]).toMatchObject({ column: 0, row: 6 });
    expect(stacks[7]).toMatchObject({ column: 1, row: 0 });
  });

  it("stacks one cube per activity level and counts them all", () => {
    const { stacks, cubeCount } = toSkyline([
      day("2026-01-04", 0, 0),
      day("2026-01-05", 2, 1),
      day("2026-01-06", 16, 4),
    ]);
    expect(stacks.map((s) => s.cubes)).toEqual([0, 1, 4]);
    expect(cubeCount).toBe(5);
  });

  it("keeps the source day on every stack for tooltips", () => {
    const { stacks } = toSkyline([day("2026-01-04", 3, 1)]);
    expect(stacks[0]).toMatchObject({ date: "2026-01-04", count: 3, level: 1 });
  });
});

describe("monthMarkers", () => {
  it("labels the first week column of each month", () => {
    // 2026-01-25 is a Sunday; columns start 25 Jan, 1 Feb, 8 Feb, 15 Feb, 22 Feb, 1 Mar
    const days = Array.from({ length: 42 }, (_, i) => {
      const date = new Date(Date.UTC(2026, 0, 25 + i)).toISOString().slice(0, 10);
      return day(date, 0, 0);
    });
    // the partial January column is dropped: FEB right next to it would overlap
    expect(monthMarkers(toSkyline(days).stacks)).toEqual([
      { column: 1, label: "FEB" },
      { column: 5, label: "MAR" },
    ]);
  });

  it("keeps the leading month when there is room before the next one", () => {
    // starts Sunday 4 Jan 2026: JAN at 0, FEB at 4
    const days = Array.from({ length: 35 }, (_, i) => {
      const date = new Date(Date.UTC(2026, 0, 4 + i)).toISOString().slice(0, 10);
      return day(date, 0, 0);
    });
    expect(monthMarkers(toSkyline(days).stacks)).toEqual([
      { column: 0, label: "JAN" },
      { column: 4, label: "FEB" },
    ]);
  });

  it("returns nothing for an empty calendar", () => {
    expect(monthMarkers([])).toEqual([]);
  });
});
