"""
Command-line interface for Infinity Matrix Auto-Builder.

Provides commands for:
- Building projects from prompts or blueprints
- Checking build status
- Managing builds
- Starting the API server
"""

import asyncio
import time
from pathlib import Path
from typing import Optional

import typer
import uvicorn
import yaml
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

from infinity_matrix.core.auto_builder import AutoBuilder
from infinity_matrix.core.blueprint import Blueprint, ProjectType

app = typer.Typer(
    name="infinity-builder",
    help="Infinity Matrix Auto-Builder CLI",
    add_completion=True,
)

console = Console()
auto_builder = AutoBuilder()


@app.command()
def init(
    name: str = typer.Argument(..., help="Project name"),
    template: Optional[str] = typer.Option(None, "--template", "-t", help="Template type"),
    output: Path = typer.Option(Path("."), "--output", "-o", help="Output directory"),
) -> None:
    """Initialize a new project from a template."""
    console.print(f"[bold green]Initializing project:[/bold green] {name}")

    # Create a basic blueprint
    blueprint = Blueprint(
        name=name,
        type=ProjectType.API,
        description=f"Generated project: {name}",
    )

    # Trigger build
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Building project...", total=None)

        build_status = asyncio.run(auto_builder.build(blueprint=blueprint))

        progress.update(task, completed=True)

    console.print(f"[bold green]✓[/bold green] Project initialized: {name}")
    console.print(f"Build ID: {build_status.id}")


@app.command()
def build(
    prompt: Optional[str] = typer.Argument(None, help="Natural language prompt"),
    blueprint: Optional[Path] = typer.Option(None, "--blueprint", "-b", help="Blueprint file"),
    watch: bool = typer.Option(False, "--watch", "-w", help="Watch build progress"),
) -> None:
    """Build a project from a prompt or blueprint."""
    if not prompt and not blueprint:
        console.print("[bold red]Error:[/bold red] Must provide either a prompt or blueprint file")
        raise typer.Exit(1)

    console.print("[bold green]Starting build...[/bold green]")

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console,
    ) as progress:
        task = progress.add_task("Building...", total=None)

        build_status = asyncio.run(
            auto_builder.build(
                prompt=prompt,
                blueprint_path=blueprint,
            )
        )

        progress.update(task, completed=True)

    console.print(f"[bold green]✓[/bold green] Build created")
    console.print(f"Build ID: {build_status.id}")
    console.print(f"Status: {build_status.status}")

    if watch:
        console.print("\nWatching build progress...")
        _watch_build(build_status.id)


@app.command()
def status(
    build_id: str = typer.Argument(..., help="Build ID"),
) -> None:
    """Check the status of a build."""
    build_status = asyncio.run(auto_builder.get_build_status(build_id))

    if not build_status:
        console.print(f"[bold red]Error:[/bold red] Build {build_id} not found")
        raise typer.Exit(1)

    # Display status
    table = Table(title=f"Build Status: {build_id}")
    table.add_column("Property", style="cyan")
    table.add_column("Value", style="green")

    table.add_row("Name", build_status.name)
    table.add_row("Status", build_status.status)
    table.add_row("Progress", f"{build_status.progress}%")
    table.add_row("Phases", f"{build_status.phases_completed}/{build_status.phases_total}")
    table.add_row("Created", build_status.created_at)

    if build_status.error:
        table.add_row("Error", build_status.error, style="bold red")

    console.print(table)

    # Display artifacts if available
    if build_status.artifacts:
        console.print("\n[bold]Artifacts:[/bold]")
        for key, value in build_status.artifacts.items():
            console.print(f"  {key}: {value}")


@app.command()
def list() -> None:
    """List all builds."""
    builds = asyncio.run(auto_builder.list_builds())

    if not builds:
        console.print("No builds found")
        return

    table = Table(title="Builds")
    table.add_column("ID", style="cyan")
    table.add_column("Name", style="green")
    table.add_column("Status", style="yellow")
    table.add_column("Progress", style="blue")
    table.add_column("Created", style="magenta")

    for build in builds:
        table.add_row(
            build.id[:8] + "...",
            build.name,
            build.status,
            f"{build.progress}%",
            build.created_at,
        )

    console.print(table)


@app.command()
def cancel(
    build_id: str = typer.Argument(..., help="Build ID"),
) -> None:
    """Cancel a running build."""
    success = asyncio.run(auto_builder.cancel_build(build_id))

    if success:
        console.print(f"[bold green]✓[/bold green] Build {build_id} cancelled")
    else:
        console.print(f"[bold red]Error:[/bold red] Could not cancel build {build_id}")
        raise typer.Exit(1)


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", "--host", "-h", help="Host to bind to"),
    port: int = typer.Option(8000, "--port", "-p", help="Port to bind to"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload"),
) -> None:
    """Start the API server."""
    console.print(f"[bold green]Starting API server on {host}:{port}[/bold green]")

    uvicorn.run(
        "infinity_matrix.api.main:app",
        host=host,
        port=port,
        reload=reload,
    )


@app.command()
def agents() -> None:
    """List all registered agents."""
    vision_cortex = auto_builder.get_vision_cortex()
    agents_list = vision_cortex.list_agents()

    table = Table(title="Registered Agents")
    table.add_column("Type", style="cyan")
    table.add_column("Status", style="green")
    table.add_column("Capabilities", style="yellow")

    for agent_info in agents_list:
        capabilities = ", ".join(agent_info["capabilities"])
        table.add_row(
            agent_info["type"],
            agent_info["status"],
            capabilities,
        )

    console.print(table)


@app.command()
def validate(
    blueprint_path: Path = typer.Argument(..., help="Path to blueprint file"),
) -> None:
    """Validate a blueprint file."""
    if not blueprint_path.exists():
        console.print(f"[bold red]Error:[/bold red] File not found: {blueprint_path}")
        raise typer.Exit(1)

    try:
        with open(blueprint_path) as f:
            data = yaml.safe_load(f)

        blueprint = Blueprint(**data)
        console.print("[bold green]✓[/bold green] Blueprint is valid")
        console.print(f"\nName: {blueprint.name}")
        console.print(f"Type: {blueprint.type.value}")
        console.print(f"Description: {blueprint.description}")

    except Exception as e:
        console.print(f"[bold red]Error:[/bold red] Invalid blueprint: {str(e)}")
        raise typer.Exit(1)


def _watch_build(build_id: str) -> None:
    """Watch build progress."""
    with Progress(console=console) as progress:
        task = progress.add_task("[cyan]Building...", total=100)

        while True:
            build_status = asyncio.run(auto_builder.get_build_status(build_id))

            if not build_status:
                break

            progress.update(task, completed=build_status.progress)

            if build_status.status in ["completed", "failed", "cancelled"]:
                break

            time.sleep(2)

    build_status = asyncio.run(auto_builder.get_build_status(build_id))
    if build_status:
        if build_status.status == "completed":
            console.print("[bold green]✓[/bold green] Build completed successfully")
        elif build_status.status == "failed":
            console.print(f"[bold red]✗[/bold red] Build failed: {build_status.error}")
        elif build_status.status == "cancelled":
            console.print("[bold yellow]⚠[/bold yellow] Build cancelled")


if __name__ == "__main__":
    app()
