import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, motionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import { Airplane, Helicopter, HotAirBalloon, Parachutist, type Heading } from "./SkyCraft";
import { AIRPLANE, BALLOON, HELICOPTER, PARACHUTE } from "./skyCraftSizes";

const TAU = Math.PI * 2;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const between = (roll: () => number, min: number, max: number) => min + (max - min) * roll();

type Bounds = { width: number; height: number };
type Zone = [number, number];

/** One trip across the sky. Fractions are of the scene size; speeds are px/s at full scale. */
type Flight = {
  heading: Heading;
  depth: number;
  /** Starting x fraction for a craft already in the sky, or null to enter from the edge. */
  from: number | null;
  /** Cruising height as a fraction of the scene; a negative value means enter from above. */
  altitude: number;
  speed: number;
  drift: number;
  delay: number;
  period: number;
  phase: number;
};

type Pose = { x: number; y: number; rotate: number; opacity: number; flame: number; done: boolean };

type Craft = {
  size: { width: number; height: number };
  /** Rendered px per drawing unit for the nearest craft on a wide screen. */
  scale: number;
  origin: [number, number];
  /** Horizontal fliers own an altitude lane; parachutists own a column. */
  lane: "x" | "y";
  /** `zone` is this craft's own column of the sky, as x fractions, so each kind spreads across the width. */
  launch: (roll: () => number, first: boolean, zone: Zone) => Flight;
  fly: (flight: Flight, t: number, bounds: Bounds, px: number) => Pose;
  render: (flight: Flight, flame: MotionValue<number>) => ReactNode;
};

const fade = (depth: number) => 0.45 + 0.45 * depth;
const SKY_TOP = 0.1;
const SKY_BOTTOM = 0.74;
const LANDING = 0.82;

/** Horizontal cruise shared by planes, helicopters and balloons: enter from one edge, leave by the other. */
function cruise(flight: Flight, t: number, bounds: Bounds, width: number, trail: number) {
  const start = flight.from !== null ? flight.from * bounds.width : flight.heading === 1 ? -width : bounds.width;
  const x = start + flight.heading * flight.speed * Math.max(0, t - flight.delay);
  const done = flight.heading === 1 ? x - trail > bounds.width : x + width + trail < 0;
  return { x, done };
}

const CONTRAIL = 200;

const airplane: Craft = {
  size: AIRPLANE,
  scale: 1,
  origin: [0.5, 0.6],
  lane: "x",
  launch: (roll, first, [left, right]) => {
    const depth = between(roll, 0.55, 1);
    return {
      heading: roll() < 0.5 ? 1 : -1,
      depth,
      from: first ? between(roll, left, right) : null,
      altitude: between(roll, SKY_TOP, SKY_BOTTOM),
      speed: 55 + 55 * depth,
      drift: 0,
      delay: first ? 0 : between(roll, 4, 12),
      period: between(roll, 9, 14),
      phase: roll() * TAU,
    };
  },
  fly: (flight, t, bounds, px) => {
    const unit = px * flight.depth;
    const { x, done } = cruise(flight, t, bounds, AIRPLANE.width * unit, CONTRAIL * unit);
    const wave = TAU * (t / flight.period) + flight.phase;
    return {
      x,
      y: flight.altitude * bounds.height + 5 * px * Math.sin(wave),
      rotate: flight.heading * 1.2 * Math.cos(wave),
      opacity: fade(flight.depth),
      flame: 0,
      done,
    };
  },
  render: (flight) => <Airplane heading={flight.heading} />,
};

const helicopter: Craft = {
  size: HELICOPTER,
  scale: 0.9,
  origin: [0.52, 0.3],
  lane: "x",
  launch: (roll, first, [left, right]) => {
    const depth = between(roll, 0.55, 1);
    return {
      heading: roll() < 0.5 ? 1 : -1,
      depth,
      from: first ? between(roll, left, right) : null,
      altitude: between(roll, SKY_TOP, SKY_BOTTOM),
      speed: 28 + 34 * depth,
      drift: 0,
      delay: first ? 0 : between(roll, 3, 12),
      period: between(roll, 2.8, 4.2),
      phase: roll() * TAU,
    };
  },
  fly: (flight, t, bounds, px) => {
    const cruising = Math.max(0, t - flight.delay);
    const { x, done } = cruise(flight, t, bounds, HELICOPTER.width * px * flight.depth, 0);
    // Surges forward and eases off; it pitches nose-down harder while speeding up.
    const surge = TAU * (cruising / (flight.period * 3)) + flight.phase;
    const bob = TAU * (t / flight.period) + flight.phase;
    return {
      x: x + flight.heading * ((flight.speed * flight.period * 0.6) / TAU) * Math.sin(surge),
      y: flight.altitude * bounds.height + 4 * px * Math.sin(bob),
      rotate: flight.heading * (4.5 + 1.5 * Math.cos(surge)),
      opacity: fade(flight.depth),
      flame: 0,
      done,
    };
  },
  render: (flight) => <Helicopter heading={flight.heading} />,
};

const balloon: Craft = {
  size: BALLOON,
  scale: 1.15,
  origin: [0.5, 0.35],
  lane: "x",
  launch: (roll, first, [left, right]) => {
    const depth = between(roll, 0.5, 1);
    return {
      heading: roll() < 0.5 ? 1 : -1,
      depth,
      from: first ? between(roll, left, right) : null,
      altitude: between(roll, SKY_TOP, SKY_BOTTOM - 0.08),
      speed: 5 + 9 * depth,
      drift: 0,
      delay: first ? 0 : between(roll, 3, 11),
      period: between(roll, 7, 11),
      phase: roll() * TAU,
    };
  },
  fly: (flight, t, bounds, px) => {
    const { x, done } = cruise(flight, t, bounds, BALLOON.width * px * flight.depth, 0);
    const wave = TAU * (t / flight.period) + flight.phase;
    // The burner fires while the balloon is climbing, with a quick flicker.
    const climbing = clamp(-Math.cos(wave) * 1.6 - 0.3, 0, 1);
    return {
      x,
      y: flight.altitude * bounds.height + 9 * px * Math.sin(wave),
      rotate: 1.5 * Math.sin(wave * 0.77),
      opacity: fade(flight.depth),
      flame: climbing * (0.82 + 0.18 * Math.sin(t * 37)),
      done,
    };
  },
  render: (_, flame) => <HotAirBalloon flame={flame} />,
};

const parachute: Craft = {
  size: PARACHUTE,
  scale: 0.95,
  origin: [0.5, 0.2],
  lane: "y",
  launch: (roll, first, [left, right]) => {
    const depth = between(roll, 0.6, 1);
    const heading: Heading = roll() < 0.5 ? 1 : -1;
    return {
      heading,
      depth,
      from: between(roll, left, right),
      altitude: first ? between(roll, SKY_TOP, 0.55) : -1,
      speed: 14 + 10 * depth,
      drift: heading * between(roll, 3, 7),
      delay: first ? 0 : between(roll, 4, 13),
      period: between(roll, 3.6, 5.2),
      phase: roll() * TAU,
    };
  },
  fly: (flight, t, bounds, px) => {
    const fall = Math.max(0, t - flight.delay);
    const height = PARACHUTE.height * px * flight.depth;
    const top = flight.altitude < 0 ? -height : flight.altitude * bounds.height;
    const y = top + flight.speed * fall;
    const swing = Math.sin(TAU * (fall / flight.period) + flight.phase);
    const ground = bounds.height * LANDING;
    return {
      x: flight.from! * bounds.width + flight.drift * fall,
      y,
      rotate: 6 * swing,
      opacity: fade(flight.depth) * clamp((ground - y) / (60 * px), 0, 1),
      flame: 0,
      done: y > ground,
    };
  },
  render: () => <Parachutist />,
};

const FLEET: { craft: Craft; minWidth?: number }[] = [
  { craft: balloon },
  { craft: balloon },
  { craft: balloon, minWidth: 768 },
  { craft: parachute },
  { craft: parachute, minWidth: 640 },
  { craft: parachute, minWidth: 1024 },
  { craft: helicopter },
  { craft: helicopter },
  { craft: helicopter, minWidth: 1024 },
  { craft: airplane },
  { craft: airplane },
];

const KINDS = [balloon, parachute, helicopter, airplane];

/**
 * Splits the width into one column per craft of a kind. Each kind starts its columns at a different
 * offset, so no column opens with two of the same kind and every side of the sky gets a mix.
 */
function zoneOf(slot: number, slots: number[]): Zone {
  const { craft } = FLEET[slot];
  const siblings = slots.filter((other) => FLEET[other].craft === craft);
  const count = siblings.length;
  const column = (siblings.indexOf(slot) + KINDS.indexOf(craft)) % count;
  const span = 0.88 / count;
  return [0.03 + column * span, 0.03 + (column + 0.75) * span];
}

/** Sends a craft the way fewer of its kind are heading, so they fan out in both directions. */
function headingFor(slot: number, trips: Trip[], roll: () => number): Heading {
  const { craft } = FLEET[slot];
  const balance = trips.reduce(
    (sum, trip) => (trip.slot !== slot && FLEET[trip.slot].craft === craft ? sum + trip.flight.heading : sum),
    0,
  );
  return balance > 0 ? -1 : balance < 0 ? 1 : roll() < 0.5 ? 1 : -1;
}

const pxFor = (craft: Craft, bounds: Bounds) => clamp(bounds.width / 1100, 0.75, 1) * craft.scale;

/** `fixed` marks page content (the intro copy) that craft should not start behind. */
type Box = { cx: number; cy: number; w: number; h: number; lane: "x" | "y" | "fixed"; slow: boolean };

/** Share of `a` covered by `b`, 0–1. */
function coverage(a: Box, b: Box) {
  const overlapX = Math.min(a.cx + a.w / 2, b.cx + b.w / 2) - Math.max(a.cx - a.w / 2, b.cx - b.w / 2);
  const overlapY = Math.min(a.cy + a.h / 2, b.cy + b.h / 2) - Math.max(a.cy - a.h / 2, b.cy - b.h / 2);
  return overlapX > 0 && overlapY > 0 ? (overlapX * overlapY) / (a.w * a.h) : 0;
}

function boxOf(craft: Craft, flight: Flight, pose: Pose, px: number): Box {
  const w = craft.size.width * px * flight.depth;
  const h = craft.size.height * px * flight.depth;
  return { cx: pose.x + w / 2, cy: pose.y + h / 2, w, h, lane: craft.lane, slow: craft.lane === "x" && flight.speed < 20 };
}

/** Free space between two craft along the axis where their paths could meet. */
function clearance(a: Box, b: Box) {
  const gapX = Math.abs(a.cx - b.cx) - (a.w + b.w) / 2;
  const gapY = Math.abs(a.cy - b.cy) - (a.h + b.h) / 2;
  if (a.lane === "fixed" || b.lane === "fixed") return Math.max(gapX, gapY);
  if (a.lane === "x" && b.lane === "x") return gapY;
  if (a.lane === "y" && b.lane === "y") return gapX;
  // A parachutist would sink straight through a near-stationary balloon below it.
  if ((a.lane === "y" && b.slow) || (b.lane === "y" && a.slow)) return gapX;
  return Math.max(gapX, gapY);
}

const CANDIDATES = 14;

/**
 * Picks the trip, out of a handful of random ones in this craft's column, that keeps the most room
 * from everything else in the sky. Opening positions also stay clear of the page content; later trips
 * may cross behind the copy and haze out instead.
 */
function plan(slot: number, slots: number[], trips: Trip[], bounds: Bounds, boxes: (Box | null)[], first: boolean, page: Box[]): Flight {
  const { craft } = FLEET[slot];
  const px = pxFor(craft, bounds);
  const avoid = first ? page : [];
  const zone = zoneOf(slot, slots);
  let best: Flight | null = null;
  let bestBox: Box | null = null;
  let bestRoom = -Infinity;
  for (let i = 0; i < CANDIDATES; i++) {
    const flight = craft.launch(Math.random, first, zone);
    flight.heading = craft.lane === "x" ? headingFor(slot, trips, Math.random) : flight.heading;
    const box = boxOf(craft, flight, craft.fly(flight, flight.delay, bounds, px), px);
    const others = boxes.filter((other, j): other is Box => other !== null && j !== slot).concat(avoid);
    const room = others.reduce((min, other) => Math.min(min, clearance(box, other)), Infinity);
    if (room > bestRoom) {
      best = flight;
      bestBox = box;
      bestRoom = room;
    }
  }
  boxes[slot] = bestBox;
  return best!;
}

type Trip = { slot: number; flight: Flight };

/** Evasive offset a craft flies on top of its planned route, with its own velocity. */
type Evasion = { x: number; y: number; vx: number; vy: number; lastX: number | null; lastY: number | null };
const calm = (): Evasion => ({ x: 0, y: 0, vx: 0, vy: 0, lastX: null, lastY: null });

// Separation rules, in px and seconds at full scale.
const SEPARATION = 30;
const LOOKAHEAD = 1.8;
const PUSH = 32;
const RETURN = 0.6;
const DAMPING = 2.6;
const MAX_EVADE = 110;

type Traffic = { box: Box; active: boolean; evasion: Evasion; top: number; height: number };

function gap(a: Box, b: Box) {
  const gapX = Math.abs(a.cx - b.cx) - (a.w + b.w) / 2;
  const gapY = Math.abs(a.cy - b.cy) - (a.h + b.h) / 2;
  return Math.max(gapX, gapY);
}

/**
 * Keeps every pair of craft at least SEPARATION apart, now and LOOKAHEAD seconds ahead.
 * Planes, helicopters and balloons climb or descend out of the way; parachutists steer sideways.
 * Once clear, each one eases back onto its planned route.
 */
function steer(traffic: Traffic[], dt: number, bounds: Bounds, unit: number) {
  if (dt <= 0) return;
  const velocity = traffic.map(({ box, evasion }) => {
    const v = evasion.lastX === null || evasion.lastY === null ? { x: 0, y: 0 } : { x: (box.cx - evasion.lastX) / dt, y: (box.cy - evasion.lastY) / dt };
    evasion.lastX = box.cx;
    evasion.lastY = box.cy;
    return v;
  });
  const force = traffic.map(() => ({ x: 0, y: 0 }));
  const separation = SEPARATION * unit;

  for (let i = 0; i < traffic.length; i++) {
    for (let j = i + 1; j < traffic.length; j++) {
      const a = traffic[i];
      const b = traffic[j];
      if (!a.active || !b.active) continue;
      const ahead = (box: Box, v: { x: number; y: number }) => ({ ...box, cx: box.cx + v.x * LOOKAHEAD, cy: box.cy + v.y * LOOKAHEAD });
      const intrusion = separation - Math.min(gap(a.box, b.box), gap(ahead(a.box, velocity[i]), ahead(b.box, velocity[j])));
      if (intrusion <= 0) continue;
      const push = PUSH * intrusion;
      const up = Math.sign(a.box.cy - b.box.cy) || -1;
      const side = Math.sign(a.box.cx - b.box.cx) || -1;
      if (a.box.lane === "y") force[i].x += side * push;
      else force[i].y += up * push;
      if (b.box.lane === "y") force[j].x -= side * push;
      else force[j].y -= up * push;
    }
  }

  const limit = MAX_EVADE * unit;
  const ceiling = bounds.height * 0.05;
  traffic.forEach(({ evasion, active, top, height, box }, i) => {
    if (!active) {
      evasion.lastX = null;
      evasion.lastY = null;
    }
    evasion.vx = clamp(evasion.vx + (force[i].x - RETURN * evasion.x - DAMPING * evasion.vx) * dt, -limit, limit);
    evasion.vy = clamp(evasion.vy + (force[i].y - RETURN * evasion.y - DAMPING * evasion.vy) * dt, -limit, limit);
    evasion.x += evasion.vx * dt;
    evasion.y += evasion.vy * dt;
    if (box.lane === "x") {
      const floor = bounds.height * LANDING - height;
      const y = clamp(top + evasion.y, ceiling, floor);
      if (y !== top + evasion.y) {
        evasion.y = y - top;
        evasion.vy = 0;
      }
    }
  });
}

type Rig = { x: MotionValue<number>; y: MotionValue<number>; rotate: MotionValue<number>; opacity: MotionValue<number>; flame: MotionValue<number> };

/** Planes, helicopters, hot-air balloons and parachutists spread across the hero, flying in real time. */
export function SkyScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [rigs] = useState<Rig[]>(() =>
    FLEET.map(() => ({ x: motionValue(0), y: motionValue(0), rotate: motionValue(0), opacity: motionValue(0), flame: motionValue(0) })),
  );
  const boxes = useRef<(Box | null)[]>([]);
  const clocks = useRef<number[]>([]);
  const evasions = useRef<Evasion[]>([]);
  /**
   * Page content in section coordinates. Craft never open behind `data-sky-clear` copy or the
   * `data-sky-avoid` ID card, and haze out while crossing behind the copy.
   */
  const page = useRef<{ box: Box; haze: boolean }[]>([]);
  const reduceMotion = useReducedMotion() ?? false;
  const { reduceEffects } = useMotionProfile();
  const { scrollY } = useScroll();
  const parallax = useTransform(scrollY, [0, 800], [0, 120], { clamp: false });
  const parallaxEnabled = !reduceMotion && !reduceEffects;

  useEffect(() => {
    const node = ref.current;
    const section = node?.closest("section");
    if (!node || !section) return;
    const blocks = [...section.querySelectorAll<HTMLElement>("[data-sky-clear], [data-sky-avoid]")];
    const observer = new ResizeObserver(() => {
      const origin = section.getBoundingClientRect();
      page.current = blocks.map((block) => {
        const rect = block.getBoundingClientRect();
        const cx = rect.left - origin.left + rect.width / 2;
        const cy = rect.top - origin.top + rect.height / 2;
        const box: Box = { cx, cy, w: rect.width, h: rect.height, lane: "fixed", slow: false };
        return { box, haze: block.hasAttribute("data-sky-clear") };
      });
      const width = node.clientWidth;
      const height = node.clientHeight;
      setBounds((prev) => (prev && prev.width === width && prev.height === height ? prev : { width, height }));
    });
    observer.observe(node);
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!bounds) return;
    const slots = FLEET.flatMap((item, slot) => (bounds.width >= (item.minWidth ?? 0) ? [slot] : []));
    // The scene drifts with the parallax, so page content sits that much higher in scene coordinates.
    const pageInScene = () => {
      const shift = parallaxEnabled ? parallax.get() : 0;
      return page.current.map(({ box, haze }) => ({ box: { ...box, cy: box.cy - shift }, haze }));
    };
    const copyOf = (blocks: ReturnType<typeof pageInScene>) => blocks.filter(({ haze }) => haze).map(({ box }) => box);

    if (!trips || trips.length !== slots.length) {
      const frame = requestAnimationFrame(() => {
        boxes.current = FLEET.map(() => null);
        clocks.current = FLEET.map(() => 0);
        evasions.current = FLEET.map(calm);
        const avoid = pageInScene().map(({ box }) => box);
        const planned: Trip[] = [];
        slots.forEach((slot) => planned.push({ slot, flight: plan(slot, slots, planned, bounds, boxes.current, true, avoid) }));
        setTrips(planned);
      });
      return () => cancelAnimationFrame(frame);
    }

    const unit = clamp(bounds.width / 1100, 0.75, 1);
    const fly = (trip: Trip) => {
      const { craft } = FLEET[trip.slot];
      const px = pxFor(craft, bounds);
      const clock = clocks.current[trip.slot];
      return { trip, craft, px, pose: craft.fly(trip.flight, clock, bounds, px), active: clock >= trip.flight.delay };
    };
    type Flying = ReturnType<typeof fly>;
    const shape = ({ trip, craft, px, pose }: Flying) => {
      const evasion = evasions.current[trip.slot];
      return boxOf(craft, trip.flight, { ...pose, x: pose.x + evasion.x, y: pose.y + evasion.y }, px);
    };
    const draw = (flying: Flying, blocks: Box[]) => {
      const { trip, pose, craft } = flying;
      const pitch = craft === balloon ? 0 : 0.08;
      const evasion = evasions.current[trip.slot];
      const box = shape(flying);
      // Craft passing behind the intro copy thin out like haze so the text stays readable.
      const haze = blocks.reduce((max, block) => Math.max(max, coverage(box, block)), 0);
      const rig = rigs[trip.slot];
      rig.x.set(pose.x + evasion.x);
      rig.y.set(pose.y + evasion.y);
      // Lean into the evasive turn: nose up when climbing, a bank of the canopy when side-stepping.
      rig.rotate.set(pose.rotate + clamp(evasion.vy * trip.flight.heading * pitch, -6, 6) + clamp(evasion.vx * 0.1, -8, 8));
      rig.opacity.set(pose.opacity * (1 - 0.8 * haze));
      rig.flame.set(Math.max(pose.flame, clamp(-evasion.vy / 30, 0, 1)));
      boxes.current[trip.slot] = box;
    };

    let current = trips;
    const opening = copyOf(pageInScene());
    current.forEach((trip) => draw(fly(trip), opening));
    if (reduceMotion) return;

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (document.hidden) {
        last = now;
        frame = requestAnimationFrame(tick);
        return;
      }
      // Cap the step so a backgrounded tab resumes smoothly instead of teleporting.
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const blocks = copyOf(pageInScene());
      const flying = current.map((trip) => {
        clocks.current[trip.slot] += dt;
        return fly(trip);
      });
      steer(
        flying.map((item) => ({
          box: shape(item),
          active: item.active,
          evasion: evasions.current[item.trip.slot],
          top: item.pose.y,
          height: item.craft.size.height * item.px * item.trip.flight.depth,
        })),
        dt,
        bounds,
        unit,
      );
      flying.forEach((item) => draw(item, blocks));

      let landed = false;
      const before = current;
      current = flying.map(({ trip, pose }) => {
        if (!pose.done) return trip;
        landed = true;
        clocks.current[trip.slot] = 0;
        evasions.current[trip.slot] = calm();
        return { slot: trip.slot, flight: plan(trip.slot, slots, before, bounds, boxes.current, false, []) };
      });
      if (landed) setTrips(current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // parallax is read via .get() inside the loop; listing it would restart the RAF every scroll frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- parallax MotionValue is intentionally omitted
  }, [bounds, trips, rigs, reduceMotion, parallaxEnabled]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ y: parallaxEnabled ? parallax : 0 }}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[mask-image:linear-gradient(to_bottom,black_calc(100%-10rem),transparent_calc(100%-5rem))]",
        className,
      )}
    >
      {trips?.map(({ slot, flight }) => {
        const { craft } = FLEET[slot];
        const scale = pxFor(craft, bounds!) * flight.depth;
        const rig = rigs[slot];
        return (
          <motion.div
            key={slot}
            className={cn("absolute top-0 left-0", !reduceEffects && "will-change-transform")}
            style={{
              x: rig.x,
              y: rig.y,
              rotate: rig.rotate,
              opacity: rig.opacity,
              originX: craft.origin[0],
              originY: craft.origin[1],
              width: craft.size.width * scale,
              height: craft.size.height * scale,
              zIndex: Math.round(flight.depth * 100),
            }}
          >
            {craft.render(flight, rig.flame)}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
