"""
Unit tests for the Infinity Matrix Auto-Resolve and Auto-Merge System.
"""

import json
import os
import tempfile
import unittest

from infinity_matrix import (
    AutoMerger,
    InfinityMatrix,
    System,
    SystemResolver,
    SystemState,
    create_sample_systems,
)


class TestSystem(unittest.TestCase):
    """Test cases for the System class."""

    def test_system_creation(self):
        """Test basic system creation."""
        system = System(id="test-1", name="Test System")
        self.assertEqual(system.id, "test-1")
        self.assertEqual(system.name, "Test System")
        self.assertEqual(system.state, SystemState.UNRESOLVED)
        self.assertEqual(system.data, {})
        self.assertEqual(system.dependencies, [])

    def test_system_with_data(self):
        """Test system creation with data."""
        data = {"key": "value", "count": 42}
        system = System(id="test-2", name="Test System 2", data=data)
        self.assertEqual(system.data, data)

    def test_system_with_dependencies(self):
        """Test system creation with dependencies."""
        deps = ["sys-1", "sys-2"]
        system = System(id="test-3", name="Test System 3", dependencies=deps)
        self.assertEqual(system.dependencies, deps)


class TestSystemResolver(unittest.TestCase):
    """Test cases for the SystemResolver class."""

    def setUp(self):
        """Set up test fixtures."""
        self.resolver = SystemResolver()

    def test_resolve_single_system(self):
        """Test resolving a single system with no dependencies."""
        system = System(id="sys-1", name="System 1")
        resolved = self.resolver.resolve(system)

        self.assertEqual(resolved.state, SystemState.RESOLVED)
        self.assertIn("sys-1", self.resolver.resolved_systems)

    def test_resolve_with_dependency(self):
        """Test resolving a system with dependencies."""
        sys1 = System(id="sys-1", name="System 1")
        sys2 = System(id="sys-2", name="System 2", dependencies=["sys-1"])

        self.resolver.resolve(sys1)
        self.resolver.resolve(sys2)

        self.assertEqual(sys2.state, SystemState.RESOLVED)

    def test_resolve_missing_dependency(self):
        """Test that resolving with missing dependency raises error."""
        system = System(id="sys-1", name="System 1", dependencies=["missing"])

        with self.assertRaises(ValueError):
            self.resolver.resolve(system)

    def test_resolve_all_simple(self):
        """Test resolving multiple systems without dependencies."""
        systems = [
            System(id=f"sys-{i}", name=f"System {i}")
            for i in range(3)
        ]

        resolved = self.resolver.resolve_all(systems)

        self.assertEqual(len(resolved), 3)
        for system in resolved:
            self.assertEqual(system.state, SystemState.RESOLVED)

    def test_resolve_all_with_dependencies(self):
        """Test resolving multiple systems with dependencies."""
        systems = [
            System(id="sys-1", name="System 1"),
            System(id="sys-2", name="System 2", dependencies=["sys-1"]),
            System(id="sys-3", name="System 3", dependencies=["sys-1", "sys-2"]),
        ]

        resolved = self.resolver.resolve_all(systems)

        self.assertEqual(len(resolved), 3)
        # Verify they're resolved in dependency order
        self.assertEqual(resolved[0].id, "sys-1")
        self.assertEqual(resolved[1].id, "sys-2")
        self.assertEqual(resolved[2].id, "sys-3")

    def test_circular_dependency_detection(self):
        """Test that circular dependencies are detected."""
        systems = [
            System(id="sys-1", name="System 1", dependencies=["sys-2"]),
            System(id="sys-2", name="System 2", dependencies=["sys-1"]),
        ]

        with self.assertRaises(ValueError) as context:
            self.resolver.resolve_all(systems)

        self.assertIn("Circular dependency", str(context.exception))


class TestAutoMerger(unittest.TestCase):
    """Test cases for the AutoMerger class."""

    def setUp(self):
        """Set up test fixtures."""
        self.merger = AutoMerger()

    def test_merge_single_system(self):
        """Test merging a single resolved system."""
        system = System(id="sys-1", name="System 1", data={"key": "value"})
        system.state = SystemState.RESOLVED

        result = self.merger.merge([system])

        self.assertEqual(result["total_systems"], 1)
        self.assertIn("sys-1", result["systems"])
        self.assertEqual(result["merged_data"]["key"], "value")
        self.assertEqual(system.state, SystemState.MERGED)

    def test_merge_multiple_systems(self):
        """Test merging multiple resolved systems."""
        systems = [
            System(id="sys-1", name="System 1", data={"a": 1}),
            System(id="sys-2", name="System 2", data={"b": 2}),
            System(id="sys-3", name="System 3", data={"c": 3}),
        ]

        for system in systems:
            system.state = SystemState.RESOLVED

        result = self.merger.merge(systems)

        self.assertEqual(result["total_systems"], 3)
        self.assertEqual(result["merged_data"]["a"], 1)
        self.assertEqual(result["merged_data"]["b"], 2)
        self.assertEqual(result["merged_data"]["c"], 3)

    def test_merge_with_list_aggregation(self):
        """Test that lists are aggregated during merge."""
        systems = [
            System(id="sys-1", name="System 1", data={"items": [1, 2]}),
            System(id="sys-2", name="System 2", data={"items": [3, 4]}),
        ]

        for system in systems:
            system.state = SystemState.RESOLVED

        result = self.merger.merge(systems)

        self.assertEqual(result["merged_data"]["items"], [1, 2, 3, 4])

    def test_merge_unresolved_system_fails(self):
        """Test that merging unresolved systems raises error."""
        system = System(id="sys-1", name="System 1")
        system.state = SystemState.UNRESOLVED

        with self.assertRaises(ValueError) as context:
            self.merger.merge([system])

        self.assertIn("not resolved", str(context.exception))


class TestInfinityMatrix(unittest.TestCase):
    """Test cases for the InfinityMatrix class."""

    def setUp(self):
        """Set up test fixtures."""
        self.matrix = InfinityMatrix()

    def test_matrix_initialization(self):
        """Test that matrix initializes correctly."""
        self.assertEqual(len(self.matrix.systems), 0)
        self.assertIsInstance(self.matrix.resolver, SystemResolver)
        self.assertIsInstance(self.matrix.merger, AutoMerger)

    def test_add_system(self):
        """Test adding a single system."""
        system = System(id="sys-1", name="System 1")
        self.matrix.add_system(system)

        self.assertEqual(len(self.matrix.systems), 1)
        self.assertEqual(self.matrix.systems[0], system)

    def test_add_systems(self):
        """Test adding multiple systems."""
        systems = [
            System(id="sys-1", name="System 1"),
            System(id="sys-2", name="System 2"),
        ]
        self.matrix.add_systems(systems)

        self.assertEqual(len(self.matrix.systems), 2)

    def test_auto_resolve_all(self):
        """Test auto-resolving all systems."""
        systems = [
            System(id="sys-1", name="System 1"),
            System(id="sys-2", name="System 2", dependencies=["sys-1"]),
        ]
        self.matrix.add_systems(systems)

        resolved = self.matrix.auto_resolve_all()

        self.assertEqual(len(resolved), 2)
        for system in resolved:
            self.assertEqual(system.state, SystemState.RESOLVED)

    def test_auto_merge(self):
        """Test auto-merging resolved systems."""
        systems = [
            System(id="sys-1", name="System 1", data={"a": 1}),
            System(id="sys-2", name="System 2", data={"b": 2}),
        ]
        self.matrix.add_systems(systems)

        # Resolve first
        self.matrix.auto_resolve_all()

        # Then merge
        result = self.matrix.auto_merge()

        self.assertEqual(result["total_systems"], 2)
        self.assertIn("a", result["merged_data"])
        self.assertIn("b", result["merged_data"])

    def test_run_complete_cycle(self):
        """Test running the complete resolve and merge cycle."""
        systems = [
            System(id="sys-1", name="System 1", data={"x": 10}),
            System(id="sys-2", name="System 2", data={"y": 20}, dependencies=["sys-1"]),
        ]
        self.matrix.add_systems(systems)

        result = self.matrix.run()

        self.assertEqual(result["total_systems"], 2)
        self.assertEqual(result["merged_data"]["x"], 10)
        self.assertEqual(result["merged_data"]["y"], 20)

        # Verify all systems are merged
        for system in self.matrix.systems:
            self.assertEqual(system.state, SystemState.MERGED)


class TestSampleSystems(unittest.TestCase):
    """Test cases for sample systems creation."""

    def test_create_sample_systems(self):
        """Test that sample systems are created correctly."""
        systems = create_sample_systems()

        self.assertEqual(len(systems), 5)
        self.assertEqual(systems[0].id, "sys-001")
        self.assertEqual(systems[0].dependencies, [])

    def test_sample_systems_dependencies(self):
        """Test that sample systems have correct dependencies."""
        systems = create_sample_systems()

        # sys-002 depends on sys-001
        self.assertIn("sys-001", systems[1].dependencies)

        # sys-003 depends on sys-001 and sys-002
        self.assertIn("sys-001", systems[2].dependencies)
        self.assertIn("sys-002", systems[2].dependencies)

        # sys-005 depends on sys-003 and sys-004
        self.assertIn("sys-003", systems[4].dependencies)
        self.assertIn("sys-004", systems[4].dependencies)

    def test_sample_systems_can_be_resolved(self):
        """Test that sample systems can be successfully resolved and merged."""
        matrix = InfinityMatrix()
        systems = create_sample_systems()
        matrix.add_systems(systems)

        result = matrix.run()

        self.assertEqual(result["total_systems"], 5)
        for system in matrix.systems:
            self.assertEqual(system.state, SystemState.MERGED)


class TestCLIIntegration(unittest.TestCase):
    """Integration tests for CLI functionality."""

    def test_config_file_loading(self):
        """Test loading systems from a configuration file."""
        config_data = {
            "systems": [
                {
                    "id": "test-1",
                    "name": "Test System 1",
                    "data": {"key": "value"},
                    "dependencies": []
                },
                {
                    "id": "test-2",
                    "name": "Test System 2",
                    "data": {},
                    "dependencies": ["test-1"]
                }
            ]
        }

        # Create temporary config file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(config_data, f)
            config_file = f.name

        try:
            # Load systems from file
            from cli import load_systems_from_file
            systems = load_systems_from_file(config_file)

            self.assertEqual(len(systems), 2)
            self.assertEqual(systems[0].id, "test-1")
            self.assertEqual(systems[0].data["key"], "value")
            self.assertEqual(systems[1].dependencies, ["test-1"])
        finally:
            os.unlink(config_file)

    def test_result_saving(self):
        """Test saving results to a file."""
        result = {
            "systems": {"sys-1": {"name": "Test"}},
            "total_systems": 1,
            "merged_data": {"key": "value"}
        }

        # Create temporary output file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            output_file = f.name

        try:
            from cli import save_result
            save_result(result, output_file)

            # Verify file was created and contains correct data
            with open(output_file) as f:
                loaded_result = json.load(f)

            self.assertEqual(loaded_result["total_systems"], 1)
            self.assertEqual(loaded_result["merged_data"]["key"], "value")
        finally:
            os.unlink(output_file)


if __name__ == "__main__":
    unittest.main()
