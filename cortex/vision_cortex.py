"""
Vision Cortex - Main orchestrator for the Infinity Matrix system.

Connects with:
- Crawlers
- Agents (financial, real estate, loan, analytics, NLP)
- Document evolution engine
- Index and taxonomy systems
- Agent registry
- Gateway (omni_router)
- Firestore (vector/relational memory, RAG)
- Smart routing
- Pub/Sub engine for events
"""

import asyncio
import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, dict, list

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class MemoryStore:
    """In-memory and persistent storage manager."""
    vector_memory: dict[str, Any] = field(default_factory=dict)
    relational_memory: dict[str, Any] = field(default_factory=dict)
    document_cache: dict[str, Any] = field(default_factory=dict)

    def store_vector(self, key: str, data: Any) -> None:
        """Store vector data."""
        self.vector_memory[key] = {
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        logger.info(f"Stored vector data: {key}")

    def store_relational(self, key: str, data: Any) -> None:
        """Store relational data."""
        self.relational_memory[key] = {
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        logger.info(f"Stored relational data: {key}")

    def get_vector(self, key: str) -> Any | None:
        """Retrieve vector data."""
        return self.vector_memory.get(key)

    def get_relational(self, key: str) -> Any | None:
        """Retrieve relational data."""
        return self.relational_memory.get(key)


@dataclass
class DocumentEvolutionEngine:
    """Handles document processing, indexing, and taxonomy."""
    documents: dict[str, Any] = field(default_factory=dict)
    index: dict[str, list[str]] = field(default_factory=dict)
    taxonomy: dict[str, list[str]] = field(default_factory=dict)

    def process_document(self, doc_id: str, content: str) -> None:
        """Process and index a document."""
        self.documents[doc_id] = {
            "content": content,
            "processed_at": datetime.utcnow().isoformat()
        }
        self._update_index(doc_id, content)
        self._update_taxonomy(doc_id, content)
        logger.info(f"Processed document: {doc_id}")

    def _update_index(self, doc_id: str, content: str) -> None:
        """Update document index."""
        words = content.lower().split()
        for word in set(words):
            if word not in self.index:
                self.index[word] = []
            if doc_id not in self.index[word]:
                self.index[word].append(doc_id)

    def _update_taxonomy(self, doc_id: str, content: str) -> None:
        """Update document taxonomy."""
        # Simple category detection
        categories = []
        if "financial" in content.lower():
            categories.append("financial")
        if "real estate" in content.lower() or "property" in content.lower():
            categories.append("real_estate")
        if "loan" in content.lower() or "mortgage" in content.lower():
            categories.append("loan")

        for category in categories:
            if category not in self.taxonomy:
                self.taxonomy[category] = []
            if doc_id not in self.taxonomy[category]:
                self.taxonomy[category].append(doc_id)

    def search(self, query: str) -> list[str]:
        """Search documents by query."""
        words = query.lower().split()
        results = set()
        for word in words:
            if word in self.index:
                results.update(self.index[word])
        return list(results)


class VisionCortex:
    """Main orchestrator for the Infinity Matrix system."""

    def __init__(self):
        self.memory_store = MemoryStore()
        self.doc_engine = DocumentEvolutionEngine()
        self.agents: dict[str, Any] = {}
        self.event_subscribers: dict[str, list[callable]] = {}
        self.is_running = False
        self.gateway = None
        self.registry = None
        logger.info("Vision Cortex initialized")

    def connect_gateway(self, gateway) -> None:
        """Connect to the Omni Router gateway."""
        self.gateway = gateway
        logger.info("Connected to Omni Router gateway")

    def connect_registry(self, registry) -> None:
        """Connect to the Agent Registry."""
        self.registry = registry
        logger.info("Connected to Agent Registry")

    def register_agent(self, agent_id: str, agent_info: dict[str, Any]) -> None:
        """Register an agent with the cortex."""
        self.agents[agent_id] = {
            "info": agent_info,
            "registered_at": datetime.utcnow().isoformat(),
            "status": "active"
        }
        logger.info(f"Registered agent: {agent_id}")
        self.publish_event("agent_registered", {"agent_id": agent_id, "info": agent_info})

    def unregister_agent(self, agent_id: str) -> None:
        """Unregister an agent."""
        if agent_id in self.agents:
            self.agents[agent_id]["status"] = "inactive"
            logger.info(f"Unregistered agent: {agent_id}")
            self.publish_event("agent_unregistered", {"agent_id": agent_id})

    def get_agent(self, agent_id: str) -> dict[str, Any] | None:
        """Get agent information."""
        return self.agents.get(agent_id)

    def list_agents(self, status: str | None = None) -> list[dict[str, Any]]:
        """list all agents, optionally filtered by status."""
        if status:
            return [
                {"id": aid, **adata}
                for aid, adata in self.agents.items()
                if adata.get("status") == status
            ]
        return [{"id": aid, **adata} for aid, adata in self.agents.items()]

    def subscribe_to_event(self, event_type: str, callback: callable) -> None:
        """Subscribe to system events."""
        if event_type not in self.event_subscribers:
            self.event_subscribers[event_type] = []
        self.event_subscribers[event_type].append(callback)
        logger.info(f"Subscribed to event: {event_type}")

    def publish_event(self, event_type: str, data: dict[str, Any]) -> None:
        """Publish an event to subscribers."""
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        logger.info(f"Publishing event: {event_type}")

        if event_type in self.event_subscribers:
            for callback in self.event_subscribers[event_type]:
                try:
                    callback(event)
                except Exception as e:
                    logger.error(f"Error in event callback: {e}")

    def load_documents(self, doc_path: str) -> None:
        """Load documents from a directory."""
        import os
        if not os.path.exists(doc_path):
            logger.warning(f"Document path not found: {doc_path}")
            return

        for root, _dirs, files in os.walk(doc_path):
            for file in files:
                if file.endswith(('.md', '.txt', '.rst')):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path) as f:
                            content = f.read()
                        doc_id = os.path.relpath(file_path, doc_path)
                        self.doc_engine.process_document(doc_id, content)
                    except Exception as e:
                        logger.error(f"Error loading document {file_path}: {e}")

        logger.info(f"Loaded documents from: {doc_path}")
        self.publish_event("documents_loaded", {"path": doc_path})

    async def start(self) -> None:
        """Start the Vision Cortex."""
        if self.is_running:
            logger.warning("Vision Cortex already running")
            return

        self.is_running = True
        logger.info("Vision Cortex started")
        self.publish_event("cortex_started", {})

        # Load documentation on boot
        import os
        repo_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        docs_path = os.path.join(repo_path, "docs")
        if os.path.exists(docs_path):
            self.load_documents(docs_path)

    async def stop(self) -> None:
        """Stop the Vision Cortex."""
        if not self.is_running:
            logger.warning("Vision Cortex not running")
            return

        self.is_running = False
        logger.info("Vision Cortex stopped")
        self.publish_event("cortex_stopped", {})

    def get_status(self) -> dict[str, Any]:
        """Get system status."""
        return {
            "status": "running" if self.is_running else "stopped",
            "agents": len(self.agents),
            "active_agents": len([a for a in self.agents.values() if a.get("status") == "active"]),
            "documents": len(self.doc_engine.documents),
            "memory_vectors": len(self.memory_store.vector_memory),
            "memory_relations": len(self.memory_store.relational_memory),
            "timestamp": datetime.utcnow().isoformat()
        }

    async def route_request(self, request: dict[str, Any]) -> dict[str, Any]:
        """Route a request through the gateway."""
        if not self.gateway:
            return {"error": "Gateway not connected"}

        # Use smart routing through gateway
        return await self.gateway.route(request)


# Singleton instance
_cortex_instance: VisionCortex | None = None


def get_cortex() -> VisionCortex:
    """Get or create the Vision Cortex singleton instance."""
    global _cortex_instance
    if _cortex_instance is None:
        _cortex_instance = VisionCortex()
    return _cortex_instance


async def main():
    """Main entry point for Vision Cortex."""
    cortex = get_cortex()
    await cortex.start()

    try:
        # Keep running
        while cortex.is_running:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Received shutdown signal")
    finally:
        await cortex.stop()


if __name__ == "__main__":
    asyncio.run(main())
