"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { monthMarkers, toSkyline, type CubeStack, type SkylineDay } from "@/lib/skyline";
import { useTheme } from "@/lib/theme/ThemeProvider";

const SPACING = 0.22;
const CUBE = 0.17;
const CUBE_STEP = 0.2; // cube height plus the gap that keeps each cube readable
const TILE_HEIGHT = 0.03;
const WEEKDAYS = [
  { row: 1, label: "MON" },
  { row: 3, label: "WED" },
  { row: 5, label: "FRI" },
] as const;

// camera looks down at the grid from this direction; distance adapts to width
const VIEW_DIRECTION = new THREE.Vector3(0, 2.9, 4.7).normalize();
const MIN_DISTANCE = 5.5;
const LOOK_AT = new THREE.Vector3(0, 0.35, 0.2);

const palettes = {
  dark: { tile: "#1c221b", levels: ["#1c221b", "#3f5a1d", "#6e9a24", "#a6dc32", "#d7ff55"] },
  light: { tile: "#d6d3c7", levels: ["#d6d3c7", "#b9d77a", "#8fbf2c", "#6a9a12", "#4a7000"] },
  "blue-hour": { tile: "#d6dcfa", levels: ["#d6dcfa", "#aab9f2", "#6db3ff", "#2a66ff", "#0c30ad"] },
} as const;

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function Cubes({
  stacks,
  columns,
  cubeCount,
  palette,
  hovered,
  onHover,
}: {
  stacks: CubeStack[];
  columns: number;
  cubeCount: number;
  palette: (typeof palettes)[keyof typeof palettes];
  hovered: number | null;
  onHover: (day: number | null) => void;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const tilesRef = useRef<THREE.InstancedMesh>(null);
  const cubesRef = useRef<THREE.InstancedMesh>(null);

  // cube instance -> day index, so hovering any cube highlights its whole stack
  const cubeDay = useMemo(
    () => stacks.flatMap((stack, day) => Array.from({ length: stack.cubes }, () => day)),
    [stacks]
  );

  useLayoutEffect(() => {
    const tiles = tilesRef.current;
    const cubes = cubesRef.current;
    if (!tiles || !cubes) return;

    const object = new THREE.Object3D();
    const color = new THREE.Color();
    let cubeIndex = 0;

    stacks.forEach((stack, day) => {
      const x = (stack.column - (columns - 1) / 2) * SPACING;
      const z = (stack.row - 3) * SPACING;
      const active = day === hovered;

      object.position.set(x, TILE_HEIGHT / 2, z);
      object.scale.set(CUBE, TILE_HEIGHT, CUBE);
      object.updateMatrix();
      tiles.setMatrixAt(day, object.matrix);
      tiles.setColorAt(day, color.set(active ? "#ffffff" : palette.tile));

      for (let level = 0; level < stack.cubes; level += 1) {
        object.position.set(x, TILE_HEIGHT + CUBE / 2 + level * CUBE_STEP, z);
        object.scale.set(CUBE, CUBE, CUBE);
        object.updateMatrix();
        cubes.setMatrixAt(cubeIndex, object.matrix);
        cubes.setColorAt(cubeIndex, color.set(active ? "#ffffff" : palette.levels[stack.level]));
        cubeIndex += 1;
      }
    });

    tiles.count = stacks.length;
    cubes.count = cubeCount;
    for (const mesh of [tiles, cubes]) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
    // the canvas renders on demand, so ask for a frame after every update
    invalidate();
  }, [stacks, columns, cubeCount, palette, hovered, invalidate]);

  const hover = (toDay: (id: number) => number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHover(event.instanceId === undefined ? null : toDay(event.instanceId));
  };

  return (
    <group>
      <instancedMesh
        ref={tilesRef}
        args={[undefined, undefined, Math.max(stacks.length, 1)]}
        onPointerMove={hover((id) => id)}
        onPointerOut={() => onHover(null)}
      >
        <boxGeometry />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </instancedMesh>
      <instancedMesh
        ref={cubesRef}
        args={[undefined, undefined, Math.max(cubeCount, 1)]}
        onPointerMove={hover((id) => cubeDay[id])}
        onPointerOut={() => onHover(null)}
      >
        <boxGeometry />
        <meshStandardMaterial color="#ffffff" roughness={0.45} metalness={0.05} />
      </instancedMesh>
    </group>
  );
}

// month names along the front edge and weekday names on the left, like GitHub's grid
function Labels({ stacks, columns }: { stacks: CubeStack[]; columns: number }) {
  const markers = useMemo(() => monthMarkers(stacks), [stacks]);
  const left = (-(columns - 1) / 2) * SPACING;
  const label = "pointer-events-none whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--muted)]";

  return (
    <>
      {/* narrow screens: every other month, no weekdays, so labels don't collide */}
      {markers.map((marker, index) => (
        <Html
          key={`${marker.column}-${marker.label}`}
          position={[left + marker.column * SPACING, 0, 3.9 * SPACING]}
          zIndexRange={[1, 0]}
        >
          <span className={`${label} ${index % 2 ? "hidden sm:inline" : ""}`}>{marker.label}</span>
        </Html>
      ))}
      {WEEKDAYS.map((weekday) => (
        <Html
          key={weekday.label}
          position={[left - 3 * SPACING, 0, (weekday.row - 3) * SPACING]}
          center
          zIndexRange={[1, 0]}
        >
          {/* backed chip: the first week's tall stacks can sit right behind these */}
          <span className={`${label} hidden bg-[var(--background)]/85 px-1 py-0.5 sm:inline`}>
            {weekday.label}
          </span>
        </Html>
      ))}
    </>
  );
}

// pull the camera back on narrow screens so the whole year stays in frame
function FitCamera({ width }: { width: number }) {
  const { camera, size, invalidate } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const aspect = size.width / size.height;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    // a little extra room on the sides for the weekday labels
    const fit = (width * 0.64) / (Math.tan(halfFov) * aspect);
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(Math.max(MIN_DISTANCE, fit));
    camera.lookAt(LOOK_AT);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, width, invalidate]);

  return null;
}

export default function ContributionSkyline({ days }: { days: SkylineDay[] }) {
  const { theme } = useTheme();
  const [hovered, setHovered] = useState<number | null>(null);
  const { stacks, columns, cubeCount } = useMemo(() => toSkyline(days), [days]);

  const day = hovered !== null ? stacks[hovered] : null;

  return (
    <div className="relative h-[180px] sm:h-[300px]" aria-hidden>
      <Canvas
        frameloop="demand"
        camera={{ fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <FitCamera width={columns * SPACING} />
        <ambientLight intensity={theme === "dark" ? 0.9 : 1.4} />
        <directionalLight position={[-4, 8, 6]} intensity={2.2} />
        <pointLight position={[4, 3, 3]} intensity={8} distance={12} color={theme === "blue-hour" ? "#2a66ff" : "#c8f542"} />
        <Labels stacks={stacks} columns={columns} />
        <Cubes
          stacks={stacks}
          columns={columns}
          cubeCount={cubeCount}
          palette={palettes[theme]}
          hovered={hovered}
          onHover={setHovered}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-0 top-0 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {day ? (
          <span className="text-[var(--foreground)]">
            {day.count} contribution{day.count === 1 ? "" : "s"} ·{" "}
            {dateFormatter.format(new Date(`${day.date}T00:00:00Z`))}
          </span>
        ) : (
          "Hover a stack · one cube per activity level"
        )}
      </div>
    </div>
  );
}
