# Architecture Overview

## Layers

1. **Domain** (`packages/domain`)
   - Pure business entities and value objects
   - Repository interfaces
   - No external dependencies

2. **Application**
   - Use-cases / application services
   - DTOs and mappers
   - Orchestrates domain logic

3. **Infrastructure** (`packages/infrastructure`)
   - Prisma (PostgreSQL)
   - Redis (cache + BullMQ)
   - Image Processor (sharp)
   - File storage
   - External scrapers

4. **Presentation**
   - `apps/api` – NestJS controllers & modules
   - `apps/web` – Next.js pages & components

## Key Design Decisions

- Monorepo with pnpm workspaces + Turborepo
- Strict TypeScript
- API versioning from day one (`/api/v1`)
- Image processing centralized and automatic (WebP + fixed sizes)
- Daily automated backups
- Clean Architecture enforced via package boundaries
