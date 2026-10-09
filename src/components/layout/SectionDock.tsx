import { useEffect, useRef, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dockNav, type SectionId } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { duration, easeOut } from "@/lib/motion";

type SectionDockProps = { active: SectionId; visible: boolean };

/** Matches `bottom-4` on the dock. */
const DOCK_BOTTOM = 16;
const BOUNDARY_GAP = 12;

/**
 * Lifts the dock so it rests above any `[data-dock-boundary]` element scrolling up from below.
 * Written straight to the DOM: a motion value here would make the shared-layout pill lag a frame.
 */
function useBoundaryLift(ref: RefObject<HTMLElement | null>, mounted: boolean) {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const boundary = document.querySelector<HTMLElement>("[data-dock-boundary]");
      const dockBottom = window.innerHeight - DOCK_BOTTOM;
      const limit = boundary ? boundary.getBoundingClientRect().top - BOUNDARY_GAP : dockBottom;
      ref.current?.style.setProperty("translate", `0 ${-Math.max(0, dockBottom - limit)}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, mounted]);
}

export function SectionDock({ active, visible }: SectionDockProps) {
  const listRef = useRef<HTMLUListElement>(null);
  useBoundaryLift(listRef, visible);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Section shortcuts"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-3"
        >
          <ul
            ref={listRef}
            className="flex items-center gap-1 rounded-full border border-line bg-surface/85 p-1.5 shadow-lg backdrop-blur-xl"
          >
            {dockNav.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <li key={id} className="group relative">
                  <a
                    href={`#${id}`}
                    aria-label={label}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative grid size-11 place-items-center rounded-full transition-[color,transform] duration-150 hover:-translate-y-1 active:scale-95",
                      isActive ? "text-fg-inverse" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="dock-active"
                        className="absolute inset-0 -z-10 rounded-full bg-surface-inverse"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Icon aria-hidden className="size-4" />
                  </a>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 translate-y-1 rounded-full bg-surface-inverse px-2.5 py-1 text-2xs font-semibold whitespace-nowrap text-fg-inverse opacity-0 shadow-md transition-[opacity,transform] duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
