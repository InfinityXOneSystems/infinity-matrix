"""Setup configuration for infinity-matrix package."""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="infinity-matrix",
    version="1.0.0",
    author="InfinityXOneSystems",
    author_email="contact@infinityxonesystems.com",
    description="Enterprise-grade universal seed and ingestion system",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/InfinityXOneSystems/infinity-matrix",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
    python_requires=">=3.9",
    install_requires=[
        "pydantic>=2.5.0",
        "pyyaml>=6.0",
        "python-dotenv>=1.0.0",
        "requests>=2.31.0",
        "httpx>=0.25.0",
        "beautifulsoup4>=4.12.0",
        "lxml>=4.9.0",
        "selenium>=4.15.0",
        "playwright>=1.40.0",
        "scrapy>=2.11.0",
        "sqlalchemy>=2.0.0",
        "psycopg2-binary>=2.9.0",
        "pymongo>=4.6.0",
        "redis>=5.0.0",
        "celery>=5.3.0",
        "openai>=1.6.0",
        "anthropic>=0.8.0",
        "google-cloud-aiplatform>=1.38.0",
        "langchain>=0.1.0",
        "pandas>=2.1.0",
        "numpy>=1.26.0",
        "jsonlines>=4.0.0",
        "fastapi>=0.104.0",
        "uvicorn>=0.24.0",
        "structlog>=23.2.0",
        "prometheus-client>=0.19.0",
        "click>=8.1.0",
        "tqdm>=4.66.0",
        "tenacity>=8.2.0",
        "python-dateutil>=2.8.0",
        "aiofiles>=23.2.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-asyncio>=0.21.0",
            "pytest-cov>=4.1.0",
            "responses>=0.24.0",
            "ruff>=0.1.0",
            "black>=23.11.0",
            "mypy>=1.7.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "infinity-matrix=infinity_matrix.cli:main",
        ],
    },
)
