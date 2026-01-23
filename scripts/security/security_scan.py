#!/usr/bin/env python3
"""
Automated security scanning script.
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from infinity_matrix.security import SecurityScanner


async def main():
    """Run security scans."""
    scanner = SecurityScanner()

    print("=" * 60)
    print("INFINITY-MATRIX SECURITY SCAN")
    print("=" * 60)

    # Run full scan
    result = await scanner.run_full_scan()

    print(f"\nScan ID: {result['scan_id']}")
    print(f"Timestamp: {result['timestamp']}")
    print("\nResults:")
    print(f"  Total Scans: {result['summary']['total_scans']}")
    print(f"  Total Findings: {result['summary']['total_findings']}")

    # Print details
    for scan in result['scans']:
        print(f"\n{scan['tool'].upper()} Scan:")
        print(f"  Status: {scan['status']}")
        print(f"  Findings: {len(scan.get('findings', []))}")

    print("\n" + "=" * 60)

    if result['summary']['total_findings'] > 0:
        print("⚠️  Security issues found!")
        return 1
    else:
        print("✅ No security issues found!")
        return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
