# Proof Testing & Demonstrations

## Overview

This directory contains proof artifacts demonstrating operational functionality of the Infinity Matrix system. All demonstrations include execution logs, status reports, and exportable artifacts.

## Directory Structure

```
.prooftest/
├── demos/              # Demo scripts and workflows
├── logs/               # Execution logs and audit trails
├── exports/            # Export scripts and generated reports
├── DASHBOARD.md        # Real-time status dashboard
└── README.md          # This file
```

## Available Demonstrations

### 1. System Health Check Demo
**Location**: `demos/health_check_demo.py`  
**Purpose**: Demonstrates system monitoring and health validation  
**Duration**: ~30 seconds  
**Proof Artifacts**: Logs, metrics, health report

### 2. Agent Workflow Demo
**Location**: `demos/agent_workflow_demo.py`  
**Purpose**: Demonstrates agent orchestration and workflow execution  
**Duration**: ~2 minutes  
**Proof Artifacts**: Workflow logs, execution timeline, results

### 3. Data Pipeline Demo
**Location**: `demos/data_pipeline_demo.py`  
**Purpose**: Demonstrates ETL pipeline with validation  
**Duration**: ~5 minutes  
**Proof Artifacts**: Input/output data samples, transformation logs, quality reports

### 4. Error Recovery Demo
**Location**: `demos/error_recovery_demo.py`  
**Purpose**: Demonstrates auto-healing and error recovery  
**Duration**: ~1 minute  
**Proof Artifacts**: Error logs, recovery actions, success confirmation

### 5. Compliance Audit Demo
**Location**: `demos/compliance_audit_demo.py`  
**Purpose**: Demonstrates compliance checking and report generation  
**Duration**: ~3 minutes  
**Proof Artifacts**: Audit report, compliance checklist, evidence collection

## Running Demonstrations

### Quick Start

```bash
# Run all demos
python .prooftest/demos/run_all_demos.py

# Run specific demo
python .prooftest/demos/health_check_demo.py

# Run with export
python .prooftest/demos/health_check_demo.py --export all
```

### Docker Method

```bash
# Run demos in container
docker-compose exec api python .prooftest/demos/run_all_demos.py

# View results
docker-compose exec api cat .prooftest/logs/demo_results.json
```

### Automated Execution

Demos run automatically on:
- Every deployment
- Nightly at 2:00 AM UTC
- On-demand via GitHub Actions

## Proof Artifacts

### Log Files

All execution logs are stored in `.prooftest/logs/` with timestamps:

```
logs/
├── health_check_20251231_103000.log
├── agent_workflow_20251231_103030.log
├── data_pipeline_20251231_103130.log
├── error_recovery_20251231_103630.log
└── compliance_audit_20251231_103730.log
```

### Execution Reports

JSON format execution reports:

```json
{
  "demo_name": "health_check",
  "timestamp": "2025-12-31T10:30:00Z",
  "duration_seconds": 28,
  "status": "success",
  "checks_performed": 15,
  "checks_passed": 15,
  "checks_failed": 0,
  "artifacts": [
    "logs/health_check_20251231_103000.log",
    "exports/health_report_20251231.pdf"
  ]
}
```

### Export Formats

All proof artifacts can be exported in multiple formats:

#### Markdown Export
```bash
python .prooftest/exports/export_to_markdown.py \
  --input logs/health_check_20251231_103000.log \
  --output reports/health_check.md
```

#### PDF Export
```bash
python .prooftest/exports/export_to_pdf.py \
  --input logs/ \
  --output reports/proof_report.pdf \
  --include-all
```

#### CSV Export
```bash
python .prooftest/exports/export_to_csv.py \
  --input logs/ \
  --output reports/metrics.csv \
  --metrics-only
```

## Status Dashboard

Real-time system status available at: [DASHBOARD.md](DASHBOARD.md)

Key metrics tracked:
- System uptime
- Active workflows
- Agent status
- Recent demo executions
- Compliance status

## Verification

### Verify Demo Integrity

```bash
# Verify all demos are functional
python .prooftest/verify_demos.py

# Check log completeness
python .prooftest/verify_logs.py

# Validate exports
python .prooftest/verify_exports.py
```

### Continuous Verification

Automated verification runs:
- Pre-deployment (CI/CD)
- Post-deployment (smoke tests)
- Hourly (health checks)
- Daily (full validation)

## Audit Trail

All demo executions are recorded in the audit trail:

```bash
# View audit trail
cat .prooftest/logs/audit_trail.jsonl

# Query specific demo
grep "health_check" .prooftest/logs/audit_trail.jsonl
```

Audit trail format:
```json
{
  "timestamp": "2025-12-31T10:30:00Z",
  "event_type": "demo_execution",
  "demo_name": "health_check",
  "user": "system",
  "status": "success",
  "duration": 28,
  "artifacts_generated": 3
}
```

## Compliance & Certification

### Evidence Collection

All demos generate evidence suitable for:
- SOC 2 Type II audits
- ISO 27001 certification
- GDPR compliance verification
- Custom compliance frameworks

### Audit Package Generation

```bash
# Generate complete audit package
python .prooftest/exports/generate_audit_package.py \
  --start-date 2025-01-01 \
  --end-date 2025-12-31 \
  --format pdf \
  --include evidence,logs,reports
```

## Scheduling

### Automated Demo Schedule

| Demo | Frequency | Time (UTC) | Retention |
|------|-----------|------------|-----------|
| Health Check | Hourly | :00 | 7 days |
| Agent Workflow | Daily | 02:00 | 30 days |
| Data Pipeline | Daily | 03:00 | 30 days |
| Error Recovery | Weekly | Mon 04:00 | 90 days |
| Compliance Audit | Weekly | Sun 05:00 | 365 days |

### Manual Execution

```bash
# Execute specific demo on demand
curl -X POST http://localhost:8000/api/proof/demo/run \
  -H "Content-Type: application/json" \
  -d '{"demo_name": "health_check", "export": true}'
```

## Integration

### CI/CD Integration

Demos are integrated into CI/CD pipeline:

1. **Pre-deployment**: Run smoke tests
2. **Post-deployment**: Run full demo suite
3. **Verification**: Validate all passed
4. **Export**: Generate proof artifacts
5. **Archive**: Store in artifact repository

### API Access

Access proof artifacts via API:

```bash
# List all demos
GET /api/proof/demos

# Get demo results
GET /api/proof/demos/{demo_name}/results

# Download artifacts
GET /api/proof/demos/{demo_name}/artifacts/{artifact_id}

# Export to format
POST /api/proof/export
{
  "demo_name": "health_check",
  "format": "pdf",
  "include": ["logs", "metrics", "screenshots"]
}
```

## Troubleshooting

### Demo Failures

If a demo fails:

1. Check the error log: `.prooftest/logs/{demo_name}_error.log`
2. Review system status: Check [DASHBOARD.md](DASHBOARD.md)
3. Verify prerequisites: Run `verify_demos.py`
4. Check dependencies: Ensure all services running
5. Manual execution: Run demo with `--debug` flag

### Export Issues

If exports fail:

1. Check export logs: `.prooftest/logs/export_error.log`
2. Verify dependencies: `pandoc`, `wkhtmltopdf` installed
3. Check disk space: Ensure sufficient storage
4. Validate input: Ensure log files are complete

## Best Practices

1. **Run Before Deployment**: Always execute full demo suite
2. **Review Results**: Check all demos passed before production release
3. **Archive Artifacts**: Keep proof artifacts for compliance
4. **Regular Cleanup**: Remove old logs based on retention policy
5. **Monitor Failures**: Set up alerts for demo failures

## Metrics

Track demo execution metrics:

- **Success Rate**: Target 100%
- **Execution Time**: Monitor trends
- **Artifact Size**: Manage storage
- **Coverage**: Ensure all features demonstrated

## Support

### Getting Help

- Check [Error Handling Guide](../docs/guides/ERROR_HANDLING.md)
- Review [Troubleshooting](../docs/guides/QUICK_START.md#troubleshooting)
- Contact DevOps team
- File an issue on GitHub

### Reporting Issues

When reporting demo issues, include:
- Demo name and timestamp
- Error logs
- System status
- Steps to reproduce

## Related Documentation

- [User Manual](../docs/guides/USER_MANUAL.md)
- [Admin Manual](../docs/guides/ADMIN_MANUAL.md)
- [Agent Registry](../docs/agents/REGISTRY.md)
- [Compliance Guide](../docs/compliance/README.md)

---

**Last Updated**: 2025-12-31  
**Version**: 1.0.0  
**Status**: Active  

*All features are backed by operational proof. No feature is complete until demonstrated.*
