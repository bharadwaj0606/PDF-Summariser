import React, { useState } from 'react';
import { Bot, FileQuestion } from 'lucide-react';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentList } from './components/DocumentList';
import { Chat } from './components/Chat';
import { Document, Message, Conversation } from './types';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    // In a real app, this would upload to your backend
    const newDoc: Document = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      uploadedAt: new Date(),
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedDoc) return;

    const messageId = Math.random().toString(36).substr(2, 9);
    const newMessage: Message = {
      id: messageId,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Update conversation with user message
    setConversations((prev) => ({
      ...prev,
      [selectedDoc.id]: {
        id: selectedDoc.id,
        documentId: selectedDoc.id,
        messages: [
          ...(prev[selectedDoc.id]?.messages || []),
          newMessage,
        ],
      },
    }));

    setIsLoading(true);

    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      const responseMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: 'This is a simulated response. In a real application, this would be generated by processing your question against the PDF content using LangChain/LlamaIndex.',
        timestamp: new Date(),
      };

      setConversations((prev) => ({
        ...prev,
        [selectedDoc.id]: {
          id: selectedDoc.id,
          documentId: selectedDoc.id,
          messages: [
            ...(prev[selectedDoc.id]?.messages || []),
            responseMessage,
          ],
        },
      }));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-2">
            <FileQuestion className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">PDF Q&A Assistant</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
              <DocumentUpload onUpload={handleUpload} />
            </div>
            
            {documents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Your Documents</h2>
                <DocumentList
                  documents={documents}
                  selectedId={selectedDoc?.id}
                  onSelect={setSelectedDoc}
                />
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedDoc ? (
              <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">
                    Chat about: {selectedDoc.name}
                  </h2>
                </div>
                <Chat
                  messages={conversations[selectedDoc.id]?.messages || []}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center h-[600px] text-center">
                <Bot className="w-16 h-16 text-blue-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Select or Upload a Document
                </h2>
                <p className="text-gray-600">
                  Upload a PDF document and start asking questions about its content.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;