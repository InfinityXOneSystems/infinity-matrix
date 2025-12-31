# Infinity Matrix - Universal Seed & Ingestion System

## Overview

Enterprise-grade, production-ready universal seed and ingestion system for automated data collection, normalization, and AI-powered analysis across multiple business verticals.

## Features

- **Multi-Industry Coverage**: Pre-configured seeds for top 10 global business industries
- **Distributed Crawling**: Robust, resumable web crawling and scraping framework
- **Multiple Source Connectors**: GitHub, AI platforms, real estate, government, social media
- **LLM Analysis Pipeline**: Unified interface for Vertex AI, OpenAI, Ollama, and more
- **Production-Ready**: FAANG-level code quality with comprehensive error handling
- **Extensible Architecture**: Template-based system for easy adaptation to new verticals

## Quick Start

### Installation

```bash
pip install -r requirements.txt
```

### Configuration

Copy the example configuration:

```bash
cp config/config.example.yaml config/config.yaml
```

Edit `config/config.yaml` with your API keys and preferences.

### Running the System

```bash
# Run ingestion for a specific industry
python -m infinity_matrix.cli ingest --industry technology

# Run analysis pipeline
python -m infinity_matrix.cli analyze --industry technology

# Check status
python -m infinity_matrix.cli status
```

## Architecture

### Core Components

1. **Seed Manager**: Manages industry seeds and source configurations
2. **Ingestion Engine**: Distributed crawling and scraping framework
3. **Data Pipeline**: Normalization, validation, and storage
4. **LLM Framework**: Multi-provider AI analysis and insights
5. **State Manager**: Persistent, resumable operation tracking

### Directory Structure

```
infinity-matrix/
├── infinity_matrix/          # Main package
│   ├── core/                 # Core framework components
│   ├── connectors/           # Source-specific connectors
│   ├── models/               # Data models
│   ├── pipelines/            # Data processing pipelines
│   ├── llm/                  # LLM integration framework
│   └── cli.py                # Command-line interface
├── config/                   # Configuration files
│   ├── industries/           # Industry-specific configs
│   └── sources/              # Source connector configs
├── data/                     # Data storage (gitignored)
├── tests/                    # Test suite
└── docs/                     # Documentation

```

## Industry Coverage

Pre-configured seeds for:

1. Technology & Software
2. Finance & Banking
3. Healthcare & Pharmaceuticals
4. Retail & E-commerce
5. Real Estate & Construction
6. Energy & Utilities
7. Manufacturing & Industrial
8. Media & Entertainment
9. Transportation & Logistics
10. Professional Services

## Supported Data Sources

- **Code Repositories**: GitHub, GitLab, Bitbucket
- **AI/ML Platforms**: Hugging Face, Kaggle, Papers with Code
- **Real Estate**: Zillow, Realtor.com, commercial listings
- **Government**: Data.gov, SEC EDGAR, regulatory agencies
- **Social Media**: Twitter/X, LinkedIn, Reddit, YouTube
- **Business Data**: Company websites, news feeds, press releases

## LLM Providers

- Google Vertex AI
- OpenAI (ChatGPT, GPT-4)
- Ollama (local models)
- Anthropic Claude
- AWS Bedrock
- Azure OpenAI

## Production Features

- Distributed task queue with Celery/Redis
- Persistent state management with PostgreSQL/MongoDB
- Rate limiting and respectful crawling
- Comprehensive error handling and retry logic
- Structured logging and monitoring
- Docker and Kubernetes ready
- Horizontal scalability
- Health checks and metrics

## Extending the System

### Adding a New Industry

1. Create configuration in `config/industries/new_industry.yaml`
2. Define seed URLs and source priorities
3. Customize analysis prompts if needed

### Adding a New Source Connector

1. Inherit from `BaseConnector` in `infinity_matrix/connectors/base.py`
2. Implement required methods: `fetch()`, `parse()`, `normalize()`
3. Add connector configuration
4. Register in connector factory

### Adding a New LLM Provider

1. Inherit from `BaseLLMProvider` in `infinity_matrix/llm/base.py`
2. Implement `analyze()` and `batch_analyze()` methods
3. Add provider configuration
4. Register in LLM factory

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please see CONTRIBUTING.md for guidelines.
