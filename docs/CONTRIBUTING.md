# Contributing to Infinity Matrix

Thank you for considering contributing to Infinity Matrix! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/InfinityXOneSystems/infinity-matrix/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Python version, etc.)

### Suggesting Features

1. Check existing [feature requests](https://github.com/InfinityXOneSystems/infinity-matrix/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass (`pytest`)
6. Format code (`black .`)
7. Lint code (`ruff check .`)
8. Commit your changes (`git commit -m 'Add amazing feature'`)
9. Push to the branch (`git push origin feature/amazing-feature`)
10. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/infinity-matrix.git
cd infinity-matrix

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install development dependencies
pip install -e ".[dev]"

# Run tests
pytest
```

## Coding Standards

### Python Style

- Follow PEP 8
- Use type hints
- Write docstrings for all public functions and classes
- Maximum line length: 100 characters

### Code Quality

- Write tests for new features
- Maintain test coverage above 80%
- Use meaningful variable names
- Keep functions small and focused
- Document complex logic

### Example

```python
from typing import Dict, Any
from infinity_matrix.agents import BaseAgent


class MyAgent(BaseAgent):
    """Agent for performing specific tasks.
    
    This agent provides functionality for...
    
    Attributes:
        name: Agent identifier
        agent_type: Type of agent
    """
    
    def __init__(self, name: str) -> None:
        """Initialize the agent.
        
        Args:
            name: Unique identifier for the agent
        """
        super().__init__(
            name=name,
            agent_type="custom",
            description="Performs custom tasks"
        )
    
    async def _execute(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the agent's task.
        
        Args:
            task: Task configuration and input data
            
        Returns:
            Dict containing execution results
            
        Raises:
            ValueError: If task is invalid
        """
        # Implementation here
        return {"status": "success"}
    
    async def validate(self, task: Dict[str, Any]) -> bool:
        """Validate task input.
        
        Args:
            task: Task to validate
            
        Returns:
            True if valid, False otherwise
        """
        return "action" in task
```

## Testing

### Writing Tests

- Use pytest for all tests
- Write unit tests for individual components
- Write integration tests for component interactions
- Use async test functions with `@pytest.mark.asyncio`

### Test Structure

```python
import pytest
from infinity_matrix.agents import AgentRegistry


@pytest.mark.asyncio
async def test_agent_registration():
    """Test that agents can be registered successfully."""
    registry = AgentRegistry()
    await registry.initialize()
    
    # Test implementation
    assert registry.is_initialized
    
    await registry.shutdown()
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_agents.py

# Run with coverage
pytest --cov=infinity_matrix --cov-report=html

# Run specific test
pytest -k test_agent_registration
```

## Documentation

### Code Documentation

- Write docstrings for all public APIs
- Use Google-style docstrings
- Include examples in docstrings when helpful

### User Documentation

- Update README.md for user-facing changes
- Update docs/ for detailed guides
- Include code examples

## Commit Messages

Follow conventional commits:

```
type(scope): short description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks

**Example:**
```
feat(agents): add custom agent support

Add support for registering custom agents with dynamic capabilities.
Includes new BaseAgent methods and registry integration.

Fixes #42
```

## Pull Request Process

1. Update documentation
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers

### PR Checklist

- [ ] Tests pass locally
- [ ] Code is formatted with black
- [ ] Code passes ruff linting
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Commit messages follow conventions

## Release Process

Releases are managed by maintainers:

1. Update version in `pyproject.toml`
2. Update CHANGELOG.md
3. Create git tag
4. Build and publish to PyPI

## Questions?

- Open an issue for questions
- Join our Discord community
- Email: dev@infinityxone.com

Thank you for contributing! 🎉
