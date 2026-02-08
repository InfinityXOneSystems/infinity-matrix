"""Code editor and autonomous orchestration endpoints."""

from typing import Any
from uuid import uuid4

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

router = APIRouter()


class CodeEditRequest(BaseModel):
    """Code edit request from AI."""

    file_name: str = Field(..., description="Name of the file being edited")
    language: str = Field(..., description="Programming language")
    original_code: str = Field(..., description="Original code")
    instruction: str = Field(..., description="Natural language instruction for editing")


class CodeEditResponse(BaseModel):
    """Response from code edit operation."""

    success: bool = Field(..., description="Whether the operation succeeded")
    edited_code: str = Field(..., description="The edited code")
    explanation: str = Field(..., description="Explanation of changes made")
    changes_summary: str = Field(..., description="Summary of changes")


class OrchestrationRequest(BaseModel):
    """Request for autonomous orchestration."""

    task_description: str = Field(..., description="Description of the task")
    context: dict[str, Any] = Field(default_factory=dict, description="Additional context")
    target_agent_type: str | None = Field(None, description="Specific agent to target")


class OrchestrationResponse(BaseModel):
    """Response from orchestration."""

    task_id: str = Field(..., description="Unique task identifier")
    status: str = Field(..., description="Task status")
    assigned_agent: str = Field(..., description="Agent assigned to task")
    estimated_completion: str = Field(..., description="Estimated completion time")


class ChatRequest(BaseModel):
    """Chat request for AI assistant."""

    message: str = Field(..., description="User message")
    code_context: str | None = Field(None, description="Current code in editor")
    language: str | None = Field(None, description="Programming language")


class ChatResponse(BaseModel):
    """Chat response from AI."""

    message: str = Field(..., description="AI response message")
    code_edit: str | None = Field(None, description="Suggested code edit if applicable")
    action: str = Field(..., description="Action type: 'chat', 'edit', 'run', 'debug'")


# In-memory storage for demo
_tasks: dict[str, dict[str, Any]] = {}


@router.post(
    "/edit",
    summary="Request code edit from AI",
    response_model=CodeEditResponse,
)
async def edit_code(request: CodeEditRequest) -> CodeEditResponse:
    """Process a code editing request using autonomous agents.

    Args:
        request: Code edit request with instruction

    Returns:
        Edited code with explanation
    """
    # TODO: Integrate with actual AI/agent system
    # For now, return a mock response
    
    instruction_lower = request.instruction.lower()
    edited_code = request.original_code
    explanation = f"Applied your instruction: {request.instruction}"
    changes_summary = "Code modified by AI"

    # Simple logic for demo
    if "comment" in instruction_lower:
        lines = request.original_code.split('\n')
        edited_code = '\n'.join(['// ' + line if line.strip() and not line.strip().startswith('//') else line for line in lines])
        explanation = "Added comments to all code lines"
        changes_summary = "Commented out code"
    elif "add function" in instruction_lower:
        edited_code = request.original_code + "\n\n// New function added by AI\nfunction newFunction() {\n  return 'AI generated';\n}\n"
        explanation = "Added a new function as requested"
        changes_summary = "Added 1 new function"
    elif "refactor" in instruction_lower:
        explanation = "Refactored code to use modern syntax"
        changes_summary = "Refactored code structure"
        # Simple refactoring demo
        if "function" in request.original_code:
            edited_code = request.original_code.replace("function", "const").replace("(", " = (")

    return CodeEditResponse(
        success=True,
        edited_code=edited_code,
        explanation=explanation,
        changes_summary=changes_summary
    )


@router.post(
    "/orchestrate",
    summary="Create autonomous orchestration task",
    status_code=status.HTTP_201_CREATED,
    response_model=OrchestrationResponse,
)
async def orchestrate_task(request: OrchestrationRequest) -> OrchestrationResponse:
    """Create and assign a task to autonomous agents.

    Args:
        request: Orchestration request

    Returns:
        Task information with assigned agent
    """
    task_id = str(uuid4())
    
    # Determine which agent type should handle this
    agent_type = request.target_agent_type or "autonomous"
    
    # Store task
    _tasks[task_id] = {
        "description": request.task_description,
        "status": "queued",
        "agent": agent_type,
        "context": request.context
    }

    return OrchestrationResponse(
        task_id=task_id,
        status="queued",
        assigned_agent=agent_type,
        estimated_completion="2-5 minutes"
    )


@router.get(
    "/orchestrate/{task_id}",
    summary="Get orchestration task status",
    response_model=dict[str, Any],
)
async def get_task_status(task_id: str) -> dict[str, Any]:
    """Get the status of an orchestration task.

    Args:
        task_id: Task identifier

    Returns:
        Task status information
    """
    if task_id not in _tasks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found"
        )

    task = _tasks[task_id]
    return {
        "task_id": task_id,
        "status": task["status"],
        "agent": task["agent"],
        "description": task["description"]
    }


@router.post(
    "/chat",
    summary="Chat with AI assistant",
    response_model=ChatResponse,
)
async def chat(request: ChatRequest) -> ChatResponse:
    """Process a chat message and provide AI assistance.

    Args:
        request: Chat request with message and context

    Returns:
        AI response with potential code suggestions
    """
    message_lower = request.message.lower()
    
    # Determine action type and response
    if any(keyword in message_lower for keyword in ["fix", "bug", "error", "debug"]):
        action = "debug"
        response_msg = "I'm analyzing your code for issues. Here's what I found..."
    elif any(keyword in message_lower for keyword in ["add", "create", "write"]):
        action = "edit"
        response_msg = "I'll add that for you. Applying changes now..."
        code_edit = f"{request.code_context}\n\n// New code added by AI"
    elif any(keyword in message_lower for keyword in ["run", "execute", "test"]):
        action = "run"
        response_msg = "Running your code now. Check the terminal for output."
    elif any(keyword in message_lower for keyword in ["refactor", "improve", "optimize"]):
        action = "edit"
        response_msg = "I'll refactor your code to improve it..."
        code_edit = request.code_context
    else:
        action = "chat"
        response_msg = f"I understand you want to: {request.message}. I can help with:\n- Adding/modifying code\n- Refactoring\n- Debugging\n- Running code\n\nJust ask!"

    return ChatResponse(
        message=response_msg,
        code_edit=code_edit if action == "edit" else None,
        action=action
    )
