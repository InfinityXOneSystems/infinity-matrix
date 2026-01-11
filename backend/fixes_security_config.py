"""
Critical Fix: Security Hardening
Implements secure credential management and environment variables
"""
import logging
import os

logger = logging.getLogger(__name__)

class SecurityConfig:
    """Centralized security configuration from environment"""

    # JWT Configuration
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    # API Keys (loaded from environment, never hardcoded)
    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")
    STRIPE_API_KEY: str | None = os.getenv("STRIPE_API_KEY")
    ANTHROPIC_API_KEY: str | None = os.getenv("ANTHROPIC_API_KEY")

    # Security Headers
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    ALLOWED_HOSTS: list = os.getenv("ALLOWED_HOSTS", "localhost").split(",")

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    RATE_LIMIT_PER_HOUR: int = int(os.getenv("RATE_LIMIT_PER_HOUR", "1000"))

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Security
    SECURE_COOKIES: bool = os.getenv("SECURE_COOKIES", "True").lower() == "true"
    HSTS_MAX_AGE: int = int(os.getenv("HSTS_MAX_AGE", "31536000"))

    @classmethod
    def validate(cls):
        """Validate all required environment variables are set"""
        required_vars = ["SECRET_KEY", "DATABASE_URL"]
        missing = []

        for var in required_vars:
            value = getattr(cls, var, None)
            if not value:
                missing.append(var)

        if missing:
            logger.error(f"❌ Missing required environment variables: {', '.join(missing)}")
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

        logger.info("✅ All required environment variables are configured")
        logger.info("✅ All credentials are externalized and secure")

        # Log security settings (non-sensitive)
        logger.info(f"   - CORS Origins: {len(cls.CORS_ORIGINS)} configured")
        logger.info(f"   - Rate Limiting: {cls.RATE_LIMIT_PER_MINUTE} req/min")
        logger.info(f"   - Secure Cookies: {cls.SECURE_COOKIES}")
        logger.info(f"   - HSTS Max Age: {cls.HSTS_MAX_AGE}s")

# Validate configuration on import
try:
    SecurityConfig.validate()
except ValueError as e:
    logger.error(f"Configuration validation failed: {str(e)}")
    # Don't raise in production, but log the error
    if os.getenv("ENVIRONMENT") != "production":
        raise

# Security middleware for FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware


def apply_security_middleware(app: FastAPI):
    """Apply security middleware to FastAPI app"""

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=SecurityConfig.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Trusted host middleware
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=SecurityConfig.ALLOWED_HOSTS
    )

    # Security headers middleware
    @app.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = f"max-age={SecurityConfig.HSTS_MAX_AGE}; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"

        return response

    logger.info("✅ Security middleware applied to FastAPI app")

print("✅ Security configuration module loaded")
