#!/usr/bin/env python3
"""
Health Check Demo - Demonstrates system monitoring and health validation
"""

import asyncio
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, dict

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


class HealthCheckDemo:
    """Demonstrates comprehensive system health monitoring"""

    def __init__(self, export: bool = False):
        self.export = export
        self.results = {
            "demo_name": "health_check",
            "timestamp": datetime.utcnow().isoformat(),
            "checks": [],
            "status": "running"
        }
        self.log_path = Path(__file__).parent.parent / "logs"
        self.log_path.mkdir(exist_ok=True)

    async def check_api_health(self) -> dict[str, Any]:
        """Check API service health"""
        print("✓ Checking API health...")
        # Simulate health check
        await asyncio.sleep(0.5)
        return {
            "service": "API",
            "status": "healthy",
            "response_time_ms": 45,
            "checks": ["database", "redis", "auth"]
        }

    async def check_database_health(self) -> dict[str, Any]:
        """Check database connectivity and performance"""
        print("✓ Checking database health...")
        await asyncio.sleep(0.3)
        return {
            "service": "Database",
            "status": "healthy",
            "connections": 12,
            "query_time_ms": 8
        }

    async def check_redis_health(self) -> dict[str, Any]:
        """Check Redis cache status"""
        print("✓ Checking Redis cache...")
        await asyncio.sleep(0.2)
        return {
            "service": "Redis",
            "status": "healthy",
            "memory_usage_mb": 256,
            "hit_rate": 0.95
        }

    async def check_agent_health(self) -> dict[str, Any]:
        """Check agent system status"""
        print("✓ Checking agent system...")
        await asyncio.sleep(0.4)
        return {
            "service": "Agents",
            "status": "healthy",
            "active_agents": 5,
            "queued_tasks": 2
        }

    async def check_monitoring_health(self) -> dict[str, Any]:
        """Check monitoring system"""
        print("✓ Checking monitoring system...")
        await asyncio.sleep(0.3)
        return {
            "service": "Monitoring",
            "status": "healthy",
            "metrics_collected": 1247,
            "alerts_active": 0
        }

    async def run_all_checks(self):
        """Execute all health checks"""
        print("\n" + "="*60)
        print("INFINITY MATRIX - HEALTH CHECK DEMO")
        print("="*60 + "\n")

        start_time = datetime.utcnow()

        # Run checks concurrently
        checks = await asyncio.gather(
            self.check_api_health(),
            self.check_database_health(),
            self.check_redis_health(),
            self.check_agent_health(),
            self.check_monitoring_health()
        )

        self.results["checks"] = checks
        self.results["duration_seconds"] = (datetime.utcnow() - start_time).total_seconds()

        # Determine overall status
        all_healthy = all(check["status"] == "healthy" for check in checks)
        self.results["status"] = "success" if all_healthy else "warning"

        # Display results
        print("\n" + "-"*60)
        print("HEALTH CHECK RESULTS")
        print("-"*60)
        for check in checks:
            status_icon = "✓" if check["status"] == "healthy" else "✗"
            print(f"{status_icon} {check['service']}: {check['status'].upper()}")

        print("\n" + "="*60)
        print(f"Overall Status: {'HEALTHY' if all_healthy else 'WARNING'}")
        print(f"Duration: {self.results['duration_seconds']:.2f}s")
        print("="*60 + "\n")

        # Save results
        await self.save_results()

        if self.export:
            await self.export_results()

        return self.results

    async def save_results(self):
        """Save results to log file"""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        log_file = self.log_path / f"health_check_{timestamp}.log"

        with open(log_file, 'w') as f:
            f.write(f"Health Check Demo - {self.results['timestamp']}\n")
            f.write("="*60 + "\n\n")
            for check in self.results['checks']:
                f.write(f"Service: {check['service']}\n")
                f.write(f"Status: {check['status']}\n")
                for key, value in check.items():
                    if key not in ['service', 'status']:
                        f.write(f"  {key}: {value}\n")
                f.write("\n")
            f.write(f"\nOverall Status: {self.results['status']}\n")
            f.write(f"Duration: {self.results['duration_seconds']:.2f}s\n")

        # Also save as JSON
        json_file = self.log_path / f"health_check_{timestamp}.json"
        with open(json_file, 'w') as f:
            json.dump(self.results, f, indent=2)

        print(f"✓ Results saved to {log_file}")
        print(f"✓ JSON results saved to {json_file}")

        # Update audit trail
        await self.update_audit_trail()

    async def update_audit_trail(self):
        """Update audit trail with execution record"""
        audit_file = self.log_path / "audit_trail.jsonl"
        audit_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": "demo_execution",
            "demo_name": "health_check",
            "user": "system",
            "status": self.results["status"],
            "duration": self.results["duration_seconds"],
            "artifacts_generated": 2
        }

        with open(audit_file, 'a') as f:
            f.write(json.dumps(audit_entry) + "\n")

    async def export_results(self):
        """Export results in various formats"""
        print("\n✓ Exporting results...")
        exports_path = Path(__file__).parent.parent / "exports"
        exports_path.mkdir(exist_ok=True)

        timestamp = datetime.utcnow().strftime("%Y%m%d")

        # Export to Markdown
        md_file = exports_path / f"health_report_{timestamp}.md"
        with open(md_file, 'w') as f:
            f.write("# Health Check Report\n\n")
            f.write(f"**Date**: {self.results['timestamp']}\n")
            f.write(f"**Duration**: {self.results['duration_seconds']:.2f}s\n")
            f.write(f"**Status**: {self.results['status'].upper()}\n\n")
            f.write("## Service Health\n\n")
            for check in self.results['checks']:
                f.write(f"### {check['service']}\n\n")
                f.write(f"- **Status**: {check['status']}\n")
                for key, value in check.items():
                    if key not in ['service', 'status']:
                        f.write(f"- **{key}**: {value}\n")
                f.write("\n")

        print(f"  → Markdown: {md_file}")

        # Export to CSV (metrics only)
        csv_file = exports_path / f"health_metrics_{timestamp}.csv"
        with open(csv_file, 'w') as f:
            f.write("Service,Status,Metric,Value\n")
            for check in self.results['checks']:
                for key, value in check.items():
                    if key not in ['service', 'status']:
                        f.write(f"{check['service']},{check['status']},{key},{value}\n")

        print(f"  → CSV: {csv_file}")
        print()


async def main():
    """Main execution function"""
    import argparse

    parser = argparse.ArgumentParser(description="Health Check Demo")
    parser.add_argument("--export", action="store_true", help="Export results to all formats")
    args = parser.parse_args()

    demo = HealthCheckDemo(export=args.export)
    results = await demo.run_all_checks()

    # Exit with appropriate code
    sys.exit(0 if results["status"] == "success" else 1)


if __name__ == "__main__":
    asyncio.run(main())
