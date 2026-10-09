import { ArrowUp, Heart } from "lucide-react";
import { buttonStyles } from "@/lib/buttonStyles";
import GooeyText from "@/components/lightswind-pro/gooey-text";
import Meteors from "@/components/lightswind-pro/meteors";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { footer, footerNav, profile } from "@/data/portfolio";

const edgeBlur =
  "pointer-events-none absolute inset-y-0 z-0 w-[max(3rem,calc((100%-60rem)/2))] backdrop-blur-md";

export function Footer() {
  return (
    <footer className="relative isolate mt-10 overflow-hidden rounded-t-2xl border-t border-line bg-surface-raised/80 pb-28 shadow-soft backdrop-blur-sm">
      <Meteors number={20} speed={3} angle={-45} className="-z-10" />
      <div
        aria-hidden
        className={`${edgeBlur} left-0 bg-linear-to-r from-surface/80 to-transparent [mask-image:linear-gradient(to_right,black_30%,transparent)]`}
      />
      <div
        aria-hidden
        className={`${edgeBlur} right-0 bg-linear-to-l from-surface/80 to-transparent [mask-image:linear-gradient(to_left,black_30%,transparent)]`}
      />
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
          <p className="flex items-center gap-1.5 text-xs text-fg-muted">
            © {new Date().getFullYear()} {profile.name}. Crafted with
            <Heart aria-label="love" className="size-3.5 fill-rose-500 text-rose-500" />
            &amp; Lightswind UI
          </p>
        </div>

        <div>
          <p className="sr-only">{footer.signature}</p>
          <Reveal className="flex justify-center">
            <RevealItem>
              <span
                aria-hidden
                className="text-metal block animate-metal-shine py-[0.15em] font-display text-[clamp(1.75rem,10.5vw,7rem)] leading-none font-bold tracking-[-0.03em] whitespace-nowrap select-none motion-reduce:animate-none"
              >
                {footer.signature}
              </span>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </footer>
  );
}
