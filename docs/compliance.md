# Compliance Guide

## Overview

Infinity-Matrix provides built-in compliance automation for HIPAA, SOC2, and GDPR frameworks.

## Supported Frameworks

### 1. HIPAA (Health Insurance Portability and Accountability Act)

#### Coverage
- Administrative Safeguards
- Physical Safeguards
- Technical Safeguards

#### Key Controls
- **Encryption at Rest**: All databases encrypted
- **Encryption in Transit**: TLS 1.2+ enforced
- **Access Controls**: RBAC implemented
- **Audit Logging**: Complete audit trail
- **Backup & Recovery**: Automated DR procedures
- **Incident Response**: Automated detection and response

#### Running HIPAA Compliance Check
```bash
# Via CLI
infinity-matrix compliance check --framework hipaa

# Via API
curl -X POST http://localhost:8000/api/compliance/check \
  -H "Content-Type: application/json" \
  -d '{"framework": "hipaa", "system_config": {...}}'

# Via Script
python scripts/compliance/audit.py
```

### 2. SOC2 (Service Organization Control 2)

#### Trust Principles
- Security
- Availability
- Processing Integrity
- Confidentiality
- Privacy

#### Key Controls
- **Access Controls**: Multi-level authorization
- **Change Management**: Approval workflows
- **Risk Assessment**: Continuous monitoring
- **Vendor Management**: Third-party assessments
- **Monitoring & Logging**: Centralized logging
- **Incident Response**: Automated procedures

### 3. GDPR (General Data Protection Regulation)

#### Principles
- Lawfulness, Fairness, Transparency
- Purpose Limitation
- Data Minimization
- Accuracy
- Storage Limitation
- Integrity and Confidentiality

#### Key Controls
- **Data Encryption**: End-to-end encryption
- **Consent Management**: User consent tracking
- **Right to Deletion**: Data deletion workflows
- **Data Portability**: Export functionality
- **Breach Notification**: Automated alerts
- **Privacy by Design**: Built-in privacy controls

#### GDPR-Specific Features
```python
# Data subject rights
- Right to access
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability
- Right to object
```

## PII Redaction

### Automated PII Detection

The platform automatically detects and redacts:
- Email addresses
- Social Security Numbers (SSN)
- Phone numbers
- Credit card numbers
- IP addresses

### Using PII Redaction

```bash
# Via API
curl -X POST http://localhost:8000/api/compliance/pii/redact \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Contact john.doe@example.com or call 555-123-4567",
    "replacement": "[REDACTED]"
  }'

# Result:
# "Contact [REDACTED] or call [REDACTED]"
```

### Configuration
```python
# Enable PII redaction
ENABLE_PII_REDACTION = True

# Custom patterns
pii_patterns = {
    "custom_id": r'\b[A-Z]{3}\d{6}\b'
}
```

## Compliance Checking

### System Configuration

Required configuration for compliance:

```python
system_config = {
    # HIPAA requirements
    "encryption_at_rest": True,
    "encryption_in_transit": True,
    "access_controls": True,
    "audit_logging": True,
    "backup_recovery": True,
    "incident_response": True,
    
    # SOC2 requirements
    "change_management": True,
    "risk_assessment": True,
    "vendor_management": True,
    "monitoring_logging": True,
    
    # GDPR requirements
    "consent_management": True,
    "right_to_deletion": True,
    "data_portability": True,
    "breach_notification": True,
    "privacy_by_design": True,
}
```

### Running Compliance Audits

#### Automated Monthly Audits
```bash
# Scheduled via cron
0 0 1 * * /app/scripts/compliance/audit.py

# Manual trigger
infinity-matrix compliance audit --all
```

#### Compliance Score

Compliance is measured on a 0-100% scale:
- **100%**: Fully Compliant
- **80-99%**: Partially Compliant
- **< 80%**: Non-Compliant

### Generating Reports

```bash
# Generate compliance report
curl http://localhost:8000/api/compliance/report?frameworks=hipaa,soc2,gdpr

# Download templates
curl http://localhost:8000/api/compliance/templates/hipaa
```

## Remediation Guidance

When compliance checks fail, the system provides remediation guidance:

```json
{
  "check_name": "encryption_at_rest",
  "status": "failed",
  "remediation": "Enable database encryption and ensure all storage volumes are encrypted"
}
```

### Common Remediation Steps

#### Encryption at Rest
```bash
# Enable PostgreSQL encryption
ALTER DATABASE infinity_matrix SET encryption = 'on';
```

#### Encryption in Transit
```nginx
# Enforce TLS 1.2+
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
```

#### Access Controls
```python
# Implement RBAC
@requires_role("admin")
def sensitive_operation():
    pass
```

## Audit Logging

### What is Logged
- User authentication/authorization
- Data access and modifications
- System configuration changes
- Compliance check results
- Incident responses
- PII redaction events

### Accessing Audit Logs
```bash
# Search audit logs
curl http://localhost:8000/api/governance/audit/search?actor=user-123

# Get resource history
curl http://localhost:8000/api/governance/audit/resource/model/model-123

# Generate attribution report
curl http://localhost:8000/api/governance/audit/attribution/model/model-123
```

### Log Retention

- **Operational Logs**: 90 days
- **Audit Logs**: 7 years (HIPAA requirement)
- **Security Logs**: 1 year minimum

## Data Subject Rights (GDPR)

### Right to Access
```python
# Export user data
def export_user_data(user_id: str) -> dict:
    return {
        "personal_data": {...},
        "usage_data": {...},
        "audit_trail": {...}
    }
```

### Right to Erasure
```python
# Delete user data
def delete_user_data(user_id: str):
    # Remove personal data
    # Anonymize audit logs
    # Notify data processors
    pass
```

### Right to Portability
```python
# Export in machine-readable format
def export_portable_data(user_id: str) -> bytes:
    return json.dumps(user_data).encode()
```

## Breach Notification

### Automated Detection
- Suspicious access patterns
- Failed authentication attempts
- Unusual data access
- System intrusions

### Notification Timeline
- **Internal**: Immediate
- **Authorities**: 72 hours (GDPR)
- **Data Subjects**: Without undue delay

### Breach Response
1. Detect and contain
2. Assess impact
3. Notify stakeholders
4. Document incident
5. Implement fixes
6. Report to authorities

## Compliance Checklist

### Pre-Production
- [ ] Enable all encryption
- [ ] Configure access controls
- [ ] Set up audit logging
- [ ] Implement PII redaction
- [ ] Configure backup/DR
- [ ] Test incident response
- [ ] Run compliance checks
- [ ] Document procedures

### Ongoing
- [ ] Monthly compliance audits
- [ ] Quarterly security reviews
- [ ] Annual penetration testing
- [ ] Regular training
- [ ] Vendor assessments
- [ ] Policy updates
- [ ] Incident drills

## Compliance Documentation

### Required Documents
- Privacy Policy
- Terms of Service
- Data Processing Agreement
- Breach Notification Plan
- Incident Response Plan
- Business Continuity Plan
- Risk Assessment
- Security Policies

### Templates Available
```bash
# Get compliance templates
infinity-matrix compliance templates --framework hipaa
infinity-matrix compliance templates --framework soc2
infinity-matrix compliance templates --framework gdpr
```

## Third-Party Assessments

### SOC2 Audit Preparation
1. System description
2. Control objectives
3. Control activities
4. Test results documentation
5. Management assertions

### HIPAA Risk Assessment
1. Identify ePHI
2. Assess vulnerabilities
3. Determine risks
4. Implement safeguards
5. Document findings

## Contact & Support

- **Compliance Team**: compliance@company.com
- **Privacy Officer**: privacy@company.com
- **Security Team**: security@company.com

---

**Last Updated**: 2025-12-31
