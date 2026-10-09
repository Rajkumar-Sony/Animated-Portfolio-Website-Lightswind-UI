"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import type { WeatherSnapshot } from "@/lib/weather";
import { cn } from "@/lib/cn";
import { WeatherEffects, weatherEmoji } from "./weather-effects";

const heights = { sm: 24, md: 32, lg: 40 } as const;

// `wide` makes room for the weather readout; travel = width − padding − thumb, in px.
const sizes = {
  sm: { button: "w-12 h-6", wide: "w-20 h-6", thumb: "w-4 h-4", icon: "w-2.5 h-2.5", emoji: "text-[11px]", text: "text-[9px]", travel: 24, wideTravel: 56 },
  md: { button: "w-16 h-8", wide: "w-24 h-8", thumb: "w-6 h-6", icon: "w-4 h-4", emoji: "text-[15px]", text: "text-[11px]", travel: 32, wideTravel: 64 },
  lg: { button: "w-20 h-10", wide: "w-28 h-10", thumb: "w-8 h-8", icon: "w-5 h-5", emoji: "text-lg", text: "text-xs", travel: 40, wideTravel: 72 },
};

interface CoolThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Live conditions shown beside the thumb; without them the track shows a clear sky. */
  weather?: WeatherSnapshot | null;
}

export function CoolThemeToggle({ className, size = "md", weather }: CoolThemeToggleProps) {
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

  const currentSize = sizes[size];
  const track = "rounded-full ring-1 ring-line-strong ring-inset";
  const width = weather ? currentSize.wide : currentSize.button;

  if (!mounted) return <div className={cn("inline-flex", track, width)} />;

  const dark = theme === "dark";
  const kind = weather?.kind ?? "clear";
  const isDay = weather?.isDay ?? !dark;
  const ThemeIcon = dark ? Moon : Sun;
  const action = dark ? "Switch to light theme" : "Switch to dark theme";
  const conditions = weather && `${weather.place}: ${weather.description}, ${weather.temp}°C`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative p-1 transition-[width] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface before:absolute before:-inset-1.5 before:content-['']",
        track,
        width,
        className
      )}
      aria-label={conditions ? `${action} (${conditions})` : action}
      title={conditions ?? (dark ? "Light theme" : "Dark theme")}
    >
      {/* Conditions play out on whichever side the thumb isn't covering. */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <motion.div
          key={`${theme}-${kind}-${isDay}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "absolute inset-y-0 flex items-center justify-center",
            weather ? "w-[62%]" : "w-1/2",
            dark ? "left-[5%]" : "right-[5%]",
          )}
        >
          <div className={cn("absolute inset-0", weather && "opacity-50")}>
            <WeatherEffects kind={kind} isDay={isDay} height={heights[size]} still={!!reduceMotion} />
          </div>
          {weather && (
            <span className={cn("relative flex items-center gap-1 font-medium text-fg tabular-nums", currentSize.text)}>
              <span aria-hidden className={cn("leading-none", currentSize.emoji)}>
                {weatherEmoji(kind, isDay)}
              </span>
              {weather.temp}°
            </span>
          )}
        </motion.div>
      </div>

      <motion.div
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn("relative z-10 flex items-center justify-center rounded-full ring-1 ring-line-strong", currentSize.thumb)}
        animate={{ x: dark ? (weather ? currentSize.wideTravel : currentSize.travel) : 0 }}
      >
        <motion.span
          key={theme}
          initial={reduceMotion ? false : { rotate: dark ? -120 : 120, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex"
        >
          <ThemeIcon aria-hidden className={cn("text-accent-ink", currentSize.icon)} />
        </motion.span>
      </motion.div>
    </button>
  );
}
