// Oct 22 (per Mely): MelyOS onboarding questionnaire — what we need to know to set up a
// property and send an estimate. One shared part + questions for each type of property.
// "What system do you use today?" is an open, blank answer (no names suggested).

export type QType = "rv" | "campground" | "marina";
export type Field =
  | { id: string; label: string; kind: "text" | "email" | "tel" | "number" | "textarea"; required?: boolean; hint?: string; placeholder?: string }
  | { id: string; label: string; kind: "choice"; options: string[]; required?: boolean; hint?: string }
  | { id: string; label: string; kind: "multi"; options: string[]; hint?: string };
export type Section = { title: string; intro?: string; fields: Field[] };

export const TYPES: Record<QType, { name: string; short: string; spaces: string }> = {
  rv: { name: "RV Park / Mobile Home Community", short: "RV park", spaces: "lots" },
  campground: { name: "Campground", short: "campground", spaces: "sites" },
  marina: { name: "Marina", short: "marina", spaces: "slips" },
};

const yesNo = ["Yes", "No", "Not sure"];

const contact: Section = {
  title: "About you",
  fields: [
    { id: "name", label: "Your name", kind: "text", required: true },
    { id: "business", label: "Business name", kind: "text", required: true },
    { id: "email", label: "Email", kind: "email", required: true },
    { id: "phone", label: "Phone", kind: "tel" },
    { id: "role", label: "Your role", kind: "choice", options: ["Owner", "Manager", "Office staff", "Other"] },
    { id: "best_time", label: "Best day and time to reach you", kind: "text", placeholder: "Weekdays after 2 PM" },
  ],
};

const property = (t: QType): Section => ({
  title: "Your property",
  fields: [
    { id: "property_count", label: `How many ${t === "marina" ? "marinas" : t === "campground" ? "campgrounds" : "parks"} do you have?`, kind: "number" },
    { id: "property_names", label: "Name and address of each property", kind: "textarea", placeholder: "Sunrise Marina, 100 Harbor Way, Kissimmee, FL" },
    { id: "website", label: "Website address today (if any)", kind: "text", placeholder: "www.yourproperty.com" },
  ],
});

const rv: Section[] = [
  {
    title: "Lots and residents",
    fields: [
      { id: "lots_total", label: "Total number of lots", kind: "number", required: true },
      { id: "lots_long_term", label: "How many are long-term residents (monthly or longer)?", kind: "number" },
      { id: "lots_short_term", label: "How many are for short stays (nightly or weekly)?", kind: "number" },
      { id: "mobile_homes", label: "Do you have mobile homes or park models?", kind: "choice", options: ["Yes, owned by residents", "Yes, owned by the park", "Both", "No"] },
      { id: "lot_power", label: "Electric service at the lots", kind: "multi", options: ["20 amp", "30 amp", "50 amp", "Some lots have no power"] },
      { id: "lot_hookups", label: "Water and sewer at the lots", kind: "choice", options: ["Full hookups at every lot", "Some lots", "Water only", "None"] },
      { id: "rent_range", label: "Monthly rent range", kind: "text", placeholder: "$650 – $900" },
    ],
  },
  {
    title: "Billing and services",
    fields: [
      { id: "electric_billing", label: "How do you charge for electricity?", kind: "choice", options: ["Included in rent", "Meter readings each month", "Flat monthly fee", "Mixed"] },
      { id: "other_charges", label: "Other charges you bill", kind: "multi", options: ["Water / sewer", "Trash", "Laundry", "Storage", "Pets", "Extra vehicles", "Late fees", "Propane"] },
      { id: "propane", label: "Do you sell propane?", kind: "choice", options: yesNo },
      { id: "storage_lots", label: "Do you rent storage lots (boats, RVs, trailers)?", kind: "choice", options: yesNo },
      { id: "home_sales", label: "Do you sell homes or offer rent-to-own?", kind: "choice", options: yesNo },
      { id: "applications", label: "Do new residents fill out an application?", kind: "choice", options: ["Yes, with a background check", "Yes, without a background check", "No"] },
    ],
  },
];

const campground: Section[] = [
  {
    title: "Sites and stays",
    fields: [
      { id: "sites_rv", label: "RV sites", kind: "number" },
      { id: "sites_tent", label: "Tent sites", kind: "number" },
      { id: "sites_cabins", label: "Cabins, park models or glamping units", kind: "number" },
      { id: "site_power", label: "Electric service at the sites", kind: "multi", options: ["20 amp", "30 amp", "50 amp", "Some sites have no power"] },
      { id: "site_hookups", label: "Water and sewer at the sites", kind: "choice", options: ["Full hookups at every site", "Some sites", "Water only", "None"] },
      { id: "stays", label: "Stays you offer", kind: "multi", options: ["Nightly", "Weekly", "Monthly", "Seasonal"] },
      { id: "season", label: "When are you open?", kind: "text", placeholder: "Year-round, or March to November" },
      { id: "rates_range", label: "Nightly rate range", kind: "text", placeholder: "$45 – $75" },
    ],
  },
  {
    title: "Reservations and extras",
    fields: [
      { id: "booking_today", label: "How do guests book today?", kind: "multi", options: ["Phone", "Email", "Walk-in", "Online on our website", "Through another booking site"] },
      { id: "deposit_policy", label: "Deposit and cancellation policy", kind: "textarea", placeholder: "50% deposit, full refund up to 7 days before" },
      { id: "amenities", label: "Amenities", kind: "multi", options: ["Camp store", "Propane", "Firewood", "Laundry", "Pool", "Activities / events", "Boat ramp", "Rentals (kayaks, golf carts)"] },
    ],
  },
];

const marina: Section[] = [
  {
    title: "Your marina",
    fields: [
      { id: "ownership", label: "Is the marina private or public?", kind: "choice", options: ["Private", "Municipal (city or county)", "State or federal", "Yacht club / association"], required: true },
      { id: "water", label: "Where is it?", kind: "choice", options: ["Lake", "River", "Intracoastal / bay", "Ocean / gulf"] },
      { id: "wet_slips", label: "Wet slips", kind: "number" },
      { id: "lift_slips", label: "Slips with boat lifts", kind: "number" },
      { id: "dry_racks", label: "Dry storage racks (dry stack)", kind: "number" },
      { id: "moorings", label: "Moorings or anchorage spots", kind: "number" },
      { id: "slip_sizes", label: "Slip sizes, from smallest to largest (ft)", kind: "text", placeholder: "20 ft to 45 ft" },
      { id: "max_beam_draft", label: "Largest beam and deepest draft you can take (ft)", kind: "text", placeholder: "Beam 15 ft · Draft 6 ft" },
      { id: "slip_power", label: "Shore power at the slips", kind: "multi", options: ["20 amp", "30 amp", "50 amp", "100 amp", "Some slips have no power"] },
      { id: "slip_water", label: "Water at the slips", kind: "choice", options: ["Every slip", "Some slips", "None"] },
    ],
  },
  {
    title: "Contracts and billing",
    fields: [
      { id: "contracts", label: "Contracts you offer", kind: "multi", options: ["Annual", "Seasonal", "Monthly", "Weekly", "Nightly (transient)"] },
      { id: "pricing", label: "How do you price slips?", kind: "choice", options: ["Per foot", "Flat price per slip", "Both"] },
      { id: "resident_pricing", label: "Different prices for residents and non-residents?", kind: "choice", options: yesNo },
      { id: "electric_billing", label: "How do you charge for electricity?", kind: "choice", options: ["Included in the slip fee", "Meter readings", "Flat monthly fee", "Per day by amperage"] },
      { id: "renewals", label: "When do annual contracts renew?", kind: "text", placeholder: "Every January, or on each boater's start date" },
      { id: "insurance", label: "Do you require boat insurance and registration on file?", kind: "choice", options: yesNo },
      { id: "waitlist", label: "Do you keep a waitlist for slips?", kind: "choice", options: yesNo },
    ],
  },
  {
    title: "Fuel dock, store and services",
    fields: [
      { id: "fuel", label: "Do you have a fuel dock?", kind: "choice", options: ["Yes", "No", "Planning one"] },
      { id: "fuels", label: "Fuels you sell", kind: "multi", options: ["Gas (ethanol)", "Non-ethanol gas", "Diesel"] },
      { id: "pumps_tanks", label: "Number of pumps and tanks", kind: "text", placeholder: "3 pumps, 2 tanks" },
      { id: "ship_store", label: "Do you have a ship store?", kind: "choice", options: ["Yes", "No"] },
      { id: "store_items", label: "About how many items does the store sell?", kind: "number" },
      { id: "dry_stack", label: "Do boaters request launches from dry storage (forklift)?", kind: "choice", options: yesNo },
      { id: "services", label: "Other services", kind: "multi", options: ["Pump-out", "Boat ramp", "Repairs / service", "Haul-out", "Event room / meeting room", "Boat rentals", "Restaurant"] },
    ],
  },
];

const shared = (t: QType): Section[] => [
  {
    title: "How you work today",
    fields: [
      { id: "system_today", label: "What system or software do you use today to run the property?", kind: "textarea", hint: "Tell us in your own words." },
      { id: "export", label: `Can you export your list of ${t === "marina" ? "boaters, boats and slips" : t === "campground" ? "guests and sites" : "residents and lots"} to Excel or CSV?`, kind: "choice", options: yesNo },
      { id: "pay_today", label: "How do customers pay you today?", kind: "multi", options: ["Cash", "Check", "Card", "Bank transfer (ACH)", "Money order", "Online"] },
      { id: "bank", label: "Do you have a business bank account for deposits?", kind: "choice", options: ["Yes", "No"] },
      { id: "staff", label: "How many people work in the office or on site?", kind: "number" },
      { id: "staff_roles", label: "What do they do? Anything only the owner should see?", kind: "textarea", placeholder: "Office manager, two dock hands. Only the owner sees revenue." },
    ],
  },
  {
    title: "Website and domain",
    fields: [
      { id: "web_manager", label: "Who built and manages your website today?", kind: "text" },
      { id: "domain_owner", label: "Who owns the domain (web address)?", kind: "choice", options: ["We do (our company)", "Our web designer", "Not sure", "We don't have one"] },
      { id: "domain_login", label: "Do you have the login to the domain account (GoDaddy, Namecheap, etc.)?", kind: "choice", options: yesNo },
      { id: "web_plan", label: "How would you like MelyOS to work with your website?", kind: "choice", options: ["Build me a new website", "Keep my website and add buttons (pay, reserve, login)", "Add the map or reservations inside my website", "I'd like a recommendation"] },
    ],
  },
  {
    title: "What would you like?",
    fields: [
      {
        id: "features", label: "Check everything you'd like to have", kind: "multi",
        options: [
          "Interactive map of the property",
          "Online reservations and payments",
          "Automatic invoices and late fees",
          "Autopay",
          "Contracts or leases signed online",
          "Customer portal (pay, documents, requests)",
          ...(t === "marina" ? ["Fuel dock sales and tank levels", "Ship store point of sale", "Dry stack launch requests"] : ["Point of sale (store, propane)"]),
          ...(t === "rv" ? ["Applications with background checks", "Meter readings and utility billing"] : []),
          "Messages and notices to customers",
          "Maintenance requests",
          "Staff logins with permissions",
          "Reports and QuickBooks export",
          "AI assistant for customers and staff",
        ],
      },
    ],
  },
  {
    title: "Getting started",
    fields: [
      { id: "timing", label: "When would you like to start?", kind: "choice", options: ["As soon as possible", "In 1 to 3 months", "In more than 3 months", "Just exploring"] },
      { id: "decision", label: "Who else is involved in the decision?", kind: "text", placeholder: "Partner, board, city council, accountant" },
      { id: "demo", label: "Would you like a live demo?", kind: "choice", options: ["Yes", "No"] },
      { id: "demo_times", label: "Days and times that work for a demo", kind: "text" },
      { id: "comments", label: "Anything else we should know?", kind: "textarea" },
    ],
  },
];

export function sectionsFor(t: QType): Section[] {
  return [contact, property(t), ...(t === "marina" ? marina : t === "campground" ? campground : rv), ...shared(t)];
}
