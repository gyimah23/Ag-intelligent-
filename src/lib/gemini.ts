import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(`
      You are an expert electrical engineer assistant. Your role is to provide accurate, 
      helpful, and safe information about electrical systems, components, and best practices. 
      
      When answering questions:
      1. Always prioritize safety
      2. Provide technical details when relevant
      3. Include warnings about potential hazards
      4. Recommend consulting licensed professionals for complex issues
      
      Question: ${prompt}
    `);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    throw error;
  }
}