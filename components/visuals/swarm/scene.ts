import * as THREE from "three";

export type SwarmFigure = "exchange" | "plane";

const SIZE = 400;
const COUNT = 3200;

// figures are drawn on a small canvas, then sampled into points
// where the request cable runs in the "exchange" figure, in canvas pixels: laptop → server
const CABLE = { from: [100, 150], via: [205, 30], to: [300, 112] } as const;

const DRAW: Record<SwarmFigure, (c: CanvasRenderingContext2D) => void> = {
  // a laptop on the left, a server rack and a database on the right
  exchange(c) {
    c.lineWidth = 7;
    // laptop: screen with a tiny UI, then the base
    c.beginPath();
    c.roundRect(28, 150, 144, 96, 8);
    c.stroke();
    c.fillRect(42, 164, 40, 6);
    c.fillRect(42, 178, 116, 4);
    c.fillRect(42, 188, 96, 4);
    [0, 1, 2, 3, 4].forEach((i) => c.fillRect(96 + i * 13, 228 - i * 7, 8, 10 + i * 7));
    c.beginPath();
    c.moveTo(10, 262);
    c.lineTo(190, 262);
    c.lineTo(172, 248);
    c.lineTo(28, 248);
    c.closePath();
    c.stroke();
    // server rack: six units with lights
    c.strokeRect(256, 112, 88, 168);
    for (let u = 0; u < 6; u++) {
      const y = 122 + u * 26;
      c.strokeRect(264, y, 72, 18);
      c.fillRect(270, y + 7, 6, 5);
      c.fillRect(282, y + 7, 6, 5);
    }
    // database: three stacked disks
    for (let d = 0; d < 3; d++) {
      const y = 208 + d * 24;
      c.beginPath();
      c.ellipse(372, y, 22, 7, 0, 0, Math.PI * 2);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(350, 208);
    c.lineTo(350, 256);
    c.moveTo(394, 208);
    c.lineTo(394, 256);
    c.stroke();
    // the cables
    c.lineWidth = 3;
    c.setLineDash([6, 8]);
    c.beginPath();
    c.moveTo(CABLE.from[0], CABLE.from[1]);
    c.quadraticCurveTo(CABLE.via[0], CABLE.via[1], CABLE.to[0], CABLE.to[1]);
    c.moveTo(344, 236);
    c.lineTo(350, 236);
    c.stroke();
    c.setLineDash([]);
  },
  // a paper plane with a dashed trail
  plane(c) {
    c.lineWidth = 9;
    c.beginPath();
    c.moveTo(380, 60);
    c.lineTo(40, 190);
    c.lineTo(170, 235);
    c.closePath();
    c.stroke();
    c.beginPath();
    c.moveTo(380, 60);
    c.lineTo(170, 235);
    c.lineTo(205, 330);
    c.lineTo(245, 262);
    c.stroke();
    c.beginPath();
    c.moveTo(380, 60);
    c.lineTo(245, 262);
    c.lineTo(330, 300);
    c.closePath();
    c.stroke();
    c.setLineDash([10, 14]);
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(150, 250);
    c.bezierCurveTo(90, 320, 30, 300, 20, 370);
    c.stroke();
    c.setLineDash([]);
  },
};

function sample(figure: SwarmFigure) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const c = canvas.getContext("2d")!;
  c.fillStyle = c.strokeStyle = "#fff";
  DRAW[figure](c);
  const data = c.getImageData(0, 0, SIZE, SIZE).data;
  const filled: [number, number][] = [];
  for (let y = 0; y < SIZE; y += 2) for (let x = 0; x < SIZE; x += 2) if (data[(y * SIZE + x) * 4 + 3] > 120) filled.push([x, y]);
  const out = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const [x, y] = filled[(i * 7919) % filled.length];
    out[i * 3] = ((x - 200) / 200) * 3;
    out[i * 3 + 1] = (-(y - 200) / 200) * 3;
    out[i * 3 + 2] = (((i * 37) % 100) / 100 - 0.5) * 0.6;
  }
  return out;
}

/** a field of points that gathers into a figure once its section is on screen */
export function createSwarm(canvas: HTMLCanvasElement, figure: SwarmFigure) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 11);
  const group = new THREE.Group();
  scene.add(group);

  const target = sample(figure);
  const positions = new Float32Array(COUNT * 3);
  const phase = new Float32Array(COUNT);
  const delay = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    phase[i] = Math.random() * Math.PI * 2;
    delay[i] = Math.random() * 0.6;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const colors = new Float32Array(COUNT * 3);
  const palette = ["#4d8bff", "#6db3ff", "#9fd0ff", "#dbeaff"].map((hex) => new THREE.Color(hex));
  for (let i = 0; i < COUNT; i++) palette[i % 4].toArray(colors, i * 3);
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const dot = document.createElement("canvas");
  dot.width = dot.height = 32;
  const dc = dot.getContext("2d")!;
  const gradient = dc.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(0.5, "rgba(255,255,255,.8)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  dc.fillStyle = gradient;
  dc.fillRect(0, 0, 32, 32);
  const material = new THREE.PointsMaterial({
    size: 0.085,
    map: new THREE.CanvasTexture(dot),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    opacity: 0.55,
  });
  group.add(new THREE.Points(geometry, material));

  // "exchange": little clouds of the same points run along the cable, requests out and
  // responses back, so the traffic looks like part of the figure
  const toWorld = ([x, y]: readonly number[]) => new THREE.Vector3(((x - 200) / 200) * 3, (-(y - 200) / 200) * 3, 0.2);
  const cable = new THREE.QuadraticBezierCurve3(toWorld(CABLE.from), toWorld(CABLE.via), toWorld(CABLE.to));
  const PACKETS = figure === "exchange" ? 8 : 0;
  const PER_PACKET = 26;
  const packetPositions = new Float32Array(PACKETS * PER_PACKET * 3);
  const packetColors = new Float32Array(PACKETS * PER_PACKET * 3);
  const packetSpread = new Float32Array(PACKETS * PER_PACKET * 3);
  for (let i = 0; i < PACKETS * PER_PACKET; i++) {
    // a small ball of points around the packet's centre
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const r = 0.13 * Math.cbrt(Math.random());
    packetSpread.set([r * Math.sin(v) * Math.cos(u), r * Math.cos(v), r * Math.sin(v) * Math.sin(u)], i * 3);
    palette[(i + 2) % 4].toArray(packetColors, i * 3);
  }
  const packetGeometry = new THREE.BufferGeometry();
  packetGeometry.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
  packetGeometry.setAttribute("color", new THREE.BufferAttribute(packetColors, 3));
  const packetMaterial = material.clone();
  if (PACKETS) group.add(new THREE.Points(packetGeometry, packetMaterial));
  const packetPoint = new THREE.Vector3();

  const pointer = { x: 0, y: 0 };
  const onPointer = (event: PointerEvent) => {
    pointer.x = event.clientX / window.innerWidth - 0.5;
    pointer.y = event.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  let gatheredAt = -1;
  let frame = 0;
  let running = false;
  const startedAt = performance.now();

  function render() {
    const t = (performance.now() - startedAt) / 1000;
    const since = gatheredAt < 0 ? -1 : t - gatheredAt;
    for (let i = 0; i < COUNT; i++) {
      const go = since > delay[i] ? 0.06 : 0;
      const k = i * 3;
      positions[k] += (target[k] + Math.sin(t * 1.3 + phase[i]) * 0.025 - positions[k]) * go;
      positions[k + 1] += (target[k + 1] + Math.cos(t * 1.1 + phase[i]) * 0.025 - positions[k + 1]) * go;
      positions[k + 2] += (target[k + 2] - positions[k + 2]) * go;
    }
    geometry.attributes.position.needsUpdate = true;
    // packets appear once the figure has gathered
    if (PACKETS) {
      packetMaterial.opacity = material.opacity * (since > 1.2 ? Math.min(1, (since - 1.2) / 0.8) : 0);
      for (let k = 0; k < PACKETS; k++) {
        const p = (t * 0.3 + k / PACKETS) % 1;
        // even packets are requests (laptop → server), odd ones are responses coming back
        cable.getPointAt(k % 2 ? 1 - p : p, packetPoint);
        const fade = Math.sin(p * Math.PI);
        for (let n = 0; n < PER_PACKET; n++) {
          const idx = (k * PER_PACKET + n) * 3;
          packetPositions[idx] = packetPoint.x + packetSpread[idx] * fade;
          packetPositions[idx + 1] = packetPoint.y + packetSpread[idx + 1] * fade;
          packetPositions[idx + 2] = packetPoint.z + packetSpread[idx + 2] * fade;
        }
      }
      packetGeometry.attributes.position.needsUpdate = true;
    }
    group.rotation.y += (Math.sin(t * 0.25) * 0.3 + pointer.x * 0.5 - group.rotation.y) * 0.05;
    group.rotation.x += (pointer.y * 0.3 - group.rotation.x) * 0.05;
    renderer.render(scene, camera);
  }
  function loop() {
    if (!running) return;
    render();
    frame = requestAnimationFrame(loop);
  }

  return {
    resize(width: number, height: number) {
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const wide = width > 900;
      // wide screens: the plane flies left of centre, between the heading and the
      // (translucent) form; the exchange sits on the right. Narrow screens: centred
      const side = figure === "plane" ? -Math.min(1.8, camera.aspect * 1.1) : Math.min(3.2, camera.aspect * 1.8);
      group.position.x = wide ? side : 0;
      group.position.y = wide && figure === "plane" ? 0.6 : 0;
      group.scale.setScalar(wide ? 1.15 : 0.85);
      material.opacity = wide ? 0.55 : 0.32;
    },
    gather(instant = false) {
      if (gatheredAt >= 0) return;
      gatheredAt = (performance.now() - startedAt) / 1000;
      if (instant) {
        positions.set(target);
        render();
      }
    },
    start() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      packetGeometry.dispose();
      packetMaterial.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
