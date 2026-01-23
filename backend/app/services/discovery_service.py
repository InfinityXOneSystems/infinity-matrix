"""
Discovery Service - Orchestrates the entire discovery process
"""
import logging
from datetime import datetime

from app.intelligence.business_analyzer import BusinessAnalyzer
from app.intelligence.competitive_analyzer import CompetitiveAnalyzer
from app.intelligence.data_crawler import DataCrawler
from app.intelligence.market_analyzer import MarketAnalyzer
from app.intelligence.narrative_generator import NarrativeGenerator
from app.intelligence.opportunity_analyzer import OpportunityAnalyzer
from app.intelligence.proposal_generator import ProposalGenerator
from app.intelligence.simulation_engine import SimulationEngine
from app.models.models import Discovery, DiscoveryStatus, IntelligenceReport, Proposal, Simulation
from app.models.schemas import ComprehensiveDiscoveryPack
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)


class DiscoveryService:
    """Main discovery service orchestrator"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.crawler = DataCrawler()
        self.business_analyzer = BusinessAnalyzer()
        self.competitive_analyzer = CompetitiveAnalyzer()
        self.market_analyzer = MarketAnalyzer()
        self.opportunity_analyzer = OpportunityAnalyzer()
        self.proposal_generator = ProposalGenerator()
        self.simulation_engine = SimulationEngine()
        self.narrative_generator = NarrativeGenerator()

    async def run_discovery(self, discovery_id: int):
        """
        Run the complete discovery process:
        1. Crawl and discover public information
        2. Analyze business, competitive, and market intelligence
        3. Generate reports and identify opportunities
        4. Create proposals and simulations
        5. Build narrative presentations
        """
        try:
            # Get discovery
            result = await self.db.execute(
                select(Discovery).where(Discovery.id == discovery_id)
            )
            discovery = result.scalar_one_or_none()

            if not discovery:
                logger.error(f"Discovery {discovery_id} not found")
                return

            # Update status
            discovery.status = DiscoveryStatus.IN_PROGRESS
            await self.db.commit()

            logger.info(f"Starting discovery for {discovery.business_name} (ID: {discovery_id})")

            # Phase 1: Data Discovery and Crawling
            logger.info("Phase 1: Data discovery and crawling")
            crawled_data = await self.crawler.discover_and_crawl(
                client_name=discovery.client_name,
                business_name=discovery.business_name,
                discovery_id=discovery_id,
                db=self.db
            )

            # Phase 2: Intelligence Analysis
            logger.info("Phase 2: Intelligence analysis")

            business_analysis = await self.business_analyzer.analyze(
                business_name=discovery.business_name,
                crawled_data=crawled_data
            )

            competitive_analysis = await self.competitive_analyzer.analyze(
                business_name=discovery.business_name,
                crawled_data=crawled_data
            )

            market_analysis = await self.market_analyzer.analyze(
                business_name=discovery.business_name,
                crawled_data=crawled_data
            )

            gap_analysis = await self.opportunity_analyzer.detect_gaps(
                business_analysis=business_analysis,
                competitive_analysis=competitive_analysis,
                market_analysis=market_analysis
            )

            opportunity_analysis = await self.opportunity_analyzer.identify_opportunities(
                gap_analysis=gap_analysis,
                market_analysis=market_analysis
            )

            # Create intelligence report
            logger.info("Creating intelligence report")
            intelligence_report = IntelligenceReport(
                discovery_id=discovery_id,
                business_analysis=business_analysis,
                competitive_analysis=competitive_analysis,
                market_analysis=market_analysis,
                gap_analysis=gap_analysis,
                opportunity_analysis=opportunity_analysis,
                financial_intelligence=business_analysis.get("financial_data", {}),
                blind_spots=gap_analysis.get("blind_spots", {}),
                confidence_score=self._calculate_confidence(crawled_data)
            )
            self.db.add(intelligence_report)
            await self.db.commit()

            # Phase 3: AI-Powered Generation
            logger.info("Phase 3: Generating proposals")

            proposals = await self.proposal_generator.generate_proposals(
                discovery_id=discovery_id,
                intelligence_report=intelligence_report,
                db=self.db
            )

            # Phase 4: Simulations
            logger.info("Phase 4: Running simulations")

            simulations = await self.simulation_engine.run_simulations(
                discovery_id=discovery_id,
                intelligence_report=intelligence_report,
                proposals=proposals,
                db=self.db
            )

            # Phase 5: Complete discovery data
            discovery.discovery_data = {
                "crawled_sources": len(crawled_data),
                "intelligence_report_id": intelligence_report.id,
                "proposal_count": len(proposals),
                "simulation_count": len(simulations),
                "completion_time": datetime.utcnow().isoformat()
            }

            discovery.status = DiscoveryStatus.COMPLETED
            discovery.completed_at = datetime.utcnow()
            await self.db.commit()

            logger.info(f"Discovery {discovery_id} completed successfully")

        except Exception as e:
            logger.error(f"Discovery {discovery_id} failed: {str(e)}", exc_info=True)

            # Update discovery with error
            result = await self.db.execute(
                select(Discovery).where(Discovery.id == discovery_id)
            )
            discovery = result.scalar_one_or_none()
            if discovery:
                discovery.status = DiscoveryStatus.FAILED
                discovery.error_message = str(e)
                await self.db.commit()

    async def get_comprehensive_pack(self, discovery_id: int) -> ComprehensiveDiscoveryPack:
        """Get the complete discovery package with narratives"""
        # Get discovery
        result = await self.db.execute(
            select(Discovery).where(Discovery.id == discovery_id)
        )
        discovery = result.scalar_one_or_none()

        if not discovery or discovery.status != DiscoveryStatus.COMPLETED:
            return None

        # Get intelligence report
        result = await self.db.execute(
            select(IntelligenceReport)
            .where(IntelligenceReport.discovery_id == discovery_id)
            .order_by(IntelligenceReport.created_at.desc())
        )
        intelligence_report = result.scalar_one_or_none()

        # Get proposals
        result = await self.db.execute(
            select(Proposal)
            .where(Proposal.discovery_id == discovery_id)
            .order_by(Proposal.created_at.desc())
        )
        proposals = result.scalars().all()

        # Get simulations
        result = await self.db.execute(
            select(Simulation)
            .where(Simulation.discovery_id == discovery_id)
            .order_by(Simulation.created_at.desc())
        )
        simulations = result.scalars().all()

        # Generate narrative summaries
        narrative_data = await self.narrative_generator.generate_comprehensive_narrative(
            discovery=discovery,
            intelligence_report=intelligence_report,
            proposals=proposals,
            simulations=simulations
        )

        return ComprehensiveDiscoveryPack(
            discovery=discovery,
            intelligence_report=intelligence_report,
            proposals=list(proposals),
            simulations=list(simulations),
            **narrative_data
        )

    def _calculate_confidence(self, crawled_data: list) -> float:
        """Calculate confidence score based on data quality and quantity"""
        if not crawled_data:
            return 0.0

        # Simple confidence calculation
        # In production, this would be more sophisticated
        data_sources = len(crawled_data)
        base_confidence = min(data_sources / 20.0, 1.0)  # Max at 20 sources

        return round(base_confidence * 100, 2)
