// Simulated chat API without OpenAI dependency
// In a real application, you would use the OpenAI SDK

// This would normally be in an environment variable
const apiKey = 'dummy-key'; // Replace with actual key in production

// This function would normally be in an API route
export async function chat(messages: any[]) {
  try {
    // In a real implementation, this would call the OpenAI API
    // For our demo, we'll simulate the response
    
    // Extract the last user message
    const lastUserMessage = messages
      .filter(message => message.role === 'user')
      .pop()?.content || '';
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate a response based on the user's message
    const input = lastUserMessage.toLowerCase();
    let response = '';
    
    // Pattern matching for different types of queries
    if (/^(hi|hello|hey|greetings|howdy)( there)?(!|\.|)?$/i.test(input)) {
      response = "Hello! How can I assist you today? Feel free to ask me anything.";
    } else if (input.includes('who are you') || input.includes('what are you') || 
        input.includes('your name')) {
      response = "I'm an AI assistant built with the Vercel AI SDK. I'm designed to help answer questions and provide information on a wide range of topics.";
    } else if (input.includes('vercel') || input.includes('sdk') || input.includes('ai sdk')) {
      response = "The Vercel AI SDK is a powerful toolkit for building AI-powered applications. It provides seamless integration with various AI models and offers features like streaming responses, type safety with TypeScript, and easy deployment on Vercel's platform.";
    } else if (input.includes('typescript')) {
      response = "TypeScript is a strongly typed programming language that builds on JavaScript. The Vercel AI SDK provides excellent TypeScript support with full type definitions, making it easier to build type-safe AI applications.";
    } else if (input.includes('openai') || input.includes('gpt')) {
      response = "OpenAI provides powerful language models like GPT-3.5 and GPT-4. The Vercel AI SDK makes it easy to integrate these models into your applications with features like streaming responses and proper error handling.";
    } else if (input.length < 5) {
      response = "I notice your message is quite brief. Could you provide more details about what you'd like to know?";
    } else {
      // Default thoughtful response
      const responses = [
        "That's an interesting question. The Vercel AI SDK provides tools to help developers build AI-powered applications more easily. It handles streaming responses, provides TypeScript integration, and works with various AI models. What specific aspect would you like to know more about?",
        "Great question! When working with AI in web applications, the Vercel AI SDK simplifies many common tasks. It provides React hooks for chat interfaces, handles streaming responses efficiently, and offers TypeScript support for type safety. Is there a particular feature you're interested in?",
        "I'd be happy to help with that. The Vercel AI SDK is designed to make AI integration seamless in web applications. It works with models from OpenAI, Anthropic, and others, while providing a consistent API. Would you like me to explain any specific functionality in more detail?"
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    // In a real implementation, we would return a proper stream
    // For our demo, we'll simulate streaming by returning the response
    return response;
  } catch (error) {
    console.error('Error in chat function:', error);
    throw error;
  }
}