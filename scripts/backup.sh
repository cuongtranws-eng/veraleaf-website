#!/usr/bin/env bash
# VeraLeaf backup (Linux server): PostgreSQL dump + uploaded media.
# Usage:   bash scripts/backup.sh            (from the project folder)
# Cron:    0 2 * * * cd /var/www/veraleaf && bash scripts/backup.sh >> backups/backup.log 2>&1
# Keeps the last KEEP_DAYS days of backups (default 14).
set -euo pipefail

cd "$(dirname "$0")/.."
if [ -f .env ]; then set -a; . ./.env; set +a; fi
: "${DATABASE_URL:?DATABASE_URL is not set}"

KEEP_DAYS="${KEEP_DAYS:-14}"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="backups"
mkdir -p "$DEST"

echo "[$(date -Is)] Dumping database..."
pg_dump --format=custom --no-owner --no-privileges --dbname="$DATABASE_URL" --file="$DEST/db-$STAMP.dump"

if [ -d media ]; then
  echo "[$(date -Is)] Archiving media/..."
  tar -czf "$DEST/media-$STAMP.tar.gz" media
fi

find "$DEST" -type f \( -name 'db-*.dump' -o -name 'media-*.tar.gz' \) -mtime +"$KEEP_DAYS" -delete
echo "[$(date -Is)] Backup done: $DEST/db-$STAMP.dump"
