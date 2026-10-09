import type { ComponentPropsWithoutRef } from "react";
import { buttonStyles, type ButtonVariant } from "@/lib/buttonStyles";

type ButtonProps = ComponentPropsWithoutRef<"button"> & { variant?: ButtonVariant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles(variant, className)} {...props} />;
}
