import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { mockChatCompletion } from '../lib/mockApi';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I assist you today?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert our messages to the format expected by the API
      const apiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: userMessage.content,
      });
      
      // Call our mock API
      const response = await mockChatCompletion(apiMessages);
      
      // Add AI response
      const aiMessage: Message = {
        id: response.id,
        content: response.content,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-indigo-900">AI Chat Assistant</h1>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  handleSendMessage(e as any);
                }
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-transparent outline-none resize-none max-h-32"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`ml-2 p-2 rounded-full ${
              !input.trim() || isLoading
                ? 'text-gray-400 bg-gray-200'
                : 'text-white bg-indigo-600 hover:bg-indigo-700'
            } transition-colors`}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}