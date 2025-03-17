import { useState } from 'react'
import { Menu,
  User,
  Palette,
  MessageSquare,
  Save,
  Trash,
  Upload
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

interface SettingsProps {
  toggleSidebar: () => void
}

const Settings = ({ toggleSidebar }: SettingsProps) => {
  const { settings, updateSettings, conversations, knowledgeBase } = useApp()
  
  // Local state for form
  const [assistantName, setAssistantName] = useState(settings.assistantName)
  const [welcomeMessage, setWelcomeMessage] = useState(settings.welcomeMessage)
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor)
  const [tone, setTone] = useState(settings.tone)
  
  const handleSaveSettings = () => {
    updateSettings({
      assistantName,
      welcomeMessage,
      primaryColor,
      tone
    })
    
    // Update CSS variable for primary color
    document.documentElement.style.setProperty('--primary', primaryColor)
    
    toast.success('Settings saved successfully')
  }
  
  const handleResetSettings = () => {
    setAssistantName('AI Assistant')
    setWelcomeMessage('Hello! I\'m your AI assistant. How can I help you today?')
    setPrimaryColor('#0ea5e9')
    setTone('friendly')
    
    updateSettings({
      assistantName: 'AI Assistant',
      welcomeMessage: 'Hello! I\'m your AI assistant. How can I help you today?',
      primaryColor: '#0ea5e9',
      tone: 'friendly'
    })
    
    toast.success('Settings reset to defaults')
  }
  
  const handleExportData = () => {
    const data = {
      settings,
      conversations,
      knowledgeBase
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ai-assistant-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Data exported successfully')
  }
  
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        
        // Validate data structure
        if (!data.settings || !data.conversations || !data.knowledgeBase) {
          throw new Error('Invalid data format')
        }
        
        // Update settings
        updateSettings(data.settings)
        
        // Update conversations and knowledge base would require additional context methods
        // For now, we'll just show a success message
        
        toast.success('Settings imported successfully')
      } catch (error) {
        toast.error('Failed to import data. Invalid format.')
      }
    }
    reader.readAsText(file)
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
        <h2 className="text-lg font-semibold">Settings</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </header>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          {/* Assistant Profile */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <User size={20} className="mr-2 text-primary-500" />
              <h3 className="text-lg font-semibold">Assistant Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assistant Name</label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  className="w-full p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  placeholder="Enter assistant name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Welcome Message</label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 min-h-[80px]"
                  placeholder="Enter welcome message"
                />
              </div>
            </div>
          </div>
          
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Palette size={20} className="mr-2 text-primary-500" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Primary Color</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-md border dark:border-gray-600 mr-2"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="#0ea5e9"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Dark Mode</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(e) => updateSettings({ darkMode: e.target.checked })}
                    className="w-4 h-4 mr-2"
                  />
                  <span>Enable dark mode</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conversation Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <MessageSquare size={20} className="mr-2 text-primary-500" />
              <h3 className="text-lg font-semibold">Conversation Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Conversation Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as 'friendly' | 'professional' | 'technical')}
                  className="w-full p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="technical">Technical</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center mb-4">
              <Save size={20} className="mr-2 text-primary-500" />
              <h3 className="text-lg font-semibold">Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Export Data
                </button>
                
                <label className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md cursor-pointer flex items-center">
                  <Upload size={16} className="mr-2" />
                  Import Data
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={handleResetSettings}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"
                >
                  <Trash size={16} className="mr-2" />
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center"
            >
              <Save size={16} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings