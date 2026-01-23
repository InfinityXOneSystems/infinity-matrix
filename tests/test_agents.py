"""Tests for agents."""

import pytest

from infinity_matrix.agents.base import AgentTask, AgentType
from infinity_matrix.agents.implementations import (
    CEOAgent,
    CrawlerAgent,
    DocumentorAgent,
    IngestionAgent,
    OrganizerAgent,
    PredictorAgent,
    StrategistAgent,
    ValidatorAgent,
)


class TestAgents:
    """Test all agent implementations."""

    @pytest.mark.asyncio
    async def test_crawler_agent(self):
        """Test CrawlerAgent."""
        agent = CrawlerAgent()

        task = AgentTask(
            agent_type=AgentType.CRAWLER,
            action="scan_templates",
            input_data={"templates_path": "/tmp"},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.CRAWLER

    @pytest.mark.asyncio
    async def test_ingestion_agent(self):
        """Test IngestionAgent."""
        agent = IngestionAgent()

        task = AgentTask(
            agent_type=AgentType.INGESTION,
            action="parse_blueprint",
            input_data={"blueprint": {}},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.INGESTION

    @pytest.mark.asyncio
    async def test_predictor_agent(self):
        """Test PredictorAgent."""
        agent = PredictorAgent()

        task = AgentTask(
            agent_type=AgentType.PREDICTOR,
            action="predict_architecture",
            input_data={"requirements": ["auth", "database"]},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.PREDICTOR

    @pytest.mark.asyncio
    async def test_ceo_agent(self):
        """Test CEOAgent."""
        agent = CEOAgent()

        task = AgentTask(
            agent_type=AgentType.CEO,
            action="approve_architecture",
            input_data={"architecture": {}},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.CEO

    @pytest.mark.asyncio
    async def test_strategist_agent(self):
        """Test StrategistAgent."""
        agent = StrategistAgent()

        task = AgentTask(
            agent_type=AgentType.STRATEGIST,
            action="create_strategy",
            input_data={"blueprint": {}},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.STRATEGIST

    @pytest.mark.asyncio
    async def test_organizer_agent(self):
        """Test OrganizerAgent."""
        agent = OrganizerAgent()

        task = AgentTask(
            agent_type=AgentType.ORGANIZER,
            action="organize_structure",
            input_data={"project_type": "api"},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.ORGANIZER

    @pytest.mark.asyncio
    async def test_validator_agent(self):
        """Test ValidatorAgent."""
        agent = ValidatorAgent()

        task = AgentTask(
            agent_type=AgentType.VALIDATOR,
            action="validate_code",
            input_data={"code": "print('hello')"},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.VALIDATOR

    @pytest.mark.asyncio
    async def test_documentor_agent(self):
        """Test DocumentorAgent."""
        agent = DocumentorAgent()

        task = AgentTask(
            agent_type=AgentType.DOCUMENTOR,
            action="generate_readme",
            input_data={"project": {}},
        )

        result = await agent.execute(task)

        assert result.status == "completed"
        assert result.agent_type == AgentType.DOCUMENTOR
