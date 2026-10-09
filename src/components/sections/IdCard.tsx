import { useMemo, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { RotateCw } from "lucide-react";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { LanyardStrap } from "./LanyardStrap";
import { LanyardTag, STRAP_END_Y } from "./LanyardTag";

const CARD_WIDTH = 324;
/** Pulls the card up so the hook tip rests in the card's slot. */
const HOOK_OVERLAP = 19;

/** Deterministic pseudo-random sequence so the barcode and QR art never change between renders. */
function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function Barcode({ value }: { value: string }) {
  const bars = useMemo(() => {
    const rand = seeded(value);
    return Array.from({ length: 46 }, () => ({ w: rand() > 0.6 ? 3 : 1.5, h: 60 + rand() * 40 }));
  }, [value]);

  return (
    <div aria-hidden className="flex h-7 items-end justify-center gap-[2px] rounded-xs border border-line px-3 py-1">
      {bars.map((bar, i) => (
        <span key={i} className="bg-fg" style={{ width: bar.w, height: `${bar.h}%` }} />
      ))}
    </div>
  );
}

function QrArt({ value }: { value: string }) {
  const size = 21;
  const cells = useMemo(() => {
    const rand = seeded(value);
    const finder = (r: number, c: number) => {
      const inBox = (r0: number, c0: number) => {
        const dr = r - r0;
        const dc = c - c0;
        if (dr < 0 || dc < 0 || dr > 6 || dc > 6) return null;
        const ring = Math.min(dr, dc, 6 - dr, 6 - dc);
        return ring !== 1;
      };
      return inBox(0, 0) ?? inBox(0, size - 7) ?? inBox(size - 7, 0);
    };
    return Array.from({ length: size * size }, (_, i) => {
      const r = Math.floor(i / size);
      const c = i % size;
      return finder(r, c) ?? rand() > 0.52;
    });
  }, [value]);

  return (
    <div
      aria-hidden
      className="grid aspect-square w-36 gap-0 rounded-sm bg-white p-2.5"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {cells.map((on, i) => (
        <span key={i} className={on ? "bg-neutral-950" : undefined} />
      ))}
    </div>
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
    <div className="flex flex-col items-center">
      <motion.div
        className="relative"
        style={{ width: CARD_WIDTH, maxWidth: "calc(100vw - 2rem)", transformOrigin: "50% 0%" }}
        animate={reduceMotion ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-30 h-5 w-10 -translate-x-1/2 rounded-full border border-line-strong bg-surface-sunken shadow-sm"
        />
        <LanyardStrap dx={x} dy={strapDy} className="absolute top-0 left-1/2 z-10 -ml-2.5 w-5 rounded-[2px]" />

        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.5}
          dragTransition={{ bounceStiffness: 220, bounceDamping: 12 }}
          whileDrag={{ cursor: "grabbing" }}
          onTap={flip}
          style={{ x, y, rotate, transformOrigin: `50% ${STRAP_END_Y}px` }}
          className="relative z-20 cursor-grab touch-none select-none"
        >
          <LanyardTag strap={false} />
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            style={{ marginTop: -HOOK_OVERLAP, transformPerspective: 1200 }}
            className="relative h-[440px] [transform-style:preserve-3d]"
          >
            {/* Front */}
            <article
              aria-hidden={flipped}
              aria-label={`${profile.name} ID card`}
              className="absolute inset-0 flex flex-col overflow-hidden rounded-md border border-line bg-surface-raised shadow-lg [backface-visibility:hidden]"
            >
              <div className="bg-gradient-accent relative h-28 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-raised/70" />
                <span className="absolute top-2.5 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-neutral-900/85 shadow-[inset_0_1px_2px_rgb(0_0_0/0.6)] dark:bg-black" />
              </div>
              <div className="relative -mt-14 flex flex-col items-center px-5 text-center">
                <span className="bg-gradient-accent rounded-full p-1 shadow-md">
                  <img
                    src={profile.photo}
                    alt={`Portrait of ${profile.name}`}
                    width={96}
                    height={96}
                    fetchPriority="high"
                    draggable={false}
                    className="size-24 rounded-full border-4 border-surface-raised object-cover"
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
              <div className="mx-5 mt-auto mb-5 flex flex-col gap-2">
                <Barcode value={profile.idCard.serial} />
                <div className="flex justify-between text-2xs font-bold tracking-[0.12em] uppercase">
                  <span>{profile.idCard.serial}</span>
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
              <span className="text-2xs font-semibold tracking-[0.2em] uppercase opacity-70">Scan to connect</span>
              <QrArt value={profile.website} />
              <div className="flex flex-col gap-1">
                <span className="text-base font-bold">{profile.email}</span>
                <span className="text-xs opacity-70">{profile.website}</span>
              </div>
              <span className="text-2xs tracking-[0.14em] uppercase opacity-60">
                {profile.idCard.serial} · Valid thru 2030
              </span>
            </article>
          </motion.div>
        </motion.div>
      </motion.div>

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
