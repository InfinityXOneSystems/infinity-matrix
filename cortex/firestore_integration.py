"""
Firestore Integration - Vector and relational memory with RAG support.

Handles:
- Firestore connection and management
- Vector memory storage and retrieval
- Relational data storage
- RAG (Retrieval-Augmented Generation) support
- Document ingestion
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, dict, list

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class VectorDocument:
    """Document with vector embedding."""
    doc_id: str
    content: str
    embedding: list[float]
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())


@dataclass
class QueryResult:
    """Vector search result."""
    doc_id: str
    content: str
    similarity: float
    metadata: dict[str, Any] = field(default_factory=dict)


class FirestoreIntegration:
    """Manages Firestore connections and operations."""

    def __init__(self, project_id: str | None = None):
        self.project_id = project_id or "infinity-matrix-default"
        self.vector_store: dict[str, VectorDocument] = {}
        self.relational_store: dict[str, dict[str, Any]] = {}
        self.is_connected = False
        logger.info(f"Firestore Integration initialized (project: {self.project_id})")

    async def connect(self) -> bool:
        """Connect to Firestore."""
        # In production, this would initialize the actual Firestore client
        # For now, we use in-memory storage as a mock
        self.is_connected = True
        logger.info("Connected to Firestore (mock mode)")
        return True

    async def disconnect(self) -> None:
        """Disconnect from Firestore."""
        self.is_connected = False
        logger.info("Disconnected from Firestore")

    async def store_vector_document(self, doc: VectorDocument) -> bool:
        """Store a document with vector embedding."""
        if not self.is_connected:
            logger.error("Not connected to Firestore")
            return False

        self.vector_store[doc.doc_id] = doc
        logger.info(f"Stored vector document: {doc.doc_id}")
        return True

    async def get_vector_document(self, doc_id: str) -> VectorDocument | None:
        """Retrieve a vector document by ID."""
        return self.vector_store.get(doc_id)

    async def search_similar(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        threshold: float = 0.0
    ) -> list[QueryResult]:
        """Search for similar documents using vector similarity."""
        if not self.is_connected:
            logger.error("Not connected to Firestore")
            return []

        results = []
        for doc_id, doc in self.vector_store.items():
            similarity = self._cosine_similarity(query_embedding, doc.embedding)
            if similarity >= threshold:
                results.append(QueryResult(
                    doc_id=doc_id,
                    content=doc.content,
                    similarity=similarity,
                    metadata=doc.metadata
                ))

        # Sort by similarity (descending)
        results.sort(key=lambda x: x.similarity, reverse=True)
        return results[:top_k]

    def _cosine_similarity(self, vec1: list[float], vec2: list[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        if len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2, strict=False))
        magnitude1 = sum(a * a for a in vec1) ** 0.5
        magnitude2 = sum(b * b for b in vec2) ** 0.5

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)

    async def store_relational(self, collection: str, doc_id: str, data: dict[str, Any]) -> bool:
        """Store relational data."""
        if not self.is_connected:
            logger.error("Not connected to Firestore")
            return False

        if collection not in self.relational_store:
            self.relational_store[collection] = {}

        self.relational_store[collection][doc_id] = {
            "data": data,
            "created_at": datetime.utcnow().isoformat()
        }
        logger.info(f"Stored relational data: {collection}/{doc_id}")
        return True

    async def get_relational(self, collection: str, doc_id: str) -> dict[str, Any] | None:
        """Retrieve relational data."""
        if collection in self.relational_store:
            return self.relational_store[collection].get(doc_id)
        return None

    async def query_relational(
        self,
        collection: str,
        filters: dict[str, Any] | None = None
    ) -> list[dict[str, Any]]:
        """Query relational data with filters."""
        if collection not in self.relational_store:
            return []

        results = []
        for doc_id, doc_data in self.relational_store[collection].items():
            if filters:
                # Simple filter matching
                match = True
                for key, value in filters.items():
                    if key not in doc_data["data"] or doc_data["data"][key] != value:
                        match = False
                        break
                if match:
                    results.append({"id": doc_id, **doc_data})
            else:
                results.append({"id": doc_id, **doc_data})

        return results

    async def ingest_document(
        self,
        doc_id: str,
        content: str,
        metadata: dict[str, Any] | None = None,
        generate_embedding: bool = True
    ) -> bool:
        """Ingest a document with optional embedding generation."""
        if not self.is_connected:
            logger.error("Not connected to Firestore")
            return False

        embedding = []
        if generate_embedding:
            # In production, this would call an embedding API
            # For now, generate a simple mock embedding
            embedding = self._generate_mock_embedding(content)

        doc = VectorDocument(
            doc_id=doc_id,
            content=content,
            embedding=embedding,
            metadata=metadata or {}
        )

        return await self.store_vector_document(doc)

    def _generate_mock_embedding(self, text: str, dim: int = 128) -> list[float]:
        """Generate a mock embedding vector."""
        # Simple deterministic embedding based on text hash
        import hashlib
        hash_value = hashlib.md5(text.encode()).hexdigest()
        embedding = []
        for i in range(0, min(len(hash_value), dim * 2), 2):
            byte_val = int(hash_value[i:i+2], 16) / 255.0
            embedding.append(byte_val)

        # Pad if necessary
        while len(embedding) < dim:
            embedding.append(0.0)

        return embedding[:dim]

    async def rag_query(
        self,
        query: str,
        top_k: int = 5,
        metadata_filters: dict[str, Any] | None = None
    ) -> tuple[str, list[QueryResult]]:
        """Perform RAG (Retrieval-Augmented Generation) query."""
        # Generate query embedding
        query_embedding = self._generate_mock_embedding(query)

        # Search for similar documents
        results = await self.search_similar(query_embedding, top_k=top_k)

        # Filter by metadata if provided
        if metadata_filters:
            results = [
                r for r in results
                if all(r.metadata.get(k) == v for k, v in metadata_filters.items())
            ]

        # Generate context from top results
        context = "\n\n".join([
            f"[Document {i+1}] {r.content}"
            for i, r in enumerate(results)
        ])

        logger.info(f"RAG query completed: {len(results)} results")
        return context, results

    def get_status(self) -> dict[str, Any]:
        """Get integration status."""
        return {
            "connected": self.is_connected,
            "project_id": self.project_id,
            "vector_documents": len(self.vector_store),
            "relational_collections": len(self.relational_store),
            "timestamp": datetime.utcnow().isoformat()
        }


# Singleton instance
_firestore_instance: FirestoreIntegration | None = None


def get_firestore() -> FirestoreIntegration:
    """Get or create the Firestore integration singleton instance."""
    global _firestore_instance
    if _firestore_instance is None:
        _firestore_instance = FirestoreIntegration()
    return _firestore_instance
