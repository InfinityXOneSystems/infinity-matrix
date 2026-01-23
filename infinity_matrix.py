"""
Infinity Matrix - Auto-Resolve and Auto-Merge System

This module provides the core functionality for automatically resolving
all systems and automatically merging their states.
"""

import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, dict, list

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SystemState(Enum):
    """Enumeration of possible system states."""
    UNRESOLVED = "unresolved"
    RESOLVING = "resolving"
    RESOLVED = "resolved"
    MERGED = "merged"
    ERROR = "error"


@dataclass
class System:
    """Represents a system in the infinity matrix."""
    id: str
    name: str
    state: SystemState = SystemState.UNRESOLVED
    data: dict[str, Any] = field(default_factory=dict)
    dependencies: list[str] = field(default_factory=list)

    def __repr__(self):
        return f"System(id={self.id}, name={self.name}, state={self.state.value})"


class SystemResolver:
    """Handles the resolution of system states."""

    def __init__(self):
        self.resolved_systems: dict[str, System] = {}
        logger.info("SystemResolver initialized")

    def resolve(self, system: System) -> System:
        """
        Resolve a single system.

        Args:
            system: The system to resolve

        Returns:
            The resolved system
        """
        logger.info(f"Resolving system: {system.id}")
        system.state = SystemState.RESOLVING

        try:
            # Check if dependencies are resolved
            for dep_id in system.dependencies:
                if dep_id not in self.resolved_systems:
                    logger.warning(f"Dependency {dep_id} not yet resolved for {system.id}")
                    raise ValueError(f"Unresolved dependency: {dep_id}")

            # Perform resolution logic
            system.state = SystemState.RESOLVED
            self.resolved_systems[system.id] = system
            logger.info(f"System {system.id} resolved successfully")

            return system
        except Exception as e:
            logger.error(f"Error resolving system {system.id}: {e}")
            system.state = SystemState.ERROR
            raise

    def resolve_all(self, systems: list[System]) -> list[System]:
        """
        Resolve all systems in the correct dependency order.

        Args:
            systems: list of systems to resolve

        Returns:
            list of resolved systems
        """
        logger.info(f"Starting resolution of {len(systems)} systems")

        # Sort systems by dependencies (topological sort)
        unresolved = systems.copy()
        resolved = []

        while unresolved:
            made_progress = False

            for system in unresolved[:]:
                # Check if all dependencies are resolved
                deps_resolved = all(
                    dep_id in self.resolved_systems
                    for dep_id in system.dependencies
                )

                if deps_resolved:
                    self.resolve(system)
                    resolved.append(system)
                    unresolved.remove(system)
                    made_progress = True

            if not made_progress and unresolved:
                # Circular dependency or missing dependency
                logger.error(f"Cannot resolve remaining systems: {[s.id for s in unresolved]}")
                raise ValueError("Circular dependency detected or missing dependencies")

        logger.info(f"All {len(resolved)} systems resolved successfully")
        return resolved


class AutoMerger:
    """Handles automatic merging of resolved systems."""

    def __init__(self):
        self.merged_data: dict[str, Any] = {}
        logger.info("AutoMerger initialized")

    def merge(self, systems: list[System]) -> dict[str, Any]:
        """
        Merge multiple resolved systems into a unified state.

        Args:
            systems: list of resolved systems to merge

        Returns:
            Dictionary containing merged data
        """
        logger.info(f"Starting merge of {len(systems)} systems")

        # Validate all systems are resolved
        for system in systems:
            if system.state != SystemState.RESOLVED:
                logger.error(f"Cannot merge unresolved system: {system.id}")
                raise ValueError(f"System {system.id} is not resolved")

        # Perform the merge
        merged_result = {
            "systems": {},
            "total_systems": len(systems),
            "timestamp": None
        }

        for system in systems:
            merged_result["systems"][system.id] = {
                "name": system.name,
                "state": system.state.value,
                "data": system.data
            }

            # Merge data into unified namespace
            for key, value in system.data.items():
                if key in self.merged_data:
                    # Conflict resolution: prefer newer data or aggregate
                    if isinstance(value, list) and isinstance(self.merged_data[key], list):
                        self.merged_data[key].extend(value)
                    else:
                        self.merged_data[key] = value
                else:
                    self.merged_data[key] = value

            # Update system state
            system.state = SystemState.MERGED

        merged_result["merged_data"] = self.merged_data.copy()

        logger.info(f"Successfully merged {len(systems)} systems")
        return merged_result


class InfinityMatrix:
    """
    Main class for the Infinity Matrix system.
    Coordinates auto-resolution and auto-merging of all systems.
    """

    def __init__(self):
        self.systems: list[System] = []
        self.resolver = SystemResolver()
        self.merger = AutoMerger()
        logger.info("InfinityMatrix initialized")

    def add_system(self, system: System) -> None:
        """
        Add a system to the matrix.

        Args:
            system: The system to add
        """
        self.systems.append(system)
        logger.info(f"Added system: {system.id}")

    def add_systems(self, systems: list[System]) -> None:
        """
        Add multiple systems to the matrix.

        Args:
            systems: list of systems to add
        """
        for system in systems:
            self.add_system(system)

    def auto_resolve_all(self) -> list[System]:
        """
        Automatically resolve all systems in the matrix.

        Returns:
            list of resolved systems
        """
        logger.info("Starting auto-resolution of all systems")
        return self.resolver.resolve_all(self.systems)

    def auto_merge(self) -> dict[str, Any]:
        """
        Automatically merge all resolved systems.

        Returns:
            Dictionary containing merged system data
        """
        logger.info("Starting auto-merge of all systems")

        # Ensure all systems are resolved
        resolved_systems = [s for s in self.systems if s.state == SystemState.RESOLVED]

        if len(resolved_systems) < len(self.systems):
            logger.warning(f"Only {len(resolved_systems)}/{len(self.systems)} systems are resolved")

        return self.merger.merge(resolved_systems)

    def run(self) -> dict[str, Any]:
        """
        Run the complete auto-resolve and auto-merge cycle.

        Returns:
            Dictionary containing the final merged state
        """
        logger.info("=" * 60)
        logger.info("Starting Infinity Matrix - Auto-Resolve and Auto-Merge")
        logger.info("=" * 60)

        # Step 1: Auto-resolve all systems
        self.auto_resolve_all()

        # Step 2: Auto-merge all resolved systems
        result = self.auto_merge()

        logger.info("=" * 60)
        logger.info("Infinity Matrix completed successfully")
        logger.info("=" * 60)

        return result


def create_sample_systems() -> list[System]:
    """
    Create sample systems for demonstration.

    Returns:
        list of sample systems
    """
    return [
        System(
            id="sys-001",
            name="Core System",
            data={"version": "1.0", "status": "active"}
        ),
        System(
            id="sys-002",
            name="Database System",
            data={"type": "postgresql", "connections": 10},
            dependencies=["sys-001"]
        ),
        System(
            id="sys-003",
            name="API System",
            data={"endpoints": ["/api/v1", "/api/v2"], "port": 8080},
            dependencies=["sys-001", "sys-002"]
        ),
        System(
            id="sys-004",
            name="Cache System",
            data={"type": "redis", "ttl": 3600},
            dependencies=["sys-001"]
        ),
        System(
            id="sys-005",
            name="Frontend System",
            data={"framework": "react", "version": "18.0"},
            dependencies=["sys-003", "sys-004"]
        )
    ]


if __name__ == "__main__":
    # Create and run the infinity matrix
    matrix = InfinityMatrix()

    # Add sample systems
    sample_systems = create_sample_systems()
    matrix.add_systems(sample_systems)

    # Run auto-resolve and auto-merge
    result = matrix.run()

    # Display results
    print("\n" + "=" * 60)
    print("FINAL MERGED STATE")
    print("=" * 60)
    print(f"Total systems: {result['total_systems']}")
    print("\nSystems merged:")
    for sys_id, sys_data in result['systems'].items():
        print(f"  - {sys_id}: {sys_data['name']} [{sys_data['state']}]")
    print(f"\nMerged data keys: {list(result['merged_data'].keys())}")
    print("=" * 60)
