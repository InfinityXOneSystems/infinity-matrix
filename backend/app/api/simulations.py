"""
Simulations API Endpoints
"""
from typing import list

from app.core.database import get_db
from app.models.models import Discovery, Simulation
from app.models.schemas import SimulationResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/{discovery_id}/simulations", response_model=list[SimulationResponse])
async def get_simulations(
    discovery_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all simulations for a discovery"""
    # Verify discovery exists
    result = await db.execute(
        select(Discovery).where(Discovery.id == discovery_id)
    )
    discovery = result.scalar_one_or_none()
    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")

    # Get simulations
    result = await db.execute(
        select(Simulation)
        .where(Simulation.discovery_id == discovery_id)
        .order_by(Simulation.created_at.desc())
    )
    simulations = result.scalars().all()

    return simulations


@router.get("/simulation/{simulation_id}", response_model=SimulationResponse)
async def get_simulation(
    simulation_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific simulation by ID"""
    result = await db.execute(
        select(Simulation).where(Simulation.id == simulation_id)
    )
    simulation = result.scalar_one_or_none()

    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    return simulation
