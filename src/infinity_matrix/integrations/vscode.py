"""VS Code extension integration."""

from typing import Any

import structlog

from infinity_matrix.core.config import VSCodeIntegration as VSCodeConfig

logger = structlog.get_logger()


class VSCodeIntegration:
    """VS Code extension integration."""

    def __init__(self, config: VSCodeConfig):
        """Initialize VS Code integration.

        Args:
            config: VS Code configuration
        """
        self.config = config
        self._lsp_server: Any | None = None

    async def start_lsp_server(self) -> None:
        """Start Language Server Protocol server."""
        if not self.config.enabled or not self.config.lsp_enabled:
            logger.warning("VS Code LSP disabled")
            return

        logger.info("Starting LSP server")

        # Placeholder for LSP server
        self._lsp_server = {
            "running": True,
            "port": 6009
        }

        logger.info("LSP server started")

    async def stop_lsp_server(self) -> None:
        """Stop LSP server."""
        if self._lsp_server:
            logger.info("Stopping LSP server")
            self._lsp_server = None

    async def send_notification(
        self,
        title: str,
        message: str
    ) -> None:
        """Send notification to VS Code.

        Args:
            title: Notification title
            message: Notification message
        """
        logger.info("Sending VS Code notification", title=title)
