"""
Example: Using Agents for Automated Tasks
"""

from datetime import timedelta

from infinity_matrix.agents.registry import Agent, AgentType, get_registry
from infinity_matrix.agents.scheduler import ScheduledTask, TaskPriority, get_scheduler


def code_review_handler(task):
    """Handler for code review task."""
    print(f"Running code review: {task.name}")
    # Implement code review logic here
    print("Code review completed!")


def dependency_update_handler(task):
    """Handler for dependency update task."""
    print(f"Updating dependencies: {task.name}")
    # Implement dependency update logic here
    print("Dependencies updated!")


def main():
    """Example of using agents and scheduler."""

    # Get registry and scheduler
    registry = get_registry()
    scheduler = get_scheduler()

    # Create and register agents
    code_review_agent = Agent(
        name="Code Review Agent",
        type=AgentType.CODE_REVIEW,
        config={
            "check_style": True,
            "check_security": True,
            "check_performance": True
        }
    )

    security_agent = Agent(
        name="Security Scanner",
        type=AgentType.SECURITY_SCAN,
        config={
            "scan_dependencies": True,
            "scan_code": True
        }
    )

    registry.register(code_review_agent)
    registry.register(security_agent)

    print(f"Registered {len(registry.list())} agents")

    # Schedule automated tasks
    code_review_task = ScheduledTask(
        name="Daily Code Review",
        description="Review code changes",
        interval=timedelta(days=1),
        priority=TaskPriority.HIGH
    )

    dependency_task = ScheduledTask(
        name="Weekly Dependency Update",
        description="Update project dependencies",
        interval=timedelta(weeks=1),
        priority=TaskPriority.MEDIUM
    )

    scheduler.schedule(code_review_task, code_review_handler)
    scheduler.schedule(dependency_task, dependency_update_handler)

    print(f"Scheduled {len(scheduler.list())} tasks")

    # list all agents
    print("\n=== Registered Agents ===")
    for agent in registry.list():
        print(f"- {agent.name} ({agent.type.value}): {agent.status.value}")

    # list all scheduled tasks
    print("\n=== Scheduled Tasks ===")
    for task in scheduler.list():
        print(f"- {task.name}: {task.status.value}")
        if task.next_run:
            print(f"  Next run: {task.next_run}")

    # Simulate running pending tasks
    print("\n=== Running Pending Tasks ===")
    executed = scheduler.run_pending()
    print(f"Executed {len(executed)} tasks")


if __name__ == "__main__":
    main()
