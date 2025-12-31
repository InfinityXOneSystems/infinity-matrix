# Template Development Guide

Learn how to create custom templates for Infinity Matrix.

## Template Structure

A template is a directory containing:

```
template-name/
├── template.yaml       # Template metadata and configuration
├── README.md.j2        # Template for README (Jinja2)
├── main.py.j2          # Template for main file (Jinja2)
├── requirements.txt.j2 # Template for dependencies (Jinja2)
└── ...                 # Other template files
```

## Template Metadata (template.yaml)

```yaml
name: my-template
description: A brief description of the template
category: python  # python, node, go, rust, java, etc.
language: python
version: 1.0.0

modules:
  - api
  - database
  - auth

parameters:
  - name: app_name
    type: string
    default: my-app
    description: Application name
  
  - name: include_auth
    type: boolean
    default: true
    description: Include authentication module
  
  - name: database
    type: choice
    choices: [postgresql, mysql, sqlite]
    default: postgresql
    description: Database to use

features:
  - Feature 1
  - Feature 2

requirements:
  python: ">=3.9"

stack:
  - Framework 1
  - Library 2
```

## Using Jinja2 Templates

Template files use Jinja2 syntax for dynamic content:

### Variables

```jinja2
# {{ app_name }}

Application: {{ app_name }}
Database: {{ database }}
```

### Conditionals

```jinja2
{% if include_auth %}
from auth import AuthModule
{% endif %}

{% if database == "postgresql" %}
DATABASE_URL = "postgresql://..."
{% elif database == "mysql" %}
DATABASE_URL = "mysql://..."
{% endif %}
```

### Loops

```jinja2
dependencies = [
{% for dep in dependencies %}
    "{{ dep }}",
{% endfor %}
]
```

## Parameter Types

### String

```yaml
- name: app_name
  type: string
  default: my-app
  description: Application name
```

### Boolean

```yaml
- name: include_feature
  type: boolean
  default: true
  description: Include this feature
```

### Choice

```yaml
- name: database
  type: choice
  choices: [postgresql, mysql, sqlite]
  default: postgresql
  description: Database to use
```

### Number

```yaml
- name: port
  type: number
  default: 8000
  description: Server port
```

## File Extensions

- `.j2` - Jinja2 template (extension removed after rendering)
- `.jinja` - Alternative Jinja2 extension
- `.jinja2` - Alternative Jinja2 extension
- Other files are copied as-is

## Best Practices

1. **Parameterize Everything**: Make templates flexible with parameters
2. **Use Sensible Defaults**: Provide good default values
3. **Document Well**: Include comprehensive README
4. **Follow Conventions**: Match language/framework standards
5. **Test Templates**: Create and test generated apps
6. **Modular Design**: Support optional modules
7. **Security First**: Include security best practices by default

## Example: Python FastAPI Template

### template.yaml

```yaml
name: python-fastapi-api
description: FastAPI REST API with database
category: python
language: python
version: 1.0.0

modules:
  - api
  - database

parameters:
  - name: app_name
    type: string
    default: my-api
  - name: database
    type: choice
    choices: [postgresql, mysql, sqlite]
    default: postgresql
```

### main.py.j2

```python
from fastapi import FastAPI

app = FastAPI(title="{{ app_name }}")

@app.get("/")
async def root():
    return {"message": "Hello from {{ app_name }}"}

{% if database %}
# Database configuration for {{ database }}
DATABASE_URL = "{{ database }}://..."
{% endif %}
```

## Template Location

Templates can be stored in:

1. **Built-in**: `infinity_matrix/templates/`
2. **User**: `~/.infinity-matrix/templates/`
3. **Custom**: Specified in config.yaml

## Publishing Templates

Share your templates with the community:

1. Create a repository with your template
2. Add `infinity-matrix-template` topic
3. Submit to the template registry

## Testing Templates

```bash
# Test template creation
infinity-matrix create --template my-template --output /tmp/test-app

# Verify the generated application
cd /tmp/test-app
# Run application-specific tests
```

## Advanced Features

### Multi-File Templates

Organize complex templates with subdirectories:

```
template-name/
├── template.yaml
├── src/
│   ├── main.py.j2
│   └── config.py.j2
├── tests/
│   └── test_main.py.j2
└── docs/
    └── README.md.j2
```

### Dynamic File Names

Use parameters in file paths:

```
{{ app_name }}/
├── {{ app_name }}.py.j2
└── test_{{ app_name }}.py.j2
```

### Includes and Macros

Reuse template snippets:

```jinja2
{% include "common/header.j2" %}

{% macro render_config(name, value) %}
{{ name }} = "{{ value }}"
{% endmacro %}
```

## See Also

- [Getting Started](getting-started.md)
- [AI Vision Cortex](ai-vision.md)
- [Examples](../examples/)
