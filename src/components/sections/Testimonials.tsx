import { Quote } from "lucide-react";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { testimonials } from "@/data/portfolio";

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        id="testimonials"
        title="Client"
        highlight="Testimonials"
        align="center"
        description="Feedback from talented leaders I've had the pleasure of partnering with throughout my career."
      />
      <Reveal as="ul" className="grid gap-4 md:grid-cols-3">
        {testimonials.map(({ quote, name, role }) => (
          <RevealItem as="li" key={name}>
            <figure className="flex h-full flex-col rounded-md border border-line bg-surface-raised p-6 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
              <Quote aria-hidden className="size-6 self-end fill-fg text-fg" />
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted italic">
                <p>&ldquo;{quote}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="bg-gradient-accent grid size-10 place-items-center rounded-full text-xs font-bold text-white shadow-sm dark:text-neutral-950"
                >
                  {initialsOf(name)}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold">{name}</span>
                  <span className="text-xs text-fg-muted">{role}</span>
                </span>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
