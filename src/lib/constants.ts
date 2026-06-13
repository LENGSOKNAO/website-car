export const FUEL_TYPES = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
  "Flex Fuel",
] as const;
export const TRANSMISSIONS = [
  "Automatic",
  "Manual",
  "CVT",
  "Semi-Automatic",
  "Dual-Clutch",
] as const;
export const CONDITIONS = ["New", "Used", "Certified Pre-Owned"] as const;
export const COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Blue",
  "Red",
  "Green",
  "Brown",
  "Beige",
  "Orange",
  "Yellow",
  "Gold",
  "Purple",
] as const;
export const SORT_OPTIONS = [
  { value: "created_at:desc", label: "Newest First" },
  { value: "created_at:asc", label: "Oldest First" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "year:desc", label: "Year: Newest" },
  { value: "year:asc", label: "Year: Oldest" },
  { value: "mileage:asc", label: "Mileage: Low to High" },
] as const;

export const MILEAGE_OPTIONS = [
  { value: "25000", label: "25,000 mi or less" },
  { value: "50000", label: "50,000 mi or less" },
  { value: "75000", label: "75,000 mi or less" },
  { value: "100000", label: "100,000 mi or less" },
] as const;

export const APP_NAME = "DriveMarket";
export const APP_TAGLINE = "Find Your Perfect Drive";

export const NAV_LINKS = [
  { label: "Browse Cars", href: "/listings" },
  { label: "Sell Your Car", href: "/sell" },
  { label: "Financing", href: "/financing" },
  { label: "Trade-In", href: "/trade-in" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export interface Brand {
  name: string;
  slug: string;
  color: string;
  hoverColor: string;
}

export interface BrandSection {
  name: string;
  tagline: string;
  description: string;
  image: string;
  to?: boolean;
}

export interface BoxSection {
  name: string;
  tagline: string;
  description: string;
  image: string;
  to?: boolean;
}

export interface  BrandData extends Brand {
  heroBg: string;
  heroFrom: string;
  heroVia: string;
  heroTo: string;
  stats: { value: string; label: string }[];
  models: string[];
  accentColor: string;
  route: string;
  slider: BrandSection[];
  box: BrandSection[];
  boxTrips: BrandSection[];
  boxone: BrandSection[];
  boxTen: BrandSection[];
  boxLeft: BrandSection[];
  boxRight: BrandSection[];
}

 
 