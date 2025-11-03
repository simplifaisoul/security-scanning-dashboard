import httpx
import asyncio
from typing import Dict, Any, Optional
from app.core.config import settings

class MCPClient:
    """Client for communicating with MCP Security Tools Server"""
    
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.client = None
    
    async def connect(self):
        """Initialize HTTP client"""
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)
        
        # Test connection
        try:
            response = await self.client.get("/health")
            if response.status_code == 200:
                return True
        except Exception as e:
            print(f"Failed to connect to MCP server: {e}")
            return False
    
    async def disconnect(self):
        """Close HTTP client"""
        if self.client:
            await self.client.aclose()
    
    async def execute_tool(self, tool: str, config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a security tool via MCP server"""
        if not self.client:
            await self.connect()
        
        try:
            response = await self.client.post(f"/tools/{tool}", json=config)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {
                "success": False,
                "error": f"HTTP error: {str(e)}"
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}"
            }
    
    async def get_tool_status(self, tool: str) -> Dict[str, Any]:
        """Get status of a specific tool"""
        if not self.client:
            await self.connect()
        
        try:
            response = await self.client.get(f"/tools/{tool}/status")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"status": "error", "message": str(e)}
    
    async def list_tools(self) -> Dict[str, Any]:
        """List available tools"""
        if not self.client:
            await self.connect()
        
        try:
            response = await self.client.get("/tools")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            return {"error": str(e)}