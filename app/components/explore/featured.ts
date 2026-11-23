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

// Nov 17 (per Mely): the property's own live MelyOS lot/slip map (book online right there),
// shown on its Explore page instead of only a street map.
export const FEATURED_MAP: Record<string, string> = {
  "melyos-aloha": "https://aloha-rv-park-lilac.vercel.app/?park_id=aloha",
};

// Nov 20 (per Mely): what each MelyOS property offers, for the Explore filters (amenities + stay types).
// Edit here when a client adds or changes an amenity.
export const FEATURED_INFO: Record<string, { amenities: string; stays: string[] }> = {
  "melyos-aloha": { amenities: "Full hookups, 30/50 amp, water, sewer, laundry, propane", stays: ["week", "month", "year"] },
};

// Nov 20 (per Mely): sales demos — a prospect's live map, shown on its Explore page only with ?demo=<id>.
export const DEMO_MAP: Record<string, string> = {
  "x-21-palms": "/explore/live/21palms/index.html",
  // Nov 22 (per Mely): Johnston Springs demo starts on the Florida map — /explore/fl?demo=w1551804176
  "w1551804176": "/explore/live/johnston/index.html",
};

// Nov 21 (per Mely): photo for a sales-demo prospect (list card + pin preview), only with ?demo=<id>.
export const DEMO_PHOTO: Record<string, string> = {
  "x-21-palms": "/explore/featured/21palms.jpg",
  "w1551804176": "/explore/live/johnston/lot.jpg",
};

// Nov 21 (per Mely — full demo): stays longer than 15 nights / monthly / residency go to the park's online
// application. Demo maps use the MelyOS sample park's real application.
export const DEMO_APPLY: Record<string, string> = { "x-21-palms": "https://demo.melyos.io/apply", "w1551804176": "/explore/live/johnston/apply.html" };


// Nov 22 (per Mely): width ÷ height of a demo park map, so a wide map fills the page like the Florida map.
export const DEMO_RATIO: Record<string, number> = { "w1551804176": 2840 / 2216 };

// Nov 22 (per Mely): extras on a demo's "Book your site" — RV storage tab (connected to the map) and online towing.
export const DEMO_EXTRAS: Record<string, { storage?: boolean; towUrl?: string; towLabel?: string }> = {
  "w1551804176": { storage: true, towUrl: "/explore/live/johnston/tow.html", towLabel: "tow to Cypress Cove" },
};
