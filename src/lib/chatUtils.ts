import { Message, KnowledgeItem } from '../context/AppContext'
import { loadFromLocalStorage } from './utils'

// Function to generate AI responses
export const generateResponse = async (
  userInput: string, 
  conversationHistory: Message[]
): Promise<string> => {
  const input = userInput.toLowerCase()
  
  // Get knowledge base from local storage
  const knowledgeBase: KnowledgeItem[] = loadFromLocalStorage('knowledgeBase', [])
  
  // Get settings from local storage
  const settings = loadFromLocalStorage('settings', {
    tone: 'friendly',
    assistantName: 'AI Assistant'
  })
  
  // Check for matches in knowledge base
  const relevantKnowledge = knowledgeBase.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(input)
    const contentMatch = item.content.toLowerCase().includes(input)
    return titleMatch || contentMatch
  })
  
  if (relevantKnowledge.length > 0) {
    // Use the most relevant knowledge item
    const item = relevantKnowledge[0]
    return `Based on my knowledge base: ${item.content}`
  }
  
  // Check for greetings
  if (input.match(/^(hi|hello|hey|greetings)/i)) {
    return getRandomResponse(greetings, settings.tone)
  }
  
  // Check for farewell
  if (input.match(/^(bye|goodbye|farewell|see you)/i)) {
    return getRandomResponse(farewell, settings.tone)
  }
  
  // Check for thanks
  if (input.match(/^(thanks|thank you|appreciate it)/i)) {
    return getRandomResponse(thanks, settings.tone)
  }
  
  // Check for questions about the assistant
  if (input.match(/(who are you|what are you|about yourself)/i)) {
    return getRandomResponse(about, settings.tone)
      .replace('AI Assistant', settings.assistantName)
  }
  
  // Check for questions about capabilities
  if (input.match(/(what can you do|your capabilities|help me with|abilities)/i)) {
    return getRandomResponse(capabilities, settings.tone)
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
  return getRandomResponse(fallback, settings.tone)
}

// Helper function to get a random response from an array based on tone
const getRandomResponse = (
  responses: Record<string, string[]>, 
  tone: string = 'friendly'
): string => {
  const toneResponses = responses[tone] || responses.friendly
  const randomIndex = Math.floor(Math.random() * toneResponses.length)
  return toneResponses[randomIndex]
}

// Response templates by tone
const greetings = {
  friendly: [
    "Hello! How can I assist you today?",
    "Hi there! What can I help you with?",
    "Hey! How's it going? What do you need help with?",
    "Hello! I'm your AI assistant. What do you need help with?"
  ],
  professional: [
    "Hello. How may I assist you today?",
    "Greetings. How can I be of service?",
    "Good day. What assistance do you require?",
    "Hello. I'm your virtual assistant. How can I help you?"
  ],
  technical: [
    "Hello. Ready to process your request.",
    "Greetings. What technical assistance do you require?",
    "Hello. System ready for your query.",
    "Initialized and ready. What's your technical question?"
  ]
}

const farewell = {
  friendly: [
    "Goodbye! Have a great day!",
    "Bye for now! Feel free to chat again anytime!",
    "Take care! I'm here whenever you need me!",
    "See you later! Come back soon!"
  ],
  professional: [
    "Goodbye. Thank you for your time.",
    "Farewell. Please reach out if you need further assistance.",
    "Thank you for the conversation. Have a productive day.",
    "Goodbye. I remain available should you require additional help."
  ],
  technical: [
    "Session terminated. Goodbye.",
    "Disconnecting. Available for future queries.",
    "Ending conversation. System will remain available.",
    "Conversation complete. Ready for future technical assistance."
  ]
}

const thanks = {
  friendly: [
    "You're welcome! Is there anything else I can help with?",
    "Happy to help! Let me know if you need anything else!",
    "My pleasure! Do you have any other questions?",
    "Anytime! I'm always here to help!"
  ],
  professional: [
    "You're welcome. Is there anything else you require?",
    "I'm glad I could be of assistance. Please let me know if you need further help.",
    "It was my pleasure to assist you. Do you have additional questions?",
    "You're most welcome. I'm here if you need additional support."
  ],
  technical: [
    "Acknowledged. Additional assistance available if required.",
    "Request completed successfully. Further queries accepted.",
    "Assistance provided. Ready for next technical request.",
    "Task complete. System ready for additional queries."
  ]
}

const about = {
  friendly: [
    "I'm an AI assistant designed to help with various tasks and answer questions. I can provide information, assist with tasks, and engage in conversation. How can I help you today?",
    "I'm your friendly AI assistant! I'm here to chat, answer questions, and help you with whatever you need. What can I do for you?",
    "Hi there! I'm an AI chatbot created to assist you with information, tasks, and conversation. I'm always learning to provide better help. What would you like to know?"
  ],
  professional: [
    "I am an AI assistant programmed to provide information and assistance across various domains. My purpose is to deliver accurate and helpful responses to your inquiries. How may I assist you today?",
    "I'm a virtual assistant designed to provide professional support and information. I can assist with research, answer questions, and help streamline your tasks. What assistance do you require?",
    "I am an AI-powered assistant focused on delivering professional support. I can provide information, answer questions, and assist with various tasks. How can I be of service?"
  ],
  technical: [
    "I am an AI language model designed to process and respond to natural language inputs. My system utilizes pattern recognition and contextual analysis to generate appropriate responses. What is your technical query?",
    "This is an AI assistant interface utilizing natural language processing algorithms to interpret and respond to user inputs. Technical specifications available upon request. How can I assist with your technical needs?",
    "AI assistant online. Core functions include natural language processing, context analysis, and response generation. System ready for technical queries and information retrieval tasks."
  ]
}

const capabilities = {
  friendly: [
    "I can answer questions, provide information on various topics, assist with simple tasks, and engage in conversation. I'm here to help make your day easier!",
    "I can help with information, answer questions, chat about different topics, and assist with basic tasks. Just let me know what you need!",
    "I'm designed to be helpful! I can answer questions, provide explanations, offer suggestions, and have conversations on many topics. What would you like help with?"
  ],
  professional: [
    "My capabilities include providing information across various domains, answering inquiries, assisting with research, and facilitating task management. I aim to deliver accurate and relevant assistance.",
    "I can provide information, answer questions, assist with planning, and offer recommendations based on available data. My goal is to enhance your productivity through efficient assistance.",
    "My functions include information retrieval, question answering, and process assistance. I'm designed to provide clear, concise, and accurate support for your professional needs."
  ],
  technical: [
    "System capabilities: natural language processing, context-aware responses, information retrieval from knowledge base, conversation memory, and basic reasoning within defined parameters.",
    "This AI system can process natural language inputs, maintain conversation context, access stored information, and generate contextually appropriate responses based on pattern recognition algorithms.",
    "Technical capabilities include: text processing, pattern matching, context maintenance, knowledge retrieval, and response generation. System limitations include lack of real-time data access and absence of true understanding."
  ]
}

const fallback = {
  friendly: [
    "I'm not quite sure I understand. Could you please rephrase that?",
    "Hmm, I'm not sure about that. Could you give me more details?",
    "I'm still learning and don't have an answer for that yet. Is there something else I can help with?",
    "I don't have enough information to help with that specific request. Could you tell me more?"
  ],
  professional: [
    "I'm unable to provide a complete response based on the information provided. Could you please clarify your request?",
    "I don't have sufficient context to address your inquiry properly. Additional details would help me assist you more effectively.",
    "Your request requires more specific information for me to provide an appropriate response. Could you elaborate further?",
    "I'm afraid I cannot provide a satisfactory answer to that query. Would you like to try a different approach?"
  ],
  technical: [
    "Unable to process request with current parameters. Additional input required for successful query resolution.",
    "Query processing failed due to insufficient data. Please provide additional context or reformulate request.",
    "Response generation error: ambiguous input detected. Please specify request parameters more precisely.",
    "System unable to match input pattern to known response templates. Please restructure query with more specific parameters."
  ]
}