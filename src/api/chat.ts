import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client
// Note: In a real app, you would use environment variables for the API key
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // Replace with your actual API key or use environment variables
});

export async function generateChatResponse(messages: any[]) {
  try {
    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: messages.map((message) => ({
        role: message.isUser ? 'user' : 'assistant',
        content: message.content,
      })),
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}