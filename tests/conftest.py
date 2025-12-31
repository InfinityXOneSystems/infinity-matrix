"""Test configuration for pytest."""

import pytest
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


@pytest.fixture
def sample_config_dir(tmp_path):
    """Create a temporary config directory with sample files."""
    config_dir = tmp_path / "config"
    config_dir.mkdir()
    
    industries_dir = config_dir / "industries"
    industries_dir.mkdir()
    
    sources_dir = config_dir / "sources"
    sources_dir.mkdir()
    
    # Create a sample industry file
    industry_file = industries_dir / "test_industry.yaml"
    industry_file.write_text("""
id: test_industry
name: Test Industry
type: technology
description: Test industry for testing
keywords:
  - test
  - sample
priority: 5
enabled: true

seeds:
  - url: https://github.com/test/repo
    source_id: test_source
    priority: 5
    depth: 1
""")
    
    # Create a sample source file
    source_file = sources_dir / "test_sources.yaml"
    source_file.write_text("""
- id: test_source
  name: Test Source
  type: github
  base_url: https://api.github.com
  industry_id: test_industry
  enabled: true
  rate_limit: 60
""")
    
    return config_dir


@pytest.fixture
def sample_data_dir(tmp_path):
    """Create a temporary data directory."""
    data_dir = tmp_path / "data"
    data_dir.mkdir()
    
    (data_dir / "raw").mkdir()
    (data_dir / "normalized").mkdir()
    (data_dir / "analyzed").mkdir()
    (data_dir / "tasks").mkdir()
    
    return data_dir
