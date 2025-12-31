# Configuration Guide

This guide provides detailed instructions for configuring the automated PR system.

## Table of Contents
- [Workflow Configuration](#workflow-configuration)
- [Merge Settings](#merge-settings)
- [Auto-Fix Settings](#auto-fix-settings)
- [Auto-Resolve Settings](#auto-resolve-settings)
- [Branch Protection](#branch-protection)
- [Labels](#labels)
- [Environment Variables](#environment-variables)

## Workflow Configuration

### Basic Setup

All workflows are located in `.github/workflows/` directory:
- `auto-fix.yml` - Automatic code fixing
- `auto-resolve.yml` - Conflict resolution
- `auto-merge.yml` - Automatic merging

### Permissions

Each workflow requires specific permissions. The default configuration is:

```yaml
permissions:
  contents: write        # To push commits and merge PRs
  pull-requests: write   # To comment on PRs
  checks: read           # To read check status
```

### Disabling Workflows

To disable a workflow temporarily:
1. Add `if: false` to the job level
2. Or comment out the trigger events

Example:
```yaml
jobs:
  auto-merge:
    if: false  # Workflow disabled
    runs-on: ubuntu-latest
```

## Merge Settings

### Merge Method

The default merge method is **squash**. To change it, edit `auto-merge.yml`:

```yaml
merge_method: 'squash'
```

Available options:
- `merge` - Standard merge commit (preserves all commits)
- `squash` - Squash all commits into one (recommended)
- `rebase` - Rebase and merge (linear history)

### Merge Commit Messages

Customize merge commit messages in `auto-merge.yml`:

```yaml
commit_title: `Auto-merge: PR #${prNumber}`
commit_message: 'Automatically merged by GitHub Actions workflow'
```

### Merge Criteria Customization

Modify the merge criteria in the `check_criteria` step of `auto-merge.yml`:

```yaml
# Add custom criteria
const hasCustomLabel = pr.labels.some(label => 
  label.name === 'approved-for-merge'
);

if (!hasCustomLabel) {
  core.setOutput('can_merge', 'false');
  core.setOutput('reason', 'Missing approved-for-merge label');
  return false;
}
```

## Auto-Fix Settings

### Formatting Tools

Current tools enabled by default:
- **Black** - Python code formatter
- **isort** - Import sorting
- **autopep8** - PEP 8 compliance

### Adding New Formatters

Add additional formatters in `auto-fix.yml`:

#### JavaScript/TypeScript
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'

- name: Install Prettier
  run: npm install -g prettier eslint

- name: Run Prettier
  run: prettier --write "**/*.{js,ts,jsx,tsx}"

- name: Run ESLint
  run: eslint --fix "**/*.{js,ts,jsx,tsx}" || true
```

#### Go
```yaml
- name: Setup Go
  uses: actions/setup-go@v4
  with:
    go-version: '1.21'

- name: Run gofmt
  run: gofmt -w .

- name: Run goimports
  run: |
    go install golang.org/x/tools/cmd/goimports@latest
    goimports -w .
```

#### Rust
```yaml
- name: Setup Rust
  uses: actions-rs/toolchain@v1
  with:
    toolchain: stable

- name: Run rustfmt
  run: cargo fmt --all
```

### Excluding Directories

To exclude specific directories from auto-fix:

```yaml
- name: Run Black formatter
  run: |
    black . --exclude '/(\.git|\.venv|venv|env|build|dist|\.eggs|node_modules)/'
```

### Customizing Fix Commit Message

Change the commit message in `auto-fix.yml`:

```yaml
git commit -m "Auto-fix: Apply formatting and linting fixes"
```

## Auto-Resolve Settings

### Conflict Resolution Strategy

The default strategy uses `-X theirs`. Available strategies:

```yaml
# Accept incoming changes (from base branch)
git merge origin/${{ github.base_ref }} -X theirs --no-commit

# Accept current changes (from PR branch)
git merge origin/${{ github.base_ref }} -X ours --no-commit

# Default merge strategy
git merge origin/${{ github.base_ref }} --no-commit
```

### Adding Custom Validation

Add project-specific validation after conflict resolution:

```yaml
- name: Run validation checks
  if: steps.auto_resolve.outputs.resolved == 'true'
  run: |
    # Python validation
    pip install -r requirements.txt
    pytest tests/
    
    # JavaScript validation
    npm install
    npm run test
    
    # Linting
    flake8 .
    eslint .
    
    # Type checking
    mypy src/
    tsc --noEmit
```

### Custom Resolution Logic

Add custom resolution logic for specific file types:

```yaml
- name: Custom resolution for specific files
  run: |
    # Accept theirs for documentation
    git checkout --theirs -- "*.md"
    
    # Accept ours for configuration
    git checkout --ours -- "*.config.js"
    
    # Custom merge for package files
    git checkout --theirs -- "package.json"
    npm install
```

## Branch Protection

### Recommended Settings

For optimal automation, configure branch protection:

1. **Required Status Checks**
   ```
   ☑ Require status checks to pass before merging
   ☑ Require branches to be up to date before merging
   
   Select checks:
   - auto-fix
   - auto-resolve
   - (any other CI checks)
   ```

2. **Pull Request Reviews**
   ```
   ☐ Require approvals: 0 (for full automation)
   ☑ Require approvals: 1+ (for semi-automation)
   ☐ Dismiss stale approvals
   ☑ Require review from Code Owners
   ```

3. **Other Settings**
   ```
   ☑ Require conversation resolution before merging
   ☑ Require linear history (if using squash/rebase)
   ☐ Allow force pushes (not recommended)
   ☐ Allow deletions (not recommended)
   ```

### Bypass Options

To allow automation while keeping protection:
```
☑ Allow specified actors to bypass required pull requests
Add: github-actions[bot]
```

## Labels

### Default Labels

The automation uses these labels:

1. **ready-to-merge**
   - Added by: auto-resolve workflow
   - Purpose: Indicates PR is ready for merging
   - Color: `#0e8a16` (green)

2. **do-not-merge**
   - Purpose: Prevents auto-merge
   - Color: `#d93f0b` (red)
   - Usage: Add manually to block merging

3. **wip** / **work-in-progress**
   - Purpose: Prevents auto-merge
   - Color: `#fbca04` (yellow)
   - Usage: Add for PRs still in development

4. **needs-review**
   - Purpose: Prevents auto-merge
   - Color: `#0052cc` (blue)
   - Usage: Add when review is required

### Creating Labels

Create labels via GitHub UI or API:

```bash
# Using GitHub CLI
gh label create ready-to-merge --color 0e8a16 --description "PR is ready to merge"
gh label create do-not-merge --color d93f0b --description "Do not auto-merge this PR"
gh label create wip --color fbca04 --description "Work in progress"
gh label create needs-review --color 0052cc --description "Requires review"
```

### Customizing Label Behavior

Modify blocking labels in `auto-merge.yml`:

```yaml
const blockingLabels = ['do-not-merge', 'wip', 'work-in-progress', 'needs-review', 'breaking-change'];
```

Add auto-labeling in `auto-resolve.yml`:

```yaml
- name: Add custom label
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
        labels: ['auto-fixed']
      });
```

## Environment Variables

### GitHub Token

The workflows use `GITHUB_TOKEN` which is automatically provided:

```yaml
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Custom Secrets

Add custom secrets for external services:

1. Go to Settings → Secrets and variables → Actions
2. Add new repository secret
3. Use in workflow:

```yaml
env:
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
  CUSTOM_API_KEY: ${{ secrets.CUSTOM_API_KEY }}
```

### Environment-Specific Configuration

Use environment variables for configuration:

```yaml
env:
  PYTHON_VERSION: '3.11'
  NODE_VERSION: '18'
  MERGE_METHOD: 'squash'
  ENABLE_AUTO_FIX: 'true'
  ENABLE_AUTO_RESOLVE: 'true'
  ENABLE_AUTO_MERGE: 'true'
```

## Advanced Scenarios

### Conditional Automation

Enable automation only for specific conditions:

```yaml
jobs:
  auto-merge:
    if: |
      github.event.pull_request.user.login == 'dependabot[bot]' ||
      contains(github.event.pull_request.labels.*.name, 'auto-merge-allowed')
```

### Time-Based Automation

Prevent merging during certain hours:

```yaml
- name: Check time window
  run: |
    current_hour=$(date +%H)
    if [ $current_hour -ge 17 ] || [ $current_hour -lt 9 ]; then
      echo "Outside merge window (9 AM - 5 PM)"
      exit 1
    fi
```

### Author-Based Rules

Different rules for different authors:

```yaml
- name: Check author
  id: check_author
  run: |
    author="${{ github.event.pull_request.user.login }}"
    if [[ $author == "dependabot"* ]] || [[ $author == "renovate"* ]]; then
      echo "trusted_bot=true" >> $GITHUB_OUTPUT
    fi

- name: Auto-merge for bots
  if: steps.check_author.outputs.trusted_bot == 'true'
  # ... merge logic
```

### Integration with External Services

Add notifications or checks:

```yaml
- name: Notify Slack
  if: steps.auto_merge.conclusion == 'success'
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "PR #${{ github.event.pull_request.number }} auto-merged"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Enable Debug Logging

Add debug output to workflows:

```yaml
- name: Debug information
  run: |
    echo "PR Number: ${{ github.event.pull_request.number }}"
    echo "Base Branch: ${{ github.base_ref }}"
    echo "Head Branch: ${{ github.head_ref }}"
    echo "Author: ${{ github.event.pull_request.user.login }}"
```

Enable GitHub Actions debug logging:
1. Add secret: `ACTIONS_STEP_DEBUG` = `true`
2. Add secret: `ACTIONS_RUNNER_DEBUG` = `true`

### Common Issues

**Workflow not triggering**
- Check trigger events match your use case
- Verify workflow file is in `.github/workflows/`
- Ensure workflow YAML is valid

**Permission errors**
- Verify workflow permissions are set
- Check branch protection settings
- Ensure GitHub Actions is enabled

**Merge failures**
- Review merge criteria in logs
- Check for conflicts
- Verify all checks passed

## Best Practices

1. **Start Conservative**: Begin with manual merge approval
2. **Test Thoroughly**: Use test repository first
3. **Monitor Closely**: Watch first few auto-merges
4. **Keep Logs**: Review workflow logs regularly
5. **Document Changes**: Update docs when modifying workflows
6. **Use Labels**: Implement clear labeling strategy
7. **Set Boundaries**: Use time windows and author checks
8. **Enable Notifications**: Get alerts for auto-merges

## Support

For additional help:
- Review workflow logs in Actions tab
- Check GitHub Actions documentation
- Open an issue in the repository
