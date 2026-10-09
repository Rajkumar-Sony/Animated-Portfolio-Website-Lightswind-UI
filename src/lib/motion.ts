import type { Transition, Variants } from "framer-motion";

/** Mirrors motion.duration.* in the design-system skill (seconds). */
export const duration = {
  instant: 0.15,
  fast: 0.3,
  normal: 0.4,
} as const;

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal * 1.5, ease: easeOut },
  },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});
