# System Architecture

This document provides an overview of the automated PR system architecture and workflow interactions.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                   infinity-matrix                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Pull Request Events                       │
│  • opened  • synchronize  • reopened  • labeled  • reviews  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Auto-Fix    │      │ Auto-Resolve │      │ Auto-Merge   │
│  Workflow    │      │  Workflow    │      │  Workflow    │
└──────────────┘      └──────────────┘      └──────────────┘
```

## Workflow Components

### 1. Auto-Fix Workflow

```
Pull Request Event (opened/synchronize/reopened)
    │
    ▼
Checkout code from PR branch
    │
    ▼
Setup Python 3.11
    │
    ▼
Install formatting tools
(Black, isort, autopep8)
    │
    ▼
Apply formatters
    ├─→ Black formatter
    ├─→ isort
    ├─→ autopep8
    ├─→ Fix whitespace
    └─→ Fix line endings
    │
    ▼
Check for changes
    │
    ├─→ No changes: Exit
    │
    └─→ Changes detected
        │
        ▼
    Commit & Push fixes
        │
        ▼
    Comment on PR
    (✅ Auto-fix applied)
```

### 2. Auto-Resolve Workflow

```
Pull Request Event (opened/synchronize/reopened)
    │
    ▼
Checkout code from PR branch
    │
    ▼
Fetch base branch
    │
    ▼
Check for merge conflicts
    │
    ├─→ No conflicts
    │   │
    │   └─→ Add ready-to-merge label
    │       │
    │       └─→ Exit
    │
    └─→ Conflicts detected
        │
        ▼
    Attempt auto-resolution
    (merge with -X theirs)
        │
        ├─→ Resolution failed
        │   │
        │   └─→ Comment: Manual intervention needed
        │
        └─→ Resolution successful
            │
            ▼
        Run validation checks
            │
            ▼
        Commit & Push resolution
            │
            ▼
        Add ready-to-merge label
            │
            ▼
        Comment: ✅ Conflicts resolved
```

### 3. Auto-Merge Workflow

```
Pull Request Event
(PR update / Review / Check completion)
    │
    ▼
Get PR details
    │
    ▼
Check merge criteria
    │
    ├─→ Is draft? ──Yes──→ Exit
    │
    ├─→ Has conflicts? ──Yes──→ Exit
    │
    ├─→ Has blocking labels? ──Yes──→ Exit
    │   (wip, do-not-merge, needs-review)
    │
    ├─→ Checks failed? ──Yes──→ Exit
    │
    ├─→ Checks running? ──Yes──→ Exit
    │
    ├─→ Changes requested? ──Yes──→ Exit
    │
    └─→ All criteria met
        │
        ▼
    Merge PR (squash)
        │
        ├─→ Merge failed
        │   │
        │   └─→ Comment: ⚠️ Auto-merge failed
        │
        └─→ Merge successful
            │
            └─→ Comment: ✅ Auto-merged
```

## Data Flow

### Pull Request Lifecycle

```
Developer creates PR
        │
        ▼
    ┌───────────────────────┐
    │   Auto-Fix runs       │ ←─────┐
    │   (1-2 minutes)       │        │
    └───────────────────────┘        │
        │                            │
        ▼                            │
    ┌───────────────────────┐        │
    │  Auto-Resolve runs    │        │ New commits
    │  (2-3 minutes)        │        │ trigger
    └───────────────────────┘        │ re-runs
        │                            │
        ▼                            │
    ┌───────────────────────┐        │
    │   CI Checks run       │        │
    │   (varies)            │        │
    └───────────────────────┘        │
        │                            │
        ▼                            │
    All checks pass? ────No──────────┘
        │
        Yes
        ▼
    ┌───────────────────────┐
    │  Auto-Merge runs      │
    │  (immediate)          │
    └───────────────────────┘
        │
        ▼
    PR merged to main
```

## Component Interactions

### Workflow Triggers

```
┌─────────────────┐
│  Pull Request   │
│     Events      │
└────────┬────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
┌────────────────────┐                   ┌────────────────────┐
│  PR opened         │                   │  PR synchronized   │
│  PR reopened       │                   │  (new commits)     │
└────────┬───────────┘                   └────────┬───────────┘
         │                                         │
         └──────────────┬──────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │  Triggers all three:  │
            │  • Auto-Fix           │
            │  • Auto-Resolve       │
            │  • Auto-Merge         │
            └───────────────────────┘

┌─────────────────┐
│ Review submitted│
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│  Auto-Merge only   │
└────────────────────┘

┌─────────────────┐
│ Check completed │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│  Auto-Merge only   │
└────────────────────┘

┌─────────────────┐
│  PR labeled     │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│  Auto-Merge only   │
└────────────────────┘
```

### Label System

```
┌────────────────────────────────────────────────────────────┐
│                      Label Hierarchy                        │
└────────────────────────────────────────────────────────────┘

Blocking Labels (prevent auto-merge):
┌─────────────────┐
│ do-not-merge    │ ──→ Hard block, requires removal
└─────────────────┘

┌─────────────────┐
│ wip             │ ──→ Work in progress
│ work-in-progress│     (either variant works)
└─────────────────┘

┌─────────────────┐
│ needs-review    │ ──→ Requires human review
└─────────────────┘

Status Labels (informational):
┌─────────────────┐
│ ready-to-merge  │ ──→ Added by auto-resolve
└─────────────────┘

┌─────────────────┐
│ auto-fixed      │ ──→ Auto-fix made changes
└─────────────────┘

┌─────────────────┐
│ auto-resolved   │ ──→ Conflicts resolved
└─────────────────┘

┌─────────────────┐
│ auto-merged     │ ──→ Successfully merged
└─────────────────┘
```

## Permission Model

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Permissions                │
└─────────────────────────────────────────────────────────────┘

GITHUB_TOKEN (automatically provided)
    │
    ├─→ contents: write
    │   │
    │   ├─→ Commit fixes (auto-fix)
    │   ├─→ Push changes (auto-resolve)
    │   └─→ Merge PRs (auto-merge)
    │
    ├─→ pull-requests: write
    │   │
    │   ├─→ Comment on PRs
    │   └─→ Add labels
    │
    └─→ checks: read
        │
        └─→ Read check status (auto-merge)

Scope: Repository only
Lifetime: Single workflow run
Automatic: No manual token management needed
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
└─────────────────────────────────────────────────────────────┘

Layer 1: Input Validation
    │
    ├─→ PR state validation
    ├─→ Branch validation
    └─→ Label validation

Layer 2: Workflow Permissions
    │
    ├─→ Minimal required permissions
    ├─→ Scoped to repository
    └─→ Short-lived tokens

Layer 3: Merge Criteria
    │
    ├─→ Check validation
    ├─→ Review validation
    ├─→ Conflict detection
    └─→ Label blocking

Layer 4: Branch Protection (optional)
    │
    ├─→ Required reviews
    ├─→ Required checks
    └─→ Conversation resolution

Layer 5: Audit Trail
    │
    ├─→ Workflow logs
    ├─→ Git history
    └─→ PR comments
```

## Scalability Considerations

### Concurrent Handling

```
Multiple PRs open simultaneously:

PR #1 ──→ Auto-Fix (isolated) ──→ Auto-Resolve ──→ Auto-Merge
             │
PR #2 ──→ Auto-Fix (isolated) ──→ Auto-Resolve ──→ Auto-Merge
             │
PR #3 ──→ Auto-Fix (isolated) ──→ Auto-Resolve ──→ Auto-Merge

Each workflow run is independent and isolated
No shared state between workflow runs
GitHub Actions handles concurrency automatically
```

### Resource Usage

```
Per PR workflow execution:

Auto-Fix:
├─→ CPU: Low (formatting tools)
├─→ Memory: ~500MB
├─→ Time: 1-2 minutes
└─→ Cost: Minimal

Auto-Resolve:
├─→ CPU: Low (git operations)
├─→ Memory: ~500MB
├─→ Time: 2-3 minutes
└─→ Cost: Minimal

Auto-Merge:
├─→ CPU: Very Low (API calls)
├─→ Memory: ~256MB
├─→ Time: < 1 minute
└─→ Cost: Minimal

Total per PR: ~3-6 minutes of runner time
```

## Extension Points

The system can be extended at these points:

```
┌─────────────────────────────────────────────────────────────┐
│                    Customization Points                      │
└─────────────────────────────────────────────────────────────┘

1. Auto-Fix Formatters
   ├─→ Add language-specific formatters
   ├─→ Add linters
   └─→ Add custom fix scripts

2. Auto-Resolve Strategies
   ├─→ Custom merge strategies
   ├─→ File-specific resolution
   └─→ Validation commands

3. Auto-Merge Criteria
   ├─→ Custom conditions
   ├─→ Author-based rules
   ├─→ Time-based rules
   └─→ Integration checks

4. Notifications
   ├─→ Slack integration
   ├─→ Email notifications
   ├─→ Custom webhooks
   └─→ Status dashboards

5. Audit & Monitoring
   ├─→ Custom logging
   ├─→ Metrics collection
   ├─→ Performance tracking
   └─→ Error alerting
```

## Failure Modes & Recovery

```
┌─────────────────────────────────────────────────────────────┐
│                    Failure Handling                          │
└─────────────────────────────────────────────────────────────┘

Auto-Fix Failure:
├─→ Error: Formatting tool fails
├─→ Action: Continue without fixes
└─→ Result: Manual fix required

Auto-Resolve Failure:
├─→ Error: Cannot resolve conflicts
├─→ Action: Comment on PR, mark for manual review
└─→ Result: Developer resolves manually

Auto-Merge Failure:
├─→ Error: Criteria not met or merge fails
├─→ Action: Skip merge, comment on PR
└─→ Result: PR remains open for manual handling

System Failure:
├─→ Error: GitHub Actions unavailable
├─→ Action: Automatic retry by GitHub
└─→ Result: Workflows run when service restores
```

## Performance Optimization

```
Optimization Strategies:

1. Caching
   └─→ Cache pip packages between runs
       └─→ Reduces install time

2. Parallelization
   └─→ Run independent formatters in parallel
       └─→ Faster execution

3. Conditional Execution
   └─→ Skip workflows when not needed
       └─→ Saves resources

4. Smart Triggers
   └─→ Only trigger on relevant changes
       └─→ Reduces unnecessary runs

5. Resource Limits
   └─→ Set timeouts on workflows
       └─→ Prevents runaway processes
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
└─────────────────────────────────────────────────────────────┘

GitHub Actions Interface
    │
    ├─→ Workflow runs dashboard
    ├─→ Individual run logs
    ├─→ Timing information
    └─→ Success/failure status

PR Comments
    │
    ├─→ Workflow status updates
    ├─→ Error messages
    └─→ Action taken

Git History
    │
    ├─→ Auto-fix commits
    ├─→ Auto-resolve commits
    └─→ Merge commits

Labels
    │
    └─→ Visual status indicators
```

---

## Architecture Decisions

### Why Separate Workflows?

1. **Modularity**: Each workflow has a single responsibility
2. **Flexibility**: Can enable/disable independently
3. **Debuggability**: Easier to troubleshoot specific issues
4. **Reusability**: Workflows can be reused across repos

### Why Squash Merge Default?

1. **Clean History**: One commit per PR
2. **Easy Revert**: Single commit to revert
3. **Changelog Friendly**: Clear feature additions
4. **Standard Practice**: Common in modern repos

### Why Label-Based Control?

1. **Visual**: Easy to see PR status
2. **Flexible**: Can combine multiple labels
3. **Searchable**: Can filter PRs by label
4. **Familiar**: Standard GitHub feature

---

For implementation details, see:
- `README.md` - Setup and usage
- `CONFIGURATION.md` - Customization options
- `SECURITY.md` - Security considerations
