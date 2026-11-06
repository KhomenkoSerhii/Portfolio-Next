// Where the sun is overhead at a given moment, so the hero planet shows real day and night.
// Low-precision solar position (the Astronomical Almanac's short formula), good to about 0.1°.

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const J2000 = Date.UTC(2000, 0, 1, 12);

export function subsolarPoint(date: Date): { lat: number; lon: number } {
  const d = (date.getTime() - J2000) / 86_400_000;
  const meanAnomaly = (357.529 + 0.98560028 * d) * RAD;
  const meanLongitude = 280.459 + 0.98564736 * d;
  const eclipticLongitude =
    (meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly)) * RAD;
  const obliquity = (23.439 - 0.00000036 * d) * RAD;

  const rightAscension =
    Math.atan2(Math.cos(obliquity) * Math.sin(eclipticLongitude), Math.cos(eclipticLongitude)) * DEG;
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(eclipticLongitude)) * DEG;
  const siderealHours = (((18.697374558 + 24.06570982441908 * d) % 24) + 24) % 24;

  const lon = ((rightAscension - siderealHours * 15 + 540) % 360) - 180;
  return { lat: declination, lon };
}

/** `sunHeight` is the dot product of the surface normal and the sun direction */
export function dayPhase(sunHeight: number): "day" | "twilight" | "night" {
  if (sunHeight > 0.05) return "day";
  if (sunHeight > -0.1) return "twilight";
  return "night";
}
