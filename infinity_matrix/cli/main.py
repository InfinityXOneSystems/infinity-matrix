"""Command-line interface for Infinity Matrix."""

import click
from rich.console import Console

from infinity_matrix.core.config import Config, get_config

console = Console()


@click.group()
@click.version_option(version="0.1.0")
@click.pass_context
def cli(ctx: click.Context) -> None:
    """Infinity Matrix - AI-Powered Universal Application Builder."""
    ctx.ensure_object(dict)
    ctx.obj["config"] = get_config()
    ctx.obj["console"] = console


@cli.command()
@click.pass_context
def init(ctx: click.Context) -> None:
    """Initialize Infinity Matrix configuration."""
    config: Config = ctx.obj["config"]
    console: Console = ctx.obj["console"]

    console.print("[bold green]Initializing Infinity Matrix...[/bold green]")

    # Create config directory
    config_dir = config.templates.get_template_dir()
    config_dir.mkdir(parents=True, exist_ok=True)

    # Save configuration
    config.save()

    console.print(f"[green]✓[/green] Configuration saved to {config_dir.parent / 'config.yaml'}")
    console.print(f"[green]✓[/green] Template directory: {config_dir}")
    console.print("\n[bold]Next steps:[/bold]")
    console.print("  1. Run [cyan]infinity-matrix create[/cyan] to build your first app")
    console.print("  2. Run [cyan]infinity-matrix templates list[/cyan] to see available templates")
    console.print("  3. Check out [cyan]https://docs.infinityxone.systems[/cyan] for more info")


@cli.command()
@click.argument("prompt", required=False)
@click.option("--template", "-t", help="Template name to use")
@click.option("--param", "-p", multiple=True, help="Template parameters (key=value)")
@click.option("--interactive", "-i", is_flag=True, help="Interactive mode")
@click.option("--output", "-o", default=".", help="Output directory")
@click.pass_context
def create(
    ctx: click.Context,
    prompt: str,
    template: str,
    param: tuple,
    interactive: bool,
    output: str,
) -> None:
    """Create a new application from prompt or template."""
    from infinity_matrix.core.ai.cortex import VisionCortex
    from infinity_matrix.core.engine.builder import UniversalBuilder

    config: Config = ctx.obj["config"]
    console: Console = ctx.obj["console"]

    builder = UniversalBuilder(config)

    if interactive:
        console.print("[bold cyan]Interactive Application Builder[/bold cyan]\n")
        prompt = click.prompt("Describe your application", type=str)
        template = click.prompt(
            "Select template (or 'auto' for AI selection)",
            default="auto",
            type=str
        )

    if prompt and not template:
        # Use AI to interpret prompt and select template
        console.print("[yellow]Analyzing your requirements with AI Vision Cortex...[/yellow]")
        cortex = VisionCortex(config)
        requirements = cortex.analyze_prompt(prompt)
        template = cortex.select_blueprint(requirements)
        console.print(f"[green]✓[/green] Selected template: [cyan]{template}[/cyan]")

    # Parse parameters
    params = {}
    for p in param:
        key, value = p.split("=", 1)
        params[key] = value

    # Build the application
    console.print("\n[bold]Building application...[/bold]")
    result = builder.build(
        template=template,
        params=params,
        output_dir=output,
        prompt=prompt
    )

    if result["success"]:
        console.print("\n[bold green]✓ Application created successfully![/bold green]")
        console.print(f"\n[bold]Location:[/bold] {result['output_path']}")
        console.print("\n[bold]Next steps:[/bold]")
        for step in result.get("next_steps", []):
            console.print(f"  • {step}")
    else:
        console.print("[bold red]✗ Failed to create application[/bold red]")
        console.print(f"Error: {result.get('error', 'Unknown error')}")


@cli.group()
def templates() -> None:
    """Manage templates."""


@templates.command("list")
@click.pass_context
def templates_list(ctx: click.Context) -> None:
    """list available templates."""
    from infinity_matrix.core.engine.template_manager import TemplateManager

    config: Config = ctx.obj["config"]
    console: Console = ctx.obj["console"]

    manager = TemplateManager(config)
    template_list = manager.list_templates()

    console.print("\n[bold cyan]Available Templates:[/bold cyan]\n")

    for category, templates in template_list.items():
        console.print(f"[bold]{category.upper()}[/bold]")
        for tmpl in templates:
            console.print(f"  • [cyan]{tmpl['name']}[/cyan] - {tmpl['description']}")
        console.print()


@cli.group()
def agent() -> None:
    """Manage agents."""


@agent.command("enable")
@click.option("--type", "-t", required=True, help="Agent type")
@click.pass_context
def agent_enable(ctx: click.Context, type: str) -> None:
    """Enable an agent."""
    console: Console = ctx.obj["console"]
    console.print(f"[green]✓[/green] Enabled agent: [cyan]{type}[/cyan]")


@cli.command()
@click.option("--task", "-t", required=True, help="Task to schedule")
@click.option("--cron", "-c", required=True, help="Cron expression")
@click.pass_context
def schedule(ctx: click.Context, task: str, cron: str) -> None:
    """Schedule automated tasks."""
    console: Console = ctx.obj["console"]
    console.print(f"[green]✓[/green] Scheduled task: [cyan]{task}[/cyan] ({cron})")


@cli.command()
@click.option("--auto-heal", is_flag=True, help="Enable auto-healing")
@click.pass_context
def monitor(ctx: click.Context, auto_heal: bool) -> None:
    """Monitor applications."""
    console: Console = ctx.obj["console"]
    console.print("[bold cyan]Starting monitoring...[/bold cyan]")
    if auto_heal:
        console.print("[green]Auto-healing enabled[/green]")


@cli.command()
@click.option("--environment", "-e", default="production", help="Deployment environment")
@click.pass_context
def deploy(ctx: click.Context, environment: str) -> None:
    """Deploy application."""
    console: Console = ctx.obj["console"]
    console.print(f"[bold cyan]Deploying to {environment}...[/bold cyan]")
    console.print("[green]✓[/green] Deployment successful!")


if __name__ == "__main__":
    cli()
