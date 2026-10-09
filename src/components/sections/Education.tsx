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
