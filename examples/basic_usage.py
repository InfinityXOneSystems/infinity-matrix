"""
Example: Basic usage of the Infinity Matrix ingestion system.

This example demonstrates:
1. Loading configuration
2. Setting up seed manager
3. Running data ingestion
4. Normalizing collected data
5. Analyzing with LLM (optional, requires API key)
"""

import asyncio
import logging

from infinity_matrix.connectors import ConnectorFactory
from infinity_matrix.core import (
    Config,
    IngestionEngine,
    SeedManager,
    StateManager,
)
from infinity_matrix.pipelines import NormalizationPipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


async def main():
    """Main example workflow."""

    # 1. Initialize components
    logger.info("Initializing Infinity Matrix components...")

    Config.load()
    seed_manager = SeedManager()
    state_manager = StateManager()
    connector_factory = ConnectorFactory()

    # 2. Show available industries
    logger.info("Available industries:")
    industries = seed_manager.get_all_industries()
    for industry in industries[:3]:  # Show first 3
        logger.info(f"  - {industry.name} ({industry.id})")

    # 3. Create ingestion engine
    engine = IngestionEngine(
        seed_manager=seed_manager,
        state_manager=state_manager,
        connector_factory=connector_factory
    )

    # 4. Run a small test ingestion (technology industry)
    logger.info("\n=== Running Test Ingestion ===")

    # Get technology seeds (limit to 2 for demo)
    tech_seeds = seed_manager.get_seeds_by_industry("technology")[:2]

    logger.info(f"Processing {len(tech_seeds)} seed URLs...")
    for seed in tech_seeds:
        logger.info(f"  - {seed.url}")

    # Start ingestion
    stats = await engine.start_ingestion(industry_id="technology")

    logger.info("\n=== Ingestion Results ===")
    logger.info(f"Total tasks: {stats.total_tasks}")
    logger.info(f"Completed: {stats.completed_tasks}")
    logger.info(f"Failed: {stats.failed_tasks}")
    logger.info(f"Data collected: {stats.total_data_collected}")

    # 5. Normalize collected data
    if stats.total_data_collected > 0:
        logger.info("\n=== Normalizing Data ===")

        pipeline = NormalizationPipeline()

        # Get raw data files
        import json
        from pathlib import Path

        from infinity_matrix.models import RawData

        raw_data_path = Path("data/raw/technology")

        if raw_data_path.exists():
            count = 0
            for json_file in raw_data_path.rglob("*.json")[:5]:  # Limit to 5
                try:
                    with open(json_file) as f:
                        data = json.load(f)
                        raw_data = RawData(**data)

                    normalized = await pipeline.normalize(raw_data)
                    await state_manager.save_normalized_data(normalized)

                    logger.info(f"Normalized: {normalized.title or 'Untitled'}")
                    logger.info(f"  Quality: {normalized.quality_score:.2f}")
                    logger.info(f"  Keywords: {', '.join(normalized.keywords[:5])}")

                    count += 1
                except Exception as e:
                    logger.error(f"Error normalizing {json_file}: {e}")

            logger.info(f"\nNormalized {count} items")
        else:
            logger.info("No raw data found to normalize")

    # 6. Optional: Analyze with LLM (requires API key)
    logger.info("\n=== LLM Analysis ===")
    logger.info("To run LLM analysis:")
    logger.info("1. Set OPENAI_API_KEY in .env file")
    logger.info("2. Run: infinity-matrix analyze --industry technology")

    logger.info("\n=== Example Complete ===")
    logger.info("View collected data in: data/raw/technology/")
    logger.info("View normalized data in: data/normalized/technology/")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("\nExample interrupted by user")
    except Exception as e:
        logger.error(f"Error running example: {e}", exc_info=True)
