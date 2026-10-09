import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CircleCheck, MapPin, Users, X } from "lucide-react";
import type { Project } from "@/data/portfolio";

const labelStyles = "text-2xs font-semibold tracking-[0.14em] text-fg-muted uppercase";

function CaseStudyPanel({ project, titleId, onClose }: { project: Project; titleId: string; onClose: () => void }) {
  const { title, image, caseStudy } = project;

  return (
    <motion.article
      key={title}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="m-auto w-full max-w-2xl overflow-hidden rounded-md border border-line bg-surface-raised text-fg shadow-lg"
    >
      <header className="relative flex h-52 items-end overflow-hidden bg-neutral-900 sm:h-60">
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="(min-width: 672px) 672px, 100vw"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close case study"
          className="absolute top-3 right-3 grid size-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white hover:text-neutral-950"
        >
          <X aria-hidden className="size-5" />
        </button>
        <div className="relative p-6 text-white sm:p-8">
          <p className="text-2xs font-semibold tracking-[0.14em] text-white/75 uppercase">{caseStudy.context}</p>
          <h2 id={titleId} className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/80">
            <li className="flex items-center gap-1.5">
              <CalendarDays aria-hidden className="size-3.5" />
              {caseStudy.period}
            </li>
            <li className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5" />
              {caseStudy.location}
            </li>
            {caseStudy.team && (
              <li className="flex items-center gap-1.5">
                <Users aria-hidden className="size-3.5" />
                {caseStudy.team}
              </li>
            )}
          </ul>
        </div>
      </header>

      <div className="flex flex-col gap-8 p-6 sm:p-8">
        <section aria-label="Overview" className="flex flex-col gap-3">
          <p className="w-fit rounded-full border border-line bg-surface-sunken px-3 py-1 text-xs font-semibold">
            {caseStudy.role}
          </p>
          <p className="leading-relaxed text-fg-muted text-pretty">{caseStudy.problem}</p>
        </section>

        <section aria-labelledby={`${titleId}-outcomes`}>
          <h3 id={`${titleId}-outcomes`} className={labelStyles}>
            Outcomes
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {caseStudy.outcomes.map(({ value, label }) => (
              <li key={label} className="rounded-sm border border-line bg-surface-sunken p-4">
                <p className="text-gradient text-2xl font-bold tracking-tight">{value}</p>
                <p className="mt-1 text-xs text-fg-muted">{label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`${titleId}-responsibilities`}>
          <h3 id={`${titleId}-responsibilities`} className={labelStyles}>
            Roles & responsibilities
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {caseStudy.roles.map((role) => (
              <li key={role.period} className="rounded-sm border border-line bg-surface-sunken px-3 py-2">
                <p className="text-sm font-semibold">{role.title}</p>
                <p className="text-xs text-fg-muted">
                  <time>{role.period}</time>
                </p>
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-col gap-2.5">
            {caseStudy.responsibilities.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                <span aria-hidden className="bg-gradient-accent mt-2 size-1.5 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`${titleId}-architecture`}>
          <h3 id={`${titleId}-architecture`} className={labelStyles}>
            How it works
          </h3>
          <ol className="mt-4 flex flex-col">
            {caseStudy.architecture.map((step, i) => (
              <li key={step} className="relative flex gap-4 pb-5 last:pb-0">
                {i < caseStudy.architecture.length - 1 && (
                  <span aria-hidden className="absolute top-8 bottom-0 left-[15px] w-px bg-line" />
                )}
                <span className="bg-gradient-accent grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white dark:text-neutral-950">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby={`${titleId}-contributions`}>
          <h3 id={`${titleId}-contributions`} className={labelStyles}>
            What I built
          </h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {caseStudy.contributions.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-fg" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`${titleId}-stack`}>
          <h3 id={`${titleId}-stack`} className={labelStyles}>
            Tech stack
          </h3>
          <dl className="mt-3 flex flex-col gap-3">
            {caseStudy.stack.map(({ group, items }) => (
              <div key={group} className="grid gap-1.5 sm:grid-cols-[8rem_1fr] sm:items-baseline">
                <dt className="text-xs font-semibold">{group}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {items.map((tech) => (
                      <li key={tech} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </motion.article>
  );
}

export function ProjectCaseStudy({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      data-lenis-prevent
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="fixed inset-0 m-0 size-full max-h-none max-w-none overflow-y-auto overscroll-contain bg-transparent p-4 backdrop:bg-neutral-950/60 backdrop:backdrop-blur-sm open:flex sm:p-8"
    >
      {project && <CaseStudyPanel project={project} titleId={titleId} onClose={onClose} />}
    </dialog>
  );
}
