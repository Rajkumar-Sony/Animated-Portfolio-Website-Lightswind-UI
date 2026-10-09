import { useId, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { TUNNEL_REST } from "@/lib/station";

// Drawn 1:1 in px; y = 100 is the tunnel exit, level with the top of the career line.
// The train hangs left of its rail (see BulletTrain), so the mouth is centred on the train body (x = 60)
// while the rail runs out of it at x = RAIL_X.
const W = 120;
const H = 100;
const RAIL_X = 68.6;
const MOUTH = { left: 42, right: 78, spring: 58, r: 18 };
const VP = { x: 60, y: 66 };
const NOSE_Y = H - TUNNEL_REST;
const LAMP = { x: RAIL_X - 3.9, y: NOSE_Y - 5.2 };

const toVp = (x: number, y: number, s: number) => [VP.x + (x - VP.x) * s, VP.y + (y - VP.y) * s] as const;

const mouthPath = (s = 1) => {
  const [lx, by] = toVp(MOUTH.left, H, s);
  const [, sy] = toVp(MOUTH.left, MOUTH.spring, s);
  const [rx] = toVp(MOUTH.right, H, s);
  return `M${lx} ${by} V${sy} A${MOUTH.r * s} ${MOUTH.r * s} 0 0 1 ${rx} ${sy} V${by} Z`;
};

const RINGS = [0.8, 0.62, 0.47, 0.35];
const WALL_LAMPS = [0.9, 0.7, 0.54, 0.4].flatMap((s, i) =>
  [44.5, 75.5].map((x, side) => {
    const [cx, cy] = toVp(x, 74, s);
    return { key: `${i}-${side}`, cx, cy, r: 1.3 * s, delay: `${-(i * 0.7 + side * 1.3)}s` };
  }),
);
const SLEEPERS = [0.97, 0.84, 0.72, 0.62, 0.53, 0.45, 0.38].map((s) => {
  const [cx, cy] = toVp(RAIL_X, H, s);
  return { s, cx, cy };
});
const [RAIL_FAR_X, RAIL_FAR_Y] = toVp(RAIL_X, H, 0.35);

const VOUSSOIRS = Array.from({ length: 11 }, (_, i) => 15 + i * 15)
  .filter((deg) => deg !== 90)
  .map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const c = { x: VP.x, y: MOUTH.spring };
    return {
      deg,
      d: `M${c.x + 18 * Math.cos(rad)} ${c.y - 18 * Math.sin(rad)} L${c.x + 26 * Math.cos(rad)} ${c.y - 26 * Math.sin(rad)}`,
    };
  });
const PILLAR_JOINTS = [66, 74, 82, 90].flatMap((y, i) => {
  const offset = i % 2 === 0 ? 4 : 7;
  return [
    `M32 ${y} H42`,
    `M78 ${y} H88`,
    `M${32 + offset} ${y} V${y + 8}`,
    `M${78 + offset} ${y} V${y + 8}`,
  ];
});
const TUFTS = [
  [14, 74],
  [24, 50],
  [40, 26],
  [82, 24],
  [97, 46],
  [108, 72],
];
const ROCKS = [
  { cx: 20, cy: 86, rx: 3, ry: 1.8 },
  { cx: 101, cy: 84, rx: 2.4, ry: 1.5 },
  { cx: 31, cy: 38, rx: 1.8, ry: 1.1 },
];
const MIST = [
  { cx: 56, delay: "0s" },
  { cx: 64, delay: "1.5s" },
  { cx: 60, delay: "3s" },
];
const DUST = [
  { dx: -20, dy: 14, r: 7, delay: 0 },
  { dx: -10, dy: 22, r: 6, delay: 0.05 },
  { dx: 0, dy: 26, r: 8, delay: 0 },
  { dx: 11, dy: 21, r: 6, delay: 0.08 },
  { dx: 21, dy: 12, r: 7, delay: 0.03 },
];

const stop = (color: string, opacity = 1): CSSProperties => ({ stopColor: color, stopOpacity: opacity });

/**
 * Origin of the career line. The train waits inside a tunnel, headlights on, behind a red signal;
 * as the visitor scrolls it drives out of the darkness and the signal clears. The back layer (tunnel
 * interior) paints under the train, the portal face and its darkness over it.
 */
export function Departure({ departed, since }: { departed: boolean; since: string }) {
  const id = useId().replace(/:/g, "");
  const ids = {
    depth: `${id}-depth`,
    shade: `${id}-shade`,
    exit: `${id}-exit`,
    halo: `${id}-halo`,
    beam: `${id}-beam`,
  };
  const layer =
    "pointer-events-none absolute bottom-0 left-[calc(1.25rem-68.6px)] overflow-visible md:left-[calc(50%-68.6px)]";

  return (
    <div aria-hidden className="relative h-[100px]">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={layer}>
        <defs>
          <radialGradient id={ids.depth} cx={VP.x} cy={VP.y} r={40} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={stop("#000")} />
            <stop offset="1" style={stop("var(--hazard-ink)")} />
          </radialGradient>
        </defs>
        <path d={mouthPath()} fill={`url(#${ids.depth})`} />
        {RINGS.map((s) => (
          <path
            key={s}
            d={mouthPath(s)}
            strokeWidth={1.2 * s}
            className="fill-black/25 stroke-white/15"
          />
        ))}
        <path
          d={`M${RAIL_X - 1.5} ${H} L${RAIL_X + 1.5} ${H} L${RAIL_FAR_X + 0.5} ${RAIL_FAR_Y} L${RAIL_FAR_X - 0.5} ${RAIL_FAR_Y} Z`}
          className="fill-line-strong opacity-70"
        />
        {SLEEPERS.map(({ s, cx, cy }) => (
          <line
            key={s}
            x1={cx - 5.5 * s}
            x2={cx + 5.5 * s}
            y1={cy}
            y2={cy}
            strokeWidth={2 * s}
            className="stroke-line-strong"
            style={{ opacity: 0.15 + 0.6 * s }}
          />
        ))}
        {WALL_LAMPS.map((lamp) => (
          <circle
            key={lamp.key}
            cx={lamp.cx}
            cy={lamp.cy}
            r={lamp.r}
            className="fill-warning drop-shadow-[0_0_2px_var(--warning)] motion-safe:animate-lamp-flicker"
            style={{ "--flicker-delay": lamp.delay } as CSSProperties}
          />
        ))}
      </svg>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={cn(layer, "z-20")}>
        <defs>
          <linearGradient id={ids.shade} x1="0" y1="40" x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={stop("var(--hazard-ink)", 0.85)} />
            <stop offset="0.35" style={stop("var(--hazard-ink)", 0.5)} />
            <stop offset="1" style={stop("var(--hazard-ink)", 0.04)} />
          </linearGradient>
          <radialGradient id={ids.exit}>
            <stop offset="0" style={stop("#000", 0.24)} />
            <stop offset="1" style={stop("#000", 0)} />
          </radialGradient>
          <radialGradient id={ids.halo}>
            <stop offset="0" style={stop("#fff")} />
            <stop offset="0.35" style={stop("var(--accent-to)", 0.7)} />
            <stop offset="1" style={stop("var(--accent-to)", 0)} />
          </radialGradient>
          <linearGradient id={ids.beam} x1="0" y1={LAMP.y} x2="0" y2={H + 16} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={stop("#fff", 0.55)} />
            <stop offset="0.7" style={stop("var(--accent-to)", 0.18)} />
            <stop offset="1" style={stop("var(--accent-to)", 0)} />
          </linearGradient>
        </defs>

        <path
          d={`M0 ${H} C10 70 30 16 60 10 C90 16 110 70 ${W} ${H} Z ${mouthPath()}`}
          fillRule="evenodd"
          className="fill-surface-sunken"
        />
        <path d="M2 99 C12 70 31 18 60 11.5 C89 18 108 70 118 99" fill="none" strokeWidth={0.6} className="stroke-line-strong" />
        {TUFTS.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x - 2} ${y} L${x - 0.6} ${y - 3} M${x} ${y} L${x} ${y - 3.6} M${x + 2} ${y} L${x + 0.6} ${y - 3}`}
            strokeWidth={0.7}
            strokeLinecap="round"
            className="stroke-success/60"
          />
        ))}
        {ROCKS.map((rock) => (
          <ellipse key={rock.cx} {...rock} className="fill-line-strong" />
        ))}

        <path d="M32 54 V100 H12 Z" strokeWidth={0.75} className="fill-surface-raised stroke-line-strong" />
        <path d="M88 54 V100 H108 Z" strokeWidth={0.75} className="fill-surface-raised stroke-line-strong" />
        <path d="M30.5 52 L10 100 M89.5 52 L110 100" strokeWidth={1.6} className="stroke-line-strong" />

        <path
          d={`M32 26 H88 V100 H${MOUTH.right} V${MOUTH.spring} A${MOUTH.r} ${MOUTH.r} 0 0 0 ${MOUTH.left} ${MOUTH.spring} V100 H32 Z`}
          strokeWidth={0.75}
          className="fill-surface-raised stroke-line-strong"
        />
        <path d={`M34 ${MOUTH.spring} A26 26 0 0 1 86 ${MOUTH.spring}`} fill="none" strokeWidth={0.75} className="stroke-line-strong" />
        {VOUSSOIRS.map((v) => (
          <path key={v.deg} d={v.d} strokeWidth={0.6} className="stroke-line-strong" />
        ))}
        <path d="M57 30.5 H63 L61.8 40.3 H58.2 Z" strokeWidth={0.6} className="fill-surface-sunken stroke-line-strong" />
        {PILLAR_JOINTS.map((d) => (
          <path key={d} d={d} strokeWidth={0.5} className="stroke-line" />
        ))}
        <rect x={31} y={56} width={12} height={3.5} rx={0.6} className="fill-line-strong" />
        <rect x={77} y={56} width={12} height={3.5} rx={0.6} className="fill-line-strong" />
        <rect x={29} y={21.5} width={62} height={5} rx={1} strokeWidth={0.6} className="fill-surface-raised stroke-line-strong" />
        <rect x={52} y={14.5} width={16} height={7} rx={1.2} className="fill-surface-inverse" />
        <text
          x={60}
          y={19.6}
          textAnchor="middle"
          className="fill-fg-inverse text-[4.6px] font-bold tracking-[0.12em]"
        >
          {since.split(" ")[1]}
        </text>

        <path d={mouthPath()} fill={`url(#${ids.shade})`} />
        <ellipse cx={VP.x} cy={H} rx={20} ry={12} fill={`url(#${ids.exit})`} />

        <g className={cn("transition-opacity duration-500", departed ? "opacity-0" : "opacity-100")}>
          <path
            d={`M${LAMP.x - 1.5} ${LAMP.y + 1} L${LAMP.x + 1.5} ${LAMP.y + 1} L${LAMP.x + 11} ${H + 16} L${LAMP.x - 11} ${H + 16} Z`}
            fill={`url(#${ids.beam})`}
            className="motion-safe:animate-idle-glow"
          />
          <circle cx={LAMP.x} cy={LAMP.y} r={6} fill={`url(#${ids.halo})`} className="motion-safe:animate-idle-glow" />
          <circle cx={LAMP.x} cy={LAMP.y} r={1.3} className="fill-white" />
        </g>

        {!departed &&
          MIST.map((puff) => (
            <circle
              key={puff.cx}
              cx={puff.cx}
              cy={H - 12}
              r={4}
              className="fill-white blur-[2px] motion-safe:animate-tunnel-mist"
              style={{ "--puff-delay": puff.delay, transformBox: "fill-box", transformOrigin: "center" } as CSSProperties}
            />
          ))}
        {departed &&
          DUST.map((puff) => (
            <motion.circle
              key={puff.dx}
              initial={{ cx: VP.x, cy: H - 4, r: 2, opacity: 0.5 }}
              animate={{ cx: VP.x + puff.dx, cy: H - 4 + puff.dy, r: puff.r, opacity: 0 }}
              transition={{ duration: 1.2, delay: puff.delay, ease: "easeOut" }}
              className="fill-fg-subtle"
            />
          ))}
      </svg>

      <span className="absolute bottom-0 left-[calc(1.25rem+42px)] md:left-[calc(50%+42px)]">
        <span className="absolute bottom-0 left-1 h-6 w-0.5 bg-fg-subtle" />
        <span className="absolute bottom-5 left-0 flex h-[19px] w-2.5 flex-col items-center justify-evenly rounded-[3px] bg-[var(--hazard-ink)] shadow-sm">
          <span
            className={cn(
              "size-1.5 rounded-full bg-danger transition-[opacity,box-shadow] duration-300",
              departed ? "opacity-20" : "opacity-100 shadow-[0_0_6px_var(--danger)]",
            )}
          />
          <span
            className={cn(
              "relative size-1.5 rounded-full bg-success transition-[opacity,box-shadow] duration-300",
              departed ? "opacity-100 shadow-[0_0_6px_var(--success)]" : "opacity-20",
            )}
          >
            {departed && (
              <motion.span
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 3.2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-success"
              />
            )}
          </span>
        </span>
      </span>

      <span className="absolute bottom-4 left-[calc(1.25rem+60px)] flex flex-col text-2xs tracking-[0.14em] uppercase md:left-[calc(50%+60px)]">
        <span className="font-semibold">Departure</span>
        <span className="text-fg-muted">{since}</span>
      </span>
    </div>
  );
}
