#!/usr/bin/env python3
"""
System validation script for Infinity Matrix.
"""

import asyncio
import logging
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)


def check_file_exists(filepath: str) -> bool:
    """Check if a file exists."""
    exists = os.path.exists(filepath)
    status = "✅" if exists else "❌"
    logger.info(f"{status} {filepath}")
    return exists


def validate_structure():
    """Validate system structure."""
    logger.info("\n=== Validating System Structure ===\n")

    required_files = [
        "cortex/vision_cortex.py",
        "cortex/firestore_integration.py",
        "cortex/pubsub_integration.py",
        "gateway/omni_router.py",
        "agent_registry.py",
        "agents/base_agent.py",
        "agents/financial_agent.py",
        "agents/real_estate_agent.py",
        "agents/loan_agent.py",
        "agents/analytics_agent.py",
        "agents/nlp_agent.py",
        "api_server.py",
        "main.py",
        "config.py",
        "requirements.txt",
        "README.md",
        ".github/workflows/cortex_bootstrap.yml"
    ]

    all_exist = True
    for filepath in required_files:
        if not check_file_exists(filepath):
            all_exist = False

    return all_exist


async def validate_imports():
    """Validate that all modules can be imported."""
    logger.info("\n=== Validating Module Imports ===\n")

    modules = [
        "cortex.vision_cortex",
        "cortex.firestore_integration",
        "cortex.pubsub_integration",
        "gateway.omni_router",
        "agent_registry",
        "agents.base_agent",
        "agents.financial_agent",
        "agents.real_estate_agent",
        "agents.loan_agent",
        "agents.analytics_agent",
        "agents.nlp_agent",
        "config"
    ]

    # API server is optional (requires aiohttp)
    try:
        modules.append("api_server")
    except ImportError:
        logger.info("⚠️  api_server (optional, requires aiohttp)")

    all_imported = True
    for module_name in modules:
        try:
            __import__(module_name)
            logger.info(f"✅ {module_name}")
        except Exception as e:
            logger.error(f"❌ {module_name}: {e}")
            all_imported = False

    return all_imported


async def validate_system_startup():
    """Validate system can start (briefly)."""
    logger.info("\n=== Validating System Startup ===\n")

    try:
        from agent_registry import get_registry
        from cortex.vision_cortex import get_cortex
        from gateway.omni_router import get_router

        # Test cortex
        cortex = get_cortex()
        await cortex.start()
        logger.info("✅ Vision Cortex started")

        status = cortex.get_status()
        logger.info(f"   Status: {status['status']}")

        await cortex.stop()
        logger.info("✅ Vision Cortex stopped")

        # Test gateway
        gateway = get_router()
        await gateway.start()
        logger.info("✅ Omni Router started")

        status = gateway.get_status()
        logger.info(f"   Status: {status['status']}")

        await gateway.stop()
        logger.info("✅ Omni Router stopped")

        # Test registry
        registry = get_registry()
        await registry.start()
        logger.info("✅ Agent Registry started")

        status = registry.get_status()
        logger.info(f"   Status: {status['status']}")

        await registry.stop()
        logger.info("✅ Agent Registry stopped")

        return True

    except Exception as e:
        logger.error(f"❌ System startup failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def main():
    """Main validation routine."""
    logger.info("=" * 60)
    logger.info("Infinity Matrix System Validation")
    logger.info("=" * 60)

    results = {
        "structure": validate_structure(),
        "imports": await validate_imports(),
        "startup": await validate_system_startup()
    }

    logger.info("\n" + "=" * 60)
    logger.info("Validation Summary")
    logger.info("=" * 60)

    for check, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        logger.info(f"{check.upper()}: {status}")

    all_passed = all(results.values())

    logger.info("\n" + "=" * 60)
    if all_passed:
        logger.info("✅ ALL VALIDATIONS PASSED")
        logger.info("=" * 60)
        return 0
    else:
        logger.info("❌ SOME VALIDATIONS FAILED")
        logger.info("=" * 60)
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
