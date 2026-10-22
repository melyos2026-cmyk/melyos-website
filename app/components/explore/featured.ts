import type { Row } from "./states";

// Oct 21 (per Mely): properties that run on MelyOS. They always show on Explore (even when
// the public map data doesn't have them), with a "Book online" button to their own website.
// Row: [kind m/r/c, name, lat, lon, city, phone, website, id] — id starts with "melyos-".
export const FEATURED: Record<string, Row[]> = {
  FL: [
    ["r", "Aloha RV Park", 28.2554, -81.4691, "Kissimmee", "", "https://aloharvparkfl.com", "melyos-aloha"],
  ],
};
export const isFeatured = (r: Row) => String(r[7]).startsWith("melyos-");

// Preview photo shown at the top of the pin (the property's own header photo).
export const FEATURED_PHOTO: Record<string, string> = {
  "melyos-aloha": "/explore/featured/aloha.jpg",
};
