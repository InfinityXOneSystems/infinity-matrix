"""Universal Builder for creating applications from templates."""

import shutil
from pathlib import Path
from typing import Any, dict

from jinja2 import Environment, FileSystemLoader

from infinity_matrix.core.config import Config


class UniversalBuilder:
    """Universal builder for creating applications from templates."""

    def __init__(self, config: Config):
        self.config = config
        self.template_dirs = [
            Path(__file__).parent.parent.parent / "templates",
            config.templates.get_template_dir(),
        ]
        self.template_dirs.extend(config.templates.get_custom_templates())

    def build(
        self,
        template: str | None = None,
        params: dict[str, Any] | None = None,
        output_dir: str = ".",
        prompt: str | None = None,
    ) -> dict[str, Any]:
        """
        Build an application from a template.

        Args:
            template: Template name to use
            params: Parameters for template rendering
            output_dir: Output directory for generated application
            prompt: Original user prompt (for documentation)

        Returns:
            dict with success status and details
        """
        params = params or {}

        # Find template
        template_path = self._find_template(template)
        if not template_path:
            return {
                "success": False,
                "error": f"Template '{template}' not found"
            }

        # Prepare output directory
        output_path = Path(output_dir).resolve()
        app_name = params.get("app_name", "my-app")
        app_path = output_path / app_name

        if app_path.exists():
            return {
                "success": False,
                "error": f"Directory '{app_path}' already exists"
            }

        # Create application from template
        try:
            self._render_template(template_path, app_path, params)

            # Generate documentation
            self._generate_docs(app_path, template, prompt, params)

            return {
                "success": True,
                "output_path": str(app_path),
                "template": template,
                "next_steps": self._get_next_steps(template, app_path)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    def _find_template(self, template_name: str | None) -> Path | None:
        """Find template directory by name."""
        if not template_name:
            return None

        for template_dir in self.template_dirs:
            template_path = template_dir / template_name
            if template_path.exists() and template_path.is_dir():
                return template_path

        return None

    def _render_template(
        self,
        template_path: Path,
        output_path: Path,
        params: dict[str, Any]
    ) -> None:
        """Render template to output directory."""
        output_path.mkdir(parents=True, exist_ok=True)

        # Set up Jinja2 environment
        env = Environment(loader=FileSystemLoader(str(template_path)))

        # Copy template files, rendering Jinja2 templates
        for item in template_path.rglob("*"):
            if item.is_file():
                rel_path = item.relative_to(template_path)
                output_file = output_path / rel_path

                # Create parent directories
                output_file.parent.mkdir(parents=True, exist_ok=True)

                # Render if it's a template file
                if item.suffix in [".j2", ".jinja", ".jinja2"]:
                    template = env.get_template(str(rel_path))
                    content = template.render(**params)

                    # Remove template extension
                    output_file = output_file.with_suffix("")
                    output_file.write_text(content)
                else:
                    # Copy as-is
                    shutil.copy2(item, output_file)

    def _generate_docs(
        self,
        app_path: Path,
        template: str,
        prompt: str | None,
        params: dict[str, Any]
    ) -> None:
        """Generate documentation for the created application."""
        readme_path = app_path / "README.md"

        if readme_path.exists():
            # Append to existing README
            with open(readme_path, "a") as f:
                f.write("\n\n## Generated Information\n\n")
                f.write(f"- **Template**: {template}\n")
                if prompt:
                    f.write(f"- **Original Prompt**: {prompt}\n")
                f.write(f"- **Parameters**: {params}\n")
        else:
            # Create new README
            with open(readme_path, "w") as f:
                f.write(f"# {params.get('app_name', 'Application')}\n\n")
                if prompt:
                    f.write(f"**Description**: {prompt}\n\n")
                f.write(f"Generated using Infinity Matrix template: `{template}`\n\n")
                f.write("## Getting Started\n\n")
                f.write("See below for setup instructions.\n")

    def _get_next_steps(self, template: str, app_path: Path) -> list:
        """Get next steps for the user."""
        steps = [
            f"cd {app_path.name}",
            "Review the generated code and configuration",
        ]

        # Template-specific steps
        if "python" in template:
            steps.extend([
                "pip install -r requirements.txt",
                "python main.py"
            ])
        elif "node" in template:
            steps.extend([
                "npm install",
                "npm start"
            ])
        elif "go" in template:
            steps.extend([
                "go mod download",
                "go run main.go"
            ])

        steps.append("Read the README.md for more details")

        return steps
