import { profile } from "@/data/portfolio";

/** Route-map station number for a career stop, e.g. "RS 03". */
export const stationCode = (number: number) => `${profile.initials} ${String(number).padStart(2, "0")}`;

/** How far (px) the train's clip extends up into the departure tunnel, and how deep its nose waits inside. */
export const TUNNEL_DEPTH = 60;
export const TUNNEL_REST = 18;
