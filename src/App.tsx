import React, { useState } from 'react';
import { Send, Zap, Settings, Info, AlertTriangle, Sparkles, Clock, X } from 'lucide-react';
import { getGeminiResponse } from './lib/gemini';
import { ChatMessage } from './components/ChatMessage';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([{
    text: "Hello! I'm AG TECH, your electrical systems assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isBot: false, timestamp: new Date() }]);
    setRecentSearches(prev => [userMessage, ...prev.slice(0, 4)]); // Keep last 5 searches
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isBot: true, timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "I apologize, but I encountered an error. Please try again.",
        isBot: true,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setInput(search);
    setShowRecentSearches(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-4 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                AG Intelligent Bot
              </h1>
              <p className="text-xs text-gray-500">AG Electrical Group</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors relative"
              onClick={() => setShowRecentSearches(!showRecentSearches)}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 shadow-sm mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Always consult a licensed electrician like AG Electrical Group (adamgyimah2@gmail.com)for complex electrical work and follow local safety codes.
          </p>
        </div>

        {/* Recent Searches Dropdown */}
        {showRecentSearches && (
          <div className="absolute right-4 top-20 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                </div>
                <button 
                  onClick={() => setShowRecentSearches(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-2">
              {recentSearches.length === 0 ? (
                <p className="text-sm text-gray-500 p-2">No recent searches</p>
              ) : (
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors truncate"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 mb-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 items-center text-gray-500 p-4 bg-gray-50 rounded-xl">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-sm font-medium">Processing your request...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="relative mb-2">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Sparkles className={`w-5 h-5 ${isLoading ? 'text-gray-300' : 'text-blue-500'}`} />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about electrical systems, safety, or technical specifications..."
              className={`w-full pl-12 pr-32 py-3.5 bg-white border ${
                isLoading 
                  ? 'border-gray-100 bg-gray-50' 
                  : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
              } rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-700 placeholder-gray-400`}
              disabled={isLoading}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`px-5 py-2 rounded-xl flex items-center gap-2 font-medium ${
                  isLoading || !input.trim()
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md active:scale-95'
                } transition-all duration-200`}
              >
                <Send size={18} />
                Send
              </button>
            </div>
          </form>
          <div className="mt-2 flex items-center justify-between px-4">
            <p className="text-xs text-gray-400">
              Press Enter to send your message
            </p>
            <p className="text-xs text-gray-400">
              For emergency electrical issues, contact a qualified electrician on +233 0549247690
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;