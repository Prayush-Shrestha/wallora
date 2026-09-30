# Wallora — 4K & Ultra HD Wallpaper Platform

Wallora is built using Next.js 14 App Router, PostgreSQL, Auth.js, Tailwind CSS, and Framer Motion.

---

## 🛠 Tech Stack

| Part | What is used | Purpose |
| --- | --- | --- |
| **Frontend** | Next.js 14 (App Router) + TypeScript | Fast, responsive, and SEO-optimized |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **UI Icons** | Lucide React | Clean, modern iconography |
| **Database** | PostgreSQL + Prisma ORM | Stores users, wallpapers, categories, favorites, AI creations |
| **Backend** | Next.js API Routes / Server Actions | Integrated backend directly in Next.js (no separate backend needed) |
| **Authentication** | Auth.js (NextAuth.js) | Email/Password (Credentials + bcrypt) & Google OAuth |
| **Image Storage** | Cloudinary or Cloudflare R2 | Storage abstraction in `lib/storage.ts` |
| **AI Images** | Replicate API | AI wallpaper generation from prompt, style & resolution |
| **Search** | PostgreSQL Search | Case-insensitive search across title, tags, and category |
| **Deployment** | Vercel Ready | Zero-configuration single repository deployment |
| **PWA** | Next.js Native PWA | `manifest.webmanifest`, standalone app experience on mobile |
| **Animations** | Framer Motion | Subtle, smooth page transitions and hover effects |
| **Version Control** | Git + GitHub | Clean, ready-to-push Git repository |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your variables in `.env.local`:
* **DATABASE_URL**: Your PostgreSQL connection string (Supabase, Neon, Railway, or local).
* **NEXTAUTH_SECRET**: Random secret key for Auth.js sessions.
* **GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET**: (Optional) For Google One-Click Login.
* **CLOUDINARY_* or R2_***: (Optional) For image storage.
* **REPLICATE_API_TOKEN**: (Optional) For live AI generation via Flux / SDXL.

### 3. Setup PostgreSQL Database
```bash
# Push schema to PostgreSQL:
npm run db:push

# (Optional) Seed 38 curated wallpapers & categories:
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Features

- **Dedicated Login & Sign-up Pages**: Full email & password authentication, password toggle, input validation, and Google OAuth.
- **PostgreSQL-Powered Wallpapers API**: Filtering by category, orientation, device, tags, and search with pagination.
- **AI Studio**: Generate wallpapers by custom prompts, styles (cinematic, anime, cyber, etc.), and resolutions (4K, UltraWide).
- **PWA Experience**: Add to home screen on iOS and Android for a native app feel.
- **Subtle Framer Motion Animations**: Smooth page transitions and interactive micro-animations.
