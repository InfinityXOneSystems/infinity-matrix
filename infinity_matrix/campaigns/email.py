"""Email sending integration using SendGrid."""

from typing import Any, dict

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import LoggerMixin


class EmailSender(LoggerMixin):
    """Email sender using SendGrid API."""

    def __init__(self):
        """Initialize email sender."""
        self.client = None

    async def initialize(self) -> None:
        """Initialize SendGrid client."""
        if not settings.sendgrid_api_key:
            self.log_warning("sendgrid_api_key_not_configured")
            return

        try:
            from sendgrid import SendGridAPIClient
            self.client = SendGridAPIClient(settings.sendgrid_api_key)
            self.log_info("email_sender_initialized")
        except ImportError:
            self.log_error("sendgrid_not_installed")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        self.log_info("email_sender_shutdown")

    async def send_email(
        self,
        to_email: str,
        subject: str,
        content: str,
        from_email: str | None = None,
        from_name: str | None = None,
        content_type: str = "text/plain",
    ) -> dict[str, Any]:
        """
        Send an email.

        Args:
            to_email: Recipient email
            subject: Email subject
            content: Email content
            from_email: Sender email (optional)
            from_name: Sender name (optional)
            content_type: Content type (text/plain or text/html)

        Returns:
            Send result
        """
        if not self.client:
            self.log_warning("email_client_not_initialized")
            return {
                "success": False,
                "error": "Email client not initialized",
            }

        try:
            from sendgrid.helpers.mail import Mail

            message = Mail(
                from_email=(from_email or settings.sendgrid_from_email, from_name or settings.sendgrid_from_name),
                to_emails=to_email,
                subject=subject,
                plain_text_content=content if content_type == "text/plain" else None,
                html_content=content if content_type == "text/html" else None,
            )

            response = self.client.send(message)

            self.log_info(
                "email_sent",
                to=to_email,
                status_code=response.status_code,
            )

            return {
                "success": response.status_code in [200, 202],
                "status_code": response.status_code,
            }

        except Exception as e:
            self.log_error("email_send_failed", to=to_email, error=str(e))
            return {
                "success": False,
                "error": str(e),
            }

    async def send_template_email(
        self,
        to_email: str,
        template_id: str,
        template_data: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Send email using a SendGrid template.

        Args:
            to_email: Recipient email
            template_id: SendGrid template ID
            template_data: Template data

        Returns:
            Send result
        """
        if not self.client:
            return {
                "success": False,
                "error": "Email client not initialized",
            }

        try:
            from sendgrid.helpers.mail import Mail

            message = Mail(
                from_email=(settings.sendgrid_from_email, settings.sendgrid_from_name),
                to_emails=to_email,
            )

            message.template_id = template_id
            message.dynamic_template_data = template_data

            response = self.client.send(message)

            self.log_info(
                "template_email_sent",
                to=to_email,
                template_id=template_id,
                status_code=response.status_code,
            )

            return {
                "success": response.status_code in [200, 202],
                "status_code": response.status_code,
            }

        except Exception as e:
            self.log_error("template_email_failed", to=to_email, error=str(e))
            return {
                "success": False,
                "error": str(e),
            }

    async def send_bulk_emails(
        self,
        recipients: list[dict[str, str]],
        subject: str,
        content: str,
    ) -> dict[str, Any]:
        """
        Send bulk emails.

        Args:
            recipients: list of recipient dictionaries with 'email' and optionally 'name'
            subject: Email subject
            content: Email content

        Returns:
            Bulk send result
        """
        import asyncio

        tasks = [
            self.send_email(
                to_email=recipient["email"],
                subject=subject,
                content=content,
            )
            for recipient in recipients
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        successful = sum(
            1 for r in results
            if isinstance(r, dict) and r.get("success")
        )

        self.log_info(
            "bulk_emails_sent",
            total=len(recipients),
            successful=successful,
        )

        return {
            "total": len(recipients),
            "successful": successful,
            "failed": len(recipients) - successful,
            "success": True,
        }
