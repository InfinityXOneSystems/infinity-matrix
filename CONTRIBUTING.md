# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Contributions](#making-contributions)
5. [Coding Standards](#coding-standards)
6. [Testing](#testing)
7. [Documentation](#documentation)
8. [Pull Request Process](#pull-request-process)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow professional standards

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Git
- Basic understanding of async/await
- Familiarity with web scraping and APIs

### Areas for Contribution

We welcome contributions in these areas:

1. **New Connectors**: Add support for more data sources
2. **LLM Providers**: Integrate additional LLM services
3. **Industries**: Add new industry configurations
4. **Documentation**: Improve guides and examples
5. **Testing**: Add test coverage
6. **Performance**: Optimize existing code
7. **Bug Fixes**: Fix reported issues

## Development Setup

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR-USERNAME/infinity-matrix.git
cd infinity-matrix
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Development Dependencies

```bash
pip install -r requirements.txt
pip install -e .
pip install pytest pytest-asyncio black ruff mypy
```

### 4. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

## Making Contributions

### Adding a New Connector

1. Create a new file in `infinity_matrix/connectors/`
2. Inherit from `BaseConnector`
3. Implement required methods:
   - `can_handle(source_type: str) -> bool`
   - `fetch(url: str, source: DataSource) -> List[RawData]`
4. Register in `ConnectorFactory`
5. Add tests in `tests/test_connectors.py`
6. Update documentation

**Example:**

```python
from infinity_matrix.connectors.base import BaseConnector
from infinity_matrix.models import DataSource, RawData

class NewConnector(BaseConnector):
    def can_handle(self, source_type: str) -> bool:
        return source_type == "new_source_type"
    
    async def fetch(self, url: str, source: DataSource) -> List[RawData]:
        # Implementation
        pass
```

### Adding a New LLM Provider

1. Create a new file in `infinity_matrix/llm/`
2. Inherit from `BaseLLMProvider`
3. Implement:
   - `get_provider_name() -> str`
   - `analyze(data, prompt_template) -> AnalysisResult`
   - `validate_config() -> bool`
4. Register in `LLMFactory`
5. Add configuration example
6. Add tests

### Adding a New Industry

1. Create YAML file in `config/industries/`
2. Define industry metadata
3. Add seed URLs
4. Document in README

**Template:**

```yaml
id: new_industry
name: New Industry Name
type: technology  # or appropriate type
description: Industry description
keywords:
  - keyword1
  - keyword2
priority: 7
enabled: true

seeds:
  - url: https://example.com
    source_id: source_name
    priority: 8
    depth: 2
```

## Coding Standards

### Style Guide

We follow PEP 8 with some modifications:

- Line length: 100 characters
- Use type hints
- Use async/await for I/O operations
- Use descriptive variable names

### Code Formatting

Use Black for formatting:

```bash
black infinity_matrix/
```

Use Ruff for linting:

```bash
ruff check infinity_matrix/
```

### Type Checking

Use mypy for type checking:

```bash
mypy infinity_matrix/
```

### Best Practices

1. **Error Handling**
   - Use try-except blocks
   - Log errors with context
   - Don't silence exceptions

2. **Async/Await**
   - Use async for I/O operations
   - Don't block the event loop
   - Use asyncio.gather for concurrent tasks

3. **Logging**
   - Use module-level loggers
   - Use appropriate log levels
   - Include context in log messages

4. **Documentation**
   - Add docstrings to all public methods
   - Use Google-style docstrings
   - Include examples where helpful

**Example:**

```python
async def fetch_data(self, url: str) -> List[RawData]:
    """Fetch data from the specified URL.
    
    Args:
        url: The URL to fetch from
        
    Returns:
        List of RawData objects
        
    Raises:
        ValueError: If URL is invalid
        HTTPError: If request fails
        
    Example:
        >>> data = await connector.fetch_data("https://api.example.com")
        >>> len(data)
        5
    """
    pass
```

## Testing

### Running Tests

Run all tests:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=infinity_matrix --cov-report=html
```

Run specific test:

```bash
pytest tests/test_connectors.py::test_github_connector
```

### Writing Tests

1. Create test files in `tests/`
2. Name test functions with `test_` prefix
3. Use fixtures from `conftest.py`
4. Test both success and failure cases
5. Mock external API calls

**Example:**

```python
import pytest
from infinity_matrix.connectors import MyConnector

def test_connector_can_handle():
    """Test connector source type detection."""
    connector = MyConnector()
    assert connector.can_handle("my_type") is True
    assert connector.can_handle("other_type") is False

@pytest.mark.asyncio
async def test_connector_fetch():
    """Test data fetching."""
    connector = MyConnector()
    # Implementation
```

## Documentation

### Types of Documentation

1. **Code Documentation**: Docstrings in code
2. **API Documentation**: `docs/API.md`
3. **Architecture Documentation**: `docs/ARCHITECTURE.md`
4. **User Guides**: `README.md`, `docs/DEPLOYMENT.md`
5. **Examples**: `examples/` directory

### Documentation Standards

- Use Markdown format
- Include code examples
- Keep up to date with code changes
- Add diagrams where helpful
- Link related documents

## Pull Request Process

### Before Submitting

1. ✅ Run tests: `pytest`
2. ✅ Format code: `black .`
3. ✅ Check linting: `ruff check .`
4. ✅ Update documentation
5. ✅ Add tests for new features
6. ✅ Update CHANGELOG (if exists)

### Submitting a PR

1. Push to your fork
2. Create pull request
3. Fill out PR template
4. Link related issues
5. Wait for review

### PR Title Format

Use conventional commits:

- `feat: Add new connector for X`
- `fix: Resolve issue with Y`
- `docs: Update API documentation`
- `test: Add tests for Z`
- `refactor: Improve performance of W`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainer reviews code
2. Automated tests run
3. Changes requested or approved
4. Contributor addresses feedback
5. PR merged when approved

## Getting Help

- GitHub Issues: Report bugs or request features
- GitHub Discussions: Ask questions
- Documentation: Check docs/ directory
- Examples: See examples/ directory

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Acknowledged in documentation

Thank you for contributing to Infinity Matrix! 🚀
