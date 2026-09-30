export type Orientation = "portrait" | "landscape" | "square" | "ultrawide";
export type DeviceKind = "phone" | "tablet" | "laptop" | "desktop" | "ultrawide";

export interface Wallpaper {
  id: string;
  title: string;
  seed: string;
  image: string;
  thumbnail: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  width: number;
  height: number;
  orientation: Orientation;
  device: DeviceKind[];
  downloads: number;
  likes: number;
  createdAt: string;
  isAI: boolean;
  colors: string[];
  featured?: boolean;
}

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

type Raw = Omit<Wallpaper, "image" | "thumbnail" | "authorAvatar"> & { seed: string };

const RAW: Raw[] = [
  { id: "midnight-porsche", title: "Midnight Porsche — Tokyo Rain", seed: "wallora-porsche", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 48210, likes: 9214, createdAt: "2026-09-10", isAI: false, category: "cars", tags: ["black sports car","night","rain","neon","cinematic"], author: "Kaito Mori", colors: ["#0b0e14","#1d2a3a","#e4572e"], featured: true },
  { id: "dune-silence", title: "Dune Silence", seed: "wallora-dune", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 31120, likes: 7022, createdAt: "2026-09-18", isAI: false, category: "minimal", tags: ["minimal","desert","calm","beige"], author: "Amara Diallo", colors: ["#d9c7a7","#8a6f4d","#1a1a1a"] },
  { id: "anime-sunset", title: "Anime Sunset Over the Valley", seed: "wallora-anime1", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop","tablet"], downloads: 55400, likes: 12040, createdAt: "2026-08-28", isAI: false, category: "anime", tags: ["anime sunset","valley","clouds","warm"], author: "Yuki Tanaka", colors: ["#f4a259","#5e548e","#231942"], featured: true },
  { id: "forest-fog", title: "Fog in the Pines", seed: "wallora-forest", width: 1080, height: 1920, orientation: "portrait", device: ["phone","tablet"], downloads: 28900, likes: 6105, createdAt: "2026-09-02", isAI: false, category: "nature", tags: ["forest","fog","green","calm","minimal mountain"], author: "Jonas Weber", colors: ["#1c2b21","#3a5a40","#dad7cd"] },
  { id: "cyberpunk-alley", title: "Cyberpunk Alley", seed: "wallora-cyber", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 39800, likes: 8830, createdAt: "2026-09-12", isAI: true, category: "gaming", tags: ["cyberpunk city","neon","dark gaming","night"], author: "Wallora AI", colors: ["#0d0221","#ff007f","#00e5ff"] },
  { id: "pink-dunes", title: "Pink Aesthetic Dunes", seed: "wallora-pink", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 22140, likes: 5890, createdAt: "2026-09-20", isAI: false, category: "aesthetic", tags: ["pink aesthetic","dunes","soft","dreamy"], author: "Sofia Marques", colors: ["#f8ad9d","#f4978e","#f08080"] },
  { id: "orbit-station", title: "Orbital Drift", seed: "wallora-space1", width: 3840, height: 2160, orientation: "landscape", device: ["desktop","ultrawide"], downloads: 18400, likes: 4210, createdAt: "2026-09-05", isAI: false, category: "space", tags: ["space","stars","galaxy","dark"], author: "Elena Vostok", colors: ["#030014","#3a0ca3","#f8f9fa"] },
  { id: "temple-autumn", title: "Temple in Autumn", seed: "wallora-temple", width: 1920, height: 1280, orientation: "landscape", device: ["desktop","laptop"], downloads: 26700, likes: 5930, createdAt: "2026-08-20", isAI: false, category: "travel", tags: ["japanese temple in autumn","travel","red","calm"], author: "Ren Hayashi", colors: ["#9d0208","#dc2f02","#ffba08"] },
  { id: "dark-castle", title: "Dark Fantasy Castle", seed: "wallora-castle", width: 1080, height: 1920, orientation: "portrait", device: ["phone","tablet"], downloads: 33400, likes: 7610, createdAt: "2026-09-08", isAI: true, category: "fantasy", tags: ["dark fantasy castle","moody","dramatic"], author: "Wallora AI", colors: ["#10002b","#3c096c","#e0aa3e"] },
  { id: "ocean-moon", title: "Ocean Under Moonlight", seed: "wallora-ocean", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 41200, likes: 9040, createdAt: "2026-09-01", isAI: false, category: "nature", tags: ["ocean under moonlight","sea","night","calm"], author: "Maya Chen", colors: ["#03045e","#0077b6","#caf0f8"] },
  { id: "future-city", title: "Future City — Dawn Line", seed: "wallora-future", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 19800, likes: 4520, createdAt: "2026-09-15", isAI: true, category: "technology", tags: ["futuristic city","architecture","morning"], author: "Wallora AI", colors: ["#111827","#60a5fa","#f9fafb"] },
  { id: "mountain-escape", title: "Mountain Escape", seed: "wallora-mountain", width: 1080, height: 1350, orientation: "portrait", device: ["phone","tablet"], downloads: 37600, likes: 8120, createdAt: "2026-09-19", isAI: false, category: "nature", tags: ["minimal mountain","snow","sunset","calm"], author: "Lars Nilsen", colors: ["#264653","#e9c46a","#f4f1de"] },
  { id: "gaming-nights", title: "Gaming Nights — Setup Glow", seed: "wallora-setup", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 44500, likes: 9870, createdAt: "2026-09-11", isAI: false, category: "gaming", tags: ["dark gaming","setup","neon","room"], author: "Diego Ramos", colors: ["#0a0a0a","#7c3aed","#22d3ee"] },
  { id: "calm-morning", title: "Calm Morning Field", seed: "wallora-field", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 15200, likes: 3340, createdAt: "2026-09-21", isAI: false, category: "minimal", tags: ["calm","morning","field","bright"], author: "Ingrid Sato", colors: ["#fefae0","#dda15e","#606c38"] },
  { id: "black-runner", title: "Black Sports Car — Studio", seed: "wallora-car2", width: 1920, height: 1080, orientation: "landscape", device: ["desktop"], downloads: 52100, likes: 11200, createdAt: "2026-08-30", isAI: false, category: "cars", tags: ["black sports car","studio","dark","luxury"], author: "Marco Bianchi", colors: ["#0a0a0a","#3f3f3f","#d4d4d4"] },
  { id: "galaxy-dream", title: "Dreamy Galaxy", seed: "wallora-galaxy", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 29800, likes: 6740, createdAt: "2026-09-14", isAI: true, category: "space", tags: ["dreamy galaxy","purple","stars"], author: "Wallora AI", colors: ["#10002b","#9d4edd","#ff Ferr"] },
  { id: "brutalist-block", title: "Brutalist Afternoon", seed: "wallora-brutal", width: 1200, height: 1200, orientation: "square", device: ["tablet","laptop"], downloads: 9800, likes: 2120, createdAt: "2026-09-06", isAI: false, category: "architecture", tags: ["architecture","concrete","minimal","shadows"], author: "Ana Petrova", colors: ["#adb5bd","#495057","#212529"] },
  { id: "red-fox", title: "Red Fox in Snow", seed: "wallora-fox", width: 1920, height: 1280, orientation: "landscape", device: ["desktop","tablet"], downloads: 17400, likes: 3980, createdAt: "2026-09-03", isAI: false, category: "animals", tags: ["animals","fox","snow","wildlife"], author: "Tom Ellery", colors: ["#ffffff","#e76f51","#264653"] },
  { id: "tokyo-night", title: "Tokyo at Night — Crossing", seed: "wallora-tokyo", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 46300, likes: 10120, createdAt: "2026-09-09", isAI: false, category: "travel", tags: ["tokyo","night","city","neon"], author: "Kaito Mori", colors: ["#0a0a0a","#facc15","#ef4444"] },
  { id: "ink-waves", title: "Ink Waves", seed: "wallora-ink", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 13200, likes: 2870, createdAt: "2026-09-16", isAI: true, category: "abstract", tags: ["abstract","black","waves","dark"], author: "Wallora AI", colors: ["#000000","#1f2937","#e5e7eb"] },
  { id: "desert-road", title: "Desert Road — 6AM", seed: "wallora-road", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 21500, likes: 4670, createdAt: "2026-08-25", isAI: false, category: "travel", tags: ["travel","road","desert","morning"], author: "Sarah Okafor", colors: ["#e9c46a","#f4a261","#264653"] },
  { id: "pixel-castle", title: "Pixel Castle Quest", seed: "wallora-pixel", width: 1200, height: 1200, orientation: "square", device: ["tablet","phone"], downloads: 8900, likes: 2310, createdAt: "2026-09-17", isAI: true, category: "gaming", tags: ["pixel art","castle","retro","fantasy"], author: "Wallora AI", colors: ["#1a1a2e","#ffbe0b","#fb5607"] },
  { id: "nordic-fjord", title: "Nordic Fjord", seed: "wallora-fjord", width: 3840, height: 2160, orientation: "landscape", device: ["desktop"], downloads: 24100, likes: 5230, createdAt: "2026-08-22", isAI: false, category: "nature", tags: ["fjord","mountains","water","travel"], author: "Lars Nilsen", colors: ["#1d3557","#a8dadc","#f1faee"] },
  { id: "anime-street", title: "Anime Street — Rain", seed: "wallora-anime2", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 38900, likes: 8420, createdAt: "2026-09-07", isAI: false, category: "anime", tags: ["anime","rain","street","night"], author: "Yuki Tanaka", colors: ["#1a1a2e","#e94560","#0f3460"] },
  { id: "track-day", title: "Track Day — GT3", seed: "wallora-gt3", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 31200, likes: 6890, createdAt: "2026-09-04", isAI: false, category: "cars", tags: ["cars","racing","sports","speed"], author: "Marco Bianchi", colors: ["#111111","#dc2626","#f5f5f5"] },
  { id: "moss-macro", title: "Moss Study", seed: "wallora-moss", width: 1080, height: 1350, orientation: "portrait", device: ["phone","tablet"], downloads: 7600, likes: 1840, createdAt: "2026-09-22", isAI: false, category: "nature", tags: ["macro","green","forest","calm"], author: "Jonas Weber", colors: ["#2d6a4f","#40916c","#d8f3dc"] },
  { id: "stadium-lights", title: "Stadium Lights", seed: "wallora-stadium", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 16800, likes: 3420, createdAt: "2026-08-27", isAI: false, category: "sports", tags: ["sports","stadium","night","lights"], author: "Diego Ramos", colors: ["#0a1128","#001f54","#fefcfb"] },
  { id: "paper-planes", title: "Paper Planes — Kids Room", seed: "wallora-paper", width: 1080, height: 1920, orientation: "portrait", device: ["phone","tablet"], downloads: 6400, likes: 1580, createdAt: "2026-09-23", isAI: false, category: "kids", tags: ["kids","cartoons","playful","pastel"], author: "Priya Nair", colors: ["#ffddd2","#83c5be","#edf6f9"] },
  { id: "dino-valley", title: "Dino Valley", seed: "wallora-dino", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","tablet"], downloads: 11200, likes: 2760, createdAt: "2026-09-13", isAI: true, category: "kids", tags: ["dinosaurs","fantasy","kids","adventure"], author: "Wallora AI", colors: ["#2a9d8f","#e9c46a","#264653"] },
  { id: "racer-helmet", title: "Racer — Visor", seed: "wallora-helmet", width: 1080, height: 1350, orientation: "portrait", device: ["phone"], downloads: 19400, likes: 4310, createdAt: "2026-09-15", isAI: false, category: "sports", tags: ["racing","helmet","dark","sports"], author: "Leo Fontaine", colors: ["#0b0b0c","#d90429","#edf2f4"] },
  { id: "linen-fold", title: "Linen Fold", seed: "wallora-linen", width: 1200, height: 1200, orientation: "square", device: ["tablet","laptop"], downloads: 5200, likes: 1180, createdAt: "2026-09-24", isAI: false, category: "minimal", tags: ["minimal","texture","beige","calm"], author: "Amara Diallo", colors: ["#ede0d4","#e6ccb2","#7f5539"] },
  { id: "circuit-board", title: "Circuit Morning", seed: "wallora-circuit", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 13400, likes: 2890, createdAt: "2026-08-29", isAI: false, category: "technology", tags: ["technology","circuit","dark","macro"], author: "Kenji Sato", colors: ["#0a0a0a","#10b981","#1f2937"] },
  { id: "ballet-shadow", title: "Ballet Shadow", seed: "wallora-ballet", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 9800, likes: 2240, createdAt: "2026-09-18", isAI: false, category: "women", tags: ["fashion","dance","shadow","editorial"], author: "Sofia Marques", colors: ["#100b0b","#d6ccc2","#f5ebe0"] },
  { id: "barber-chair", title: "Barbershop Portrait", seed: "wallora-barber", width: 1080, height: 1350, orientation: "portrait", device: ["phone","tablet"], downloads: 8700, likes: 1960, createdAt: "2026-09-05", isAI: false, category: "men", tags: ["men","portrait","style","moody"], author: "James Carter", colors: ["#1a1818","#8d6e63","#d7ccc8"] },
  { id: "sneaker-wall", title: "Sneaker Wall", seed: "wallora-sneaker", width: 1920, height: 1080, orientation: "landscape", device: ["desktop"], downloads: 15600, likes: 3480, createdAt: "2026-09-02", isAI: false, category: "men", tags: ["sneakers","street","fashion","color"], author: "James Carter", colors: ["#f5f5f5","#ff3d00","#212121"] },
  { id: "silk-robe", title: "Silk Robe — Morning", seed: "wallora-silk", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 7200, likes: 1740, createdAt: "2026-09-20", isAI: false, category: "women", tags: ["fashion","aesthetic","soft","morning"], author: "Sofia Marques", colors: ["#fae1dd","#fec89a","#ece4db"] },
  { id: "kart-kids", title: "Little Racers", seed: "wallora-kart", width: 1920, height: 1280, orientation: "landscape", device: ["desktop","tablet"], downloads: 5400, likes: 1320, createdAt: "2026-09-25", isAI: false, category: "kids", tags: ["kids","vehicles","racing","fun"], author: "Priya Nair", colors: ["#ffbe0b","#fb5607","#3a86ff"] },
  { id: "concrete-poem", title: "Concrete Poem", seed: "wallora-concrete", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 6900, likes: 1490, createdAt: "2026-08-31", isAI: false, category: "architecture", tags: ["architecture","minimal","concrete","lines"], author: "Ana Petrova", colors: ["#ced4da","#6c757d","#212529"] },
  { id: "night-owl", title: "Night Owl", seed: "wallora-owl", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 12300, likes: 2890, createdAt: "2026-09-11", isAI: false, category: "animals", tags: ["animals","owl","night","dark"], author: "Tom Ellery", colors: ["#0d1b2a","#415a77","#e0e1dd"] },
  { id: "neon-dojo", title: "Neon Dojo", seed: "wallora-dojo", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 27600, likes: 6120, createdAt: "2026-09-19", isAI: true, category: "anime", tags: ["anime","dojo","neon","dark"], author: "Wallora AI", colors: ["#080808","#ff206e","#00f5d4"] },
  { id: "salt-flats", title: "Salt Flats — Noon", seed: "wallora-salt", width: 3840, height: 2160, orientation: "landscape", device: ["desktop"], downloads: 8900, likes: 1920, createdAt: "2026-08-26", isAI: false, category: "travel", tags: ["travel","minimal","white","bright"], author: "Sarah Okafor", colors: ["#ffffff","#dee2e6","#adb5bd"] },
  { id: "goth-bouquet", title: "Goth Bouquet", seed: "wallora-goth", width: 1080, height: 1350, orientation: "portrait", device: ["phone"], downloads: 10400, likes: 2460, createdAt: "2026-09-06", isAI: false, category: "dark", tags: ["dark","flowers","moody","black"], author: "Ingrid Sato", colors: ["#0a0a0a","#5a001f","#a4133c"] },
  { id: "espresso-steam", title: "Espresso Steam", seed: "wallora-espresso", width: 1200, height: 1200, orientation: "square", device: ["tablet"], downloads: 4800, likes: 1090, createdAt: "2026-09-26", isAI: false, category: "minimal", tags: ["minimal","coffee","dark","texture"], author: "Amara Diallo", colors: ["#1a120b","#3c2a21","#d5cea3"] },
  { id: "orbit-garden", title: "Orbit Garden", seed: "wallora-orbitgarden", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 16700, likes: 3820, createdAt: "2026-09-17", isAI: true, category: "space", tags: ["space","plants","dreamy","fantasy"], author: "Wallora AI", colors: ["#081c15","#74c69d","#d8f3dc"] },
  { id: "vintage-porsche", title: "Vintage 911 — Coast", seed: "wallora-v911", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 29400, likes: 6580, createdAt: "2026-08-24", isAI: false, category: "cars", tags: ["cars","vintage","coast","afternoon"], author: "Marco Bianchi", colors: ["#e9ecef","#023e8a","#0077b6"] },
  { id: "shibuya-rain", title: "Shibuya Rain — Anime", seed: "wallora-shibuya", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 35200, likes: 7940, createdAt: "2026-09-13", isAI: true, category: "anime", tags: ["anime","tokyo","rain","night"], author: "Wallora AI", colors: ["#111111","#4cc9f0","#f72585"] },
  { id: "alpine-night", title: "Alpine Night", seed: "wallora-alpine", width: 3840, height: 2160, orientation: "landscape", device: ["desktop"], downloads: 20800, likes: 4720, createdAt: "2026-08-23", isAI: false, category: "nature", tags: ["mountains","night","stars","snow"], author: "Lars Nilsen", colors: ["#0a1128","#fefcfb","#5e6472"] },
  { id: "mono-desk", title: "Mono Desk", seed: "wallora-desk", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 11800, likes: 2560, createdAt: "2026-09-21", isAI: false, category: "minimal", tags: ["minimal","desk","workspace","clean"], author: "Kenji Sato", colors: ["#f8f9fa","#dee2e6","#212529"] },
];

export const WALLPAPERS: Wallpaper[] = RAW.map((r) => ({
  ...r,
  image: img(r.seed, r.width > 2000 ? 1600 : r.width >= 1920 ? 1200 : 800, Math.round(((r.width > 2000 ? 1600 : r.width >= 1920 ? 1200 : 800) * r.height) / r.width)),
  thumbnail: img(r.seed, 600, Math.round((600 * r.height) / r.width)),
  authorAvatar: `https://picsum.photos/seed/avatar-${r.author.replace(/\s/g, "")}/96/96`,
  colors: r.id === "galaxy-dream" ? ["#10002b","#9d4edd","#ff70a6"] : r.colors,
}));

export interface Category {
  slug: string;
  label: string;
  description: string;
  seed: string;
  count: number;
  audience?: string;
}

export const CATEGORIES: Category[] = [
  { slug: "men", label: "Men", description: "Sharp portraits, street style, machines and moody editorials.", seed: "wallora-barber", count: 1240 },
  { slug: "women", label: "Women", description: "Fashion editorials, soft light and expressive portraiture.", seed: "wallora-silk", count: 1180 },
  { slug: "kids", label: "Kids", description: "Playful color, friendly animals, dinosaurs and fantasy.", seed: "wallora-paper", count: 860 },
  { slug: "gaming", label: "Gaming", description: "Setups, neon arenas and pixel quests.", seed: "wallora-setup", count: 2430 },
  { slug: "cars", label: "Cars", description: "Midnight drives, track days and studio shots.", seed: "wallora-porsche", count: 1980 },
  { slug: "anime", label: "Anime", description: "Sunsets, rainy streets and neon dojos.", seed: "wallora-anime1", count: 3120 },
  { slug: "nature", label: "Nature", description: "Forests, fjords, deserts and quiet mornings.", seed: "wallora-forest", count: 4210 },
  { slug: "space", label: "Space", description: "Galaxies, orbit stations and night skies.", seed: "wallora-space1", count: 1560 },
  { slug: "sports", label: "Sports", description: "Stadiums, speed and focus.", seed: "wallora-stadium", count: 940 },
  { slug: "technology", label: "Technology", description: "Circuits, future cities and clean workspaces.", seed: "wallora-circuit", count: 1120 },
  { slug: "minimal", label: "Minimal", description: "Quiet compositions that let your icons breathe.", seed: "wallora-dune", count: 2870 },
  { slug: "aesthetic", label: "Aesthetic", description: "Soft tones, film light and dreamy texture.", seed: "wallora-pink", count: 2640 },
  { slug: "dark", label: "Dark", description: "OLED-friendly blacks and low-light drama.", seed: "wallora-goth", count: 1980 },
  { slug: "travel", label: "Travel", description: "Tokyo nights, salt flats and coastal roads.", seed: "wallora-tokyo", count: 1760 },
  { slug: "architecture", label: "Architecture", description: "Concrete, light and geometry.", seed: "wallora-brutal", count: 820 },
  { slug: "animals", label: "Animals", description: "Foxes, owls and wild quiet.", seed: "wallora-fox", count: 1340 },
];

export const AUDIENCE_SUGGESTIONS: Record<string, string[]> = {
  men: ["gaming", "nature", "cars", "anime", "minimal", "space"],
  women: ["aesthetic", "nature", "anime", "minimal", "travel", "dark"],
  kids: ["animals", "space", "travel", "gaming", "nature", "minimal"],
};

export interface Collection {
  slug: string;
  title: string;
  description: string;
  seed: string;
  wallpaperIds: string[];
  updatedAt: string;
}

export const COLLECTIONS: Collection[] = [
  { slug: "midnight-drive", title: "Midnight Drive", description: "Headlights, rain and empty highways. For night thinkers.", seed: "wallora-porsche", wallpaperIds: ["midnight-porsche","black-runner","tokyo-night","neon-dojo"], updatedAt: "Sep 22" },
  { slug: "calm-mornings", title: "Calm Mornings", description: "Soft light and slow starts. Low visual noise.", seed: "wallora-field", wallpaperIds: ["calm-morning","salt-flats","linen-fold","mono-desk"], updatedAt: "Sep 20" },
  { slug: "dark-mode", title: "Dark Mode", description: "True blacks that disappear into OLED.", seed: "wallora-goth", wallpaperIds: ["goth-bouquet","ink-waves","gaming-nights","night-owl"], updatedAt: "Sep 18" },
  { slug: "future-cities", title: "Future Cities", description: "Tokyo, cyber alleys and dawn skylines.", seed: "wallora-future", wallpaperIds: ["future-city","cyberpunk-alley","tokyo-night","shibuya-rain"], updatedAt: "Sep 15" },
  { slug: "lost-in-space", title: "Lost in Space", description: "Galaxies and quiet orbit gardens.", seed: "wallora-space1", wallpaperIds: ["orbit-station","galaxy-dream","orbit-garden","alpine-night"], updatedAt: "Sep 12" },
  { slug: "mountain-escape", title: "Mountain Escape", description: "Snow, fog and high quiet.", seed: "wallora-mountain", wallpaperIds: ["mountain-escape","forest-fog","nordic-fjord","alpine-night"], updatedAt: "Sep 10" },
  { slug: "gaming-nights", title: "Gaming Nights", description: "Glow, setups and pixel quests.", seed: "wallora-setup", wallpaperIds: ["gaming-nights","pixel-castle","neon-dojo","circuit-board"], updatedAt: "Sep 08" },
  { slug: "minimal-living", title: "Minimal Living", description: "Rooms to think in.", seed: "wallora-dune", wallpaperIds: ["dune-silence","linen-fold","mono-desk","brutalist-block"], updatedAt: "Sep 05" },
  { slug: "anime-worlds", title: "Anime Worlds", description: "Rainy streets and golden valleys.", seed: "wallora-anime1", wallpaperIds: ["anime-sunset","anime-street","shibuya-rain","neon-dojo"], updatedAt: "Sep 02" },
  { slug: "ocean-dreams", title: "Ocean Dreams", description: "Moonlit water and slow tides.", seed: "wallora-ocean", wallpaperIds: ["ocean-moon","moss-macro","desert-road","temple-autumn"], updatedAt: "Aug 28" },
];

export const AI_SUGGESTIONS = [
  "Cyberpunk Tokyo at night",
  "Minimal mountain landscape",
  "Luxury car in the rain",
  "Dreamy galaxy",
  "Japanese temple in autumn",
  "Dark fantasy castle",
  "Ocean under moonlight",
  "Futuristic city",
];

export function getWallpaper(id: string) {
  return WALLPAPERS.find((w) => w.id === id);
}

export function relatedWallpapers(id: string, n = 8) {
  const cur = getWallpaper(id);
  if (!cur) return WALLPAPERS.slice(0, n);
  const scored = WALLPAPERS.filter((w) => w.id !== id).map((w) => {
    let s = 0;
    if (w.category === cur.category) s += 3;
    s += w.tags.filter((t) => cur.tags.includes(t)).length;
    if (w.orientation === cur.orientation) s += 1;
    return { w, s };
  });
  return scored.sort((a, b) => b.s - a.s).slice(0, n).map((x) => x.w);
}

export function searchWallpapers(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return WALLPAPERS;
  const terms = query.split(/\s+/);
  return WALLPAPERS.map((w) => {
    const hay = `${w.title} ${w.category} ${w.tags.join(" ")} ${w.author} ${w.colors.join(" ")}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (w.title.toLowerCase().includes(t)) score += 3;
      if (w.category.includes(t)) score += 2;
      if (w.tags.some((tag) => tag.includes(t))) score += 2;
      if (hay.includes(t)) score += 1;
    }
    return { w, score };
  }).filter((x) => x.score > 0).sort((a,b)=>b.score-a.score).map((x)=>x.w);
}
