"""
Infinity Matrix Auto-Builder - Example Usage

This file demonstrates how to use the auto-builder programmatically.
"""

import asyncio

from infinity_matrix import AutoBuilder, Blueprint
from infinity_matrix.core.blueprint import Component, ComponentType, ProjectType


async def example_build_from_prompt():
    """Example: Build from a natural language prompt."""
    print("=" * 60)
    print("Example 1: Building from a prompt")
    print("=" * 60)

    builder = AutoBuilder()

    # Simple prompt
    build_status = await builder.build(
        prompt="Create a REST API for user management with authentication"
    )

    print(f"Build ID: {build_status.id}")
    print(f"Status: {build_status.status}")
    print(f"Name: {build_status.name}")


async def example_build_from_blueprint():
    """Example: Build from a Blueprint object."""
    print("\n" + "=" * 60)
    print("Example 2: Building from a Blueprint object")
    print("=" * 60)

    builder = AutoBuilder()

    # Create a detailed blueprint
    blueprint = Blueprint(
        name="todo-api",
        version="1.0.0",
        type=ProjectType.API,
        description="Simple TODO list REST API with SQLite",
        requirements=["database", "rest-api", "authentication"],
        components=[
            Component(
                name="todo-api",
                type=ComponentType.REST_API,
                framework="fastapi",
                language="python",
                features=["crud-operations", "jwt-auth"],
            )
        ],
    )

    build_status = await builder.build(blueprint=blueprint)

    print(f"Build ID: {build_status.id}")
    print(f"Status: {build_status.status}")
    print(f"Name: {build_status.name}")


async def example_monitor_build():
    """Example: Create and monitor a build."""
    print("\n" + "=" * 60)
    print("Example 3: Monitoring a build")
    print("=" * 60)

    builder = AutoBuilder()

    # Start a build
    build_status = await builder.build(
        prompt="Create a Python CLI tool for file processing"
    )

    build_id = build_status.id
    print(f"Started build: {build_id}")

    # Monitor progress
    for _ in range(5):
        await asyncio.sleep(1)
        status = await builder.get_build_status(build_id)
        if status:
            print(f"Progress: {status.progress}% - Status: {status.status}")
            if status.status in ["completed", "failed"]:
                break


async def example_list_builds():
    """Example: list all builds."""
    print("\n" + "=" * 60)
    print("Example 4: Listing all builds")
    print("=" * 60)

    builder = AutoBuilder()

    builds = await builder.list_builds()

    print(f"Total builds: {len(builds)}")
    for build in builds:
        print(f"  - {build.id[:8]}... | {build.name} | {build.status}")


async def example_vision_cortex_agents():
    """Example: Interact with Vision Cortex and agents."""
    print("\n" + "=" * 60)
    print("Example 5: Vision Cortex and Agents")
    print("=" * 60)

    builder = AutoBuilder()
    vision_cortex = builder.get_vision_cortex()

    # list all agents
    agents = vision_cortex.list_agents()
    print(f"Registered agents: {len(agents)}")
    for agent in agents:
        print(f"  - {agent['type']}: {agent['status']}")
        print(f"    Capabilities: {', '.join(agent['capabilities'])}")


async def example_custom_blueprint():
    """Example: Create a complex custom blueprint."""
    print("\n" + "=" * 60)
    print("Example 6: Complex custom blueprint")
    print("=" * 60)

    from infinity_matrix.core.blueprint import (
        DeploymentConfig,
        DeploymentPlatform,
        DocumentationConfig,
        Environment,
        TestingConfig,
    )

    blueprint = Blueprint(
        name="ecommerce-platform",
        version="2.0.0",
        type=ProjectType.WEB_APP,
        description="Full-featured e-commerce platform",
        requirements=[
            "user-authentication",
            "product-catalog",
            "shopping-cart",
            "payment-processing",
            "order-management",
        ],
        components=[
            Component(
                name="frontend",
                type=ComponentType.FRONTEND,
                framework="react",
                language="typescript",
                features=["responsive-design", "pwa", "seo"],
            ),
            Component(
                name="backend-api",
                type=ComponentType.REST_API,
                framework="fastapi",
                language="python",
                features=["graphql", "websockets", "caching"],
            ),
            Component(
                name="database",
                type=ComponentType.DATABASE,
                framework="postgresql",
                features=["sharding", "replication", "backup"],
            ),
        ],
        deployment=DeploymentConfig(
            platform=DeploymentPlatform.KUBERNETES,
            replicas=5,
            resources={
                "cpu": "1000m",
                "memory": "2Gi",
            },
            environment=[
                Environment(name="DATABASE_URL", secret=True),
                Environment(name="STRIPE_API_KEY", secret=True),
                Environment(name="REDIS_URL", secret=True),
            ],
        ),
        testing=TestingConfig(
            unit_tests=True,
            integration_tests=True,
            e2e_tests=True,
            coverage_threshold=85,
            frameworks=["pytest", "jest", "cypress"],
        ),
        documentation=DocumentationConfig(
            api_docs="openapi",
            readme=True,
            architecture_diagram=True,
            deployment_guide=True,
            contributing_guide=True,
        ),
        tags=["ecommerce", "web-app", "microservices"],
    )

    builder = AutoBuilder()
    build_status = await builder.build(blueprint=blueprint)

    print(f"Build ID: {build_status.id}")
    print(f"Project: {blueprint.name}")
    print(f"Components: {len(blueprint.components)}")


async def main():
    """Run all examples."""
    print("Infinity Matrix Auto-Builder - Examples\n")

    # Run examples
    await example_build_from_prompt()
    await example_build_from_blueprint()
    await example_monitor_build()
    await example_list_builds()
    await example_vision_cortex_agents()
    await example_custom_blueprint()

    print("\n" + "=" * 60)
    print("All examples completed!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
