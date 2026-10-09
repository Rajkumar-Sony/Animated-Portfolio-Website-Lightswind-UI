import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { buttonStyles } from "@/lib/buttonStyles";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { profile } from "@/data/portfolio";
import { fadeUp, stagger } from "@/lib/motion";
import { IdCard } from "./IdCard";
import { SkyScene } from "./SkyScene";
import { TechMarquee } from "./TechMarquee";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden pt-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-gradient-accent absolute top-24 -left-40 size-[28rem] rounded-full opacity-15 blur-3xl dark:opacity-10" />
        <div className="bg-gradient-accent absolute -right-32 bottom-24 size-[24rem] rounded-full opacity-10 blur-3xl" />
        <SkyScene />
      </div>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-14 px-5 pb-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <motion.div variants={stagger(0.1, 0.15)} initial="hidden" animate="visible" className="flex flex-col items-start">
          {profile.available && (
            <motion.p
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-xs text-fg-muted shadow-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Available for work
            </motion.p>
          )}

          <h1 id="hero-title" data-sky-clear className="text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl">
            <motion.span variants={fadeUp} className="block">
              Hi, I&apos;m
            </motion.span>
            <motion.span variants={fadeUp} className="text-gradient block pb-2">
              {profile.name}
            </motion.span>
          </h1>

          <motion.p variants={fadeUp} data-sky-clear className="mt-5 max-w-md text-lg leading-relaxed text-fg-muted text-pretty">
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className={buttonStyles("primary", "group")}>
              View Work
              <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>
            <a href={profile.resumeUrl} download className={buttonStyles("secondary")}>
              Resume
              <Download aria-hidden className="size-4" />
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 -ml-3">
            <SocialLinks />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 12, delay: 0.35 }}
          className="flex justify-center lg:justify-end"
        >
          <IdCard />
        </motion.div>
      </div>

      <TechMarquee />
    </section>
  );
}
