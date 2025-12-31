.PHONY: help install test lint format clean run docker-build docker-up docker-down deploy-staging deploy-prod

help:
	@echo "Infinity-Matrix Makefile Commands:"
	@echo ""
	@echo "  install          Install dependencies"
	@echo "  test             Run tests"
	@echo "  lint             Run linters"
	@echo "  format           Format code"
	@echo "  clean            Clean build artifacts"
	@echo "  run              Run Vision Cortex"
	@echo "  api              Run API server"
	@echo "  audit            Run system audit"
	@echo "  docker-build     Build Docker images"
	@echo "  docker-up        Start Docker containers"
	@echo "  docker-down      Stop Docker containers"
	@echo "  deploy-staging   Deploy to staging"
	@echo "  deploy-prod      Deploy to production"

install:
	pip install --upgrade pip
	pip install -r requirements.txt
	pip install -e .

test:
	pytest tests/ -v --cov=. --cov-report=html --cov-report=term

lint:
	flake8 .
	mypy .

format:
	black .
	isort .

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name *.egg-info -exec rm -rf {} + 2>/dev/null || true
	rm -rf build dist htmlcov .coverage

run:
	python ai_stack/vision_cortex/vision_cortex.py

api:
	uvicorn gateway_stack.api.main:app --reload --host 0.0.0.0 --port 8000

audit:
	python scripts/setup/system_auditor.py

docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

deploy-staging:
	@echo "Deploying to staging..."
	# Add deployment commands

deploy-prod:
	@echo "Deploying to production..."
	# Add deployment commands
