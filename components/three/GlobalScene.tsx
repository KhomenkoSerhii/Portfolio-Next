"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLUMNS = 28;
const ROWS = 9;
const CELL_COUNT = COLUMNS * ROWS;

function fallbackLevel(index: number) {
  const hash = (index * 47 + index * index * 13 + 19) % 101;
  if (hash > 91) return 4;
  if (hash > 78) return 3;
  if (hash > 60) return 2;
  if (hash > 42) return 1;
  return 0;
}

function ContributionWall({ levels }: { levels: number[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const burstStartedAt = useRef(0);
  const hasLiveLevels = levels.some((level) => level > 0);

  const cells = useMemo(() => {
    const recent = levels.slice(-CELL_COUNT);
    const offset = Math.max(0, CELL_COUNT - recent.length);

    return Array.from({ length: CELL_COUNT }, (_, index) => {
      const sourceIndex = index - offset;
      const level =
        hasLiveLevels && sourceIndex >= 0
          ? Math.max(0, Math.min(4, recent[sourceIndex] ?? 0))
          : fallbackLevel(index);
      const column = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);

      return {
        x: (column - (COLUMNS - 1) / 2) * 0.43,
        y: ((ROWS - 1) / 2 - row) * 0.43,
        depth: 0.08 + level * 0.2,
        level,
      };
    });
  }, [hasLiveLevels, levels]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const object = new THREE.Object3D();
    const colors = ["#242923", "#536a2b", "#84a72f", "#b8e43a", "#d7ff55"];
    const color = new THREE.Color();

    cells.forEach((cell, index) => {
      object.position.set(cell.x, cell.y, cell.depth / 2);
      object.scale.set(0.34, 0.34, cell.depth);
      object.updateMatrix();
      mesh.setMatrixAt(index, object.matrix);
      mesh.setColorAt(index, color.set(colors[cell.level]));
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cells]);

  useEffect(() => {
    const onBurst = () => {
      burstStartedAt.current = performance.now();
    };
    window.addEventListener("egg:burst", onBurst);
    return () => window.removeEventListener("egg:burst", onBurst);
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    const targetX = state.pointer.x * 0.08;
    const targetY = -0.35 + state.pointer.y * 0.05;
    group.position.x += (targetX - group.position.x) * dt * 2.2;
    group.position.y += (targetY - group.position.y) * dt * 2.2;
    group.position.z = Math.sin(state.clock.elapsedTime * 0.45) * 0.04;

    const burstAge = performance.now() - burstStartedAt.current;
    const burst = burstAge < 1_800 ? Math.sin((burstAge / 1_800) * Math.PI) : 0;
    const scale = 1 + burst * 0.18;
    group.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={[0, -0.35, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, CELL_COUNT]}>
        <boxGeometry />
        <meshStandardMaterial
          vertexColors
          color="#ffffff"
          roughness={0.48}
          metalness={0.08}
          emissive="#739313"
          emissiveIntensity={0.16}
        />
      </instancedMesh>

      <gridHelper
        args={[12.2, 28, "#70802f", "#273024"]}
        position={[0, 0, -0.06]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[13.4, 4.8]} />
        <meshStandardMaterial
          color="#111612"
          transparent
          opacity={0.72}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

export default function GlobalScene({ levels = [] }: { levels?: number[] }) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div
      className="absolute inset-0 [animation:scene-enter_1.2s_0.3s_ease_both] motion-reduce:hidden"
      aria-hidden
    >
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 9.4], fov: 44 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={1.25} />
        <directionalLight position={[-4, 5, 7]} intensity={2.5} color="#f1ffd0" />
        <pointLight position={[4, 2, 4]} intensity={11} distance={11} color="#c8f542" />
        <pointLight position={[-4, -1, 3]} intensity={6} distance={9} color="#58d6e6" />
        <ContributionWall levels={levels} />
      </Canvas>
    </div>
  );
}
