import { useId } from "react";
import { cn } from "@/lib/cn";

type GridPatternProps = {
  width?: number;
  height?: number;
  /** Grid cells (column, row) to fill in. */
  squares?: ReadonlyArray<readonly [number, number]>;
  className?: string;
};

/** SVG line grid with optional filled cells; colour it with fill-* and stroke-* classes. */
export function GridPattern({ width = 30, height = 30, squares, className }: GridPatternProps) {
  const id = useId();

  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares?.map(([col, row]) => (
        <rect
          key={`${col}-${row}`}
          strokeWidth={0}
          width={width - 1}
          height={height - 1}
          x={col * width + 1}
          y={row * height + 1}
        />
      ))}
    </svg>
  );
}
