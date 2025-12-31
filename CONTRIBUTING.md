# Contributing to Infinity Matrix

Thank you for your interest in contributing to Infinity Matrix! This document provides guidelines for working with our automated PR system.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Automation Guidelines](#automation-guidelines)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Getting Help](#getting-help)

## Getting Started

### Prerequisites
- Git installed on your local machine
- GitHub account
- Understanding of Git workflow

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/infinity-matrix.git
   cd infinity-matrix
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/InfinityXOneSystems/infinity-matrix.git
   ```

4. Keep your fork updated:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

## Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
# or
git checkout -b docs/documentation-update
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### Making Changes

1. Make your changes following our [code standards](#code-standards)
2. Test your changes locally
3. Commit with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

### Commit Message Guidelines

Good commit messages help automation and reviewers:

```
Format: <type>: <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Formatting, missing semicolons, etc.
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks

Example:
feat: Add user authentication
fix: Resolve login timeout issue
docs: Update installation guide
```

## Pull Request Process

### Opening a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin your-branch-name
   ```

2. Open a PR on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference to related issues (if any)

3. Choose the appropriate PR type:
   - **Regular PR**: For features requiring review
   - **Draft PR**: For work in progress (prevents auto-merge)

### What Happens Next

Our automated system will:

1. **Auto-Fix** (1-2 minutes)
   - Applies code formatting
   - Fixes linting issues
   - Commits fixes to your PR
   - Comments on PR with results

2. **Auto-Resolve** (2-3 minutes)
   - Checks for merge conflicts
   - Attempts automatic resolution
   - Validates changes
   - Adds labels

3. **CI Checks** (timing varies)
   - Runs automated tests
   - Checks code quality
   - Validates builds

4. **Auto-Merge** (when criteria met)
   - Evaluates all conditions
   - Merges if approved
   - Notifies contributors

### Controlling Automation

You have full control over the automation:

#### Prevent Auto-Merge

Use any of these methods:

1. **Mark as Draft**
   ```bash
   gh pr create --draft
   ```

2. **Add Blocking Label**
   ```bash
   gh pr edit --add-label "do-not-merge"
   gh pr edit --add-label "wip"
   gh pr edit --add-label "needs-review"
   ```

3. **Keep as Draft in UI**
   - Click "Still in progress? Convert to draft"

#### Enable Auto-Merge

1. **Mark as Ready**
   ```bash
   gh pr ready
   ```

2. **Remove Blocking Labels**
   ```bash
   gh pr edit --remove-label "wip"
   ```

3. **Ensure Checks Pass**
   - Wait for CI to complete
   - Fix any failures

## Automation Guidelines

### When to Use Auto-Merge

✅ **Good candidates:**
- Documentation updates
- Dependency updates (Dependabot/Renovate)
- Minor bug fixes with tests
- Small refactorings
- Configuration changes

⚠️ **Use caution:**
- Breaking changes
- Major features
- Security-related changes
- Database migrations
- API changes

❌ **Avoid:**
- Complex architectural changes
- Changes without tests
- Experimental features
- Emergency hotfixes (review first)

### Best Practices

1. **Keep PRs Small**
   - Easier to review
   - Faster CI times
   - Lower risk
   - Better for auto-merge

2. **Write Tests**
   - Automated tests increase confidence
   - CI validates changes
   - Safer for auto-merge

3. **Update Documentation**
   - Keep docs in sync with code
   - Auto-fix will format them

4. **Respond to Auto-Fix**
   - Review automated commits
   - Ensure they're correct
   - Address any issues

5. **Monitor Your PRs**
   - Check notifications
   - Review workflow results
   - Fix failures promptly

## Code Standards

### Python Code

Our auto-fix workflow enforces:

- **Black** for formatting
- **isort** for import sorting
- **PEP 8** compliance via autopep8

You can run these locally:

```bash
# Install tools
pip install black isort autopep8 flake8

# Format code
black .
isort .
autopep8 --in-place --aggressive --aggressive --recursive .

# Check code
flake8 .
```

### General Guidelines

- Write clear, readable code
- Add comments for complex logic
- Follow existing patterns
- Keep functions focused and small
- Use meaningful variable names

## Testing

### Running Tests Locally

```bash
# Python
pytest tests/

# With coverage
pytest --cov=. tests/
```

### Writing Tests

- Add tests for new features
- Update tests for bug fixes
- Ensure tests pass locally before pushing
- Aim for high code coverage

### Test Standards

- Tests should be fast
- Tests should be independent
- Tests should be deterministic
- Use clear test names
- Add docstrings to test functions

## Getting Help

### Resources

- **README.md** - Setup and overview
- **CONFIGURATION.md** - Detailed configuration
- **EXAMPLES.md** - Usage examples
- **Workflow Logs** - Check Actions tab

### Asking Questions

1. **Check Documentation First**
   - Review README and guides
   - Check existing issues
   - Search discussions

2. **Open an Issue**
   - Use issue templates
   - Provide context
   - Include relevant logs

3. **Discussion Topics**
   - Questions about automation
   - Feature requests
   - Improvement suggestions

### Reporting Issues

When reporting issues with automation:

1. Include PR number
2. Share workflow logs
3. Describe expected vs actual behavior
4. Note any error messages

Example:
```markdown
**PR**: #123
**Workflow**: auto-merge
**Issue**: PR not auto-merging despite passing checks

**Logs**:
```
[workflow log excerpt]
```

**Expected**: PR should auto-merge
**Actual**: PR stuck in "ready" state
```

## Advanced Topics

### Working with Auto-Fix

If auto-fix makes changes you disagree with:

1. Discuss in PR comments
2. Open issue to adjust configuration
3. Add exceptions to workflow
4. Override locally and commit

### Customizing for Your PRs

You can customize behavior per PR:

```yaml
# Add to PR description
automation:
  auto-fix: false      # Skip auto-fix
  auto-merge: false    # Skip auto-merge
  merge-method: rebase # Use rebase instead of squash
```

*(Note: This requires workflow updates)*

### Debugging Workflow Issues

```bash
# View workflow runs
gh run list

# View specific run
gh run view RUN_ID --log

# Rerun workflow
gh run rerun RUN_ID

# Watch workflow
gh run watch
```

## Code Review

### For Contributors

- Respond to review comments promptly
- Address all feedback
- Ask for clarification if needed
- Mark conversations as resolved

### For Reviewers

- Be constructive and respectful
- Explain reasoning
- Suggest alternatives
- Approve when satisfied

## Release Process

*(To be defined based on project needs)*

Releases typically follow:
1. Feature freeze
2. Testing period
3. Version tagging
4. Release notes
5. Deployment

## Recognition

Contributors are recognized through:
- Commit history
- Release notes
- Contributors file
- GitHub insights

Thank you for contributing to Infinity Matrix! 🚀

## Questions?

If you have questions not covered here:
- Open an issue
- Check discussions
- Review documentation
- Contact maintainers

---

**Remember**: The automated system is here to help, not hinder. Use it as a tool to streamline your workflow, but always prioritize code quality and safety.
