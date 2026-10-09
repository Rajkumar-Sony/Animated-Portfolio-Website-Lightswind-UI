"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon, Cloud } from "lucide-react";
import { cn } from "@/lib/cn";

const SPARKLE_PATH =
  "M12 0C12.6 6.6 17.4 11.4 24 12 17.4 12.6 12.6 17.4 12 24 11.4 17.4 6.6 12.6 0 12 6.6 11.4 11.4 6.6 12 0Z";

// x/y are fractions of the track; size is a fraction of the track height.
// All stars stay left of the thumb, which sits on the right in dark mode.
const STARS = [
  { x: 0.12, y: 0.2, size: 0.3, opacity: 1, delay: 0 },
  { x: 0.34, y: 0.16, size: 0.16, opacity: 0.7, delay: 0.8 },
  { x: 0.27, y: 0.56, size: 0.22, opacity: 0.85, delay: 1.6 },
  { x: 0.1, y: 0.66, size: 0.1, opacity: 0.5, delay: 1.2 },
];

const heights = { sm: 24, md: 32, lg: 40 } as const;

interface CoolThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CoolThemeToggle({ className, size = "md" }: CoolThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return <div className={cn("inline-flex rounded-full bg-surface-sunken", size === "sm" ? "h-6 w-12" : size === "md" ? "h-8 w-16" : "h-10 w-20")} />;

  const sizes = {
    sm: { button: "w-12 h-6", thumb: "w-4 h-4", icon: "w-2.5 h-2.5", padding: "p-1", translateX: "translateX(24px)", cloudSize: "w-3 h-3" },
    md: { button: "w-16 h-8", thumb: "w-6 h-6", icon: "w-4 h-4", padding: "p-1", translateX: "translateX(32px)", cloudSize: "w-5 h-5" },
    lg: { button: "w-20 h-10", thumb: "w-8 h-8", icon: "w-5 h-5", padding: "p-1", translateX: "translateX(40px)", cloudSize: "w-6 h-6" }
  };

  const currentSize = sizes[size];

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative rounded-full transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface before:absolute before:-inset-1.5 before:content-['']",
        theme === "dark" ? "bg-surface-sunken ring-1 ring-line-strong ring-inset" : "bg-gradient-accent",
        currentSize.button,
        currentSize.padding,
        className
      )}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-full">
        <motion.div
          initial={false}
          animate={{
            opacity: theme === "light" ? 1 : 0,
            y: theme === "light" ? 0 : 10,
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-end pr-2 text-white"
        >
          <Cloud className={cn("text-white/80 fill-white/80", currentSize.cloudSize)} />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            opacity: theme === "dark" ? 1 : 0,
            y: theme === "dark" ? 0 : -10,
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {STARS.map((star, i) => (
            <motion.svg
              key={i}
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="absolute fill-fg drop-shadow-[0_0_3px_var(--accent-ink)]"
              style={{
                left: `${star.x * 100}%`,
                top: `${star.y * 100}%`,
                width: star.size * heights[size],
                height: star.size * heights[size],
              }}
              initial={false}
              animate={
                theme === "dark" && !reduceMotion
                  ? { opacity: [star.opacity, star.opacity * 0.35, star.opacity] }
                  : { opacity: star.opacity }
              }
              transition={{ duration: 2.4, delay: star.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d={SPARKLE_PATH} />
            </motion.svg>
          ))}
        </motion.div>
      </div>

      {/* Toggle Thumb */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full shadow-md",
          theme === "dark" ? "bg-gradient-accent" : "bg-surface-raised",
          currentSize.thumb
        )}
        animate={{
          x: theme === "dark" ? parseInt(currentSize.translateX.replace("translateX(", "").replace("px)", "")) : 0
        }}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Sun */}
          <motion.div
            initial={false}
            animate={{
              rotate: theme === "dark" ? 180 : 0,
              scale: theme === "dark" ? 0 : 1,
              opacity: theme === "dark" ? 0 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="absolute"
          >
            <Sun className={cn("text-accent-ink fill-accent-from/20", currentSize.icon)} />
          </motion.div>

          {/* Moon */}
          <motion.div
            initial={false}
            animate={{
              rotate: theme === "dark" ? 0 : -180,
              scale: theme === "dark" ? 1 : 0,
              opacity: theme === "dark" ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
            className="absolute flex items-center justify-center"
          >
            <Moon className={cn("text-fg-inverse fill-fg-inverse", currentSize.icon)} />
          </motion.div>
        </div>
      </motion.div>
    </button>
  );
}
