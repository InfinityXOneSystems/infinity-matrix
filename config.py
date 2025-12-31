"""
Configuration settings for Infinity Matrix system.
"""

# System settings
SYSTEM_NAME = "Infinity Matrix"
VERSION = "1.0.0"

# API Server settings
API_HOST = "0.0.0.0"
API_PORT = 8080

# Agent Registry settings
HEARTBEAT_INTERVAL = 30  # seconds
HEARTBEAT_TIMEOUT = 60   # seconds
HEALTH_CHECK_INTERVAL = 30  # seconds

# Firestore settings
FIRESTORE_PROJECT_ID = "infinity-matrix-default"

# Pub/Sub settings
PUBSUB_PROJECT_ID = "infinity-matrix-default"

# Standard event topics
EVENT_TOPICS = [
    "agent_events",
    "cortex_events",
    "memory_events",
    "document_events"
]

# RBAC policies
DEFAULT_ROLES = {
    "admin": {
        "permissions": ["READ", "WRITE", "EXECUTE", "ADMIN"],
        "resources": ["*"]
    },
    "agent": {
        "permissions": ["READ", "WRITE", "EXECUTE"],
        "resources": ["agents/*", "memory/*", "documents/*"]
    },
    "viewer": {
        "permissions": ["READ"],
        "resources": ["*"]
    }
}

# Logging settings
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

# Documentation settings
DOCS_PATH = "docs"
AUTO_LOAD_DOCS = True

# Agent settings
DEFAULT_AGENT_CAPABILITIES = {
    "financial": [
        "market_analysis",
        "portfolio_management",
        "risk_assessment",
        "financial_reporting"
    ],
    "real_estate": [
        "property_valuation",
        "market_analysis",
        "investment_analysis",
        "location_scoring"
    ],
    "loan": [
        "loan_application_processing",
        "credit_assessment",
        "approval_workflow",
        "rate_calculation"
    ],
    "analytics": [
        "data_analysis",
        "report_generation",
        "trend_detection",
        "predictive_modeling"
    ],
    "nlp": [
        "text_analysis",
        "sentiment_analysis",
        "entity_extraction",
        "text_summarization"
    ]
}
