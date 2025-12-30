# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/infinity-matrix.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `pytest`
6. Commit your changes: `git commit -am 'Add some feature'`
7. Push to the branch: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

```bash
# Install development dependencies
pip install -e ".[dev]"

# Set up pre-commit hooks
pre-commit install

# Run tests
pytest

# Run linters
black .
ruff check .
mypy .
```

## Code Style

- Follow PEP 8 guidelines
- Use type hints for all functions
- Write docstrings for all public APIs
- Keep line length to 100 characters
- Use Black for code formatting
- Use Ruff for linting

## Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Run the full test suite before submitting PRs

## Documentation

- Update documentation for any user-facing changes
- Include docstrings with examples
- Update README.md if needed

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with any new features or changes
3. The PR will be merged once it has been reviewed and approved

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Assume good intentions

## Questions?

Feel free to open an issue for any questions or concerns.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
