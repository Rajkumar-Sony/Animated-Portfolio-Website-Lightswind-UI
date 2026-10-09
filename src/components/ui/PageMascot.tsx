import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

type PageMascotProps = {
  className?: string;
  size?: number;
};

type Direction =
  | "up-left"
  | "up"
  | "up-right"
  | "left"
  | "center"
  | "right"
  | "down-left"
  | "down"
  | "down-right";

const DIRECTIONS: Direction[] = [
  "up-left",
  "up",
  "up-right",
  "left",
  "center",
  "right",
  "down-left",
  "down",
  "down-right",
];

const CLOCKWISE: Direction[] = [
  "right",
  "down-right",
  "down",
  "down-left",
  "left",
  "up-left",
  "up",
  "up-right",
];

// Use every cell from the 3x3 reaction sheet, in reading order.
const REACTION_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 70;
const REACTION_END = 820;
const SQUASH_MS = 420;
const DIRECTIONS_SHEET = "/mascots/raj-directions.png";
const REACTIONS_SHEET = "/mascots/raj-reactions.png";

const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.1, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
];

const layer: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundSize: "300% 300%",
  backgroundRepeat: "no-repeat",
};

function cell(index: number) {
  return {
    backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
  };
}

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function PageMascot({ className, size = 132 }: PageMascotProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const squashRef = useRef<HTMLSpanElement | null>(null);
  const timersRef = useRef<number[]>([]);
  const reactionIndexRef = useRef(0);
  const [direction, setDirection] = useState<Direction>("center");
  const [reactionCell, setReactionCell] = useState<number | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    let sector = -1;
    let pointer: { x: number; y: number } | null = null;

    const aim = () => {
      const button = buttonRef.current;
      if (!button || !pointer) return;

      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection("center");
        return;
      }

      const angle = Math.atan2(dy, dx);
      if (
        sector !== -1 &&
        Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS
      ) {
        return;
      }

      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", aim);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout);
    };
  }, []);

  const boop = () => {
    timersRef.current.forEach(window.clearTimeout);
    timersRef.current = [];

    const next = REACTION_CELLS[reactionIndexRef.current % REACTION_CELLS.length];
    reactionIndexRef.current += 1;
    setReactionCell(next);
    timersRef.current.push(window.setTimeout(() => setReactionCell(null), REACTION_END));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    squashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: "linear" });
  };

  return (
    <div className={cn("pointer-events-auto grid shrink-0 place-items-center", className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={boop}
        aria-label="Boop the Raj mascot"
        style={{
          position: "relative",
          display: "block",
          flexShrink: 0,
          width: size,
          height: size,
          padding: 0,
          border: 0,
          background: "transparent",
          appearance: "none",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          ref={squashRef}
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            height: "100%",
            transform: "scale(0.82)",
            transformOrigin: "50% 78%",
          }}
        >
          <span
            style={{
              ...layer,
              backgroundImage: `url(${DIRECTIONS_SHEET})`,
              ...cell(DIRECTIONS.indexOf(direction)),
              opacity: reactionCell === null ? 1 : 0,
            }}
          />
          <span
            style={{
              ...layer,
              backgroundImage: `url(${REACTIONS_SHEET})`,
              ...cell(reactionCell ?? 0),
              opacity: reactionCell === null ? 0 : 1,
            }}
          />
        </span>
      </button>
    </div>
  );
}
