import { ChevronDown } from "lucide-react";
import { PageMascot } from "@/components/ui/PageMascot";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { faqs } from "@/data/portfolio";

export function Faq() {
  return (
    <Section id="faq">
      <SectionHeading
        id="faq"
        title="Ask Me"
        highlight="Anything"
        align="center"
        description="Straight answers to the questions recruiters and interviewers ask me most."
        mascot={<PageMascot size={116} />}
        mascotPlacement="top"
      />
      <Reveal as="ul" className="mx-auto flex max-w-3xl flex-col gap-3">
        {faqs.map(({ question, answer }) => (
          <RevealItem as="li" key={question}>
            <details className="group rounded-md border border-line bg-surface-raised shadow-soft transition-[border-color,box-shadow] duration-300 hover:border-line-strong open:shadow-md">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left font-semibold sm:p-6 [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-fg-muted transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-fg-muted text-pretty sm:px-6 sm:pb-6">{answer}</p>
            </details>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
