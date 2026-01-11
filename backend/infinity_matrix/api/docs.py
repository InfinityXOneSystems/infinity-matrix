"""
Documentation search API endpoints.
"""
from typing import Any, dict, list

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# In-memory doc store (in production, use a proper search engine)
doc_store: list[dict[str, Any]] = []
subscriptions: list[dict[str, Any]] = []


class DocumentRequest(BaseModel):
    """Document creation request."""
    title: str
    content: str
    category: str
    tags: list[str] = []


class SearchRequest(BaseModel):
    """Search request."""
    query: str
    category: str | None = None


class SubscriptionRequest(BaseModel):
    """Subscription request."""
    user_id: str
    categories: list[str]


@router.post("/documents")
async def create_document(request: DocumentRequest) -> dict[str, Any]:
    """Create new document."""
    doc_id = f"DOC-{len(doc_store) + 1}"
    doc = {
        "id": doc_id,
        "title": request.title,
        "content": request.content,
        "category": request.category,
        "tags": request.tags,
    }
    doc_store.append(doc)

    # Notify subscribers
    await notify_subscribers(request.category, doc)

    return doc


@router.get("/search")
async def search_documents(
    query: str,
    category: str | None = None,
) -> list[dict[str, Any]]:
    """Search documents."""
    results = []
    query_lower = query.lower()

    for doc in doc_store:
        if category and doc["category"] != category:
            continue

        if query_lower in doc["title"].lower() or query_lower in doc["content"].lower():
            results.append(doc)

    return results


@router.post("/subscribe")
async def subscribe_to_changes(request: SubscriptionRequest) -> dict[str, Any]:
    """Subscribe to document changes."""
    subscription = {
        "user_id": request.user_id,
        "categories": request.categories,
    }
    subscriptions.append(subscription)
    return {"status": "subscribed", "subscription": subscription}


async def notify_subscribers(category: str, doc: dict[str, Any]) -> None:
    """Notify subscribers of document changes."""
    for sub in subscriptions:
        if category in sub["categories"]:
            # In production, send actual notifications
            pass
