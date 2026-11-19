// Nov 18 (per Mely — "antes de mostrarles lo que hacemos, que llenen lo que ellos necesitan; solo enseñamos eso,
// y si quieren algo más, es extra"): the plain-language needs a prospect picks BEFORE the demo. They describe
// problems, not our modules, so the public form doesn't list everything MelyOS has. The Sales Partner portal's
// Nov 19 (per Mely): short labels only — no details that reveal how MelyOS does it.
// Demo guide uses the same ids (keep them in sync with melyos-builder components/sales/demoGuide.ts).
export const NEEDS: { id: string; label: string }[] = [
  { id: "paid", label: "Get paid on time" },
  { id: "reserve", label: "Take reservations online" },
  { id: "screen", label: "Know who is moving in" },
  { id: "utilities", label: "Bill utilities" },
  { id: "sales", label: "Sell at the office or store" },
  { id: "paperwork", label: "Less paperwork" },
  { id: "calls", label: "Fewer calls from customers" },
  { id: "owed", label: "Recover money owed" },
  { id: "books", label: "Easier accounting" },
  { id: "found", label: "Get found by new customers" },
  { id: "staff", label: "Run my staff and office" },
];
export const needLabel = (id: string) => NEEDS.find((n) => n.id === id)?.label || "";
