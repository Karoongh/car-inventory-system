#!/usr/bin/env bash
# Placeholder – full implementation in Task 8
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-./backups}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-14}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="car_inventory_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "Backup script skeleton ready. Full logic will be added in Task 8."
echo "Would create: $BACKUP_DIR/$FILENAME"
