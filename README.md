# Infinity Matrix - Automated PR System

![Auto-Fix](https://img.shields.io/badge/auto--fix-enabled-brightgreen)
![Auto-Resolve](https://img.shields.io/badge/auto--resolve-enabled-blue)
![Auto-Merge](https://img.shields.io/badge/auto--merge-enabled-purple)

An intelligent GitHub automation system that automatically fixes, resolves, and merges pull requests.

## 🚀 Features

### 1. Auto-Fix (`auto-fix.yml`)
Automatically fixes common code issues in pull requests:
- **Code Formatting**: Applies Black formatter to Python code
- **Import Sorting**: Organizes imports with isort
- **Style Fixes**: Applies autopep8 for PEP 8 compliance
- **Whitespace Cleanup**: Removes trailing whitespace
- **Line Endings**: Normalizes line endings

**Triggers**: Runs on PR open, synchronize, or reopened events

### 2. Auto-Resolve (`auto-resolve.yml`)
Automatically resolves merge conflicts and validates PRs:
- **Conflict Detection**: Identifies merge conflicts with base branch
- **Smart Resolution**: Attempts automatic conflict resolution
- **Validation**: Runs checks after resolution
- **Status Monitoring**: Tracks PR status and checks
- **Labeling**: Adds `ready-to-merge` label when PR is ready

**Triggers**: Runs on PR open, synchronize, or reopened events

### 3. Auto-Merge (`auto-merge.yml`)
Automatically merges PRs when all criteria are met:
- **Criteria Checking**: Validates merge requirements
- **Status Verification**: Ensures all checks pass
- **Review Validation**: Checks for approvals and requested changes
- **Conflict Prevention**: Verifies PR is mergeable
- **Safe Merging**: Only merges when all conditions are satisfied

**Triggers**: Runs on PR events, reviews, check completions, or manually

## 📋 Merge Criteria

A PR will be automatically merged when:
- ✅ All status checks pass
- ✅ No merge conflicts exist
- ✅ PR is not in draft mode
- ✅ No blocking labels (`do-not-merge`, `wip`, `work-in-progress`, `needs-review`)
- ✅ No changes requested in reviews
- ✅ All required checks complete

## 🔧 Configuration

### Workflow Permissions
All workflows require:
```yaml
permissions:
  contents: write
  pull-requests: write
  checks: read
```

### Merge Method
By default, PRs are merged using the **squash** method. To change this, edit `.github/workflows/auto-merge.yml`:

```yaml
merge_method: 'squash'  # Options: 'merge', 'squash', 'rebase'
```

### Blocking Labels
To prevent auto-merge, add any of these labels to your PR:
- `do-not-merge`
- `wip`
- `work-in-progress`
- `needs-review`

## 🛠️ Setup Instructions

1. **Enable GitHub Actions**
   - Go to your repository settings
   - Navigate to Actions → General
   - Enable "Allow all actions and reusable workflows"

2. **Configure Branch Protection** (Optional but Recommended)
   - Go to Settings → Branches
   - Add rules for your main branch:
     - Require pull request reviews before merging
     - Require status checks to pass before merging
     - Require conversation resolution before merging

3. **Set Up Secrets** (if needed)
   - The workflows use `GITHUB_TOKEN` which is automatically provided
   - No additional secrets are required for basic functionality

## 📝 Usage

### For Pull Request Authors

1. **Create a Pull Request**
   - Open a PR as usual
   - The auto-fix workflow will automatically run and fix formatting issues
   - Auto-resolve will check for conflicts and attempt to resolve them

2. **Monitor Automation**
   - Check PR comments for automation status
   - Review auto-fix commits if any were made
   - Ensure all checks pass

3. **Prevent Auto-Merge** (if needed)
   - Mark PR as draft, OR
   - Add a blocking label (`do-not-merge`, `wip`, etc.)

### For Repository Maintainers

1. **Review Automated Changes**
   - Auto-fix commits are clearly labeled
   - Review the changes before merging (if auto-merge is not desired)

2. **Customize Workflows**
   - Edit workflow files in `.github/workflows/`
   - Adjust merge criteria in `auto-merge.yml`
   - Modify fix tools in `auto-fix.yml`

3. **Monitor Workflow Runs**
   - Check Actions tab for workflow status
   - Review logs for any issues
   - Adjust configurations as needed

## 🔍 Workflow Details

### Auto-Fix Workflow
```yaml
Trigger: pull_request [opened, synchronize, reopened]
Steps:
  1. Checkout code
  2. Setup Python environment
  3. Install formatting tools
  4. Run Black formatter
  5. Run isort
  6. Run autopep8
  7. Fix whitespace and line endings
  8. Commit and push fixes (if any)
  9. Comment on PR
```

### Auto-Resolve Workflow
```yaml
Trigger: pull_request [opened, synchronize, reopened]
Steps:
  1. Checkout code
  2. Fetch base branch
  3. Check for conflicts
  4. Attempt automatic resolution
  5. Run validation checks
  6. Add ready-to-merge label
  7. Comment on PR with results
```

### Auto-Merge Workflow
```yaml
Trigger: pull_request, pull_request_review, check_suite, workflow_dispatch
Steps:
  1. Get PR details
  2. Check merge criteria:
     - PR state and draft status
     - Merge conflicts
     - Blocking labels
     - Status checks
     - Reviews
  3. Merge PR (if criteria met)
  4. Comment on PR with results
```

## ⚙️ Advanced Configuration

### Custom Validation Checks
Add your project-specific checks to `auto-resolve.yml`:

```yaml
- name: Run validation checks
  run: |
    # Python tests
    pytest tests/
    
    # JavaScript tests
    npm test
    
    # Linting
    flake8 .
    
    # Type checking
    mypy .
```

### Customize Auto-Fix Tools
Modify `auto-fix.yml` to add or remove formatting tools:

```yaml
- name: Run additional formatter
  run: |
    # Add your custom formatting commands
    prettier --write "**/*.js"
    eslint --fix "**/*.js"
```

### Change Merge Strategy
In `auto-merge.yml`, modify the merge method:

```yaml
merge_method: 'merge'    # Standard merge commit
merge_method: 'squash'   # Squash and merge (default)
merge_method: 'rebase'   # Rebase and merge
```

## 🚦 Status Indicators

The workflows will comment on PRs with status indicators:
- ✅ Success: Action completed successfully
- ⚠️ Warning: Action completed with warnings or unable to complete
- ❌ Error: Action failed

## 🔒 Security Considerations

1. **Token Permissions**: Workflows use `GITHUB_TOKEN` with minimal required permissions
2. **Branch Protection**: Enable branch protection rules to prevent unwanted merges
3. **Review Requirements**: Configure required approvals for sensitive repositories
4. **Workflow Approval**: Consider requiring approval for workflows from first-time contributors

## 📊 Monitoring and Debugging

### View Workflow Runs
1. Go to the "Actions" tab in your repository
2. Select the workflow you want to inspect
3. Click on a specific run to view logs

### Common Issues

**Auto-fix not running**
- Verify GitHub Actions are enabled
- Check workflow file syntax
- Ensure Python files exist in the repository

**Auto-merge not working**
- Check merge criteria are met
- Verify no blocking labels are present
- Ensure all status checks pass
- Review branch protection rules

**Conflicts not resolving**
- Complex conflicts may require manual resolution
- Check auto-resolve comments for details
- Review merge strategy settings

## 🤝 Contributing

To improve these workflows:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with a pull request
5. Submit your improvements

## 📄 License

This automation system is part of the infinity-matrix project.

## 🆘 Support

For issues or questions:
- Open an issue in the repository
- Check workflow logs in the Actions tab
- Review GitHub Actions documentation

---

**Note**: These workflows are designed to be safe and conservative. They will never force-merge a PR that doesn't meet the criteria or has active concerns from reviewers.
