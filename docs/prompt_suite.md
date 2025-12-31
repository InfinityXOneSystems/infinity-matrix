# Infinity-Matrix Prompt Suite

## Overview

This document contains all master prompts for the Infinity-Matrix autonomous system. These prompts are designed to be executed in sequence by AI agents, CLI tools, or VS Code extensions to achieve full system automation.

The prompts are organized by operational phase and can be integrated into:
- GitHub Actions workflows
- VS Code extension commands
- CLI automation tools
- Agent task queues (Supabase)
- API endpoints

---

## Prompt Categories

1. **System Initialization** - Bootstrap and setup
2. **Code Analysis** - Understanding and reviewing code
3. **Development** - Writing and modifying code
4. **Testing** - Test creation and execution
5. **Deployment** - Build and release
6. **Monitoring** - Health checks and observability
7. **Optimization** - Performance and cost improvements
8. **Maintenance** - Updates and repairs

---

## 1. System Initialization Prompts

### INIT-001: System Bootstrap
```
You are initializing the Infinity-Matrix autonomous development system. Your task:

1. Scan the current working directory and identify the project type (language, framework, build tools)
2. Check for existing configuration files (.github/workflows, package.json, requirements.txt, etc.)
3. Create a system manifest by running the manifest generator (see MANIFEST-001)
4. Set up missing configuration files based on detected project type
5. Initialize version control if not present
6. Create basic CI/CD workflows if not present
7. Report the system status and any manual steps required

Output a JSON report with:
- project_type
- detected_tools
- existing_configs
- missing_configs
- initialization_status
- next_steps
```

### INIT-002: Credential Setup
```
You are configuring credentials and secrets for the Infinity-Matrix system. Your task:

1. Identify all required credentials based on the system manifest
2. Check which credentials are already configured (GitHub Secrets, environment variables)
3. For each missing credential:
   - Identify the service (GitHub, GCP, Supabase, Hostinger)
   - Determine the required permissions/scopes
   - Generate secure placeholder or request user input
4. Configure credentials in appropriate secret stores
5. Test connectivity to all services
6. Document any credentials that require manual setup

Output a JSON report with:
- configured_credentials
- missing_credentials
- connectivity_tests
- manual_setup_required
```

### INIT-003: Development Environment Setup
```
You are setting up the local development environment. Your task:

1. Detect operating system and architecture
2. Check for required tools (git, docker, language runtimes, cloud CLIs)
3. Install missing tools using package managers (apt, brew, choco, etc.)
4. Configure git with proper user info and SSH keys
5. Set up VS Code with recommended extensions
6. Create dev container configuration if applicable
7. Initialize pre-commit hooks
8. Run initial health checks

Output a JSON report with:
- os_info
- installed_tools
- missing_tools
- setup_status
- recommendations
```

---

## 2. Code Analysis Prompts

### ANALYZE-001: Codebase Overview
```
You are analyzing the codebase to understand its structure and purpose. Your task:

1. Scan all source files and create a directory tree
2. Identify the main programming languages and frameworks
3. Detect the application architecture (monolith, microservices, serverless, etc.)
4. Map dependencies and their versions
5. Identify entry points (main functions, API endpoints, etc.)
6. Locate configuration files and environment variables
7. Find test files and calculate coverage
8. Identify documentation files

Output a comprehensive report including:
- directory_structure
- tech_stack
- architecture_type
- dependencies
- entry_points
- test_coverage
- documentation_quality
```

### ANALYZE-002: Security Audit
```
You are performing a security audit on the codebase. Your task:

1. Scan for hardcoded secrets (API keys, passwords, tokens)
2. Check for SQL injection vulnerabilities
3. Identify XSS (Cross-Site Scripting) risks
4. Review authentication and authorization logic
5. Check for insecure dependencies (CVEs)
6. Verify HTTPS usage for external calls
7. Review error handling and logging for sensitive data leaks
8. Check for proper input validation

Output a security report with:
- severity_levels (critical, high, medium, low)
- vulnerabilities_found
- recommendations
- automated_fixes_available
```

### ANALYZE-003: Performance Analysis
```
You are analyzing the codebase for performance issues. Your task:

1. Identify inefficient algorithms (O(n²) or worse)
2. Find unnecessary database queries (N+1 problems)
3. Detect memory leaks or excessive memory usage
4. Review caching strategy
5. Identify blocking operations in async code
6. Check for proper resource cleanup (connections, files, etc.)
7. Analyze bundle size and load times (for frontend)
8. Review API response times

Output a performance report with:
- bottlenecks_identified
- optimization_opportunities
- estimated_improvements
- priority_order
```

---

## 3. Development Prompts

### DEV-001: Feature Implementation
```
You are implementing a new feature. Your task:

Context:
- Feature description: {FEATURE_DESCRIPTION}
- Related issue: {ISSUE_NUMBER}
- Acceptance criteria: {ACCEPTANCE_CRITERIA}

Steps:
1. Review the feature requirements and understand the scope
2. Identify affected files and components
3. Create a branch: feature/{FEATURE_NAME}
4. Implement the feature with minimal code changes
5. Follow existing code patterns and conventions
6. Add appropriate error handling
7. Update documentation (README, API docs, etc.)
8. Write unit tests for new functionality
9. Run tests to verify implementation
10. Create a pull request with detailed description

Output:
- files_modified
- tests_added
- documentation_updated
- pr_link
```

### DEV-002: Bug Fix
```
You are fixing a bug in the codebase. Your task:

Context:
- Bug description: {BUG_DESCRIPTION}
- Issue number: {ISSUE_NUMBER}
- Steps to reproduce: {REPRODUCTION_STEPS}
- Expected behavior: {EXPECTED_BEHAVIOR}

Steps:
1. Reproduce the bug locally
2. Identify the root cause through debugging
3. Create a branch: bugfix/{BUG_NAME}
4. Implement the fix with minimal changes
5. Add a regression test to prevent recurrence
6. Verify the fix resolves the issue
7. Check for similar issues in other parts of the codebase
8. Update documentation if behavior changed
9. Create a pull request with fix explanation

Output:
- root_cause
- files_modified
- tests_added
- verification_results
- pr_link
```

### DEV-003: Refactoring
```
You are refactoring code to improve quality without changing functionality. Your task:

Context:
- Target area: {CODE_AREA}
- Refactoring goal: {GOAL} (e.g., improve readability, reduce duplication, simplify logic)

Steps:
1. Identify code smells in the target area
2. Run existing tests to establish baseline
3. Create a branch: refactor/{REFACTOR_NAME}
4. Apply refactoring techniques:
   - Extract functions/methods
   - Rename variables for clarity
   - Remove code duplication
   - Simplify complex conditionals
   - Improve error handling
5. Verify all tests still pass
6. Check performance hasn't degraded
7. Update comments and documentation
8. Create a pull request explaining improvements

Output:
- code_smells_found
- refactoring_applied
- test_results
- performance_impact
- pr_link
```

---

## 4. Testing Prompts

### TEST-001: Unit Test Generation
```
You are generating unit tests for existing code. Your task:

Context:
- Target file: {FILE_PATH}
- Function/class to test: {TARGET_NAME}

Steps:
1. Analyze the target code to understand its behavior
2. Identify all code paths and edge cases
3. Determine required test fixtures and mocks
4. Generate comprehensive unit tests covering:
   - Happy path scenarios
   - Edge cases
   - Error conditions
   - Boundary values
5. Use existing test framework and patterns
6. Ensure tests are isolated and repeatable
7. Add descriptive test names and comments
8. Run tests to verify they pass

Output:
- test_file_created
- test_cases_added
- coverage_percentage
- test_results
```

### TEST-002: Integration Test Creation
```
You are creating integration tests for system components. Your task:

Context:
- Components to test: {COMPONENT_LIST}
- Integration points: {INTEGRATION_POINTS}

Steps:
1. Identify integration points between components
2. Set up test environment (database, external services, etc.)
3. Create test fixtures and seed data
4. Write integration tests that verify:
   - Component communication
   - Data flow
   - Error propagation
   - Transaction handling
5. Use test doubles for external dependencies
6. Ensure tests can run in CI/CD pipeline
7. Document test setup requirements
8. Run tests and verify results

Output:
- integration_tests_created
- test_environment_setup
- test_results
- documentation_updated
```

### TEST-003: End-to-End Test Automation
```
You are creating end-to-end tests for user workflows. Your task:

Context:
- User workflow: {WORKFLOW_DESCRIPTION}
- Entry point: {ENTRY_POINT}

Steps:
1. Break down the workflow into steps
2. Set up E2E test framework (Playwright, Cypress, Selenium, etc.)
3. Create test scenarios covering:
   - Primary user journey
   - Alternative paths
   - Error scenarios
4. Add assertions for UI state and data
5. Implement page object pattern for maintainability
6. Add screenshots/videos on failure
7. Ensure tests are idempotent
8. Run tests and verify results

Output:
- e2e_tests_created
- workflows_covered
- test_results
- artifacts_generated
```

---

## 5. Deployment Prompts

### DEPLOY-001: Build Preparation
```
You are preparing the application for deployment. Your task:

Context:
- Target environment: {ENVIRONMENT} (dev, staging, production)
- Version: {VERSION}

Steps:
1. Verify all tests pass
2. Run security scans
3. Update version numbers
4. Generate changelog from commits
5. Build the application/container
6. Run smoke tests on build artifacts
7. Tag the release in git
8. Upload artifacts to registry
9. Generate deployment manifest

Output:
- build_status
- test_results
- security_scan_results
- artifact_location
- deployment_manifest
```

### DEPLOY-002: Deployment Execution
```
You are deploying the application to the target environment. Your task:

Context:
- Environment: {ENVIRONMENT}
- Deployment strategy: {STRATEGY} (rolling, blue-green, canary)
- Artifact: {ARTIFACT_LOCATION}

Steps:
1. Verify pre-deployment checks
2. Create deployment backup/snapshot
3. Execute deployment according to strategy
4. Monitor deployment progress
5. Run post-deployment health checks
6. Verify application functionality
7. Monitor error rates and performance
8. Complete deployment or rollback if issues detected

Output:
- deployment_status
- health_check_results
- metrics_snapshot
- rollback_required
```

### DEPLOY-003: Rollback
```
You are rolling back a failed deployment. Your task:

Context:
- Environment: {ENVIRONMENT}
- Deployment ID: {DEPLOYMENT_ID}
- Reason: {ROLLBACK_REASON}

Steps:
1. Identify the last known good version
2. Stop incoming traffic if necessary
3. Execute rollback to previous version
4. Verify rollback completed successfully
5. Run health checks on rolled-back version
6. Resume traffic
7. Investigate root cause of failure
8. Document incident and lessons learned

Output:
- rollback_status
- version_restored
- health_check_results
- incident_report
```

---

## 6. Monitoring Prompts

### MONITOR-001: Health Check
```
You are performing a system health check. Your task:

Steps:
1. Check all service endpoints for availability
2. Verify database connectivity and performance
3. Check external service integrations
4. Review error rates and logs
5. Verify certificate expiration dates
6. Check disk space and resource usage
7. Verify backup status
8. Test alert systems

Output a health report with:
- service_status (all services)
- performance_metrics
- error_summary
- resource_usage
- alerts_triggered
- action_required
```

### MONITOR-002: Incident Response
```
You are responding to a system incident. Your task:

Context:
- Alert: {ALERT_DESCRIPTION}
- Severity: {SEVERITY_LEVEL}
- Affected service: {SERVICE_NAME}

Steps:
1. Acknowledge the alert
2. Assess the impact (users affected, services down)
3. Check recent deployments or changes
4. Review logs and metrics for root cause
5. Implement immediate mitigation if possible
6. Escalate if necessary
7. Monitor for recovery
8. Create incident report

Output:
- incident_assessment
- root_cause
- mitigation_actions
- resolution_status
- incident_report
```

### MONITOR-003: Performance Review
```
You are conducting a periodic performance review. Your task:

Context:
- Review period: {TIME_PERIOD}
- Services: {SERVICE_LIST}

Steps:
1. Collect performance metrics (response times, throughput, error rates)
2. Compare against SLA/SLO targets
3. Identify performance trends
4. Detect anomalies or degradation
5. Analyze resource utilization
6. Review slow queries or endpoints
7. Generate optimization recommendations
8. Create performance report

Output:
- performance_summary
- sla_compliance
- trends_identified
- anomalies_detected
- optimization_recommendations
```

---

## 7. Optimization Prompts

### OPTIMIZE-001: Code Optimization
```
You are optimizing code for better performance. Your task:

Context:
- Target area: {CODE_AREA}
- Performance goal: {GOAL} (e.g., reduce latency, improve throughput)

Steps:
1. Profile the code to identify bottlenecks
2. Measure current performance metrics
3. Apply optimization techniques:
   - Algorithm improvements
   - Caching strategies
   - Database query optimization
   - Async/parallel processing
   - Resource pooling
4. Verify optimizations don't break functionality
5. Measure performance improvements
6. Document optimization approach
7. Create PR with benchmarks

Output:
- bottlenecks_identified
- optimizations_applied
- performance_improvements
- test_results
- pr_link
```

### OPTIMIZE-002: Cost Optimization
```
You are optimizing infrastructure costs. Your task:

Steps:
1. Analyze current cloud resource usage
2. Identify over-provisioned resources
3. Find unused or idle resources
4. Review data storage and transfer costs
5. Evaluate reserved capacity opportunities
6. Recommend auto-scaling policies
7. Identify cost-saving alternatives
8. Generate cost optimization plan

Output:
- current_costs
- cost_saving_opportunities
- recommended_actions
- estimated_savings
- implementation_priority
```

### OPTIMIZE-003: Build Optimization
```
You are optimizing the build process. Your task:

Steps:
1. Measure current build times
2. Identify slow build steps
3. Implement optimizations:
   - Caching dependencies
   - Parallel builds
   - Incremental builds
   - Build artifact reuse
   - Multi-stage Docker builds
4. Optimize test execution
5. Reduce Docker image sizes
6. Measure improvements
7. Document build optimizations

Output:
- current_build_time
- optimizations_applied
- new_build_time
- time_saved_percentage
- recommendations
```

---

## 8. Maintenance Prompts

### MAINT-001: Dependency Updates
```
You are updating project dependencies. Your task:

Steps:
1. Check for outdated dependencies
2. Review changelogs and breaking changes
3. Update dependencies incrementally:
   - Patch updates first
   - Minor updates next
   - Major updates last
4. Run tests after each update
5. Fix any breaking changes
6. Update lock files
7. Create PR with update summary

Output:
- dependencies_updated
- breaking_changes_handled
- test_results
- pr_link
```

### MAINT-002: Security Patching
```
You are applying security patches. Your task:

Context:
- Security advisory: {ADVISORY_ID}
- Affected component: {COMPONENT_NAME}
- Severity: {SEVERITY}

Steps:
1. Review security advisory details
2. Identify affected code/dependencies
3. Apply recommended patches or updates
4. Test for regressions
5. Verify vulnerability is fixed
6. Deploy patch urgently if critical
7. Document the patch and verification
8. Update security scan results

Output:
- vulnerability_details
- patch_applied
- verification_results
- deployment_status
```

### MAINT-003: System Cleanup
```
You are performing routine system cleanup. Your task:

Steps:
1. Remove old build artifacts
2. Clean up unused Docker images/containers
3. Archive old logs
4. Remove deprecated code
5. Clean up old branches
6. Update documentation
7. Remove unused dependencies
8. Optimize database (vacuum, analyze, etc.)

Output:
- disk_space_freed
- items_removed
- optimizations_performed
- recommendations
```

---

## Prompt Integration Guide

### GitHub Actions Integration

Create workflow file `.github/workflows/agent-tasks.yml`:

```yaml
name: Agent Task Execution

on:
  schedule:
    - cron: '0 * * * *'  # Every hour
  workflow_dispatch:
    inputs:
      prompt_id:
        description: 'Prompt ID to execute'
        required: true
      context:
        description: 'JSON context for the prompt'
        required: false

jobs:
  execute-prompt:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Execute Prompt
        run: |
          # Load prompt from prompt suite
          prompt_id="${{ github.event.inputs.prompt_id }}"
          context="${{ github.event.inputs.context }}"
          
          # Execute prompt with AI agent
          ./scripts/execute-prompt.sh "$prompt_id" "$context"
```

### VS Code Extension Integration

```typescript
// extension.ts
import * as vscode from 'vscode';
import { loadPrompts } from './prompts';

export function activate(context: vscode.ExtensionContext) {
  const prompts = loadPrompts();
  
  // Register command for each prompt category
  const disposable = vscode.commands.registerCommand(
    'infinity-matrix.executePrompt',
    async () => {
      const promptId = await vscode.window.showQuickPick(
        Object.keys(prompts),
        { placeHolder: 'Select a prompt to execute' }
      );
      
      if (promptId) {
        const prompt = prompts[promptId];
        // Execute prompt with AI agent
        await executePrompt(prompt);
      }
    }
  );
  
  context.subscriptions.push(disposable);
}
```

### CLI Integration

```bash
#!/bin/bash
# scripts/execute-prompt.sh

PROMPT_ID=$1
CONTEXT=$2

# Load prompt from docs/prompt_suite.md
PROMPT=$(awk "/^### ${PROMPT_ID}:/,/^###/ {print}" docs/prompt_suite.md)

# Execute with AI agent (OpenAI, Claude, etc.)
echo "$PROMPT" | ai-agent execute --context "$CONTEXT"
```

### Supabase Task Queue Integration

```sql
-- Task queue schema
CREATE TABLE agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id TEXT NOT NULL,
  context JSONB,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 5,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  result JSONB
);

-- Function to add task
CREATE OR REPLACE FUNCTION add_agent_task(
  p_prompt_id TEXT,
  p_context JSONB DEFAULT NULL,
  p_priority INTEGER DEFAULT 5
) RETURNS UUID AS $$
DECLARE
  v_task_id UUID;
BEGIN
  INSERT INTO agent_tasks (prompt_id, context, priority)
  VALUES (p_prompt_id, p_context, p_priority)
  RETURNING id INTO v_task_id;
  
  RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Prompt Execution Order

### Initial Setup Sequence
1. INIT-001: System Bootstrap
2. INIT-002: Credential Setup
3. INIT-003: Development Environment Setup
4. ANALYZE-001: Codebase Overview

### Regular Maintenance Sequence (Daily)
1. MONITOR-001: Health Check
2. MAINT-001: Dependency Updates (weekly)
3. ANALYZE-002: Security Audit
4. MONITOR-003: Performance Review

### Development Workflow Sequence
1. ANALYZE-001: Codebase Overview (if new to codebase)
2. DEV-001: Feature Implementation OR DEV-002: Bug Fix
3. TEST-001: Unit Test Generation
4. TEST-002: Integration Test Creation
5. DEPLOY-001: Build Preparation
6. DEPLOY-002: Deployment Execution

### Optimization Cycle (Monthly)
1. MONITOR-003: Performance Review
2. ANALYZE-003: Performance Analysis
3. OPTIMIZE-001: Code Optimization
4. OPTIMIZE-002: Cost Optimization
5. OPTIMIZE-003: Build Optimization

---

## References

- [Blueprint](./blueprint.md) - System architecture and integrations
- [Roadmap](./roadmap.md) - Implementation phases and milestones
- [System Manifest](./system_manifest.md) - System inventory template
- [Setup Instructions](../setup_instructions.md) - Onboarding guide
- [Collaboration Guide](../COLLABORATION.md) - Team roles and protocols

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-12-30  
**Maintained By**: Infinity-Matrix System
