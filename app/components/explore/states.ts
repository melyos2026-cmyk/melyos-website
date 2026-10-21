// Oct 21 (per Mely): MelyOS Explore — US states, center and zoom for the map.
export const STATES: Record<string, [string, number, number, number]> = {
  AL: ["Alabama", 32.8, -86.8, 7], AK: ["Alaska", 61.4, -150.0, 4], AZ: ["Arizona", 34.3, -111.7, 6], AR: ["Arkansas", 34.9, -92.4, 7],
  CA: ["California", 37.2, -119.5, 6], CO: ["Colorado", 39.0, -105.5, 7], CT: ["Connecticut", 41.6, -72.7, 8], DE: ["Delaware", 39.0, -75.5, 8],
  DC: ["District of Columbia", 38.9, -77.03, 11], FL: ["Florida", 28.1, -81.6, 7], GA: ["Georgia", 32.7, -83.4, 7], HI: ["Hawaii", 20.6, -157.4, 7],
  ID: ["Idaho", 44.4, -114.6, 6], IL: ["Illinois", 40.0, -89.2, 7], IN: ["Indiana", 39.9, -86.3, 7], IA: ["Iowa", 42.0, -93.5, 7],
  KS: ["Kansas", 38.5, -98.4, 7], KY: ["Kentucky", 37.5, -85.3, 7], LA: ["Louisiana", 31.0, -92.0, 7], ME: ["Maine", 45.3, -69.2, 7],
  MD: ["Maryland", 39.0, -76.8, 8], MA: ["Massachusetts", 42.3, -71.8, 8], MI: ["Michigan", 44.3, -85.4, 6], MN: ["Minnesota", 46.3, -94.3, 6],
  MS: ["Mississippi", 32.7, -89.7, 7], MO: ["Missouri", 38.4, -92.5, 7], MT: ["Montana", 47.0, -109.6, 6], NE: ["Nebraska", 41.5, -99.8, 7],
  NV: ["Nevada", 39.3, -116.6, 6], NH: ["New Hampshire", 43.7, -71.6, 8], NJ: ["New Jersey", 40.1, -74.7, 8], NM: ["New Mexico", 34.4, -106.1, 7],
  NY: ["New York", 42.9, -75.5, 7], NC: ["North Carolina", 35.5, -79.4, 7], ND: ["North Dakota", 47.4, -100.5, 7], OH: ["Ohio", 40.3, -82.8, 7],
  OK: ["Oklahoma", 35.6, -97.5, 7], OR: ["Oregon", 44.0, -120.6, 7], PA: ["Pennsylvania", 40.9, -77.8, 7], RI: ["Rhode Island", 41.7, -71.5, 9],
  SC: ["South Carolina", 33.9, -80.9, 7], SD: ["South Dakota", 44.4, -100.2, 7], TN: ["Tennessee", 35.8, -86.4, 7], TX: ["Texas", 31.0, -99.3, 6],
  UT: ["Utah", 39.3, -111.7, 7], VT: ["Vermont", 44.0, -72.7, 8], VA: ["Virginia", 37.5, -78.8, 7], WA: ["Washington", 47.4, -120.5, 7],
  WV: ["West Virginia", 38.6, -80.6, 7], WI: ["Wisconsin", 44.6, -89.9, 7], WY: ["Wyoming", 43.0, -107.5, 7],
};
export const KIND: Record<string, { label: string; plural: string; color: string }> = {
  m: { label: "Marina", plural: "Marinas", color: "#0284c7" },
  r: { label: "RV park", plural: "RV parks", color: "#16a34a" },
  c: { label: "Campground", plural: "Campgrounds", color: "#d97706" },
};
export type Row = [string, string, number, number, string, string, string, string]; // kind, name, lat, lon, city, phone, website, osm id
