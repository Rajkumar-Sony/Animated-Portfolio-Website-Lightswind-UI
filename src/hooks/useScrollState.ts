import { useEffect, useState } from "react";

type ScrollState = { y: number; direction: "up" | "down" };

export function useScrollState(): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, direction: "up" });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setState({ y, direction: y > lastY ? "down" : "up" });
      lastY = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
