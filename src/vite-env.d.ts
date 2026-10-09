/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OpenWeather API key for the header weather; the header falls back to plain theme icons without it. */
  readonly VITE_OPENWEATHER_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
