#!/usr/bin/env python3
"""
Autonomous Agent for Infinity Matrix

This agent performs autonomous repository analysis and can be extended
for automated code actions, PR creation, and repository management.

By default, runs in dry-run mode for safety.
"""

import argparse
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import dict

try:
    import colorlog
    from dotenv import load_dotenv
    from github import Github, GithubException
except ImportError as e:
    msg = "Error: Missing required dependencies. "
    msg += "Please run: pip install -r requirements.txt"
    print(msg)
    print(f"Import error: {e}")
    sys.exit(1)


class AutonomousAgent:
    """
    Autonomous agent for repository analysis and management.

    Features:
    - Repository structure analysis
    - Code quality assessment
    - Automated reporting
    - PR creation (when enabled)
    - Extensible for custom actions
    """

    def __init__(self, mode: str = "dry-run", debug: bool = False):
        """
        Initialize the autonomous agent.

        Args:
            mode: Operation mode (dry-run, analysis, full)
            debug: Enable debug logging
        """
        self.mode = mode
        self.debug = debug
        self.setup_logging()
        self.load_config()
        self.github_client = None
        self.repo = None

        self.logger.info(f"Autonomous Agent initialized in '{mode}' mode")

    def setup_logging(self):
        """Setup colored logging."""
        handler = colorlog.StreamHandler()
        handler.setFormatter(colorlog.ColoredFormatter(
            '%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(message)s',
            log_colors={
                'DEBUG': 'cyan',
                'INFO': 'green',
                'WARNING': 'yellow',
                'ERROR': 'red',
                'CRITICAL': 'red,bg_white',
            }
        ))

        self.logger = colorlog.getLogger(__name__)
        self.logger.addHandler(handler)
        level = logging.DEBUG if self.debug else logging.INFO
        self.logger.setLevel(level)

    def load_config(self):
        """Load configuration from environment variables."""
        # Load .env file if it exists
        env_path = Path(__file__).parent.parent / '.env'
        if env_path.exists():
            load_dotenv(env_path)
            self.logger.debug(f"Loaded configuration from {env_path}")
        else:
            self.logger.warning(f"No .env file found at {env_path}")

        self.config = {
            'github_token': os.getenv('GITHUB_TOKEN'),
            'github_owner': os.getenv('GITHUB_OWNER',
                                      'InfinityXOneSystems'),
            'github_repo': os.getenv('GITHUB_REPO', 'infinity-matrix'),
            'github_default_branch': os.getenv('GITHUB_DEFAULT_BRANCH',
                                               'main'),
            'agent_mode': os.getenv('AGENT_MODE', 'dry-run'),
            'auto_create_pr': (os.getenv('AUTO_CREATE_PR', 'false').lower()
                               == 'true'),
            'enable_code_analysis': (
                os.getenv('ENABLE_CODE_ANALYSIS', 'true').lower() == 'true'),
            'enable_security_scan': (
                os.getenv('ENABLE_SECURITY_SCAN', 'true').lower() == 'true'),
            'enable_health_checks': (
                os.getenv('ENABLE_HEALTH_CHECKS', 'true').lower() == 'true'),
        }

        # Override with instance mode if different
        if self.mode != self.config['agent_mode']:
            msg = "Overriding config agent_mode "
            msg += f"'{self.config['agent_mode']}' with '{self.mode}'"
            self.logger.info(msg)
            self.config['agent_mode'] = self.mode

    def connect_github(self) -> bool:
        """
        Connect to GitHub API.

        Returns:
            bool: True if connection successful, False otherwise
        """
        if not self.config['github_token']:
            self.logger.error(
                "GitHub token not configured. Set GITHUB_TOKEN in .env")
            return False

        try:
            self.github_client = Github(self.config['github_token'])
            repo_full_name = f"{
                self.config['github_owner']}/{
                self.config['github_repo']}"
            self.repo = self.github_client.get_repo(repo_full_name)
            self.logger.info(
                f"Connected to GitHub repository: {repo_full_name}")
            return True
        except GithubException as e:
            self.logger.error(f"Failed to connect to GitHub: {e}")
            return False
        except Exception as e:
            self.logger.error(f"Unexpected error connecting to GitHub: {e}")
            return False

    def analyze_repository_structure(self) -> dict:
        """
        Analyze the repository structure.

        Returns:
            dict containing analysis results
        """
        self.logger.info("Analyzing repository structure...")

        repo_path = Path(__file__).parent.parent
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'directories': [],
            'files': [],
            'file_types': {},
            'total_files': 0,
            'total_lines': 0,
        }

        # Scan repository
        for item in repo_path.rglob('*'):
            # Skip hidden and git directories
            if any(part.startswith('.') for part in item.parts):
                continue

            if item.is_file():
                analysis['files'].append(str(item.relative_to(repo_path)))
                analysis['total_files'] += 1

                # Count file types
                suffix = item.suffix or 'no_extension'
                analysis['file_types'][suffix] = analysis['file_types'].get(
                    suffix, 0) + 1

                # Count lines for text files
                try:
                    if item.suffix in [
                            '.py', '.md', '.txt', '.yml', '.yaml', '.json']:
                        with open(item, encoding='utf-8') as f:
                            lines = len(f.readlines())
                            analysis['total_lines'] += lines
                except Exception:
                    pass

            elif item.is_dir():
                analysis['directories'].append(
                    str(item.relative_to(repo_path)))

        msg = f"Found {analysis['total_files']} files in "
        msg += f"{len(analysis['directories'])} directories"
        self.logger.info(msg)
        self.logger.info(f"Total lines of code: {analysis['total_lines']}")
        self.logger.debug(f"File types: {analysis['file_types']}")

        return analysis

    def check_code_quality(self) -> dict:
        """
        Check code quality using flake8.

        Returns:
            dict containing quality check results
        """
        if not self.config['enable_code_analysis']:
            self.logger.info("Code analysis disabled in configuration")
            return {'enabled': False}

        self.logger.info("Checking code quality with flake8...")

        import subprocess

        repo_path = Path(__file__).parent.parent
        results = {
            'enabled': True,
            'timestamp': datetime.now().isoformat(),
            'errors': [],
            'warnings': [],
            'passed': True,
        }

        try:
            # Run flake8 on Python files
            python_files = list(repo_path.rglob('*.py'))
            if python_files:
                result = subprocess.run(
                    ['flake8', '--exit-zero', str(repo_path)],
                    capture_output=True,
                    text=True,
                    cwd=repo_path
                )

                if result.stdout:
                    issues = result.stdout.strip().split('\n')
                    results['errors'] = issues
                    results['passed'] = len(issues) == 0
                    self.logger.info(
                        f"Found {
                            len(issues)} code quality issues")
                else:
                    self.logger.info("No code quality issues found!")
            else:
                self.logger.info("No Python files found to analyze")

        except FileNotFoundError:
            self.logger.warning(
                "flake8 not found. Install with: pip install flake8")
        except Exception as e:
            self.logger.error(f"Error running code quality check: {e}")

        return results

    def check_repository_health(self) -> dict:
        """
        Check repository health metrics.

        Returns:
            dict containing health check results
        """
        if not self.config['enable_health_checks']:
            self.logger.info("Health checks disabled in configuration")
            return {'enabled': False}

        self.logger.info("Checking repository health...")

        health = {
            'enabled': True,
            'timestamp': datetime.now().isoformat(),
            'has_readme': False,
            'has_license': False,
            'has_gitignore': False,
            'has_requirements': False,
            'has_tests': False,
            'has_ci': False,
            'has_docs': False,
            'score': 0,
        }

        repo_path = Path(__file__).parent.parent

        # Check for essential files
        health['has_readme'] = (repo_path / 'README.md').exists()
        health['has_license'] = (repo_path / 'LICENSE').exists()
        health['has_gitignore'] = (repo_path / '.gitignore').exists()
        health['has_requirements'] = (repo_path / 'requirements.txt').exists()

        # Check for tests
        test_dirs = ['tests', 'test']
        health['has_tests'] = any((repo_path / d).exists() for d in test_dirs)

        # Check for CI
        ci_paths = [
            repo_path / '.github' / 'workflows',
            repo_path / '.gitlab-ci.yml',
            repo_path / '.travis.yml',
        ]
        health['has_ci'] = any(p.exists() for p in ci_paths)

        # Check for documentation
        health['has_docs'] = (repo_path / 'docs').exists()

        # Calculate health score
        checks = [
            'has_readme',
            'has_license',
            'has_gitignore',
            'has_requirements',
            'has_tests',
            'has_ci',
            'has_docs']
        health['score'] = sum(health[check]
                              for check in checks) / len(checks) * 100

        self.logger.info(f"Repository health score: {health['score']:.1f}%")

        return health

    def generate_report(
            self,
            analysis: dict,
            quality: dict,
            health: dict) -> str:
        """
        Generate a comprehensive analysis report.

        Args:
            analysis: Repository structure analysis
            quality: Code quality check results
            health: Repository health check results

        Returns:
            str: Formatted report
        """
        self.logger.info("Generating analysis report...")

        report = [
            "=" * 80,
            "AUTONOMOUS AGENT ANALYSIS REPORT",
            "=" * 80,
            f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Mode: {self.mode}",
            "",
            "REPOSITORY STRUCTURE",
            "-" * 80,
            f"Total Files: {analysis['total_files']}",
            f"Total Directories: {len(analysis['directories'])}",
            f"Total Lines: {analysis['total_lines']}",
            "",
            "File Types:",
        ]

        for file_type, count in sorted(
                analysis['file_types'].items(),
                key=lambda x: x[1], reverse=True):
            report.append(f"  {file_type}: {count}")

        report.extend([
            "",
            "CODE QUALITY",
            "-" * 80,
        ])

        if quality.get('enabled'):
            if quality['passed']:
                report.append("✓ All code quality checks passed!")
            else:
                report.append(
                    f"✗ Found {len(quality['errors'])} code quality issues")
                if quality['errors'][:5]:  # Show first 5 issues
                    report.append("\nTop Issues:")
                    for error in quality['errors'][:5]:
                        report.append(f"  - {error}")
        else:
            report.append("Code quality checks disabled")

        report.extend([
            "",
            "REPOSITORY HEALTH",
            "-" * 80,
        ])

        if health.get('enabled'):
            report.append(f"Health Score: {health['score']:.1f}%")
            report.append("")
            report.append(f"{'✓' if health['has_readme'] else '✗'} README.md")
            report.append(f"{'✓' if health['has_license'] else '✗'} LICENSE")
            report.append(
                f"{'✓' if health['has_gitignore'] else '✗'} .gitignore")
            check = '✓' if health['has_requirements'] else '✗'
            report.append(f"{check} requirements.txt")
            report.append(f"{'✓' if health['has_tests'] else '✗'} Tests")
            report.append(f"{'✓' if health['has_ci'] else '✗'} CI/CD")
            report.append(
                f"{'✓' if health['has_docs'] else '✗'} Documentation")
        else:
            report.append("Health checks disabled")

        report.extend([
            "",
            "=" * 80,
            "",
        ])

        return "\n".join(report)

    def create_analysis_pr(self, report: str) -> str | None:
        """
        Create a PR with analysis results.

        Args:
            report: Analysis report content

        Returns:
            Optional[str]: PR URL if created, None otherwise
        """
        if self.mode == "dry-run":
            self.logger.info("DRY-RUN: Would create PR with analysis report")
            self.logger.info("Report preview:")
            print(report)
            return None

        if not self.config['auto_create_pr']:
            self.logger.info("Auto PR creation disabled in configuration")
            return None

        if not self.repo:
            self.logger.error("Not connected to GitHub repository")
            return None

        try:
            # This is a placeholder for actual PR creation
            # In practice, you'd create a branch, commit changes, and open a PR
            self.logger.info("Creating analysis PR...")
            msg = "PR creation not yet implemented - "
            msg += "placeholder for future functionality"
            self.logger.info(msg)
            return None
        except Exception as e:
            self.logger.error(f"Error creating PR: {e}")
            return None

    def run(self) -> bool:
        """
        Execute the autonomous agent workflow.

        Returns:
            bool: True if successful, False otherwise
        """
        self.logger.info("Starting autonomous agent execution...")
        self.logger.info(f"Mode: {self.mode}")

        if self.mode == "dry-run":
            self.logger.warning(
                "Running in DRY-RUN mode - no changes will be made")

        # Connect to GitHub if token is available
        if self.config['github_token']:
            self.connect_github()
        else:
            self.logger.warning(
                "No GitHub token configured - skipping GitHub integration")

        # Perform analysis
        analysis = self.analyze_repository_structure()
        quality = self.check_code_quality()
        health = self.check_repository_health()

        # Generate report
        report = self.generate_report(analysis, quality, health)
        print(report)

        # Create PR if configured
        if self.config['auto_create_pr']:
            pr_url = self.create_analysis_pr(report)
            if pr_url:
                self.logger.info(f"Created analysis PR: {pr_url}")

        self.logger.info("Autonomous agent execution completed successfully")
        return True


def main():
    """Main entry point for the autonomous agent."""
    parser = argparse.ArgumentParser(
        description="Autonomous Agent for Infinity Matrix",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --dry-run                 # Safe mode, no changes
  %(prog)s --mode analysis           # Analysis only
  %(prog)s --mode full               # Full autonomous mode
  %(prog)s --debug                   # Enable debug logging
        """
    )

    parser.add_argument(
        '--mode',
        choices=['dry-run', 'analysis', 'full'],
        default='dry-run',
        help='Operation mode (default: dry-run)'
    )

    parser.add_argument(
        '--dry-run',
        action='store_const',
        const='dry-run',
        dest='mode',
        help='Run in dry-run mode (alias for --mode dry-run)'
    )

    parser.add_argument(
        '--debug',
        action='store_true',
        help='Enable debug logging'
    )

    args = parser.parse_args()

    # Create and run agent
    agent = AutonomousAgent(mode=args.mode, debug=args.debug)
    success = agent.run()

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
