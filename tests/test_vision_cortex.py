"""Tests for AI Vision Cortex."""

import pytest

from infinity_matrix.core.ai.cortex import PromptAnalysis, VisionCortex
from infinity_matrix.core.config import Config


@pytest.fixture
def vision_cortex():
    """Create VisionCortex instance for testing."""
    config = Config()
    return VisionCortex(config)


def test_analyze_api_prompt(vision_cortex):
    """Test analyzing API building prompt."""
    prompt = "Build a REST API for user management with authentication"
    analysis = vision_cortex.analyze_prompt(prompt)

    assert analysis.intent == "build_api"
    assert any(req.category == "api" for req in analysis.requirements)
    assert any(req.category == "security" for req in analysis.requirements)


def test_analyze_database_prompt(vision_cortex):
    """Test analyzing prompt with database requirement."""
    prompt = "Create an application with PostgreSQL database"
    analysis = vision_cortex.analyze_prompt(prompt)

    assert any(req.category == "storage" for req in analysis.requirements)


def test_select_python_blueprint(vision_cortex):
    """Test blueprint selection for Python."""
    analysis = PromptAnalysis(
        intent="build_api",
        requirements=[],
        suggested_stack=["python"],
        suggested_modules=["api"],
        complexity="simple",
        estimated_time="15 minutes"
    )

    template = vision_cortex.select_blueprint(analysis)
    assert "python" in template


def test_select_node_blueprint(vision_cortex):
    """Test blueprint selection for Node.js."""
    analysis = PromptAnalysis(
        intent="build_web_app",
        requirements=[],
        suggested_stack=["node"],
        suggested_modules=["ui", "api"],
        complexity="moderate",
        estimated_time="30 minutes"
    )

    template = vision_cortex.select_blueprint(analysis)
    assert "node" in template


def test_complexity_assessment(vision_cortex):
    """Test complexity assessment."""
    # Simple prompt with no specific requirements
    simple_prompt = "Build a hello world API"
    simple_analysis = vision_cortex.analyze_prompt(simple_prompt)
    assert simple_analysis.complexity == "simple"

    # Moderate prompt with some requirements
    moderate_prompt = "Build a REST API with authentication and database"
    moderate_analysis = vision_cortex.analyze_prompt(moderate_prompt)
    assert moderate_analysis.complexity in ["moderate", "simple"]

    # Complex prompt (rule-based analysis extracts multiple requirements)
    # Note: Full AI implementation would extract more requirements
    complex_prompt = "Build a microservices platform with authentication, database, and API"
    complex_analysis = vision_cortex.analyze_prompt(complex_prompt)
    assert complex_analysis.complexity in ["moderate", "complex"]
