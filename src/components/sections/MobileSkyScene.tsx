import type { CSSProperties, ReactNode } from "react";
import { useMotionValue } from "framer-motion";
import { Airplane, Helicopter, HotAirBalloon, Parachutist } from "./SkyCraft";

type MobileCraft = {
  key: string;
  className: string;
  style: CSSProperties;
  children: ReactNode;
};

function MobileBalloon() {
  const flame = useMotionValue(0.65);
  return <HotAirBalloon flame={flame} />;
}

export function MobileSkyScene() {
  const craft: readonly MobileCraft[] = [
    {
      key: "airplane",
      className: "top-[38%] left-[-34%] w-48 animate-[mobile-sky-cruise_18s_linear_infinite]",
      style: { animationDelay: "-8s" },
      children: <Airplane heading={1} />,
    },
    {
      key: "balloon",
      className: "top-[70%] left-[22%] w-20 animate-[mobile-sky-balloon_12s_ease-in-out_infinite]",
      style: { animationDelay: "-4s" },
      children: <MobileBalloon />,
    },
    {
      key: "helicopter",
      className: "top-[55%] left-[70%] w-24 animate-[mobile-sky-heli_15s_ease-in-out_infinite]",
      style: { animationDelay: "-6s" },
      children: <Helicopter heading={-1} />,
    },
    {
      key: "parachute",
      className: "top-[28%] left-[52%] w-16 animate-[mobile-sky-parachute_16s_ease-in-out_infinite]",
      style: { animationDelay: "-2s" },
      children: <Parachutist />,
    },
  ];

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {craft.map((item) => (
        <div key={item.key} className={`absolute will-change-transform motion-reduce:animate-none ${item.className}`} style={item.style}>
          {item.children}
        </div>
      ))}
    </div>
  );
}
