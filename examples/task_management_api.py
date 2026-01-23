"""
Example: Creating a Task Management API with Infinity Matrix
"""

from infinity_matrix import UniversalBuilder, VisionCortex
from infinity_matrix.core.config import Config


def main():
    """Example of programmatic usage of Infinity Matrix."""

    # Load configuration
    config = Config.load()

    # Create builder and vision cortex
    builder = UniversalBuilder(config)
    cortex = VisionCortex(config)

    # Define the application using natural language
    prompt = """
    Build a REST API for task management with the following features:
    - User authentication (JWT)
    - CRUD operations for tasks
    - PostgreSQL database
    - Docker support
    - Comprehensive testing
    """

    print("Analyzing requirements...")
    analysis = cortex.analyze_prompt(prompt)

    print(f"Intent: {analysis.intent}")
    print(f"Complexity: {analysis.complexity}")
    print(f"Suggested Stack: {', '.join(analysis.suggested_stack)}")
    print(f"Suggested Modules: {', '.join(analysis.suggested_modules)}")

    # Select template
    template = cortex.select_blueprint(analysis)
    print(f"\nSelected Template: {template}")

    # Build the application
    print("\nBuilding application...")
    result = builder.build(
        template=template,
        params={
            "app_name": "task-manager-api",
            "include_auth": True,
            "database": "postgresql",
            "include_docker": True
        },
        output_dir="./output",
        prompt=prompt
    )

    if result["success"]:
        print("\n✓ Application created successfully!")
        print(f"Location: {result['output_path']}")
        print("\nNext steps:")
        for step in result.get("next_steps", []):
            print(f"  • {step}")
    else:
        print("\n✗ Failed to create application")
        print(f"Error: {result.get('error', 'Unknown error')}")


if __name__ == "__main__":
    main()
