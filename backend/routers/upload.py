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
        
    # request.base_url returns the full URL including scheme and port (e.g. http://localhost:8001/ or https://myapp.onrender.com/)
    return {"url": f"{str(request.base_url)}static/uploads/{unique_filename}"}
