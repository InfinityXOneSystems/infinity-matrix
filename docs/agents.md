# Agent Framework Guide

The Agent Framework provides autonomous agents for automated tasks, monitoring, and self-healing capabilities.

## Overview

Agents are autonomous processes that can:
- Monitor applications and infrastructure
- Perform automated tasks on schedule
- Self-heal issues automatically
- Review and improve code
- Update dependencies
- Generate documentation
- Deploy applications

## Agent Types

### Code Review Agent

Automatically reviews code changes for:
- Style compliance
- Security vulnerabilities
- Performance issues
- Best practice violations

```python
from infinity_matrix.agents.registry import Agent, AgentType, get_registry

agent = Agent(
    name="Code Review Agent",
    type=AgentType.CODE_REVIEW,
    config={
        "check_style": True,
        "check_security": True,
        "check_performance": True
    }
)

registry = get_registry()
registry.register(agent)
```

### Auto-Update Agent

Automatically updates:
- Dependencies
- Security patches
- Documentation
- CI/CD configs

```python
agent = Agent(
    name="Auto Update Agent",
    type=AgentType.AUTO_UPDATE,
    config={
        "update_dependencies": True,
        "update_security_patches": True,
        "auto_pr": True
    }
)
```

### Monitoring Agent

Monitors applications for:
- Performance metrics
- Error rates
- Resource usage
- Health checks

```python
agent = Agent(
    name="Monitoring Agent",
    type=AgentType.MONITORING,
    config={
        "check_interval": 60,  # seconds
        "alert_threshold": 0.8,
        "auto_heal": True
    }
)
```

### Security Scan Agent

Scans for:
- Dependency vulnerabilities
- Code security issues
- Configuration problems
- Compliance violations

```python
agent = Agent(
    name="Security Scanner",
    type=AgentType.SECURITY_SCAN,
    config={
        "scan_dependencies": True,
        "scan_code": True,
        "scan_configs": True
    }
)
```

## Scheduler

Schedule automated tasks with the agent scheduler:

```python
from datetime import timedelta
from infinity_matrix.agents.scheduler import ScheduledTask, TaskPriority, get_scheduler

scheduler = get_scheduler()

# Schedule daily task
task = ScheduledTask(
    name="Daily Security Scan",
    description="Scan for security vulnerabilities",
    interval=timedelta(days=1),
    priority=TaskPriority.HIGH
)

def security_scan_handler(task):
    # Implement security scan logic
    print(f"Running security scan: {task.name}")

scheduler.schedule(task, security_scan_handler)
```

### Cron-Style Scheduling

Schedule tasks with cron expressions:

```python
task = ScheduledTask(
    name="Weekly Dependency Update",
    description="Update project dependencies",
    cron_expression="0 0 * * 0",  # Every Sunday at midnight
    priority=TaskPriority.MEDIUM
)
```

## Agent Registry

The agent registry manages all agents:

```python
from infinity_matrix.agents.registry import get_registry, AgentStatus

registry = get_registry()

# List all agents
agents = registry.list()

# Filter by type
code_review_agents = registry.list(type=AgentType.CODE_REVIEW)

# Filter by status
active_agents = registry.list(status=AgentStatus.RUNNING)

# Get specific agent
agent = registry.get(agent_id)

# Update agent status
registry.update_status(agent_id, AgentStatus.RUNNING)
```

## Self-Healing

Enable self-healing capabilities:

```bash
infinity-matrix monitor --auto-heal
```

Or programmatically:

```python
from infinity_matrix.agents.registry import Agent, AgentType

agent = Agent(
    name="Self-Healing Agent",
    type=AgentType.MONITORING,
    config={
        "auto_heal": True,
        "healing_strategies": [
            "restart_on_failure",
            "rollback_on_error",
            "scale_on_load"
        ]
    }
)
```

## Agent Orchestration

Coordinate multiple agents:

```python
from infinity_matrix.agents.orchestrator import AgentOrchestrator

orchestrator = AgentOrchestrator()

# Add agents to orchestration
orchestrator.add_agent(code_review_agent)
orchestrator.add_agent(security_agent)
orchestrator.add_agent(monitoring_agent)

# Execute coordinated workflow
orchestrator.execute_workflow({
    "name": "CI/CD Pipeline",
    "steps": [
        {"agent": "code_review", "action": "review"},
        {"agent": "security", "action": "scan"},
        {"agent": "monitoring", "action": "check_health"}
    ]
})
```

## Integration with AI

Agents can use AI for intelligent decision-making:

```python
agent = Agent(
    name="AI-Powered Code Reviewer",
    type=AgentType.CODE_REVIEW,
    config={
        "use_ai": True,
        "ai_provider": "openai",
        "ai_model": "gpt-4",
        "suggest_improvements": True
    }
)
```

## Best Practices

1. **Start Simple**: Begin with basic monitoring agents
2. **Test Thoroughly**: Test agents in non-production first
3. **Monitor Agents**: Monitor the agents themselves
4. **Set Limits**: Configure rate limits and timeouts
5. **Log Everything**: Enable comprehensive logging
6. **Gradual Rollout**: Enable auto-healing gradually

## Examples

See [examples/agents_example.py](../examples/agents_example.py) for complete examples.

## See Also

- [Getting Started](getting-started.md)
- [Security Best Practices](security.md)
- [API Reference](api-reference.md)
