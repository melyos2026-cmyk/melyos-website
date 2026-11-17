import type { Row } from "./states";
// Nov 17: listing page URLs (shared by the map, the pages and the sitemap): /explore/fl/hammock-beach-marina--melyos-hbm
export const slugify = (s: string) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "place";
export const nice = (n: string) => (n === n.toLowerCase() ? n.replace(/\b\w/g, (c) => c.toUpperCase()) : n);
export const listingPath = (state: string, r: Row) => `/explore/${state.toLowerCase()}/${slugify(nice(r[1]))}--${r[7]}`;
export const keyFromSlug = (slug: string) => { const i = slug.lastIndexOf("--"); return i >= 0 ? slug.slice(i + 2) : ""; };
