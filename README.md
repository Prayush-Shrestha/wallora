# Wallora

**Discover, generate, and download 4K wallpapers for every screen.**

A full-stack wallpaper platform with curated collections, an AI generation studio, user uploads,
favorites, and a complete admin dashboard — built with Next.js, Express, Prisma & PostgreSQL.

**Quick links:** [Quick Start](#quick-start) · [API Reference](#api-reference) · [Project Structure](#project-structure) · [Troubleshooting](#troubleshooting)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Demo Accounts](#demo-accounts)
- [Environment Variables](#environment-variables)
- [Database & Prisma](#database--prisma)
- [API Reference](#api-reference)
- [AI Generation Pipeline](#ai-generation-pipeline)
- [Frontend Routes](#frontend-routes)
- [Admin Panel](#admin-panel)
- [Scripts](#scripts)
- [Resilience & Offline Mode](#resilience--offline-mode)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Wallora is a complete wallpaper platform with a strict separation between its **Next.js frontend**
and **Express + Prisma backend**. The frontend never touches the database — every read and write
goes through the REST API.

The project is designed to run out of the box:

- **With PostgreSQL** — full persistence for users, favorites, uploads, AI history, plans, subscriptions, and payments.
- **Without PostgreSQL** — wallpaper endpoints serve curated sample data, the demo session still works, and the frontend falls back to bundled data, so the UI remains explorable.

It is intended as a production-shaped reference project: typed end-to-end, validated inputs, hashed
passwords, JWT auth, role-based admin access, provenance tracking for every image, and documented
API contracts.

---

## Features

### Storefront

- **Landing page** — hero, featured wallpapers, trending grid, popular categories, wallpaper of the day, fresh uploads, and an AI Studio call-to-action.
- **Explore** — full-text search with a 350 ms debounce, category / orientation / device filters, and `trending` / `recent` / `downloads` sorting.
- **Categories and collections** — dedicated category feeds and curated mood collections.
- **Wallpaper detail** — high-resolution preview, similar wallpapers, download counter, favorite toggle, and native share (with clipboard fallback).
- **Themes** — dark and light mode with a no-flash theme script.
- **UX details** — skeleton loaders, toast notifications, keyboard-accessible menus, a responsive navbar, and an in-site assistant chatbot.

### Accounts

- Register and log in with **bcrypt**-hashed passwords and **JWT** sessions.
- Persistent auth context that survives hard refreshes.
- Profile page with saved favorites and AI creation history.
- Suspended-account enforcement on login, profile access, and admin routes.

### AI Studio

- Generate wallpapers from a text prompt with style, category, orientation, and resolution controls.
- **Negative prompts** plus automatic extraction of clauses like *"no text"* or *"without people"*.
- **Provider fallback chain** — Replicate Flux, then OpenAI DALL-E 3, then the free Flux engine (no API key).
- Prompt enhancement that respects the style the user already described.
- Per-user generation history persisted in PostgreSQL.

### Uploads

- Drag-and-drop upload for JPG / PNG / WebP (max 20 MB).
- Optional **Cloudinary** CDN storage; without keys, images are stored as inline base64 data URLs so the flow still works.
- Provenance and license metadata recorded with every wallpaper (`assetType`, `licenseType`, `attribution`, `originUrl`).

### Admin Dashboard

- **Overview** — users, paid subscribers, revenue, wallpapers, downloads, AI generations, and favorites.
- **Analytics** — 14-day signup and revenue charts, top buyers, most active users, and plan breakdown.
- **Users** — search, filter by role / status / plan, promote to admin, or suspend accounts.
- **Subscriptions** — list, grant a plan by email, and change status.
- **Payments** — ledger with completed revenue totals.
- **Plans** — create and edit subscription tiers.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express 4, TypeScript, Prisma ORM 6, PostgreSQL 16 |
| **Auth** | JSON Web Tokens (`jsonwebtoken`), bcryptjs |
| **Uploads** | Multer (memory storage), Cloudinary (optional) |
| **AI** | Replicate Flux Schnell, OpenAI DALL-E 3, free Flux via Pollinations |
| **Tooling** | tsx, ESLint, Docker Compose |

---

## Architecture

```text
┌──────────────────────────────┐        HTTP / JSON        ┌──────────────────────────────┐
│          Frontend            │  ───────────────────────>  │           Backend            │
│  Next.js 14 · React 18       │                            │  Express 4 · TypeScript      │
│                              │  <───────────────────────  │                              │
│  app/ pages & layouts        │         REST API           │  routes -> controllers       │
│  components/ UI              │                            │  services -> Prisma          │
│  services/ API clients       │                            │  middleware (auth, errors)   │
│  hooks/useAuth               │                            │                              │
└──────────────────────────────┘                            └──────────────┬───────────────┘
                                                                           │
                                            ┌──────────────────────────────┼──────────────────────────────┐
                                            │                              │                              │
                                            v                              v                              v
                                  ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
                                  │   PostgreSQL     │          │    Cloudinary    │          │   AI Providers   │
                                  │  (Prisma ORM)    │          │  (optional CDN)  │          │ Replicate/OpenAI │
                                  │                  │          │                  │          │  / Flux (free)   │
                                  └──────────────────┘          └──────────────────┘          └──────────────────┘
```

**Request lifecycle**

```text
Browser -> Next.js page/component -> services/*.ts -> REST API
       -> route -> middleware (auth / admin / upload) -> controller
       -> service (business logic) -> Prisma -> PostgreSQL
       -> { success, data } -> React state / cache
```

---

## Project Structure

```text
wallora/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                     # Landing / home
│   │   │   ├── layout.tsx                   # Providers, navbar, footer, chatbot
│   │   │   ├── globals.css                  # Tailwind tokens & base styles
│   │   │   ├── loading.tsx / error.tsx / not-found.tsx
│   │   │   ├── explore/page.tsx             # Search + filters
│   │   │   ├── categories/page.tsx          # All categories
│   │   │   ├── category/[slug]/page.tsx     # Category feed
│   │   │   ├── collections/page.tsx         # Curated collections
│   │   │   ├── wallpaper/[id]/page.tsx      # Detail, download, favorite, share
│   │   │   ├── ai-studio/page.tsx           # AI generation studio
│   │   │   ├── favorites/page.tsx           # Saved wallpapers
│   │   │   ├── upload/page.tsx              # Upload form
│   │   │   ├── profile/page.tsx             # Account + tabs
│   │   │   ├── login/page.tsx               # Sign in
│   │   │   ├── register/page.tsx            # Sign up
│   │   │   └── admin/                       # Admin layout + overview, login,
│   │   │                                    # users, subscriptions, payments, plans
│   │   ├── components/
│   │   │   ├── navbar/                      # Navigation & search
│   │   │   ├── footer/                      # Footer
│   │   │   ├── home/                        # Hero, featured, trending, fresh, categories
│   │   │   ├── wallpaper/                   # Card, grid, filters, preview, actions
│   │   │   ├── categories/                  # Category card & grid
│   │   │   ├── ai/                          # Generator form, result, creation card
│   │   │   ├── profile/                     # Header & tabs
│   │   │   ├── chat/                        # Assistant chatbot
│   │   │   ├── search/                      # Search panel
│   │   │   └── ui/                          # Button, Input, Modal, Skeleton, Toast, Theme…
│   │   ├── services/                        # api, auth, wallpaper, category, favorite,
│   │   │                                    # ai, upload, admin clients
│   │   ├── hooks/useAuth.tsx                # Auth context & session state
│   │   ├── types/                           # UI domain interfaces
│   │   ├── utils/                           # Formatting helpers
│   │   └── lib/data.ts                      # Curated mock fallback data
│   ├── .env.local.example
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma                    # PostgreSQL schema
│   │   └── seed.ts                          # Categories, wallpapers, plans, demo accounts
│   ├── src/
│   │   ├── server.ts                        # Express entry point
│   │   ├── config/                          # Prisma client, Cloudinary
│   │   ├── controllers/                     # auth, wallpaper, category, favorite,
│   │   │                                    # user, ai, admin
│   │   ├── routes/                          # REST route mounts
│   │   ├── middleware/                      # authenticate, requireAdmin, upload, errors
│   │   ├── services/                        # Business logic + DB access
│   │   ├── utils/                           # jwt, password, validation, db, promptEngine
│   │   └── types/                           # Express & domain interfaces
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml                       # PostgreSQL 16
├── package.json                             # Root convenience scripts
└── README.md
```

---

## Quick Start

### Prerequisites

| Requirement | Version |
| :--- | :--- |
| Node.js | **18.18+** (20 LTS recommended) |
| npm | 9+ |
| Docker Desktop | Any recent version — or a local PostgreSQL 14+ |
| PostgreSQL | 14+ if not using Docker |

### 1. Start PostgreSQL

```bash
docker compose up -d db
```

This starts PostgreSQL 16 on `localhost:5432` with:

| Setting | Value |
| :--- | :--- |
| Database | `wallora` |
| User | `postgres` |
| Password | `password` |
| Volume | `wallora-pgdata` (persists between restarts) |

### 2. Start the backend — `http://localhost:5001`

```bash
cd backend
npm install

# Create your environment file
cp .env.example .env          # Windows PowerShell: copy .env.example .env

# Generate the Prisma client, create tables, and seed demo data
npx prisma generate
npx prisma db push
npm run db:seed

# Start the API in watch mode
npm run dev
```

Confirm it is live:

```bash
curl http://localhost:5001/api/health
```

```json
{ "status": "ok", "service": "Wallora Backend REST API", "timestamp": "…" }
```

### 3. Start the frontend — `http://localhost:3002`

In a second terminal:

```bash
cd frontend
npm install

cp .env.local.example .env.local    # Windows: copy .env.local.example .env.local

npm run dev
```

Open **http://localhost:3002**.

### Quick command summary

| Terminal | Command |
| :--- | :--- |
| 1 | `docker compose up -d db` |
| 2 | `cd backend && npm install && npm run db:generate && npm run db:push && npm run db:seed && npm run dev` |
| 3 | `cd frontend && npm install && npm run dev` |

---

## Demo Accounts

The seeder creates two ready-to-use accounts:

| Email | Password | Role | Notes |
| :--- | :--- | :--- | :--- |
| `demo@wallora.com` | `password123` | **ADMIN** | Full admin panel access |
| `pro@wallora.com` | `password123` | USER | Active Pro subscription + sample payment |

> `demo@wallora.com` also works when PostgreSQL is unavailable, so the UI and admin shell can be
> explored in offline mode.

### Seeded data

| Entity | Count |
| :--- | :--- |
| Users | 2 (1 admin, 1 pro) |
| Categories | 12 |
| Wallpapers | 12 |
| Plans | 3 (`free`, `pro-monthly`, `pro-yearly`) |
| Subscription | 1 active |
| Payment | 1 completed |

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | No | `5001` | Express server port |
| `NODE_ENV` | No | `development` | Enables dev logging and localhost CORS |
| `CLIENT_URL` | No | `http://localhost:3002` | Trusted frontend origin for CORS |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `JWT_SECRET` | **Yes** | dev fallback | Secret used to sign tokens — use 32+ random chars in production |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary API secret |
| `REPLICATE_API_TOKEN` | No | — | Enables Replicate Flux |
| `OPENAI_API_KEY` | No | — | Enables OpenAI DALL-E 3 |

```env
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3002

DATABASE_URL="postgresql://postgres:password@localhost:5432/wallora?schema=public"

JWT_SECRET="change-me-to-a-long-random-secret"
JWT_EXPIRES_IN="7d"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

REPLICATE_API_TOKEN=""
OPENAI_API_KEY=""
```

### Frontend — `frontend/.env.local`

| Variable | Required | Description |
| :--- | :---: | :--- |
| `NEXT_PUBLIC_API_URL` | **Yes** | Backend REST base URL, including `/api` |
| `NEXT_PUBLIC_APP_NAME` | No | Display name (defaults to Wallora) |

```env
NEXT_PUBLIC_API_URL="http://localhost:5001/api"
NEXT_PUBLIC_APP_NAME="Wallora"
```

> Real environment files are gitignored. Commit changes to the `.example` templates instead.

---

## Database & Prisma

### Models

| Model | Purpose | Key fields |
| :--- | :--- | :--- |
| **User** | Accounts & roles | `email` (unique), `password` (bcrypt), `role` `USER`/`ADMIN`, `status` `ACTIVE`/`SUSPENDED`, `lastLoginAt` |
| **Wallpaper** | Wallpaper catalog | `title`, `imageUrl`, `thumbnailUrl`, `width`, `height`, `orientation`, `deviceType`, `isAI`, `downloads`, provenance fields |
| **Category** | Groupings | `name`, `slug` (unique), `description`, `image` |
| **Favorite** | User bookmarks | `userId` + `wallpaperId` (unique pair) |
| **Download** | Download history | `userId?`, `wallpaperId`, `createdAt` |
| **AIWallpaper** | AI generation record | `prompt`, `enhancedPrompt`, `negativePrompt`, `style`, `aspectRatio`, `dimensions`, `imageUrl`, `provider` |
| **Plan** | Subscription tiers | `slug` (unique), `priceCents`, `currency`, `interval` `NONE`/`MONTH`/`YEAR`, `features[]`, `isActive` |
| **Subscription** | User membership | `status`, `provider`, `currentPeriodStart/End`, `cancelAtPeriodEnd` |
| **Payment** | Billing ledger | `amountCents`, `currency`, `status`, `provider`, links to user / plan / subscription |

### Provenance

Every wallpaper records where it came from and how it may be used:

- `assetType` — `ORIGINAL_AI`, `USER_UPLOAD`, `THIRD_PARTY_LICENSED`, `DEMO_PLACEHOLDER`
- `licenseType` — `AI_PROVIDER_TERMS`, `USER_OWNED`, `CC0_PUBLIC_DOMAIN`, `COMMERCIAL_LICENSED`, `DEMO_ONLY`
- `attribution` and `originUrl` — human-readable credit and source

### Prisma commands

| Command | Description |
| :--- | :--- |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Sync the schema to the database (no migration files) |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:seed` | Seed categories, wallpapers, plans, and demo accounts |
| `npm run db:studio` | Open Prisma Studio at `http://localhost:5555` |

---

## API Reference

### Conventions

- Base URL: `http://localhost:5001/api`
- All responses are JSON: `{ "success": boolean, "data"?: …, "error"?: string, "message"?: string }`
- Protected routes require `Authorization: Bearer <token>`
- Admin routes require a valid token **and** the `ADMIN` role

### Health

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | — | Service status |

### Auth

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | — | Create an account -> `{ user, token }` |
| `POST` | `/auth/login` | — | Sign in -> `{ user, token }` |
| `GET` | `/auth/me` | Bearer | Current user profile |

**Register / login body**

```json
{ "name": "Alex Rivera", "email": "alex@example.com", "password": "secret123" }
```

**Success response**

```json
{
  "success": true,
  "message": "Logged in successfully.",
  "data": {
    "user": { "id": "…", "name": "Alex Rivera", "email": "alex@example.com", "role": "USER" },
    "token": "eyJhbGciOi…"
  }
}
```

### Wallpapers

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/wallpapers` | — | List & filter wallpapers |
| `GET` | `/wallpapers/:id` | — | Wallpaper + similar items |
| `POST` | `/wallpapers` | Optional | Create wallpaper (multipart file **or** `imageUrl`) |
| `POST` | `/wallpapers/:id/download` | Optional | Increment the download counter |

**Query parameters for `GET /wallpapers`**

| Param | Values | Default |
| :--- | :--- | :--- |
| `category` | category slug or `all` | `all` |
| `orientation` | `portrait`, `landscape`, `square`, `ultrawide`, `all` | `all` |
| `deviceType` | `phone`, `tablet`, `laptop`, `desktop`, `ultrawide`, `all` | `all` |
| `isAI` | `true` / `false` | — |
| `q` | search text | — |
| `sort` | `trending`, `recent`, `downloads` | `trending` |
| `page` | integer ≥ 1 | `1` |
| `limit` | integer 1–100 | `24` |

```bash
curl "http://localhost:5001/api/wallpapers?category=nature&orientation=landscape&sort=downloads&limit=12"
```

### Categories

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/categories` | — | All categories with wallpaper counts |
| `GET` | `/categories/:slug` | — | Single category |

### Favorites

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/favorites` | Bearer | Current user's saved wallpapers |
| `POST` | `/favorites/:wallpaperId` | Bearer | Toggle a favorite -> `{ isFavorite }` |

### Users

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/users/profile` | Bearer | Profile with activity counts |
| `GET` | `/users/uploads` | Bearer | Wallpapers uploaded by the user |

### AI

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/ai/generate` | Optional | Generate a wallpaper |
| `GET` | `/ai/creations` | Bearer | Current user's AI history |

**Generate body**

```json
{
  "prompt": "A calm alpine lake at sunrise, photorealistic, no text",
  "style": "Photorealistic",
  "category": "nature",
  "orientation": "landscape",
  "resolution": "4k",
  "negativePrompt": "people, logos",
  "provider": "auto"
}
```

`provider` may be `auto`, `replicate`, `openai`, or `flux-free`.

### Admin

All admin routes require `Authorization: Bearer <ADMIN token>`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/stats` | Dashboard aggregates, charts, top buyers, active users, plan breakdown |
| `GET` | `/admin/users` | Paginated users (`q`, `role`, `status`, `plan`, `page`, `limit`) |
| `PATCH` | `/admin/users/:id` | Update `role` or `status` |
| `GET` | `/admin/subscriptions` | Paginated subscriptions (`status`, `plan`, `page`, `limit`) |
| `POST` | `/admin/subscriptions` | Grant a plan by email -> `{ email, planSlug }` |
| `PATCH` | `/admin/subscriptions/:id` | Change subscription `status` |
| `GET` | `/admin/payments` | Payment ledger + completed revenue |
| `GET` | `/admin/plans` | List plans |
| `POST` | `/admin/plans` | Create a plan |
| `PATCH` | `/admin/plans/:id` | Update a plan |

### Status codes

| Code | Meaning |
| :--- | :--- |
| `200` | OK |
| `201` | Created |
| `400` | Validation / malformed input |
| `401` | Missing, invalid, or expired token |
| `403` | Insufficient role or suspended account |
| `404` | Resource not found |
| `409` | Duplicate account |
| `413` | Upload exceeds 20 MB |
| `503` | Database offline (with graceful fallback where supported) |

---

## AI Generation Pipeline

```text
User prompt
   │
   v
promptEngine.ts
   ├─ extract negative clauses ("no text", "without people")
   ├─ detect explicit styles already described by the user
   ├─ add orientation-aware composition guidance
   ├─ compute exact 4K dimensions (16:9, 9:16, 1:1, 21:9, 3:4)
   └─ merge with negative prompt + quality suffix
   │
   v
Provider selection (first configured / allowed wins)
   1. Replicate — Flux Schnell      (REPLICATE_API_TOKEN)
   2. OpenAI — DALL-E 3             (OPENAI_API_KEY)
   3. Flux via Pollinations         (free, no key)
   │
   v
Persist to ai_wallpapers (best-effort — offline generations still return)
   │
   v
{ imageUrl, enhancedPrompt, negativePrompt, aspectRatio, dimensions, provider }
```

| Provider | Key required | Notes |
| :--- | :---: | :--- |
| Replicate Flux Schnell | `REPLICATE_API_TOKEN` | Polls until the prediction succeeds (up to ~45 s) |
| OpenAI DALL-E 3 | `OPENAI_API_KEY` | HD output; size chosen from orientation |
| Flux via Pollinations | No | Free, generated on demand — first render may take a few seconds |

---

## Frontend Routes

| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Landing page |
| `/explore` | Public | Search and filters |
| `/categories` | Public | All categories |
| `/category/[slug]` | Public | Category feed |
| `/collections` | Public | Curated collections |
| `/wallpaper/[id]` | Public | Detail, download, favorite, share |
| `/ai-studio` | Public (history requires login) | AI generation |
| `/favorites` | Public (list requires login) | Saved wallpapers |
| `/upload` | Login required to publish | Upload form |
| `/profile` | Login | Account, favorites, AI creations |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up |
| `/admin` | ADMIN | Dashboard |
| `/admin/users` | ADMIN | User management |
| `/admin/subscriptions` | ADMIN | Subscriptions |
| `/admin/payments` | ADMIN | Payments |
| `/admin/plans` | ADMIN | Plans |
| `/admin/login` | Public | Admin sign-in |

---

## Admin Panel

Sign in at `/login` or `/admin/login` with an **ADMIN** account, then open `/admin`.

| Section | Capabilities |
| :--- | :--- |
| **Overview** | KPI cards, 14-day signup and revenue charts, top buyers, most active users, plan breakdown, newest users, latest payments |
| **Users** | Search, filter by role / status / plan, promote to admin, suspend or reactivate |
| **Subscriptions** | Filter by status / plan, grant a plan by email, cancel / expire / reactivate |
| **Payments** | Filter by status, view revenue totals and the full ledger |
| **Plans** | List, create, and edit plans (price, features, active state) |

Safety guards:

- Admins cannot demote or suspend **their own** account.
- `requireAdmin` re-checks the role from the database on every request, so demotions apply immediately.
- Offline mode trusts the signed JWT payload (which cannot be forged without `JWT_SECRET`).

---

## Scripts

### Root

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start the frontend dev server |
| `npm run dev:frontend` | Start the frontend (`:3002`) |
| `npm run dev:backend` | Start the backend (`:5001`) |
| `npm run build:frontend` | Production build of the frontend |
| `npm run build:backend` | TypeScript build of the backend |
| `npm run lint:frontend` | Lint the frontend |

### Backend

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start Express with `tsx watch` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run the compiled server |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:push` | Push the schema to the database |
| `npm run db:migrate` | Create and apply a dev migration |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

### Frontend

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js on port `3002` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on `3002` |
| `npm run lint` | Run ESLint |

---

## Resilience & Offline Mode

Wallora is built to be explorable even before every service is configured.

| Scenario | Behavior |
| :--- | :--- |
| **PostgreSQL unreachable** | Wallpaper endpoints serve curated sample data and the demo account still signs in; categories and other reads fall back to the frontend's bundled data; real validation / 404 errors still surface correctly. |
| **Backend unreachable** | The frontend falls back to bundled mock data (`frontend/src/lib/data.ts`) and cached session state, so pages still render. |
| **Cloudinary not configured** | Uploads are stored as inline base64 data URLs instead of failing. |
| **No AI keys** | The free Flux engine generates the image URL with no key required. |
| **Slow database** | Wallpaper read queries race a 1.5 s timeout before falling back, keeping the UI responsive. |

> Fallbacks apply **only** to genuine connectivity failures. Authentication, validation, and
> not-found errors keep their proper `4xx` status codes instead of being masked as success.

---

## Security Notes

- Passwords are hashed with **bcrypt** (cost 10) and never returned by the API.
- JWTs are signed with `JWT_SECRET`; set a long random value in production.
- Admin access is enforced server-side on every request — hiding the UI is not the security boundary.
- Uploads are restricted to `image/*` MIME types and capped at **20 MB**.
- CORS trusts `CLIENT_URL` plus localhost origins in development only.
- Input is validated on the server (`utils/validation.ts`, service-level checks).
- No database credentials ever reach the browser.

**Before deploying**

1. Set a strong `JWT_SECRET`.
2. Set `NODE_ENV=production` (this disables localhost CORS origins).
3. Use a managed PostgreSQL instance and run `prisma migrate deploy`.
4. Configure Cloudinary (or object storage) instead of base64 uploads.
5. Put the API behind HTTPS and a rate limiter.
6. Review the provenance/licensing fields for any third-party imagery.

---

## Troubleshooting

<details>
<summary><strong>Can't reach database server at localhost:5432</strong></summary>

Start the container and wait a few seconds:

```bash
docker compose up -d db
docker exec wallora-db pg_isready -U postgres
```

If you use an external database, update `DATABASE_URL`.
</details>

<details>
<summary><strong>Seeder fails with database authentication errors</strong></summary>

Ensure `backend/.env` exists and matches `docker-compose.yml`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wallora?schema=public"
```

The seed script loads `.env` through dotenv automatically.
</details>

<details>
<summary><strong>The UI shows demo / mock wallpapers</strong></summary>

The backend is not reachable. Start it:

```bash
cd backend
npm run dev
```

Then confirm `http://localhost:5001/api/health` returns `status: ok`.
</details>

<details>
<summary><strong>Port already in use</strong></summary>

Change `PORT` in `backend/.env`, then update:

- `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- `CLIENT_URL` in `backend/.env` (for CORS)

Restart both servers.
</details>

<details>
<summary><strong>The AI image URL returns but the image is slow</strong></summary>

The free Flux provider renders on demand. The first request can take several seconds;
subsequent requests for the same prompt are faster.
</details>

<details>
<summary><strong>Prisma client out of sync after schema changes</strong></summary>

```bash
cd backend
npx prisma generate
npx prisma db push
```
</details>

<details>
<summary><strong>Windows PowerShell: <code>&&</code> or <code>cp</code> not recognized</strong></summary>

Use separate commands and `copy`:

```powershell
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```
</details>

---

## Roadmap

Ideas that fit naturally into the existing architecture:

- [ ] Real payment checkout (Stripe) behind the existing `Plan` / `Subscription` / `Payment` models
- [ ] Password reset and email verification
- [ ] Rate limiting and request logging
- [ ] Image variants (WebP/AVIF, multiple sizes) and CDN caching
- [ ] Comments and ratings on wallpapers
- [ ] Full-text PostgreSQL search (`tsvector`) for faster queries
- [ ] End-to-end tests (Playwright) and API tests (Supertest)
- [ ] Deployment manifests (Vercel + Railway/Render + managed Postgres)

---

## Contributing

1. Fork the repository and create a feature branch.
2. Keep frontend and backend boundaries intact — UI never queries the database directly.
3. Run `npm run build` in both `frontend/` and `backend/` before opening a pull request.
4. Describe schema changes and include a migration when relevant.

---

## License

No license file is included in this repository. The code is provided for educational and
demonstration purposes. Add a `LICENSE` file (for example, MIT) if you intend to distribute it.

Third-party imagery used in demo data is credited through the wallpaper provenance fields and is
intended for development previews only.
