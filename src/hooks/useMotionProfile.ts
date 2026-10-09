import { useEffect, useState } from "react";

export type MotionProfile = {
  /** Use native scrolling instead of Lenis (touch phones, narrow viewports). */
  preferNativeScroll: boolean;
  /** Lighter GPU/CPU load: fewer particles, no sky parallax. */
  reduceEffects: boolean;
};

function readMotionProfile(): MotionProfile {
  if (typeof window === "undefined") {
    return { preferNativeScroll: false, reduceEffects: false };
  }
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const touch = coarse || narrow;
  return { preferNativeScroll: touch, reduceEffects: touch };
}

/** Mobile / touch layout: native scroll and lighter motion so animations do not stall. */
export function useMotionProfile(): MotionProfile {
  const [profile, setProfile] = useState(readMotionProfile);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const narrow = window.matchMedia("(max-width: 767px)");
    const update = () => setProfile(readMotionProfile());
    coarse.addEventListener("change", update);
    narrow.addEventListener("change", update);
    update();
    return () => {
      coarse.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, []);

  return profile;
}
