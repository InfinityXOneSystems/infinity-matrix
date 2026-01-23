"""
Model and audit drift detection system.
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, dict, list

import structlog

logger = structlog.get_logger()


class DriftType(str, Enum):
    """Types of drift."""
    DATA_DRIFT = "data_drift"
    CONCEPT_DRIFT = "concept_drift"
    PREDICTION_DRIFT = "prediction_drift"
    PERFORMANCE_DRIFT = "performance_drift"


class DriftSeverity(str, Enum):
    """Drift severity levels."""
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class DriftDetector:
    """Automated model and audit drift detection."""

    def __init__(self):
        self.drift_history: list[dict[str, Any]] = []
        self.models: dict[str, dict[str, Any]] = {}
        self.drift_thresholds = {
            "data_drift": 0.1,
            "concept_drift": 0.15,
            "prediction_drift": 0.2,
            "performance_drift": 0.1,
        }

    def register_model(
        self,
        model_id: str,
        model_name: str,
        model_type: str,
        baseline_metrics: dict[str, float],
    ) -> dict[str, Any]:
        """Register a model for drift monitoring."""
        model_info = {
            "model_id": model_id,
            "model_name": model_name,
            "model_type": model_type,
            "baseline_metrics": baseline_metrics,
            "registered_at": datetime.now().isoformat(),
            "last_check": None,
        }

        self.models[model_id] = model_info
        logger.info("Model registered for drift monitoring", model_id=model_id)

        return model_info

    async def check_drift(
        self,
        model_id: str,
        current_metrics: dict[str, float],
    ) -> dict[str, Any]:
        """Check for model drift."""
        if model_id not in self.models:
            raise ValueError(f"Model {model_id} not registered")

        model = self.models[model_id]
        baseline = model["baseline_metrics"]

        drift_results = {
            "model_id": model_id,
            "timestamp": datetime.now().isoformat(),
            "drift_detected": False,
            "drift_types": [],
            "severity": DriftSeverity.NONE,
            "metrics_comparison": {},
        }

        # Calculate drift for each metric
        max_drift = 0.0
        for metric_name, baseline_value in baseline.items():
            if metric_name in current_metrics:
                current_value = current_metrics[metric_name]
                drift = abs(current_value - baseline_value) / (baseline_value + 1e-10)

                drift_results["metrics_comparison"][metric_name] = {
                    "baseline": baseline_value,
                    "current": current_value,
                    "drift": drift,
                }

                max_drift = max(max_drift, drift)

                # Check if drift exceeds threshold
                if drift > self.drift_thresholds.get("performance_drift", 0.1):
                    drift_results["drift_detected"] = True
                    drift_results["drift_types"].append(DriftType.PERFORMANCE_DRIFT.value)

        # Determine severity
        if max_drift > 0.5:
            drift_results["severity"] = DriftSeverity.CRITICAL
        elif max_drift > 0.3:
            drift_results["severity"] = DriftSeverity.HIGH
        elif max_drift > 0.2:
            drift_results["severity"] = DriftSeverity.MEDIUM
        elif max_drift > 0.1:
            drift_results["severity"] = DriftSeverity.LOW
        else:
            drift_results["severity"] = DriftSeverity.NONE

        # Update model info
        model["last_check"] = datetime.now().isoformat()

        # Store drift result
        self.drift_history.append(drift_results)

        if drift_results["drift_detected"]:
            logger.warning(
                "Model drift detected",
                model_id=model_id,
                severity=drift_results["severity"],
                max_drift=max_drift,
            )
        else:
            logger.info("No drift detected", model_id=model_id)

        return drift_results

    async def run_monthly_audit(self) -> dict[str, Any]:
        """Run monthly audit for all registered models."""
        logger.info("Starting monthly drift audit", models=len(self.models))

        audit_results = {
            "audit_id": f"audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "models_audited": len(self.models),
            "results": [],
        }

        for model_id, model_info in self.models.items():
            # Simulate current metrics (in production, fetch real metrics)
            current_metrics = {
                k: v * (1.0 + (hash(model_id) % 20 - 10) / 100.0)
                for k, v in model_info["baseline_metrics"].items()
            }

            drift_result = await self.check_drift(model_id, current_metrics)
            audit_results["results"].append(drift_result)

        # Summary statistics
        drift_detected_count = sum(1 for r in audit_results["results"] if r["drift_detected"])
        audit_results["summary"] = {
            "total_models": len(self.models),
            "drift_detected": drift_detected_count,
            "no_drift": len(self.models) - drift_detected_count,
        }

        logger.info("Monthly audit completed", drift_detected=drift_detected_count)

        return audit_results

    def get_drift_history(
        self,
        model_id: str | None = None,
        limit: int = 100,
    ) -> list[dict[str, Any]]:
        """Get drift detection history."""
        history = self.drift_history

        if model_id:
            history = [h for h in history if h["model_id"] == model_id]

        return history[-limit:]

    def get_drift_chart_data(
        self,
        model_id: str,
        days: int = 30,
    ) -> dict[str, Any]:
        """Get drift data for charts."""
        cutoff = datetime.now() - timedelta(days=days)

        # Filter history for this model and time period
        history = [
            h for h in self.drift_history
            if h["model_id"] == model_id
            and datetime.fromisoformat(h["timestamp"]) >= cutoff
        ]

        # Prepare chart data
        timestamps = []
        drift_values = []

        for entry in history:
            timestamps.append(entry["timestamp"])
            # Calculate average drift across all metrics
            metrics = entry.get("metrics_comparison", {})
            if metrics:
                avg_drift = sum(m["drift"] for m in metrics.values()) / len(metrics)
                drift_values.append(avg_drift)
            else:
                drift_values.append(0.0)

        return {
            "model_id": model_id,
            "period_days": days,
            "data_points": len(timestamps),
            "timestamps": timestamps,
            "drift_values": drift_values,
        }
