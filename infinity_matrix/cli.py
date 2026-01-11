"""Command-line interface for Infinity Matrix."""

import asyncio

import click
from rich.console import Console
from rich.table import Table

from infinity_matrix.core.config import settings

console = Console()


@click.group()
@click.version_option(version="1.0.0")
def main() -> None:
    """Infinity Matrix - Enterprise Intelligence Platform."""


@main.command()
@click.option("--host", default=settings.api_host, help="API host")
@click.option("--port", default=settings.api_port, help="API port")
@click.option("--reload", is_flag=True, help="Enable auto-reload")
def serve(host: str, port: int, reload: bool) -> None:
    """Start the API server."""
    import uvicorn

    console.print("[bold green]Starting Infinity Matrix API Server[/bold green]")
    console.print(f"Host: {host}")
    console.print(f"Port: {port}")
    console.print(f"Reload: {reload}")

    uvicorn.run(
        "infinity_matrix.api.server:app",
        host=host,
        port=port,
        reload=reload,
    )


@main.command()
@click.argument("symbol")
@click.option("--timeframe", default="1d", help="Timeframe")
def analyze_stock(symbol: str, timeframe: str) -> None:
    """Analyze a stock."""
    async def _analyze() -> None:
        from infinity_matrix.industries.finance import FinancialAnalyzer

        analyzer = FinancialAnalyzer()
        await analyzer.initialize()

        console.print(f"[bold]Analyzing {symbol}...[/bold]")
        result = await analyzer.analyze_stock(symbol, timeframe)

        await analyzer.shutdown()

        if result.get("success"):
            table = Table(title=f"Analysis for {symbol}")
            table.add_column("Metric", style="cyan")
            table.add_column("Value", style="green")

            for key, value in result.items():
                if key not in ["success", "timestamp"]:
                    table.add_row(str(key), str(value))

            console.print(table)
        else:
            console.print(f"[red]Error: {result.get('error')}[/red]")

    asyncio.run(_analyze())


@main.command()
@click.argument("location")
@click.option("--lead-type", default="buyer", help="Lead type")
def discover_leads(location: str, lead_type: str) -> None:
    """Discover real estate leads."""
    async def _discover() -> None:
        from infinity_matrix.industries.real_estate import RealEstateEngine

        engine = RealEstateEngine()
        await engine.initialize()

        console.print(f"[bold]Discovering {lead_type} leads in {location}...[/bold]")
        leads = await engine.discover_leads(location, {"lead_type": lead_type})

        await engine.shutdown()

        table = Table(title=f"Leads in {location}")
        table.add_column("ID", style="cyan")
        table.add_column("Name", style="green")
        table.add_column("Email", style="blue")
        table.add_column("Score", style="yellow")

        for lead in leads[:10]:  # Show first 10
            table.add_row(
                lead["id"],
                lead["contact"]["name"],
                lead["contact"]["email"],
                f"{lead['score']:.2f}",
            )

        console.print(table)
        console.print(f"\nTotal leads: {len(leads)}")

    asyncio.run(_discover())


@main.command()
@click.argument("url")
@click.option("--headless/--no-headless", default=True, help="Use headless browser")
def crawl(url: str, headless: bool) -> None:
    """Crawl a URL."""
    async def _crawl() -> None:
        if headless:
            from infinity_matrix.crawlers import HeadlessCrawler
            crawler = HeadlessCrawler()
        else:
            from infinity_matrix.crawlers import ScrapingAgent
            crawler = ScrapingAgent()

        await crawler.initialize()

        console.print(f"[bold]Crawling {url}...[/bold]")
        result = await crawler.crawl(url)

        await crawler.shutdown()

        if result.get("success", True):
            console.print("[green]Crawl successful![/green]")
            console.print(f"Title: {result.get('title', 'N/A')}")
            console.print(f"Status: {result.get('status', 'N/A')}")
        else:
            console.print(f"[red]Error: {result.get('error')}[/red]")

    asyncio.run(_crawl())


@main.command()
@click.argument("text")
@click.option("--method", default="vader", help="Analysis method")
def sentiment(text: str, method: str) -> None:
    """Analyze sentiment of text."""
    async def _sentiment() -> None:
        from infinity_matrix.analytics.sentiment import SentimentAnalyzer

        analyzer = SentimentAnalyzer()

        console.print("[bold]Analyzing sentiment...[/bold]")
        result = await analyzer.analyze_text(text, method)

        if result.get("success"):
            console.print(f"Score: [bold]{result['score']:.2f}[/bold]")
            console.print(f"Label: [bold]{result['label']}[/bold]")
        else:
            console.print(f"[red]Error: {result.get('error')}[/red]")

    asyncio.run(_sentiment())


@main.command()
@click.argument("indicator")
@click.option("--region", default="US", help="Region code")
def economic(indicator: str, region: str) -> None:
    """Get economic indicator."""
    async def _economic() -> None:
        from infinity_matrix.industries.economic import EconomicAnalyzer

        analyzer = EconomicAnalyzer()
        await analyzer.initialize()

        console.print(f"[bold]Fetching {indicator} for {region}...[/bold]")
        result = await analyzer.get_indicator(indicator, region)

        await analyzer.shutdown()

        if result.get("success"):
            console.print(f"Current Value: [bold]{result['current_value']:.2f}[/bold]")
            console.print(f"Change: [bold]{result.get('change', 0):.2f}[/bold]")
            console.print(f"Trend: [bold]{result.get('trend', 'N/A')}[/bold]")
        else:
            console.print(f"[red]Error: {result.get('error')}[/red]")

    asyncio.run(_economic())


@main.command()
def version() -> None:
    """Show version information."""
    from infinity_matrix import __version__

    console.print(f"[bold]Infinity Matrix v{__version__}[/bold]")
    console.print(f"Environment: {settings.environment}")


if __name__ == "__main__":
    main()
