#!/usr/bin/env python3
"""
Vision Cortex Runner

Command-line interface for executing the Vision Cortex multi-agent system.
"""

import argparse
import json
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from cortex.agents import VisionCortex  # noqa: E402


def main():
    """Main entry point for Vision Cortex runner."""
    parser = argparse.ArgumentParser(
        description="Execute Vision Cortex Multi-Agent System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                                    # Run with defaults
  %(prog)s --signal "market_analysis"         # Run with input signal
  %(prog)s --output custom_output/            # Custom output directory
  %(prog)s --config config.json               # Use config file
        """
    )

    parser.add_argument(
        '--signal',
        type=str,
        help='Input signal to guide the workflow',
        default=None
    )

    parser.add_argument(
        '--config',
        type=str,
        help='Path to configuration JSON file',
        default=None
    )

    parser.add_argument(
        '--output',
        type=str,
        help='Output directory for generated documentation',
        default='docs/output'
    )

    parser.add_argument(
        '--save-result',
        action='store_true',
        help='Save complete result to JSON file'
    )

    args = parser.parse_args()

    # Load configuration if provided
    config = {}
    if args.config:
        try:
            with open(args.config) as f:
                config = json.load(f)
            print(f"Loaded configuration from {args.config}")
        except Exception as e:
            print(f"Error loading config: {e}", file=sys.stderr)
            sys.exit(1)

    # Set output directory
    if 'documentor' not in config:
        config['documentor'] = {}
    config['documentor']['output_dir'] = args.output

    # Initialize and run Vision Cortex
    try:
        print("\n" + "=" * 80)
        print("VISION CORTEX RUNNER")
        print("=" * 80 + "\n")

        cortex = VisionCortex(config)
        result = cortex.run(args.signal)

        # Save result if requested
        if args.save_result:
            result_path = Path(args.output) / 'cortex_result.json'
            result_path.parent.mkdir(parents=True, exist_ok=True)
            with open(result_path, 'w') as f:
                json.dump(result, f, indent=2, default=str)
            print(f"\n✅ Result saved to: {result_path}")

        print("\n" + "=" * 80)
        print("EXECUTION SUMMARY")
        print("=" * 80)
        print(f"Status: {result.get('status')}")
        print(f"Workflow ID: {result.get('workflow_id')}")
        print(f"Completed Stages: {len(result.get('stages', {}))}")

        if result.get('final_output'):
            docs = result['final_output'].get('documents', [])
            print(f"Generated Documents: {len(docs)}")
            for doc in docs:
                print(f"  - {doc}")

        print("=" * 80 + "\n")

        sys.exit(0)

    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
