"""Campaign automation engine with email and voice integration."""

from datetime import datetime
from typing import Any, dict, list
from uuid import uuid4

from infinity_matrix.core.base import BaseCampaignEngine
from infinity_matrix.core.config import settings


class CampaignEngine(BaseCampaignEngine):
    """Automated campaign orchestration engine."""

    def __init__(self, **kwargs: Any):
        """Initialize campaign engine."""
        super().__init__(kwargs)
        self.campaigns: dict[str, dict[str, Any]] = {}

    async def initialize(self) -> None:
        """Initialize campaign resources."""
        self.log_info("campaign_engine_initialized")

    async def shutdown(self) -> None:
        """Cleanup campaign resources."""
        self.log_info("campaign_engine_shutdown")

    async def create_campaign(
        self,
        name: str,
        leads: list[dict[str, Any]],
        template: str,
        channel: str = "email",
    ) -> str:
        """
        Create a new campaign.

        Args:
            name: Campaign name
            leads: list of leads to target
            template: Template name or content
            channel: Communication channel (email, voice, sms)

        Returns:
            Campaign ID
        """
        campaign_id = str(uuid4())

        campaign = {
            "id": campaign_id,
            "name": name,
            "leads": leads,
            "template": template,
            "channel": channel,
            "status": "created",
            "created_at": datetime.now().isoformat(),
            "launched_at": None,
            "completed_at": None,
            "stats": {
                "total_leads": len(leads),
                "contacted": 0,
                "responded": 0,
                "converted": 0,
            },
        }

        self.campaigns[campaign_id] = campaign

        self.log_info(
            "campaign_created",
            campaign_id=campaign_id,
            name=name,
            leads_count=len(leads),
        )

        return campaign_id

    async def launch_campaign(self, campaign_id: str) -> None:
        """
        Launch a campaign.

        Args:
            campaign_id: Campaign ID
        """
        if campaign_id not in self.campaigns:
            raise ValueError(f"Campaign {campaign_id} not found")

        campaign = self.campaigns[campaign_id]

        if campaign["status"] != "created":
            raise ValueError(f"Campaign {campaign_id} already launched")

        campaign["status"] = "running"
        campaign["launched_at"] = datetime.now().isoformat()

        # Execute campaign based on channel
        channel = campaign["channel"]

        if channel == "email":
            await self._execute_email_campaign(campaign)
        elif channel == "voice":
            await self._execute_voice_campaign(campaign)
        elif channel == "sms":
            await self._execute_sms_campaign(campaign)
        else:
            raise ValueError(f"Unknown channel: {channel}")

        campaign["status"] = "completed"
        campaign["completed_at"] = datetime.now().isoformat()

        self.log_info("campaign_launched", campaign_id=campaign_id)

    async def _execute_email_campaign(self, campaign: dict[str, Any]) -> None:
        """Execute email campaign."""
        from infinity_matrix.campaigns.email import EmailSender

        if not settings.enable_email:
            self.log_warning("email_disabled")
            return

        sender = EmailSender()
        await sender.initialize()

        template = campaign["template"]

        for lead in campaign["leads"]:
            email = lead.get("contact", {}).get("email")

            if not email:
                continue

            # Personalize template
            content = await self._personalize_template(template, lead)

            # Send email
            result = await sender.send_email(
                to_email=email,
                subject=f"Important: {campaign['name']}",
                content=content,
            )

            if result.get("success"):
                campaign["stats"]["contacted"] += 1

        await sender.shutdown()

    async def _execute_voice_campaign(self, campaign: dict[str, Any]) -> None:
        """Execute voice campaign."""
        from infinity_matrix.campaigns.voice import VoiceCaller

        if not settings.enable_voice:
            self.log_warning("voice_disabled")
            return

        caller = VoiceCaller()
        await caller.initialize()

        for lead in campaign["leads"]:
            phone = lead.get("contact", {}).get("phone")

            if not phone:
                continue

            # Make call
            result = await caller.make_call(
                to_phone=phone,
                message=campaign["template"],
            )

            if result.get("success"):
                campaign["stats"]["contacted"] += 1

        await caller.shutdown()

    async def _execute_sms_campaign(self, campaign: dict[str, Any]) -> None:
        """Execute SMS campaign."""
        from infinity_matrix.campaigns.sms import SMSSender

        sender = SMSSender()
        await sender.initialize()

        for lead in campaign["leads"]:
            phone = lead.get("contact", {}).get("phone")

            if not phone:
                continue

            # Personalize message
            message = await self._personalize_template(campaign["template"], lead)

            # Send SMS
            result = await sender.send_sms(
                to_phone=phone,
                message=message[:160],  # SMS length limit
            )

            if result.get("success"):
                campaign["stats"]["contacted"] += 1

        await sender.shutdown()

    async def _personalize_template(
        self,
        template: str,
        lead: dict[str, Any],
    ) -> str:
        """Personalize template with lead data."""
        # Simple template variable replacement
        content = template

        contact = lead.get("contact", {})

        replacements = {
            "{name}": contact.get("name", "there"),
            "{email}": contact.get("email", ""),
            "{phone}": contact.get("phone", ""),
            "{company}": lead.get("business", {}).get("name", ""),
        }

        for var, value in replacements.items():
            content = content.replace(var, value)

        return content

    async def get_campaign_status(self, campaign_id: str) -> dict[str, Any]:
        """
        Get campaign status.

        Args:
            campaign_id: Campaign ID

        Returns:
            Campaign status
        """
        if campaign_id not in self.campaigns:
            return {"error": f"Campaign {campaign_id} not found", "success": False}

        campaign = self.campaigns[campaign_id]

        return {
            "campaign_id": campaign_id,
            "name": campaign["name"],
            "status": campaign["status"],
            "channel": campaign["channel"],
            "stats": campaign["stats"],
            "created_at": campaign["created_at"],
            "launched_at": campaign["launched_at"],
            "completed_at": campaign["completed_at"],
            "success": True,
        }

    async def pause_campaign(self, campaign_id: str) -> None:
        """Pause a running campaign."""
        if campaign_id not in self.campaigns:
            raise ValueError(f"Campaign {campaign_id} not found")

        campaign = self.campaigns[campaign_id]

        if campaign["status"] == "running":
            campaign["status"] = "paused"
            self.log_info("campaign_paused", campaign_id=campaign_id)

    async def resume_campaign(self, campaign_id: str) -> None:
        """Resume a paused campaign."""
        if campaign_id not in self.campaigns:
            raise ValueError(f"Campaign {campaign_id} not found")

        campaign = self.campaigns[campaign_id]

        if campaign["status"] == "paused":
            campaign["status"] = "running"
            self.log_info("campaign_resumed", campaign_id=campaign_id)

    async def update_campaign_stats(
        self,
        campaign_id: str,
        lead_id: str,
        action: str,
    ) -> None:
        """
        Update campaign statistics.

        Args:
            campaign_id: Campaign ID
            lead_id: Lead ID
            action: Action taken (responded, converted)
        """
        if campaign_id not in self.campaigns:
            return

        campaign = self.campaigns[campaign_id]

        if action == "responded":
            campaign["stats"]["responded"] += 1
        elif action == "converted":
            campaign["stats"]["converted"] += 1

        self.log_info(
            "campaign_stats_updated",
            campaign_id=campaign_id,
            action=action,
        )

    async def get_campaign_analytics(self, campaign_id: str) -> dict[str, Any]:
        """Get detailed campaign analytics."""
        if campaign_id not in self.campaigns:
            return {"error": f"Campaign {campaign_id} not found", "success": False}

        campaign = self.campaigns[campaign_id]
        stats = campaign["stats"]

        total = stats["total_leads"]
        contacted = stats["contacted"]
        responded = stats["responded"]
        converted = stats["converted"]

        analytics = {
            "campaign_id": campaign_id,
            "name": campaign["name"],
            "stats": stats,
            "rates": {
                "contact_rate": (contacted / total * 100) if total > 0 else 0,
                "response_rate": (responded / contacted * 100) if contacted > 0 else 0,
                "conversion_rate": (converted / contacted * 100) if contacted > 0 else 0,
            },
            "roi": {
                "cost_per_lead": 0,  # Would calculate actual costs
                "cost_per_conversion": 0,
                "estimated_revenue": 0,
            },
            "success": True,
        }

        return analytics
