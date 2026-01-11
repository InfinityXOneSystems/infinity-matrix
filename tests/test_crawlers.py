"""Tests for crawler modules."""

import pytest

from infinity_matrix.crawlers import HeadlessCrawler, ScrapingAgent


@pytest.mark.asyncio
async def test_scraping_agent_initialization():
    """Test scraping agent initialization."""
    agent = ScrapingAgent()
    await agent.initialize()
    assert agent is not None
    await agent.shutdown()


@pytest.mark.asyncio
async def test_scraping_agent_crawl():
    """Test scraping agent crawl."""
    agent = ScrapingAgent()
    await agent.initialize()

    result = await agent.crawl("https://example.com")

    await agent.shutdown()

    assert result is not None
    assert "url" in result
    assert result["success"] is True


@pytest.mark.asyncio
@pytest.mark.slow
async def test_headless_crawler_initialization():
    """Test headless crawler initialization."""
    crawler = HeadlessCrawler()
    await crawler.initialize()
    assert crawler.browser is not None
    await crawler.shutdown()
