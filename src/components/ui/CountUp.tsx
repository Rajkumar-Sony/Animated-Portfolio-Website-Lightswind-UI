import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = { to: number; suffix?: string; duration?: number; className?: string };

/** Counts from zero once visible; screen readers always get the final value. */
export function CountUp({ to, suffix = "", duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduceMotion) {
      node.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (value) => {
        node.textContent = `${Math.round(value)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to, suffix, duration]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden>
        0{suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}
