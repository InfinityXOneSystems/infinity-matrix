"""
Cortex Agents Package

Multi-agent system for autonomous operations inspired by Manus.im and
FAANG-grade distributed systems.
"""

from .vision_cortex import VisionCortex
from .crawler_agent import CrawlerAgent
from .ingestion_agent import IngestionAgent
from .predictor_agent import PredictorAgent
from .ceo_agent import CEOAgent
from .strategist_agent import StrategistAgent
from .organizer_agent import OrganizerAgent
from .validator_agent import ValidatorAgent
from .documentor_agent import DocumentorAgent

__version__ = "1.0.0"
__author__ = "Infinity X One Systems"

__all__ = [
    "VisionCortex",
    "CrawlerAgent",
    "IngestionAgent",
    "PredictorAgent",
    "CEOAgent",
    "StrategistAgent",
    "OrganizerAgent",
    "ValidatorAgent",
    "DocumentorAgent"
]
