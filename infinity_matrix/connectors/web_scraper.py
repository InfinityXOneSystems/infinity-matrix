"""Web scraper connector for general websites."""

import uuid
from typing import list

import httpx
from bs4 import BeautifulSoup

from infinity_matrix.connectors.base import BaseConnector
from infinity_matrix.models import DataSource, RawData, SourceType


class WebScraperConnector(BaseConnector):
    """Generic web scraper for HTML content."""

    def __init__(self):
        """Initialize web scraper connector."""
        super().__init__()
        self.client: httpx.AsyncClient = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self.client is None:
            self.client = httpx.AsyncClient(
                timeout=30.0,
                follow_redirects=True,
                headers={
                    "User-Agent": "InfinityMatrix/1.0 (+https://github.com/InfinityXOneSystems/infinity-matrix)"
                }
            )
        return self.client

    def can_handle(self, source_type: str) -> bool:
        """Check if this connector handles web scraping sources."""
        return source_type in [
            SourceType.COMPANY_WEBSITE.value,
            SourceType.NEWS.value,
            SourceType.RSS.value,
        ]

    async def fetch(self, url: str, source: DataSource) -> list[RawData]:
        """Fetch and parse HTML content from URL."""
        results = []

        try:
            client = await self._get_client()

            response = await client.get(url)
            response.raise_for_status()

            # Parse HTML
            soup = BeautifulSoup(response.text, 'lxml')

            # Extract main content
            self._extract_content(soup)

            # Extract metadata
            metadata = self._extract_metadata_from_html(soup, url)

            raw_data = RawData(
                id=str(uuid.uuid4()),
                task_id="",
                source_id=source.id,
                industry_id=source.industry_id,
                url=url,
                content_type=response.headers.get("content-type", "text/html"),
                raw_content=response.text,
                headers=dict(response.headers),
                metadata=metadata
            )

            results.append(raw_data)

            # Extract links for crawling
            links = self._extract_links(soup, url)
            metadata["extracted_links"] = links[:10]  # Limit to 10 links

        except Exception as e:
            self.logger.error(f"Error fetching from {url}: {e}", exc_info=True)

        return results

    def _extract_content(self, soup: BeautifulSoup) -> str:
        """Extract main content from HTML."""
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header"]):
            script.decompose()

        # Try to find main content
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')

        if main_content:
            text = main_content.get_text(separator='\n', strip=True)
        else:
            text = soup.get_text(separator='\n', strip=True)

        # Clean up whitespace
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        return '\n'.join(lines)

    def _extract_metadata_from_html(self, soup: BeautifulSoup, url: str) -> dict:
        """Extract metadata from HTML."""
        metadata = {
            "type": "web_page",
            "url": url,
        }

        # Extract title
        title = soup.find('title')
        if title:
            metadata["title"] = title.get_text(strip=True)

        # Extract meta description
        description = soup.find('meta', attrs={'name': 'description'})
        if description and description.get('content'):
            metadata["description"] = description['content']

        # Extract keywords
        keywords = soup.find('meta', attrs={'name': 'keywords'})
        if keywords and keywords.get('content'):
            metadata["keywords"] = keywords['content']

        # Extract Open Graph data
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            metadata["og_title"] = og_title['content']

        og_description = soup.find('meta', property='og:description')
        if og_description and og_description.get('content'):
            metadata["og_description"] = og_description['content']

        return metadata

    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> list[str]:
        """Extract links from HTML."""
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            # Make absolute URLs
            if href.startswith('http'):
                links.append(href)
            elif href.startswith('/'):
                from urllib.parse import urljoin
                links.append(urljoin(base_url, href))

        return list(set(links))  # Remove duplicates

    async def close(self):
        """Close the HTTP client."""
        if self.client:
            await self.client.aclose()
