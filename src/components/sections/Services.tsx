import type { CSSProperties, PointerEvent } from "react";
import { GridPattern } from "@/components/ui/GridPattern";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { services } from "@/data/portfolio";

const GRID_SQUARES: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [[7, 1], [8, 3], [9, 2], [10, 5], [8, 4]],
  [[6, 2], [8, 1], [9, 4], [11, 3], [7, 5]],
  [[8, 2], [9, 1], [10, 3], [7, 4], [11, 2]],
  [[6, 1], [8, 2], [9, 5], [10, 3], [7, 3]],
];

/** Light hover tint per card: sky, mint, lavender, peach. */
const SPOT_COLORS = [
  "rgb(125 211 252 / 0.32)",
  "rgb(110 231 183 / 0.32)",
  "rgb(196 181 253 / 0.34)",
  "rgb(253 186 116 / 0.3)",
];

function trackSpotlight(event: PointerEvent<HTMLElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        id="services"
        title="What I"
        highlight="Do"
        align="center"
        description="Backend engineering across the whole lifecycle: designing APIs, shipping them through CI/CD and keeping them healthy in production."
      />
      <Reveal as="ul" className="grid gap-4 sm:grid-cols-2">
        {services.map(({ title, description, icon: Icon }, index) => (
          <RevealItem as="li" key={title}>
            <article
              onPointerMove={trackSpotlight}
              style={{ "--spot-color": SPOT_COLORS[index % SPOT_COLORS.length] } as CSSProperties}
              className="group relative isolate h-full overflow-hidden rounded-md border border-line bg-surface-raised p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lg sm:p-7"
            >
              <div aria-hidden className="pointer-events-none absolute -inset-7 -z-10">
                <div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent)]">
                  <GridPattern
                    squares={GRID_SQUARES[index % GRID_SQUARES.length]}
                    className="translate-y-2 fill-accent-to/15 stroke-accent-to/25 transition-[translate,fill] duration-300 ease-out group-hover:translate-y-0 group-hover:fill-(--spot-color) motion-reduce:transition-none"
                  />
                </div>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px -z-10 bg-[radial-gradient(600px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),var(--spot-color),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="grid size-11 place-items-center rounded-sm border border-line bg-surface shadow-sm">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
            </article>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
