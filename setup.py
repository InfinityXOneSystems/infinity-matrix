"""Setup configuration for infinity-matrix autonomous CD system."""
from setuptools import setup, find_packages

setup(
    name="infinity-matrix",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "requests>=2.31.0",
        "flask>=3.0.0",
        "pyyaml>=6.0.1",
        "gitpython>=3.1.40",
        "pytest>=7.4.3",
        "click>=8.1.7",
        "tabulate>=0.9.0",
        "rich>=13.7.0",
        "schedule>=1.2.0",
    ],
    entry_points={
        "console_scripts": [
            "infinity-matrix=dashboard.cli:main",
            "im-agent=agents.orchestrator:main",
        ],
    },
    python_requires=">=3.8",
)
