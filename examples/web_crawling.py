"""Example: Web crawling and data extraction."""

import asyncio

from infinity_matrix.crawlers import ScrapingAgent


async def main():
    """Run web crawling example."""
    print("=== Web Crawling Example ===\n")

    # Example 1: Simple scraping
    print("Example 1: Simple HTTP scraping")
    print("-" * 50)

    agent = ScrapingAgent()
    await agent.initialize()

    result = await agent.crawl("https://example.com")

    if result.get("success"):
        print(f"URL: {result['url']}")
        print(f"Status: {result['status']}")
        print(f"Content length: {len(result['content'])} bytes")
    else:
        print(f"Error: {result.get('error')}")

    await agent.shutdown()

    print("\n" + "="*50 + "\n")

    # Example 2: Data extraction
    print("Example 2: Data extraction with selectors")
    print("-" * 50)

    agent = ScrapingAgent()
    await agent.initialize()

    result = await agent.crawl("https://example.com")

    if result.get("success"):
        # Extract data
        selectors = {
            "title": "h1",
            "content": "p",
        }

        data = await agent.extract_data(result["content"], selectors)
        print("Extracted data:")
        for key, value in data.items():
            print(f"  {key}: {value[:100] if value else 'N/A'}...")

    await agent.shutdown()

    print("\n" + "="*50 + "\n")

    # Example 3: Headless browser (commented out to avoid installation requirements)
    print("Example 3: Headless browser crawling (simulated)")
    print("-" * 50)
    print("Would use Playwright for JavaScript rendering")
    print("Supports anti-detection, screenshots, and form filling")

    # Uncomment to actually run:
    # crawler = HeadlessCrawler(anti_detection=True)
    # await crawler.initialize()
    # result = await crawler.crawl("https://example.com", screenshot=True)
    # await crawler.shutdown()

    print("\nCrawling examples complete!")


if __name__ == "__main__":
    asyncio.run(main())
