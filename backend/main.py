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

@app.get("/")
def home():
    return "Home"

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


@app.delete("/apps/{app_id}/pages/{page_id}",response_model=schemas.Page)
def delete_page(app_id: int,page_id: int,db: Session = Depends(database.get_db)):
    db_page = crud.delete_page(db=db, page_id=page_id)

    if not db_page:
        pass
        #raise HTTPException(status_code=404, detail="Page not found")

    return db_page


@app.post("/apps/{app_id}/pages/", response_model=schemas.Page)
def create_page(app_id: int, page: schemas.PageCreate, db: Session = Depends(database.get_db)):
    return crud.create_page_for_app(db=db, app_id=app_id, page_data=page)

@app.get("/api/mock")
def app_config():
    # FastAPI turns dict into JSON automatically :)
    return {
        "numInputPages": 2,
        "pages": [
            {
                "id": 1,
                "title": "Energy Basics",
                "description": "Tell us about your current usage.",
                "image": "https://example.com/solar-1.jpg",
                "inputs": [
                    {
                        "name": "X",
                        "placeholder": "Monthly Bill ($)",
                        "type": "number"
                    }
                ]
            },
            {
                "id": 2,
                "title": "Home Details",
                "description": "Dimensions and location.",
                "image": "https://example.com/solar-2.jpg",
                "inputs": [
                    {
                        "name": "Y",
                        "placeholder": "Roof Area (sqm)",
                        "type": "number"
                    },
                    {
                        "name": "Z",
                        "placeholder": "Sunlight Hours",
                        "type": "number"
                    }
                ]
            }
        ],
        "calculations": [
            {
                "outputName": "A",
                "formula": "(Y * 100000 + Z * 50000) - (X * 10000)",
                "unit": "kWh"
            },
            {
                "outputName": "B",
                "formula": "A / 200",
                "unit": "USD"
            }
        ],
        "outputPage": {
            "title": "Your Solar Potential",
            "description": "Based on your inputs, here is your estimate.",
            "image": "https://example.com/result.jpg"
        }
    }

@app.post("/api/calculate")
def calculate_mock(payload: Dict[str, Any]):
    """
    Receives formData and calculations, returns mock results.
    payload structure expected:
    {
        "formData": { "X": 100, ... },
        "calculations": [ ... ]
    }
    """
    # For a purely mock response, we can just return static numbers
    # matching the expected output format of the frontend.
    return {
        "results": [
            {
                "key": "A",
                "value": 12000,
                "unit": "kWh"
            },
            {
                "key": "B",
                "value": 60, 
                "unit": "USD"
            }
        ]
    }
