'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Message = {
  id: string;
  message: string;
  response: string;
  timestamp: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
    } else {
      setToken(storedToken);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !token || loading) return;

    setLoading(true);
    const userMessage = input;
    setInput('');

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `******
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Chat error:', error);
        setLoading(false);
        return;
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          message: data.message,
          response: data.response,
          timestamp: data.timestamp,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <h1 className="text-2xl font-bold text-gray-900">CloudImage AI Assistant</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/storage"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Storage
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Welcome Section */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to CloudImage AI Assistant
            </h2>
            <p className="text-gray-600 mb-6">
              I'm your expert guide for cloud storage, image organization, and enhancement.
              Ask me anything about organizing your photos, optimizing storage, or improving image quality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-indigo-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-indigo-900 mb-2">📁 Organization</h3>
                <p className="text-sm text-indigo-700">
                  Learn best practices for organizing your image collection
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-green-900 mb-2">✨ Enhancement</h3>
                <p className="text-sm text-green-700">
                  Discover how to enhance and improve image quality
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">☁️ Cloud Storage</h3>
                <p className="text-sm text-blue-700">
                  Get guidance on cloud storage best practices and strategies
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-purple-900 mb-2">🔧 Optimization</h3>
                <p className="text-sm text-purple-700">
                  Learn advanced techniques for file management and optimization
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-6">
          <div className="space-y-6 py-6">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-xs bg-indigo-600 text-white rounded-lg rounded-tr-none px-4 py-3">
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex justify-start">
                  <div className="max-w-xs bg-gray-200 text-gray-900 rounded-lg rounded-tl-none px-4 py-3">
                    <p className="text-sm whitespace-pre-wrap">{msg.response}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto px-6 py-6 flex gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about image organization, enhancement, or cloud storage..."
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
