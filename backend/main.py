from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil
from fastapi.middleware.cors import CORSMiddleware
from agents import workflow

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post('/upload_pdf')
async def upload(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
      with open(file_path, "wb") as buffer:
          shutil.copyfileobj(file.file, buffer)
      ans=workflow(file_path)
    except Exception as e:
      raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    return {"message": f"{ans}"}