from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from typing import Dict, List, Any

from sqlalchemy.orm import Session

from . import schemas
from . import database
from . import crud
from . import models


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Health Check
@app.get("/")
def home():
    return "Home"

# ==========================================
# 1. APP CONFIG ENDPOINTS
# ==========================================

@app.get("/api/app/", response_model=List[schemas.AppConfig])
def get_apps(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    apps = crud.get_apps(db, skip=skip, limit=limit)
    return apps

@app.post("/api/app/", response_model=schemas.AppConfig)
def create_app(app_config: schemas.AppConfigCreate, db: Session = Depends(database.get_db)):
    return crud.create_app(db=db, app=app_config)

@app.get("/api/app/{app_id}/", response_model=schemas.AppConfig)
def get_app(app_id: int, db: Session = Depends(database.get_db)):
    db_app = crud.get_app(db=db, app_id=app_id)
    if not db_app:
        raise HTTPException(status_code=404, detail="App not found")
    return db_app

@app.delete("/api/app/{app_id}/", response_model=schemas.AppConfig)
def delete_app(app_id: int, db: Session = Depends(database.get_db)):
    return crud.delete_app(db=db, app_id=app_id)

# --- NEW: THE BULK UPDATE ENDPOINT ---
@app.put("/api/app/{app_id}/structure", response_model=schemas.AppConfig)
def update_app_structure(
    app_id: int, 
    app_data: schemas.AppConfigUpdate, 
    db: Session = Depends(database.get_db)
):
    """
    Updates the entire app structure (App info -> Pages -> Inputs/Calculations).
    - If IDs are present, it updates.
    - If IDs are missing, it creates new items.
    - If items are missing from the list, it deletes them (orphans).
    """
    updated_app = crud.update_app_structure(db=db, app_id=app_id, app_data=app_data)
    if not updated_app:
        raise HTTPException(status_code=404, detail="App not found")
    return updated_app


# ==========================================
# 2. PAGE ENDPOINTS (Legacy/Individual)
# ==========================================
# Note: You might rely less on these now that you have the bulk update, 
# but they are good for atomic operations if needed.

@app.post("/apps/{app_id}/pages/", response_model=schemas.Page)
def create_page(app_id: int, page: schemas.PageCreate, db: Session = Depends(database.get_db)):
    return crud.create_page_for_app(db=db, app_id=app_id, page_data=page)

@app.delete("/apps/{app_id}/pages/{page_id}",response_model=schemas.Page)
def delete_page(app_id: int, page_id: int, db: Session = Depends(database.get_db)):
    db_page = crud.delete_page(db=db, page_id=page_id)
    if not db_page:
         raise HTTPException(status_code=404, detail="Page not found")
    return db_page


# ==========================================
# 3. CALCULATION ENDPOINT
# ==========================================

@app.post("/api/app/{app_id}/pages/{page_id}/calculate")
def calculate_real(
    app_id: int, 
    page_id: int, 
    payload: Dict[str, Any], 
    db: Session = Depends(database.get_db)
):
    # 1. Extract formData
    raw_inputs = payload.get("formData", {})
    
    # --- Convert Strings to Numbers ---
    user_inputs = {}
    for key, value in raw_inputs.items():
        try:
            if value == "":
                user_inputs[key] = 0.0
            else:
                user_inputs[key] = float(value)
        except (ValueError, TypeError):
            user_inputs[key] = value

    print("Sanitized inputs:", user_inputs) 

    # 2. Fetch Formulas
    db_calculations = crud.get_page_calculations(db=db, app_id=app_id, page_id=page_id)
    
    results = []
    
    # 3. Calculate
    for calc in db_calculations:
        try:
            # Using simple_eval for better safety if installed, else eval
            # calculated_value = simple_eval(calc.formula, names=user_inputs)
            
            # Using eval (be careful in production)
            calculated_value = eval(calc.formula, {"__builtins__": None}, user_inputs)
            
            results.append({
                "key": calc.output_name,
                "value": calculated_value,
                "unit": calc.unit
            })
            
            # Add result to inputs for chaining formulas
            user_inputs[calc.output_name] = calculated_value

        except Exception as e:
            print(f"Error calculating {calc.output_name}: {e}")
            results.append({
                "key": calc.output_name,
                "value": "Error", 
                "unit": "Error"
            })

    return {"results": results}