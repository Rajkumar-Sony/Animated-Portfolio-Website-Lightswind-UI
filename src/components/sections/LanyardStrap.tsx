import { motion, useTransform, type MotionValue } from "framer-motion";

type LanyardStrapProps = {
  /** Horizontal offset of the clamp from the anchor, in px. */
  dx: MotionValue<number>;
  /** Vertical distance from the anchor down to the clamp, in px. */
  dy: MotionValue<number>;
  className?: string;
};

/**
 * Fabric strap that stretches from a fixed anchor to a moving clamp.
 * Styled to match the strap artwork in `LanyardTag`.
 */
export function LanyardStrap({ dx, dy, className }: LanyardStrapProps) {
  const height = useTransform(() => Math.max(Math.hypot(dx.get(), dy.get()), 8));
  const rotate = useTransform(() => (Math.atan2(-dx.get(), dy.get()) * 180) / Math.PI);

  return (
    <motion.div
      aria-hidden
      style={{
        height,
        rotate,
        transformOrigin: "50% 0%",
        backgroundColor: "#27272a",
        backgroundImage:
          "linear-gradient(90deg, rgb(0 0 0 / 0.45), rgb(255 255 255 / 0.12) 25%, rgb(255 255 255 / 0.05) 75%, rgb(0 0 0 / 0.5))",
      }}
      className={className}
    >
      <span className="absolute inset-y-0 left-[1.5px] border-l-[0.75px] border-dashed border-white/15" />
      <span className="absolute inset-y-0 right-[1.5px] border-r-[0.75px] border-dashed border-white/15" />
    </motion.div>
  );
}
