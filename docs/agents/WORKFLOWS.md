# Agent Workflows Guide

## Overview

This guide explains how to work with agent workflows in the Infinity Matrix system, including creation, execution, monitoring, and troubleshooting.

## Workflow Concepts

### What is a Workflow?

A workflow is a coordinated sequence of agent tasks that accomplish a business objective. Workflows can:
- Execute tasks in sequence or parallel
- Handle dependencies between tasks
- Manage errors and retries
- Provide status tracking and logging

### Workflow Components

1. **Tasks**: Individual units of work executed by agents
2. **Dependencies**: Relationships between tasks
3. **Configuration**: Parameters and settings for execution
4. **Triggers**: Events that start workflow execution
5. **Outputs**: Results and artifacts produced

## Creating Workflows

### Simple Sequential Workflow

```python
from infinity_matrix.workflow import Workflow, Task

workflow = Workflow(name="data-processing")

# Define tasks
extract = Task(
    id="extract",
    agent="agent-etl-pipeline",
    config={"source": "database", "query": "SELECT * FROM users"}
)

transform = Task(
    id="transform",
    agent="agent-data-transformer",
    depends_on=["extract"]
)

load = Task(
    id="load",
    agent="agent-data-loader",
    depends_on=["transform"],
    config={"destination": "warehouse"}
)

# Add tasks to workflow
workflow.add_tasks([extract, transform, load])

# Execute workflow
result = await workflow.execute()
```

### Parallel Execution

```python
workflow = Workflow(name="parallel-processing")

# These tasks run in parallel
task1 = Task(id="process-a", agent="agent-processor")
task2 = Task(id="process-b", agent="agent-processor")
task3 = Task(id="process-c", agent="agent-processor")

# This task waits for all parallel tasks
aggregate = Task(
    id="aggregate",
    agent="agent-aggregator",
    depends_on=["process-a", "process-b", "process-c"]
)

workflow.add_tasks([task1, task2, task3, aggregate])
```

### Conditional Execution

```python
workflow = Workflow(name="conditional-workflow")

validate = Task(id="validate", agent="agent-validator")

# Execute based on validation result
process_success = Task(
    id="process-success",
    agent="agent-processor",
    depends_on=["validate"],
    condition="validate.result == 'valid'"
)

handle_failure = Task(
    id="handle-failure",
    agent="agent-error-handler",
    depends_on=["validate"],
    condition="validate.result == 'invalid'"
)

workflow.add_tasks([validate, process_success, handle_failure])
```

## Workflow Execution

### Synchronous Execution

```python
# Wait for completion
result = await workflow.execute()
print(f"Status: {result.status}")
print(f"Duration: {result.duration}")
```

### Asynchronous Execution

```python
# Start workflow and continue
execution_id = await workflow.start()

# Check status later
status = await workflow.get_status(execution_id)

# Wait for completion
result = await workflow.wait(execution_id)
```

### Scheduled Execution

```python
# Schedule for later
workflow.schedule(
    cron="0 2 * * *",  # Daily at 2 AM
    timezone="UTC"
)

# One-time delayed execution
workflow.schedule(
    run_at=datetime(2025, 12, 31, 12, 0, 0)
)
```

## Error Handling

### Retry Configuration

```python
task = Task(
    id="process",
    agent="agent-processor",
    retry_config={
        "max_attempts": 3,
        "backoff": "exponential",
        "max_delay": 300
    }
)
```

### Error Callbacks

```python
workflow = Workflow(name="resilient-workflow")

workflow.on_error = lambda error: {
    "action": "notify",
    "recipients": ["ops-team@example.com"]
}

workflow.on_task_failure = lambda task, error: {
    "action": "retry",
    "max_attempts": 3
}
```

## Monitoring Workflows

### Status Tracking

```python
# Get execution status
status = await workflow.get_status(execution_id)

print(f"Status: {status.state}")  # running, completed, failed
print(f"Progress: {status.progress}%")
print(f"Current Task: {status.current_task}")
```

### Real-time Updates

```python
# Subscribe to status updates
async for update in workflow.stream_status(execution_id):
    print(f"Task {update.task_id}: {update.status}")
```

### Metrics and Logs

```python
# Get execution metrics
metrics = await workflow.get_metrics(execution_id)

# Get execution logs
logs = await workflow.get_logs(execution_id)
```

## Workflow Patterns

### Fan-out / Fan-in

```python
# One task triggers multiple parallel tasks
trigger = Task(id="trigger", agent="agent-trigger")

# Parallel processing
workers = [
    Task(id=f"worker-{i}", agent="agent-worker", depends_on=["trigger"])
    for i in range(10)
]

# Aggregate results
collect = Task(
    id="collect",
    agent="agent-collector",
    depends_on=[w.id for w in workers]
)
```

### Pipeline Pattern

```python
# Sequential processing pipeline
stages = ["extract", "validate", "transform", "enrich", "load"]

tasks = []
for i, stage in enumerate(stages):
    task = Task(
        id=stage,
        agent=f"agent-{stage}",
        depends_on=[stages[i-1]] if i > 0 else []
    )
    tasks.append(task)

workflow.add_tasks(tasks)
```

### Saga Pattern

```python
# Each task has a compensation task
workflow = Workflow(name="saga-workflow")

# Forward tasks
book_flight = Task(id="book-flight", agent="agent-booking")
book_hotel = Task(id="book-hotel", agent="agent-booking", depends_on=["book-flight"])
charge_card = Task(id="charge", agent="agent-payment", depends_on=["book-hotel"])

# Compensation tasks (executed on failure)
workflow.on_failure = [
    Task(id="cancel-hotel", agent="agent-cancellation"),
    Task(id="cancel-flight", agent="agent-cancellation")
]
```

## Best Practices

1. **Keep Workflows Simple**: Break complex workflows into smaller ones
2. **Use Meaningful Names**: Clear task and workflow names
3. **Handle Errors**: Always configure error handling
4. **Monitor Execution**: Track workflow progress and metrics
5. **Test Thoroughly**: Test workflows before production use
6. **Document Workflows**: Include purpose and usage documentation
7. **Version Workflows**: Track workflow changes
8. **Set Timeouts**: Prevent infinite execution
9. **Use Retries**: Configure appropriate retry logic
10. **Log Important Events**: Enable comprehensive logging

## Examples

Complete examples available in:
- `.prooftest/demos/agent_workflow_demo.py`
- `examples/workflows/`

## Troubleshooting

See [Error Handling Guide](ERROR_HANDLING.md) for common issues and solutions.

## Related Documentation

- [Agent Registry](REGISTRY.md)
- [Agent Invocation](INVOCATION.md)
- [Error Handling](../guides/ERROR_HANDLING.md)

---

**Last Updated**: 2025-12-31  
**Maintained By**: Engineering Team
