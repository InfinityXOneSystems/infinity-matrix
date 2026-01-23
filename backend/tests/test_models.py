from app.models.models import Discovery, DiscoveryStatus


def test_discovery_model():
    """Test Discovery model creation"""
    discovery = Discovery(
        client_name="Test Client",
        business_name="Test Business",
        status=DiscoveryStatus.PENDING
    )

    assert discovery.client_name == "Test Client"
    assert discovery.business_name == "Test Business"
    assert discovery.status == DiscoveryStatus.PENDING


def test_discovery_status_enum():
    """Test DiscoveryStatus enum"""
    assert DiscoveryStatus.PENDING.value == "pending"
    assert DiscoveryStatus.IN_PROGRESS.value == "in_progress"
    assert DiscoveryStatus.COMPLETED.value == "completed"
    assert DiscoveryStatus.FAILED.value == "failed"
