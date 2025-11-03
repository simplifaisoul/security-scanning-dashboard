from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Scan(Base):
    """Scan model for storing scan information"""
    __tablename__ = "scans"
    
    id = Column(String, primary_key=True)
    tool = Column(String, nullable=False)
    target = Column(String, nullable=False)
    config = Column(JSON, nullable=False)
    status = Column(String, default="pending")
    output = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    findings = Column(Integer, default=0)
    risk_level = Column(String, default="Low")
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "tool": self.tool,
            "target": self.target,
            "config": self.config,
            "status": self.status,
            "output": self.output,
            "error": self.error,
            "findings": self.findings,
            "risk_level": self.risk_level,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }