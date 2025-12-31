# Contributing to Infinity Matrix

Thank you for your interest in contributing to the Infinity Matrix autonomous tracking and management system!

## How to Contribute

### Reporting Issues

1. **Check existing issues** - Search for similar issues before creating new ones
2. **Use issue templates** - Follow the provided templates for consistency
3. **Provide details** - Include steps to reproduce, expected behavior, and actual behavior
4. **Add labels** - Help categorize the issue appropriately

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/your-feature-name`
3. **Make your changes** - Follow our coding standards
4. **Test your changes** - Ensure everything works as expected
5. **Commit with clear messages** - Use conventional commit format
6. **Push to your fork** - `git push origin feature/your-feature-name`
7. **Open a Pull Request** - Describe your changes clearly

## Automatic Tracking

All contributions are automatically tracked:
- **Commits** are logged by the tracking system
- **Pull Requests** are synced to the project board
- **Changes** generate audit logs
- **Documentation** is updated automatically

You don't need to manually update tracking or documentation - the system handles this autonomously.

## Development Guidelines

### Code Style

- Follow existing code patterns
- Use clear, descriptive variable names
- Comment complex logic
- Keep functions focused and small

### Workflow Development

When creating or modifying workflows:

```yaml
name: Your Workflow Name

on:
  # Clear trigger conditions
  push:
    branches: [main]

permissions:
  # Minimal required permissions
  contents: read

jobs:
  your-job:
    runs-on: ubuntu-latest
    name: Clear Job Description
    
    steps:
      - name: Descriptive step name
        run: |
          # Well-commented commands
          echo "Clear output messages"
```

### Documentation

- Update SOPs if changing system behavior
- Add inline comments for complex logic
- Update README if changing setup process
- Include examples in guides

### Testing

- Test workflows locally with `act` if possible
- Use `workflow_dispatch` for manual testing
- Verify logs are generated correctly
- Check dashboard updates

## Commit Message Format

We use conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks

Examples:
```
feat(tracking): add support for release events
fix(dashboard): correct metrics calculation
docs(sop): update workflow operations guide
```

## Pull Request Process

1. **Automated Checks**
   - All workflows must pass
   - No broken links in documentation
   - Valid YAML syntax

2. **Review Process**
   - At least one approval required
   - Address reviewer feedback
   - Keep PR focused and small

3. **Merge**
   - Squash and merge preferred
   - Clear merge commit message
   - Automatic tracking triggers

## Project Board

When you create an Issue or PR:
- It's automatically added to the project board
- Status updates based on PR state
- No manual board management needed

Columns:
- **To Do**: New issues and PRs
- **In Progress**: Active work
- **Review**: Ready for review
- **Done**: Completed and merged

## Code Review Guidelines

### As a Reviewer

- Be constructive and respectful
- Suggest improvements clearly
- Approve when ready
- Check for:
  - Code quality
  - Test coverage
  - Documentation updates
  - Security issues

### As an Author

- Respond to feedback promptly
- Make requested changes
- Ask questions if unclear
- Keep discussions focused

## Community Guidelines

### Be Respectful

- Treat everyone with respect
- Value diverse perspectives
- Be patient and helpful
- Focus on constructive feedback

### Be Collaborative

- Share knowledge freely
- Help others learn
- Document decisions
- Communicate clearly

### Be Professional

- Follow code of conduct
- Keep discussions on topic
- Avoid spam or self-promotion
- Respect project maintainers

## Getting Help

### Documentation

- [System Overview SOP](docs/sops/system-overview.md)
- [Implementation Guides](infinity_library/guides/README.md)
- [Architecture Docs](infinity_library/architecture/README.md)

### Community

- [GitHub Discussions](https://github.com/InfinityXOneSystems/infinity-matrix/discussions)
- [Q&A Forum](https://github.com/InfinityXOneSystems/infinity-matrix/discussions/categories/q-a)
- [Wiki](https://github.com/InfinityXOneSystems/infinity-matrix/wiki)

### Support

- Create an issue for bugs
- Use discussions for questions
- Tag maintainers if urgent
- Check FAQ first

## Recognition

Contributors are recognized through:
- Automatic commit attribution
- PR merge credits
- Contributor list updates
- Community highlights

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing:
1. Check the documentation
2. Search existing discussions
3. Ask in Q&A discussions
4. Create an issue if needed

Thank you for contributing to Infinity Matrix! 🎯

---

**Note**: This repository uses autonomous tracking. All your contributions are automatically logged, tracked, and documented. You don't need to update documentation manually unless making structural changes.
