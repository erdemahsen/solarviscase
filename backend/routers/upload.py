from fastapi import APIRouter, File, UploadFile
import shutil
import uuid
import os

router = APIRouter()

# Upload Endpoint
@router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Generate a unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"backend/static/uploads/{unique_filename}"
    
    # Ensure directory exists (it should be created by main.py startup, but good to be safe or do it here)
    os.makedirs("backend/static/uploads", exist_ok=True)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/static/uploads/{unique_filename}"}
