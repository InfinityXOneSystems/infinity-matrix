"""Agent for detecting stubs and TODOs in the codebase."""
import os
import re
from pathlib import Path
from typing import Any, dict, list

from agents.health import AgentStatus, HealthMonitor


class StubTodoScanner:
    """Scan codebase for stubs, TODOs, and incomplete implementations."""

    PATTERNS = [
        (r'TODO:', 'todo'),
        (r'FIXME:', 'fixme'),
        (r'STUB:', 'stub'),
        (r'XXX:', 'xxx'),
        (r'HACK:', 'hack'),
        (r'NotImplementedError', 'not_implemented'),
        (r'pass\s*#.*stub', 'stub_pass'),
        (r'raise NotImplementedError', 'not_implemented_error'),
    ]

    EXCLUDE_DIRS = {
        '.git', '__pycache__', 'node_modules', '.venv', 'venv',
        'dist', 'build', '.pytest_cache', '.prooftest'
    }

    INCLUDE_EXTENSIONS = {
        '.py', '.js', '.ts', '.go', '.java', '.rb', '.rs',
        '.cpp', '.c', '.h', '.hpp', '.cs', '.php', '.sh'
    }

    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir).resolve()
        self.health_monitor = HealthMonitor()
        self.agent_id = "stub_todo_scanner"
        self.health_monitor.register_agent(
            self.agent_id,
            "scanner",
            {"description": "Scans codebase for TODOs and stubs"}
        )

    def scan(self) -> list[dict[str, Any]]:
        """Scan the codebase for stubs and TODOs."""
        try:
            self.health_monitor.heartbeat(self.agent_id, AgentStatus.HEALTHY)
            findings = []

            for file_path in self._get_files():
                file_findings = self._scan_file(file_path)
                findings.extend(file_findings)

            self.health_monitor.record_success(self.agent_id)
            return findings

        except Exception as e:
            self.health_monitor.record_error(self.agent_id, str(e))
            raise

    def _get_files(self) -> list[Path]:
        """Get list of files to scan."""
        files = []
        for root, dirs, filenames in os.walk(self.root_dir):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if d not in self.EXCLUDE_DIRS]

            for filename in filenames:
                file_path = Path(root) / filename
                if file_path.suffix in self.INCLUDE_EXTENSIONS:
                    files.append(file_path)

        return files

    def _scan_file(self, file_path: Path) -> list[dict[str, Any]]:
        """Scan a single file for issues."""
        findings = []

        try:
            with open(file_path, encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()

            for line_num, line in enumerate(lines, start=1):
                for pattern, issue_type in self.PATTERNS:
                    if re.search(pattern, line, re.IGNORECASE):
                        findings.append({
                            "file": str(file_path.relative_to(self.root_dir)),
                            "line": line_num,
                            "type": issue_type,
                            "content": line.strip(),
                            "severity": self._get_severity(issue_type)
                        })

        except Exception:
            # Log but don't fail the entire scan
            pass

        return findings

    def _get_severity(self, issue_type: str) -> str:
        """Determine severity of the finding."""
        high_severity = {'not_implemented', 'not_implemented_error', 'fixme'}
        medium_severity = {'todo', 'stub', 'stub_pass'}

        if issue_type in high_severity:
            return "high"
        elif issue_type in medium_severity:
            return "medium"
        else:
            return "low"

    def generate_report(self, findings: list[dict[str, Any]]) -> dict[str, Any]:
        """Generate a summary report of findings."""
        report = {
            "total_findings": len(findings),
            "by_severity": {"high": 0, "medium": 0, "low": 0},
            "by_type": {},
            "by_file": {},
            "findings": findings
        }

        for finding in findings:
            severity = finding["severity"]
            issue_type = finding["type"]
            file_name = finding["file"]

            report["by_severity"][severity] += 1
            report["by_type"][issue_type] = report["by_type"].get(issue_type, 0) + 1
            report["by_file"][file_name] = report["by_file"].get(file_name, 0) + 1

        return report
