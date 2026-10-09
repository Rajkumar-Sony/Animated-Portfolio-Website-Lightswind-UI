import { cn } from "@/lib/cn";

type MonogramProps = { initials: string; className?: string };

/** Gradient-ringed initials tile used as the site logo. */
export function Monogram({ initials, className }: MonogramProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-gradient-accent grid size-9 shrink-0 place-items-center rounded-sm p-px shadow-sm",
        className,
      )}
    >
      <span className="grid size-full place-items-center rounded-[11px] bg-surface-raised text-xs font-bold">
        <span className="text-gradient">{initials}</span>
      </span>
    </span>
  );
}
