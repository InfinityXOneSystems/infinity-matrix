"""
System Auditor - Automatic system audit and analysis

This module performs comprehensive audits of:
- Local files and directory structure
- Environment variables
- Installed applications
- Credentials and secrets
- Cloud resources (when accessible)
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, dict

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("Warning: python-dotenv not installed")


class SystemAuditor:
    """Audits local and cloud resources for the Infinity-Matrix system."""

    def __init__(self, project_root: Path | None = None):
        """Initialize the auditor."""
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.audit_results = {
            'timestamp': datetime.utcnow().isoformat(),
            'system': {},
            'files': {},
            'environment': {},
            'credentials': {},
            'applications': {},
            'cloud_resources': {},
            'recommendations': []
        }

    def run_audit(self) -> dict[str, Any]:
        """Run complete system audit."""
        print("=" * 80)
        print("Infinity-Matrix System Audit")
        print("=" * 80)
        print()

        self.audit_system_info()
        self.audit_files()
        self.audit_environment()
        self.audit_credentials()
        self.audit_applications()
        self.audit_cloud_resources()
        self.generate_recommendations()

        return self.audit_results

    def audit_system_info(self):
        """Audit basic system information."""
        print("Auditing system information...")

        import platform

        self.audit_results['system'] = {
            'os': platform.system(),
            'os_version': platform.version(),
            'architecture': platform.machine(),
            'python_version': platform.python_version(),
            'hostname': platform.node(),
            'processor': platform.processor()
        }

        print(f"  OS: {self.audit_results['system']['os']}")
        print(f"  Python: {self.audit_results['system']['python_version']}")
        print()

    def audit_files(self):
        """Audit file structure and contents."""
        print("Auditing file structure...")

        # Check required directories
        required_dirs = [
            'ai_stack',
            'gateway_stack',
            'monitoring',
            'data',
            'scripts',
            'docs'
        ]

        existing_dirs = []
        missing_dirs = []

        for dir_name in required_dirs:
            dir_path = self.project_root / dir_name
            if dir_path.exists():
                existing_dirs.append(dir_name)
            else:
                missing_dirs.append(dir_name)

        # Check required files
        required_files = [
            'README.md',
            'requirements.txt',
            'setup.py',
            '.env.example',
            '.gitignore'
        ]

        existing_files = []
        missing_files = []

        for file_name in required_files:
            file_path = self.project_root / file_name
            if file_path.exists():
                existing_files.append(file_name)
            else:
                missing_files.append(file_name)

        self.audit_results['files'] = {
            'project_root': str(self.project_root),
            'required_directories': {
                'existing': existing_dirs,
                'missing': missing_dirs
            },
            'required_files': {
                'existing': existing_files,
                'missing': missing_files
            },
            'total_python_files': len(list(self.project_root.rglob('*.py'))),
            'total_markdown_files': len(list(self.project_root.rglob('*.md')))
        }

        print(f"  Directories: {len(existing_dirs)}/{len(required_dirs)} found")
        print(f"  Required files: {len(existing_files)}/{len(required_files)} found")
        print(f"  Python files: {self.audit_results['files']['total_python_files']}")

        if missing_dirs:
            self.audit_results['recommendations'].append(
                f"Create missing directories: {', '.join(missing_dirs)}"
            )

        if missing_files:
            self.audit_results['recommendations'].append(
                f"Create missing files: {', '.join(missing_files)}"
            )

        print()

    def audit_environment(self):
        """Audit environment variables."""
        print("Auditing environment variables...")

        # Check for important environment variables
        important_env_vars = [
            'GCP_PROJECT_ID',
            'GOOGLE_APPLICATION_CREDENTIALS',
            'GITHUB_TOKEN',
            'OPENAI_API_KEY',
            'ENVIRONMENT',
            'LOG_LEVEL'
        ]

        found_vars = {}
        missing_vars = []

        for var in important_env_vars:
            value = os.getenv(var)
            if value:
                # Mask sensitive values
                if 'KEY' in var or 'TOKEN' in var or 'PASSWORD' in var:
                    found_vars[var] = '***masked***'
                else:
                    found_vars[var] = value
            else:
                missing_vars.append(var)

        self.audit_results['environment'] = {
            'found': found_vars,
            'missing': missing_vars,
            'total_env_vars': len(os.environ)
        }

        print(f"  Environment variables set: {len(found_vars)}/{len(important_env_vars)}")

        if missing_vars:
            self.audit_results['recommendations'].append(
                f"Set missing environment variables: {', '.join(missing_vars)}"
            )

        print()

    def audit_credentials(self):
        """Audit credentials and secrets."""
        print("Auditing credentials...")

        credentials = {
            'env_file': (self.project_root / '.env').exists(),
            'gcp_credentials': False,
            'git_configured': False
        }

        # Check GCP credentials
        gcp_creds = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        if gcp_creds:
            credentials['gcp_credentials'] = Path(gcp_creds).exists()

        # Check git configuration
        try:
            subprocess.run(
                ['git', 'config', 'user.email'],
                capture_output=True,
                check=True,
                cwd=self.project_root
            )
            credentials['git_configured'] = True
        except (subprocess.CalledProcessError, FileNotFoundError):
            pass

        self.audit_results['credentials'] = credentials

        print(f"  .env file: {'✓' if credentials['env_file'] else '✗'}")
        print(f"  GCP credentials: {'✓' if credentials['gcp_credentials'] else '✗'}")
        print(f"  Git configured: {'✓' if credentials['git_configured'] else '✗'}")

        if not credentials['env_file']:
            self.audit_results['recommendations'].append(
                "Create .env file from .env.example"
            )

        if not credentials['gcp_credentials']:
            self.audit_results['recommendations'].append(
                "Configure Google Cloud credentials"
            )

        print()

    def audit_applications(self):
        """Audit installed applications."""
        print("Auditing installed applications...")

        apps = {
            'python': self._check_command('python --version'),
            'pip': self._check_command('pip --version'),
            'git': self._check_command('git --version'),
            'docker': self._check_command('docker --version'),
            'gcloud': self._check_command('gcloud --version')
        }

        self.audit_results['applications'] = apps

        for app, status in apps.items():
            print(f"  {app}: {'✓' if status else '✗'}")

        # Check Python packages
        try:
            result = subprocess.run(
                ['pip', 'list', '--format=json'],
                capture_output=True,
                text=True,
                check=True
            )
            installed_packages = json.loads(result.stdout)
            self.audit_results['applications']['python_packages'] = len(installed_packages)
            print(f"  Python packages: {len(installed_packages)} installed")
        except Exception:
            pass

        print()

    def audit_cloud_resources(self):
        """Audit cloud resources (if accessible)."""
        print("Auditing cloud resources...")

        cloud_resources = {
            'gcp_accessible': False,
            'projects': [],
            'services_enabled': []
        }

        # Try to check GCP access
        if self._check_command('gcloud --version'):
            try:
                # Check if authenticated
                result = subprocess.run(
                    ['gcloud', 'config', 'get-value', 'project'],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                if result.returncode == 0 and result.stdout.strip():
                    cloud_resources['gcp_accessible'] = True
                    cloud_resources['current_project'] = result.stdout.strip()
                    print(f"  GCP Project: {cloud_resources['current_project']}")
            except Exception:
                pass

        if not cloud_resources['gcp_accessible']:
            print("  GCP: Not configured or not accessible")
            self.audit_results['recommendations'].append(
                "Configure Google Cloud access with 'gcloud auth login'"
            )

        self.audit_results['cloud_resources'] = cloud_resources
        print()

    def generate_recommendations(self):
        """Generate recommendations based on audit results."""
        print("Generating recommendations...")

        # Check if dependencies need installation
        requirements_file = self.project_root / 'requirements.txt'
        if requirements_file.exists():
            self.audit_results['recommendations'].append(
                "Install Python dependencies: pip install -r requirements.txt"
            )

        # Check if setup needs to be run
        setup_file = self.project_root / 'setup.py'
        if setup_file.exists():
            self.audit_results['recommendations'].append(
                "Install package in development mode: pip install -e ."
            )

        print(f"  Generated {len(self.audit_results['recommendations'])} recommendations")
        print()

    def _check_command(self, command: str) -> bool:
        """Check if a command is available."""
        try:
            subprocess.run(
                command.split(),
                capture_output=True,
                check=True,
                timeout=5
            )
            return True
        except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired):
            return False

    def save_report(self, output_file: Path | None = None):
        """Save audit report to file."""
        if output_file is None:
            output_file = self.project_root / 'data' / 'tracking' / 'system_audit.json'

        output_file.parent.mkdir(parents=True, exist_ok=True)

        with open(output_file, 'w') as f:
            json.dump(self.audit_results, f, indent=2)

        print(f"Audit report saved to: {output_file}")

    def print_summary(self):
        """Print audit summary."""
        print()
        print("=" * 80)
        print("Audit Summary")
        print("=" * 80)
        print()

        # Print recommendations
        if self.audit_results['recommendations']:
            print("Recommendations:")
            for i, rec in enumerate(self.audit_results['recommendations'], 1):
                print(f"  {i}. {rec}")
            print()
        else:
            print("No recommendations - system looks good!")
            print()

        print("Audit complete!")
        print("=" * 80)


def main():
    """Main entry point."""
    auditor = SystemAuditor()
    auditor.run_audit()
    auditor.save_report()
    auditor.print_summary()

    return 0


if __name__ == '__main__':
    sys.exit(main())
