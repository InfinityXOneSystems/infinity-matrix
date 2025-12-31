# GitHub Copilot Instructions for infinity-matrix

## Project Overview

infinity-matrix is a Python-based project. This repository follows Python best practices and conventions.

## Development Setup

### Prerequisites
- Python 3.8 or higher
- pip or uv for package management

### Environment Setup
```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Linux/Mac:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install dependencies (when available)
pip install -r requirements.txt
# or with uv:
# uv pip install -r requirements.txt
```

## Code Style and Conventions

### Python Coding Standards
- Follow PEP 8 style guide for Python code
- Use type hints for function parameters and return values
- Write docstrings for all public modules, functions, classes, and methods
- Use meaningful variable and function names

### Code Quality Tools
- **Linting**: Use `ruff` or `flake8` for code linting
- **Formatting**: Use `black` for code formatting
- **Type Checking**: Use `mypy` for static type checking

### Testing
- Write tests for all new features and bug fixes
- Use `pytest` as the testing framework
- Maintain test coverage above 80%
- Place tests in a `tests/` directory mirroring the source structure

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=. --cov-report=html
```

## File Organization
- Source code should be placed in appropriate module directories
- Configuration files should be at the root level
- Documentation should be in a `docs/` directory
- Keep the repository root clean and organized

## Git Workflow
- Create feature branches from `main`
- Use descriptive commit messages
- Keep commits atomic and focused
- Reference issue numbers in commit messages when applicable

## Dependencies
- Add new dependencies to `requirements.txt` or `pyproject.toml`
- Pin dependency versions for reproducibility
- Document why each major dependency is needed
- Prefer well-maintained, widely-used libraries

## Security
- Never commit sensitive data (API keys, passwords, tokens)
- Use environment variables for configuration
- Keep dependencies up to date
- Review security advisories for dependencies

## Documentation
- Update README.md when adding new features
- Document complex algorithms and business logic
- Keep inline comments focused on "why" rather than "what"
- Update this file when development processes change

## Best Practices for Copilot Agent
When working on this repository:
1. Always check for existing patterns and follow them
2. Run tests after making changes
3. Ensure code is properly formatted before committing
4. Update documentation alongside code changes
5. Consider backward compatibility when modifying APIs
6. Ask for clarification if requirements are unclear
