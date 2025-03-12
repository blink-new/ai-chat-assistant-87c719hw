import { toast } from 'react-hot-toast';

// This is a mock implementation of the API for demo purposes
// In a real app, you would use the actual API endpoint
export async function mockChatCompletion(messages: any[]) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 10% chance of error for demo purposes
  if (Math.random() < 0.1) {
    toast.error('API Error: Could not connect to AI service');
    throw new Error('Failed to connect to AI service');
  }
  
  const lastMessage = messages[messages.length - 1];
  
  // Simple response logic based on user input
  const userMessage = lastMessage.content.toLowerCase();
  
  let response = "I'm here to help! What would you like to know?";
  
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    response = "Hello! How can I assist you today?";
  } else if (userMessage.includes('help')) {
    response = "I'd be happy to help. What do you need assistance with?";
  } else if (userMessage.includes('thank')) {
    response = "You're welcome! Is there anything else you'd like to know?";
  } else if (userMessage.includes('weather')) {
    response = "I don't have access to real-time weather data, but I can help you find a weather service!";
  } else if (userMessage.includes('name')) {
    response = "I'm your AI assistant. You can call me Assistant!";
  } else if (userMessage.length < 5) {
    response = "Could you provide more details so I can better assist you?";
  } else {
    const responses = [
      "That's an interesting question. In my view, it depends on several factors.",
      "I understand what you're asking. Here's what I think about that...",
      "Based on my knowledge, I can tell you that this is a complex topic.",
      "I'd be happy to explore this topic with you. Let's start by considering the main aspects.",
      "Great question! I think the key point to consider is the context."
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }
  
  return { 
    id: Date.now().toString(),
    content: response,
    role: 'assistant'
  };
}