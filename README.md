# Infinity Matrix

**Auto-Resolve and Auto-Merge System**

A powerful system designed to automatically resolve all systems and auto-merge their states in the correct dependency order.

## Overview

The Infinity Matrix is a framework for managing complex systems with dependencies. It automatically:

1. **Auto-Resolves**: Resolves all systems in the correct order based on their dependencies
2. **Auto-Merges**: Merges all resolved systems into a unified state

## Features

- ✅ **Automatic Resolution**: Intelligently resolves systems respecting dependencies
- ✅ **Dependency Management**: Handles complex dependency graphs with topological sorting
- ✅ **Auto Merge**: Seamlessly merges multiple resolved systems
- ✅ **Conflict Resolution**: Smart handling of data conflicts during merge
- ✅ **State Tracking**: Tracks system states through the resolution and merge lifecycle
- ✅ **CLI Interface**: Easy-to-use command-line interface
- ✅ **JSON Configuration**: Configure systems via JSON files
- ✅ **Comprehensive Logging**: Detailed logging for debugging and monitoring

## Installation

```bash
# Clone the repository
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix

# No additional dependencies required - uses Python standard library only
```

## Quick Start

### Using Sample Systems

```bash
# Run with built-in sample systems
python cli.py
```

### Using Custom Configuration

```bash
# Create your systems configuration
cp config.example.json my-systems.json

# Edit my-systems.json with your systems

# Run with custom configuration
python cli.py --config my-systems.json
```

### Save Results

```bash
# Save the merged result to a file
python cli.py --output result.json

# Or combine with custom config
python cli.py --config my-systems.json --output result.json
```

## Configuration Format

Systems are defined in JSON format:

```json
{
  "systems": [
    {
      "id": "sys-001",
      "name": "Core System",
      "data": {
        "version": "1.0",
        "status": "active"
      },
      "dependencies": []
    },
    {
      "id": "sys-002",
      "name": "Database System",
      "data": {
        "type": "postgresql",
        "connections": 10
      },
      "dependencies": ["sys-001"]
    }
  ]
}
```

### Configuration Fields

- **id** (required): Unique identifier for the system
- **name** (required): Human-readable name
- **data** (optional): Dictionary containing system-specific data
- **dependencies** (optional): List of system IDs that must be resolved first

## Usage as a Library

```python
from infinity_matrix import InfinityMatrix, System

# Create the matrix
matrix = InfinityMatrix()

# Add systems
system1 = System(id="sys-1", name="Core", data={"key": "value"})
system2 = System(id="sys-2", name="App", dependencies=["sys-1"])

matrix.add_systems([system1, system2])

# Run auto-resolve and auto-merge
result = matrix.run()

# Access results
print(f"Merged {result['total_systems']} systems")
print(f"Merged data: {result['merged_data']}")
```

## System States

Systems progress through the following states:

1. **UNRESOLVED**: Initial state
2. **RESOLVING**: Currently being resolved
3. **RESOLVED**: Successfully resolved
4. **MERGED**: Merged into unified state
5. **ERROR**: Error occurred during resolution

## Architecture

### Core Components

- **InfinityMatrix**: Main orchestrator for auto-resolve and auto-merge operations
- **SystemResolver**: Handles dependency resolution with topological sorting
- **AutoMerger**: Merges resolved systems with conflict resolution
- **System**: Data class representing individual systems
- **SystemState**: Enumeration of possible system states

### Resolution Algorithm

1. Parse all systems and their dependencies
2. Perform topological sort based on dependencies
3. Resolve systems in dependency order
4. Track resolved systems to validate dependencies
5. Handle circular dependencies and missing dependencies

### Merge Algorithm

1. Validate all systems are in RESOLVED state
2. Merge system data with conflict resolution
3. Aggregate list values, overwrite scalar values
4. Update all systems to MERGED state
5. Return unified merged state

## Command-Line Options

```
usage: cli.py [-h] [--config CONFIG] [--output OUTPUT] [--verbose]

Infinity Matrix - Auto-Resolve and Auto-Merge System

optional arguments:
  -h, --help            show this help message and exit
  --config CONFIG, -c CONFIG
                        Path to JSON configuration file with systems
  --output OUTPUT, -o OUTPUT
                        Path to save the merged result as JSON
  --verbose, -v         Enable verbose output
```

## Examples

### Example 1: Simple Systems

```python
from infinity_matrix import InfinityMatrix, System

matrix = InfinityMatrix()

systems = [
    System(id="db", name="Database", data={"host": "localhost"}),
    System(id="api", name="API", dependencies=["db"]),
]

matrix.add_systems(systems)
result = matrix.run()
```

### Example 2: Complex Dependencies

```bash
# Create config file with complex dependencies
cat > complex.json << EOF
{
  "systems": [
    {"id": "core", "name": "Core", "dependencies": []},
    {"id": "db", "name": "Database", "dependencies": ["core"]},
    {"id": "cache", "name": "Cache", "dependencies": ["core"]},
    {"id": "api", "name": "API", "dependencies": ["db", "cache"]},
    {"id": "web", "name": "Web", "dependencies": ["api"]}
  ]
}
EOF

# Run
python cli.py --config complex.json --output result.json
```

## Error Handling

The system handles various error conditions:

- **Missing Dependencies**: Raises ValueError if a dependency is not found
- **Circular Dependencies**: Detects and raises ValueError for circular dependencies
- **Unresolved Systems**: Cannot merge systems that aren't resolved
- **Invalid Configuration**: Validates JSON structure and required fields

## Logging

The system provides comprehensive logging:

```
2025-12-31 10:00:00 - infinity_matrix - INFO - InfinityMatrix initialized
2025-12-31 10:00:01 - infinity_matrix - INFO - Added system: sys-001
2025-12-31 10:00:02 - infinity_matrix - INFO - Starting auto-resolution of all systems
2025-12-31 10:00:03 - infinity_matrix - INFO - All 5 systems resolved successfully
2025-12-31 10:00:04 - infinity_matrix - INFO - Successfully merged 5 systems
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please visit:
https://github.com/InfinityXOneSystems/infinity-matrix
