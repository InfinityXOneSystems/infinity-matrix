# Manus Magic Pack

**The autonomous intelligence layer for InfinityXAI**

This Magic Pack embeds Manus AI capabilities directly into the InfinityXAI system, enabling:
- 🤖 **Autonomous operation** (self-healing, self-deploying)
- 🛡️ **Governed execution** (MCP gateway with audit logs)
- 🚀 **One-button operations** (deploy, rollback, verify)
- 📊 **Evidence generation** (automatic documentation)
- 🔍 **Drift detection** (monitors for config/code changes)
- 💰 **Cost optimization** (budget guardrails, anomaly detection)
- ✅ **Quality gates** (contract validation, type checking)
- 🎛️ **Operator cockpit** (admin dashboard with kill switches)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MANUS MAGIC PACK                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MCP GATEWAY                              │  │
│  │  • Tool Registry                                      │  │
│  │  • Governed Execution (DRY_RUN/LIVE)                 │  │
│  │  • Audit Logging                                      │  │
│  │  • Kill Switch                                        │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                      │
│         ┌─────────────┼─────────────┐                       │
│         ▼             ▼             ▼                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │Autopilot │  │ Evidence │  │  Scripts │                  │
│  │  Engine  │  │Generator │  │ (1-btn)  │                  │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. MCP Gateway (`mcp_gateway/`)

**Purpose:** Governed execution layer for all autonomous actions.

**Endpoints:**
- `GET /mcp/health` - Health check
- `GET /mcp/tools` - List available tools
- `GET /mcp/schema` - OpenAPI schema
- `POST /mcp/execute` - Execute a tool with governance
- `POST /mcp/kill-switch` - Toggle global kill switch

**Features:**
- Execution modes: OBSERVE_ONLY, DRY_RUN, LIVE
- Risk levels: LOW, MEDIUM, HIGH, CRITICAL
- Audit logging (every execution logged with hash)
- Kill switch (global disable)
- Tool registry (dynamic tool loading)

**Usage:**
```bash
# Start MCP Gateway
cd mcp_gateway
python main.py

# Test health
curl http://localhost:8001/mcp/health

# List tools
curl -H "X-MCP-Key: $MCP_API_KEY" http://localhost:8001/mcp/tools

# Execute tool (dry run)
curl -X POST http://localhost:8001/mcp/execute \
  -H "X-MCP-Key: $MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tool_name": "github_create_pr",
    "args": {"title": "Test PR"},
    "execution_mode": "DRY_RUN",
    "requester": "test_user"
  }'
```

---

### 2. Autopilot Engine (`autopilot/`)

**Purpose:** Self-healing and self-evolving system maintenance.

**Workflow:**
1. **OBSERVE** - Monitor system health, detect issues
2. **PLAN** - Generate remediation actions
3. **APPLY_SAFE** - Execute via MCP (dry-run first, then live)
4. **VERIFY** - Confirm fix worked, rollback if not

**Usage:**
```bash
# Run autopilot cycle
cd autopilot
python engine.py

# Or use one-button script
../scripts/one_button.sh run-autopilot
```

**Checks:**
- Health endpoints (API, frontend, MCP)
- Error rates in logs
- Resource utilization
- Config drift
- Dependency vulnerabilities
- Test failures

---

### 3. One-Button Scripts (`scripts/`)

**Purpose:** Simple commands for common operations.

**Commands:**
```bash
# Install dependencies
./one_button.sh hydrate

# Run pre-deployment checks
./one_button.sh preflight

# Deploy to staging
./one_button.sh deploy staging

# Deploy to production
./one_button.sh deploy production

# Rollback deployment
./one_button.sh rollback staging

# Verify deployment
./one_button.sh verify staging

# Run local demo
./one_button.sh run-demo

# Run autopilot cycle
./one_button.sh run-autopilot
```

---

### 4. Evidence Pack Generator (`evidence/`)

**Purpose:** Automatically generate launch evidence documentation.

**Usage:**
```python
from evidence.generator import EvidenceGenerator

generator = EvidenceGenerator(environment="staging")

# Add services
generator.add_service("API", "https://api.infinityxai.com")

# Check health
generator.check_health("API", "https://api.infinityxai.com/health")

# Add contract hashes
generator.add_contract_hash("backend_api", "abc123")

# Save
generator.save("ops/reports/LAUNCH_EVIDENCE_PACK_STAGING.md")
```

**Generates:**
- Deployment URLs
- Health check results
- Curl outputs
- Contract hashes
- Test results
- Screenshots (references)

---

## Deployment

### Local Development

```bash
# 1. Hydrate
./scripts/one_button.sh hydrate

# 2. Run demo
./scripts/one_button.sh run-demo
```

### Staging

```bash
# 1. Preflight checks
./scripts/one_button.sh preflight

# 2. Deploy
./scripts/one_button.sh deploy staging

# 3. Verify
./scripts/one_button.sh verify staging
```

### Production

```bash
# 1. Deploy
./scripts/one_button.sh deploy production

# 2. Verify
./scripts/one_button.sh verify production

# 3. Enable autopilot
./scripts/one_button.sh run-autopilot
```

---

## Environment Variables

Required:
- `GCP_PROJECT_ID` - Google Cloud project ID
- `MCP_API_KEY` - MCP Gateway API key
- `GITHUB_TOKEN` - GitHub personal access token

Optional:
- `MCP_KILL_SWITCH` - Enable kill switch (default: false)
- `MCP_GLOBAL_MODE` - Global execution mode (default: DRY_RUN)
- `MCP_GATEWAY_URL` - MCP Gateway URL (default: http://localhost:8001)

---

## Security

- All MCP executions require API key authentication
- Audit logs for every execution (with hash)
- Kill switch for emergency shutdown
- Execution modes (OBSERVE_ONLY, DRY_RUN, LIVE)
- Risk levels (LOW, MEDIUM, HIGH, CRITICAL)
- Requires PR for high-risk actions

---

## Monitoring

The Magic Pack includes:
- Health check endpoints
- Audit logging to Firestore
- Autopilot cycle monitoring
- Evidence pack generation
- Cost sentinel (budget alerts)

---

## Integration with InfinityXAI

The Magic Pack is designed to integrate seamlessly with:
- **Backend API** - Uses MCP Gateway for all actions
- **Frontend** - Operator Cockpit in /admin
- **Agents** - All agents execute via MCP
- **GitHub** - PR-based workflows
- **Google Cloud** - Cloud Run, Firestore, Secret Manager

---

## What's Next

1. **Wire MCP Gateway to actual tool implementations** (GitHub API, Cloud Run API, etc.)
2. **Add Firestore persistence** for audit logs and tool registry
3. **Build Operator Cockpit UI** in /admin
4. **Enable autopilot cron job** (runs every 15 minutes)
5. **Add cost sentinel** (budget guardrails)
6. **Add drift detection** (monitors config/code changes)

---

## License

MIT License - Part of InfinityXAI System
