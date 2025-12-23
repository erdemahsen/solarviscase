from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..core import database
from .. import schemas, crud
from ..core.dependencies import get_current_user

router = APIRouter()

@router.get(
        "/api/app/", 
        response_model=List[schemas.AppConfig], 
        summary="Get all apps",
        description="Retrieve a list of all application configurations. This endpoint supports pagination via skip and limit parameters."
        )
def get_apps(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    apps = crud.get_apps(db, skip=skip, limit=limit)
    return apps

@router.post(
        "/api/app/", 
        response_model=schemas.AppConfig, 
        summary="Create a new app",
        description="Create a new application configuration. Requires the user to be authenticated."
        )
def create_app(
    app_config: schemas.AppConfigCreate, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.create_app(db=db, app=app_config)

@router.get(
        "/api/app/{app_id}/", 
        response_model=schemas.AppConfig, 
        summary="Get a specific app",
        description="Retrieve the details of a specific application configuration by its unique ID."
        )
def get_app(app_id: int, db: Session = Depends(database.get_db)):
    db_app = crud.get_app(db=db, app_id=app_id)
    if not db_app:
        raise HTTPException(status_code=404, detail="App not found")
    return db_app

@router.delete(
        "/api/app/{app_id}/", 
        response_model=schemas.AppConfig, 
        summary="Delete an app",
        description="Delete an existing application configuration. Requires the user to be authenticated."
        )
def delete_app(
    app_id: int, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    return crud.delete_app(db=db, app_id=app_id)

@router.put(
        "/api/app/{app_id}/", 
        response_model=schemas.AppConfig, 
        summary="Update an app",
        description="Update an existing application configuration. Requires the user to be authenticated. This performs a full update of the app structure."
        )
def update_app(
    app_id: int, 
    app_data: schemas.AppConfigUpdate, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    updated_app = crud.update_app(db=db, app_id=app_id, app_data=app_data)
    if not updated_app:
        raise HTTPException(status_code=404, detail="App not found")
    return updated_app



