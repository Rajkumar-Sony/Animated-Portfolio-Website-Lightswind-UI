import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { about } from "@/data/portfolio";
import { fadeUp, stagger } from "@/lib/motion";

export function About() {
  const [lead, highlight] = about.headline;

  return (
    <Section id="about" className="grid items-center gap-12 md:grid-cols-2">
      <motion.div variants={stagger(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
        <motion.h2
          variants={fadeUp}
          id="about-title"
          className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl"
        >
          {lead} <span className="text-gradient">{highlight}</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-5 leading-relaxed text-fg-muted text-pretty">
          {about.body}
        </motion.p>
      </motion.div>

      <Reveal as="ul" className="grid grid-cols-2 gap-3 sm:gap-4">
        {about.stats.map(({ value, suffix, label, icon: Icon }) => (
          <RevealItem as="li" key={label}>
            <div className="group h-full rounded-md border border-line bg-surface-raised p-5 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-md sm:p-6">
              <span className="grid size-9 place-items-center rounded-xs border border-line text-fg transition-colors duration-300 group-hover:border-transparent group-hover:bg-surface-inverse group-hover:text-fg-inverse">
                <Icon aria-hidden className="size-4" />
              </span>
              <p className="mt-5 text-3xl font-bold tracking-tight">
                <CountUp to={value} suffix={suffix} />
              </p>
              <p className="mt-1 text-xs text-fg-muted">{label}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
