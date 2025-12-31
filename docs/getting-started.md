# Getting Started with Infinity Matrix

This guide will help you get started with Infinity Matrix, the AI-powered universal application builder.

## Installation

### Using pip

```bash
pip install infinity-matrix
```

### From source

```bash
git clone https://github.com/InfinityXOneSystems/infinity-matrix.git
cd infinity-matrix
pip install -e .
```

## Initial Setup

1. Initialize Infinity Matrix:

```bash
infinity-matrix init
```

This creates the configuration directory at `~/.infinity-matrix/` with:
- `config.yaml` - Main configuration file
- `templates/` - Custom templates directory
- `.secrets` - Encrypted secrets storage

2. (Optional) Configure AI providers:

Edit `~/.infinity-matrix/config.yaml`:

```yaml
ai:
  provider: openai  # or anthropic, etc.
  model: gpt-4
  api_key: your-api-key  # or set OPENAI_API_KEY env var
```

## Creating Your First Application

### Using Natural Language Prompts

The easiest way to create an application is with a natural language description:

```bash
infinity-matrix create "Build a REST API for managing tasks with user authentication and PostgreSQL database"
```

Infinity Matrix will:
1. Analyze your prompt using AI Vision Cortex
2. Select the best template and modules
3. Generate a complete, working application
4. Provide next steps for running your app

### Using Templates

List available templates:

```bash
infinity-matrix templates list
```

Create from a specific template:

```bash
infinity-matrix create --template python-fastapi-starter \
  --param app_name=my-api \
  --param include_auth=true \
  --param database=postgresql
```

### Interactive Mode

For a guided experience:

```bash
infinity-matrix create --interactive
```

## Exploring Generated Applications

After creation, you'll find:

```
my-api/
├── README.md           # Getting started guide
├── requirements.txt    # Dependencies
├── main.py            # Application entry point
├── .env.example       # Environment variables
├── docker-compose.yml # Docker configuration
└── ...
```

## Running Your Application

### Python/FastAPI Applications

```bash
cd my-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Node.js Applications

```bash
cd my-app
npm install
npm start
```

### Using Docker

```bash
cd my-app
docker-compose up
```

## Agent Features

### Enable Auto-Healing

```bash
infinity-matrix monitor --auto-heal
```

### Schedule Automated Tasks

```bash
infinity-matrix schedule --task "update dependencies" --cron "0 0 * * 0"
```

### Enable Code Review Agent

```bash
infinity-matrix agent enable --type code-review
```

## Next Steps

- [Template Development](templates.md) - Create custom templates
- [AI Vision Cortex](ai-vision.md) - Understand AI-powered features
- [Agent Framework](agents.md) - Work with autonomous agents
- [Security Best Practices](security.md) - Secure your applications
- [API Reference](api-reference.md) - Complete API documentation

## Examples

Check out the [examples](../examples/) directory for:
- E-commerce platform
- SaaS starter kit
- Microservices architecture
- ML model serving
- And more!

## Getting Help

- [Documentation](https://docs.infinityxone.systems)
- [Community Forum](https://community.infinityxone.systems)
- [GitHub Issues](https://github.com/InfinityXOneSystems/infinity-matrix/issues)

## Tips

1. **Start Simple**: Begin with basic templates and add features incrementally
2. **Use AI Features**: Let the Vision Cortex analyze your requirements
3. **Leverage Agents**: Enable agents for automated maintenance and improvements
4. **Customize Templates**: Create templates for your common patterns
5. **Explore Examples**: Learn from example applications in the repo
