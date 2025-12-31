# System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INFINITY MATRIX SYSTEM                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         VISION CORTEX                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Memory     │  │  Document    │  │    Event     │              │
│  │    Store     │  │   Engine     │  │   System     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ connects
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         OMNI ROUTER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │    RBAC      │  │   Routing    │  │   Secret     │              │
│  │   Policies   │  │    Engine    │  │   Manager    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ routes to
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       AGENT REGISTRY                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │Registration  │  │   Health     │  │  Heartbeat   │              │
│  │   System     │  │  Monitoring  │  │   Tracking   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ manages
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SPECIALIZED AGENTS                           │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Financial   │  │ Real Estate  │  │     Loan     │              │
│  │    Agent     │  │    Agent     │  │    Agent     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐                                 │
│  │  Analytics   │  │     NLP      │                                 │
│  │    Agent     │  │    Agent     │                                 │
│  └──────────────┘  └──────────────┘                                 │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                            │
│                                                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐           │
│  │   Firestore Integration │  │  Pub/Sub Integration    │           │
│  │  ┌─────────┬──────────┐ │  │  ┌────────┬──────────┐ │           │
│  │  │ Vector  │Relational│ │  │  │ Topics │Subscript.│ │           │
│  │  │ Memory  │  Storage │ │  │  │        │          │ │           │
│  │  └─────────┴──────────┘ │  │  └────────┴──────────┘ │           │
│  └─────────────────────────┘  └─────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ exposed via
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API SERVER (REST)                            │
│                                                                       │
│  /api/status                    System status                        │
│  /api/agents                    List agents                          │
│  /api/agents/{id}               Agent details                        │
│  /api/agents/{id}/health        Agent health                         │
│  /api/routes                    List routes                          │
│  /api/dashboard                 Dashboard view                       │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                            DATA FLOW
═══════════════════════════════════════════════════════════════════════

1. Request → API Server → Omni Router
2. Omni Router → Authentication & Policy Check
3. Omni Router → Route to Appropriate Agent (via Registry)
4. Agent → Process Request (using Memory/Firestore)
5. Agent → Publish Events (via Pub/Sub)
6. Vision Cortex → Coordinate & Monitor
7. Response → Back through chain to API Server


═══════════════════════════════════════════════════════════════════════
                         SECURITY LAYERS
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: Authentication                                              │
│   - User identification                                              │
│   - Token validation                                                 │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 2: RBAC Policy Enforcement                                     │
│   - Role verification (admin, agent, viewer)                         │
│   - Permission checking (READ, WRITE, EXECUTE, ADMIN)                │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 3: Resource Access Control                                     │
│   - Resource-level permissions                                       │
│   - Rate limiting                                                    │
└─────────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 4: Secret Management                                           │
│   - Credential storage                                               │
│   - Secret retrieval with access control                             │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                         EVENT FLOW
═══════════════════════════════════════════════════════════════════════

Agent Events:
  agent_registered → Cortex, Registry
  agent_unregistered → Cortex, Registry
  agent_status_changed → Cortex, Registry, Monitoring

Cortex Events:
  cortex_started → System
  cortex_stopped → System
  documents_loaded → Agents, Memory

Memory Events:
  memory_updated → Agents, Analytics
  document_ingested → Search, Indexing

Document Events:
  document_processed → Memory, Search
  index_updated → Cortex, Agents


═══════════════════════════════════════════════════════════════════════
                      DEPLOYMENT WORKFLOW
═══════════════════════════════════════════════════════════════════════

GitHub Actions: .github/workflows/cortex_bootstrap.yml

Triggers:
  - Push to main/develop
  - Pull request
  - Schedule (daily at 00:00 UTC)
  - Manual dispatch

Steps:
  1. Checkout code
  2. Setup Python 3.11
  3. Install dependencies
  4. Verify system structure
  5. Sync documentation
  6. Run validation
  7. Initialize Cortex
  8. Auto-ingest documents
  9. Generate report
  10. Upload artifacts
  11. Post summary


═══════════════════════════════════════════════════════════════════════
                       MONITORING & HEALTH
═══════════════════════════════════════════════════════════════════════

Health Checks:
  - Agent heartbeats (every 30s)
  - Component status polling
  - Health endpoint monitoring
  - Error count tracking

Metrics:
  - Active agents count
  - Request routing stats
  - Memory usage
  - Event propagation stats
  - API response times

Dashboard:
  - Real-time system status
  - Agent health matrix
  - Route configuration
  - Security policy status
  - Event statistics
