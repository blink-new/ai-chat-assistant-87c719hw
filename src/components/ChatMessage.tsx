import { formatDistanceToNow } from '../lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user'
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} 
        animate-fade-in ${isUser ? 'animate-slide-in-left' : 'animate-slide-in-right'}`}
    >
      <div 
        className={`max-w-[80%] rounded-lg p-3 ${
          isUser 
            ? 'bg-primary-500 text-white rounded-br-none' 
            : 'bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 rounded-bl-none'
        }`}
      >
        <div className="flex items-center space-x-2 mb-1">
          {!isUser && (
            <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 text-xs">AI</span>
            </div>
          )}
          <span className={`text-xs ${isUser ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {isUser ? 'You' : 'Assistant'} • {formatDistanceToNow(message.timestamp)}
          </span>
        </div>
        <p className={`text-sm whitespace-pre-wrap ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
          {message.content}
        </p>
      </div>
    </div>
  )
}

export default ChatMessage