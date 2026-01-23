"""
Infinity-Matrix CLI tool.
"""
import json

import click
import httpx

BASE_URL = "http://localhost:8000"


@click.group()
def cli():
    """Infinity-Matrix CLI - Enterprise AI Platform Management"""


@cli.command()
def status():
    """Check system status."""
    response = httpx.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        data = response.json()
        click.echo(f"Status: {data['status']}")
        click.echo(f"Version: {data['version']}")
    else:
        click.echo("System is down", err=True)


@cli.group()
def security():
    """Security operations."""


@security.command()
@click.option('--full', is_flag=True, help='Run full security scan')
def scan(full):
    """Run security scan."""
    click.echo("Running security scan...")
    response = httpx.post(
        f"{BASE_URL}/api/security/scan",
        json={"include_containers": full}
    )

    if response.status_code == 200:
        data = response.json()
        click.echo(f"Scan ID: {data['scan_id']}")
        click.echo(f"Total findings: {data['summary']['total_findings']}")
        click.echo("✓ Security scan completed")
    else:
        click.echo("✗ Security scan failed", err=True)


@cli.group()
def cost():
    """Cost analysis operations."""


@cost.command()
@click.option('--period', default='30d', help='Analysis period')
def analyze(period):
    """Analyze costs."""
    click.echo(f"Analyzing costs for period: {period}")
    response = httpx.get(f"{BASE_URL}/api/monitoring/costs/realtime")

    if response.status_code == 200:
        data = response.json()
        click.echo(f"Current hourly: ${data['costs']['current_hourly']:.2f}")
        click.echo(f"Current daily: ${data['costs']['current_daily']:.2f}")
        click.echo(f"Projected monthly: ${data['costs']['projected_monthly']:.2f}")
        click.echo(f"Alert level: {data['alert_level']}")
    else:
        click.echo("✗ Cost analysis failed", err=True)


@cli.group()
def dr():
    """Disaster recovery operations."""


@dr.command()
@click.option('--type', default='full', help='Backup type (full/incremental)')
def backup(type):
    """Create backup."""
    click.echo(f"Creating {type} backup...")
    response = httpx.post(
        f"{BASE_URL}/api/dr/backup",
        json={"backup_type": type, "description": f"{type} backup via CLI"}
    )

    if response.status_code == 200:
        data = response.json()
        click.echo(f"Backup ID: {data['id']}")
        click.echo(f"Status: {data['status']}")
        click.echo("✓ Backup completed")
    else:
        click.echo("✗ Backup failed", err=True)


@dr.command()
@click.option('--backup-id', required=True, help='Backup ID to restore')
def restore(backup_id):
    """Restore from backup."""
    click.echo(f"Restoring from backup: {backup_id}")
    response = httpx.post(
        f"{BASE_URL}/api/dr/restore",
        json={"backup_id": backup_id}
    )

    if response.status_code == 200:
        data = response.json()
        click.echo(f"Status: {data['status']}")
        click.echo("✓ Restore completed")
    else:
        click.echo("✗ Restore failed", err=True)


@cli.group()
def docs():
    """Documentation operations."""


@docs.command()
@click.argument('query')
def search(query):
    """Search documentation."""
    click.echo(f"Searching for: {query}")
    response = httpx.get(
        f"{BASE_URL}/api/docs/search",
        params={"query": query}
    )

    if response.status_code == 200:
        results = response.json()
        click.echo(f"Found {len(results)} results:")
        for doc in results[:5]:
            click.echo(f"  - {doc['title']} ({doc['category']})")
    else:
        click.echo("✗ Search failed", err=True)


@cli.group()
def feedback():
    """Feedback operations."""


@feedback.command()
@click.option('--type', required=True, help='Feedback type (bug/feature/improvement)')
@click.option('--message', required=True, help='Feedback message')
def submit(type, message):
    """Submit feedback."""
    click.echo("Submitting feedback...")
    response = httpx.post(
        f"{BASE_URL}/api/feedback/submit",
        json={
            "user_id": "cli-user",
            "type": type,
            "message": message
        }
    )

    if response.status_code == 200:
        data = response.json()
        click.echo(f"Feedback ID: {data['id']}")
        click.echo("✓ Feedback submitted")
    else:
        click.echo("✗ Feedback submission failed", err=True)


@cli.group()
def incidents():
    """Incident management."""


@incidents.command()
@click.option('--severity', default='medium', help='Incident severity')
def list(severity):
    """list incidents."""
    response = httpx.get(f"{BASE_URL}/api/security/incidents")

    if response.status_code == 200:
        incidents = response.json()
        click.echo(f"Total incidents: {len(incidents)}")
        for inc in incidents[:10]:
            click.echo(f"  {inc['incident_id']}: {inc['title']} [{inc['severity']}]")
    else:
        click.echo("✗ Failed to list incidents", err=True)


@incidents.command()
@click.argument('incident_id')
def get(incident_id):
    """Get incident details."""
    response = httpx.get(f"{BASE_URL}/api/security/incidents/{incident_id}")

    if response.status_code == 200:
        inc = response.json()
        click.echo(json.dumps(inc, indent=2))
    else:
        click.echo("✗ Incident not found", err=True)


def main():
    """Main entry point."""
    cli()


if __name__ == '__main__':
    main()
