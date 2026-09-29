#!/usr/bin/env bash
set -euo pipefail

echo "→ Installing dependencies with pnpm..."
pnpm install

echo "→ Copying .env if missing..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example – please review secrets."
fi

echo "→ Starting Docker services (Postgres + Redis)..."
docker compose up -d

echo "→ Waiting for Postgres to be ready..."
until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Development environment is ready."
echo "   Run: pnpm dev"
