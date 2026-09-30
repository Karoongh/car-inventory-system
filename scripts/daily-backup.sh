#!/usr/bin/env bash
# ============================================================
# Daily Database Backup Script – Car Inventory System
# ============================================================
# Usage:
#   ./scripts/daily-backup.sh
# Or schedule with cron:
#   0 3 * * * /path/to/car-inventory-system/scripts/daily-backup.sh >> /var/log/car-backup.log 2>&1
# ============================================================

set -euo pipefail

# Load environment if .env exists
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="car_inventory_${TIMESTAMP}.sql.gz"
FULL_PATH="${BACKUP_DIR}/${FILENAME}"

mkdir -p "$BACKUP_DIR"

echo "[$(date -Iseconds)] Starting backup..."

# Prefer docker compose exec if running inside docker setup
if command -v docker >/dev/null 2>&1 && docker compose ps postgres 2>/dev/null | grep -q Up; then
  echo "  Using docker compose postgres service"
  docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-postgres}" "${POSTGRES_DB:-car_inventory}" \
    | gzip > "$FULL_PATH"
else
  # Fallback to local pg_dump if DATABASE_URL is set
  if [ -n "${DATABASE_URL:-}" ]; then
    echo "  Using local pg_dump with DATABASE_URL"
    pg_dump "$DATABASE_URL" | gzip > "$FULL_PATH"
  else
    echo "  WARNING: No postgres container running and DATABASE_URL not set."
    echo "  Creating empty placeholder backup for development."
    echo "-- placeholder backup at ${TIMESTAMP}" | gzip > "$FULL_PATH"
  fi
fi

SIZE=$(du -h "$FULL_PATH" | cut -f1)
echo "  Backup created: $FULL_PATH ($SIZE)"

# Retention: delete files older than RETENTION_DAYS
echo "  Applying retention policy (${RETENTION_DAYS} days)..."
find "$BACKUP_DIR" -name "car_inventory_*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -delete || true

echo "[$(date -Iseconds)] Backup finished successfully."
