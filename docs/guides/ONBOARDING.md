# Onboarding Guide

Welcome to the Infinity Matrix team! This guide will help you get set up and productive quickly.

## Overview

This onboarding guide covers:
- Initial setup and access
- Development environment configuration
- Team workflows and standards
- Key resources and contacts

**Estimated Time**: 2-3 hours

## Day 1: Getting Started

### 1. Access and Accounts

#### GitHub Access
- [ ] Ensure you have access to the `InfinityXOneSystems/infinity-matrix` repository
- [ ] Configure your GitHub profile with your work email
- [ ] Setup SSH keys for Git authentication
- [ ] Join the organization and relevant teams

#### Communication Channels
- [ ] Join Slack workspace (if applicable)
- [ ] Subscribe to team calendar
- [ ] Join relevant mailing lists
- [ ] Introduce yourself to the team

#### Development Tools
- [ ] Install required software (see [Prerequisites](#prerequisites))
- [ ] Request access to development environments
- [ ] Setup VPN access (if required)
- [ ] Configure local development environment

### 2. Prerequisites Installation

Install the following tools:

#### Required
```bash
# Git
git --version  # Should be 2.30+

# Docker and Docker Compose
docker --version  # Should be 20.10+
docker-compose --version  # Should be 2.0+

# Python
python --version  # Should be 3.11+

# Node.js
node --version  # Should be 18+
npm --version
```

#### Recommended
```bash
# Code editor (VS Code recommended)
code --version

# Additional tools
make --version
curl --version
jq --version
```

### 3. Repository Setup

Clone and setup the repository:

```bash
# Clone repository
git clone git@github.com:InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# Create feature branch
git checkout -b onboarding/your-name

# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 4. Local Environment Setup

Follow the [Quick Start Guide](QUICK_START.md) to:

```bash
# Start services
docker-compose up -d

# Initialize database
docker-compose exec api python -m alembic upgrade head

# Create test user
docker-compose exec api python -m scripts.create_user --email your.email@example.com

# Verify setup
docker-compose ps
curl http://localhost:8000/api/health
```

### 5. Verify Installation

Run the verification script:

```bash
# Run system checks
docker-compose exec api python -m scripts.verify_setup

# Expected output: All checks should pass
```

## Day 2: Understanding the System

### 1. Architecture Review

Read the following documents:
- [ ] [Architecture Overview](../architecture/README.md)
- [ ] [System Manifest](../architecture/MANIFEST.md)
- [ ] [Design Decisions](../architecture/DECISIONS.md)

Take notes and prepare questions for your onboarding buddy.

### 2. Code Structure

Familiarize yourself with the codebase:

```
infinity-matrix/
├── docs/              # Documentation
├── src/               # Source code
│   ├── api/          # API services
│   ├── agents/       # Agent implementations
│   ├── core/         # Core business logic
│   └── frontend/     # Frontend application
├── tests/            # Test suites
├── scripts/          # Utility scripts
└── .github/          # CI/CD workflows
```

### 3. Run Your First Test

```bash
# Run backend tests
docker-compose exec api pytest tests/

# Run frontend tests
docker-compose exec frontend npm test

# Run integration tests
docker-compose exec api pytest tests/integration/
```

### 4. Make Your First Change

Try a simple documentation update:

```bash
# Create branch
git checkout -b docs/your-first-change

# Make a small change (e.g., fix a typo in README)
# Edit a file...

# Commit and push
git add .
git commit -m "docs: fix typo in README"
git push origin docs/your-first-change

# Create pull request on GitHub
```

## Week 1: Learning and Contributing

### Development Workflow

#### 1. Branch Naming Convention

```
feature/description      # New features
bugfix/description      # Bug fixes
docs/description        # Documentation
refactor/description    # Code refactoring
test/description        # Test additions
```

#### 2. Commit Message Format

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(api): add user authentication endpoint
fix(agents): resolve workflow execution timeout
docs(readme): update installation instructions
```

#### 3. Pull Request Process

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run linters and tests
5. Push and create PR
6. Address review comments
7. Merge after approval

### Code Standards

#### Python
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for all functions
- Maximum line length: 100 characters
- Use `black` for formatting
- Use `ruff` for linting

```bash
# Format code
docker-compose exec api black app/

# Lint code
docker-compose exec api ruff check app/

# Type check
docker-compose exec api mypy app/
```

#### TypeScript
- Follow Airbnb style guide
- Use ESLint and Prettier
- Write JSDoc comments
- Use strict TypeScript settings

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

#### Testing
- Write unit tests for all new code
- Aim for 80%+ code coverage
- Write integration tests for APIs
- Add E2E tests for critical flows

### Key Resources

#### Documentation
- [Architecture Docs](../architecture/README.md)
- [API Documentation](../api/README.md)
- [Agent Registry](../agents/REGISTRY.md)
- [Runbooks](../runbooks/README.md)

#### Development
- [Setup Guide](SETUP.md)
- [User Manual](USER_MANUAL.md)
- [Admin Manual](ADMIN_MANUAL.md)
- [Error Handling](ERROR_HANDLING.md)

#### Team Resources
- Team Wiki: [Link to internal wiki]
- Code Review Guidelines: [Link]
- Meeting Schedule: [Link to calendar]
- On-call Rotation: [Link]

## Week 2: Deep Dive

### 1. Agent System

Study the agent architecture:
- [ ] Read [Agent Registry](../agents/REGISTRY.md)
- [ ] Review [Agent Workflows](../agents/WORKFLOWS.md)
- [ ] Try [Agent Invocation Examples](../agents/INVOCATION.md)
- [ ] Build a simple custom agent

### 2. API Development

Learn the API structure:
- [ ] Review FastAPI documentation
- [ ] Study existing endpoints
- [ ] Understand authentication flow
- [ ] Try adding a new endpoint

### 3. Frontend Development

Explore the frontend:
- [ ] Review React component structure
- [ ] Understand state management
- [ ] Study routing and navigation
- [ ] Try adding a new UI component

### 4. Operational Knowledge

Learn operations:
- [ ] Review [Monitoring Setup](../runbooks/MONITORING.md)
- [ ] Understand deployment process
- [ ] Study incident response procedures
- [ ] Shadow an on-call engineer

## Month 1: Becoming Productive

### Goals
- [ ] Complete a small feature end-to-end
- [ ] Contribute to code reviews
- [ ] Participate in design discussions
- [ ] Understand all major system components
- [ ] Shadow on-call rotation

### Milestones

#### Week 3
- [ ] Implement a medium-sized feature
- [ ] Write comprehensive tests
- [ ] Update relevant documentation
- [ ] Present your work to the team

#### Week 4
- [ ] Lead a code review
- [ ] Participate in sprint planning
- [ ] Join on-call rotation
- [ ] Mentor a new team member

## Helpful Commands

### Development

```bash
# Start development environment
make dev-up

# Run tests
make test

# Run linters
make lint

# Build for production
make build

# Deploy to staging
make deploy-staging
```

### Debugging

```bash
# View logs
docker-compose logs -f [service]

# Enter container
docker-compose exec [service] bash

# Connect to database
docker-compose exec postgres psql -U infinity_user infinity_db

# Redis CLI
docker-compose exec redis redis-cli
```

### Common Tasks

```bash
# Create database migration
docker-compose exec api alembic revision --autogenerate -m "description"

# Run migrations
docker-compose exec api alembic upgrade head

# Rollback migration
docker-compose exec api alembic downgrade -1

# Generate API client
docker-compose exec api python -m scripts.generate_client
```

## Getting Help

### Onboarding Buddy
Your assigned onboarding buddy: [Name and Contact]

Schedule regular check-ins:
- Day 1: 30 minutes
- Week 1: 1 hour
- Week 2: 30 minutes
- Month 1: 30 minutes

### Team Contacts

| Role | Name | Contact |
|------|------|---------|
| Tech Lead | [Name] | [Email/Slack] |
| Product Manager | [Name] | [Email/Slack] |
| DevOps Lead | [Name] | [Email/Slack] |
| QA Lead | [Name] | [Email/Slack] |

### Support Channels
- **Slack**: #infinity-matrix-dev
- **Email**: team@infinityxonesystems.com
- **Office Hours**: Daily 2-3 PM UTC

## Feedback

We continuously improve our onboarding process. Please share feedback:
- What went well?
- What was confusing?
- What resources were most helpful?
- What's missing?

Submit feedback: [Feedback Form Link]

## Checklist

Complete onboarding checklist:

### Week 1
- [ ] Access to all systems
- [ ] Development environment working
- [ ] First pull request merged
- [ ] Team introductions complete
- [ ] Architecture review complete

### Month 1
- [ ] First feature delivered
- [ ] Participated in code reviews
- [ ] Attended team meetings
- [ ] On-call training complete
- [ ] Documentation familiarity

### Month 3
- [ ] Leading features independently
- [ ] Mentoring others
- [ ] Contributing to architecture decisions
- [ ] On-call rotation
- [ ] Deep system knowledge

## Next Steps

After completing onboarding:
- Continue learning from [User Manual](USER_MANUAL.md)
- Review [Best Practices](../runbooks/SOPS.md)
- Explore [Advanced Topics](SETUP.md)
- Join specialized working groups

---

**Welcome to the team!** We're excited to have you here.

**Questions?** Don't hesitate to ask your onboarding buddy or the team.
