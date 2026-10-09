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

const clockFormat = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
// English to match the rest of the site, regardless of the visitor's locale.
const dayFormat = new Intl.DateTimeFormat("en-US", { weekday: "short" });

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export function Header({ active }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const { y, direction } = useScrollState();
  const now = useClock();
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
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-t-[22px] rounded-b-md bg-linear-to-b from-white/30 to-white/5 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),inset_0_0_0_1px_rgb(0_0_0/0.07),0_8px_32px_rgb(0_0_0/0.06)] backdrop-blur-xl backdrop-saturate-150 dark:from-white/10 dark:to-white/[0.02] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_0_0_1px_rgb(255_255_255/0.08),0_8px_32px_rgb(0_0_0/0.5)]">
        <BorderBeam size={90} duration={10} colorFrom="var(--accent-from)" colorTo="var(--accent-to)" />

        <div className="flex h-14 items-center justify-between gap-4 pr-2 pl-3 sm:pr-3 sm:pl-4">
          <div className="flex items-center gap-1">
            <a href="#hero" className="flex min-h-11 items-center gap-2.5 rounded-sm pr-2" onClick={() => setOpen(false)}>
              <Monogram initials={profile.initials} className="size-8" />
              <span className="hidden text-sm font-semibold sm:inline">{profile.name}</span>
            </a>

            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center">
                {headerNav.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        aria-current={isActive ? "location" : undefined}
                        className={cn(
                          "relative flex min-h-11 items-center rounded-full px-3 text-sm transition-colors duration-150",
                          isActive ? "font-medium text-fg" : "text-fg-muted hover:text-fg",
                        )}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="header-active"
                            className="absolute inset-x-0.5 inset-y-2 -z-10 rounded-full bg-fg/10"
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
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <time
              dateTime={now.toISOString()}
              className="hidden text-sm font-medium tabular-nums sm:block"
            >
              {clockFormat.format(now)} <span className="text-fg-muted">{dayFormat.format(now)}</span>
            </time>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full bg-fg/5 ring-1 ring-fg/10 transition-colors duration-150 hover:bg-fg/10 md:hidden"
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
              <ul className="grid gap-1 border-t border-fg/10 p-3 sm:grid-cols-2">
                {headerNav.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === item.id ? "location" : undefined}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-sm px-3 text-base transition-colors duration-150",
                        active === item.id
                          ? "bg-fg/10 font-medium text-fg"
                          : "text-fg-muted hover:bg-fg/5 hover:text-fg",
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
