import { useId } from "react";
import { motion, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

export type TrainDirection = "down" | "up";

// Side-view train drawn nose-down. The wheels sit on x = RAIL_X so the train rides the timeline rail.
const WIDTH = 20;
const LENGTH = 150;
const RAIL_X = 16.6;
const SCALE = 1.3;
const CAR_JOINTS = [50, 88];
const WHEELS = [8, 14, 40, 46, 56, 62, 78, 84, 96, 102, 132, 138];
const WINDOWS = Array.from({ length: 14 }, (_, i) => 30 + i * 6).filter(
  (y) => y + 3.6 < 112 && CAR_JOINTS.every((joint) => y + 3.6 < joint - 1 || y > joint + 1),
);
const LAMP_X = 13.6;
const NOSE_LAMP_Y = 146;
const TAIL_LAMP_Y = 3;

const SPEED_LINES = [
  { x: -15, length: "h-10", delay: "0s" },
  { x: -10, length: "h-14", delay: "0.18s" },
  { x: -5, length: "h-8", delay: "0.32s" },
];

const headlight = "fill-white drop-shadow-[0_0_2px_var(--accent-to)]";
const taillight = "fill-danger drop-shadow-[0_0_2px_var(--danger)]";

export function BulletTrain({
  speed,
  direction,
  className,
}: {
  speed: MotionValue<number>;
  direction: TrainDirection;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const livery = `${id}-livery`;
  const goingDown = direction === "down";
  const beamLeft = (LAMP_X - RAIL_X) * SCALE - 6;

  return (
    <span className={cn("absolute bottom-0 left-0", className)}>
      <motion.span style={{ opacity: speed }} className="absolute bottom-0 left-0 motion-reduce:hidden" aria-hidden>
        {SPEED_LINES.map((line) => (
          <span
            key={line.x}
            className={cn(
              "animate-speedline absolute w-[1.5px] rounded-full from-transparent to-fg/70",
              goingDown ? "bg-linear-to-b" : "bg-linear-to-t [animation-direction:reverse]",
              line.length,
            )}
            style={{
              left: line.x * SCALE,
              animationDelay: line.delay,
              ...(goingDown ? { bottom: LENGTH * SCALE - 10 } : { top: -10 }),
            }}
          />
        ))}
      </motion.span>

      <svg
        width={WIDTH * SCALE}
        height={LENGTH * SCALE}
        viewBox={`0 0 ${WIDTH} ${LENGTH}`}
        className="absolute bottom-0 drop-shadow-[0_2px_6px_rgb(0_0_0/0.35)]"
        style={{ left: -RAIL_X * SCALE }}
      >
        <defs>
          <linearGradient id={livery} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent-from)" }} />
            <stop offset="0.5" style={{ stopColor: "var(--accent-via)" }} />
            <stop offset="1" style={{ stopColor: "var(--accent-to)" }} />
          </linearGradient>
        </defs>

        {WHEELS.map((y) => (
          <circle key={y} cx={RAIL_X} cy={y} r={1.5} className="fill-fg-subtle" />
        ))}

        <path d="M2 66 L0.4 70 L2 74" fill="none" strokeWidth={0.6} className="stroke-fg-subtle" />

        <path
          d="M15 3 Q15 0 12 0.5 C6 2.5 2 12 2 26 V112 C2 128 7 142 13 149 Q15 150.5 15 147 Z"
          strokeWidth={0.75}
          className="fill-surface-raised stroke-line-strong dark:fill-fg dark:stroke-fg"
        />

        <rect x={8.5} y={12} width={2} height={124} rx={1} fill={`url(#${livery})`} />

        {WINDOWS.map((y) => (
          <rect key={y} x={4} y={y} width={3} height={3.6} rx={0.8} className="fill-surface-inverse dark:fill-fg-inverse" />
        ))}

        <path
          d="M3 113 C3.3 121 6 128 10 133 L10.5 130 C7.5 126 5.2 120 5 113 Z"
          className="fill-surface-inverse dark:fill-fg-inverse"
        />
        <path
          d="M3 26 C3.2 21 5 15 8.5 11 L9 14 C6.5 17 5.2 21 5 26 Z"
          className="fill-surface-inverse dark:fill-fg-inverse"
        />

        {CAR_JOINTS.map((y) => (
          <line key={y} x1={2} x2={15} y1={y} y2={y} strokeWidth={0.6} className="stroke-fg-subtle" />
        ))}

        <circle
          cx={LAMP_X}
          cy={NOSE_LAMP_Y}
          r={1.3}
          className={cn("transition-[fill] duration-300", goingDown ? headlight : taillight)}
        />
        <circle
          cx={LAMP_X}
          cy={TAIL_LAMP_Y + 0.5}
          r={1.3}
          className={cn("transition-[fill] duration-300", goingDown ? taillight : headlight)}
        />
      </svg>

      <span
        aria-hidden
        className={cn(
          "absolute top-0 h-16 w-3 bg-linear-to-b from-accent-to/60 to-transparent blur-[1px] transition-opacity duration-300 [clip-path:polygon(40%_0,60%_0,100%_100%,0_100%)]",
          goingDown ? "opacity-100" : "opacity-0",
        )}
        style={{ left: beamLeft }}
      />
      <span
        aria-hidden
        className={cn(
          "absolute h-16 w-3 bg-linear-to-t from-accent-to/60 to-transparent blur-[1px] transition-opacity duration-300 [clip-path:polygon(0_0,100%_0,60%_100%,40%_100%)]",
          goingDown ? "opacity-0" : "opacity-100",
        )}
        style={{ left: beamLeft, bottom: (LENGTH - TAIL_LAMP_Y) * SCALE }}
      />
    </span>
  );
}
