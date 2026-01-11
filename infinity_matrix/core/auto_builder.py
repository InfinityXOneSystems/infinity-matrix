"""
Auto-Builder main class - High-level interface for the auto-builder system.
"""

import asyncio
from pathlib import Path
from typing import Any
from uuid import uuid4

import yaml
from pydantic import BaseModel, Field

from infinity_matrix.core.blueprint import Blueprint
from infinity_matrix.core.config import settings
from infinity_matrix.core.vision_cortex import BuildPlan, VisionCortex


class BuildStatus(BaseModel):
    """Build status information."""

    id: str
    name: str
    status: str  # pending, running, completed, failed
    progress: int = 0  # 0-100
    phases_completed: int = 0
    phases_total: int = 0
    created_at: str
    completed_at: str | None = None
    error: str | None = None
    artifacts: dict[str, Any] = Field(default_factory=dict)


class AutoBuilder:
    """
    Auto-Builder main class.

    This is the primary interface for building projects, systems, and workflows
    using the Vision Cortex orchestration system.
    """

    def __init__(self, config: dict[str, Any] | None = None):
        """Initialize AutoBuilder."""
        self.config = config or {}
        self.vision_cortex = VisionCortex(self.config)
        self.builds: dict[str, BuildStatus] = {}

    async def build(
        self,
        blueprint: Blueprint | None = None,
        prompt: str | None = None,
        blueprint_path: Path | None = None,
    ) -> BuildStatus:
        """
        Trigger a new build.

        Args:
            blueprint: A Blueprint object defining the build
            prompt: A natural language prompt to create a blueprint from
            blueprint_path: Path to a blueprint YAML file

        Returns:
            BuildStatus object with build information

        Raises:
            ValueError: If no valid input is provided
        """
        # Create blueprint from provided input
        if blueprint_path:
            blueprint = await self._load_blueprint(blueprint_path)
        elif prompt:
            blueprint = Blueprint.from_prompt(prompt)
        elif not blueprint:
            raise ValueError("Must provide either blueprint, prompt, or blueprint_path")

        # Create build status
        build_id = str(uuid4())
        build_status = BuildStatus(
            id=build_id,
            name=blueprint.name,
            status="pending",
            phases_total=5,  # Standard number of phases
            created_at=str(blueprint.created_at),
        )
        self.builds[build_id] = build_status

        # Start build process asynchronously
        asyncio.create_task(self._execute_build(build_id, blueprint))

        return build_status

    async def _execute_build(self, build_id: str, blueprint: Blueprint) -> None:
        """
        Execute the build process.

        Args:
            build_id: The build ID
            blueprint: The blueprint to build
        """
        build_status = self.builds[build_id]
        build_status.status = "running"

        try:
            # Orchestrate build with Vision Cortex
            build_plan = await self.vision_cortex.orchestrate_build(blueprint)

            # Update progress based on completed phases
            completed_phases = sum(1 for phase in build_plan.phases if phase.status == "completed")
            build_status.phases_completed = completed_phases
            build_status.progress = int((completed_phases / len(build_plan.phases)) * 100)

            # Generate artifacts
            artifacts = await self._generate_artifacts(build_id, build_plan)
            build_status.artifacts = artifacts

            # Mark as completed
            build_status.status = "completed"
            build_status.progress = 100

        except Exception as e:
            build_status.status = "failed"
            build_status.error = str(e)

    async def _load_blueprint(self, path: Path) -> Blueprint:
        """
        Load a blueprint from a YAML file.

        Args:
            path: Path to the blueprint file

        Returns:
            Blueprint object
        """
        with open(path) as f:
            data = yaml.safe_load(f)

        return Blueprint(**data)

    async def _generate_artifacts(
        self,
        build_id: str,
        build_plan: BuildPlan,
    ) -> dict[str, Any]:
        """
        Generate build artifacts.

        Args:
            build_id: The build ID
            build_plan: The completed build plan

        Returns:
            Dictionary of artifacts
        """
        # Create build directory
        build_dir = settings.repo_base_path / build_id
        build_dir.mkdir(parents=True, exist_ok=True)

        artifacts = {
            "build_dir": str(build_dir),
            "files_generated": 0,
            "documentation": [],
            "config_files": [],
        }

        # Generate basic project structure
        project_name = build_plan.blueprint.name
        project_dir = build_dir / project_name
        project_dir.mkdir(parents=True, exist_ok=True)

        # Create basic files
        self._create_readme(project_dir, build_plan.blueprint)
        self._create_gitignore(project_dir)
        self._create_pyproject_toml(project_dir, build_plan.blueprint)

        artifacts["files_generated"] = 3
        artifacts["documentation"].append(str(project_dir / "README.md"))

        return artifacts

    def _create_readme(self, project_dir: Path, blueprint: Blueprint) -> None:
        """Create README.md file."""
        readme_content = f"""# {blueprint.name}

{blueprint.description}

## Version

{blueprint.version}

## Type

{blueprint.type.value}

## Requirements

{chr(10).join(f'- {req}' for req in blueprint.requirements)}

## Components

{chr(10).join(f'- {comp.name} ({comp.type.value})' for comp in blueprint.components)}

## Installation

```bash
pip install -e .
```

## Usage

Documentation coming soon.

## License

{blueprint.license}
"""
        (project_dir / "README.md").write_text(readme_content)

    def _create_gitignore(self, project_dir: Path) -> None:
        """Create .gitignore file."""
        gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
dist/
*.egg-info/
.venv/
venv/
ENV/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
.pytest_cache/
.coverage
htmlcov/

# Environment
.env
.envrc
"""
        (project_dir / ".gitignore").write_text(gitignore_content)

    def _create_pyproject_toml(self, project_dir: Path, blueprint: Blueprint) -> None:
        """Create pyproject.toml file."""
        pyproject_content = f"""[build-system]
requires = ["setuptools>=68.0.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "{blueprint.name}"
version = "{blueprint.version}"
description = "{blueprint.description}"
license = {{text = "{blueprint.license}"}}
requires-python = ">=3.9"

dependencies = []

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "black>=23.12.0",
    "ruff>=0.1.0",
]
"""
        (project_dir / "pyproject.toml").write_text(pyproject_content)

    async def get_build_status(self, build_id: str) -> BuildStatus | None:
        """
        Get the status of a build.

        Args:
            build_id: The build ID

        Returns:
            BuildStatus or None if not found
        """
        return self.builds.get(build_id)

    async def list_builds(self) -> list[BuildStatus]:
        """
        list all builds.

        Returns:
            list of BuildStatus objects
        """
        return list(self.builds.values())

    async def cancel_build(self, build_id: str) -> bool:
        """
        Cancel a running build.

        Args:
            build_id: The build ID

        Returns:
            True if cancelled, False otherwise
        """
        build_status = self.builds.get(build_id)
        if build_status and build_status.status == "running":
            build_status.status = "cancelled"
            return True
        return False

    def get_vision_cortex(self) -> VisionCortex:
        """Get the Vision Cortex instance."""
        return self.vision_cortex
