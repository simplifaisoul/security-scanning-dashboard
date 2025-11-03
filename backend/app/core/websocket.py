from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import asyncio

class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.scan_subscriptions: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept and store WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from all scan subscriptions
        for scan_id in list(self.scan_subscriptions.keys()):
            if websocket in self.scan_subscriptions[scan_id]:
                self.scan_subscriptions[scan_id].remove(websocket)
            if not self.scan_subscriptions[scan_id]:
                del self.scan_subscriptions[scan_id]
    
    async def subscribe(self, websocket: WebSocket, scan_id: str):
        """Subscribe WebSocket to specific scan updates"""
        if scan_id not in self.scan_subscriptions:
            self.scan_subscriptions[scan_id] = []
        self.scan_subscriptions[scan_id].append(websocket)
    
    async def unsubscribe(self, websocket: WebSocket, scan_id: str):
        """Unsubscribe WebSocket from specific scan updates"""
        if scan_id in self.scan_subscriptions and websocket in self.scan_subscriptions[scan_id]:
            self.scan_subscriptions[scan_id].remove(websocket)
            if not self.scan_subscriptions[scan_id]:
                del self.scan_subscriptions[scan_id]
    
    async def broadcast_to_scan(self, scan_id: str, message: Dict[str, Any]):
        """Broadcast message to all subscribers of a specific scan"""
        if scan_id in self.scan_subscriptions:
            disconnected = []
            for connection in self.scan_subscriptions[scan_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    disconnected.append(connection)
            
            # Remove disconnected connections
            for connection in disconnected:
                self.disconnect(connection)
    
    async def broadcast_to_all(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                disconnected.append(connection)
        
        # Remove disconnected connections
        for connection in disconnected:
            self.disconnect(connection)