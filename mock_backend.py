#!/usr/bin/env python3
"""
Simple mock backend for Security Tools demonstration
Deployed to Render for temporary testing
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import uuid
from datetime import datetime
from typing import Dict, Any, List
import asyncio

app = FastAPI(title="Security Tools API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Netlify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
MOCK_TOOLS = [
    {
        "id": "nmap",
        "name": "Nmap",
        "description": "Network scanning and port discovery",
        "category": "network",
        "status": "active"
    },
    {
        "id": "nikto",
        "name": "Nikto", 
        "description": "Web server vulnerability scanning",
        "category": "web",
        "status": "active"
    },
    {
        "id": "sqlmap",
        "name": "SQLMap",
        "description": "SQL injection testing",
        "category": "database",
        "status": "active"
    },
    {
        "id": "wpscan",
        "name": "WPScan",
        "description": "WordPress security scanning", 
        "category": "cms",
        "status": "active"
    },
    {
        "id": "dirb",
        "name": "DIRB",
        "description": "Directory and file brute-forcing",
        "category": "web",
        "status": "active"
    },
    {
        "id": "searchsploit",
        "name": "SearchSploit",
        "description": "Exploit database searching",
        "category": "exploit",
        "status": "active"
    }
]

MOCK_SCANS = []

@app.get("/")
async def root():
    return {"message": "Security Tools API", "version": "1.0.0"}

@app.get("/api/v1/tools")
async def get_tools():
    """Get all available security tools"""
    return {"tools": MOCK_TOOLS, "count": len(MOCK_TOOLS)}

@app.get("/api/v1/tools/{tool_id}")
async def get_tool(tool_id: str):
    """Get specific tool details"""
    tool = next((t for t in MOCK_TOOLS if t["id"] == tool_id), None)
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    return {"tool": tool}

@app.get("/api/v1/tools/{tool_id}/config")
async def get_tool_config(tool_id: str):
    """Get tool configuration template"""
    configs = {
        "nmap": {
            "target": "192.168.1.1",
            "ports": "1-1000",
            "scan_type": "-sS",
            "timing": "T4"
        },
        "nikto": {
            "target": "http://example.com",
            "port": 80,
            "options": "-T 3"
        },
        "sqlmap": {
            "target": "http://example.com/page.php?id=1",
            "level": 1,
            "risk": 1,
            "batch": True
        }
    }
    
    config = configs.get(tool_id, {})
    if not config:
        raise HTTPException(status_code=404, detail="Tool config not found")
    
    return {"config": config}

@app.post("/api/v1/tools/{tool_id}/execute")
async def execute_tool(tool_id: str, config: Dict[str, Any]):
    """Execute a security tool (mock)"""
    scan_id = str(uuid.uuid4())
    
    # Create mock scan
    scan = {
        "id": scan_id,
        "tool_id": tool_id,
        "config": config,
        "status": "running",
        "created_at": datetime.now().isoformat(),
        "progress": 0
    }
    
    MOCK_SCANS.append(scan)
    
    # Simulate async execution
    asyncio.create_task(simulate_scan_execution(scan_id))
    
    return {"scan_id": scan_id, "status": "started", "message": f"Starting {tool_id} scan..."}

async def simulate_scan_execution(scan_id: str):
    """Simulate scan execution with progress updates"""
    import time
    
    # Find the scan
    scan = next((s for s in MOCK_SCANS if s["id"] == scan_id), None)
    if not scan:
        return
    
    # Simulate progress
    for progress in range(0, 101, 10):
        scan["progress"] = progress
        await asyncio.sleep(0.5)
    
    # Complete the scan with mock results
    scan["status"] = "completed"
    scan["completed_at"] = datetime.now().isoformat()
    scan["results"] = generate_mock_results(scan["tool_id"], scan["config"])

def generate_mock_results(tool_id: str, config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate mock scan results"""
    target = config.get("target", "unknown")
    
    if tool_id == "nmap":
        return {
            "scan_type": "port_scan",
            "target": target,
            "open_ports": [22, 80, 443],
            "services": {
                "22": "ssh",
                "80": "http", 
                "443": "https"
            },
            "summary": f"Found 3 open ports on {target}"
        }
    elif tool_id == "nikto":
        return {
            "scan_type": "web_vuln_scan",
            "target": target,
            "vulnerabilities": [
                {"severity": "medium", "description": "Missing X-Frame-Options header"},
                {"severity": "low", "description": "Server version disclosed"}
            ],
            "summary": f"Found 2 potential vulnerabilities on {target}"
        }
    else:
        return {
            "scan_type": "general_scan",
            "target": target,
            "status": "completed",
            "summary": f"Mock {tool_id} scan completed for {target}"
        }

@app.get("/api/v1/scans")
async def get_scans():
    """Get all scans"""
    return {"scans": MOCK_SCANS, "count": len(MOCK_SCANS)}

@app.get("/api/v1/scans/{scan_id}")
async def get_scan(scan_id: str):
    """Get specific scan details"""
    scan = next((s for s in MOCK_SCANS if s["id"] == scan_id), None)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"scan": scan}

@app.get("/api/v1/scans/{scan_id}/status")
async def get_scan_status(scan_id: str):
    """Get scan status"""
    scan = next((s for s in MOCK_SCANS if s["id"] == scan_id), None)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return {
        "scan_id": scan_id,
        "status": scan["status"],
        "progress": scan.get("progress", 0),
        "created_at": scan["created_at"],
        "completed_at": scan.get("completed_at")
    }

@app.get("/api/v1/stats/system")
async def get_system_stats():
    """Get system statistics"""
    return {
        "system": {
            "uptime": "2h 34m",
            "cpu_usage": "15%",
            "memory_usage": "45%",
            "disk_usage": "67%"
        },
        "scans": {
            "total": len(MOCK_SCANS),
            "running": len([s for s in MOCK_SCANS if s["status"] == "running"]),
            "completed": len([s for s in MOCK_SCANS if s["status"] == "completed"])
        }
    }

@app.get("/api/v1/stats/scans")
async def get_scan_stats():
    """Get scan statistics"""
    return {
        "period": "7d",
        "total_scans": len(MOCK_SCANS),
        "successful_scans": len([s for s in MOCK_SCANS if s["status"] == "completed"]),
        "failed_scans": 0,
        "tools_used": list(set(s["tool_id"] for s in MOCK_SCANS))
    }

@app.delete("/api/v1/scans/{scan_id}")
async def delete_scan(scan_id: str):
    """Delete a scan"""
    global MOCK_SCANS
    MOCK_SCANS = [s for s in MOCK_SCANS if s["id"] != scan_id]
    return {"message": "Scan deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)