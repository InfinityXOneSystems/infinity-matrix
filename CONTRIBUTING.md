# Contributing to Infinity-Matrix

Thank you for your interest in contributing to the Infinity-Matrix Autonomous System! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Agent Development](#agent-development)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- Be respectful and constructive
- Welcome diverse perspectives
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

### 1. Fork the Repository

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/infinity-matrix.git
cd infinity-matrix
```

### 2. Set Up Development Environment

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install -e .

# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## Development Workflow

### Branch Naming Convention

- **Features**: `feature/description`
- **Bug Fixes**: `fix/description`
- **Documentation**: `docs/description`
- **Performance**: `perf/description`
- **Refactoring**: `refactor/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(agents): add new crawler agent capability
fix(vision-cortex): resolve debate consensus logic
docs(readme): update installation instructions
test(api): add integration tests for health endpoint
```

### Making Changes

1. **Make your changes** following code standards
2. **Add tests** for new functionality
3. **Update documentation** as needed
4. **Run tests** to ensure nothing breaks
5. **Commit your changes** with clear messages

## Code Standards

### Python Style Guide

We follow [PEP 8](https://pep8.org/) with some modifications:

- **Line length**: 100 characters
- **Quotes**: Prefer double quotes for strings
- **Imports**: Use absolute imports, organize with isort
- **Type hints**: Use type hints for function signatures

### Code Formatting

We use automated tools for consistent formatting:

```bash
# Format code
black .
isort .

# Check formatting
black --check .
isort --check-only .
```

### Linting

```bash
# Run all linters
make lint

# Or individually
flake8 .
mypy .
pylint ai_stack/
```

### Code Structure

```python
"""Module docstring describing purpose."""

import standard_library
import third_party
import local_modules

from typing import Any, Dict, List, Optional


class MyClass:
    """Class docstring.
    
    Attributes:
        attr1: Description
        attr2: Description
    """
    
    def __init__(self, param: str):
        """Initialize the class.
        
        Args:
            param: Description
        """
        self.attr1 = param
    
    def my_method(self, arg: int) -> bool:
        """Method docstring.
        
        Args:
            arg: Description
        
        Returns:
            Description of return value
        
        Raises:
            ValueError: When arg is invalid
        """
        if arg < 0:
            raise ValueError("arg must be non-negative")
        return True
```

## Testing

### Writing Tests

- Place tests in `tests/` directory
- Name test files `test_*.py`
- Name test functions `test_*`
- Use fixtures for common setup
- Mock external dependencies

**Example**:

```python
"""Tests for MyClass."""

import pytest
from my_module import MyClass


@pytest.fixture
def my_class():
    """Create MyClass instance for testing."""
    return MyClass("test")


def test_my_method(my_class):
    """Test my_method returns expected result."""
    result = my_class.my_method(5)
    assert result is True


def test_my_method_raises_error(my_class):
    """Test my_method raises error for invalid input."""
    with pytest.raises(ValueError):
        my_class.my_method(-1)
```

### Running Tests

```bash
# Run all tests
make test

# Run specific test file
pytest tests/test_api.py -v

# Run specific test
pytest tests/test_api.py::test_health_endpoint -v

# Run with coverage
pytest --cov=. --cov-report=html
```

### Test Coverage

- Aim for >80% coverage
- Focus on critical paths
- Test edge cases and error conditions
- Don't test external libraries

## Documentation

### Code Documentation

- **Docstrings**: All modules, classes, and functions
- **Type hints**: All function signatures
- **Comments**: Explain complex logic, not obvious code
- **README**: Keep up-to-date

### Documentation Files

- **Architecture**: `docs/blueprint.md`
- **Roadmap**: `docs/roadmap.md`
- **Configuration**: `docs/configuration.md`
- **API**: Auto-generated from code

### Writing Documentation

- Use Markdown format
- Include code examples
- Add diagrams where helpful
- Keep it up-to-date
- Link between related docs

## Pull Request Process

### Before Submitting

1. **Update your branch**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run full test suite**:
   ```bash
   make test
   make lint
   ```

3. **Update documentation**

4. **Write clear commit messages**

### Submitting PR

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub

3. **Fill out PR template**:
   - Description of changes
   - Related issues
   - Testing done
   - Screenshots (if UI changes)

4. **Request review** from maintainers

### PR Review Process

- **Automated checks** must pass
- **Code review** by at least one maintainer
- **Address feedback** promptly
- **Squash commits** if requested
- **Merge** when approved

### After Merge

1. **Delete your branch**:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your main branch**:
   ```bash
   git checkout main
   git pull origin main
   ```

## Agent Development

### Creating a New Agent

1. **Create agent file**: `ai_stack/agents/my_agent.py`

2. **Inherit from BaseAgent**:
   ```python
   from .base_agent import BaseAgent
   
   class MyAgent(BaseAgent):
       """Description of agent."""
       
       def __init__(self, config):
           super().__init__(config, "my_agent")
       
       async def on_start(self):
           """Initialize resources."""
           pass
       
       async def on_stop(self):
           """Cleanup resources."""
           pass
       
       async def run(self):
           """Main agent logic."""
           return {"status": "success"}
   ```

3. **Register in Vision Cortex**:
   Add to `vision_cortex.py`:
   ```python
   from ai_stack.agents.my_agent import MyAgent
   
   self.agents['my_agent'] = MyAgent(self.config)
   ```

4. **Add tests**: `tests/test_my_agent.py`

5. **Update documentation**

### Agent Best Practices

- **Single responsibility**: Each agent should have one clear purpose
- **Async/await**: Use async methods for I/O operations
- **Error handling**: Handle errors gracefully
- **Logging**: Use structured logging
- **Configuration**: Use config for all settings
- **State**: Minimize shared state
- **Testing**: Write comprehensive tests

## Integration Development

### Adding External Service Integration

1. **Create integration module**: `ai_stack/models/service_integration.py`

2. **Implement client wrapper**:
   ```python
   class ServiceClient:
       """Client for external service."""
       
       def __init__(self, api_key: str):
           self.api_key = api_key
       
       async def call_api(self, data: dict):
           """Call external API."""
           # Implementation
   ```

3. **Add configuration**:
   - Add to `.env.example`
   - Add to `config.py`

4. **Add tests with mocks**

5. **Update documentation**

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Security**: Email security@infinityxai.com
- **Chat**: Join our Slack channel

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Acknowledged in commit messages

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Infinity-Matrix! 🚀
