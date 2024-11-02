from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from datetime import datetime
from services.pdf_service import PDFService
from services.qa_service import QAService
from database.models import init_db

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_service = PDFService()
qa_service = QAService()

# Initialize database
init_db()

class Question(BaseModel):
    content: str

class Answer(BaseModel):
    content: str

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        # Save and process the PDF
        document_id = await pdf_service.save_and_process(file)
        return {"document_id": document_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask/{document_id}")
async def ask_question(document_id: str, question: Question):
    try:
        answer = await qa_service.get_answer(document_id, question.content)
        return Answer(content=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents():
    try:
        documents = await pdf_service.list_documents()
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)