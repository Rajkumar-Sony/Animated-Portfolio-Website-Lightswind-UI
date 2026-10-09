"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";
import { INDIA_SOI_OUTLINE } from "./india-outline-soi";
import { Airplane } from "@/components/sections/SkyCraft";
import { AIRPLANE } from "@/components/sections/skyCraftSizes";

type LngLat = readonly [number, number];

export interface MapMarker {
  id?: string;
  lat: number;
  lng: number;
  label?: string;
  country?: string;
  timeZone?: string;
  ping?: string;
  size?: number;
  color?: string;
  pulse?: boolean;
  data?: unknown;
}

export interface MapArc {
  id?: string;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
}

export interface WorldMapProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  dotRadius?: number;
  dotColor?: string;
  markerColor?: string;
  pulseColor?: string;
  markers?: MapMarker[];
  arcs?: MapArc[];
  pulse?: boolean;
  stagger?: boolean;
  enableTooltips?: boolean;
  showTimezones?: boolean;
  interactive?: boolean;
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  renderMarkerOverlay?: (args: {
    marker: MapMarker;
    x: number;
    y: number;
    r: number;
  }) => React.ReactNode;
}

const INDIA_JAPAN_BOUNDS = {
  minLat: 6.5,
  maxLat: 46,
  minLng: 67.4,
  maxLng: 146,
};

const COUNTRY_OUTLINES: Array<{
  id: string;
  label: string;
  polygons: LngLat[][];
}> = [
  {
    id: "india",
    label: "India",
    polygons: INDIA_SOI_OUTLINE,
  },
  {
    id: "japan",
    label: "Japan",
    polygons: [
      [
        [134.638428, 34.149234],
        [134.766379, 33.806335],
        [134.203416, 33.201178],
        [133.79295, 33.521985],
        [133.280268, 33.28957],
        [133.014858, 32.704567],
        [132.363115, 32.989382],
        [132.371176, 33.463642],
        [132.924373, 34.060299],
        [133.492968, 33.944621],
        [133.904106, 34.364931],
        [134.638428, 34.149234],
      ],
      [
        [140.976388, 37.142074],
        [140.59977, 36.343983],
        [140.774074, 35.842877],
        [140.253279, 35.138114],
        [138.975528, 34.6676],
        [137.217599, 34.606286],
        [135.792983, 33.464805],
        [135.120983, 33.849071],
        [135.079435, 34.596545],
        [133.340316, 34.375938],
        [132.156771, 33.904933],
        [130.986145, 33.885761],
        [132.000036, 33.149992],
        [131.33279, 31.450355],
        [130.686318, 31.029579],
        [130.20242, 31.418238],
        [130.447676, 32.319475],
        [129.814692, 32.61031],
        [129.408463, 33.296056],
        [130.353935, 33.604151],
        [130.878451, 34.232743],
        [131.884229, 34.749714],
        [132.617673, 35.433393],
        [134.608301, 35.731618],
        [135.677538, 35.527134],
        [136.723831, 37.304984],
        [137.390612, 36.827391],
        [138.857602, 37.827485],
        [139.426405, 38.215962],
        [140.05479, 39.438807],
        [139.883379, 40.563312],
        [140.305783, 41.195005],
        [141.368973, 41.37856],
        [141.914263, 39.991616],
        [141.884601, 39.180865],
        [140.959489, 38.174001],
        [140.976388, 37.142074],
      ],
      [
        [143.910162, 44.1741],
        [144.613427, 43.960883],
        [145.320825, 44.384733],
        [145.543137, 43.262088],
        [144.059662, 42.988358],
        [143.18385, 41.995215],
        [141.611491, 42.678791],
        [141.067286, 41.584594],
        [139.955106, 41.569556],
        [139.817544, 42.563759],
        [140.312087, 43.333273],
        [141.380549, 43.388825],
        [141.671952, 44.772125],
        [141.967645, 45.551483],
        [143.14287, 44.510358],
        [143.910162, 44.1741],
      ],
    ],
  },
];

// Paint language shared with the bullet train and sky craft: brand-gradient hull so the
// craft reads on both themes, dark glazing, and restrained navigation lights.
export const DEFAULT_MARKERS: MapMarker[] = [
  { id: "bihar", lat: 25.0961, lng: 85.3131, label: "Bihar, India", country: "IN", timeZone: "Asia/Kolkata", ping: "Home", size: 3.5, pulse: true },
  { id: "japan", lat: 34.6937, lng: 135.5023, label: "Osaka, Japan", country: "JP", timeZone: "Asia/Tokyo", ping: "Now", size: 3.5, pulse: true },
];

export const DEFAULT_ARCS: MapArc[] = [
  {
    id: "bihar-to-osaka",
    start: { lat: 25.0961, lng: 85.3131 },
    end: { lat: 34.6937, lng: 135.5023 },
  },
];

export function latLngToXY(lat: number, lng: number, width: number = 800, height: number = 400) {
  const paddingX = width * 0.06;
  const paddingY = height * 0.01;
  const drawableWidth = width - paddingX * 2;
  const drawableHeight = height - paddingY * 2;
  const xRatio = (lng - INDIA_JAPAN_BOUNDS.minLng) / (INDIA_JAPAN_BOUNDS.maxLng - INDIA_JAPAN_BOUNDS.minLng);
  const yRatio = (INDIA_JAPAN_BOUNDS.maxLat - lat) / (INDIA_JAPAN_BOUNDS.maxLat - INDIA_JAPAN_BOUNDS.minLat);

  return {
    x: Math.max(paddingX, Math.min(width - paddingX, paddingX + xRatio * drawableWidth)),
    y: Math.max(paddingY, Math.min(height - paddingY, paddingY + yRatio * drawableHeight)),
  };
}

function polygonToPath(polygon: LngLat[], width: number, height: number) {
  return polygon
    .map(([lng, lat], index) => {
      const { x, y } = latLngToXY(lat, lng, width, height);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ")
    .concat(" Z");
}

export function WorldMap({
  width = 900,
  height = 450,
  dotRadius,
  dotColor,
  markerColor = "#3B82F6",
  pulseColor,
  markers = DEFAULT_MARKERS,
  arcs = DEFAULT_ARCS,
  pulse = true,
  stagger,
  enableTooltips = true,
  showTimezones,
  interactive = true,
  className,
  onMarkerClick,
  renderMarkerOverlay,
  style,
  ...svgProps
}: WorldMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  // Collision-safe prefix for the defs' gradient ids (a page can render several maps).
  const idPrefix = useId().replace(/:/g, "");
  void dotRadius;
  void dotColor;
  void stagger;
  void showTimezones;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLocalTime = (tz?: string) => {
    if (!tz) return now.toLocaleTimeString();
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(now);
    } catch {
      return now.toLocaleTimeString();
    }
  };

  const countryPaths = useMemo(
    () =>
      COUNTRY_OUTLINES.map((country) => ({
        ...country,
        paths: country.polygons.map((polygon) => polygonToPath(polygon, width, height)),
      })),
    [width, height],
  );

  const plottedMarkers = useMemo(() => {
    return markers.map((m) => {
      const { x, y } = latLngToXY(m.lat, m.lng, width, height);
      return { ...m, x, y };
    });
  }, [markers, width, height]);

  const plottedArcs = useMemo(() => {
    return arcs.map((arc, idx) => {
      const start = latLngToXY(arc.start.lat, arc.start.lng, width, height);
      const end = latLngToXY(arc.end.lat, arc.end.lng, width, height);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const midX = (start.x + end.x) / 2;
      const midY = (start.y + end.y) / 2 - dist * 0.22;

      return {
        id: arc.id || `arc-${idx}`,
        path: `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`,
        color: arc.color || markerColor,
        strokeWidth: arc.strokeWidth || 1.4,
        // Per-arc gradient runs start -> end so the route beam reads like the header's.
        gradientId: `${idPrefix}-route-${idx}`,
        start,
        end,
      };
    });
  }, [arcs, width, height, markerColor, idPrefix]);

  return (
    <div className={cn("relative flex size-full select-none flex-col items-center justify-center overflow-visible", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="size-full overflow-visible text-zinc-300 transition-colors duration-300 dark:text-zinc-700"
        style={{ width: "100%", height: "100%", ...style }}
        {...svgProps}
      >
        <defs>
          <radialGradient id="mapCenterGlow" cx="55%" cy="48%" r="55%">
            <stop offset="0%" stopColor={markerColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Route beam painted with the same accent gradient the header's BorderBeam uses. */}
          {plottedArcs.map((arc) => (
            <linearGradient key={arc.id} id={arc.gradientId} gradientUnits="userSpaceOnUse" x1={arc.start.x} y1={arc.start.y} x2={arc.end.x} y2={arc.end.y}>
              <stop offset="0" style={{ stopColor: "var(--accent-from)" }} />
              <stop offset="0.5" style={{ stopColor: "var(--accent-via)" }} />
              <stop offset="1" style={{ stopColor: "var(--accent-to)" }} />
            </linearGradient>
          ))}

          </defs>

        <rect width={width} height={height} fill="url(#mapCenterGlow)" opacity="0.75" />

        <g aria-hidden="true">
          {countryPaths.map((country) =>
            country.paths.map((path, index) => (
              <path
                key={`${country.id}-${index}`}
                d={path}
                fill="currentColor"
                fillOpacity="0.28"
                stroke="currentColor"
                strokeOpacity="0.82"
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
              />
            )),
          )}
        </g>

        <g className="pointer-events-none">
          {plottedArcs.map((arc) => (
            <g key={arc.id}>
              {/* Dotted flight-path guide; dashes drift gently along the route. */}
              <path
                d={arc.path}
                fill="none"
                stroke={`url(#${arc.gradientId})`}
                strokeWidth={arc.strokeWidth}
                strokeOpacity={0.45}
                strokeDasharray="1.5 5.5"
                strokeLinecap="round"
              >
                <animate attributeName="stroke-dashoffset" values="0;-14" dur="1.6s" repeatCount="indefinite" />
              </path>

              {/* The route "confirming": an accent line draws itself in on first view. */}
              <motion.path
                d={arc.path}
                fill="none"
                stroke={`url(#${arc.gradientId})`}
                strokeWidth={arc.strokeWidth + 0.5}
                strokeLinecap="round"
                strokeOpacity={0.9}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />

              {/* The flight: an airliner riding the arc, eased like takeoff -> cruise -> landing. */}
              <g>
                <animateMotion
                  dur="7s"
                  begin="1.4s"
                  repeatCount="indefinite"
                  rotate="auto"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.55 1"
                  path={arc.path}
                />
                {/* Fade in on departure, fade out on landing so the loop never teleports. */}
                <animate attributeName="opacity" dur="7s" begin="1.4s" repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.06;0.94;1" />
                {/* Soft engine warmth under the craft. */}
                <g transform={`scale(0.8) translate(${ -AIRPLANE.width / 2 } ${ -AIRPLANE.height / 2 })`}>
                  {/* The hero's airliner, riding the route with its own contrail and live lights.
                      Sized in map units via attributes — CSS classes lose to the base size-full. */}
                  <Airplane heading={1} width={120} height={40} />
                </g>
              </g>
            </g>
          ))}
        </g>

        {plottedMarkers.map((marker, idx) => {
          const r = marker.size || 3.5;
          const mColor = marker.color || markerColor;
          const pColor = pulseColor || mColor;
          const shouldPulse = pulse || marker.pulse;
          const isHovered = hoveredMarker?.id === marker.id || (hoveredMarker?.lat === marker.lat && hoveredMarker?.lng === marker.lng);

          return (
            <g
              key={marker.id || `marker-${idx}`}
              className={interactive ? "cursor-pointer group" : ""}
              onMouseEnter={() => interactive && setHoveredMarker(marker)}
              onMouseLeave={() => interactive && setHoveredMarker(null)}
              onClick={() => onMarkerClick?.(marker)}
            >
              {shouldPulse && (
                <g pointerEvents="none">
                  <circle cx={marker.x} cy={marker.y} r={r} fill="none" stroke={pColor} strokeWidth={1} strokeOpacity={0.8}>
                    <animate attributeName="r" values={`${r};${r * 4.2}`} dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={marker.x} cy={marker.y} r={r} fill="none" stroke={pColor} strokeWidth={0.8} strokeOpacity={0.6}>
                    <animate attributeName="r" values={`${r};${r * 4.2}`} dur="1.8s" begin="0.9s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              <circle cx={marker.x} cy={marker.y} r={isHovered ? r * 1.45 : r} fill={mColor} className="transition-all duration-200 drop-shadow-md" />
              <circle cx={marker.x} cy={marker.y} r={r * 0.4} fill="#FFFFFF" />
              {renderMarkerOverlay?.({ marker, x: marker.x, y: marker.y, r })}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {enableTooltips && hoveredMarker && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute z-50 min-w-[200px] rounded-2xl border border-zinc-200 bg-white/95 p-3 text-left shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95"
            style={{
              left: `${(latLngToXY(hoveredMarker.lat, hoveredMarker.lng, width, height).x / width) * 100}%`,
              top: `${(latLngToXY(hoveredMarker.lat, hoveredMarker.lng, width, height).y / height) * 100}%`,
              transform: "translate(-50%, -125%)",
            }}
          >
            <div className="mb-2 flex items-center justify-between gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
              <div className="flex min-w-0 items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-primarylw" />
                <span className="truncate text-xs font-bold text-zinc-900 dark:text-white">
                  {hoveredMarker.label || `${hoveredMarker.lat.toFixed(1)} deg, ${hoveredMarker.lng.toFixed(1)} deg`}
                </span>
              </div>
              {hoveredMarker.ping && (
                <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {hoveredMarker.ping}
                </span>
              )}
            </div>

            <div className="space-y-1 text-[11px]">
              {hoveredMarker.timeZone && (
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Local Time
                  </span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-200">{formatLocalTime(hoveredMarker.timeZone)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                <span>Coordinates</span>
                <span className="font-mono text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                  {hoveredMarker.lat.toFixed(2)} deg, {hoveredMarker.lng.toFixed(2)} deg
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorldMap;
