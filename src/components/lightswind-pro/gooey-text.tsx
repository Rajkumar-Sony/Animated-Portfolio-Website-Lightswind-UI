import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

interface GooeyTextProps {
  /** Words to cycle through with gooey effect. */
  words: readonly string[];
  /** Duration per word in milliseconds. */
  duration?: number;
  className?: string;
}

const MORPH_MS = 1000;

function setMorph(el: HTMLElement, fraction: number) {
  el.style.filter = fraction >= 1 ? "" : `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  el.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
}

export default function GooeyText({ words, duration = 2000, className }: GooeyTextProps) {
  const filterId = `gooey-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const stageRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    const current = currentRef.current;
    const next = nextRef.current;
    const count = words.length;
    if (!stage || !current || !next || count === 0) return;

    // The threshold filter aliases glyph edges, so it only runs while two words are melting together.
    const setGooey = (on: boolean) => {
      stage.style.filter = on ? `url(#${filterId})` : "";
    };
    current.textContent = words[0];
    next.textContent = count > 1 ? words[1] : "";
    setMorph(current, 1);
    setMorph(next, 0);
    setGooey(false);
    if (reduceMotion || count < 2) return;

    const morphMs = Math.min(MORPH_MS, duration / 2);
    const holdMs = duration - morphMs;
    let index = 0;
    let start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= duration) {
        index = (index + 1) % count;
        start = now;
        current.textContent = words[index];
        next.textContent = words[(index + 1) % count];
        setMorph(current, 1);
        setMorph(next, 0);
        setGooey(false);
      } else if (elapsed > holdMs) {
        const fraction = (elapsed - holdMs) / morphMs;
        setGooey(true);
        setMorph(next, fraction);
        setMorph(current, 1 - fraction);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [words, duration, reduceMotion, filterId]);

  return (
    <div className={cn("relative", className)}>
      <span className="sr-only">{words.join(", ")}</span>
      <svg aria-hidden className="absolute size-0">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
            />
          </filter>
        </defs>
      </svg>
      <div ref={stageRef} aria-hidden className="grid size-full place-items-center">
        <span ref={currentRef} className="col-start-1 row-start-1 text-center whitespace-nowrap select-none" />
        <span ref={nextRef} className="col-start-1 row-start-1 text-center whitespace-nowrap select-none" />
      </div>
    </div>
  );
}
