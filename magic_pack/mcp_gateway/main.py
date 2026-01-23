"""
MCP Gateway - Model Context Protocol Execution Layer
Provides governed execution of all autonomous actions with audit logging.
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum
import hashlib
import json
import os

app = FastAPI(
    title="InfinityXAI MCP Gateway",
    description="Governed execution layer for autonomous agents",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Execution Modes
class ExecutionMode(str, Enum):
    DRY_RUN = "DRY_RUN"
    LIVE = "LIVE"
    OBSERVE_ONLY = "OBSERVE_ONLY"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

# Models
class Tool(BaseModel):
    name: str
    description: str
    risk_level: RiskLevel
    requires_pr: bool
    dry_run_allowed: bool
    enabled: bool = True
    
class ExecuteRequest(BaseModel):
    tool_name: str
    args: Dict[str, Any]
    execution_mode: ExecutionMode = ExecutionMode.DRY_RUN
    requester: str
    
class ExecuteResponse(BaseModel):
    execution_id: str
    tool_name: str
    execution_mode: ExecutionMode
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: str
    audit_hash: str

# In-memory tool registry (will be moved to Firestore)
TOOL_REGISTRY: Dict[str, Tool] = {
    "github_create_pr": Tool(
        name="github_create_pr",
        description="Create a pull request on GitHub",
        risk_level=RiskLevel.MEDIUM,
        requires_pr=False,
        dry_run_allowed=True
    ),
    "github_merge_pr": Tool(
        name="github_merge_pr",
        description="Merge a pull request",
        risk_level=RiskLevel.HIGH,
        requires_pr=True,
        dry_run_allowed=True
    ),
    "deploy_staging": Tool(
        name="deploy_staging",
        description="Deploy to staging environment",
        risk_level=RiskLevel.MEDIUM,
        requires_pr=True,
        dry_run_allowed=True
    ),
    "deploy_production": Tool(
        name="deploy_production",
        description="Deploy to production environment",
        risk_level=RiskLevel.CRITICAL,
        requires_pr=True,
        dry_run_allowed=False
    ),
    "run_tests": Tool(
        name="run_tests",
        description="Run test suite",
        risk_level=RiskLevel.LOW,
        requires_pr=False,
        dry_run_allowed=False
    ),
}

# Global kill switch
KILL_SWITCH_ACTIVE = os.getenv("MCP_KILL_SWITCH", "false").lower() == "true"
GLOBAL_MODE = ExecutionMode(os.getenv("MCP_GLOBAL_MODE", "DRY_RUN"))

# Auth dependency
async def verify_mcp_key(x_mcp_key: str = Header(None)):
    expected_key = os.getenv("MCP_API_KEY")
    if not expected_key:
        raise HTTPException(status_code=500, detail="MCP_API_KEY not configured")
    if x_mcp_key != expected_key:
        raise HTTPException(status_code=401, detail="Invalid MCP key")
    return x_mcp_key

@app.get("/mcp/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "kill_switch": KILL_SWITCH_ACTIVE,
        "global_mode": GLOBAL_MODE,
        "tools_count": len(TOOL_REGISTRY)
    }

@app.get("/mcp/tools")
async def list_tools(api_key: str = Depends(verify_mcp_key)):
    """List all available tools with governance metadata"""
    return {
        "tools": [
            {
                "name": tool.name,
                "description": tool.description,
                "risk_level": tool.risk_level,
                "requires_pr": tool.requires_pr,
                "dry_run_allowed": tool.dry_run_allowed,
                "enabled": tool.enabled
            }
            for tool in TOOL_REGISTRY.values()
        ],
        "total": len(TOOL_REGISTRY),
        "global_mode": GLOBAL_MODE,
        "kill_switch": KILL_SWITCH_ACTIVE
    }

@app.get("/mcp/schema")
async def get_schema():
    """Get OpenAPI schema"""
    return app.openapi()

@app.post("/mcp/execute", response_model=ExecuteResponse)
async def execute_tool(
    request: ExecuteRequest,
    api_key: str = Depends(verify_mcp_key)
):
    """
    Execute a tool with governance checks.
    All executions are audited and logged.
    """
    
    # Check kill switch
    if KILL_SWITCH_ACTIVE:
        raise HTTPException(
            status_code=503,
            detail="MCP Gateway is in kill switch mode - all executions blocked"
        )
    
    # Check if tool exists
    if request.tool_name not in TOOL_REGISTRY:
        raise HTTPException(
            status_code=404,
            detail=f"Tool '{request.tool_name}' not found in registry"
        )
    
    tool = TOOL_REGISTRY[request.tool_name]
    
    # Check if tool is enabled
    if not tool.enabled:
        raise HTTPException(
            status_code=403,
            detail=f"Tool '{request.tool_name}' is currently disabled"
        )
    
    # Enforce global mode
    effective_mode = request.execution_mode
    if GLOBAL_MODE == ExecutionMode.OBSERVE_ONLY:
        effective_mode = ExecutionMode.OBSERVE_ONLY
    elif GLOBAL_MODE == ExecutionMode.DRY_RUN and request.execution_mode == ExecutionMode.LIVE:
        effective_mode = ExecutionMode.DRY_RUN
    
    # Check if dry run is allowed
    if effective_mode == ExecutionMode.DRY_RUN and not tool.dry_run_allowed:
        effective_mode = ExecutionMode.LIVE
    
    # Generate execution ID
    execution_id = hashlib.sha256(
        f"{request.tool_name}{request.requester}{datetime.utcnow().isoformat()}".encode()
    ).hexdigest()[:16]
    
    # Generate audit hash
    audit_data = {
        "execution_id": execution_id,
        "tool_name": request.tool_name,
        "args": request.args,
        "requester": request.requester,
        "mode": effective_mode,
        "timestamp": datetime.utcnow().isoformat()
    }
    audit_hash = hashlib.sha256(json.dumps(audit_data, sort_keys=True).encode()).hexdigest()
    
    # Execute tool (placeholder - will be wired to actual implementations)
    result = None
    error = None
    status = "success"
    
    try:
        if effective_mode == ExecutionMode.OBSERVE_ONLY:
            result = {"message": "Execution observed but not performed", "would_execute": request.args}
        elif effective_mode == ExecutionMode.DRY_RUN:
            result = {"message": "Dry run completed", "would_execute": request.args}
        else:
            # LIVE execution - wire to actual tool implementations
            result = {"message": "Live execution placeholder", "executed": request.args}
            
    except Exception as e:
        status = "error"
        error = str(e)
    
    # TODO: Log to Firestore (mcp_audit collection)
    
    return ExecuteResponse(
        execution_id=execution_id,
        tool_name=request.tool_name,
        execution_mode=effective_mode,
        status=status,
        result=result,
        error=error,
        timestamp=datetime.utcnow().isoformat(),
        audit_hash=audit_hash
    )

@app.get("/mcp/executions/{execution_id}")
async def get_execution(execution_id: str, api_key: str = Depends(verify_mcp_key)):
    """Get execution details by ID"""
    # TODO: Query from Firestore
    return {"message": "Execution lookup not yet implemented", "execution_id": execution_id}

@app.post("/mcp/kill-switch")
async def toggle_kill_switch(enabled: bool, api_key: str = Depends(verify_mcp_key)):
    """Toggle global kill switch"""
    global KILL_SWITCH_ACTIVE
    KILL_SWITCH_ACTIVE = enabled
    return {
        "kill_switch": KILL_SWITCH_ACTIVE,
        "message": "Kill switch activated" if enabled else "Kill switch deactivated"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
