"""Code generation utilities."""

from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, Template


class CodeGenerator:
    """
    Code generator using templates.

    Generates code, configuration files, and documentation using
    Jinja2 templates.
    """

    def __init__(self, templates_dir: Path):
        """
        Initialize code generator.

        Args:
            templates_dir: Directory containing templates
        """
        self.templates_dir = templates_dir
        self.env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def generate_from_template(
        self,
        template_name: str,
        context: dict[str, Any],
    ) -> str:
        """
        Generate code from a template.

        Args:
            template_name: Name of the template file
            context: Context variables for the template

        Returns:
            Generated code as string
        """
        template = self.env.get_template(template_name)
        return template.render(**context)

    def generate_from_string(
        self,
        template_string: str,
        context: dict[str, Any],
    ) -> str:
        """
        Generate code from a template string.

        Args:
            template_string: Template as string
            context: Context variables for the template

        Returns:
            Generated code as string
        """
        template = Template(template_string)
        return template.render(**context)

    def generate_python_module(
        self,
        module_name: str,
        classes: list[dict[str, Any]],
        functions: list[dict[str, Any]],
        imports: list[str],
    ) -> str:
        """
        Generate a Python module.

        Args:
            module_name: Name of the module
            classes: list of class definitions
            functions: list of function definitions
            imports: list of import statements

        Returns:
            Generated Python code
        """
        template = """\"\"\"{{ module_name }} module.\"\"\"

{% for import_stmt in imports %}
{{ import_stmt }}
{% endfor %}

{% for cls in classes %}

class {{ cls.name }}:
    \"\"\"{{ cls.docstring }}\"\"\"

    def __init__(self{% if cls.init_params %}, {{ cls.init_params }}{% endif %}):
        \"\"\"Initialize {{ cls.name }}.\"\"\"
        pass
{% for method in cls.methods %}

    def {{ method.name }}(self{% if method.params %}, {{ method.params }}{% endif %}):
        \"\"\"{{ method.docstring }}\"\"\"
        pass
{% endfor %}
{% endfor %}

{% for func in functions %}

def {{ func.name }}({{ func.params }}):
    \"\"\"{{ func.docstring }}\"\"\"
    pass
{% endfor %}
"""
        return self.generate_from_string(
            template,
            {
                "module_name": module_name,
                "classes": classes,
                "functions": functions,
                "imports": imports,
            },
        )

    def generate_api_endpoint(
        self,
        path: str,
        method: str,
        function_name: str,
        params: list[dict[str, Any]],
        response_model: str,
    ) -> str:
        """
        Generate a FastAPI endpoint.

        Args:
            path: API path
            method: HTTP method
            function_name: Function name
            params: list of parameters
            response_model: Response model name

        Returns:
            Generated endpoint code
        """
        template = """
@app.{{ method }}("{{ path }}", response_model={{ response_model }})
async def {{ function_name }}(
    {% for param in params %}
    {{ param.name }}: {{ param.type }}{% if not loop.last %},{% endif %}
    {% endfor %}
):
    \"\"\"{{ function_name }} endpoint.\"\"\"
    # TODO: Implement endpoint logic
    pass
"""
        return self.generate_from_string(
            template,
            {
                "path": path,
                "method": method.lower(),
                "function_name": function_name,
                "params": params,
                "response_model": response_model,
            },
        )

    def generate_test_file(
        self,
        module_name: str,
        test_cases: list[dict[str, Any]],
    ) -> str:
        """
        Generate a test file.

        Args:
            module_name: Module being tested
            test_cases: list of test cases

        Returns:
            Generated test code
        """
        template = """\"\"\"Tests for {{ module_name }}.\"\"\"

import pytest
from {{ module_name }} import *


{% for test in test_cases %}
def test_{{ test.name }}():
    \"\"\"{{ test.description }}\"\"\"
    # TODO: Implement test
    pass

{% endfor %}
"""
        return self.generate_from_string(
            template,
            {
                "module_name": module_name,
                "test_cases": test_cases,
            },
        )
