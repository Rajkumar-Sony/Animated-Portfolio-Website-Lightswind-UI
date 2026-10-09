import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  staggerChildren?: number;
};

/** Reveals its `RevealItem` children one after another when scrolled into view. */
export function Reveal({ children, className, as = "div", staggerChildren = 0.08 }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={stagger(staggerChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = { children: ReactNode; className?: string; as?: "div" | "li" | "article" };

export function RevealItem({ children, className, as = "div" }: RevealItemProps) {
  const Component = motion[as];
  return (
    <Component variants={fadeUp} className={className}>
      {children}
    </Component>
  );
}
