"""Main application entry point for Infinity Matrix."""

import argparse

import uvicorn

from infinity_matrix.core.config import get_settings
from infinity_matrix.core.logging import get_logger
from infinity_matrix.integrations.api.server import create_app

logger = get_logger(__name__)


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Infinity Matrix AI System")
    parser.add_argument(
        "--host",
        type=str,
        help="Host to bind to",
        default=None,
    )
    parser.add_argument(
        "--port",
        type=int,
        help="Port to bind to",
        default=None,
    )
    parser.add_argument(
        "--workers",
        type=int,
        help="Number of worker processes",
        default=None,
    )
    parser.add_argument(
        "--dev",
        action="store_true",
        help="Run in development mode with auto-reload",
    )
    parser.add_argument(
        "--config",
        type=str,
        help="Path to configuration file",
        default=None,
    )
    return parser.parse_args()


def main():
    """Main application entry point."""
    args = parse_args()
    settings = get_settings()

    logger.info(
        "infinity_matrix_starting",
        version="1.0.0",
        environment=settings.environment,
    )

    # Determine configuration
    host = args.host or settings.api_host
    port = args.port or settings.api_port
    workers = args.workers or settings.api_workers

    # Create app
    app = create_app()

    # Run server
    if args.dev:
        logger.info("running_in_development_mode")
        uvicorn.run(
            "infinity_matrix.main:create_app",
            host=host,
            port=port,
            reload=True,
            factory=True,
        )
    else:
        logger.info(
            "running_in_production_mode",
            host=host,
            port=port,
            workers=workers,
        )
        uvicorn.run(
            app,
            host=host,
            port=port,
            workers=workers,
            log_level=settings.log_level.lower(),
        )


if __name__ == "__main__":
    main()
