import type { Ref } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/cn";

const PLATFORM_LAMPS = 4;

/**
 * Route-map station on the career line: a numbering badge on the rail and, from md up, a platform
 * beside it (on the side the train doesn't overhang) whose lamps light as the train arrives.
 */
export function Station({
  number,
  arrived = false,
  current = false,
  construction = false,
  ref,
  className,
}: {
  number: number;
  arrived?: boolean;
  current?: boolean;
  construction?: boolean;
  ref?: Ref<HTMLSpanElement>;
  className?: string;
}) {
  const lit = arrived && !construction;

  return (
    <span ref={ref} aria-hidden className={cn("relative size-7", className)}>
      <span className="absolute top-1/2 left-[calc(100%+5px)] hidden h-16 w-2.5 -translate-y-1/2 md:block">
        {construction ? (
          <span className="absolute inset-0 overflow-hidden rounded-[3px] border border-dashed border-warning/70">
            <span className="bg-hazard absolute inset-0 origin-top opacity-70 motion-safe:animate-platform-build" />
          </span>
        ) : (
          <span className="absolute inset-0 rounded-[3px] border border-line-strong bg-surface-sunken">
            <span
              className={cn(
                "absolute inset-y-1 left-[2px] w-[2px] bg-[repeating-linear-gradient(to_bottom,var(--warning)_0_3px,transparent_3px_5px)] transition-opacity duration-500",
                lit ? "opacity-100" : "opacity-40",
              )}
            />
            <span className="absolute inset-y-1.5 right-[1.5px] flex flex-col justify-between">
              {Array.from({ length: PLATFORM_LAMPS }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-[3px] rounded-full transition-[background-color,box-shadow] duration-300",
                    lit ? "bg-accent-to shadow-[0_0_5px_var(--accent-to)]" : "bg-line-strong",
                  )}
                  style={{ transitionDelay: lit ? `${i * 90}ms` : "0ms" }}
                />
              ))}
            </span>
          </span>
        )}
      </span>

      {current && lit && (
        <span className="bg-gradient-accent absolute inset-0 rounded-[7px] opacity-50 motion-safe:animate-ping-slow" />
      )}
      {construction && (
        <span className="absolute inset-0 rounded-[7px] bg-warning/40 motion-safe:animate-ping-slow" />
      )}
      {lit && (
        <motion.span
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 rounded-[7px] border-2 border-accent-via"
        />
      )}

      <motion.span
        animate={{ scale: lit ? [1, 1.18, 1] : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn(
          "relative grid size-full place-items-center overflow-hidden rounded-[7px] shadow-[0_0_0_5px_var(--surface)]",
          construction ? "border-2 border-dashed border-warning bg-surface" : "bg-line-strong p-0.5",
        )}
      >
        {!construction && (
          <span
            className={cn(
              "bg-gradient-accent absolute inset-0 transition-opacity duration-500",
              lit ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        <span
          className={cn(
            "relative flex flex-col items-center justify-center leading-none",
            !construction && "size-full rounded-[5px] bg-surface",
          )}
        >
          <span
            className={cn(
              "text-[7px] font-semibold tracking-[0.08em] transition-colors duration-500",
              lit ? "text-fg-muted" : "text-fg-subtle",
            )}
          >
            {profile.initials}
          </span>
          <span
            className={cn(
              "text-[11px] font-bold tabular-nums transition-colors duration-500",
              lit || construction ? "text-fg" : "text-fg-subtle",
            )}
          >
            {String(number).padStart(2, "0")}
          </span>
        </span>
      </motion.span>
    </span>
  );
}
