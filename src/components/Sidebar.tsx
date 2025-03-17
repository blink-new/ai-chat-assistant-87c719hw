import { useState } from 'react'
import { X, Settings, Database, BarChart3, MessageSquare, Moon, Sun, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDistanceToNow } from '../lib/utils'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { 
    activeTab, 
    setActiveTab, 
    conversations, 
    currentConversationId, 
    setCurrentConversationId,
    startNewConversation,
    settings,
    updateSettings
  } = useApp()
  
  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode })
  }

  return (
    <aside 
      className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform 
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          {settings.assistantName}
        </h1>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('conversations')}
              className={`w-full flex items-center p-2 rounded-md transition-colors
                ${activeTab === 'conversations' 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <MessageSquare size={18} className="mr-2" />
              <span>Conversations</span>
            </button>
            
            {activeTab === 'conversations' && (
              <div className="mt-2 ml-2 space-y-1">
                <button
                  onClick={startNewConversation}
                  className="w-full flex items-center p-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400"
                >
                  <Plus size={16} className="mr-2" />
                  <span>New Chat</span>
                </button>
                
                {conversations.map(conversation => (
                  <button
                    key={conversation.id}
                    onClick={() => setCurrentConversationId(conversation.id)}
                    className={`w-full flex items-center justify-between p-2 text-sm rounded-md 
                      ${currentConversationId === conversation.id 
                        ? 'bg-gray-100 dark:bg-gray-700' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <span className="truncate flex-1 text-left">
                      {conversation.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(conversation.lastUpdated))}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </li>
          <li>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`w-full flex items-center p-2 rounded-md transition-colors
                ${activeTab === 'knowledge' 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Database size={18} className="mr-2" />
              <span>Knowledge Base</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center p-2 rounded-md transition-colors
                ${activeTab === 'analytics' 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <BarChart3 size={18} className="mr-2" />
              <span>Analytics</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center p-2 rounded-md transition-colors
                ${activeTab === 'settings' 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Settings size={18} className="mr-2" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <span>Dark Mode</span>
          {settings.darkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar