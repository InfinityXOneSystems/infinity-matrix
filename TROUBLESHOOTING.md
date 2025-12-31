# Troubleshooting Guide

This guide helps you diagnose and fix common issues with the automated PR system.

## Table of Contents
- [Quick Diagnostics](#quick-diagnostics)
- [Workflow Not Running](#workflow-not-running)
- [Auto-Fix Issues](#auto-fix-issues)
- [Auto-Resolve Issues](#auto-resolve-issues)
- [Auto-Merge Issues](#auto-merge-issues)
- [Permission Errors](#permission-errors)
- [Performance Issues](#performance-issues)
- [Common Error Messages](#common-error-messages)

## Quick Diagnostics

### Check Workflow Status

```bash
# List recent workflow runs
gh run list --limit 10

# Check specific workflow
gh run list --workflow=auto-merge.yml --limit 5

# View details of a specific run
gh run view [RUN_ID]

# View logs
gh run view [RUN_ID] --log
```

### Check PR Status

```bash
# View PR details
gh pr view [PR_NUMBER]

# Check PR checks
gh pr checks [PR_NUMBER]

# View PR labels
gh pr view [PR_NUMBER] --json labels
```

### Verify Setup

```bash
# Check if workflows exist
ls -la .github/workflows/

# Validate YAML syntax
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/auto-merge.yml'))"

# Check GitHub Actions is enabled
gh api repos/:owner/:repo/actions/permissions
```

## Workflow Not Running

### Symptom
Workflows don't trigger when PR is opened or updated.

### Possible Causes & Solutions

#### 1. GitHub Actions Not Enabled

**Check:**
```bash
gh api repos/:owner/:repo/actions/permissions
```

**Fix:**
1. Go to repository Settings
2. Navigate to Actions → General
3. Enable "Allow all actions and reusable workflows"
4. Save changes

#### 2. Workflow File Location Wrong

**Check:**
```bash
ls -la .github/workflows/
```

**Fix:**
Ensure workflows are in `.github/workflows/` directory (note the dot at the start)

#### 3. YAML Syntax Error

**Check:**
```bash
# Validate each workflow
for file in .github/workflows/*.yml; do
  echo "Checking $file"
  python3 -c "import yaml; yaml.safe_load(open('$file'))"
done
```

**Fix:**
- Correct any YAML syntax errors
- Ensure proper indentation (use spaces, not tabs)
- Validate with online YAML validator

#### 4. Branch Not Matching Trigger

**Check workflow triggers:**
```yaml
on:
  pull_request:
    branches: [main]  # Only triggers for PRs to 'main'
```

**Fix:**
Adjust branch filters or create PR to correct branch

#### 5. PR from Forked Repository

**Issue:**
Workflows may not run on PRs from forks for security reasons.

**Fix:**
Configure workflow to run on `pull_request_target` (with caution) or approve workflow runs manually.

## Auto-Fix Issues

### Symptom: Auto-Fix Not Making Changes

#### Cause 1: No Python Files
**Check:**
```bash
find . -name "*.py" -not -path "./venv/*"
```

**Fix:**
Auto-fix currently only works with Python files. To add support for other languages, edit `.github/workflows/auto-fix.yml`

#### Cause 2: Files Already Formatted
**Check:**
```bash
black --check .
isort --check .
```

**Fix:**
No action needed - code is already properly formatted!

#### Cause 3: Tool Installation Failed
**Check logs:**
```bash
gh run view [RUN_ID] --log | grep "Install auto-fix tools"
```

**Fix:**
- Check if pip install succeeded
- Verify Python 3.11 is available
- Check for network issues

### Symptom: Auto-Fix Commits Unwanted Changes

#### Cause: Formatter Configuration Mismatch

**Fix:**
1. Add configuration files to exclude directories:

```ini
# pyproject.toml
[tool.black]
extend-exclude = '''
/(
  | specific-dir
  | another-dir
)/
'''
```

2. Update workflow to respect configuration:

```yaml
- name: Run Black formatter
  run: black .  # Will use pyproject.toml config
```

### Symptom: Permission Denied on Commit

#### Cause: Token Permissions

**Check workflow permissions:**
```yaml
permissions:
  contents: write  # Required
```

**Fix:**
1. Ensure workflow has `contents: write` permission
2. Check repository settings allow Actions to create commits

## Auto-Resolve Issues

### Symptom: Conflicts Not Resolving

#### Cause 1: Complex Conflicts
**Check:**
```bash
git fetch origin main
git merge origin/main
# Review conflict markers
```

**Fix:**
- Manual resolution required for complex conflicts
- Update workflow with custom resolution strategy if needed

#### Cause 2: Binary File Conflicts
**Check logs:**
```bash
gh run view [RUN_ID] --log | grep "conflict"
```

**Fix:**
Binary files cannot be auto-resolved. Resolve manually:
```bash
git checkout --theirs path/to/binary/file
# or
git checkout --ours path/to/binary/file
```

#### Cause 3: Merge Strategy Failing
**Fix:**
Try different merge strategies in `.github/workflows/auto-resolve.yml`:

```yaml
# Instead of -X theirs
git merge origin/${{ github.base_ref }} -X ours --no-commit

# Or default strategy
git merge origin/${{ github.base_ref }} --no-commit
```

### Symptom: Validation Failing After Resolution

#### Cause: Broken Code After Merge

**Check:**
Review the validation section in workflow logs

**Fix:**
1. Add more comprehensive validation
2. Use safer merge strategy
3. Require manual review for conflicted PRs

## Auto-Merge Issues

### Symptom: PR Not Auto-Merging

#### Diagnosis Checklist

Run through this checklist:

```bash
# 1. Check PR is not draft
gh pr view [PR_NUMBER] --json isDraft

# 2. Check for blocking labels
gh pr view [PR_NUMBER] --json labels

# 3. Check for conflicts
gh pr view [PR_NUMBER] --json mergeable

# 4. Check status checks
gh pr checks [PR_NUMBER]

# 5. Check reviews
gh pr view [PR_NUMBER] --json reviews

# 6. Check if workflow ran
gh run list --workflow=auto-merge.yml --limit 5
```

#### Cause 1: Draft PR
**Fix:**
```bash
gh pr ready [PR_NUMBER]
```

#### Cause 2: Blocking Label
**Fix:**
```bash
# Remove blocking labels
gh pr edit [PR_NUMBER] --remove-label "wip"
gh pr edit [PR_NUMBER] --remove-label "do-not-merge"
gh pr edit [PR_NUMBER] --remove-label "needs-review"
```

#### Cause 3: Checks Still Running
**Fix:**
Wait for checks to complete:
```bash
gh pr checks [PR_NUMBER] --watch
```

#### Cause 4: Checks Failed
**Fix:**
1. Review failed checks
2. Fix the issues
3. Push new commit

```bash
gh pr checks [PR_NUMBER]
# Fix issues
git add .
git commit -m "Fix failing checks"
git push
```

#### Cause 5: Changes Requested in Review
**Fix:**
1. Address review comments
2. Request re-review
```bash
# After addressing comments
gh pr review --approve [PR_NUMBER]
```

#### Cause 6: Merge Conflicts
**Fix:**
```bash
git fetch origin
git merge origin/main
# Resolve conflicts
git add .
git commit
git push
```

### Symptom: Merge Failed After Criteria Met

#### Check Error Message
```bash
gh run view [RUN_ID] --log | grep -A 10 "merge failed"
```

#### Common Causes

1. **Branch protection rules**: Check repository settings
2. **Required reviews not met**: Add approvals
3. **Race condition**: Another PR merged first, causing conflicts

**Fix:**
Review branch protection rules and ensure compliance

## Permission Errors

### Symptom: "Permission denied" or "403" Errors

#### Cause 1: Token Permissions
**Check workflow:**
```yaml
permissions:
  contents: write
  pull-requests: write
  checks: read
```

**Fix:**
Ensure all required permissions are declared

#### Cause 2: Repository Settings
**Check:**
1. Settings → Actions → General
2. Workflow permissions

**Fix:**
Enable "Read and write permissions" for workflows

#### Cause 3: Branch Protection
**Check:**
Settings → Branches → Branch protection rules

**Fix:**
Either:
- Remove strict protections, or
- Add github-actions[bot] to bypass list

## Performance Issues

### Symptom: Workflows Taking Too Long

#### Check Duration
```bash
gh run list --workflow=auto-fix.yml --json conclusion,startedAt,updatedAt
```

#### Optimization 1: Cache Dependencies
Add to workflow:
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
```

#### Optimization 2: Reduce Scope
```yaml
# Only run on specific file changes
on:
  pull_request:
    paths:
      - '**.py'
```

#### Optimization 3: Parallelize Jobs
```yaml
jobs:
  format:
    runs-on: ubuntu-latest
    # ...
  
  lint:
    runs-on: ubuntu-latest
    # Run in parallel
```

### Symptom: API Rate Limiting

#### Check Rate Limit
```bash
gh api rate_limit
```

#### Fix
- Reduce workflow frequency
- Use conditional execution
- Wait for rate limit reset

## Common Error Messages

### "Resource not accessible by integration"

**Meaning:** Workflow lacks required permissions

**Fix:**
```yaml
permissions:
  contents: write
  pull-requests: write
```

### "refused to merge: branch protection"

**Meaning:** Branch protection rules prevent merge

**Fix:**
1. Ensure all required checks pass
2. Get required approvals
3. Resolve all conversations

### "merge conflict"

**Meaning:** PR has conflicts with base branch

**Fix:**
```bash
git fetch origin
git merge origin/main
# Resolve conflicts
git push
```

### "workflow run failed"

**Meaning:** Generic failure in workflow

**Fix:**
Check specific step logs:
```bash
gh run view [RUN_ID] --log
```

### "reference does not exist"

**Meaning:** Branch not found

**Fix:**
Ensure PR branch still exists and is pushed to origin

### "API rate limit exceeded"

**Meaning:** Too many API calls

**Fix:**
Wait for rate limit reset (shown in error message)

## Advanced Debugging

### Enable Debug Logging

Add repository secrets:
- `ACTIONS_STEP_DEBUG` = `true`
- `ACTIONS_RUNNER_DEBUG` = `true`

Then re-run workflow to see detailed logs.

### Test Workflow Locally

Use [act](https://github.com/nektos/act) to test workflows locally:

```bash
# Install act
brew install act  # or see act documentation

# Run workflow
act pull_request -W .github/workflows/auto-fix.yml
```

### Inspect Workflow Context

Add debug step to workflow:

```yaml
- name: Debug Context
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "PR: ${{ github.event.pull_request.number }}"
    echo "Base: ${{ github.base_ref }}"
    echo "Head: ${{ github.head_ref }}"
```

### Check Workflow YAML

```bash
# Validate YAML
python3 -c "import yaml; print(yaml.safe_load(open('.github/workflows/auto-merge.yml')))"

# Check for common issues
grep -n "// " .github/workflows/*.yml  # JavaScript comments in YAML
grep -n "\t" .github/workflows/*.yml   # Tabs instead of spaces
```

## Getting Help

### Before Asking for Help

1. Check workflow logs
2. Verify PR status
3. Review this troubleshooting guide
4. Search existing issues

### When Asking for Help

Include:
1. PR number
2. Workflow run ID
3. Error message (from logs)
4. What you've tried
5. Expected vs actual behavior

### Where to Ask

1. **GitHub Issues**: For bugs and feature requests
2. **Discussions**: For questions and general help
3. **Workflow Logs**: Check Actions tab first

## Preventive Measures

### Regular Maintenance

- [ ] Review workflow logs weekly
- [ ] Update actions versions monthly
- [ ] Test workflows after changes
- [ ] Monitor success rates
- [ ] Keep documentation current

### Best Practices

1. **Test in Fork First**: Test workflow changes in a fork
2. **Use Draft PRs**: For testing and development
3. **Monitor First Few Runs**: Watch early auto-merges closely
4. **Document Customizations**: Note any changes made
5. **Keep Workflows Simple**: Complexity increases failure chances

## Recovery Procedures

### If Auto-Merge Merged Wrong PR

1. Revert the merge:
```bash
git revert -m 1 [merge-commit-sha]
git push origin main
```

2. Open new PR with revert
3. Investigate why criteria were met incorrectly
4. Update workflow to prevent recurrence

### If Auto-Fix Broke Code

1. Review auto-fix commit
2. If necessary, revert:
```bash
git revert [auto-fix-commit-sha]
git push
```
3. Fix formatting configuration
4. Update workflow exclusions

### If Workflows Stuck

1. Cancel running workflows:
```bash
gh run cancel [RUN_ID]
```

2. Check for:
   - Infinite loops
   - Hanging processes
   - Network issues

3. Re-run after fixing:
```bash
gh run rerun [RUN_ID]
```

## Contact Support

If you can't resolve the issue:

1. Open an issue with:
   - Workflow logs
   - PR number
   - Steps to reproduce
   - Expected behavior

2. Tag with appropriate label:
   - `bug` - Something isn't working
   - `help wanted` - Need assistance
   - `question` - Question about usage

---

**Remember**: Most issues can be resolved by checking logs and verifying PR status. Always start there!

For more information:
- [README.md](README.md) - Setup guide
- [CONFIGURATION.md](CONFIGURATION.md) - Configuration options
- [EXAMPLES.md](EXAMPLES.md) - Usage examples
