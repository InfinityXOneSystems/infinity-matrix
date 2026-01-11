#!/usr/bin/env python3
"""
Export proof artifacts to various formats (Markdown, PDF, CSV)
"""

import argparse
import json
from datetime import datetime
from pathlib import Path
from typing import Any, dict


class ArtifactExporter:
    """Export proof artifacts to multiple formats"""

    def __init__(self, input_path: Path, output_path: Path):
        self.input_path = input_path
        self.output_path = output_path
        self.output_path.mkdir(parents=True, exist_ok=True)

    def export_to_markdown(self, data: dict[str, Any], filename: str) -> Path:
        """Export data to Markdown format"""
        output_file = self.output_path / filename

        with open(output_file, 'w') as f:
            f.write(f"# {data.get('title', 'Proof Artifact Export')}\n\n")
            f.write(f"**Generated**: {datetime.utcnow().isoformat()}\n")
            f.write(f"**Source**: {self.input_path}\n\n")

            if 'summary' in data:
                f.write("## Summary\n\n")
                f.write(f"{data['summary']}\n\n")

            if 'checks' in data:
                f.write("## Results\n\n")
                for check in data['checks']:
                    f.write(f"### {check.get('service', 'Unknown')}\n\n")
                    f.write(f"- **Status**: {check.get('status', 'N/A')}\n")
                    for key, value in check.items():
                        if key not in ['service', 'status']:
                            f.write(f"- **{key}**: {value}\n")
                    f.write("\n")

            if 'metrics' in data:
                f.write("## Metrics\n\n")
                f.write("| Metric | Value |\n")
                f.write("|--------|-------|\n")
                for key, value in data['metrics'].items():
                    f.write(f"| {key} | {value} |\n")
                f.write("\n")

        print(f"✓ Markdown exported to: {output_file}")
        return output_file

    def export_to_csv(self, data: dict[str, Any], filename: str) -> Path:
        """Export data to CSV format"""
        output_file = self.output_path / filename

        with open(output_file, 'w') as f:
            # Write header
            if 'checks' in data:
                f.write("Service,Status,Metric,Value\n")
                for check in data['checks']:
                    service = check.get('service', 'Unknown')
                    status = check.get('status', 'N/A')
                    for key, value in check.items():
                        if key not in ['service', 'status']:
                            f.write(f"{service},{status},{key},{value}\n")

            elif 'metrics' in data:
                f.write("Metric,Value\n")
                for key, value in data['metrics'].items():
                    f.write(f"{key},{value}\n")

        print(f"✓ CSV exported to: {output_file}")
        return output_file

    def export_to_pdf(self, markdown_file: Path, pdf_filename: str) -> Path:
        """Export Markdown to PDF using pandoc"""
        output_file = self.output_path / pdf_filename

        try:
            import subprocess

            # Try to use pandoc if available
            result = subprocess.run(
                ['pandoc', str(markdown_file), '-o', str(output_file),
                 '--pdf-engine=pdflatex'],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                print(f"✓ PDF exported to: {output_file}")
                return output_file
            else:
                print(f"⚠ PDF export failed: {result.stderr}")
                print("  Install pandoc and pdflatex for PDF export")
                return None

        except FileNotFoundError:
            print("⚠ pandoc not found. Install pandoc for PDF export:")
            print("  Ubuntu/Debian: sudo apt-get install pandoc texlive-latex-base")
            print("  macOS: brew install pandoc basictex")
            return None

    def load_json_log(self, log_file: Path) -> dict[str, Any]:
        """Load JSON log file"""
        with open(log_file) as f:
            return json.load(f)

    def export_all_formats(self, demo_name: str = None):
        """Export to all available formats"""
        print(f"\n{'='*60}")
        print("PROOF ARTIFACT EXPORTER")
        print(f"{'='*60}\n")

        # Find log files
        if self.input_path.is_file():
            log_files = [self.input_path]
        else:
            pattern = f"{demo_name}_*.json" if demo_name else "*.json"
            log_files = sorted(self.input_path.glob(pattern))

        if not log_files:
            print(f"✗ No log files found in {self.input_path}")
            return

        print(f"Found {len(log_files)} log file(s) to export\n")

        exported_count = 0
        for log_file in log_files:
            try:
                print(f"Processing: {log_file.name}")
                data = self.load_json_log(log_file)

                # Generate filenames
                base_name = log_file.stem
                timestamp = datetime.utcnow().strftime("%Y%m%d")

                # Export to Markdown
                md_file = self.export_to_markdown(
                    data,
                    f"{base_name}_report_{timestamp}.md"
                )

                # Export to CSV
                self.export_to_csv(
                    data,
                    f"{base_name}_metrics_{timestamp}.csv"
                )

                # Export to PDF
                if md_file:
                    self.export_to_pdf(
                        md_file,
                        f"{base_name}_report_{timestamp}.pdf"
                    )

                exported_count += 1
                print()

            except Exception as e:
                print(f"✗ Error processing {log_file.name}: {e}\n")
                continue

        print(f"{'='*60}")
        print(f"Export complete: {exported_count}/{len(log_files)} files processed")
        print(f"Output directory: {self.output_path}")
        print(f"{'='*60}\n")


def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(
        description="Export proof artifacts to multiple formats"
    )
    parser.add_argument(
        '--input',
        type=Path,
        default=Path(__file__).parent.parent / 'logs',
        help='Input log directory or file (default: ../logs)'
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=Path(__file__).parent.parent / 'exports',
        help='Output directory (default: ../exports)'
    )
    parser.add_argument(
        '--demo',
        type=str,
        help='Export specific demo logs (e.g., health_check)'
    )
    parser.add_argument(
        '--format',
        choices=['markdown', 'csv', 'pdf', 'all'],
        default='all',
        help='Export format (default: all)'
    )

    args = parser.parse_args()

    exporter = ArtifactExporter(args.input, args.output)
    exporter.export_all_formats(demo_name=args.demo)


if __name__ == "__main__":
    main()
