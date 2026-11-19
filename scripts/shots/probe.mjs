// Nov 18: look at the Aloha live map page structure (for the screen recording).
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
await pg.goto("https://aloha-rv-park-lilac.vercel.app/?park_id=aloha", { waitUntil: "domcontentloaded", timeout: 90000 });
await pg.waitForTimeout(12000);
const info = await pg.evaluate(() => {
  const out = [];
  const els = [...document.querySelectorAll("body *")].filter((e) => /^(A11|A23|B1|D20|A30)$/.test((e.textContent || "").trim()));
  for (const e of els.slice(0, 8)) {
    let p = e; const chain = [];
    for (let i = 0; i < 4 && p; i++) { chain.push(`${p.tagName}.${(p.getAttribute("class") || "").slice(0, 80)} fill=${p.getAttribute("fill")} style=${(p.getAttribute("style") || "").slice(0, 120)} data=${[...p.attributes].filter(a=>a.name.startsWith("data")).map(a=>a.name+"="+a.value).join(",")}`); p = p.parentElement; }
    const r = e.getBoundingClientRect(); out.push({ text: e.textContent.trim(), rect: [r.x, r.y, r.width, r.height], chain });
  }
  return { url: location.href, h: document.body.scrollHeight, svgs: document.querySelectorAll("svg").length, out };
});
fs.writeFileSync("out/probe.json", JSON.stringify(info, null, 2));
await pg.screenshot({ path: "out/probe.jpg", type: "jpeg", quality: 70, fullPage: true });
await b.close();
