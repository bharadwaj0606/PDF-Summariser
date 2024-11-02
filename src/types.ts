export interface Document {
  id: string;
  name: string;
  uploadedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  documentId: string;
  messages: Message[];
}