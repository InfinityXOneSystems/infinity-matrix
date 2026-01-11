"""Headless crawler engine using Playwright."""

import asyncio
from typing import Any, dict, list

from playwright.async_api import Browser, BrowserContext, Page, async_playwright
from tenacity import retry, stop_after_attempt, wait_exponential

from infinity_matrix.core.base import BaseCrawler
from infinity_matrix.core.config import settings


class HeadlessCrawler(BaseCrawler):
    """Advanced headless crawler with anti-detection capabilities."""

    def __init__(self, anti_detection: bool = True, **kwargs: Any):
        """Initialize crawler."""
        super().__init__(kwargs)
        self.anti_detection = anti_detection
        self.browser: Browser | None = None
        self.context: BrowserContext | None = None
        self._playwright = None

    async def initialize(self) -> None:
        """Initialize browser resources."""
        self._playwright = await async_playwright().start()

        # Launch browser with anti-detection
        self.browser = await self._playwright.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ] if self.anti_detection else [],
        )

        # Create context with realistic settings
        self.context = await self.browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=settings.scraper_user_agent,
            locale="en-US",
            timezone_id="America/New_York",
        )

        # Add anti-detection scripts
        if self.anti_detection:
            await self.context.add_init_script("""
                // Override the navigator properties
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined
                });

                // Mock plugins
                Object.defineProperty(navigator, 'plugins', {
                    get: () => [1, 2, 3, 4, 5]
                });

                // Mock languages
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en']
                });
            """)

        self.log_info("crawler_initialized", anti_detection=self.anti_detection)

    async def shutdown(self) -> None:
        """Cleanup browser resources."""
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self._playwright:
            await self._playwright.stop()
        self.log_info("crawler_shutdown")

    @retry(
        stop=stop_after_attempt(settings.scraper_retry_attempts),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def crawl(
        self,
        url: str,
        selectors: dict[str, str] | None = None,
        wait_for_selector: str | None = None,
        screenshot: bool = False,
        javascript: bool = True,
    ) -> dict[str, Any]:
        """
        Crawl a URL and extract data.

        Args:
            url: URL to crawl
            selectors: Dictionary of CSS selectors to extract data
            wait_for_selector: Wait for this selector before extracting
            screenshot: Take a screenshot
            javascript: Enable JavaScript

        Returns:
            Dictionary with extracted data
        """
        if not self.context:
            await self.initialize()

        self.log_info("crawling_url", url=url)

        page = await self.context.new_page()

        try:
            # Navigate to URL
            response = await page.goto(
                url,
                wait_until="networkidle",
                timeout=settings.scraper_timeout * 1000,
            )

            # Wait for selector if specified
            if wait_for_selector:
                await page.wait_for_selector(wait_for_selector, timeout=10000)

            # Extract data using selectors
            data: dict[str, Any] = {
                "url": url,
                "status": response.status if response else None,
                "title": await page.title(),
            }

            if selectors:
                for key, selector in selectors.items():
                    try:
                        element = await page.query_selector(selector)
                        if element:
                            data[key] = await element.inner_text()
                    except Exception as e:
                        self.log_warning(
                            "selector_extraction_failed",
                            selector=selector,
                            error=str(e),
                        )
                        data[key] = None

            # Take screenshot if requested
            if screenshot:
                data["screenshot"] = await page.screenshot(full_page=True)

            # Get HTML content
            data["html"] = await page.content()

            self.log_info("crawl_successful", url=url)
            return data

        except Exception as e:
            self.log_error("crawl_failed", url=url, error=str(e))
            raise
        finally:
            await page.close()

    async def crawl_multiple(
        self,
        urls: list[str],
        concurrent: int = 5,
        **kwargs: Any,
    ) -> list[dict[str, Any]]:
        """
        Crawl multiple URLs concurrently.

        Args:
            urls: list of URLs to crawl
            concurrent: Number of concurrent requests
            **kwargs: Arguments to pass to crawl()

        Returns:
            list of results
        """
        semaphore = asyncio.Semaphore(concurrent)

        async def crawl_with_semaphore(url: str) -> dict[str, Any]:
            async with semaphore:
                try:
                    return await self.crawl(url, **kwargs)
                except Exception as e:
                    self.log_error("crawl_failed_in_batch", url=url, error=str(e))
                    return {"url": url, "error": str(e), "success": False}

        results = await asyncio.gather(
            *[crawl_with_semaphore(url) for url in urls],
            return_exceptions=False,
        )

        return results

    async def execute_javascript(self, page: Page, script: str) -> Any:
        """Execute JavaScript on a page."""
        return await page.evaluate(script)

    async def wait_and_click(self, page: Page, selector: str) -> None:
        """Wait for element and click it."""
        await page.wait_for_selector(selector)
        await page.click(selector)

    async def fill_form(self, page: Page, form_data: dict[str, str]) -> None:
        """Fill a form with data."""
        for selector, value in form_data.items():
            await page.fill(selector, value)


class SeleniumCrawler(BaseCrawler):
    """Selenium-based crawler for compatibility."""

    def __init__(self, **kwargs: Any):
        """Initialize Selenium crawler."""
        super().__init__(kwargs)
        self.driver: Any | None = None

    async def initialize(self) -> None:
        """Initialize Selenium driver."""
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options

        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument(f"user-agent={settings.scraper_user_agent}")

        self.driver = webdriver.Chrome(options=options)
        self.log_info("selenium_crawler_initialized")

    async def shutdown(self) -> None:
        """Cleanup Selenium resources."""
        if self.driver:
            self.driver.quit()
        self.log_info("selenium_crawler_shutdown")

    async def crawl(self, url: str, **kwargs: Any) -> dict[str, Any]:
        """Crawl URL using Selenium."""
        if not self.driver:
            await self.initialize()

        self.log_info("selenium_crawling_url", url=url)

        try:
            self.driver.get(url)
            await asyncio.sleep(2)  # Wait for page load

            return {
                "url": url,
                "title": self.driver.title,
                "html": self.driver.page_source,
                "success": True,
            }
        except Exception as e:
            self.log_error("selenium_crawl_failed", url=url, error=str(e))
            return {"url": url, "error": str(e), "success": False}
