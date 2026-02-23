"""
Minions Skills Python SDK

Reusable skill definitions that agents can load, compose, and version
"""

__version__ = "0.1.0"


def create_client(**kwargs):
    """Create a client for Minions Skills.

    Args:
        **kwargs: Configuration options.

    Returns:
        dict: Client configuration.
    """
    return {
        "version": __version__,
        **kwargs,
    }

from .schemas import *
