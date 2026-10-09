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
  className?: string;
};

export function SectionHeading({
  id,
  title,
  highlight,
  description,
  align = "left",
  icon: Icon,
  className,
}: SectionHeadingProps) {
  return (
    <motion.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "mb-10 flex flex-col gap-3 md:mb-14",
        align === "center" && "items-center text-center",
        className,
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
    </motion.header>
  );
}
