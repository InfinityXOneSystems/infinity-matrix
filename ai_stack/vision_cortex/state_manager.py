"""State management for Vision Cortex."""

import json
import threading
from dataclasses import asdict, dataclass
from datetime import datetime
from typing import Any, dict, list


@dataclass
class Event:
    """System event."""
    timestamp: str
    event_type: str
    message: str
    metadata: dict[str, Any]


class StateManager:
    """Manages system state, events, and persistence."""

    def __init__(self, config):
        """Initialize state manager."""
        self.config = config
        self.state_file = config.tracking_dir / "system_state.json"
        self.events_file = config.tracking_dir / "events.jsonl"
        self.reports_dir = config.tracking_dir / "reports"
        self.reports_dir.mkdir(parents=True, exist_ok=True)

        self._lock = threading.Lock()
        self._state = self._load_state()
        self._pending_issues = []

    def _load_state(self) -> dict[str, Any]:
        """Load state from disk."""
        if self.state_file.exists():
            try:
                with open(self.state_file) as f:
                    return json.load(f)
            except Exception:
                pass

        return {
            'initialized_at': datetime.utcnow().isoformat(),
            'last_update': datetime.utcnow().isoformat(),
            'cycle_count': 0,
            'agents': {},
            'metrics': {}
        }

    def _save_state(self):
        """Save state to disk."""
        with self._lock:
            self._state['last_update'] = datetime.utcnow().isoformat()
            with open(self.state_file, 'w') as f:
                json.dump(self._state, f, indent=2)

    def update_state(self, key: str, value: Any):
        """Update a state value."""
        with self._lock:
            self._state[key] = value
        self._save_state()

    def get_state(self, key: str, default: Any = None) -> Any:
        """Get a state value."""
        return self._state.get(key, default)

    def log_event(self, event_type: str, message: str, metadata: dict[str, Any] | None = None):
        """Log an event."""
        event = Event(
            timestamp=datetime.utcnow().isoformat(),
            event_type=event_type,
            message=message,
            metadata=metadata or {}
        )

        # Append to events file
        with open(self.events_file, 'a') as f:
            f.write(json.dumps(asdict(event)) + '\n')

    def get_events(self, event_type: str | None = None, limit: int = 100) -> list[Event]:
        """Get recent events."""
        events = []

        if not self.events_file.exists():
            return events

        with open(self.events_file) as f:
            lines = f.readlines()

        for line in reversed(lines[-limit:]):
            try:
                event_dict = json.loads(line)
                event = Event(**event_dict)

                if event_type is None or event.event_type == event_type:
                    events.append(event)

            except Exception:
                continue

        return events

    def save_report(self, report: dict[str, Any]):
        """Save a system report."""
        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        report_file = self.reports_dir / f"report_{timestamp}.json"

        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

    def get_pending_issues(self) -> list[dict[str, Any]]:
        """Get issues pending debate/resolution."""
        return self._pending_issues.copy()

    def add_issue(self, issue: dict[str, Any]):
        """Add an issue for debate."""
        issue['id'] = f"issue_{datetime.utcnow().timestamp()}"
        issue['created_at'] = datetime.utcnow().isoformat()
        self._pending_issues.append(issue)

    def resolve_issue(self, issue_id: str, resolution: dict[str, Any]):
        """Mark an issue as resolved."""
        self._pending_issues = [i for i in self._pending_issues if i['id'] != issue_id]

        self.log_event(
            event_type="issue_resolved",
            message=f"Issue {issue_id} resolved",
            metadata=resolution
        )

    def get_performance_metrics(self) -> dict[str, Any]:
        """Get system performance metrics."""
        return self._state.get('metrics', {})

    def update_metrics(self, metrics: dict[str, Any]):
        """Update performance metrics."""
        current_metrics = self._state.get('metrics', {})
        current_metrics.update(metrics)
        self.update_state('metrics', current_metrics)
