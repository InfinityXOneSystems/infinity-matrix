# Usage Examples

This document provides practical examples of how the automated PR system works in different scenarios.

## Table of Contents
- [Basic Workflow](#basic-workflow)
- [Scenario: Dependabot PRs](#scenario-dependabot-prs)
- [Scenario: Feature Development](#scenario-feature-development)
- [Scenario: Hotfix](#scenario-hotfix)
- [Scenario: Documentation Updates](#scenario-documentation-updates)
- [Scenario: Merge Conflicts](#scenario-merge-conflicts)
- [Scenario: Failed Checks](#scenario-failed-checks)
- [Common Commands](#common-commands)

## Basic Workflow

### Standard Pull Request Flow

1. **Developer creates PR**
   ```bash
   git checkout -b feature/new-feature
   # Make changes
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   # Open PR on GitHub
   ```

2. **Auto-Fix runs automatically**
   - Workflow triggers on PR open
   - Fixes formatting issues
   - Commits fixes to PR branch
   - Comments on PR: "✅ Auto-fix applied"

3. **Auto-Resolve checks conflicts**
   - Checks if PR has conflicts with base
   - Attempts automatic resolution if needed
   - Validates after resolution
   - Adds `ready-to-merge` label

4. **Auto-Merge evaluates criteria**
   - Waits for all checks to pass
   - Verifies no blocking labels
   - Checks review status
   - Merges PR automatically
   - Comments on PR: "✅ Auto-merged"

## Scenario: Dependabot PRs

Dependabot PRs are perfect candidates for full automation.

### Setup for Dependabot

```yaml
# In auto-merge.yml, add special handling:
- name: Check if Dependabot PR
  id: check_dependabot
  run: |
    author="${{ github.event.pull_request.user.login }}"
    if [[ $author == "dependabot"* ]]; then
      echo "is_dependabot=true" >> $GITHUB_OUTPUT
    fi

- name: Auto-approve Dependabot
  if: steps.check_dependabot.outputs.is_dependabot == 'true'
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.pulls.createReview({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.issue.number,
        event: 'APPROVE'
      });
```

### Example Flow

1. Dependabot opens PR for dependency update
2. Auto-fix ensures code style compliance
3. CI tests run automatically
4. Auto-merge checks pass
5. PR merges automatically (typically within 5-10 minutes)

### Expected Timeline
```
00:00 - PR opened by Dependabot
00:01 - Auto-fix runs and commits
00:02 - CI tests start
00:05 - Tests complete successfully
00:05 - Auto-merge evaluates criteria
00:06 - PR merged automatically
```

## Scenario: Feature Development

For feature development, you may want more control.

### Workflow with Manual Review

1. **Open PR as draft** (prevents auto-merge)
   ```bash
   # Using GitHub CLI
   gh pr create --draft --title "WIP: New feature" --body "Work in progress"
   ```

2. **Auto-fix applies formatting**
   - Runs even for draft PRs
   - Keeps code clean during development

3. **When ready, mark as ready for review**
   ```bash
   gh pr ready
   ```

4. **Add label to require review**
   ```bash
   gh pr edit --add-label "needs-review"
   ```

5. **After approval, remove blocking label**
   ```bash
   gh pr edit --remove-label "needs-review"
   ```

6. **Auto-merge takes over**
   - Evaluates all criteria
   - Merges when ready

### Using Labels to Control Flow

```bash
# Prevent auto-merge during development
gh pr edit --add-label "wip"

# Ready for review but not auto-merge
gh pr edit --remove-label "wip" --add-label "needs-review"

# Ready for auto-merge
gh pr edit --remove-label "needs-review"
```

## Scenario: Hotfix

Hotfixes need to be fast but safe.

### Hotfix Workflow

1. **Create hotfix branch**
   ```bash
   git checkout -b hotfix/critical-bug
   # Fix the bug
   git add .
   git commit -m "Fix critical bug"
   git push origin hotfix/critical-bug
   ```

2. **Open PR with clear title**
   ```bash
   gh pr create --title "Hotfix: Critical bug" --body "Emergency fix" --base main
   ```

3. **Auto-fix and auto-resolve run**
   - Formatting applied quickly
   - Conflicts resolved automatically

4. **Fast-track merging**
   - If all checks pass immediately
   - Auto-merge happens within minutes

### Expected Timeline
```
00:00 - PR opened
00:01 - Auto-fix completes
00:02 - Auto-resolve validates
00:03 - CI starts (fast for hotfixes)
00:05 - All checks pass
00:06 - Auto-merged
```

### Manual Override if Needed

```bash
# If auto-merge doesn't trigger, check status
gh pr checks

# Force merge manually if absolutely necessary
gh pr merge --auto --squash
```

## Scenario: Documentation Updates

Documentation updates are low-risk and perfect for automation.

### Documentation PR

1. **Create docs PR**
   ```bash
   git checkout -b docs/update-readme
   # Update documentation
   git add README.md
   git commit -m "Update documentation"
   git push origin docs/update-readme
   gh pr create --title "docs: Update README" --body "Documentation improvements"
   ```

2. **Auto-fix runs**
   - Fixes whitespace in markdown
   - Normalizes line endings
   - Comments on PR

3. **Auto-merge proceeds quickly**
   - No complex tests to run
   - Merges almost immediately

### Expected Timeline
```
00:00 - PR opened
00:01 - Auto-fix completes
00:02 - Auto-merge evaluates
00:02 - PR merged (very fast!)
```

## Scenario: Merge Conflicts

When conflicts occur, auto-resolve attempts to fix them.

### Automatic Conflict Resolution

1. **PR has conflicts**
   ```
   PR opened → Conflicts detected with main
   ```

2. **Auto-resolve attempts fix**
   - Fetches latest base branch
   - Attempts merge with `-X theirs` strategy
   - Validates the resolution
   - Commits if successful

3. **Success path**
   ```
   ✅ Auto-resolve: Merge conflicts have been automatically resolved and validated.
   → Proceeds to auto-merge
   ```

4. **Failure path**
   ```
   ⚠️ Auto-resolve: Unable to automatically resolve conflicts. Manual intervention required.
   → Developer must resolve manually
   ```

### Manual Resolution if Needed

```bash
# Pull latest changes
git checkout your-branch
git fetch origin
git merge origin/main

# Resolve conflicts manually
# Edit conflicting files
git add .
git commit -m "Resolve merge conflicts"
git push origin your-branch

# Auto-merge will re-evaluate
```

## Scenario: Failed Checks

When checks fail, auto-merge waits or blocks.

### Check Failure Handling

1. **PR opened, checks fail**
   ```
   CI Tests: ❌ Failed
   Linting: ✅ Passed
   ```

2. **Auto-merge evaluates**
   - Detects failed check
   - Does NOT merge
   - Comments: Cannot merge - checks failed

3. **Developer fixes issues**
   ```bash
   # Fix the failing tests
   git add .
   git commit -m "Fix failing tests"
   git push
   ```

4. **Workflows re-run**
   - Auto-fix applies (if needed)
   - CI tests run again
   - Auto-merge re-evaluates

5. **All checks pass**
   - Auto-merge proceeds
   - PR merged automatically

### Example Timeline with Failures

```
00:00 - PR opened
00:01 - Auto-fix runs
00:02 - CI tests start
00:05 - CI tests fail ❌
00:05 - Auto-merge: Cannot merge (checks failed)
---
00:10 - Developer fixes code
00:11 - Push new commit
00:12 - Auto-fix runs again
00:13 - CI tests start again
00:18 - CI tests pass ✅
00:18 - Auto-merge: Criteria met
00:19 - PR merged ✅
```

## Common Commands

### GitHub CLI Commands

```bash
# Create PR
gh pr create --title "Title" --body "Description"

# Create draft PR
gh pr create --draft --title "WIP: Title"

# Mark PR as ready
gh pr ready

# Add/remove labels
gh pr edit --add-label "label-name"
gh pr edit --remove-label "label-name"

# Check PR status
gh pr view
gh pr checks

# Enable auto-merge manually
gh pr merge --auto --squash

# Disable auto-merge
gh pr merge --disable-auto

# Close PR
gh pr close

# List open PRs
gh pr list

# View PR in browser
gh pr view --web
```

### Git Commands

```bash
# Update branch with latest from main
git checkout your-branch
git fetch origin
git merge origin/main
git push

# Rebase on main (alternative)
git fetch origin
git rebase origin/main
git push --force-with-lease

# Check branch status
git status
git log --oneline -10

# View differences
git diff main...your-branch
```

### API Commands (using curl)

```bash
# Get PR status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/pulls/NUMBER

# Add label
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"labels": ["ready-to-merge"]}' \
  https://api.github.com/repos/OWNER/REPO/issues/NUMBER/labels

# Merge PR
curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"merge_method": "squash"}' \
  https://api.github.com/repos/OWNER/REPO/pulls/NUMBER/merge
```

## Tips and Best Practices

### For Fast Merging

1. **Keep PRs small** - Smaller PRs pass checks faster
2. **Write good commit messages** - Clear history helps
3. **Run tests locally first** - Avoid CI failures
4. **Keep branch updated** - Reduce conflicts
5. **Use draft mode** - For work in progress

### For Safety

1. **Review before removing "needs-review"** - Don't rush
2. **Monitor first few auto-merges** - Ensure it works as expected
3. **Use blocking labels** - When unsure
4. **Enable branch protection** - Extra safety net
5. **Check workflow logs** - Understand what happened

### For Efficiency

1. **Trust the automation** - For low-risk changes
2. **Use labels consistently** - Clear communication
3. **Standardize commit messages** - Better automation
4. **Keep dependencies updated** - Fewer conflicts
5. **Document exceptions** - When manual merge needed

## Troubleshooting Examples

### PR Not Auto-Merging

**Check 1: Is PR ready?**
```bash
gh pr view
# Look for: Draft status, Conflicts, Failed checks
```

**Check 2: Are there blocking labels?**
```bash
gh pr view --json labels
# Remove: wip, do-not-merge, needs-review
```

**Check 3: Are checks passing?**
```bash
gh pr checks
# All should show ✓
```

**Check 4: Review workflow logs**
```bash
gh run list --workflow=auto-merge.yml
gh run view RUN_ID --log
```

### Auto-Fix Not Working

**Check workflow ran**
```bash
gh run list --workflow=auto-fix.yml
```

**Check for Python files**
```bash
find . -name "*.py" | head -5
# Auto-fix only runs if Python files exist
```

**Manually trigger**
```bash
gh workflow run auto-fix.yml
```

### Conflicts Not Resolving

**Check conflict complexity**
```bash
git checkout your-branch
git fetch origin
git merge origin/main
# Review conflict markers manually
```

**Manual resolution steps**
```bash
# Resolve conflicts in editor
git add .
git commit -m "Resolve conflicts"
git push
# Auto-resolve will mark as resolved
```

## Summary

The automated PR system handles most common scenarios automatically while providing clear feedback and control when needed. Use labels and draft status to control the automation level, and monitor the first few merges to ensure it works as expected for your workflow.
