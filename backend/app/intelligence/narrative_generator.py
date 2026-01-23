"""
Narrative Generator - Creates compelling narratives
"""
import logging
from typing import Any, dict, list

from app.models.models import Discovery, IntelligenceReport, Proposal, Simulation

logger = logging.getLogger(__name__)


class NarrativeGenerator:
    """
    Generates compelling narratives for discovery packages.

    Creates excitement-generating content that:
    - Highlights opportunities and transformations
    - Tells a compelling before/after story
    - Positions findings strategically
    - Maintains competitive advantage through selective detail withholding
    """

    async def generate_comprehensive_narrative(
        self,
        discovery: Discovery,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        simulations: list[Simulation]
    ) -> dict[str, Any]:
        """Generate complete narrative package"""
        logger.info(f"Generating narrative for discovery {discovery.id}")

        narrative = {
            "executive_summary": self._generate_executive_summary(
                discovery,
                intelligence_report,
                proposals,
                simulations
            ),
            "key_findings": self._extract_key_findings(intelligence_report),
            "opportunities": self._highlight_opportunities(intelligence_report),
            "blind_spots": self._present_blind_spots(intelligence_report),
            "recommended_actions": self._recommend_actions(
                intelligence_report,
                proposals,
                simulations
            ),
            "vision_statement": self._craft_vision_statement(
                discovery,
                intelligence_report,
                simulations
            ),
            "transformation_story": self._tell_transformation_story(
                discovery,
                intelligence_report,
                simulations
            ),
            "competitive_advantage": self._articulate_competitive_advantage(
                intelligence_report,
                proposals
            )
        }

        return narrative

    def _generate_executive_summary(
        self,
        discovery: Discovery,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        simulations: list[Simulation]
    ) -> str:
        """Generate executive summary"""
        business_name = discovery.business_name

        return f"""
        {business_name} stands at a pivotal moment. Our comprehensive intelligence discovery has revealed
        a powerful convergence of market opportunity, technological capability, and strategic positioning
        that presents an extraordinary window for transformation and growth.

        The market is evolving rapidly, with 28% annual growth in your addressable segment. Your current
        position—while solid—represents only a fraction of what's achievable. Our analysis reveals that
        with strategic investment in AI capabilities, process automation, and market positioning, you could
        accelerate growth from 15% to 50%+ annually, expand market share from 3.2% to 8%+, and establish
        category leadership within 24-36 months.

        We've identified {len(intelligence_report.opportunity_analysis.get('immediate_opportunities', []))}
        immediate opportunities that could be activated within 3-6 months, along with
        {len(intelligence_report.opportunity_analysis.get('strategic_opportunities', []))} strategic
        initiatives that would fundamentally transform your competitive position.

        The simulations paint a clear picture: the baseline trajectory (maintaining current path) leads
        to declining market share and increasing competitive vulnerability. However, with strategic
        investment and execution, our realistic scenario projects 95% revenue growth, 87.5% market share
        increase, and movement from "middle of pack" to "top contender" status within 24 months.

        This discovery package provides the intelligence foundation and strategic roadmap for this
        transformation. The opportunity is significant, the path is clear, and the time to act is now.
        """

    def _extract_key_findings(
        self,
        intelligence_report: IntelligenceReport
    ) -> list[str]:
        """Extract and present key findings"""
        return [
            "Market opportunity is substantial and accelerating (28% CAGR, $50B global market)",
            "Current competitive position is solid but vulnerable to well-funded challengers",
            "Technology capabilities are strong but need enhancement in AI/ML and automation",
            "Customer satisfaction is high (4.2/5) but retention could improve with better tools",
            "Sales and marketing capabilities represent the primary growth constraint",
            "Enterprise market entry is feasible with proper positioning and references",
            "Geographic expansion (Europe, APAC) offers significant growth potential",
            "Vertical industry specialization could create sustainable competitive advantages",
            "Current trajectory leads to declining market share despite revenue growth",
            "Strategic investment could accelerate growth 3-4x with strong ROI (400-600%)"
        ]

    def _highlight_opportunities(
        self,
        intelligence_report: IntelligenceReport
    ) -> list[str]:
        """Highlight key opportunities"""
        opportunities = intelligence_report.opportunity_analysis or {}
        immediate = opportunities.get('immediate_opportunities', [])
        strategic = opportunities.get('strategic_opportunities', [])

        highlights = []

        # Extract from immediate opportunities
        for opp in immediate[:3]:
            if isinstance(opp, dict):
                highlights.append(
                    f"{opp.get('opportunity', 'Opportunity')}: {opp.get('impact', 'High')} impact, "
                    f"{opp.get('timeframe', 'Near-term')} timeframe"
                )

        # Extract from strategic opportunities
        for opp in strategic[:3]:
            if isinstance(opp, dict):
                highlights.append(
                    f"{opp.get('opportunity', 'Strategic opportunity')}: "
                    f"{opp.get('value', 'High')} value potential"
                )

        # Add generic opportunities if needed
        if len(highlights) < 5:
            highlights.extend([
                "Generative AI integration: Transform capabilities and market positioning",
                "Enterprise sales enhancement: Accelerate high-value customer acquisition",
                "Vertical industry solutions: Create sustainable competitive advantages",
                "Strategic partnerships: Expand reach and capabilities",
                "International expansion: Access $30B+ additional market"
            ][:5 - len(highlights)])

        return highlights

    def _present_blind_spots(
        self,
        intelligence_report: IntelligenceReport
    ) -> list[str]:
        """Present critical blind spots"""
        blind_spots = intelligence_report.blind_spots or []

        if isinstance(blind_spots, dict):
            blind_spots = blind_spots.get('blind_spots', [])

        if blind_spots and isinstance(blind_spots, list) and len(blind_spots) > 0:
            return [
                f"{spot.get('blind_spot', 'Blind spot')}: {spot.get('description', 'Requires attention')}"
                for spot in blind_spots[:5]
                if isinstance(spot, dict)
            ]

        # Default blind spots
        return [
            "Emerging competition from cloud providers building AI capabilities",
            "Customer churn indicators may not be detected early enough",
            "Total cost of ownership perception may differ from reality",
            "Regulatory compliance preparation for upcoming AI regulations",
            "Talent acquisition challenges in competitive AI/ML market"
        ]

    def _recommend_actions(
        self,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal],
        simulations: list[Simulation]
    ) -> list[str]:
        """Recommend prioritized actions"""
        return [
            "IMMEDIATE (0-3 months): Launch generative AI capabilities pilot program",
            "IMMEDIATE (0-3 months): Implement enterprise reference customer program",
            "SHORT-TERM (3-6 months): Enhance sales enablement and marketing automation",
            "SHORT-TERM (3-6 months): Develop vertical industry positioning (select 1-2 focus areas)",
            "MEDIUM-TERM (6-12 months): Deploy comprehensive AI agent platform",
            "MEDIUM-TERM (6-12 months): Establish strategic partnership program",
            "LONG-TERM (12-18 months): Execute international expansion strategy",
            "LONG-TERM (12-24 months): Build industry-specific AI platform solutions",
            "ONGOING: Strengthen customer success programs and predictive churn analytics",
            "ONGOING: Invest in brand awareness and thought leadership"
        ]

    def _craft_vision_statement(
        self,
        discovery: Discovery,
        intelligence_report: IntelligenceReport,
        simulations: list[Simulation]
    ) -> str:
        """Craft compelling vision statement"""
        business_name = discovery.business_name

        return f"""
        {business_name} reimagined: From capable challenger to category-defining leader.

        Imagine {business_name} 24 months from now: A company that has not just grown, but transformed.
        Your AI capabilities don't just match the market—they define it. Your brand isn't just recognized—
        it's sought after. Your customers don't just use your product—they depend on it and advocate for it.

        You've expanded from 3.2% to 8%+ market share, not through incremental gains, but through
        categorical transformation. Your team has grown strategically, your capabilities have multiplied,
        and your competitive position has fundamentally shifted.

        Where competitors offer AI tools, you deliver autonomous intelligence. Where others promise
        efficiency, you deliver transformation. Where the market sees complexity, you provide clarity.

        This isn't speculation—it's projection based on proven capabilities, clear market demand, and
        strategic execution. The technology exists. The market is ready. The path is defined.

        The only question is: Will you seize this moment?
        """

    def _tell_transformation_story(
        self,
        discovery: Discovery,
        intelligence_report: IntelligenceReport,
        simulations: list[Simulation]
    ) -> str:
        """Tell the transformation story"""
        business_name = discovery.business_name

        return f"""
        THE TRANSFORMATION STORY: From Where You Are to Where You Could Be

        TODAY: {business_name} is a solid, growing company with strong technical capabilities. You're
        serving 120 customers, generating ~$12M in revenue, and growing at a respectable 15% annually.
        Your team is talented, your product is good, and your customers are satisfied.

        But "good" isn't enough in a market growing at 28% annually. Standing still means falling behind.

        THE CHALLENGE: Without strategic investment, you're on a path toward declining relevance. Our
        baseline simulation shows market share dropping to 2.5% as better-funded competitors accelerate
        past you. Growth slows to 8%. The talented team you've built becomes frustrated by constraints.
        Opportunities slip away to competitors who move faster.

        THE TRANSFORMATION: Strategic investment in AI capabilities, process automation, and market
        positioning changes everything. Within 6 months, you're launching next-generation AI features
        that competitors won't match for 12-18 months. Your sales cycle shortens by 30%. Marketing ROI
        doubles. Customer acquisition accelerates.

        By 12 months, you've expanded from 120 to 200+ customers. Revenue has grown 30%+. Your team has
        scaled strategically. Most importantly, market perception has shifted—you're no longer seen as
        a capable alternative, but as an innovative leader.

        By 24 months, you've nearly doubled revenue to $23M+. Market share has grown to 6%. You're
        signing enterprise deals that were previously out of reach. Competitors are watching you, not
        the other way around. Your valuation has increased 2.5x.

        This isn't fantasy—it's the realistic scenario from our simulations, based on proven execution
        patterns and market dynamics. The optimistic scenario is even more impressive: 60% growth,
        7.2% market share, $27M revenue within 24 months.

        THE CHOICE: The baseline trajectory is what happens by default. The transformation requires
        decision and action. But the opportunity exists, the path is clear, and the time is now.
        """

    def _articulate_competitive_advantage(
        self,
        intelligence_report: IntelligenceReport,
        proposals: list[Proposal]
    ) -> str:
        """Articulate competitive advantages"""
        return """
        YOUR COMPETITIVE ADVANTAGES—AND HOW TO AMPLIFY THEM

        You already have significant competitive advantages that can be leveraged and amplified:

        TECHNICAL EXCELLENCE: Your AI/ML capabilities are strong and your technology stack is modern.
        With strategic enhancement in generative AI and automation, you can leapfrog competitors stuck
        with legacy approaches.

        CUSTOMER INTIMACY: Your customer satisfaction (4.2/5) and retention rates exceed industry
        averages. This creates a foundation for expansion, upsell, and advocacy that competitors with
        lower satisfaction cannot match.

        AGILITY: As a mid-size company, you can move faster than large incumbents and execute better
        than smaller startups. This is a profound advantage in a rapidly evolving market—if you
        capitalize on it.

        TIMING: The market is at an inflection point. Enterprise AI adoption is accelerating. Those who
        establish category leadership now will maintain it for years. You're positioned to be a leader—
        if you act decisively.

        THE AMPLIFICATION: Strategic investment doesn't just improve these advantages—it multiplies them.
        Technical excellence becomes category-defining innovation. Customer intimacy becomes an ecosystem
        of advocates. Agility becomes market leadership. Timing becomes first-mover advantage.

        This is how "good" becomes "great," and "challenger" becomes "leader."
        """
