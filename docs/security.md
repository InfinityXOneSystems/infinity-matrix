# Security Best Practices

Infinity Matrix includes enterprise-grade security features by default. This guide covers security best practices for building and deploying applications.

## Secrets Management

### Using the Secrets Manager

Never hardcode secrets in your code or configuration files:

```python
from infinity_matrix.security.secrets import get_secrets_manager

secrets = get_secrets_manager()

# Set a secret
secrets.set("database_password", "super_secret_password")

# Get a secret
db_password = secrets.get("database_password")

# List all secrets (keys only)
secret_keys = secrets.list()

# Delete a secret
secrets.delete("old_api_key")
```

### Environment Variables

For sensitive configuration:

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use .env.example as template
cp .env.example .env
```

### Encryption

All secrets are encrypted at rest using Fernet encryption:

```python
from infinity_matrix.security.secrets import LocalSecretsBackend

# Custom encryption key
backend = LocalSecretsBackend(encryption_key=b"your-key")
```

## Role-Based Access Control (RBAC)

### Managing Roles

```python
from infinity_matrix.security.rbac import get_rbac_manager, Role, Permission

rbac = get_rbac_manager()

# Create custom role
developer_role = Role(
    name="senior_developer",
    description="Senior developer with extended permissions",
    permissions={
        Permission.READ,
        Permission.WRITE,
        Permission.EXECUTE
    }
)
rbac.create_role(developer_role)
```

### Managing Users

```python
from infinity_matrix.security.rbac import User

# Create user
user = User(
    username="john_doe",
    email="john@example.com"
)
rbac.create_user(user)

# Assign roles
rbac.assign_role("john_doe", "developer")
rbac.assign_role("john_doe", "code_reviewer")

# Check permissions
if rbac.has_permission("john_doe", Permission.WRITE):
    # Allow write access
    pass
```

### Built-in Roles

- **admin**: Full access to all resources
- **developer**: Read, write, and execute permissions
- **viewer**: Read-only access

## Audit Logging

### Enable Comprehensive Logging

```python
from infinity_matrix.security.audit import get_audit_logger, AuditAction, AuditLevel

logger = get_audit_logger()

# Log actions
logger.info(
    AuditAction.CREATE,
    user="john_doe",
    resource="api-endpoint",
    details={"endpoint": "/api/users"},
    ip_address="192.168.1.100"
)

logger.warning(
    AuditAction.DELETE,
    user="admin",
    resource="database",
    details={"database": "production"}
)
```

### Query Audit Logs

```python
from datetime import datetime, timedelta

# Query logs
logs = logger.query(
    user="john_doe",
    start_time=datetime.now() - timedelta(days=7),
    limit=100
)

# Get failed actions
failed_logs = logger.query(
    success=False,
    limit=50
)
```

## Authentication

### JWT Authentication

Generated applications include JWT authentication by default:

```python
# In your FastAPI application
from infinity_matrix.modules.auth import JWTAuthProvider

auth = JWTAuthProvider(secret_key="your-secret-key")

# Authenticate user
user_data = auth.authenticate({
    "username": "john_doe",
    "password": "password123"
})

if user_data:
    # Generate token
    token = auth.generate_token(user_data)
    
# Validate token
payload = auth.validate_token(token)
```

## Input Validation

### Use Pydantic Models

All generated applications use Pydantic for input validation:

```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
```

## Encryption

### Data Encryption at Rest

Configure encryption for sensitive data:

```yaml
# config.yaml
security:
  encryption_enabled: true
  encryption_algorithm: "AES-256-GCM"
```

### HTTPS/TLS

Always use HTTPS in production:

```bash
# In your application
uvicorn main:app --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

## Dependency Security

### Scan Dependencies

Regularly scan for vulnerable dependencies:

```bash
# Using agent
infinity-matrix agent enable --type security-scan

# Manual scan
pip-audit  # For Python
npm audit  # For Node.js
```

### Keep Dependencies Updated

Enable auto-update agent:

```bash
infinity-matrix agent enable --type auto-update
infinity-matrix schedule --task "update dependencies" --cron "0 0 * * 0"
```

## Network Security

### Firewall Rules

Configure firewall rules in cloud deployments:

```python
from infinity_matrix.integrations.cloud import DeploymentConfig, CloudProvider

config = DeploymentConfig(
    provider=CloudProvider.AWS,
    region="us-east-1",
    instance_type="t3.medium",
    firewall_rules=[
        {"port": 443, "source": "0.0.0.0/0"},  # HTTPS
        {"port": 22, "source": "10.0.0.0/8"}   # SSH (internal only)
    ]
)
```

## Security Headers

Generated web applications include security headers:

```python
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],  # Don't use "*" in production
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com"]
)
```

## Regular Security Audits

### Automated Security Scanning

```bash
# Enable security scanning agent
infinity-matrix agent enable --type security-scan

# Schedule daily scans
infinity-matrix schedule --task "security scan" --cron "0 2 * * *"
```

### Manual Security Review

Regularly review:
- Access logs
- Failed authentication attempts
- Unusual activity patterns
- Permission changes
- Configuration changes

## Compliance

### GDPR Compliance

Generated applications support GDPR requirements:

```python
# Include data export functionality
@app.get("/api/users/{user_id}/data")
async def export_user_data(user_id: str):
    # Export all user data
    pass

# Include data deletion
@app.delete("/api/users/{user_id}/data")
async def delete_user_data(user_id: str):
    # Delete all user data
    pass
```

## Best Practices Checklist

- [ ] Never commit secrets or credentials
- [ ] Use environment variables for configuration
- [ ] Enable encryption at rest and in transit
- [ ] Implement RBAC for access control
- [ ] Enable comprehensive audit logging
- [ ] Validate all user input
- [ ] Use JWT or OAuth for authentication
- [ ] Scan dependencies regularly
- [ ] Keep all packages updated
- [ ] Use HTTPS/TLS in production
- [ ] Configure security headers
- [ ] Implement rate limiting
- [ ] Use CSP (Content Security Policy)
- [ ] Enable security monitoring
- [ ] Regular security audits

## See Also

- [Getting Started](getting-started.md)
- [Agent Framework](agents.md)
- [API Reference](api-reference.md)
