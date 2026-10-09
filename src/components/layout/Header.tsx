import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BorderBeam } from "@/components/lightswind/border-beam";
import { Monogram } from "@/components/ui/Monogram";
import { headerNav, profile, type SectionId } from "@/data/portfolio";
import { useScrollState } from "@/hooks/useScrollState";
import { cn } from "@/lib/cn";
import { duration, easeOut } from "@/lib/motion";
import { ThemeToggle } from "./ThemeToggle";

type HeaderProps = { active: SectionId };

export function Header({ active }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { y, direction } = useScrollState();
  const menuId = useId();
  const hidden = !open && direction === "down" && y > 160;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: duration.normal, ease: easeOut }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4"
    >
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-md border border-line bg-surface/80 shadow-soft backdrop-blur-xl">
        <BorderBeam size={90} duration={10} colorFrom="var(--accent-from)" colorTo="var(--accent-to)" />

        <div className="flex h-16 items-center justify-between gap-4 pr-2.5 pl-3 sm:pl-4">
          <a href="#hero" className="flex min-h-11 items-center gap-3 rounded-sm" onClick={() => setOpen(false)}>
            <Monogram initials={profile.initials} />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{profile.name}</span>
              <span className="text-2xs tracking-[0.18em] text-fg-muted uppercase">Portfolio</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {headerNav.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative flex min-h-11 items-center rounded-full px-4 text-sm transition-colors duration-150",
                        isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="header-active"
                          className="absolute inset-x-1 inset-y-1.5 -z-10 rounded-full bg-surface-sunken"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-line bg-surface-raised shadow-sm md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              id={menuId}
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: duration.fast, ease: easeOut }}
              className="overflow-hidden md:hidden"
            >
              <ul className="grid gap-1 border-t border-line p-3">
                {headerNav.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === item.id ? "location" : undefined}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-sm px-3 text-base transition-colors duration-150",
                        active === item.id
                          ? "bg-surface-sunken font-medium text-fg"
                          : "text-fg-muted hover:bg-surface-sunken hover:text-fg",
                      )}
                    >
                      <item.icon aria-hidden className="size-4" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
