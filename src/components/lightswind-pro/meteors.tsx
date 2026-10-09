import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface MeteorsProps {
  /** Number of meteor streams. */
  number?: number;
  /** Meteor travel speed. */
  speed?: number;
  /** Angle of meteor trajectory in degrees. */
  angle?: number;
  className?: string;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

export default function Meteors({ number = 20, speed = 3, angle = -45, className }: MeteorsProps) {
  const meteors = useMemo(() => {
    const baseDuration = 15 / Math.max(speed, 0.1);
    return Array.from({ length: number }, (_, id) => {
      const duration = baseDuration * random(0.7, 1.4);
      return {
        id,
        top: `${random(0, 100)}%`,
        tail: `${Math.round(random(60, 160))}px`,
        duration: `${duration.toFixed(2)}s`,
        delay: `${random(0, duration * 1.5).toFixed(2)}s`,
      };
    });
  }, [number, speed]);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden [container-type:size]", className)}
    >
      {/* Square sized to the container diagonal so every rotation still covers the full area. */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: "hypot(100cqw, 100cqh)",
          height: "hypot(100cqw, 100cqh)",
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        }}
      >
        {meteors.map((m) => (
          <span
            key={m.id}
            className="absolute left-0 h-px w-full animate-meteor opacity-0"
            style={
              {
                top: m.top,
                "--meteor-duration": m.duration,
                "--meteor-delay": m.delay,
              } as CSSProperties
            }
          >
            <span className="absolute top-1/2 left-full size-0.5 -translate-y-1/2 rounded-full bg-fg shadow-[0_0_6px_1px_var(--accent-via)]" />
            <span
              className="absolute top-0 left-full h-px bg-linear-to-r from-fg/60 to-transparent"
              style={{ width: m.tail }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
