# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/infinity-matrix.git
   cd infinity-matrix
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -e ".[dev]"
   ```

5. Install pre-commit hooks:
   ```bash
   pre-commit install
   ```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Run tests:
   ```bash
   pytest
   ```

4. Run linters:
   ```bash
   black infinity_matrix tests
   ruff infinity_matrix tests
   mypy infinity_matrix
   ```

5. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request

## Code Style

- Follow PEP 8 guidelines
- Use Black for code formatting (line length: 100)
- Use type hints for all functions
- Write docstrings for all public modules, classes, and functions
- Keep functions focused and small

## Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Use pytest for testing
- Mark slow tests with `@pytest.mark.slow`
- Mark integration tests with `@pytest.mark.integration`

## Commit Messages

Follow the Conventional Commits specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Guidelines

- Provide a clear description of the changes
- Reference related issues
- Ensure all tests pass
- Update documentation if needed
- Add tests for new features
- Keep PRs focused and small

## Questions?

Open an issue or join our community forum.

Thank you for contributing!
