
from fastapi import APIRouter, Depends, Body, Path
from sqlalchemy.orm import Session
from typing import Dict, Any
from ..core import database
from .. import crud, schemas
from ..services import calculator

router = APIRouter()

@router.post(
    "/api/app/{app_id}/pages/{page_id}/calculate", 
    summary="Perform calculations for a page",
    description="Execute calculations for a specific page within an app using the provided input payload and stored calculation rules. This endpoint does not have a response or request model. Should've added that."
)
def calculate_real(
    app_id: int = Path(
        ...,
        example=1,
        description="Application ID"
    ),
    page_id: int = Path(
        ...,
        example=3,
        description="Page ID inside the application"
    ),
    payload: Dict[str, Any] = Body( # This Dict[str, Any] does not look good. Should've created a schema for this
        ...,
        example={
            "formData": {
                "X": "5",
                "Y": "3",
                "Z": "1"
            }
        }
    ), 
    db: Session = Depends(database.get_db)
):
    # Getting the payload inside formData is not necessary.
    # Maybe a schema for payload could've been better
    db_calculations = crud.get_page_calculations(db=db, app_id=app_id, page_id=page_id)
    
    results = calculator.calculate_results(payload, db_calculations)

    return {"results": results}
