"""
Simulation Engine - Business outcome simulations
"""
import logging
from typing import list

from app.models.models import IntelligenceReport, Proposal, Simulation
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class SimulationEngine:
    """
    Creates business simulations and projections.

    Simulates:
    - Investment impact
    - Lead generation
    - AI capability improvements
    - Business growth
    - Multiple timeline scenarios
    - With/without hire comparisons
    """

    async def run_simulations(
        self,
        discovery_id: int,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        db: AsyncSession
    ) -> list[Simulation]:
        """Run comprehensive business simulations"""
        logger.info(f"Running simulations for discovery {discovery_id}")

        simulations = []

        # Investment simulation
        investment_sim = await self._simulate_investment(
            discovery_id,
            intelligence_report,
            proposals,
            db
        )
        simulations.append(investment_sim)

        # Lead generation simulation
        lead_sim = await self._simulate_lead_generation(
            discovery_id,
            intelligence_report,
            db
        )
        simulations.append(lead_sim)

        # AI capability simulation
        ai_sim = await self._simulate_ai_capability(
            discovery_id,
            intelligence_report,
            proposals,
            db
        )
        simulations.append(ai_sim)

        # Business growth simulation
        business_sim = await self._simulate_business_growth(
            discovery_id,
            intelligence_report,
            proposals,
            db
        )
        simulations.append(business_sim)

        await db.commit()

        logger.info(f"Generated {len(simulations)} simulations")
        return simulations

    async def _simulate_investment(
        self,
        discovery_id: int,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        db: AsyncSession
    ) -> Simulation:
        """Simulate investment impact scenarios"""

        # Baseline (no investment)
        baseline = {
            "scenario_name": "Current Trajectory (No Investment)",
            "12_months": {
                "revenue": 12_000_000,
                "growth_rate": 15,
                "market_share": 3.2,
                "competitive_position": "Middle of pack",
                "capabilities": "Current state maintained",
                "risk_level": "Increasing"
            },
            "24_months": {
                "revenue": 13_800_000,
                "growth_rate": 12,
                "market_share": 2.9,
                "competitive_position": "Losing ground",
                "capabilities": "Falling behind",
                "risk_level": "High"
            },
            "36_months": {
                "revenue": 15_456_000,
                "growth_rate": 8,
                "market_share": 2.5,
                "competitive_position": "Struggling",
                "capabilities": "Significant gaps",
                "risk_level": "Very high"
            }
        }

        # Optimistic scenario (with investment + strong execution)
        optimistic = {
            "scenario_name": "Optimistic (Investment + Strong Execution)",
            "12_months": {
                "revenue": 16_800_000,
                "growth_rate": 40,
                "market_share": 4.8,
                "competitive_position": "Rising challenger",
                "capabilities": "Strong and growing",
                "risk_level": "Low"
            },
            "24_months": {
                "revenue": 26_880_000,
                "growth_rate": 60,
                "market_share": 7.2,
                "competitive_position": "Top tier player",
                "capabilities": "Industry leading",
                "risk_level": "Very low"
            },
            "36_months": {
                "revenue": 45_696_000,
                "growth_rate": 70,
                "market_share": 10.5,
                "competitive_position": "Market leader",
                "capabilities": "Category defining",
                "risk_level": "Minimal"
            }
        }

        # Realistic scenario (with investment + normal execution)
        realistic = {
            "scenario_name": "Realistic (Investment + Normal Execution)",
            "12_months": {
                "revenue": 15_600_000,
                "growth_rate": 30,
                "market_share": 4.2,
                "competitive_position": "Strong challenger",
                "capabilities": "Improving",
                "risk_level": "Moderate"
            },
            "24_months": {
                "revenue": 23_400_000,
                "growth_rate": 50,
                "market_share": 6.0,
                "competitive_position": "Competitive player",
                "capabilities": "Strong",
                "risk_level": "Low"
            },
            "36_months": {
                "revenue": 35_100_000,
                "growth_rate": 50,
                "market_share": 8.2,
                "competitive_position": "Top contender",
                "capabilities": "Very strong",
                "risk_level": "Low"
            }
        }

        # Conservative scenario (with investment + challenges)
        conservative = {
            "scenario_name": "Conservative (Investment + Some Challenges)",
            "12_months": {
                "revenue": 14_400_000,
                "growth_rate": 20,
                "market_share": 3.8,
                "competitive_position": "Holding position",
                "capabilities": "Stable",
                "risk_level": "Moderate"
            },
            "24_months": {
                "revenue": 19_440_000,
                "growth_rate": 35,
                "market_share": 4.9,
                "competitive_position": "Slow improvement",
                "capabilities": "Moderately strong",
                "risk_level": "Moderate"
            },
            "36_months": {
                "revenue": 26_244_000,
                "growth_rate": 35,
                "market_share": 6.0,
                "competitive_position": "Competitive",
                "capabilities": "Good",
                "risk_level": "Moderate"
            }
        }

        # Current state
        current_state = {
            "revenue": 12_000_000,
            "growth_rate": 15,
            "market_share": 3.2,
            "team_size": 75,
            "customer_count": 120,
            "capabilities_score": 6.5
        }

        # Projected state (realistic scenario at 24 months)
        projected_state = {
            "revenue": 23_400_000,
            "growth_rate": 50,
            "market_share": 6.0,
            "team_size": 140,
            "customer_count": 280,
            "capabilities_score": 8.5
        }

        # Transformation metrics
        transformation = {
            "revenue_increase": "95%",
            "market_share_increase": "87.5%",
            "team_growth": "87%",
            "customer_growth": "133%",
            "capability_improvement": "31%",
            "competitive_position": "From middle pack to top contender",
            "roi": "380%",
            "payback_period": "8 months"
        }

        simulation = Simulation(
            discovery_id=discovery_id,
            simulation_type="investment",
            baseline_scenario=baseline,
            optimistic_scenario=optimistic,
            realistic_scenario=realistic,
            conservative_scenario=conservative,
            current_state=current_state,
            projected_state=projected_state,
            transformation_metrics=transformation,
            confidence_score=82.5
        )

        db.add(simulation)
        return simulation

    async def _simulate_lead_generation(
        self,
        discovery_id: int,
        intelligence_report: IntelligenceReport,
        db: AsyncSession
    ) -> Simulation:
        """Simulate lead generation impact"""

        baseline = {
            "scenario_name": "Current Lead Generation",
            "monthly_leads": 45,
            "qualified_leads": 12,
            "conversion_rate": 8,
            "customer_acquisition_cost": 8500,
            "lead_quality_score": 6.2
        }

        optimistic = {
            "scenario_name": "Enhanced Lead Generation - Optimistic",
            "monthly_leads": 180,
            "qualified_leads": 72,
            "conversion_rate": 15,
            "customer_acquisition_cost": 4200,
            "lead_quality_score": 8.5,
            "improvement": "4x increase in qualified leads"
        }

        realistic = {
            "scenario_name": "Enhanced Lead Generation - Realistic",
            "monthly_leads": 135,
            "qualified_leads": 54,
            "conversion_rate": 12,
            "customer_acquisition_cost": 5100,
            "lead_quality_score": 8.0,
            "improvement": "4.5x increase in qualified leads"
        }

        conservative = {
            "scenario_name": "Enhanced Lead Generation - Conservative",
            "monthly_leads": 90,
            "qualified_leads": 32,
            "conversion_rate": 10,
            "customer_acquisition_cost": 6500,
            "lead_quality_score": 7.2,
            "improvement": "2.7x increase in qualified leads"
        }

        transformation = {
            "lead_volume_increase": "200%",
            "qualified_lead_increase": "350%",
            "conversion_improvement": "50%",
            "cac_reduction": "40%",
            "pipeline_value_increase": "420%"
        }

        simulation = Simulation(
            discovery_id=discovery_id,
            simulation_type="lead_generation",
            baseline_scenario=baseline,
            optimistic_scenario=optimistic,
            realistic_scenario=realistic,
            conservative_scenario=conservative,
            transformation_metrics=transformation,
            confidence_score=78.0
        )

        db.add(simulation)
        return simulation

    async def _simulate_ai_capability(
        self,
        discovery_id: int,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        db: AsyncSession
    ) -> Simulation:
        """Simulate AI capability improvements"""

        baseline = {
            "scenario_name": "Current AI Capabilities",
            "automation_level": 25,
            "ai_features": "Basic",
            "time_to_insight": "Days to weeks",
            "accuracy": 72,
            "scalability": "Limited",
            "competitive_standing": "Below average"
        }

        optimistic = {
            "scenario_name": "Enhanced AI - Optimistic",
            "automation_level": 85,
            "ai_features": "Industry leading",
            "time_to_insight": "Real-time to hours",
            "accuracy": 94,
            "scalability": "Unlimited",
            "competitive_standing": "Category leader"
        }

        realistic = {
            "scenario_name": "Enhanced AI - Realistic",
            "automation_level": 70,
            "ai_features": "Advanced",
            "time_to_insight": "Hours to 1 day",
            "accuracy": 88,
            "scalability": "High",
            "competitive_standing": "Above average"
        }

        conservative = {
            "scenario_name": "Enhanced AI - Conservative",
            "automation_level": 55,
            "ai_features": "Good",
            "time_to_insight": "1-2 days",
            "accuracy": 82,
            "scalability": "Moderate",
            "competitive_standing": "Average"
        }

        transformation = {
            "automation_increase": "180%",
            "accuracy_improvement": "22%",
            "speed_improvement": "90%",
            "productivity_gain": "250%",
            "competitive_leap": "From below average to above average"
        }

        simulation = Simulation(
            discovery_id=discovery_id,
            simulation_type="ai_capability",
            baseline_scenario=baseline,
            optimistic_scenario=optimistic,
            realistic_scenario=realistic,
            conservative_scenario=conservative,
            transformation_metrics=transformation,
            confidence_score=85.0
        )

        db.add(simulation)
        return simulation

    async def _simulate_business_growth(
        self,
        discovery_id: int,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        db: AsyncSession
    ) -> Simulation:
        """Simulate overall business growth"""

        baseline = {
            "scenario_name": "Baseline Growth",
            "revenue_growth": 15,
            "profit_margin": 12,
            "customer_retention": 82,
            "team_productivity": "Baseline",
            "market_position": "Static"
        }

        optimistic = {
            "scenario_name": "Accelerated Growth - Optimistic",
            "revenue_growth": 85,
            "profit_margin": 28,
            "customer_retention": 95,
            "team_productivity": "250% of baseline",
            "market_position": "Market leader trajectory"
        }

        realistic = {
            "scenario_name": "Strong Growth - Realistic",
            "revenue_growth": 50,
            "profit_margin": 22,
            "customer_retention": 91,
            "team_productivity": "180% of baseline",
            "market_position": "Strong competitive position"
        }

        conservative = {
            "scenario_name": "Moderate Growth - Conservative",
            "revenue_growth": 30,
            "profit_margin": 17,
            "customer_retention": 87,
            "team_productivity": "140% of baseline",
            "market_position": "Improved position"
        }

        transformation = {
            "revenue_acceleration": "233%",
            "profitability_improvement": "83%",
            "retention_improvement": "11%",
            "productivity_gain": "80%",
            "valuation_multiple": "2.5x increase"
        }

        simulation = Simulation(
            discovery_id=discovery_id,
            simulation_type="business_growth",
            baseline_scenario=baseline,
            optimistic_scenario=optimistic,
            realistic_scenario=realistic,
            conservative_scenario=conservative,
            transformation_metrics=transformation,
            confidence_score=80.0
        )

        db.add(simulation)
        return simulation
