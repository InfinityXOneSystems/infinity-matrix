# Quick Start Guide

Get up and running with the Infinity Matrix automated PR system in 5 minutes!

## 🎯 What This System Does

**Auto-Fix**: Automatically formats and fixes code style issues in PRs
**Auto-Resolve**: Automatically resolves merge conflicts when possible
**Auto-Merge**: Automatically merges PRs when all criteria are met

## 🚀 30-Second Setup

### Step 1: Enable GitHub Actions
1. Go to your repository → **Settings** → **Actions** → **General**
2. Enable "Allow all actions and reusable workflows"
3. Click **Save**

### Step 2: Initialize Labels (Optional)
```bash
# Using GitHub CLI
gh workflow run init-labels.yml
```

Or run manually:
1. Go to **Actions** tab
2. Select "Initialize Repository Labels"
3. Click "Run workflow"

### Step 3: Create Your First PR
```bash
# Create a branch
git checkout -b feature/test-automation

# Make a change
echo "# Test" > test.md
git add test.md
git commit -m "feat: Add test file"
git push origin feature/test-automation

# Open PR
gh pr create --title "Test Automation" --body "Testing auto-merge system"
```

## ✨ Watch the Magic

Within minutes, you'll see:

1. **Auto-Fix runs** (if needed)
   - Commits formatting fixes
   - Comments: "✅ Auto-fix applied"

2. **Auto-Resolve checks**
   - Validates no conflicts
   - Adds "ready-to-merge" label

3. **Auto-Merge evaluates**
   - Waits for checks
   - Merges automatically
   - Comments: "✅ Auto-merged"

## 🎮 Control Options

### Prevent Auto-Merge

**Option 1: Draft PR**
```bash
gh pr create --draft --title "WIP: Feature"
```

**Option 2: Add Label**
```bash
gh pr edit --add-label "wip"
```

**Option 3: In GitHub UI**
- Check "Create draft pull request"

### Enable Auto-Merge

**Remove blocking labels**
```bash
gh pr edit --remove-label "wip"
gh pr ready  # If draft
```

## 📊 Status Indicators

Watch for these comments on your PR:

- ✅ **Auto-fix applied** - Code formatted successfully
- ✅ **Auto-resolved** - Conflicts resolved
- ✅ **Auto-merged** - PR merged automatically
- ⚠️ **Cannot resolve** - Manual conflict resolution needed
- ⚠️ **Cannot merge** - Criteria not met

## 🔧 Common Scenarios

### Scenario 1: Simple Feature
```bash
# Make changes
git checkout -b feature/simple
echo "code" > file.py
git add . && git commit -m "feat: Add feature"
git push origin feature/simple

# Open PR - auto-merges in ~5 min
gh pr create --title "Add feature"
```

### Scenario 2: Work in Progress
```bash
# Open as draft
gh pr create --draft --title "WIP: Complex feature"

# Work continues...
# When ready:
gh pr ready
```

### Scenario 3: Needs Review
```bash
# Open PR with review requirement
gh pr create --title "Breaking change"
gh pr edit --add-label "needs-review"

# After approval:
gh pr edit --remove-label "needs-review"
# Auto-merge takes over
```

## 🎓 Learn More

- **Full Documentation**: See `README.md`
- **Configuration**: See `CONFIGURATION.md`
- **Examples**: See `EXAMPLES.md`
- **Contributing**: See `CONTRIBUTING.md`

## ⚡ Tips for Success

1. **Keep PRs small** → Faster merges
2. **Write tests** → More confidence
3. **Run checks locally** → Avoid CI failures
4. **Use labels wisely** → Control automation
5. **Monitor first PRs** → Ensure it works

## 🐛 Troubleshooting

### PR Not Merging?

**Check 1: View PR status**
```bash
gh pr view
gh pr checks
```

**Check 2: Look for blocking labels**
```bash
gh pr view --json labels
```

**Check 3: Are checks passing?**
```bash
gh pr checks
# All should show ✓
```

**Check 4: View workflow logs**
```bash
gh run list --limit 5
gh run view [RUN_ID] --log
```

### Common Issues

| Issue | Solution |
|-------|----------|
| PR not merging | Check for "wip" or "do-not-merge" labels |
| Checks failing | Fix code and push again |
| Conflicts detected | Let auto-resolve try, or fix manually |
| Auto-fix not running | Ensure Python files exist in PR |

## 📞 Getting Help

1. **Check workflow logs** in Actions tab
2. **Review documentation** files
3. **Open an issue** with workflow logs
4. **Ask in discussions** for general questions

## 🎉 Success Metrics

After setup, you should see:

- ✅ PRs formatted automatically
- ✅ Simple conflicts resolved automatically  
- ✅ Low-risk PRs merged automatically
- ✅ Time saved on routine merges
- ✅ Consistent code style

## 🔐 Safety Features

The system includes:

- **Draft PR protection** - Won't merge drafts
- **Label-based control** - Blocking labels prevent merge
- **Check validation** - Won't merge if checks fail
- **Review awareness** - Respects requested changes
- **Conflict detection** - Won't merge with conflicts

## Next Steps

1. Complete setup above
2. Test with a simple PR
3. Read full README
4. Customize workflows for your needs
5. Roll out to team

## 🌟 Best Practices

**DO:**
- Start with draft PRs for complex changes
- Use labels to control automation
- Monitor the first few auto-merges
- Keep documentation updated
- Trust the automation for simple changes

**DON'T:**
- Auto-merge breaking changes without review
- Ignore auto-fix commits - review them
- Skip writing tests
- Override safety features
- Force-push to PR branches

---

## Ready to Go!

You're all set! Create a PR and watch the automation work. The system is designed to be safe, predictable, and helpful.

Need more details? Check out the full documentation:
- 📖 `README.md` - Complete overview
- ⚙️ `CONFIGURATION.md` - Advanced settings  
- 💡 `EXAMPLES.md` - Real-world scenarios
- 🤝 `CONTRIBUTING.md` - Contribution guide

Happy automating! 🚀
