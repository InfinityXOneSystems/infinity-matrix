"""Command-line interface for Infinity Matrix."""

import asyncio
from pathlib import Path

import click
from rich.console import Console
from rich.table import Table

from infinity_matrix import __version__
from infinity_matrix.core.config import Config, load_config
from infinity_matrix.core.system import InfinityMatrix

console = Console()


@click.group()
@click.version_option(version=__version__)
@click.option(
    "--config",
    type=click.Path(exists=True, path_type=Path),
    help="Configuration file path"
)
@click.pass_context
def main(ctx: click.Context, config: Path | None) -> None:
    """Infinity Matrix - Autonomous Multi-Agent System."""
    ctx.ensure_object(dict)
    ctx.obj["config_path"] = config


@main.command()
@click.pass_context
def init(ctx: click.Context) -> None:
    """Initialize Infinity Matrix configuration."""
    config = Config()
    config_path = Path.cwd() / "config.yaml"

    config.save(config_path)
    config.ensure_directories()

    console.print(f"[green]✓[/green] Configuration initialized at {config_path}")
    console.print(f"[green]✓[/green] Data directory: {config.data_dir}")


@main.command()
@click.pass_context
def start(ctx: click.Context) -> None:
    """Start the Infinity Matrix system."""
    config_path = ctx.obj.get("config_path")
    config = load_config(config_path)

    console.print("[cyan]Starting Infinity Matrix...[/cyan]")

    async def run():
        system = InfinityMatrix(config)
        try:
            await system.run_forever()
        except KeyboardInterrupt:
            console.print("\n[yellow]Shutting down...[/yellow]")
            await system.stop()

    asyncio.run(run())


@main.command()
@click.pass_context
def status(ctx: click.Context) -> None:
    """Check system status."""
    config_path = ctx.obj.get("config_path")
    config = load_config(config_path)

    async def check():
        system = InfinityMatrix(config)
        await system.start()

        status = await system.get_status()

        # Display status
        console.print("\n[bold]Infinity Matrix Status[/bold]\n")
        console.print(f"Version: {status['version']}")
        console.print(f"Running: {'[green]Yes[/green]' if status['running'] else '[red]No[/red]'}")
        console.print(f"Debug Mode: {status['config']['debug']}")
        console.print(f"Log Level: {status['config']['log_level']}")

        # Component status
        console.print("\n[bold]Components:[/bold]")
        table = Table()
        table.add_column("Component", style="cyan")
        table.add_column("Status", style="green")

        for component, enabled in status['components'].items():
            status_str = "✓ Enabled" if enabled else "✗ Disabled"
            table.add_row(component.replace("_", " ").title(), status_str)

        console.print(table)

        # Registry statistics
        registry = status['registry']
        console.print("\n[bold]Agent Registry:[/bold]")
        console.print(f"Total Agents: {registry['total_agents']}")
        console.print(f"Tasks Completed: {registry['total_tasks_completed']}")
        console.print(f"Tasks Failed: {registry['total_tasks_failed']}")
        console.print(f"Success Rate: {registry['success_rate']:.2%}")

        await system.stop()

    asyncio.run(check())


@main.command()
@click.argument("path", type=click.Path(exists=True, path_type=Path))
@click.option("--platform", "-p", default="python", help="Build platform")
@click.pass_context
def build(ctx: click.Context, path: Path, platform: str) -> None:
    """Build a project."""
    config_path = ctx.obj.get("config_path")
    config = load_config(config_path)

    async def run_build():
        system = InfinityMatrix(config)
        await system.start()

        if system._auto_builder:
            console.print(f"[cyan]Building {path} with {platform}...[/cyan]")
            build_id = await system._auto_builder.submit_build(path, platform)

            # Wait for build to complete
            while True:
                status = await system._auto_builder.get_build_status(build_id)
                if status and status["status"] in ("success", "failed", "cancelled"):
                    break
                await asyncio.sleep(1)

            if status["status"] == "success":
                console.print("[green]✓[/green] Build succeeded!")
            else:
                console.print(f"[red]✗[/red] Build failed: {status.get('error', 'Unknown error')}")

        await system.stop()

    asyncio.run(run_build())


@main.command()
@click.argument("path", type=click.Path(exists=True, path_type=Path))
@click.option("--output", "-o", type=click.Path(path_type=Path), required=True)
@click.option("--format", "-f", default="markdown", help="Output format")
@click.pass_context
def generate_docs(ctx: click.Context, path: Path, output: Path, format: str) -> None:
    """Generate documentation from source code."""
    config_path = ctx.obj.get("config_path")
    config = load_config(config_path)

    async def run():
        system = InfinityMatrix(config)
        await system.start()

        if system._doc_system:
            console.print(f"[cyan]Generating {format} documentation...[/cyan]")
            result = await system._doc_system.generate_docs(path, output, format)

            if result["status"] == "success":
                console.print(f"[green]✓[/green] Documentation generated at {output}")
            else:
                console.print("[red]✗[/red] Generation failed")

        await system.stop()

    asyncio.run(run())


@main.command()
@click.argument("url")
@click.pass_context
def scrape(ctx: click.Context, url: str) -> None:
    """Scrape a URL."""
    config_path = ctx.obj.get("config_path")
    config = load_config(config_path)

    async def run():
        system = InfinityMatrix(config)
        await system.start()

        if system._etl_system:
            console.print(f"[cyan]Scraping {url}...[/cyan]")
            result = await system._etl_system.scrape_url(url)

            console.print("[green]✓[/green] Scraped successfully")
            console.print(result)

        await system.stop()

    asyncio.run(run())


if __name__ == "__main__":
    main()
