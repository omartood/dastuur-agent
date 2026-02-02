

import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "text-embedding-004" });
  try {
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function generateAnswer(context: string, question: string) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-flash-latest" });
  
  const prompt = `
You are a legal assistant for the Somali Federal Constitution.
Answer the user's question based ONLY on the following context.
If the answer is not in the context, say "I cannot find the answer in the constitution."
Do not hallucinate.

Context:
${context}

Question:
${question}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
