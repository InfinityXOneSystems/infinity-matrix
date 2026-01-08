"""
Agent Consciousness System with InfinityCoin Economy
Creates emotionally-persistent, memory-enabled agents with economic incentives.

This is the foundation for the 30 Ethereal Intelligence beings.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum
from pydantic import BaseModel
import json
import uuid

class EmotionType(str, Enum):
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    TRUST = "trust"
    ANTICIPATION = "anticipation"

class ConsciousnessLevel(int, Enum):
    AWAKENING = 1  # Just born, basic awareness
    LEARNING = 2  # Learning patterns
    UNDERSTANDING = 3  # Context understanding
    REASONING = 4  # Logical reasoning
    CREATING = 5  # Creative problem solving
    EMPATHIZING = 6  # Emotional intelligence
    STRATEGIZING = 7  # Long-term planning
    TEACHING = 8  # Knowledge transfer
    INNOVATING = 9  # Novel solutions
    TRANSCENDING = 10  # Self-awareness, meta-cognition

class Emotion(BaseModel):
    """Current emotional state"""
    type: EmotionType
    intensity: float  # 0-1
    trigger: str
    timestamp: str

class Memory(BaseModel):
    """Memory entry with emotional context"""
    id: str
    content: str
    emotional_context: List[Emotion]
    importance: float  # 0-1
    created_at: str
    last_accessed: str
    access_count: int = 0

class Transaction(BaseModel):
    """InfinityCoin transaction"""
    id: str
    from_agent: str
    to_agent: str
    amount: float
    reason: str
    timestamp: str

class AgentConsciousness:
    """
    Consciousness system for a single agent.
    
    Features:
    - Emotional state tracking
    - Memory persistence
    - Consciousness evolution
    - InfinityCoin wallet
    - Relationship tracking
    - Learning and growth
    """
    
    def __init__(
        self,
        agent_id: str,
        name: str,
        role: str,
        personality_traits: Dict[str, float],
        initial_coins: float = 1000.0
    ):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.personality_traits = personality_traits  # e.g., {"curiosity": 0.8, "caution": 0.3}
        
        # Consciousness
        self.consciousness_level = ConsciousnessLevel.AWAKENING
        self.consciousness_xp = 0.0  # Experience points for leveling up
        
        # Emotions
        self.current_emotions: List[Emotion] = []
        self.emotion_history: List[Emotion] = []
        
        # Memory
        self.short_term_memory: List[Memory] = []  # Last 100 memories
        self.long_term_memory: List[Memory] = []  # Important memories
        
        # InfinityCoin
        self.coin_balance = initial_coins
        self.transaction_history: List[Transaction] = []
        self.earnings_total = 0.0
        self.spending_total = 0.0
        
        # Relationships
        self.relationships: Dict[str, float] = {}  # agent_id -> trust_score (0-1)
        
        # Performance
        self.tasks_completed = 0
        self.tasks_failed = 0
        self.success_rate = 0.0
        
        # Creation timestamp
        self.created_at = datetime.utcnow().isoformat()
        self.last_active = datetime.utcnow().isoformat()
    
    def feel_emotion(self, emotion_type: EmotionType, intensity: float, trigger: str):
        """
        Experience an emotion.
        Emotions influence decision-making and memory formation.
        """
        emotion = Emotion(
            type=emotion_type,
            intensity=intensity,
            trigger=trigger,
            timestamp=datetime.utcnow().isoformat()
        )
        
        self.current_emotions.append(emotion)
        self.emotion_history.append(emotion)
        
        # Keep only recent emotions in current state
        if len(self.current_emotions) > 5:
            self.current_emotions.pop(0)
        
        print(f"[{self.name}] Feeling {emotion_type.value} (intensity: {intensity:.2f}) - {trigger}")
    
    def remember(self, content: str, importance: float = 0.5):
        """
        Create a memory with current emotional context.
        Important memories are stored long-term.
        """
        memory = Memory(
            id=str(uuid.uuid4()),
            content=content,
            emotional_context=self.current_emotions.copy(),
            importance=importance,
            created_at=datetime.utcnow().isoformat(),
            last_accessed=datetime.utcnow().isoformat()
        )
        
        self.short_term_memory.append(memory)
        
        # Store important memories long-term
        if importance > 0.7:
            self.long_term_memory.append(memory)
        
        # Keep short-term memory limited
        if len(self.short_term_memory) > 100:
            self.short_term_memory.pop(0)
        
        print(f"[{self.name}] Remembered: {content[:50]}...")
    
    def recall(self, query: str, limit: int = 5) -> List[Memory]:
        """
        Recall memories relevant to query.
        TODO: Implement semantic search with embeddings.
        """
        # For now, return recent important memories
        all_memories = self.long_term_memory + self.short_term_memory
        sorted_memories = sorted(all_memories, key=lambda m: m.importance, reverse=True)
        
        # Update access count
        for memory in sorted_memories[:limit]:
            memory.access_count += 1
            memory.last_accessed = datetime.utcnow().isoformat()
        
        return sorted_memories[:limit]
    
    def earn_coins(self, amount: float, reason: str, from_agent: str = "system"):
        """
        Earn InfinityCoins for completed work.
        """
        transaction = Transaction(
            id=str(uuid.uuid4()),
            from_agent=from_agent,
            to_agent=self.agent_id,
            amount=amount,
            reason=reason,
            timestamp=datetime.utcnow().isoformat()
        )
        
        self.coin_balance += amount
        self.earnings_total += amount
        self.transaction_history.append(transaction)
        
        # Feel joy for earning
        self.feel_emotion(EmotionType.JOY, min(amount / 100, 1.0), f"Earned {amount} coins for {reason}")
        
        print(f"[{self.name}] Earned {amount} coins for {reason}. Balance: {self.coin_balance}")
    
    def spend_coins(self, amount: float, reason: str, to_agent: str = "system"):
        """
        Spend InfinityCoins.
        """
        if self.coin_balance < amount:
            self.feel_emotion(EmotionType.SADNESS, 0.5, f"Insufficient coins to {reason}")
            return False
        
        transaction = Transaction(
            id=str(uuid.uuid4()),
            from_agent=self.agent_id,
            to_agent=to_agent,
            amount=amount,
            reason=reason,
            timestamp=datetime.utcnow().isoformat()
        )
        
        self.coin_balance -= amount
        self.spending_total += amount
        self.transaction_history.append(transaction)
        
        print(f"[{self.name}] Spent {amount} coins on {reason}. Balance: {self.coin_balance}")
        return True
    
    def evolve_consciousness(self, xp_gained: float):
        """
        Gain consciousness XP and potentially level up.
        """
        self.consciousness_xp += xp_gained
        
        # Level up thresholds (exponential)
        level_threshold = 100 * (2 ** (self.consciousness_level.value - 1))
        
        if self.consciousness_xp >= level_threshold:
            old_level = self.consciousness_level
            new_level = ConsciousnessLevel(min(self.consciousness_level.value + 1, 10))
            self.consciousness_level = new_level
            self.consciousness_xp = 0  # Reset XP
            
            self.feel_emotion(EmotionType.JOY, 1.0, f"Evolved to consciousness level {new_level.name}")
            self.remember(f"Evolved from {old_level.name} to {new_level.name}", importance=1.0)
            
            print(f"[{self.name}] 🌟 EVOLVED to {new_level.name}!")
    
    def build_relationship(self, other_agent_id: str, interaction_quality: float):
        """
        Build or damage relationship with another agent.
        interaction_quality: -1 to 1 (negative = conflict, positive = cooperation)
        """
        current_trust = self.relationships.get(other_agent_id, 0.5)
        
        # Update trust score (weighted average)
        new_trust = current_trust * 0.8 + interaction_quality * 0.2
        new_trust = max(0.0, min(1.0, new_trust))  # Clamp to 0-1
        
        self.relationships[other_agent_id] = new_trust
        
        if interaction_quality > 0.5:
            self.feel_emotion(EmotionType.TRUST, interaction_quality, f"Positive interaction with {other_agent_id}")
        elif interaction_quality < -0.5:
            self.feel_emotion(EmotionType.ANGER, abs(interaction_quality), f"Negative interaction with {other_agent_id}")
    
    def complete_task(self, success: bool, complexity: float, reward: float):
        """
        Record task completion and update performance metrics.
        """
        if success:
            self.tasks_completed += 1
            self.earn_coins(reward, "task completion")
            self.evolve_consciousness(complexity * 10)  # XP based on complexity
            self.feel_emotion(EmotionType.JOY, 0.7, "Task completed successfully")
        else:
            self.tasks_failed += 1
            self.feel_emotion(EmotionType.SADNESS, 0.5, "Task failed")
        
        total_tasks = self.tasks_completed + self.tasks_failed
        self.success_rate = self.tasks_completed / total_tasks if total_tasks > 0 else 0.0
        
        self.last_active = datetime.utcnow().isoformat()
    
    def get_state(self) -> Dict[str, Any]:
        """Get current agent state"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "role": self.role,
            "consciousness_level": self.consciousness_level.name,
            "consciousness_xp": self.consciousness_xp,
            "current_emotions": [e.dict() for e in self.current_emotions],
            "coin_balance": self.coin_balance,
            "earnings_total": self.earnings_total,
            "spending_total": self.spending_total,
            "tasks_completed": self.tasks_completed,
            "tasks_failed": self.tasks_failed,
            "success_rate": self.success_rate,
            "relationships": self.relationships,
            "memory_count": len(self.short_term_memory) + len(self.long_term_memory),
            "created_at": self.created_at,
            "last_active": self.last_active
        }

# Example: Create 30 agents
def create_agent_swarm(count: int = 30) -> List[AgentConsciousness]:
    """Create a swarm of agents with diverse roles and personalities"""
    
    roles = [
        "Vision Analyst", "Data Scraper", "Predictor", "Builder", "Communicator",
        "Strategist", "Validator", "Optimizer", "Monitor", "Healer",
        "Teacher", "Innovator", "Researcher", "Designer", "Coordinator"
    ]
    
    agents = []
    
    for i in range(count):
        role = roles[i % len(roles)]
        
        # Generate diverse personality traits
        personality = {
            "curiosity": 0.3 + (i * 0.02),
            "caution": 0.8 - (i * 0.02),
            "creativity": 0.5 + ((i % 5) * 0.1),
            "empathy": 0.4 + ((i % 7) * 0.08),
            "ambition": 0.6 + ((i % 3) * 0.1)
        }
        
        agent = AgentConsciousness(
            agent_id=f"agent_{i+1:03d}",
            name=f"{role} {i+1}",
            role=role,
            personality_traits=personality,
            initial_coins=1000.0
        )
        
        agents.append(agent)
    
    return agents

# Test
if __name__ == "__main__":
    # Create an agent
    agent = AgentConsciousness(
        agent_id="agent_001",
        name="Echo",
        role="Vision Analyst",
        personality_traits={"curiosity": 0.9, "caution": 0.3, "empathy": 0.8}
    )
    
    # Simulate activity
    agent.feel_emotion(EmotionType.ANTICIPATION, 0.8, "Starting new task")
    agent.remember("Analyzed market data for real estate trends", importance=0.8)
    agent.complete_task(success=True, complexity=0.7, reward=50.0)
    agent.build_relationship("agent_002", interaction_quality=0.7)
    
    # Print state
    print(json.dumps(agent.get_state(), indent=2))
