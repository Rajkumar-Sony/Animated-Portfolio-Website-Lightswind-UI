import { Cloud } from "lucide-react";
import { techStack, type Tech } from "@/data/portfolio";
import { cn } from "@/lib/cn";

function TechChip({ tech }: { tech: Tech }) {
  const src = tech.src ?? (tech.slug ? `https://cdn.simpleicons.org/${tech.slug}` : undefined);

  return (
    <li className="flex shrink-0 items-center gap-2.5 rounded-full border border-line bg-surface-raised px-5 py-2.5 text-sm font-medium shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {src ? (
        <img
          src={src}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          decoding="async"
          className={cn("size-5 object-contain", tech.mono && "dark:invert")}
        />
      ) : (
        <Cloud aria-hidden className="size-5 text-fg-muted" />
      )}
      {tech.name}
    </li>
  );
}

export function TechMarquee() {
  return (
    <div className="group relative w-full border-y border-line bg-surface-subtle backdrop-blur-sm">
      <h2 className="sr-only">Technologies I work with</h2>
      <div className="mask-fade-x overflow-hidden py-4 motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <ul className="flex gap-6 pr-6">
            {techStack.map((tech) => (
              <TechChip key={tech.name} tech={tech} />
            ))}
          </ul>
          <ul className="flex gap-6 pr-6 motion-reduce:hidden" aria-hidden>
            {techStack.map((tech) => (
              <TechChip key={tech.name} tech={tech} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
