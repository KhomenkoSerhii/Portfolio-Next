import * as THREE from "three";

export const EARTH_RADIUS = 2.4;

/** latitude/longitude to a point on a sphere, matching three's SphereGeometry UV layout */
export function latLon(lat: number, lon: number, radius = EARTH_RADIUS) {
  const phi = ((lon + 180) * Math.PI) / 180;
  const theta = ((90 - lat) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** a soft round dot, used for glows, city lights and travelling pulses */
export function glowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(160,210,255,.9)");
  gradient.addColorStop(1, "rgba(80,140,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export const glossy = (color: number) =>
  new THREE.MeshPhysicalMaterial({ color, metalness: 0.35, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });

export type Figure = {
  group: THREE.Object3D;
  /** resolves once the figure's textures are in, so the intro can start on a finished picture */
  ready: Promise<void>;
  /** turn the figure: yaw accumulates from drag and auto-spin, pitch comes from vertical drag */
  orient(yaw: number, pitch: number): void;
  /** t in seconds; `when` is the moment the scene shows (real time, or time-lapsed) */
  update(t: number, when: Date): void;
  /** text for the hero's top line, e.g. "Lviv 20:33 · night" */
  label(when: Date): string;
  dispose(): void;
};

export function disposeTree(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}
