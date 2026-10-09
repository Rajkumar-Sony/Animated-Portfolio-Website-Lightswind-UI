import { CoolThemeToggle } from "@/components/lightswind/cool-theme-toggle";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  useTheme();
  return <CoolThemeToggle size="md" className="shadow-sm" />;
}
