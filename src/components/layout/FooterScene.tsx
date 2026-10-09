import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const ASSETS = "https://assets.appitstudio.com/cooldock";
const scene = {
  video: `${ASSETS}/d3ec9e209bedbef0/images/cooldock/hero/scene-optimized.mp4`,
  videoMobile: `${ASSETS}/175969515f650b59/images/cooldock/hero/scene-mobile.mp4`,
  poster: `${ASSETS}/63e9b7b6e1ffb3cb/images/cooldock/hero/scene-poster-1600.webp`,
  posterMobile: `${ASSETS}/4080fb2d7f06bfa3/images/cooldock/hero/scene-poster-1000.webp`,
};
const MOBILE_QUERY = "(max-width: 809px)";

const media = "absolute inset-0 size-full object-cover saturate-[0.85]";

/**
 * Sun disc masked to the footage's sky: the poster, cropped exactly like the video, is thresholded on brightness
 * so the bright sky lets the sun through and the darker hills hide whatever part of it sinks below the ridge.
 */
function SettingSun() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sky = `${id}-sky`;
  const skyMask = `${id}-sky-mask`;
  const disc = `${id}-disc`;

  return (
    <svg className="absolute inset-0 size-full">
      <defs>
        <filter id={sky} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.2126 0.7152 0.0722 0 0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="16" intercept="-12" />
          </feComponentTransfer>
        </filter>
        <mask id={skyMask} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
          <image
            href={scene.posterMobile}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            filter={`url(#${sky})`}
          />
        </mask>
        <radialGradient id={disc}>
          <stop offset="55%" stopColor="var(--sun)" />
          <stop offset="80%" stopColor="var(--sunset-glow)" />
          <stop offset="100%" stopColor="var(--sunset-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* 70% set: the disc's centre sits 0.4 radii below the ridge, leaving its top 30% above it. */}
      <g mask={`url(#${skyMask})`} className="[--sun-r:1.75rem] [--sun-cy:calc(var(--sun-y)_+_var(--sun-r)_*_0.4)] sm:[--sun-r:2rem]">
        <circle className="[cx:var(--sun-x)] [cy:var(--sun-cy)] [r:3.5rem] opacity-40 blur-lg" fill="var(--sunset-glow)" />
        <circle className="[cx:var(--sun-x)] [cy:var(--sun-cy)] [r:var(--sun-r)]" fill={`url(#${disc})`} />
      </g>
    </svg>
  );
}

/** Looping landscape video (from cooldock.app) that loads once near the viewport and pauses when out of view. */
export function FooterScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    if (!inView) {
      video.pause();
      return;
    }
    if (!video.getAttribute("src")) {
      video.src = window.matchMedia(MOBILE_QUERY).matches ? scene.videoMobile : scene.video;
    }
    video.play().catch(() => {});
  }, [inView, reduceMotion]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[379px] overflow-clip [--fade-bottom:146px] [--fade-top:206px] sm:h-[439px] sm:[--fade-bottom:226px] lg:h-[536px] lg:[--fade-bottom:260px] lg:[--fade-top:225px]",
        /*
         * Where the sun sets behind the far ridge. The footage is a centred 16:9 cover crop, so its rendered height is
         * max(100%, 56.25cqw) of the footer, and at 85% across the ridge sits 43.9% of the way down it.
         */
        "[--sun-x:85%] [--sun-y:calc(50%_-_0.061_*_max(100%,56.25cqw))]",
        className,
      )}
    >
      {/* Dark theme: warm afterglow the setting sun casts up into the footer. */}
      <div className="absolute inset-0 hidden bg-sunset-afterglow [mask-image:linear-gradient(transparent,black_8rem)] dark:block" />

      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_var(--fade-top),black_calc(100%_-_var(--fade-bottom)),transparent)]">
        <picture>
          <source media={MOBILE_QUERY} srcSet={scene.posterMobile} />
          <img src={scene.poster} alt="" width={1600} height={900} loading="lazy" decoding="async" className={media} />
        </picture>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="none"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={cn(media, "transition-opacity duration-700", playing ? "opacity-100" : "opacity-0")}
        />
        {/* Cools the golden-hour footage toward the violet–blue accents; identical in both themes. */}
        <div className="absolute inset-0 bg-scene-tint opacity-25 mix-blend-color" />
        {/* Dark theme: the sky and land darken to dusk as the sun sets, and the sun warms the sky and ridges around it. */}
        <div className="absolute inset-0 hidden bg-dusk-sky mix-blend-multiply dark:block" />
        {/* A light wash of the dark theme's cyan–mint–yellow accents, its yellow end falling on the sunset. */}
        <div className="bg-gradient-accent absolute inset-0 hidden opacity-20 mix-blend-color dark:block" />
        <div className="absolute inset-0 hidden bg-sunset-wash opacity-90 mix-blend-soft-light dark:block" />
      </div>

      {/* Dark theme: the sun itself, half sunk behind the ridge. */}
      <div className="absolute inset-0 hidden [mask-image:linear-gradient(transparent,black_6rem)] dark:block">
        <span className="absolute top-(--sun-y) left-(--sun-x) size-[36rem] -translate-1/2 rounded-full bg-sun-halo" />
        <SettingSun />
      </div>
    </div>
  );
}
