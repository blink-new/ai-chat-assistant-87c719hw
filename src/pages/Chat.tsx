import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
};

// This would normally come from an environment variable
const OPENAI_API_KEY = 'dummy-key';

export default function Chat() {
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
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamedContent, setCurrentStreamedContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages, currentStreamedContent]);

  // Simulate streaming text response
  const streamResponse = async (response: string) => {
    setIsStreaming(true);
    setCurrentStreamedContent('');
    
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
      setCurrentStreamedContent(prev => prev + (i === 0 ? '' : ' ') + words[i]);
    }
    
    setIsStreaming(false);
    
    // Add the complete message to visible messages
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: response,
      role: 'assistant',
      timestamp: new Date(),
    };
    
    setVisibleMessages(prev => [...prev, aiMessage]);
    setMessages(prev => [...prev, aiMessage]);
  };

  // More sophisticated response generation based on conversation context
  const generateAIResponse = async (userInput: string, messageHistory: Message[]) => {
    // Filter out system messages for context analysis
    const visibleHistory = messageHistory.filter(msg => msg.role !== 'system');
    
    // Get the last few messages for context (up to 5)
    const recentMessages = visibleHistory.slice(-5);
    
    // Analyze the user input
    const input = userInput.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|hey|greetings|howdy)( there)?(!|\.|)?$/i.test(input)) {
      return "Hello! How can I assist you today? Feel free to ask me anything.";
    }
    
    // Check for questions about the assistant
    if (input.includes('who are you') || input.includes('what are you') || 
        input.includes('your name') || /^(who|what)('s| is) your (name|creator)/i.test(input)) {
      return "I'm an AI assistant designed to help answer questions and provide information on a wide range of topics. I don't have a specific name, but you can call me Assistant if you'd like!";
    }
    
    // Check for thank you messages
    if (/^thank( you| u)?(!|\.|)$/i.test(input) || input.includes('thanks')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know?";
    }
    
    // Check for questions about capabilities
    if (input.includes('what can you do') || input.includes('help me with') || 
        input.includes('your capabilities') || input.includes('what do you know')) {
      return "I can help with a variety of tasks including answering questions, providing information on different topics, assisting with creative writing, explaining concepts, and engaging in conversation. What would you like help with today?";
    }
    
    // Check for coding questions
    if (input.includes('code') || input.includes('programming') || 
        input.includes('javascript') || input.includes('python') || 
        input.includes('react') || input.includes('html')) {
      return "I see you're interested in programming! I can help explain coding concepts, provide code examples, or assist with debugging. Could you tell me more specifically what you're working on or what you'd like to learn about?";
    }
    
    // Check for questions about feelings or consciousness
    if (input.includes('feel') || input.includes('conscious') || 
        input.includes('sentient') || input.includes('emotions') || 
        input.includes('alive')) {
      return "As an AI, I don't have feelings or consciousness in the way humans do. I'm designed to process information and generate responses based on patterns in data, but I don't have subjective experiences or emotions. I'm here to assist you with information and tasks though!";
    }
    
    // Check for questions about current events or time-sensitive information
    if (input.includes('news') || input.includes('current events') || 
        input.includes('today') || input.includes('latest') || 
        input.includes('recent')) {
      return "I don't have access to real-time information or current news. My knowledge has a cutoff date, and I can't browse the internet. For the most up-to-date information on current events, I'd recommend checking a reliable news source or search engine.";
    }
    
    // Check for questions about the weather
    if (input.includes('weather') || input.includes('temperature') || 
        input.includes('forecast') || input.includes('rain') || 
        input.includes('sunny')) {
      return "I don't have access to real-time weather data or forecasts. To get accurate weather information for your location, I'd recommend checking a weather service website or app, or simply searching for 'weather in [your location]' on a search engine.";
    }
    
    // Check for questions about the user's personal information
    if (input.includes('my name') || input.includes('my age') || 
        input.includes('my location') || input.includes('where am i') || 
        input.includes('my email')) {
      return "I don't have access to your personal information unless you've explicitly shared it with me in our conversation. I don't store personal data between conversations and I'm designed with privacy in mind.";
    }
    
    // Check for very short inputs
    if (input.length < 5) {
      return "I notice your message is quite brief. Could you provide more details about what you'd like to know or discuss? That would help me give you a more helpful response.";
    }
    
    // Generate a contextual response based on conversation history
    if (recentMessages.length > 1) {
      const topics = recentMessages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content.toLowerCase())
        .join(' ');
      
      if (topics.includes('book') || topics.includes('reading') || topics.includes('novel')) {
        return "Based on our conversation about books, I'd recommend exploring different genres to broaden your reading experience. Fiction can transport you to new worlds, while non-fiction can deepen your understanding of our own. What genres do you typically enjoy?";
      }
      
      if (topics.includes('travel') || topics.includes('vacation') || topics.includes('trip')) {
        return "Continuing our discussion about travel, it's always good to research local customs and perhaps learn a few phrases in the local language before visiting a new place. This can greatly enhance your experience and show respect for the culture you're visiting. Have you started planning any specific activities for your trip?";
      }
      
      if (topics.includes('food') || topics.includes('cooking') || topics.includes('recipe')) {
        return "Since we're talking about food, I think experimenting with new ingredients is one of the joys of cooking. Even adding one unfamiliar spice or herb to a familiar dish can transform it into something exciting and new. What kinds of flavors do you typically enjoy in your cooking?";
      }
    }
    
    // Default responses for when no specific pattern is matched
    const thoughtfulResponses = [
      "That's an interesting point. I think it's important to consider different perspectives on this topic. Could you tell me more about your thoughts on this?",
      
      "I understand what you're asking about. This is a topic with many facets to explore. Let me share some thoughts: the key aspects to consider include the context, the various stakeholders involved, and the potential long-term implications. Would you like me to elaborate on any of these aspects?",
      
      "Thank you for bringing this up. It's a thought-provoking question that deserves careful consideration. From my understanding, there are several approaches one might take. Would you like me to explore this topic more deeply with you?",
      
      "I appreciate you sharing that with me. Based on what you've said, I think there are several directions we could take this conversation. What aspect would you like to focus on?",
      
      "That's a great question that touches on several important concepts. Let me offer some thoughts: first, it's helpful to establish what we know for certain, then we can explore the areas where there might be different interpretations or approaches. Does that sound like a useful way to proceed?",
      
      "I find this topic fascinating because it connects to so many different areas of knowledge. There are practical considerations, theoretical frameworks, and even philosophical questions we could explore. What's your primary interest in asking about this?",
      
      "This is something many people wonder about. The way I see it, there are multiple valid perspectives, each with their own supporting evidence and reasoning. Would you like me to outline some of the main viewpoints on this topic?",
      
      "That's a thoughtful inquiry. To give you a comprehensive response, I'd like to address both the immediate question and some of the underlying assumptions. The core issue seems to be about finding the right balance between different factors. What's your experience with this so far?"
    ];
    
    return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
  };

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

    setVisibleMessages(prev => [...prev, userMessage]);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll use our more sophisticated response generator
      const response = await generateAIResponse(userMessage.content, messages);
      
      // Stream the response for a more realistic effect
      await streamResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          <span className="text-sm font-medium">AI Powered</span>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {visibleMessages.map((message) => (
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
        {isStreaming && currentStreamedContent && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 text-gray-800">
              <p>{currentStreamedContent}</p>
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