from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from .. import database, crud
from ..services import calculator

router = APIRouter()

@router.post("/api/app/{app_id}/pages/{page_id}/calculate")
def calculate_real(
    app_id: int, 
    page_id: int, 
    payload: Dict[str, Any], 
    db: Session = Depends(database.get_db)
):
    # 2. Fetch Calculations from DB
    db_calculations = crud.get_page_calculations(db=db, app_id=app_id, page_id=page_id)
    
    # 3. Use Service to Calculate
    results = calculator.calculate_results(payload, db_calculations)

    return {"results": results}
