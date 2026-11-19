// Nov 18: helper for marketing videos — takes real screenshots of public pages from GitHub Actions
// (the sandbox can't load map tiles). Input: JSON array of {name, url, w, h, scale, wait, scrollSel, scrollBy, full}.
import { chromium } from "playwright";
import fs from "fs";
const jobs = JSON.parse(process.env.SHOTS || "[]");
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
for (const j of jobs) {
  const ctx = await b.newContext({ viewport: { width: j.w || 390, height: j.h || 844 }, deviceScaleFactor: j.scale || 2.5, isMobile: (j.w || 390) < 600, hasTouch: (j.w || 390) < 600 });
  const pg = await ctx.newPage();
  try {
    await pg.goto(j.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await pg.waitForTimeout(j.wait || 9000);
    try { await pg.getByRole("button", { name: "Only what's needed" }).click({ timeout: 3000 }); } catch {}
    await pg.evaluate(() => { for (const el of document.querySelectorAll("body *")) { const st = getComputedStyle(el); if (st.position === "fixed" && !el.closest("header")) el.style.visibility = "hidden"; } });
    if (j.scrollSel) { const y = await pg.evaluate((s) => { const e = document.querySelector(s); return e ? e.getBoundingClientRect().top + window.scrollY : 0; }, j.scrollSel); await pg.evaluate((y) => window.scrollTo(0, y), y - (j.offset ?? 70)); }
    if (j.scrollBy) await pg.evaluate((y) => window.scrollBy(0, y), j.scrollBy);
    await pg.waitForTimeout(j.after || 3000);
    await pg.screenshot({ path: `out/${j.name}.jpg`, type: "jpeg", quality: 90, fullPage: !!j.full });
    console.log("ok", j.name);
  } catch (e) { console.log("fail", j.name, e.message); }
  await ctx.close();
}
await b.close();
