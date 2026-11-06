import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createEarth } from "./earth";
import type { Figure } from "./shared";

export type RenderMode = "ascii" | "binary" | "blocks";
export type TimeMode = "now" | "lapse";

const RAMPS: Record<RenderMode, string> = {
  ascii: " .:-=+*x%#@",
  binary: " 0011110101",
  blocks: " ░░▒▒▓▓██",
};
// a full day in 20 seconds
const LAPSE_SPEED = 86_400 / 20;

export type HeroSceneOptions = {
  real: HTMLCanvasElement;
  ascii: HTMLCanvasElement;
  /** fly the text glyphs in from all over the screen to build the figure (off for reduced motion) */
  assemble?: boolean;
  /** called twice a second with the measured frame rate and the figure's label */
  onStats?: (stats: { fps: number; label: string; cell: number }) => void;
};

export function createHeroScene({ real, ascii, assemble = true, onStats }: HeroSceneOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas: real, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const ctx = ascii.getContext("2d")!;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-4, 6, 8);
  scene.add(key);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 14);
  const stage = new THREE.Group();
  scene.add(stage);

  const figure: Figure = createEarth();
  stage.add(figure.group);
  let mode: RenderMode = "ascii";
  let timeMode: TimeMode = "now";
  let lapseFrom = Date.now();
  let dark = false;
  let yaw = 0;
  let pitch = 0;
  let spinSpeed = 0.0018;
  let dragging = false;

  const CELL = 14;
  // intro: each glyph flies in from somewhere off its cell, staggered, scrambling until it lands
  const ASSEMBLE_STAGGER = 0.9;
  const ASSEMBLE_FLIGHT = 1.1;
  let assembleFrom = assemble ? Infinity : -Infinity; // Infinity: not started yet
  const startAssembly = () => {
    if (assembleFrom === Infinity) assembleFrom = performance.now();
  };
  figure.ready.then(startAssembly);
  window.setTimeout(startAssembly, 4000);
  const hash = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  let width = 1;
  let height = 1;
  let cols = 1;
  let rows = 1;
  let target = new THREE.WebGLRenderTarget(1, 1);
  let pixels = new Uint8Array(4);

  /** `wide`: the figure sits beside the copy; otherwise it is centred in its own box */
  function resize(nextWidth: number, nextHeight: number, wide: boolean) {
    width = Math.max(1, nextWidth);
    height = Math.max(1, nextHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const ratio = Math.min(window.devicePixelRatio, 2);
    ascii.width = width * ratio;
    ascii.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
    target.dispose();
    target = new THREE.WebGLRenderTarget(cols, rows);
    pixels = new Uint8Array(cols * rows * 4);
    stage.position.set(wide ? Math.min(2.6, camera.aspect * 1.5) : 0, wide ? 0.75 : 0, 0);
    stage.scale.setScalar(wide ? 1 : 0.86);
  }

  function drawAscii() {
    const ramp = RAMPS[mode];
    // before the start this is -Infinity (nothing drawn yet); with no intro it is Infinity (all landed)
    const elapsed = (performance.now() - assembleFrom) / 1000;
    const assembling = elapsed < ASSEMBLE_STAGGER + ASSEMBLE_FLIGHT;
    const reach = Math.max(width, height);
    const palette = dark
      ? { dot: "rgba(160,190,255,.16)", lo: [60, 110, 210], hi: [220, 236, 255] }
      : { dot: "rgba(12,48,173,.14)", lo: [90, 130, 220], hi: [3, 9, 45] };
    ctx.clearRect(0, 0, width, height);
    ctx.font = `600 ${CELL - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let y = 0; y < rows; y++) {
      const flipped = rows - 1 - y; // render targets are read bottom-up
      for (let x = 0; x < cols; x++) {
        const k = (flipped * cols + x) * 4;
        const px = x * CELL + CELL / 2;
        const py = y * CELL + CELL / 2;
        if (pixels[k + 3] < 16) {
          if ((x + y) % 2 === 0 && elapsed > 0) {
            ctx.globalAlpha = Math.min(1, elapsed / 1.2);
            ctx.fillStyle = palette.dot;
            ctx.fillText("·", px, py);
            ctx.globalAlpha = 1;
          }
          continue;
        }
        const luminance = (pixels[k] * 0.3 + pixels[k + 1] * 0.59 + pixels[k + 2] * 0.11) / 255;
        const v = Math.min(1, 0.12 + Math.pow(luminance, 0.8) * 1.3); // keeps land, ocean and lights apart
        let glyph = ramp[Math.max(1, Math.min(ramp.length - 1, Math.floor(v * (ramp.length - 1) + 0.5)))];
        const [r, g, b] = palette.lo.map((low, i) => Math.round(low + (palette.hi[i] - low) * v));
        let alpha = 0.4 + v * 0.6;
        let drawX = px;
        let drawY = py;
        if (assembling) {
          const cell = y * cols + x;
          const p = Math.min(1, (elapsed - hash(cell) * ASSEMBLE_STAGGER) / ASSEMBLE_FLIGHT);
          if (p <= 0) continue;
          const eased = 1 - Math.pow(1 - p, 3);
          const angle = hash(cell + 7919) * Math.PI * 2;
          const distance = (0.45 + hash(cell + 104729) * 0.7) * reach;
          drawX = px + Math.cos(angle) * distance * (1 - eased);
          drawY = py + Math.sin(angle) * distance * (1 - eased);
          alpha *= eased;
          if (p < 0.85) glyph = ramp[1 + Math.floor(hash(cell + Math.floor(elapsed * 20)) * (ramp.length - 1))];
        }
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
        ctx.fillText(glyph, drawX, drawY);
      }
    }
  }

  const startedAt = performance.now();
  let frame = 0;
  let running = false;
  let frames = 0;
  let statsAt = performance.now();

  function moment() {
    return timeMode === "now" ? new Date() : new Date(Date.now() + (Date.now() - lapseFrom) * LAPSE_SPEED);
  }

  function renderFrame() {
    const t = (performance.now() - startedAt) / 1000;
    const when = moment();
    figure.orient(yaw, pitch);
    figure.update(t, when);
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(target, 0, 0, cols, rows, pixels);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
    drawAscii();

    frames++;
    const now = performance.now();
    if (now - statsAt > 500) {
      onStats?.({ fps: Math.round((frames * 1000) / (now - statsAt)), label: figure.label(when), cell: CELL });
      frames = 0;
      statsAt = now;
    }
  }

  function loop() {
    if (!running) return;
    if (!dragging) {
      yaw += spinSpeed;
      spinSpeed += (0.0018 - spinSpeed) * 0.02;
    }
    renderFrame();
    frame = requestAnimationFrame(loop);
  }

  return {
    resize,
    setMode(next: RenderMode) {
      mode = next;
      if (!running) renderFrame();
    },
    setTimeMode(next: TimeMode) {
      timeMode = next;
      lapseFrom = Date.now();
    },
    setDark(next: boolean) {
      dark = next;
      if (!running) renderFrame();
    },
    dragStart() {
      dragging = true;
    },
    drag(dx: number, dy: number) {
      yaw += dx * 0.006;
      spinSpeed = dx * 0.0006;
      pitch = Math.max(-0.4, Math.min(0.4, pitch + dy * 0.004));
      if (!running) renderFrame();
    },
    dragEnd() {
      dragging = false;
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
    renderOnce: renderFrame,
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      figure.dispose();
      target.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

export type HeroScene = ReturnType<typeof createHeroScene>;
