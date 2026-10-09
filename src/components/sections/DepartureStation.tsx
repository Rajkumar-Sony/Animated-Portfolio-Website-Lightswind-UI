import type { CSSProperties } from "react";

const onTrack = "absolute left-5 -translate-x-1/2 md:left-1/2";

/** Start of the career line: the train departs from this platform, opposite the NextStop buffer. */
export function DepartureStation({ departed }: { departed: string }) {
  return (
    <div aria-hidden className="relative h-24">
      <span
        className={`${onTrack} top-9 bottom-0 w-[11px] bg-[repeating-linear-gradient(to_bottom,var(--line-strong)_0_2px,transparent_2px_9px)]`}
      />
      <span className={`${onTrack} top-9 bottom-0 w-[3px] bg-line-strong`} />
      <span className={`${onTrack} top-8 h-1.5 w-[17px] rounded-[2px] bg-fg shadow-sm`} />

      <span className={`${onTrack} top-0 h-9 w-16`}>
        <span className="absolute inset-x-0 top-0 h-2 rounded-t-md bg-fg shadow-sm" />
        <span className="bg-gradient-accent absolute inset-x-1 top-2 h-0.5 rounded-full" />
        <span className="absolute top-2 left-1 h-7 w-0.5 bg-fg-subtle" />
        <span className="absolute top-2 right-1 h-7 w-0.5 bg-fg-subtle" />
        <span className="absolute top-3 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-warning shadow-[0_0_8px_var(--warning)] motion-safe:animate-pulse" />
      </span>

      <span className="absolute top-12 left-5 -translate-x-[calc(100%+12px)] md:left-1/2">
        <span className="relative grid size-3 place-items-center">
          <span className="absolute inset-0 rounded-full bg-success/40 motion-safe:animate-ping-slow" />
          <span className="size-2.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
        </span>
      </span>

      <span className="absolute top-2 left-5 ml-10 md:left-1/2">
        <span className="flex items-center gap-2 rounded-sm bg-surface-inverse px-2.5 py-1.5 font-mono text-2xs tracking-[0.14em] whitespace-nowrap text-fg-inverse uppercase shadow-md">
          <span
            className="size-1.5 rounded-full bg-success motion-safe:animate-crossing"
            style={{ "--crossing-delay": "-0.3s" } as CSSProperties}
          />
          Departure · {departed}
        </span>
        <span className="mt-1 block pl-1 text-2xs tracking-[0.14em] text-fg-muted uppercase">Platform 1</span>
      </span>
    </div>
  );
}
