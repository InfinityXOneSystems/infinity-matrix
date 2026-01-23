"""API module for generating REST API endpoints."""

from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Optional, dict, list

from pydantic import BaseModel


class HTTPMethod(str, Enum):
    """HTTP method enumeration."""
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    PATCH = "PATCH"
    DELETE = "DELETE"


class Endpoint(BaseModel):
    """API endpoint model."""
    path: str
    method: HTTPMethod
    handler: str | None = None
    description: str | None = None
    request_schema: dict[str, Any] | None = None
    response_schema: dict[str, Any] | None = None
    auth_required: bool = False


class APIGenerator(ABC):
    """Abstract base class for API generators."""

    @abstractmethod
    def generate_endpoint(self, endpoint: Endpoint) -> str:
        """Generate code for an endpoint."""

    @abstractmethod
    def generate_router(self, endpoints: list[Endpoint]) -> str:
        """Generate router code for multiple endpoints."""


class FastAPIGenerator(APIGenerator):
    """FastAPI-specific API generator."""

    def generate_endpoint(self, endpoint: Endpoint) -> str:
        """Generate FastAPI endpoint code."""
        auth_decorator = "@require_auth" if endpoint.auth_required else ""

        code = f"""
{auth_decorator}
@app.{endpoint.method.lower()}("{endpoint.path}")
async def {endpoint.handler or 'handler'}():
    \"""
    {endpoint.description or 'API endpoint'}
    \"""
    return {{"message": "Success"}}
"""
        return code

    def generate_router(self, endpoints: list[Endpoint]) -> str:
        """Generate FastAPI router code."""
        endpoint_code = "\n".join([self.generate_endpoint(e) for e in endpoints])

        code = f"""
from fastapi import APIRouter

router = APIRouter()

{endpoint_code}
"""
        return code


class ExpressGenerator(APIGenerator):
    """Express.js-specific API generator."""

    def generate_endpoint(self, endpoint: Endpoint) -> str:
        """Generate Express endpoint code."""
        method = endpoint.method.lower()
        middleware = ", authMiddleware" if endpoint.auth_required else ""

        code = f"""
router.{method}('{endpoint.path}'{middleware}, (req, res) => {{
    // {endpoint.description or 'API endpoint'}
    res.json({{ message: 'Success' }});
}});
"""
        return code

    def generate_router(self, endpoints: list[Endpoint]) -> str:
        """Generate Express router code."""
        endpoint_code = "\n".join([self.generate_endpoint(e) for e in endpoints])

        code = f"""
const express = require('express');
const router = express.Router();

{endpoint_code}

module.exports = router;
"""
        return code
