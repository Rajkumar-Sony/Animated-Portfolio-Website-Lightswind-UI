import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type StatGraphKind = "rise" | "drop" | "pulse" | "bars";

const VIEW_W = 100;
const VIEW_H = 50;

const LINES: Record<Exclude<StatGraphKind, "bars">, ReadonlyArray<readonly [number, number]>> = {
  rise: [[0, 44], [16, 38], [32, 40], [48, 28], [64, 30], [80, 16], [96, 10]],
  drop: [[0, 10], [16, 14], [32, 12], [48, 24], [64, 26], [80, 36], [96, 40]],
  pulse: [[0, 42], [12, 32], [24, 39], [36, 26], [48, 33], [60, 19], [72, 27], [84, 12], [96, 16]],
};

const BARS = [
  { x: 52, height: 16 },
  { x: 68, height: 27 },
  { x: 84, height: 38 },
];

const draw = { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const };

/** Decorative light chart drawn behind a stat card; it draws in once when scrolled into view. */
export function StatGraph({ kind, className }: { kind: StatGraphKind; className?: string }) {
  const id = useId();
  const fill = `${id}-fill`;

  const points = kind === "bars" ? null : LINES[kind];
  const end = points ? points[points.length - 1] : ([BARS[2].x + 4, VIEW_H - BARS[2].height] as const);
  const line = points?.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const area = points && `${line} L${end[0]} ${VIEW_H} L${points[0][0]} ${VIEW_H} Z`;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-3/5 [mask-image:linear-gradient(to_right,transparent,black_45%)]",
        className,
      )}
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="size-full overflow-visible">
        <defs>
          <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent-to)", stopOpacity: 0.14 }} />
            <stop offset="1" style={{ stopColor: "var(--accent-to)", stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {[12.5, 25, 37.5].map((y) => (
          <line
            key={y}
            x1={0}
            x2={VIEW_W}
            y1={y}
            y2={y}
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
            className="stroke-line"
          />
        ))}

        {points ? (
          <>
            <motion.path
              d={area!}
              fill={`url(#${fill})`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...draw, delay: 0.4 }}
            />
            <motion.path
              d={line}
              fill="none"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="stroke-accent-to/35"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={draw}
            />
          </>
        ) : (
          BARS.map((bar, i) => (
            <motion.rect
              key={bar.x}
              x={bar.x}
              y={VIEW_H - bar.height}
              width={8}
              height={bar.height}
              rx={1.5}
              fill={`url(#${fill})`}
              vectorEffect="non-scaling-stroke"
              className="stroke-accent-to/30"
              style={{ originY: 1, transformBox: "fill-box" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ ...draw, delay: i * 0.15 }}
            />
          ))
        )}
      </svg>

      <span
        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-to/50"
        style={{ left: `${(end[0] / VIEW_W) * 100}%`, top: `${(end[1] / VIEW_H) * 100}%` }}
      >
        <span className="absolute inset-0 rounded-full bg-accent-to/40 motion-safe:animate-ping-slow" />
      </span>
    </div>
  );
}
