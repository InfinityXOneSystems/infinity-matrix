"""
Intelligence API Endpoints
"""
from typing import list

from app.core.database import get_db
from app.models.models import Discovery, IntelligenceReport
from app.models.schemas import IntelligenceReportResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/{discovery_id}/report", response_model=IntelligenceReportResponse)
async def get_intelligence_report(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get intelligence report for a discovery"""
    # Verify discovery exists
    result = await db.execute(
        select(Discovery).where(Discovery.id == discovery_id)
    )
    discovery = result.scalar_one_or_none()
    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")

    # Get intelligence report
    result = await db.execute(
        select(IntelligenceReport)
        .where(IntelligenceReport.discovery_id == discovery_id)
        .order_by(IntelligenceReport.created_at.desc())
    )
    report = result.scalar_one_or_none()

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Intelligence report not yet available. Discovery may still be in progress."
        )

    return report


@router.get("/{discovery_id}/reports", response_model=list[IntelligenceReportResponse])
async def list_intelligence_reports(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """list all intelligence reports for a discovery"""
    result = await db.execute(
        select(IntelligenceReport)
        .where(IntelligenceReport.discovery_id == discovery_id)
        .order_by(IntelligenceReport.created_at.desc())
    )
    reports = result.scalars().all()
    return reports
