"""Tests for core configuration."""

import os
import tempfile

from infinity_matrix.core.config import Config


def test_config_defaults():
    """Test default configuration values."""
    config = Config()

    assert config.database.type == "postgresql"
    assert config.database.host == "localhost"
    assert config.database.port == 5432

    assert config.redis.host == "localhost"
    assert config.redis.port == 6379

    assert config.crawler.max_concurrent_requests == 10
    assert config.crawler.respect_robots_txt is True


def test_config_load_from_file():
    """Test loading configuration from file."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
        f.write("""
database:
  host: testhost
  port: 9999

crawler:
  max_concurrent_requests: 5
""")
        config_path = f.name

    try:
        config = Config.load(config_path)

        assert config.database.host == "testhost"
        assert config.database.port == 9999
        assert config.crawler.max_concurrent_requests == 5
    finally:
        os.unlink(config_path)


def test_config_env_override():
    """Test environment variable overrides."""
    os.environ['DB_HOST'] = 'envhost'
    os.environ['DB_PORT'] = '7777'

    try:
        config = Config.load()

        assert config.database.host == 'envhost'
        assert config.database.port == 7777
    finally:
        del os.environ['DB_HOST']
        del os.environ['DB_PORT']


def test_config_save():
    """Test saving configuration to file."""
    config = Config()
    config.database.host = "savetest"

    with tempfile.TemporaryDirectory() as tmpdir:
        config_path = os.path.join(tmpdir, "test_config.yaml")
        config.save(config_path)

        assert os.path.exists(config_path)

        # Load it back
        loaded = Config.load(config_path)
        assert loaded.database.host == "savetest"
