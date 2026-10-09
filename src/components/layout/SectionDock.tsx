import { AnimatePresence, motion } from "framer-motion";
import { dockNav, type SectionId } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { duration, easeOut } from "@/lib/motion";

type SectionDockProps = { active: SectionId; visible: boolean };

export function SectionDock({ active, visible }: SectionDockProps) {
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
          <ul className="flex items-center gap-1 rounded-full border border-line bg-surface/85 p-1.5 shadow-lg backdrop-blur-xl">
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
