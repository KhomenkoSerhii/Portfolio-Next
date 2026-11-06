import * as THREE from "three";

export type SwarmFigure = "quotes" | "network" | "plane";

const SIZE = 400;
const COUNT = 3200;

// figures are drawn on a small canvas, then sampled into points
const DRAW: Record<SwarmFigure, (c: CanvasRenderingContext2D) => void> = {
  // big opening and closing quotation marks, behind a quote
  quotes(c) {
    c.font = "900 420px Georgia, 'Times New Roman', serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("\u201C\u201D", 200, 290);
  },
  // interface → API → database, with an AI spark over the API
  network(c) {
    c.lineWidth = 8;
    c.strokeRect(15, 150, 100, 72);
    c.beginPath();
    c.moveTo(45, 245);
    c.lineTo(85, 245);
    c.stroke();
    [0, 1, 2].forEach((i) => {
      c.beginPath();
      c.roundRect(150, 130 + i * 40, 100, 32, 8);
      c.stroke();
    });
    c.beginPath();
    c.ellipse(335, 148, 50, 16, 0, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.moveTo(285, 148);
    c.lineTo(285, 240);
    c.ellipse(335, 240, 50, 16, 0, Math.PI, 0, true);
    c.lineTo(385, 148);
    c.stroke();
    c.setLineDash([14, 12]);
    c.beginPath();
    c.moveTo(118, 186);
    c.lineTo(148, 186);
    c.moveTo(252, 186);
    c.lineTo(283, 186);
    c.stroke();
    c.setLineDash([]);
    c.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 10 : 34;
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      c.lineTo(200 + Math.cos(a) * r, 70 + Math.sin(a) * r);
    }
    c.closePath();
    c.fill();
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
      // wide screens: the network sits on the right; the plane flies left of centre, between
      // the heading and the (translucent) form. Narrow screens: centred behind the copy
      group.position.x = !wide ? 0 : figure === "plane" ? -Math.min(1.8, camera.aspect * 1.1) : Math.min(3.6, camera.aspect * 2);
      group.position.y = wide && figure === "plane" ? 0.6 : 0;
      group.scale.setScalar(wide ? 1.15 : 0.85);
      // the quote marks sit under large text, so they stay quieter
      material.opacity = (wide ? 0.55 : 0.32) * (figure === "quotes" ? 0.75 : 1);
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
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
