import type { ComponentType, ReactNode } from "react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { MotionConfig, useInView, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { DeferredFooter } from "@/components/layout/DeferredFooter";
import { Header } from "@/components/layout/Header";
import { SectionDock } from "@/components/layout/SectionDock";
import { Hero } from "@/components/sections/Hero";
import type { SectionId } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useMotionProfile } from "@/hooks/useMotionProfile";
import { useScrollState } from "@/hooks/useScrollState";

const loadAbout = () => import("@/components/sections/About").then((module) => ({ default: module.About }));
const loadServices = () => import("@/components/sections/Services").then((module) => ({ default: module.Services }));
const loadProjects = () => import("@/components/sections/Projects").then((module) => ({ default: module.Projects }));
const loadBuiltProjects = () =>
  import("@/components/sections/BuiltProjects").then((module) => ({ default: module.BuiltProjects }));
const loadCareer = () => import("@/components/sections/Career").then((module) => ({ default: module.Career }));
const loadEducation = () => import("@/components/sections/Education").then((module) => ({ default: module.Education }));
const loadFaq = () => import("@/components/sections/Faq").then((module) => ({ default: module.Faq }));
const loadContact = () => import("@/components/sections/Contact").then((module) => ({ default: module.Contact }));

const About = lazy(loadAbout);
const Services = lazy(loadServices);
const Projects = lazy(loadProjects);
const BuiltProjects = lazy(loadBuiltProjects);
const Career = lazy(loadCareer);
const Education = lazy(loadEducation);
const Faq = lazy(loadFaq);
const Contact = lazy(loadContact);

const deferredSectionPreloads = [
  loadAbout,
  loadServices,
  loadProjects,
  loadBuiltProjects,
  loadCareer,
  loadEducation,
  loadFaq,
  loadContact,
];

const SECTION_IDS: readonly SectionId[] = [
  "hero",
  "about",
  "services",
  "projects",
  "built-projects",
  "career",
  "education",
  "faq",
  "contact",
];

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      "input, textarea, select, [contenteditable=''], [contenteditable='true'], [data-allow-select]",
    ),
  );
}

function useContentProtection() {
  useEffect(() => {
    const preventCopy = (event: ClipboardEvent) => {
      if (!isEditableTarget(event.target)) event.preventDefault();
    };

    // Block right-click everywhere (mouse and touchpad both emit `contextmenu`),
    // except in editable fields so right-click → paste keeps working there.
    const preventContextMenu = (event: MouseEvent) => {
      if (!isEditableTarget(event.target)) event.preventDefault();
    };

    const preventProtectedImageAction = (event: Event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("img, picture, svg, canvas")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("dragstart", preventProtectedImageAction);
    document.addEventListener("contextmenu", preventContextMenu);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("dragstart", preventProtectedImageAction);
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);
}

function useDeferredSectionPreload() {
  useEffect(() => {
    let cancelled = false;
    const preload = () => {
      if (cancelled) return;
      void Promise.allSettled(deferredSectionPreloads.map((load) => load()));
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preload, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(preload, 1200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, []);
}

function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const { preferNativeScroll } = useMotionProfile();
  // Lenis fights iOS momentum scroll and breaks Framer scroll-linked motion → animations freeze.
  if (reduceMotion || preferNativeScroll) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -96 } }}>
      {children}
    </ReactLenis>
  );
}

function DeferredSection({ Component, minHeight = "80vh" }: { Component: ComponentType; minHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "900px 0px", once: true });

  return (
    <div ref={ref} style={{ minHeight }}>
      {inView ? (
        <Suspense fallback={<div style={{ minHeight }} />}>
          <Component />
        </Suspense>
      ) : null}
    </div>
  );
}

export default function App() {
  useContentProtection();
  useDeferredSectionPreload();
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
          <DeferredSection Component={About} />
          <DeferredSection Component={Services} />
          <DeferredSection Component={Projects} />
          <DeferredSection Component={BuiltProjects} />
          <DeferredSection Component={Career} />
          <DeferredSection Component={Education} />
          <DeferredSection Component={Faq} minHeight="48vh" />
          <DeferredSection Component={Contact} minHeight="72vh" />
        </main>
        <DeferredFooter />
        <SectionDock active={active} visible={pastHero} />
      </SmoothScroll>
    </MotionConfig>
  );
}
