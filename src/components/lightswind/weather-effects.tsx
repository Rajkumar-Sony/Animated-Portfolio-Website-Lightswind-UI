import { motion } from "framer-motion";
import { Cloud, Zap } from "lucide-react";
import type { WeatherKind } from "@/lib/weather";
import { cn } from "@/lib/cn";

const SPARKLE_PATH =
  "M12 0C12.6 6.6 17.4 11.4 24 12 17.4 12.6 12.6 17.4 12 24 11.4 17.4 6.6 12.6 0 12 6.6 11.4 11.4 6.6 12 0Z";

// Unicode has no moon-behind-cloud, so partly cloudy nights fall back to a plain cloud.
const EMOJI: Record<WeatherKind, string | [day: string, night: string]> = {
  clear: ["☀️", "🌙"],
  "partly-cloudy": ["⛅", "☁️"],
  cloudy: ["🌥️", "☁️"],
  overcast: "☁️",
  drizzle: ["🌦️", "🌧️"],
  rain: ["🌦️", "🌧️"],
  "heavy-rain": "🌧️",
  storm: "⛈️",
  snow: "🌨️",
  sleet: "🌨️",
  fog: "🌫️",
  wind: "💨",
  tornado: "🌪️",
};

export function weatherEmoji(kind: WeatherKind, isDay: boolean): string {
  const emoji = EMOJI[kind];
  return Array.isArray(emoji) ? emoji[isDay ? 0 : 1] : emoji;
}

type EffectProps = { height: number; still: boolean };

/** Golden-ratio scatter: deterministic positions (percent of the effect area) that never clump. */
const spread = (i: number) => 6 + ((i * 0.618) % 1) * 84;

const SPARKLES = [
  { x: 10, y: 18, size: 0.3, delay: 0 },
  { x: 58, y: 14, size: 0.16, delay: 0.8 },
  { x: 40, y: 56, size: 0.22, delay: 1.6 },
  { x: 8, y: 66, size: 0.1, delay: 1.2 },
];

/** Stars at night, sun glints by day. */
function Sparkles({ height, still, count = 4, day }: EffectProps & { count?: number; day: boolean }) {
  return SPARKLES.slice(0, count).map((s, i) => (
    <motion.svg
      key={i}
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(
        "absolute",
        day ? "fill-accent-ink" : "fill-fg drop-shadow-[0_0_3px_var(--accent-ink)]",
      )}
      style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size * height, height: s.size * height }}
      animate={still ? { opacity: 0.8 } : { opacity: [1, 0.3, 1], scale: day ? [1, 0.7, 1] : 1 }}
      transition={{ duration: 2.4, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d={SPARKLE_PATH} />
    </motion.svg>
  ));
}

const CLOUDS = [
  { x: 4, y: 10, scale: 0.42 },
  { x: 46, y: 40, scale: 0.36 },
  { x: 20, y: 52, scale: 0.3 },
];

function Clouds({ height, still, count }: EffectProps & { count: number }) {
  return CLOUDS.slice(0, count).map((c, i) => (
    <motion.span
      key={i}
      aria-hidden
      className="absolute text-fg-muted"
      style={{ left: `${c.x}%`, top: `${c.y}%` }}
      animate={still ? { x: 0 } : { x: i % 2 ? [3, -3] : [-3, 3] }}
      transition={{ duration: 4 + i, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    >
      <Cloud strokeWidth={2.25} style={{ width: c.scale * height, height: c.scale * height }} />
    </motion.span>
  ));
}

function Drops({ height, still, count, heavy }: EffectProps & { count: number; heavy?: boolean }) {
  const duration = heavy ? 0.55 : 0.85;
  return Array.from({ length: count }, (_, i) => (
    <motion.span
      key={i}
      aria-hidden
      className="absolute top-0 w-px rotate-12 rounded-full bg-fg-muted"
      style={{ left: `${spread(i)}%`, height: height * (heavy ? 0.26 : 0.18) }}
      animate={
        still
          ? { y: height * (0.2 + ((i * 0.27) % 0.5)), opacity: 0.8 }
          : { y: [-height * 0.3, height * 1.05], opacity: [0, 1, 1, 0] }
      }
      transition={{ duration, delay: (i * duration) / count, repeat: Infinity, ease: "linear" }}
    />
  ));
}

function Flakes({ height, still, count }: EffectProps & { count: number }) {
  return Array.from({ length: count }, (_, i) => (
    <motion.span
      key={i}
      aria-hidden
      className="absolute top-0 size-[3px] rounded-full bg-fg-muted"
      style={{ left: `${spread(i)}%` }}
      animate={
        still
          ? { y: height * (0.2 + ((i * 0.27) % 0.6)), opacity: 0.9 }
          : { y: [-4, height + 2], x: [0, 2, -2, 0], opacity: [0, 1, 1, 0] }
      }
      transition={{ duration: 2.8, delay: (i * 2.8) / count, repeat: Infinity, ease: "linear" }}
    />
  ));
}

function Fog({ still }: EffectProps) {
  return [32, 50, 68].map((top, i) => (
    <motion.span
      key={top}
      aria-hidden
      className="absolute left-[8%] h-px w-[72%] rounded-full bg-fg-muted"
      style={{ top: `${top}%`, opacity: 0.9 - i * 0.2 }}
      animate={still ? { x: 0 } : { x: i % 2 ? [3, -3] : [-3, 3] }}
      transition={{ duration: 3 + i, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
  ));
}

function Gusts({ still, fast }: EffectProps & { fast?: boolean }) {
  return [30, 52, 72].map((top, i) => (
    <motion.span
      key={top}
      aria-hidden
      className="absolute h-px w-[40%] rounded-full bg-fg-muted"
      style={{ top: `${top}%` }}
      animate={still ? { left: `${10 + i * 15}%` } : { left: ["-40%", "100%"], opacity: [0, 1, 0] }}
      transition={{ duration: fast ? 0.7 : 1.4, delay: i * 0.35, repeat: Infinity, ease: "easeIn" }}
    />
  ));
}

function Bolt({ height, still }: EffectProps) {
  return (
    <motion.span
      aria-hidden
      className="absolute top-[14%] left-[52%] text-accent-ink"
      animate={still ? { opacity: 1 } : { opacity: [0, 0, 1, 0.2, 1, 0, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.6, 0.64, 0.68, 0.72, 0.8, 1] }}
    >
      <Zap strokeWidth={2.5} style={{ width: height * 0.4, height: height * 0.4 }} />
    </motion.span>
  );
}

/** Animated conditions for the free part of the toggle track. */
export function WeatherEffects({ kind, isDay, ...props }: EffectProps & { kind: WeatherKind; isDay: boolean }) {
  switch (kind) {
    case "clear":
      return <Sparkles {...props} day={isDay} />;
    case "partly-cloudy":
      return (
        <>
          <Sparkles {...props} day={isDay} count={2} />
          <Clouds {...props} count={1} />
        </>
      );
    case "cloudy":
      return <Clouds {...props} count={2} />;
    case "overcast":
      return <Clouds {...props} count={3} />;
    case "drizzle":
      return <Drops {...props} count={4} />;
    case "rain":
      return <Drops {...props} count={6} />;
    case "heavy-rain":
      return <Drops {...props} count={9} heavy />;
    case "storm":
      return (
        <>
          <Drops {...props} count={6} heavy />
          <Bolt {...props} />
        </>
      );
    case "snow":
      return <Flakes {...props} count={6} />;
    case "sleet":
      return (
        <>
          <Flakes {...props} count={3} />
          <Drops {...props} count={3} />
        </>
      );
    case "fog":
      return <Fog {...props} />;
    case "wind":
      return <Gusts {...props} />;
    case "tornado":
      return <Gusts {...props} fast />;
  }
}
