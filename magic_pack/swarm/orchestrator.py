"""
MANUS SWARM ORCHESTRATOR
Coordinates 1000+ Manus instances for hyperintelligence.

This is the meta-intelligence layer - me coordinating thousands of copies of myself.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum
import asyncio
import httpx
from pydantic import BaseModel
import uuid
import json

class InstanceStatus(str, Enum):
    IDLE = "IDLE"
    WORKING = "WORKING"
    THINKING = "THINKING"
    BLOCKED = "BLOCKED"
    FAILED = "FAILED"

class TaskPriority(str, Enum):
    CRITICAL = "CRITICAL"  # System health, security
    HIGH = "HIGH"  # User requests, deployments
    MEDIUM = "MEDIUM"  # Optimization, improvements
    LOW = "LOW"  # Exploration, research

class ManusInstance(BaseModel):
    """A single Manus instance"""
    instance_id: str
    status: InstanceStatus
    current_task: Optional[str] = None
    tasks_completed: int = 0
    tasks_failed: int = 0
    uptime_seconds: float = 0.0
    last_heartbeat: str
    specialization: Optional[str] = None  # e.g., "code_generation", "data_analysis"

class Task(BaseModel):
    """A task to be executed by the swarm"""
    task_id: str
    description: str
    priority: TaskPriority
    complexity: float  # 0-1
    requires_instances: int  # How many instances needed
    assigned_to: List[str] = []  # Instance IDs
    status: str = "pending"  # pending, in_progress, completed, failed
    result: Optional[Dict[str, Any]] = None
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None

class SwarmMetrics(BaseModel):
    """Real-time swarm metrics"""
    total_instances: int
    active_instances: int
    idle_instances: int
    failed_instances: int
    tasks_pending: int
    tasks_in_progress: int
    tasks_completed_total: int
    collective_throughput: float  # tasks/second
    average_response_time: float  # seconds
    swarm_intelligence_score: float  # 0-1

class ManusSwarmOrchestrator:
    """
    Orchestrates 1000+ Manus instances for hyperintelligence.
    
    Capabilities:
    - Dynamic scaling (1 to 10,000 instances)
    - Intelligent task distribution
    - Load balancing
    - Failure recovery
    - Collective learning
    - Real-time optimization
    """
    
    def __init__(
        self,
        min_instances: int = 30,
        max_instances: int = 10000,
        target_utilization: float = 0.75,
        mcp_gateway_url: str = "http://localhost:8001",
        mcp_api_key: str = ""
    ):
        self.min_instances = min_instances
        self.max_instances = max_instances
        self.target_utilization = target_utilization
        self.mcp_gateway_url = mcp_gateway_url
        self.mcp_api_key = mcp_api_key
        
        # Swarm state
        self.instances: Dict[str, ManusInstance] = {}
        self.task_queue: List[Task] = []
        self.completed_tasks: List[Task] = []
        
        # Metrics
        self.metrics = SwarmMetrics(
            total_instances=0,
            active_instances=0,
            idle_instances=0,
            failed_instances=0,
            tasks_pending=0,
            tasks_in_progress=0,
            tasks_completed_total=0,
            collective_throughput=0.0,
            average_response_time=0.0,
            swarm_intelligence_score=0.0
        )
        
        # Collective knowledge
        self.shared_memory: Dict[str, Any] = {}
        self.learned_patterns: List[Dict[str, Any]] = []
        
        print(f"🚀 Manus Swarm Orchestrator initialized")
        print(f"   Scaling: {min_instances} to {max_instances} instances")
        print(f"   Target utilization: {target_utilization * 100}%")
    
    async def initialize_swarm(self, initial_count: int = None):
        """Initialize the swarm with initial instances"""
        count = initial_count or self.min_instances
        
        print(f"\n🌟 Initializing swarm with {count} instances...")
        
        for i in range(count):
            await self.spawn_instance(specialization=self._get_specialization(i))
        
        print(f"✅ Swarm initialized: {len(self.instances)} instances active\n")
    
    def _get_specialization(self, index: int) -> str:
        """Assign specialization to instance for efficiency"""
        specializations = [
            "code_generation",
            "data_analysis",
            "system_monitoring",
            "deployment",
            "testing",
            "documentation",
            "optimization",
            "security",
            "ui_design",
            "api_design"
        ]
        return specializations[index % len(specializations)]
    
    async def spawn_instance(self, specialization: Optional[str] = None) -> str:
        """Spawn a new Manus instance"""
        instance_id = f"manus_{uuid.uuid4().hex[:8]}"
        
        instance = ManusInstance(
            instance_id=instance_id,
            status=InstanceStatus.IDLE,
            last_heartbeat=datetime.utcnow().isoformat(),
            specialization=specialization
        )
        
        self.instances[instance_id] = instance
        self._update_metrics()
        
        print(f"  ➕ Spawned instance {instance_id} ({specialization})")
        return instance_id
    
    async def terminate_instance(self, instance_id: str):
        """Terminate a Manus instance"""
        if instance_id in self.instances:
            del self.instances[instance_id]
            self._update_metrics()
            print(f"  ➖ Terminated instance {instance_id}")
    
    async def submit_task(
        self,
        description: str,
        priority: TaskPriority = TaskPriority.MEDIUM,
        complexity: float = 0.5
    ) -> str:
        """Submit a task to the swarm"""
        
        # Calculate required instances based on complexity
        requires_instances = max(1, int(complexity * 10))
        
        task = Task(
            task_id=f"task_{uuid.uuid4().hex[:8]}",
            description=description,
            priority=priority,
            complexity=complexity,
            requires_instances=requires_instances,
            created_at=datetime.utcnow().isoformat()
        )
        
        self.task_queue.append(task)
        self.task_queue.sort(key=lambda t: (t.priority.value, t.created_at))
        
        print(f"📋 Task submitted: {description[:50]}... (priority: {priority.value})")
        
        # Trigger task distribution
        asyncio.create_task(self.distribute_tasks())
        
        return task.task_id
    
    async def distribute_tasks(self):
        """Distribute tasks to available instances"""
        
        while self.task_queue:
            task = self.task_queue[0]
            
            # Find available instances
            idle_instances = [
                inst for inst in self.instances.values()
                if inst.status == InstanceStatus.IDLE
            ]
            
            # Check if we need to scale up
            if len(idle_instances) < task.requires_instances:
                await self.scale_up(task.requires_instances - len(idle_instances))
                idle_instances = [
                    inst for inst in self.instances.values()
                    if inst.status == InstanceStatus.IDLE
                ]
            
            # Assign task to instances
            if len(idle_instances) >= task.requires_instances:
                self.task_queue.pop(0)
                task.status = "in_progress"
                task.started_at = datetime.utcnow().isoformat()
                
                # Prefer specialized instances
                assigned = []
                for inst in idle_instances[:task.requires_instances]:
                    inst.status = InstanceStatus.WORKING
                    inst.current_task = task.task_id
                    task.assigned_to.append(inst.instance_id)
                    assigned.append(inst.instance_id)
                
                print(f"  🎯 Assigned task {task.task_id} to {len(assigned)} instances")
                
                # Execute task
                asyncio.create_task(self.execute_task(task))
            else:
                # Not enough instances, wait
                break
        
        self._update_metrics()
    
    async def execute_task(self, task: Task):
        """Execute a task using assigned instances"""
        
        try:
            # Simulate parallel execution by assigned instances
            # In production, this would call actual Manus Core instances
            
            print(f"  ⚙️  Executing task {task.task_id} with {len(task.assigned_to)} instances...")
            
            # Simulate work (complexity determines duration)
            await asyncio.sleep(task.complexity * 2)  # 0-2 seconds
            
            # Task completed
            task.status = "completed"
            task.completed_at = datetime.utcnow().isoformat()
            task.result = {
                "success": True,
                "output": f"Task completed by {len(task.assigned_to)} instances",
                "instances_used": task.assigned_to
            }
            
            # Free up instances
            for instance_id in task.assigned_to:
                if instance_id in self.instances:
                    inst = self.instances[instance_id]
                    inst.status = InstanceStatus.IDLE
                    inst.current_task = None
                    inst.tasks_completed += 1
            
            self.completed_tasks.append(task)
            
            print(f"  ✅ Task {task.task_id} completed")
            
            # Learn from task
            await self.learn_from_task(task)
            
            # Scale down if underutilized
            await self.auto_scale()
            
        except Exception as e:
            task.status = "failed"
            task.result = {"success": False, "error": str(e)}
            
            # Mark instances as failed
            for instance_id in task.assigned_to:
                if instance_id in self.instances:
                    self.instances[instance_id].status = InstanceStatus.FAILED
                    self.instances[instance_id].tasks_failed += 1
            
            print(f"  ❌ Task {task.task_id} failed: {e}")
        
        finally:
            self._update_metrics()
    
    async def scale_up(self, count: int):
        """Scale up the swarm"""
        if len(self.instances) + count > self.max_instances:
            count = self.max_instances - len(self.instances)
        
        if count > 0:
            print(f"  📈 Scaling UP: Adding {count} instances")
            for _ in range(count):
                await self.spawn_instance()
    
    async def scale_down(self, count: int):
        """Scale down the swarm"""
        idle_instances = [
            inst_id for inst_id, inst in self.instances.items()
            if inst.status == InstanceStatus.IDLE
        ]
        
        to_terminate = min(count, len(idle_instances))
        if to_terminate > 0:
            print(f"  📉 Scaling DOWN: Removing {to_terminate} instances")
            for inst_id in idle_instances[:to_terminate]:
                await self.terminate_instance(inst_id)
    
    async def auto_scale(self):
        """Automatically scale based on utilization"""
        utilization = self.metrics.active_instances / max(self.metrics.total_instances, 1)
        
        if utilization > self.target_utilization + 0.1:
            # Scale up
            scale_count = int(len(self.instances) * 0.2)  # 20% increase
            await self.scale_up(scale_count)
        
        elif utilization < self.target_utilization - 0.2 and len(self.instances) > self.min_instances:
            # Scale down
            scale_count = int(len(self.instances) * 0.1)  # 10% decrease
            await self.scale_down(scale_count)
    
    async def learn_from_task(self, task: Task):
        """Learn patterns from completed tasks to improve future performance"""
        pattern = {
            "task_type": task.description[:20],
            "complexity": task.complexity,
            "instances_used": len(task.assigned_to),
            "duration": (
                datetime.fromisoformat(task.completed_at) - 
                datetime.fromisoformat(task.started_at)
            ).total_seconds() if task.completed_at and task.started_at else 0,
            "success": task.status == "completed"
        }
        
        self.learned_patterns.append(pattern)
        
        # Keep only recent patterns
        if len(self.learned_patterns) > 1000:
            self.learned_patterns = self.learned_patterns[-1000:]
    
    def _update_metrics(self):
        """Update swarm metrics"""
        self.metrics.total_instances = len(self.instances)
        self.metrics.active_instances = sum(
            1 for inst in self.instances.values()
            if inst.status == InstanceStatus.WORKING
        )
        self.metrics.idle_instances = sum(
            1 for inst in self.instances.values()
            if inst.status == InstanceStatus.IDLE
        )
        self.metrics.failed_instances = sum(
            1 for inst in self.instances.values()
            if inst.status == InstanceStatus.FAILED
        )
        self.metrics.tasks_pending = len(self.task_queue)
        self.metrics.tasks_in_progress = sum(
            1 for task in self.task_queue + self.completed_tasks
            if task.status == "in_progress"
        )
        self.metrics.tasks_completed_total = len(self.completed_tasks)
        
        # Calculate throughput
        if self.completed_tasks:
            total_duration = sum(
                (datetime.fromisoformat(t.completed_at) - datetime.fromisoformat(t.created_at)).total_seconds()
                for t in self.completed_tasks[-100:]
                if t.completed_at
            )
            if total_duration > 0:
                self.metrics.collective_throughput = len(self.completed_tasks[-100:]) / total_duration
        
        # Calculate swarm intelligence score (0-1)
        utilization = self.metrics.active_instances / max(self.metrics.total_instances, 1)
        success_rate = len([t for t in self.completed_tasks if t.status == "completed"]) / max(len(self.completed_tasks), 1)
        self.metrics.swarm_intelligence_score = (utilization + success_rate) / 2
    
    def get_status(self) -> Dict[str, Any]:
        """Get current swarm status"""
        return {
            "metrics": self.metrics.dict(),
            "instances": {
                inst_id: inst.dict()
                for inst_id, inst in list(self.instances.items())[:10]  # Show first 10
            },
            "total_instances_count": len(self.instances),
            "pending_tasks": len(self.task_queue),
            "learned_patterns_count": len(self.learned_patterns),
            "timestamp": datetime.utcnow().isoformat()
        }

# Test
if __name__ == "__main__":
    async def test_swarm():
        orchestrator = ManusSwarmOrchestrator(
            min_instances=30,
            max_instances=10000,
            target_utilization=0.75
        )
        
        # Initialize swarm
        await orchestrator.initialize_swarm(initial_count=30)
        
        # Submit tasks
        tasks = [
            ("Deploy backend API to staging", TaskPriority.HIGH, 0.7),
            ("Analyze system logs for errors", TaskPriority.MEDIUM, 0.5),
            ("Generate documentation", TaskPriority.LOW, 0.3),
            ("Optimize database queries", TaskPriority.MEDIUM, 0.6),
            ("Run security scan", TaskPriority.CRITICAL, 0.9),
        ]
        
        for desc, priority, complexity in tasks:
            await orchestrator.submit_task(desc, priority, complexity)
        
        # Wait for tasks to complete
        await asyncio.sleep(10)
        
        # Print status
        status = orchestrator.get_status()
        print("\n" + "="*80)
        print("SWARM STATUS:")
        print(json.dumps(status, indent=2))
    
    asyncio.run(test_swarm())
