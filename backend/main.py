from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel 
from typing import Dict, List, Any
from datetime import timedelta
import shutil
import os
import uuid

from sqlalchemy.orm import Session

from . import schemas
from . import database
from . import crud
from . import models
from . import auth


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except auth.JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# Mount Static Files
os.makedirs("backend/static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

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

# Upload Endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Generate a unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"backend/static/uploads/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/static/uploads/{unique_filename}"}

# API Health Check
@app.get("/")
def home():
    return "Home"


# ==========================================
# 0. AUTH ENDPOINTS
# ==========================================

@app.post("/api/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    # OAuth2 specifies "username" and "password" fields
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ==========================================
# 1. APP CONFIG ENDPOINTS
# ==========================================

@app.get("/api/app/", response_model=List[schemas.AppConfig])
def get_apps(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    apps = crud.get_apps(db, skip=skip, limit=limit)
    return apps

@app.post("/api/app/", response_model=schemas.AppConfig)
def create_app(
    app_config: schemas.AppConfigCreate, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.create_app(db=db, app=app_config)

@app.get("/api/app/{app_id}/", response_model=schemas.AppConfig)
def get_app(app_id: int, db: Session = Depends(database.get_db)):
    db_app = crud.get_app(db=db, app_id=app_id)
    if not db_app:
        raise HTTPException(status_code=404, detail="App not found")
    return db_app

@app.delete("/api/app/{app_id}/", response_model=schemas.AppConfig)
def delete_app(
    app_id: int, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.delete_app(db=db, app_id=app_id)

# --- NEW: THE BULK UPDATE ENDPOINT ---
@app.put("/api/app/{app_id}/structure", response_model=schemas.AppConfig)
def update_app_structure(
    app_id: int, 
    app_data: schemas.AppConfigUpdate, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
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