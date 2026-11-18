// Nov 18 (per Mely): line sites / slips up like the Aloha map — straight rows, each one touching its
// neighbours, filling the space from the road (or dock) back to the row behind. Used on OpenStreetMap
// drafts when they open and by the editor's "Line up" button. Pure geometry, no network.
import type { Slip } from "./SlipMap";

const FT = 0.3048;
type V = [number, number];

export function tidySlips(slips: Slip[], roads: [number, number][][] = [], docks: [number, number][][] = []): Slip[] {
  if (slips.length < 2) return slips;
  if (roads.length) return tidyByRoads(slips, roads);
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


// Nov 18 (per Mely): parks with roads — every site faces its road square-on, sites on the same side of the
// same road touch edge to edge (no gaps), front edge at the road, back edge halfway to the next road / row.
function tidyByRoads(slips: Slip[], roads: [number, number][][]): Slip[] {
  const lat0 = slips.reduce((a, s) => a + s.lat, 0) / slips.length;
  const lon0 = slips.reduce((a, s) => a + s.lon, 0) / slips.length;
  const kx = 111320 * Math.cos((lat0 * Math.PI) / 180), ky = 111320;
  const xy = (lat: number, lon: number): V => [(lon - lon0) * kx, (lat - lat0) * ky];
  const ll = (p: V): [number, number] => [lat0 + p[1] / ky, lon0 + p[0] / kx];
  const HALF = 3; // road half width (m)
  // road segments with their running distance along their road (to order sites along it)
  const segs: { a: V; b: V; road: number; t0: number; len: number; u: V }[] = [];
  roads.forEach((r, ri) => {
    let t = 0;
    for (let i = 0; i < r.length - 1; i++) {
      const a = xy(r[i][0], r[i][1]), b = xy(r[i + 1][0], r[i + 1][1]);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L > 0.5) segs.push({ a, b, road: ri, t0: t, len: L, u: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] });
      t += L;
    }
  });
  // the road a site faces: near, AND square to the site's long side (so corner sites don't jump to the cross street)
  const nearest = (c: V, s: Slip) => {
    let best: any = null;
    const elongated = s.len / Math.max(1, s.wid) > 1.15;
    const sa = (s.ang * Math.PI) / 180;
    for (const sg of segs) {
      const w: V = [c[0] - sg.a[0], c[1] - sg.a[1]];
      const tt = Math.max(0, Math.min(sg.len, w[0] * sg.u[0] + w[1] * sg.u[1]));
      const p: V = [sg.a[0] + sg.u[0] * tt, sg.a[1] + sg.u[1] * tt];
      const dist = Math.hypot(c[0] - p[0], c[1] - p[1]);
      // |cos| between the site's long axis and the road direction: 0 = square on (good), 1 = parallel (bad)
      const par = Math.abs(Math.sin(sa) * sg.u[0] + Math.cos(sa) * sg.u[1]);
      const d = dist + (elongated ? par * 30 : 0);
      if (!best || d < best.score) {
        const cross = sg.u[0] * w[1] - sg.u[1] * w[0];
        best = { score: d, d: dist, sg, t: sg.t0 + tt, tt, side: cross >= 0 ? 1 : -1 };
      }
    }
    return best;
  };
  // ray from a point to the first road crossing (m), ignoring the road we start from
  const ray = (c: V, n: V, skipRoad: number, maxD: number) => {
    let best = Infinity;
    for (const sg of segs) {
      if (sg.road === skipRoad) continue;
      const e: V = [sg.b[0] - sg.a[0], sg.b[1] - sg.a[1]];
      const den = n[0] * e[1] - n[1] * e[0];
      if (Math.abs(den) < 1e-9) continue;
      const w: V = [sg.a[0] - c[0], sg.a[1] - c[1]];
      const t = (w[0] * e[1] - w[1] * e[0]) / den, s = (w[0] * n[1] - w[1] * n[0]) / den;
      if (t > 0.5 && t < maxD && s >= 0 && s <= 1) best = Math.min(best, t);
    }
    return best;
  };

  type R = { i: number; s: Slip; c: V; n: any };
  const placed: Slip[] = slips.map((s) => ({ ...s }));
  const groups = new Map<string, R[]>();
  slips.forEach((s, i) => {
    const c = xy(s.lat, s.lon);
    const n = nearest(c, s);
    if (!n || n.d > 35) return; // no road near: leave it as drawn
    // row = same road, same side, similar distance (a second row behind would be farther)
    const band = Math.floor(Math.max(0, n.d - HALF) / 16);
    const k = `${n.sg.road}|${n.side}|${band}`;
    groups.set(k, [...(groups.get(k) || []), { i, s, c, n }]);
  });

  for (const [, row] of groups) {
    row.sort((a, b) => a.n.t - b.n.t);
    const ws = row.map((r) => Math.max(2.5, r.s.wid * FT));
    const medW = [...ws].sort((a, b) => a - b)[Math.floor(ws.length / 2)];
    // boundaries along the road: halfway between neighbours (gap closed when it's < ~2.2 sites)
    const lo: number[] = [], hi: number[] = [];
    for (let k = 0; k < row.length; k++) {
      const t = row[k].n.t;
      const prev = k > 0 ? row[k - 1].n.t : null, next = k < row.length - 1 ? row[k + 1].n.t : null;
      lo[k] = prev !== null && t - prev < Math.max(medW * 3.6, 16) ? (t + prev) / 2 : t - medW / 2;
      hi[k] = next !== null && next - t < Math.max(medW * 3.6, 16) ? (t + next) / 2 : t + medW / 2;
    }
    for (let k = 0; k < row.length; k++) {
      const { i, s, n } = row[k];
      const sg = n.sg;
      const nrm: V = [-sg.u[1] * n.side, sg.u[0] * n.side]; // from the road towards the site
      const tMid = (lo[k] + hi[k]) / 2;
      const width = Math.max(2.5, Math.min(hi[k] - lo[k], 20));
      // the point on the road at tMid (stay on this segment's line; roads are near-straight between nodes)
      const tt = tMid - sg.t0;
      const base: V = [sg.a[0] + sg.u[0] * tt, sg.a[1] + sg.u[1] * tt];
      const front = HALF + 0.4;
      const toNext = ray([base[0] + nrm[0] * front, base[1] + nrm[1] * front], nrm, sg.road, 80);
      const orig = Math.max(s.len * FT, 9);
      let depth = toNext < Infinity ? Math.min((toNext - HALF) / 2 - 0.2, 26) : Math.min(Math.max(orig, 12), 26);
      depth = Math.max(6, depth);
      const c: V = [base[0] + nrm[0] * (front + depth / 2), base[1] + nrm[1] * (front + depth / 2)];
      const [lat, lon] = ll(c);
      const ang = ((Math.atan2(nrm[0], nrm[1]) * 180) / Math.PI + 360) % 360;
      placed[i] = { ...s, lat: Math.round(lat * 1e7) / 1e7, lon: Math.round(lon * 1e7) / 1e7, ang: Math.round(ang) % 360,
        len: Math.round(depth / FT), wid: Math.round((width / FT) * 10) / 10 };
    }
  }
  return placed;
}
