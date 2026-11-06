import * as THREE from "three";
import { dayPhase, subsolarPoint } from "@/lib/hero/sun";
import { EARTH_RADIUS as R, disposeTree, glowTexture, latLon, type Figure } from "./shared";

const LVIV: [number, number] = [49.84, 24.03];
const TEAMS: [number, number][] = [
  [52.52, 13.4], [51.5, -0.12], [52.37, 4.9], [48.86, 2.35], [52.23, 21.01],
  [59.33, 18.07], [38.72, -9.14], [40.71, -74], [37.77, -122.42], [32.08, 34.78],
];
const ELSEWHERE: [number, number][] = [
  [35.68, 139.69], [1.35, 103.82], [-23.55, -46.63], [19.43, -99.13], [-33.87, 151.21], [28.61, 77.21],
  [25.2, 55.27], [43.65, -79.38], [-26.2, 28.05], [31.23, 121.47], [6.52, 3.38], [64.15, -21.94],
];

// one size for every city glow, Lviv included
const CITY_DOT = 0.15;

const dayNightShader = {
  vertex: /* glsl */ `
    varying vec2 vUv; varying vec3 vNormalW; varying vec3 vPosW;
    void main() {
      vUv = uv;
      vNormalW = normalize(mat3(modelMatrix) * normal);
      vec4 world = modelMatrix * vec4(position, 1.0);
      vPosW = world.xyz;
      gl_Position = projectionMatrix * viewMatrix * world;
    }`,
  fragment: /* glsl */ `
    uniform sampler2D dayMap, nightMap, brcMap; uniform vec3 sunDir;
    varying vec2 vUv; varying vec3 vNormalW; varying vec3 vPosW;
    void main() {
      vec3 n = normalize(vNormalW);
      float sun = dot(n, sunDir);
      float lit = smoothstep(-0.18, 0.35, sun);
      vec3 dayColor = texture2D(dayMap, vUv).rgb;
      vec3 nightColor = texture2D(nightMap, vUv).rgb;
      vec3 brc = texture2D(brcMap, vUv).rgb; // bump, roughness, clouds
      vec3 color = mix(nightColor * vec3(1.25, 1.1, 0.9) * 1.8, dayColor * (0.12 + max(sun, 0.0) * 1.15), lit);
      color = mix(color, vec3(max(sun, 0.0) * 1.05 + 0.03), brc.b * lit * 0.9);
      vec3 view = normalize(cameraPosition - vPosW);
      vec3 halfway = normalize(sunDir + view);
      color += vec3(0.75, 0.85, 1.0) * pow(max(dot(n, halfway), 0.0), 70.0) * (1.0 - brc.g) * lit * 0.9;
      float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
      color += vec3(0.25, 0.55, 1.0) * rim * (0.15 + lit * 0.9);
      gl_FragColor = vec4(color, 1.0);
    }`,
};

/** a glowing arc above the surface, with light pulses running from `from` to `to` */
function trafficArc(
  from: [number, number],
  to: [number, number],
  { color = 0x9fd0ff, width = 0.02, base = 0.28, speed = 0.3 + Math.random() * 0.2 } = {}
) {
  const start = latLon(...from);
  const end = latLon(...to);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.setLength(R + start.distanceTo(end) * 0.32);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      t: { value: 0 },
      offset: { value: Math.random() },
      speed: { value: speed },
      base: { value: base },
      tint: { value: new THREE.Color(color) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: /* glsl */ `
      uniform float t, offset, speed, base; uniform vec3 tint; varying vec2 vUv;
      void main(){
        float p = fract(vUv.x - t * speed + offset);
        float head = smoothstep(0.82, 1.0, p) * step(p, 0.995);
        float ends = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
        gl_FragColor = vec4(tint * (0.6 + head * 1.6), (base + head * 1.4) * ends);
      }`,
  });
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start, mid, end), 64, width, 6), material);
}

export function createEarth(textureBase = "/textures"): Figure {
  const tilt = new THREE.Group();
  const spin = new THREE.Group();
  tilt.add(spin);

  let markReady = () => {};
  const ready = new Promise<void>((resolve) => (markReady = resolve));
  // onLoad also fires when a texture fails, so the intro never waits forever
  const manager = new THREE.LoadingManager(() => markReady());
  const loader = new THREE.TextureLoader(manager);
  const load = (name: string) => {
    const texture = loader.load(`${textureBase}/${name}`);
    texture.anisotropy = 8;
    return texture;
  };
  const sunDir = new THREE.Vector3(-1, 0.35, 0.75).normalize();
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(R, 128, 96),
    new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: load("earth-day.webp") },
        nightMap: { value: load("earth-night.webp") },
        brcMap: { value: load("earth-brc.webp") },
        sunDir: { value: sunDir },
      },
      vertexShader: dayNightShader.vertex,
      fragmentShader: dayNightShader.fragment,
    })
  );
  spin.add(earth);

  // every arc on the planet looks the same: the Lviv routes and the traffic elsewhere
  const routes = TEAMS.map((city) => trafficArc(LVIV, city));
  routes.forEach((arc) => spin.add(arc));
  const traffic = Array.from({ length: 14 }, (_, i) => {
    const from = ELSEWHERE[i % ELSEWHERE.length];
    const pool = i % 3 === 0 ? TEAMS : ELSEWHERE;
    return trafficArc(from, pool[(i * 5 + 3) % pool.length]);
  }).filter((arc) => arc.geometry.parameters.path.getLength() > 0.2);
  traffic.forEach((arc) => spin.add(arc));

  const glow = glowTexture();
  [...TEAMS, ...ELSEWHERE].forEach((city) => {
    const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false }));
    dot.position.copy(latLon(...city, R * 1.005));
    dot.scale.setScalar(CITY_DOT);
    spin.add(dot);
  });
  const home = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glow, color: 0x2bff7a, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  home.position.copy(latLon(...LVIV, R * 1.005));
  home.scale.setScalar(CITY_DOT); // the same size as every other city; only the colour marks it
  spin.add(home);

  // start with Lviv facing the camera
  const lviv = latLon(...LVIV);
  const baseYaw = Math.atan2(-lviv.x, lviv.z);
  const worldQuat = new THREE.Quaternion();

  const sunHeightAt = (lat: number, lon: number) =>
    latLon(lat, lon, 1).normalize().applyQuaternion(earth.getWorldQuaternion(worldQuat)).dot(sunDir);

  return {
    group: tilt,
    ready,
    orient(yaw, pitch) {
      spin.rotation.y = baseYaw + yaw;
      tilt.rotation.x = 0.8 + pitch;
    },
    update(t, when) {
      [...routes, ...traffic].forEach((arc) => ((arc.material as THREE.ShaderMaterial).uniforms.t.value = t));
      home.material.opacity = 0.75 + Math.sin(t * 3) * 0.25;
      const sun = subsolarPoint(when);
      tilt.updateMatrixWorld(true);
      sunDir.copy(latLon(sun.lat, sun.lon, 1).normalize().applyQuaternion(earth.getWorldQuaternion(worldQuat)));
    },
    label(when) {
      const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", hour: "2-digit", minute: "2-digit" }).format(when);
      return `Lviv ${time} · ${dayPhase(sunHeightAt(...LVIV))}`;
    },
    dispose: () => disposeTree(tilt),
  };
}
