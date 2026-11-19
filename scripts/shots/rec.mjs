// Nov 18 (per Mely): screen recording of Aloha RV Park's live map for the Explore promo — available lots
// glow, a hand cursor taps one and the site's preview card opens.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("out", { recursive: true });
const VW = 940, VH = 1200;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, recordVideo: { dir: "out/rec", size: { width: VW, height: VH } } });
const pg = await ctx.newPage();
await pg.goto("https://aloha-rv-park-lilac.vercel.app/?park_id=aloha", { waitUntil: "domcontentloaded", timeout: 90000 });
await pg.waitForTimeout(10000);
const top = await pg.evaluate(() => { const m = document.querySelector(".map-ready"); const r = m.getBoundingClientRect(); return r.top + window.scrollY; });
await pg.evaluate((y) => window.scrollTo(0, y - 24), top);
await pg.addStyleTag({ content: `
  @keyframes melyGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); filter: brightness(1); } 50% { box-shadow: 0 0 14px 4px rgba(74,222,128,.95); filter: brightness(1.35); } }
  .mely-glow { animation: melyGlow 1.4s ease-in-out infinite; z-index: 2; }
  #mely-hand { position: fixed; left: 0; top: 0; width: 46px; height: 46px; pointer-events: none; z-index: 2147483647; transform: translate(-14px,-4px); transition: transform .12s; filter: drop-shadow(0 3px 4px rgba(0,0,0,.45)); }
  #mely-hand.down { transform: translate(-14px,-4px) scale(.85); }
  * { cursor: none !important; }` });
const lots = await pg.evaluate(() => {
  const out = [];
  document.querySelectorAll(".map-ready .tap-anim").forEach((el, i) => {
    const bg = getComputedStyle(el).backgroundColor; const m = bg.match(/\d+(\.\d+)?/g); if (!m) return;
    const [r, g, bl] = m.map(Number);
    if (g > 150 && g > r + 40 && g > bl + 40) { el.classList.add("mely-glow"); el.style.animationDelay = `${(i % 7) * 0.18}s`; const rc = el.getBoundingClientRect(); out.push({ t: el.textContent.trim(), x: rc.x + rc.width / 2, y: rc.y + rc.height / 2 }); }
  });
  const h = document.createElement("div"); h.id = "mely-hand";
  h.innerHTML = '<svg viewBox="0 0 24 24" width="46" height="46" fill="#ffffff" stroke="#111827" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>';
  document.body.appendChild(h);
  window.addEventListener("mousemove", (e) => { h.style.left = e.clientX + "px"; h.style.top = e.clientY + "px"; }, true);
  return out;
});
fs.writeFileSync("out/lots.json", JSON.stringify(lots));
const pick = lots.find((l) => l.t === "A23") || lots[Math.floor(lots.length / 3)];
const glide = async (x, y, ms) => { const steps = Math.max(8, Math.round(ms / 16)); await pg.mouse.move(x, y, { steps }); };
await pg.mouse.move(VW * 0.75, VH * 0.85);
await pg.waitForTimeout(1800);                       // lots glowing
const tour = ["B5", "D12", "A31"].map((t) => lots.find((l) => l.t === t)).filter(Boolean);
for (const l of tour) { await glide(l.x, l.y, 900); await pg.waitForTimeout(450); }
await glide(pick.x, pick.y, 1000); await pg.waitForTimeout(500);
await pg.evaluate(() => document.getElementById("mely-hand").classList.add("down"));
await pg.mouse.click(pick.x, pick.y);
await pg.evaluate(() => document.getElementById("mely-hand").classList.remove("down"));
await pg.waitForTimeout(1500);
// move the hand onto the card's main button if one is visible (hover only, no booking)
const btn = await pg.evaluate(() => { const c = [...document.querySelectorAll("button, a")].filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 80 && r.height > 28 && r.top > 0 && r.bottom < innerHeight && s.visibility !== "hidden" && /reserve|book|apply|rent|select/i.test(e.textContent || ""); }); const e = c[c.length - 1]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, t: e.textContent.trim().slice(0, 40) }; });
if (btn) { await glide(btn.x, btn.y, 1100); }
await pg.waitForTimeout(3500);
await pg.screenshot({ path: "out/rec_end.jpg", type: "jpeg", quality: 80 });
fs.writeFileSync("out/btn.json", JSON.stringify({ btn, pick }));
await ctx.close(); await b.close();
