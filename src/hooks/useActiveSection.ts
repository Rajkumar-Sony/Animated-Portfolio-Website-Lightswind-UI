import { useEffect, useState } from "react";
import type { SectionId } from "@/data/portfolio";

/** Returns the section whose area crosses the upper third of the viewport. */
export function useActiveSection(ids: readonly SectionId[]) {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id as SectionId);
        }
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
