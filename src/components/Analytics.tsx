import { Menu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalyticsProps {
  toggleSidebar: () => void
}

const Analytics = ({ toggleSidebar }: AnalyticsProps) => {
  const { conversations, knowledgeBase } = useApp()
  
  // Calculate analytics data
  const totalConversations = conversations.length
  const totalMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.length, 
    0
  )
  const userMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.filter(m => m.sender === 'user').length, 
    0
  )
  const assistantMessages = conversations.reduce(
    (sum, conv) => sum + conv.messages.filter(m => m.sender === 'assistant').length, 
    0
  )
  const avgMessagesPerConversation = totalConversations > 0 
    ? Math.round(totalMessages / totalConversations) 
    : 0
  
  // Message distribution data for pie chart
  const messageDistribution = [
    { name: 'User', value: userMessages },
    { name: 'Assistant', value: assistantMessages }
  ]
  
  // Colors for pie chart
  const COLORS = ['#0ea5e9', '#6366f1']
  
  // Conversation activity data for bar chart
  // This is mock data for demonstration
  const conversationActivity = [
    { name: 'Mon', conversations: 3 },
    { name: 'Tue', conversations: 5 },
    { name: 'Wed', conversations: 2 },
    { name: 'Thu', conversations: 7 },
    { name: 'Fri', conversations: 4 },
    { name: 'Sat', conversations: 1 },
    { name: 'Sun', conversations: 2 }
  ]
  
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
        <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </header>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Conversations</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{totalConversations}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Messages</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{totalMessages}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg. Messages/Conversation</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{avgMessagesPerConversation}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Knowledge Base Items</h3>
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-200">{knowledgeBase.length}</p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Conversation Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Conversation Activity</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={conversationActivity}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversations" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Message Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Message Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={messageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {messageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Conversations</h3>
            {conversations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Messages</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {conversations.slice(0, 5).map(conversation => (
                      <tr key={conversation.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          {conversation.title}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {conversation.messages.length}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(conversation.lastUpdated).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No conversations yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics