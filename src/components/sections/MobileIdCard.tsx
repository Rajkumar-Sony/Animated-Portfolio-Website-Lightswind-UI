import { useMemo, type ReactNode } from "react";
import { profile, socials } from "@/data/portfolio";
import { code128 } from "@/lib/code128";
import { LanyardTag } from "./LanyardTag";

const linkedin = socials.find((social) => social.label === "LinkedIn")?.href ?? profile.website;
const CARD_WIDTH = 324;

function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

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

export function MobileIdCard() {
  return (
    <div data-sky-avoid className="flex flex-col items-center">
      <div className="relative" style={{ width: CARD_WIDTH, maxWidth: "calc(100vw - 2rem)" }}>
        <span
          aria-hidden
          className="absolute -top-3 left-1/2 z-30 h-5 w-10 -translate-x-1/2 rounded-full border bg-steel shadow-sm"
        />
        <LanyardTag className="absolute top-0 left-1/2 z-10 -translate-x-1/2" />
        <article
          aria-label={`${profile.name} ID card`}
          className="relative z-20 mt-[94px] flex h-[476px] flex-col overflow-hidden rounded-md border border-line bg-surface-raised shadow-lg"
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
                decoding="async"
                draggable={false}
                className="size-34 rounded-full border-4 border-surface-raised object-cover"
              />
            </span>
            <h3 className="mt-3 text-lg font-bold">{profile.name}</h3>
            <p className="mt-1 rounded-full border border-line px-3 py-1 text-2xs font-semibold">{profile.role}</p>
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
      </div>
    </div>
  );
}
