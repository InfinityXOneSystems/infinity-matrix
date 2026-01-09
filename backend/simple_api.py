"""
Simple FastAPI backend for Infinity Matrix
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Infinity Matrix API",
    description="Backend for infinityxai.com",
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

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Infinity Matrix"}

@app.get("/")
async def root():
    return {
        "service": "Infinity Matrix API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.post("/api/task/invoke")
async def invoke_task(task: dict):
    """Invoke an autonomous task"""
    return {
        "status": "success",
        "task_id": "task_001",
        "result": "Task executed"
    }

@app.get("/api/health/status")
async def system_health():
    """Get system health status"""
    return {
        "system": "online",
        "agents": "active",
        "memory": "optimal",
        "uptime": "24h"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
