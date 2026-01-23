"""Voice calling integration using Twilio."""

from typing import Any, dict

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import LoggerMixin


class VoiceCaller(LoggerMixin):
    """Voice caller using Twilio API."""

    def __init__(self):
        """Initialize voice caller."""
        self.client = None

    async def initialize(self) -> None:
        """Initialize Twilio client."""
        if not settings.twilio_account_sid or not settings.twilio_auth_token:
            self.log_warning("twilio_credentials_not_configured")
            return

        try:
            from twilio.rest import Client
            self.client = Client(
                settings.twilio_account_sid,
                settings.twilio_auth_token,
            )
            self.log_info("voice_caller_initialized")
        except ImportError:
            self.log_error("twilio_not_installed")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        self.log_info("voice_caller_shutdown")

    async def make_call(
        self,
        to_phone: str,
        message: str,
        from_phone: str | None = None,
    ) -> dict[str, Any]:
        """
        Make a voice call.

        Args:
            to_phone: Recipient phone number
            message: Message to speak (TwiML)
            from_phone: Caller phone number (optional)

        Returns:
            Call result
        """
        if not self.client:
            self.log_warning("twilio_client_not_initialized")
            return {
                "success": False,
                "error": "Twilio client not initialized",
            }

        try:
            # Create TwiML for voice message
            twiml = f"""
            <Response>
                <Say voice="alice">{message}</Say>
            </Response>
            """

            call = self.client.calls.create(
                twiml=twiml,
                to=to_phone,
                from_=from_phone or settings.twilio_phone_number,
            )

            self.log_info(
                "call_initiated",
                to=to_phone,
                call_sid=call.sid,
                status=call.status,
            )

            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
            }

        except Exception as e:
            self.log_error("call_failed", to=to_phone, error=str(e))
            return {
                "success": False,
                "error": str(e),
            }

    async def make_interactive_call(
        self,
        to_phone: str,
        twiml_url: str,
        from_phone: str | None = None,
    ) -> dict[str, Any]:
        """
        Make an interactive call using a TwiML URL.

        Args:
            to_phone: Recipient phone number
            twiml_url: URL serving TwiML instructions
            from_phone: Caller phone number (optional)

        Returns:
            Call result
        """
        if not self.client:
            return {
                "success": False,
                "error": "Twilio client not initialized",
            }

        try:
            call = self.client.calls.create(
                url=twiml_url,
                to=to_phone,
                from_=from_phone or settings.twilio_phone_number,
            )

            self.log_info(
                "interactive_call_initiated",
                to=to_phone,
                call_sid=call.sid,
            )

            return {
                "success": True,
                "call_sid": call.sid,
                "status": call.status,
            }

        except Exception as e:
            self.log_error("interactive_call_failed", to=to_phone, error=str(e))
            return {
                "success": False,
                "error": str(e),
            }

    async def get_call_status(self, call_sid: str) -> dict[str, Any]:
        """
        Get status of a call.

        Args:
            call_sid: Call SID

        Returns:
            Call status
        """
        if not self.client:
            return {
                "success": False,
                "error": "Twilio client not initialized",
            }

        try:
            call = self.client.calls(call_sid).fetch()

            return {
                "call_sid": call.sid,
                "status": call.status,
                "duration": call.duration,
                "direction": call.direction,
                "from": call.from_,
                "to": call.to,
                "success": True,
            }

        except Exception as e:
            self.log_error("call_status_fetch_failed", call_sid=call_sid, error=str(e))
            return {
                "success": False,
                "error": str(e),
            }


class SMSSender(LoggerMixin):
    """SMS sender using Twilio API."""

    def __init__(self):
        """Initialize SMS sender."""
        self.client = None

    async def initialize(self) -> None:
        """Initialize Twilio client."""
        if not settings.twilio_account_sid or not settings.twilio_auth_token:
            self.log_warning("twilio_credentials_not_configured")
            return

        try:
            from twilio.rest import Client
            self.client = Client(
                settings.twilio_account_sid,
                settings.twilio_auth_token,
            )
            self.log_info("sms_sender_initialized")
        except ImportError:
            self.log_error("twilio_not_installed")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        self.log_info("sms_sender_shutdown")

    async def send_sms(
        self,
        to_phone: str,
        message: str,
        from_phone: str | None = None,
    ) -> dict[str, Any]:
        """
        Send an SMS message.

        Args:
            to_phone: Recipient phone number
            message: SMS message
            from_phone: Sender phone number (optional)

        Returns:
            Send result
        """
        if not self.client:
            self.log_warning("twilio_client_not_initialized")
            return {
                "success": False,
                "error": "Twilio client not initialized",
            }

        try:
            sms = self.client.messages.create(
                body=message,
                to=to_phone,
                from_=from_phone or settings.twilio_phone_number,
            )

            self.log_info(
                "sms_sent",
                to=to_phone,
                message_sid=sms.sid,
                status=sms.status,
            )

            return {
                "success": True,
                "message_sid": sms.sid,
                "status": sms.status,
            }

        except Exception as e:
            self.log_error("sms_send_failed", to=to_phone, error=str(e))
            return {
                "success": False,
                "error": str(e),
            }

    async def send_bulk_sms(
        self,
        recipients: list[str],
        message: str,
    ) -> dict[str, Any]:
        """
        Send bulk SMS messages.

        Args:
            recipients: list of phone numbers
            message: SMS message

        Returns:
            Bulk send result
        """
        import asyncio

        tasks = [
            self.send_sms(to_phone=phone, message=message)
            for phone in recipients
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        successful = sum(
            1 for r in results
            if isinstance(r, dict) and r.get("success")
        )

        self.log_info(
            "bulk_sms_sent",
            total=len(recipients),
            successful=successful,
        )

        return {
            "total": len(recipients),
            "successful": successful,
            "failed": len(recipients) - successful,
            "success": True,
        }
