"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

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
  minLat: 7.4,
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
    polygons: [
      [
        [77.837451, 35.49401],
        [78.912269, 34.321936],
        [78.811086, 33.506198],
        [79.208892, 32.994395],
        [79.176129, 32.48378],
        [78.458446, 32.618164],
        [78.738894, 31.515906],
        [79.721367, 30.882715],
        [81.111256, 30.183481],
        [80.476721, 29.729865],
        [80.088425, 28.79447],
        [81.057203, 28.416095],
        [81.999987, 27.925479],
        [83.304249, 27.364506],
        [84.675018, 27.234901],
        [85.251779, 26.726198],
        [86.024393, 26.630985],
        [87.227472, 26.397898],
        [88.060238, 26.414615],
        [88.174804, 26.810405],
        [88.043133, 27.445819],
        [88.120441, 27.876542],
        [88.730326, 28.086865],
        [88.814248, 27.299316],
        [88.835643, 27.098966],
        [89.744528, 26.719403],
        [90.373275, 26.875724],
        [91.217513, 26.808648],
        [92.033484, 26.83831],
        [92.103712, 27.452614],
        [91.696657, 27.771742],
        [92.503119, 27.896876],
        [93.413348, 28.640629],
        [94.56599, 29.277438],
        [95.404802, 29.031717],
        [96.117679, 29.452802],
        [96.586591, 28.83098],
        [96.248833, 28.411031],
        [97.327114, 28.261583],
        [97.402561, 27.882536],
        [97.051989, 27.699059],
        [97.133999, 27.083774],
        [96.419366, 27.264589],
        [95.124768, 26.573572],
        [95.155153, 26.001307],
        [94.603249, 25.162495],
        [94.552658, 24.675238],
        [94.106742, 23.850741],
        [93.325188, 24.078556],
        [93.286327, 23.043658],
        [93.060294, 22.703111],
        [93.166128, 22.27846],
        [92.672721, 22.041239],
        [92.146035, 23.627499],
        [91.869928, 23.624346],
        [91.706475, 22.985264],
        [91.158963, 23.503527],
        [91.46773, 24.072639],
        [91.915093, 24.130414],
        [92.376202, 24.976693],
        [91.799596, 25.147432],
        [90.872211, 25.132601],
        [89.920693, 25.26975],
        [89.832481, 25.965082],
        [89.355094, 26.014407],
        [88.563049, 26.446526],
        [88.209789, 25.768066],
        [88.931554, 25.238692],
        [88.306373, 24.866079],
        [88.084422, 24.501657],
        [88.69994, 24.233715],
        [88.52977, 23.631142],
        [88.876312, 22.879146],
        [89.031961, 22.055708],
        [88.888766, 21.690588],
        [88.208497, 21.703172],
        [86.975704, 21.495562],
        [87.033169, 20.743308],
        [86.499351, 20.151638],
        [85.060266, 19.478579],
        [83.941006, 18.30201],
        [83.189217, 17.671221],
        [82.192792, 17.016636],
        [82.191242, 16.556664],
        [81.692719, 16.310219],
        [80.791999, 15.951972],
        [80.324896, 15.899185],
        [80.025069, 15.136415],
        [80.233274, 13.835771],
        [80.286294, 13.006261],
        [79.862547, 12.056215],
        [79.857999, 10.357275],
        [79.340512, 10.308854],
        [78.885345, 9.546136],
        [79.18972, 9.216544],
        [78.277941, 8.933047],
        [77.941165, 8.252959],
        [77.539898, 7.965535],
        [76.592979, 8.899276],
        [76.130061, 10.29963],
        [75.746467, 11.308251],
        [75.396101, 11.781245],
        [74.864816, 12.741936],
        [74.616717, 13.992583],
        [74.443859, 14.617222],
        [73.534199, 15.990652],
        [73.119909, 17.92857],
        [72.820909, 19.208234],
        [72.824475, 20.419503],
        [72.630533, 21.356009],
        [71.175273, 20.757441],
        [70.470459, 20.877331],
        [69.16413, 22.089298],
        [69.644928, 22.450775],
        [69.349597, 22.84318],
        [68.176645, 23.691965],
        [68.842599, 24.359134],
        [71.04324, 24.356524],
        [70.844699, 25.215102],
        [70.282873, 25.722229],
        [70.168927, 26.491872],
        [69.514393, 26.940966],
        [70.616496, 27.989196],
        [71.777666, 27.91318],
        [72.823752, 28.961592],
        [73.450638, 29.976413],
        [74.42138, 30.979815],
        [74.405929, 31.692639],
        [75.258642, 32.271105],
        [74.451559, 32.7649],
        [74.104294, 33.441473],
        [73.749948, 34.317699],
        [74.240203, 34.748887],
        [75.757061, 34.504923],
        [76.871722, 34.653544],
        [77.837451, 35.49401],
      ],
    ],
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
      };
    });
  }, [arcs, width, height, markerColor]);

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
              <path d={arc.path} fill="none" stroke={arc.color} strokeWidth={arc.strokeWidth} strokeOpacity={0.55} strokeDasharray="5 5" />
              <circle r={2.4} fill={arc.color}>
                <animateMotion path={arc.path} dur="4s" repeatCount="indefinite" />
              </circle>
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
