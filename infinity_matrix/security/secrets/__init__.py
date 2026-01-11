"""Secrets management for secure storage and retrieval of sensitive data."""

import os
from abc import ABC, abstractmethod
from typing import Optional, dict

from cryptography.fernet import Fernet


class SecretsBackend(ABC):
    """Abstract base class for secrets backends."""

    @abstractmethod
    def get(self, key: str) -> str | None:
        """Get a secret value."""

    @abstractmethod
    def set(self, key: str, value: str) -> None:
        """Set a secret value."""

    @abstractmethod
    def delete(self, key: str) -> None:
        """Delete a secret."""

    @abstractmethod
    def list(self) -> list[str]:
        """list all secret keys."""


class LocalSecretsBackend(SecretsBackend):
    """Local encrypted secrets backend."""

    def __init__(self, encryption_key: bytes | None = None):
        if encryption_key is None:
            # Generate or load encryption key
            key_file = os.path.expanduser("~/.infinity-matrix/.secrets.key")
            if os.path.exists(key_file):
                with open(key_file, "rb") as f:
                    encryption_key = f.read()
            else:
                encryption_key = Fernet.generate_key()
                os.makedirs(os.path.dirname(key_file), exist_ok=True)
                with open(key_file, "wb") as f:
                    f.write(encryption_key)

        self.cipher = Fernet(encryption_key)
        self.secrets_file = os.path.expanduser("~/.infinity-matrix/.secrets")
        self._secrets: dict[str, str] = {}
        self._load()

    def _load(self) -> None:
        """Load secrets from file."""
        if os.path.exists(self.secrets_file):
            with open(self.secrets_file, "rb") as f:
                encrypted_data = f.read()
                if encrypted_data:
                    decrypted_data = self.cipher.decrypt(encrypted_data)
                    import json
                    self._secrets = json.loads(decrypted_data.decode())

    def _save(self) -> None:
        """Save secrets to file."""
        import json
        data = json.dumps(self._secrets).encode()
        encrypted_data = self.cipher.encrypt(data)

        os.makedirs(os.path.dirname(self.secrets_file), exist_ok=True)
        with open(self.secrets_file, "wb") as f:
            f.write(encrypted_data)

    def get(self, key: str) -> str | None:
        """Get a secret value."""
        return self._secrets.get(key)

    def set(self, key: str, value: str) -> None:
        """Set a secret value."""
        self._secrets[key] = value
        self._save()

    def delete(self, key: str) -> None:
        """Delete a secret."""
        if key in self._secrets:
            del self._secrets[key]
            self._save()

    def list(self) -> list[str]:
        """list all secret keys."""
        return list(self._secrets.keys())


class SecretsManager:
    """Manager for secrets with multiple backend support."""

    def __init__(self, backend: SecretsBackend | None = None):
        self.backend = backend or LocalSecretsBackend()

    def get(self, key: str, default: str | None = None) -> str | None:
        """
        Get a secret value.

        Args:
            key: Secret key
            default: Default value if secret not found

        Returns:
            Secret value or default
        """
        value = self.backend.get(key)
        return value if value is not None else default

    def set(self, key: str, value: str) -> None:
        """
        Set a secret value.

        Args:
            key: Secret key
            value: Secret value
        """
        self.backend.set(key, value)

    def delete(self, key: str) -> None:
        """
        Delete a secret.

        Args:
            key: Secret key
        """
        self.backend.delete(key)

    def list(self) -> list[str]:
        """
        list all secret keys.

        Returns:
            list of secret keys
        """
        return self.backend.list()


# Global secrets manager instance
_secrets_manager = SecretsManager()


def get_secrets_manager() -> SecretsManager:
    """Get the global secrets manager."""
    return _secrets_manager
