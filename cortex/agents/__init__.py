"""
Cortex Agents Package

Multi-agent system for autonomous operations inspired by Manus.im and
FAANG-grade distributed systems.
"""

from .ceo_agent import CEOAgent
from .crawler_agent import CrawlerAgent
from .documentor_agent import DocumentorAgent
from .ingestion_agent import IngestionAgent
from .organizer_agent import OrganizerAgent
from .predictor_agent import PredictorAgent
from .strategist_agent import StrategistAgent
from .validator_agent import ValidatorAgent
from .vision_cortex import VisionCortex

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
