"""Command-line interface for Infinity Matrix."""

import asyncio
import logging
import sys
from pathlib import Path
import click

from infinity_matrix.core import Config, SeedManager, StateManager, IngestionEngine, get_config
from infinity_matrix.connectors import ConnectorFactory
from infinity_matrix.pipelines import NormalizationPipeline

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@click.group()
@click.option('--config', default=None, help='Path to configuration file')
@click.pass_context
def cli(ctx, config):
    """Infinity Matrix - Universal Seed & Ingestion System."""
    ctx.ensure_object(dict)
    
    # Load configuration
    if config:
        ctx.obj['config'] = Config.load(config)
    else:
        ctx.obj['config'] = get_config()


@cli.command()
@click.option('--industry', help='Industry ID to ingest')
@click.option('--source', help='Source ID to ingest')
@click.pass_context
def ingest(ctx, industry, source):
    """Start data ingestion."""
    logger.info(f"Starting ingestion for industry={industry}, source={source}")
    
    # Initialize components
    seed_manager = SeedManager()
    state_manager = StateManager()
    connector_factory = ConnectorFactory()
    
    engine = IngestionEngine(
        seed_manager=seed_manager,
        state_manager=state_manager,
        connector_factory=connector_factory
    )
    
    # Run ingestion
    async def run():
        stats = await engine.start_ingestion(industry_id=industry, source_id=source)
        
        click.echo("\nIngestion completed!")
        click.echo(f"Total tasks: {stats.total_tasks}")
        click.echo(f"Completed: {stats.completed_tasks}")
        click.echo(f"Failed: {stats.failed_tasks}")
        click.echo(f"Data collected: {stats.total_data_collected}")
    
    asyncio.run(run())


@cli.command()
@click.option('--industry', help='Industry ID to normalize')
@click.option('--limit', default=100, help='Limit number of items to normalize')
@click.pass_context
def normalize(ctx, industry, limit):
    """Normalize raw data."""
    logger.info(f"Starting normalization for industry={industry}")
    
    state_manager = StateManager()
    pipeline = NormalizationPipeline()
    
    async def run():
        # Get raw data files
        raw_data_path = Path("data/raw")
        if industry:
            raw_data_path = raw_data_path / industry
        
        count = 0
        for json_file in raw_data_path.rglob("*.json"):
            if count >= limit:
                break
            
            try:
                # Read and parse raw data
                import json
                from infinity_matrix.models import RawData
                
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    raw_data = RawData(**data)
                
                # Normalize
                normalized = await pipeline.normalize(raw_data)
                
                # Save
                await state_manager.save_normalized_data(normalized)
                
                count += 1
                if count % 10 == 0:
                    click.echo(f"Normalized {count} items...")
            
            except Exception as e:
                logger.error(f"Error normalizing {json_file}: {e}")
        
        click.echo(f"\nNormalization completed! Processed {count} items.")
    
    asyncio.run(run())


@cli.command()
@click.option('--industry', help='Industry ID to analyze')
@click.option('--provider', default='openai', help='LLM provider to use')
@click.option('--prompt-type', default='insights', help='Prompt type (insights, summary, categorization)')
@click.option('--limit', default=50, help='Limit number of items to analyze')
@click.pass_context
def analyze(ctx, industry, provider, prompt_type, limit):
    """Analyze normalized data with LLM."""
    logger.info(f"Starting analysis for industry={industry} with provider={provider}")
    
    # Import here to avoid requiring LLM dependencies for other commands
    from infinity_matrix.llm import AnalysisFramework
    
    state_manager = StateManager()
    framework = AnalysisFramework(state_manager, provider_name=provider)
    
    async def run():
        # Get normalized data files
        normalized_path = Path("data/normalized")
        if industry:
            normalized_path = normalized_path / industry
        
        count = 0
        for json_file in normalized_path.rglob("*.json"):
            if count >= limit:
                break
            
            try:
                # Read and parse normalized data
                import json
                from infinity_matrix.models import NormalizedData
                
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    normalized_data = NormalizedData(**data)
                
                # Analyze
                result = await framework.analyze_data(
                    normalized_data,
                    prompt_type=prompt_type
                )
                
                if result:
                    count += 1
                    if count % 5 == 0:
                        click.echo(f"Analyzed {count} items...")
            
            except Exception as e:
                logger.error(f"Error analyzing {json_file}: {e}")
        
        click.echo(f"\nAnalysis completed! Processed {count} items.")
    
    asyncio.run(run())


@cli.command()
@click.option('--industry', help='Industry ID to show status for')
@click.pass_context
def status(ctx, industry):
    """Show ingestion status."""
    state_manager = StateManager()
    
    async def run():
        tasks = await state_manager.get_all_tasks()
        
        if industry:
            tasks = [t for t in tasks if t.industry_id == industry]
        
        # Count by status
        from collections import Counter
        status_counts = Counter(t.status for t in tasks)
        
        click.echo("\n=== Ingestion Status ===")
        click.echo(f"Total tasks: {len(tasks)}")
        for status_val, count in status_counts.items():
            click.echo(f"  {status_val}: {count}")
        
        # Count data
        raw_path = Path("data/raw")
        normalized_path = Path("data/normalized")
        analyzed_path = Path("data/analyzed")
        
        raw_count = len(list(raw_path.rglob("*.json")))
        normalized_count = len(list(normalized_path.rglob("*.json")))
        analyzed_count = len(list(analyzed_path.rglob("*.json")))
        
        click.echo(f"\nRaw data items: {raw_count}")
        click.echo(f"Normalized data items: {normalized_count}")
        click.echo(f"Analyzed data items: {analyzed_count}")
    
    asyncio.run(run())


@cli.command()
def list_industries():
    """List all configured industries."""
    seed_manager = SeedManager()
    industries = seed_manager.get_all_industries()
    
    click.echo("\n=== Configured Industries ===")
    for ind in industries:
        status = "✓" if ind.enabled else "✗"
        click.echo(f"{status} {ind.id}: {ind.name} (Priority: {ind.priority})")
        click.echo(f"   {ind.description}")
        click.echo()


@cli.command()
@click.argument('industry_id')
def list_sources(industry_id):
    """List all sources for an industry."""
    seed_manager = SeedManager()
    sources = seed_manager.get_sources_by_industry(industry_id)
    
    click.echo(f"\n=== Sources for {industry_id} ===")
    for src in sources:
        status = "✓" if src.enabled else "✗"
        click.echo(f"{status} {src.id}: {src.name}")
        click.echo(f"   Type: {src.type}")
        click.echo(f"   URL: {src.base_url}")
        click.echo()


@cli.command()
@click.argument('industry_id')
def list_seeds(industry_id):
    """List all seed URLs for an industry."""
    seed_manager = SeedManager()
    seeds = seed_manager.get_seeds_by_industry(industry_id)
    
    click.echo(f"\n=== Seed URLs for {industry_id} ===")
    for seed in seeds:
        click.echo(f"Priority {seed.priority}: {seed.url}")
        click.echo(f"  Source: {seed.source_id}, Depth: {seed.depth}")
        click.echo()


def main():
    """Main entry point."""
    try:
        cli(obj={})
    except KeyboardInterrupt:
        click.echo("\nOperation cancelled by user.")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
