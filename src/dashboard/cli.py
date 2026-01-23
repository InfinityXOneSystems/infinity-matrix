"""CLI dashboard for monitoring agent health and system status."""
import sys
import time
from datetime import datetime

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from agents.health import HealthMonitor, WorkflowTracker
from agents.orchestrator import CDOrchestrator
from exporters.artifact_exporter import ArtifactExporter, ComplianceTracker

console = Console()


def create_agent_table(agents):
    """Create a table showing agent status."""
    table = Table(title="🤖 Active Agents", show_header=True, header_style="bold magenta")
    table.add_column("Agent ID", style="cyan", width=25)
    table.add_column("Type", style="yellow", width=15)
    table.add_column("Status", width=12)
    table.add_column("Success", justify="right", width=8)
    table.add_column("Errors", justify="right", width=8)
    table.add_column("Last Heartbeat", width=20)

    for agent_id, agent_data in agents.items():
        status = agent_data["status"]
        if status == "healthy":
            status_display = "[green]✓ healthy[/green]"
        elif status == "degraded":
            status_display = "[yellow]⚠ degraded[/yellow]"
        else:
            status_display = "[red]✗ failed[/red]"

        last_hb = datetime.fromisoformat(agent_data["last_heartbeat"]).strftime("%Y-%m-%d %H:%M:%S")

        table.add_row(
            agent_id,
            agent_data["type"],
            status_display,
            str(agent_data["success_count"]),
            str(agent_data["error_count"]),
            last_hb
        )

    return table


def create_workflow_table(workflows):
    """Create a table showing recent workflows."""
    table = Table(title="📝 Recent Workflows", show_header=True, header_style="bold magenta")
    table.add_column("Workflow ID", style="cyan", width=30)
    table.add_column("Status", width=15)
    table.add_column("Timestamp", width=20)

    for workflow in workflows[:10]:
        status = workflow["status"]
        if status == "success" or status == "completed":
            status_display = "[green]✓ " + status + "[/green]"
        else:
            status_display = "[red]✗ " + status + "[/red]"

        timestamp = datetime.fromisoformat(workflow["timestamp"]).strftime("%Y-%m-%d %H:%M:%S")

        table.add_row(
            workflow["workflow_id"],
            status_display,
            timestamp
        )

    return table


def create_summary_panel(orchestrator):
    """Create a summary panel with key metrics."""
    status = orchestrator.get_system_status()

    summary = f"""
[bold cyan]System Health Overview[/bold cyan]

Total Agents: [bold]{status['total_agents']}[/bold]
├─ [green]Healthy: {status['healthy_agents']}[/green]
├─ [yellow]Degraded: {status['degraded_agents']}[/yellow]
└─ [red]Failed: {status['failed_agents']}[/red]

Recent Workflows: [bold]{status['recent_workflows']}[/bold]

Last Updated: {datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")}
"""

    return Panel(summary, title="📊 System Status", border_style="blue")


@click.group()
def cli():
    """Infinity Matrix - Autonomous CD System CLI Dashboard."""


@cli.command()
@click.option('--refresh', '-r', default=10, help='Refresh interval in seconds (0 to disable)')
def monitor(refresh):
    """Monitor system status in real-time."""
    orchestrator = CDOrchestrator()
    health_monitor = HealthMonitor()
    workflow_tracker = WorkflowTracker()

    def generate_display():
        """Generate the dashboard display."""
        console.clear()

        # Header
        console.print("\n[bold magenta]🚀 Infinity Matrix - Autonomous CD System[/bold magenta]\n")

        # Summary panel
        console.print(create_summary_panel(orchestrator))
        console.print()

        # Agent table
        agents = health_monitor.get_all_agents()
        if agents:
            console.print(create_agent_table(agents))
        else:
            console.print("[yellow]No agents registered yet[/yellow]")

        console.print()

        # Workflow table
        workflows = workflow_tracker.get_recent_workflows(10)
        if workflows:
            console.print(create_workflow_table(workflows))
        else:
            console.print("[yellow]No workflows executed yet[/yellow]")

    if refresh > 0:
        try:
            while True:
                generate_display()
                console.print(f"\n[dim]Refreshing every {refresh}s... Press Ctrl+C to exit[/dim]")
                time.sleep(refresh)
        except KeyboardInterrupt:
            console.print("\n[yellow]Monitoring stopped[/yellow]")
    else:
        generate_display()


@cli.command()
def status():
    """Show current system status."""
    orchestrator = CDOrchestrator()
    status = orchestrator.get_system_status()

    console.print("\n[bold cyan]System Status:[/bold cyan]")
    console.print(f"Total Agents: {status['total_agents']}")
    console.print(f"Healthy Agents: [green]{status['healthy_agents']}[/green]")
    console.print(f"Degraded Agents: [yellow]{status['degraded_agents']}[/yellow]")
    console.print(f"Failed Agents: [red]{status['failed_agents']}[/red]")
    console.print(f"Recent Workflows: {status['recent_workflows']}")


@cli.command()
def agents():
    """list all registered agents."""
    health_monitor = HealthMonitor()
    all_agents = health_monitor.get_all_agents()

    if not all_agents:
        console.print("[yellow]No agents registered[/yellow]")
        return

    console.print(create_agent_table(all_agents))


@cli.command()
def workflows():
    """Show recent workflow executions."""
    workflow_tracker = WorkflowTracker()
    recent = workflow_tracker.get_recent_workflows(20)

    if not recent:
        console.print("[yellow]No workflows executed[/yellow]")
        return

    console.print(create_workflow_table(recent))


@cli.command()
def run():
    """Run the autonomous CD pipeline."""
    console.print("\n[bold cyan]🚀 Starting Autonomous CD Pipeline...[/bold cyan]\n")

    orchestrator = CDOrchestrator()

    try:
        with console.status("[bold green]Running pipeline..."):
            result = orchestrator.run_full_pipeline()

        console.print("\n[bold green]✓ Pipeline completed successfully![/bold green]")
        console.print(f"Duration: {result['duration_seconds']:.2f}s")
        console.print(f"Steps completed: {len(result['steps'])}")

        for step in result['steps']:
            status_icon = "✓" if step['status'] == 'completed' else "✗"
            console.print(f"  {status_icon} {step['name']}")

    except Exception as e:
        console.print(f"\n[bold red]✗ Pipeline failed: {e}[/bold red]")
        sys.exit(1)


@cli.command()
@click.argument('format', type=click.Choice(['markdown', 'csv', 'json', 'all']))
def export(format):
    """Export audit artifacts in specified format."""
    exporter = ArtifactExporter()

    console.print(f"\n[bold cyan]Exporting data in {format} format...[/bold cyan]\n")

    try:
        if format == 'all':
            results = exporter.export_all()
            for fmt, file_path in results.items():
                console.print(f"[green]✓[/green] {fmt}: {file_path}")
        else:
            if format == 'markdown':
                file_path = exporter.export_markdown()
            elif format == 'csv':
                file_path = exporter.export_csv()
            elif format == 'json':
                file_path = exporter.export_json()

            console.print(f"[green]✓[/green] Exported to: {file_path}")

    except Exception as e:
        console.print(f"[bold red]✗ Export failed: {e}[/bold red]")
        sys.exit(1)


@cli.command()
def compliance():
    """Show compliance report."""
    tracker = ComplianceTracker()
    report = tracker.generate_compliance_report()

    console.print("\n[bold cyan]Compliance Report[/bold cyan]\n")
    console.print(f"Total Features: {report['total_features']}")
    console.print(f"Operational: [green]{report['operational_count']}[/green]")
    console.print(f"Missing: [red]{report['missing_count']}[/red]")
    console.print(f"Compliance: [bold]{report['compliance_percentage']:.1f}%[/bold]\n")

    # Show operational features
    console.print("[bold green]✓ Operational Features:[/bold green]")
    for feature in report['operational_features']:
        console.print(f"  • {feature['feature']}: {feature['description']}")

    # Show missing features
    if report['missing_features']:
        console.print("\n[bold red]✗ Missing Features:[/bold red]")
        for feature in report['missing_features']:
            console.print(f"  • {feature['feature']}: {feature['description']}")


def main():
    """Main entry point."""
    cli()


if __name__ == '__main__':
    main()
