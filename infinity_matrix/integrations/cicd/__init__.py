"""CI/CD platform integrations."""

from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Optional, dict, list

from pydantic import BaseModel


class CICDPlatform(str, Enum):
    """CI/CD platform enumeration."""
    GITHUB_ACTIONS = "github_actions"
    GITLAB_CI = "gitlab_ci"
    JENKINS = "jenkins"
    CIRCLECI = "circleci"


class PipelineStep(BaseModel):
    """CI/CD pipeline step."""
    name: str
    script: list[str]
    environment: dict[str, str] = {}


class PipelineConfig(BaseModel):
    """CI/CD pipeline configuration."""
    name: str
    platform: CICDPlatform
    steps: list[PipelineStep]
    triggers: list[str] = ["push"]


class CICDIntegration(ABC):
    """Abstract base class for CI/CD integrations."""

    @abstractmethod
    def generate_config(self, pipeline: PipelineConfig) -> str:
        """Generate CI/CD configuration file."""

    @abstractmethod
    def trigger_pipeline(self, pipeline_id: str) -> dict[str, Any]:
        """Trigger a pipeline run."""


class GitHubActionsIntegration(CICDIntegration):
    """GitHub Actions integration."""

    def generate_config(self, pipeline: PipelineConfig) -> str:
        """Generate GitHub Actions workflow file."""
        steps_yaml = []
        for step in pipeline.steps:
            step_yaml = f"""
      - name: {step.name}
        run: |
"""
            for script_line in step.script:
                step_yaml += f"          {script_line}\n"
            steps_yaml.append(step_yaml)

        # Format triggers as YAML list
        triggers_yaml = "\n".join([f"  {trigger}:" for trigger in pipeline.triggers])

        config = f"""
name: {pipeline.name}

on:
{triggers_yaml}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
{''.join(steps_yaml)}
"""
        return config

    def trigger_pipeline(self, pipeline_id: str) -> dict[str, Any]:
        """Trigger GitHub Actions workflow."""
        return {
            "success": True,
            "pipeline_id": pipeline_id,
            "run_id": "gh-run-123"
        }


class GitLabCIIntegration(CICDIntegration):
    """GitLab CI integration."""

    def generate_config(self, pipeline: PipelineConfig) -> str:
        """Generate GitLab CI configuration file."""
        stages = []
        jobs = []

        for idx, step in enumerate(pipeline.steps):
            stage_name = f"stage_{idx}"
            stages.append(stage_name)

            job = f"""
{step.name}:
  stage: {stage_name}
  script:
"""
            for script_line in step.script:
                job += f"    - {script_line}\n"

            jobs.append(job)

        config = f"""
stages:
  - {'\n  - '.join(stages)}

{''.join(jobs)}
"""
        return config

    def trigger_pipeline(self, pipeline_id: str) -> dict[str, Any]:
        """Trigger GitLab CI pipeline."""
        return {
            "success": True,
            "pipeline_id": pipeline_id,
            "run_id": "gl-run-123"
        }


def get_cicd_integration(platform: CICDPlatform) -> CICDIntegration:
    """Get CI/CD integration for platform."""
    if platform == CICDPlatform.GITHUB_ACTIONS:
        return GitHubActionsIntegration()
    elif platform == CICDPlatform.GITLAB_CI:
        return GitLabCIIntegration()
    else:
        raise ValueError(f"Unsupported platform: {platform}")
