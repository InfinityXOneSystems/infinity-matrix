"""Core ingestion engine orchestrating the data collection process."""

import asyncio
import logging
import uuid
from datetime import datetime
from typing import dict, list

from infinity_matrix.connectors.factory import ConnectorFactory
from infinity_matrix.core.config import get_config
from infinity_matrix.core.seed_manager import SeedManager
from infinity_matrix.core.state_manager import StateManager
from infinity_matrix.models import (
    CrawlStatus,
    CrawlTask,
    IngestionStats,
    SeedUrl,
)

logger = logging.getLogger(__name__)


class IngestionEngine:
    """Main ingestion engine for coordinating data collection."""

    def __init__(
        self,
        seed_manager: SeedManager,
        state_manager: StateManager,
        connector_factory: ConnectorFactory,
    ):
        """Initialize ingestion engine."""
        self.seed_manager = seed_manager
        self.state_manager = state_manager
        self.connector_factory = connector_factory
        self.config = get_config()

        self._running = False
        self._tasks: dict[str, CrawlTask] = {}

    async def start_ingestion(
        self,
        industry_id: str | None = None,
        source_id: str | None = None,
    ) -> IngestionStats:
        """Start data ingestion for specified industry/source."""
        logger.info(f"Starting ingestion for industry={industry_id}, source={source_id}")

        self._running = True

        # Get seeds to process
        seeds = self._get_seeds(industry_id, source_id)
        logger.info(f"Found {len(seeds)} seeds to process")

        # Create crawl tasks
        tasks = []
        for seed in seeds:
            task = await self._create_crawl_task(seed)
            tasks.append(task)

        # Process tasks concurrently
        results = await self._process_tasks(tasks)

        # Calculate statistics
        stats = self._calculate_stats(industry_id or "all", results)

        self._running = False
        logger.info(f"Ingestion completed: {stats}")

        return stats

    def _get_seeds(
        self,
        industry_id: str | None = None,
        source_id: str | None = None,
    ) -> list[SeedUrl]:
        """Get seeds based on filters."""
        if industry_id:
            seeds = self.seed_manager.get_seeds_by_industry(industry_id)
        else:
            seeds = self.seed_manager.get_all_seeds()

        if source_id:
            seeds = [s for s in seeds if s.source_id == source_id]

        return seeds

    async def _create_crawl_task(self, seed: SeedUrl) -> CrawlTask:
        """Create a crawl task from a seed URL."""
        task_id = str(uuid.uuid4())

        task = CrawlTask(
            id=task_id,
            url=seed.url,
            source_id=seed.source_id,
            industry_id=seed.industry_id,
            status=CrawlStatus.PENDING,
            metadata={
                "priority": seed.priority,
                "depth": seed.depth,
            }
        )

        # Save task to state manager
        await self.state_manager.save_task(task)
        self._tasks[task_id] = task

        return task

    async def _process_tasks(self, tasks: list[CrawlTask]) -> list[CrawlTask]:
        """Process crawl tasks concurrently."""
        max_concurrent = self.config.crawler.max_concurrent_requests

        # Process in batches
        results = []
        for i in range(0, len(tasks), max_concurrent):
            batch = tasks[i:i + max_concurrent]
            batch_results = await asyncio.gather(
                *[self._process_task(task) for task in batch],
                return_exceptions=True
            )
            results.extend([r for r in batch_results if isinstance(r, CrawlTask)])

        return results

    async def _process_task(self, task: CrawlTask) -> CrawlTask:
        """Process a single crawl task."""
        logger.info(f"Processing task {task.id} for URL {task.url}")

        # Update task status
        task.status = CrawlStatus.IN_PROGRESS
        task.started_at = datetime.utcnow()
        task.attempts += 1
        await self.state_manager.update_task(task)

        try:
            # Get connector for this source
            source = self.seed_manager.get_source(task.source_id)
            if not source:
                raise ValueError(f"Source {task.source_id} not found")

            connector = self.connector_factory.get_connector(source.type)

            # Fetch data
            raw_data_list = await connector.fetch(str(task.url), source)

            # Save raw data
            for raw_data in raw_data_list:
                await self.state_manager.save_raw_data(raw_data)

            # Update task as completed
            task.status = CrawlStatus.COMPLETED
            task.completed_at = datetime.utcnow()
            task.result_count = len(raw_data_list)

            logger.info(f"Task {task.id} completed with {len(raw_data_list)} results")

        except Exception as e:
            logger.error(f"Task {task.id} failed: {e}", exc_info=True)
            task.status = CrawlStatus.FAILED
            task.last_error = str(e)

            # Retry logic
            if task.attempts < task.max_attempts:
                task.status = CrawlStatus.RETRYING
                logger.info(f"Will retry task {task.id} (attempt {task.attempts + 1})")

        finally:
            await self.state_manager.update_task(task)

        return task

    def _calculate_stats(
        self,
        industry_id: str,
        tasks: list[CrawlTask]
    ) -> IngestionStats:
        """Calculate ingestion statistics."""
        stats = IngestionStats(industry_id=industry_id)
        stats.total_tasks = len(tasks)

        for task in tasks:
            if task.status == CrawlStatus.PENDING:
                stats.pending_tasks += 1
            elif task.status == CrawlStatus.IN_PROGRESS:
                stats.in_progress_tasks += 1
            elif task.status == CrawlStatus.COMPLETED:
                stats.completed_tasks += 1
                stats.total_data_collected += task.result_count
            elif task.status == CrawlStatus.FAILED:
                stats.failed_tasks += 1

        return stats

    async def stop_ingestion(self):
        """Stop the ingestion process."""
        logger.info("Stopping ingestion engine")
        self._running = False

    def is_running(self) -> bool:
        """Check if engine is running."""
        return self._running
