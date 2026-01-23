"""
Comprehensive Example: Creating a Full-Stack Application

This example demonstrates creating a complete full-stack application
with authentication, database, API, and all security features.
"""

from infinity_matrix import UniversalBuilder, VisionCortex
from infinity_matrix.agents.registry import Agent, AgentType, get_registry
from infinity_matrix.agents.scheduler import ScheduledTask, TaskPriority, get_scheduler
from infinity_matrix.core.config import Config
from infinity_matrix.integrations.cicd import (
    CICDPlatform,
    PipelineConfig,
    PipelineStep,
    get_cicd_integration,
)
from infinity_matrix.integrations.cloud import (
    CloudProvider,
    DeploymentConfig,
    get_cloud_integration,
)
from infinity_matrix.security.audit import AuditAction, get_audit_logger
from infinity_matrix.security.rbac import User, get_rbac_manager
from infinity_matrix.security.secrets import get_secrets_manager


def create_application():
    """Create a full-stack application with all features."""

    print("=" * 60)
    print("CREATING FULL-STACK APPLICATION WITH INFINITY MATRIX")
    print("=" * 60)

    # Initialize configuration
    config = Config()

    # Initialize components
    builder = UniversalBuilder(config)
    cortex = VisionCortex(config)
    secrets = get_secrets_manager()
    rbac = get_rbac_manager()
    audit = get_audit_logger()

    # Define application requirements
    prompt = """
    Build a complete e-commerce platform with:
    - User authentication and authorization
    - Product catalog with search
    - Shopping cart and checkout
    - Order management
    - Admin dashboard
    - PostgreSQL database
    - REST API with GraphQL support
    - Real-time notifications
    - Payment integration
    - Email notifications
    """

    print("\n1. ANALYZING REQUIREMENTS")
    print("-" * 60)
    analysis = cortex.analyze_prompt(prompt)
    print(f"Intent: {analysis.intent}")
    print(f"Complexity: {analysis.complexity}")
    print(f"Suggested Stack: {', '.join(analysis.suggested_stack)}")
    print(f"Suggested Modules: {', '.join(analysis.suggested_modules)}")
    print(f"Requirements extracted: {len(analysis.requirements)}")

    # Select blueprint - use a known existing template
    template = cortex.select_blueprint(analysis)
    # Ensure we use an existing template
    if template not in ["python-fastapi-starter", "node-express-starter", "go-gin-starter"]:
        template = "python-fastapi-starter"
    print(f"\nSelected Template: {template}")

    # Set up secrets
    print("\n2. CONFIGURING SECURITY")
    print("-" * 60)
    secrets.set("database_password", "super_secret_db_pass")
    secrets.set("jwt_secret", "jwt_signing_key_2024")
    secrets.set("stripe_api_key", "sk_test_...")
    print("✓ Secrets configured and encrypted")

    # Set up RBAC
    admin_user = User(
        username="admin",
        email="admin@example.com"
    )
    rbac.create_user(admin_user)
    rbac.assign_role("admin", "admin")
    print("✓ RBAC configured with admin user")

    # Log action
    audit.info(
        AuditAction.CREATE,
        user="system",
        resource="application",
        details={"template": template, "prompt": prompt[:100]}
    )
    print("✓ Audit logging enabled")

    # Build application (use template name directly since it exists)
    print("\n3. BUILDING APPLICATION")
    print("-" * 60)
    result = builder.build(
        template="python-fastapi-starter",  # Use existing template
        params={
            "app_name": "ecommerce-platform",
            "include_auth": True,
            "database": "postgresql",
            "include_docker": True
        },
        output_dir="/tmp/infinity-apps"
    )

    if result["success"]:
        print(f"✓ Application created: {result['output_path']}")
    else:
        print(f"✗ Failed: {result.get('error')}")
        return

    # Set up agents
    print("\n4. CONFIGURING AGENTS")
    print("-" * 60)
    registry = get_registry()
    scheduler = get_scheduler()

    # Code review agent
    code_review_agent = Agent(
        name="Code Review Agent",
        type=AgentType.CODE_REVIEW,
        config={
            "check_style": True,
            "check_security": True,
            "check_performance": True,
            "auto_fix": True
        }
    )
    registry.register(code_review_agent)
    print("✓ Code Review Agent registered")

    # Security scan agent
    security_agent = Agent(
        name="Security Scanner",
        type=AgentType.SECURITY_SCAN,
        config={
            "scan_dependencies": True,
            "scan_code": True,
            "notify_on_high": True
        }
    )
    registry.register(security_agent)
    print("✓ Security Scanner Agent registered")

    # Monitoring agent with auto-healing
    monitoring_agent = Agent(
        name="Monitoring & Healing",
        type=AgentType.MONITORING,
        config={
            "check_interval": 60,
            "auto_heal": True,
            "alert_on_failure": True
        }
    )
    registry.register(monitoring_agent)
    print("✓ Monitoring Agent with auto-healing registered")

    # Schedule tasks
    from datetime import timedelta

    daily_scan = ScheduledTask(
        name="Daily Security Scan",
        description="Scan for vulnerabilities",
        interval=timedelta(days=1),
        priority=TaskPriority.HIGH
    )
    scheduler.schedule(daily_scan, lambda t: print(f"Running: {t.name}"))
    print("✓ Scheduled daily security scans")

    # CI/CD Pipeline
    print("\n5. SETTING UP CI/CD")
    print("-" * 60)
    cicd = get_cicd_integration(CICDPlatform.GITHUB_ACTIONS)

    pipeline = PipelineConfig(
        name="CI/CD Pipeline",
        platform=CICDPlatform.GITHUB_ACTIONS,
        steps=[
            PipelineStep(
                name="Install Dependencies",
                script=["pip install -r requirements.txt"]
            ),
            PipelineStep(
                name="Run Tests",
                script=["pytest tests/"]
            ),
            PipelineStep(
                name="Security Scan",
                script=["pip-audit", "bandit -r ."]
            ),
            PipelineStep(
                name="Deploy",
                script=["echo 'Deploying...'"]
            )
        ],
        triggers=["push", "pull_request"]
    )

    cicd.generate_config(pipeline)
    print("✓ GitHub Actions workflow generated")

    # Cloud deployment
    print("\n6. CONFIGURING CLOUD DEPLOYMENT")
    print("-" * 60)
    cloud = get_cloud_integration(CloudProvider.AWS)

    deployment_config = DeploymentConfig(
        provider=CloudProvider.AWS,
        region="us-east-1",
        instance_type="t3.medium",
        auto_scaling=True,
        min_instances=2,
        max_instances=10
    )

    deployment = cloud.deploy(deployment_config)
    print(f"✓ Configured for deployment: {deployment['deployment_id']}")

    # Summary
    print("\n" + "=" * 60)
    print("APPLICATION SETUP COMPLETE!")
    print("=" * 60)
    print(f"\n📦 Application: {result['output_path']}")
    print(f"🤖 Agents: {len(registry.list())} active")
    print(f"📅 Scheduled Tasks: {len(scheduler.list())} configured")
    print("🔐 Security: RBAC, Secrets, Audit enabled")
    print("🚀 CI/CD: Pipeline configured")
    print(f"☁️  Cloud: Ready for {deployment_config.provider.value}")

    print("\n📋 Next Steps:")
    for step in result.get("next_steps", []):
        print(f"  • {step}")

    print("\n🎉 Your enterprise-grade application is ready!")
    print("=" * 60)


if __name__ == "__main__":
    create_application()
