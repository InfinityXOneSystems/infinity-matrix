# Infinity Matrix Examples

This directory contains example scripts demonstrating how to use and extend the Infinity Matrix system.

## Examples

### 1. basic_usage.py

Demonstrates the basic workflow:
- Initializing components
- Running data ingestion
- Normalizing collected data
- (Optional) LLM analysis

**Run:**
```bash
python examples/basic_usage.py
```

### 2. custom_connector.py

Shows how to create and register a custom connector for a new data source.

**Run:**
```bash
python examples/custom_connector.py
```

### 3. custom_llm_provider.py

Demonstrates creating a custom LLM provider for analysis.

**Run:**
```bash
python examples/custom_llm_provider.py
```

## Using Examples

All examples are standalone and can be run directly:

```bash
cd infinity-matrix
python examples/basic_usage.py
```

Make sure you have installed the package first:

```bash
pip install -e .
```
