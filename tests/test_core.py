"""Tests for core functionality."""

import pytest

from infinity_matrix.core.auto_builder import AutoBuilder
from infinity_matrix.core.blueprint import Blueprint, ProjectType
from infinity_matrix.core.vision_cortex import VisionCortex


class TestBlueprint:
    """Test Blueprint model."""

    def test_create_blueprint(self):
        """Test creating a blueprint."""
        blueprint = Blueprint(
            name="test-project",
            type=ProjectType.API,
            description="Test project",
        )

        assert blueprint.name == "test-project"
        assert blueprint.type == ProjectType.API
        assert blueprint.version == "1.0.0"

    def test_blueprint_from_prompt(self):
        """Test creating blueprint from prompt."""
        prompt = "Create a microservice for user authentication"
        blueprint = Blueprint.from_prompt(prompt)

        assert blueprint.description == prompt
        assert isinstance(blueprint.type, ProjectType)


class TestVisionCortex:
    """Test Vision Cortex orchestrator."""

    def test_init_vision_cortex(self):
        """Test initializing Vision Cortex."""
        cortex = VisionCortex()

        assert len(cortex.agents) == 8
        assert cortex.active_builds == {}

    def test_list_agents(self):
        """Test listing agents."""
        cortex = VisionCortex()
        agents = cortex.list_agents()

        assert len(agents) == 8
        assert all("type" in agent for agent in agents)
        assert all("status" in agent for agent in agents)
        assert all("capabilities" in agent for agent in agents)


class TestAutoBuilder:
    """Test AutoBuilder."""

    def test_init_auto_builder(self):
        """Test initializing AutoBuilder."""
        builder = AutoBuilder()

        assert builder.vision_cortex is not None
        assert builder.builds == {}

    @pytest.mark.asyncio
    async def test_build_from_blueprint(self):
        """Test building from blueprint."""
        builder = AutoBuilder()

        blueprint = Blueprint(
            name="test-api",
            type=ProjectType.API,
            description="Test API",
        )

        build_status = await builder.build(blueprint=blueprint)

        assert build_status.id is not None
        assert build_status.name == "test-api"
        assert build_status.status in ["pending", "running"]

    @pytest.mark.asyncio
    async def test_build_from_prompt(self):
        """Test building from prompt."""
        builder = AutoBuilder()

        build_status = await builder.build(prompt="Create a simple REST API")

        assert build_status.id is not None
        assert build_status.status in ["pending", "running"]

    @pytest.mark.asyncio
    async def test_list_builds(self):
        """Test listing builds."""
        builder = AutoBuilder()

        # Create a build
        await builder.build(prompt="Test build")

        # list builds
        builds = await builder.list_builds()

        assert len(builds) >= 1

    @pytest.mark.asyncio
    async def test_get_build_status(self):
        """Test getting build status."""
        builder = AutoBuilder()

        # Create a build
        build_status = await builder.build(prompt="Test build")
        build_id = build_status.id

        # Get status
        status = await builder.get_build_status(build_id)

        assert status is not None
        assert status.id == build_id
