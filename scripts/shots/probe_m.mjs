// Nov 19: look at the marina demo site (slip map) for a screen recording.
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
for (const [name, vp] of [["d", { width: 1280, height: 900 }], ["m", { width: 430, height: 932 }]]) {
  const pg = await b.newPage({ viewport: vp, deviceScaleFactor: 2 });
  await pg.goto("https://marinademo.melyos.io/?me=1", { waitUntil: "domcontentloaded", timeout: 90000 });
  await pg.waitForTimeout(12000);
  const info = await pg.evaluate(() => {
    const short = [...document.querySelectorAll("body *")].filter((e) => e.children.length === 0 && /^[A-Z]{0,2}-?\d{1,3}$/.test((e.textContent || "").trim())).slice(0, 15).map((e) => {
      let p = e; const chain = [];
      for (let i = 0; i < 4 && p; i++) { chain.push(`${p.tagName}.${(p.getAttribute("class") || "").slice(0, 90)} fill=${p.getAttribute("fill")} style=${(p.getAttribute("style") || "").slice(0, 140)}`); p = p.parentElement; }
      const r = e.getBoundingClientRect(); return { t: e.textContent.trim(), r: [r.x, r.y, r.width, r.height], chain };
    });
    const links = [...document.querySelectorAll("a,button")].map((a) => (a.textContent || "").trim().slice(0, 50) + " -> " + (a.getAttribute("href") || "")).slice(0, 80);
    return { url: location.href, h: document.body.scrollHeight, short, links };
  });
  fs.writeFileSync(`out/probe_${name}.json`, JSON.stringify(info, null, 2));
  await pg.screenshot({ path: `out/probe_${name}.jpg`, type: "jpeg", quality: 70, fullPage: true });
}
await b.close();
