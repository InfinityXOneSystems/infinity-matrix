"""Main system orchestrator for Infinity Matrix."""

import asyncio
import signal
from typing import Any, dict

import structlog

from infinity_matrix.core.config import Config, load_config
from infinity_matrix.core.registry import AgentRegistry

logger = structlog.get_logger()


class InfinityMatrix:
    """Main system orchestrator for the Infinity Matrix platform."""

    def __init__(self, config: Config | None = None):
        """Initialize the Infinity Matrix system.

        Args:
            config: System configuration. If None, loads from default locations.
        """
        self.config = config or load_config()
        self.registry = AgentRegistry(backend=self.config.agents.registry_backend)

        self._running = False
        self._tasks: list[asyncio.Task] = []

        # Component systems (will be initialized on start)
        self._vision_cortex: Any | None = None
        self._auto_builder: Any | None = None
        self._doc_system: Any | None = None
        self._index_system: Any | None = None
        self._taxonomy_system: Any | None = None
        self._pr_engine: Any | None = None
        self._etl_system: Any | None = None

        # Setup logging
        self._setup_logging()

    def _setup_logging(self) -> None:
        """Configure structured logging."""
        import logging

        # Map log levels
        log_level_map = {
            "DEBUG": logging.DEBUG,
            "INFO": logging.INFO,
            "WARNING": logging.WARNING,
            "ERROR": logging.ERROR,
            "CRITICAL": logging.CRITICAL,
        }

        log_level = log_level_map.get(self.config.log_level, logging.INFO)

        structlog.configure(
            processors=[
                structlog.contextvars.merge_contextvars,
                structlog.processors.add_log_level,
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.dev.ConsoleRenderer() if self.config.debug else structlog.processors.JSONRenderer(),
            ],
            wrapper_class=structlog.make_filtering_bound_logger(log_level),
            logger_factory=structlog.PrintLoggerFactory(),
        )

    async def start(self) -> None:
        """Start the Infinity Matrix system."""
        if self._running:
            logger.warning("System already running")
            return

        logger.info("Starting Infinity Matrix system", version="0.1.0")

        # Ensure directories exist
        self.config.ensure_directories()

        # Start registry
        await self.registry.start()

        # Initialize and start component systems
        await self._initialize_components()

        # Setup signal handlers
        self._setup_signal_handlers()

        self._running = True
        logger.info("Infinity Matrix system started successfully")

    async def stop(self) -> None:
        """Stop the Infinity Matrix system."""
        if not self._running:
            return

        logger.info("Stopping Infinity Matrix system")

        self._running = False

        # Cancel all running tasks
        for task in self._tasks:
            task.cancel()

        # Wait for tasks to complete
        if self._tasks:
            await asyncio.gather(*self._tasks, return_exceptions=True)

        # Stop component systems
        await self._shutdown_components()

        # Stop registry
        await self.registry.stop()

        logger.info("Infinity Matrix system stopped")

    async def _initialize_components(self) -> None:
        """Initialize all component systems."""
        logger.info("Initializing component systems")

        # Import components here to avoid circular imports
        if self.config.vision.enabled:
            from infinity_matrix.vision import VisionCortex
            self._vision_cortex = VisionCortex(self.config.vision)
            await self._vision_cortex.start()
            logger.info("Vision Cortex initialized")

        if self.config.builder.enabled:
            from infinity_matrix.builder import AutoBuilder
            self._auto_builder = AutoBuilder(self.config.builder)
            await self._auto_builder.start()
            logger.info("Auto-Builder initialized")

        if self.config.docs.enabled:
            from infinity_matrix.docs import EvolutionDocSystem
            self._doc_system = EvolutionDocSystem(self.config.docs)
            await self._doc_system.start()
            logger.info("Evolution Doc System initialized")

        if self.config.index.enabled:
            from infinity_matrix.index import IndexSystem
            self._index_system = IndexSystem(self.config.index)
            await self._index_system.start()
            logger.info("Index System initialized")

        if self.config.taxonomy.enabled:
            from infinity_matrix.taxonomy import TaxonomySystem
            self._taxonomy_system = TaxonomySystem(self.config.taxonomy)
            await self._taxonomy_system.start()
            logger.info("Taxonomy System initialized")

        if self.config.pr_engine.enabled:
            from infinity_matrix.pr_engine import PREngine
            self._pr_engine = PREngine(self.config.pr_engine)
            await self._pr_engine.start()
            logger.info("PR Engine initialized")

        if self.config.etl.enabled:
            from infinity_matrix.etl import ETLSystem
            self._etl_system = ETLSystem(self.config.etl)
            await self._etl_system.start()
            logger.info("ETL System initialized")

    async def _shutdown_components(self) -> None:
        """Shutdown all component systems."""
        logger.info("Shutting down component systems")

        components = [
            self._vision_cortex,
            self._auto_builder,
            self._doc_system,
            self._index_system,
            self._taxonomy_system,
            self._pr_engine,
            self._etl_system,
        ]

        for component in components:
            if component and hasattr(component, "stop"):
                try:
                    await component.stop()
                except Exception as e:
                    logger.error("Error stopping component", component=type(component).__name__, error=str(e))

    def _setup_signal_handlers(self) -> None:
        """Setup signal handlers for graceful shutdown."""
        def signal_handler(signum: int, frame: Any) -> None:
            logger.info("Received signal, initiating shutdown", signal=signum)
            asyncio.create_task(self.stop())

        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

    async def get_status(self) -> dict[str, Any]:
        """Get system status.

        Returns:
            System status dictionary
        """
        registry_stats = await self.registry.get_statistics()

        return {
            "running": self._running,
            "version": "0.1.0",
            "config": {
                "debug": self.config.debug,
                "log_level": self.config.log_level,
            },
            "components": {
                "vision_cortex": self._vision_cortex is not None,
                "auto_builder": self._auto_builder is not None,
                "doc_system": self._doc_system is not None,
                "index_system": self._index_system is not None,
                "taxonomy_system": self._taxonomy_system is not None,
                "pr_engine": self._pr_engine is not None,
                "etl_system": self._etl_system is not None,
            },
            "registry": registry_stats,
        }

    async def run_forever(self) -> None:
        """Run the system until stopped."""
        await self.start()

        try:
            while self._running:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            pass
        finally:
            await self.stop()
