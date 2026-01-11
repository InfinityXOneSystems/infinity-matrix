#!/usr/bin/env python3
"""
Compliance audit script.
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from infinity_matrix.compliance import ComplianceChecker
from infinity_matrix.compliance.compliance_checker import ComplianceFramework


async def main():
    """Run compliance audit."""
    checker = ComplianceChecker()

    print("=" * 60)
    print("INFINITY-MATRIX COMPLIANCE AUDIT")
    print("=" * 60)

    # System configuration (simulated)
    system_config = {
        "encryption_at_rest": True,
        "encryption_in_transit": True,
        "access_controls": True,
        "audit_logging": True,
        "backup_recovery": True,
        "incident_response": True,
        "change_management": True,
        "risk_assessment": True,
        "vendor_management": False,
        "monitoring_logging": True,
        "consent_management": True,
        "right_to_deletion": True,
        "data_portability": True,
        "breach_notification": True,
        "privacy_by_design": True,
    }

    # Check all frameworks
    frameworks = [ComplianceFramework.HIPAA, ComplianceFramework.SOC2, ComplianceFramework.GDPR]

    for framework in frameworks:
        print(f"\nChecking {framework.value.upper()} compliance...")
        result = await checker.run_compliance_check(framework, system_config)

        print(f"  Status: {result['overall_status']}")
        print(f"  Score: {result['compliance_score']:.1f}%")
        print(f"  Passed: {result['checks_passed']}/{result['checks_total']}")

        # Show failed checks
        failed = [r for r in result['results'] if r['status'] == 'failed']
        if failed:
            print("\n  Failed checks:")
            for check in failed:
                print(f"    - {check['check_name']}")

    # Generate report
    report = checker.generate_compliance_report(frameworks)

    print("\n" + "=" * 60)
    print("COMPLIANCE SUMMARY")
    print("=" * 60)

    for fw, summary in report['summary'].items():
        print(f"{fw.upper()}: {summary['status']} ({summary['score']:.1f}%)")

    print("\n✅ Compliance audit completed!")


if __name__ == "__main__":
    asyncio.run(main())
