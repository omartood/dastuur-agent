

import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

// In-memory caches to reduce API calls and avoid rate limits
const embeddingCache = new Map<string, number[]>();
const answerCache = new Map<string, string>();

function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

function getClient() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      // 429 is Too Many Requests, 500-599 are server errors
      const status = error?.status || error?.response?.status;
      const isRetryable = status === 429 || (status >= 500 && status <= 599) || error?.message?.includes("fetch failed");
      
      if (!isRetryable || i === maxRetries - 1) throw error;
      
      const delay = initialDelay * Math.pow(2, i);
      console.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms due to: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

export async function getEmbedding(text: string): Promise<number[]> {
  const normText = normalizeText(text);
  if (embeddingCache.has(normText)) {
    console.log("Cache hit for embedding:", normText.substring(0, 30) + "...");
    return embeddingCache.get(normText)!;
  }

  return withRetry(async () => {
    const client = getClient();
    const model = client.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    const values = result.embedding.values;
    embeddingCache.set(normText, values);
    return values;
  });
}

export async function generateAnswer(context: string, question: string) {
  const normKey = normalizeText(`${context}|${question}`);
  if (answerCache.has(normKey)) {
    console.log("Cache hit for answer:", question.substring(0, 30) + "...");
    return answerCache.get(normKey)!;
  }

  return withRetry(async () => {
    const client = getClient();
    const model = client.getGenerativeModel({ model: "gemini-flash-latest" });
    
    const prompt = `
You are a legal assistant for the Somali Federal Constitution.
Answer the user's question based ONLY on the following context.
If the answer is not in the context, say "Waa kaxunahay su aasha aad naweydiiso, kuma jirto dastuurka fadlan nawedyii wax kusabsan dasturka federalka somalia mahadsanid"
Do not hallucinate.

Context:
${context}

Question:
${question}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();
    answerCache.set(normKey, answer);
    return answer;
  });
}
