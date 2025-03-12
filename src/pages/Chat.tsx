import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { chat } from '../api/chat';

// Define types for our messages
type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
};

// Custom hook to mimic the Vercel AI SDK's useChat hook
function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      content: 'You are a helpful AI assistant that provides detailed, thoughtful responses.',
      role: 'system',
      timestamp: new Date(),
    },
    {
      id: 'welcome-1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to handle submitting a new message
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setError(null);

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
      
      // Call our simulated API
      const response = await chat(apiMessages);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast.error('Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return {
    messages: messages.filter(msg => msg.role !== 'system'),
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error
  };
}

// Simulate streaming text for a more realistic effect
function useTextStream(text: string, isStreaming: boolean) {
  const [streamedText, setStreamedText] = useState('');
  
  useEffect(() => {
    if (!isStreaming || !text) {
      setStreamedText('');
      return;
    }
    
    setStreamedText('');
    let index = 0;
    const words = text.split(' ');
    
    const interval = setInterval(() => {
      if (index < words.length) {
        setStreamedText(prev => prev + (index === 0 ? '' : ' ') + words[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50 + Math.random() * 50);
    
    return () => clearInterval(interval);
  }, [text, isStreaming]);
  
  return streamedText;
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State for streaming the latest message
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  
  // Get the last assistant message for streaming
  const lastAssistantMessage = messages
    .filter(msg => msg.role === 'assistant')
    .pop();
  
  // Use our streaming hook
  const streamedText = useTextStream(
    lastAssistantMessage?.content || '', 
    isStreaming
  );
  
  // Handle streaming effect when a new message arrives
  useEffect(() => {
    if (lastAssistantMessage && !isLoading) {
      setIsStreaming(true);
      setStreamingText(lastAssistantMessage.content);
      
      // Simulate the end of streaming after the text is fully displayed
      const timeoutId = setTimeout(() => {
        setIsStreaming(false);
      }, lastAssistantMessage.content.split(' ').length * 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [lastAssistantMessage, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedText]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter out the last assistant message if we're streaming it
  const displayMessages = isStreaming 
    ? messages.filter(msg => msg.id !== lastAssistantMessage?.id)
    : messages;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-indigo-900">AI Chat Assistant</h1>
        </div>
        <div className="flex items-center text-indigo-600">
          <Sparkles size={18} className="mr-1" />
          <span className="text-sm font-medium">Vercel AI SDK</span>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
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
        
        {/* Streaming message */}
        {isStreaming && streamedText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 text-gray-800">
              <p>{streamedText}</p>
              <div className="text-xs mt-1 text-gray-500">
                {formatTime(new Date())}
              </div>
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                     style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                     style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 max-w-[80%]">
              <p>Error: {error.message || 'Failed to get a response'}</p>
              <p className="text-sm mt-1">Please try again.</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  handleSubmit(e as any);
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