"""Cross-repository intelligence orchestration."""

from datetime import datetime
from typing import Any, dict, list

import httpx

from infinity_matrix.core.config import settings
from infinity_matrix.core.logging import LoggerMixin


class CrossRepoOrchestrator(LoggerMixin):
    """Orchestrator for cross-repository intelligence gathering."""

    def __init__(self):
        """Initialize orchestrator."""
        self.repos = {
            "real_estate": settings.real_estate_api_url,
            "financial_oracle": settings.financial_oracle_url,
            "sentiment_pulse": settings.sentiment_pulse_url,
            "lead_nexus": settings.lead_nexus_url,
        }
        self.client: httpx.AsyncClient | None = None

    async def initialize(self) -> None:
        """Initialize HTTP client."""
        self.client = httpx.AsyncClient(timeout=30.0)
        self.log_info("cross_repo_orchestrator_initialized")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
        self.log_info("cross_repo_orchestrator_shutdown")

    async def gather_intelligence(
        self,
        query: dict[str, Any],
        repos: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Gather intelligence from multiple repositories.

        Args:
            query: Intelligence query parameters
            repos: list of repositories to query (default: all)

        Returns:
            Aggregated intelligence results
        """
        if not self.client:
            await self.initialize()

        repos_to_query = repos or list(self.repos.keys())

        results = {}
        for repo in repos_to_query:
            if repo not in self.repos:
                continue

            url = self.repos[repo]
            if not url:
                self.log_warning(f"{repo}_not_configured")
                continue

            try:
                result = await self._query_repo(repo, url, query)
                results[repo] = result
            except Exception as e:
                self.log_error(f"{repo}_query_failed", error=str(e))
                results[repo] = {"error": str(e), "success": False}

        # Aggregate results
        aggregated = await self._aggregate_results(results)

        self.log_info(
            "intelligence_gathered",
            repos=list(results.keys()),
            success_count=sum(1 for r in results.values() if r.get("success")),
        )

        return aggregated

    async def _query_repo(
        self,
        repo: str,
        url: str,
        query: dict[str, Any],
    ) -> dict[str, Any]:
        """Query a specific repository."""
        endpoint = self._get_endpoint_for_repo(repo, query)
        full_url = f"{url}{endpoint}"

        try:
            response = await self.client.get(full_url, params=query)
            response.raise_for_status()

            return {
                "data": response.json(),
                "success": True,
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
            }

    def _get_endpoint_for_repo(self, repo: str, query: dict[str, Any]) -> str:
        """Get appropriate endpoint for repository based on query."""
        endpoint_map = {
            "real_estate": "/api/v1/market-analysis",
            "financial_oracle": "/api/v1/predict",
            "sentiment_pulse": "/api/v1/sentiment",
            "lead_nexus": "/api/v1/leads",
        }

        return endpoint_map.get(repo, "/api/v1/query")

    async def _aggregate_results(
        self,
        results: dict[str, Any],
    ) -> dict[str, Any]:
        """Aggregate results from multiple repositories."""
        aggregated = {
            "repositories": list(results.keys()),
            "results": results,
            "consensus": await self._calculate_consensus(results),
            "confidence": self._calculate_confidence(results),
            "timestamp": datetime.now().isoformat(),
        }

        return aggregated

    async def _calculate_consensus(
        self,
        results: dict[str, Any],
    ) -> dict[str, Any]:
        """Calculate consensus from multiple results."""
        successful_results = [
            r for r in results.values() if r.get("success")
        ]

        if not successful_results:
            return {"consensus": "no_data", "confidence": 0.0}

        # Simple consensus based on majority
        # In production, this would use more sophisticated algorithms

        return {
            "consensus": "positive",  # Placeholder
            "agreement_level": len(successful_results) / len(results),
        }

    def _calculate_confidence(self, results: dict[str, Any]) -> float:
        """Calculate confidence score based on result quality."""
        if not results:
            return 0.0

        successful = sum(1 for r in results.values() if r.get("success"))
        total = len(results)

        # Confidence based on successful queries
        return successful / total

    async def sync_lead_data(
        self,
        lead: dict[str, Any],
        target_repos: list[str] | None = None,
    ) -> dict[str, Any]:
        """
        Sync lead data across repositories.

        Args:
            lead: Lead data to sync
            target_repos: Target repositories

        Returns:
            Sync results
        """
        if not self.client:
            await self.initialize()

        repos_to_sync = target_repos or ["lead_nexus"]

        results = {}
        for repo in repos_to_sync:
            if repo not in self.repos or not self.repos[repo]:
                continue

            try:
                url = f"{self.repos[repo]}/api/v1/leads"
                response = await self.client.post(url, json=lead)
                response.raise_for_status()

                results[repo] = {
                    "success": True,
                    "response": response.json(),
                }
            except Exception as e:
                self.log_error(f"lead_sync_failed_{repo}", error=str(e))
                results[repo] = {
                    "success": False,
                    "error": str(e),
                }

        self.log_info("lead_data_synced", repos=list(results.keys()))

        return {
            "synced_repos": list(results.keys()),
            "results": results,
            "success": all(r.get("success") for r in results.values()),
        }

    async def get_unified_market_view(
        self,
        asset: str,
        asset_type: str = "stock",
    ) -> dict[str, Any]:
        """
        Get unified market view combining multiple data sources.

        Args:
            asset: Asset identifier
            asset_type: Type of asset

        Returns:
            Unified market view
        """
        # Query relevant repositories
        query = {"symbol": asset, "type": asset_type}

        intelligence = await self.gather_intelligence(
            query,
            repos=["financial_oracle", "sentiment_pulse"],
        )

        # Add local analysis
        from infinity_matrix.industries.finance import FinancialAnalyzer

        analyzer = FinancialAnalyzer()
        await analyzer.initialize()
        local_analysis = await analyzer.analyze_stock(asset)
        await analyzer.shutdown()

        # Combine all data
        unified_view = {
            "asset": asset,
            "asset_type": asset_type,
            "local_analysis": local_analysis,
            "cross_repo_intelligence": intelligence,
            "unified_score": self._calculate_unified_score(
                local_analysis,
                intelligence,
            ),
            "timestamp": datetime.now().isoformat(),
        }

        return unified_view

    def _calculate_unified_score(
        self,
        local: dict[str, Any],
        remote: dict[str, Any],
    ) -> float:
        """Calculate unified score from multiple sources."""
        # Simple averaging - production would use weighted algorithms
        scores = []

        if local.get("success"):
            # Convert signal to score
            signal_map = {
                "bullish": 0.8,
                "oversold": 0.7,
                "neutral": 0.5,
                "overbought": 0.3,
                "bearish": 0.2,
            }
            scores.append(signal_map.get(local.get("signal", "neutral"), 0.5))

        # Add more scoring logic here

        return sum(scores) / len(scores) if scores else 0.5
