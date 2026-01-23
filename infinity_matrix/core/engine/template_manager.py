"""Template manager for listing and managing templates."""

from pathlib import Path
from typing import Any, dict, list

import yaml

from infinity_matrix.core.config import Config


class TemplateManager:
    """Manager for templates."""

    def __init__(self, config: Config):
        self.config = config
        self.template_dirs = [
            Path(__file__).parent.parent.parent / "templates",
            config.templates.get_template_dir(),
        ]
        self.template_dirs.extend(config.templates.get_custom_templates())

    def list_templates(self) -> dict[str, list[dict[str, Any]]]:
        """
        list all available templates grouped by category.

        Returns:
            dict mapping category to list of template info
        """
        templates: dict[str, list[dict[str, Any]]] = {}

        for template_dir in self.template_dirs:
            if not template_dir.exists():
                continue

            # Scan for templates
            for item in template_dir.iterdir():
                if item.is_dir() and not item.name.startswith("."):
                    template_info = self._load_template_info(item)
                    category = template_info.get("category", "other")

                    if category not in templates:
                        templates[category] = []

                    templates[category].append(template_info)

        return templates

    def _load_template_info(self, template_path: Path) -> dict[str, Any]:
        """Load template information from metadata file."""
        metadata_file = template_path / "template.yaml"

        if metadata_file.exists():
            with open(metadata_file) as f:
                metadata = yaml.safe_load(f)
                return {
                    "name": template_path.name,
                    "description": metadata.get("description", "No description"),
                    "category": metadata.get("category", "other"),
                    "language": metadata.get("language", "unknown"),
                    "modules": metadata.get("modules", []),
                }

        # Infer from name if no metadata
        name = template_path.name
        category = "other"
        language = "unknown"

        if name.startswith("python-"):
            category = "python"
            language = "python"
        elif name.startswith("node-"):
            category = "node"
            language = "javascript"
        elif name.startswith("go-"):
            category = "go"
            language = "go"

        return {
            "name": name,
            "description": f"Template: {name}",
            "category": category,
            "language": language,
            "modules": [],
        }

    def get_template_info(self, template_name: str) -> dict[str, Any] | None:
        """Get information about a specific template."""
        for template_dir in self.template_dirs:
            template_path = template_dir / template_name
            if template_path.exists():
                return self._load_template_info(template_path)

        return None
