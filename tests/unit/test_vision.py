"""Tests for vision processor."""

import numpy as np
import pytest

from infinity_matrix.core.base import Task
from infinity_matrix.vision.processor import VisionProcessor


@pytest.mark.asyncio
async def test_vision_processor_initialization():
    """Test vision processor initialization."""
    processor = VisionProcessor()
    await processor.initialize()

    health = await processor.health_check()
    assert health["status"] == "healthy"

    await processor.shutdown()


@pytest.mark.asyncio
async def test_vision_processor_validate():
    """Test task validation."""
    processor = VisionProcessor()
    await processor.initialize()

    # Valid task
    valid_task = Task(
        type="vision",
        input={"image": np.zeros((100, 100, 3), dtype=np.uint8)},
    )
    assert await processor.validate(valid_task)

    # Invalid task - wrong type
    invalid_task = Task(type="other", input={"image": np.zeros((100, 100, 3))})
    assert not await processor.validate(invalid_task)

    # Invalid task - missing image
    invalid_task2 = Task(type="vision", input={})
    assert not await processor.validate(invalid_task2)

    await processor.shutdown()


@pytest.mark.asyncio
async def test_vision_process_image_analysis():
    """Test image analysis."""
    processor = VisionProcessor()
    await processor.initialize()

    # Create test image
    test_image = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)

    task = Task(
        type="vision",
        input={
            "task_type": "image_analysis",
            "image": test_image,
        },
    )

    result = await processor.process(task)
    assert result.status == "success"
    assert "dimensions" in result.output
    assert "properties" in result.output

    await processor.shutdown()


@pytest.mark.asyncio
async def test_vision_process_ocr():
    """Test OCR processing."""
    processor = VisionProcessor()
    await processor.initialize()

    test_image = np.random.randint(0, 255, (100, 100, 3), dtype=np.uint8)

    task = Task(
        type="vision",
        input={
            "task_type": "ocr",
            "image": test_image,
        },
    )

    result = await processor.process(task)
    assert result.status == "success"
    assert "text" in result.output
    assert "confidence" in result.output

    await processor.shutdown()
