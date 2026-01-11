"""
System Launcher - Starts all components of the Infinity Matrix system.
"""

import asyncio
import logging
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent_registry import get_registry
from agents.analytics_agent import AnalyticsAgent
from agents.financial_agent import FinancialAgent
from agents.loan_agent import LoanAgent
from agents.nlp_agent import NLPAgent
from agents.real_estate_agent import RealEstateAgent
from api_server import APIServer
from cortex.firestore_integration import get_firestore
from cortex.pubsub_integration import get_pubsub
from cortex.vision_cortex import get_cortex
from gateway.omni_router import get_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class SystemLauncher:
    """Launches and manages all system components."""

    def __init__(self):
        self.cortex = None
        self.gateway = None
        self.registry = None
        self.firestore = None
        self.pubsub = None
        self.api_server = None
        self.agents = []
        logger.info("System Launcher initialized")

    async def initialize_infrastructure(self):
        """Initialize core infrastructure components."""
        logger.info("Initializing infrastructure...")

        # Initialize Firestore
        self.firestore = get_firestore()
        await self.firestore.connect()

        # Initialize Pub/Sub
        self.pubsub = get_pubsub()
        await self.pubsub.connect()

        # Create standard topics
        await self.pubsub.create_topic("agent_events")
        await self.pubsub.create_topic("cortex_events")
        await self.pubsub.create_topic("memory_events")
        await self.pubsub.create_topic("document_events")

        logger.info("Infrastructure initialized")

    async def initialize_core_components(self):
        """Initialize core system components."""
        logger.info("Initializing core components...")

        # Initialize Vision Cortex
        self.cortex = get_cortex()

        # Initialize Gateway
        self.gateway = get_router()

        # Initialize Registry
        self.registry = get_registry()

        # Connect components
        self.cortex.connect_gateway(self.gateway)
        self.cortex.connect_registry(self.registry)
        self.registry.connect_cortex(self.cortex)

        # Start components
        await self.cortex.start()
        await self.gateway.start()
        await self.registry.start()

        logger.info("Core components initialized")

    async def initialize_agents(self):
        """Initialize and register agents."""
        logger.info("Initializing agents...")

        # Create agents
        self.agents = [
            FinancialAgent(),
            RealEstateAgent(),
            LoanAgent(),
            AnalyticsAgent(),
            NLPAgent()
        ]

        # Connect and start agents
        for agent in self.agents:
            agent.connect_registry(self.registry)
            agent.connect_cortex(self.cortex)
            await agent.start()

        logger.info(f"Initialized {len(self.agents)} agents")

    async def setup_event_subscriptions(self):
        """Setup event subscriptions between components."""
        logger.info("Setting up event subscriptions...")

        # Subscribe cortex to agent events
        async def handle_agent_event(message):
            logger.info(f"Cortex received agent event: {message.data}")

        await self.pubsub.subscribe(
            "cortex-agent-sub",
            "agent_events",
            handle_agent_event
        )

        # Subscribe to memory events
        async def handle_memory_event(message):
            logger.info(f"Memory event: {message.data}")

        await self.pubsub.subscribe(
            "memory-event-sub",
            "memory_events",
            handle_memory_event
        )

        logger.info("Event subscriptions configured")

    async def initialize_api_server(self):
        """Initialize API server."""
        logger.info("Initializing API server...")

        self.api_server = APIServer()
        self.api_server.connect_components(self.cortex, self.gateway, self.registry)

        try:
            await self.api_server.start()
        except Exception as e:
            logger.warning(f"Could not start API server: {e}")

    async def start(self):
        """Start the entire system."""
        logger.info("=" * 60)
        logger.info("Starting Infinity Matrix System")
        logger.info("=" * 60)

        try:
            # Initialize infrastructure
            await self.initialize_infrastructure()

            # Initialize core components
            await self.initialize_core_components()

            # Initialize agents
            await self.initialize_agents()

            # Setup event subscriptions
            await self.setup_event_subscriptions()

            # Initialize API server
            await self.initialize_api_server()

            # Print system summary
            self.print_system_summary()

            logger.info("=" * 60)
            logger.info("System startup complete!")
            logger.info("=" * 60)

        except Exception as e:
            logger.error(f"Error during startup: {e}", exc_info=True)
            raise

    async def stop(self):
        """Stop the entire system."""
        logger.info("=" * 60)
        logger.info("Stopping Infinity Matrix System")
        logger.info("=" * 60)

        # Stop agents
        for agent in self.agents:
            try:
                await agent.stop()
            except Exception as e:
                logger.error(f"Error stopping agent {agent.agent_id}: {e}")

        # Stop API server
        if self.api_server:
            try:
                await self.api_server.stop()
            except Exception as e:
                logger.error(f"Error stopping API server: {e}")

        # Stop core components
        if self.registry:
            await self.registry.stop()

        if self.gateway:
            await self.gateway.stop()

        if self.cortex:
            await self.cortex.stop()

        # Disconnect infrastructure
        if self.pubsub:
            await self.pubsub.disconnect()

        if self.firestore:
            await self.firestore.disconnect()

        logger.info("=" * 60)
        logger.info("System shutdown complete")
        logger.info("=" * 60)

    def print_system_summary(self):
        """Print system summary."""
        logger.info("")
        logger.info("SYSTEM SUMMARY")
        logger.info("-" * 60)

        # Cortex status
        if self.cortex:
            status = self.cortex.get_status()
            logger.info(f"Vision Cortex: {status['status']}")
            logger.info(f"  - Agents: {status['agents']}")
            logger.info(f"  - Documents: {status['documents']}")
            logger.info(f"  - Memory vectors: {status['memory_vectors']}")

        # Gateway status
        if self.gateway:
            status = self.gateway.get_status()
            logger.info(f"Omni Router: {status['status']}")
            logger.info(f"  - Routes: {status['routes']}")
            logger.info(f"  - Policies: {status['policies']}")

        # Registry status
        if self.registry:
            status = self.registry.get_status()
            logger.info(f"Agent Registry: {status['status']}")
            logger.info(f"  - Total agents: {status['total_agents']}")
            logger.info(f"  - By status: {status['agents_by_status']}")
            logger.info(f"  - By type: {status['agents_by_type']}")

        # Firestore status
        if self.firestore:
            status = self.firestore.get_status()
            logger.info(f"Firestore: {'connected' if status['connected'] else 'disconnected'}")
            logger.info(f"  - Vector documents: {status['vector_documents']}")

        # Pub/Sub status
        if self.pubsub:
            status = self.pubsub.get_status()
            logger.info(f"Pub/Sub: {'connected' if status['connected'] else 'disconnected'}")
            logger.info(f"  - Topics: {status['topics']}")
            logger.info(f"  - Subscriptions: {status['subscriptions']}")

        # API endpoints
        logger.info("")
        logger.info("API ENDPOINTS")
        logger.info("-" * 60)
        logger.info("  - Status: http://localhost:8080/api/status")
        logger.info("  - Agents: http://localhost:8080/api/agents")
        logger.info("  - Routes: http://localhost:8080/api/routes")
        logger.info("  - Dashboard: http://localhost:8080/api/dashboard")
        logger.info("")


async def main():
    """Main entry point."""
    launcher = SystemLauncher()

    try:
        await launcher.start()

        # Keep running
        logger.info("System is running. Press Ctrl+C to stop.")
        while True:
            await asyncio.sleep(1)

    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
    finally:
        await launcher.stop()


if __name__ == "__main__":
    asyncio.run(main())
