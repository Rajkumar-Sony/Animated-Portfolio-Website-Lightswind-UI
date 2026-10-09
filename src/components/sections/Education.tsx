import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  ChevronDown,
  CircleCheck,
  CodeXml,
  Crown,
  ExternalLink,
  Handshake,
  Lightbulb,
  Medal,
  Puzzle,
  Rocket,
  Server,
  Sparkles,
  Star,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import ScrollStack, { type ScrollStackCard } from "@/components/lightswind-pro/scroll-stack";
import { GridPattern } from "@/components/ui/GridPattern";
import { PageMascot } from "@/components/ui/PageMascot";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  certificationGroups,
  education,
  skills,
  type Certification,
  type CertificationGroup,
} from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";

type Tone = (typeof skills.traits)[number]["tone"];

const traitStyles: Record<Tone, { chip: string; tile: string; icon: LucideIcon }> = {
  amber: { chip: "hover:border-amber-400/40 hover:shadow-amber-500/10", tile: "bg-amber-400/10 text-amber-600 dark:text-amber-300", icon: Crown },
  violet: { chip: "hover:border-violet-400/40 hover:shadow-violet-500/10", tile: "bg-violet-400/10 text-violet-600 dark:text-violet-300", icon: Puzzle },
  sky: { chip: "hover:border-sky-400/40 hover:shadow-sky-500/10", tile: "bg-sky-400/10 text-sky-600 dark:text-sky-300", icon: Workflow },
  rose: { chip: "hover:border-rose-400/40 hover:shadow-rose-500/10", tile: "bg-rose-400/10 text-rose-600 dark:text-rose-300", icon: Medal },
  yellow: { chip: "hover:border-yellow-400/40 hover:shadow-yellow-500/10", tile: "bg-yellow-400/10 text-yellow-600 dark:text-yellow-300", icon: Lightbulb },
  emerald: { chip: "hover:border-emerald-400/40 hover:shadow-emerald-500/10", tile: "bg-emerald-400/10 text-emerald-600 dark:text-emerald-300", icon: Handshake },
};

const skillIcons: LucideIcon[] = [CodeXml, Server, Sparkles, Building2, Rocket];

/** Shaded cells for the learner card's GridPattern backdrop (column, row). */
const LEARNER_GRID_SQUARES: ReadonlyArray<readonly [number, number]> = [
  [7, 1],
  [9, 3],
  [6, 2],
  [11, 4],
  [8, 5],
];

function DegreeContent({ item }: { item: (typeof education)[number] }) {
  const Icon = item.icon;
  return (
    <div className="w-full pr-10 text-white sm:pr-12">
      <span className="grid size-10 place-items-center rounded-sm border border-white/25 bg-white/15 backdrop-blur-md">
        <Icon aria-hidden className="size-5" />
      </span>
      <h3 className="mt-4 text-2xl leading-tight font-bold tracking-tight sm:text-3xl">{item.degree}</h3>
      <div className="mt-2 flex flex-col gap-1 text-xs font-medium text-white/80">
        <p className="flex items-center gap-1.5">
          <Building2 aria-hidden className="size-3.5" />
          <span className="text-white/60">College:</span>
          <span>{item.college}</span>
        </p>
        <p>
          <span className="text-white/60">University:</span> {item.university}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>{item.location}</span>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar aria-hidden className="size-3.5" />
            <time>{item.period}</time>
          </span>
        </p>
      </div>
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

function CertificationRow({ cert }: { cert: Certification }) {
  const body = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-xs border border-line bg-surface-sunken">
        <BadgeCheck aria-hidden className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-sm leading-snug font-semibold">{cert.name}</span>
        <span className="text-xs text-fg-muted">
          {cert.issuer}
          {cert.issued && <span className="sm:hidden"> · Issued {cert.issued}</span>}
        </span>
        {cert.credentialId && (
          <span className="truncate font-mono text-2xs text-fg-muted">ID {cert.credentialId}</span>
        )}
      </span>
      {cert.issued && (
        <time className="hidden shrink-0 pt-0.5 text-xs font-medium whitespace-nowrap text-fg-muted tabular-nums sm:block">
          {cert.issued}
        </time>
      )}
      <span className="grid w-4 shrink-0 pt-0.5">
        {cert.url && <ExternalLink aria-hidden className="size-4 text-fg-muted" />}
      </span>
    </>
  );
  const className = "flex items-start gap-3 rounded-sm px-3 py-3.5 transition-colors duration-150";

  return cert.url ? (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${cert.name}, ${cert.issuer}: see credential (opens in a new tab)`}
      className={cn(className, "hover:bg-surface-sunken")}
    >
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}

function yearRange(items: Certification[]) {
  const years = items.flatMap((item) => (item.issued ? [item.issued.slice(-4)] : []));
  if (years.length === 0) return null;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first} – ${last}`;
}

function CertificationGroupPanel({ group }: { group: CertificationGroup }) {
  const Icon = group.icon;
  const { items, badges } = group;
  const range = yearRange(items);
  const noun = group.itemNoun ?? "certificate";
  const summary = [
    `${items.length} ${noun}${items.length === 1 ? "" : "s"}`,
    badges && `${badges.length} skill badges`,
    range,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <details className="group rounded-md border border-line bg-surface-raised shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-line-strong open:shadow-md">
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-line bg-surface-sunken">
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-semibold">{group.label}</span>
          <span className="text-xs text-fg-muted">{summary}</span>
        </span>
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-fg-muted transition-transform duration-300 group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-line p-5 sm:p-6">
        <ul className="-mx-3 flex flex-col divide-y divide-line">
          {items.map((cert) => (
            <li key={cert.name}>
              <CertificationRow cert={cert} />
            </li>
          ))}
        </ul>

        {badges && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="flex items-center gap-2 text-sm font-bold">
                <Star aria-hidden className="size-4" /> Skill badges
              </h4>
              {group.badgesUrl && (
                <a
                  href={group.badgesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-fg-muted hover:text-fg"
                >
                  View profile <ExternalLink aria-hidden className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {badges.map((badge) => (
                <li key={badge.name} className="rounded-sm border border-line bg-surface-sunken p-4">
                  <p className="text-sm font-semibold">{badge.name}</p>
                  <p role="img" aria-label={`${badge.stars} of 5 stars`} className="mt-1.5 flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden
                        className={cn(
                          "size-3.5",
                          i < badge.stars ? "fill-amber-400 text-amber-400" : "text-fg-subtle",
                        )}
                      />
                    ))}
                  </p>
                  <p className="mt-1.5 text-2xs text-fg-muted">{badge.solved} challenges solved</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}

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
      <ScrollStack
        cards={degreeCards}
        cardHeight={440}
        header={
          <SectionHeading
            id="education"
            title="Academic"
            highlight="Background"
            description="The computer applications degrees behind my Java backend work, plus the skills I use every day."
            mascot={<PageMascot />}
            mascotPlacement="right"
          />
        }
      />

      <div className="mt-20">
        <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xs border border-line bg-surface-raised shadow-sm">
            <Award aria-hidden className="size-4" />
          </span>
          Licenses &amp; Certifications
        </h3>
        <Reveal as="ul" className="flex flex-col gap-3" staggerChildren={0.05}>
          {certificationGroups.map((group) => (
            <RevealItem key={group.id} as="li">
              <CertificationGroupPanel group={group} />
            </RevealItem>
          ))}
        </Reveal>
      </div>

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
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {skills.traits.map(({ name, tone }) => {
                const { chip, tile, icon: TraitIcon } = traitStyles[tone];
                return (
                  <li
                    key={name}
                    className={cn(
                      "group/chip inline-flex items-center gap-2 rounded-full border border-line bg-surface-sunken py-1.5 pr-3.5 pl-1.5 text-xs font-semibold text-fg transition-all duration-200 ease-out",
                      "hover:-translate-y-0.5 hover:bg-surface-raised hover:shadow-lg",
                      chip,
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full transition-transform duration-200 ease-out group-hover/chip:scale-110",
                        tile,
                      )}
                    >
                      <TraitIcon aria-hidden className="size-3" />
                    </span>
                    {name}
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-6">
              <div className="relative isolate overflow-hidden rounded-sm border border-line bg-surface-raised p-5 shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-md">
                <div
                  aria-hidden
                  className="bg-gradient-accent absolute inset-y-0 left-0 z-10 w-[3px] animate-[learner-accent-flow_8s_ease-in-out_infinite]"
                  style={{ backgroundSize: "300% 100%" }}
                />
                <div aria-hidden className="pointer-events-none absolute -inset-7 -z-10">
                  <div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent)]">
                    <motion.div
                      className="absolute inset-0"
                      animate={{ y: [0, -30, 0] }}
                      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <GridPattern
                        squares={LEARNER_GRID_SQUARES}
                        className="fill-accent-to/15 stroke-accent-to/25"
                      />
                    </motion.div>
                  </div>
                </div>
                <p className="relative flex items-center gap-2.5 text-sm font-bold">
                  <span className="bg-gradient-accent grid size-7 shrink-0 place-items-center rounded-full shadow-sm">
                    <Rocket aria-hidden className="size-3.5 text-white dark:text-black" />
                  </span>
                  {skills.learner.title}
                </p>
                <p className="relative mt-2.5 text-sm leading-relaxed text-fg-muted">{skills.learner.body}</p>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </Section>
  );
}
