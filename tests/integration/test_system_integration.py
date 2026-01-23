"""Integration tests for the complete system."""

import pytest

from infinity_matrix.core.config import Config
from infinity_matrix.core.system import InfinityMatrix


@pytest.mark.asyncio
async def test_full_system_integration():
    """Test full system integration."""
    config = Config()
    system = InfinityMatrix(config)

    # Start system
    await system.start()

    # Verify all components are initialized
    status = await system.get_status()
    assert status["running"] is True

    # Check component availability
    components = status["components"]
    assert components["vision_cortex"] is True
    assert components["auto_builder"] is True
    assert components["doc_system"] is True
    assert components["index_system"] is True
    assert components["taxonomy_system"] is True
    assert components["pr_engine"] is True
    assert components["etl_system"] is True

    # Stop system
    await system.stop()


@pytest.mark.asyncio
async def test_builder_integration(tmp_path):
    """Test builder integration."""
    config = Config()
    system = InfinityMatrix(config)

    await system.start()

    # Submit a build
    if system._auto_builder:
        build_id = await system._auto_builder.submit_build(
            tmp_path,
            "python"
        )

        assert build_id is not None

        # Check build status
        status = await system._auto_builder.get_build_status(build_id)
        assert status is not None
        assert status["platform"] == "python"

    await system.stop()


@pytest.mark.asyncio
async def test_vision_integration(tmp_path):
    """Test vision cortex integration."""
    config = Config()
    system = InfinityMatrix(config)

    await system.start()

    # Test vision analysis (with placeholder)
    if system._vision_cortex:
        # Create a dummy image file
        image_path = tmp_path / "test.jpg"
        image_path.write_text("dummy")

        result = await system._vision_cortex.analyze_image(image_path)
        assert result["status"] == "success"

    await system.stop()


@pytest.mark.asyncio
async def test_etl_integration():
    """Test ETL system integration."""
    config = Config()
    system = InfinityMatrix(config)

    await system.start()

    if system._etl_system:
        # Test scraping
        result = await system._etl_system.scrape_url("https://example.com")
        assert result["status"] == "success"

    await system.stop()
