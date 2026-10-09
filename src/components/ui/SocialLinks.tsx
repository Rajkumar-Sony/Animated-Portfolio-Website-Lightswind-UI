import { socials } from "@/data/portfolio";
import { cn } from "@/lib/cn";

type SocialLinksProps = { variant?: "plain" | "pill"; className?: string };

export function SocialLinks({ variant = "plain", className }: SocialLinksProps) {
  return (
    <ul className={cn("flex items-center gap-1", variant === "pill" && "gap-2", className)}>
      {socials.map(({ label, href, icon: Icon }) => {
        const external = href.startsWith("http");
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              title={label}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className={cn(
                "grid size-11 place-items-center rounded-full text-fg-muted transition-colors duration-150 hover:text-fg",
                variant === "plain" && "hover:bg-surface-sunken",
                variant === "pill" &&
                  "size-10 border border-line bg-surface-raised shadow-sm hover:border-line-strong",
              )}
            >
              <Icon aria-hidden className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
