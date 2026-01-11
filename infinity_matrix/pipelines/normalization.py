"""Data normalization pipeline."""

import logging
import uuid
from datetime import datetime

from infinity_matrix.models import NormalizedData, RawData

logger = logging.getLogger(__name__)


class NormalizationPipeline:
    """Pipeline for normalizing raw data."""

    def __init__(self):
        """Initialize normalization pipeline."""

    async def normalize(self, raw_data: RawData) -> NormalizedData:
        """Normalize raw data.

        Args:
            raw_data: Raw data to normalize

        Returns:
            Normalized data
        """
        logger.debug(f"Normalizing raw data {raw_data.id}")

        # Extract structured information
        title = self._extract_title(raw_data)
        description = self._extract_description(raw_data)
        content = self._extract_content(raw_data)
        entities = self._extract_entities(raw_data)
        keywords = self._extract_keywords(raw_data)
        structured_data = self._extract_structured_data(raw_data)
        quality_score = self._calculate_quality_score(raw_data, content)

        normalized = NormalizedData(
            id=str(uuid.uuid4()),
            raw_data_id=raw_data.id,
            source_id=raw_data.source_id,
            industry_id=raw_data.industry_id,
            title=title,
            description=description,
            content=content,
            entities=entities,
            keywords=keywords,
            structured_data=structured_data,
            quality_score=quality_score,
            normalized_at=datetime.utcnow(),
            metadata=raw_data.metadata.copy()
        )

        return normalized

    def _extract_title(self, raw_data: RawData) -> str | None:
        """Extract title from raw data."""
        # Check metadata first
        if "title" in raw_data.metadata:
            return raw_data.metadata["title"]

        # Try to extract from content for JSON
        if raw_data.content_type == "application/json":
            try:
                import json
                data = json.loads(raw_data.raw_content)
                if "name" in data:
                    return data["name"]
                if "title" in data:
                    return data["title"]
            except:
                pass

        # Try to extract from HTML title
        if "text/html" in raw_data.content_type:
            from bs4 import BeautifulSoup
            try:
                soup = BeautifulSoup(raw_data.raw_content, 'lxml')
                title_tag = soup.find('title')
                if title_tag:
                    return title_tag.get_text(strip=True)
            except:
                pass

        return None

    def _extract_description(self, raw_data: RawData) -> str | None:
        """Extract description from raw data."""
        # Check metadata
        for key in ["description", "og_description"]:
            if key in raw_data.metadata:
                return raw_data.metadata[key]

        # Try to extract from JSON
        if raw_data.content_type == "application/json":
            try:
                import json
                data = json.loads(raw_data.raw_content)
                if "description" in data:
                    return data["description"]
            except:
                pass

        return None

    def _extract_content(self, raw_data: RawData) -> str:
        """Extract main content from raw data."""
        # For JSON, convert to readable format
        if raw_data.content_type == "application/json":
            try:
                import json
                data = json.loads(raw_data.raw_content)
                # Format key fields
                content_parts = []
                for key, value in data.items():
                    if isinstance(value, (str, int, float, bool)):
                        content_parts.append(f"{key}: {value}")
                return "\n".join(content_parts)
            except:
                pass

        # For HTML, extract text
        if "text/html" in raw_data.content_type:
            from bs4 import BeautifulSoup
            try:
                soup = BeautifulSoup(raw_data.raw_content, 'lxml')
                # Remove scripts and styles
                for script in soup(["script", "style"]):
                    script.decompose()
                text = soup.get_text(separator='\n', strip=True)
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                return '\n'.join(lines)
            except:
                pass

        # Default: use raw content
        return raw_data.raw_content[:10000]  # Limit size

    def _extract_entities(self, raw_data: RawData) -> list:
        """Extract named entities from raw data."""
        entities = []

        # Extract from metadata
        if "owner" in raw_data.metadata:
            entities.append(raw_data.metadata["owner"])
        if "repo" in raw_data.metadata:
            entities.append(raw_data.metadata["repo"])
        if "author" in raw_data.metadata:
            entities.append(raw_data.metadata["author"])

        return entities

    def _extract_keywords(self, raw_data: RawData) -> list:
        """Extract keywords from raw data."""
        keywords = []

        # Extract from metadata
        if "keywords" in raw_data.metadata:
            kw = raw_data.metadata["keywords"]
            if isinstance(kw, str):
                keywords.extend([k.strip() for k in kw.split(",")])
            elif isinstance(kw, list):
                keywords.extend(kw)

        if "topics" in raw_data.metadata:
            topics = raw_data.metadata["topics"]
            if isinstance(topics, list):
                keywords.extend(topics)

        if "language" in raw_data.metadata:
            keywords.append(raw_data.metadata["language"])

        return list(set(keywords))  # Remove duplicates

    def _extract_structured_data(self, raw_data: RawData) -> dict:
        """Extract structured data fields."""
        structured = {}

        # Copy relevant metadata
        for key in ["stars", "forks", "language", "topics", "type"]:
            if key in raw_data.metadata:
                structured[key] = raw_data.metadata[key]

        return structured

    def _calculate_quality_score(self, raw_data: RawData, content: str) -> float:
        """Calculate quality score for the data."""
        score = 0.5  # Base score

        # Has title
        if raw_data.metadata.get("title"):
            score += 0.1

        # Has description
        if raw_data.metadata.get("description"):
            score += 0.1

        # Content length
        if len(content) > 1000:
            score += 0.1
        elif len(content) > 500:
            score += 0.05

        # Has metadata
        if len(raw_data.metadata) > 3:
            score += 0.1

        # Has structured data
        if raw_data.content_type == "application/json":
            score += 0.1

        return min(score, 1.0)
