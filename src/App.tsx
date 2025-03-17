import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import KnowledgeBase from './components/KnowledgeBase'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import { useApp } from './context/AppContext'
import './App.css'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { activeTab } = useApp()
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'conversations' && (
          <ChatInterface toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
        {activeTab === 'knowledge' && (
          <KnowledgeBase toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
        {activeTab === 'analytics' && (
          <Analytics toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
        {activeTab === 'settings' && (
          <Settings toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
      </main>
    </div>
  )
}

export default App