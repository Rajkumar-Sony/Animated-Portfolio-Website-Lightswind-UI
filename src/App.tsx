import type { ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionDock } from "@/components/layout/SectionDock";
import { About } from "@/components/sections/About";
import { Career } from "@/components/sections/Career";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import type { SectionId } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollState } from "@/hooks/useScrollState";

const SECTION_IDS: readonly SectionId[] = [
  "hero",
  "about",
  "services",
  "projects",
  "career",
  "education",
  "testimonials",
  "contact",
];

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -96 } }}>
      {children}
    </ReactLenis>
  );
}

export default function App() {
  const active = useActiveSection(SECTION_IDS);
  const { y } = useScrollState();
  const pastHero = y > window.innerHeight * 0.6;

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-surface-inverse px-4 py-2 text-sm font-semibold text-fg-inverse focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <Header active={active} />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <About />
          <Services />
          <Projects />
          <Career />
          <Education />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <SectionDock active={active} visible={pastHero} />
      </SmoothScroll>
    </MotionConfig>
  );
}
