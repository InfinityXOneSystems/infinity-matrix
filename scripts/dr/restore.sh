#!/bin/bash
# Disaster Recovery restore script

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_id>"
    exit 1
fi

BACKUP_ID="$1"
BACKUP_DIR="${BACKUP_LOCATION:-/backups}"
BACKUP_FILE="${BACKUP_DIR}/${BACKUP_ID}.tar.gz"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "Starting restore from: ${BACKUP_ID}"

# Extract backup
echo "Extracting backup..."
cd "${BACKUP_DIR}"
tar -xzf "${BACKUP_ID}.tar.gz"

# Restore database
echo "Restoring database..."
psql -h ${DB_HOST:-localhost} -U ${DB_USER:-postgres} ${DB_NAME:-infinity_matrix} < "${BACKUP_DIR}/${BACKUP_ID}/database.sql"

# Restore configuration
echo "Restoring configuration..."
cp -r "${BACKUP_DIR}/${BACKUP_ID}/config" /app/

# Restore logs
echo "Restoring logs..."
cp -r "${BACKUP_DIR}/${BACKUP_ID}/logs" /var/log/infinity-matrix

# Cleanup extracted files
rm -rf "${BACKUP_DIR}/${BACKUP_ID}"

echo "✅ Restore completed successfully!"
