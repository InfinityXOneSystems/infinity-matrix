"""Auto-Builder - Automated build and deployment pipeline."""

import asyncio
import os
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import dict, list
from uuid import uuid4

from pydantic import BaseModel, Field

from infinity_matrix.core.base import BaseService
from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger
from infinity_matrix.core.metrics import get_metrics_collector, track_execution_time

logger = get_logger(__name__)


class BuildStatus(str, Enum):
    """Build status enum."""

    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILURE = "failure"
    CANCELLED = "cancelled"


class BuildConfig(BaseModel):
    """Build configuration."""

    project_path: str
    build_command: str = "python -m build"
    test_command: str | None = "pytest"
    lint_command: str | None = "ruff check ."
    environment: dict[str, str] = Field(default_factory=dict)
    timeout: int = 600  # seconds


class BuildResult(BaseModel):
    """Build result."""

    build_id: str
    status: BuildStatus
    start_time: datetime
    end_time: datetime | None = None
    duration: float | None = None
    logs: list[str] = Field(default_factory=list)
    artifacts: list[str] = Field(default_factory=list)
    error: str | None = None


class BuildPipeline(BaseService):
    """Automated build pipeline with CI/CD capabilities."""

    def __init__(self) -> None:
        """Initialize build pipeline."""
        super().__init__(name="build_pipeline")
        self.settings = get_settings()
        self.metrics = get_metrics_collector()
        self._builds: dict[str, BuildResult] = {}
        self._running_builds: dict[str, asyncio.Task] = {}
        self._workspace = Path(self.settings.builder_workspace)

    async def _initialize(self) -> None:
        """Initialize build pipeline."""
        self.logger.info("build_pipeline_initializing")

        # Create workspace directory
        self._workspace.mkdir(parents=True, exist_ok=True)

        self.logger.info("build_pipeline_initialized", workspace=str(self._workspace))

    async def _shutdown(self) -> None:
        """Shutdown build pipeline."""
        self.logger.info("build_pipeline_shutting_down")

        # Cancel all running builds
        for build_id, task in self._running_builds.items():
            if not task.done():
                task.cancel()
                self.logger.info("build_cancelled", build_id=build_id)

    @track_execution_time("build_execution")
    async def execute_build(self, config: BuildConfig) -> BuildResult:
        """Execute a build."""
        build_id = str(uuid4())
        start_time = datetime.utcnow()

        self.logger.info(
            "build_starting",
            build_id=build_id,
            project=config.project_path,
        )

        result = BuildResult(
            build_id=build_id,
            status=BuildStatus.RUNNING,
            start_time=start_time,
        )

        self._builds[build_id] = result

        try:
            # Create build task
            task = asyncio.create_task(self._run_build(build_id, config))
            self._running_builds[build_id] = task

            # Wait for build to complete
            await task

            # Update result
            result = self._builds[build_id]
            result.end_time = datetime.utcnow()
            result.duration = (result.end_time - start_time).total_seconds()

            self.metrics.record_build(result.status.value)

            self.logger.info(
                "build_completed",
                build_id=build_id,
                status=result.status,
                duration=result.duration,
            )

            return result

        except asyncio.CancelledError:
            result.status = BuildStatus.CANCELLED
            result.end_time = datetime.utcnow()
            result.duration = (result.end_time - start_time).total_seconds()
            self.logger.info("build_cancelled", build_id=build_id)
            return result

        except Exception as e:
            result.status = BuildStatus.FAILURE
            result.error = str(e)
            result.end_time = datetime.utcnow()
            result.duration = (result.end_time - start_time).total_seconds()
            self.logger.error("build_failed", build_id=build_id, error=str(e))
            self.metrics.record_build("failure")
            return result

        finally:
            if build_id in self._running_builds:
                del self._running_builds[build_id]

    async def _run_build(self, build_id: str, config: BuildConfig) -> None:
        """Run the actual build process."""
        result = self._builds[build_id]

        try:
            # Step 1: Lint (if configured)
            if config.lint_command:
                self.logger.info("build_step_lint", build_id=build_id)
                lint_output = await self._execute_command(
                    config.lint_command,
                    config.project_path,
                    config.environment,
                )
                result.logs.append(f"[LINT] {lint_output}")

            # Step 2: Build
            self.logger.info("build_step_build", build_id=build_id)
            build_output = await self._execute_command(
                config.build_command,
                config.project_path,
                config.environment,
            )
            result.logs.append(f"[BUILD] {build_output}")

            # Step 3: Test (if configured)
            if config.test_command:
                self.logger.info("build_step_test", build_id=build_id)
                test_output = await self._execute_command(
                    config.test_command,
                    config.project_path,
                    config.environment,
                )
                result.logs.append(f"[TEST] {test_output}")

            # Step 4: Collect artifacts
            artifacts_dir = Path(config.project_path) / "dist"
            if artifacts_dir.exists():
                artifacts = [str(f) for f in artifacts_dir.glob("*")]
                result.artifacts = artifacts
                self.logger.info("build_artifacts_collected", count=len(artifacts))

            result.status = BuildStatus.SUCCESS

        except Exception as e:
            result.status = BuildStatus.FAILURE
            result.error = str(e)
            result.logs.append(f"[ERROR] {str(e)}")
            raise

    async def _execute_command(
        self,
        command: str,
        cwd: str,
        env: dict[str, str],
    ) -> str:
        """Execute a shell command."""
        full_env = {**os.environ, **env}

        process = await asyncio.create_subprocess_shell(
            command,
            cwd=cwd,
            env=full_env,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        stdout, stderr = await process.communicate()

        if process.returncode != 0:
            error_msg = stderr.decode() if stderr else "Command failed"
            raise RuntimeError(f"Command failed: {error_msg}")

        return stdout.decode()

    def get_build_status(self, build_id: str) -> BuildResult | None:
        """Get build status."""
        return self._builds.get(build_id)

    def list_builds(self) -> list[BuildResult]:
        """list all builds."""
        return list(self._builds.values())

    async def cancel_build(self, build_id: str) -> bool:
        """Cancel a running build."""
        if build_id not in self._running_builds:
            return False

        task = self._running_builds[build_id]
        if not task.done():
            task.cancel()
            return True

        return False
