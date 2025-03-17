import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { loadFromLocalStorage, saveToLocalStorage } from '../lib/utils'

// Define types
export interface KnowledgeItem {
  id: string
  title: string
  content: string
  category: string
  dateAdded: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export interface AppSettings {
  assistantName: string
  assistantAvatar: string | null
  primaryColor: string
  darkMode: boolean
  tone: 'friendly' | 'professional' | 'technical'
  welcomeMessage: string
}

interface AppContextType {
  // Knowledge base
  knowledgeBase: KnowledgeItem[]
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'dateAdded'>) => void
  updateKnowledgeItem: (id: string, updates: Partial<KnowledgeItem>) => void
  deleteKnowledgeItem: (id: string) => void
  
  // Conversations
  conversations: Conversation[]
  currentConversationId: string | null
  setCurrentConversationId: (id: string | null) => void
  startNewConversation: () => string
  addMessageToConversation: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  deleteConversation: (id: string) => void
  
  // Settings
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  
  // UI State
  activeTab: 'conversations' | 'knowledge' | 'analytics' | 'settings'
  setActiveTab: (tab: 'conversations' | 'knowledge' | 'analytics' | 'settings') => void
}

// Default settings
const defaultSettings: AppSettings = {
  assistantName: 'AI Assistant',
  assistantAvatar: null,
  primaryColor: '#0ea5e9',
  darkMode: false,
  tone: 'friendly',
  welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?'
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined)

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Knowledge base state
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(
    loadFromLocalStorage('knowledgeBase', [])
  )
  
  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(
    loadFromLocalStorage('conversations', [])
  )
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    loadFromLocalStorage('currentConversationId', null)
  )
  
  // Settings state
  const [settings, setSettings] = useState<AppSettings>(
    loadFromLocalStorage('settings', defaultSettings)
  )
  
  // UI state
  const [activeTab, setActiveTab] = useState<'conversations' | 'knowledge' | 'analytics' | 'settings'>(
    'conversations'
  )
  
  // Save state to localStorage when it changes
  useEffect(() => {
    saveToLocalStorage('knowledgeBase', knowledgeBase)
  }, [knowledgeBase])
  
  useEffect(() => {
    saveToLocalStorage('conversations', conversations)
  }, [conversations])
  
  useEffect(() => {
    saveToLocalStorage('currentConversationId', currentConversationId)
  }, [currentConversationId])
  
  useEffect(() => {
    saveToLocalStorage('settings', settings)
  }, [settings])
  
  // Apply dark mode setting
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])
  
  // Knowledge base functions
  const addKnowledgeItem = (item: Omit<KnowledgeItem, 'id' | 'dateAdded'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: Date.now().toString(),
      dateAdded: new Date()
    }
    setKnowledgeBase(prev => [...prev, newItem])
  }
  
  const updateKnowledgeItem = (id: string, updates: Partial<KnowledgeItem>) => {
    setKnowledgeBase(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }
  
  const deleteKnowledgeItem = (id: string) => {
    setKnowledgeBase(prev => prev.filter(item => item.id !== id))
  }
  
  // Conversation functions
  const startNewConversation = () => {
    const id = Date.now().toString()
    const newConversation: Conversation = {
      id,
      title: 'New Conversation',
      messages: [
        {
          id: 'welcome',
          content: settings.welcomeMessage,
          sender: 'assistant',
          timestamp: new Date()
        }
      ],
      lastUpdated: new Date()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(id)
    return id
  }
  
  const addMessageToConversation = (
    conversationId: string, 
    message: Omit<Message, 'id' | 'timestamp'>
  ) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === conversationId) {
          // Update conversation title based on first user message if it's "New Conversation"
          let title = conv.title
          if (title === 'New Conversation' && message.sender === 'user') {
            title = message.content.length > 30 
              ? `${message.content.substring(0, 30)}...` 
              : message.content
          }
          
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastUpdated: new Date(),
            title
          }
        }
        return conv
      })
    )
  }
  
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id))
    if (currentConversationId === id) {
      setCurrentConversationId(null)
    }
  }
  
  // Settings functions
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }
  
  // Create initial conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      startNewConversation()
    }
  }, [])
  
  const value = {
    knowledgeBase,
    addKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    
    conversations,
    currentConversationId,
    setCurrentConversationId,
    startNewConversation,
    addMessageToConversation,
    deleteConversation,
    
    settings,
    updateSettings,
    
    activeTab,
    setActiveTab
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}