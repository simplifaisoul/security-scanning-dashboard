from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import asyncio
import json
import logging
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timedelta

from app.core.config import settings
from app.core.database import engine, Base
from app.core.security import create_access_token, verify_token
from app.api.v1.api import api_router
from app.services.mcp_client import MCPClient
from app.services.scan_service import ScanService
from app.models.scan import Scan
from app.core.websocket import ConnectionManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
mcp_client = MCPClient(settings.MCP_SERVER_URL)
scan_service = ScanService(mcp_client)
websocket_manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Security Tools API...")
    
    # Initialize database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Test MCP connection
    try:
        await mcp_client.connect()
        logger.info("Connected to MCP server successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MCP server: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Security Tools API...")
    await mcp_client.disconnect()

# Create FastAPI app
app = FastAPI(
    title="Security Tools API",
    description="API for managing security scanning tools",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "subscribe_scan":
                scan_id = message["scan_id"]
                await websocket_manager.subscribe(websocket, scan_id)
            elif message["type"] == "unsubscribe_scan":
                scan_id = message["scan_id"]
                await websocket_manager.unsubscribe(websocket, scan_id)
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Security Tools API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# Background task for scan execution
async def execute_scan_background(scan_id: str):
    """Execute scan in background and update results via WebSocket"""
    try:
        # Get scan from database
        scan = await Scan.get(scan_id)
        if not scan:
            logger.error(f"Scan {scan_id} not found")
            return
        
        # Update status to running
        scan.status = "running"
        scan.started_at = datetime.utcnow()
        await scan.save()
        
        # Notify WebSocket clients
        await websocket_manager.broadcast_to_scan(scan_id, {
            "type": "scan_status",
            "scan_id": scan_id,
            "status": "running",
            "message": "Scan started"
        })
        
        # Execute scan via MCP
        result = await scan_service.execute_scan(scan.tool, scan.config)
        
        # Update scan with results
        scan.status = "completed" if result.get("success") else "failed"
        scan.completed_at = datetime.utcnow()
        scan.output = result.get("output", "")
        scan.error = result.get("error", "")
        scan.findings = len(result.get("output", "").split('\n')) if result.get("output") else 0
        
        # Determine risk level based on output
        scan.risk_level = determine_risk_level(scan.output)
        
        await scan.save()
        
        # Notify WebSocket clients
        await websocket_manager.broadcast_to_scan(scan_id, {
            "type": "scan_complete",
            "scan_id": scan_id,
            "status": scan.status,
            "output": scan.output,
            "error": scan.error,
            "findings": scan.findings,
            "risk_level": scan.risk_level
        })
        
    except Exception as e:
        logger.error(f"Error executing scan {scan_id}: {e}")
        
        # Update scan status to failed
        if scan:
            scan.status = "failed"
            scan.error = str(e)
            scan.completed_at = datetime.utcnow()
            await scan.save()
            
            # Notify WebSocket clients
            await websocket_manager.broadcast_to_scan(scan_id, {
                "type": "scan_error",
                "scan_id": scan_id,
                "error": str(e)
            })

def determine_risk_level(output: str) -> str:
    """Determine risk level based on scan output"""
    if not output:
        return "Low"
    
    output_lower = output.lower()
    
    # High risk indicators
    high_risk_keywords = ["vulnerable", "exploit", "critical", "remote code execution", "sql injection"]
    if any(keyword in output_lower for keyword in high_risk_keywords):
        return "High"
    
    # Medium risk indicators
    medium_risk_keywords = ["warning", "medium", "cve", "outdated", "misconfiguration"]
    if any(keyword in output_lower for keyword in medium_risk_keywords):
        return "Medium"
    
    return "Low"

# Startup event to register background task
@app.on_event("startup")
async def startup_event():
    # Register background task executor
    app.state.execute_scan_background = execute_scan_background

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=True
    )