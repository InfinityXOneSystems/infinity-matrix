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

2. Make your changes following code standards (see below)

3. Run tests:
   ```bash
   pytest tests/ -v --cov=src --cov-report=term-missing
   ```

4. Run linters and formatters:
   ```bash
   # Format code with Black
   black src/ tests/
   
   # Lint with Ruff
   ruff check src/ tests/
   
   # Type check with MyPy
   mypy src/
   
   # Security scan with Bandit
   bandit -r src/ -f json
   ```

5. Pre-commit hooks will run automatically:
   ```bash
   # Or run manually
   pre-commit run --all-files
   ```

6. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a Pull Request with:
   - Clear description of changes
   - Link to related issue(s)
   - Screenshots for UI changes
   - Test results summary

## Code Style

### Python Code Standards

- **Follow PEP 8 guidelines** with modifications defined in pyproject.toml
- **Line length:** 100 characters (enforced by Black)
- **Type hints:** Required for all function signatures
- **Docstrings:** Google-style docstrings for all public modules, classes, and functions
- **Import order:** Sorted with isort (integrated with Black profile)
- **Naming conventions:**
  - `snake_case` for functions and variables
  - `PascalCase` for classes
  - `UPPER_CASE` for constants
  - Prefix private methods/attributes with underscore `_`

### Code Quality Requirements

1. **Type Safety**
   - All functions must have type hints for parameters and return values
   - Use `typing` module for complex types
   - Run mypy with `--strict` mode (configured in pyproject.toml)

2. **Security**
   - Never commit secrets or API keys
   - Use environment variables for configuration
   - Validate all user inputs with Pydantic
   - Hash sensitive data before storage
   - Follow OWASP security guidelines

3. **Error Handling**
   - Use specific exception types (not bare `except:`)
   - Log errors with structured logging
   - Don't expose sensitive information in error messages
   - Include error IDs for tracking

4. **Documentation**
   - Write clear, concise docstrings
   - Include examples in docstrings when helpful
   - Document all parameters, returns, and raises
   - Keep README and docs up to date

### Example Code Style

```python
"""Module docstring describing the module purpose."""

from typing import Optional
import secrets
import hashlib


def generate_secure_token(length: int = 32) -> tuple[str, str]:
    """Generate a secure random token and its hash.
    
    Args:
        length: Number of bytes for the token (default: 32)
        
    Returns:
        Tuple of (raw_token, hashed_token) where:
        - raw_token: The plaintext token to return to client
        - hashed_token: SHA-256 hash for storage
        
    Example:
        >>> token, token_hash = generate_secure_token()
        >>> len(token) > 40  # Base64 encoded
        True
    """
    raw_token = f"tok_{secrets.token_urlsafe(length)}"
    hashed_token = hashlib.sha256(raw_token.encode()).hexdigest()
    return raw_token, hashed_token
```

## Testing

### Test Requirements

- **Write tests for all new features** - No PR merged without tests
- **Maintain test coverage above 80%** - Aim for 90%+
- **Use pytest** for all testing
- **Test file naming:** `test_*.py` or `*_test.py`
- **Test organization:** Mirror source structure in `tests/` directory

### Test Types

1. **Unit Tests**
   - Test individual functions/methods in isolation
   - Use mocking for external dependencies
   - Fast execution (< 1 second per test)
   - Location: `tests/unit/`

2. **Integration Tests**
   - Test interaction between components
   - May use test database/services
   - Mark with `@pytest.mark.integration`
   - Location: `tests/integration/`

3. **Security Tests**
   - Test authentication, authorization, input validation
   - Verify no secrets exposure
   - Check CORS, CSRF, XSS protections
   - Location: `tests/test_*_security.py`

### Running Tests

```bash
# Run all tests
pytest tests/

# Run with coverage report
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_gateway_security.py

# Run specific test
pytest tests/test_gateway_security.py::TestAPIKeySecurity::test_generate_api_key_format

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/ -m integration

# Skip slow tests
pytest tests/ -m "not slow"
```

### Writing Good Tests

```python
import pytest
from unittest.mock import Mock, patch


class TestAPIEndpoint:
    """Test suite for API endpoint."""
    
    @pytest.fixture
    def client(self):
        """Fixture providing test client."""
        return TestClient(app)
    
    def test_successful_request(self, client):
        """Test successful API request returns expected data."""
        # Arrange
        payload = {"name": "test", "type": "worker"}
        
        # Act
        response = client.post("/api/v1/agents/", json=payload)
        
        # Assert
        assert response.status_code == 201
        data = response.json()
        assert "agent_id" in data
        assert data["name"] == "test"
    
    def test_invalid_input_rejected(self, client):
        """Test invalid input is rejected with proper error."""
        response = client.post("/api/v1/agents/", json={"invalid": "data"})
        assert response.status_code == 422  # Validation error
```

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

### Before Submitting

- [ ] All tests pass locally
- [ ] Code coverage is at least 80%
- [ ] No linting errors (black, ruff, mypy)
- [ ] Security scan passes (bandit)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
- [ ] Commit messages follow Conventional Commits

### PR Description Template

```markdown
## Description
Brief description of the changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Security fix

## Testing
- Describe the tests you ran
- Include test coverage percentage
- Note any manual testing performed

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective
- [ ] New and existing unit tests pass locally
- [ ] No security vulnerabilities introduced

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #(issue number)
```

### Review Process

1. **Automated checks must pass:**
   - CI/CD pipeline
   - Code quality checks
   - Security scans
   - Test suite

2. **Code review required:**
   - At least one approval from maintainer
   - All comments resolved
   - No blocking issues

3. **Merge criteria:**
   - All checks green
   - Approved by reviewer(s)
   - No merge conflicts
   - Up-to-date with base branch

## Questions?

### Getting Help

- **GitHub Issues:** [Report bugs or request features](https://github.com/InfinityXOneSystems/infinity-matrix/issues)
- **GitHub Discussions:** [Ask questions and share ideas](https://github.com/InfinityXOneSystems/infinity-matrix/discussions)
- **Security Issues:** See [SECURITY.md](SECURITY.md) for reporting vulnerabilities
- **Documentation:** [docs.infinitymatrix.example.com](https://docs.infinitymatrix.example.com)

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback
- Follow our Code of Conduct

## Security Considerations

### Before Committing

- [ ] No hardcoded secrets or API keys
- [ ] No sensitive data in logs
- [ ] Input validation implemented
- [ ] Authentication/authorization tested
- [ ] No new security vulnerabilities

### Security Best Practices

1. **Never commit:**
   - API keys, tokens, passwords
   - Private keys or certificates
   - Database credentials
   - Environment files (`.env`)

2. **Always:**
   - Use environment variables for config
   - Hash/encrypt sensitive data
   - Validate all user inputs
   - Follow principle of least privilege
   - Review security advisories

3. **For Security Fixes:**
   - Do NOT disclose publicly until patched
   - Contact security team first
   - Follow responsible disclosure
   - See [SECURITY.md](SECURITY.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Infinity Matrix! 🚀
