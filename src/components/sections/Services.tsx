import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { services } from "@/data/portfolio";

export function Services() {
  return (
    <Section id="services">
      <SectionHeading
        id="services"
        title="What I"
        highlight="Do"
        align="center"
        description="Delivering comprehensive digital solutions that cover the entire lifecycle of professional product engineering."
      />
      <Reveal as="ul" className="grid gap-4 sm:grid-cols-2">
        {services.map(({ title, description, icon: Icon }) => (
          <RevealItem as="li" key={title}>
            <article className="group relative h-full overflow-hidden rounded-md border border-line bg-surface-raised p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-lg sm:p-7">
              <div
                aria-hidden
                className="bg-gradient-accent absolute -top-24 -right-24 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20"
              />
              <span className="grid size-11 place-items-center rounded-sm border border-line bg-surface shadow-sm">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{description}</p>
            </article>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
