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

export interface BrandData extends Brand {
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

export const BRANDS: Brand[] = [
  { name: "Tesla", slug: "tesla", color: "#E82127", hoverColor: "#FF3B30" },
  { name: "BMW", slug: "bmw", color: "#000000", hoverColor: "#FFFFFF" },
  { name: "GTR", slug: "gtr", color: "#00A651", hoverColor: "#00C864" },
  { name: "Porsche", slug: "porsche", color: "#FFB800", hoverColor: "#FFC933" },
] as const;

// Box images
import teslaBox from "@/assets/boxRight/tesla/Model-Y-Premium-Hero-Desktop-NA.avif";
import gtrBox from "@/assets/boxRight/gtr/2024-nissan-gt-r-sports-car-light-green-side-profile-view.webp";
import porscheBox from "@/assets/boxRight/porsche/filters_format(webp)_quality(80).webp";

// # Tesla
// slider
import teslaSlide1 from "@/assets/slider/tesla/Homepage-Card-Model-3-Desktop-US_PR_MX.avif";
import teslaSlide2 from "@/assets/slider/tesla/Homepage-Vehicle-Card-Model-Y-Desktop-US-Snow.avif";

// boxTrips
import teslaBoxTrips1 from "@/assets/boxTrips/tesla/Homepage-Card-Powerwall-Desktop.avif";
import teslaBoxTrips2 from "@/assets/boxTrips/tesla/Homepage-Card-Solar-Panels-Desktop-v2.avif";
import teslaBoxTrips3 from "@/assets/boxTrips/tesla/Mega-Menu-Shop-Charging.avif";
// boxOne
import teslaBoxOne from "@/assets/boxOne/tesla/Model-Y-Meet-Carousel-Slide-2-Desktop.avif";
// boxTen
import teslaBoxTen1 from "@/assets/boxTen/tesla/Landing-Carousel-FSD-All-Devices-Global.avif";
import teslaBoxTen2 from "@/assets/boxTen/tesla/Model-Y-Meet-Carousel-Safety-All-Devices-Dark.avif";
// boxRigth
import teslaBoxRight from "@/assets/boxRight/tesla/Model-Y-Premium-Hero-Desktop-NA.avif";
// boxLeft
import teslaBoxleft from "@/assets/boxLeft/tesla/Model-Y-Performance-Hero-Desktop-NA.avif";

// #bmw
// Slider
import bmwSlide1 from "@/assets/slider/bmw/X5-xDrive-40i-BMW-MAY-2026-OFFERS_16to7.webp";
// boxTrips
import bmwBoxTrips1 from "@/assets/boxTrips/bmw/DI23_000188971-3_2to3.webp";
import bmwBoxTrips2 from "@/assets/boxTrips/bmw/MY26-330iB-BMW-MAY-2026-OFFERS_2to3.webp";
import bmwBoxTrips3 from "@/assets/boxTrips/bmw/X3-xDrive40i-BMW-MAY-2026-OFFERS_2to3.webp";

// boxOne
import bmwBoxOne from "@/assets/boxOne/bmw/BMW-MY27-iX3-DI24_000238397-retouched_3to1.webp";
// boxTen
import bmwBoxTen1 from "@/assets/boxTen/bmw/Homepage-L_3to2.webp";
import bmwBoxTen2 from "@/assets/boxTen/bmw/g70_lci_ice_home-teaser_dsk_sl-2.webp";
// boxRigth
import bmwBox from "@/assets/boxRight/bmw/LoyaltyProgram-M.avif";
// boxLeft
import bmwBoxLeft from "@/assets/boxLeft/bmw/GraduateCredit-M.avif";

// Gtr
// Slider
import gtrSlide1 from "@/assets/slider/gtr/2024-nissan-gt-r-sports-car-light-green-side-profile-view.webp";
// boxTrips
import gtrBoxTrips1 from "@/assets/boxTrips/gtr/2024-nissan-gtr-closeup-v6-engine-two-turbochargers.webp";
import gtrBoxTrips2 from "@/assets/boxTrips/gtr/2024-nissan-gt-r-white.webp";
import gtrBoxTrips3 from "@/assets/boxTrips/gtr/2024-nissan-gt-r-side-view-cutaway-show-midship-engine-chassis.webp";
// boxOne
import gtrBoxOne1 from "@/assets/boxOne/gtr/2024-nissan-gt-r-millennium-jade-3-4-front-profile-driving-down-desert-road-v2.webp";
// boxTen
import gtrBoxTen1 from "@/assets/boxTen/gtr/nissan-gt-r-multi-led-headlights.webp";
import gtrBoxTen2 from "@/assets/boxTen/gtr/2024-nissan-gtr-3-switched-tuned-to-gtr-special-mode.webp";
import gtrBoxTen3 from "@/assets/boxTen/gtr/2024-nissan-gtr-paddle-shifter.webp";
import gtrBoxTen4 from "@/assets/boxTen/gtr/2024-nissan-gt-r-dashboard-center-console-apple-carplay-icons.webp";
import gtrBoxTen5 from "@/assets/boxTen/gtr/2024-nissan-gtr-detail-forged-aluminum-wheel.webp";
// boxRigth
import gtrBoxRight1 from "@/assets/boxRight/gtr/2024-nissan-gt-r-sports-car-light-green-side-profile-view.webp";
import gtrBoxRight2 from "@/assets/boxRight/gtr/nissan-rogue-e-power-all-new.webp";
// boxLeft
import gtrBoxLeft1 from "@/assets/boxLeft/gtr/nissan-gt-r-premium-seating-appointments.webp";

// Porsche
// Slider
import porscheSlide1 from "@/assets/slider/porsch/filters_format(webp)_quality(80).webp";
// boxTrips
import porscheBoxTrips1 from "@/assets/boxTrips/porsche/filters_format(webp)_quality(80).webp";
import porscheBoxTrips2 from "@/assets/boxTrips/porsche/filters_format(webp)_quality(80) (1).webp";
import porscheBoxTrips3 from "@/assets/boxTrips/porsche/filters_format(webp)_quality(80) (2).webp";
// boxOne
import porscheBoxOne1 from "@/assets/boxOne/porsche/filters_format(webp)_quality(80).webp";
// boxTen
import porscheBoxTen1 from "@/assets/boxTen/porsche/filters_format(webp)_quality(80).webp";
import porscheBoxTen2 from "@/assets/boxTen/porsche/filters_format(webp)_quality(85).webp";
import porscheBoxTen3 from "@/assets/boxTen/porsche/filters_format(webp)_quality(80) (1).webp";
// boxRigth
import porscheBoxRight1 from "@/assets/boxRight/porsche/filters_format(webp)_quality(80).webp";
// boxLeft
import porscheBoxLeft1 from "@/assets/boxLeft/porsche/filters_format(webp)_quality(80).webp";

export const BRAND_PAGES: BrandData[] = [
  {
    name: "Tesla",
    slug: "tesla",
    color: "#E82127",
    hoverColor: "#FF3B30",
    heroBg: "from-red-950/30 via-zinc-900 to-zinc-950",
    heroFrom: "#E82127",
    heroVia: "#991b1b",
    heroTo: "#18181b",
    accentColor: "#E82127",
    route: "/tesla",
    slider: [
      {
        name: "Tesla Model 3",
        tagline: "Electric. Autonomous. Unstoppable.",
        description:
          "The Model 3 combines cutting-edge technology with exceptional efficiency, offering instant acceleration and long-range capability in a sleek sedan package.",
        image: teslaSlide1,
        to: true,
      },
      {
        name: "Tesla Model Y",
        tagline: "Versatile Electric SUV",
        description:
          "The Model Y delivers Tesla's innovative technology in a practical SUV form, providing ample cargo space and all-weather capability without compromising performance.",
        image: teslaSlide2,
        to: false,
      },
    ],
    box: [
      {
        name: "Tesla Model S Plaid",
        tagline: "Ludicrous Speed",
        description:
          "With 1,020 horsepower and a sub-2-second 0-60 mph time, the Model S Plaid is the quickest production car ever made, redefining what's possible in an electric vehicle.",
        image: teslaBox,
      },
      {
        name: "Tesla Cybertruck",
        tagline: "Built for Anything",
        description:
          "Featuring an exoskeleton of ultra-hard 30X cold-rolled stainless steel and armored glass, the Cybertruck combines unprecedented durability with exceptional utility and performance.",
        image: teslaBox,
      },
    ],
    boxTrips: [
      {
        name: "Tesla Powerwall",
        tagline: "Home Energy Storage",
        description:
          "Store solar energy for use at any time, providing backup power during outages and reducing reliance on the grid with seamless integration to your home's electrical system.",
        image: teslaBoxTrips1,
      },
      {
        name: "Tesla Solar Panels",
        tagline: "Sustainable Energy Generation",
        description:
          "Efficient, low-profile solar panels that convert sunlight into electricity, designed to integrate seamlessly with your roof while providing clean, renewable energy for your home.",
        image: teslaBoxTrips2,
      },
      {
        name: "Tesla Charging Network",
        tagline: "Global Supercharger Access",
        description:
          "The world's largest fast-charging network with over 45,000 Superchargers strategically located along major highways and convenient destinations for effortless long-distance travel.",
        image: teslaBoxTrips3,
      },
    ],
    boxone: [
      {
        name: "Tesla Model Y Performance",
        tagline: "Electric SUV Excellence",
        description:
          "Combining the versatility of an SUV with track-capable performance, the Model Y Performance offers dual-motor all-wheel drive and enhanced handling for an exhilarating driving experience.",
        image: teslaBoxOne,
      },
    ],
    boxTen: [
      {
        name: "Tesla Full Self-Driving",
        tagline: "Autonomous Driving Technology",
        description:
          "Advanced driver assistance system that navigates urban streets, handles complex intersections, and parks automatically, continuously improving through over-the-air updates.",
        image: teslaBoxTen1,
      },
      {
        name: "Tesla Safety Features",
        tagline: "Industry-Leading Protection",
        description:
          "Every Tesla is designed to be the safest vehicle in its class with innovative active safety features and a rigid passenger cell that has earned top safety ratings worldwide.",
        image: teslaBoxTen2,
      },
    ],
    boxLeft: [
      {
        name: "Tesla Model 3 Performance",
        tagline: "Track-Ready Electric Sedan",
        description:
          "Performance upgrades including enhanced brakes, suspension, and wheels transform the Model 3 into a true driver's car while maintaining everyday practicality and efficiency.",
        image: teslaBoxleft,
      },
    ],
    boxRight: [
      {
        name: "Tesla Model Y Long Range",
        tagline: "Maximum Electric Range",
        description:
          "Optimized for efficiency with an extended range battery and aerodynamic improvements, delivering exceptional real-world range for daily commutes and road trips alike.",
        image: teslaBoxRight,
      },
    ],
    stats: [
      { value: "1,020+", label: "Peak Horsepower" },
      { value: "200+ mph", label: "Top Speed" },
      { value: "15 min", label: "Supercharge" },
      { value: "5-Star", label: "Safety Rating" },
    ],
    models: [
      "Model S Plaid",
      "Model 3 Performance",
      "Model X Long Range",
      "Cybertruck Beast",
      "Semi Truck",
      "Roadster 2.0",
    ],
  },
  {
    name: "BMW",
    slug: "bmw",
    color: "#000000",
    hoverColor: "#FFFFFF",
    heroBg: "from-gray-950/40 via-zinc-900 to-zinc-950",
    heroFrom: "#000000",
    heroVia: "#6b7280",
    heroTo: "#18181b",
    accentColor: "#000000",
    route: "/bmw",
    slider: [
      {
        name: "BMW X5 xDrive40i",
        tagline: "Luxury SUV Excellence",
        description:
          "The BMW X5 xDrive40i combines powerful performance with sophisticated luxury, offering a twin-turbo inline-6 engine and advanced xDrive all-wheel drive for confident handling in any conditions.",
        image: bmwSlide1,
        to: true,
      },
      {
        name: "BMW i4",
        tagline: "Electric Performance Sedan",
        description:
          "BMW's first all-electric Gran Coupe delivers instant acceleration, long-range capability, and the dynamic handling that defines the Ultimate Driving Machine experience.",
        image: bmwSlide1,
        to: false,
      },
    ],
    box: [
      {
        name: "BMW M3 Competition",
        tagline: "Track-Ready Precision",
        description:
          "With 503 horsepower from its twin-turbo inline-6 engine and race-derived chassis enhancements, the M3 Competition delivers race car dynamics with everyday usability.",
        image: bmwBox,
      },
      {
        name: "BMW 7 Series",
        tagline: "Ultimate Luxury Sedan",
        description:
          "The flagship 7 Series represents the pinnacle of BMW luxury, featuring innovative technology, exceptional comfort, and powerful engine options in an elegant package.",
        image: bmwBox,
      },
    ],
    boxTrips: [
      {
        name: "BMW X5 Off-Road Package",
        tagline: "Adventure Ready",
        description:
          "Available off-road package increases ground clearance, adds underbody protection, and includes specialized driving modes for confident exploration beyond paved roads.",
        image: bmwBoxTrips1,
      },
      {
        name: "BMW iX Electric SUV",
        tagline: "Future of Mobility",
        description:
          "BMW's flagship electric SUV combines sustainable materials, innovative technology, and impressive range with the brand's signature driving dynamics.",
        image: bmwBoxTrips2,
      },
      {
        name: "BMW M Performance Parts",
        tagline: "Enhanced Driving Dynamics",
        description:
          "From aerodynamic components to suspension upgrades and performance exhaust systems, M Performance parts allow owners to personalize their BMW's character and capabilities.",
        image: bmwBoxTrips3,
      },
    ],
    boxone: [
      {
        name: "BMW X6 M Competition",
        tagline: "Coupe SUV Power",
        description:
          "Combining coupe-like styling with SUV practicality, the X6 M Competition delivers 617 horsepower from its twin-turbo V8 engine for exhilarating performance.",
        image: bmwBoxOne,
      },
    ],
    boxTen: [
      {
        name: "BMW iDrive 8",
        tagline: "Intuitive Interface",
        description:
          "BMW's latest infotainment system features a curved display, natural voice control, and over-the-air updates that keep your vehicle current with the latest technology.",
        image: bmwBoxTen1,
      },
      {
        name: "BMW Driver Assistance",
        tagline: "Confidence Every Mile",
        description:
          "Advanced driver assistance systems including adaptive cruise control, lane keeping aid, and collision mitigation work together to enhance safety and reduce driver fatigue.",
        image: bmwBoxTen2,
      },
    ],
    boxLeft: [
      {
        name: "BMW M2 Competition",
        tagline: "Pure Driving Joy",
        description:
          "The most driver-focused BMW available today, the M2 Competition offers a twin-turbo inline-6 engine, manual transmission option, and precise handling in a compact package.",
        image: bmwBoxLeft,
      },
    ],
    boxRight: [
      {
        name: "BMW 4 Series Convertible",
        tagline: "Open-Air Thrills",
        description:
          "Experience the joy of open-top driving with the 4 Series Convertible, featuring a power-retractable soft top and sporty performance characteristics.",
        image: bmwBox,
      },
    ],
    stats: [
      { value: "523 hp", label: "X5 M50i" },
      { value: "4.1s", label: "0-60 mph" },
      { value: "AWD", label: "xDrive System" },
      { value: "8-speed", label: "Steptronic Transmission" },
    ],
    models: [
      "X5 xDrive40i",
      "X5 M50i",
      "X3 M40i",
      "5 Series Sedan",
      "7 Series",
      "8 Series Coupe",
    ],
  },
  {
    name: "GTR",
    slug: "gtr",
    color: "#00A651",
    hoverColor: "#00C864",
    heroBg: "from-green-950/40 via-zinc-900 to-zinc-950",
    heroFrom: "#00A651",
    heroVia: "#065f46",
    heroTo: "#18181b",
    accentColor: "#00A651",
    route: "/gtr",
    slider: [
      {
        name: "Nissan GT-R",
        tagline: "Godzilla Reborn",
        description:
          "The Nissan GT-R, affectionately known as 'Godzilla,' combines brutal performance with everyday usability. Its advanced all-wheel drive system and twin-turbo V6 engine deliver supercar performance in a practical package.",
        image: gtrSlide1,
      },
    ],
    box: [
      {
        name: "GT-R Heritage",
        tagline: "Japanese Engineering Excellence",
        description:
          "For over five decades, the GT-R has represented the pinnacle of Japanese automotive engineering. Each generation builds upon the legacy of its predecessors while pushing the boundaries of performance.",
        image: gtrBox,
      },
    ],
    boxTrips: [
      {
        name: "GT-R Engine",
        tagline: "Heart of Godzilla",
        description:
          "The hand-built VR38DETT twin-turbo V6 engine is a masterpiece of engineering, producing incredible power while maintaining remarkable reliability.",
        image: gtrBoxTrips1,
      },
      {
        name: "GT-R Exterior",
        tagline: "Iconic Styling",
        description:
          "From its distinctive round taillights to its aggressive front fascia, every GT-R exterior element serves both form and function.",
        image: gtrBoxTrips2,
      },
      {
        name: "GT-R Interior",
        tagline: "Driver-Focused Cockpit",
        description:
          "The GT-R's interior blends luxury materials with functional design, putting all controls at the driver's fingertips for an engaging driving experience.",
        image: gtrBoxTrips3,
      },
    ],
    boxone: [
      {
        name: "GT-R Millennium Jade",
        tagline: "Limited Edition Beauty",
        description:
          "The Millennium Jade paint option represents one of the most sought-after colors in GT-R history, available only for limited periods.",
        image: gtrBoxOne1,
      },
    ],
    boxTen: [
      {
        name: "GT-R Lighting",
        tagline: "Advanced Illumination",
        description:
          "LED headlights and taillights provide exceptional visibility while contributing to the GT-R's distinctive visual signature.",
        image: gtrBoxTen1,
      },
      {
        name: "GT-R Transmission",
        tagline: "Precision Shifting",
        description:
          "The dual-clutch transmission delivers lightning-fast gear changes with minimal power loss, contributing to the GT-R's explosive acceleration.",
        image: gtrBoxTen2,
      },
      {
        name: "GT-R Controls",
        tagline: "Driver Engagement",
        description:
          "Paddle shifters and steering wheel controls allow drivers to stay focused on the road while making quick adjustments to driving dynamics.",
        image: gtrBoxTen3,
      },
      {
        name: "GT-R Technology",
        tagline: "Connected Driving",
        description:
          "Modern infotainment systems provide navigation, entertainment, and vehicle information while maintaining the driver's focus on performance.",
        image: gtrBoxTen4,
      },
      {
        name: "GT-R Wheels",
        tagline: "Forged Performance",
        description:
          "Lightweight forged aluminum wheels reduce unsprung weight for improved handling while adding to the GT-R's aggressive stance.",
        image: gtrBoxTen5,
      },
    ],
    boxLeft: [
      {
        name: "GT-R Seating",
        tagline: "Premium Comfort",
        description:
          "Bolstered seats provide excellent support during spirited driving while maintaining comfort for long-distance journeys.",
        image: gtrBoxLeft1,
      },
    ],
    boxRight: [
      {
        name: "GT-R Profile",
        tagline: "Iconic Silhouette",
        description:
          "The GT-R's distinctive profile is instantly recognizable, combining aerodynamic efficiency with unmistakable styling cues.",
        image: gtrBoxRight1,
      },
      {
        name: "GT-R Alternate",
        tagline: "Versatile Design",
        description:
          "While maintaining its core identity, the GT-R offers various styling options to suit different driver preferences.",
        image: gtrBoxRight2,
      },
    ],
    // boxTen, boxLeft, boxRight already defined above for GTR
    stats: [
      { value: "565 hp", label: "Twin-Turbo V6" },
      { value: "196 mph", label: "Top Speed" },
      { value: "2.9s", label: "0-60 mph" },
      { value: "AWD", label: "Advanced ATTESA E-TS" },
    ],
    models: [
      "GT-R Premium",
      "GT-R Track Edition",
      "GT-R Nismo",
      "GT-R50 by Italdesign",
      "GT-R Nismo Special Edition",
    ],
  },
  {
    name: "Porsche",
    slug: "porsche",
    color: "#FFB800",
    hoverColor: "#FFC933",
    heroBg: "from-amber-950/40 via-zinc-900 to-zinc-950",
    heroFrom: "#FFB800",
    heroVia: "#b45309",
    heroTo: "#18181b",
    accentColor: "#FFB800",
    route: "/porsche",
    slider: [
      {
        name: "Porsche 911",
        tagline: "The Sports Car Icon",
        description:
          "For over 50 years, the Porsche 911 has defined what a sports car should be. Its distinctive silhouette, rear-engine layout, and continuous evolution have made it an automotive legend.",
        image: porscheSlide1,
      },
    ],
    box: [
      {
        name: "Porsche 911 GT3",
        tagline: "Track-Ready Performance",
        description:
          "The GT3 represents Porsche's ultimate expression of track-focused engineering, delivering race car performance with street-legal usability.",
        image: porscheBoxOne1,
      },
      {
        name: "Porsche Taycan",
        tagline: "Electric Innovation",
        description:
          "As Porsche's first all-electric sports car, the Taycan proves that zero-emission driving can be exhilarating without compromise.",
        image: porscheBox,
      },
    ],
    boxTrips: [
      {
        name: "Porsche Design",
        tagline: "Timeless Aesthetics",
        description:
          "From the iconic 911 silhouette to the modern Panamera, Porsche design language balances heritage with contemporary sophistication.",
        image: porscheBoxTrips1,
      },
      {
        name: "Porsche Interior",
        tagline: "Luxurious Craftsmanship",
        description:
          "Every Porsche interior combines premium materials with ergonomic design, creating a driver-focused environment that exudes quality.",
        image: porscheBoxTrips2,
      },
      {
        name: "Porsche Technology",
        tagline: "Innovation Leadership",
        description:
          "Porsche continues to push automotive technology forward, from advanced driver assistance systems to cutting-edge connectivity features.",
        image: porscheBoxTrips3,
      },
    ],
    boxone: [
      {
        name: "Porsche 911",
        tagline: "Iconic Sports Car",
        description:
          "For over 50 years, the Porsche 911 has defined what a sports car should be. Its distinctive silhouette, rear-engine layout, and continuous evolution have made it an automotive legend.",
        image: porscheBoxOne1,
      },
    ],
    boxTen: [
      {
        name: "Porsche 911 Turbo",
        tagline: "Ultimate Performance",
        description:
          "The 911 Turbo represents the pinnacle of Porsche's sports car lineup, offering breathtaking performance with daily usability.",
        image: porscheBoxTen1,
      },
      {
        name: "Porsche Panamera",
        tagline: "Luxury Performance",
        description:
          "Combining sports car performance with luxury sedan comfort, the Panamera offers the best of both worlds for discerning drivers.",
        image: porscheBoxTen2,
      },
      {
        name: "Porsche Cayenne",
        tagline: "Sport SUV Excellence",
        description:
          "As Porsche's flagship SUV, the Cayenne delivers sports car dynamics in a practical package suitable for family adventures.",
        image: porscheBoxTen3,
      },
    ],
    boxLeft: [
      {
        name: "Porsche Driving Experience",
        tagline: "Connected to the Road",
        description:
          "Every Porsche is engineered to provide exceptional feedback and connection to the road, making every drive engaging and enjoyable.",
        image: porscheBoxLeft1,
      },
    ],
    boxRight: [
      {
        name: "Porsche Heritage",
        tagline: "Decades of Excellence",
        description:
          "From the original 356 to modern masterpieces, Porsche's racing heritage and engineering excellence continue to inspire enthusiasts worldwide.",
        image: porscheBoxRight1,
      },
    ],
    stats: [
      { value: "473 hp", label: "911 Carrera S" },
      { value: "3.5s", label: "0-60 mph" },
      { value: "RWD", label: "Rear-Wheel Drive" },
      { value: "8-speed", label: "PDK Transmission" },
    ],
    models: [
      "911 Carrera",
      "911 Carrera S",
      "911 Turbo",
      "911 GT3",
      "911 GT3 RS",
      "Taycan Turbo",
    ],
  },
] as const;
