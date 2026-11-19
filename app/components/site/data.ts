// Oct 21 (per Mely): shared content for melyos.io pages. Only features that exist; no prices.
import type { LucideIcon } from "lucide-react";
import { Target, Wallet, Zap, HelpCircle, LifeBuoy, Building2, Map, CalendarCheck, CreditCard, UserRound, PenLine, ShieldCheck, ScanBarcode, MessagesSquare, Wrench, Users, BarChart3, Bot, Caravan, Anchor, Tent, Home as HomeIcon, Warehouse, Landmark, Lock, Banknote, FileCheck2, MapPin, Mail, MessageCircle, BadgeCheck, Receipt, Scale, Gift } from "lucide-react";
export { Map, CalendarCheck, CreditCard, UserRound, PenLine, ShieldCheck, ScanBarcode, MessagesSquare, Wrench, Users, BarChart3, Bot, Caravan, Anchor, Tent, HomeIcon, Warehouse, Landmark, Lock, Banknote, FileCheck2, MapPin, Mail, MessageCircle, BadgeCheck, Receipt, Scale };
export type { LucideIcon };
export const eyebrow = "mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#08B8D8]";
export const h2 = "text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl";
export const cta = "rounded-xl bg-[#08B8D8] px-7 py-3.5 font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-[#079db9]";

export const NAV = [
  ["/features", "Platform"],
  ["/rv-park-software", "RV Parks"],
  ["/marina-software", "Marinas"],
  ["/campground-software", "Campgrounds"],
  ["/explore", "Explore"],
  ["/pricing", "Pricing"],
];

export const features = [
  { id: "map", icon: Map, title: "Interactive property map", text: "Every lot, site or slip on a real map of your property: open, occupied, reserved or under maintenance, with photo, size and hookups, and grouped by section across your office." },
  { id: "reservations", icon: CalendarCheck, title: "Online reservations", text: "Guests pick their exact space and dates and pay online. The calendar blocks double bookings, and when you are full your website shows a waitlist instead." },
  { id: "payments", icon: CreditCard, title: "Payments & billing", text: "Monthly invoices with pay ahead, metered utilities and late-fee schedules. Customers pay by card or bank (ACH) with autopay, straight to your own bank account, with instant payout when you need it." },
  { id: "portal", icon: UserRound, title: "Customer portal", text: "Residents and boat owners see their balance, pay, sign, request the Rec Hall and use the community marketplace from their phone, 24/7, in English, Spanish, Portuguese and more languages." },
  { id: "contracts", icon: PenLine, title: "Contracts & e-signature", text: "Leases, slip agreements and resident agreements signed online, with a signature record, a signed PDF on file and invoices created on signing." },
  { id: "screening", icon: ShieldCheck, title: "Applications & screening", text: "Online rental applications with background checks for the applicant and adult household members, paid by the applicant. Results come to your office, and the decision stays with you." },
  { id: "point-of-sale", icon: ScanBarcode, title: "Point of sale", text: "Sell propane, fuel and store items at the counter, with barcode scanning, inventory and low-stock alerts." },
  { id: "messages", icon: MessagesSquare, title: "Messages & notices", text: "Send a notice to one customer or a whole group. Each one gets a private copy by email and in their account." },
  { id: "maintenance", icon: Wrench, title: "Maintenance", text: "Requests with photos, notes and status updates that the resident can follow from the portal." },
  { id: "staff", icon: Users, title: "Staff, roles & daily close", text: "Logins for every employee with their own permissions and alert preferences, shift open and close, and a drawer count for every shift." },
  { id: "reports", icon: BarChart3, title: "Reports & accounting", text: "Revenue and tax reports, statements, collections, Export for QuickBooks Online and printable PDFs with your logo. Send former residents' overdue accounts to a licensed collections agency." },
  { id: "mely-ai", icon: Bot, title: "Mely, your AI assistant", text: "Answers your guests 24/7 in their own language on your website, and helps your staff find anything in the system." },
];

export const rvParks = [
  "Interactive lot map with real-time availability and date-range booking",
  "Nightly, weekly and monthly stays with seasonal pricing",
  "Online lease applications with background checks for each adult, paid by the applicant",
  "Resident portal in English, Spanish, Portuguese and more: rent, autopay, documents, Rec Hall requests, marketplace",
  "Monthly invoices with pay ahead: rent, electric meter readings (any meter type), laundry and late fees, paid by card or bank",
  "Propane sales with QR pickup codes",
  "Rent-to-own plans with payment tracking and bill of sale",
  "Storage lots, real-estate listings and park events",
  "Waitlist when the park is full, and Send to Collections for former residents' overdue accounts",
];

export const marinas = [
  "Interactive slip map for wet slips, lift slips and dry storage",
  "Rates per slip or per foot, with resident and non-resident pricing",
  "Slip contracts with e-signature and one-click annual renewals",
  "Fuel dock sales with pumps, tank levels and delivery log",
  "Ship store point of sale with barcode scanning and inventory",
  "Dry stack launch requests from the boater's phone",
  "Waitlist with slip offers, event rooms, insurance and registration tracking",
  "Shift close-out and per-payment records built for city and county audits",
];

export const industries: [LucideIcon, string, string][] = [
  [Caravan, "RV Parks & Resorts", "Long-term residents and short stays on one map."],
  [Anchor, "Marinas", "Private and municipal: slips, dry storage, fuel and store."],
  [Tent, "Campgrounds", "Sites, cabins, amenities and seasonal rates."],
  [HomeIcon, "Mobile Home Communities", "Leases, rent, utilities and maintenance."],
  [Warehouse, "RV & Boat Storage", "Spaces, recurring charges and customer records."],
  [Landmark, "Government Properties", "City and county parks and marinas that need clean, auditable records."],
];

export const steps = [
  ["1", "Free consultation", "We learn how your property works today: spaces, rates, billing and what slows your team down."],
  ["2", "We build it for you", "Your own website and domain, your property map, spaces, rates, fees and contracts, all set up by the MelyOS team."],
  ["3", "Training & launch", "We train your staff, help bring your current customers into the system, and stay with you on launch day."],
  ["4", "Support that answers", "A real team in Florida, plus regular updates included in the platform."],
];

export const trust: [LucideIcon, string, string][] = [
  [Lock, "Secure by design", "Encrypted card payments, role-based access, and each property's data kept separate."],
  [Banknote, "Your money, your bank", "Customer payments go to your own bank account. Payouts are tracked in your reports."],
  [FileCheck2, "Records you can audit", "Every payment, refund and shift close is tied to a person, a date and a receipt."],
  [MapPin, "Built in Florida", "MelyOS LLC is based in Kissimmee, FL. Small team, fast answers."],
];


// Oct 21 (per Mely): Dockwa-style menu for melyos.io. Desktop: drop-downs with a side
// panel on hover; mobile: sections that open and close inside the ☰ menu.
export type MenuLink = { href: string; label: string; note?: string; icon?: LucideIcon };
export type MenuGroup = { label: string; links: MenuLink[] };
export type MenuItem = { label: string; href?: string; groups?: MenuGroup[]; links?: MenuLink[]; wide?: boolean };

export const MENU: MenuItem[] = [
  { label: "Platform", href: "/features" },
  { label: "Who we serve", groups: [
    { label: "By property type", links: [
      { href: "/rv-park-software", label: "RV Parks & Resorts", icon: Caravan },
      { href: "/marina-software", label: "Marinas", icon: Anchor },
      { href: "/campground-software", label: "Campgrounds", icon: Tent },
      { href: "/features#industries", label: "Mobile Home Communities", icon: HomeIcon },
      { href: "/marina-software", label: "Municipal Marinas", icon: Landmark },
      { href: "/features#industries", label: "Multi-property Owners", icon: Building2 },
    ] },
    { label: "By goal", links: [
      { href: "/online-reservation-software", label: "Fill more spaces", icon: Target },
      { href: "/billing-payments-software", label: "Get paid faster", icon: Wallet },
      { href: "/features#how-it-works", label: "Simplify operations", icon: Zap },
      { href: "/tenant-screening-software", label: "Reduce risk", icon: ShieldCheck },
    ] },
  ] },
  // Nov 18 (per Mely — "no enseñar todo lo que tenemos"): Solutions shows 5 needs in plain words, not the
  // full list of tools. The tool pages stay (Google brings visitors to them) and are linked in the footer.
  { label: "Solutions", links: [
    { href: "/billing-payments-software", label: "Get paid on time", note: "Rent, reminders, autopay", icon: Wallet },
    { href: "/online-reservation-software", label: "Fill your spaces", note: "Your live map, booked 24/7", icon: CalendarCheck },
    { href: "/tenant-screening-software", label: "Know who moves in", note: "Applications you can trust", icon: ShieldCheck },
    { href: "/features#how-it-works", label: "Run the office", note: "Less paper, fewer calls", icon: Zap },
    { href: "/marina-software", label: "Marinas", note: "Slips, fuel dock, dry stack", icon: Anchor },
  ] },
  { label: "Explore", links: [
    { href: "/explore/marinas", label: "Search Marinas", note: "Slips & moorings by state", icon: Anchor },
    { href: "/explore/rv-parks", label: "Search RV Parks", note: "Sites for every rig", icon: Caravan },
    { href: "/explore/campgrounds", label: "Search Campgrounds", note: "Tent, cabin & RV camping", icon: Tent },
    { href: "/explore", label: "Explore the map", note: "All states, all places", icon: Map },
  ] },
  { label: "Resources", links: [
    { href: "/pricing#faq", label: "Questions & Answers", icon: HelpCircle },
    { href: "/demo", label: "Book a Demo", icon: CalendarCheck },
    { href: "/refer", label: "Referral Program", note: "Earn 20% of the setup fee", icon: Gift },
    { href: "mailto:info@melyos.io", label: "Help & Support", icon: LifeBuoy },
  ] },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

// Nov 18: the tool pages, linked only from the footer (for Google), not from the menu.
export const SOLUTION_PAGES: [string, string][] = [
  ["/interactive-property-map", "Interactive map"], ["/online-reservation-software", "Online reservations"], ["/billing-payments-software", "Billing & payments"],
  ["/contract-e-signature-software", "Contracts & e-signature"], ["/customer-portal-software", "Customer portal"], ["/tenant-screening-software", "Tenant screening"],
  ["/point-of-sale-software", "Point of sale"], ["/marina-fuel-dock-software", "Marina fuel dock"], ["/dry-stack-software", "Dry stack"],
  ["/ai-assistant-for-rv-parks-and-marinas", "AI assistant"],
];
