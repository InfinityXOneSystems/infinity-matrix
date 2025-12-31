# API Documentation

## Base URL

- Local Development: `http://localhost:3000`
- Production: `https://api.infinity-matrix.manus.im`

## Authentication

Most endpoints require authentication using an API key or JWT token:

```
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Health & Status

#### GET /health
Check server health status

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

#### GET /ready
Check readiness with dependency checks

**Response:**
```json
{
  "status": "ready",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### MCP Protocol

#### POST /api/v1/mcp/messages
Send an MCP message

**Request:**
```json
{
  "sender": "vscode_copilot",
  "recipient": "chatgpt",
  "message_type": "query",
  "payload": {
    "query": "Explain this code pattern"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### GET /api/v1/mcp/stats
Get MCP statistics

**Response:**
```json
{
  "active_providers": 3,
  "total_connections": 5,
  "queue_size": 0
}
```

### Context Synchronization

#### POST /api/v1/context/sync
Synchronize context across AI providers

**Request:**
```json
{
  "provider": "vscode_copilot",
  "workspace_id": "file:///path/to/workspace",
  "code_context": {
    "fileName": "main.py",
    "language": "python",
    "content": "def hello():\n    print('Hello')"
  },
  "file_references": ["main.py"],
  "target_providers": ["vertex_ai", "chatgpt"]
}
```

**Response:**
```json
{
  "status": "success",
  "context_id": "ctx_123456",
  "synced_to": ["vertex_ai", "chatgpt"]
}
```

#### GET /api/v1/context/{context_id}
Retrieve context by ID

**Response:**
```json
{
  "context_id": "ctx_123456",
  "provider": "vscode_copilot",
  "code_context": {...},
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Intelligence Sharing

#### POST /api/v1/intelligence/share
Share intelligence across providers

**Request:**
```json
{
  "source_provider": "chatgpt",
  "intelligence_type": "code_pattern",
  "content": {
    "pattern": "dependency_injection",
    "description": "Use constructor injection for better testability"
  },
  "confidence_score": 0.95,
  "tags": ["best-practice", "python"],
  "target_providers": ["vertex_ai", "github_copilot"]
}
```

**Response:**
```json
{
  "status": "success",
  "intelligence_id": "intel_789012",
  "shared_with": ["vertex_ai", "github_copilot"]
}
```

### AI Providers

#### GET /api/v1/providers/
List all supported AI providers

**Response:**
```json
{
  "providers": [
    {
      "id": "vertex_ai",
      "name": "Vertex AI",
      "enabled": true
    },
    {
      "id": "chatgpt",
      "name": "ChatGPT",
      "enabled": true
    }
  ]
}
```

#### GET /api/v1/providers/{provider_id}/status
Get provider status

**Response:**
```json
{
  "provider": "chatgpt",
  "status": "connected",
  "latency_ms": 45
}
```

### GitHub Integration

#### POST /api/v1/github/pull-requests
Create a pull request

**Request:**
```json
{
  "repository": "owner/repo",
  "title": "Add new feature",
  "body": "Description of changes",
  "head_branch": "feature-branch",
  "base_branch": "main"
}
```

**Response:**
```json
{
  "status": "success",
  "pr_number": 42,
  "url": "https://github.com/owner/repo/pull/42"
}
```

#### POST /api/v1/github/auto-merge
Auto-merge a pull request

**Request:**
```json
{
  "repository": "owner/repo",
  "pr_number": 42,
  "merge_method": "squash"
}
```

**Response:**
```json
{
  "status": "success",
  "pr_number": 42,
  "merged": true
}
```

## WebSocket API

Connect to `ws://localhost:3000/ws` for real-time updates.

### Message Format

```json
{
  "message_id": "uuid",
  "message_type": "context_sync",
  "sender": "vscode_copilot",
  "recipient": "chatgpt",
  "timestamp": "2024-01-01T00:00:00Z",
  "payload": {...}
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {...}
}
```

### Error Codes

- `AUTHENTICATION_ERROR` (401): Authentication failed
- `AUTHORIZATION_ERROR` (403): Access denied
- `VALIDATION_ERROR` (400): Invalid request data
- `AI_PROVIDER_ERROR` (502): AI provider error
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error
