# Contributing to Infinity Matrix Auto-Builder

Thank you for your interest in contributing to the Infinity Matrix Auto-Builder! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/infinity-matrix.git`
3. Create a virtual environment: `python -m venv .venv`
4. Activate the environment: `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows)
5. Install development dependencies: `pip install -e ".[dev]"`
6. Create a branch for your changes: `git checkout -b feature/your-feature-name`

## Development Workflow

### Code Style

We follow PEP 8 and use automated tools to ensure code quality:

- **Black**: Code formatting
- **Ruff**: Linting
- **Mypy**: Type checking

Run these tools before committing:

```bash
# Format code
black infinity_matrix/

# Lint code
ruff check infinity_matrix/

# Type check
mypy infinity_matrix/
```

### Testing

We use pytest for testing. Write tests for all new features and bug fixes.

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=infinity_matrix

# Run specific test file
pytest tests/test_core.py
```

### Commit Messages

Follow conventional commit format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Test changes
- `refactor:` Code refactoring
- `style:` Code style changes
- `chore:` Build/tooling changes

Example: `feat: add support for GraphQL API generation`

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add an entry to CHANGELOG.md (if applicable)
4. Submit a pull request with a clear description of changes
5. Request review from maintainers
6. Address any feedback

## Areas for Contribution

### High Priority

- Additional agent implementations
- More template types
- Integration with external services
- Performance optimizations
- Documentation improvements

### Agent Development

When adding new agents:

1. Inherit from `BaseAgent`
2. Implement the `execute()` method
3. Add agent type to `AgentType` enum
4. Register agent in `VisionCortex`
5. Add comprehensive tests
6. Document capabilities

Example:

```python
from infinity_matrix.agents.base import BaseAgent, AgentType, AgentTask, AgentResult

class MyCustomAgent(BaseAgent):
    def __init__(self, config=None):
        super().__init__(AgentType.CUSTOM, config)
    
    async def execute(self, task: AgentTask) -> AgentResult:
        # Implementation here
        pass
    
    def get_capabilities(self):
        return ["capability1", "capability2"]
```

### Template Development

Add new templates to the `templates/` directory:

```
templates/
  my-template/
    README.md
    pyproject.toml
    src/
      __init__.py
      main.py
```

### Blueprint Examples

Add blueprint examples to `blueprints/`:

```yaml
name: my-project
version: 1.0.0
type: microservice
description: Description here
requirements:
  - requirement1
  - requirement2
# ... more configuration
```

## Documentation

- Update README.md for user-facing changes
- Add docstrings to all public functions/classes
- Create examples in `examples/` directory
- Update API documentation

## Questions?

- Open an issue for bug reports or feature requests
- Use discussions for questions and general discussions
- Contact maintainers for security issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
