from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from . import database, models
from .routers import auth, apps, calculations, upload

# Create Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

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

# Include Routers
app.include_router(auth.router)
app.include_router(apps.router)
app.include_router(calculations.router)
app.include_router(upload.router)

@app.get("/")
def home():
    return "Home"