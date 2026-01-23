"""Web-based real-time dashboard for system monitoring."""
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, render_template

from agents.health import HealthMonitor, WorkflowTracker
from agents.orchestrator import CDOrchestrator
from exporters.artifact_exporter import ArtifactExporter, ComplianceTracker

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Initialize components
repo_path = Path(__file__).parent.parent.parent
health_monitor = HealthMonitor(str(repo_path / ".prooftest" / "logs"))
workflow_tracker = WorkflowTracker(str(repo_path / ".prooftest" / "logs"))
orchestrator = CDOrchestrator(str(repo_path))
exporter = ArtifactExporter(str(repo_path))
compliance_tracker = ComplianceTracker(str(repo_path))


@app.route('/')
def index():
    """Main dashboard page."""
    return render_template('dashboard.html')


@app.route('/api/status')
def get_status():
    """Get current system status."""
    try:
        status = orchestrator.get_system_status()
        return jsonify(status)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/agents')
def get_agents():
    """Get all agent statuses."""
    try:
        agents = health_monitor.get_all_agents()
        return jsonify(agents)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/workflows')
def get_workflows():
    """Get recent workflow executions."""
    try:
        limit = 20
        workflows = workflow_tracker.get_recent_workflows(limit)
        return jsonify(workflows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/compliance')
def get_compliance():
    """Get compliance report."""
    try:
        report = compliance_tracker.generate_compliance_report()
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/export/<format>')
def export_data(format):
    """Export data in specified format."""
    try:
        if format == 'markdown':
            file_path = exporter.export_markdown()
        elif format == 'csv':
            file_path = exporter.export_csv()
        elif format == 'json':
            file_path = exporter.export_json()
        else:
            return jsonify({"error": "Invalid format"}), 400

        return jsonify({
            "success": True,
            "file": file_path,
            "message": f"Exported to {format}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/pipeline/run', methods=['POST'])
def run_pipeline():
    """Trigger a pipeline run."""
    try:
        result = orchestrator.run_full_pipeline()
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "infinity-matrix-dashboard"
    })


def run_dashboard(host='0.0.0.0', port=5000):
    """Run the dashboard server."""
    print(f"🌐 Starting Infinity Matrix Dashboard on http://{host}:{port}")
    print(f"📊 Access the dashboard at: http://localhost:{port}")
    app.run(host=host, port=port, debug=False)


if __name__ == '__main__':
    run_dashboard()
