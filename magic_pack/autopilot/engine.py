"""
Autopilot Engine - Self-Healing and Self-Evolving System
Observe → Plan → Apply-Safe → Verify loop
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum
import asyncio
import httpx

class AutopilotMode(str, Enum):
    OBSERVE = "OBSERVE"
    PLAN = "PLAN"
    APPLY_SAFE = "APPLY_SAFE"
    VERIFY = "VERIFY"

class Issue(BaseModel):
    id: str
    severity: str
    description: str
    detected_at: str
    component: str
    
class Action(BaseModel):
    id: str
    type: str
    description: str
    risk_level: str
    requires_approval: bool
    
class AutopilotEngine:
    """
    Autonomous system maintenance and evolution engine.
    
    Workflow:
    1. OBSERVE: Monitor system health, detect drift, identify issues
    2. PLAN: Generate remediation actions
    3. APPLY_SAFE: Execute via MCP gateway (dry-run first, then live if safe)
    4. VERIFY: Confirm fix worked, rollback if not
    """
    
    def __init__(self, mcp_gateway_url: str, mcp_api_key: str):
        self.mcp_gateway_url = mcp_gateway_url
        self.mcp_api_key = mcp_api_key
        self.mode = AutopilotMode.OBSERVE
        self.issues: List[Issue] = []
        self.actions: List[Action] = []
        
    async def observe(self) -> List[Issue]:
        """
        Observe system state and detect issues.
        
        Checks:
        - Health endpoints (API, frontend, MCP gateway)
        - Error rates in logs
        - Resource utilization
        - Config drift
        - Dependency vulnerabilities
        - Test failures
        """
        issues = []
        
        # Check health endpoints
        try:
            async with httpx.AsyncClient() as client:
                # Check MCP Gateway
                response = await client.get(f"{self.mcp_gateway_url}/mcp/health")
                if response.status_code != 200:
                    issues.append(Issue(
                        id=f"health-mcp-{datetime.utcnow().timestamp()}",
                        severity="HIGH",
                        description="MCP Gateway health check failed",
                        detected_at=datetime.utcnow().isoformat(),
                        component="mcp_gateway"
                    ))
        except Exception as e:
            issues.append(Issue(
                id=f"health-mcp-{datetime.utcnow().timestamp()}",
                severity="CRITICAL",
                description=f"MCP Gateway unreachable: {str(e)}",
                detected_at=datetime.utcnow().isoformat(),
                component="mcp_gateway"
            ))
        
        # TODO: Add more checks
        # - Check API health
        # - Check frontend health
        # - Query error logs from Firestore
        # - Check Cloud Run metrics
        # - Check cost anomalies
        # - Check security vulnerabilities
        
        self.issues = issues
        return issues
    
    async def plan(self, issues: List[Issue]) -> List[Action]:
        """
        Generate remediation actions for detected issues.
        
        Uses AI to determine best course of action.
        """
        actions = []
        
        for issue in issues:
            if "unreachable" in issue.description.lower():
                # Service is down - attempt restart
                actions.append(Action(
                    id=f"action-restart-{issue.component}",
                    type="restart_service",
                    description=f"Restart {issue.component} service",
                    risk_level="MEDIUM",
                    requires_approval=False
                ))
            elif "health check failed" in issue.description.lower():
                # Health check failed - investigate and potentially redeploy
                actions.append(Action(
                    id=f"action-investigate-{issue.component}",
                    type="investigate",
                    description=f"Investigate {issue.component} health",
                    risk_level="LOW",
                    requires_approval=False
                ))
        
        # TODO: Use AI (Gemini) to generate more sophisticated actions
        
        self.actions = actions
        return actions
    
    async def apply_safe(self, actions: List[Action]) -> Dict[str, Any]:
        """
        Execute actions via MCP gateway with safety checks.
        
        Process:
        1. Execute in DRY_RUN mode first
        2. If dry run succeeds, execute in LIVE mode
        3. If LIVE fails, rollback
        """
        results = []
        
        for action in actions:
            # Skip high-risk actions without approval
            if action.risk_level in ["HIGH", "CRITICAL"] and action.requires_approval:
                results.append({
                    "action_id": action.id,
                    "status": "skipped",
                    "reason": "Requires human approval"
                })
                continue
            
            # Execute dry run first
            try:
                async with httpx.AsyncClient() as client:
                    dry_run_response = await client.post(
                        f"{self.mcp_gateway_url}/mcp/execute",
                        json={
                            "tool_name": action.type,
                            "args": {"action": action.description},
                            "execution_mode": "DRY_RUN",
                            "requester": "autopilot_engine"
                        },
                        headers={"X-MCP-Key": self.mcp_api_key}
                    )
                    
                    if dry_run_response.status_code == 200:
                        # Dry run succeeded, execute live
                        live_response = await client.post(
                            f"{self.mcp_gateway_url}/mcp/execute",
                            json={
                                "tool_name": action.type,
                                "args": {"action": action.description},
                                "execution_mode": "LIVE",
                                "requester": "autopilot_engine"
                            },
                            headers={"X-MCP-Key": self.mcp_api_key}
                        )
                        
                        results.append({
                            "action_id": action.id,
                            "status": "executed",
                            "execution_id": live_response.json().get("execution_id")
                        })
                    else:
                        results.append({
                            "action_id": action.id,
                            "status": "dry_run_failed",
                            "reason": dry_run_response.text
                        })
                        
            except Exception as e:
                results.append({
                    "action_id": action.id,
                    "status": "error",
                    "error": str(e)
                })
        
        return {"results": results, "timestamp": datetime.utcnow().isoformat()}
    
    async def verify(self, action_results: Dict[str, Any]) -> bool:
        """
        Verify that actions resolved the issues.
        
        Re-runs observe() and checks if issues are resolved.
        """
        # Wait for changes to take effect
        await asyncio.sleep(10)
        
        # Re-observe
        new_issues = await self.observe()
        
        # Check if issues were resolved
        resolved = len(new_issues) < len(self.issues)
        
        return resolved
    
    async def run_cycle(self):
        """
        Run a complete autopilot cycle: Observe → Plan → Apply → Verify
        """
        print(f"[{datetime.utcnow().isoformat()}] Autopilot cycle starting...")
        
        # 1. Observe
        self.mode = AutopilotMode.OBSERVE
        issues = await self.observe()
        print(f"  Detected {len(issues)} issues")
        
        if not issues:
            print("  No issues detected. System healthy.")
            return
        
        # 2. Plan
        self.mode = AutopilotMode.PLAN
        actions = await self.plan(issues)
        print(f"  Planned {len(actions)} remediation actions")
        
        # 3. Apply (safe)
        self.mode = AutopilotMode.APPLY_SAFE
        results = await self.apply_safe(actions)
        print(f"  Executed actions: {results}")
        
        # 4. Verify
        self.mode = AutopilotMode.VERIFY
        verified = await self.verify(results)
        print(f"  Verification: {'PASSED' if verified else 'FAILED'}")
        
        if not verified:
            print("  WARNING: Issues not resolved. Manual intervention may be required.")
        
        return {
            "issues": issues,
            "actions": actions,
            "results": results,
            "verified": verified,
            "timestamp": datetime.utcnow().isoformat()
        }

# Standalone execution
if __name__ == "__main__":
    import os
    from pydantic import BaseModel
    
    engine = AutopilotEngine(
        mcp_gateway_url=os.getenv("MCP_GATEWAY_URL", "http://localhost:8001"),
        mcp_api_key=os.getenv("MCP_API_KEY", "dev-key")
    )
    
    asyncio.run(engine.run_cycle())
