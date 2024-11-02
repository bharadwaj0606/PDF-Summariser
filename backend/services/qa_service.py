from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from database.models import Document, get_session

class QAService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )

    async def get_answer(self, document_id: str, question: str) -> str:
        # Retrieve document content
        with get_session() as session:
            document = session.query(Document).filter(Document.id == document_id).first()
            if not document:
                raise ValueError("Document not found")

            # Split text into chunks
            texts = self.text_splitter.split_text(document.content)

            # Create vector store
            vectorstore = Chroma.from_texts(
                texts,
                self.embeddings,
                metadatas=[{"source": f"chunk_{i}"} for i in range(len(texts))]
            )

            # Create retrieval chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=OpenAI(),
                chain_type="stuff",
                retriever=vectorstore.as_retriever()
            )

            # Get answer
            result = qa_chain({"query": question})
            return result["result"]