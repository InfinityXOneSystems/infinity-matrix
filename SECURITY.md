# Security Policy

## Overview

The Infinity Matrix automated PR system is designed with security as a priority. This document outlines security considerations, best practices, and how to report vulnerabilities.

## Security Features

### Workflow Permissions

All workflows use minimal required permissions:

```yaml
permissions:
  contents: write        # Only for committing fixes and merging
  pull-requests: write   # Only for commenting on PRs
  checks: read           # Only for reading check status
```

### Token Security

- Uses GitHub's built-in `GITHUB_TOKEN` (automatically provided)
- Token is scoped to the repository only
- Token expires after workflow completes
- No custom tokens or secrets required for basic functionality

### Branch Protection

Recommended branch protection settings:

1. **Require pull request reviews** - At least 1 approval
2. **Require status checks** - All checks must pass
3. **Require conversation resolution** - All comments resolved
4. **Restrict who can push** - Limit to specific users/teams

### Merge Safety

The auto-merge workflow includes multiple safety checks:

- ✅ Validates all checks pass
- ✅ Verifies no merge conflicts
- ✅ Checks for blocking labels
- ✅ Respects draft status
- ✅ Honors review requirements
- ✅ Validates PR state

## Security Best Practices

### For Repository Administrators

1. **Enable Branch Protection**
   ```
   Settings → Branches → Add branch protection rule
   - Branch name pattern: main (or master)
   - Require pull request reviews: 1+
   - Require status checks to pass
   ```

2. **Review Workflow Permissions**
   - Audit workflow files regularly
   - Ensure minimal permissions are used
   - Monitor Actions logs for unusual activity

3. **Use CODEOWNERS**
   ```
   # Create .github/CODEOWNERS
   * @team-name
   .github/workflows/ @security-team
   ```

4. **Enable Secret Scanning**
   ```
   Settings → Security → Code security and analysis
   - Enable: Dependency graph
   - Enable: Dependabot alerts
   - Enable: Secret scanning
   ```

5. **Require Signed Commits** (Optional)
   ```
   Settings → Branches → Branch protection rules
   - Require signed commits
   ```

### For Contributors

1. **Never Commit Secrets**
   - API keys
   - Passwords
   - Tokens
   - Private keys
   - Environment variables with sensitive data

2. **Review Auto-Fix Commits**
   - Check what auto-fix changed
   - Ensure no unintended modifications
   - Verify no sensitive data exposed

3. **Use Draft PRs for Sensitive Changes**
   - Mark security-related PRs as draft
   - Request manual review
   - Don't rely on auto-merge for security fixes

4. **Validate External Dependencies**
   - Review dependency updates
   - Check for known vulnerabilities
   - Don't blindly auto-merge Dependabot PRs for critical dependencies

## Known Limitations

### Auto-Merge Considerations

1. **Limited Code Review**
   - Automation cannot replace human code review for complex changes
   - Security-critical code should always have manual review
   - Use blocking labels for sensitive changes

2. **Conflict Resolution**
   - Auto-resolve uses `-X theirs` strategy by default
   - May not always produce the desired result
   - Complex conflicts require manual review

3. **Test Coverage**
   - Automation relies on existing tests
   - Insufficient tests may allow bugs to merge
   - Maintain high test coverage

### Workflow Limitations

1. **No Vulnerability Scanning**
   - Workflows don't scan for vulnerabilities automatically
   - Consider adding third-party security scanners
   - Review Dependabot alerts separately

2. **No Secret Detection**
   - Workflows don't detect committed secrets
   - Enable GitHub secret scanning
   - Use pre-commit hooks for prevention

## Recommended Additional Security Measures

### 1. Add Security Scanning

Create `.github/workflows/security-scan.yml`:

```yaml
name: Security Scan

on:
  pull_request:
  push:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### 2. Add Dependency Review

Create `.github/workflows/dependency-review.yml`:

```yaml
name: Dependency Review

on: [pull_request]

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v3
        with:
          fail-on-severity: moderate
```

### 3. Add Secret Scanning

Create `.github/workflows/secret-scan.yml`:

```yaml
name: Secret Scan

on: [pull_request, push]

jobs:
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Configure Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

## Vulnerability Reporting

### How to Report

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. **DO NOT** commit the vulnerability to demonstrate it
3. **DO** report privately via GitHub Security Advisories:
   - Go to Security tab → Advisories → New draft advisory
   - This is the preferred reporting method

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response Timeline

- **24 hours**: Initial acknowledgment
- **72 hours**: Assessment and validation
- **7 days**: Fix developed and tested
- **14 days**: Fix deployed and disclosed (if applicable)

## Security Updates

### Staying Informed

- Watch this repository for security advisories
- Enable Dependabot alerts
- Review workflow changes in PRs
- Monitor GitHub security blog

### Updating Workflows

When security updates are available:

1. Review the changelog
2. Test in a fork first
3. Update workflows
4. Monitor first few runs

## Audit Log

Track automation activity:

1. **View Workflow Runs**
   ```
   Actions tab → Select workflow → View history
   ```

2. **Review Merged PRs**
   ```
   Pull Requests → Closed → Filter by merged
   ```

3. **Check Audit Log** (Organization)
   ```
   Settings → Audit log → Filter by actions
   ```

## Compliance

### Data Handling

- No sensitive data stored in workflows
- Logs may contain PR content
- GitHub retains logs per their policy

### Access Control

- Repository access controls apply
- Workflow permissions are minimal
- Actions are audited by GitHub

## Security Checklist

Before enabling automation:

- [ ] Branch protection enabled
- [ ] CODEOWNERS file configured
- [ ] Secret scanning enabled
- [ ] Dependabot alerts enabled
- [ ] Workflow permissions reviewed
- [ ] Security policy documented
- [ ] Team trained on security practices
- [ ] Incident response plan in place

## Contact

For security concerns:
- GitHub Security Advisories (preferred)
- Repository maintainers
- Organization security team

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who report vulnerabilities responsibly.

---

**Remember**: Automation is a tool, not a replacement for security awareness. Always prioritize security over convenience.

---

## API Security Best Practices

### Authentication & Authorization

1. **API Key Management**
   - API keys are generated using cryptographically secure random values
   - Keys are hashed using SHA-256 before storage
   - Raw keys are only shown once during registration
   - Never log or expose API keys in error messages

2. **Input Validation**
   - All user inputs are validated using Pydantic models
   - Maximum lengths enforced on all string fields
   - Only whitelisted agent types are allowed
   - Capabilities list limited to prevent abuse

3. **CORS Configuration**
   - NEVER use wildcard (`*`) origins in production
   - Configure specific allowed origins via `ALLOWED_ORIGINS` environment variable
   - Validate origins against whitelist
   - Default development origins: `http://localhost:3000,http://localhost:8000`

### Error Handling

1. **Information Disclosure Prevention**
   - Generic error messages returned to clients
   - Detailed errors logged securely with error IDs
   - Stack traces never exposed in API responses
   - Query parameters not logged in error messages

2. **Structured Logging**
   - All requests logged with correlation IDs
   - Sensitive data excluded from logs
   - JSON structured logging for easy parsing
   - Audit trail for all agent operations

### Rate Limiting

1. **Request Throttling**
   - Default: 100 requests per 60 seconds per client
   - Configurable via environment variables
   - Health check endpoints excluded from rate limiting
   - Rate limit headers included in responses

2. **Production Deployment**
   - Use Redis for distributed rate limiting
   - In-memory storage only suitable for development
   - Consider implementing per-endpoint limits
   - Monitor for abuse patterns

### Data Protection

1. **Encryption**
   - All API traffic must use HTTPS/TLS 1.3 in production
   - API keys encrypted at rest (planned)
   - Database credentials stored in secret manager
   - Environment variables never committed to git

2. **Secrets Management**
   - Use Google Secret Manager or similar in production
   - Never hardcode credentials in code
   - Rotate API keys regularly
   - Audit secret access

### Monitoring & Alerting

1. **Security Monitoring**
   - Monitor failed authentication attempts
   - Alert on rate limit violations
   - Track unusual API usage patterns
   - Log all admin operations

2. **Incident Response**
   - Error IDs enable incident tracking
   - Structured logs facilitate forensics
   - Audit trail provides accountability
   - Have incident response playbook ready

### Compliance Requirements

1. **GDPR/Privacy**
   - Log retention policies enforced
   - Personal data handling documented
   - Right to deletion supported
   - Data minimization practiced

2. **SOC 2 / ISO 27001**
   - Access controls documented
   - Change management process
   - Security controls tested
   - Compliance evidence collected

### Security Testing

1. **Automated Scanning**
   - Bandit security scanner in CI/CD
   - Dependency vulnerability checks
   - SAST (Static Application Security Testing)
   - Container image scanning

2. **Manual Testing**
   - Penetration testing annually
   - Security code reviews required
   - Threat modeling for new features
   - Red team exercises periodically

---
