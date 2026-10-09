import { useId } from "react";
import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";
import { AIRPLANE, BALLOON, HELICOPTER, PARACHUTE } from "./skyCraftSizes";

export type Heading = 1 | -1;

// Same paint as the bullet train: light body with a brand-gradient livery and dark glazing.
const body = "fill-surface-raised stroke-line-strong dark:fill-fg dark:stroke-fg";
const glazing = "fill-surface-inverse dark:fill-fg-inverse";
const trim = "fill-line-strong dark:fill-fg-subtle";
const rigging = "stroke-fg-subtle";

// The side facing the viewer is starboard (green) when flying right and port (red) when flying left.
const navLightFor = (heading: Heading) =>
  heading === 1 ? "fill-success drop-shadow-[0_0_2px_var(--success)]" : "fill-danger drop-shadow-[0_0_2px_var(--danger)]";

function useLivery(direction: "x" | "y") {
  const id = `${useId().replace(/:/g, "")}-livery`;
  const gradient = (
    <linearGradient id={id} x1="0" y1="0" x2={direction === "x" ? 1 : 0} y2={direction === "y" ? 1 : 0}>
      <stop offset="0" style={{ stopColor: "var(--accent-from)" }} />
      <stop offset="0.5" style={{ stopColor: "var(--accent-via)" }} />
      <stop offset="1" style={{ stopColor: "var(--accent-to)" }} />
    </linearGradient>
  );
  return { id, fill: `url(#${id})`, gradient };
}

const WINDOWS = Array.from({ length: 20 }, (_, i) => 30 + i * 3.6);

/** Side-view airliner drawn nose-right; mirrored when heading left. */
export function Airplane({ heading }: { heading: Heading }) {
  const livery = useLivery("x");
  const trailId = `${livery.id}-trail`;

  return (
    <svg
      viewBox={`0 0 ${AIRPLANE.width} ${AIRPLANE.height}`}
      overflow="visible"
      className="size-full drop-shadow-[0_4px_8px_rgb(0_0_0/0.18)]"
      style={{ transform: heading === -1 ? "scaleX(-1)" : undefined }}
    >
      <defs>
        {livery.gradient}
        <linearGradient id={trailId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <g className="text-fg">
        <rect x={-200} y={28.6} width={260} height={1.4} rx={0.7} fill={`url(#${trailId})`} />
        <rect x={-140} y={27.6} width={200} height={3.4} rx={1.7} fill={`url(#${trailId})`} opacity={0.35} />
      </g>

      <path d="M60 19 L50 9.5 Q49.5 8.5 50.5 8.5 H54.5 L72 19 Z" className={trim} />
      <path d="M15 18 L9 12.5 Q8.6 11.6 9.6 11.6 H12 L23 18 Z" className={trim} />

      <path
        d="M8 17 L22 18 H96 C106 18 113 20 117 23.5 C114 26.5 107 28 96 28 H36 C24 28 14 22 8 17 Z"
        strokeWidth={0.75}
        className={body}
      />
      <path d="M8.5 17.2 L3.4 2.8 Q3.2 1.5 4.6 1.5 H8.6 L24 18 Z" fill={livery.fill} strokeWidth={0.6} className="stroke-line-strong dark:stroke-fg" />

      {WINDOWS.map((x) => (
        <rect key={x} x={x} y={20.3} width={1.8} height={2.3} rx={0.7} className={glazing} />
      ))}
      <path d="M106 20.3 C109 20.7 111.5 21.7 113.4 23.1 H107 Z" className={glazing} />
      <rect x={100.5} y={19.4} width={2.6} height={5.4} rx={0.6} fill="none" strokeWidth={0.4} className={rigging} />
      <rect x={24} y={24.3} width={82} height={1.1} rx={0.55} fill={livery.fill} />

      <path d="M13 20.5 L4.6 26.4 Q4 27.2 5 27.2 H8.6 L23 21.4 Z" strokeWidth={0.5} className={body} />
      <path d="M58 25.5 L44.4 37 Q43.6 38.4 45.2 38.4 H49.2 L74 25.5 Z" strokeWidth={0.6} className={body} />
      <rect x={60} y={27} width={13} height={5.6} rx={2.8} strokeWidth={0.6} className={body} />
      <ellipse cx={72.4} cy={29.8} rx={0.9} ry={2.2} className={glazing} />

      <circle cx={45.8} cy={37.6} r={1.2} className={navLightFor(heading)} />
      <circle cx={84} cy={28.4} r={1} className="animate-beacon fill-danger drop-shadow-[0_0_3px_var(--danger)]" />
      <circle cx={4.2} cy={2.6} r={1} className="animate-strobe fill-white drop-shadow-[0_0_3px_white]" />
    </svg>
  );
}

// Meridian half-widths of a sphere sliced every 30°, offset by 15° so a gore sits dead centre.
const GORES = [28, 27, 19.8, 7.2];

/** Hot-air balloon with gored envelope; `flame` (0–1) drives the burner. */
export function HotAirBalloon({ flame }: { flame: MotionValue<number> }) {
  const livery = useLivery("y");
  const clipId = `${livery.id}-envelope`;
  const shadeId = `${livery.id}-shade`;
  const shadowId = `${livery.id}-shadow`;
  const envelope =
    "M30 2 C46 2 58 14 58 30 C58 43 48 52 40 61 Q38 63.5 37 65 H23 Q22 63.5 20 61 C12 52 2 43 2 30 C2 14 14 2 30 2 Z";

  return (
    <svg
      viewBox={`0 0 ${BALLOON.width} ${BALLOON.height}`}
      className="size-full drop-shadow-[0_6px_10px_rgb(0_0_0/0.18)]"
    >
      <defs>
        {livery.gradient}
        <clipPath id={clipId}>
          <path d={envelope} />
        </clipPath>
        <radialGradient id={shadeId} cx="0.32" cy="0.26" r="0.5">
          <stop offset="0" stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={shadowId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.55" stopColor="black" stopOpacity="0" />
          <stop offset="1" stopColor="black" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {GORES.map((rx, i) => (
          <ellipse key={rx} cx={30} cy={32} rx={rx} ry={31} fill={i % 2 ? livery.fill : undefined} className={i % 2 ? undefined : body} strokeWidth={0} />
        ))}
        <rect width={60} height={66} fill={`url(#${shadeId})`} />
        <rect width={60} height={66} fill={`url(#${shadowId})`} />
      </g>
      <path d={envelope} fill="none" strokeWidth={0.75} className="stroke-line-strong dark:stroke-fg" />

      <path d="M23 65 H37 L35.4 70 H24.6 Z" className={trim} />
      <motion.path
        d="M30 63 C32.4 66.5 32.8 70 30 73 C27.2 70 27.6 66.5 30 63 Z"
        className="fill-accent-to drop-shadow-[0_0_4px_var(--accent-to)]"
        style={{ opacity: flame, scaleY: flame, originX: "50%", originY: "100%" }}
      />
      <rect x={28} y={72.6} width={4} height={2} rx={0.6} className="fill-fg-subtle" />
      <g strokeWidth={0.5} className={rigging}>
        <line x1={24.8} y1={70} x2={26.2} y2={80} />
        <line x1={35.2} y1={70} x2={33.8} y2={80} />
        <line x1={28.6} y1={74.4} x2={27.4} y2={80} />
        <line x1={31.4} y1={74.4} x2={32.6} y2={80} />
      </g>
      <path d="M25.6 80.6 H34.4 L33.7 88.4 Q33.6 89.4 32.6 89.4 H27.4 Q26.4 89.4 26.3 88.4 Z" className="fill-fg-subtle" />
      <rect x={25} y={79.6} width={10} height={1.6} rx={0.8} className="fill-fg-muted" />
      <g strokeWidth={0.4} className="stroke-surface/40">
        <line x1={26} y1={84} x2={34} y2={84} />
        <line x1={26.4} y1={86.8} x2={33.6} y2={86.8} />
      </g>
    </svg>
  );
}

const CELL = 58 / 7;
const CELLS = Array.from({ length: 4 }, (_, i) => 3 + i * 2 * CELL);
const LINES: [number, number, number][] = [
  [5.5, 26, 29],
  [12, 22.4, 29],
  [18.8, 19.6, 29],
  [25.4, 18, 29],
  [38.6, 18, 35],
  [45.2, 19.6, 35],
  [52, 22.4, 35],
  [58.5, 26, 35],
];
const strap = "stroke-surface-inverse dark:stroke-fg-inverse";

// Limbs as [from, joint, to] points in drawing units; the right side is offset so the pose isn't mirrored.
const ARMS = [
  [[29.1, 58], [26.4, 54.6], [28.7, 51]],
  [[34.9, 58], [37.6, 54.8], [35.3, 51]],
];
const LEGS = [
  [[30.8, 66.2], [29.8, 72.2], [30.5, 77.8]],
  [[33.2, 66.2], [34.4, 71.8], [33.7, 77.4]],
];

/** Ram-air canopy with a skydiver hanging from the risers; pivots from the canopy when swaying. */
export function Parachutist() {
  const livery = useLivery("x");
  const clipId = `${livery.id}-canopy`;
  const suitId = `${livery.id}-suit`;
  const suit = `url(#${suitId})`;
  const canopy = "M3 22 Q32 2 61 22 L58.5 26 Q32 9 5.5 26 Z";

  return (
    <svg
      viewBox={`0 0 ${PARACHUTE.width} ${PARACHUTE.height}`}
      className="size-full drop-shadow-[0_4px_8px_rgb(0_0_0/0.18)]"
    >
      <defs>
        {livery.gradient}
        <clipPath id={clipId}>
          <path d={canopy} />
        </clipPath>
        <linearGradient id={suitId} gradientUnits="userSpaceOnUse" x1="26" y1="50" x2="38" y2="78">
          <stop offset="0" style={{ stopColor: "var(--accent-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--accent-to)" }} />
        </linearGradient>
      </defs>

      <g strokeWidth={0.3} className={cn(rigging, "opacity-70")}>
        {LINES.map(([x, y, toX]) => (
          <line key={x} x1={x} y1={y} x2={toX} y2={48} />
        ))}
      </g>

      <g clipPath={`url(#${clipId})`}>
        <rect width={64} height={30} className={body} strokeWidth={0} />
        {CELLS.map((x) => (
          <rect key={x} x={x} width={CELL} height={30} fill={livery.fill} />
        ))}
        <path d="M3 22 Q32 2 61 22" fill="none" strokeWidth={1.4} className="stroke-white/50" />
      </g>
      <path d={canopy} fill="none" strokeWidth={0.6} strokeLinejoin="round" className="stroke-line-strong dark:stroke-fg" />
      <path d="M3 22 L5.5 26 L3.4 29 Z M61 22 L58.5 26 L60.6 29 Z" className={trim} />

      <g strokeWidth={0.9} strokeLinecap="round" className={strap}>
        <line x1={29} y1={48} x2={28.8} y2={57.6} />
        <line x1={35} y1={48} x2={35.2} y2={57.6} />
      </g>
      <rect x={28.2} y={56.6} width={7.6} height={7.4} rx={1.8} className={glazing} />

      {LEGS.map(([hip, knee, ankle]) => (
        <g key={hip[0]} stroke={suit} strokeLinecap="round" fill="none">
          <path d={`M${hip} L${knee}`} strokeWidth={2.5} />
          <path d={`M${knee} L${ankle}`} strokeWidth={2} />
        </g>
      ))}
      <ellipse cx={30.9} cy={78.5} rx={1.5} ry={0.8} transform="rotate(12 30.9 78.5)" className={glazing} />
      <ellipse cx={33.3} cy={78.1} rx={1.5} ry={0.8} transform="rotate(-10 33.3 78.1)" className={glazing} />

      <path
        d="M28.9 57.6 Q32 56.8 35.1 57.6 Q35.4 61 34.6 64.6 L34.2 66.8 H29.8 L29.4 64.6 Q28.6 61 28.9 57.6 Z"
        fill={suit}
      />
      <line x1={32} y1={57.4} x2={32} y2={66.4} strokeWidth={0.25} className={cn(strap, "opacity-50")} />
      <g strokeWidth={0.65} strokeLinecap="round" fill="none" className={strap}>
        <path d="M29.4 57.8 L30.4 66.2 Q29.9 68.3 31.6 68" />
        <path d="M34.6 57.8 L33.6 66.2 Q34.1 68.3 32.4 68" />
        <path d="M29.9 60.6 H34.1" />
      </g>

      {ARMS.map(([shoulder, elbow, hand]) => (
        <g key={shoulder[0]}>
          <path d={`M${shoulder} L${elbow} L${hand}`} fill="none" stroke={suit} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={hand[0]} cy={hand[1] - 0.3} r={0.95} className={glazing} />
        </g>
      ))}

      <rect x={31.3} y={55.8} width={1.4} height={1.6} rx={0.4} className="fill-skin" />
      <ellipse cx={32} cy={54.1} rx={1.9} ry={2.3} className="fill-skin" />
      <path d="M29.8 54.2 Q29.6 50.8 32 50.8 Q34.4 50.8 34.2 54.2 Q32 53.2 29.8 54.2 Z" className={body} strokeWidth={0.3} />
      <rect x={30.2} y={53.5} width={3.6} height={1} rx={0.5} className={glazing} />
      <rect x={30.7} y={53.7} width={0.9} height={0.35} rx={0.17} className="fill-white/70" />
    </svg>
  );
}

const spinning = "origin-center [transform-box:fill-box]";

/** Side-view helicopter drawn nose-right with spinning main and tail rotors; mirrored when heading left. */
export function Helicopter({ heading }: { heading: Heading }) {
  const livery = useLivery("x");

  return (
    <svg
      viewBox={`0 0 ${HELICOPTER.width} ${HELICOPTER.height}`}
      overflow="visible"
      className="size-full drop-shadow-[0_4px_8px_rgb(0_0_0/0.18)]"
      style={{ transform: heading === -1 ? "scaleX(-1)" : undefined }}
    >
      <defs>{livery.gradient}</defs>

      <path d="M34 21 L8 19.2 Q6 19.2 6 20.6 V22.4 Q6 23.6 8 23.6 L36 29 Z" strokeWidth={0.6} className={body} />
      <path d="M5 11 Q5 9.6 6.4 9.6 H8.4 L11 23.4 H6 Z" fill={livery.fill} strokeWidth={0.5} className="stroke-line-strong dark:stroke-fg" />
      <path d="M14 24 L10 27.2 H15.2 L18 24.4 Z" className={trim} />

      <g className={cn("animate-tail-rotor", spinning)}>
        <circle cx={8} cy={14} r={5.5} className="fill-fg/10" />
        <g strokeWidth={1.2} strokeLinecap="round" className={rigging}>
          <line x1={8} y1={8.5} x2={8} y2={19.5} />
          <line x1={2.5} y1={14} x2={13.5} y2={14} />
        </g>
      </g>
      <circle cx={8} cy={14} r={1} className="fill-fg-muted" />

      <path d="M42 16 Q43 11.8 47 11.8 H60 Q63 11.8 64 16 Z" strokeWidth={0.6} className={body} />
      <path
        d="M32 20 Q32 16 37 16 H62 C73 16 82 21 85.5 28.5 C87.5 33 85 37.5 79 37.5 H42 C36 37.5 32 33.5 32 28 Z"
        strokeWidth={0.75}
        className={body}
      />
      <path d="M66 17.4 C74 18 80.5 22.4 83.6 28.4 H67 Q65.6 28.4 65.6 27 Z" className={glazing} />
      <rect x={50} y={19.6} width={12} height={7} rx={1.6} className={glazing} />
      <rect x={48.4} y={18.4} width={15.2} height={17.4} rx={1.8} fill="none" strokeWidth={0.4} className={rigging} />
      <rect x={34} y={30.4} width={50} height={1.4} rx={0.7} fill={livery.fill} />

      <g strokeLinecap="round" className={rigging}>
        <line x1={44} y1={37.5} x2={42} y2={43} strokeWidth={1.1} />
        <line x1={72} y1={37.5} x2={74} y2={43} strokeWidth={1.1} />
        <path d="M36 43.4 H80 Q84 43.4 85.5 40.8" fill="none" strokeWidth={1.3} />
      </g>

      <rect x={51.6} y={8.2} width={1.8} height={4} className="fill-fg-subtle" />
      <rect x={6} y={7} width={92} height={1.6} rx={0.8} className={cn("animate-rotor fill-fg-subtle", spinning)} />
      <rect x={49.5} y={6.4} width={6} height={2.6} rx={1} className="fill-fg-muted" />

      <circle cx={78} cy={35.6} r={1.1} className={navLightFor(heading)} />
      <circle cx={60} cy={37.9} r={1} className="animate-beacon fill-danger drop-shadow-[0_0_3px_var(--danger)]" />
      <circle cx={6.2} cy={10.2} r={0.9} className="animate-strobe fill-white drop-shadow-[0_0_3px_white]" />
    </svg>
  );
}
