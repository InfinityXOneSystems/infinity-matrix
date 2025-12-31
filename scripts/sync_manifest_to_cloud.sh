#!/bin/bash
# sync_manifest_to_cloud.sh - Sync system manifest to cloud storage
# Uploads the generated manifest to Google Cloud Storage and Supabase

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
MANIFEST_FILE="$PROJECT_ROOT/system_manifest.json"

echo "Syncing System Manifest to Cloud..."
echo "==================================="

# Check if manifest exists
if [ ! -f "$MANIFEST_FILE" ]; then
    echo "❌ Error: Manifest file not found at $MANIFEST_FILE"
    echo "   Run ./scripts/generate_manifest.sh first"
    exit 1
fi

echo "  ✓ Manifest file found"

# Sync to Google Cloud Storage (if gcloud is configured)
if command -v gcloud &> /dev/null && [ -n "${GCP_PROJECT_ID:-}" ]; then
    echo "  → Syncing to Google Cloud Storage..."
    
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    HOSTNAME=$(hostname)
    GCS_PATH="gs://infinity-matrix-manifests/$HOSTNAME/$TIMESTAMP.json"
    
    if gcloud storage cp "$MANIFEST_FILE" "$GCS_PATH" 2>/dev/null; then
        echo "  ✓ Uploaded to $GCS_PATH"
    else
        echo "  ⚠ Warning: Could not upload to GCS (check credentials)"
    fi
else
    echo "  ⚠ Skipping GCS sync (gcloud not configured)"
fi

# Sync to Supabase (if configured)
if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SERVICE_KEY:-}" ]; then
    echo "  → Syncing to Supabase..."
    
    RESPONSE=$(curl -s -X POST "$SUPABASE_URL/rest/v1/system_manifests" \
        -H "apikey: $SUPABASE_SERVICE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
        -H "Content-Type: application/json" \
        -H "Prefer: return=minimal" \
        -d @"$MANIFEST_FILE" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "  ✓ Synced to Supabase"
    else
        echo "  ⚠ Warning: Could not sync to Supabase (check credentials)"
    fi
else
    echo "  ⚠ Skipping Supabase sync (not configured)"
fi

echo ""
echo "✓ Sync complete"
echo ""
echo "Manifest locations:"
echo "  - Local: $MANIFEST_FILE"
echo "  - GCS: gs://infinity-matrix-manifests/$(hostname)/"
echo "  - Supabase: system_manifests table"
