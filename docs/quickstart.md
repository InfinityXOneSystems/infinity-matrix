# Quick Start Guide - Infinity Matrix

Welcome to the Infinity Matrix autonomous bootstrap system! This guide will help you set up and operate the autonomous agent.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Agent](#running-the-agent)
5. [GitHub Actions Setup](#github-actions-setup)
6. [GitHub App Integration](#github-app-integration)
7. [Extending the Platform](#extending-the-platform)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- Python 3.8 or higher
- Git installed and configured
- GitHub account with repository access
- (Optional) GitHub App for advanced autonomous features

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
```

### 2. Create a Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- **flake8**: Code quality and linting
- **PyGithub**: GitHub API integration
- **python-dotenv**: Environment configuration
- **colorlog**: Colored logging output
- And other essential dependencies

## Configuration

### 1. Create Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Edit Configuration

Open `.env` and configure the following:

#### Basic Configuration

```env
# GitHub Personal Access Token (required for API access)
GITHUB_TOKEN=ghp_your_token_here

# Repository information
GITHUB_OWNER=InfinityXOneSystems
GITHUB_REPO=infinity-matrix
GITHUB_DEFAULT_BRANCH=main

# Agent operation mode
AGENT_MODE=dry-run
```

#### Agent Modes

- **dry-run**: Safe mode, no changes made (recommended for first run)
- **analysis**: Read-only mode, performs analysis without modifications
- **full**: Full autonomous mode, can create PRs and make changes

#### Optional: GitHub App Configuration

If you're using a GitHub App for enhanced permissions:

```env
GITHUB_APP_ID=123456
GITHUB_PRIVATE_KEY_PATH=/path/to/private-key.pem
GITHUB_APP_INSTALLATION_ID=12345678
```

### 3. Obtain GitHub Token

To get a GitHub Personal Access Token:

1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (full control of private repositories)
   - `workflow` (update GitHub Action workflows)
   - `write:packages` (if needed)
4. Copy the token and add it to your `.env` file

## Running the Agent

### Basic Usage

Run the agent in dry-run mode (safe, no changes):

```bash
python scripts/autonomous_agent.py --dry-run
```

### Operation Modes

#### Dry-Run Mode (Recommended for Testing)

```bash
python scripts/autonomous_agent.py --mode dry-run
```

This mode will:
- Analyze repository structure
- Check code quality
- Generate health reports
- **NOT** make any changes or create PRs

#### Analysis Mode

```bash
python scripts/autonomous_agent.py --mode analysis
```

This mode performs comprehensive analysis:
- Repository structure analysis
- Code quality checks with flake8
- Repository health assessment
- Read-only operations

#### Full Mode (Use with Caution)

```bash
python scripts/autonomous_agent.py --mode full
```

This mode can:
- Perform all analysis
- Create pull requests (if configured)
- Make automated changes (future feature)

### Debug Mode

Enable detailed logging:

```bash
python scripts/autonomous_agent.py --mode dry-run --debug
```

## GitHub Actions Setup

The repository includes an autonomous GitHub Actions workflow that runs scheduled analysis.

### Automatic Setup

The workflow is already configured in `.github/workflows/auto-bootstrap.yml` and will:

- Run weekly on Mondays at 00:00 UTC
- Can be manually triggered via workflow dispatch
- Automatically runs in dry-run mode by default

### Manual Trigger

1. Go to your repository on GitHub
2. Navigate to **Actions** tab
3. Select **Auto-Bootstrap** workflow
4. Click **Run workflow**
5. Choose mode (dry-run, analysis, or full)
6. Click **Run workflow** button

### Workflow Configuration

The workflow automatically:
- Checks out the repository
- Installs Python and dependencies
- Configures the agent
- Runs analysis
- Generates reports
- Creates issues on failure
- Uploads artifacts

### Customizing Schedule

Edit `.github/workflows/auto-bootstrap.yml`:

```yaml
on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
    
    # Run every 6 hours
    # - cron: '0 */6 * * *'
```

## GitHub App Integration

For full autonomous capabilities, you can create a GitHub App.

### Why Use a GitHub App?

- Enhanced API rate limits
- Fine-grained permissions
- Installation-based authentication
- Better security than personal tokens

### Creating a GitHub App

1. **Go to GitHub Settings**
   - Organization Settings → Developer Settings → GitHub Apps
   - Or: https://github.com/settings/apps

2. **Create New GitHub App**
   - Name: "Infinity Matrix Autonomous Agent"
   - Homepage URL: Your repository URL
   - Webhook: Disabled (for now)

3. **Set Permissions**
   - Repository permissions:
     - Contents: Read & Write
     - Pull Requests: Read & Write
     - Issues: Read & Write
     - Metadata: Read-only

4. **Generate Private Key**
   - Scroll to "Private keys"
   - Click "Generate a private key"
   - Save the `.pem` file securely

5. **Install the App**
   - Go to "Install App" tab
   - Install on your repository

6. **Configure Agent**
   - Copy App ID from app settings
   - Copy Installation ID from URL after installation
   - Update `.env`:
   
   ```env
   GITHUB_APP_ID=123456
   GITHUB_PRIVATE_KEY_PATH=/path/to/private-key.pem
   GITHUB_APP_INSTALLATION_ID=12345678
   ```

### Using GitHub App with Workflow

Add secrets to your repository:

1. Go to Repository Settings → Secrets and Variables → Actions
2. Add secrets:
   - `APP_ID`: Your GitHub App ID
   - `APP_PRIVATE_KEY`: Contents of the `.pem` file

3. Update workflow to use app authentication (advanced)

## Extending the Platform

### Adding Custom AI Modules

Create new modules in `ai_stack/`:

```python
# ai_stack/custom_analyzer.py
class CustomAnalyzer:
    def __init__(self):
        self.name = "Custom Analyzer"
    
    def analyze(self, repo_path):
        """Your custom analysis logic"""
        results = {}
        # ... your code ...
        return results
```

Use in agent:

```python
from ai_stack.custom_analyzer import CustomAnalyzer

analyzer = CustomAnalyzer()
results = analyzer.analyze("/path/to/repo")
```

### Adding Gateway Integrations

Create API integrations in `gateway_stack/`:

```python
# gateway_stack/slack_integration.py
import requests

class SlackIntegration:
    def __init__(self, webhook_url):
        self.webhook_url = webhook_url
    
    def send_notification(self, message):
        """Send notification to Slack"""
        payload = {"text": message}
        requests.post(self.webhook_url, json=payload)
```

### Extending the Agent

Subclass `AutonomousAgent` for custom behavior:

```python
from scripts.autonomous_agent import AutonomousAgent

class CustomAgent(AutonomousAgent):
    def custom_check(self):
        """Add your custom checks"""
        self.logger.info("Running custom check...")
        # Your logic here
    
    def run(self):
        """Override run to include custom checks"""
        super().run()
        self.custom_check()
```

## Troubleshooting

### Common Issues

#### Import Errors

**Problem**: `ModuleNotFoundError` when running the agent

**Solution**:
```bash
pip install -r requirements.txt
```

#### GitHub API Errors

**Problem**: `401 Unauthorized` or `403 Forbidden`

**Solution**:
- Check your `GITHUB_TOKEN` in `.env`
- Verify token has required scopes
- Ensure token hasn't expired

#### Flake8 Not Found

**Problem**: `flake8: command not found`

**Solution**:
```bash
pip install flake8
```

### Debug Mode

Enable debug logging to see detailed information:

```bash
python scripts/autonomous_agent.py --debug
```

### Checking Configuration

Verify your configuration:

```bash
python -c "
from dotenv import load_dotenv
import os
load_dotenv()
print('GITHUB_TOKEN:', 'Set' if os.getenv('GITHUB_TOKEN') else 'Not set')
print('AGENT_MODE:', os.getenv('AGENT_MODE', 'Not set'))
"
```

### Workflow Debugging

If GitHub Actions workflow fails:

1. Go to Actions tab
2. Click on failed workflow run
3. Expand the failed step
4. Check logs for error messages
5. Download artifacts for detailed analysis

## Best Practices

### Safety First

1. **Always test in dry-run mode first**
2. **Review PR changes before merging**
3. **Keep GitHub token secure**
4. **Use minimal required permissions**

### Regular Maintenance

1. **Update dependencies regularly**:
   ```bash
   pip install --upgrade -r requirements.txt
   ```

2. **Review agent logs periodically**

3. **Monitor GitHub Actions usage**

### Security

1. **Never commit `.env` file**
2. **Rotate tokens regularly**
3. **Use GitHub App for production**
4. **Enable branch protection on main**

## Next Steps

Now that you've completed setup:

1. ✅ Run agent in dry-run mode
2. ✅ Review analysis output
3. ✅ Configure GitHub Actions
4. ✅ (Optional) Set up GitHub App
5. ✅ Start extending the platform!

## Support

- **Issues**: https://github.com/InfinityXOneSystems/infinity-matrix/issues
- **Discussions**: https://github.com/InfinityXOneSystems/infinity-matrix/discussions
- **Documentation**: See `/docs` directory

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
- [PyGithub Documentation](https://pygithub.readthedocs.io/)
- [Python Dotenv Documentation](https://github.com/theskumar/python-dotenv)

---

**Happy Autonomous Coding! 🤖**
