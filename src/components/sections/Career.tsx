import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { BulletTrain, type TrainDirection } from "@/components/sections/BulletTrain";
import { Section, SectionHeading } from "@/components/ui/Section";
import { career, type CareerEntry } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";

function TimelineItem({ entry, index }: { entry: CareerEntry; index: number }) {
  const onLeft = index % 2 === 0;
  const Icon = entry.icon;

  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] md:grid-cols-[1fr_4rem_1fr]">
      <motion.span
        aria-hidden
        initial={{ scale: 0.6, opacity: 0.4 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ margin: "0px 0px -35% 0px" }}
        transition={{ duration: 0.3 }}
        className="col-start-1 row-start-1 mt-7 grid size-5 place-self-start justify-self-center place-items-center rounded-full border-2 border-fg bg-surface shadow-[0_0_0_6px_var(--surface)] md:col-start-2"
      >
        <span className="bg-gradient-accent size-2 rounded-full" />
      </motion.span>

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
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight">{entry.title}</h3>
        <p className="text-sm text-fg-muted">{entry.company}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">{entry.description}</p>
      </motion.article>
    </li>
  );
}

export function Career() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const trackHeight = useTransform(progress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);
  const velocity = useVelocity(scrollYProgress);
  const speed = useSpring(
    useTransform(velocity, (v) => Math.min(Math.abs(v) * 4, 1)),
    { stiffness: 200, damping: 30 },
  );
  const [direction, setDirection] = useState<TrainDirection>("down");
  useMotionValueEvent(velocity, "change", (v) => {
    if (Math.abs(v) > 0.02) setDirection(v > 0 ? "down" : "up");
  });

  return (
    <Section id="career" className="overflow-x-clip">
      <SectionHeading
        id="career"
        title="Career Journey"
        align="center"
        description="An evolving path of leadership, innovation, and impact"
      />
      <ol ref={listRef} className="relative flex flex-col gap-10 md:gap-16">
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
          className="pointer-events-none absolute top-0 bottom-0 left-5 z-10 w-16 -translate-x-1/2 overflow-hidden md:left-1/2"
        >
          <motion.span style={{ height: trackHeight }} className="absolute top-0 left-1/2">
            <BulletTrain speed={speed} direction={direction} />
          </motion.span>
        </span>
        {career.map((entry, index) => (
          <TimelineItem key={entry.period} entry={entry} index={index} />
        ))}
      </ol>
    </Section>
  );
}
