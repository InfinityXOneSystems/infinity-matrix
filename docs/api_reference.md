# API Documentation

## Overview

The Infinity Matrix API provides RESTful endpoints for system management, monitoring, and control.

**Base URL:** `http://localhost:8080/api`

## Authentication

Currently, the API supports basic authentication through the Omni Router's RBAC system. Future versions will include token-based authentication.

## Endpoints

### System Status

#### GET /api/status

Get overall system status including all components.

**Response:**
```json
{
  "system": "Infinity Matrix",
  "status": "running",
  "timestamp": "2024-12-30T22:50:00.000Z",
  "components": {
    "cortex": {
      "status": "running",
      "agents": 5,
      "documents": 10,
      "memory_vectors": 50,
      "memory_relations": 20
    },
    "gateway": {
      "status": "running",
      "routes": 15,
      "apis": 3,
      "policies": 3
    },
    "registry": {
      "status": "running",
      "total_agents": 5,
      "agents_by_status": {
        "active": 5
      },
      "agents_by_type": {
        "financial": 1,
        "real_estate": 1,
        "loan": 1,
        "analytics": 1,
        "nlp": 1
      }
    }
  }
}
```

### Agent Management

#### GET /api/agents

List all registered agents.

**Response:**
```json
{
  "agents": [
    {
      "agent_id": "financial-agent",
      "type": "financial",
      "status": "active",
      "roles": ["financial_analyst", "agent"],
      "capabilities": [
        "market_analysis",
        "portfolio_management",
        "risk_assessment"
      ]
    }
  ]
}
```

#### GET /api/agents/{agent_id}

Get details for a specific agent.

**Parameters:**
- `agent_id` (path): Agent identifier

**Response:**
```json
{
  "agent_id": "financial-agent",
  "type": "financial",
  "status": "active",
  "registered_at": "2024-12-30T22:50:00.000Z",
  "last_heartbeat": "2024-12-30T22:55:00.000Z",
  "roles": ["financial_analyst", "agent"],
  "permissions": ["read_financial", "write_financial"],
  "capabilities": ["market_analysis", "portfolio_management"]
}
```

#### GET /api/agents/{agent_id}/health

Get health status for a specific agent.

**Parameters:**
- `agent_id` (path): Agent identifier

**Response:**
```json
{
  "agent_id": "financial-agent",
  "status": "active",
  "last_heartbeat": "2024-12-30T22:55:00.000Z",
  "response_time_ms": 45.2,
  "error_count": 0
}
```

### Route Management

#### GET /api/routes

List all configured routes.

**Response:**
```json
{
  "routes": [
    {
      "path": "/financial/analyze",
      "agent_id": "financial-agent",
      "method": "POST",
      "requires_auth": true,
      "policies": ["agent_policy"]
    }
  ]
}
```

### Dashboard

#### GET /api/dashboard

Get comprehensive dashboard audit view.

**Response:**
```json
{
  "system": "Infinity Matrix",
  "timestamp": "2024-12-30T22:50:00.000Z",
  "summary": {
    "cortex": {
      "status": "running",
      "agents": 5,
      "documents": 10
    },
    "registry": {
      "total_agents": 5,
      "agents_by_status": {
        "active": 5
      }
    },
    "gateway": {
      "routes": 15,
      "policies": 3
    }
  }
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message",
  "status": "error"
}
```

**Status Codes:**
- `200`: Success
- `404`: Resource not found
- `500`: Internal server error

## Rate Limiting

Routes can be configured with rate limits. Exceeded limits return:

```json
{
  "status": "error",
  "message": "Rate limit exceeded"
}
```

## RBAC

All routes respect RBAC policies. Insufficient permissions return:

```json
{
  "status": "error",
  "message": "Permission denied"
}
```

## Examples

### Using curl

```bash
# Get system status
curl http://localhost:8080/api/status

# Get all agents
curl http://localhost:8080/api/agents

# Get specific agent
curl http://localhost:8080/api/agents/financial-agent

# Get agent health
curl http://localhost:8080/api/agents/financial-agent/health

# Get routes
curl http://localhost:8080/api/routes

# Get dashboard
curl http://localhost:8080/api/dashboard
```

### Using Python

```python
import requests

# Get system status
response = requests.get('http://localhost:8080/api/status')
status = response.json()
print(f"System status: {status['status']}")

# Get agents
response = requests.get('http://localhost:8080/api/agents')
agents = response.json()['agents']
for agent in agents:
    print(f"Agent: {agent['agent_id']} - {agent['status']}")
```

### Using JavaScript

```javascript
// Get system status
fetch('http://localhost:8080/api/status')
  .then(response => response.json())
  .then(data => console.log('Status:', data.status));

// Get agents
fetch('http://localhost:8080/api/agents')
  .then(response => response.json())
  .then(data => {
    data.agents.forEach(agent => {
      console.log(`${agent.agent_id}: ${agent.status}`);
    });
  });
```
