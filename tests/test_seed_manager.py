"""Tests for seed manager."""

import os
import tempfile
from pathlib import Path

from infinity_matrix.core.seed_manager import SeedManager


def test_seed_manager_init():
    """Test seed manager initialization."""
    with tempfile.TemporaryDirectory() as tmpdir:
        manager = SeedManager(config_dir=tmpdir)
        assert manager.config_dir == Path(tmpdir)


def test_get_industries():
    """Test getting industries from configuration."""
    # Use actual config directory if available
    if os.path.exists("config/industries"):
        manager = SeedManager(config_dir="config")
        industries = manager.get_all_industries()

        # Should have at least some industries
        assert len(industries) > 0

        # Check that we have expected industries
        industry_ids = [ind.id for ind in industries]
        assert "technology" in industry_ids


def test_get_enabled_industries():
    """Test getting only enabled industries."""
    if os.path.exists("config/industries"):
        manager = SeedManager(config_dir="config")
        enabled = manager.get_enabled_industries()

        # All should be enabled
        assert all(ind.enabled for ind in enabled)


def test_get_sources_by_industry():
    """Test getting sources for an industry."""
    if os.path.exists("config/sources"):
        manager = SeedManager(config_dir="config")
        sources = manager.get_sources_by_industry("technology")

        # Should have at least one source
        if len(sources) > 0:
            assert all(src.industry_id == "technology" for src in sources)


def test_get_seeds_by_industry():
    """Test getting seeds for an industry."""
    if os.path.exists("config/industries/technology.yaml"):
        manager = SeedManager(config_dir="config")
        seeds = manager.get_seeds_by_industry("technology")

        # Should have seeds for technology
        if len(seeds) > 0:
            assert all(seed.industry_id == "technology" for seed in seeds)
            # Seeds should have valid URLs
            assert all(str(seed.url).startswith("http") for seed in seeds)
