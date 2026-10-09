import { useCallback, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Container, Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/cn";

type SparklesCoreProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

const initSlimEngine = async (engine: Engine) => {
  await loadSlim(engine);
};

export function SparklesCore({
  id = "tsparticles",
  className,
  background = "transparent",
  minSize = 1,
  maxSize = 3,
  speed = 4,
  particleColor = "#ffffff",
  particleDensity = 120,
}: SparklesCoreProps) {
  const controls = useAnimation();

  const particlesLoaded = useCallback(
    async (container?: Container) => {
      if (container) {
        controls.start({
          opacity: 1,
          transition: { duration: 1 },
        });
      }
    },
    [controls],
  );

  const options = useMemo<ISourceOptions>(
    () => ({
      background: {
        color: { value: background },
        opacity: background === "transparent" ? 0 : 1,
      },
      fullScreen: {
        enable: false,
        zIndex: 1,
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: { enable: false, mode: "push" },
          onHover: { enable: false, mode: "repulse" },
        },
        modes: {
          push: { quantity: 4 },
          repulse: { distance: 200, duration: 0.4 },
        },
      },
      particles: {
        color: { value: particleColor },
        move: {
          enable: true,
          direction: "none",
          random: false,
          speed: { min: 0.1, max: 1 },
          outModes: { default: "out" },
        },
        number: {
          density: { enable: true, width: 400, height: 400 },
          value: particleDensity,
        },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            enable: true,
            speed,
            sync: false,
            startValue: "random",
          },
        },
        shape: { type: "circle" },
        size: {
          value: { min: minSize, max: maxSize },
        },
      },
      detectRetina: true,
    }),
    [background, minSize, maxSize, particleColor, particleDensity, speed],
  );

  return (
    <ParticlesProvider init={initSlimEngine}>
      <motion.div animate={controls} className={cn("opacity-0", className)}>
        <Particles
          id={id}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      </motion.div>
    </ParticlesProvider>
  );
}
