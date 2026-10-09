import { motion } from "framer-motion";
import {
  Brain,
  Building2,
  Calendar,
  CircleCheck,
  CodeXml,
  Crown,
  Handshake,
  Lightbulb,
  Medal,
  Puzzle,
  Rocket,
  Server,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import ScrollStack, { type ScrollStackCard } from "@/components/lightswind-pro/scroll-stack";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { education, skills } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";

type Tone = (typeof skills.traits)[number]["tone"];

const traitStyles: Record<Tone, { className: string; icon: LucideIcon }> = {
  amber: { className: "border-amber-300/60 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200", icon: Crown },
  violet: { className: "border-violet-300/60 bg-violet-50 text-violet-800 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-200", icon: Puzzle },
  sky: { className: "border-sky-300/60 bg-sky-50 text-sky-800 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200", icon: Workflow },
  rose: { className: "border-rose-300/60 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200", icon: Medal },
  yellow: { className: "border-yellow-300/70 bg-yellow-50 text-yellow-800 dark:border-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-200", icon: Lightbulb },
  emerald: { className: "border-emerald-300/60 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200", icon: Handshake },
};

const skillIcons: LucideIcon[] = [CodeXml, Server, Sparkles, Building2, Rocket];

function DegreeContent({ item }: { item: (typeof education)[number] }) {
  const Icon = item.icon;
  return (
    <div className="w-full pr-10 text-white sm:pr-12">
      <span className="grid size-10 place-items-center rounded-sm border border-white/25 bg-white/15 backdrop-blur-md">
        <Icon aria-hidden className="size-5" />
      </span>
      <h3 className="mt-4 text-2xl leading-tight font-bold tracking-tight sm:text-3xl">{item.degree}</h3>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/80">
        <span className="inline-flex items-center gap-1.5">
          <Building2 aria-hidden className="size-3.5" />
          {item.school}
        </span>
        <span aria-hidden>•</span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar aria-hidden className="size-3.5" />
          <time>{item.period}</time>
        </span>
      </p>
      <ul className="mt-4 grid gap-x-6 gap-y-2 border-t border-white/20 pt-4 sm:grid-cols-2">
        {item.highlights.map((point) => (
          <li key={point} className="flex gap-2.5 text-xs leading-relaxed text-white/85 sm:text-sm">
            <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-white" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

const degreeCards: ScrollStackCard[] = education.map((item) => ({
  title: item.degree,
  badge: item.badge.label,
  backgroundImage: item.image,
  content: <DegreeContent item={item} />,
}));

function SkillBar({ name, level, icon: Icon }: { name: string; level: number; icon: LucideIcon }) {
  return (
    <li>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5 text-sm font-medium">
          <span className="grid size-7 place-items-center rounded-xs border border-line bg-surface-sunken">
            <Icon aria-hidden className="size-3.5" />
          </span>
          {name}
        </span>
        <span className="rounded-full border border-line px-2 py-0.5 text-2xs font-bold tabular-nums">{level}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={name}
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-sunken"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: level / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: easeOut }}
          className="bg-gradient-accent h-full origin-left rounded-full"
        />
      </div>
    </li>
  );
}

export function Education() {
  return (
    <Section id="education">
      <SectionHeading
        id="education"
        icon={Brain}
        title="Academic"
        highlight="Background"
        description="Building the theoretical foundation and research methodologies that empower high-performance practical engineering."
      />
      <ScrollStack cards={degreeCards} cardHeight={440} />

      <div className="mt-20">
        <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xs border border-line bg-surface-raised shadow-sm">
            <CodeXml aria-hidden className="size-4" />
          </span>
          Expertise &amp; Skills
        </h3>
        <Reveal className="grid gap-5 md:grid-cols-2">
          <RevealItem className="rounded-md border border-line bg-surface-raised p-6 shadow-soft sm:p-7">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h4 className="flex items-center gap-2 font-bold">
                <Server aria-hidden className="size-4" /> Technical Arsenal
              </h4>
              <span className="rounded-full border border-line px-2.5 py-1 text-2xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
                Proficiency
              </span>
            </div>
            <ul className="mt-5 flex flex-col gap-5">
              {skills.technical.map((skill, i) => (
                <SkillBar key={skill.name} {...skill} icon={skillIcons[i % skillIcons.length]} />
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="flex flex-col rounded-md border border-line bg-surface-raised p-6 shadow-soft sm:p-7">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h4 className="flex items-center gap-2 font-bold">
                <Sparkles aria-hidden className="size-4" /> Professional Traits
              </h4>
              <span className="rounded-full border border-line px-2.5 py-1 text-2xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
                Core competencies
              </span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {skills.traits.map(({ name, tone }) => {
                const { className, icon: TraitIcon } = traitStyles[tone];
                return (
                  <li
                    key={name}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-transform duration-150 hover:-translate-y-0.5",
                      className,
                    )}
                  >
                    <TraitIcon aria-hidden className="size-3.5" />
                    {name}
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-6">
              <div className="relative overflow-hidden rounded-sm border border-line bg-surface-sunken p-5">
                <div aria-hidden className="bg-gradient-accent absolute inset-y-0 left-0 w-1" />
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Rocket aria-hidden className="size-4" />
                  {skills.learner.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{skills.learner.body}</p>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
}
