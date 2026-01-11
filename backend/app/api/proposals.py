"""
Proposals API Endpoints
"""
from typing import list

from app.core.database import get_db
from app.models.models import Discovery, Proposal
from app.models.schemas import ProposalResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/{discovery_id}/proposals", response_model=list[ProposalResponse])
async def get_proposals(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all proposals for a discovery"""
    # Verify discovery exists
    result = await db.execute(
        select(Discovery).where(Discovery.id == discovery_id)
    )
    discovery = result.scalar_one_or_none()
    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")

    # Get proposals
    result = await db.execute(
        select(Proposal)
        .where(Proposal.discovery_id == discovery_id)
        .order_by(Proposal.created_at.desc())
    )
    proposals = result.scalars().all()

    return proposals


@router.get("/proposal/{proposal_id}", response_model=ProposalResponse)
async def get_proposal(
    proposal_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific proposal by ID"""
    result = await db.execute(
        select(Proposal).where(Proposal.id == proposal_id)
    )
    proposal = result.scalar_one_or_none()

    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    return proposal
