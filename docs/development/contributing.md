# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix!

## Development Setup

1. Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/infinity-matrix.git
cd infinity-matrix
```

2. Install development dependencies:
```bash
pip install -e ".[dev]"
```

3. Install pre-commit hooks:
```bash
pre-commit install
```

## Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write clean, documented code
- Follow existing code style
- Add tests for new functionality

### 3. Run Tests
```bash
pytest
```

### 4. Run Linters
```bash
ruff check src/ tests/
mypy src/
```

### 5. Commit Changes
```bash
git commit -m "feat: add new feature"
```

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

## Code Style

We use:
- **ruff** for linting
- **black** for formatting
- **mypy** for type checking
- **isort** for import sorting

### Style Guidelines

- Use type hints for all functions
- Write docstrings in Google style
- Keep functions focused and small
- Use meaningful variable names

## Testing

### Unit Tests
```bash
pytest tests/unit/
```

### Integration Tests
```bash
pytest tests/integration/
```

### Coverage
```bash
pytest --cov=infinity_matrix --cov-report=html
```

## Documentation

- Update docs when adding features
- Use markdown for documentation
- Include code examples
- Keep README up to date

## Pull Request Guidelines

1. **Title**: Use conventional commit format
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for refactoring

2. **Description**: Include:
   - What changed
   - Why it changed
   - How to test it

3. **Checklist**:
   - [ ] Tests pass
   - [ ] Linters pass
   - [ ] Documentation updated
   - [ ] Changelog updated

## Release Process

1. Update version in `pyproject.toml`
2. Update CHANGELOG.md
3. Create release tag
4. GitHub Actions handles the rest

## Getting Help

- Open an issue for bugs
- Use discussions for questions
- Join our community chat

Thank you for contributing! 🎉
