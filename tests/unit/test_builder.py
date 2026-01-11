"""Tests for build pipeline."""

import pytest

from infinity_matrix.builder.pipeline import BuildPipeline


@pytest.mark.asyncio
async def test_pipeline_initialization():
    """Test pipeline initialization."""
    pipeline = BuildPipeline()
    await pipeline.initialize()
    assert pipeline.is_initialized
    await pipeline.shutdown()


@pytest.mark.asyncio
async def test_build_status_tracking():
    """Test build status tracking."""
    pipeline = BuildPipeline()
    await pipeline.initialize()

    # Initially no builds
    builds = pipeline.list_builds()
    assert len(builds) == 0

    await pipeline.shutdown()


@pytest.mark.asyncio
async def test_get_build_status():
    """Test getting build status."""
    pipeline = BuildPipeline()
    await pipeline.initialize()

    # Non-existent build
    status = pipeline.get_build_status("non-existent")
    assert status is None

    await pipeline.shutdown()
