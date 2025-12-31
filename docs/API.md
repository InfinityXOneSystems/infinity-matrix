# API Reference

## Command-Line Interface

### Global Options

```bash
infinity-matrix --config <path> <command>
```

**Options:**
- `--config`: Path to configuration file (default: config/config.yaml)

### Commands

#### `ingest`

Start data ingestion for specified industry or source.

```bash
infinity-matrix ingest [--industry INDUSTRY] [--source SOURCE]
```

**Options:**
- `--industry`: Industry ID to ingest (e.g., technology, finance)
- `--source`: Specific source ID to ingest

**Examples:**
```bash
# Ingest all industries
infinity-matrix ingest

# Ingest specific industry
infinity-matrix ingest --industry technology

# Ingest specific source
infinity-matrix ingest --industry technology --source github_tech
```

#### `normalize`

Normalize raw data into structured format.

```bash
infinity-matrix normalize [--industry INDUSTRY] [--limit LIMIT]
```

**Options:**
- `--industry`: Industry ID to normalize
- `--limit`: Maximum number of items to normalize (default: 100)

**Examples:**
```bash
# Normalize all raw data
infinity-matrix normalize

# Normalize specific industry
infinity-matrix normalize --industry technology --limit 50
```

#### `analyze`

Analyze normalized data using LLM.

```bash
infinity-matrix analyze [--industry INDUSTRY] [--provider PROVIDER] [--prompt-type TYPE] [--limit LIMIT]
```

**Options:**
- `--industry`: Industry ID to analyze
- `--provider`: LLM provider (openai, ollama, anthropic) (default: openai)
- `--prompt-type`: Prompt template type (insights, summary, categorization) (default: insights)
- `--limit`: Maximum number of items to analyze (default: 50)

**Examples:**
```bash
# Analyze with OpenAI
infinity-matrix analyze --industry technology --provider openai

# Analyze with Ollama
infinity-matrix analyze --industry finance --provider ollama --limit 25

# Use summary prompt
infinity-matrix analyze --prompt-type summary
```

#### `status`

Show ingestion status and statistics.

```bash
infinity-matrix status [--industry INDUSTRY]
```

**Options:**
- `--industry`: Filter status by industry

**Examples:**
```bash
# Overall status
infinity-matrix status

# Industry-specific status
infinity-matrix status --industry technology
```

#### `list-industries`

List all configured industries.

```bash
infinity-matrix list-industries
```

**Output:**
```
=== Configured Industries ===
✓ technology: Technology & Software (Priority: 10)
   Software development, cloud computing, AI/ML...
✓ finance: Finance & Banking (Priority: 9)
   Financial services, banking, fintech...
```

#### `list-sources`

List all sources for an industry.

```bash
infinity-matrix list-sources INDUSTRY_ID
```

**Arguments:**
- `INDUSTRY_ID`: The industry identifier

**Examples:**
```bash
infinity-matrix list-sources technology
```

#### `list-seeds`

List all seed URLs for an industry.

```bash
infinity-matrix list-seeds INDUSTRY_ID
```

**Arguments:**
- `INDUSTRY_ID`: The industry identifier

**Examples:**
```bash
infinity-matrix list-seeds technology
```

## Python API

### Core Components

#### Config

```python
from infinity_matrix.core import Config, get_config, set_config

# Load configuration
config = Config.load("config/config.yaml")

# Access settings
db_config = config.database
llm_config = config.llm

# Get global config
config = get_config()

# Set global config
set_config(config)
```

#### SeedManager

```python
from infinity_matrix.core import SeedManager

# Initialize
seed_manager = SeedManager(config_dir="config")

# Get industries
all_industries = seed_manager.get_all_industries()
enabled_industries = seed_manager.get_enabled_industries()
specific_industry = seed_manager.get_industry("technology")

# Get sources
sources = seed_manager.get_sources_by_industry("technology")
source = seed_manager.get_source("github_tech")

# Get seeds
seeds = seed_manager.get_seeds_by_industry("technology")
all_seeds = seed_manager.get_all_seeds()
```

#### IngestionEngine

```python
from infinity_matrix.core import IngestionEngine, SeedManager, StateManager
from infinity_matrix.connectors import ConnectorFactory

# Initialize
seed_manager = SeedManager()
state_manager = StateManager()
connector_factory = ConnectorFactory()

engine = IngestionEngine(
    seed_manager=seed_manager,
    state_manager=state_manager,
    connector_factory=connector_factory
)

# Run ingestion
import asyncio
stats = asyncio.run(engine.start_ingestion(industry_id="technology"))

print(f"Completed: {stats.completed_tasks}/{stats.total_tasks}")
print(f"Data collected: {stats.total_data_collected}")
```

#### StateManager

```python
from infinity_matrix.core import StateManager

# Initialize
state_manager = StateManager(storage_path="data")

# Save/load tasks
await state_manager.save_task(task)
task = await state_manager.get_task(task_id)
all_tasks = await state_manager.get_all_tasks()

# Save/load data
await state_manager.save_raw_data(raw_data)
await state_manager.save_normalized_data(normalized_data)
await state_manager.save_analysis_result(analysis)
```

### Connectors

#### Creating Custom Connector

```python
from infinity_matrix.connectors.base import BaseConnector
from infinity_matrix.models import DataSource, RawData

class MyConnector(BaseConnector):
    def can_handle(self, source_type: str) -> bool:
        return source_type == "my_source_type"
    
    async def fetch(self, url: str, source: DataSource) -> List[RawData]:
        # Implement fetching logic
        raw_data_list = []
        # ... fetch and parse data ...
        return raw_data_list
```

#### Using ConnectorFactory

```python
from infinity_matrix.connectors import ConnectorFactory

factory = ConnectorFactory()

# Get connector
connector = factory.get_connector("github")

# Register custom connector
factory.register_connector(MyConnector())

# List supported types
types = factory.list_supported_types()
```

### Pipelines

#### NormalizationPipeline

```python
from infinity_matrix.pipelines import NormalizationPipeline

pipeline = NormalizationPipeline()

# Normalize data
normalized = await pipeline.normalize(raw_data)

print(f"Title: {normalized.title}")
print(f"Quality: {normalized.quality_score}")
print(f"Keywords: {normalized.keywords}")
```

### LLM Framework

#### AnalysisFramework

```python
from infinity_matrix.llm import AnalysisFramework
from infinity_matrix.core import StateManager

state_manager = StateManager()
framework = AnalysisFramework(state_manager, provider_name="openai")

# Analyze single item
result = await framework.analyze_data(
    normalized_data,
    prompt_type="insights"
)

# Batch analyze
results = await framework.batch_analyze(
    data_list,
    prompt_type="summary"
)

# Custom prompt
framework.add_custom_prompt("my_prompt", "Analyze: {content}")
result = await framework.analyze_data(data, custom_prompt="my_prompt")
```

#### LLM Providers

```python
from infinity_matrix.llm import LLMFactory, OpenAIProvider, OllamaProvider

# Create provider
provider = LLMFactory.create_provider("openai", {
    "api_key": "sk-...",
    "model": "gpt-4o-mini",
    "temperature": 0.7
})

# Use provider
result = await provider.analyze(normalized_data, prompt_template)

# Register custom provider
LLMFactory.register_provider("my_llm", MyLLMProvider)
```

## Data Models

### Industry

```python
from infinity_matrix.models import Industry, IndustryType

industry = Industry(
    id="technology",
    name="Technology & Software",
    type=IndustryType.TECHNOLOGY,
    description="Software development...",
    keywords=["software", "cloud", "AI"],
    priority=10,
    enabled=True
)
```

### DataSource

```python
from infinity_matrix.models import DataSource, SourceType

source = DataSource(
    id="github_tech",
    name="GitHub Technology",
    type=SourceType.GITHUB,
    base_url="https://api.github.com",
    industry_id="technology",
    rate_limit=60,
    authentication_required=False
)
```

### CrawlTask

```python
from infinity_matrix.models import CrawlTask, CrawlStatus

task = CrawlTask(
    id="task-123",
    url="https://github.com/tensorflow/tensorflow",
    source_id="github_tech",
    industry_id="technology",
    status=CrawlStatus.PENDING,
    max_attempts=3
)
```

### RawData / NormalizedData / AnalysisResult

See model definitions in `infinity_matrix/models/__init__.py`

## Configuration

### config.yaml Structure

```yaml
database:
  type: postgresql
  host: localhost
  port: 5432
  database: infinity_matrix

redis:
  host: localhost
  port: 6379

crawler:
  max_concurrent_requests: 10
  download_delay: 1.0
  respect_robots_txt: true

llm:
  default_provider: openai
  providers:
    openai:
      api_key: ${OPENAI_API_KEY}
      model: gpt-4o-mini
```

### Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=infinity_matrix
DB_USER=postgres
DB_PASSWORD=secret

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# LLM
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434
```
