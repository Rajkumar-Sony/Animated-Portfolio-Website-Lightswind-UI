import { useMemo, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { RotateCw } from "lucide-react";
import { encode } from "uqr";
import { profile, socials } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { code128 } from "@/lib/code128";
import { LanyardStrap } from "./LanyardStrap";
import { LanyardTag, STRAP_END_Y } from "./LanyardTag";

const linkedin = socials.find((social) => social.label === "LinkedIn")?.href ?? profile.website;

const CARD_WIDTH = 324;
/** Pulls the card up so the hook tip rests in the card's slot. */
const HOOK_OVERLAP = 19;
/** How far the card can be pulled from rest before the strap stops giving. */
const DRAG_LIMIT = { top: -24, bottom: 48, left: -56, right: 56 };

/** Deterministic pseudo-random sequence so the bar heights never change between renders. */
function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Scannable Code 128. Bar heights vary for the badge look; every bar reaches the bottom 60%,
 * so a scan line through the lower part still crosses all of them. Bars stay dark on light in
 * both themes, since many scanners can't read inverted barcodes.
 */
function Barcode({ value, label }: { value: string; label: string }) {
  const { path, width } = useMemo(() => {
    const { bars, width } = code128(value);
    const rand = seeded(value);
    const path = bars
      .map(([x, w]) => {
        const h = 0.6 + rand() * 0.4;
        return `M${x} ${1 - h}h${w}v${h}h-${w}z`;
      })
      .join("");
    return { path, width };
  }, [value]);

  return (
    <div className="h-7 rounded-xs border border-line px-3 py-1 dark:bg-fg">
      <svg role="img" aria-label={label} viewBox={`0 0 ${width} 1`} preserveAspectRatio="none" className="size-full">
        <path d={path} className="fill-fg dark:fill-surface-raised" />
      </svg>
    </div>
  );
}

function QrCode({ value, label }: { value: string; label: string }) {
  const { size, path } = useMemo(() => {
    const { data, size } = encode(value, { ecc: "M", border: 0 });
    const path = data
      .flatMap((row, y) => row.map((on, x) => (on ? `M${x} ${y}h1v1h-1z` : "")))
      .join("");
    return { size, path };
  }, [value]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="crispEdges"
      className="aspect-square w-36 rounded-sm bg-white p-3"
    >
      <path d={path} className="fill-neutral-950" />
    </svg>
  );
}

/** Punched slot the lanyard hook passes through; matches the hook position in `LanyardTag`. */
function CardSlot() {
  return (
    <span
      aria-hidden
      className="absolute top-[7px] left-1/2 z-10 h-2 w-12 -translate-x-1/2 rounded-full bg-neutral-950 shadow-[inset_0_1px_2px_rgb(0_0_0/0.8),0_1px_0_rgb(255_255_255/0.35)] ring-1 ring-white/20"
    />
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-2xs font-semibold tracking-[0.14em] text-fg-muted uppercase">{label}</dt>
      <dd className="text-xs font-semibold">{children}</dd>
    </div>
  );
}

export function IdCard() {
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const strapDy = useTransform(y, (v) => STRAP_END_Y + v);
  const strapAngle = useTransform(() => (Math.atan2(-x.get(), strapDy.get()) * 180) / Math.PI);
  const rotate = useSpring(useTransform(strapAngle, (deg) => deg * 0.6), { stiffness: 220, damping: 18 });

  const flip = () => setFlipped((value) => !value);

  return (
    <div data-sky-avoid className="flex flex-col items-center">
      <div className="relative" style={{ width: CARD_WIDTH, maxWidth: "calc(100vw - 2rem)" }}>
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-30 h-5 w-10 -translate-x-1/2 rounded-full border bg-steel animate-metal-shine motion-reduce:animate-none"
        />
        <motion.div
          className="relative"
          style={{ transformOrigin: "50% 0%" }}
          animate={reduceMotion ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <LanyardStrap dx={x} dy={strapDy} className="absolute top-0 left-1/2 z-10 -ml-2.5 w-5 rounded-[2px]" />

          <motion.div
            drag
            dragSnapToOrigin
            dragConstraints={DRAG_LIMIT}
            dragElastic={0.08}
            dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
            whileDrag={{ cursor: "grabbing" }}
            onDragEnd={flip}
            onTap={flip}
            style={{ x, y, rotate, transformOrigin: `50% ${STRAP_END_Y}px` }}
            className="relative z-20 cursor-grab touch-none select-none"
          >
            <LanyardTag strap={false} className="relative z-10" />
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              style={{ marginTop: -HOOK_OVERLAP, transformPerspective: 1200 }}
              className="relative h-[476px] [transform-style:preserve-3d]"
            >
              {/* Front */}
              <article
                aria-hidden={flipped}
                aria-label={`${profile.name} ID card`}
                className="absolute inset-0 flex flex-col overflow-hidden rounded-md border border-line bg-surface-raised shadow-lg [backface-visibility:hidden]"
              >
                <div className="bg-gradient-accent relative h-28 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-raised/70" />
                </div>
                <CardSlot />
                <div className="relative -mt-21 flex flex-col items-center px-5 text-center">
                  <span className="bg-gradient-accent rounded-full p-1 shadow-md">
                    <img
                      src={profile.photo}
                      alt={`Portrait of ${profile.name}`}
                      width={136}
                      height={136}
                      fetchPriority="high"
                      decoding="sync"
                      draggable={false}
                      className="size-34 rounded-full border-4 border-surface-raised object-cover"
                    />
                  </span>
                  <h3 className="mt-3 text-lg font-bold">{profile.name}</h3>
                  <p className="mt-1 rounded-full border border-line px-3 py-1 text-2xs font-semibold">
                    {profile.role}
                  </p>
                </div>
                <dl className="mx-5 mt-5 grid grid-cols-2 gap-x-3 gap-y-3 rounded-sm border border-line bg-surface-sunken/60 p-4">
                  <Field label="Specialty">{profile.idCard.specialty}</Field>
                  <Field label="Location">{profile.location}</Field>
                  <Field label="Experience">{profile.idCard.experience}</Field>
                  <Field label="Status">
                    <span className="inline-flex items-center gap-1.5 text-success">
                      <span className="size-1.5 rounded-full bg-success" />
                      {profile.idCard.status}
                    </span>
                  </Field>
                </dl>
                <div className="mx-5 mt-auto mb-5 flex flex-col gap-2 pt-2">
                  <Barcode
                    value={linkedin.split("/").filter(Boolean).at(-1) ?? profile.name}
                    label={`Barcode of ${profile.name}'s LinkedIn username`}
                  />
                  <div className="flex justify-between text-2xs font-bold tracking-[0.12em] uppercase">
                    <span>{profile.idCard.credential}</span>
                    <span className="text-fg-muted">{profile.idCard.issuer}</span>
                  </div>
                </div>
              </article>

              {/* Back */}
              <article
                aria-hidden={!flipped}
                aria-label="Contact details"
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden rounded-md border border-line bg-surface-inverse p-6 text-center text-fg-inverse shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
              >
                <CardSlot />
                <span className="text-2xs font-semibold tracking-[0.2em] uppercase opacity-70">Scan to connect</span>
                <QrCode value={linkedin} label={`QR code for ${profile.name} on LinkedIn`} />
                <div className="flex flex-col gap-1">
                  <span className="text-base font-bold">{profile.email}</span>
                  <span className="text-xs opacity-70">{linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-2xs tracking-[0.14em] uppercase">
                  <span className="opacity-60">
                    {profile.idCard.experience} · {profile.idCard.company}
                  </span>
                  <span className="rounded-full border border-current/25 px-3 py-1 opacity-60">
                    Notice period: {profile.idCard.noticePeriod}
                  </span>
                </div>
                <span className="text-2xs tracking-[0.14em] uppercase opacity-60">
                  {profile.idCard.credential}
                </span>
              </article>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={flip}
        aria-pressed={flipped}
        className={cn(
          "mt-6 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs text-fg-muted transition-colors duration-150 hover:bg-surface-sunken hover:text-fg",
        )}
      >
        <RotateCw aria-hidden className="size-3.5" />
        Drag or click the card
        <span className="sr-only">{flipped ? " — showing contact side" : " — flip to contact side"}</span>
      </button>
    </div>
  );
}
