from fastapi import APIRouter, File, UploadFile, Request
import shutil
from ..core import database
from .. import models, schemas
from ..core.dependencies import get_current_user
import uuid
import os

router = APIRouter()

# Upload Endpoint
@router.post("/api/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    # Generate a unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"backend/static/uploads/{unique_filename}"
    
    # Ensure directory exists (it should be created by main.py startup, but good to be safe or do it here)
    os.makedirs("backend/static/uploads", exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Return the relative path, e.g. "static/uploads/uuid.jpeg"
    # The frontend will prepend the backend base URL.
    return {"url": f"static/uploads/{unique_filename}"}
