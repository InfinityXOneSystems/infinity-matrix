"""State manager for persistent task and data tracking."""

import logging
from datetime import datetime
from pathlib import Path
from typing import list

import aiofiles

from infinity_matrix.models import (
    AnalysisResult,
    CrawlTask,
    NormalizedData,
    RawData,
)

logger = logging.getLogger(__name__)


class StateManager:
    """Manages persistent state for crawl tasks and data."""

    def __init__(self, storage_path: str = "data"):
        """Initialize state manager."""
        self.storage_path = Path(storage_path)
        self.tasks_path = self.storage_path / "tasks"
        self.raw_data_path = self.storage_path / "raw"
        self.normalized_data_path = self.storage_path / "normalized"
        self.analyzed_data_path = self.storage_path / "analyzed"

        # Create directories
        for path in [self.tasks_path, self.raw_data_path,
                     self.normalized_data_path, self.analyzed_data_path]:
            path.mkdir(parents=True, exist_ok=True)

    async def save_task(self, task: CrawlTask):
        """Save a crawl task."""
        task_file = self.tasks_path / f"{task.id}.json"
        async with aiofiles.open(task_file, 'w') as f:
            await f.write(task.model_dump_json(indent=2))
        logger.debug(f"Saved task {task.id}")

    async def update_task(self, task: CrawlTask):
        """Update an existing task."""
        await self.save_task(task)

    async def get_task(self, task_id: str) -> CrawlTask | None:
        """Get a task by ID."""
        task_file = self.tasks_path / f"{task_id}.json"
        if not task_file.exists():
            return None

        async with aiofiles.open(task_file) as f:
            data = await f.read()
            return CrawlTask.model_validate_json(data)

    async def get_all_tasks(self) -> list[CrawlTask]:
        """Get all tasks."""
        tasks = []
        for task_file in self.tasks_path.glob("*.json"):
            async with aiofiles.open(task_file) as f:
                data = await f.read()
                tasks.append(CrawlTask.model_validate_json(data))
        return tasks

    async def save_raw_data(self, raw_data: RawData):
        """Save raw data."""
        # Organize by industry and source
        data_dir = self.raw_data_path / raw_data.industry_id / raw_data.source_id
        data_dir.mkdir(parents=True, exist_ok=True)

        data_file = data_dir / f"{raw_data.id}.json"
        async with aiofiles.open(data_file, 'w') as f:
            await f.write(raw_data.model_dump_json(indent=2))
        logger.debug(f"Saved raw data {raw_data.id}")

    async def get_raw_data(self, data_id: str, industry_id: str, source_id: str) -> RawData | None:
        """Get raw data by ID."""
        data_file = self.raw_data_path / industry_id / source_id / f"{data_id}.json"
        if not data_file.exists():
            return None

        async with aiofiles.open(data_file) as f:
            data = await f.read()
            return RawData.model_validate_json(data)

    async def save_normalized_data(self, normalized_data: NormalizedData):
        """Save normalized data."""
        data_dir = self.normalized_data_path / normalized_data.industry_id / normalized_data.source_id
        data_dir.mkdir(parents=True, exist_ok=True)

        data_file = data_dir / f"{normalized_data.id}.json"
        async with aiofiles.open(data_file, 'w') as f:
            await f.write(normalized_data.model_dump_json(indent=2))
        logger.debug(f"Saved normalized data {normalized_data.id}")

    async def get_normalized_data(
        self,
        data_id: str,
        industry_id: str,
        source_id: str
    ) -> NormalizedData | None:
        """Get normalized data by ID."""
        data_file = self.normalized_data_path / industry_id / source_id / f"{data_id}.json"
        if not data_file.exists():
            return None

        async with aiofiles.open(data_file) as f:
            data = await f.read()
            return NormalizedData.model_validate_json(data)

    async def save_analysis_result(self, analysis: AnalysisResult):
        """Save analysis result."""
        # Extract industry/source from normalized data reference
        data_file = self.analyzed_data_path / f"{analysis.id}.json"
        async with aiofiles.open(data_file, 'w') as f:
            await f.write(analysis.model_dump_json(indent=2))
        logger.debug(f"Saved analysis {analysis.id}")

    async def get_analysis_result(self, analysis_id: str) -> AnalysisResult | None:
        """Get analysis result by ID."""
        data_file = self.analyzed_data_path / f"{analysis_id}.json"
        if not data_file.exists():
            return None

        async with aiofiles.open(data_file) as f:
            data = await f.read()
            return AnalysisResult.model_validate_json(data)

    async def get_tasks_by_status(self, status: str) -> list[CrawlTask]:
        """Get all tasks with a specific status."""
        tasks = await self.get_all_tasks()
        return [t for t in tasks if t.status == status]

    async def cleanup_old_tasks(self, days: int = 30):
        """Clean up tasks older than specified days."""
        cutoff = datetime.utcnow().timestamp() - (days * 86400)

        for task_file in self.tasks_path.glob("*.json"):
            if task_file.stat().st_mtime < cutoff:
                task_file.unlink()
                logger.debug(f"Cleaned up old task file {task_file.name}")
