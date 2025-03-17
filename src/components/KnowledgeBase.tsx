import { useState } from 'react'
import { Menu, Plus, Search, Trash, Edit, Save, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatDistanceToNow } from '../lib/utils'
import toast from 'react-hot-toast'

interface KnowledgeBaseProps {
  toggleSidebar: () => void
}

const KnowledgeBase = ({ toggleSidebar }: KnowledgeBaseProps) => {
  const { knowledgeBase, addKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  
  const filteredItems = knowledgeBase.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddItem = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }
    
    addKnowledgeItem({
      title,
      content,
      category: category || 'General'
    })
    
    // Reset form
    setTitle('')
    setContent('')
    setCategory('')
    setShowAddForm(false)
    
    toast.success('Knowledge item added')
  }
  
  const handleEditItem = (id: string) => {
    const item = knowledgeBase.find(item => item.id === id)
    if (item) {
      setTitle(item.title)
      setContent(item.content)
      setCategory(item.category)
      setEditingId(id)
    }
  }
  
  const handleUpdateItem = () => {
    if (!editingId) return
    
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }
    
    updateKnowledgeItem(editingId, {
      title,
      content,
      category: category || 'General'
    })
    
    // Reset form
    setTitle('')
    setContent('')
    setCategory('')
    setEditingId(null)
    
    toast.success('Knowledge item updated')
  }
  
  const handleDeleteItem = (id: string) => {
    deleteKnowledgeItem(id)
    toast.success('Knowledge item deleted')
  }
  
  const handleCancelEdit = () => {
    setTitle('')
    setContent('')
    setCategory('')
    setEditingId(null)
    setShowAddForm(false)
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
        <h2 className="text-lg font-semibold">Knowledge Base</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="Add Knowledge Item"
        >
          <Plus size={20} />
        </button>
      </header>
      
      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          {/* Add/Edit Form */}
          {(showAddForm || editingId) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingId ? 'Edit Knowledge Item' : 'Add Knowledge Item'}
                </h3>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    placeholder="Enter category (optional)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded-md dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 min-h-[120px]"
                    placeholder="Enter content"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingId ? handleUpdateItem : handleAddItem}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md"
                  >
                    {editingId ? 'Update' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Knowledge Items */}
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 animate-fade-in"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Added {formatDistanceToNow(new Date(item.dateAdded))}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditItem(item.id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                        title="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              {searchQuery ? (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No results found for "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary-500 hover:text-primary-600"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Your knowledge base is empty</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md"
                  >
                    Add Your First Item
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBase