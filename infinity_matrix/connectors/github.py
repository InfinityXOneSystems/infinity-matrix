"""GitHub connector for repository and code data."""

import uuid
from typing import list

import httpx

from infinity_matrix.connectors.base import BaseConnector
from infinity_matrix.models import DataSource, RawData, SourceType


class GitHubConnector(BaseConnector):
    """Connector for GitHub repositories and data."""

    def __init__(self):
        """Initialize GitHub connector."""
        super().__init__()
        self.base_url = "https://api.github.com"
        self.client: httpx.AsyncClient = None

    async def _get_client(self, source: DataSource) -> httpx.AsyncClient:
        """Get or create HTTP client with authentication."""
        if self.client is None:
            headers = {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "InfinityMatrix/1.0"
            }

            # Add authentication if available
            if source.authentication_required and source.credentials_key:
                # In production, retrieve from secure storage
                token = source.metadata.get("token")
                if token:
                    headers["Authorization"] = f"Bearer {token}"

            self.client = httpx.AsyncClient(headers=headers, timeout=30.0)

        return self.client

    def can_handle(self, source_type: str) -> bool:
        """Check if this connector handles GitHub sources."""
        return source_type == SourceType.GITHUB.value

    async def fetch(self, url: str, source: DataSource) -> list[RawData]:
        """Fetch data from GitHub.

        Handles:
        - Repository metadata
        - README content
        - Repository topics
        - Recent commits
        """
        results = []

        try:
            client = await self._get_client(source)

            # Extract owner and repo from URL
            parts = url.replace("https://github.com/", "").split("/")
            if len(parts) < 2:
                self.logger.warning(f"Invalid GitHub URL: {url}")
                return results

            owner, repo = parts[0], parts[1]

            # Fetch repository metadata
            repo_data = await self._fetch_repository(client, owner, repo, source)
            if repo_data:
                results.append(repo_data)

            # Fetch README
            readme_data = await self._fetch_readme(client, owner, repo, source)
            if readme_data:
                results.append(readme_data)

            # Fetch recent activity
            activity_data = await self._fetch_recent_activity(client, owner, repo, source)
            results.extend(activity_data)

        except Exception as e:
            self.logger.error(f"Error fetching from GitHub {url}: {e}", exc_info=True)

        return results

    async def _fetch_repository(
        self,
        client: httpx.AsyncClient,
        owner: str,
        repo: str,
        source: DataSource
    ) -> RawData:
        """Fetch repository metadata."""
        url = f"{self.base_url}/repos/{owner}/{repo}"

        response = await client.get(url)
        response.raise_for_status()

        data = response.json()

        return RawData(
            id=str(uuid.uuid4()),
            task_id="",  # Will be set by ingestion engine
            source_id=source.id,
            industry_id=source.industry_id,
            url=url,
            content_type="application/json",
            raw_content=response.text,
            headers=dict(response.headers),
            metadata={
                "type": "repository_metadata",
                "owner": owner,
                "repo": repo,
                "stars": data.get("stargazers_count", 0),
                "forks": data.get("forks_count", 0),
                "language": data.get("language"),
                "topics": data.get("topics", []),
            }
        )

    async def _fetch_readme(
        self,
        client: httpx.AsyncClient,
        owner: str,
        repo: str,
        source: DataSource
    ) -> RawData:
        """Fetch repository README."""
        url = f"{self.base_url}/repos/{owner}/{repo}/readme"

        try:
            response = await client.get(url)
            response.raise_for_status()

            data = response.json()

            # Get the actual content (base64 decoded)
            import base64
            content = base64.b64decode(data.get("content", "")).decode("utf-8")

            return RawData(
                id=str(uuid.uuid4()),
                task_id="",
                source_id=source.id,
                industry_id=source.industry_id,
                url=url,
                content_type="text/markdown",
                raw_content=content,
                headers=dict(response.headers),
                metadata={
                    "type": "readme",
                    "owner": owner,
                    "repo": repo,
                    "name": data.get("name"),
                    "path": data.get("path"),
                }
            )
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                self.logger.debug(f"No README found for {owner}/{repo}")
            return None

    async def _fetch_recent_activity(
        self,
        client: httpx.AsyncClient,
        owner: str,
        repo: str,
        source: DataSource
    ) -> list[RawData]:
        """Fetch recent commits and activity."""
        results = []
        url = f"{self.base_url}/repos/{owner}/{repo}/commits"

        try:
            response = await client.get(url, params={"per_page": 10})
            response.raise_for_status()

            commits = response.json()

            for commit in commits[:5]:  # Limit to 5 most recent
                results.append(RawData(
                    id=str(uuid.uuid4()),
                    task_id="",
                    source_id=source.id,
                    industry_id=source.industry_id,
                    url=commit.get("html_url", url),
                    content_type="application/json",
                    raw_content=str(commit),
                    headers=dict(response.headers),
                    metadata={
                        "type": "commit",
                        "owner": owner,
                        "repo": repo,
                        "sha": commit.get("sha"),
                        "message": commit.get("commit", {}).get("message"),
                        "author": commit.get("commit", {}).get("author", {}).get("name"),
                        "date": commit.get("commit", {}).get("author", {}).get("date"),
                    }
                ))
        except Exception as e:
            self.logger.debug(f"Could not fetch commits for {owner}/{repo}: {e}")

        return results

    async def close(self):
        """Close the HTTP client."""
        if self.client:
            await self.client.aclose()
