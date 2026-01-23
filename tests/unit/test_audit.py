"""Tests for audit logger."""

from datetime import datetime, timedelta

import pytest

from infinity_matrix.logs.audit import AuditEventType, AuditLogger


@pytest.mark.asyncio
async def test_audit_logger_initialization():
    """Test audit logger initialization."""
    logger = AuditLogger()
    await logger.initialize()
    assert logger.is_initialized
    await logger.shutdown()


@pytest.mark.asyncio
async def test_log_event():
    """Test logging an event."""
    logger = AuditLogger()
    await logger.initialize()

    event = await logger.log_event(
        event_type=AuditEventType.SYSTEM_EVENT,
        actor="test_user",
        action="test_action",
        status="success",
    )

    assert event.event_type == AuditEventType.SYSTEM_EVENT
    assert event.actor == "test_user"
    assert event.action == "test_action"

    await logger.shutdown()


@pytest.mark.asyncio
async def test_get_events():
    """Test getting events."""
    logger = AuditLogger()
    await logger.initialize()

    # Clear any existing events for clean test
    logger._events.clear()

    # Log some events
    await logger.log_event(
        event_type=AuditEventType.AGENT_EXECUTION,
        actor="agent1",
        action="execute",
        status="success",
    )
    await logger.log_event(
        event_type=AuditEventType.API_REQUEST,
        actor="user1",
        action="api_call",
        status="success",
    )

    # Get all events
    events = await logger.get_events(limit=100)
    assert len(events) == 2

    # Filter by type
    agent_events = await logger.get_events(event_type=AuditEventType.AGENT_EXECUTION)
    assert len(agent_events) == 1
    assert agent_events[0].actor == "agent1"

    await logger.shutdown()


@pytest.mark.asyncio
async def test_verify_event():
    """Test event verification."""
    logger = AuditLogger()
    await logger.initialize()

    event = await logger.log_event(
        event_type=AuditEventType.SYSTEM_EVENT,
        actor="test_user",
        action="test_action",
        status="success",
    )

    verification = await logger.verify_event(event.id)
    assert verification["verified"] is True

    # Non-existent event
    verification = await logger.verify_event("non-existent")
    assert verification["verified"] is False

    await logger.shutdown()


@pytest.mark.asyncio
async def test_generate_audit_report():
    """Test generating audit report."""
    logger = AuditLogger()
    await logger.initialize()

    # Clear any existing events for clean test
    logger._events.clear()

    # Log some events
    await logger.log_event(
        event_type=AuditEventType.AGENT_EXECUTION,
        actor="agent1",
        action="execute",
        status="success",
    )
    await logger.log_event(
        event_type=AuditEventType.AGENT_EXECUTION,
        actor="agent2",
        action="execute",
        status="failure",
    )

    # Generate report
    now = datetime.utcnow()
    start = now - timedelta(hours=1)
    report = await logger.generate_audit_report(start, now)

    assert report["total_events"] == 2
    assert "by_type" in report
    assert "by_actor" in report
    assert "by_status" in report

    await logger.shutdown()
