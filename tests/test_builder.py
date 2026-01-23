"""Tests for UniversalBuilder."""

from pathlib import Path

import pytest

from infinity_matrix.core.config import Config
from infinity_matrix.core.engine.builder import UniversalBuilder


@pytest.fixture
def builder(tmp_path):
    """Create UniversalBuilder instance for testing."""
    config = Config()
    # Override template directory for testing
    config.templates.template_dir = tmp_path / "templates"
    return UniversalBuilder(config)


@pytest.fixture
def sample_template(tmp_path):
    """Create a sample template for testing."""
    template_dir = tmp_path / "templates" / "test-template"
    template_dir.mkdir(parents=True)

    # Create template.yaml
    (template_dir / "template.yaml").write_text("""
name: test-template
description: Test template
category: test
language: python
version: 1.0.0
""")

    # Create a template file
    (template_dir / "README.md.j2").write_text("# {{ app_name }}\n")
    (template_dir / "main.py.j2").write_text('print("Hello {{ app_name }}")\n')

    return template_dir


def test_find_template(builder, sample_template):
    """Test finding a template."""
    builder.config.templates.template_dir = sample_template.parent
    template_path = builder._find_template("test-template")

    assert template_path is not None
    assert template_path.name == "test-template"


def test_build_application(builder, sample_template, tmp_path):
    """Test building an application from template."""
    builder.config.templates.template_dir = sample_template.parent

    result = builder.build(
        template="test-template",
        params={"app_name": "my-test-app"},
        output_dir=str(tmp_path / "output")
    )

    assert result["success"] is True
    assert "output_path" in result

    output_path = Path(result["output_path"])
    assert output_path.exists()
    assert (output_path / "README.md").exists()
    assert (output_path / "main.py").exists()


def test_build_with_jinja2_rendering(builder, sample_template, tmp_path):
    """Test that Jinja2 templates are properly rendered."""
    builder.config.templates.template_dir = sample_template.parent

    result = builder.build(
        template="test-template",
        params={"app_name": "my-test-app"},
        output_dir=str(tmp_path / "output")
    )

    output_path = Path(result["output_path"])
    readme_content = (output_path / "README.md").read_text()
    main_content = (output_path / "main.py").read_text()

    assert "my-test-app" in readme_content
    assert "my-test-app" in main_content


def test_build_nonexistent_template(builder):
    """Test building with non-existent template."""
    result = builder.build(
        template="nonexistent-template",
        params={},
        output_dir="."
    )

    assert result["success"] is False
    assert "not found" in result["error"]
