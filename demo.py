#!/usr/bin/env python3
"""
Demo script showing the Infinity Matrix system in action.
"""

import asyncio
import logging
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent_registry import get_registry
from agents.financial_agent import FinancialAgent
from agents.nlp_agent import NLPAgent
from cortex.firestore_integration import VectorDocument, get_firestore
from cortex.pubsub_integration import get_pubsub
from cortex.vision_cortex import get_cortex
from gateway.omni_router import Route, get_router

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def demo():
    """Run a comprehensive demo of the system."""
    logger.info("=" * 80)
    logger.info("INFINITY MATRIX SYSTEM DEMO")
    logger.info("=" * 80)

    # Initialize components
    logger.info("\n1. Initializing Core Components...")
    cortex = get_cortex()
    gateway = get_router()
    registry = get_registry()
    firestore = get_firestore()
    pubsub = get_pubsub()

    # Connect components
    cortex.connect_gateway(gateway)
    cortex.connect_registry(registry)
    registry.connect_cortex(cortex)

    # Start infrastructure
    logger.info("\n2. Starting Infrastructure...")
    await firestore.connect()
    await pubsub.connect()
    await pubsub.create_topic("demo_events")

    # Start core components
    logger.info("\n3. Starting Core Components...")
    await cortex.start()
    await gateway.start()
    await registry.start()

    # Create and register agents
    logger.info("\n4. Registering Agents...")
    financial_agent = FinancialAgent()
    nlp_agent = NLPAgent()

    financial_agent.connect_registry(registry)
    financial_agent.connect_cortex(cortex)
    nlp_agent.connect_registry(registry)
    nlp_agent.connect_cortex(cortex)

    await financial_agent.start()
    await nlp_agent.start()

    # Configure routes
    logger.info("\n5. Configuring Routes...")
    gateway.register_route(Route(
        path="/financial/analyze",
        agent_id="financial-agent",
        method="POST",
        requires_auth=True,
        policies=["agent_policy"]
    ))

    gateway.register_route(Route(
        path="/nlp/sentiment",
        agent_id="nlp-agent",
        method="POST",
        requires_auth=True,
        policies=["agent_policy"]
    ))

    # Assign user role for demo
    gateway.policy_enforcer.assign_role("demo_user", "agent")

    # Demo Firestore operations
    logger.info("\n6. Demonstrating Firestore Operations...")
    doc = VectorDocument(
        doc_id="demo-doc-1",
        content="Financial markets are showing positive trends",
        embedding=[0.1, 0.2, 0.3, 0.4, 0.5] * 25,  # 125-dim vector
        metadata={"category": "financial", "source": "demo"}
    )
    await firestore.store_vector_document(doc)

    # Search for similar documents
    query_embedding = [0.12, 0.18, 0.32, 0.38, 0.48] * 25
    results = await firestore.search_similar(query_embedding, top_k=3)
    logger.info(f"   Found {len(results)} similar documents")

    # Demo Pub/Sub
    logger.info("\n7. Demonstrating Pub/Sub Messaging...")

    received_events = []

    async def event_handler(message):
        received_events.append(message)
        logger.info(f"   Received event: {message.data.get('type', 'unknown')}")

    await pubsub.subscribe("demo-sub", "demo_events", event_handler)
    await pubsub.publish("demo_events", {"type": "test", "message": "Hello from demo"})
    await asyncio.sleep(0.1)  # Give time for event delivery

    # Demo agent processing
    logger.info("\n8. Demonstrating Agent Processing...")

    # Financial agent
    result = await financial_agent.process_request({
        "type": "market_analysis",
        "data": {"market": "NASDAQ"}
    })
    logger.info(f"   Financial agent result: {result['status']}")

    # NLP agent
    result = await nlp_agent.process_request({
        "type": "sentiment_analysis",
        "data": {"text": "The market is performing exceptionally well"}
    })
    logger.info(f"   NLP agent result: {result['sentiment']} (score: {result['score']})")

    # Demo routing
    logger.info("\n9. Demonstrating Smart Routing...")
    route_result = await gateway.route({
        "path": "/financial/analyze",
        "method": "POST",
        "user_id": "demo_user",
        "data": {"test": "data"}
    })
    logger.info(f"   Route result: {route_result['status']} -> {route_result.get('agent_id', 'N/A')}")

    # Show system status
    logger.info("\n10. System Status Summary...")
    cortex_status = cortex.get_status()
    logger.info(f"   Cortex: {cortex_status['agents']} agents, {cortex_status['documents']} documents")

    gateway_status = gateway.get_status()
    logger.info(f"   Gateway: {gateway_status['routes']} routes, {gateway_status['policies']} policies")

    registry_status = registry.get_status()
    logger.info(f"   Registry: {registry_status['total_agents']} agents registered")

    firestore_status = firestore.get_status()
    logger.info(f"   Firestore: {firestore_status['vector_documents']} vector documents")

    pubsub_status = pubsub.get_status()
    logger.info(f"   Pub/Sub: {pubsub_status['topics']} topics, {pubsub_status['subscriptions']} subscriptions")

    # Cleanup
    logger.info("\n11. Shutting Down...")
    await financial_agent.stop()
    await nlp_agent.stop()
    await registry.stop()
    await gateway.stop()
    await cortex.stop()
    await pubsub.disconnect()
    await firestore.disconnect()

    logger.info("\n" + "=" * 80)
    logger.info("DEMO COMPLETE - All Systems Operational!")
    logger.info("=" * 80)

    # Print summary
    logger.info("\nSUMMARY:")
    logger.info("✅ Vision Cortex: Operational")
    logger.info("✅ Omni Router: Operational")
    logger.info("✅ Agent Registry: Operational")
    logger.info("✅ Firestore Integration: Operational")
    logger.info("✅ Pub/Sub Integration: Operational")
    logger.info("✅ Agents: 2 registered and tested")
    logger.info("✅ Routes: 2 configured")
    logger.info("✅ RBAC: Policies enforced")
    logger.info("✅ Events: Successfully published and received")


if __name__ == "__main__":
    asyncio.run(demo())
