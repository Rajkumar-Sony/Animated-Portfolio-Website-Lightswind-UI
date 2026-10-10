import { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { FooterBirds, FooterLandscape, SettingSun } from "./FooterLandscape";

/** Animated landscape behind the footer; it only renders while near the viewport. */
export function FooterScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[379px] overflow-clip [--fade-bottom:110px] [--fade-floor:0.35] [--fade-top:206px] sm:h-[439px] sm:[--fade-bottom:150px] lg:h-[536px] lg:[--fade-bottom:170px] lg:[--fade-top:225px]",
        "dark:[--fade-bottom:146px] dark:[--fade-floor:0] sm:dark:[--fade-bottom:226px] lg:dark:[--fade-bottom:260px]",
        /*
         * Where the sun sets behind the far ridge. The landscape is a centred 16:9 cover crop, so its rendered height
         * is max(100%, 56.25cqw) of the footer, and at 85% across the ridge sits 43.9% of the way down it.
         */
        "[--sun-x:85%] [--sun-y:calc(50%_-_0.061_*_max(100%,56.25cqw))]",
        className,
      )}
    >
      {/* Dark theme: warm afterglow the setting sun casts up into the footer. */}
      {inView && <div className="absolute inset-0 hidden bg-sunset-afterglow mask-scene [--fade-bottom:0px] [--fade-top:12rem] dark:block" />}

      {inView && (
        <div className="absolute inset-0 mask-scene">
          <FooterLandscape active className="absolute inset-0" />
        </div>
      )}

      {/* Dark theme: the sun itself, half sunk behind the ridge. */}
      {inView && (
        <div className="absolute inset-0 hidden mask-scene [--fade-bottom:0px] [--fade-top:10rem] dark:block">
          <span className="absolute top-(--sun-y) left-(--sun-x) size-[36rem] -translate-1/2 rounded-full bg-sun-halo" />
          <SettingSun />
        </div>
      )}

      {inView && (
        <div className="absolute inset-0 mask-scene">
          <FooterBirds active className="absolute inset-0" />
        </div>
      )}
    </div>
  );
}
