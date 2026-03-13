"""
Shared Ollama embedding utility for the Emergent Learning Framework.

Provides synchronous and asynchronous embedding generation using Ollama's
local embedding models. Falls back gracefully when Ollama is unavailable.

Usage:
    from ollama_embedder import OllamaEmbedder

    embedder = OllamaEmbedder()
    if embedder.is_ollama_available():
        # Sync usage
        embedding = embedder.embed_sync("Hello world")

        # Async usage
        embedding = await embedder.embed_async("Hello world")
"""

import os
import json
from typing import List, Optional
import urllib.request
import urllib.error

# Try to import aiohttp for async support
try:
    import aiohttp
    AIOHTTP_AVAILABLE = True
except ImportError:
    AIOHTTP_AVAILABLE = False


class OllamaEmbedder:
    """
    Embed text using Ollama's local embedding models.

    Supports both synchronous and asynchronous embedding generation.
    Default model: nomic-embed-text (768 dimensions, good balance of quality/speed)
    """

    # Default embedding model - nomic-embed-text is compact yet effective
    DEFAULT_MODEL = "nomic-embed-text"

    # Embedding dimensions for common models
    MODEL_DIMENSIONS = {
        "nomic-embed-text": 768,
        "mxbai-embed-large": 1024,
        "all-minilm": 384,
        "bge-large": 1024,
    }

    def __init__(
        self,
        model: str = None,
        base_url: str = None,
        timeout: int = 30
    ):
        """
        Initialize Ollama embedder.

        Args:
            model: Embedding model name (default: nomic-embed-text)
            base_url: Ollama API URL (default: http://127.0.0.1:11434)
            timeout: Request timeout in seconds
        """
        self.model = model or self.DEFAULT_MODEL
        self.base_url = base_url or os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
        self.timeout = timeout
        self._available = None  # Cached availability check

    @property
    def embedding_dim(self) -> int:
        """Get the embedding dimension for the current model."""
        return self.MODEL_DIMENSIONS.get(self.model, 768)

    @staticmethod
    def is_ollama_available(base_url: str = None, timeout: int = 2) -> bool:
        """
        Check if Ollama is running and accessible.

        Args:
            base_url: Ollama API URL (default: http://127.0.0.1:11434)
            timeout: Connection timeout in seconds

        Returns:
            True if Ollama is available, False otherwise
        """
        url = base_url or os.environ.get("OLLAMA_URL", "http://127.0.0.1:11434")
        try:
            req = urllib.request.Request(
                f"{url}/api/tags",
                method="GET"
            )
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.status == 200
        except (urllib.error.URLError, OSError, TimeoutError):
            return False

    def check_available(self) -> bool:
        """
        Check if Ollama is available (cached after first check).

        Returns:
            True if Ollama is available
        """
        if self._available is None:
            self._available = self.is_ollama_available(self.base_url)
        return self._available

    def embed(self, text: str) -> Optional[List[float]]:
        """Alias for embed_sync for backward compatibility."""
        return self.embed_sync(text)

    def embed_sync(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding synchronously.

        Args:
            text: Text to embed

        Returns:
            Embedding vector as list of floats, or None on error
        """
        try:
            data = json.dumps({
                "model": self.model,
                "prompt": text
            }).encode()

            req = urllib.request.Request(
                f"{self.base_url}/api/embeddings",
                data=data,
                headers={"Content-Type": "application/json"}
            )

            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                result = json.loads(resp.read().decode())
                return result.get("embedding")

        except (urllib.error.URLError, OSError, json.JSONDecodeError, TimeoutError) as e:
            # Log error but don't raise - allow graceful fallback
            import sys
            print(f"Ollama embedding error: {e}", file=sys.stderr)
            return None

    async def embed_async(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding asynchronously.

        Uses aiohttp if available, otherwise falls back to sync in thread.

        Args:
            text: Text to embed

        Returns:
            Embedding vector as list of floats, or None on error
        """
        if AIOHTTP_AVAILABLE:
            return await self._embed_aiohttp(text)
        else:
            # Fallback: run sync in thread pool
            import asyncio
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(None, self.embed_sync, text)

    async def _embed_aiohttp(self, text: str) -> Optional[List[float]]:
        """Generate embedding using aiohttp."""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/embeddings",
                    json={"model": self.model, "prompt": text},
                    timeout=aiohttp.ClientTimeout(total=self.timeout)
                ) as resp:
                    if resp.status == 200:
                        result = await resp.json()
                        return result.get("embedding")
                    return None
        except (aiohttp.ClientError, asyncio.TimeoutError, json.JSONDecodeError) as e:
            import sys
            print(f"Ollama async embedding error: {e}", file=sys.stderr)
            return None

    def embed_batch_sync(self, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts synchronously.

        Args:
            texts: List of texts to embed

        Returns:
            List of embedding vectors (None for any that failed)
        """
        return [self.embed_sync(text) for text in texts]

    async def embed_batch_async(self, texts: List[str]) -> List[Optional[List[float]]]:
        """
        Generate embeddings for multiple texts asynchronously.

        Args:
            texts: List of texts to embed

        Returns:
            List of embedding vectors (None for any that failed)
        """
        import asyncio
        tasks = [self.embed_async(text) for text in texts]
        return await asyncio.gather(*tasks)


# Convenience function for quick checks
def ollama_available(base_url: str = None) -> bool:
    """Quick check if Ollama is available."""
    return OllamaEmbedder.is_ollama_available(base_url)
