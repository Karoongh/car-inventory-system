# Deployment Guide

## Recommended stack (VPS)

1. Ubuntu 22.04+
2. Docker + Docker Compose
3. Caddy or Nginx as reverse proxy (automatic HTTPS)
4. Node 20+ / pnpm for building

## Quick steps

```bash
git clone https://github.com/Karoongh/car-inventory-system.git
cd car-inventory-system
cp .env.example .env
# edit .env – set JWT_SECRET, DATABASE_URL, etc.

docker compose up -d          # postgres + redis
pnpm install
pnpm db:generate
pnpm db:migrate               # after real Prisma schema is active
pnpm build
pnpm --filter @car-inventory/api start
pnpm --filter @car-inventory/web start
```

## Cron for daily backup

```cron
0 3 * * * cd /path/to/car-inventory-system && ./scripts/daily-backup.sh >> /var/log/car-backup.log 2>&1
```

## Environment variables (production)

See `.env.example`. Critical ones:

- `JWT_SECRET`
- `DATABASE_URL`
- `REDIS_URL`
- `WEB_ORIGIN` (your frontend domain)
- `NEXT_PUBLIC_API_URL`
