// Nov 18 (per Mely): line sites / slips up like the Aloha map — straight rows, each one touching its
// neighbours, filling the space from the road (or dock) back to the row behind. Used on OpenStreetMap
// drafts when they open and by the editor's "Line up" button. Pure geometry, no network.
import type { Slip } from "./SlipMap";

const FT = 0.3048;
type V = [number, number];

export function tidySlips(slips: Slip[], roads: [number, number][][] = [], docks: [number, number][][] = []): Slip[] {
  if (slips.length < 2) return slips;
  const lat0 = slips.reduce((a, s) => a + s.lat, 0) / slips.length;
  const lon0 = slips.reduce((a, s) => a + s.lon, 0) / slips.length;
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 111320;
  const xy = (lat: number, lon: number): V => [(lon - lon0) * kx, (lat - lat0) * ky];
  const ll = (p: V): [number, number] => [lat0 + p[1] / ky, lon0 + p[0] / kx];
  const dir = (deg: number): V => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)]; // compass -> x,y
  const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1];
  const angDiff = (a: number, b: number) => { const d = Math.abs((((a - b) % 180) + 180) % 180); return Math.min(d, 180 - d); };

  const S = slips.map((s) => ({ s, c: xy(s.lat, s.lon), ang: s.ang, len: s.len * FT, wid: s.wid * FT }));
  // obstacles a site's front edge stops at: roads (~3 m half width) and docks (~1.3 m)
  const obst: { a: V; b: V; half: number }[] = [];
  for (const r of roads) for (let i = 0; i < r.length - 1; i++) obst.push({ a: xy(r[i][0], r[i][1]), b: xy(r[i + 1][0], r[i + 1][1]), half: 3 });
  for (const d of docks) for (let i = 0; i < d.length - 1; i++) obst.push({ a: xy(d[i][0], d[i][1]), b: xy(d[i + 1][0], d[i + 1][1]), half: 1.3 });

  // 1) rows: same orientation, side by side (offset mostly across the width axis)
  const parent = S.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const side = S.map(() => ({ l: Infinity, r: Infinity }));
  for (let i = 0; i < S.length; i++) {
    const u = dir(S[i].ang), v: V = [u[1], -u[0]];
    for (let j = 0; j < S.length; j++) {
      if (i === j || angDiff(S[i].ang, S[j].ang) > 20) continue;
      const d: V = [S[j].c[0] - S[i].c[0], S[j].c[1] - S[i].c[1]];
      const along = dot(d, u), across = dot(d, v);
      if (Math.abs(along) > Math.max(S[i].len, S[j].len) * 0.6 || Math.abs(across) > Math.max(S[i].wid, 3) * 3.2) continue;
      if (across > 0) side[i].r = Math.min(side[i].r, across); else side[i].l = Math.min(side[i].l, -across);
      if (Math.abs(across) < Math.max(S[i].wid, 3) * 3.2) parent[find(i)] = find(j);
    }
  }
  // 2) straighten each row: one angle, centres on one line
  const rows = new Map<number, number[]>();
  S.forEach((_, i) => { const r = find(i); rows.set(r, [...(rows.get(r) || []), i]); });
  for (const idx of rows.values()) {
    if (idx.length < 2) continue;
    // average orientation on the doubled-angle circle (a rectangle at 10° and 190° is the same)
    let sx = 0, sy = 0;
    for (const i of idx) { sx += Math.cos((S[i].ang * Math.PI) / 90); sy += Math.sin((S[i].ang * Math.PI) / 90); }
    const ang = ((((Math.atan2(sy, sx) * 90) / Math.PI) % 180) + 180) % 180;
    const u = dir(ang);
    const offs = idx.map((i) => dot(S[i].c, u)).sort((a, b) => a - b);
    const med = offs[Math.floor(offs.length / 2)];
    for (const i of idx) {
      const off = dot(S[i].c, u);
      S[i].c = [S[i].c[0] + u[0] * (med - off), S[i].c[1] + u[1] * (med - off)];
      S[i].ang = ang;
    }
  }
  // 3) width: touch the neighbours (centre-to-centre spacing)
  for (let i = 0; i < S.length; i++) {
    const { l, r } = side[i];
    const gaps = [l, r].filter((x) => x < Infinity);
    if (!gaps.length) continue;
    const w = gaps.length === 2 ? (l + r) / 2 : gaps[0];
    S[i].wid = Math.max(S[i].wid * 0.8, Math.min(w, S[i].wid * 3, 12));
  }
  // 4) length: front edge to the road / dock, back edge to the row behind (or keep its depth)
  const hit = (c: V, u: V, maxD: number) => {
    let best = Infinity, half = 0;
    for (const o of obst) {
      const e: V = [o.b[0] - o.a[0], o.b[1] - o.a[1]];
      const den = u[0] * e[1] - u[1] * e[0];
      if (Math.abs(den) < 1e-9) continue;
      const w: V = [o.a[0] - c[0], o.a[1] - c[1]];
      const t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * u[1] - w[1] * u[0]) / den;
      if (t > 0 && t < maxD && s >= 0 && s <= 1 && t < best) { best = t; half = o.half; }
    }
    return best < Infinity ? best - half - 0.4 : null;
  };
  const before = S.map((x) => ({ c: x.c, ang: x.ang, len: x.len }));
  for (let i = 0; i < S.length; i++) {
    const u = dir(S[i].ang);
    const f = hit(S[i].c, u, S[i].len / 2 + 12), b = hit(S[i].c, [-u[0], -u[1]], S[i].len / 2 + 12);
    let front: number, back: number, sgn: number;
    if (f !== null && (b === null || f <= b)) { front = f; sgn = 1; back = b !== null ? b : S[i].len / 2; }
    else if (b !== null) { front = b; sgn = -1; back = S[i].len / 2; }
    else continue;
    // back-to-back rows: meet halfway
    const ub: V = [-u[0] * sgn, -u[1] * sgn];
    let behind = Infinity;
    for (let j = 0; j < S.length; j++) {
      if (j === i || angDiff(before[i].ang, before[j].ang) > 20) continue;
      const d: V = [before[j].c[0] - before[i].c[0], before[j].c[1] - before[i].c[1]];
      const along = dot(d, ub), across = Math.abs(dot(d, [ub[1], -ub[0]]));
      if (along > 0 && across < S[i].wid * 1.2 && along < behind) behind = along;
    }
    if (behind < Infinity) back = Math.min(back + 4, behind / 2 - 0.2);
    else back = Math.max(back, S[i].len / 2);
    front = Math.max(front, 2);
    const L = Math.max(7, Math.min(front + back, 30));
    const shift = (front - back) / 2;
    S[i].c = [S[i].c[0] + u[0] * shift * sgn, S[i].c[1] + u[1] * shift * sgn];
    S[i].len = L;
  }
  return S.map(({ s, c, ang, len, wid }) => {
    const [lat, lon] = ll(c);
    return { ...s, lat: Math.round(lat * 1e7) / 1e7, lon: Math.round(lon * 1e7) / 1e7, ang: Math.round(ang) % 360, len: Math.round(len / FT), wid: Math.round((wid / FT) * 10) / 10 };
  });
}
