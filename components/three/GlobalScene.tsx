"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Site-wide 3D background driven by scroll.
 * The "React atom with a neural core" travels across the screen as you scroll:
 * hero (right) -> experience (left) -> skills (center, network dissolves into
 * a particle cloud) -> projects (right) -> contact (center, reassembled).
 *
 * Easter eggs living here:
 *  - clicking a travelling pulse fires "egg:pulse-caught"
 *  - "egg:game-toggle" turns the atom into a player-controlled collector
 *  - "egg:burst" (navbar logo x5) violently dissolves and reassembles the core
 */

const NODE_COUNT = 160;
const NEIGHBORS = 3;
const CORE_RADIUS = 2.1;
const PULSE_COUNT = 60;
const COLLECTIBLE_COUNT = 8;
const BURST_MS = 2400;

// scroll keyframes: t = page scroll progress 0..1
const KEYFRAMES = [
  { t: 0.0, pos: [2.7, 0.2, -1.0], scale: 0.62, explode: 0.0, spin: 0.12 },
  { t: 0.25, pos: [-3.4, 0.1, -2.0], scale: 0.85, explode: 0.15, spin: 0.2 },
  { t: 0.5, pos: [0.0, 0.0, -3.2], scale: 1.2, explode: 1.0, spin: 0.35 },
  { t: 0.75, pos: [3.2, -0.2, -2.0], scale: 0.85, explode: 0.2, spin: 0.2 },
  { t: 1.0, pos: [0.0, 0.5, -1.6], scale: 0.55, explode: 0.0, spin: 0.45 },
] as const;

function sampleKeyframes(t: number) {
  const clamped = Math.min(Math.max(t, 0), 1);
  let i = 0;
  while (i < KEYFRAMES.length - 2 && clamped > KEYFRAMES[i + 1].t) i++;
  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const span = b.t - a.t;
  const raw = span > 0 ? (clamped - a.t) / span : 0;
  // ease in-out for smoother section transitions
  const k = raw * raw * (3 - 2 * raw);
  const lerp = (x: number, y: number) => x + (y - x) * k;
  return {
    pos: [lerp(a.pos[0], b.pos[0]), lerp(a.pos[1], b.pos[1]), lerp(a.pos[2], b.pos[2])] as const,
    scale: lerp(a.scale, b.scale),
    explode: lerp(a.explode, b.explode),
    spin: lerp(a.spin, b.spin),
  };
}

// React-brand gradient across the sphere: cyan (top) -> teal -> emerald (bottom)
const GRAD_TOP = new THREE.Color("#61dafb");
const GRAD_MID = new THREE.Color("#2dd4bf");
const GRAD_BOTTOM = new THREE.Color("#34d399");

function gradientAt(y: number, out: THREE.Color) {
  // y normalized to 0..1 across the core sphere
  const t = Math.min(Math.max((y / CORE_RADIUS + 1) / 2, 0), 1);
  if (t > 0.5) out.lerpColors(GRAD_MID, GRAD_TOP, (t - 0.5) * 2);
  else out.lerpColors(GRAD_BOTTOM, GRAD_MID, t * 2);
  return out;
}

type Network = {
  basePositions: Float32Array;
  explodeDirs: Float32Array;
  nodeColors: Float32Array;
  edges: [number, number][];
  edgeColors: Float32Array;
  adjacency: number[][];
};

function buildNetwork(): Network {
  const basePositions = new Float32Array(NODE_COUNT * 3);
  const explodeDirs = new Float32Array(NODE_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const rAtY = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const jitter = 0.82 + Math.random() * 0.36;
    basePositions[i * 3] = Math.cos(theta) * rAtY * CORE_RADIUS * jitter;
    basePositions[i * 3 + 1] = y * CORE_RADIUS * jitter;
    basePositions[i * 3 + 2] = Math.sin(theta) * rAtY * CORE_RADIUS * jitter;
    // random outward direction used when the network dissolves
    const len = Math.hypot(
      basePositions[i * 3],
      basePositions[i * 3 + 1],
      basePositions[i * 3 + 2]
    );
    const mag = 1.5 + Math.random() * 3.5;
    explodeDirs[i * 3] = (basePositions[i * 3] / len) * mag + (Math.random() - 0.5);
    explodeDirs[i * 3 + 1] = (basePositions[i * 3 + 1] / len) * mag + (Math.random() - 0.5);
    explodeDirs[i * 3 + 2] = (basePositions[i * 3 + 2] / len) * mag + (Math.random() - 0.5);
  }

  // per-node gradient colors
  const nodeColors = new Float32Array(NODE_COUNT * 3);
  const c = new THREE.Color();
  for (let i = 0; i < NODE_COUNT; i++) {
    gradientAt(basePositions[i * 3 + 1], c);
    nodeColors[i * 3] = c.r;
    nodeColors[i * 3 + 1] = c.g;
    nodeColors[i * 3 + 2] = c.b;
  }

  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const adjacency: number[][] = Array.from({ length: NODE_COUNT }, () => []);
  for (let i = 0; i < NODE_COUNT; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < NODE_COUNT; j++) {
      if (i === j) continue;
      const dx = basePositions[i * 3] - basePositions[j * 3];
      const dy = basePositions[i * 3 + 1] - basePositions[j * 3 + 1];
      const dz = basePositions[i * 3 + 2] - basePositions[j * 3 + 2];
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < NEIGHBORS; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
      adjacency[i].push(edges.length - 1);
      adjacency[j].push(edges.length - 1);
    }
  }

  // edge endpoints inherit their node colors -> gradient lines
  const edgeColors = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], e) => {
    edgeColors.set(nodeColors.subarray(a * 3, a * 3 + 3), e * 6);
    edgeColors.set(nodeColors.subarray(b * 3, b * 3 + 3), e * 6 + 3);
  });

  return { basePositions, explodeDirs, nodeColors, edges, edgeColors, adjacency };
}

function readScrollProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

function NeuralCore() {
  const group = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const edgeMatRef = useRef<THREE.LineBasicMaterial>(null);
  const pulsesRef = useRef<THREE.Points>(null);
  const collectiblesRef = useRef<THREE.Points>(null);
  const collectibleMatRef = useRef<THREE.PointsMaterial>(null);
  const smoothT = useRef(0);
  const { camera, size } = useThree();

  const net = useMemo(buildNetwork, []);
  const nodePositions = useMemo(() => net.basePositions.slice(), [net]);
  const edgePositions = useMemo(
    () => new Float32Array(net.edges.length * 6),
    [net]
  );
  const pulsePositions = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);
  const collectiblePositions = useMemo(
    () => new Float32Array(COLLECTIBLE_COUNT * 3),
    []
  );
  const pulses = useMemo(
    () =>
      Array.from({ length: PULSE_COUNT }, () => ({
        edge: Math.floor(Math.random() * net.edges.length),
        t: Math.random(),
        forward: Math.random() > 0.5,
        speed: 0.5 + Math.random() * 0.9,
      })),
    [net]
  );

  // easter-egg state (refs only - no react re-renders in the frame loop)
  const game = useRef({
    on: false,
    x: 0,
    y: 0,
    keys: { up: false, down: false, left: false, right: false },
  });
  const burstUntil = useRef(0);
  const viewportRef = useRef({ width: 8, height: 6 });

  useEffect(() => {
    function respawnCollectible(i: number) {
      const { width, height } = viewportRef.current;
      collectiblePositions[i * 3] = (Math.random() - 0.5) * width * 0.85;
      collectiblePositions[i * 3 + 1] = (Math.random() - 0.5) * height * 0.8;
      collectiblePositions[i * 3 + 2] = 0;
    }

    const onGameToggle = (e: Event) => {
      const on = (e as CustomEvent<{ on: boolean }>).detail.on;
      game.current.on = on;
      if (on) {
        game.current.x = 0;
        game.current.y = 0;
        for (let i = 0; i < COLLECTIBLE_COUNT; i++) respawnCollectible(i);
        if (collectiblesRef.current) {
          (collectiblesRef.current.geometry.attributes
            .position as THREE.BufferAttribute).needsUpdate = true;
        }
      }
    };

    const onBurst = () => {
      burstUntil.current = performance.now() + BURST_MS;
    };

    const KEYMAP: Record<string, "up" | "down" | "left" | "right"> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (!game.current.on || !e.key) return;
      const dir = KEYMAP[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (dir) {
        e.preventDefault(); // stop arrows from scrolling the page
        game.current.keys[dir] = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!e.key) return;
      const dir = KEYMAP[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (dir) game.current.keys[dir] = false;
    };

    // egg #1: catch a pulse with a click
    const v = new THREE.Vector3();
    const onClick = (e: MouseEvent) => {
      if (game.current.on || !group.current) return;
      for (let p = 0; p < PULSE_COUNT; p++) {
        v.set(
          pulsePositions[p * 3],
          pulsePositions[p * 3 + 1],
          pulsePositions[p * 3 + 2]
        );
        group.current.localToWorld(v);
        v.project(camera);
        if (v.z > 1) continue; // behind the camera
        const sx = (v.x * 0.5 + 0.5) * size.width;
        const sy = (-v.y * 0.5 + 0.5) * size.height;
        const dx = sx - e.clientX;
        const dy = sy - e.clientY;
        if (dx * dx + dy * dy < 48 * 48) {
          // caught: send the pulse elsewhere and notify the HUD
          const pulse = pulses[p];
          pulse.edge = Math.floor(Math.random() * net.edges.length);
          pulse.t = 0;
          window.dispatchEvent(new Event("egg:pulse-caught"));
          break;
        }
      }
    };

    window.addEventListener("egg:game-toggle", onGameToggle);
    window.addEventListener("egg:burst", onBurst);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("egg:game-toggle", onGameToggle);
      window.removeEventListener("egg:burst", onBurst);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onClick);
    };
  }, [camera, size, net, pulses, pulsePositions, collectiblePositions]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    viewportRef.current = {
      width: state.viewport.width,
      height: state.viewport.height,
    };

    // smooth scroll progress
    const target = readScrollProgress();
    smoothT.current += (target - smoothT.current) * Math.min(dt * 5, 1);
    const kf = sampleKeyframes(smoothT.current);

    // burst override (egg #3): ramp explode up and back down
    let burstExplode = 0;
    const now = performance.now();
    if (now < burstUntil.current) {
      const phase = 1 - (burstUntil.current - now) / BURST_MS; // 0..1
      burstExplode = Math.sin(phase * Math.PI) * 2.4;
    }

    const g = group.current;
    const inGame = game.current.on;

    if (g) {
      if (inGame) {
        // egg #2: player-controlled atom
        const s = game.current;
        const speed = 6;
        const vx = (s.keys.right ? 1 : 0) - (s.keys.left ? 1 : 0);
        const vy = (s.keys.up ? 1 : 0) - (s.keys.down ? 1 : 0);
        s.x += vx * speed * dt;
        s.y += vy * speed * dt;
        const bx = state.viewport.width / 2 - 0.6;
        const by = state.viewport.height / 2 - 0.6;
        s.x = Math.min(Math.max(s.x, -bx), bx);
        s.y = Math.min(Math.max(s.y, -by), by);
        g.position.set(s.x, s.y, 0);
        g.scale.setScalar(0.4);
        g.rotation.y += dt * 1.2;
      } else {
        // on narrow screens pull the atom toward center and shrink it a bit
        const xScale = Math.min(1, state.viewport.width / 9);
        g.position.set(kf.pos[0] * xScale, kf.pos[1], kf.pos[2]);
        g.scale.setScalar(kf.scale * (0.7 + 0.3 * xScale));
        g.rotation.y += dt * (kf.spin + burstExplode * 1.5);
        // gentle cursor tilt
        const targetX = state.pointer.y * 0.3;
        const targetZ = -state.pointer.x * 0.2;
        g.rotation.x += (targetX - g.rotation.x) * dt * 3;
        g.rotation.z += (targetZ - g.rotation.z) * dt * 3;
      }
    }

    // node positions: base + explode offset (scroll dissolve or logo burst)
    const e = inGame ? 0 : Math.max(kf.explode, burstExplode);
    for (let i = 0; i < NODE_COUNT * 3; i++) {
      nodePositions[i] = net.basePositions[i] + net.explodeDirs[i] * e;
    }
    if (nodesRef.current) {
      (nodesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // edges follow their nodes, fading out as the network dissolves
    for (let ei = 0; ei < net.edges.length; ei++) {
      const [a, b] = net.edges[ei];
      edgePositions[ei * 6] = nodePositions[a * 3];
      edgePositions[ei * 6 + 1] = nodePositions[a * 3 + 1];
      edgePositions[ei * 6 + 2] = nodePositions[a * 3 + 2];
      edgePositions[ei * 6 + 3] = nodePositions[b * 3];
      edgePositions[ei * 6 + 4] = nodePositions[b * 3 + 1];
      edgePositions[ei * 6 + 5] = nodePositions[b * 3 + 2];
    }
    if (edgesRef.current) {
      (edgesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    if (edgeMatRef.current) {
      edgeMatRef.current.opacity = 0.25 * (1 - Math.min(e, 1) * 0.9);
    }

    // pulses travel along edges (slower/dimmer while dissolved)
    for (let p = 0; p < PULSE_COUNT; p++) {
      const pulse = pulses[p];
      pulse.t += dt * pulse.speed * (1 - Math.min(e, 1) * 0.6);
      if (pulse.t >= 1) {
        const [a, b] = net.edges[pulse.edge];
        const arrived = pulse.forward ? b : a;
        const options = net.adjacency[arrived];
        const next = options[Math.floor(Math.random() * options.length)];
        pulse.edge = next;
        pulse.forward = net.edges[next][0] === arrived;
        pulse.t = 0;
        pulse.speed = 0.5 + Math.random() * 0.9;
      }
      const [a, b] = net.edges[pulse.edge];
      const from = pulse.forward ? a : b;
      const to = pulse.forward ? b : a;
      const t = pulse.t;
      pulsePositions[p * 3] = nodePositions[from * 3] * (1 - t) + nodePositions[to * 3] * t;
      pulsePositions[p * 3 + 1] = nodePositions[from * 3 + 1] * (1 - t) + nodePositions[to * 3 + 1] * t;
      pulsePositions[p * 3 + 2] = nodePositions[from * 3 + 2] * (1 - t) + nodePositions[to * 3 + 2] * t;
    }
    if (pulsesRef.current) {
      (pulsesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // collectibles (game mode): visible only in-game, collected on contact
    if (collectibleMatRef.current) {
      const targetOpacity = inGame ? 0.95 : 0;
      collectibleMatRef.current.opacity +=
        (targetOpacity - collectibleMatRef.current.opacity) * Math.min(dt * 6, 1);
    }
    if (inGame && g) {
      let changed = false;
      for (let i = 0; i < COLLECTIBLE_COUNT; i++) {
        const dx = collectiblePositions[i * 3] - g.position.x;
        const dy = collectiblePositions[i * 3 + 1] - g.position.y;
        if (dx * dx + dy * dy < 1.1) {
          const { width, height } = viewportRef.current;
          collectiblePositions[i * 3] = (Math.random() - 0.5) * width * 0.85;
          collectiblePositions[i * 3 + 1] = (Math.random() - 0.5) * height * 0.8;
          window.dispatchEvent(new Event("egg:game-score"));
          changed = true;
        }
      }
      if (changed && collectiblesRef.current) {
        (collectiblesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      }
    }
  });

  return (
    <>
      <group ref={group}>
        {/* connections - gradient lines via vertex colors */}
        <lineSegments ref={edgesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[net.edgeColors, 3]} />
          </bufferGeometry>
          <lineBasicMaterial ref={edgeMatRef} vertexColors transparent opacity={0.25} />
        </lineSegments>
        {/* neurons - cyan->emerald gradient across the sphere */}
        <points ref={nodesRef} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[net.nodeColors, 3]} />
          </bufferGeometry>
          <PointMaterial
            transparent
            vertexColors
            size={0.07}
            sizeAttenuation
            depthWrite={false}
            opacity={0.95}
          />
        </points>
        {/* signals streaming through the network */}
        <points ref={pulsesRef} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
          </bufferGeometry>
          <PointMaterial
            transparent
            color="#61dafb"
            size={0.1}
            sizeAttenuation
            depthWrite={false}
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>
        {/* React-logo orbits with electrons */}
        {[0, 1, 2].map((i) => (
          <Orbit key={i} index={i} />
        ))}
      </group>

      {/* game collectibles - world space, outside the moving group */}
      <points ref={collectiblesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[collectiblePositions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          ref={collectibleMatRef}
          transparent
          color="#a855f7"
          size={0.28}
          sizeAttenuation
          depthWrite={false}
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

function Orbit({ index }: { index: number }) {
  const electron = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const electronMat = useRef<THREE.MeshBasicMaterial>(null);
  const angle = useRef(Math.random() * Math.PI * 2);
  const RX = 3.6;
  const RY = 1.35;

  useFrame((_, delta) => {
    angle.current += Math.min(delta, 0.05) * 1.4;
    if (electron.current) {
      electron.current.position.set(
        Math.cos(angle.current) * RX,
        Math.sin(angle.current) * RY,
        0
      );
    }
    // orbits fade while the network is dissolved
    const e = sampleKeyframes(readScrollProgress()).explode;
    if (ringMat.current) ringMat.current.opacity = 0.35 * (1 - e);
    if (electronMat.current) electronMat.current.opacity = 1 - e;
  });

  return (
    <group rotation={[Math.PI / 2.6, 0, (index * Math.PI) / 3]}>
      <group scale={[1, RY / RX, 1]}>
        <mesh>
          <torusGeometry args={[RX, 0.012, 8, 128]} />
          <meshBasicMaterial ref={ringMat} color="#61dafb" transparent opacity={0.35} />
        </mesh>
      </group>
      <mesh ref={electron}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial ref={electronMat} color="#61dafb" transparent />
      </mesh>
    </group>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.01;
    // scroll parallax + subtle mouse drift
    const t = readScrollProgress();
    ref.current.position.y += (t * 3 - ref.current.position.y) * delta * 3;
    ref.current.rotation.x += state.pointer.y * delta * 0.02;
    ref.current.rotation.y += state.pointer.x * delta * 0.03;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#93aca0"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

export default function GlobalScene() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 [animation:fade-in_1.2s_ease_both] motion-reduce:hidden"
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#61dafb" />
        <NeuralCore />
        <Starfield />
      </Canvas>
    </div>
  );
}
