# Agent Invocation Guide

## Overview

This guide provides detailed examples of how to invoke and interact with agents in the Infinity Matrix system.

## Basic Invocation

### Python API

```python
from infinity_matrix.agents import AgentManager

# Initialize agent manager
manager = AgentManager()

# Create and start an agent
agent = await manager.create_agent(
    agent_type="agent-health-monitor",
    config={
        "interval": 30,
        "services": ["api", "database", "redis"]
    }
)

# Start the agent
await agent.start()

# Wait for completion
result = await agent.wait()

print(f"Status: {result.status}")
print(f"Output: {result.output}")
```

### REST API

```bash
# Create agent instance
curl -X POST https://api.infinity-matrix.io/api/v1/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "agent-health-monitor",
    "config": {
      "interval": 30,
      "services": ["api", "database", "redis"]
    }
  }'

# Response: {"agent_id": "agent-123"}

# Start agent
curl -X POST https://api.infinity-matrix.io/api/v1/agents/agent-123/start \
  -H "Authorization: Bearer $TOKEN"

# Check status
curl -X GET https://api.infinity-matrix.io/api/v1/agents/agent-123/status \
  -H "Authorization: Bearer $TOKEN"
```

### CLI

```bash
# Create and start agent
infinity-matrix agent create \
  --type agent-health-monitor \
  --config config.yaml \
  --start

# List running agents
infinity-matrix agent list --status running

# Stop agent
infinity-matrix agent stop agent-123
```

## Agent-Specific Examples

### Health Monitor Agent

```python
from agents import HealthMonitorAgent

agent = HealthMonitorAgent(config={
    "interval": 30,
    "services": ["api", "database", "redis"],
    "thresholds": {
        "cpu_usage": 80,
        "memory_usage": 85,
        "response_time": 1000
    }
})

result = await agent.run()

# Check results
for service, status in result.services.items():
    print(f"{service}: {status['status']}")
```

### ETL Pipeline Agent

```python
from agents import ETLPipelineAgent

agent = ETLPipelineAgent(config={
    "source": {
        "type": "postgresql",
        "connection": "postgresql://user:pass@host/db",
        "query": "SELECT * FROM users WHERE updated_at > :last_run"
    },
    "transformations": [
        {"type": "clean", "fields": ["email", "phone"]},
        {"type": "validate", "schema": "user_schema.json"},
        {"type": "enrich", "service": "geo_location"}
    ],
    "destination": {
        "type": "s3",
        "bucket": "processed-data",
        "format": "parquet",
        "partition_by": "date"
    }
})

result = await agent.execute()

print(f"Processed: {result.records_count} records")
print(f"Duration: {result.duration}s")
print(f"Output: {result.output_location}")
```

### Data Validation Agent

```python
from agents import DataValidationAgent

agent = DataValidationAgent(config={
    "data_source": "s3://bucket/data/",
    "validation_rules": [
        {
            "field": "email",
            "type": "email_format",
            "required": True
        },
        {
            "field": "age",
            "type": "range",
            "min": 0,
            "max": 150
        },
        {
            "field": "status",
            "type": "enum",
            "values": ["active", "inactive", "pending"]
        }
    ],
    "on_failure": "report"  # or "reject", "fix"
})

result = await agent.validate()

print(f"Total: {result.total_records}")
print(f"Valid: {result.valid_records}")
print(f"Invalid: {result.invalid_records}")
print(f"Validation rate: {result.validation_rate}%")
```

## Advanced Invocation Patterns

### Batch Processing

```python
# Process multiple items with same agent
from agents import BatchProcessor

processor = BatchProcessor(
    agent_type="agent-data-processor",
    batch_size=100,
    parallel=True,
    max_workers=10
)

items = load_items()  # Load items to process

results = await processor.process(items)

for item, result in zip(items, results):
    print(f"Item {item.id}: {result.status}")
```

### Agent Chaining

```python
# Chain multiple agents together
from agents import AgentChain

chain = AgentChain([
    {"agent": "agent-extractor", "config": {...}},
    {"agent": "agent-transformer", "config": {...}},
    {"agent": "agent-validator", "config": {...}},
    {"agent": "agent-loader", "config": {...}}
])

result = await chain.execute(input_data)
```

### Conditional Execution

```python
# Execute agent based on condition
from agents import ConditionalAgent

agent = ConditionalAgent(
    condition=lambda data: data["size"] > 1000,
    if_true={"agent": "agent-batch-processor"},
    if_false={"agent": "agent-simple-processor"}
)

result = await agent.execute(data)
```

## Configuration Best Practices

### Environment Variables

```python
import os

agent = Agent(config={
    "database_url": os.getenv("DATABASE_URL"),
    "api_key": os.getenv("API_KEY"),
    "timeout": int(os.getenv("TIMEOUT", "300"))
})
```

### Configuration Files

```yaml
# config.yaml
agent:
  type: agent-etl-pipeline
  config:
    source:
      type: postgresql
      connection: ${DATABASE_URL}
    transformations:
      - type: clean
      - type: validate
    destination:
      type: s3
      bucket: ${S3_BUCKET}
```

```python
import yaml

with open("config.yaml") as f:
    config = yaml.safe_load(f)

agent = create_agent_from_config(config)
```

## Error Handling

### Retry Logic

```python
from agents import Agent, RetryConfig

agent = Agent(
    agent_type="agent-processor",
    retry_config=RetryConfig(
        max_attempts=3,
        backoff_strategy="exponential",
        max_backoff=300,
        retry_on=[TimeoutError, ConnectionError]
    )
)
```

### Error Callbacks

```python
def on_error(error):
    print(f"Agent failed: {error}")
    # Send notification, log error, etc.

agent = Agent(
    agent_type="agent-processor",
    on_error=on_error
)
```

## Monitoring and Logging

### Enable Detailed Logging

```python
import logging

logging.basicConfig(level=logging.DEBUG)

agent = Agent(
    agent_type="agent-processor",
    log_level="DEBUG"
)
```

### Custom Metrics

```python
from agents import Agent, MetricsCollector

metrics = MetricsCollector()

agent = Agent(
    agent_type="agent-processor",
    metrics_collector=metrics
)

result = await agent.execute()

print(f"Execution time: {metrics.get('execution_time')}")
print(f"Memory used: {metrics.get('memory_usage')}")
```

## Testing

### Unit Testing Agents

```python
import pytest
from agents import DataValidationAgent

@pytest.mark.asyncio
async def test_validation_agent():
    agent = DataValidationAgent(config={
        "validation_rules": [
            {"field": "email", "type": "email_format"}
        ]
    })
    
    result = await agent.validate({
        "email": "test@example.com"
    })
    
    assert result.valid == True
```

### Integration Testing

```python
@pytest.mark.asyncio
async def test_workflow_with_agents():
    workflow = Workflow(name="test-workflow")
    
    workflow.add_task(Task(
        id="extract",
        agent="agent-extractor"
    ))
    
    result = await workflow.execute()
    
    assert result.status == "completed"
```

## Related Documentation

- [Agent Registry](REGISTRY.md)
- [Agent Workflows](WORKFLOWS.md)
- [API Documentation](../api/README.md)

---

**Last Updated**: 2025-12-31  
**Maintained By**: Engineering Team
