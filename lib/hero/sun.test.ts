import { describe, it, expect } from "vitest";
import { dayPhase, subsolarPoint } from "@/lib/hero/sun";

describe("subsolarPoint", () => {
  it("puts the sun over the southern tropics in early November", () => {
    const { lat, lon } = subsolarPoint(new Date(Date.UTC(2026, 10, 6, 12)));
    expect(lat).toBeCloseTo(-16.1, 0);
    // noon UTC, shifted by the equation of time (about +16 minutes in November)
    expect(lon).toBeCloseTo(-4.1, 0);
  });

  it("puts the sun over the Tropic of Cancer at the June solstice", () => {
    expect(subsolarPoint(new Date(Date.UTC(2026, 5, 21, 12))).lat).toBeCloseTo(23.44, 1);
  });
});

describe("dayPhase", () => {
  it("tells day, twilight and night from the sun's height", () => {
    expect(dayPhase(0.4)).toBe("day");
    expect(dayPhase(0)).toBe("twilight");
    expect(dayPhase(-0.4)).toBe("night");
  });
});
