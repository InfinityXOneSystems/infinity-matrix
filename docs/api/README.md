# API Documentation

## Overview

Welcome to the Infinity Matrix API documentation. This section provides comprehensive documentation for all API endpoints, including auto-generated reference documentation for Python and TypeScript components.

## Documentation Structure

```
api/
├── README.md           # This file - API overview
├── REST_API.md         # REST API documentation
├── python/             # Python API documentation (Sphinx)
│   ├── conf.py
│   ├── index.rst
│   └── _build/html/    # Generated HTML docs
└── typescript/         # TypeScript API documentation (TypeDoc)
    └── index.html      # Generated HTML docs
```

## API Overview

### Base URL

**Development**: `http://localhost:8000/api/v1`  
**Staging**: `https://staging-api.infinity-matrix.io/api/v1`  
**Production**: `https://api.infinity-matrix.io/api/v1`

### Authentication

All API requests require authentication using JWT tokens:

```bash
# Login to get token
curl -X POST https://api.infinity-matrix.io/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in requests
curl -X GET https://api.infinity-matrix.io/api/v1/users/me \
  -H "Authorization: Bearer <your-token>"
```

### Response Format

All responses follow a consistent JSON structure:

**Success Response**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  },
  "message": "Success"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## API Categories

### Authentication & Authorization
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/register` - User registration (if enabled)
- `POST /auth/reset-password` - Password reset

### User Management
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user (admin)
- `DELETE /users/{id}` - Delete user (admin)

### Agent Management
- `GET /agents` - List all agents
- `GET /agents/{id}` - Get agent details
- `POST /agents` - Create agent instance
- `PUT /agents/{id}` - Update agent
- `DELETE /agents/{id}` - Delete agent
- `POST /agents/{id}/start` - Start agent
- `POST /agents/{id}/stop` - Stop agent

### Workflow Management
- `GET /workflows` - List workflows
- `GET /workflows/{id}` - Get workflow details
- `POST /workflows` - Create workflow
- `PUT /workflows/{id}` - Update workflow
- `DELETE /workflows/{id}` - Delete workflow
- `POST /workflows/{id}/execute` - Execute workflow
- `GET /workflows/{id}/status` - Get execution status

### System Operations
- `GET /health` - System health check
- `GET /metrics` - System metrics
- `GET /status` - System status
- `GET /version` - API version

## Interactive Documentation

### Swagger/OpenAPI

Interactive API documentation is available at:

**Development**: http://localhost:8000/docs  
**Production**: https://api.infinity-matrix.io/docs

Features:
- Try API endpoints directly
- View request/response schemas
- Test with authentication
- Download OpenAPI specification

### ReDoc

Alternative API documentation:

**Development**: http://localhost:8000/redoc  
**Production**: https://api.infinity-matrix.io/redoc

## Language-Specific Documentation

### Python API Reference

Auto-generated Python API documentation using Sphinx:

- **Location**: `docs/api/python/_build/html/index.html`
- **Generation**: Automated on every commit via CI/CD
- **Source**: Python docstrings and type hints

**Modules documented**:
- `app.core` - Core business logic
- `app.agents` - Agent implementations
- `app.api` - API endpoints
- `app.db` - Database models and operations
- `app.utils` - Utility functions

**View locally**:
```bash
cd docs/api/python
make html
open _build/html/index.html
```

### TypeScript API Reference

Auto-generated TypeScript API documentation using TypeDoc:

- **Location**: `docs/api/typescript/index.html`
- **Generation**: Automated on every commit via CI/CD
- **Source**: TypeScript interfaces and JSDoc comments

**Modules documented**:
- `frontend/src/api` - API client
- `frontend/src/components` - React components
- `frontend/src/hooks` - Custom hooks
- `frontend/src/utils` - Utility functions

**View locally**:
```bash
npm install -g typedoc
typedoc
open docs/api/typescript/index.html
```

## Rate Limiting

API requests are rate-limited to ensure fair usage:

| User Type | Rate Limit | Burst |
|-----------|------------|-------|
| Anonymous | 10 req/min | 20 |
| Authenticated | 100 req/min | 200 |
| Premium | 1000 req/min | 2000 |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Versioning

API versioning strategy:
- **Version format**: `v{major}`
- **Current version**: `v1`
- **Deprecation policy**: 6 months notice
- **Support policy**: Previous version supported for 12 months

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `SUCCESS` | 200 | Request successful |
| `CREATED` | 201 | Resource created |
| `NO_CONTENT` | 204 | Success, no content |
| `BAD_REQUEST` | 400 | Invalid request |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Input validation failed |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

## Pagination

List endpoints support pagination:

```bash
GET /api/v1/users?page=1&per_page=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Filtering & Sorting

### Filtering

```bash
# Filter by status
GET /api/v1/workflows?status=running

# Multiple filters
GET /api/v1/workflows?status=running&created_after=2025-01-01
```

### Sorting

```bash
# Sort by created date
GET /api/v1/workflows?sort=created_at

# Sort descending
GET /api/v1/workflows?sort=-created_at

# Multiple sort fields
GET /api/v1/workflows?sort=-created_at,name
```

## Webhooks

Subscribe to events via webhooks:

```bash
POST /api/v1/webhooks
{
  "url": "https://your-app.com/webhook",
  "events": ["workflow.completed", "agent.failed"],
  "secret": "your-webhook-secret"
}
```

Available events:
- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `agent.started`
- `agent.stopped`
- `agent.failed`

## Client Libraries

### Python Client

```python
from infinity_matrix import Client

client = Client(
    base_url="https://api.infinity-matrix.io",
    api_key="your-api-key"
)

# List workflows
workflows = client.workflows.list()

# Execute workflow
result = client.workflows.execute(workflow_id="123")
```

### JavaScript/TypeScript Client

```typescript
import { InfinityMatrixClient } from '@infinity-matrix/client';

const client = new InfinityMatrixClient({
  baseURL: 'https://api.infinity-matrix.io',
  apiKey: 'your-api-key'
});

// List workflows
const workflows = await client.workflows.list();

// Execute workflow
const result = await client.workflows.execute('123');
```

### cURL Examples

See [REST_API.md](REST_API.md) for complete cURL examples.

## Code Generation

Generate client code from OpenAPI spec:

```bash
# Download OpenAPI spec
curl https://api.infinity-matrix.io/openapi.json > openapi.json

# Generate Python client
openapi-generator-cli generate \
  -i openapi.json \
  -g python \
  -o client/python

# Generate TypeScript client
openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o client/typescript
```

## Testing

### API Testing

```bash
# Run API tests
pytest tests/api/

# Run with coverage
pytest tests/api/ --cov=app.api
```

### Load Testing

```bash
# Install k6
brew install k6  # macOS

# Run load test
k6 run tests/load/api_load_test.js
```

## Monitoring

API metrics available at:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

Key metrics:
- Request rate
- Response time (p50, p95, p99)
- Error rate
- Active connections

## Support

### Getting Help

- **Documentation**: This guide
- **Interactive Docs**: https://api.infinity-matrix.io/docs
- **GitHub Issues**: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- **Email**: api-support@infinityxone.systems

### Report Issues

When reporting API issues, include:
- Request method and endpoint
- Request headers and body
- Response status and body
- Timestamp
- Request ID (from `X-Request-ID` header)

## Changelog

See [API Changelog](../reports/API_CHANGELOG.md) for version history and changes.

## Related Documentation

- [REST API Details](REST_API.md)
- [Python API Reference](python/_build/html/index.html)
- [TypeScript API Reference](typescript/index.html)
- [Architecture Overview](../architecture/README.md)

---

**API Version**: 1.0.0  
**Last Updated**: 2025-12-31  
**Maintained By**: API Team
