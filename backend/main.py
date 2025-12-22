from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .core import database, auth as core_auth
from . import models, schemas, crud
from .routers import auth as auth_router, apps, calculations, upload

# Create Tables
models.Base.metadata.create_all(bind=database.engine)

# Create Default User
try:
    db = database.SessionLocal()
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if admin_email and admin_password:
        user = crud.get_user_by_email(db, email=admin_email)
        if not user:
            print(f"Creating default admin user ({admin_email})...")
            hashed_password = core_auth.get_password_hash(admin_password)
            user_in = schemas.UserCreate(email=admin_email, password=admin_password)
            # Note: crud.create_user takes (db, user_schema, hashed_password)
            crud.create_user(db, user_in, hashed_password)
            print("Default admin user created.")
        else:
            print("Default admin user already exists.")
    else:
        print("Skipping default user creation: ADMIN_EMAIL or ADMIN_PASSWORD not set.")
finally:
    db.close()

app = FastAPI()

# Mount Static Files
os.makedirs("backend/static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

origins = [
    "http://localhost:5173",
    # Add your production frontend URL here, e.g.:
    # "https://your-app.vercel.app",
    # "https://your-app.netlify.app",
    "https://solarviscasefrontend.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(apps.router)
app.include_router(calculations.router)
app.include_router(upload.router)

@app.get("/")
def home():
    return "Home"