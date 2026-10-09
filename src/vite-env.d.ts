/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** OpenWeather API key for the header weather; the header falls back to plain theme icons without it. */
  readonly VITE_OPENWEATHER_API_KEY?: string;
  /**
   * Endpoint that receives resume requests (e.g. a Formspree/Web3Forms URL or
   * your own API). Without it, the resume-request popup falls back to a
   * prefilled email to the profile address.
   */
  readonly VITE_RESUME_REQUEST_ENDPOINT?: string;
  /**
   * Endpoint that receives contact-form submissions (your resume server's
   * /api/contact). Without it, the contact form falls back to a prefilled
   * email to the profile address.
   */
  readonly VITE_CONTACT_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
