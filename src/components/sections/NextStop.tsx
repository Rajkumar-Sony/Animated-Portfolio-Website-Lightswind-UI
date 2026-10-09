import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Construction } from "lucide-react";
import { Station } from "@/components/sections/Station";
import { profile } from "@/data/portfolio";
import { buttonStyles } from "@/lib/buttonStyles";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { stationCode } from "@/lib/station";

const SLEEPERS = 14;

/** Unfinished end of the career line: the train halts at a buffer stop while new track is laid. */
export function NextStop({ number, onLeft }: { number: number; onLeft: boolean }) {
  return (
    <div className="relative grid grid-cols-[2.5rem_1fr] pt-10 md:grid-cols-[1fr_4rem_1fr] md:pt-16">
      <span aria-hidden className="absolute top-0 left-5 h-8 w-12 -translate-x-1/2 md:left-1/2 md:w-16">
        <span className="absolute top-2.5 left-[7px] h-5.5 w-0.5 bg-fg-subtle" />
        <span className="absolute top-2.5 right-[7px] h-5.5 w-0.5 bg-fg-subtle" />
        <span className="bg-hazard absolute inset-x-0 top-4 h-2.5 rounded-[3px] shadow-sm ring-1 ring-black/40 motion-safe:animate-hazard-crawl" />
        <span className="absolute top-0 left-0.5 size-2.5 rounded-full bg-warning shadow-[0_0_8px_var(--warning)] motion-safe:animate-crossing" />
        <span
          className="absolute top-0 right-0.5 size-2.5 rounded-full bg-warning shadow-[0_0_8px_var(--warning)] motion-safe:animate-crossing"
          style={{ "--crossing-delay": "-0.6s" } as CSSProperties}
        />
      </span>

      <span
        aria-hidden
        className="absolute top-10 bottom-0 left-5 w-0 -translate-x-1/2 border-l border-dashed border-line-strong mask-b-from-30% md:left-1/2"
      />
      <span aria-hidden className="absolute top-10 left-5 flex -translate-x-1/2 flex-col gap-[7px] md:left-1/2">
        {Array.from({ length: SLEEPERS }, (_, i) => (
          <span
            key={i}
            className="h-0.5 w-[11px] bg-line-strong motion-safe:animate-lay-sleeper"
            style={{ "--sleeper-delay": `${i * 0.1}s` } as CSSProperties}
          />
        ))}
      </span>

      <Station
        number={number}
        construction
        className="col-start-1 row-start-1 mt-6 justify-self-center md:col-start-2"
      />

      <motion.article
        aria-labelledby="career-next-stop"
        initial={{ opacity: 0, x: onLeft ? -32 : 32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={cn(
          "col-start-2 row-start-1 overflow-hidden rounded-sm border border-dashed border-line-strong bg-surface-raised shadow-md transition-shadow duration-300 hover:shadow-lg",
          onLeft ? "md:col-start-1" : "md:col-start-3",
        )}
      >
        <span aria-hidden className="bg-hazard block h-1.5 motion-safe:animate-hazard-crawl" />
        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <Construction aria-hidden className="size-3.5" />
            Next stop
            <span className="font-mono text-2xs font-normal tracking-[0.14em] text-fg-muted">{stationCode(number)}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-2xs tracking-[0.14em] text-fg-muted uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-warning motion-safe:animate-crossing" />
              In progress
            </span>
          </p>
          <h3 id="career-next-stop" className="mt-2 text-lg font-bold tracking-tight">
            Under Construction
          </h3>
          <p className="text-sm text-fg-muted">Destination: your team?</p>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            The line ends here for now. I'm laying track toward my next {profile.idCard.specialty} role, with a{" "}
            {profile.idCard.noticePeriod} notice period.
          </p>

          <div className="mt-4">
            <p className="flex items-center justify-between text-2xs tracking-[0.14em] text-fg-muted uppercase">
              <span>
                Laying track
                <span aria-hidden>
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="motion-safe:animate-pulse"
                      style={{ animationDelay: `${dot * 0.2}s` }}
                    >
                      .
                    </span>
                  ))}
                </span>
              </span>
              <span>ETA: soon</span>
            </p>
            <span aria-hidden className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-sunken">
              <span className="bg-hazard block h-full w-2/5 rounded-full motion-safe:animate-[hazard-crawl_1.1s_linear_infinite,survey_2.4s_ease-in-out_infinite]" />
            </span>
          </div>

          <a href="#contact" className={buttonStyles("secondary", "group mt-5 min-h-11 px-4 text-xs")}>
            Build the next stop with me
            <ArrowRight aria-hidden className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.article>
    </div>
  );
}
