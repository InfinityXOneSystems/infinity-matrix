"""Configuration management for Vision Cortex."""

import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Central configuration for the Infinity-Matrix system."""

    def __init__(self):
        """Initialize configuration from environment variables."""

        # Project paths
        self.project_root = Path(__file__).parent.parent.parent
        self.data_dir = self.project_root / "data"
        self.logs_dir = self.data_dir / "logs"
        self.tracking_dir = self.data_dir / "tracking"
        self.docs_dir = self.project_root / "docs"

        # Ensure directories exist
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        self.tracking_dir.mkdir(parents=True, exist_ok=True)

        # System configuration
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        self.debug = os.getenv("DEBUG", "False").lower() == "true"

        # Google Cloud Platform
        self.gcp_project_id = os.getenv("GCP_PROJECT_ID", "")
        self.gcp_region = os.getenv("GCP_REGION", "us-central1")
        self.google_credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")

        # Secret Management
        self.use_secret_manager = os.getenv("USE_SECRET_MANAGER", "False").lower() == "true"
        self.secret_project_id = os.getenv("SECRET_PROJECT_ID", self.gcp_project_id)

        # AI Models
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
        self.anthropic_api_key = os.getenv("ANTHROPIC_API_KEY", "")

        # Vertex AI
        self.vertex_ai_project = os.getenv("VERTEX_AI_PROJECT", self.gcp_project_id)
        self.vertex_ai_location = os.getenv("VERTEX_AI_LOCATION", "us-central1")

        # GitHub
        self.github_token = os.getenv("GITHUB_TOKEN", "")
        self.github_org = os.getenv("GITHUB_ORG", "InfinityXOneSystems")
        self.github_repo = os.getenv("GITHUB_REPO", "infinity-matrix")

        # Database
        self.database_url = os.getenv("DATABASE_URL", "")
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.firestore_collection = os.getenv("FIRESTORE_COLLECTION", "infinity_matrix")

        # API Configuration
        self.api_host = os.getenv("API_HOST", "0.0.0.0")
        self.api_port = int(os.getenv("API_PORT", "8000"))
        self.api_workers = int(os.getenv("API_WORKERS", "4"))

        # Feature Flags
        self.enable_auto_pr = os.getenv("ENABLE_AUTO_PR", "True").lower() == "true"
        self.enable_auto_deploy = os.getenv("ENABLE_AUTO_DEPLOY", "False").lower() == "true"
        self.enable_self_upgrade = os.getenv("ENABLE_SELF_UPGRADE", "False").lower() == "true"
        self.enable_cost_optimization = os.getenv("ENABLE_COST_OPTIMIZATION", "True").lower() == "true"

        # Agent Configuration
        self.agent_execution_timeout = int(os.getenv("AGENT_EXECUTION_TIMEOUT", "300"))
        self.agent_max_retries = int(os.getenv("AGENT_MAX_RETRIES", "3"))
        self.agent_debate_rounds = int(os.getenv("AGENT_DEBATE_ROUNDS", "3"))

        # Orchestration
        self.orchestration_cycle_interval = int(os.getenv("ORCHESTRATION_CYCLE_INTERVAL", "60"))

        # SOP Configuration
        self.auto_generate_sop = os.getenv("AUTO_GENERATE_SOP", "True").lower() == "true"
        self.sop_output_path = self.docs_dir / "tracking" / "sops"
        self.sop_output_path.mkdir(parents=True, exist_ok=True)

    def validate(self) -> bool:
        """Validate required configuration."""
        required_fields = []

        if self.environment == "production":
            if not self.gcp_project_id:
                required_fields.append("GCP_PROJECT_ID")
            if not self.github_token:
                required_fields.append("GITHUB_TOKEN")

        if required_fields:
            print(f"Missing required configuration: {', '.join(required_fields)}")
            return False

        return True

    def get_secret(self, secret_name: str) -> str | None:
        """Get secret from Secret Manager or environment."""
        if self.use_secret_manager:
            try:
                from google.cloud import secretmanager
                client = secretmanager.SecretManagerServiceClient()
                name = f"projects/{self.secret_project_id}/secrets/{secret_name}/versions/latest"
                response = client.access_secret_version(request={"name": name})
                return response.payload.data.decode("UTF-8")
            except Exception as e:
                print(f"Error fetching secret {secret_name}: {e}")
                return os.getenv(secret_name, "")
        else:
            return os.getenv(secret_name, "")
