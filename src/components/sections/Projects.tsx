import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { projects, type Project } from "@/data/portfolio";
import { cn } from "@/lib/cn";

/** Bento rhythm: wide/narrow on the first row, narrow/wide on the second. */
const spans = ["md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-3"];

function ProjectCard({ project, className }: { project: Project; className?: string }) {
  return (
    <a
      href={project.href}
      className={cn(
        "group relative flex aspect-[4/3] overflow-hidden rounded-md bg-neutral-900 shadow-lg md:aspect-auto md:h-80",
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
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 text-white sm:p-6">
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
          <h3 className="text-xl font-bold tracking-tight sm:text-2xl">{project.title}</h3>
          <p className="mt-1 text-sm text-white/80">{project.summary}</p>
        </div>
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-neutral-950"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </a>
  );
}

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        title="Selected"
        highlight="Works"
        description="A showcase of complex systems, elegant interfaces, and scalable applications I've engineered."
      />
      <Reveal as="ul" className="grid gap-4 md:grid-cols-5">
        {projects.map((project, i) => (
          <RevealItem as="li" key={project.title} className={spans[i % spans.length]}>
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
