from fastapi import FastAPI, Depends
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

# /api/app/
@app.get("/api/app/", response_model=List[schemas.AppConfig])
def get_apps(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    apps = crud.get_apps(db, skip=skip, limit=limit)
    return apps

@app.post("/api/app/", response_model=schemas.AppConfig)
def create_app(app_config: schemas.AppConfigCreate, db: Session = Depends(database.get_db)):
    return crud.create_app(db=db, app=app_config)

@app.get("/api/app/{app_id}/", response_model=schemas.AppConfig)
def get_app(app_id: int, db: Session = Depends(database.get_db)):
    return crud.get_app(db=db, app_id=app_id)

@app.delete("/api/app/{app_id}/", response_model=schemas.AppConfig)
def delete_app(app_id: int, db: Session = Depends(database.get_db)):
    return crud.delete_app(db=db, app_id=app_id)

# /apps/{app_id}/pages/

@app.post("/apps/{app_id}/pages/", response_model=schemas.Page)
def create_page(app_id: int, page: schemas.PageCreate, db: Session = Depends(database.get_db)):
    return crud.create_page_for_app(db=db, app_id=app_id, page_data=page)

@app.delete("/apps/{app_id}/pages/{page_id}",response_model=schemas.Page)
def delete_page(app_id: int,page_id: int,db: Session = Depends(database.get_db)):
    db_page = crud.delete_page(db=db, page_id=page_id)

    if not db_page:
        pass
        #raise HTTPException(status_code=404, detail="Page not found")

    return db_page

# /api/app/{app_id}/pages/{page_id}/calculate

from simpleeval import simple_eval  # Recommended for safety, or use eval() with caution
@app.post("/api/app/{app_id}/pages/{page_id}/calculate")
def calculate_real(
    app_id: int, 
    page_id: int, 
    payload: Dict[str, Any], 
    db: Session = Depends(database.get_db)
):
    # 1. Extract formData
    raw_inputs = payload.get("formData", {})
    
    # --- FIX START: Convert Strings to Numbers ---
    user_inputs = {}
    for key, value in raw_inputs.items():
        try:
            # Try to convert to float. 
            # If inputs are empty strings "", this might fail, so we handle that.
            if value == "":
                user_inputs[key] = 0.0
            else:
                user_inputs[key] = float(value)
        except (ValueError, TypeError):
            # If it's strictly text (like a name), keep it as string
            user_inputs[key] = value
    # --- FIX END ---

    print("Sanitized inputs:", user_inputs) 

    # 2. Fetch Formulas
    db_calculations = crud.get_page_calculations(db=db, app_id=app_id, page_id=page_id)
    
    results = []
    
    # 3. Calculate
    for calc in db_calculations:
        try:
            # Now "X" is 1.0 (float), so 2 * 1.0 = 2.0
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