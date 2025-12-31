"""Utility functions for the ingestion system."""

import hashlib
import logging
from typing import Any, Dict
from datetime import datetime

logger = logging.getLogger(__name__)


def generate_id(content: str) -> str:
    """Generate a unique ID based on content.
    
    Args:
        content: Content to hash
        
    Returns:
        Hash-based ID
    """
    return hashlib.sha256(content.encode()).hexdigest()[:16]


def sanitize_filename(filename: str) -> str:
    """Sanitize a filename for safe storage.
    
    Args:
        filename: Original filename
        
    Returns:
        Sanitized filename
    """
    import re
    # Remove or replace invalid characters
    filename = re.sub(r'[^\w\s\-.]', '_', filename)
    # Remove leading/trailing whitespace
    filename = filename.strip()
    # Limit length
    if len(filename) > 255:
        filename = filename[:255]
    return filename


def truncate_text(text: str, max_length: int = 1000) -> str:
    """Truncate text to a maximum length.
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."


def parse_datetime(date_str: str) -> datetime:
    """Parse a datetime string.
    
    Args:
        date_str: Date string to parse
        
    Returns:
        Datetime object
    """
    from dateutil import parser
    return parser.parse(date_str)


def dict_to_json_safe(data: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a dictionary to JSON-safe format.
    
    Args:
        data: Dictionary to convert
        
    Returns:
        JSON-safe dictionary
    """
    safe_data = {}
    for key, value in data.items():
        if isinstance(value, datetime):
            safe_data[key] = value.isoformat()
        elif isinstance(value, bytes):
            safe_data[key] = value.decode('utf-8', errors='ignore')
        elif isinstance(value, dict):
            safe_data[key] = dict_to_json_safe(value)
        elif isinstance(value, list):
            safe_data[key] = [
                dict_to_json_safe(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            safe_data[key] = value
    return safe_data
