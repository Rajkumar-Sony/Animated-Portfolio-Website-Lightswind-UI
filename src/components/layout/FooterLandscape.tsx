import { useEffect, useId, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/*
 * Illustrated landscape behind the footer, coloured by the --land-* tokens: a clear day in the light theme's
 * violet–blue, and a sunset in the dark theme's black, cyan, mint and yellow. The sun is on the right in both, so
 * crests, trees, rocks and clouds are lit on that side. Wind gusts travel left to right through grass and trees;
 * birds, butterflies and fireflies follow SMIL motion paths, which pause with the page's CSS animations.
 * The 1600×900 frame is cover-cropped (`slice`), and the far range's ridge crosses x = 85% at 43.9% down, where the
 * dark theme's sun sets.
 */
const W = 1600;
const H = 900;
const BLEED = 120;

type Point = readonly [number, number];

/** Smooth silhouette through `points` (Catmull-Rom as cubic Béziers), closed past the bottom (or top) of the frame. */
function ridge(points: readonly Point[], closeTo = H + BLEED): string {
  const p = [points[0], ...points, points[points.length - 1]];
  let d = `M${p[1][0]},${p[1][1]}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2];
    d += ` C${f(x1 + (x2 - x0) / 6)},${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)},${f(y2 - (y3 - y1) / 6)} ${x2},${y2}`;
  }
  return `${d} L${points[points.length - 1][0]},${closeTo} L${points[0][0]},${closeTo}Z`;
}

/** Height of `ridge(points)` at `x`, close enough to stand things on it. */
function ridgeY(points: readonly Point[], x: number): number {
  const i = Math.max(0, points.findIndex(([px], j) => j < points.length - 1 && x >= px && x <= points[j + 1][0]));
  const p0 = points[Math.max(i - 1, 0)][1];
  const [x1, p1] = points[i];
  const [x2, p2] = points[i + 1];
  const p3 = points[Math.min(i + 2, points.length - 1)][1];
  const t = (x - x1) / (x2 - x1);
  return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);
}

const f = (n: number) => (Math.round(n * 1000) / 1000).toString();
const shift = (points: readonly Point[], dy: number) => points.map(([x, y]) => [x, y + dy] as const);
const circle = (cx: number, cy: number, r: number) => `M${f(cx - r)},${f(cy)}a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0`;

/** Deterministic PRNG (mulberry32) so scattered details land in the same place on every render. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const vars = (v: Record<string, string>) => v as CSSProperties;
const token = (name: string) => `var(--land-${name})`;
/** Phase of the wind at `x`: gusts reach the left of the frame first. */
const wind = (x: number, bend: number) => vars({ "--wind-delay": `${f((x / W) * 2.6 - 9)}s`, "--bend": f(bend) });

/* ---------- Terrain ---------- */

const FAR_RANGE: Point[] = [[-BLEED, 432], [300, 424], [600, 418], [760, 400], [880, 384], [980, 398], [1080, 370], [1180, 390], [1280, 378], [1360, 395], [1450, 368], [1560, 386], [W + BLEED, 378]];
const HILLS_1: Point[] = [[-BLEED, 458], [100, 442], [250, 428], [400, 442], [560, 422], [711, 394], [850, 426], [977, 406], [1100, 432], [1219, 412], [1340, 442], [1480, 428], [W + BLEED, 440]];
const HILLS_2: Point[] = [[-BLEED, 502], [150, 472], [300, 452], [450, 470], [594, 462], [720, 500], [820, 506], [938, 490], [1050, 512], [1170, 486], [1300, 506], [1450, 490], [W + BLEED, 500]];
const HILLS_3: Point[] = [[-BLEED, 600], [400, 576], [520, 542], [594, 530], [700, 550], [800, 576], [900, 562], [1000, 572], [1120, 556], [1250, 578], [1400, 562], [W + BLEED, 572]];
const crestY = (x: number) => 375 + 525 * Math.pow(Math.min(Math.max(x, 0), 1406) / 1406, 1.37) + (x > 1406 ? x - 1406 : 0);
const SLOPE: Point[] = Array.from({ length: 41 }, (_, i) => {
  const x = -BLEED + i * ((1520 + BLEED) / 40);
  return [Math.round(x), Math.round(crestY(x))] as const;
});
const CONTOURS = [70, 150, 250].map((dy) =>
  SLOPE.filter(([x]) => x > -BLEED && x < 1300)
    .map(([x, y], i) => `${i ? "L" : "M"}${x},${f(y + dy * (0.6 + (x + BLEED) / 2600))}`)
    .join(" "),
);

const RIVER =
  "M1160,566 C1240,578 1290,598 1370,614 C1470,634 1560,642 1720,650 L1720,770 C1560,748 1450,708 1370,676 C1290,646 1230,612 1160,566Z";
/** Light glinting on the river: short streaks along the current that flash in and out. */
const GLINTS = (() => {
  const rand = seeded(31);
  const edge = (xs: number[], ys: number[], x: number) => {
    const i = x < xs[1] ? 0 : 1;
    return ys[i] + ((ys[i + 1] - ys[i]) * (x - xs[i])) / (xs[i + 1] - xs[i]);
  };
  return Array.from({ length: 22 }, () => {
    const x = 1210 + rand() * 480;
    const top = edge([1160, 1370, 1720], [566, 614, 650], x);
    const bottom = edge([1160, 1370, 1720], [566, 676, 770], x);
    return { x, y: top + 6 + (bottom - top - 12) * rand(), w: 6 + rand() * 12 * ((x - 1100) / 600), delay: -rand() * 5, duration: 3 + rand() * 3 };
  });
})();

/* ---------- Sky ---------- */

/**
 * A cumulus in a unit box (x −0.5…0.5, base at 0): a row of billows with a second tier piled on the middle, a grey
 * shadowed underside, and bright crowns on the sun side.
 */
function cumulus(seed: number) {
  const rand = seeded(seed);
  const low = Array.from({ length: 7 }, (_, i) => {
    const x = -0.38 + (i / 6) * 0.76 + (rand() - 0.5) * 0.05;
    const r = 0.08 + (1 - Math.abs(x) * 1.9) * 0.09 + rand() * 0.035;
    return { x, y: -r * (0.5 + rand() * 0.2), r };
  });
  const high = Array.from({ length: 3 }, (_, i) => {
    const x = -0.14 + i * 0.14 + (rand() - 0.5) * 0.06;
    const r = 0.1 + rand() * 0.05 - Math.abs(x) * 0.15;
    return { x, y: -0.16 - r * 0.6 - rand() * 0.04, r };
  });
  const puffs = [...low, ...high];
  const base = "M-0.4,0 A0.045,0.045 0 0 1 -0.4,-0.09 L0.4,-0.09 A0.045,0.045 0 0 1 0.4,0Z";
  return {
    shade: `${low.map((p) => circle(p.x, p.y + p.r * 0.12, p.r)).join("")}${base}`,
    body: puffs.map((p) => circle(p.x - p.r * 0.04, p.y - p.r * 0.1, p.r * 0.94)).join(""),
    crown: puffs
      .filter((p) => p.x > -0.2)
      .map((p) => circle(p.x + p.r * 0.2, p.y - p.r * 0.28, p.r * 0.62))
      .join(""),
  };
}
const CLOUDS = [
  { y: 160, w: 230, seed: 1, duration: 260, start: 0.15 },
  { y: 130, w: 290, seed: 2, duration: 300, start: 0.62 },
  { y: 250, w: 140, seed: 3, duration: 380, start: 0.45 },
  { y: 305, w: 170, seed: 4, duration: 420, start: 0.86 },
  { y: 338, w: 110, seed: 5, duration: 460, start: 0.08 },
].map((c) => ({ ...c, ...cumulus(c.seed) }));
const STARS = (() => {
  const rand = seeded(21);
  return Array.from({ length: 70 }, () => ({ x: rand() * W, y: rand() * 340, r: 0.5 + rand() * 1.1, delay: -rand() * 5, duration: 3 + rand() * 4 }));
})();

/* ---------- Trees ---------- */

type TreeShape = { trunk: string; shade: string; base: string; lit: string };

/** A spruce in a unit box (apex at y −1, ground at 0): drooping tiers, shadowed beneath, lit on the right. */
function pine(seed: number): TreeShape {
  const rand = seeded(seed);
  const tiers = 4 + Math.floor(rand() * 2);
  const bottom = -0.1;
  const step = (bottom + 1) / tiers;
  const widths = Array.from({ length: tiers }, (_, i) => (0.07 + (0.21 * (i + 1)) / tiers) * (0.9 + rand() * 0.2));
  const half = (s: 1 | -1) => {
    let d = "M0,-1";
    widths.forEach((w, i) => {
      const b = -1 + (i + 1) * step;
      d += ` Q${f(s * w * 0.4)},${f(b - step * 0.25)} ${f(s * w)},${f(b)}`;
      d += ` L${f(s * w * 0.78)},${f(b - step * 0.1)} L${f(s * w * 0.62)},${f(b + 0.006)}`;
      d += i < tiers - 1 ? ` L${f(s * w * 0.42)},${f(b - step * 0.32)}` : ` L0,${f(b)}`;
    });
    return `${d}Z`;
  };
  const shade = widths
    .slice(0, -1)
    .map((w, i) => {
      const b = -1 + (i + 1) * step;
      const ww = w * 0.5;
      return `M${f(-ww)},${f(b - step * 0.12)} Q0,${f(b + step * 0.5)} ${f(ww)},${f(b - step * 0.12)}Z`;
    })
    .join("");
  return { trunk: "M-0.03,0 L-0.022,-0.14 L0.022,-0.14 L0.03,0Z", shade, base: half(-1), lit: half(1) };
}

/** A broadleaf tree in a unit box: a rounded crown of leaf clumps over a tapered, forked trunk. */
function broadleaf(seed: number): TreeShape {
  const rand = seeded(seed);
  const clumps = [{ x: 0, y: -0.6, r: 0.22 }];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + rand() * 0.5;
    clumps.push({ x: Math.cos(a) * 0.2 * (0.8 + rand() * 0.3), y: -0.6 + Math.sin(a) * 0.2 * (0.8 + rand() * 0.3), r: 0.12 + rand() * 0.07 });
  }
  return {
    trunk: "M-0.05,0 C-0.03,-0.15 -0.03,-0.3 -0.1,-0.46 L-0.07,-0.48 C-0.02,-0.38 0,-0.36 0.02,-0.48 L0.05,-0.47 C0.03,-0.3 0.03,-0.15 0.05,0Z",
    shade: clumps.map((c) => circle(c.x, c.y, c.r)).join(""),
    base: clumps.map((c) => circle(c.x + 0.015, c.y - 0.025, c.r * 0.86)).join(""),
    lit: clumps
      .filter((c) => c.x > -0.05 && c.y < -0.55)
      .map((c) => circle(c.x + c.r * 0.3, c.y - c.r * 0.35, c.r * 0.55))
      .join(""),
  };
}

const PINES = Array.from({ length: 8 }, (_, i) => pine(100 + i));
const BROADLEAVES = Array.from({ length: 8 }, (_, i) => broadleaf(200 + i));

type TreeSpec = { x: number; y: number; h: number; shape: TreeShape };

/** A strip of forest standing on a ridge, thinning towards its edges. */
function forest(points: readonly Point[], spans: readonly [number, number][], size: number, seed: number, pines = 0.65): TreeSpec[] {
  const rand = seeded(seed);
  const trees: TreeSpec[] = [];
  for (const [a, b] of spans) {
    for (let x = a; x < b; x += size * (0.22 + rand() * 0.22)) {
      const edge = Math.min(x - a, b - x) / ((b - a) / 2);
      if (rand() > 0.3 + edge) continue;
      const pick = Math.floor(rand() * 8);
      trees.push({
        x,
        y: ridgeY(points, x) + size * (0.18 + rand() * 0.2),
        h: size * (0.7 + rand() * 0.5) * (0.55 + edge * 0.55),
        shape: rand() < pines ? PINES[pick] : BROADLEAVES[pick],
      });
    }
  }
  return trees.sort((p, q) => p.y - q.y);
}

const FOREST_1 = forest(HILLS_1, [[160, 340], [880, 1060], [1400, 1620]], 26, 3, 0.8);
const FOREST_2 = forest(HILLS_2, [[190, 370], [960, 1120], [1460, 1620]], 40, 7);
const FOREST_3 = forest(HILLS_3, [[380, 540], [1180, 1310]], 62, 13, 0.5);
/** Two trees on the foreground slope that frame the scene. */
const FOREGROUND_TREES: TreeSpec[] = [
  { x: 52, y: crestY(52) + 40, h: 210, shape: BROADLEAVES[3] },
  { x: 168, y: crestY(168) + 34, h: 150, shape: PINES[2] },
];

/* ---------- Ground cover ---------- */

/** A tuft of curved grass blades leaning with the wind, in a single path. */
function tuft(rand: () => number) {
  return Array.from({ length: 5 }, (_, j) => {
    const x = (j - 2) * 1.8 + (rand() - 0.5) * 1.5;
    const h = 9 + rand() * 12;
    const lean = (rand() - 0.25) * 7;
    const w = 1.6 + rand() * 0.9;
    return `M${f(x - w / 2)},0 Q${f(x - w / 4 + lean * 0.35)},${f(-h * 0.55)} ${f(x + lean)},${f(-h)} Q${f(x + w / 4 + lean * 0.35)},${f(-h * 0.55)} ${f(x + w / 2)},0Z`;
  }).join("");
}
const TUFTS = (() => {
  const rand = seeded(11);
  const crest = Array.from({ length: 44 }, (_, i) => {
    const x = 6 + i * 22 + rand() * 12;
    return { x, y: crestY(x) + 9 + rand() * 6, s: 0.6 + rand() * 0.45 };
  });
  const field = Array.from({ length: 44 }, (_, i) => {
    const x = 20 + i * 22 + rand() * 18;
    return { x, y: crestY(x) + 26 + rand() * 120, s: 0.85 + rand() * 0.9 };
  });
  const tones = ["grass", "grass-mid", "grass-lit"] as const;
  return [...crest, ...field].map((t) => ({ ...t, d: tuft(rand), tone: tones[Math.floor(rand() * 3)], bend: 0.6 + rand() * 0.8 }));
})();
const FLOWERS = (() => {
  const rand = seeded(5);
  return Array.from({ length: 40 }, () => {
    const x = 30 + rand() * 900;
    return { x, y: crestY(x) + 20 + rand() * 130, r: 1.6 + rand() * 1.8, tone: `flower-${1 + Math.floor(rand() * 3)}` };
  });
})();
const BUSHES = [
  { x: 150, y: 434, s: 1.1 },
  { x: 640, y: 466, s: 0.8 },
  { x: 1400, y: 496, s: 0.9 },
  { x: 900, y: 566, s: 1 },
  { x: 1120, y: 560, s: 0.85 },
];
const ROCKS = [
  { x: 470, y: 512, s: 0.8 },
  { x: 488, y: 516, s: 0.55 },
  { x: 236, y: 474, s: 0.9 },
  { x: 1170, y: 582, s: 0.7 },
];
const MIST = [
  { x: 470, y: 456, w: 300, h: 34, duration: 34, delay: -4 },
  { x: 1330, y: 488, w: 260, h: 30, duration: 40, delay: -12 },
  { x: 860, y: 508, w: 380, h: 40, duration: 30, delay: -8 },
  { x: 690, y: 552, w: 300, h: 34, duration: 38, delay: -16 },
];
const FIREFLIES = (() => {
  const rand = seeded(17);
  return Array.from({ length: 16 }, () => {
    const x = 60 + rand() * 860;
    const y = crestY(x) + 6 + rand() * 90;
    const r = 12 + rand() * 18;
    return {
      x,
      y,
      path: `M0,0 C${f(r)},${f(-r)} ${f(2 * r)},${f(r * 0.4)} ${f(r)},${f(r)} S${f(-r)},${f(r * 0.6)} 0,0`,
      duration: 6 + rand() * 6,
      delay: -rand() * 10,
    };
  });
})();

/** Runs an SVG's SMIL motion paths only while `active` and when the visitor allows motion. */
function useSmilPlayback(active: boolean) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (active && !reduceMotion) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active, reduceMotion]);

  return svgRef;
}

export function FooterLandscape({ active = true, className }: { active?: boolean; className?: string }) {
  const svgRef = useSmilPlayback(active);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = (name: string) => `${id}-${name}`;
  const url = (name: string) => `url(#${ref(name)})`;

  const vertical = (name: string, y1: number, y2: number, stops: [number, string][]) => (
    <linearGradient id={ref(name)} x1="0" y1={y1} x2="0" y2={y2} gradientUnits="userSpaceOnUse">
      {stops.map(([offset, color]) => (
        <stop key={offset} offset={offset} stopColor={color} />
      ))}
    </linearGradient>
  );
  const fade = (name: string, color: string, inner = 1) => (
    <radialGradient id={ref(name)}>
      <stop offset="0" stopColor={color} stopOpacity={inner} />
      <stop offset="0.45" stopColor={color} stopOpacity={inner * 0.45} />
      <stop offset="1" stopColor={color} stopOpacity="0" />
    </radialGradient>
  );

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={cn("size-full", className)}>
      <defs>
        {vertical("sky", 0, 440, [[0, token("sky-top")], [0.5, token("sky-mid")], [0.8, token("sky-low")], [1, token("sky-horizon")]])}
        <linearGradient id={ref("cloud")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.2" stopColor={token("cloud-top")} />
          <stop offset="1" stopColor={token("cloud-bottom")} />
        </linearGradient>
        {fade("glow", token("glow"))}
        {fade("sunlight", token("sunlight"))}
        {fade("fire", token("fire-glow"))}
        {fade("mist", token("mist"), 0.75)}
        {fade("smoke", token("mist"), 0.6)}
        {fade("firefly", token("firefly"))}
        {vertical("peak", 240, 450, [[0, token("peak")], [1, token("range")]])}
        {vertical("range", 365, 460, [[0, token("range")], [1, token("haze")]])}
        {vertical("hill-1", 395, 520, [[0, token("hill-1")], [1, token("hill-2")]])}
        {vertical("hill-2", 450, 600, [[0, token("hill-2")], [1, token("hill-3")]])}
        {vertical("hill-3", 530, 760, [[0, token("hill-3")], [1, token("slope-top")]])}
        {vertical("slope", 380, 900, [[0, token("slope-top")], [1, token("slope-bottom")]])}
        {vertical("river", 566, 760, [[0, token("river-far")], [1, token("river-near")]])}
        <linearGradient id={ref("meteor")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x={-BLEED} y={-BLEED} width={W + BLEED * 2} height={H + BLEED * 2} fill={url("sky")} />

      {/* Night sky: twinkling stars and the odd shooting star. */}
      <g className="hidden dark:block">
        {STARS.map((s) => (
          <circle
            key={`${s.x}-${s.y}`}
            cx={f(s.x)}
            cy={f(s.y)}
            r={f(s.r)}
            fill="#ffffff"
            className="animate-twinkle motion-reduce:animate-none"
            style={vars({ "--twinkle-delay": `${f(s.delay)}s`, "--twinkle-duration": `${f(s.duration)}s` })}
          />
        ))}
        <g transform="rotate(-24 620 60)">
          <rect x={620} y={60} width={150} height={1.6} rx={0.8} fill={url("meteor")} className="animate-shooting-star motion-reduce:hidden" />
        </g>
      </g>

      {/* The day sun high on the right, with soft rays; at dusk the glow sits where the sun sets. */}
      <g className="dark:hidden">
        <circle cx={1420} cy={110} r={560} fill={url("glow")} />
        <circle cx={1420} cy={110} r={30} fill="#fffef6" />
        <g className="animate-rays motion-reduce:animate-none" fill="#ffffff">
          <path d="M1420,110 L520,900 L760,900Z" opacity={0.09} />
          <path d="M1420,110 L880,900 L1020,900Z" opacity={0.07} />
          <path d="M1420,110 L120,700 L180,860Z" opacity={0.06} />
        </g>
      </g>
      <circle cx={1360} cy={411} r={640} fill={url("glow")} className="hidden dark:block" />

      {CLOUDS.map((c) => (
        <g
          key={c.seed}
          className="animate-cloud-pass motion-reduce:animate-none"
          style={vars({ "--cloud-duration": `${c.duration}s`, "--cloud-delay": `${f(-c.start * c.duration)}s` })}
        >
          <g transform={`translate(${-c.w} ${c.y}) scale(${c.w})`}>
            <path d={c.shade} fill={token("cloud-shade")} />
            <path d={c.body} fill={url("cloud")} />
            <path d={c.crown} fill={token("cloud-lit")} opacity={0.9} />
          </g>
        </g>
      ))}

      {/* Snow-capped peaks, then the far range; haze thickens towards their feet. */}
      <path d="M40,450 C140,390 226,256 320,246 C414,252 486,370 620,450Z" fill={url("peak")} />
      <path d="M320,246 C414,252 486,370 620,450 L380,450 C366,380 348,300 320,246Z" fill={token("peak-shade")} opacity={0.55} />
      <path d="M262,302 C286,264 300,250 320,246 C342,250 360,268 380,302 C366,296 356,314 338,302 C322,318 300,296 288,310 C280,300 270,300 262,302Z" fill={token("snow-shade")} />
      <path d="M320,246 C342,250 360,268 380,302 C366,296 356,314 338,302 C334,284 328,262 320,246Z" fill={token("snow")} />
      <path d="M480,450 C540,410 580,350 630,344 C680,350 730,410 790,450Z" fill={url("peak")} />
      <path d="M630,344 C680,350 730,410 790,450 L660,450 C652,410 644,370 630,344Z" fill={token("peak-shade")} opacity={0.55} />
      <path d="M600,370 C612,354 620,346 630,344 C642,346 652,356 662,370 C652,366 644,376 634,368 C624,378 612,366 600,370Z" fill={token("snow-shade")} />
      <path d="M630,344 C642,346 652,356 662,370 C652,366 644,376 634,368 C634,360 632,352 630,344Z" fill={token("snow")} />
      <path d={ridge(FAR_RANGE)} fill={url("range")} />
      <Haze y={380} height={70} />

      <Hills points={HILLS_1} rim={token("hill-1-rim")} fill={url("hill-1")} />
      <Forest trees={FOREST_1} tone="forest-1" />
      <Mist items={MIST.slice(0, 2)} fill={url("mist")} />
      <Haze y={420} height={80} />

      <Hills points={HILLS_2} rim={token("hill-2-rim")} fill={url("hill-2")} />
      <Forest trees={FOREST_2} tone="forest-2" />
      {BUSHES.slice(1, 3).map((b) => (
        <Bush key={`${b.x}-${b.y}`} {...b} />
      ))}
      <Deer x={1180} y={487} />
      <Mist items={MIST.slice(2, 3)} fill={url("mist")} />
      <Haze y={480} height={90} opacity={0.6} />

      <Hills points={HILLS_3} rim={token("hill-3-rim")} fill={url("hill-3")} />
      <Forest trees={FOREST_3} tone="tree" sway />
      {BUSHES.slice(3).map((b) => (
        <Bush key={`${b.x}-${b.y}`} {...b} />
      ))}
      <Mist items={MIST.slice(3)} fill={url("mist")} />

      <path d={RIVER} fill={url("river")} stroke={token("bank")} strokeWidth={5} strokeLinejoin="round" />
      {GLINTS.map((g) => (
        <ellipse
          key={`${g.x}-${g.y}`}
          cx={f(g.x)}
          cy={f(g.y)}
          rx={f(g.w)}
          ry={1.1}
          fill={token("ripple")}
          transform={`rotate(10 ${f(g.x)} ${f(g.y)})`}
          className="animate-glint motion-reduce:animate-none"
          style={vars({ "--glint-delay": `${f(g.delay)}s`, "--glint-duration": `${f(g.duration)}s` })}
        />
      ))}
      <Rock {...ROCKS[3]} />

      <Hills points={SLOPE} rim={token("slope-rim")} fill={url("slope")} />
      <g fill="none" stroke={token("slope-rim")} strokeWidth={2} strokeLinecap="round" opacity={0.12}>
        {CONTOURS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {FLOWERS.map((fl) => (
        <circle key={`${fl.x}-${fl.y}`} cx={f(fl.x)} cy={f(fl.y)} r={f(fl.r)} fill={token(fl.tone)} />
      ))}
      <Bush {...BUSHES[0]} />
      {ROCKS.slice(0, 3).map((r) => (
        <Rock key={`${r.x}-${r.y}`} {...r} />
      ))}
      {TUFTS.map((t) => (
        <g key={`${t.x}-${t.y}`} transform={`translate(${f(t.x)} ${f(t.y)}) scale(${f(t.s)})`}>
          <path d={t.d} fill={token(t.tone)} className="animate-wind origin-bottom [transform-box:fill-box] motion-reduce:animate-none" style={wind(t.x, t.bend)} />
        </g>
      ))}
      <Campfire x={430} y={505} glow={url("fire")} smoke={url("smoke")} />
      <Forest trees={FOREGROUND_TREES} tone="tree" sway />

      {/* Sunlight falling on the land from the sun's side. */}
      <circle cx={1420} cy={110} r={900} fill={url("sunlight")} className="dark:hidden" />
      <circle cx={1360} cy={411} r={700} fill={url("sunlight")} className="hidden dark:block" />

      <g className="hidden dark:block">
        {FIREFLIES.map((fl) => (
          <g key={`${fl.x}-${fl.y}`} transform={`translate(${f(fl.x)} ${f(fl.y)})`}>
            <circle
              r={7}
              fill={url("firefly")}
              className="animate-firefly motion-reduce:animate-none"
              style={vars({ "--firefly-delay": `${f(fl.delay)}s`, "--firefly-duration": `${f(fl.duration / 2)}s` })}
            >
              <animateMotion dur={`${f(fl.duration)}s`} begin={`${f(fl.delay)}s`} repeatCount="indefinite" path={fl.path} />
            </circle>
          </g>
        ))}
      </g>
      <g className="dark:hidden">
        <Butterfly path="M240,520 C300,470 360,540 420,480 S540,430 600,500 S720,560 660,600 S420,620 240,520" duration={26} delay={-3} color={token("monarch")} />
        <Butterfly path="M120,470 C180,430 220,500 300,460 S380,420 340,520 S180,560 120,470" duration={20} delay={-11} color={token("swallowtail")} />
      </g>
    </svg>
  );
}

/** The birds, in the landscape's frame but layered above the dark theme's sun so its glow never bleaches their plumage. */
export function FooterBirds({ active = true, className }: { active?: boolean; className?: string }) {
  const svgRef = useSmilPlayback(active);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={cn("size-full", className)}>
      <Flock />
      <Eagle />
    </svg>
  );
}

/** A hill layer with a lighter rim along its crest where the light catches it. */
function Hills({ points, rim, fill }: { points: readonly Point[]; rim: string; fill: string }) {
  return (
    <>
      <path d={ridge(points)} fill={rim} />
      <path d={ridge(shift(points, 7))} fill={fill} />
    </>
  );
}

/** Atmospheric haze pooling at the foot of the layers behind. */
function Haze({ y, height, opacity = 1 }: { y: number; height: number; opacity?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={token("haze")} stopOpacity="0" />
        <stop offset="1" stopColor={token("haze")} stopOpacity="0.8" />
      </linearGradient>
      <rect x={-BLEED} y={y} width={W + BLEED * 2} height={height} fill={`url(#${id})`} opacity={opacity} />
    </>
  );
}

/** Soft fog banks that drift and breathe along the valley floors. */
function Mist({ items, fill }: { items: readonly (typeof MIST)[number][]; fill: string }) {
  return items.map((m) => (
    <g
      key={`${m.x}-${m.y}`}
      className="animate-mist-drift motion-reduce:animate-none"
      style={vars({ "--mist-duration": `${m.duration}s`, "--mist-delay": `${m.delay}s` })}
    >
      <ellipse cx={m.x} cy={m.y} rx={m.w / 2} ry={m.h / 2} fill={fill} />
      <ellipse cx={m.x - m.w * 0.22} cy={m.y - m.h * 0.25} rx={m.w * 0.3} ry={m.h * 0.45} fill={fill} />
      <ellipse cx={m.x + m.w * 0.25} cy={m.y + m.h * 0.1} rx={m.w * 0.28} ry={m.h * 0.4} fill={fill} />
    </g>
  ));
}

/** Trees coloured by a layer's tokens (`tone`, `tone-lit`, `tone-shade`); nearer ones bend in the wind. */
function Forest({ trees, tone, sway = false }: { trees: readonly TreeSpec[]; tone: string; sway?: boolean }) {
  return trees.map((t) => (
    <g key={`${f(t.x)}-${f(t.y)}`} transform={`translate(${f(t.x)} ${f(t.y)}) scale(${f(t.h)})`}>
      <g
        className={cn(sway && "animate-wind origin-bottom [transform-box:fill-box] motion-reduce:animate-none")}
        style={sway ? wind(t.x, 0.18) : undefined}
      >
        <path d={t.shape.trunk} fill={token("trunk")} />
        <path d={t.shape.shade} fill={token(`${tone}-shade`)} />
        <path d={t.shape.base} fill={token(tone)} />
        <path d={t.shape.lit} fill={token(`${tone}-lit`)} />
      </g>
    </g>
  ));
}

/** A clump of round bushes, shaded beneath and lit on the sun side. */
function Bush({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`${circle(-11, -7, 9)}${circle(10, -6, 8)}${circle(0, -11, 11)}`} fill={token("tree-shade")} />
      <path d={`${circle(-10, -8.5, 7.5)}${circle(10.5, -7.5, 6.8)}${circle(0.5, -12.5, 9.6)}`} fill={token("tree")} />
      <path d={`${circle(4, -16, 5)}${circle(13, -10, 3.6)}`} fill={token("tree-lit")} />
    </g>
  );
}

function Rock({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-14,0 C-15,-8 -8,-14 0,-14 C9,-14 15,-8 14,0Z" fill={token("rock")} />
      <path d="M14,0 C15,-8 9,-14 0,-14 C4,-10 6,-5 5,0Z" fill={token("rock-lit")} />
    </g>
  );
}

/**
 * A white-tailed buck on the ridge, in its natural colours in both themes. It lowers its head to graze, nibbles,
 * looks up again, and flicks its tail now and then.
 */
function Deer({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.15)`} fill={token("deer")}>
      {/* Far legs, in shadow behind the body. */}
      <path d="M11,-15 C12,-11 13,-8.5 13.6,-6 L12.9,0 L11.7,0 L12.1,-6 C10.5,-9 9.4,-11.5 8.6,-15Z" fill={token("deer-far")} />
      <path d="M-12.2,-15 L-12.6,-6 L-12.2,0 L-11,0 L-11.3,-6 L-10.2,-15Z" fill={token("deer-far")} />
      <path d="M-17,-22 C-16,-28 -8,-30 2,-29 C10,-29 17,-28 19,-23 C20.5,-19 19,-14 15,-13 C12,-11.5 9,-12 7,-13 C2,-11.5 -6,-11.5 -11,-13 C-15,-14 -17.5,-17 -17,-22Z" />
      <path d="M-11,-13 C-4,-11.3 3,-11.3 7,-13 C3,-14.6 -5,-14.6 -11,-13Z" fill={token("deer-belly")} />
      {/* Near legs: the haunch narrowing to the hock, the foreleg to the knee, each on a dark hoof. */}
      <path d="M8.5,-19 C14,-19.5 17.5,-16 16.4,-11.5 L17.6,-6 L16.4,-0.6 L15,-0.6 L15.6,-6 C13,-9 11,-11 8.5,-13.5Z" />
      <path d="M-14.5,-17 C-11.5,-17 -9.2,-15.5 -9.2,-13 L-8.8,-6 L-8.6,-0.6 L-10,-0.6 L-10.4,-6 L-11.2,-12 C-12.4,-13.2 -14,-14.5 -14.5,-17Z" />
      <path d="M15,-0.8 L16.6,-0.8 L16.8,0 L14.8,0Z M-10.1,-0.8 L-8.5,-0.8 L-8.4,0 L-10.3,0Z M11.6,-0.8 L13,-0.8 L13.1,0 L11.5,0Z M-12.3,-0.8 L-11,-0.8 L-10.9,0 L-12.4,0Z" fill={token("deer-dark")} />
      <g className="animate-tail-flick origin-top-left [transform-box:fill-box] motion-reduce:animate-none">
        <path d="M18.4,-26.5 C21.5,-27.5 23.4,-24.5 22,-21.4 C20.4,-22.4 19.2,-24 18.4,-26.5Z" />
        <path d="M19.2,-24.6 C20.8,-24.8 22,-23.4 21.6,-21.8 C20.6,-22.4 19.8,-23.4 19.2,-24.6Z" fill={token("deer-belly")} />
      </g>
      <g className="animate-graze motion-reduce:animate-none" style={{ transformOrigin: "-14px -23px" }}>
        <path d="M-16.2,-41.5 C-15,-45 -12.4,-47 -10.6,-46.6 C-11,-44 -13,-42 -15.2,-40.4Z" fill={token("deer-far")} />
        <path d="M-17,-21 C-19,-27 -21,-33 -21,-38 L-15.5,-40 C-15,-34 -12,-28 -9,-25Z" />
        <path d="M-20.4,-36 C-20,-33 -19,-30 -18,-27 L-17,-28 C-18,-31 -18.5,-34 -19,-37Z" fill={token("deer-belly")} />
        <path d="M-15,-41 C-17,-43.5 -22,-43.5 -25,-41 C-27.5,-39.5 -29.5,-38 -30,-36.5 C-30,-35 -28.5,-34.5 -27,-35 C-24,-35.5 -20,-36 -17,-37 C-15.5,-37.5 -14.5,-39.5 -15,-41Z" />
        <path d="M-28.6,-35.2 C-27,-35.4 -25.4,-35.8 -24,-36 C-25,-34.8 -27,-34.4 -28.6,-35.2Z" fill={token("deer-belly")} />
        <circle cx={-29.5} cy={-36.6} r={0.9} fill={token("deer-dark")} />
        <circle cx={-21.6} cy={-40.1} r={0.7} fill={token("deer-dark")} />
        <path d="M-17.6,-42 C-16.6,-45.6 -14,-47.8 -12.2,-47.6 C-12.4,-45 -14.4,-42.8 -16.6,-41.2Z" />
        <path
          d="M-18,-43 C-18,-48 -16,-52 -12,-55 M-16.6,-48 L-19.6,-52 M-14.2,-52.4 L-15.6,-56.6 M-20,-43 C-21,-48 -23,-51 -26,-53 M-22.2,-48 L-21.2,-53"
          fill="none"
          stroke={token("antler")}
          strokeWidth={1.3}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Campfire({ x, y, glow, smoke }: { x: number; y: number; glow: string; smoke: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx={0} cy={-12} r={70} fill={glow} className="animate-fire-glow motion-reduce:animate-none" />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={0}
          cy={-34}
          r={9}
          fill={smoke}
          className="animate-smoke origin-center [transform-box:fill-box] motion-reduce:hidden"
          style={vars({ "--smoke-delay": `${-i * 1.4}s` })}
        />
      ))}
      <ellipse cx={0} cy={2} rx={20} ry={4.5} fill={token("tree-shade")} opacity={0.5} />
      <path d="M-18,1 C-20,-2 -14,-6 -11,-5 L13,3 C16,4 14,8 10,7Z" fill={token("log")} />
      <path d="M18,1 C20,-2 14,-6 11,-5 L-13,3 C-16,4 -14,8 -10,7Z" fill={token("log")} opacity={0.85} />
      <g className="origin-bottom [transform-box:fill-box]">
        <path d="M0,-3 C-13,-6 -12,-21 -5,-33 C-4,-24 1,-23 3,-29 C11,-19 12,-7 0,-3Z" fill="#ff6a3d" className="animate-flame-a origin-bottom [transform-box:fill-box] motion-reduce:animate-none" />
        <path d="M-1,-4 C-8,-6 -8,-16 -3,-24 C-2,-17 3,-17 4,-21 C9,-14 8,-6 -1,-4Z" fill="#ff9f3d" className="animate-flame-b origin-bottom [transform-box:fill-box] motion-reduce:animate-none" />
        <path d="M0,-5 C-4,-7 -4,-12 0,-17 C4,-12 4,-7 0,-5Z" fill="#ffe08a" className="animate-flame-a origin-bottom [transform-box:fill-box] motion-reduce:animate-none" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={(i - 2) * 3}
          cy={-20}
          r={1}
          fill="#ffcf6b"
          className="animate-ember motion-reduce:hidden"
          style={vars({ "--ember-delay": `${-i * 0.55}s`, "--ember-drift": `${(i % 2 ? 1 : -1) * (6 + i * 3)}px` })}
        />
      ))}
    </g>
  );
}

/*
 * A wing in its raised pose, reaching up and back from the shoulder at (5, −4): the leading edge bends at the wrist,
 * five primaries spread like fingers at the tip, and the secondaries scallop the trailing edge.
 */
const EAGLE_FINGERS =
  "Q-12,-45 -13,-43 L-13.5,-37 L-17,-44 Q-18.5,-45.5 -19,-43.5 L-18,-36 L-22.5,-42 Q-24,-43 -24.3,-41 L-21.5,-34 L-26.5,-38 Q-28,-38.5 -28,-36.5 L-23.5,-31 L-29,-33 Q-30.5,-32.5 -29.8,-30.5 L-25,-28";
const EAGLE_WING = `M5,-4 C9,-12 6,-20 -1,-25 C-5,-30 -9,-36 -11,-40 ${EAGLE_FINGERS} Q-27,-25 -24.5,-22 Q-23.5,-18 -20.5,-16 Q-19,-12 -15.5,-10 Q-13.5,-6 -10,-5 Q-8,-2 -5,-1Z`;
const EAGLE_PRIMARIES = `M-11,-40 ${EAGLE_FINGERS} Q-21,-30 -17,-33 Q-13,-36 -11,-40Z`;
const EAGLE_SECONDARIES =
  "M-25,-28 Q-27,-25 -24.5,-22 Q-23.5,-18 -20.5,-16 Q-19,-12 -15.5,-10 Q-13.5,-6 -10,-5 Q-8,-2 -5,-1 L-3,-3 Q-7,-5 -9,-8 Q-13,-11 -15,-14 Q-19,-18 -21,-22 Q-23,-26 -25,-28Z";
const EAGLE_COVERTS = "M5,-4 C9,-12 6,-20 -1,-25 C-4,-28 -7,-32 -9,-36 C-9,-30 -6,-24 -3,-18 C-1,-13 0,-8 0,-3Z";

/**
 * A bald eagle in profile, facing its direction of flight: a few deep wingbeats from the shoulder, then a long glide.
 * Its plumage keeps its natural colours in both themes.
 */
function Eagle() {
  const wingOrigin = { transformOrigin: "5px -4px" };
  return (
    <g className="motion-reduce:hidden">
      <animateMotion
        dur="44s"
        begin="-12s"
        repeatCount="indefinite"
        rotate="auto"
        keyPoints="0;1;1"
        keyTimes="0;0.72;1"
        calcMode="linear"
        path="M-140,430 C120,370 360,450 640,380 S1080,330 1320,372 S1600,330 1760,340"
      />
      <g transform="scale(1.3)">
        <g transform="translate(4 -1)">
          <g className="animate-wing-beat motion-reduce:animate-none" style={{ ...wingOrigin, animationDelay: "-0.06s" }}>
            <path d={EAGLE_WING} fill={token("eagle-far")} />
          </g>
        </g>
        <path d="M-13,-2.5 L-26,-5.5 L-28,-4 L-29,-2 L-28.5,0 L-29,2 L-28,4 L-26,5 L-13,2Z" fill={token("eagle-white")} />
        <path d="M-9,4.6 L-12.5,6.4 L-11.6,5.2 L-13.2,5.4 L-10,4Z" fill={token("eagle-beak")} />
        <path d="M-15,-3 C-9,-7 4,-8.5 12,-6 C16,-4.5 16.5,0.5 12.5,2.5 C5,5.5 -8,4.8 -15,2.5Z" fill={token("eagle-body")} />
        <path d="M-2,2 C-4,5 -7,5.6 -9.5,5 C-8,3 -5,2 -3,1Z" fill={token("eagle-far")} />
        <path d="M9,-3 L10.5,-5.5 L9.5,-6.5 L11.5,-7.5 C14,-9.5 19,-9.8 22.5,-6.5 C24,-4.8 23,-2.2 20,-1.6 C16,-1 13,-0.5 11,-0.8 L11.8,-2Z" fill={token("eagle-white")} />
        <path d="M21.5,-6.3 C24.5,-6.8 26.6,-5.2 26.3,-2.8 C25.6,-3.6 24.6,-3.8 23.6,-3.6 L21.8,-3.4Z" fill={token("eagle-beak")} />
        <circle cx={19.6} cy={-5.6} r={0.75} fill={token("eagle-primary")} />
        <g className="animate-wing-beat motion-reduce:animate-none" style={wingOrigin}>
          <path d={EAGLE_WING} fill={token("eagle-wing")} />
          <path d={EAGLE_COVERTS} fill={token("eagle-covert")} />
          <path d={EAGLE_SECONDARIES} fill={token("eagle-primary")} opacity={0.55} />
          <path d={EAGLE_PRIMARIES} fill={token("eagle-primary")} />
        </g>
      </g>
    </g>
  );
}

/** Four small birds crossing high over the range in loose formation, each on its own wingbeat. */
function Flock() {
  return (
    <g className="motion-reduce:hidden" fill={token("bird")}>
      <animateMotion dur="80s" begin="-30s" repeatCount="indefinite" rotate="auto" path="M-120,270 C300,240 700,280 1000,236 S1500,220 1720,210" />
      {[
        [0, 0, 1],
        [-18, 7, 0.9],
        [-12, -8, 0.85],
        [-32, 2, 0.8],
      ].map(([dx, dy, s], i) => (
        <g key={i} transform={`translate(${dx} ${dy}) scale(${s})`}>
          <path d="M-6,0 C-3,-1.6 3,-1.6 6,-0.6 L7.6,0 L6,0.6 C3,1.6 -3,1.6 -6,0.5 L-8.5,1.6 L-7.6,0Z" />
          <path
            d="M1,-0.5 C-1,-4 -4,-7 -8,-8 C-5,-5 -3,-2 -2,0Z"
            className="animate-flap motion-reduce:animate-none"
            style={{ transformOrigin: "1px -0.5px", animationDelay: `${-i * 0.13}s` }}
          />
        </g>
      ))}
    </g>
  );
}

/** A butterfly flitting over the meadow: forewings and hindwings in its natural colour, edged dark, white-spotted. */
function Butterfly({ path, duration, delay, color }: { path: string; duration: number; delay: number; color: string }) {
  const wing = (s: 1 | -1) => (
    <>
      <path d={`M0,-0.5 C${s * 3},-7 ${s * 9},-8.5 ${s * 9.5},-5 C${s * 10},-2.5 ${s * 6},-0.5 0,0Z`} fill={token("wing-edge")} />
      <path d={`M0,-0.5 C${s * 3},-6 ${s * 8},-7.4 ${s * 8.4},-4.8 C${s * 8.6},-2.8 ${s * 5.5},-1.1 0,-0.2Z`} fill={color} />
      <path d={`M0,0.3 C${s * 4},0 ${s * 7},2 ${s * 6},5 C${s * 5},7 ${s * 2},5 0,1Z`} fill={token("wing-edge")} />
      <path d={`M0,0.4 C${s * 3.6},0.4 ${s * 6},2.2 ${s * 5.1},4.5 C${s * 4.3},5.8 ${s * 2},4.4 0,1Z`} fill={color} />
      <circle cx={s * 8.6} cy={-5.4} r={0.45} fill="#ffffff" />
      <circle cx={s * 7.4} cy={-6.6} r={0.4} fill="#ffffff" />
    </>
  );
  return (
    <g className="motion-reduce:hidden">
      <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
      <g className="animate-butterfly origin-center [transform-box:fill-box]">
        {wing(-1)}
        {wing(1)}
      </g>
      <ellipse cx={0} cy={0.5} rx={0.8} ry={3.4} fill={token("wing-edge")} />
      <path d="M-0.3,-2.6 C-1,-4.4 -2,-5.4 -3,-5.8 M0.3,-2.6 C1,-4.4 2,-5.4 3,-5.8" fill="none" stroke={token("wing-edge")} strokeWidth={0.35} strokeLinecap="round" />
    </g>
  );
}

const SKY_CLIP = ridge(FAR_RANGE, -BLEED);

/**
 * The dark theme's setting sun, drawn over the scene in the same cover-cropped frame and clipped to the sky so the
 * far range hides the 70% of it that has already set.
 */
export function SettingSun() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <defs>
        <clipPath id={`${id}-sky`}>
          <path d={SKY_CLIP} />
        </clipPath>
        <radialGradient id={`${id}-disc`}>
          <stop offset="55%" stopColor="var(--sun)" />
          <stop offset="80%" stopColor="var(--sunset-glow)" />
          <stop offset="100%" stopColor="var(--sunset-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}-sky)`}>
        <circle cx={1360} cy={411} r={80} fill="var(--sunset-glow)" opacity={0.4} className="blur-lg" />
        <circle cx={1360} cy={411} r={40} fill={`url(#${id}-disc)`} />
      </g>
    </svg>
  );
}
