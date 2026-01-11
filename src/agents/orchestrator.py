"""Main orchestrator for the autonomous CD system."""
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, dict

from agents.health import AgentStatus, HealthMonitor, WorkflowTracker
from agents.pr_automation import PRAutomationAgent
from agents.scanner import StubTodoScanner
from agents.self_healing import SelfHealingAgent, ZeroInterventionTrigger


class CDOrchestrator:
    """Orchestrate all autonomous CD operations."""

    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path).resolve()
        self.health_monitor = HealthMonitor()
        self.workflow_tracker = WorkflowTracker()
        self.agent_id = "cd_orchestrator"

        # Initialize all agents
        self.scanner = StubTodoScanner(repo_path)
        self.pr_agent = PRAutomationAgent(repo_path)
        self.healing_agent = SelfHealingAgent(repo_path)
        self.trigger = ZeroInterventionTrigger(repo_path)

        self.health_monitor.register_agent(
            self.agent_id,
            "orchestrator",
            {"description": "Main orchestrator for CD pipeline"}
        )

    def run_full_pipeline(self) -> dict[str, Any]:
        """Execute the complete autonomous CD pipeline."""
        pipeline_start = datetime.utcnow()
        print(f"🚀 Starting autonomous CD pipeline at {pipeline_start.isoformat()}")

        try:
            self.health_monitor.heartbeat(self.agent_id, AgentStatus.HEALTHY)

            results = {
                "pipeline_id": f"pipeline_{pipeline_start.strftime('%Y%m%d_%H%M%S')}",
                "started_at": pipeline_start.isoformat(),
                "steps": []
            }

            # Step 1: Scan for TODOs/Stubs
            print("\n📊 Step 1: Scanning codebase for TODOs and stubs...")
            scan_results = self.scanner.scan()
            scan_report = self.scanner.generate_report(scan_results)
            results["steps"].append({
                "name": "scan",
                "status": "completed",
                "findings": len(scan_results),
                "report": scan_report
            })
            print(f"   Found {len(scan_results)} issues")

            # Step 2: Create PR if findings exist
            if scan_results:
                print("\n📝 Step 2: Creating automated PR...")
                pr_metadata = self.pr_agent.create_pr_metadata(scan_results)
                results["steps"].append({
                    "name": "create_pr",
                    "status": "completed",
                    "pr_metadata": pr_metadata
                })
                print(f"   PR created: {pr_metadata['title']}")

                # Step 3: Auto-review PR
                print("\n🔍 Step 3: Running automated PR review...")
                review = self.pr_agent.simulate_pr_review(pr_metadata)
                results["steps"].append({
                    "name": "review_pr",
                    "status": "completed",
                    "review": review
                })
                print(f"   Review status: {review['status']}")

                # Step 4: Auto-merge if approved
                if review.get("auto_merge_eligible"):
                    print("\n✅ Step 4: Auto-merging PR...")
                    merge_result = self.pr_agent.simulate_pr_merge(pr_metadata, review)
                    results["steps"].append({
                        "name": "merge_pr",
                        "status": "completed",
                        "merge_result": merge_result
                    })
                    print("   PR merged successfully")
            else:
                print("\n✨ No TODOs or stubs found - codebase is clean!")

            # Step 5: Self-healing check
            print("\n🏥 Step 5: Running self-healing checks...")
            healing_result = self.healing_agent.monitor_and_heal()
            results["steps"].append({
                "name": "self_healing",
                "status": "completed",
                "result": healing_result
            })
            print(f"   Healed {healing_result['unhealthy_agents']} agents")

            # Step 6: Check triggers
            print("\n⚡ Step 6: Checking zero-intervention triggers...")
            trigger_result = self.trigger.check_and_trigger()
            results["steps"].append({
                "name": "triggers",
                "status": "completed",
                "result": trigger_result
            })
            print(f"   {trigger_result['triggers_fired']} triggers fired")

            # Complete pipeline
            results["completed_at"] = datetime.utcnow().isoformat()
            results["status"] = "success"
            results["duration_seconds"] = (datetime.utcnow() - pipeline_start).total_seconds()

            self.health_monitor.record_success(self.agent_id)
            self.workflow_tracker.record_workflow(
                "full_pipeline",
                "success",
                results
            )

            # Save pipeline result
            self._save_pipeline_result(results)

            print(f"\n✅ Pipeline completed successfully in {results['duration_seconds']:.2f}s")
            return results

        except Exception as e:
            error_msg = f"Pipeline failed: {str(e)}"
            print(f"\n❌ {error_msg}")
            self.health_monitor.record_error(self.agent_id, error_msg)
            self.workflow_tracker.record_workflow(
                "full_pipeline",
                "failed",
                {"error": error_msg}
            )
            raise

    def _save_pipeline_result(self, results: dict[str, Any]):
        """Save pipeline results to proof directory."""
        proof_dir = self.repo_path / ".prooftest" / "artifacts"
        proof_dir.mkdir(parents=True, exist_ok=True)

        result_file = proof_dir / f"pipeline_{results['pipeline_id']}.json"
        with open(result_file, 'w') as f:
            json.dump(results, f, indent=2)

    def get_system_status(self) -> dict[str, Any]:
        """Get overall system status."""
        all_agents = self.health_monitor.get_all_agents()
        recent_workflows = self.workflow_tracker.get_recent_workflows(10)

        status = {
            "timestamp": datetime.utcnow().isoformat(),
            "total_agents": len(all_agents),
            "healthy_agents": sum(1 for a in all_agents.values() if a["status"] == "healthy"),
            "degraded_agents": sum(1 for a in all_agents.values() if a["status"] == "degraded"),
            "failed_agents": sum(1 for a in all_agents.values() if a["status"] == "failed"),
            "recent_workflows": len(recent_workflows),
            "agents": all_agents,
            "workflows": recent_workflows
        }

        return status


def main():
    """Main entry point for the orchestrator."""
    orchestrator = CDOrchestrator()

    if len(sys.argv) > 1 and sys.argv[1] == "status":
        # Just show status
        status = orchestrator.get_system_status()
        print(json.dumps(status, indent=2))
    else:
        # Run full pipeline
        results = orchestrator.run_full_pipeline()
        return results


if __name__ == "__main__":
    main()
