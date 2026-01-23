"""Economic analysis module for macro indicators and predictions."""

from datetime import datetime
from typing import Any, dict, list

from infinity_matrix.core.base import BaseAnalyzer
from infinity_matrix.core.config import settings


class EconomicAnalyzer(BaseAnalyzer[dict[str, Any], dict[str, Any]]):
    """Economic analysis engine for macro indicators."""

    def __init__(self, **kwargs: Any):
        """Initialize economic analyzer."""
        super().__init__(kwargs)
        self._fred_client = None

    async def initialize(self) -> None:
        """Initialize economic data sources."""
        if settings.fred_api_key:
            try:
                from fredapi import Fred
                self._fred_client = Fred(api_key=settings.fred_api_key)
                self.log_info("fred_client_initialized")
            except ImportError:
                self.log_warning("fredapi_not_installed")

        self.log_info("economic_analyzer_initialized")

    async def shutdown(self) -> None:
        """Cleanup resources."""
        self.log_info("economic_analyzer_shutdown")

    async def analyze(self, data: dict[str, Any]) -> dict[str, Any]:
        """Analyze economic data."""
        indicator = data.get("indicator", "gdp")
        region = data.get("region", "US")

        return await self.get_indicator(indicator, region)

    async def get_indicator(
        self,
        indicator: str,
        region: str = "US",
    ) -> dict[str, Any]:
        """
        Get economic indicator data.

        Args:
            indicator: Indicator name (gdp, unemployment, inflation, etc.)
            region: Region code

        Returns:
            Indicator data and analysis
        """
        # FRED series IDs for common indicators
        series_map = {
            "gdp": "GDP",
            "unemployment": "UNRATE",
            "inflation": "CPIAUCSL",
            "interest_rate": "DFF",
            "consumer_confidence": "UMCSENT",
            "housing_starts": "HOUST",
            "retail_sales": "RSXFS",
            "industrial_production": "INDPRO",
        }

        series_id = series_map.get(indicator.lower())

        if not series_id:
            return {
                "error": f"Unknown indicator: {indicator}",
                "success": False,
            }

        try:
            if self._fred_client:
                # Get data from FRED
                data = self._fred_client.get_series(series_id)

                # Get recent data points
                recent_data = data.tail(12)  # Last 12 observations

                analysis = {
                    "indicator": indicator,
                    "region": region,
                    "current_value": float(recent_data.iloc[-1]),
                    "previous_value": float(recent_data.iloc[-2]) if len(recent_data) > 1 else None,
                    "change": None,
                    "percent_change": None,
                    "trend": None,
                    "historical_data": recent_data.to_dict(),
                    "timestamp": datetime.now().isoformat(),
                    "success": True,
                }

                # Calculate changes
                if analysis["previous_value"]:
                    analysis["change"] = analysis["current_value"] - analysis["previous_value"]
                    analysis["percent_change"] = (
                        analysis["change"] / analysis["previous_value"] * 100
                    )

                # Determine trend
                if len(recent_data) >= 3:
                    values = recent_data.values[-3:]
                    if values[-1] > values[-2] > values[-3]:
                        analysis["trend"] = "increasing"
                    elif values[-1] < values[-2] < values[-3]:
                        analysis["trend"] = "decreasing"
                    else:
                        analysis["trend"] = "stable"

                self.log_info("indicator_retrieved", indicator=indicator)
                return analysis
            else:
                # Return mock data if FRED not available
                return self._get_mock_indicator(indicator, region)

        except Exception as e:
            self.log_error("indicator_retrieval_failed", indicator=indicator, error=str(e))
            return {"error": str(e), "success": False}

    def _get_mock_indicator(self, indicator: str, region: str) -> dict[str, Any]:
        """Get mock indicator data for testing."""
        import random

        base_values = {
            "gdp": 25000,
            "unemployment": 4.0,
            "inflation": 3.5,
            "interest_rate": 5.25,
            "consumer_confidence": 100,
        }

        base = base_values.get(indicator, 100)
        current = base * (1 + random.uniform(-0.1, 0.1))
        previous = base * (1 + random.uniform(-0.1, 0.1))

        return {
            "indicator": indicator,
            "region": region,
            "current_value": current,
            "previous_value": previous,
            "change": current - previous,
            "percent_change": (current - previous) / previous * 100,
            "trend": "stable",
            "note": "Mock data - FRED API not configured",
            "success": True,
            "timestamp": datetime.now().isoformat(),
        }

    async def get_economic_snapshot(
        self,
        region: str = "US",
    ) -> dict[str, Any]:
        """
        Get comprehensive economic snapshot.

        Args:
            region: Region code

        Returns:
            Economic snapshot with multiple indicators
        """
        indicators = [
            "gdp",
            "unemployment",
            "inflation",
            "interest_rate",
            "consumer_confidence",
        ]

        import asyncio

        results = await asyncio.gather(
            *[self.get_indicator(ind, region) for ind in indicators],
            return_exceptions=True,
        )

        snapshot = {
            "region": region,
            "indicators": {},
            "timestamp": datetime.now().isoformat(),
            "success": True,
        }

        for indicator, result in zip(indicators, results, strict=False):
            if isinstance(result, dict) and result.get("success"):
                snapshot["indicators"][indicator] = result

        # Overall economic health assessment
        snapshot["health_score"] = self._calculate_health_score(snapshot["indicators"])
        snapshot["outlook"] = self._determine_outlook(snapshot["indicators"])

        self.log_info("economic_snapshot_generated", region=region)
        return snapshot

    def _calculate_health_score(self, indicators: dict[str, Any]) -> float:
        """Calculate overall economic health score (0-100)."""
        score = 50.0  # Base score

        # Adjust based on indicators
        if "unemployment" in indicators:
            unemployment = indicators["unemployment"].get("current_value", 0)
            if unemployment < 4:
                score += 15
            elif unemployment < 6:
                score += 5
            else:
                score -= 10

        if "inflation" in indicators:
            inflation = indicators["inflation"].get("percent_change", 0)
            if 1 < inflation < 3:
                score += 10
            elif inflation > 5:
                score -= 15

        if "gdp" in indicators:
            gdp_trend = indicators["gdp"].get("trend")
            if gdp_trend == "increasing":
                score += 10
            elif gdp_trend == "decreasing":
                score -= 10

        return max(0, min(100, score))

    def _determine_outlook(self, indicators: dict[str, Any]) -> str:
        """Determine economic outlook."""
        health = self._calculate_health_score(indicators)

        if health >= 75:
            return "strong"
        elif health >= 60:
            return "positive"
        elif health >= 40:
            return "neutral"
        elif health >= 25:
            return "concerning"
        else:
            return "weak"

    async def predict_indicator(
        self,
        indicator: str,
        horizon_months: int = 3,
    ) -> dict[str, Any]:
        """
        Predict future values of an economic indicator.

        Args:
            indicator: Indicator name
            horizon_months: Prediction horizon in months

        Returns:
            Prediction results
        """
        # Get historical data
        current = await self.get_indicator(indicator)

        if not current.get("success"):
            return current

        # Simple trend-based prediction
        current_value = current["current_value"]
        trend = current.get("trend", "stable")

        predictions = []
        for month in range(1, horizon_months + 1):
            if trend == "increasing":
                predicted = current_value * (1 + 0.01 * month)
            elif trend == "decreasing":
                predicted = current_value * (1 - 0.01 * month)
            else:
                predicted = current_value

            predictions.append({
                "month": month,
                "value": predicted,
                "confidence": max(0.5, 1.0 - (month * 0.05)),  # Confidence decreases with time
            })

        return {
            "indicator": indicator,
            "current_value": current_value,
            "predictions": predictions,
            "horizon_months": horizon_months,
            "method": "trend_based",
            "success": True,
            "timestamp": datetime.now().isoformat(),
        }

    async def compare_regions(
        self,
        indicator: str,
        regions: list[str],
    ) -> dict[str, Any]:
        """
        Compare an indicator across regions.

        Args:
            indicator: Indicator name
            regions: list of region codes

        Returns:
            Comparison results
        """
        import asyncio

        results = await asyncio.gather(
            *[self.get_indicator(indicator, region) for region in regions],
            return_exceptions=True,
        )

        comparison = {
            "indicator": indicator,
            "regions": {},
            "ranking": [],
            "timestamp": datetime.now().isoformat(),
            "success": True,
        }

        valid_results = []
        for region, result in zip(regions, results, strict=False):
            if isinstance(result, dict) and result.get("success"):
                comparison["regions"][region] = result
                valid_results.append((region, result["current_value"]))

        # Rank regions
        valid_results.sort(key=lambda x: x[1], reverse=True)
        comparison["ranking"] = [{"region": r[0], "value": r[1]} for r in valid_results]

        self.log_info("regions_compared", indicator=indicator, count=len(regions))
        return comparison
