import { useState } from "react";
import { cn } from "@/lib/cn";

type MonogramProps = { initials: string; photo?: string; className?: string };

/** Gradient-ringed tile used as the site logo; shows the photo when given, initials otherwise. */
export function Monogram({ initials, photo, className }: MonogramProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photo && !failed;

  return (
    <span
      aria-hidden
      className={cn(
        "bg-gradient-accent grid size-9 shrink-0 place-items-center rounded-sm p-px shadow-sm",
        className,
      )}
    >
      <span className="grid size-full place-items-center overflow-hidden rounded-[inherit] bg-surface-raised text-xs font-bold">
        {showPhoto ? (
          <img
            src={photo}
            alt=""
            width={36}
            height={36}
            draggable={false}
            onError={() => setFailed(true)}
            className="size-full origin-[50%_30%] scale-[1.45] object-cover"
          />
        ) : (
          <span className="text-gradient">{initials}</span>
        )}
      </span>
    </span>
  );
}
