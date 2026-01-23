import pytest
from app.models.schemas import DiscoveryRequest
from pydantic import ValidationError


def test_discovery_request_valid():
    """Test valid DiscoveryRequest"""
    request = DiscoveryRequest(
        client_name="John Doe",
        business_name="Acme Corp"
    )

    assert request.client_name == "John Doe"
    assert request.business_name == "Acme Corp"


def test_discovery_request_invalid_empty():
    """Test DiscoveryRequest with empty names"""
    with pytest.raises(ValidationError):
        DiscoveryRequest(
            client_name="",
            business_name="Acme Corp"
        )

    with pytest.raises(ValidationError):
        DiscoveryRequest(
            client_name="John Doe",
            business_name=""
        )


def test_discovery_request_strips_whitespace():
    """Test DiscoveryRequest strips whitespace"""
    request = DiscoveryRequest(
        client_name="  John Doe  ",
        business_name="  Acme Corp  "
    )

    assert request.client_name == "John Doe"
    assert request.business_name == "Acme Corp"
