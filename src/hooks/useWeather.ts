import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { fetchWeather, type WeatherSnapshot } from "@/lib/weather";

/** OpenWeather updates its model roughly every 10 minutes; polling faster only burns the free quota. */
const REFRESH_MS = 10 * 60 * 1000;
const CACHE_KEY = "weather";

type Cached = { at: number; lat: number; lon: number; weather: WeatherSnapshot };

type Location = { lat: number; lon: number; place?: string };

/** An IP rarely moves city within a visit; re-looking it up on every load would only spend the services' quota. */
const IP_LOCATION_TTL_MS = 6 * 60 * 60 * 1000;
const IP_LOCATION_KEY = "ip-location";

// Two decimals (~1 km) is plenty for weather and keeps the cache key stable.
const round = (n: number) => Math.round(n * 100) / 100;

/** The browser's precise position, only if the visitor has already allowed it; never prompts. */
async function grantedPosition(): Promise<Location | null> {
  const status = await navigator.permissions?.query({ name: "geolocation" });
  if (status?.state !== "granted") return null;
  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000, maximumAge: REFRESH_MS }),
  );
  return { lat: round(position.coords.latitude), lon: round(position.coords.longitude) };
}

/** Approximate city from the visitor's IP via free, keyless, CORS-enabled lookups (first that answers wins). */
async function ipLocation(): Promise<Location | null> {
  try {
    const cached = JSON.parse(localStorage.getItem(IP_LOCATION_KEY) ?? "null");
    if (cached && Date.now() - cached.at < IP_LOCATION_TTL_MS) return cached.location;
  } catch {
    // Corrupt entry; look it up again.
  }

  // Place names are left to OpenWeather, whose station names are more recognisable than IP-database districts.
  const lookups: (() => Promise<Location>)[] = [
    async () => {
      const r: { latitude: string; longitude: string } = await (
        await fetch("https://get.geojs.io/v1/ip/geo.json")
      ).json();
      return { lat: Number(r.latitude), lon: Number(r.longitude) };
    },
    async () => {
      const r: { success: boolean; latitude: number; longitude: number } = await (
        await fetch("https://ipwho.is/")
      ).json();
      if (!r.success) throw new Error("ipwho.is lookup failed");
      return { lat: r.latitude, lon: r.longitude };
    },
  ];

  for (const lookup of lookups) {
    try {
      const { lat, lon } = await lookup();
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      const location = { lat: round(lat), lon: round(lon) };
      localStorage.setItem(IP_LOCATION_KEY, JSON.stringify({ at: Date.now(), location }));
      return location;
    } catch {
      // Try the next service.
    }
  }
  return null;
}

/** Precise position if already granted, else the visitor's IP city, else the portfolio's own location. */
async function resolveLocation(): Promise<Location> {
  try {
    const precise = await grantedPosition();
    if (precise) return precise;
  } catch {
    // Permission revoked or position unavailable; fall through to the IP lookup.
  }
  return (await ipLocation()) ?? { ...profile.coordinates, place: profile.location.split(",")[0] };
}

/** Fresh cached conditions; without a location, any fresh entry will do for the first paint. */
function readCache(location?: Location): WeatherSnapshot | null {
  try {
    const cached: Cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null");
    const here = !location || (cached?.lat === location.lat && cached?.lon === location.lon);
    return cached && here && Date.now() - cached.at < REFRESH_MS ? cached.weather : null;
  } catch {
    return null;
  }
}

/** Live current conditions for the header, or `null` while loading, without an API key, or on failure. */
export function useWeather(): WeatherSnapshot | null {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(() => readCache());

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) return;

    const controller = new AbortController();

    const load = async () => {
      const location = await resolveLocation();
      const cached = readCache(location);
      if (cached) return setWeather(cached);
      try {
        const next = await fetchWeather(location, location.place, apiKey, controller.signal);
        setWeather(next);
        const entry: Cached = { at: Date.now(), lat: location.lat, lon: location.lon, weather: next };
        localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
      } catch {
        // Keep showing the last known conditions; the toggle falls back to sun/moon when there are none.
      }
    };

    load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, []);

  return weather;
}
