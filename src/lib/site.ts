/** All copy + content for the site, kept out of the components. */

export const BRAND = {
  name: "PARALLAX",
  tagline: "Coffee House & Roastery",
  established: "EST. SPECIALITY · 2016",
  address: "448 Broome St, SoHo, New York, USA",
  hours: "Mon–Fri 07:00–19:00 · Sat–Sun 08:00–18:00",
  phone: "+1234567890",
  email: "contact@parallax.coffee",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Story", href: "#story" },
  { label: "Ritual", href: "#ritual" },
  { label: "Menu", href: "#menu" },
  { label: "Craft", href: "#craft" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
] as const;

export const TICKER = [
  "Speciality Grade 88+",
  "Single Origin",
  "Slow Roasted Daily",
  "Q-Grader Baristas",
  "Direct Trade Origins",
  "Roasted On Site",
] as const;

export type MenuCategory = "Espresso" | "Slow Brew" | "Pastries";

export type FlavorRadar = {
  sweetness: number;
  acidity: number;
  body: number;
  aroma: number;
};

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  price: string;
  image: string;
  blurb: string;
  notes: string[];
  artisanTitle: string;
  edition: string;
  roastIntensity: number; // 1 to 5
  servingTemp: string;
  originTerroir: string;
  pairing: string;
  cuppingScore: string;
  extractionRatio: string;
  flavorProfile: FlavorRadar;
};

export const MENU: MenuItem[] = [
  {
    id: "cortado",
    name: "Cortado",
    artisanTitle: "Double Espresso & Steamed Milk (1:1)",
    edition: "House Speciality",
    category: "Espresso",
    price: "£4.20",
    image: "/images/menu/cortado.png",
    blurb:
      "Equal parts rich double espresso and velvety steamed milk with a delicate layer of microfoam, served in a traditional 4.5oz glass.",
    notes: ["Cocoa nib", "Hazelnut", "Brown sugar"],
    roastIntensity: 4,
    servingTemp: "60°C Steamed Milk",
    originTerroir: "Guji Hambela, Ethiopia · 2,050m",
    pairing: "Almond Croissant",
    cuppingScore: "89.5 Q+",
    extractionRatio: "1:1 Double Shot & Silky Milk",
    flavorProfile: { sweetness: 4, acidity: 2, body: 5, aroma: 4 },
  },
  {
    id: "ristretto",
    name: "Double Espresso",
    artisanTitle: "Double Ristretto Shot · 18g In, 22g Out",
    edition: "Single Origin",
    category: "Espresso",
    price: "£3.40",
    image: "/images/menu/espresso.png",
    blurb:
      "A dense, concentrated double shot extracted from freshly ground Colombian single-origin beans. Syrupy crema with dark chocolate depth.",
    notes: ["Dark chocolate", "Fig", "Cedar"],
    roastIntensity: 5,
    servingTemp: "92°C Extraction",
    originTerroir: "Huila Pitalito, Colombia · 1,740m",
    pairing: "Salted Caramel Brownie",
    cuppingScore: "91.0 Q+",
    extractionRatio: "18g in · 22g out · 26s",
    flavorProfile: { sweetness: 2, acidity: 3, body: 5, aroma: 5 },
  },
  {
    id: "flat-white",
    name: "Flat White",
    artisanTitle: "Double Shot with Silky Microfoam",
    edition: "House Favourite",
    category: "Espresso",
    price: "£4.60",
    image: "/images/menu/flat-white.png",
    blurb:
      "A double ristretto shot topped with glossy textured whole milk and free-poured latte art, balancing natural espresso sweetness.",
    notes: ["Toffee", "Almond", "Clove"],
    roastIntensity: 3,
    servingTemp: "60°C Microfoam",
    originTerroir: "Nyeri Karatina, Kenya · 1,880m",
    pairing: "Almond Croissant",
    cuppingScore: "88.5 Q+",
    extractionRatio: "Double Ristretto Base",
    flavorProfile: { sweetness: 4, acidity: 2, body: 4, aroma: 4 },
  },
  {
    id: "cold-brew",
    name: "Dark Elixir Cold Brew",
    artisanTitle: "18-Hour Slow Steep · 60% Premium Blend",
    edition: "Signature Reserve",
    category: "Slow Brew",
    price: "£5.80",
    image: "/images/menu/coldbrew.png",
    blurb:
      "The house signature cold elixir. Coarsely ground single-origin beans steeped in chilled filtered water for eighteen hours. Exceptionally smooth, low acidity, served over clear crystal ice.",
    notes: ["Dark cacao", "Toffee", "Candied citrus"],
    roastIntensity: 4,
    servingTemp: "Chilled at 3°C Over Crystal Ice",
    originTerroir: "Huila Pitalito & Antigua · 1,740m",
    pairing: "Salted Caramel Brownie",
    cuppingScore: "92.0 Q+",
    extractionRatio: "18h Chilled Steep · Nitrogen Lock",
    flavorProfile: { sweetness: 4, acidity: 2, body: 5, aroma: 5 },
  },
  {
    id: "croissant",
    name: "Almond Croissant",
    artisanTitle: "Twice-Baked French Butter Pastry",
    edition: "Freshly Baked",
    category: "Pastries",
    price: "£4.10",
    image: "/images/menu/almond-croissant.png",
    blurb:
      "Twice-baked laminated French butter pastry filled with rich Valencia almond cream and finished with toasted flaked almonds.",
    notes: ["Butter", "Marzipan", "Sea salt"],
    roastIntensity: 2,
    servingTemp: "Served Warm",
    originTerroir: "Valencia Almonds & Normandy Butter",
    pairing: "Cortado or Flat White",
    cuppingScore: "Artisan Grade A",
    extractionRatio: "72h Laminated Dough",
    flavorProfile: { sweetness: 4, acidity: 1, body: 4, aroma: 5 },
  },
  {
    id: "brownie",
    name: "Salted Caramel Brownie",
    artisanTitle: "Fudgy 70% Dark Chocolate & Sea Salt",
    edition: "Freshly Baked",
    category: "Pastries",
    price: "£5.20",
    image: "/images/menu/salt-brownie.png",
    blurb:
      "Baked with single-estate 70% dark chocolate, molten fudgy centre, and finished with warm homemade salted caramel and Maldon salt.",
    notes: ["Dark cacao", "Burnt sugar", "Sea salt"],
    roastIntensity: 5,
    servingTemp: "Warm Molten Centre",
    originTerroir: "Guayas Single-Estate 70% Cacao",
    pairing: "Double Espresso",
    cuppingScore: "Single Origin Cacao",
    extractionRatio: "Warm Molten Centre",
    flavorProfile: { sweetness: 5, acidity: 1, body: 5, aroma: 5 },
  },
];

export const MENU_CATEGORIES: Array<MenuCategory | "All"> = [
  "All",
  "Espresso",
  "Slow Brew",
  "Pastries",
];

export const CRAFT_STEPS = [
  {
    index: "01",
    title: "Source",
    image: "/images/craft/source.jpg",
    body:
      "We buy two harvests ahead, direct from eleven farms. Every lot is cupped blind three times before a single sack crosses our door.",
    meta: "11 partner farms",
  },
  {
    index: "02",
    title: "Roast",
    image: "/images/craft/roast.jpg",
    body:
      "Twelve-kilo drum, profiled by hand. We chase clarity over caramel — the development window rarely runs past ninety seconds.",
    meta: "Roasted every morning",
  },
  {
    index: "03",
    title: "Extract",
    image: "/images/craft/extract.jpg",
    body:
      "Water re-mineralised to 78 ppm, baskets weighed to the tenth of a gram, every shot logged against the day's refractometer curve.",
    meta: "1:2.4 in 26 seconds",
  },
  {
    index: "04",
    title: "Serve",
    image: "/images/craft/serve.jpg",
    body:
      "Warmed porcelain, a glass of still water, and a table nobody will ask you to leave. The last ten seconds matter most.",
    meta: "No rush, ever",
  },
] as const;

export const ORIGINS = [
  { country: "Ethiopia", region: "Guji, Hambela", altitude: "2,050 m", process: "Natural" },
  { country: "Colombia", region: "Huila, Pitalito", altitude: "1,740 m", process: "Washed" },
  { country: "Kenya", region: "Nyeri, Karatina", altitude: "1,880 m", process: "Washed" },
  { country: "Guatemala", region: "Antigua", altitude: "1,600 m", process: "Honey" },
] as const;

export const GALLERY = [
  { src: "/images/gallery/interior-loft.jpg", caption: "The upper room", span: "tall" },
  { src: "/images/gallery/pour-milk.jpg", caption: "Morning pour", span: "short" },
  { src: "/images/gallery/lattes-plants.jpg", caption: "Window seats", span: "short" },
  { src: "/images/gallery/interior-bikes.jpg", caption: "The long bar", span: "tall" },
  { src: "/images/gallery/iced.jpg", caption: "Cold brew, no. 4", span: "tall" },
  { src: "/images/gallery/cake.jpg", caption: "Pastry counter", span: "short" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "The most considered cup I have found here. A twelve-minute break gets treated like a tasting menu, and somehow nobody makes you feel hurried.",
    name: "Thursday regular",
    role: "Four years, same table",
  },
  {
    quote:
      "The room is beautiful, but it is the consistency that keeps the chairs full. It tastes the same on a wet Tuesday as it does on a Saturday.",
    name: "From the morning queue",
    role: "Overheard at the bar",
  },
  {
    quote:
      "The barrel-aged cold brew is the best thing I have drunk all year. Restrained, complex, and served with real warmth.",
    name: "A visiting roaster",
    role: "Left a note on the counter",
  },
] as const;

export const STATS = [
  { value: "2016", label: "Established" },
  { value: "11", label: "Direct origins" },
  { value: "3", label: "Q-graders" },
  { value: "88+", label: "Cupping score" },
] as const;

/* ──────────────────────────────────────────────────────────────
   Home2 — scroll-driven coffee sequence
   ────────────────────────────────────────────────────────────── */

/**
 * The cinematic assets are 240-frame image sequences:
 * - Sequence 1 (video1-frames): LUMÉ Dark Elixir can splash and 360° fluid orbit.
 * - Sequence 2 (video2-frames): The Tabletop Cold Pour Ritual into crystal ice glass.
 */
export const SEQUENCE_VIDEO1 = {
  id: "orbit",
  name: "The Kinetic Orbit",
  subtitle: "360° Zero-Gravity Can Splash",
  path: (n: number) =>
    `/video1-frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`,
  first: 1,
  last: 240,
  width: 1920,
  height: 1080,
} as const;

export const SEQUENCE_VIDEO2 = {
  id: "pour",
  name: "The Cold Pour Ritual",
  subtitle: "Tabletop Crystal Glass Pour",
  path: (n: number) =>
    `/video2-frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`,
  first: 1,
  last: 240,
  width: 1920,
  height: 1080,
} as const;

/** Active sequence alias for the hero section */
export const COFFEE_SEQUENCE = SEQUENCE_VIDEO1;

export type HeroBeat = {
  id: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  titleTail?: string;
  body?: string;
  /** Timeline window as scroll progress: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] */
  window: [number, number, number, number];
};

export const HERO_BEATS: HeroBeat[] = [
  {
    id: "lift",
    eyebrow: "01 — The Submersion",
    title: "Cold-crafted to",
    titleAccent: "perfection",
    titleTail: ".",
    body: "Eighteen hours of slow chilled water steep, drawing deep cocoa and toffee notes without bitterness.",
    window: [0.24, 0.30, 0.40, 0.46],
  },
  {
    id: "pour",
    eyebrow: "02 — The Orbit",
    title: "Single-origin",
    titleAccent: "balance",
    titleTail: ".",
    body: "High-altitude Colombian beans roasted in micro-lots, locked inside nitrogen-charged cans for optimal freshness.",
    window: [0.52, 0.58, 0.68, 0.74],
  },
  {
    id: "yours",
    eyebrow: "03 — The Dark Elixir",
    title: "Crafted for the",
    titleAccent: "discerning",
    titleTail: ".",
    window: [0.85, 0.91, 1.01, 1.02],
  },
];

export type RitualBeat = {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
  specs: { label: string; value: string }[];
  /** Progress window [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] */
  window: [number, number, number, number];
};

export const RITUAL_BEATS: RitualBeat[] = [
  {
    id: "crystal",
    step: "01",
    eyebrow: "The Chilled Stage",
    title: "Crystal Coupe",
    titleAccent: "& Clear Ice",
    body: "Directionally frozen, hand-carved ice cubes nestled in a lead-free crystal goblet to lock in chill without premature dilution.",
    specs: [
      { label: "Glass Temp", value: "-4°C" },
      { label: "Ice Purity", value: "99.8%" },
    ],
    window: [0.08, 0.16, 0.30, 0.38],
  },
  {
    id: "cascade",
    step: "02",
    eyebrow: "The Extraction Apex",
    title: "The Dark Elixir",
    titleAccent: "Cascade",
    body: "Extracted via 18-hour cold immersion from Huila Colombian beans. Notes of dark cacao, toffee, and candied citrus peel emerge as it splashes over ice.",
    specs: [
      { label: "Pour Rate", value: "12 ml/s" },
      { label: "Chill Temp", value: "3.2°C" },
    ],
    window: [0.42, 0.50, 0.64, 0.72],
  },
  {
    id: "finish",
    step: "03",
    eyebrow: "The Signature Serve",
    title: "Velvety,",
    titleAccent: "Silken Crema",
    body: "Micro-filtered for crystalline clarity and an exceptionally smooth mouthfeel. Paired with single-estate 70% Venezuelan chocolate.",
    specs: [
      { label: "Serving Size", value: "250 ml" },
      { label: "Pairing", value: "70% Single-Estate Cacao" },
    ],
    window: [0.74, 0.82, 0.94, 0.99],
  },
];
