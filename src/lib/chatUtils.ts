import { formatDistanceToNow as dateFnsFormatDistanceToNow } from '../lib/utils'

interface Message {
  id: string
  content: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

// Simple knowledge base for demo purposes
const knowledgeBase = {
  greetings: [
    "Hello! How can I assist you today?",
    "Hi there! What can I help you with?",
    "Greetings! How may I be of service?",
    "Hello! I'm your AI assistant. What do you need help with?"
  ],
  farewell: [
    "Goodbye! Have a great day!",
    "Farewell! Feel free to return if you have more questions.",
    "Take care! I'm here if you need anything else.",
    "Bye for now! Don't hesitate to reach out again."
  ],
  thanks: [
    "You're welcome! Is there anything else I can help with?",
    "Happy to help! Let me know if you need anything else.",
    "My pleasure! Do you have any other questions?",
    "Glad I could assist! Anything else you'd like to know?"
  ],
  about: [
    "I'm an AI assistant designed to help with various tasks and answer questions. I can provide information, assist with tasks, and engage in conversation.",
    "I'm a virtual assistant powered by AI. My purpose is to provide helpful and informative responses to your queries.",
    "I'm an AI chatbot created to assist users with their questions and needs. I'm constantly learning to provide better assistance."
  ],
  capabilities: [
    "I can answer questions, provide information on various topics, assist with simple tasks, and engage in conversation. However, I have limitations and may not always have the most up-to-date information.",
    "My capabilities include answering questions, providing explanations, offering suggestions, and engaging in dialogue. I'm designed to be helpful, harmless, and honest.",
    "I can help with information retrieval, explanations, suggestions, and conversation. I aim to be accurate and helpful, but I may not always have all the answers."
  ],
  fallback: [
    "I'm not sure I understand. Could you please rephrase your question?",
    "I don't have enough information to provide a good answer to that. Could you give me more details?",
    "I'm still learning and don't have an answer for that yet. Is there something else I can help with?",
    "I'm not able to provide assistance with that specific request. Is there something else you'd like to know about?"
  ]
}

// Function to generate AI responses
export const generateResponse = async (
  userInput: string, 
  conversationHistory: Message[]
): Promise<string> => {
  const input = userInput.toLowerCase()
  
  // Check for greetings
  if (input.match(/^(hi|hello|hey|greetings)/i)) {
    return getRandomResponse(knowledgeBase.greetings)
  }
  
  // Check for farewell
  if (input.match(/^(bye|goodbye|farewell|see you)/i)) {
    return getRandomResponse(knowledgeBase.farewell)
  }
  
  // Check for thanks
  if (input.match(/^(thanks|thank you|appreciate it)/i)) {
    return getRandomResponse(knowledgeBase.thanks)
  }
  
  // Check for questions about the assistant
  if (input.match(/(who are you|what are you|about yourself)/i)) {
    return getRandomResponse(knowledgeBase.about)
  }
  
  // Check for questions about capabilities
  if (input.match(/(what can you do|your capabilities|help me with|abilities)/i)) {
    return getRandomResponse(knowledgeBase.capabilities)
  }
  
  // Simple echo response for demo purposes
  if (input.length < 10) {
    return `I received your message: "${userInput}". Could you provide more details about what you'd like to know?`
  }
  
  // Generate a more complex response based on input length and content
  if (input.includes('help') || input.includes('how to') || input.includes('?')) {
    return `I understand you're looking for help with "${userInput.replace(/\?/g, '')}". While I don't have specific information on this topic in my knowledge base yet, I'd be happy to assist if you provide more details about what you're trying to accomplish.`
  }
  
  // Default fallback response
  return getRandomResponse(knowledgeBase.fallback)
}

// Helper function to get a random response from an array
const getRandomResponse = (responses: string[]): string => {
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex]
}