import { useRef, useState, type Ref } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { BulletTrain, type TrainDirection } from "@/components/sections/BulletTrain";
import { Departure } from "@/components/sections/Departure";
import { NextStop } from "@/components/sections/NextStop";
import { Station } from "@/components/sections/Station";
import { PageMascot } from "@/components/ui/PageMascot";
import { Section, SectionHeading } from "@/components/ui/Section";
import { career, type CareerEntry } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { TUNNEL_DEPTH, TUNNEL_REST, stationCode } from "@/lib/station";

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

function TimelineItem({
  entry,
  index,
  arrived,
  current,
  stationRef,
}: {
  entry: CareerEntry;
  index: number;
  arrived: boolean;
  current: boolean;
  stationRef: Ref<HTMLSpanElement>;
}) {
  const onLeft = index % 2 === 0;
  const Icon = entry.icon;

  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] md:grid-cols-[1fr_4rem_1fr]">
      <Station
        ref={stationRef}
        number={index + 1}
        arrived={arrived}
        current={current}
        className="col-start-1 row-start-1 mt-6 justify-self-center md:col-start-2"
      />

      <motion.article
        initial={{ opacity: 0, x: onLeft ? -32 : 32 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: easeOut }}
        className={cn(
          "col-start-2 row-start-1 rounded-sm border border-line bg-surface-raised p-5 shadow-md transition-shadow duration-300 hover:shadow-lg sm:p-6",
          onLeft ? "md:col-start-1" : "md:col-start-3",
        )}
      >
        <p className="flex items-center gap-2 text-xs font-semibold">
          <Icon aria-hidden className="size-3.5" />
          <time>{entry.period}</time>
          <span className="ml-auto font-mono text-2xs font-normal tracking-[0.14em] text-fg-muted">
            {stationCode(index + 1)}
          </span>
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight">{entry.title}</h3>
        <p className="text-sm text-fg-muted">{entry.company}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{entry.description}</p>
        {entry.roles && (
          <ol className="mt-4 flex flex-col gap-3 border-t border-line pt-4">
            {entry.roles.map((role) => (
              <li key={role.period} className="relative pl-4">
                <span aria-hidden className="bg-gradient-accent absolute top-1.5 left-0 size-1.5 rounded-full" />
                <p className="text-sm font-semibold">{role.title}</p>
                <p className="text-xs text-fg-muted">
                  <time>{role.period}</time>
                  {role.note && <> · {role.note}</>}
                </p>
              </li>
            ))}
          </ol>
        )}
      </motion.article>
    </li>
  );
}

export function Career() {
  const listRef = useRef<HTMLOListElement>(null);
  const stationRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const trackHeight = useTransform(progress, (v) => `${clamp01(v) * 100}%`);
  // The train's clip reaches TUNNEL_DEPTH up into the departure tunnel; its nose starts TUNNEL_REST inside.
  const waitInset = TUNNEL_DEPTH - TUNNEL_REST;
  const trainHeight = useTransform(progress, (v) => `calc(${waitInset}px + ${clamp01(v)} * (100% - ${waitInset}px))`);
  const velocity = useVelocity(scrollYProgress);
  const speed = useSpring(
    useTransform(velocity, (v) => Math.min(Math.abs(v) * 4, 1)),
    { stiffness: 200, damping: 30 },
  );
  const [direction, setDirection] = useState<TrainDirection>("down");
  useMotionValueEvent(velocity, "change", (v) => {
    if (Math.abs(v) > 0.02) setDirection(v > 0 ? "down" : "up");
  });

  // Stations the train's nose has passed, so their platforms light up as it pulls in.
  const [reached, setReached] = useState(0);
  const [departed, setDeparted] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    setDeparted(v > 0.002);
    const list = listRef.current;
    if (!list) return;
    const listTop = list.getBoundingClientRect().top;
    const nose = clamp01(v) * (list.offsetHeight + TUNNEL_REST) - TUNNEL_REST;
    setReached(
      stationRefs.current.filter((station) => {
        if (!station) return false;
        const { top, height } = station.getBoundingClientRect();
        return top + height / 2 - listTop <= nose;
      }).length,
    );
  });

  return (
    <Section id="career" className="overflow-x-clip">
      <SectionHeading
        id="career"
        title="Career"
        highlight="Journey"
        align="center"
        description="From Bangalore to Osaka: building and running Java backends in production"
        mascot={<PageMascot size={116} />}
        mascotPlacement="top"
      />
      <Departure departed={departed} since={career[0].period.split(" – ")[0]} />
      <ol ref={listRef} className="relative flex flex-col gap-10 pt-10 md:gap-16 md:pt-12">
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-5 w-[11px] -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,var(--line-strong)_0_2px,transparent_2px_9px)] md:left-1/2"
        />
        <span aria-hidden className="absolute top-0 bottom-0 left-5 w-[3px] -translate-x-1/2 bg-line-strong md:left-1/2" />
        <motion.span
          aria-hidden
          style={{ height: trackHeight }}
          className="bg-gradient-accent absolute top-0 left-5 w-[3px] -translate-x-1/2 rounded-b-full md:left-1/2"
        />
        <span
          aria-hidden
          style={{ top: -TUNNEL_DEPTH }}
          className="pointer-events-none absolute bottom-0 left-5 z-10 w-16 -translate-x-1/2 overflow-hidden md:left-1/2"
        >
          <motion.span style={{ height: trainHeight }} className="absolute top-0 left-1/2">
            <BulletTrain speed={speed} direction={direction} />
          </motion.span>
        </span>
        {career.map((entry, index) => (
          <TimelineItem
            key={entry.period}
            entry={entry}
            index={index}
            arrived={index < reached}
            current={index === career.length - 1}
            stationRef={(el) => {
              stationRefs.current[index] = el;
            }}
          />
        ))}
      </ol>
      <NextStop number={career.length + 1} onLeft={career.length % 2 === 0} />
    </Section>
  );
}
