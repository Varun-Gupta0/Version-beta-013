"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          userId: localStorage.getItem('userId'),
          context: { previousMessages: messages.slice(-5) }
        }),
      });

      if (!res.ok) throw new Error("Failed to get AI response");

      const data = await res.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
      console.error(error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-medical-DEFAULT hover:bg-medical-dark text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-200 ${
      isMinimized ? 'w-80 h-14' : 'w-80 h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-medical-DEFAULT text-white rounded-t-lg">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <MessageCircle size={16} />
          MedWallet AI Assistant
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-64">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p>Ask me anything about your health!</p>
                <p className="text-xs mt-1">I can help with symptoms, medications, and wellness tips.</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-medical-DEFAULT text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-medical-DEFAULT border-t-transparent"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about your health..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-DEFAULT dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-medical-DEFAULT hover:bg-medical-dark disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-md transition-colors"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </form>

            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mt-2 transition-colors"
              >
                Clear conversation
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
