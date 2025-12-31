# Architecture Documentation

## System Overview

Infinity Matrix is an enterprise-grade universal seed and ingestion system designed to collect, normalize, and analyze data from multiple business verticals at scale.

## Core Components

### 1. Seed Manager (`infinity_matrix/core/seed_manager.py`)

Manages industry configurations and seed URLs for data collection.

**Key Features:**
- Industry configuration management
- Data source registration
- Seed URL management per industry
- Dynamic source discovery

**Usage:**
```python
from infinity_matrix.core import SeedManager

seed_manager = SeedManager()
industries = seed_manager.get_all_industries()
seeds = seed_manager.get_seeds_by_industry("technology")
```

### 2. Ingestion Engine (`infinity_matrix/core/ingestion_engine.py`)

Orchestrates the data collection process across multiple sources.

**Key Features:**
- Concurrent task processing
- Automatic retry logic
- State persistence
- Resource management

**Architecture:**
- Creates crawl tasks from seed URLs
- Dispatches tasks to appropriate connectors
- Manages task lifecycle (pending → in_progress → completed/failed)
- Collects and saves raw data

### 3. State Manager (`infinity_matrix/core/state_manager.py`)

Provides persistent storage for tasks and data with resumability.

**Key Features:**
- File-based storage (upgradeable to database)
- Organized data hierarchy
- Task state tracking
- Data versioning support

**Storage Structure:**
```
data/
├── tasks/           # Crawl task metadata
├── raw/             # Raw ingested data (by industry/source)
├── normalized/      # Normalized data (by industry/source)
└── analyzed/        # LLM analysis results
```

### 4. Connector Framework (`infinity_matrix/connectors/`)

Provides extensible connectors for different data sources.

**Base Connector Interface:**
- `fetch()`: Retrieve data from source
- `can_handle()`: Check source type compatibility
- `validate_credentials()`: Authenticate with source

**Built-in Connectors:**
- **GitHubConnector**: GitHub API integration
  - Repository metadata
  - README content
  - Commit history
  - Topics and tags
  
- **WebScraperConnector**: Generic web scraping
  - HTML parsing with BeautifulSoup
  - Metadata extraction
  - Link discovery
  - Content cleaning

**Adding New Connectors:**
```python
from infinity_matrix.connectors.base import BaseConnector

class CustomConnector(BaseConnector):
    def can_handle(self, source_type: str) -> bool:
        return source_type == "custom_type"
    
    async def fetch(self, url: str, source: DataSource) -> List[RawData]:
        # Implementation
        pass
```

### 5. Data Pipeline (`infinity_matrix/pipelines/`)

Transforms raw data into normalized, structured format.

**Normalization Process:**
1. Title extraction
2. Description extraction
3. Content cleaning and formatting
4. Entity recognition
5. Keyword extraction
6. Structured data extraction
7. Quality scoring

**Quality Score Factors:**
- Content length (>1000 chars)
- Metadata richness
- Title presence
- Description presence
- Structured data availability

### 6. LLM Analysis Framework (`infinity_matrix/llm/`)

Unified interface for multiple LLM providers.

**Supported Providers:**
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Ollama**: Local models (llama2, mistral, etc.)
- **Anthropic**: Claude (via configuration)
- **Vertex AI**: Google's AI platform (via configuration)

**Analysis Pipeline:**
1. Load normalized data
2. Format prompt with data
3. Call LLM provider
4. Parse response
5. Extract insights, categories, sentiment
6. Save analysis results

**Prompt Templates:**
- `insights`: Comprehensive analysis
- `summary`: Brief summarization
- `categorization`: Category and taxonomy

**Custom Prompts:**
```python
framework = AnalysisFramework(state_manager)
framework.add_custom_prompt("technical_review", """
Review this technical content:
{content}

Provide: architecture, tech stack, code quality
""")
```

## Data Models

### Industry
- Represents a business vertical
- Contains metadata and keywords
- Priority and enabled flags

### DataSource
- Represents a data source
- Configuration for connectors
- Rate limiting and authentication

### SeedUrl
- Starting point for crawling
- Priority and depth control
- Industry/source association

### CrawlTask
- Individual crawl job
- Status tracking
- Retry logic
- Result metrics

### RawData
- Unprocessed source data
- Original content and headers
- Source metadata

### NormalizedData
- Cleaned and structured data
- Extracted entities and keywords
- Quality scoring

### AnalysisResult
- LLM analysis output
- Insights and categories
- Sentiment analysis
- Token usage tracking

## Scalability & Performance

### Concurrency
- Async/await throughout
- Configurable concurrent requests
- Batch processing support

### Rate Limiting
- Per-source rate limits
- Respectful crawling delays
- Automatic retry with backoff

### Storage
- Hierarchical file organization
- JSON-based for flexibility
- Database-ready architecture

### Distribution
- Celery task queue support (prepared)
- Redis backend support
- Docker containerization
- Kubernetes-ready

## Security

### Authentication
- API key management
- Environment-based secrets
- Credential encryption support

### Data Privacy
- Respect robots.txt
- Rate limiting compliance
- No PII storage by default

### Error Handling
- Comprehensive logging
- Exception catching
- Graceful degradation

## Extension Points

### Adding Industries
1. Create YAML in `config/industries/`
2. Define seeds and metadata
3. System auto-discovers on startup

### Adding Sources
1. Create connector class
2. Register in factory
3. Add source YAML configuration

### Adding LLM Providers
1. Inherit from `BaseLLMProvider`
2. Implement `analyze()` method
3. Register in `LLMFactory`

### Custom Pipelines
1. Create pipeline class
2. Implement processing logic
3. Integrate in workflow

## Monitoring & Observability

### Logging
- Structured logging with structlog (ready)
- Multiple log levels
- Module-specific loggers

### Metrics
- Task completion rates
- Data quality scores
- API usage tracking
- LLM token consumption

### Health Checks
- System status command
- Database connectivity
- API availability
- Storage capacity

## Best Practices

### Configuration
- Use environment variables for secrets
- Keep config.yaml in .gitignore
- Use config.example.yaml as template

### Data Collection
- Start with high-priority seeds
- Monitor rate limits
- Respect source ToS

### Analysis
- Use appropriate models for task
- Monitor token usage
- Cache analysis results

### Deployment
- Use Docker for consistency
- Configure resource limits
- Enable monitoring
- Regular backups
