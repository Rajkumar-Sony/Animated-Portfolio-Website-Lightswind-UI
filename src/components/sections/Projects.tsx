import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

/** Bento rhythm: wide/narrow on desktop; mobile and tablet stay sequential. */
const spans = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3"];

function ProjectCard({ project, onOpen, className }: { project: Project; onOpen: () => void; className?: string }) {
  return (
    <div
      className={cn(
        "group relative isolate flex h-72 overflow-hidden rounded-md bg-neutral-900 shadow-lg sm:h-80 md:h-72 lg:h-80",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-focus",
        className,
      )}
    >
      <img
        src={project.image.src}
        srcSet={project.image.srcSet}
        sizes="(min-width: 768px) 60vw, 100vw"
        alt={project.image.alt}
        loading="lazy"
        decoding="async"
        width={1200}
        height={800}
        className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-has-[:focus-visible]:scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="mt-auto flex w-full items-end justify-between gap-4 p-5 text-white sm:p-6">
        <div>
          <ul className="mb-3 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-2xs font-medium backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={onOpen}
              className="cursor-pointer text-left after:absolute after:inset-0 focus-visible:outline-none"
            >
              {project.title}
              <span className="sr-only"> — open case study</span>
            </button>
          </h3>
          <p className="mt-1 text-sm text-white/80">{project.summary}</p>
        </div>
        <span
          aria-hidden
          className="pointer-events-none grid size-11 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-neutral-950 group-has-[:focus-visible]:rotate-45 group-has-[:focus-visible]:bg-white group-has-[:focus-visible]:text-neutral-950"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </div>
  );
}

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        title="Selected"
        highlight="Works"
        description="SaaS products and enterprise systems where I built the backend. Open a project to see the problem, my role, how it works and the results."
      />
      <Reveal as="ul" className="grid gap-4 lg:grid-cols-5">
        {projects.map((project, i) => (
          <RevealItem as="li" key={project.title} className={spans[i % spans.length]}>
            <ProjectCard project={project} onOpen={() => setActive(project)} />
          </RevealItem>
        ))}
      </Reveal>
      <ProjectCaseStudy project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
