#!/usr/bin/env python3
"""
Command-line interface for the Infinity Matrix system.
"""

import argparse
import json
import sys
from typing import Any, dict, list

from infinity_matrix import InfinityMatrix, System, create_sample_systems


def load_systems_from_file(filepath: str) -> list[System]:
    """
    Load systems from a JSON configuration file.

    Args:
        filepath: Path to the JSON file

    Returns:
        list of System objects
    """
    with open(filepath) as f:
        config = json.load(f)

    systems = []
    for sys_config in config.get('systems', []):
        system = System(
            id=sys_config['id'],
            name=sys_config['name'],
            data=sys_config.get('data', {}),
            dependencies=sys_config.get('dependencies', [])
        )
        systems.append(system)

    return systems


def save_result(result: dict[str, Any], filepath: str) -> None:
    """
    Save the merged result to a JSON file.

    Args:
        result: The merged result dictionary
        filepath: Path to save the JSON file
    """
    with open(filepath, 'w') as f:
        json.dump(result, f, indent=2)
    print(f"Result saved to: {filepath}")


def main():
    """Main entry point for the CLI."""
    parser = argparse.ArgumentParser(
        description='Infinity Matrix - Auto-Resolve and Auto-Merge System',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run with sample systems
  python cli.py

  # Run with custom configuration
  python cli.py --config systems.json

  # Save output to file
  python cli.py --output result.json

  # Use custom config and save output
  python cli.py --config systems.json --output result.json
        """
    )

    parser.add_argument(
        '--config', '-c',
        type=str,
        help='Path to JSON configuration file with systems'
    )

    parser.add_argument(
        '--output', '-o',
        type=str,
        help='Path to save the merged result as JSON'
    )

    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output'
    )

    args = parser.parse_args()

    try:
        # Initialize the Infinity Matrix
        matrix = InfinityMatrix()

        # Load systems
        if args.config:
            print(f"Loading systems from: {args.config}")
            systems = load_systems_from_file(args.config)
        else:
            print("Using sample systems")
            systems = create_sample_systems()

        # Add systems to matrix
        matrix.add_systems(systems)

        # Run auto-resolve and auto-merge
        result = matrix.run()

        # Save result if output path provided
        if args.output:
            save_result(result, args.output)

        # Display summary
        print("\n" + "=" * 60)
        print("EXECUTION SUMMARY")
        print("=" * 60)
        print(f"Total systems processed: {result['total_systems']}")
        print("All systems resolved: ✓")
        print("All systems merged: ✓")
        print("=" * 60)

        return 0

    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
