import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${isBot ? 'bg-blue-50/50' : ''} p-4 rounded-xl transition-colors`}>
      <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
        isBot 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
      }`}>
        {isBot ? <Bot size={24} /> : <User size={24} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-medium ${isBot ? 'text-blue-700' : 'text-gray-700'}`}>
            {isBot ? 'AG TECH' : 'You'}
          </span>
          <span className="text-xs text-gray-400">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <ReactMarkdown 
          className="prose prose-sm max-w-none prose-p:text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}