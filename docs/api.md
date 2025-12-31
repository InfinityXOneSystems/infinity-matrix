# API Reference

## Overview

The Infinity Matrix Auto-Builder provides a RESTful API for programmatic access to all build functions. The API is built with FastAPI and provides automatic OpenAPI documentation.

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-token>
```

For development, authentication can be optional based on configuration.

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Response**:
```json
{
  "status": "healthy"
}
```

### Root

#### GET /

Get API status and information.

**Response**:
```json
{
  "status": "operational",
  "version": "0.1.0",
  "agents": [
    {
      "type": "crawler",
      "status": "idle",
      "capabilities": ["analyze_repo", "scan_templates", "analyze_docs"]
    }
  ],
  "active_builds": 0
}
```

### Builds

#### POST /api/v1/builds

Create a new build.

**Request Body**:
```json
{
  "blueprint": {
    "name": "my-project",
    "type": "api",
    "description": "My API project",
    "version": "1.0.0",
    "requirements": ["authentication", "database"]
  }
}
```

or

```json
{
  "prompt": "Create a REST API for user management"
}
```

**Response** (201 Created):
```json
{
  "build_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "created",
  "message": "Build created successfully",
  "build_status": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "my-project",
    "status": "pending",
    "progress": 0,
    "phases_completed": 0,
    "phases_total": 5,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input
- `500 Internal Server Error`: Build creation failed

#### GET /api/v1/builds/{build_id}

Get build status by ID.

**Path Parameters**:
- `build_id` (string): Build identifier

**Response** (200 OK):
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "my-project",
  "status": "running",
  "progress": 60,
  "phases_completed": 3,
  "phases_total": 5,
  "created_at": "2025-01-15T10:30:00Z",
  "artifacts": {
    "build_dir": "/path/to/build",
    "files_generated": 15,
    "documentation": ["/path/to/README.md"]
  }
}
```

**Error Responses**:
- `404 Not Found`: Build not found

#### GET /api/v1/builds

List all builds.

**Response** (200 OK):
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "my-project",
    "status": "completed",
    "progress": 100,
    "phases_completed": 5,
    "phases_total": 5,
    "created_at": "2025-01-15T10:30:00Z"
  },
  {
    "id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
    "name": "another-project",
    "status": "running",
    "progress": 40,
    "phases_completed": 2,
    "phases_total": 5,
    "created_at": "2025-01-15T11:00:00Z"
  }
]
```

#### DELETE /api/v1/builds/{build_id}

Cancel a running build.

**Path Parameters**:
- `build_id` (string): Build identifier

**Response** (200 OK):
```json
{
  "status": "cancelled",
  "build_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Error Responses**:
- `400 Bad Request`: Build not found or not running

### Agents

#### GET /api/v1/agents

List all registered agents.

**Response** (200 OK):
```json
{
  "agents": [
    {
      "type": "crawler",
      "status": "idle",
      "capabilities": ["analyze_repo", "scan_templates", "analyze_docs"]
    },
    {
      "type": "ingestion",
      "status": "idle",
      "capabilities": ["parse_blueprint", "process_prompt", "extract_requirements"]
    }
  ],
  "total": 8
}
```

### Blueprints

#### POST /api/v1/blueprints/validate

Validate a blueprint.

**Request Body**:
```json
{
  "name": "my-project",
  "type": "api",
  "description": "My API project",
  "version": "1.0.0",
  "requirements": ["authentication", "database"]
}
```

**Response** (200 OK):
```json
{
  "valid": true,
  "blueprint": {
    "name": "my-project",
    "type": "api",
    "description": "My API project",
    "version": "1.0.0",
    "requirements": ["authentication", "database"]
  },
  "message": "Blueprint is valid"
}
```

## Data Models

### Blueprint

```typescript
{
  name: string;              // Project name
  version: string;           // Version (default: "1.0.0")
  type: ProjectType;         // Project type
  description: string;       // Project description
  requirements: string[];    // List of requirements
  components: Component[];   // List of components
  deployment?: DeploymentConfig;
  testing?: TestingConfig;
  documentation?: DocumentationConfig;
  tags: string[];           // Tags
  author?: string;          // Author name
  license: string;          // License (default: "MIT")
}
```

### ProjectType

```
"microservice" | "web-app" | "cli-tool" | "library" | "api" | 
"mobile-app" | "data-pipeline" | "ml-model" | "infrastructure"
```

### Component

```typescript
{
  name: string;
  type: ComponentType;
  framework?: string;
  language?: string;
  features: string[];
  dependencies: string[];
  config: object;
}
```

### ComponentType

```
"rest-api" | "graphql-api" | "database" | "cache" | 
"message-queue" | "worker" | "frontend" | "backend"
```

### BuildStatus

```typescript
{
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  progress: number;          // 0-100
  phases_completed: number;
  phases_total: number;
  created_at: string;        // ISO 8601
  completed_at?: string;     // ISO 8601
  error?: string;
  artifacts: object;
}
```

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error message",
  "detail": "Detailed error information"
}
```

Common HTTP status codes:
- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

Rate limiting is applied to prevent abuse:
- Default: 100 requests per minute per IP
- Authenticated: 1000 requests per minute per user

## WebSocket Support

WebSocket endpoint for real-time build updates:

```
ws://localhost:8000/ws/builds/{build_id}
```

**Messages**:
```json
{
  "type": "status_update",
  "build_id": "...",
  "status": "running",
  "progress": 60
}
```

## Examples

### Python

```python
import httpx

# Create a build
async with httpx.AsyncClient() as client:
    response = await client.post(
        "http://localhost:8000/api/v1/builds",
        json={
            "prompt": "Create a REST API for user management"
        }
    )
    build = response.json()
    build_id = build["build_id"]

    # Check status
    response = await client.get(
        f"http://localhost:8000/api/v1/builds/{build_id}"
    )
    status = response.json()
    print(f"Status: {status['status']}, Progress: {status['progress']}%")
```

### JavaScript

```javascript
// Create a build
const response = await fetch('http://localhost:8000/api/v1/builds', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Create a REST API for user management'
  })
});

const build = await response.json();
const buildId = build.build_id;

// Check status
const statusResponse = await fetch(
  `http://localhost:8000/api/v1/builds/${buildId}`
);
const status = await statusResponse.json();
console.log(`Status: ${status.status}, Progress: ${status.progress}%`);
```

### cURL

```bash
# Create a build
curl -X POST http://localhost:8000/api/v1/builds \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Create a REST API for user management"}'

# Check status
curl http://localhost:8000/api/v1/builds/{build_id}

# List builds
curl http://localhost:8000/api/v1/builds

# Cancel build
curl -X DELETE http://localhost:8000/api/v1/builds/{build_id}
```

## Interactive Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interfaces allow you to explore and test all endpoints interactively.
