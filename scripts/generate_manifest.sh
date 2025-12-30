#!/bin/bash
# generate_manifest.sh - Generate system manifest for Infinity-Matrix
# This script inventories the system environment, applications, and configurations

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
OUTPUT_FILE="$PROJECT_ROOT/system_manifest.json"

echo "Generating Infinity-Matrix System Manifest..."
echo "================================================"

# Generate UUID for manifest
if command -v uuidgen &> /dev/null; then
    MANIFEST_ID=$(uuidgen)
else
    MANIFEST_ID=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "$(date +%s)-$(hostname)")
fi

# Collect OS information
collect_os_info() {
    echo "  → Collecting OS information..." >&2
    
    OS_TYPE=$(uname -s)
    OS_VERSION=$(uname -r)
    ARCH=$(uname -m)
    
    cat <<EOF
    "os": {
      "type": "$OS_TYPE",
      "version": "$OS_VERSION",
      "architecture": "$ARCH",
      "kernel": "$(uname -v | head -c 50)"
    }
EOF
}

# Collect hardware information
collect_hardware_info() {
    echo "  → Collecting hardware information..." >&2
    
    CPU_CORES=$(nproc 2>/dev/null || echo "0")
    
    if command -v free &> /dev/null; then
        MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    else
        MEMORY_GB="0"
    fi
    
    if command -v df &> /dev/null; then
        DISK_GB=$(df -BG / | awk 'NR==2{print $2}' | sed 's/G//')
    else
        DISK_GB="0"
    fi
    
    cat <<EOF
    "hardware": {
      "cpu_cores": $CPU_CORES,
      "memory_gb": $MEMORY_GB,
      "disk_space_gb": $DISK_GB
    }
EOF
}

# Collect network information
collect_network_info() {
    echo "  → Collecting network information..." >&2
    
    HOSTNAME=$(hostname)
    IP_ADDRESS=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "unknown")
    
    cat <<EOF
    "network": {
      "hostname": "$HOSTNAME",
      "ip_address": "$IP_ADDRESS",
      "dns_servers": ["8.8.8.8", "8.8.4.4"]
    }
EOF
}

# Scan for installed applications
scan_applications() {
    echo "  → Scanning installed applications..." >&2
    
    declare -A apps=(
        ["git"]="git --version"
        ["docker"]="docker --version"
        ["node"]="node --version"
        ["npm"]="npm --version"
        ["python3"]="python3 --version"
        ["python"]="python --version"
    )
    
    first=true
    for app in "${!apps[@]}"; do
        if command -v "$app" &> /dev/null; then
            version=$(eval "${apps[$app]}" 2>&1 | head -n1 | tr -d '\n' | sed 's/"/\\"/g')
            install_path=$(which "$app" | tr -d '\n')
            
            [ "$first" = false ] && echo ","
            first=false
            
            cat <<EOF
    {
      "name": "$app",
      "version": "$version",
      "install_path": "$install_path",
      "config_files": []
    }
EOF
        fi
    done
}

# Main manifest generation
{
echo "{"
echo "  \"metadata\": {"
echo "    \"version\": \"1.0.0\","
echo "    \"generated_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\","
echo "    \"generated_by\": \"generate_manifest.sh\","
echo "    \"hostname\": \"$(hostname)\","
echo "    \"manifest_id\": \"$MANIFEST_ID\""
echo "  },"
echo "  \"environment\": {"
collect_os_info
echo "    ,"
collect_hardware_info
echo "    ,"
collect_network_info
echo "  },"
echo "  \"applications\": ["
scan_applications
echo "  ],"
echo "  \"credentials\": [],"
echo "  \"cloud_services\": [],"
echo "  \"project_info\": {"
echo "    \"repository\": \"https://github.com/InfinityXOneSystems/infinity-matrix\","
echo "    \"branch\": \"$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')\","
echo "    \"commit\": \"$(git rev-parse HEAD 2>/dev/null || echo 'unknown')\""
echo "  }"
echo "}"
} > "$OUTPUT_FILE"

echo ""
echo "✓ Manifest generated successfully: $OUTPUT_FILE"
echo "  Manifest ID: $MANIFEST_ID"
echo "  Hostname: $(hostname)"
echo ""
echo "To view the manifest:"
echo "  cat $OUTPUT_FILE | jq '.'"
