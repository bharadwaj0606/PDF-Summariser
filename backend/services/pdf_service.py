import os
from datetime import datetime
from fastapi import UploadFile
from pypdf import PdfReader
from database.models import Document, get_session
from sqlalchemy.orm import Session

class PDFService:
    def __init__(self):
        self.upload_dir = "uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def save_and_process(self, file: UploadFile) -> str:
        # Save file
        file_path = os.path.join(self.upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Extract text
        text = self._extract_text(file_path)

        # Save to database
        document = Document(
            name=file.filename,
            path=file_path,
            content=text,
            uploaded_at=datetime.utcnow()
        )

        with get_session() as session:
            session.add(document)
            session.commit()
            session.refresh(document)
            return str(document.id)

    def _extract_text(self, file_path: str) -> str:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    async def list_documents(self):
        with get_session() as session:
            documents = session.query(Document).all()
            return [{"id": str(doc.id), "name": doc.name, "uploaded_at": doc.uploaded_at} for doc in documents]