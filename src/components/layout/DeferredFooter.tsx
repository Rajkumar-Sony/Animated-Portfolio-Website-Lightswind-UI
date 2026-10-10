import { lazy, Suspense, useRef } from "react";
import { useInView } from "framer-motion";

const Footer = lazy(() => import("./Footer").then((module) => ({ default: module.Footer })));

export function DeferredFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "800px 0px", once: true });

  return (
    <div ref={ref} data-footer-deferred>
      {inView ? (
        <Suspense fallback={<div className="h-40" />}>
          <Footer />
        </Suspense>
      ) : (
        <div className="h-40" />
      )}
    </div>
  );
}
