/** What the header shows for the current conditions, independent of which OpenWeather API answered. */
export type WeatherKind =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "overcast"
  | "drizzle"
  | "rain"
  | "heavy-rain"
  | "storm"
  | "snow"
  | "sleet"
  | "fog"
  | "wind"
  | "tornado";

export type WeatherSnapshot = {
  kind: WeatherKind;
  /** Daytime at the location, from OpenWeather's own day/night icon variant. */
  isDay: boolean;
  description: string;
  /** °C */
  temp: number;
  place: string;
};

type Condition = { id: number; description: string; icon: string };

const API = "https://api.openweathermap.org/data";

/** Maps an OpenWeather condition code (https://openweathermap.org/weather-conditions) to a kind. */
export function weatherKind(id: number): WeatherKind {
  if (id >= 200 && id < 300) return "storm";
  if (id >= 300 && id < 400) return "drizzle";
  if (id === 511) return "sleet";
  if ([502, 503, 504, 522, 531].includes(id)) return "heavy-rain";
  if (id >= 500 && id < 600) return "rain";
  if ([611, 612, 613, 615, 616].includes(id)) return "sleet";
  if (id >= 600 && id < 700) return "snow";
  if (id === 781) return "tornado";
  if (id === 771) return "wind";
  if (id >= 700 && id < 800) return "fog";
  if (id === 801 || id === 802) return "partly-cloudy";
  if (id === 803) return "cloudy";
  if (id === 804) return "overcast";
  return "clear";
}

function snapshot(condition: Condition, temp: number, place: string): WeatherSnapshot {
  return {
    kind: weatherKind(condition.id),
    isDay: !condition.icon.endsWith("n"),
    description: condition.description,
    temp: Math.round(temp),
    place,
  };
}

/**
 * Current conditions at a point. Prefers One Call 4.0 and falls back to the Current Weather 2.5 endpoint,
 * which every OpenWeather key can use (4.0 needs the separate "One Call by Call" subscription).
 */
export async function fetchWeather(
  { lat, lon }: { lat: number; lon: number },
  place: string | undefined,
  apiKey: string,
  signal?: AbortSignal,
): Promise<WeatherSnapshot> {
  const query = `lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const v4 = await fetch(`${API}/4.0/onecall/current?${query}`, { signal });
  if (v4.ok) {
    const body: { data: { temp: number; weather: Condition[] }[] } = await v4.json();
    const now = body.data[0];
    return snapshot(now.weather[0], now.temp, place ?? "Your location");
  }

  const v25 = await fetch(`${API}/2.5/weather?${query}`, { signal });
  if (!v25.ok) throw new Error(`OpenWeather responded ${v25.status}`);
  const body: { name: string; main: { temp: number }; weather: Condition[] } = await v25.json();
  return snapshot(body.weather[0], body.main.temp, place ?? body.name);
}
