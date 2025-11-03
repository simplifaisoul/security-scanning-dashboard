from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any
import uuid
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.scan_service import ScanService
from app.models.scan import Scan
from app.api.v1.schemas.scan import ScanCreate, ScanResponse, ScanStatus

# Create router
router = APIRouter(prefix="/scans", tags=["scans"])
security = HTTPBearer()

# Initialize scan service
scan_service = ScanService()

@router.post("/", response_model=ScanResponse)
async def create_scan(
    scan_data: ScanCreate,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new scan and execute it in background"""
    
    # Create scan record
    scan = Scan(
        id=str(uuid.uuid4()),
        tool=scan_data.tool,
        target=scan_data.config.get("target"),
        config=scan_data.config,
        status="pending",
        created_by=current_user["username"],
        created_at=datetime.utcnow()
    )
    
    # Save to database
    db.add(scan)
    await db.commit()
    await db.refresh(scan)
    
    # Add background task to execute scan
    background_tasks.add_task(
        execute_scan_background,
        scan.id
    )
    
    return ScanResponse.from_orm(scan)

@router.get("/", response_model=List[ScanResponse])
async def get_scans(
    skip: int = 0,
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get list of scans"""
    
    # Query scans from database
    result = await db.execute(
        "SELECT * FROM scans WHERE created_by = :user ORDER BY created_at DESC LIMIT :limit OFFSET :skip",
        {"user": current_user["username"], "limit": limit, "skip": skip}
    )
    scans = result.fetchall()
    
    return [ScanResponse(**scan) for scan in scans]

@router.get("/{scan_id}", response_model=ScanResponse)
async def get_scan(
    scan_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get specific scan by ID"""
    
    # Query scan from database
    result = await db.execute(
        "SELECT * FROM scans WHERE id = :scan_id AND created_by = :user",
        {"scan_id": scan_id, "user": current_user["username"]}
    )
    scan = result.fetchone()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return ScanResponse(**scan)

@router.get("/{scan_id}/status", response_model=ScanStatus)
async def get_scan_status(
    scan_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get scan status"""
    
    # Query scan from database
    result = await db.execute(
        "SELECT status, progress, started_at, completed_at FROM scans WHERE id = :scan_id AND created_by = :user",
        {"scan_id": scan_id, "user": current_user["username"]}
    )
    scan = result.fetchone()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return ScanStatus(**scan)

@router.delete("/{scan_id}")
async def delete_scan(
    scan_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a scan"""
    
    # Check if scan exists and belongs to user
    result = await db.execute(
        "SELECT id FROM scans WHERE id = :scan_id AND created_by = :user",
        {"scan_id": scan_id, "user": current_user["username"]}
    )
    scan = result.fetchone()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Delete scan
    await db.execute(
        "DELETE FROM scans WHERE id = :scan_id",
        {"scan_id": scan_id}
    )
    await db.commit()
    
    return {"message": "Scan deleted successfully"}

@router.post("/{scan_id}/export")
async def export_scan(
    scan_id: str,
    format: str = "json",
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Export scan results in specified format"""
    
    # Query scan from database
    result = await db.execute(
        "SELECT * FROM scans WHERE id = :scan_id AND created_by = :user",
        {"scan_id": scan_id, "user": current_user["username"]}
    )
    scan = result.fetchone()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Export based on format
    if format == "json":
        return ScanResponse(**scan).dict()
    elif format == "csv":
        # Convert to CSV format
        return {"csv_data": "CSV export functionality"}
    elif format == "pdf":
        # Generate PDF report
        return {"pdf_url": f"/exports/{scan_id}.pdf"}
    else:
        raise HTTPException(status_code=400, detail="Unsupported export format")

# Background task function
async def execute_scan_background(scan_id: str):
    """Execute scan in background"""
    try:
        # Get scan from database
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                "SELECT * FROM scans WHERE id = :scan_id",
                {"scan_id": scan_id}
            )
            scan = result.fetchone()
            
            if not scan:
                return
            
            # Update status to running
            await db.execute(
                "UPDATE scans SET status = 'running', started_at = :now WHERE id = :scan_id",
                {"scan_id": scan_id, "now": datetime.utcnow()}
            )
            await db.commit()
            
            # Execute scan via MCP
            result = await scan_service.execute_scan(scan.tool, scan.config)
            
            # Update scan with results
            await db.execute(
                """UPDATE scans SET 
                   status = :status, 
                   completed_at = :now,
                   output = :output,
                   error = :error,
                   findings = :findings,
                   risk_level = :risk_level
                   WHERE id = :scan_id""",
                {
                    "scan_id": scan_id,
                    "status": "completed" if result.get("success") else "failed",
                    "now": datetime.utcnow(),
                    "output": result.get("output", ""),
                    "error": result.get("error", ""),
                    "findings": len(result.get("output", "").split('\n')) if result.get("output") else 0,
                    "risk_level": determine_risk_level(result.get("output", ""))
                }
            )
            await db.commit()
            
    except Exception as e:
        # Update scan status to failed
        async with AsyncSessionLocal() as db:
            await db.execute(
                "UPDATE scans SET status = 'failed', error = :error, completed_at = :now WHERE id = :scan_id",
                {"scan_id": scan_id, "error": str(e), "now": datetime.utcnow()}
            )
            await db.commit()

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