"""Industry template system for top 10 industries."""

from enum import Enum
from typing import Any, dict, list

from infinity_matrix.core.logging import LoggerMixin


class Industry(str, Enum):
    """Supported industries."""
    FINANCIAL_SERVICES = "financial_services"
    REAL_ESTATE = "real_estate"
    LENDING = "lending"
    ECOMMERCE = "ecommerce"
    HEALTHCARE = "healthcare"
    LEGAL = "legal"
    INSURANCE = "insurance"
    TECHNOLOGY = "technology"
    MANUFACTURING = "manufacturing"
    RETAIL = "retail"


class IndustryTemplate(LoggerMixin):
    """Base template for industry-specific implementations."""

    def __init__(self, industry: Industry):
        """Initialize industry template."""
        self.industry = industry
        self.config = self._load_config()

    def _load_config(self) -> dict[str, Any]:
        """Load industry-specific configuration."""
        configs = {
            Industry.FINANCIAL_SERVICES: {
                "data_sources": ["yfinance", "alpha_vantage", "fred"],
                "key_metrics": ["price", "volume", "volatility", "returns"],
                "lead_criteria": ["net_worth", "investment_experience", "risk_tolerance"],
                "compliance": ["sec", "finra"],
            },
            Industry.REAL_ESTATE: {
                "data_sources": ["mls", "zillow", "redfin", "public_records"],
                "key_metrics": ["price", "sqft", "location", "appreciation"],
                "lead_criteria": ["budget", "location", "property_type", "timeline"],
                "compliance": ["fair_housing", "respa"],
            },
            Industry.LENDING: {
                "data_sources": ["credit_bureaus", "business_databases"],
                "key_metrics": ["credit_score", "dti_ratio", "income", "collateral"],
                "lead_criteria": ["loan_amount", "purpose", "creditworthiness"],
                "compliance": ["tila", "fcra", "ecoa"],
            },
            Industry.ECOMMERCE: {
                "data_sources": ["shopify", "amazon", "google_analytics"],
                "key_metrics": ["revenue", "conversion_rate", "cart_value", "traffic"],
                "lead_criteria": ["purchase_history", "engagement", "demographics"],
                "compliance": ["gdpr", "ccpa"],
            },
            Industry.HEALTHCARE: {
                "data_sources": ["ehr", "claims", "clinical_trials"],
                "key_metrics": ["patient_outcomes", "costs", "quality_scores"],
                "lead_criteria": ["condition", "insurance", "location"],
                "compliance": ["hipaa", "hitech"],
            },
            Industry.LEGAL: {
                "data_sources": ["case_law", "court_records", "legal_databases"],
                "key_metrics": ["case_success", "billable_hours", "client_satisfaction"],
                "lead_criteria": ["case_type", "budget", "urgency"],
                "compliance": ["attorney_client_privilege", "ethics_rules"],
            },
            Industry.INSURANCE: {
                "data_sources": ["actuarial_data", "claims_history"],
                "key_metrics": ["loss_ratio", "premium_volume", "retention"],
                "lead_criteria": ["risk_profile", "coverage_needs", "premium_budget"],
                "compliance": ["state_insurance_regs"],
            },
            Industry.TECHNOLOGY: {
                "data_sources": ["github", "crunchbase", "tech_news"],
                "key_metrics": ["mrr", "churn", "dau", "engineering_velocity"],
                "lead_criteria": ["company_size", "tech_stack", "budget"],
                "compliance": ["soc2", "iso27001"],
            },
            Industry.MANUFACTURING: {
                "data_sources": ["supply_chain", "inventory", "iot_sensors"],
                "key_metrics": ["production_volume", "defect_rate", "oee"],
                "lead_criteria": ["order_volume", "specifications", "delivery_timeline"],
                "compliance": ["iso9001", "osha"],
            },
            Industry.RETAIL: {
                "data_sources": ["pos", "inventory", "foot_traffic"],
                "key_metrics": ["sales_per_sqft", "inventory_turnover", "customer_count"],
                "lead_criteria": ["shopping_behavior", "location", "demographics"],
                "compliance": ["pci_dss"],
            },
        }

        return configs.get(self.industry, {})

    def get_data_sources(self) -> list[str]:
        """Get recommended data sources for industry."""
        return self.config.get("data_sources", [])

    def get_key_metrics(self) -> list[str]:
        """Get key metrics to track."""
        return self.config.get("key_metrics", [])

    def get_lead_criteria(self) -> list[str]:
        """Get lead qualification criteria."""
        return self.config.get("lead_criteria", [])

    def get_compliance_requirements(self) -> list[str]:
        """Get compliance requirements."""
        return self.config.get("compliance", [])

    async def create_analysis_pipeline(self) -> dict[str, Any]:
        """Create industry-specific analysis pipeline."""
        pipeline = {
            "industry": self.industry.value,
            "stages": [
                "data_collection",
                "data_cleaning",
                "feature_engineering",
                "analysis",
                "prediction",
                "reporting",
            ],
            "data_sources": self.get_data_sources(),
            "metrics": self.get_key_metrics(),
        }

        self.log_info(
            "analysis_pipeline_created",
            industry=self.industry.value,
        )

        return pipeline

    async def create_lead_generation_strategy(self) -> dict[str, Any]:
        """Create industry-specific lead generation strategy."""
        strategy = {
            "industry": self.industry.value,
            "channels": self._get_recommended_channels(),
            "criteria": self.get_lead_criteria(),
            "scoring_model": self._get_scoring_model(),
            "nurture_sequence": self._get_nurture_sequence(),
        }

        self.log_info(
            "lead_strategy_created",
            industry=self.industry.value,
        )

        return strategy

    def _get_recommended_channels(self) -> list[str]:
        """Get recommended marketing channels."""
        channel_map = {
            Industry.FINANCIAL_SERVICES: ["linkedin", "webinars", "content_marketing"],
            Industry.REAL_ESTATE: ["zillow", "realtor_com", "facebook", "email"],
            Industry.LENDING: ["sem", "affiliate", "direct_mail", "email"],
            Industry.ECOMMERCE: ["google_ads", "facebook", "instagram", "influencer"],
            Industry.HEALTHCARE: ["seo", "content_marketing", "local_search"],
            Industry.LEGAL: ["seo", "directory_listings", "referrals"],
            Industry.INSURANCE: ["sem", "comparison_sites", "email", "cold_calling"],
            Industry.TECHNOLOGY: ["content_marketing", "conferences", "partnerships"],
            Industry.MANUFACTURING: ["trade_shows", "linkedin", "industry_publications"],
            Industry.RETAIL: ["local_seo", "social_media", "email", "in_store"],
        }

        return channel_map.get(self.industry, ["email", "seo"])

    def _get_scoring_model(self) -> dict[str, float]:
        """Get lead scoring model weights."""
        return {
            "engagement": 0.25,
            "fit": 0.30,
            "intent": 0.25,
            "timing": 0.20,
        }

    def _get_nurture_sequence(self) -> list[dict[str, Any]]:
        """Get lead nurture sequence."""
        return [
            {"day": 0, "action": "welcome_email", "channel": "email"},
            {"day": 2, "action": "educational_content", "channel": "email"},
            {"day": 5, "action": "case_study", "channel": "email"},
            {"day": 7, "action": "demo_offer", "channel": "email"},
            {"day": 10, "action": "follow_up_call", "channel": "voice"},
        ]


class IndustryTemplateFactory:
    """Factory for creating industry templates."""

    @staticmethod
    def create(industry: Industry) -> IndustryTemplate:
        """
        Create an industry template.

        Args:
            industry: Industry type

        Returns:
            IndustryTemplate instance
        """
        return IndustryTemplate(industry)

    @staticmethod
    def get_available_industries() -> list[Industry]:
        """Get list of available industries."""
        return list(Industry)
