# Collaboration Guide - Infinity Matrix

## Overview

This document defines the collaboration protocols, onboarding procedures, and operational guidelines for all agents and contributors working within the Infinity Matrix ecosystem. It ensures seamless coordination, clear communication, and efficient collaboration across human and AI agents.

## Table of Contents

- [Agent Roles & Responsibilities](#agent-roles--responsibilities)
- [Onboarding Process](#onboarding-process)
- [Communication Protocols](#communication-protocols)
- [Collaboration Workflows](#collaboration-workflows)
- [Code Contribution Guidelines](#code-contribution-guidelines)
- [Review & Approval Process](#review--approval-process)
- [Conflict Resolution](#conflict-resolution)
- [Best Practices](#best-practices)

## Agent Roles & Responsibilities

### Overview of Agent Hierarchy

The Infinity Matrix uses a hierarchical agent model with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         User Agent (Level 0)         │  ← Ultimate Authority
│     Human Decision Maker & Owner    │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
┌───────────────┐  ┌──────────────────┐
│  VS Code      │  │  GitHub Copilot  │
│  Copilot      │  │  (Remote/Arch)   │
│  (Local/Dev)  │  │   (Level 2)      │
│   (Level 1)   │  │                  │
└───────┬───────┘  └────────┬─────────┘
        │                   │
        ↓                   ↓
┌────────────────────────────────────┐
│   Supporting Agents (Level 3)      │
│  CI/CD, Monitoring, Security, etc. │
└────────────────────────────────────┘
```

### Detailed Role Descriptions

#### User Agent

**Authority**: Supreme (Level 0)  
**Scope**: Global  
**Identifier**: `agent:user`

**Primary Responsibilities**:
- Define business requirements and objectives
- Approve or reject all critical changes
- Override any automated decision
- Set system-wide policies and configurations
- Grant and revoke agent permissions
- Escalate and resolve conflicts

**Communication Style**:
- Natural language instructions
- Approval/rejection via UI, CLI, or PR reviews
- Feedback on agent performance

#### VS Code Copilot Agent

**Authority**: Local (Level 1)  
**Scope**: Workspace/Repository  
**Identifier**: `agent:vscode-copilot`

**Primary Responsibilities**:
- Code generation and refactoring
- Unit test creation and execution
- Local Git operations (commit, branch, stash)
- Development environment setup
- Code formatting and linting
- Local debugging assistance

**Communication Style**:
- Direct code suggestions in IDE
- Inline comments and explanations
- Test result summaries
- Build/lint error reporting

#### GitHub Copilot Agent

**Authority**: Remote (Level 2)  
**Scope**: Multi-repository/System-wide  
**Identifier**: `agent:github-copilot`

**Primary Responsibilities**:
- Pull Request management
- CI/CD pipeline orchestration
- Multi-repository coordination
- Production deployment management
- Infrastructure as Code
- System-wide monitoring
- Automated incident response

**Communication Style**:
- PR comments and reviews
- Issue creation and updates
- Status checks and badges
- Deployment notifications
- Incident reports

## Onboarding Process

### New Human Contributor Onboarding

**Timeline**: 1-2 weeks

#### Week 1: Foundation

**Day 1-2: Access & Setup**
- [ ] GitHub repository access granted
- [ ] Development environment setup
- [ ] Credentials provisioned (GCP, etc.)
- [ ] Slack/communication channels joined
- [ ] Introduction to team

**Day 3-4: Documentation Review**
- [ ] Read [architecture.md](docs/architecture.md)
- [ ] Review [agent-contract.md](docs/agent-contract.md)
- [ ] Study [security.md](docs/security.md)
- [ ] Understand [roadmap.md](docs/roadmap.md)

**Day 5: Hands-on Exploration**
- [ ] Clone repository and run locally
- [ ] Execute test suite successfully
- [ ] Make a small documentation improvement
- [ ] Create first PR (documentation fix)

#### Week 2: First Contribution

**Day 6-8: Shadow Existing Work**
- [ ] Review recent PRs and issues
- [ ] Pair with senior developer
- [ ] Understand CI/CD pipeline
- [ ] Learn deployment process

**Day 9-10: First Real Contribution**
- [ ] Pick a "good first issue"
- [ ] Implement solution with tests
- [ ] Submit PR for review
- [ ] Incorporate feedback

**Onboarding Checklist Completion**
- [ ] All access provisioned
- [ ] Documentation reviewed
- [ ] Local environment functional
- [ ] First PR merged
- [ ] Security training completed

### New Agent Onboarding

**Timeline**: 3-5 days

#### Phase 1: Registration & Approval (Day 1)

**Step 1: Agent Specification**

Create an agent specification document:

```yaml
agent_specification:
  name: "custom-agent-name"
  version: "1.0.0"
  type: "worker | orchestrator | monitor"
  authority_level: "0-5"
  scope: "local | remote | global"
  
  capabilities:
    - capability_1
    - capability_2
  
  boundaries:
    workspace_access: "read | write"
    network_access: "restricted | full"
    secret_access: ["secret_scope_1", "secret_scope_2"]
  
  communication:
    input_channels: ["api", "webhook", "queue"]
    output_channels: ["api", "slack", "email"]
  
  dependencies:
    required_services: ["service_1", "service_2"]
    required_permissions: ["permission_1", "permission_2"]
  
  owner: "team@example.com"
  support_contact: "support@example.com"
```

**Step 2: Security Review**
- Architecture team reviews agent specification
- Security team assesses risk and permissions
- Approval/rejection with feedback

#### Phase 2: Provisioning (Day 2-3)

**Step 1: Service Account Creation**
```bash
# Create GCP service account
gcloud iam service-accounts create custom-agent \
  --display-name="Custom Agent" \
  --description="Custom agent for X purpose"

# Grant necessary permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:custom-agent@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/REQUIRED_ROLE"
```

**Step 2: Credential Management**
- Generate and store API keys in Secret Manager
- Configure authentication tokens
- Set up credential rotation schedule

**Step 3: Configuration**
- Register agent in configuration database
- Set resource quotas and rate limits
- Configure monitoring and alerting

#### Phase 3: Testing & Validation (Day 4)

**Step 1: Staging Environment Testing**
```bash
# Deploy agent to staging
./scripts/deploy-agent.sh --env=staging --agent=custom-agent

# Run integration tests
pytest tests/integration/test_custom_agent.py

# Verify monitoring and logging
./scripts/verify-agent-health.sh custom-agent
```

**Step 2: Validation Checklist**
- [ ] Agent starts successfully
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] Logging properly configured
- [ ] Metrics being collected
- [ ] Error handling functional
- [ ] Resource limits respected

#### Phase 4: Production Deployment (Day 5)

**Step 1: Production Deployment**
```bash
# Deploy to production with monitoring
./scripts/deploy-agent.sh --env=production --agent=custom-agent --monitor
```

**Step 2: Documentation Update**
- Add agent to agent registry
- Document capabilities and limitations
- Update architecture diagrams
- Create runbook for operations

**Step 3: Monitoring Setup**
- Configure alerts for agent health
- Set up SLO/SLA monitoring
- Enable audit logging
- Schedule regular reviews

## Communication Protocols

### Synchronous Communication

**Use Cases**:
- Immediate user input required
- Critical incidents
- Real-time collaboration
- Interactive debugging

**Channels**:
- Slack (for team communication)
- API calls (for agent-to-agent)
- WebSocket (for real-time updates)

**Response Time SLAs**:
- User queries: <30 seconds
- Agent requests: <500ms (p95)
- Critical alerts: <2 minutes

### Asynchronous Communication

**Use Cases**:
- Background processing
- Batch operations
- Non-urgent notifications
- Scheduled tasks

**Channels**:
- Pull Request comments
- GitHub Issues
- Email notifications
- Message queues (Pub/Sub)

**Response Time SLAs**:
- PR reviews: <4 hours (business hours)
- Issue triage: <24 hours
- Email responses: <48 hours

### Communication Standards

#### Message Format

All structured messages must follow this format:

```json
{
  "version": "1.0",
  "timestamp": "2025-12-30T22:47:42.913Z",
  "message_id": "uuid-v4",
  "from": "agent:source",
  "to": "agent:destination",
  "type": "request | response | event | notification",
  "priority": "critical | high | medium | low",
  "subject": "Brief description",
  "body": {
    "content": "Detailed message content",
    "data": { }
  },
  "correlation_id": "uuid-v4",
  "requires_response": true,
  "deadline": "2025-12-30T23:47:42.913Z"
}
```

#### Status Reporting

Agents must report status using standard codes:

| Code | Status | Meaning |
|------|--------|---------|
| 100 | Processing | Task in progress |
| 200 | Success | Task completed successfully |
| 201 | Created | Resource created |
| 202 | Accepted | Request accepted, processing async |
| 400 | BadRequest | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Permission denied |
| 404 | NotFound | Resource not found |
| 429 | TooManyRequests | Rate limit exceeded |
| 500 | InternalError | Internal agent error |
| 503 | ServiceUnavailable | Agent temporarily unavailable |

## Collaboration Workflows

### Workflow 1: Feature Development

**Participants**: User → VS Code Copilot → User → GitHub Copilot → User

**Steps**:

1. **User Defines Requirement** (User → VS Code Copilot)
   ```
   "Implement user authentication with OAuth 2.0"
   ```

2. **VS Code Copilot Plans** (VS Code Copilot → User)
   ```
   Implementation plan:
   - Create /src/auth/oauth.py with OAuth flow
   - Add authentication middleware
   - Create tests in /tests/test_auth.py
   - Update configuration
   Estimated time: 30 minutes
   Approve to proceed?
   ```

3. **User Approves** (User → VS Code Copilot)
   ```
   "Approved, proceed"
   ```

4. **VS Code Copilot Implements** (VS Code Copilot)
   - Generates code
   - Creates tests
   - Runs local tests
   - Commits locally

5. **VS Code Copilot Reports** (VS Code Copilot → User)
   ```
   Implementation complete:
   - 3 files changed, 250 lines added
   - 12 tests added, all passing
   - No linting errors
   Ready to create PR?
   ```

6. **User Reviews & Approves** (User → VS Code Copilot)
   ```
   "Create PR"
   ```

7. **VS Code Copilot Creates PR** (VS Code Copilot → GitHub Copilot)
   - Creates feature branch
   - Pushes to remote
   - Opens Pull Request

8. **GitHub Copilot Reviews** (GitHub Copilot → User)
   - Runs CI/CD pipeline
   - Performs automated code review
   - Reports results
   ```
   PR #123 "feat: add OAuth 2.0 authentication"
   ✓ All tests passing (12/12)
   ✓ Coverage: 95% (+5%)
   ✓ No security vulnerabilities
   ✓ No linting errors
   
   Code review: LGTM - follows best practices
   Recommendation: Approve and merge
   ```

9. **User Approves Merge** (User → GitHub Copilot)
   ```
   "Merge to main"
   ```

10. **GitHub Copilot Deploys** (GitHub Copilot)
    - Merges PR
    - Deploys to staging
    - Runs smoke tests
    - Reports success

### Workflow 2: Incident Response

**Participants**: Monitoring → GitHub Copilot → User → VS Code Copilot

**Steps**:

1. **Monitoring Detects Issue** (Monitoring → GitHub Copilot)
   ```json
   {
     "alert": "HighErrorRate",
     "severity": "critical",
     "service": "api-gateway",
     "metric": "error_rate",
     "current_value": "15%",
     "threshold": "1%",
     "started_at": "2025-12-30T22:45:00Z"
   }
   ```

2. **GitHub Copilot Analyzes** (GitHub Copilot)
   - Queries logs and metrics
   - Identifies root cause
   - Determines impact
   - Proposes solution

3. **GitHub Copilot Reports** (GitHub Copilot → User)
   ```
   INCIDENT: High error rate in API Gateway
   
   Root Cause: Database connection pool exhausted
   Impact: 15% of API requests failing
   Duration: 2 minutes
   
   Recommended Actions:
   1. Immediate: Increase connection pool size (requires restart)
   2. Rollback: Revert to v1.2.3 (stable)
   3. Scale: Add 2 more replicas (temporary)
   
   Recommendation: Option 2 (Rollback) for fastest recovery
   Approve?
   ```

4. **User Approves** (User → GitHub Copilot)
   ```
   "Approved: Execute rollback"
   ```

5. **GitHub Copilot Executes** (GitHub Copilot)
   - Triggers rollback pipeline
   - Reverts to previous version
   - Monitors metrics
   - Confirms recovery

6. **GitHub Copilot Reports** (GitHub Copilot → User)
   ```
   Rollback complete:
   - Reverted to v1.2.3
   - Error rate: 0.2% (normal)
   - Response time: 250ms (normal)
   - All health checks passing
   
   Created issue #789 for permanent fix
   ```

7. **User Assigns Fix** (User → VS Code Copilot)
   ```
   "Investigate and fix issue #789"
   ```

### Workflow 3: Multi-Repository Change

**Participants**: User → GitHub Copilot → Multiple VS Code Copilots → GitHub Copilot

**Steps**:

1. **User Defines Cross-Service Requirement** (User → GitHub Copilot)
   ```
   "Update API contract between api-gateway and user-service"
   ```

2. **GitHub Copilot Plans** (GitHub Copilot → User)
   ```
   Multi-repo coordination plan:
   
   Repository 1: api-gateway
   - Update client code for new user-service API
   - Update integration tests
   
   Repository 2: user-service
   - Implement new API endpoints
   - Update API documentation
   - Add backward compatibility layer
   
   Deployment strategy:
   1. Deploy user-service (backward compatible)
   2. Deploy api-gateway (uses new API)
   3. Remove compatibility layer after 1 week
   
   Approve plan?
   ```

3. **User Approves** (User → GitHub Copilot)
   ```
   "Approved"
   ```

4. **GitHub Copilot Coordinates** (GitHub Copilot → VS Code Copilots)
   - Assigns tasks to repository-specific agents
   - Provides context and specifications
   - Sets coordination checkpoints

5. **VS Code Copilots Implement** (Parallel execution)
   - Each agent works in its repository
   - Regular status updates to GitHub Copilot
   - Coordination on shared interfaces

6. **GitHub Copilot Manages PRs** (GitHub Copilot)
   - Reviews both PRs
   - Ensures consistency
   - Coordinates merge timing
   - Manages sequential deployment

## Code Contribution Guidelines

### Code Standards

**Language**: Python 3.11+

**Style Guide**: PEP 8
- Maximum line length: 100 characters
- 4 spaces for indentation (no tabs)
- Black formatter for consistent formatting

**Type Hints**: Required
```python
def process_user(user_id: str, options: dict[str, Any]) -> User:
    """Process user with given options.
    
    Args:
        user_id: Unique user identifier
        options: Processing options
        
    Returns:
        Processed user object
        
    Raises:
        ValueError: If user_id is invalid
    """
    pass
```

**Documentation**: Google-style docstrings

**Testing**: Minimum 80% coverage
```python
def test_process_user():
    """Test user processing with valid input."""
    user = process_user("user-123", {"validate": True})
    assert user.id == "user-123"
    assert user.validated is True
```

### Commit Message Format

Follow Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add OAuth 2.0 authentication

Implement OAuth 2.0 authentication flow with Google Identity.
Includes token validation, refresh logic, and session management.

Closes #123
```

```
fix(api): resolve database connection leak

Fixed connection pool exhaustion by properly closing connections
in error handling paths.

Fixes #456
```

### Branch Naming

```
<type>/<short-description>
```

**Examples**:
- `feature/oauth-authentication`
- `bugfix/connection-leak`
- `docs/api-documentation`
- `refactor/agent-interface`

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
- [ ] Security implications considered

## Related Issues
Closes #123
```

## Review & Approval Process

### Code Review Guidelines

**Review Checklist**:
- [ ] Code follows style guidelines
- [ ] Changes are well-documented
- [ ] Tests are comprehensive
- [ ] No security vulnerabilities
- [ ] Performance impact considered
- [ ] Error handling is robust
- [ ] Logging is appropriate
- [ ] No breaking changes (or properly versioned)

**Review SLA**:
- **Regular PRs**: 4 hours (business hours)
- **Urgent/Hotfix**: 1 hour
- **Documentation Only**: 24 hours

**Approval Requirements**:

| Change Type | Approvals Required | Who Can Approve |
|-------------|-------------------|-----------------|
| Documentation | 1 | Any maintainer |
| Feature | 2 | Maintainers |
| Bug fix | 1 | Maintainer |
| Hotfix | 1 | Senior maintainer |
| Infrastructure | 2 | Infrastructure team |
| Security | 2 | Security team + maintainer |

### Automated Checks

All PRs must pass:
- [ ] Linting (Ruff, Black)
- [ ] Type checking (mypy)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security scanning (CodeQL, Snyk)
- [ ] Code coverage (≥80%)

## Conflict Resolution

### Agent Conflict Scenarios

#### Scenario 1: Concurrent Edits

**Problem**: Two agents modify the same file

**Resolution**:
1. Git identifies merge conflict
2. GitHub Copilot attempts auto-resolution
3. If auto-resolution fails, escalate to User
4. User reviews both changes and decides
5. Winning agent updates code

#### Scenario 2: Permission Violation

**Problem**: Agent attempts action outside its authority

**Resolution**:
1. System blocks action immediately
2. Log violation with full context
3. Notify User of attempt
4. Suggest proper delegation path
5. Review agent configuration if repeated

#### Scenario 3: Resource Contention

**Problem**: Multiple agents need same exclusive resource

**Resolution**:
1. Implement queue with priority
2. Higher authority level gets precedence
3. Waiting agents receive ETA
4. Timeout and retry logic
5. Escalate if deadlock detected

### Human Conflict Resolution

**Disagreement Between Contributors**:
1. Discuss in PR comments
2. Escalate to team lead if no consensus
3. Team lead makes final decision
4. Document decision rationale

**Disagreement on Design**:
1. Create RFC (Request for Comments) document
2. Solicit feedback from stakeholders
3. Schedule design review meeting
4. Vote if necessary (maintainers)
5. Document decision in ADR (Architecture Decision Record)

## Best Practices

### For Human Contributors

1. **Communicate Early**: Share your plans before significant work
2. **Test Thoroughly**: Write comprehensive tests
3. **Document Well**: Update docs with your changes
4. **Review Carefully**: Give thoughtful code reviews
5. **Stay Updated**: Pull latest changes frequently
6. **Ask Questions**: When in doubt, ask in Slack

### For Agent Developers

1. **Define Clear Boundaries**: Specify agent scope explicitly
2. **Implement Graceful Failure**: Handle errors properly
3. **Log Appropriately**: Structured logging with context
4. **Monitor Performance**: Track metrics and optimize
5. **Test Edge Cases**: Don't just test happy path
6. **Document Behavior**: Clear documentation of capabilities

### For Everyone

1. **Security First**: Always consider security implications
2. **User Experience**: Think about end-user impact
3. **Performance Matters**: Consider scalability
4. **Collaborate Openly**: Share knowledge and help others
5. **Continuous Improvement**: Learn from mistakes
6. **Respect Boundaries**: Follow agent contracts and permissions

## Tools & Resources

### Development Tools

- **IDE**: VS Code (recommended), PyCharm, or similar
- **Git Client**: Command line or GitKraken
- **API Testing**: Postman, Insomnia, or curl
- **Database**: pgAdmin, DBeaver

### Communication Channels

- **Slack**: #infinity-matrix-dev
- **GitHub Discussions**: For design discussions
- **GitHub Issues**: For bug reports and features
- **Email**: dev@infinitymatrix.example.com

### Learning Resources

- [Architecture Documentation](docs/architecture.md)
- [Agent Contracts](docs/agent-contract.md)
- [Security Policy](docs/security.md)
- [API Documentation](http://localhost:8000/docs)
- [Python Best Practices](https://docs.python-guide.org/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

## FAQ

**Q: How do I get access to the repository?**  
A: Request access from your team lead. Include your GitHub username and intended role.

**Q: Which agent should I use for local development?**  
A: Use VS Code Copilot for local development tasks. It's optimized for code generation and testing.

**Q: Can VS Code Copilot deploy to production?**  
A: No, production deployments are handled exclusively by GitHub Copilot after proper approvals.

**Q: How do I report a security vulnerability?**  
A: Email security@infinitymatrix.example.com. Do NOT create public issues.

**Q: What's the typical PR review time?**  
A: Regular PRs: 4 hours (business hours). Urgent: 1 hour. Documentation: 24 hours.

**Q: Do I need approval for documentation changes?**  
A: Yes, at least 1 approval from a maintainer, but the process is usually faster.

**Q: How do I add a new integration?**  
A: Follow the integration adapter template in `/src/integrations/` and create an RFC for review.

**Q: What's the process for breaking changes?**  
A: Create an RFC, get approval, increment major version, provide migration guide.

## Conclusion

Effective collaboration in the Infinity Matrix requires understanding agent roles, following established protocols, and respecting boundaries. By adhering to these guidelines, we ensure a productive, secure, and efficient development environment.

For questions or suggestions about this guide, please open a GitHub Discussion or contact the team leads.

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-30  
**Next Review**: 2026-01-30  
**Owner**: Engineering Team
