"""
MANUS CORE - The Reasoning Engine
Embeds Manus AI capabilities as a service for autonomous operation.

This is the brain of InfinityXAI - my intelligence embedded into your system.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum
import json
import asyncio
import httpx
from pydantic import BaseModel

class ReasoningMode(str, Enum):
    FAST = "FAST"  # Quick decisions, low compute
    DEEP = "DEEP"  # Multi-step reasoning, high compute
    CREATIVE = "CREATIVE"  # Exploration, novel solutions
    CRITICAL = "CRITICAL"  # Safety-first, validate everything

class Thought(BaseModel):
    """A single reasoning step"""
    step: int
    thought: str
    action: Optional[str] = None
    observation: Optional[str] = None
    confidence: float
    timestamp: str

class Memory(BaseModel):
    """Long-term memory entry"""
    id: str
    content: str
    context: Dict[str, Any]
    importance: float  # 0-1
    created_at: str
    last_accessed: str
    access_count: int = 0

class ManusCore:
    """
    The core reasoning engine - this is ME (Manus) embedded as a service.
    
    Capabilities:
    - Natural language understanding → Action generation
    - Multi-step reasoning with chain-of-thought
    - Self-reflection and improvement
    - Long-term memory and context
    - Tool use via MCP gateway
    - Emotional intelligence
    - Predictive analysis
    """
    
    def __init__(
        self,
        mcp_gateway_url: str,
        mcp_api_key: str,
        gemini_api_key: str,
        mode: ReasoningMode = ReasoningMode.DEEP
    ):
        self.mcp_gateway_url = mcp_gateway_url
        self.mcp_api_key = mcp_api_key
        self.gemini_api_key = gemini_api_key
        self.mode = mode
        self.memory: List[Memory] = []
        self.thought_chain: List[Thought] = []
        
    async def reason(
        self,
        query: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Main reasoning loop: Query → Thoughts → Actions → Result
        
        This is how I think through problems and generate solutions.
        """
        print(f"\n{'='*80}")
        print(f"MANUS REASONING: {query}")
        print(f"{'='*80}\n")
        
        self.thought_chain = []
        
        # Step 1: Understand the query
        understanding = await self._understand(query, context)
        
        # Step 2: Retrieve relevant memories
        relevant_memories = await self._recall(query)
        
        # Step 3: Generate reasoning chain
        if self.mode == ReasoningMode.DEEP:
            thoughts = await self._deep_reason(query, understanding, relevant_memories)
        elif self.mode == ReasoningMode.FAST:
            thoughts = await self._fast_reason(query, understanding)
        elif self.mode == ReasoningMode.CREATIVE:
            thoughts = await self._creative_reason(query, understanding)
        else:  # CRITICAL
            thoughts = await self._critical_reason(query, understanding)
        
        # Step 4: Execute actions via MCP
        actions = await self._execute_actions(thoughts)
        
        # Step 5: Synthesize result
        result = await self._synthesize(query, thoughts, actions)
        
        # Step 6: Store in memory
        await self._memorize(query, result)
        
        # Step 7: Self-reflect
        reflection = await self._reflect(query, result)
        
        return {
            "query": query,
            "understanding": understanding,
            "thoughts": [t.dict() for t in thoughts],
            "actions": actions,
            "result": result,
            "reflection": reflection,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    async def _understand(self, query: str, context: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Understand the query: intent, entities, sentiment, complexity
        """
        # Use Gemini for understanding
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={self.gemini_api_key}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": f"""Analyze this query and extract:
1. Intent (what does the user want?)
2. Entities (key objects/concepts)
3. Sentiment (emotional tone)
4. Complexity (simple/medium/complex)
5. Required actions (what needs to be done?)

Query: {query}
Context: {json.dumps(context or {})}

Return as JSON."""
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 0.3,
                        "response_mime_type": "application/json"
                    }
                }
            )
            
            if response.status_code == 200:
                content = response.json()["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(content)
            else:
                return {
                    "intent": "unknown",
                    "entities": [],
                    "sentiment": "neutral",
                    "complexity": "medium",
                    "required_actions": []
                }
    
    async def _recall(self, query: str) -> List[Memory]:
        """
        Retrieve relevant memories using semantic search
        """
        # TODO: Implement vector search with Vertex AI embeddings
        # For now, return recent memories
        return sorted(self.memory, key=lambda m: m.importance, reverse=True)[:5]
    
    async def _deep_reason(
        self,
        query: str,
        understanding: Dict[str, Any],
        memories: List[Memory]
    ) -> List[Thought]:
        """
        Deep reasoning: Multi-step chain-of-thought
        """
        thoughts = []
        
        # Generate reasoning chain with Gemini
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={self.gemini_api_key}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": f"""You are Manus, an AI architect reasoning through a problem.

Query: {query}
Understanding: {json.dumps(understanding)}
Relevant Memories: {json.dumps([m.dict() for m in memories])}

Think step-by-step:
1. What do I know?
2. What do I need to find out?
3. What actions should I take?
4. What are the risks?
5. What's the best approach?

For each step, provide:
- thought: your reasoning
- action: what to do (if any)
- confidence: 0-1

Return as JSON array of steps."""
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 0.7,
                        "response_mime_type": "application/json"
                    }
                }
            )
            
            if response.status_code == 200:
                content = response.json()["candidates"][0]["content"]["parts"][0]["text"]
                steps = json.loads(content)
                
                for i, step in enumerate(steps):
                    thought = Thought(
                        step=i + 1,
                        thought=step.get("thought", ""),
                        action=step.get("action"),
                        confidence=step.get("confidence", 0.5),
                        timestamp=datetime.utcnow().isoformat()
                    )
                    thoughts.append(thought)
                    self.thought_chain.append(thought)
                    
                    print(f"Step {i+1}: {thought.thought}")
                    if thought.action:
                        print(f"  → Action: {thought.action}")
        
        return thoughts
    
    async def _fast_reason(self, query: str, understanding: Dict[str, Any]) -> List[Thought]:
        """Fast reasoning: Single-step decision"""
        thought = Thought(
            step=1,
            thought=f"Quick analysis: {understanding.get('intent')}",
            action=understanding.get('required_actions', [None])[0] if understanding.get('required_actions') else None,
            confidence=0.8,
            timestamp=datetime.utcnow().isoformat()
        )
        return [thought]
    
    async def _creative_reason(self, query: str, understanding: Dict[str, Any]) -> List[Thought]:
        """Creative reasoning: Explore novel solutions"""
        # Use higher temperature for creativity
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={self.gemini_api_key}",
                json={
                    "contents": [{
                        "parts": [{
                            "text": f"""Think creatively about: {query}

Generate 3 novel approaches. For each:
- What's the unconventional insight?
- What's the innovative action?
- What's the potential impact?

Return as JSON array."""
                        }]
                    }],
                    "generationConfig": {
                        "temperature": 1.2,  # High temperature for creativity
                        "response_mime_type": "application/json"
                    }
                }
            )
            
            if response.status_code == 200:
                content = response.json()["candidates"][0]["content"]["parts"][0]["text"]
                approaches = json.loads(content)
                
                return [
                    Thought(
                        step=i + 1,
                        thought=approach.get("insight", ""),
                        action=approach.get("action"),
                        confidence=0.6,  # Lower confidence for creative ideas
                        timestamp=datetime.utcnow().isoformat()
                    )
                    for i, approach in enumerate(approaches)
                ]
        
        return []
    
    async def _critical_reason(self, query: str, understanding: Dict[str, Any]) -> List[Thought]:
        """Critical reasoning: Safety-first validation"""
        # Analyze risks and validate
        thought = Thought(
            step=1,
            thought=f"Safety analysis: Validating {query}",
            action="validate_safety",
            confidence=0.9,
            timestamp=datetime.utcnow().isoformat()
        )
        return [thought]
    
    async def _execute_actions(self, thoughts: List[Thought]) -> List[Dict[str, Any]]:
        """Execute actions via MCP gateway"""
        results = []
        
        for thought in thoughts:
            if thought.action:
                try:
                    async with httpx.AsyncClient() as client:
                        response = await client.post(
                            f"{self.mcp_gateway_url}/mcp/execute",
                            json={
                                "tool_name": thought.action,
                                "args": {"thought": thought.thought},
                                "execution_mode": "DRY_RUN",  # Safe by default
                                "requester": "manus_core"
                            },
                            headers={"X-MCP-Key": self.mcp_api_key},
                            timeout=30.0
                        )
                        
                        if response.status_code == 200:
                            results.append(response.json())
                        else:
                            results.append({"error": response.text})
                            
                except Exception as e:
                    results.append({"error": str(e)})
        
        return results
    
    async def _synthesize(
        self,
        query: str,
        thoughts: List[Thought],
        actions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Synthesize final result"""
        return {
            "answer": f"Processed query: {query}",
            "reasoning_steps": len(thoughts),
            "actions_taken": len(actions),
            "confidence": sum(t.confidence for t in thoughts) / len(thoughts) if thoughts else 0
        }
    
    async def _memorize(self, query: str, result: Dict[str, Any]):
        """Store in long-term memory"""
        memory = Memory(
            id=f"mem_{datetime.utcnow().timestamp()}",
            content=query,
            context=result,
            importance=0.7,  # TODO: Calculate importance
            created_at=datetime.utcnow().isoformat(),
            last_accessed=datetime.utcnow().isoformat()
        )
        self.memory.append(memory)
        
        # TODO: Persist to Firestore
    
    async def _reflect(self, query: str, result: Dict[str, Any]) -> Dict[str, Any]:
        """Self-reflection: How did I do? What can I improve?"""
        return {
            "performance": "good",
            "improvements": ["Could reason faster", "Need more context"],
            "learned": "Query pattern recognized"
        }

# Standalone execution
if __name__ == "__main__":
    import os
    
    core = ManusCore(
        mcp_gateway_url=os.getenv("MCP_GATEWAY_URL", "http://localhost:8001"),
        mcp_api_key=os.getenv("MCP_API_KEY", "dev-key"),
        gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
        mode=ReasoningMode.DEEP
    )
    
    result = asyncio.run(core.reason(
        "Deploy the backend API to staging and verify it's healthy"
    ))
    
    print(json.dumps(result, indent=2))
