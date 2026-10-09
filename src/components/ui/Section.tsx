import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { SectionId } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { fadeUp, stagger } from "@/lib/motion";

type SectionProps = ComponentPropsWithoutRef<"section"> & { id: SectionId };

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("mx-auto w-full max-w-5xl px-5 py-20 sm:px-6 md:py-28", className)}
      {...props}
    >
      {children}
    </section>
  );
}

type SectionHeadingProps = {
  id: SectionId;
  title: string;
  highlight?: string;
  description?: ReactNode;
  align?: "left" | "center";
  icon?: LucideIcon;
  mascot?: ReactNode;
  mascotPlacement?: "right" | "top";
  className?: string;
};

export function SectionHeading({
  id,
  title,
  highlight,
  description,
  align = "left",
  icon: Icon,
  mascot,
  mascotPlacement = "right",
  className,
}: SectionHeadingProps) {
  const headingContent = (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        mascotPlacement === "right" && mascot && "min-w-0",
      )}
    >
      <motion.h2
        variants={fadeUp}
        id={`${id}-title`}
        className="flex items-center gap-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl"
      >
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-line bg-surface-raised shadow-sm">
            <Icon aria-hidden className="size-5" />
          </span>
        )}
        <span>
          {title} {highlight && <span className="text-gradient">{highlight}</span>}
        </span>
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={cn("max-w-xl text-fg-muted text-pretty", align === "center" && "mx-auto")}
        >
          {description}
        </motion.p>
      )}
    </div>
  );

  return (
    <motion.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "mb-10 md:mb-14",
        mascotPlacement === "right" && mascot
          ? "grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_auto]"
          : "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {mascotPlacement === "top" && mascot && (
        <motion.div variants={fadeUp} className="mb-1 flex justify-center">
          {mascot}
        </motion.div>
      )}
      {headingContent}
      {mascotPlacement === "right" && mascot && (
        <motion.div variants={fadeUp} className="hidden justify-self-end sm:block">
          {mascot}
        </motion.div>
      )}
    </motion.header>
  );
}
