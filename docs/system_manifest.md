# Infinity-Matrix System Manifest

## Overview

The System Manifest is a comprehensive inventory of the operating environment, installed applications, configuration files, credentials, containers, cloud bridges, and other system components. This document serves as both a template and instructions for agents to generate and maintain an up-to-date system manifest.

## Purpose

1. **System Discovery**: Automatically inventory all system components
2. **Configuration Management**: Track all configuration files and their locations
3. **Credential Tracking**: Document all required credentials (without exposing secrets)
4. **Dependency Management**: List all installed tools and dependencies
5. **Cloud Integration**: Map all cloud service connections and configurations
6. **Sync Coordination**: Enable synchronization across development, staging, and production
7. **Agent Onboarding**: Provide complete system context to new agents

---

## Manifest Schema

The system manifest is stored as JSON for programmatic access and as Markdown for human readability.

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Infinity Matrix System Manifest",
  "type": "object",
  "required": ["metadata", "environment", "applications", "credentials", "cloud_services"],
  "properties": {
    "metadata": {
      "type": "object",
      "properties": {
        "version": { "type": "string" },
        "generated_at": { "type": "string", "format": "date-time" },
        "generated_by": { "type": "string" },
        "hostname": { "type": "string" },
        "manifest_id": { "type": "string" }
      }
    },
    "environment": {
      "type": "object",
      "properties": {
        "os": {
          "type": "object",
          "properties": {
            "type": { "type": "string" },
            "version": { "type": "string" },
            "architecture": { "type": "string" },
            "kernel": { "type": "string" }
          }
        },
        "hardware": {
          "type": "object",
          "properties": {
            "cpu_cores": { "type": "integer" },
            "memory_gb": { "type": "number" },
            "disk_space_gb": { "type": "number" }
          }
        },
        "network": {
          "type": "object",
          "properties": {
            "hostname": { "type": "string" },
            "ip_address": { "type": "string" },
            "dns_servers": { "type": "array", "items": { "type": "string" } }
          }
        }
      }
    },
    "applications": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "version": { "type": "string" },
          "install_path": { "type": "string" },
          "executable": { "type": "string" },
          "config_files": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "credentials": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "service": { "type": "string" },
          "type": { "type": "string" },
          "location": { "type": "string" },
          "configured": { "type": "boolean" },
          "expires_at": { "type": "string", "format": "date-time" }
        }
      }
    },
    "cloud_services": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "provider": { "type": "string" },
          "service": { "type": "string" },
          "project_id": { "type": "string" },
          "region": { "type": "string" },
          "endpoint": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  }
}
```

---

## Manifest Generator Instructions

### For AI Agents

When instructed to generate or update the system manifest, execute the following steps:

#### Step 1: Environment Discovery

Collect operating system and hardware information:

```bash
# Operating System
OS_TYPE=$(uname -s)
OS_VERSION=$(uname -r)
ARCH=$(uname -m)

# Hardware
CPU_CORES=$(nproc)
MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
DISK_GB=$(df -BG / | awk 'NR==2{print $2}' | sed 's/G//')

# Network
HOSTNAME=$(hostname)
IP_ADDRESS=$(hostname -I | awk '{print $1}')
```

For Windows PowerShell:
```powershell
# Operating System
$OS_TYPE = "Windows"
$OS_VERSION = (Get-WmiObject Win32_OperatingSystem).Version
$ARCH = $env:PROCESSOR_ARCHITECTURE

# Hardware
$CPU_CORES = (Get-WmiObject Win32_ComputerSystem).NumberOfLogicalProcessors
$MEMORY_GB = [math]::Round((Get-WmiObject Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)
$DISK_GB = [math]::Round((Get-PSDrive C).Free / 1GB, 2)

# Network
$HOSTNAME = $env:COMPUTERNAME
$IP_ADDRESS = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*"}).IPAddress
```

#### Step 2: Application Inventory

Scan for installed development tools and applications:

```bash
#!/bin/bash
# application_scanner.sh

declare -A apps=(
  ["git"]="git --version"
  ["docker"]="docker --version"
  ["docker-compose"]="docker-compose --version"
  ["node"]="node --version"
  ["npm"]="npm --version"
  ["python"]="python3 --version"
  ["pip"]="pip3 --version"
  ["go"]="go version"
  ["java"]="java -version 2>&1"
  ["mvn"]="mvn --version"
  ["gradle"]="gradle --version"
  ["dotnet"]="dotnet --version"
  ["rust"]="rustc --version"
  ["cargo"]="cargo --version"
  ["kubectl"]="kubectl version --client"
  ["terraform"]="terraform version"
  ["gcloud"]="gcloud --version"
  ["aws"]="aws --version"
  ["azure"]="az --version"
)

echo "["
first=true
for app in "${!apps[@]}"; do
  if command -v "$app" &> /dev/null; then
    version=$(eval "${apps[$app]}" 2>&1 | head -n1)
    install_path=$(which "$app")
    
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
echo "]"
```

#### Step 3: Configuration File Discovery

Locate all configuration files:

```bash
#!/bin/bash
# config_scanner.sh

CONFIG_FILES=(
  ".env"
  ".env.local"
  ".env.production"
  "package.json"
  "package-lock.json"
  "requirements.txt"
  "Pipfile"
  "go.mod"
  "pom.xml"
  "build.gradle"
  "Cargo.toml"
  ".gitignore"
  ".dockerignore"
  "Dockerfile"
  "docker-compose.yml"
  ".github/workflows/*.yml"
  "terraform/*.tf"
  ".vscode/settings.json"
  ".vscode/launch.json"
  "tsconfig.json"
  "jest.config.js"
  "pytest.ini"
)

echo "["
first=true
for pattern in "${CONFIG_FILES[@]}"; do
  for file in $pattern; do
    if [ -f "$file" ]; then
      [ "$first" = false ] && echo ","
      first=false
      
      echo "  {"
      echo "    \"path\": \"$file\","
      echo "    \"size\": $(stat -f%z "$file" 2>/dev/null || stat -c%s "$file"),"
      echo "    \"modified\": \"$(stat -f%Sm -t '%Y-%m-%dT%H:%M:%S' "$file" 2>/dev/null || stat -c%y "$file")\""
      echo "  }"
    fi
  done
done
echo "]"
```

#### Step 4: Credential Inventory

Document required credentials (without exposing secrets):

```bash
#!/bin/bash
# credential_scanner.sh

# Check for GitHub credentials
check_github() {
  if [ -f ~/.gitconfig ]; then
    echo "  {"
    echo "    \"service\": \"GitHub\","
    echo "    \"type\": \"git_config\","
    echo "    \"location\": \"~/.gitconfig\","
    echo "    \"configured\": true"
    echo "  }"
  fi
  
  if [ -n "$GITHUB_TOKEN" ]; then
    echo "  ,{"
    echo "    \"service\": \"GitHub\","
    echo "    \"type\": \"access_token\","
    echo "    \"location\": \"GITHUB_TOKEN env var\","
    echo "    \"configured\": true"
    echo "  }"
  fi
}

# Check for GCP credentials
check_gcp() {
  if [ -f ~/.config/gcloud/credentials.db ]; then
    echo "  ,{"
    echo "    \"service\": \"Google Cloud\","
    echo "    \"type\": \"service_account\","
    echo "    \"location\": \"~/.config/gcloud\","
    echo "    \"configured\": true"
    echo "  }"
  fi
}

# Check for Supabase credentials
check_supabase() {
  if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_KEY" ]; then
    echo "  ,{"
    echo "    \"service\": \"Supabase\","
    echo "    \"type\": \"api_key\","
    echo "    \"location\": \"Environment variables\","
    echo "    \"configured\": true"
    echo "  }"
  fi
}

echo "["
check_github
check_gcp
check_supabase
echo "]"
```

#### Step 5: Cloud Service Discovery

Detect configured cloud services:

```bash
#!/bin/bash
# cloud_scanner.sh

# GitHub
if [ -n "$GITHUB_TOKEN" ]; then
  echo "  {"
  echo "    \"provider\": \"GitHub\","
  echo "    \"service\": \"Actions\","
  echo "    \"endpoint\": \"https://api.github.com\","
  echo "    \"status\": \"active\""
  echo "  }"
fi

# Google Cloud
if command -v gcloud &> /dev/null; then
  PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
  if [ -n "$PROJECT_ID" ]; then
    echo "  ,{"
    echo "    \"provider\": \"Google Cloud\","
    echo "    \"service\": \"Compute\","
    echo "    \"project_id\": \"$PROJECT_ID\","
    echo "    \"region\": \"$(gcloud config get-value compute/region 2>/dev/null)\","
    echo "    \"status\": \"active\""
    echo "  }"
  fi
fi

# Supabase
if [ -n "$SUPABASE_URL" ]; then
  echo "  ,{"
  echo "    \"provider\": \"Supabase\","
  echo "    \"service\": \"Database\","
  echo "    \"endpoint\": \"$SUPABASE_URL\","
  echo "    \"status\": \"active\""
  echo "  }"
fi
```

#### Step 6: Container Inventory

List Docker containers and images:

```bash
#!/bin/bash
# container_scanner.sh

if command -v docker &> /dev/null; then
  echo "{"
  echo "  \"containers\": ["
  docker ps --format '{"id":"{{.ID}}","name":"{{.Names}}","image":"{{.Image}}","status":"{{.Status}}"}' | paste -sd, -
  echo "  ],"
  echo "  \"images\": ["
  docker images --format '{"repository":"{{.Repository}}","tag":"{{.Tag}}","size":"{{.Size}}","created":"{{.CreatedAt}}"}' | paste -sd, -
  echo "  ]"
  echo "}"
fi
```

#### Step 7: Generate Complete Manifest

Combine all information into a single manifest file:

```bash
#!/bin/bash
# generate_manifest.sh

cat > system_manifest.json <<EOF
{
  "metadata": {
    "version": "1.0.0",
    "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "generated_by": "Infinity-Matrix Agent",
    "hostname": "$(hostname)",
    "manifest_id": "$(uuidgen)"
  },
  "environment": $(./environment_scanner.sh),
  "applications": $(./application_scanner.sh),
  "config_files": $(./config_scanner.sh),
  "credentials": $(./credential_scanner.sh),
  "cloud_services": $(./cloud_scanner.sh),
  "containers": $(./container_scanner.sh)
}
EOF

echo "Manifest generated: system_manifest.json"
```

---

## Manifest Template

### Example System Manifest

```json
{
  "metadata": {
    "version": "1.0.0",
    "generated_at": "2025-12-30T22:00:00Z",
    "generated_by": "Infinity-Matrix Agent",
    "hostname": "dev-workstation",
    "manifest_id": "550e8400-e29b-41d4-a716-446655440000"
  },
  "environment": {
    "os": {
      "type": "Linux",
      "version": "5.15.0-91-generic",
      "architecture": "x86_64",
      "kernel": "Linux"
    },
    "hardware": {
      "cpu_cores": 8,
      "memory_gb": 16,
      "disk_space_gb": 250
    },
    "network": {
      "hostname": "dev-workstation",
      "ip_address": "192.168.1.100",
      "dns_servers": ["8.8.8.8", "8.8.4.4"]
    }
  },
  "applications": [
    {
      "name": "git",
      "version": "2.43.0",
      "install_path": "/usr/bin/git",
      "executable": "/usr/bin/git",
      "config_files": ["~/.gitconfig", ".git/config"]
    },
    {
      "name": "docker",
      "version": "24.0.7",
      "install_path": "/usr/bin/docker",
      "executable": "/usr/bin/docker",
      "config_files": ["~/.docker/config.json", "/etc/docker/daemon.json"]
    },
    {
      "name": "node",
      "version": "20.10.0",
      "install_path": "/usr/bin/node",
      "executable": "/usr/bin/node",
      "config_files": ["package.json", ".nvmrc"]
    },
    {
      "name": "python",
      "version": "3.11.6",
      "install_path": "/usr/bin/python3",
      "executable": "/usr/bin/python3",
      "config_files": ["requirements.txt", "setup.py", "pyproject.toml"]
    }
  ],
  "config_files": [
    {
      "path": ".env",
      "size": 1024,
      "modified": "2025-12-30T20:00:00Z",
      "type": "environment"
    },
    {
      "path": "package.json",
      "size": 2048,
      "modified": "2025-12-30T19:30:00Z",
      "type": "npm"
    },
    {
      "path": "docker-compose.yml",
      "size": 4096,
      "modified": "2025-12-30T18:00:00Z",
      "type": "docker"
    }
  ],
  "credentials": [
    {
      "service": "GitHub",
      "type": "OAuth Token",
      "location": "GITHUB_TOKEN env var",
      "configured": true,
      "expires_at": null
    },
    {
      "service": "Google Cloud",
      "type": "Service Account",
      "location": "~/.config/gcloud/credentials.db",
      "configured": true,
      "expires_at": null
    },
    {
      "service": "Supabase",
      "type": "API Key",
      "location": "SUPABASE_KEY env var",
      "configured": true,
      "expires_at": null
    },
    {
      "service": "Hostinger",
      "type": "SFTP Credentials",
      "location": "GitHub Secrets",
      "configured": true,
      "expires_at": null
    }
  ],
  "cloud_services": [
    {
      "provider": "GitHub",
      "service": "Actions",
      "project_id": "InfinityXOneSystems/infinity-matrix",
      "region": "global",
      "endpoint": "https://api.github.com",
      "status": "active"
    },
    {
      "provider": "Google Cloud",
      "service": "Cloud Run",
      "project_id": "infinity-matrix-prod",
      "region": "us-central1",
      "endpoint": "https://run.googleapis.com",
      "status": "active"
    },
    {
      "provider": "Supabase",
      "service": "Database",
      "project_id": "abc123def456",
      "region": "us-east-1",
      "endpoint": "https://abc123def456.supabase.co",
      "status": "active"
    },
    {
      "provider": "Hostinger",
      "service": "Web Hosting",
      "project_id": "infinityxai.com",
      "region": "eu-central",
      "endpoint": "infinityxai.com",
      "status": "active"
    }
  ],
  "containers": {
    "running": [
      {
        "id": "abc123",
        "name": "infinity-matrix-app",
        "image": "infinity-matrix:latest",
        "status": "Up 2 days",
        "ports": ["8080:80"]
      }
    ],
    "images": [
      {
        "repository": "infinity-matrix",
        "tag": "latest",
        "size": "500MB",
        "created": "2025-12-28T10:00:00Z"
      }
    ]
  },
  "project_info": {
    "repository": "https://github.com/InfinityXOneSystems/infinity-matrix",
    "branch": "main",
    "commit": "abc123def456",
    "frameworks": ["React", "Node.js", "PostgreSQL"],
    "languages": ["TypeScript", "JavaScript", "Python"]
  }
}
```

---

## Sync Strategy

### Agent-to-Agent Sync

Agents share manifests via Supabase:

```sql
-- System manifests table
CREATE TABLE system_manifests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manifest_id UUID UNIQUE NOT NULL,
  hostname TEXT NOT NULL,
  manifest_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sync function
CREATE OR REPLACE FUNCTION sync_manifest(
  p_manifest JSONB
) RETURNS UUID AS $$
DECLARE
  v_manifest_id UUID;
BEGIN
  v_manifest_id := (p_manifest->>'manifest_id')::UUID;
  
  INSERT INTO system_manifests (manifest_id, hostname, manifest_data)
  VALUES (
    v_manifest_id,
    p_manifest->'metadata'->>'hostname',
    p_manifest
  )
  ON CONFLICT (manifest_id) DO UPDATE
  SET manifest_data = EXCLUDED.manifest_data,
      updated_at = NOW();
  
  RETURN v_manifest_id;
END;
$$ LANGUAGE plpgsql;
```

### Cloud Sync

Push manifest to cloud storage for backup and sharing:

```bash
#!/bin/bash
# sync_manifest_to_cloud.sh

# Generate manifest
./generate_manifest.sh

# Upload to Google Cloud Storage
gcloud storage cp system_manifest.json \
  gs://infinity-matrix-manifests/$(hostname)/$(date +%Y%m%d-%H%M%S).json

# Upload to Supabase
curl -X POST "$SUPABASE_URL/rest/v1/system_manifests" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d @system_manifest.json
```

---

## Usage Instructions

### For Human Operators

1. **Generate Initial Manifest**:
   ```bash
   cd /path/to/infinity-matrix
   ./scripts/generate_manifest.sh
   ```

2. **Review Manifest**:
   ```bash
   cat system_manifest.json | jq '.'
   ```

3. **Sync with Cloud**:
   ```bash
   ./scripts/sync_manifest_to_cloud.sh
   ```

4. **Schedule Auto-Updates** (add to crontab):
   ```bash
   0 */6 * * * cd /path/to/infinity-matrix && ./scripts/generate_manifest.sh
   ```

### For AI Agents

When you need to understand the system environment:

1. **Request Current Manifest**: "Show me the current system manifest"
2. **Generate Fresh Manifest**: "Generate a new system manifest"
3. **Compare Manifests**: "Compare current manifest with previous version"
4. **Identify Changes**: "What changed in the system since last manifest?"

The agent should automatically:
- Generate manifest on first run
- Update manifest daily or after significant changes
- Sync manifest with Supabase for other agents
- Alert on missing or misconfigured components

---

## Automation Integration

### GitHub Actions

Add to `.github/workflows/system-manifest.yml`:

```yaml
name: System Manifest Update

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  generate-manifest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Generate Manifest
        run: |
          chmod +x scripts/generate_manifest.sh
          ./scripts/generate_manifest.sh
      
      - name: Upload Manifest
        uses: actions/upload-artifact@v4
        with:
          name: system-manifest
          path: system_manifest.json
      
      - name: Sync to Cloud
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
        run: |
          chmod +x scripts/sync_manifest_to_cloud.sh
          ./scripts/sync_manifest_to_cloud.sh
```

---

## References

- [Blueprint](./blueprint.md) - System architecture
- [Roadmap](./roadmap.md) - Implementation plan
- [Prompt Suite](./prompt_suite.md) - Agent prompts
- [Setup Instructions](../setup_instructions.md) - Onboarding guide
- [Collaboration Guide](../COLLABORATION.md) - Team protocols

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-30  
**Maintained By**: Infinity-Matrix System
