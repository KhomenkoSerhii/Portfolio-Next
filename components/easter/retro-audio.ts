// 8-bit chiptune synthesized with Web Audio - an original melody in the
// spirit of NES-era games (the real Konami themes are copyrighted).

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let loopTimer: ReturnType<typeof setTimeout> | null = null;
let playing = false;

const BPM = 150;
const STEP = 60 / BPM / 2; // eighth note, seconds

function ensureCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.12; // keep it background-level
    master.connect(ctx.destination);
  }
  return ctx;
}

function midiToFreq(m: number) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function playNote(
  midi: number,
  when: number,
  durSteps: number,
  type: OscillatorType,
  vol: number
) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const dur = durSteps * STEP;
  osc.type = type;
  osc.frequency.value = midiToFreq(midi);
  // classic chip envelope: instant attack, quick decay
  gain.gain.setValueAtTime(vol, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur * 0.9);
  osc.connect(gain).connect(master);
  osc.start(when);
  osc.stop(when + dur);
}

// original 4-bar loop, E minor - lead in eighth notes ([midi, steps]; 0 = rest)
const LEAD: [number, number][] = [
  [76, 1], [79, 1], [81, 1], [83, 2], [81, 1], [79, 1], [76, 1],
  [74, 1], [76, 1], [79, 1], [76, 2], [0, 2],
  [71, 1], [74, 1], [76, 1], [79, 2], [76, 1], [74, 1], [71, 1],
  [69, 1], [71, 1], [74, 1], [71, 2], [0, 2],
];

// simple alternating bass (triangle), quarter notes
const BASS: [number, number][] = [
  [40, 2], [52, 2], [40, 2], [52, 2],
  [38, 2], [50, 2], [38, 2], [50, 2],
  [36, 2], [48, 2], [36, 2], [48, 2],
  [38, 2], [50, 2], [43, 2], [47, 2],
];

function scheduleLoop() {
  if (!playing || !ctx) return;
  const start = ctx.currentTime + 0.05;
  let t = start;
  for (const [midi, steps] of LEAD) {
    if (midi > 0) playNote(midi, t, steps, "square", 0.5);
    t += steps * STEP;
  }
  let tb = start;
  for (const [midi, steps] of BASS) {
    if (midi > 0) playNote(midi, tb, steps, "triangle", 0.7);
    tb += steps * STEP;
  }
  const loopDur = (t - start) * 1000;
  loopTimer = setTimeout(scheduleLoop, loopDur - 60);
}

export function startGameMusic() {
  const c = ensureCtx();
  void c.resume();
  if (playing) return;
  playing = true;
  // power-up jingle, then the loop
  const now = c.currentTime + 0.02;
  [64, 69, 73, 76].forEach((m, i) =>
    playNote(m, now + i * 0.07, 0.6, "square", 0.6)
  );
  loopTimer = setTimeout(scheduleLoop, 500);
}

export function stopGameMusic() {
  playing = false;
  if (loopTimer) clearTimeout(loopTimer);
  loopTimer = null;
}

export function scoreBlip() {
  if (!playing) return;
  const c = ensureCtx();
  const now = c.currentTime + 0.01;
  playNote(83, now, 0.4, "square", 0.5); // B5
  playNote(88, now + 0.07, 0.8, "square", 0.5); // E6 - classic coin jump
}
