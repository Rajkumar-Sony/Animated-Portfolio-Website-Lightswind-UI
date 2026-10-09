import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";

export type ThreeDRotatingCarouselItem = {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  image?: string;
};

type ThreeDRotatingCarouselProps = {
  items: ThreeDRotatingCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  className?: string;
};

export function ThreeDRotatingCarousel({
  items,
  autoRotate = true,
  rotateInterval = 4200,
  className,
}: ThreeDRotatingCarouselProps) {
  const [active, setActive] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (!autoRotate || count <= 1) return;
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, rotateInterval);
    return () => window.clearInterval(interval);
  }, [autoRotate, count, rotateInterval]);

  const positionedItems = useMemo(
    () =>
      items.map((item, index) => {
        const offset = ((index - active + count) % count) as number;
        const normalized = offset > count / 2 ? offset - count : offset;
        return { item, index, offset: normalized };
      }),
    [active, count, items],
  );

  if (count === 0) return null;

  const previous = () => setActive((current) => (current - 1 + count) % count);
  const next = () => setActive((current) => (current + 1) % count);

  return (
    <div className={cn("relative min-h-[28rem] overflow-hidden py-8", className)}>
      <div className="pointer-events-none absolute inset-x-10 top-16 h-48 rounded-full bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-emerald-500/10 blur-3xl" />
      <div className="relative mx-auto h-[25rem] max-w-4xl [perspective:1400px]">
        {positionedItems.map(({ item, offset }) => {
          const isActive = offset === 0;
          const abs = Math.abs(offset);
          const x = offset * 34;
          const rotateY = offset * -24;
          const scale = isActive ? 1 : 0.86;
          const depth = isActive ? 0 : -120 * abs;

          return (
            <article
              key={item.id ?? item.title}
              aria-hidden={!isActive}
              className={cn(
                "absolute top-0 left-1/2 flex h-96 w-[min(78vw,28rem)] flex-col overflow-hidden rounded-md border border-line bg-surface-raised shadow-lg transition-all duration-500 ease-out [backface-visibility:hidden]",
                isActive ? "z-30 opacity-100" : "z-10 opacity-45",
                abs > 1 && "opacity-0",
              )}
              style={{
                transform: `translateX(calc(-50% + ${x}%)) translateZ(${depth}px) rotateY(${rotateY}deg) scale(${scale})`,
              }}
            >
              <div className="relative h-44 overflow-hidden bg-neutral-950">
                {item.image ? (
                  <img src={item.image} alt="" className="size-full object-cover" loading="lazy" decoding="async" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.32),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.28),transparent_30%),linear-gradient(135deg,#111827,#030712)]">
                    <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm">
                      Coming soon
                    </span>
                  </div>
                )}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <p className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-2xs font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
                  Personal build
                </p>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.description}</p>
                <div className="mt-auto flex flex-wrap items-center gap-1 pt-4 sm:gap-2">
                  <ul className="flex min-w-0 flex-wrap gap-1 sm:gap-1.5" aria-label={`${item.title} technologies`}>
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line px-1.5 py-0.5 text-[10px] font-medium leading-4 sm:px-2.5 sm:py-1 sm:text-xs sm:leading-normal"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  {item.href && (
                    <a
                      href={item.href}
                      className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold sm:gap-2 sm:text-sm"
                      aria-label={`Open ${item.title}`}
                    >
                      View project
                      <ExternalLink aria-hidden className="size-3.5 sm:size-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={previous}
          aria-label="Previous project"
          className="grid size-11 place-items-center rounded-full border border-line bg-surface-raised shadow-sm transition-colors hover:bg-surface-sunken"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <div className="flex gap-2" aria-label="Project carousel position">
          {items.map((item, index) => (
            <button
              key={item.id ?? item.title}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show ${item.title}`}
              className={cn(
                "h-2 rounded-full transition-all",
                active === index ? "w-7 bg-fg" : "w-2 bg-fg-muted/35 hover:bg-fg-muted",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next project"
          className="grid size-11 place-items-center rounded-full border border-line bg-surface-raised shadow-sm transition-colors hover:bg-surface-sunken"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
