# API Reference

Complete API reference for Infinity Matrix.

## Core Components

### Configuration

```python
from infinity_matrix.core.config import Config

# Load configuration
config = Config.load()

# Access configuration
api_key = config.ai.api_key
template_dir = config.templates.get_template_dir()

# Save configuration
config.save()
```

### Universal Builder

```python
from infinity_matrix.core.engine.builder import UniversalBuilder

builder = UniversalBuilder(config)

result = builder.build(
    template="python-fastapi-starter",
    params={"app_name": "my-app"},
    output_dir="./output"
)
```

### Vision Cortex

```python
from infinity_matrix.core.ai.cortex import VisionCortex

cortex = VisionCortex(config)

# Analyze prompt
analysis = cortex.analyze_prompt("Build a REST API")

# Select blueprint
template = cortex.select_blueprint(analysis)
```

## Agents

### Agent Registry

```python
from infinity_matrix.agents.registry import (
    Agent, AgentType, AgentStatus, get_registry
)

registry = get_registry()

# Create agent
agent = Agent(
    name="My Agent",
    type=AgentType.CODE_REVIEW,
    config={"check_style": True}
)

# Register agent
registry.register(agent)

# List agents
agents = registry.list(type=AgentType.CODE_REVIEW)

# Update status
registry.update_status(agent.id, AgentStatus.RUNNING)
```

### Task Scheduler

```python
from infinity_matrix.agents.scheduler import (
    ScheduledTask, TaskPriority, get_scheduler
)
from datetime import timedelta

scheduler = get_scheduler()

# Create task
task = ScheduledTask(
    name="Daily Scan",
    interval=timedelta(days=1),
    priority=TaskPriority.HIGH
)

# Schedule task
def handler(task):
    print(f"Running {task.name}")

scheduler.schedule(task, handler)

# Run pending tasks
scheduler.run_pending()
```

## Security

### Secrets Management

```python
from infinity_matrix.security.secrets import get_secrets_manager

secrets = get_secrets_manager()

# Set secret
secrets.set("api_key", "secret_value")

# Get secret
api_key = secrets.get("api_key")

# List secrets
keys = secrets.list()

# Delete secret
secrets.delete("api_key")
```

### RBAC

```python
from infinity_matrix.security.rbac import (
    get_rbac_manager, User, Role, Permission
)

rbac = get_rbac_manager()

# Create user
user = User(username="john", email="john@example.com")
rbac.create_user(user)

# Assign role
rbac.assign_role("john", "developer")

# Check permission
if rbac.has_permission("john", Permission.WRITE):
    # Allow access
    pass
```

### Audit Logging

```python
from infinity_matrix.security.audit import (
    get_audit_logger, AuditAction, AuditLevel
)

logger = get_audit_logger()

# Log action
logger.info(
    AuditAction.CREATE,
    user="john",
    resource="api-endpoint",
    details={"endpoint": "/api/users"}
)

# Query logs
logs = logger.query(user="john", limit=100)
```

## Integrations

### Cloud Integration

```python
from infinity_matrix.integrations.cloud import (
    CloudProvider, DeploymentConfig, get_cloud_integration
)

cloud = get_cloud_integration(CloudProvider.AWS)

config = DeploymentConfig(
    provider=CloudProvider.AWS,
    region="us-east-1",
    instance_type="t3.medium",
    auto_scaling=True
)

deployment = cloud.deploy(config)
```

### CI/CD Integration

```python
from infinity_matrix.integrations.cicd import (
    CICDPlatform, PipelineConfig, PipelineStep, get_cicd_integration
)

cicd = get_cicd_integration(CICDPlatform.GITHUB_ACTIONS)

pipeline = PipelineConfig(
    name="CI Pipeline",
    platform=CICDPlatform.GITHUB_ACTIONS,
    steps=[
        PipelineStep(
            name="Test",
            script=["pytest tests/"]
        )
    ]
)

workflow = cicd.generate_config(pipeline)
```

### Manus.im Integration

```python
from infinity_matrix.integrations.manus import (
    get_manus_integration, Workflow, WorkflowStep
)

manus = get_manus_integration()

workflow = Workflow(
    id="workflow-1",
    name="Deploy Workflow",
    steps=[
        WorkflowStep(
            id="build",
            name="Build",
            type="build",
            config={}
        )
    ]
)

manus.create_workflow(workflow)
```

## Modules

### Authentication

```python
from infinity_matrix.modules.auth import JWTAuthProvider

auth = JWTAuthProvider(secret_key="secret")

# Authenticate
user_data = auth.authenticate({
    "username": "john",
    "password": "password"
})

# Generate token
token = auth.generate_token(user_data)

# Validate token
payload = auth.validate_token(token)
```

### Database

```python
from infinity_matrix.modules.database import SQLAlchemyProvider

db = SQLAlchemyProvider("postgresql://...")

db.connect()

results = db.fetch_all(
    "SELECT * FROM users WHERE active = :active",
    {"active": True}
)

db.disconnect()
```

### API

```python
from infinity_matrix.modules.api import (
    FastAPIGenerator, Endpoint, HTTPMethod
)

generator = FastAPIGenerator()

endpoint = Endpoint(
    path="/api/users",
    method=HTTPMethod.GET,
    handler="list_users",
    auth_required=True
)

code = generator.generate_endpoint(endpoint)
```

## CLI Commands

### Initialize

```bash
infinity-matrix init
```

### Create Application

```bash
# From prompt
infinity-matrix create "Build a REST API"

# From template
infinity-matrix create --template python-fastapi-starter \
  --param app_name=my-api \
  --param database=postgresql

# Interactive mode
infinity-matrix create --interactive
```

### Manage Templates

```bash
# List templates
infinity-matrix templates list
```

### Manage Agents

```bash
# Enable agent
infinity-matrix agent enable --type code-review

# Schedule task
infinity-matrix schedule --task "security scan" --cron "0 2 * * *"

# Monitor with auto-healing
infinity-matrix monitor --auto-heal
```

### Deploy

```bash
infinity-matrix deploy --environment production
```

## Type Definitions

### Config

```python
class Config:
    version: str
    ai: AIConfig
    security: SecurityConfig
    agents: AgentConfig
    templates: TemplateConfig
```

### PromptAnalysis

```python
class PromptAnalysis:
    intent: str
    requirements: List[Requirement]
    suggested_stack: List[str]
    suggested_modules: List[str]
    complexity: str
    estimated_time: str
```

### Agent

```python
class Agent:
    id: str
    name: str
    type: AgentType
    status: AgentStatus
    config: Dict[str, Any]
    created_at: datetime
    updated_at: datetime
```

### ScheduledTask

```python
class ScheduledTask:
    id: str
    name: str
    description: Optional[str]
    cron_expression: Optional[str]
    interval: Optional[timedelta]
    priority: TaskPriority
    status: TaskStatus
```

## Error Handling

All methods return dictionaries with status information:

```python
result = builder.build(...)

if result["success"]:
    print(result["output_path"])
else:
    print(result["error"])
```

## See Also

- [Getting Started](getting-started.md)
- [Template Development](templates.md)
- [Agent Framework](agents.md)
- [Security Best Practices](security.md)
