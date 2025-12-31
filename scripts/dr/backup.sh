#!/bin/bash
# Disaster Recovery backup script

set -e

BACKUP_DIR="${BACKUP_LOCATION:-/backups}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_ID="BKP-${TIMESTAMP}"

echo "Starting backup: ${BACKUP_ID}"

# Create backup directory
mkdir -p "${BACKUP_DIR}/${BACKUP_ID}"

# Backup database
echo "Backing up database..."
pg_dump -h ${DB_HOST:-localhost} -U ${DB_USER:-postgres} ${DB_NAME:-infinity_matrix} > "${BACKUP_DIR}/${BACKUP_ID}/database.sql"

# Backup configuration
echo "Backing up configuration..."
cp -r /app/config "${BACKUP_DIR}/${BACKUP_ID}/"

# Backup logs
echo "Backing up logs..."
cp -r /var/log/infinity-matrix "${BACKUP_DIR}/${BACKUP_ID}/logs"

# Create manifest
cat > "${BACKUP_DIR}/${BACKUP_ID}/manifest.json" <<EOF
{
  "backup_id": "${BACKUP_ID}",
  "timestamp": "${TIMESTAMP}",
  "type": "full",
  "components": ["database", "configuration", "logs"]
}
EOF

# Compress backup
echo "Compressing backup..."
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_ID}.tar.gz" "${BACKUP_ID}"
rm -rf "${BACKUP_ID}"

echo "Backup completed: ${BACKUP_DIR}/${BACKUP_ID}.tar.gz"

# Cleanup old backups (keep last 30 days)
find "${BACKUP_DIR}" -name "BKP-*.tar.gz" -mtime +30 -delete

echo "✅ Backup successful!"
