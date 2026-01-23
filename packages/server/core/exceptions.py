"""
Custom exceptions for the MCP server
"""


class MCPException(Exception):
    """Base exception for MCP errors"""

    def __init__(
        self,
        message: str,
        error_code: str = "MCP_ERROR",
        status_code: int = 500,
        details: dict | None = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class DatabaseException(MCPException):
    """Database-related exceptions"""

    def __init__(self, message: str, details: dict | None = None):
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=500,
            details=details,
        )


class RedisException(MCPException):
    """Redis-related exceptions"""

    def __init__(self, message: str, details: dict | None = None):
        super().__init__(
            message=message,
            error_code="REDIS_ERROR",
            status_code=500,
            details=details,
        )


class AuthenticationException(MCPException):
    """Authentication-related exceptions"""

    def __init__(self, message: str = "Authentication failed", details: dict | None = None):
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=401,
            details=details,
        )


class AuthorizationException(MCPException):
    """Authorization-related exceptions"""

    def __init__(self, message: str = "Access denied", details: dict | None = None):
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=403,
            details=details,
        )


class ValidationException(MCPException):
    """Validation-related exceptions"""

    def __init__(self, message: str, details: dict | None = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=400,
            details=details,
        )


class AIProviderException(MCPException):
    """AI provider-related exceptions"""

    def __init__(self, provider: str, message: str, details: dict | None = None):
        super().__init__(
            message=f"{provider}: {message}",
            error_code="AI_PROVIDER_ERROR",
            status_code=502,
            details=details,
        )


class RateLimitException(MCPException):
    """Rate limiting exceptions"""

    def __init__(self, message: str = "Rate limit exceeded", details: dict | None = None):
        super().__init__(
            message=message,
            error_code="RATE_LIMIT_EXCEEDED",
            status_code=429,
            details=details,
        )
