"""
Vision Cortex - Core Multi-Agent Orchestration System

This is the central orchestrator for the Infinity-Matrix autonomous system.
It manages all agents, coordinates their interactions, facilitates debates,
and ensures autonomous operations.
"""

import asyncio
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, dict, list

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from ai_stack.agents.ceo_agent import CEOAgent
from ai_stack.agents.crawler_agent import CrawlerAgent
from ai_stack.agents.documentor_agent import DocumentorAgent
from ai_stack.agents.ingestion_agent import IngestionAgent
from ai_stack.agents.organizer_agent import OrganizerAgent
from ai_stack.agents.predictor_agent import PredictorAgent
from ai_stack.agents.strategist_agent import StrategistAgent
from ai_stack.agents.validator_agent import ValidatorAgent
from ai_stack.vision_cortex.config import Config
from ai_stack.vision_cortex.logger import setup_logger
from ai_stack.vision_cortex.state_manager import StateManager

logger = setup_logger(__name__)


class VisionCortex:
    """
    Central orchestration hub for the multi-agent system.

    Manages agent lifecycle, coordinates inter-agent communication,
    facilitates debates, and ensures system autonomy.
    """

    def __init__(self, config: Config | None = None):
        """Initialize Vision Cortex with configuration."""
        self.config = config or Config()
        self.state_manager = StateManager(self.config)
        self.agents: dict[str, Any] = {}
        self.running = False

        logger.info("Initializing Vision Cortex...")
        self._initialize_agents()

    def _initialize_agents(self):
        """Initialize all agent modules."""
        logger.info("Initializing agent modules...")

        try:
            # Data collection and processing agents
            self.agents['crawler'] = CrawlerAgent(self.config)
            self.agents['ingestion'] = IngestionAgent(self.config)
            self.agents['predictor'] = PredictorAgent(self.config)

            # Executive decision-making agents
            self.agents['ceo'] = CEOAgent(self.config)
            self.agents['strategist'] = StrategistAgent(self.config)
            self.agents['organizer'] = OrganizerAgent(self.config)

            # Support agents
            self.agents['validator'] = ValidatorAgent(self.config)
            self.agents['documentor'] = DocumentorAgent(self.config)

            logger.info(f"Initialized {len(self.agents)} agents successfully")

        except Exception as e:
            logger.error(f"Error initializing agents: {e}")
            raise

    async def start(self):
        """Start the Vision Cortex system."""
        logger.info("Starting Vision Cortex system...")
        self.running = True

        try:
            # Start all agents
            for agent_name, agent in self.agents.items():
                logger.info(f"Starting {agent_name} agent...")
                await agent.start()

            # Log system start
            self.state_manager.log_event(
                event_type="system_start",
                message="Vision Cortex system started successfully",
                metadata={"agents": list(self.agents.keys())}
            )

            # Main orchestration loop
            await self._orchestration_loop()

        except KeyboardInterrupt:
            logger.info("Received shutdown signal...")
        except Exception as e:
            logger.error(f"Error in Vision Cortex: {e}", exc_info=True)
        finally:
            await self.stop()

    async def _orchestration_loop(self):
        """Main orchestration loop for agent coordination."""
        logger.info("Entering orchestration loop...")

        while self.running:
            try:
                # Check system health
                await self._check_system_health()

                # Execute agent tasks
                await self._execute_agent_cycle()

                # Facilitate inter-agent debates
                await self._facilitate_debate()

                # Generate reports and documentation
                await self._generate_reports()

                # Self-optimization check
                await self._self_optimize()

                # Sleep before next cycle
                await asyncio.sleep(self.config.orchestration_cycle_interval)

            except Exception as e:
                logger.error(f"Error in orchestration loop: {e}", exc_info=True)
                await asyncio.sleep(5)

    async def _check_system_health(self) -> dict[str, Any]:
        """Check health status of all agents."""
        health_status = {}

        for agent_name, agent in self.agents.items():
            try:
                status = await agent.health_check()
                health_status[agent_name] = status
            except Exception as e:
                logger.error(f"Health check failed for {agent_name}: {e}")
                health_status[agent_name] = {"status": "unhealthy", "error": str(e)}

        return health_status

    async def _execute_agent_cycle(self):
        """Execute a cycle of agent tasks."""
        logger.debug("Executing agent cycle...")

        # Gather data (crawler and ingestion)
        crawled_data = await self.agents['crawler'].execute()
        processed_data = await self.agents['ingestion'].process(crawled_data)

        # Make predictions
        predictions = await self.agents['predictor'].predict(processed_data)

        # Strategic decision making
        strategic_plan = await self.agents['strategist'].plan(predictions)

        # CEO approval and prioritization
        approved_plan = await self.agents['ceo'].approve(strategic_plan)

        # Organize and schedule tasks
        organized_tasks = await self.agents['organizer'].organize(approved_plan)

        # Validate outputs
        validation_results = await self.agents['validator'].validate(organized_tasks)

        # Generate documentation
        await self.agents['documentor'].document(validation_results)

    async def _facilitate_debate(self):
        """Facilitate inter-agent debates for decision making."""
        logger.debug("Facilitating agent debate...")

        # Get current issues requiring consensus
        issues = self.state_manager.get_pending_issues()

        for issue in issues:
            debate_participants = [
                self.agents['ceo'],
                self.agents['strategist'],
                self.agents['validator']
            ]

            debate_rounds = self.config.agent_debate_rounds
            consensus = await self._conduct_debate(issue, debate_participants, debate_rounds)

            if consensus:
                self.state_manager.resolve_issue(issue['id'], consensus)

    async def _conduct_debate(
        self,
        issue: dict[str, Any],
        participants: list[Any],
        rounds: int
    ) -> dict[str, Any] | None:
        """Conduct a structured debate between agents."""
        logger.info(f"Conducting debate on issue: {issue['title']}")

        positions = []

        for round_num in range(rounds):
            logger.debug(f"Debate round {round_num + 1}/{rounds}")

            for agent in participants:
                position = await agent.debate(issue, positions)
                positions.append({
                    'agent': agent.name,
                    'round': round_num + 1,
                    'position': position
                })

            # Check for consensus
            if self._check_consensus(positions):
                return self._extract_consensus(positions)

        # No consensus reached, escalate to CEO
        logger.warning(f"No consensus reached for issue: {issue['title']}, escalating to CEO")
        final_decision = await self.agents['ceo'].decide(issue, positions)
        return final_decision

    def _check_consensus(self, positions: list[dict[str, Any]]) -> bool:
        """Check if consensus has been reached among agents."""
        if len(positions) < 3:
            return False

        # Simple consensus: majority agreement in last round
        last_round_positions = [p for p in positions if p['round'] == max(p['round'] for p in positions)]

        # Implementation would check similarity of positions
        # For now, return True if we have enough positions
        return len(last_round_positions) >= 3

    def _extract_consensus(self, positions: list[dict[str, Any]]) -> dict[str, Any]:
        """Extract consensus decision from debate positions."""
        last_round = max(p['round'] for p in positions)
        last_positions = [p for p in positions if p['round'] == last_round]

        return {
            'decision': 'consensus_reached',
            'positions': last_positions,
            'timestamp': datetime.utcnow().isoformat()
        }

    async def _generate_reports(self):
        """Generate system reports and documentation."""
        logger.debug("Generating reports...")

        # Generate status report
        status = {
            'timestamp': datetime.utcnow().isoformat(),
            'agents': {name: agent.get_status() for name, agent in self.agents.items()},
            'system_health': await self._check_system_health()
        }

        # Save report
        self.state_manager.save_report(status)

    async def _self_optimize(self):
        """Perform self-optimization checks and improvements."""
        logger.debug("Running self-optimization...")

        # Analyze system performance
        performance_metrics = self.state_manager.get_performance_metrics()

        # Identify optimization opportunities
        optimizations = await self.agents['strategist'].identify_optimizations(performance_metrics)

        # Apply safe optimizations
        for optimization in optimizations:
            if optimization.get('safe', False):
                logger.info(f"Applying optimization: {optimization['name']}")
                await self._apply_optimization(optimization)

    async def _apply_optimization(self, optimization: dict[str, Any]):
        """Apply a system optimization."""
        # Implementation would apply the optimization
        logger.info(f"Optimization applied: {optimization}")
        self.state_manager.log_event(
            event_type="optimization",
            message=f"Applied optimization: {optimization['name']}",
            metadata=optimization
        )

    async def stop(self):
        """Stop the Vision Cortex system."""
        logger.info("Stopping Vision Cortex system...")
        self.running = False

        # Stop all agents
        for agent_name, agent in self.agents.items():
            logger.info(f"Stopping {agent_name} agent...")
            await agent.stop()

        # Log system stop
        self.state_manager.log_event(
            event_type="system_stop",
            message="Vision Cortex system stopped",
            metadata={}
        )

        logger.info("Vision Cortex stopped successfully")


async def main():
    """Main entry point for Vision Cortex."""
    logger.info("=" * 80)
    logger.info("Infinity-Matrix Vision Cortex - Autonomous Multi-Agent System")
    logger.info("=" * 80)

    config = Config()
    cortex = VisionCortex(config)

    try:
        await cortex.start()
    except KeyboardInterrupt:
        logger.info("Shutdown requested by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
