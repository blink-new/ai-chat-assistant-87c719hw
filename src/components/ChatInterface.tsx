import { useState, useRef, useEffect } from 'react'
import { Send, Menu, Paperclip, Trash } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { generateResponse } from '../lib/chatUtils'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

interface ChatInterfaceProps {
  toggleSidebar: () => void
}

const ChatInterface = ({ toggleSidebar }: ChatInterfaceProps) => {
  const { 
    conversations, 
    currentConversationId, 
    startNewConversation,
    addMessageToConversation,
    deleteConversation,
    settings
  } = useApp()
  
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get current conversation
  const currentConversation = conversations.find(c => c.id === currentConversationId) || null
  
  // Create a new conversation if none exists
  useEffect(() => {
    if (!currentConversationId && conversations.length === 0) {
      startNewConversation()
    } else if (!currentConversationId && conversations.length > 0) {
      // Select the most recent conversation
      const mostRecent = conversations.sort((a, b) => 
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      )[0]
      if (mostRecent) {
        // We don't call setCurrentConversationId directly to avoid circular dependencies
        setTimeout(() => {
          const event = new CustomEvent('select-conversation', { detail: mostRecent.id })
          window.dispatchEvent(event)
        }, 0)
      }
    }
  }, [currentConversationId, conversations])
  
  // Listen for custom event
  useEffect(() => {
    const handleSelectConversation = (e: CustomEvent<string>) => {
      if (e.detail) {
        // Now we can safely call this
        useApp().setCurrentConversationId(e.detail)
      }
    }
    
    window.addEventListener('select-conversation', handleSelectConversation as EventListener)
    
    return () => {
      window.removeEventListener('select-conversation', handleSelectConversation as EventListener)
    }
  }, [])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentConversationId) return
    
    // Add user message
    addMessageToConversation(currentConversationId, {
      content: inputValue,
      sender: 'user'
    })
    
    setInputValue('')
    setIsTyping(true)
    
    // Simulate AI response
    setTimeout(async () => {
      try {
        const responseContent = await generateResponse(
          inputValue, 
          currentConversation?.messages || []
        )
        
        addMessageToConversation(currentConversationId, {
          content: responseContent,
          sender: 'assistant'
        })
      } catch (error) {
        console.error('Error generating response:', error)
        toast.error('Failed to generate response. Please try again.')
      } finally {
        setIsTyping(false)
      }
    }, 1000)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleNewChat = () => {
    startNewConversation()
  }
  
  const handleDeleteConversation = () => {
    if (currentConversationId) {
      deleteConversation(currentConversationId)
      toast.success('Conversation deleted')
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
        <h2 className="text-lg font-semibold">
          {currentConversation?.title || settings.assistantName}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleNewChat}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="New Chat"
          >
            <Send size={18} />
          </button>
          {currentConversationId && (
            <button
              onClick={handleDeleteConversation}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Delete Conversation"
            >
              <Trash size={18} />
            </button>
          )}
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {currentConversation ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {currentConversation.messages.map(message => (
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
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start a new conversation or select an existing one from the sidebar.
              </p>
              <button
                onClick={handleNewChat}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Input */}
      {currentConversation && (
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
      )}
    </div>
  )
}

export default ChatInterface