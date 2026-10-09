import { SparklesCore } from "@/components/ui/SparklesCore";

export function HeroBrandUnderline() {
  return (
    <div
      className="premium-hero-line relative mt-1.5 h-8 w-full max-w-xl overflow-hidden bg-transparent sm:h-10 sm:max-w-2xl [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]"
      aria-hidden="true"
    >
      <div className="absolute inset-x-10 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm sm:inset-x-20 dark:via-indigo-400" />
      <div className="absolute inset-x-10 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-indigo-500 to-transparent sm:inset-x-20 dark:via-indigo-400" />
      <div className="absolute inset-x-28 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent blur-sm sm:inset-x-60 dark:via-sky-400" />
      <div className="absolute inset-x-28 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-500 to-transparent sm:inset-x-60 dark:via-sky-400" />

      <SparklesCore
        id="hero-brand-sparkles"
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={800}
        className="h-full w-full bg-transparent"
        particleColor="#6366f1"
      />
    </div>
  );
}
