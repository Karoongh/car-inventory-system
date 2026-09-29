# Car Inventory System

سیستم مدیریت و معرفی هوشمند خودروهای مشتریان تعمیرگاه

## Architecture

Monorepo built with:
- **apps/api** – NestJS (Clean Architecture)
- **apps/web** – Next.js 14+ App Router
- **packages/domain** – Entities & Value Objects
- **packages/shared** – Types, constants, validators
- **packages/infrastructure** – Prisma, Redis, Image Processor (sharp), Storage

All code must follow the principles defined in the companion repository:
→ https://github.com/Karoongh/car-inventory-system-principles

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Docker & Docker Compose

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Karoongh/car-inventory-system.git
cd car-inventory-system

# 2. Install dependencies
pnpm install

# 3. Copy environment
cp .env.example .env

# 4. Start infrastructure
docker compose up -d

# 5. Generate Prisma client & run migrations (after Task 2)
pnpm db:generate
pnpm db:migrate

# 6. Run development servers
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000

## Image Processing

All uploaded car images are automatically:
- Converted to WebP
- Resized to thumbnail (400×300), medium (800×600), large (1200×900)
- Compressed (quality 80 by default)

See `docs/image-processing.md`.

## Task Progress

- [x] Task 1 – Project foundation & principles
- [ ] Task 2 – Domain & Database Schema
- [ ] Task 3 – OTP Authentication
- [ ] Task 4 – Car CRUD + Advanced Form + Image Upload
- [ ] Task 5 – Public Listing + Filters
- [ ] Task 6 – Divar Price Scraper + Chart
- [ ] Task 7 – Smart Suggestions + Disclaimer + Admin Panel
- [ ] Task 8 – Daily Backup + Security Hardening + Embed Ready
