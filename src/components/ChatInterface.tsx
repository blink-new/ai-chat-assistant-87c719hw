import { useState, useRef, useEffect } from 'react'
import { Send, Menu, Paperclip } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { generateResponse } from '../lib/chatUtils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

interface ChatInterfaceProps {
  toggleSidebar: () => void
}

const ChatInterface = ({ toggleSidebar }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(async () => {
      const responseContent = await generateResponse(inputValue, messages)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-semibold">AI Chat Assistant</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 text-xs">AI</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full bg-transparent resize-none outline-none min-h-[40px] max-h-[120px] text-gray-800 dark:text-gray-200"
                rows={1}
              />
              <div className="flex justify-between items-center mt-2">
                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <Paperclip size={18} />
                </button>
                <div className="text-xs text-gray-500">
                  {inputValue.length > 0 ? `${inputValue.length} characters` : 'Type to start chatting'}
                </div>
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-full ${
                inputValue.trim() 
                  ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface