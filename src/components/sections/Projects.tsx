import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import ScrollStack, { type ScrollStackCard } from "@/components/lightswind-pro/scroll-stack";
import { PageMascot } from "@/components/ui/PageMascot";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

/** Bento rhythm for desktop; mobile/tablet use the one-card ScrollStack sequence. */
const spans = ["lg:col-span-3", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3"];

function ProjectStackContent({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <div className="group relative w-full text-white">
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={onOpen}
        className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        <span className="sr-only">Open {project.title} case study</span>
      </button>

      <div className="pointer-events-none flex items-end justify-between gap-4">
        <div className="max-w-3xl">
          <ul className="mb-4 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md sm:text-sm">
                {tag}
              </li>
            ))}
          </ul>
          <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">{project.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/82 sm:text-base">{project.summary}</p>
        </div>
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-full border border-white/30 bg-white/12 backdrop-blur-md transition-[transform,background-color,color] duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-neutral-950 group-has-[:focus-visible]:rotate-45 group-has-[:focus-visible]:bg-white group-has-[:focus-visible]:text-neutral-950 sm:size-14"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, className }: { project: Project; onOpen: () => void; className?: string }) {
  return (
    <div
      className={cn(
        "group relative isolate flex h-80 overflow-hidden rounded-md bg-neutral-900 shadow-lg",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-focus",
        className,
      )}
    >
      <img
        src={project.image.src}
        srcSet={project.image.srcSet}
        sizes="(min-width: 1024px) 60vw, 100vw"
        alt={project.image.alt}
        loading="lazy"
        decoding="async"
        width={1200}
        height={800}
        className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-has-[:focus-visible]:scale-105"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="mt-auto flex w-full items-end justify-between gap-4 p-6 text-white">
        <div>
          <ul className="mb-3 flex flex-wrap gap-1.5" aria-label={`${project.title} technologies`}>
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-2xs font-medium backdrop-blur-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
          <h3 className="text-2xl font-bold tracking-tight">
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
  const projectCards: ScrollStackCard[] = projects.map((project) => ({
    title: project.title,
    backgroundImage: project.image.src,
    content: <ProjectStackContent project={project} onOpen={() => setActive(project)} />,
  }));
  const heading = (
    <SectionHeading
      id="projects"
      title="Selected"
      highlight="Works"
      description="SaaS products and enterprise systems where I built the backend. Open a project to see the problem, my role, how it works and the results."
      mascot={<PageMascot />}
      mascotPlacement="right"
    />
  );

  return (
    <Section id="projects">
      <div className="lg:hidden">
        <ScrollStack cards={projectCards} cardHeight={360} scrollPerCard={260} header={heading} />
      </div>
      <div className="hidden lg:block">
        {heading}
        <Reveal as="ul" className="grid gap-4 lg:grid-cols-5">
          {projects.map((project, i) => (
            <RevealItem as="li" key={project.title} className={spans[i % spans.length]}>
              <ProjectCard project={project} onOpen={() => setActive(project)} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
      <ProjectCaseStudy project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
