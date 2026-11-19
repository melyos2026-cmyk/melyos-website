// Nov 18 (per Mely — "antes de mostrarles lo que hacemos, que llenen lo que ellos necesitan; solo enseñamos eso,
// y si quieren algo más, es extra"): the plain-language needs a prospect picks BEFORE the demo. They describe
// problems, not our modules, so the public form doesn't list everything MelyOS has. The Sales Partner portal's
// Demo guide uses the same ids (keep them in sync with melyos-builder components/sales/demoGuide.ts).
export const NEEDS: { id: string; label: string }[] = [
  { id: "paid", label: "Get paid on time (rent, reminders, late fees, autopay)" },
  { id: "reserve", label: "Take reservations online, day and night" },
  { id: "screen", label: "Know who is moving in (applications and background checks)" },
  { id: "utilities", label: "Bill utilities (electric, water, propane)" },
  { id: "sales", label: "Sell at the office, store, fuel dock or propane tank" },
  { id: "paperwork", label: "Contracts and paperwork signed online" },
  { id: "calls", label: "Fewer calls: customers pay and find everything on their phone" },
  { id: "owed", label: "Recover money from people who left owing" },
  { id: "books", label: "My books in QuickBooks without typing everything twice" },
  { id: "found", label: "A website and map that bring new customers" },
  { id: "staff", label: "Staff, shifts and daily reports in one place" },
];
export const needLabel = (id: string) => NEEDS.find((n) => n.id === id)?.label || "";
