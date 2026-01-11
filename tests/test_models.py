"""Tests for data models."""


from infinity_matrix.models import (
    CrawlStatus,
    CrawlTask,
    DataSource,
    Industry,
    IndustryType,
    NormalizedData,
    RawData,
    SeedUrl,
    SourceType,
)


def test_industry_model():
    """Test Industry model."""
    industry = Industry(
        id="test_industry",
        name="Test Industry",
        type=IndustryType.TECHNOLOGY,
        description="Test description",
        keywords=["test", "industry"],
        priority=5,
        enabled=True
    )

    assert industry.id == "test_industry"
    assert industry.type == IndustryType.TECHNOLOGY
    assert industry.priority == 5
    assert len(industry.keywords) == 2


def test_data_source_model():
    """Test DataSource model."""
    source = DataSource(
        id="test_source",
        name="Test Source",
        type=SourceType.GITHUB,
        base_url="https://api.github.com",
        industry_id="technology",
        enabled=True,
        rate_limit=60
    )

    assert source.id == "test_source"
    assert source.type == SourceType.GITHUB
    assert source.rate_limit == 60


def test_seed_url_model():
    """Test SeedUrl model."""
    seed = SeedUrl(
        url="https://github.com/test/repo",
        source_id="github_tech",
        industry_id="technology",
        priority=8,
        depth=2
    )

    assert str(seed.url) == "https://github.com/test/repo"
    assert seed.priority == 8
    assert seed.depth == 2


def test_crawl_task_model():
    """Test CrawlTask model."""
    task = CrawlTask(
        id="task-123",
        url="https://example.com",
        source_id="test_source",
        industry_id="technology",
        status=CrawlStatus.PENDING,
        max_attempts=3
    )

    assert task.id == "task-123"
    assert task.status == CrawlStatus.PENDING
    assert task.attempts == 0
    assert task.max_attempts == 3


def test_raw_data_model():
    """Test RawData model."""
    raw = RawData(
        id="raw-123",
        task_id="task-123",
        source_id="test_source",
        industry_id="technology",
        url="https://example.com",
        content_type="text/html",
        raw_content="<html>test</html>",
        headers={"content-type": "text/html"}
    )

    assert raw.id == "raw-123"
    assert raw.content_type == "text/html"
    assert len(raw.raw_content) > 0


def test_normalized_data_model():
    """Test NormalizedData model."""
    normalized = NormalizedData(
        id="norm-123",
        raw_data_id="raw-123",
        source_id="test_source",
        industry_id="technology",
        title="Test Title",
        description="Test description",
        content="Test content",
        entities=["entity1", "entity2"],
        keywords=["keyword1", "keyword2"],
        structured_data={"key": "value"},
        quality_score=0.8
    )

    assert normalized.title == "Test Title"
    assert normalized.quality_score == 0.8
    assert len(normalized.entities) == 2
    assert len(normalized.keywords) == 2
