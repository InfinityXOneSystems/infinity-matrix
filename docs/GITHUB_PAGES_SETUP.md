# GitHub Pages Configuration

To enable the admin dashboard via GitHub Pages:

## Setup Steps

1. **Navigate to Repository Settings**
   - Go to https://github.com/InfinityXOneSystems/infinity-matrix/settings

2. **Enable GitHub Pages**
   - Scroll to "Pages" section in the left sidebar
   - Click on "Pages"

3. **Configure Source**
   - Under "Build and deployment"
   - Source: Select "GitHub Actions"
   - This allows the dashboard-updater workflow to deploy pages

4. **Verify Configuration**
   - The dashboard will be available at: `https://infinityxonesystems.github.io/infinity-matrix/`
   - Initial deployment may take 5-10 minutes

## Automatic Updates

The `dashboard-updater.yml` workflow automatically:
- Updates dashboard metrics hourly
- Deploys to GitHub Pages on every update
- Reflects real-time system status

## Custom Domain (Optional)

To use a custom domain:
1. Add CNAME record in DNS: `dashboard.infinity-matrix.io` → `infinityxonesystems.github.io`
2. Add file `dashboard/CNAME` with content: `dashboard.infinity-matrix.io`
3. Configure in GitHub Pages settings

## Security

- Dashboard is read-only
- No sensitive data exposed
- All links point to public repository resources

## Troubleshooting

### Dashboard not accessible
- Verify GitHub Pages is enabled
- Check workflow run status
- Wait 5-10 minutes for initial deployment
- Check Actions tab for deployment logs

### Dashboard shows old data
- Check last workflow run time
- Manually trigger `dashboard-updater.yml`
- Verify metrics are being updated

### 404 Error
- Ensure source is set to "GitHub Actions"
- Check if `dashboard/index.html` exists
- Review deployment job logs

---

**Note**: This file is for documentation only. GitHub Pages must be configured through the repository settings UI.
