// Oct 21 (per Mely): shared content for melyos.io pages. Only features that exist; no prices.
import type { LucideIcon } from "lucide-react";
import { Fuel, Ship, Target, Wallet, Zap, HelpCircle, Info, LifeBuoy, Building2, Map, CalendarCheck, CreditCard, UserRound, PenLine, ShieldCheck, ScanBarcode, MessagesSquare, Wrench, Users, BarChart3, Bot, Caravan, Anchor, Tent, Home as HomeIcon, Warehouse, Landmark, Lock, Banknote, FileCheck2, MapPin, Mail, MessageCircle, BadgeCheck, Receipt } from "lucide-react";
export { Map, CalendarCheck, CreditCard, UserRound, PenLine, ShieldCheck, ScanBarcode, MessagesSquare, Wrench, Users, BarChart3, Bot, Caravan, Anchor, Tent, HomeIcon, Warehouse, Landmark, Lock, Banknote, FileCheck2, MapPin, Mail, MessageCircle, BadgeCheck, Receipt };
export type { LucideIcon };
export const eyebrow = "mb-3 text-sm font-black uppercase tracking-[0.18em] text-[#08B8D8]";
export const h2 = "text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl";
export const cta = "rounded-xl bg-[#08B8D8] px-7 py-3.5 font-black text-white shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5 hover:bg-[#079db9]";

export const NAV = [
  ["/features", "Platform"],
  ["/rv-park-software", "RV Parks"],
  ["/marina-software", "Marinas"],
  ["/campground-software", "Campgrounds"],
  ["/pricing", "Pricing"],
  ["/about", "About"],
];

export const features = [
  { id: "map", icon: Map, title: "Interactive property map", text: "Every lot, site or slip on a real map of your property: open, occupied, reserved or under maintenance, with photo, size and hookups." },
  { id: "reservations", icon: CalendarCheck, title: "Online reservations", text: "Guests pick their exact space and dates and pay online. The calendar blocks double bookings across every channel." },
  { id: "payments", icon: CreditCard, title: "Payments & billing", text: "Invoices, recurring rent, metered utilities, late-fee schedules and online payments that go straight to your own bank account." },
  { id: "portal", icon: UserRound, title: "Customer portal", text: "Residents and boat owners see their balance, pay, download documents and send requests from their phone, 24/7." },
  { id: "contracts", icon: PenLine, title: "Contracts & e-signature", text: "Leases and slip agreements signed online, with a signature record, a signed PDF on file and invoices created on signing." },
  { id: "screening", icon: ShieldCheck, title: "Applications & screening", text: "Online rental applications with background checks, occupants, vehicles and pets, reviewed and approved from the office." },
  { id: "point-of-sale", icon: ScanBarcode, title: "Point of sale", text: "Sell propane, fuel and store items at the counter, with barcode scanning, inventory and low-stock alerts." },
  { id: "messages", icon: MessagesSquare, title: "Messages & notices", text: "Send a notice to one customer or a whole group. Each one gets a private copy by email and in their account." },
  { id: "maintenance", icon: Wrench, title: "Maintenance", text: "Requests with photos, notes and status updates that the resident can follow from the portal." },
  { id: "staff", icon: Users, title: "Staff, roles & daily close", text: "Logins for every employee with their own permissions, shift open and close, and a drawer count for every shift." },
  { id: "reports", icon: BarChart3, title: "Reports & accounting", text: "Revenue and tax reports, statements, collections, Export for QuickBooks Online and printable PDFs with your logo." },
  { id: "mely-ai", icon: Bot, title: "Mely, your AI assistant", text: "Answers your guests 24/7 in their own language on your website, and helps your staff find anything in the system." },
];

export const rvParks = [
  "Interactive lot map with real-time availability and date-range booking",
  "Nightly, weekly and monthly stays with seasonal pricing",
  "Online lease applications with background screening",
  "Resident portal: rent, autopay, documents, vehicles, occupants, move-out requests",
  "Recurring billing: rent, electric meter readings (any meter type), laundry and late fees",
  "Propane sales with QR pickup codes",
  "Rent-to-own plans with payment tracking and bill of sale",
  "Storage lots, real-estate listings and park events",
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
      { href: "/features#reservations", label: "Fill more spaces", icon: Target },
      { href: "/features#payments", label: "Get paid faster", icon: Wallet },
      { href: "/features#staff", label: "Simplify operations", icon: Zap },
      { href: "/features#screening", label: "Reduce risk", icon: ShieldCheck },
    ] },
  ] },
  { label: "Solutions", wide: true, links: [
    { href: "/features#map", label: "Interactive Map", note: "Every space, live", icon: Map },
    { href: "/online-reservation-software", label: "Online Reservations", note: "Book and pay 24/7", icon: CalendarCheck },
    { href: "/billing-payments-software", label: "Billing & Payments", note: "Rent, invoices, utilities", icon: CreditCard },
    { href: "/contract-e-signature-software", label: "Contracts & E-signature", note: "Signed online, on file", icon: PenLine },
    { href: "/features#portal", label: "Customer Portal", note: "Balance, pay, documents", icon: UserRound },
    { href: "/features#screening", label: "Applications & Screening", note: "Background checks", icon: BadgeCheck },
    { href: "/point-of-sale-software", label: "Point of Sale", note: "Store, propane, barcodes", icon: ScanBarcode },
    { href: "/marina-fuel-dock-software", label: "Fuel Dock", note: "Pumps, tanks, sales", icon: Fuel },
    { href: "/dry-stack-software", label: "Dry Stack", note: "Launch requests", icon: Ship },
    { href: "/features#messages", label: "Messages & Notices", note: "One or a whole group", icon: MessagesSquare },
    { href: "/features#maintenance", label: "Maintenance", note: "Requests with photos", icon: Wrench },
    { href: "/features#staff", label: "Staff & Daily Close", note: "Roles, shifts, drawer", icon: Users },
    { href: "/features#reports", label: "Reports & QuickBooks", note: "Revenue, tax, export", icon: BarChart3 },
    { href: "/features#mely-ai", label: "Mely AI Assistant", note: "Answers guests 24/7", icon: Bot },
  ] },
  { label: "Resources", links: [
    { href: "/about", label: "About MelyOS", icon: Info },
    { href: "/pricing#faq", label: "Questions & Answers", icon: HelpCircle },
    { href: "/demo", label: "Book a Demo", icon: CalendarCheck },
    { href: "mailto:info@melyos.io", label: "Help & Support", icon: LifeBuoy },
  ] },
  { label: "Pricing", href: "/pricing" },
];
