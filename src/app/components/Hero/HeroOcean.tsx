"use client";

import { useEffect, useRef } from "react";

/*
 * Ambient motion layer for the hero. It does not draw any background of its
 * own: the existing wave artwork (public/hero/wave.svg, rendered in Hero.tsx
 * inside [data-hero-wave]) is left exactly as designed and only drifts very
 * slowly. Small, relaxed schools of ACM fish swim along the purple band, each
 * leaving a faint wake of soft curls.
 *
 * Performance: nothing is simulated per frame. The motion is a hardcoded,
 * seamless 60 s loop: a fixed schedule of schools (SCHEDULE) and seeded
 * randomness, simulated once on load (and again on resize, since positions
 * are in hero pixels). The result is handed to the browser as transform /
 * opacity Web Animations on plain elements, which run on the compositor
 * thread. JS only wakes up while a mouse is over the hero (fish ease away from
 * the cursor). Pauses off-screen / in hidden tabs and stays still for reduced
 * motion.
 *
 * Why the loop is seamless: every input repeats every 60 s. Schools respawn
 * at the same second with the same seed, everything per school is driven by
 * its own elapsed time, and the wave drift's periods all divide 60 s. The
 * bake runs two loops and records the second, so the short-memory parts
 * (separation nudges, smoothed velocity, fades) have settled into the cycle.
 */

type Pt = { x: number; y: number };
type Slot = { along: number; across: number };
type Rng = () => number;

const TAU = Math.PI * 2;

// Top edge of the main band in wave.svg (its 0.94-opacity path), in the
// SVG's own units. viewBox is "-300 -300 2624 1591", stretched to fill a box
// that is 168% of the hero wide, starting 34% left of it (-inset-x-[34%]).
const WAVE_TOP = [
  [95.949, 533.985],
  [392.081, -61.361],
  [703.27, 121.823],
  [1024.5, 602.679],
  [1285.49, 938.515],
  [1611.74, 205.781],
  [1927.95, 396.597],
] as const;
const BAND_THICKNESS = 277.127; // bottom edge = top edge shifted down by this
const FISH_DEPTH = 0.15; // fraction of the band below its top edge
const VB = { x: -300, y: -300, w: 2624, h: 1591 };
const BOX = { left: -0.34, width: 1.68 }; // wave box relative to hero width

// ACM fish model, mirrored to face right (direction of travel). Body: a lens
// of two equal circular arcs with a softly rounded nose. Tail: two arcs of the
// same radius plus a straight back edge, with its two outer corners rounded,
// touching the body at a single point (-4.84, 0). 24 units long, centred.
const BODY =
  "M11.57-0.67A9.74 9.74 0 0 0-4.84 0A9.74 9.74 0 0 0 11.57 0.67Q12 0 11.57-0.67Z";
const TAIL =
  "M-4.84 0A9.74 9.74 0 0 0-11.28-4.64Q-11.96-4.76-11.72-4.1L-9.15 3.09Q-8.91 3.75-8.3 3.42A9.74 9.74 0 0 0-4.84 0Z";
const FISH_VIEW = { x: -12.5, y: -5.5, w: 25, h: 11 }; // viewBox around body + tail
const TAIL_PIVOT_X = -4.84;
const TAIL_TIP_X = -11; // where the wake curls are released, in fish units
const HALF_LENGTH = 12; // fish units
const HALF_HEIGHT = 4.9; // fish units
const KEEP_APART = 6; // px of clear water always kept between any two fish
const COMFORT = 10; // px beyond that where fish start gently easing apart
const EASE_APART = 3; // how quickly they ease apart inside the comfort zone (1/s)

// The loop.
const LOOP = 60; // s
const SIM_HZ = 20; // bake resolution
const STEPS = LOOP * SIM_HZ;
const KEY_EVERY = 2; // a position keyframe every 2 steps (10 per second)
// The first loop only warms up long-lived state (school progress, timers,
// tail phase). Positions, separation and fades have short memories, so they
// are only simulated for the last WARM_FULL seconds before recording.
const WARM_FULL = 12;
// The bake runs SEAM_BLEND s past the recorded loop; the loop's first
// SEAM_BLEND s blend from that continuation into the recording, so the loop
// point matches exactly even where separation settled differently.
const SEAM_BLEND = 3;
const BLEND_KEYS = (SEAM_BLEND * SIM_HZ) / KEY_EVERY;
const BAKE_SLICE = 60; // steps between chances to yield to the browser
const SLICE_MS = 8; // work per idle slice, so no long tasks
const KEYS = STEPS / KEY_EVERY; // intervals; KEYS + 1 keyframes
const START_AT = 16; // s into the loop shown first: one school mid-journey, one arriving
const FADE_IN = 1500; // ms, first appearance only

// Hardcoded 60 s schedule: second it enters from the left, fish count, depth
// lane (fraction of the band's thickness), depth (0 far … 1 near: bigger,
// brighter, a bit faster), nominal crossing time (s) and seed. Arrivals are
// ~10 s apart, consecutive schools use different lanes, and no school is fast
// enough to catch the one ahead, so none of the old pace-matching is needed.
const SCHEDULE = [
  { at: 0, count: 5, lane: 0, depth: 0.7, crossing: 46, seed: 11 },
  { at: 10, count: 3, lane: 0.44, depth: 0.25, crossing: 52, seed: 23 },
  { at: 21, count: 6, lane: 0.22, depth: 0.9, crossing: 44, seed: 37 },
  { at: 31, count: 4, lane: 0.62, depth: 0.45, crossing: 50, seed: 41 },
  { at: 41, count: 3, lane: 0, depth: 0.15, crossing: 53, seed: 59 },
  { at: 50, count: 5, lane: 0.44, depth: 0.6, crossing: 47, seed: 67 },
] as const;
const MAX_PER_SCHOOL = 6;
const POOL = SCHEDULE.length * MAX_PER_SCHOOL;
// Arrangements: fish per row, front row first. At most 3 rows deep and 3
// abreast, so the school stays a loose group, never a long line.
const ARRANGEMENTS: Record<number, number[][]> = {
  2: [[2], [1, 1]],
  3: [[1, 2], [2, 1]],
  4: [[2, 2], [1, 2, 1]],
  5: [[2, 2, 1], [1, 2, 2], [2, 1, 2]],
  6: [[2, 2, 2], [2, 3, 1], [1, 3, 2]],
};
const LANE_DRIFT = 0.05; // lanes rise and sink slowly by this much
const BASE_OPACITY = 0.68; // white fish at ~60–75% so they blend into the gradient
const EDGE_FADE = 90; // px over which a fish fades in/out at the screen edges
const SCALE_RANGE = [0.625, 1.15]; // 15–28px long, far → near

// Life inside a school.
const LEAD_AHEAD = 14; // px the leader drifts ahead of the front row
const LEAD_CHANGE = [20, 35]; // s between leadership changes
const SWAP = [12, 24]; // s between two neighbours slowly trading places
const SLOT_EASE = 4; // s time constant for gliding to a new spot

// Swimming rhythm: fish mostly cruise, and now and then make a short burst of
// quick tail beats followed by a coast with the tail almost still.
const CRUISE_TIME = [6, 14]; // s between bursts
const BURST_TIME = [0.6, 1]; // s of quick beats
const GLIDE_TIME = [1, 1.5]; // s of coasting afterwards
const MODE_BEAT = [1, 2.2, 0.5]; // tail-beat rate multiplier: cruise, burst, glide
const MODE_AMP = [1, 1.4, 0.3]; // tail swing multiplier: cruise, burst, glide
const MODE_SURGE = [0, 6, 6]; // px pushed ahead of its spot: cruise, burst, glide
const TAIL_SWING = 8; // degrees at cruise
const BODY_YAW = 2.5; // degrees the head sways, opposite the tail
const MAX_VEER = 0.6; // rad the heading may turn away from the path to follow actual motion

// Underwater wake: each tail swing releases one soft curl from the tail tip,
// alternating above and below the path; curls drift, widen and dissolve.
const CURL_POOL = 4; // elements per fish; extra curls during a burst are skipped
const CURL_LIFE = 1.3;
const CURL_OPACITY = 0.16;
const CURL_SAMPLES = [0, 0.2, 1]; // keyframes per curl (fraction of life)
const CURL_PX = 8; // px per unit in the curl's own drawing (unit radius)
// Unit-radius open curl (about 200° of arc), starting at angle 0.
const CURL = "M1,0A1 1 0 1 1-0.936-0.351";

// Cursor (fine pointers only): fish within CURSOR_RADIUS ease away and drift
// back as the nudge relaxes.
const CURSOR_RADIUS = 90;
const CURSOR_PUSH = 120; // px/s at the centre
const CURSOR_RELAX = 1.2; // 1/s
const PUSH_CAP = 40; // px

const r = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const smoothstep = (n: number) => {
  const x = clamp(n, 0, 1);
  return x * x * (3 - 2 * x);
};
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);
const parity = (q: number) => (q % 2 === 0 ? 1 : -1);
const DEG = 180 / Math.PI;

// Small seeded PRNG so every school is the same on every loop and every load.
const mulberry32 = (seed: number): Rng => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const between = (rng: Rng, lo: number, hi: number) => lo + rng() * (hi - lo);
const pick = <T,>(rng: Rng, list: T[]) => list[Math.floor(rng() * list.length)];

// The wave.svg curve in hero pixel space (affine, so the two Béziers stay
// exact), sampled every ~2px of arc length. Pure maths: no DOM path queries.
function samplePath(w: number, h: number) {
  const P = WAVE_TOP.map(([vx, vy]) => ({
    x: BOX.left * w + ((vx - VB.x) / VB.w) * BOX.width * w,
    y: ((vy + FISH_DEPTH * BAND_THICKNESS - VB.y) / VB.h) * h,
  }));
  // Dense parametric samples with cumulative arc length.
  const PER_SEG = 600;
  const xs: number[] = [];
  const ys: number[] = [];
  const len: number[] = [];
  for (let seg = 0; seg < 2; seg++) {
    const [a, b, c, d] = P.slice(seg * 3, seg * 3 + 4);
    for (let k = seg === 0 ? 0 : 1; k <= PER_SEG; k++) {
      const t = k / PER_SEG;
      const u = 1 - t;
      const x = u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x;
      const y = u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y;
      const prev = xs.length - 1;
      len.push(prev < 0 ? 0 : len[prev] + Math.hypot(x - xs[prev], y - ys[prev]));
      xs.push(x);
      ys.push(y);
    }
  }
  // Resample at an even step along the arc.
  const L = len[len.length - 1];
  const n = Math.max(2, Math.ceil(L / 2) + 1);
  const step = L / (n - 1);
  const lut = new Float32Array(n * 2);
  let j = 0;
  for (let k = 0; k < n; k++) {
    const s = k * step;
    while (j < len.length - 2 && len[j + 1] < s) j++;
    const span = len[j + 1] - len[j] || 1;
    const fr = clamp((s - len[j]) / span, 0, 1);
    lut[k * 2] = xs[j] + (xs[j + 1] - xs[j]) * fr;
    lut[k * 2 + 1] = ys[j] + (ys[j + 1] - ys[j]) * fr;
  }
  return { L, n, step, lut };
}

// Very slow, uneven drift of the whole wave (px). Periods all divide 60 s so
// it loops with the fish; each swell takes ~10 s.
function drift(t: number) {
  return {
    x: 6 * Math.sin((TAU * t) / 60) + 3 * Math.sin((TAU * t) / 20 + 1.3),
    y: 8 * Math.sin((TAU * t) / 10) + 4 * Math.sin((TAU * t) / 30 + 0.8),
  };
}

// A slightly different school layout per seed: rows of uneven gaps, fish at
// different depths below the surface, one of the front row drifting ahead.
function makeFormation(count: number, rng: Rng): { slots: Slot[]; leader: number } {
  const rows = pick(rng, ARRANGEMENTS[count]);
  const slots: Slot[] = [];
  let along = 0;
  rows.forEach((n, row) => {
    if (row > 0) along -= between(rng, 30, 44);
    const top = between(rng, 2, 10) + (row % 2 ? 9 : 0); // stagger alternate rows
    for (let q = 0; q < n; q++) {
      slots.push({
        along: along + between(rng, -4, 4),
        across: top + q * between(rng, 17, 23), // depth below the surface, px
      });
    }
  });
  const leader = Math.floor(rng() * rows[0]); // one of the front row
  slots[leader].along += LEAD_AHEAD;
  return { slots, leader };
}

// The path, sampled every ~2px (interleaved x, y), plus what the bake needs
// to know about the hero.
type Geo = {
  W: number;
  L: number;
  bandPx: number;
  entryS: number;
  lut: Float32Array;
  step: number;
  n: number;
  obstacles: DOMRect[];
};

const pointAt = (g: Geo, si: number): Pt => {
  const u = clamp(si, 0, g.L) / g.step;
  const k = Math.min(Math.floor(u), g.n - 2);
  const fr = u - k;
  const i = k * 2;
  return {
    x: g.lut[i] + (g.lut[i + 2] - g.lut[i]) * fr,
    y: g.lut[i + 1] + (g.lut[i + 3] - g.lut[i + 1]) * fr,
  };
};

// Direction of travel at an arc length; always points forward along the wave.
const headingAt = (g: Geo, si: number) => {
  const c = clamp(si, 4, g.L - 4);
  const a = pointAt(g, c - 4);
  const b = pointAt(g, c + 4);
  return Math.atan2(b.y - a.y, b.x - a.x);
};

const hitsObstacle = (g: Geo, x: number, y: number) =>
  g.obstacles.some(
    (o) => x > o.left - 8 && x < o.right + 8 && y > o.top - 8 && y < o.bottom + 8,
  );

type Peak = { t: number; v: number };
type CurlEvent = {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  side: 1 | -1;
  size: number;
  strength: number;
};
type FishTrack = {
  used: boolean;
  scale: number;
  keys: Float32Array; // per keyframe: x, y, heading (deg), opacity
  tail: Peak[]; // tail angle at each swing extreme (deg), plus both loop ends
  curls: CurlEvent[];
};
type Baked = { fish: FishTrack[]; wave: Float32Array };

// Run the school simulation for two loops and record the second.
function* bake(g: Geo): Generator<void, Baked, void> {
  const dt = 1 / SIM_HZ;
  const fish = Array.from({ length: POOL }, () => ({
    active: false,
    school: 0,
    slot: { along: 0, across: 0 },
    target: { along: 0, across: 0 },
    scale: 1,
    opacity: 0,
    sway: 1.2,
    phase: 0,
    wander: [8, 10, 12, 14],
    turnRate: 3,
    enterAt: 0,
    exitAt: 0,
    heading: NaN,
    pathHeading: 0,
    shown: 0,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    vx: 0,
    vy: 0,
    hasPrev: false,
    beat: 0,
    prevBeat: 0,
    mode: 0,
    modeIn: 0,
    beatMul: 1,
    ampMul: 1,
    surge: 0,
    push: { x: 0, y: 0 },
    inPath: false,
  }));
  type Fish = (typeof fish)[number];
  const schools = SCHEDULE.map(() => ({
    active: false,
    e: 0, // s since it entered
    s: 0,
    speed: 0,
    slope: 0, // <0 climbing, >0 descending
    stretch: 1,
    length: 0,
    members: [] as number[],
    leader: 0,
    leadIn: 0,
    swapIn: 0,
    rng: mulberry32(0),
  }));
  const tracks: FishTrack[] = fish.map(() => ({
    used: false,
    scale: 1,
    keys: new Float32Array((KEYS + 1) * 4),
    tail: [],
    curls: [],
  }));
  const wave = new Float32Array((KEYS + 1) * 2);
  // What happens right after the loop ends, per fish: x, y, heading, opacity.
  const cont = fish.map(() => new Float32Array((BLEND_KEYS + 1) * 4));

  const setMode = (f: Fish, mode: number, rng: Rng) => {
    f.mode = mode;
    const [lo, hi] = mode === 1 ? BURST_TIME : mode === 2 ? GLIDE_TIME : CRUISE_TIME;
    f.modeIn = between(rng, lo, hi);
  };

  const spawn = (j: number) => {
    const plan = SCHEDULE[j];
    const sc = schools[j];
    const rng = mulberry32(plan.seed);
    const { slots, leader } = makeFormation(plan.count, rng);
    sc.rng = rng;
    sc.active = true;
    sc.e = 0;
    sc.s = g.entryS;
    sc.speed = 1 / plan.crossing;
    sc.stretch = 1;
    sc.length = Math.max(...slots.map((p) => -p.along));
    sc.members = slots.map((_, k) => j * MAX_PER_SCHOOL + k);
    sc.leader = sc.members[leader];
    sc.leadIn = between(rng, LEAD_CHANGE[0], LEAD_CHANGE[1]);
    sc.swapIn = between(rng, SWAP[0], SWAP[1]);
    sc.members.forEach((i, k) => {
      const f = fish[i];
      f.active = true;
      f.school = j;
      f.slot = { ...slots[k] };
      f.target = { ...slots[k] };
      f.scale = clamp(
        SCALE_RANGE[0] + (SCALE_RANGE[1] - SCALE_RANGE[0]) * plan.depth + between(rng, -0.06, 0.06),
        0.58,
        1.2,
      );
      f.opacity = BASE_OPACITY * (0.82 + 0.3 * plan.depth) * between(rng, 0.95, 1.05);
      f.sway = between(rng, 1.05, 1.5);
      f.phase = rng() * TAU;
      f.wander = [between(rng, 8, 16), between(rng, 8, 16), between(rng, 8, 16), between(rng, 8, 16)];
      f.turnRate = between(rng, 2.4, 3.6);
      // Staggered arrival and departure: each fish fades in/out at its own spot.
      f.enterAt = between(rng, -30, 20);
      f.exitAt = between(rng, -20, 30);
      f.heading = NaN;
      f.shown = 0;
      f.push = { x: 0, y: 0 };
      f.beat = 0;
      f.prevBeat = f.phase;
      setMode(f, 0, rng);
      f.modeIn *= rng(); // so a school doesn't burst in unison
      f.beatMul = 1;
      f.ampMul = 1;
      f.surge = 0;
      f.hasPrev = false;
      f.vx = 0;
      f.vy = 0;
      tracks[i].used = true;
      tracks[i].scale = f.scale;
    });
  };

  // Two fish trade spots; the slot easing turns it into a slow glide.
  const trade = (a: number, b: number) => {
    [fish[a].target, fish[b].target] = [fish[b].target, fish[a].target];
  };

  const advanceSchools = () => {
    schools.forEach((sc) => {
      if (!sc.active) return;
      sc.e += dt;
      const slope = Math.sin(headingAt(g, sc.s));
      sc.slope = slope;
      // Slower uphill, faster downhill, always gentle.
      sc.s += g.L * sc.speed * (1 + 0.2 * slope) * dt;
      // Strung out on the slopes, gathered a little at the crest and trough.
      sc.stretch += (0.88 + 0.32 * Math.abs(slope) - sc.stretch) * ease(dt, 3);

      sc.leadIn -= dt;
      if (sc.leadIn <= 0 && sc.members.length > 1) {
        sc.leadIn = between(sc.rng, LEAD_CHANGE[0], LEAD_CHANGE[1]);
        const next = pick(sc.rng, sc.members.filter((i) => i !== sc.leader));
        trade(sc.leader, next);
        sc.leader = next;
      }
      sc.swapIn -= dt;
      if (sc.swapIn <= 0 && sc.members.length > 2) {
        sc.swapIn = between(sc.rng, SWAP[0], SWAP[1]);
        const others = sc.members.filter((i) => i !== sc.leader);
        const a = pick(sc.rng, others);
        const dist = (p: number) =>
          Math.hypot(
            fish[p].target.along - fish[a].target.along,
            fish[p].target.across - fish[a].target.across,
          );
        const near = others.filter((i) => i !== a).sort((p, q) => dist(p) - dist(q))[0];
        if (near !== undefined) trade(a, near);
      }

      // Gone off the right (always well before it is due again).
      if (sc.s - sc.length * 1.3 - 40 > g.L || sc.e > LOOP - 1) {
        sc.active = false;
        sc.members.forEach((i) => (fish[i].active = false));
      }
    });
  };

  // Long-lived per-fish state: spot in the school, burst cycle, tail phase.
  // Runs every step, including the cheap part of the warm-up.
  const internal = (f: Fish) => {
    if (!f.active) return;
    const sc = schools[f.school];
    const k = ease(dt, SLOT_EASE);
    f.slot.along += (f.target.along - f.slot.along) * k;
    f.slot.across += (f.target.across - f.slot.across) * k;

    // Burst → glide → cruise.
    f.modeIn -= dt;
    if (f.modeIn <= 0) setMode(f, f.mode === 1 ? 2 : f.mode === 2 ? 0 : 1, sc.rng);
    f.beatMul += (MODE_BEAT[f.mode] - f.beatMul) * ease(dt, 0.25);
    f.ampMul += (MODE_AMP[f.mode] - f.ampMul) * ease(dt, 0.3);
    f.surge += (MODE_SURGE[f.mode] - f.surge) * ease(dt, f.mode === 0 ? 1.5 : 0.6);

    // Tail beats faster downhill (where the school speeds up), slower uphill.
    f.prevBeat = f.beat + f.phase;
    f.beat += (dt * TAU * (1 + 0.4 * sc.slope) * f.beatMul) / f.sway;
  };

  const positionFish = (f: Fish, off: Pt) => {
    if (!f.active) {
      f.inPath = false;
      return;
    }
    const sc = schools[f.school];

    // Personal drift: a little forward/back and up/down.
    const e = sc.e;
    const [a1, a2, c1, c2] = f.wander;
    const along =
      f.slot.along * sc.stretch +
      f.surge +
      4 * Math.sin((TAU * e) / a1 + f.phase) +
      2 * Math.sin((TAU * e) / a2 + 2 * f.phase);
    const across =
      f.slot.across +
      2.5 * Math.sin((TAU * e) / c1 + 3 * f.phase) +
      1.5 * Math.sin((TAU * e) / c2 + f.phase);

    const si = sc.s + along;
    const target = headingAt(g, si);
    f.pathHeading = target;
    if (Number.isNaN(f.heading)) f.heading = target;

    const p = pointAt(g, si);
    const plan = SCHEDULE[f.school];
    const lane = Math.max(
      0,
      plan.lane + LANE_DRIFT * Math.sin((TAU * e) / (47 + f.school * 9) + f.school * 1.7),
    );
    f.x = p.x + off.x - Math.sin(target) * across + f.push.x;
    f.y = p.y + off.y + Math.cos(target) * across + lane * g.bandPx + f.push.y;
    f.inPath = si > -60 && si < g.L + 60;
  };

  // Keep every pair of fish apart (soft inside a comfort zone, hard at
  // KEEP_APART). Nudges relax slowly once they're clear.
  const separate = () => {
    const relax = Math.exp(-0.4 * dt);
    const live: Fish[] = [];
    for (const f of fish) {
      f.push.x *= relax;
      f.push.y *= relax;
      if (f.inPath) live.push(f);
    }
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < live.length; i++) {
        const a = live[i];
        const c = Math.cos(a.heading);
        const s = Math.sin(a.heading);
        for (let j = i + 1; j < live.length; j++) {
          const b = live[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const u = dx * c + dy * s;
          const v = -dx * s + dy * c;
          const pu = (a.scale + b.scale) * HALF_LENGTH + KEEP_APART + COMFORT - Math.abs(u);
          const pv = (a.scale + b.scale) * HALF_HEIGHT + KEEP_APART + COMFORT - Math.abs(v);
          if (pu <= 0 || pv <= 0) continue;
          const soft = Math.min(1, dt * EASE_APART);
          const amount = (p: number) => Math.max(p * soft, p - COMFORT) / 2;
          let px: number;
          let py: number;
          if (pv < pu) {
            const k = amount(pv) * Math.sign(v || 1);
            px = -s * k;
            py = c * k;
          } else {
            const k = amount(pu) * Math.sign(u || 1);
            px = c * k;
            py = s * k;
          }
          a.x -= px;
          a.y -= py;
          a.push.x -= px;
          a.push.y -= py;
          b.x += px;
          b.y += py;
          b.push.x += px;
          b.push.y += py;
        }
      }
    }
  };

  // Face where the fish actually goes (within MAX_VEER of the path).
  const steer = (f: Fish) => {
    if (!f.inPath) {
      f.hasPrev = false;
      return;
    }
    let want = f.pathHeading;
    if (f.hasPrev) {
      const k = ease(dt, 0.25);
      f.vx += ((f.x - f.px) / dt - f.vx) * k;
      f.vy += ((f.y - f.py) / dt - f.vy) * k;
      const sp = Math.hypot(f.vx, f.vy);
      const w = smoothstep((sp - 4) / 12);
      const veer = clamp(wrapAngle(Math.atan2(f.vy, f.vx) - f.pathHeading), -MAX_VEER, MAX_VEER);
      want = f.pathHeading + veer * w;
    }
    f.px = f.x;
    f.py = f.y;
    f.hasPrev = true;
    f.heading += wrapAngle(want - f.heading) * Math.min(1, dt * f.turnRate);
  };

  // Phase crossed off + qπ this step? Returns q, or null.
  const crossed = (a0: number, a1: number, off: number) => {
    const q0 = Math.floor((a0 - off) / Math.PI);
    const q1 = Math.floor((a1 - off) / Math.PI);
    return q1 > q0 ? q1 : null;
  };

  const tailNow = (f: Fish) => TAIL_SWING * f.ampMul * Math.sin(f.beat + f.phase);

  for (let n = 0; n <= 2 * STEPS + SEAM_BLEND * SIM_HZ; n++) {
    if (n % BAKE_SLICE === 0) yield; // let the caller spread the work over idle time
    const tau = (n % STEPS) / SIM_HZ;
    const rec = n >= STEPS && n <= 2 * STEPS;
    const after = n >= 2 * STEPS;
    const lt = (n - STEPS) / SIM_HZ;

    SCHEDULE.forEach((p, j) => {
      if (n % STEPS === p.at * SIM_HZ) spawn(j);
    });
    advanceSchools();
    for (const f of fish) internal(f);
    if (n < STEPS - WARM_FULL * SIM_HZ) continue; // cheap warm-up
    const off = drift(tau);
    for (const f of fish) positionFish(f, off);
    separate();
    for (const f of fish) steer(f);

    fish.forEach((f, i) => {
      const edge =
        smoothstep((f.x - f.enterAt) / EDGE_FADE) * smoothstep((g.W + f.exitAt - f.x) / EDGE_FADE);
      const goal = f.inPath ? f.opacity * edge * (hitsObstacle(g, f.x, f.y) ? 0.35 : 1) : 0;
      f.shown += (goal - f.shown) * Math.min(1, dt * 3);
      if (after && (n - 2 * STEPS) % KEY_EVERY === 0) {
        const k = ((n - 2 * STEPS) / KEY_EVERY) * 4;
        cont[i][k] = f.x;
        cont[i][k + 1] = f.y;
        cont[i][k + 2] = Number.isNaN(f.heading) ? 0 : f.heading * DEG;
        cont[i][k + 3] = f.shown;
      }
      if (!rec) return;
      const tr = tracks[i];

      if (f.inPath) {
        const a0 = f.prevBeat;
        const a1 = f.beat + f.phase;
        const qt = crossed(a0, a1, Math.PI / 2);
        if (qt !== null) tr.tail.push({ t: lt, v: TAIL_SWING * f.ampMul * parity(qt) });
        // Each tail swing (a zero crossing) releases one curl on the new side;
        // a coasting fish with its tail nearly still leaves none.
        const qc = crossed(a0, a1, 0);
        if (qc !== null && f.shown > 0.02 && f.ampMul >= 0.5) {
          const side = parity(qc) as 1 | -1;
          const h = f.heading;
          const tipX = f.x + Math.cos(h) * TAIL_TIP_X * f.scale;
          const tipY = f.y + Math.sin(h) * TAIL_TIP_X * f.scale;
          const nx = -Math.sin(h) * side;
          const ny = Math.cos(h) * side;
          tr.curls.push({
            t: lt,
            x: tipX + nx * 2 * f.scale,
            y: tipY + ny * 2 * f.scale,
            vx: nx * 7 - Math.cos(h) * 4,
            vy: ny * 7 - Math.sin(h) * 4,
            heading: h,
            side,
            size: f.scale,
            strength: f.shown / f.opacity,
          });
        }
      }
      // Both loop ends get the exact tail angle, so the seam is smooth.
      if (n === STEPS || n === 2 * STEPS) tr.tail.push({ t: lt, v: f.active ? tailNow(f) : 0 });
      if ((n - STEPS) % KEY_EVERY === 0) {
        const k = ((n - STEPS) / KEY_EVERY) * 4;
        tr.keys[k] = f.x;
        tr.keys[k + 1] = f.y;
        tr.keys[k + 2] = Number.isNaN(f.heading) ? 0 : f.heading * DEG;
        tr.keys[k + 3] = f.shown;
      }
    });
    if (rec && (n - STEPS) % KEY_EVERY === 0) {
      const k = ((n - STEPS) / KEY_EVERY) * 2;
      wave[k] = off.x;
      wave[k + 1] = off.y;
    }
  }
  for (const tr of tracks) tr.tail.sort((a, b) => a.t - b.t);
  // Seam: blend the continuation into the loop's opening seconds.
  tracks.forEach((tr, i) => {
    const c = cont[i];
    for (let k = 0; k <= BLEND_KEYS; k++) {
      const w = smoothstep(k / BLEND_KEYS);
      const o = k * 4;
      tr.keys[o] = c[o] + (tr.keys[o] - c[o]) * w;
      tr.keys[o + 1] = c[o + 1] + (tr.keys[o + 1] - c[o + 1]) * w;
      const dh = ((((tr.keys[o + 2] - c[o + 2]) % 360) + 540) % 360) - 180;
      tr.keys[o + 2] = c[o + 2] + dh * w;
      tr.keys[o + 3] = c[o + 3] + (tr.keys[o + 3] - c[o + 3]) * w;
    }
  });
  return { fish: tracks, wave };
}

// Swing extremes → keyframes. Between extremes the motion eases in and out,
// which is a close match for a sine; the loop ends sit mid-swing. `gain`
// reuses the tail's timing for the head's sway (opposite, much smaller).
function swingKeyframes(peaks: Peak[], gain = 1): Keyframe[] {
  const last = peaks.length - 1;
  return peaks.map((p, i) => ({
    offset: clamp(p.t / LOOP, 0, 1),
    transform: `rotate(${r(p.v * gain)}deg)`,
    easing: i === 0 ? "ease-out" : i === last - 1 ? "ease-in" : "ease-in-out",
  }));
}

// Where a curl is `a` seconds after release, as a keyframe.
function curlFrame(c: CurlEvent, a: number, t: number) {
  const k = a / CURL_LIFE;
  const travel = (1 - Math.exp(-3 * a)) / 3; // its push slows to a stop
  const x = c.x + c.vx * travel;
  const y = c.y + c.vy * travel;
  const rad = (1.6 + 4 * smoothstep(k)) * c.size; // widens softly
  const rot = c.heading + (c.side > 0 ? Math.PI / 2 : -Math.PI / 2) + c.side * 0.9 * k;
  const sc = rad / CURL_PX;
  const fade = Math.min(1, k * 6) * (1 - k) ** 1.5; // quick fade-in, long fade-out
  return {
    t,
    transform: `translate(${r(x)}px,${r(y)}px) rotate(${r(rot * DEG)}deg) scale(${sc.toFixed(3)},${(sc * c.side).toFixed(3)})`,
    opacity: +(CURL_OPACITY * fade * c.strength).toFixed(3),
  };
}

// Share one fish's curls between its CURL_POOL elements (a curl may wrap past
// the end of the loop), and turn each element's curls into keyframes.
function curlTracks(curls: CurlEvent[]): Keyframe[][] {
  const busy: [number, number][][] = Array.from({ length: CURL_POOL }, () => []);
  const frames: ReturnType<typeof curlFrame>[][] = Array.from({ length: CURL_POOL }, () => []);
  const spans = (t0: number): [number, number][] => {
    const t1 = t0 + CURL_LIFE;
    return t1 <= LOOP ? [[t0, t1]] : [[t0, LOOP], [0, t1 - LOOP]];
  };
  for (const c of curls) {
    const mine = spans(c.t);
    const slot = busy.findIndex((list) =>
      list.every(([b0, b1]) => mine.every(([m0, m1]) => m1 <= b0 || m0 >= b1)),
    );
    if (slot < 0) continue;
    busy[slot].push(...mine);
    for (const kk of CURL_SAMPLES) {
      const a = kk * CURL_LIFE;
      const t = c.t + a;
      frames[slot].push(curlFrame(c, a, t < LOOP ? t : t - LOOP));
    }
    if (c.t + CURL_LIFE > LOOP) {
      const a = LOOP - c.t;
      frames[slot].push(curlFrame(c, a, LOOP), curlFrame(c, a, 0));
    }
  }
  return frames.map((list) => {
    if (!list.length) return [];
    list.sort((a, b) => a.t - b.t);
    const kf: Keyframe[] = list.map((f) => ({
      offset: f.t / LOOP,
      transform: f.transform,
      opacity: f.opacity,
    }));
    if (list[0].t > 0) kf.unshift({ offset: 0, transform: list[0].transform, opacity: 0 });
    const end = list[list.length - 1];
    if (end.t < LOOP) kf.push({ offset: 1, transform: end.transform, opacity: 0 });
    return kf;
  });
}

export default function HeroOcean() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.parentElement;
    if (!root || !section) return;

    const wave = section.querySelector<HTMLElement>("[data-hero-wave]");
    const fishLayer = root.querySelector<HTMLElement>("[data-ocean-fish]")!;
    const pushEls = [...root.querySelectorAll<HTMLElement>("[data-push]")];
    const fishEls = pushEls.map((p) => p.querySelector<HTMLElement>("[data-fish]")!);
    const yawEls = pushEls.map((p) => p.querySelector<HTMLElement>("[data-yaw]")!);
    const bodyEls = pushEls.map((p) => p.querySelector<SVGSVGElement>("[data-body]")!);
    const tailEls = pushEls.map((p) => p.querySelector<SVGSVGElement>("[data-tail]")!);
    const curlEls = [...root.querySelectorAll<HTMLElement>("[data-curl]")];

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let anims: Animation[] = [];
    let baked: Baked | null = null;
    let size = { w: 0, h: 0 };
    let faded = false;
    let inView = true;

    const measure = (): Geo => {
      const W = section.clientWidth;
      const h = section.clientHeight;
      const { L, n, step, lut } = samplePath(W, h);
      // Where the path is ~40px left of the screen, so schools enter from
      // just off-screen instead of along the hidden start of the curve.
      let first = 0;
      while (first < n - 1 && lut[(first + 1) * 2] < -40) first++;
      const lo = first * step;
      const base = section.getBoundingClientRect();
      // Fish dim behind the buttons and behind the tagline's actual lines of
      // text (not its whole box, which is much wider than the words).
      const obstacles = [...section.querySelectorAll("[data-hero-obstacle]")].flatMap((el) => {
        let rects: DOMRect[];
        if (el.tagName === "P") {
          const range = document.createRange();
          range.selectNodeContents(el);
          rects = [...range.getClientRects()];
        } else {
          rects = [el.getBoundingClientRect()];
        }
        return rects.map(
          (b) => new DOMRect(b.left - base.left, b.top - base.top, b.width, b.height),
        );
      });
      size = { w: W, h };
      return { W, L, bandPx: (BAND_THICKNESS / VB.h) * h, entryS: lo, lut, step, n, obstacles };
    };

    const teardown = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
      baked = null;
    };

    // Bake the loop for the current hero size and hand it to the browser, a
    // few ms at a time in idle slices so it never blocks the page. After a
    // resize the old animations keep playing until the new set swaps in.
    let job = 0;
    let building = false;
    let pending: Animation[] = [];
    // Yield to the browser between slices (it can render and handle input).
    const idle = (fn: () => void) => window.setTimeout(fn, 0);
    const cancelBuild = () => {
      job++;
      building = false;
      pending.forEach((a) => a.cancel());
      pending = [];
    };

    const build = () => {
      cancelBuild();
      const id = job;
      building = true;
      const gen = bake(measure());
      const opts: KeyframeAnimationOptions = { duration: LOOP * 1000, iterations: Infinity };
      const created: Animation[] = [];
      pending = created;
      const make = (el: Element, kf: Keyframe[]) => {
        const a = el.animate(kf, opts);
        a.pause();
        created.push(a);
      };
      let b: Baked | null = null;
      let next = 0; // fish index; POOL = the wave; past that, done

      // One small unit of work; false once everything is ready.
      const step = (): boolean => {
        if (!b) {
          const res = gen.next();
          if (res.done) b = res.value;
          return true;
        }
        if (next < POOL) {
          const i = next++;
          const tr = b.fish[i];
          if (!tr.used) return true;
          // Keyframes only while the fish can be seen (plus one either side);
          // long invisible stretches collapse to their two ends.
          const kf: Keyframe[] = [];
          const hidden = (k: number) => k < 0 || k > KEYS || tr.keys[k * 4 + 3] < 0.001;
          for (let k = 0; k <= KEYS; k++) {
            const edge = k === 0 || k === KEYS;
            if (!edge && hidden(k - 1) && hidden(k) && hidden(k + 1)) continue;
            kf.push({
              offset: k / KEYS,
              transform: `translate(${r(tr.keys[k * 4])}px,${r(tr.keys[k * 4 + 1])}px) rotate(${r(tr.keys[k * 4 + 2])}deg)`,
              opacity: +tr.keys[k * 4 + 3].toFixed(3),
            });
          }
          make(fishEls[i], kf);
          if (tr.tail.length > 1) {
            make(tailEls[i], swingKeyframes(tr.tail));
            make(yawEls[i], swingKeyframes(tr.tail, -BODY_YAW / TAIL_SWING));
          }
          curlTracks(tr.curls).forEach((ckf, k) => {
            if (ckf.length) make(curlEls[i * CURL_POOL + k], ckf);
          });
          return true;
        }
        if (next === POOL) {
          next++;
          if (wave) {
            const kf: Keyframe[] = [];
            for (let k = 0; k <= KEYS; k++) {
              kf.push({ transform: `translate3d(${r(b.wave[k * 2])}px,${r(b.wave[k * 2 + 1])}px,0)` });
            }
            make(wave, kf);
          }
          return true;
        }
        return false;
      };

      // Swap the new loop in, picking up where the old one was.
      const finish = (done: Baked) => {
        const startMs = anims.length ? loopMs() : START_AT * 1000;
        anims.forEach((a) => a.cancel());
        anims = created;
        pending = [];
        building = false;
        baked = done;
        done.fish.forEach((tr, i) => {
          if (!tr.used) return;
          // Size each fish's drawing for its scale, so it is rasterised crisply.
          for (const svg of [bodyEls[i], tailEls[i]]) {
            svg.style.width = `${r(FISH_VIEW.w * tr.scale)}px`;
            svg.style.height = `${r(FISH_VIEW.h * tr.scale)}px`;
            svg.style.left = `${r(FISH_VIEW.x * tr.scale)}px`;
            svg.style.top = `${r(FISH_VIEW.y * tr.scale)}px`;
          }
          tailEls[i].style.transformOrigin = `${r((TAIL_PIVOT_X - FISH_VIEW.x) * tr.scale)}px ${r(-FISH_VIEW.y * tr.scale)}px`;
        });
        // Nearer fish draw on top.
        pushEls
          .map((el, i) => ({ el, z: done.fish[i].used ? done.fish[i].scale : 0 }))
          .sort((a, c) => a.z - c.z)
          .forEach(({ el }) => fishLayer.appendChild(el));
        anims.forEach((a) => (a.currentTime = startMs));
        if (!faded) {
          faded = true;
          root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: FADE_IN, easing: "ease-out" });
        }
        sync();
      };

      const slice = () => {
        if (id !== job) return; // superseded or torn down
        const end = performance.now() + SLICE_MS;
        while (performance.now() < end) {
          if (!step()) {
            finish(b!);
            return;
          }
        }
        idle(slice);
      };
      idle(slice);
    };

    const loopMs = () => {
      const t = Number(anims[0]?.currentTime ?? 0);
      return ((t % (LOOP * 1000)) + LOOP * 1000) % (LOOP * 1000);
    };

    // Cursor: the only per-frame JS, and only while a mouse is over the hero
    // or fish are still drifting back. Reads each fish's position from the
    // baked keys and nudges a wrapper around it.
    let cursor: Pt | null = null;
    let cursorRaf = 0;
    let cursorLast = 0;
    const push = pushEls.map(() => ({ x: 0, y: 0, set: false }));
    const tickCursor = (now: number) => {
      const dt = Math.min((now - cursorLast) / 1000, 0.05);
      cursorLast = now;
      let busy = false;
      if (baked) {
        const u = (loopMs() / 1000) * (SIM_HZ / KEY_EVERY);
        const k = Math.min(Math.floor(u), KEYS - 1);
        const fr = u - k;
        const relax = Math.exp(-CURSOR_RELAX * dt);
        baked.fish.forEach((tr, i) => {
          if (!tr.used) return;
          const p = push[i];
          p.x *= relax;
          p.y *= relax;
          const at = (o: number) => tr.keys[k * 4 + o] + (tr.keys[(k + 1) * 4 + o] - tr.keys[k * 4 + o]) * fr;
          if (cursor && at(3) > 0.02) {
            const dx = at(0) + p.x - cursor.x;
            const dy = at(1) + p.y - cursor.y;
            const d = Math.hypot(dx, dy);
            if (d < CURSOR_RADIUS && d > 0.001) {
              const s = (1 - d / CURSOR_RADIUS) ** 2 * CURSOR_PUSH * dt;
              p.x += (dx / d) * s;
              p.y += (dy / d) * s;
              const m = Math.hypot(p.x, p.y);
              if (m > PUSH_CAP) {
                p.x *= PUSH_CAP / m;
                p.y *= PUSH_CAP / m;
              }
            }
          }
          if (Math.hypot(p.x, p.y) > 0.05) {
            busy = true;
            p.set = true;
            pushEls[i].style.transform = `translate(${r(p.x)}px,${r(p.y)}px)`;
          } else if (p.set) {
            p.x = 0;
            p.y = 0;
            p.set = false;
            pushEls[i].style.transform = "";
          }
        });
      }
      cursorRaf = cursor || busy ? requestAnimationFrame(tickCursor) : 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!finePointer.matches || e.pointerType !== "mouse" || !anims.length) {
        cursor = null;
        return;
      }
      const b = section.getBoundingClientRect();
      cursor = { x: e.clientX - b.left, y: e.clientY - b.top };
      if (!cursorRaf) {
        cursorLast = performance.now();
        cursorRaf = requestAnimationFrame(tickCursor);
      }
    };
    const onPointerLeave = () => {
      cursor = null;
    };

    const sync = () => {
      if (mq.matches) {
        // Reduced motion: no fish, wave at rest.
        cancelBuild();
        teardown();
        return;
      }
      if (!anims.length && !building) build();
      const play = inView && !document.hidden;
      anims.forEach((a) => (play ? a.play() : a.pause()));
    };

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!anims.length && !building) return;
        if (section.clientWidth === size.w && section.clientHeight === size.h) return;
        build();
      }, 200);
    });
    ro.observe(section);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(section);

    document.addEventListener("visibilitychange", sync);
    mq.addEventListener("change", sync);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    sync();

    return () => {
      cancelBuild();
      teardown();
      cancelAnimationFrame(cursorRaf);
      window.clearTimeout(resizeTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", sync);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      pushEls.forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Wake sits behind the fish, in the water they've just passed through. */}
      <div>
        {Array.from({ length: POOL * CURL_POOL }, (_, i) => (
          <div key={i} data-curl className="absolute top-0 left-0 opacity-0">
            <svg
              viewBox="-1.25 -1.25 2.5 2.5"
              width={CURL_PX * 2.5}
              height={CURL_PX * 2.5}
              className="absolute overflow-visible"
              style={{ left: -CURL_PX * 1.25, top: -CURL_PX * 1.25 }}
            >
              <path
                d={CURL}
                fill="none"
                stroke="var(--surface)"
                strokeWidth={0.5}
                strokeLinecap="round"
              />
            </svg>
          </div>
        ))}
      </div>
      <div data-ocean-fish>
        {Array.from({ length: POOL }, (_, i) => (
          <div key={i} data-push className="absolute top-0 left-0">
            <div data-fish className="absolute top-0 left-0 opacity-0">
              <div data-yaw className="absolute top-0 left-0">
                <svg
                  data-body
                  viewBox={`${FISH_VIEW.x} ${FISH_VIEW.y} ${FISH_VIEW.w} ${FISH_VIEW.h}`}
                  className="absolute overflow-visible"
                  fill="var(--surface)"
                >
                  <path d={BODY} />
                </svg>
                <svg
                  data-tail
                  viewBox={`${FISH_VIEW.x} ${FISH_VIEW.y} ${FISH_VIEW.w} ${FISH_VIEW.h}`}
                  className="absolute overflow-visible"
                  fill="var(--surface)"
                >
                  <path d={TAIL} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
