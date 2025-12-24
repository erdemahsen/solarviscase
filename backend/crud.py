from typing import List, Set
from sqlalchemy.orm import Session
from . import models, schemas
from .core import auth
from .services import app_service

# ==========================================
# 1. APP CONFIG OPERATIONS
# ==========================================

def get_apps(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AppConfig).offset(skip).limit(limit).all()

def get_app(db: Session, app_id: int):
    # This fetches the App, AND because of relationships, 
    # it fetches all Pages, Inputs, and Calculations automatically when accessed.
    return db.query(models.AppConfig).filter(models.AppConfig.id == app_id).first()

def create_app(db: Session, app: schemas.AppConfigCreate):
    db_app = models.AppConfig(**app.dict())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

def delete_app(db: Session, app_id: int):
    db_app = get_app(db, app_id)
    if db_app:
        db.delete(db_app)
        db.commit()
    return db_app

def update_app(db: Session, app_id: int, app_data: schemas.AppConfigUpdate):
    db_app = get_app(db, app_id)
    if not db_app:
        return None

    # 2. Reconcile App Structure (using service helper)
    app_service.reconcile_app_structure(db, db_app, app_data)

    db.commit()
    db.refresh(db_app)
    return db_app


# ==========================================
# 2. PAGE CALCULATIONS 
# ==========================================
def get_page_calculations(db: Session, app_id: int, page_id: int):
    return (
        db.query(models.Calculation)
        .join(models.Page)
        .filter(models.Page.id == page_id)
        .filter(models.Page.config_id == app_id)
        .all()
    )

# ==========================================
# 3. AUTH / USER CRUD
# ==========================================

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# I do db.add(db_page1), db.add(db_page2), db.add(db_page3)
# then db.commit pushes that commit to db
# db.refresh(), goes to db checks out null fields add id's for example for newly created ones.