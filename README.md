# Wallora — Full-Stack 4K & Ultra HD Wallpaper Platform

Wallora is a modern full-stack wallpaper platform engineered with a strict, educational separation between frontend and backend architectures.

```text
wallora/
├── frontend/     # Next.js 14 App Router, React, Tailwind CSS, UI & API Clients
├── backend/      # Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL & AI Services
├── README.md     # Full architectural documentation & setup guide
└── .gitignore    # Global git ignore configuration
```

---

##  Architecture Overview

| Layer | Directory | Tech Stack | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Frontend** | `/frontend` | Next.js 14, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion | User interface, page routing, responsive components, client-side caching, interaction states, and communication with backend REST APIs. **Zero direct database queries or credentials.** |
| **Backend** | `/backend` | Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT, bcryptjs | RESTful API endpoints, JWT authentication & authorization, PostgreSQL database queries, file uploads, AI generation pipeline, validation, and error middleware. |

---

##  Project Directory Structure

```text
wallora/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Landing / Home page
│   │   │   ├── explore/page.tsx            # Explore wallpapers with filters
│   │   │   ├── category/[slug]/page.tsx    # Category-specific wallpaper feeds
│   │   │   ├── wallpaper/[id]/page.tsx     # Wallpaper details & download page
│   │   │   ├── ai-studio/page.tsx          # AI wallpaper generation studio
│   │   │   ├── favorites/page.tsx          # User's favorited wallpapers
│   │   │   ├── profile/page.tsx            # User profile & account statistics
│   │   │   ├── login/page.tsx              # User login page
│   │   │   ├── register/page.tsx           # User registration page
│   │   │   └── globals.css                 # Global Tailwind styling & themes
│   │   │
│   │   ├── components/
│   │   │   ├── navbar/Navbar.tsx           # Navigation bar with user status
│   │   │   ├── footer/Footer.tsx           # Footer with links & branding
│   │   │   ├── wallpaper/                  # WallpaperCard, WallpaperGrid, WallpaperFilter
│   │   │   ├── categories/CategoryCard.tsx # Category showcase cards
│   │   │   ├── ai/                         # AIGeneratorForm, AICreationCard
│   │   │   ├── profile/                    # Profile components
│   │   │   └── ui/                         # Reusable UI primitives (Button, Input, FadeIn)
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                      # Axios/Fetch API client abstraction
│   │   │   ├── wallpaperService.ts         # Wallpaper API calls with fallback
│   │   │   ├── authService.ts              # Authentication & token storage
│   │   │   ├── favoriteService.ts          # Favorites API operations
│   │   │   └── aiService.ts                # AI image creation requests
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.tsx                 # Authentication context & state hook
│   │   ├── types/                          # TypeScript interfaces for UI models
│   │   ├── utils/                          # Formatting & helper utilities
│   │   └── lib/                            # Curated mock data & local fallbacks
│   │
│   ├── public/                             # Public static assets & favicon
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local                          # Frontend environment variables
│
├── backend/
│   ├── src/
│   │   ├── server.ts                       # Express server entry point
│   │   │
│   │   ├── config/
│   │   │   ├── database.ts                 # Prisma Client singleton
│   │   │   └── cloudinary.ts               # Cloudinary storage configuration
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts           # Login, register, profile controllers
│   │   │   ├── wallpaperController.ts      # Wallpapers CRUD, query, download
│   │   │   ├── categoryController.ts       # Category listing controllers
│   │   │   ├── favoriteController.ts       # User favorite toggle & list
│   │   │   ├── userController.ts           # Profile & account stats
│   │   │   └── aiController.ts             # AI generation controller
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts               # /api/auth/*
│   │   │   ├── wallpaperRoutes.ts          # /api/wallpapers/*
│   │   │   ├── categoryRoutes.ts           # /api/categories/*
│   │   │   ├── favoriteRoutes.ts           # /api/favorites/*
│   │   │   ├── userRoutes.ts               # /api/users/*
│   │   │   └── aiRoutes.ts                 # /api/ai/*
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts           # JWT token verification
│   │   │   ├── errorMiddleware.ts          # Global exception handler
│   │   │   └── uploadMiddleware.ts         # Multer file upload handling
│   │   │
│   │   ├── services/
│   │   │   ├── authService.ts              # Auth logic & hashing
│   │   │   ├── wallpaperService.ts         # Database operations for wallpapers
│   │   │   ├── favoriteService.ts          # Database operations for favorites
│   │   │   ├── aiService.ts                # AI generation service
│   │   │   └── cloudinaryService.ts        # Image upload & URL management
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts                      # Token sign & verify helpers
│   │   │   ├── password.ts                 # bcrypt hash & compare helpers
│   │   │   └── validation.ts              # Payload sanitization & validation
│   │   │
│   │   └── types/                          # Backend Express & domain interfaces
│   │
│   ├── prisma/
│   │   ├── schema.prisma                   # PostgreSQL database schema
│   │   └── seed.ts                         # Database seeder script
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                                # Backend environment variables
│
├── README.md
└── .gitignore
```

---

## 🗄 Database Schema (Prisma ORM)

Wallora uses PostgreSQL managed via Prisma. The schema definitions include:

- **`User`**: Account authentication (`id`, `name`, `email`, `password`, `profileImage`, `createdAt`, `updatedAt`).
- **`Wallpaper`**: Wallpaper catalog (`id`, `title`, `description`, `imageUrl`, `thumbnailUrl`, `width`, `height`, `orientation`, `deviceType`, `categoryId`, `authorId`, `isAI`, `downloads`, `createdAt`, `updatedAt`).
- **`Category`**: Category groupings (`id`, `name`, `slug`, `description`, `image`).
- **`Favorite`**: User bookmark relationship (`id`, `userId`, `wallpaperId`, `createdAt`).
- **`Download`**: Download history (`id`, `userId`, `wallpaperId`, `createdAt`).
- **`AIWallpaper`**: AI-generated creation (`id`, `prompt`, `style`, `orientation`, `resolution`, `imageUrl`, `userId`, `createdAt`).

---

##  Quick Start Guide

You will run the backend and frontend in two separate terminal windows.

### 1. Start the Backend

```bash
cd backend

# 1. Install dependencies
npm install

# 2. Configure environment (.env)
# Create backend/.env with your DATABASE_URL, JWT_SECRET, PORT=5000

# 3. Setup PostgreSQL database with Prisma
npx prisma generate
npx prisma db push

# (Optional) Seed initial categories and wallpapers:
npx ts-node prisma/seed.ts

# 4. Start the Express backend server
npm run dev
```
The backend API server will be live at `http://localhost:5000`. Test it with `GET http://localhost:5000/api/health`.

### 2. Start the Frontend

In a new terminal window:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Configure environment (.env.local)
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 3. Start the Next.js development server
npm run dev
```
Open [http://localhost:3002](http://localhost:3002) in your browser.

---

##  Environment Variables Reference

### Backend (`backend/.env`)

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/wallora?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
REPLICATE_API_TOKEN=""
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_APP_NAME="Wallora"
```

---

##  Built-in Resilience & Educational Features

- **Decoupled Architecture**: Frontend makes standard HTTP calls via its service layer (`frontend/src/services/`) to the backend Express routes (`backend/src/routes/`).
- **Zero-Friction Fallback**: If PostgreSQL or Cloudinary credentials are not configured yet, the backend and frontend seamlessly serve curated mock data so development, visual testing, and UI navigation work out-of-the-box.
- **Strict TypeScript Typing**: Full end-to-end interface contracts across requests, responses, database entities, and component props.

