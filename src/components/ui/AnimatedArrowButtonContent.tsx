import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type AnimatedArrowButtonContentProps = {
  children: ReactNode;
  icon: LucideIcon;
};

export function AnimatedArrowButtonContent({ children, icon: Icon }: AnimatedArrowButtonContentProps) {
  return (
    <>
      <span className="relative z-10 transition-transform duration-300 ease-out group-hover:-translate-x-1 group-focus-visible:-translate-x-1">
        {children}
      </span>
      <span
        aria-hidden
        className="relative z-10 -mr-3 ml-1 grid size-8 shrink-0 place-items-center rounded-full bg-fg-inverse text-surface-inverse transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-rotate-45 group-focus-visible:translate-x-1 group-focus-visible:-rotate-45"
      >
        <Icon className="size-4" />
      </span>
    </>
  );
}
