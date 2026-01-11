"""Scraping agents with anti-detection and data extraction."""

import asyncio
import random
from typing import Any, dict, list
from urllib.parse import urljoin, urlparse

import aiohttp
from bs4 import BeautifulSoup
from ratelimit import limits, sleep_and_retry
from tenacity import retry, stop_after_attempt, wait_exponential

from infinity_matrix.core.base import BaseCrawler
from infinity_matrix.core.config import settings


class ScrapingAgent(BaseCrawler):
    """Intelligent scraping agent with rate limiting and retry logic."""

    def __init__(self, use_proxy: bool = False, **kwargs: Any):
        """Initialize scraping agent."""
        super().__init__(kwargs)
        self.use_proxy = use_proxy
        self.session: aiohttp.ClientSession | None = None
        self.visited_urls: set[str] = set()

    async def initialize(self) -> None:
        """Initialize HTTP session."""
        headers = {
            "User-Agent": settings.scraper_user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        }

        connector = aiohttp.TCPConnector(limit=settings.scraper_concurrent_requests)

        timeout = aiohttp.ClientTimeout(total=settings.scraper_timeout)

        self.session = aiohttp.ClientSession(
            headers=headers,
            connector=connector,
            timeout=timeout,
        )

        self.log_info("scraping_agent_initialized")

    async def shutdown(self) -> None:
        """Cleanup session."""
        if self.session:
            await self.session.close()
        self.log_info("scraping_agent_shutdown")

    @sleep_and_retry
    @limits(calls=settings.scraper_rate_limit, period=1)
    @retry(
        stop=stop_after_attempt(settings.scraper_retry_attempts),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def crawl(
        self,
        url: str,
        method: str = "GET",
        data: dict[str, Any] | None = None,
        **kwargs: Any,
    ) -> dict[str, Any]:
        """
        Crawl URL with rate limiting and retry logic.

        Args:
            url: URL to crawl
            method: HTTP method
            data: Request data for POST
            **kwargs: Additional request arguments

        Returns:
            Dictionary with response data
        """
        if not self.session:
            await self.initialize()

        # Add random delay to avoid detection
        await asyncio.sleep(random.uniform(0.5, 2.0))

        self.log_info("scraping_url", url=url, method=method)

        try:
            async with self.session.request(
                method,
                url,
                data=data,
                proxy=self._get_proxy() if self.use_proxy else None,
                **kwargs,
            ) as response:
                content = await response.text()

                self.visited_urls.add(url)

                return {
                    "url": url,
                    "status": response.status,
                    "headers": dict(response.headers),
                    "content": content,
                    "success": True,
                }

        except Exception as e:
            self.log_error("scraping_failed", url=url, error=str(e))
            return {"url": url, "error": str(e), "success": False}

    async def extract_data(
        self,
        html: str,
        selectors: dict[str, str],
        parser: str = "lxml",
    ) -> dict[str, Any]:
        """
        Extract data from HTML using CSS selectors.

        Args:
            html: HTML content
            selectors: Dictionary mapping field names to CSS selectors
            parser: BeautifulSoup parser

        Returns:
            Extracted data dictionary
        """
        soup = BeautifulSoup(html, parser)
        data: dict[str, Any] = {}

        for field, selector in selectors.items():
            try:
                element = soup.select_one(selector)
                if element:
                    data[field] = element.get_text(strip=True)
                else:
                    data[field] = None
            except Exception as e:
                self.log_warning(
                    "extraction_failed",
                    field=field,
                    selector=selector,
                    error=str(e),
                )
                data[field] = None

        return data

    async def extract_links(
        self,
        html: str,
        base_url: str,
        filter_external: bool = True,
    ) -> list[str]:
        """
        Extract all links from HTML.

        Args:
            html: HTML content
            base_url: Base URL for resolving relative links
            filter_external: Only return links from same domain

        Returns:
            list of URLs
        """
        soup = BeautifulSoup(html, "lxml")
        links: list[str] = []

        base_domain = urlparse(base_url).netloc

        for anchor in soup.find_all("a", href=True):
            href = anchor["href"]
            absolute_url = urljoin(base_url, href)

            if filter_external:
                if urlparse(absolute_url).netloc == base_domain:
                    links.append(absolute_url)
            else:
                links.append(absolute_url)

        return list(set(links))  # Remove duplicates

    async def crawl_recursive(
        self,
        start_url: str,
        max_depth: int = 2,
        max_pages: int = 100,
        selectors: dict[str, str] | None = None,
    ) -> list[dict[str, Any]]:
        """
        Recursively crawl a website.

        Args:
            start_url: Starting URL
            max_depth: Maximum crawl depth
            max_pages: Maximum pages to crawl
            selectors: Data extraction selectors

        Returns:
            list of crawled page data
        """
        results: list[dict[str, Any]] = []
        to_visit: list[tuple[str, int]] = [(start_url, 0)]
        visited: set[str] = set()

        while to_visit and len(results) < max_pages:
            url, depth = to_visit.pop(0)

            if url in visited or depth > max_depth:
                continue

            visited.add(url)

            # Crawl the page
            response = await self.crawl(url)

            if not response.get("success"):
                continue

            # Extract data if selectors provided
            if selectors:
                extracted = await self.extract_data(
                    response["content"],
                    selectors,
                )
                response["data"] = extracted

            results.append(response)

            # Find more links if not at max depth
            if depth < max_depth:
                links = await self.extract_links(
                    response["content"],
                    url,
                    filter_external=True,
                )
                for link in links:
                    if link not in visited:
                        to_visit.append((link, depth + 1))

        self.log_info(
            "recursive_crawl_complete",
            start_url=start_url,
            pages_crawled=len(results),
        )

        return results

    def _get_proxy(self) -> str | None:
        """Get proxy URL if enabled."""
        if settings.proxy_enabled and settings.proxy_http:
            return settings.proxy_http
        return None

    async def download_file(self, url: str, filename: str) -> bool:
        """Download a file from URL."""
        if not self.session:
            await self.initialize()

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    with open(filename, "wb") as f:
                        f.write(await response.read())
                    self.log_info("file_downloaded", url=url, filename=filename)
                    return True
        except Exception as e:
            self.log_error("file_download_failed", url=url, error=str(e))

        return False
