# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, versions, etc.)
- Screenshots if applicable

### Suggesting Features

Feature requests are welcome! Please include:
- Clear use case and motivation
- Proposed implementation approach
- Any alternatives considered
- Impact on existing functionality

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for any new functionality
4. **Update documentation** as needed
5. **Run the test suite** to ensure nothing breaks
6. **Submit a pull request** with a clear description

#### PR Guidelines

- One feature/fix per PR
- Keep PRs focused and reasonably sized
- Write clear commit messages
- Reference related issues
- Respond to review feedback promptly

## Development Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker and Docker Compose
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Install dependencies
npm install
cd packages/server && pip install -r requirements.txt

# Start development environment
docker-compose up -d

# Run the server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific tests
npm test -- --grep "MCP Protocol"

# Run with coverage
npm run test:coverage
```

### Code Style

We use automated tools to maintain code quality:

#### TypeScript/JavaScript
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode

```bash
npm run lint
npm run format
```

#### Python
- Black for formatting
- Ruff for linting
- MyPy for type checking

```bash
cd packages/server
black .
ruff check .
mypy .
```

## Project Structure

```
infinity-matrix/
├── packages/
│   ├── server/              # Python FastAPI server
│   ├── client/              # TypeScript client SDK
│   ├── vscode-extension/    # VS Code extension
│   └── shared/              # Shared utilities
├── .github/workflows/       # CI/CD pipelines
├── infrastructure/          # Deployment configs
├── docs/                    # Documentation
└── tests/                   # Test suites
```

## Coding Standards

### General Principles

- Write clean, readable code
- Follow SOLID principles
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic
- Write self-documenting code when possible

### TypeScript

```typescript
// Use explicit types
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Use interfaces for object shapes
interface UserConfig {
  apiKey: string;
  timeout: number;
}

// Prefer async/await over callbacks
async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  return response.json();
}
```

### Python

```python
# Use type hints
def process_context(context: ContextData) -> Dict[str, Any]:
    """Process context and return result."""
    return {"status": "processed"}

# Use dataclasses for data structures
from dataclasses import dataclass

@dataclass
class Message:
    id: str
    content: str
    timestamp: datetime

# Follow PEP 8 style guide
# Use docstrings for functions and classes
```

## Testing Guidelines

### Unit Tests

- Test individual functions and methods
- Mock external dependencies
- Aim for high code coverage
- Test edge cases and error conditions

### Integration Tests

- Test component interactions
- Use test databases and services
- Clean up test data after tests
- Test realistic scenarios

### End-to-End Tests

- Test complete workflows
- Validate user-facing functionality
- Test across different environments
- Automate where possible

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add JSDoc/docstrings for new code
- Include examples in documentation
- Keep documentation in sync with code

## Review Process

All contributions go through code review:

1. **Automated Checks**: CI runs linting, tests, security scans
2. **Code Review**: Maintainers review code quality and design
3. **Testing**: Reviewers may test functionality
4. **Approval**: At least one maintainer approval required
5. **Merge**: Auto-merge or manual merge by maintainer

## Release Process

We follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Releases are automated through GitHub Actions.

## Communication

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussion
- **Discussions**: General questions and ideas
- **Discord**: Real-time chat and community support

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to Infinity Matrix! 🚀
