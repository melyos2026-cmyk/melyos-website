"use client";
import { useEffect, useState } from "react";

// Nov 17: the signed-in Explore boater (or null), shared by the Explore pages.
export type Boater = { id: string; name: string; email: string; phone: string | null; email_verified: boolean };
export type Me = { boater: Boater | null; vessels?: any[]; favorites?: any[]; requests?: any[]; reviews?: any[] };
let inflight: Promise<Me> | null = null;
export function loadMe(force = false): Promise<Me> {
  if (!inflight || force) inflight = fetch("/api/explore/me", { cache: "no-store" }).then((r) => r.json()).catch(() => ({ boater: null }));
  return inflight;
}
export function useBoater() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => { loadMe().then(setMe); }, []);
  return { me, reload: () => loadMe(true).then(setMe) };
}
export async function post(url: string, body: unknown) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong.");
  return j;
}
