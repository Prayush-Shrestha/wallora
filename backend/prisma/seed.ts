import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const CATEGORIES = [
  { name: "Nature & Landscapes", slug: "nature", description: "Mountains, oceans, misty forests, and cosmic skies.", image: img("wallora-nature", 600, 400) },
  { name: "Cars & Automotive", slug: "cars", description: "Hypercars, GT3 track weapons, retro classics, and rain slicks.", image: img("wallora-cars", 600, 400) },
  { name: "Anime & Manga", slug: "anime", description: "Cinematic sunsets, quiet city streets, and expressive character art.", image: img("wallora-anime", 600, 400) },
  { name: "Gaming & Cyberpunk", slug: "gaming", description: "Neon alleys, dark setup glows, pixel castles, and retro rigs.", image: img("wallora-gaming", 600, 400) },
  { name: "Minimal & Clean", slug: "minimal", description: "Soft gradients, calm dunes, linen textures, and breathing room.", image: img("wallora-minimal", 600, 400) },
  { name: "Space & Cosmos", slug: "space", description: "Orbital stations, dreamy galaxies, starfields, and distant planets.", image: img("wallora-space", 600, 400) },
  { name: "Aesthetic & Mood", slug: "aesthetic", description: "Pink dunes, soft grain, dreamy lighting, and editorial tone.", image: img("wallora-aesthetic", 600, 400) },
  { name: "Architecture", slug: "architecture", description: "Brutalist blocks, concrete forms, geometric shadows, and lines.", image: img("wallora-architecture", 600, 400) },
  { name: "Technology & Code", slug: "technology", description: "Macro circuits, dark terminals, futuristic cities, and synth.", image: img("wallora-tech", 600, 400) },
  { name: "Travel & Places", slug: "travel", description: "Tokyo crossings, autumn shrines, desert highways, and fjords.", image: img("wallora-travel", 600, 400) },
  { name: "Animals & Wildlife", slug: "animals", description: "Red foxes in snow, majestic predators, and gentle macro fauna.", image: img("wallora-animals", 600, 400) },
  { name: "Abstract & 3D", slug: "abstract", description: "Ink waves, fluid dynamics, sculptural glass, and bold contrast.", image: img("wallora-abstract", 600, 400) },
];

const WALLPAPERS = [
  { id: "midnight-porsche", title: "Midnight Porsche — Tokyo Rain", description: "Rain slicked street in Tokyo at midnight with Porsche 911 GT3.", seed: "wallora-porsche", width: 1920, height: 1080, orientation: "landscape", deviceType: "desktop", downloads: 48210, isAI: false, categorySlug: "cars" },
  { id: "dune-silence", title: "Dune Silence", description: "Calm desert dunes under soft morning sky.", seed: "wallora-dune", width: 1080, height: 1920, orientation: "portrait", deviceType: "phone", downloads: 31120, isAI: false, categorySlug: "minimal" },
  { id: "anime-sunset", title: "Anime Sunset Over the Valley", description: "Warm clouds and golden hills in hand-drawn style.", seed: "wallora-anime1", width: 1920, height: 1080, orientation: "landscape", deviceType: "desktop", downloads: 55400, isAI: false, categorySlug: "anime" },
  { id: "forest-fog", title: "Fog in the Pines", description: "Dense coniferous forest shrouded in cool morning mist.", seed: "wallora-forest", width: 1080, height: 1920, orientation: "portrait", deviceType: "phone", downloads: 28900, isAI: false, categorySlug: "nature" },
  { id: "cyberpunk-alley", title: "Cyberpunk Alley", description: "Neon lit alleyway in futuristic metropolis.", seed: "wallora-cyber", width: 3440, height: 1440, orientation: "ultrawide", deviceType: "ultrawide", downloads: 39800, isAI: true, categorySlug: "gaming" },
  { id: "pink-dunes", title: "Pink Aesthetic Dunes", description: "Pastel sand dunes in twilight gradient.", seed: "wallora-pink", width: 1080, height: 1920, orientation: "portrait", deviceType: "phone", downloads: 22140, isAI: false, categorySlug: "aesthetic" },
  { id: "orbit-station", title: "Orbital Drift", description: "Deep space station overlooking blue planet curvature.", seed: "wallora-space1", width: 3840, height: 2160, orientation: "landscape", deviceType: "desktop", downloads: 18400, isAI: false, categorySlug: "space" },
  { id: "temple-autumn", title: "Temple in Autumn", description: "Kyoto wooden shrine surrounded by flaming red momiji leaves.", seed: "wallora-temple", width: 1920, height: 1280, orientation: "landscape", deviceType: "desktop", downloads: 26700, isAI: false, categorySlug: "travel" },
  { id: "future-city", title: "Future City — Dawn Line", description: "Glass skybridges and sunrise reflections on mega-structures.", seed: "wallora-future", width: 3440, height: 1440, orientation: "ultrawide", deviceType: "ultrawide", downloads: 19800, isAI: true, categorySlug: "technology" },
  { id: "calm-morning", title: "Calm Morning Field", description: "Quiet golden hour meadow with morning dew.", seed: "wallora-field", width: 1080, height: 1920, orientation: "portrait", deviceType: "phone", downloads: 15200, isAI: false, categorySlug: "minimal" },
  { id: "red-fox", title: "Red Fox in Snow", description: "Vibrant red fox hunting in pristine white snowdrifts.", seed: "wallora-fox", width: 1920, height: 1280, orientation: "landscape", deviceType: "desktop", downloads: 17400, isAI: false, categorySlug: "animals" },
  { id: "ink-waves", title: "Ink Waves", description: "Sculptural monochrome fluid dynamics in matte finish.", seed: "wallora-ink", width: 1920, height: 1080, orientation: "landscape", deviceType: "desktop", downloads: 13200, isAI: true, categorySlug: "abstract" },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Create Demo User
  const password = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@wallora.com" },
    update: {},
    create: {
      name: "Demo Explorer",
      email: "demo@wallora.com",
      password,
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Categories
  const categoryMap = new Map<string, string>();
  for (const c of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image },
      create: c,
    });
    categoryMap.set(c.slug, cat.id);
  }

  // 3. Create Wallpapers
  for (const w of WALLPAPERS) {
    const imageUrl = img(w.seed, w.width, w.height);
    const thumbnailUrl = img(w.seed, 600, Math.round((600 * w.height) / w.width));

    await prisma.wallpaper.upsert({
      where: { id: w.id },
      update: {},
      create: {
        id: w.id,
        title: w.title,
        description: w.description,
        imageUrl,
        thumbnailUrl,
        width: w.width,
        height: w.height,
        orientation: w.orientation,
        deviceType: w.deviceType,
        isAI: w.isAI,
        downloads: w.downloads,
        authorId: user.id,
        categoryId: categoryMap.get(w.categorySlug) || null,
      },
    });
  }

  console.log("✨ Seeding completed successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
