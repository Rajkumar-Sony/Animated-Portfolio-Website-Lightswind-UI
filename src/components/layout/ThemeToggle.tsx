import { CoolThemeToggle } from "@/components/lightswind/cool-theme-toggle";
import { useTheme } from "@/hooks/useTheme";
import { useWeather } from "@/hooks/useWeather";

export function ThemeToggle() {
  useTheme();
  const weather = useWeather();
  return <CoolThemeToggle size="md" weather={weather} />;
}
