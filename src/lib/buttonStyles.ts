import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold " +
  "transition-[transform,background-color,border-color,box-shadow,color] duration-150 ease-out " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 " +
  "aria-busy:cursor-progress";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-surface-inverse text-fg-inverse shadow-md hover:-translate-y-0.5 hover:shadow-lg",
  secondary:
    "border border-line bg-surface-raised text-fg shadow-sm hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md",
  ghost: "text-fg-muted hover:bg-surface-sunken hover:text-fg",
};

/** Shared by `<Button>` and by links that should look like buttons. */
export const buttonStyles = (variant: ButtonVariant = "primary", className?: string) =>
  cn(base, variants[variant], className);
