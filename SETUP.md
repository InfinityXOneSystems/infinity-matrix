# Initial Setup Guide

This guide walks you through setting up the Infinity Matrix autonomous tracking system for the first time.

## Prerequisites

- Repository admin access
- GitHub Actions enabled
- Basic understanding of GitHub workflows

## Step-by-Step Setup

### 1. Repository Structure ✅

The directory structure is already created:
```
✅ .github/workflows/     # Automated workflows
✅ docs/sops/            # Standard Operating Procedures
✅ docs/tracking/        # Audit logs and tracking data
✅ infinity_library/     # Knowledge base
✅ dashboard/            # Admin dashboard
✅ agents/               # Agent modules
✅ cortex/               # Core processing
✅ index_system/         # Search and indexing
```

### 2. Enable GitHub Pages

**Required for dashboard access**

1. Go to repository Settings: https://github.com/InfinityXOneSystems/infinity-matrix/settings
2. Navigate to "Pages" in the left sidebar
3. Under "Build and deployment":
   - Source: Select **"GitHub Actions"**
4. Click "Save"
5. Wait 5-10 minutes for initial deployment

**Dashboard URL**: https://infinityxonesystems.github.io/infinity-matrix/

### 3. Set Up Project Board

**For automatic issue/PR tracking**

#### Option A: Use Existing Project
If you already have "Infinity-X-One-Systems Project 1":
1. Verify URL: https://github.com/orgs/InfinityXOneSystems/projects/1
2. Ensure it has these columns: To Do, In Progress, Review, Done
3. No further action needed - workflows are configured!

#### Option B: Create New Project
1. Go to organization projects: https://github.com/orgs/InfinityXOneSystems/projects
2. Click "New project"
3. Choose "Board" template
4. Name it appropriately
5. Create columns: To Do, In Progress, Review, Done
6. Update workflow file `.github/workflows/project-board-sync.yml` with the new URL

### 4. Enable Wiki (Optional but Recommended)

1. Go to repository Settings
2. Under "Features" section
3. Check "Wikis"
4. Click "Save changes"
5. Visit Wiki tab to create initial pages
6. See [Wiki Setup Guide](docs/WIKI_AND_DISCUSSIONS_SETUP.md)

### 5. Enable Discussions (Optional but Recommended)

1. Go to repository Settings
2. Under "Features" section
3. Check "Discussions"
4. Click "Set up discussions"
5. Create categories: Announcements, Ideas, Q&A, Knowledge Sharing
6. See [Discussions Setup Guide](docs/WIKI_AND_DISCUSSIONS_SETUP.md)

### 6. Verify Workflows

All workflows are already configured. Verify they're ready:

```bash
# Check workflow files exist
ls -la .github/workflows/

# You should see:
# - tracking.yml
# - project-board-sync.yml
# - audit-logger.yml
# - sop-generator.yml
# - dashboard-updater.yml
```

### 7. Test the System

#### Create a Test Issue
1. Go to Issues tab
2. Click "New issue"
3. Create a simple test issue
4. Verify:
   - Issue appears on project board (if configured)
   - Tracking workflow runs (check Actions tab)
   - Logs generated in docs/tracking/

#### Create a Test PR
1. Create a new branch: `git checkout -b test-tracking`
2. Make a small change: `echo "test" > test.txt`
3. Commit and push: `git add test.txt && git commit -m "test: verify tracking" && git push`
4. Open a pull request
5. Verify:
   - PR appears on project board
   - Tracking logs generated
   - Audit log created

#### Check Dashboard
1. Wait 5-10 minutes after enabling Pages
2. Visit: https://infinityxonesystems.github.io/infinity-matrix/
3. Verify:
   - Dashboard loads correctly
   - All links work
   - Metrics display

### 8. Configure Permissions (If Needed)

If workflows fail with permission errors:

1. Go to Settings → Actions → General
2. Under "Workflow permissions":
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
3. Click "Save"

### 9. Customize (Optional)

#### Update Project Board URL
If using a different project board:

Edit `.github/workflows/project-board-sync.yml`:
```yaml
# Line ~23
project-url: https://github.com/orgs/YourOrg/projects/YOUR_PROJECT_NUMBER
```

#### Adjust Dashboard Update Frequency
Edit `.github/workflows/dashboard-updater.yml`:
```yaml
# Line ~4 - Change cron schedule
- cron: '0 * * * *'  # Currently hourly, adjust as needed
```

## Verification Checklist

After setup, verify these items:

- [ ] GitHub Pages enabled and dashboard accessible
- [ ] Project board created and URL configured
- [ ] Wiki enabled (optional)
- [ ] Discussions enabled (optional)
- [ ] Test issue created and tracked
- [ ] Test PR created and tracked
- [ ] Workflows running successfully (check Actions tab)
- [ ] Tracking logs appearing in docs/tracking/
- [ ] Dashboard displaying correct information
- [ ] All dashboard links working

## Next Steps

1. **Review Documentation**
   - Read [System Overview SOP](docs/sops/system-overview.md)
   - Review [Architecture Documentation](infinity_library/architecture/README.md)
   - Check [Implementation Guides](infinity_library/guides/README.md)

2. **Customize System**
   - Add custom workflows as needed
   - Create agent modules
   - Extend tracking capabilities

3. **Monitor Operations**
   - Check dashboard regularly
   - Review audit logs weekly
   - Validate tracking completeness

4. **Engage Community**
   - Set up Wiki pages
   - Create discussion categories
   - Document your knowledge

## Troubleshooting

### Dashboard Not Accessible
- Verify GitHub Pages is enabled with "GitHub Actions" source
- Wait 5-10 minutes for deployment
- Check Actions tab for deployment workflow status
- Look for errors in workflow logs

### Workflows Not Running
- Check Actions are enabled in repository settings
- Verify workflow permissions (read/write)
- Review workflow trigger conditions
- Check Actions tab for error messages

### Project Board Not Syncing
- Verify project board URL is correct
- Ensure bot has access to project
- Check project board exists and is accessible
- Review workflow logs for errors

### Logs Not Generated
- Verify directory structure exists
- Check workflow completed successfully
- Ensure git push succeeded
- Review Actions logs for errors

## Getting Help

If you encounter issues:

1. **Check Documentation**
   - [System Overview SOP](docs/sops/system-overview.md)
   - [Troubleshooting Guide](infinity_library/guides/README.md)

2. **Review Workflow Logs**
   - Go to Actions tab
   - Click on failed workflow
   - Read error messages

3. **Ask for Help**
   - Create an issue describing the problem
   - Include relevant logs and error messages
   - Tag with appropriate labels

4. **Community Support**
   - Use Discussions for questions
   - Check Wiki for solutions
   - Search existing issues

## Success! 🎉

Once setup is complete, your Infinity Matrix system will:
- ✅ Automatically track all repository activities
- ✅ Maintain comprehensive audit logs
- ✅ Keep documentation up-to-date
- ✅ Sync issues/PRs to project board
- ✅ Display real-time status on dashboard
- ✅ Provide complete operational transparency

Everything is now **autonomous and hands-off**!

---

**Note**: This is a one-time setup. After completion, the system operates autonomously with no manual intervention required.
