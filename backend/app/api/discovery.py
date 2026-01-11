"""
Discovery API Endpoints
"""
from typing import list

from app.core.database import get_db
from app.models.models import Discovery, DiscoveryStatus
from app.models.schemas import ComprehensiveDiscoveryPack, DiscoveryRequest, DiscoveryResponse
from app.services.discovery_service import DiscoveryService
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.post("/start", response_model=DiscoveryResponse, status_code=201)
async def start_discovery(
    request: DiscoveryRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Start a new discovery session.

    Accepts client name and business name, then automatically:
    - Crawls public information
    - Analyzes business and competitive landscape
    - Generates intelligence reports
    - Creates proposals and simulations
    """
    # Create discovery record
    discovery = Discovery(
        client_name=request.client_name,
        business_name=request.business_name,
        status=DiscoveryStatus.PENDING
    )

    db.add(discovery)
    await db.commit()
    await db.refresh(discovery)

    # Start discovery process in background
    discovery_service = DiscoveryService(db)
    background_tasks.add_task(
        discovery_service.run_discovery,
        discovery.id
    )

    return discovery


@router.get("/{discovery_id}", response_model=DiscoveryResponse)
async def get_discovery(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get discovery by ID"""
    result = await db.execute(
        select(Discovery).where(Discovery.id == discovery_id)
    )
    discovery = result.scalar_one_or_none()

    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")

    return discovery


@router.get("/", response_model=list[DiscoveryResponse])
async def list_discoveries(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """list all discoveries"""
    result = await db.execute(
        select(Discovery)
        .order_by(Discovery.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    discoveries = result.scalars().all()
    return discoveries


@router.get("/{discovery_id}/complete-pack", response_model=ComprehensiveDiscoveryPack)
async def get_complete_discovery_pack(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get the complete discovery package including:
    - Intelligence reports
    - Proposals
    - Simulations
    - Narrative summaries
    """
    discovery_service = DiscoveryService(db)
    pack = await discovery_service.get_comprehensive_pack(discovery_id)

    if not pack:
        raise HTTPException(status_code=404, detail="Discovery pack not found or not ready")

    return pack


@router.delete("/{discovery_id}", status_code=204)
async def delete_discovery(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete a discovery and all related data"""
    result = await db.execute(
        select(Discovery).where(Discovery.id == discovery_id)
    )
    discovery = result.scalar_one_or_none()

    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")

    await db.delete(discovery)
    await db.commit()

    return None
