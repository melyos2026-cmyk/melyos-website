// Nov 20 (per Mely): MelyOS Explore filters — our own amenity list and line icons.
// A place matches when its owner listed the amenity (claim form "Amenities" text or the
// MelyOS client's own list). Keywords are matched lowercase inside that text.
export type Amen = { id: string; label: string; kinds: string[]; kw: string[]; icon: string };

// 24×24 line icons (stroke = currentColor), drawn for MelyOS.
const I = {
  plug: '<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  water: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  sewer: '<path d="M4 10h16M6 10v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/><path d="M9 6c0-1.7 1.3-3 3-3s3 1.3 3 3v4"/>',
  wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>',
  pool: '<path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5"/><path d="M7 15V5a2 2 0 0 1 4 0M17 15V5a2 2 0 0 0-4 0M7 9h10M7 12h10"/>',
  laundry: '<rect x="4" y="2.5" width="16" height="19" rx="2.5"/><circle cx="12" cy="13" r="4.5"/><path d="M8 6h.01M11 6h.01"/>',
  shower: '<path d="M4 20V8a5 5 0 0 1 9-3"/><path d="M10 7h8a3 3 0 0 0-8 0zM12 11v1M15 11v2M18 11v1M13 15v1M17 15v1"/>',
  pet: '<circle cx="5" cy="11" r="1.8"/><circle cx="9" cy="6.5" r="1.8"/><circle cx="15" cy="6.5" r="1.8"/><circle cx="19" cy="11" r="1.8"/><path d="M8 17.5c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5c0 1.6-1.4 2.5-4 2.5s-4-.9-4-2.5z"/>',
  gym: '<path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12"/>',
  propane: '<rect x="6" y="6" width="12" height="15" rx="5"/><path d="M9 6V3h6v3M6 12h12"/>',
  dump: '<path d="M3 17h13l3-5h2v5h-2M3 17V9h11v8"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="16" cy="18.5" r="1.8"/>',
  pull: '<path d="M3 12h15M14 7l5 5-5 5"/><path d="M3 6h6M3 18h6"/>',
  fish: '<path d="M3 12c3-4 8-5 12-3l4-3v12l-4-3c-4 2-9 1-12-3z"/><circle cx="8" cy="11" r=".8" fill="currentColor"/>',
  fuel: '<rect x="4" y="3" width="10" height="18" rx="1.5"/><path d="M4 9h10M14 8l4 3v7a1.5 1.5 0 0 0 3 0v-8l-3-3"/>',
  pump: '<path d="M6 21V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v13M9 21v-6h6v6M12 2v3"/>',
  dock: '<path d="M2 14h20M5 14v6M12 14v6M19 14v6"/><path d="M2 18c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1"/><path d="M8 14V8l4-4 4 4v6"/>',
  ramp: '<path d="M2 19 20 8M2 19h20"/><path d="M12 9.5c1.5-1.5 4-2.5 7-2.5"/>',
  store: '<path d="M4 9h16l-1.5-5h-13zM5 9v11h14V9M10 20v-6h4v6"/>',
  ice: '<path d="M12 2v20M3.5 7l17 10M20.5 7l-17 10"/><path d="m9 3.5 3 2 3-2M9 20.5l3-2 3 2"/>',
  boat: '<path d="M3 15h18l-2.5 5h-13z"/><path d="M12 3v12M12 4l6 9h-6"/>',
  ada: '<circle cx="12" cy="4" r="1.6"/><path d="M11 7v6h5l2 5M11 10h4"/><path d="M8.5 11.5A5 5 0 1 0 15 18"/>',
  clubhouse: '<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-5h4v5"/>',
  security: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
};

export const AMENITIES: Amen[] = [
  { id: "full", label: "Full hookups", kinds: ["r", "c"], kw: ["full hook", "full-hook", "fhu"], icon: I.plug },
  { id: "amp", label: "30/50 amp", kinds: ["r", "c"], kw: ["50 amp", "30 amp", "50amp", "30amp", "30/50", "electric"], icon: I.plug },
  { id: "water", label: "Water hookup", kinds: ["r", "c", "m"], kw: ["water"], icon: I.water },
  { id: "sewer", label: "Sewer", kinds: ["r", "c"], kw: ["sewer"], icon: I.sewer },
  { id: "pull", label: "Pull-through sites", kinds: ["r", "c"], kw: ["pull-through", "pull through", "pull-thru", "pull thru"], icon: I.pull },
  { id: "wifi", label: "Wi-Fi", kinds: ["r", "c", "m"], kw: ["wi-fi", "wifi", "internet"], icon: I.wifi },
  { id: "pool", label: "Pool", kinds: ["r", "c", "m"], kw: ["pool"], icon: I.pool },
  { id: "laundry", label: "Laundry", kinds: ["r", "c", "m"], kw: ["laundry"], icon: I.laundry },
  { id: "shower", label: "Showers", kinds: ["r", "c", "m"], kw: ["shower", "bath house", "bathhouse", "restroom"], icon: I.shower },
  { id: "pet", label: "Pet friendly", kinds: ["r", "c", "m"], kw: ["pet", "dog"], icon: I.pet },
  { id: "gym", label: "Fitness center", kinds: ["r", "c", "m"], kw: ["fitness", "gym", "weight"], icon: I.gym },
  { id: "propane", label: "Propane", kinds: ["r", "c"], kw: ["propane", "lp gas"], icon: I.propane },
  { id: "dump", label: "Dump station", kinds: ["r", "c"], kw: ["dump"], icon: I.dump },
  { id: "club", label: "Clubhouse", kinds: ["r", "c", "m"], kw: ["clubhouse", "club house", "lounge"], icon: I.clubhouse },
  { id: "fish", label: "Fishing", kinds: ["r", "c", "m"], kw: ["fish", "lake"], icon: I.fish },
  { id: "ada", label: "Accessible", kinds: ["r", "c", "m"], kw: ["handicap", "accessible", "ada"], icon: I.ada },
  { id: "gated", label: "Gated / security", kinds: ["r", "c", "m"], kw: ["gated", "security", "gate"], icon: I.security },
  { id: "fuel", label: "Fuel dock", kinds: ["m"], kw: ["fuel", "gas", "diesel"], icon: I.fuel },
  { id: "pumpout", label: "Pump-out", kinds: ["m"], kw: ["pump-out", "pump out", "pumpout"], icon: I.pump },
  { id: "float", label: "Floating docks", kinds: ["m"], kw: ["floating"], icon: I.dock },
  { id: "ramp", label: "Boat ramp", kinds: ["m"], kw: ["ramp", "launch"], icon: I.ramp },
  { id: "store", label: "Ship store", kinds: ["m"], kw: ["store", "ship store", "market"], icon: I.store },
  { id: "ice", label: "Ice", kinds: ["m"], kw: ["ice"], icon: I.ice },
  { id: "dry", label: "Dry storage", kinds: ["m"], kw: ["dry stack", "dry storage", "storage"], icon: I.boat },
];

export const STAY_FILTERS: [string, string][] = [["night", "Nightly"], ["week", "Weekly"], ["month", "Monthly"], ["season", "Seasonal"], ["year", "Annual"]];

export function AmenIcon({ svg, size = 18 }: { svg: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export const hasAmen = (text: string, a: Amen) => {
  const t = text.toLowerCase();
  return a.kw.some((k) => (k.length <= 3 ? new RegExp(`\\b${k}\\b`).test(t) : t.includes(k)));
};
