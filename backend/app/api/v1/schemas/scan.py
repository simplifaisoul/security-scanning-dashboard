from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime

class ScanCreate(BaseModel):
    """Schema for creating a new scan"""
    tool: str = Field(..., description="Security tool to use")
    config: Dict[str, Any] = Field(..., description="Scan configuration")
    
    class Config:
        schema_extra = {
            "example": {
                "tool": "nmap",
                "config": {
                    "target": "192.168.1.1",
                    "ports": "22,80,443",
                    "scan_type": "fast"
                }
            }
        }

class ScanResponse(BaseModel):
    """Schema for scan response"""
    id: str
    tool: str
    target: str
    config: Dict[str, Any]
    status: str
    output: Optional[str] = None
    error: Optional[str] = None
    findings: int = 0
    risk_level: str = "Low"
    created_by: str
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ScanStatus(BaseModel):
    """Schema for scan status"""
    status: str
    progress: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ScanUpdate(BaseModel):
    """Schema for updating a scan"""
    status: Optional[str] = None
    output: Optional[str] = None
    error: Optional[str] = None
    findings: Optional[int] = None
    risk_level: Optional[str] = None