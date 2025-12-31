# Getting Started

Welcome to Infinity Matrix! This guide will help you get up and running quickly.

## Prerequisites

- Python 3.10 or higher
- pip or uv package manager
- Git

## Installation

### From Source

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
pip install -e .
```

### With Development Dependencies

```bash
pip install -e ".[dev]"
```

### With All Optional Features

```bash
pip install -e ".[dev,vision,builder,docs,etl,cloud,github]"
```

## Quick Start

### 1. Initialize Configuration

```bash
infinity-matrix init
```

This creates a `config.yaml` file in your current directory with default settings.

### 2. Start the System

```bash
infinity-matrix start
```

### 3. Check Status

In another terminal:

```bash
infinity-matrix status
```

## Basic Usage

### Building a Project

```bash
infinity-matrix build /path/to/project --platform python
```

### Generating Documentation

```bash
infinity-matrix generate-docs /path/to/source --output ./docs
```

### Scraping Data

```bash
infinity-matrix scrape https://example.com
```

## Configuration

Create a `config.yaml` file:

```yaml
infinity_matrix:
  debug: false
  log_level: INFO
  
  agents:
    max_concurrent: 10
    registry_backend: memory
  
  vision:
    enabled: true
    models:
      - gpt-4-vision
  
  builder:
    enabled: true
    platforms:
      - python
      - node
      - go
  
  integrations:
    github:
      enabled: true
      token: ${GITHUB_TOKEN}
```

## Environment Variables

```bash
export INFINITY_MATRIX_DEBUG=true
export INFINITY_MATRIX_LOG_LEVEL=DEBUG
export GITHUB_TOKEN=your_token_here
export GCP_PROJECT_ID=your_project_id
```

## Next Steps

- Read the [Architecture Overview](../architecture/overview.md)
- Explore [Component Documentation](../components/vision.md)
- Check out [API Reference](../api/core.md)
