# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix! This document provides guidelines for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and professional in all interactions.

## How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check if the issue already exists
2. Collect relevant information (logs, screenshots, steps to reproduce)
3. Use the issue template

### Suggesting Features

1. Check the [Feature Roadmap](docs/reports/ROADMAP.md)
2. Create a feature request issue
3. Describe the use case and expected behavior
4. Discuss with maintainers before implementing

### Contributing Code

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/infinity-matrix.git
cd infinity-matrix

# Add upstream remote
git remote add upstream https://github.com/InfinityXOneSystems/infinity-matrix.git
```

#### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b bugfix/issue-description
```

#### 3. Make Changes

Follow our coding standards:
- Python: PEP 8, type hints, docstrings
- TypeScript: Airbnb style guide, JSDoc comments
- Keep changes focused and atomic
- Write tests for new features

#### 4. Test Your Changes

```bash
# Run tests
pytest tests/

# Run linters
black .
ruff check .

# Run type checker
mypy app/
```

#### 5. Commit Your Changes

Follow conventional commits format:

```bash
git commit -m "feat: add new agent capability"
git commit -m "fix: resolve workflow timeout issue"
git commit -m "docs: update API documentation"
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Pull Request Process

1. **Description**: Provide a clear description of changes
2. **Link Issues**: Reference related issues
3. **Tests**: Ensure all tests pass
4. **Documentation**: Update relevant documentation
5. **Review**: Address review comments
6. **Merge**: Maintainer will merge when approved

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commits follow conventional format
- [ ] All CI checks pass
- [ ] PR description is clear and complete

## Development Setup

See [Setup Guide](docs/guides/SETUP.md) for detailed instructions.

Quick start:
```bash
docker-compose up -d
docker-compose exec api pytest
```

## Coding Standards

### Python

```python
def process_workflow(workflow_id: str, config: Dict[str, Any]) -> WorkflowResult:
    """
    Process a workflow with given configuration.
    
    Args:
        workflow_id: Unique workflow identifier
        config: Workflow configuration dictionary
        
    Returns:
        WorkflowResult: Processing result with status and output
        
    Raises:
        WorkflowError: If workflow processing fails
    """
    # Implementation
    pass
```

### TypeScript

```typescript
/**
 * Execute a workflow with provided parameters
 * 
 * @param workflowId - Unique workflow identifier
 * @param params - Execution parameters
 * @returns Promise resolving to workflow result
 * @throws {WorkflowError} If execution fails
 */
async function executeWorkflow(
  workflowId: string,
  params: WorkflowParams
): Promise<WorkflowResult> {
  // Implementation
}
```

## Documentation

### Update Documentation

When making changes, update:
- Code comments and docstrings
- README if needed
- API documentation
- User guides if user-facing changes
- Changelog

### Documentation Style

- Clear and concise
- Include examples
- Use proper formatting
- Link to related docs

## Testing

### Test Requirements

- Unit tests for all new code
- Integration tests for API changes
- E2E tests for critical flows
- Maintain or improve coverage

### Running Tests

```bash
# All tests
pytest

# Specific test file
pytest tests/test_agents.py

# With coverage
pytest --cov=app tests/
```

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas
- **Email**: dev@infinityxone.systems

### Getting Help

- Check [documentation](docs/)
- Search existing issues
- Ask in discussions
- Contact maintainers

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md
- Release notes
- Project README

Thank you for contributing to Infinity Matrix!

---

**Maintained By**: Maintainers Team  
**Last Updated**: 2025-12-31
