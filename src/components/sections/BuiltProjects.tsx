import { ThreeDRotatingCarousel } from "@/components/lightswind-pro/3d-rotating-carousel";
import { PageMascot } from "@/components/ui/PageMascot";
import { Section, SectionHeading } from "@/components/ui/Section";
import courseVaultMockup from "@/assets/projects/coursevault-device-mockup.webp";

const builtProjectItems = [
  {
    id: "coursevault",
    title: "CourseVault",
    description: "Native desktop app that downloads owned courses, organizes a local library, tracks progress, and keeps media searchable and encrypted.",
    tags: ["Electron", "React", "TypeScript"],
    href: "https://github.com/Rajkumar-Sony/CourseVault",
    image: courseVaultMockup,
  },
  {
    id: "coming-soon-1",
    title: "Coming soon",
    description: "Reserved for the next personal project case study.",
    tags: ["Coming soon"],
  },
  {
    id: "coming-soon-2",
    title: "Coming soon",
    description: "Another blank slot for a future app or tool.",
    tags: ["Coming soon"],
  },
];

export function BuiltProjects() {
  return (
    <Section id="built-projects">
      <SectionHeading
        id="built-projects"
        title="Projects I"
        highlight="Built"
        description="Personal apps, tools, and experiments I designed and built outside company project work."
        mascot={<PageMascot />}
        mascotPlacement="right"
      />
      <ThreeDRotatingCarousel items={builtProjectItems} autoRotate={false} />
    </Section>
  );
}
