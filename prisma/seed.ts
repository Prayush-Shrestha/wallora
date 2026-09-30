import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

const CATEGORIES = [
  { slug: "nature", name: "Nature & Landscapes", description: "Mountains, oceans, misty forests, and cosmic skies." },
  { slug: "cars", name: "Cars & Automotive", description: "Hypercars, GT3 track weapons, retro classics, and rain slicks." },
  { slug: "anime", name: "Anime & Manga", description: "Cinematic sunsets, quiet city streets, and expressive character art." },
  { slug: "gaming", name: "Gaming & Cyberpunk", description: "Neon alleys, dark setup glows, pixel castles, and retro rigs." },
  { slug: "minimal", name: "Minimal & Clean", description: "Soft gradients, calm dunes, linen textures, and breathing room." },
  { slug: "space", name: "Space & Cosmos", description: "Orbital stations, dreamy galaxies, starfields, and distant planets." },
  { slug: "aesthetic", name: "Aesthetic & Mood", description: "Pink dunes, soft grain, dreamy lighting, and editorial tone." },
  { slug: "architecture", name: "Architecture", description: "Brutalist blocks, concrete forms, geometric shadows, and lines." },
  { slug: "technology", name: "Technology & Code", description: "Macro circuits, dark terminals, futuristic cities, and synth." },
  { slug: "travel", name: "Travel & Places", description: "Tokyo crossings, autumn shrines, desert highways, and fjords." },
  { slug: "animals", name: "Animals & Wildlife", description: "Red foxes in snow, majestic predators, and gentle macro fauna." },
  { slug: "abstract", name: "Abstract & 3D", description: "Ink waves, fluid dynamics, sculptural glass, and bold contrast." },
  { slug: "kids", name: "Kids & Playful", description: "Paper planes, pastel dinos, cute racers, and storybook art." },
  { slug: "sports", name: "Sports & Action", description: "Stadium lights, visor reflections, race helmets, and athletes." },
  { slug: "men", name: "Men & Style", description: "Barbershop portraits, raw denim, sneaker walls, and street style." },
  { slug: "women", name: "Women & Fashion", description: "Ballet shadows, silk robes, editorial portraits, and elegance." },
];

const RAW_WALLPAPERS = [
  { id: "midnight-porsche", title: "Midnight Porsche — Tokyo Rain", seed: "wallora-porsche", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 48210, likes: 9214, createdAt: new Date("2026-09-10"), isAI: false, category: "cars", tags: ["black sports car","night","rain","neon","cinematic"], author: "Kaito Mori", colors: ["#0b0e14","#1d2a3a","#e4572e"], featured: true },
  { id: "dune-silence", title: "Dune Silence", seed: "wallora-dune", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 31120, likes: 7022, createdAt: new Date("2026-09-18"), isAI: false, category: "minimal", tags: ["minimal","desert","calm","beige"], author: "Amara Diallo", colors: ["#d9c7a7","#8a6f4d","#1a1a1a"] },
  { id: "anime-sunset", title: "Anime Sunset Over the Valley", seed: "wallora-anime1", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop","tablet"], downloads: 55400, likes: 12040, createdAt: new Date("2026-08-28"), isAI: false, category: "anime", tags: ["anime sunset","valley","clouds","warm"], author: "Yuki Tanaka", colors: ["#f4a259","#5e548e","#231942"], featured: true },
  { id: "forest-fog", title: "Fog in the Pines", seed: "wallora-forest", width: 1080, height: 1920, orientation: "portrait", device: ["phone","tablet"], downloads: 28900, likes: 6105, createdAt: new Date("2026-09-02"), isAI: false, category: "nature", tags: ["forest","fog","green","calm","minimal mountain"], author: "Jonas Weber", colors: ["#1c2b21","#3a5a40","#dad7cd"] },
  { id: "cyberpunk-alley", title: "Cyberpunk Alley", seed: "wallora-cyber", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 39800, likes: 8830, createdAt: new Date("2026-09-12"), isAI: true, category: "gaming", tags: ["cyberpunk city","neon","dark gaming","night"], author: "Wallora AI", colors: ["#0d0221","#ff007f","#00e5ff"] },
  { id: "pink-dunes", title: "Pink Aesthetic Dunes", seed: "wallora-pink", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 22140, likes: 5890, createdAt: new Date("2026-09-20"), isAI: false, category: "aesthetic", tags: ["pink aesthetic","dunes","soft","dreamy"], author: "Sofia Marques", colors: ["#f8ad9d","#f4978e","#f08080"] },
  { id: "orbit-station", title: "Orbital Drift", seed: "wallora-space1", width: 3840, height: 2160, orientation: "landscape", device: ["desktop","ultrawide"], downloads: 18400, likes: 4210, createdAt: new Date("2026-09-05"), isAI: false, category: "space", tags: ["space","stars","galaxy","dark"], author: "Elena Vostok", colors: ["#030014","#3a0ca3","#f8f9fa"] },
  { id: "temple-autumn", title: "Temple in Autumn", seed: "wallora-temple", width: 1920, height: 1280, orientation: "landscape", device: ["desktop","laptop"], downloads: 26700, likes: 5930, createdAt: new Date("2026-08-20"), isAI: false, category: "travel", tags: ["japanese temple in autumn","travel","red","calm"], author: "Ren Hayashi", colors: ["#9d0208","#dc2f02","#ffba08"] },
  { id: "dark-castle", title: "Dark Fantasy Castle", seed: "wallora-castle", width: 1080, height: 1920, orientation: "portrait", device: ["phone","tablet"], downloads: 33400, likes: 7610, createdAt: new Date("2026-09-08"), isAI: true, category: "fantasy", tags: ["dark fantasy castle","moody","dramatic"], author: "Wallora AI", colors: ["#10002b","#3c096c","#e0aa3e"] },
  { id: "ocean-moon", title: "Ocean Under Moonlight", seed: "wallora-ocean", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 41200, likes: 9040, createdAt: new Date("2026-09-01"), isAI: false, category: "nature", tags: ["ocean under moonlight","sea","night","calm"], author: "Maya Chen", colors: ["#03045e","#0077b6","#caf0f8"] },
  { id: "future-city", title: "Future City — Dawn Line", seed: "wallora-future", width: 3440, height: 1440, orientation: "ultrawide", device: ["ultrawide","desktop"], downloads: 19800, likes: 4520, createdAt: new Date("2026-09-15"), isAI: true, category: "technology", tags: ["futuristic city","architecture","morning"], author: "Wallora AI", colors: ["#111827","#60a5fa","#f9fafb"] },
  { id: "mountain-escape", title: "Mountain Escape", seed: "wallora-mountain", width: 1080, height: 1350, orientation: "portrait", device: ["phone","tablet"], downloads: 37600, likes: 8120, createdAt: new Date("2026-09-19"), isAI: false, category: "nature", tags: ["minimal mountain","snow","sunset","calm"], author: "Lars Nilsen", colors: ["#264653","#e9c46a","#f4f1de"] },
  { id: "gaming-nights", title: "Gaming Nights — Setup Glow", seed: "wallora-setup", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 44500, likes: 9870, createdAt: new Date("2026-09-11"), isAI: false, category: "gaming", tags: ["dark gaming","setup","neon","room"], author: "Diego Ramos", colors: ["#0a0a0a","#7c3aed","#22d3ee"] },
  { id: "calm-morning", title: "Calm Morning Field", seed: "wallora-field", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 15200, likes: 3340, createdAt: new Date("2026-09-21"), isAI: false, category: "minimal", tags: ["calm","morning","field","bright"], author: "Ingrid Sato", colors: ["#fefae0","#dda15e","#606c38"] },
  { id: "black-runner", title: "Black Sports Car — Studio", seed: "wallora-car2", width: 1920, height: 1080, orientation: "landscape", device: ["desktop"], downloads: 52100, likes: 11200, createdAt: new Date("2026-08-30"), isAI: false, category: "cars", tags: ["black sports car","studio","dark","luxury"], author: "Marco Bianchi", colors: ["#0a0a0a","#3f3f3f","#d4d4d4"] },
  { id: "galaxy-dream", title: "Dreamy Galaxy", seed: "wallora-galaxy", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 29800, likes: 6740, createdAt: new Date("2026-09-14"), isAI: true, category: "space", tags: ["dreamy galaxy","purple","stars"], author: "Wallora AI", colors: ["#10002b","#9d4edd","#ff69b4"] },
  { id: "brutalist-block", title: "Brutalist Afternoon", seed: "wallora-brutal", width: 1200, height: 1200, orientation: "square", device: ["tablet","laptop"], downloads: 9800, likes: 2120, createdAt: new Date("2026-09-06"), isAI: false, category: "architecture", tags: ["architecture","concrete","minimal","shadows"], author: "Ana Petrova", colors: ["#adb5bd","#495057","#212529"] },
  { id: "red-fox", title: "Red Fox in Snow", seed: "wallora-fox", width: 1920, height: 1280, orientation: "landscape", device: ["desktop","tablet"], downloads: 17400, likes: 3980, createdAt: new Date("2026-09-03"), isAI: false, category: "animals", tags: ["animals","fox","snow","wildlife"], author: "Tom Ellery", colors: ["#ffffff","#e76f51","#264653"] },
  { id: "tokyo-night", title: "Tokyo at Night — Crossing", seed: "wallora-tokyo", width: 1080, height: 1920, orientation: "portrait", device: ["phone"], downloads: 46300, likes: 10120, createdAt: new Date("2026-09-09"), isAI: false, category: "travel", tags: ["tokyo","night","city","neon"], author: "Kaito Mori", colors: ["#0a0a0a","#facc15","#ef4444"] },
  { id: "ink-waves", title: "Ink Waves", seed: "wallora-ink", width: 1920, height: 1080, orientation: "landscape", device: ["desktop","laptop"], downloads: 13200, likes: 2870, createdAt: new Date("2026-09-16"), isAI: true, category: "abstract", tags: ["abstract","black","waves","dark"], author: "Wallora AI", colors: ["#000000","#1f2937","#e5e7eb"] },
];

export async function main() {
  console.log("Seeding PostgreSQL Database...");

  // Seed demo admin & user
  const hashedPassword = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@wallora.com" },
    update: {},
    create: {
      email: "demo@wallora.com",
      name: "Demo Explorer",
      password: hashedPassword,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "user",
    },
  });

  // Seed categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        preview: img(`wallora-${cat.slug}`, 600, 400),
      },
    });
  }

  // Seed wallpapers
  for (const w of RAW_WALLPAPERS) {
    const imageUrl = img(w.seed, w.width, w.height);
    const thumbUrl = img(w.seed, 600, Math.round((600 * w.height) / w.width));

    await prisma.wallpaper.upsert({
      where: { id: w.id },
      update: {},
      create: {
        id: w.id,
        title: w.title,
        image: imageUrl,
        thumbnail: thumbUrl,
        categorySlug: w.category,
        tags: w.tags,
        author: w.author,
        authorAvatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(w.author)}`,
        userId: demoUser.id,
        width: w.width,
        height: w.height,
        orientation: w.orientation,
        device: w.device,
        downloads: w.downloads,
        likes: w.likes,
        isAI: w.isAI,
        colors: w.colors,
        featured: Boolean(w.featured),
        createdAt: w.createdAt,
      },
    });
  }

  console.log("Seeding complete! Successfully added users, categories and wallpapers.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
