import { motion } from "framer-motion";
import { ArrowUp, Heart } from "lucide-react";
import { buttonStyles } from "@/lib/buttonStyles";
import GooeyText from "@/components/lightswind-pro/gooey-text";
import Meteors from "@/components/lightswind-pro/meteors";
import { Monogram } from "@/components/ui/Monogram";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { footer, footerNav, profile } from "@/data/portfolio";
import { fadeUp } from "@/lib/motion";
import { FooterScene } from "./FooterScene";

/** Width of the signature in Black Ops One at 0.01em tracking, in ems; sizes it to span the footer. */
const signatureWidthEm = 8.55;

export function Footer() {
  return (
    <footer className="@container relative isolate mt-10 overflow-hidden rounded-t-2xl border-t border-line bg-surface-raised shadow-soft">
      <Meteors
        number={20}
        speed={3}
        angle={-45}
        className="bottom-1/2 -z-10 [mask-image:linear-gradient(black_60%,transparent)]"
      />
      <FooterScene className="-z-10" />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-5 pt-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Monogram initials={profile.initials} />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{profile.name}</span>
              <span className="text-2xs tracking-[0.14em] text-fg-muted uppercase">{profile.role}</span>
            </span>
          </div>
          <a href="#hero" className={buttonStyles("secondary", "min-h-11 px-4 text-xs")}>
            Back to top <ArrowUp aria-hidden className="size-3.5" />
          </a>
        </div>

        <div className="flex flex-col items-center gap-4 rounded-md border border-line bg-surface px-6 py-10 text-center shadow-sm">
          <span className="rounded-full border border-line px-3 py-1 text-2xs font-bold tracking-[0.16em] uppercase">
            {footer.eyebrow}
          </span>
          <GooeyText
            words={footer.rotatingRoles}
            duration={2600}
            className="h-[1.2em] w-full text-2xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          />
        </div>

        <nav aria-label="Footer" className="border-y border-line py-5">
          <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
            {footerNav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-fg-muted transition-colors duration-150 hover:bg-surface-sunken hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <SocialLinks variant="pill" />
          <p className="flex items-center gap-1.5 text-xs font-medium text-fg">
            © {new Date().getFullYear()} {profile.name}. Crafted with
            <Heart aria-label="love" className="size-3.5 fill-rose-500 text-rose-500" />
            &amp; Lightswind UI
          </p>
        </div>
      </div>

      <div data-dock-boundary className="relative mt-24 sm:mt-28">
        <p className="sr-only">{footer.signature}</p>
        <motion.span
          aria-hidden
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-mist -mb-[0.1em] block animate-metal-shine pt-[0.15em] text-center font-display leading-none font-normal tracking-[0.01em] whitespace-nowrap select-none mask-b-from-20% motion-reduce:animate-none"
          style={{ fontSize: `calc(94cqw / ${signatureWidthEm})` }}
        >
          {footer.signature}
        </motion.span>
      </div>
    </footer>
  );
}
