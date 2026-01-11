"""
Automated security scanner integrating multiple tools.
"""
import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class SecurityScanner:
    """Automated security scanning with bandit, safety, and container tools."""

    def __init__(self):
        self.scan_history: list[dict[str, Any]] = []

    async def run_bandit_scan(self, path: str = ".") -> dict[str, Any]:
        """Run bandit security scan on Python code."""
        logger.info("Running bandit security scan", path=path)

        try:
            result = await asyncio.create_subprocess_exec(
                "bandit",
                "-r",
                path,
                "-f",
                "json",
                "-o",
                "/tmp/bandit_report.json",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            await result.communicate()

            # Read report
            report_path = Path("/tmp/bandit_report.json")
            if report_path.exists():
                with open(report_path) as f:
                    report = json.load(f)

                return {
                    "tool": "bandit",
                    "timestamp": datetime.now().isoformat(),
                    "status": "completed",
                    "findings": report.get("results", []),
                    "metrics": report.get("metrics", {}),
                }

        except Exception as e:
            logger.error("Bandit scan failed", error=str(e))
            return {
                "tool": "bandit",
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "error": str(e),
            }

        return {
            "tool": "bandit",
            "timestamp": datetime.now().isoformat(),
            "status": "completed",
            "findings": [],
        }

    async def run_safety_scan(self) -> dict[str, Any]:
        """Run safety scan for dependency vulnerabilities."""
        logger.info("Running safety dependency scan")

        try:
            result = await asyncio.create_subprocess_exec(
                "safety",
                "check",
                "--json",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            stdout, stderr = await result.communicate()

            if stdout:
                findings = json.loads(stdout.decode())
                return {
                    "tool": "safety",
                    "timestamp": datetime.now().isoformat(),
                    "status": "completed",
                    "findings": findings,
                }

        except Exception as e:
            logger.error("Safety scan failed", error=str(e))
            return {
                "tool": "safety",
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "error": str(e),
            }

        return {
            "tool": "safety",
            "timestamp": datetime.now().isoformat(),
            "status": "completed",
            "findings": [],
        }

    async def run_container_scan(self, image: str) -> dict[str, Any]:
        """Run trivy container security scan."""
        logger.info("Running trivy container scan", image=image)

        try:
            result = await asyncio.create_subprocess_exec(
                "trivy",
                "image",
                "--format",
                "json",
                "--output",
                "/tmp/trivy_report.json",
                image,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )

            await result.communicate()

            # Read report
            report_path = Path("/tmp/trivy_report.json")
            if report_path.exists():
                with open(report_path) as f:
                    report = json.load(f)

                return {
                    "tool": "trivy",
                    "timestamp": datetime.now().isoformat(),
                    "status": "completed",
                    "image": image,
                    "findings": report.get("Results", []),
                }

        except Exception as e:
            logger.error("Trivy scan failed", error=str(e))
            return {
                "tool": "trivy",
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "image": image,
                "error": str(e),
            }

        return {
            "tool": "trivy",
            "timestamp": datetime.now().isoformat(),
            "status": "completed",
            "image": image,
            "findings": [],
        }

    async def run_full_scan(self, include_containers: bool = False) -> dict[str, Any]:
        """Run all security scans."""
        logger.info("Starting full security scan")

        results = {
            "scan_id": f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "scans": [],
        }

        # Run Python scans
        bandit_result = await self.run_bandit_scan("backend")
        results["scans"].append(bandit_result)

        safety_result = await self.run_safety_scan()
        results["scans"].append(safety_result)

        # Count total findings
        total_findings = sum(
            len(scan.get("findings", [])) for scan in results["scans"]
        )

        results["summary"] = {
            "total_scans": len(results["scans"]),
            "total_findings": total_findings,
            "status": "completed",
        }

        self.scan_history.append(results)
        logger.info("Security scan completed", findings=total_findings)

        return results

    def get_scan_history(self, limit: int = 10) -> list[dict[str, Any]]:
        """Get recent scan history."""
        return self.scan_history[-limit:]
