import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  selectedId?: string;
  onSelect: (document: Document) => void;
}

export function DocumentList({ documents, selectedId, onSelect }: DocumentListProps) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc)}
          className={`w-full p-4 rounded-lg text-left transition-colors ${
            selectedId === doc.id
              ? 'bg-blue-50 border-blue-200'
              : 'hover:bg-gray-50 border-transparent'
          } border`}
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {doc.name}
              </p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}