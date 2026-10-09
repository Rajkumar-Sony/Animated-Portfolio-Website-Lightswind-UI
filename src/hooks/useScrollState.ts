import { useEffect, useState } from "react";

type ScrollState = { y: number; direction: "up" | "down"; atBottom: boolean };

/** Distance from the true page bottom (px) within which the footer counts as "in view". */
const BOTTOM_THRESHOLD = 240;

export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, direction: "up", atBottom: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let lastAtBottom = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const atBottom =
        y + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
      if (Math.abs(y - lastY) < 6 && atBottom === lastAtBottom) return;
      lastAtBottom = atBottom;
      setState({ y, direction: y > lastY ? "down" : "up", atBottom });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
