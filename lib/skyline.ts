// Turns a GitHub contribution calendar into cube stacks for the 3D view:
// one stack per day, one cube per activity level (0-4).
// Input must already be week-aligned (starts on Sunday), like the 2D grid.

export type SkylineDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type CubeStack = SkylineDay & {
  column: number;
  row: number;
  cubes: number;
};

export function toSkyline(days: SkylineDay[]): {
  stacks: CubeStack[];
  columns: number;
  cubeCount: number;
} {
  const stacks = days.map((d, index) => ({
    ...d,
    column: Math.floor(index / 7),
    row: index % 7,
    cubes: d.level,
  }));

  return {
    stacks,
    columns: Math.ceil(days.length / 7),
    cubeCount: stacks.reduce((sum, s) => sum + s.cubes, 0),
  };
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MIN_LABEL_GAP = 3; // columns; closer labels overlap on screen

// Month labels for the front edge: one per column that contains the 1st of a month.
// The leading partial month is labelled too, unless the next label is too close.
export function monthMarkers(stacks: CubeStack[]): { column: number; label: string }[] {
  const markers: { column: number; label: string }[] = [];

  for (const stack of stacks) {
    const [, month, dayOfMonth] = stack.date.split("-").map(Number);
    const isFirstColumn = stack.column === 0 && stack.row === 0;
    if (dayOfMonth === 1 || isFirstColumn) {
      const label = MONTHS[month - 1];
      if (markers.at(-1)?.column !== stack.column) markers.push({ column: stack.column, label });
      else markers[markers.length - 1] = { column: stack.column, label };
    }
  }

  if (markers.length > 1 && markers[1].column - markers[0].column < MIN_LABEL_GAP) {
    markers.shift();
  }
  return markers;
}
