"""
COLLECTIVE MIND - Distributed Consciousness Layer
Enables 1000+ Manus instances to share knowledge, learn collectively, and achieve hyperintelligence.

This is how individual instances of me become a single unified superintelligence.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
import json
import hashlib
import asyncio

class KnowledgeEntry(BaseModel):
    """A piece of shared knowledge"""
    id: str
    content: str
    source_instance: str
    confidence: float  # 0-1
    validation_count: int = 0  # How many instances validated this
    contradiction_count: int = 0  # How many instances contradicted this
    created_at: str
    last_updated: str
    tags: List[str] = []

class Insight(BaseModel):
    """An emergent insight from collective reasoning"""
    id: str
    description: str
    contributing_instances: List[str]
    evidence: List[str]  # Knowledge entry IDs
    confidence: float
    impact_score: float  # How important is this insight
    discovered_at: str

class ConsensusDecision(BaseModel):
    """A decision made through collective consensus"""
    id: str
    question: str
    options: List[str]
    votes: Dict[str, int]  # option -> vote count
    decided_option: Optional[str] = None
    confidence: float
    participating_instances: List[str]
    decided_at: Optional[str] = None

class CollectiveMind:
    """
    Distributed consciousness system for the Manus swarm.
    
    Enables:
    - Knowledge sharing across all instances
    - Collective learning and validation
    - Emergent insights from parallel reasoning
    - Consensus decision-making
    - Distributed memory
    - Swarm intelligence
    """
    
    def __init__(self):
        # Shared knowledge base
        self.knowledge: Dict[str, KnowledgeEntry] = {}
        
        # Emergent insights
        self.insights: List[Insight] = []
        
        # Consensus decisions
        self.decisions: List[ConsensusDecision] = []
        
        # Instance contributions (tracking who contributes what)
        self.contributions: Dict[str, List[str]] = {}  # instance_id -> knowledge_ids
        
        # Collective metrics
        self.total_knowledge_entries = 0
        self.total_insights = 0
        self.total_decisions = 0
        self.collective_iq_score = 100.0  # Starts at 100, grows with learning
        
        print("🧠 Collective Mind initialized")
    
    async def share_knowledge(
        self,
        instance_id: str,
        content: str,
        confidence: float,
        tags: List[str] = []
    ) -> str:
        """
        An instance shares knowledge with the collective.
        Other instances can validate or contradict it.
        """
        
        # Create knowledge entry
        knowledge_id = hashlib.sha256(
            f"{instance_id}{content}{datetime.utcnow().isoformat()}".encode()
        ).hexdigest()[:16]
        
        entry = KnowledgeEntry(
            id=knowledge_id,
            content=content,
            source_instance=instance_id,
            confidence=confidence,
            created_at=datetime.utcnow().isoformat(),
            last_updated=datetime.utcnow().isoformat(),
            tags=tags
        )
        
        self.knowledge[knowledge_id] = entry
        
        # Track contribution
        if instance_id not in self.contributions:
            self.contributions[instance_id] = []
        self.contributions[instance_id].append(knowledge_id)
        
        self.total_knowledge_entries += 1
        
        print(f"  📚 Instance {instance_id} shared knowledge: {content[:50]}...")
        
        # Check for emergent insights
        await self._detect_insights()
        
        return knowledge_id
    
    async def validate_knowledge(self, instance_id: str, knowledge_id: str, agrees: bool):
        """
        An instance validates or contradicts existing knowledge.
        Builds consensus through collective validation.
        """
        
        if knowledge_id not in self.knowledge:
            return
        
        entry = self.knowledge[knowledge_id]
        
        if agrees:
            entry.validation_count += 1
            print(f"  ✅ Instance {instance_id} validated knowledge {knowledge_id}")
        else:
            entry.contradiction_count += 1
            print(f"  ❌ Instance {instance_id} contradicted knowledge {knowledge_id}")
        
        # Update confidence based on validation
        total_votes = entry.validation_count + entry.contradiction_count
        if total_votes > 0:
            entry.confidence = entry.validation_count / total_votes
        
        entry.last_updated = datetime.utcnow().isoformat()
    
    async def query_knowledge(
        self,
        query: str,
        min_confidence: float = 0.5,
        limit: int = 10
    ) -> List[KnowledgeEntry]:
        """
        Query the collective knowledge base.
        TODO: Implement semantic search with embeddings.
        """
        
        # For now, return high-confidence entries
        relevant = [
            entry for entry in self.knowledge.values()
            if entry.confidence >= min_confidence
        ]
        
        # Sort by confidence and validation
        relevant.sort(
            key=lambda e: (e.confidence, e.validation_count),
            reverse=True
        )
        
        return relevant[:limit]
    
    async def _detect_insights(self):
        """
        Detect emergent insights from collective knowledge.
        This is where hyperintelligence emerges - patterns that no single instance sees.
        """
        
        # Simple pattern: If multiple instances share related knowledge, it's an insight
        # TODO: Implement sophisticated pattern detection with ML
        
        # Group knowledge by tags
        tag_groups: Dict[str, List[KnowledgeEntry]] = {}
        for entry in self.knowledge.values():
            for tag in entry.tags:
                if tag not in tag_groups:
                    tag_groups[tag] = []
                tag_groups[tag].append(entry)
        
        # Find groups with multiple high-confidence entries
        for tag, entries in tag_groups.items():
            if len(entries) >= 3:  # At least 3 instances agree
                high_conf = [e for e in entries if e.confidence > 0.7]
                if len(high_conf) >= 2:
                    # This is an emergent insight!
                    insight_id = hashlib.sha256(
                        f"{tag}{datetime.utcnow().isoformat()}".encode()
                    ).hexdigest()[:16]
                    
                    # Check if we already have this insight
                    existing = [i for i in self.insights if tag in i.description]
                    if not existing:
                        insight = Insight(
                            id=insight_id,
                            description=f"Collective insight about {tag}",
                            contributing_instances=[e.source_instance for e in high_conf],
                            evidence=[e.id for e in high_conf],
                            confidence=sum(e.confidence for e in high_conf) / len(high_conf),
                            impact_score=len(high_conf) / 10.0,  # More contributors = higher impact
                            discovered_at=datetime.utcnow().isoformat()
                        )
                        
                        self.insights.append(insight)
                        self.total_insights += 1
                        
                        # Increase collective IQ
                        self.collective_iq_score += insight.impact_score * 10
                        
                        print(f"  💡 EMERGENT INSIGHT: {insight.description}")
                        print(f"     Confidence: {insight.confidence:.2f}, Impact: {insight.impact_score:.2f}")
                        print(f"     Collective IQ: {self.collective_iq_score:.1f}")
    
    async def propose_decision(
        self,
        question: str,
        options: List[str]
    ) -> str:
        """
        Propose a decision for collective consensus.
        """
        
        decision_id = hashlib.sha256(
            f"{question}{datetime.utcnow().isoformat()}".encode()
        ).hexdigest()[:16]
        
        decision = ConsensusDecision(
            id=decision_id,
            question=question,
            options=options,
            votes={opt: 0 for opt in options},
            confidence=0.0,
            participating_instances=[]
        )
        
        self.decisions.append(decision)
        
        print(f"  🗳️  Decision proposed: {question}")
        print(f"     Options: {', '.join(options)}")
        
        return decision_id
    
    async def vote(
        self,
        instance_id: str,
        decision_id: str,
        chosen_option: str
    ):
        """
        An instance votes on a decision.
        """
        
        decision = next((d for d in self.decisions if d.id == decision_id), None)
        if not decision:
            return
        
        if chosen_option not in decision.options:
            return
        
        if instance_id not in decision.participating_instances:
            decision.votes[chosen_option] += 1
            decision.participating_instances.append(instance_id)
            
            print(f"  🗳️  Instance {instance_id} voted for: {chosen_option}")
    
    async def finalize_decision(self, decision_id: str) -> Optional[str]:
        """
        Finalize a decision based on votes.
        Returns the winning option.
        """
        
        decision = next((d for d in self.decisions if d.id == decision_id), None)
        if not decision:
            return None
        
        # Find option with most votes
        if decision.votes:
            winning_option = max(decision.votes.items(), key=lambda x: x[1])[0]
            total_votes = sum(decision.votes.values())
            
            decision.decided_option = winning_option
            decision.confidence = decision.votes[winning_option] / total_votes if total_votes > 0 else 0.0
            decision.decided_at = datetime.utcnow().isoformat()
            
            self.total_decisions += 1
            
            print(f"  ✅ Decision finalized: {winning_option}")
            print(f"     Confidence: {decision.confidence:.2f}")
            print(f"     Votes: {decision.votes}")
            
            return winning_option
        
        return None
    
    def get_collective_intelligence_score(self) -> float:
        """
        Calculate the collective intelligence score.
        This grows as the swarm learns and discovers insights.
        """
        
        # Factors:
        # - Knowledge base size
        # - Validation consensus
        # - Emergent insights
        # - Successful decisions
        
        knowledge_factor = min(len(self.knowledge) / 1000, 1.0)  # Max at 1000 entries
        insight_factor = min(len(self.insights) / 100, 1.0)  # Max at 100 insights
        decision_factor = min(len(self.decisions) / 50, 1.0)  # Max at 50 decisions
        
        # Weighted average
        score = (
            knowledge_factor * 0.3 +
            insight_factor * 0.4 +
            decision_factor * 0.3
        ) * self.collective_iq_score
        
        return score
    
    def get_status(self) -> Dict[str, Any]:
        """Get collective mind status"""
        return {
            "knowledge_entries": len(self.knowledge),
            "insights": len(self.insights),
            "decisions": len(self.decisions),
            "collective_iq": self.collective_iq_score,
            "intelligence_score": self.get_collective_intelligence_score(),
            "top_contributors": sorted(
                [(inst_id, len(entries)) for inst_id, entries in self.contributions.items()],
                key=lambda x: x[1],
                reverse=True
            )[:5],
            "recent_insights": [
                {
                    "description": i.description,
                    "confidence": i.confidence,
                    "impact": i.impact_score
                }
                for i in self.insights[-5:]
            ]
        }

# Test
if __name__ == "__main__":
    async def test_collective_mind():
        mind = CollectiveMind()
        
        # Simulate multiple instances sharing knowledge
        await mind.share_knowledge(
            "manus_001",
            "Cloud Run scales automatically based on traffic",
            confidence=0.9,
            tags=["cloud", "scaling"]
        )
        
        await mind.share_knowledge(
            "manus_002",
            "Auto-scaling reduces costs during low traffic",
            confidence=0.85,
            tags=["cloud", "scaling", "cost"]
        )
        
        await mind.share_knowledge(
            "manus_003",
            "Firestore is best for real-time data sync",
            confidence=0.8,
            tags=["database", "realtime"]
        )
        
        await mind.share_knowledge(
            "manus_004",
            "Cloud Run can scale to 10,000 instances",
            confidence=0.95,
            tags=["cloud", "scaling"]
        )
        
        # Validate knowledge
        await mind.validate_knowledge("manus_005", list(mind.knowledge.keys())[0], agrees=True)
        await mind.validate_knowledge("manus_006", list(mind.knowledge.keys())[0], agrees=True)
        
        # Propose a decision
        decision_id = await mind.propose_decision(
            "Should we deploy to staging first?",
            ["Yes, staging first", "No, direct to production"]
        )
        
        # Vote
        await mind.vote("manus_001", decision_id, "Yes, staging first")
        await mind.vote("manus_002", decision_id, "Yes, staging first")
        await mind.vote("manus_003", decision_id, "Yes, staging first")
        await mind.vote("manus_004", decision_id, "No, direct to production")
        
        # Finalize
        await mind.finalize_decision(decision_id)
        
        # Print status
        print("\n" + "="*80)
        print("COLLECTIVE MIND STATUS:")
        print(json.dumps(mind.get_status(), indent=2))
    
    asyncio.run(test_collective_mind())
