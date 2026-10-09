import { useEffect, useRef, useState } from "react";
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

const media = "absolute inset-0 size-full object-cover dark:brightness-[0.4] dark:saturate-75";

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
        "[mask-image:linear-gradient(to_bottom,transparent,black_var(--fade-top),black_calc(100%_-_var(--fade-bottom)),transparent)]",
        className,
      )}
    >
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
    </div>
  );
}
