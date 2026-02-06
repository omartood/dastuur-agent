
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

let genAI: GoogleGenerativeAI | null = null;

const CACHE_PATH = path.join(process.cwd(), 'data', 'api_cache.json');

// In-memory caches to reduce API calls and avoid rate limits
let embeddingCache = new Map<string, number[]>();
let answerCache = new Map<string, string>();
let cacheLoaded = false;

function loadCache() {
  if (cacheLoaded) return;
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const data = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
      embeddingCache = new Map(Object.entries(data.embeddings || {}));
      answerCache = new Map(Object.entries(data.answers || {}));
      console.log(`Loaded cache: ${embeddingCache.size} embeddings, ${answerCache.size} answers.`);
    }
  } catch (err) {
    console.error("Error loading cache:", err);
  }
  cacheLoaded = true;
}

function saveCache() {
  try {
    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const data = {
      embeddings: Object.fromEntries(embeddingCache),
      answers: Object.fromEntries(answerCache)
    };
    fs.writeFileSync(CACHE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving cache:", err);
  }
}

function getClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (error.status === 429 || error.message?.includes('429')) {
        const waitTime = delay * Math.pow(2, i) + Math.random() * 1000;
        console.warn(`Rate limited (429). Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function getEmbedding(text: string): Promise<number[]> {
  loadCache();
  const normText = normalizeText(text);
  if (embeddingCache.has(normText)) {
    return embeddingCache.get(normText)!;
  }

  return withRetry(async () => {
    const client = getClient();
    const model = client.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    const values = result.embedding.values;
    embeddingCache.set(normText, values);
    saveCache();
    return values;
  });
}

export async function generateAnswer(context: string, question: string) {
  loadCache();
  const normKey = normalizeText(`${context}|${question}`);
  if (answerCache.has(normKey)) {
    console.log("Cache hit for answer");
    return answerCache.get(normKey)!;
  }

  return withRetry(async () => {
    const client = getClient();
    const model = client.getGenerativeModel({ 
      model: "gemini-2.0-flash", // Stable fast model
      generationConfig: {
        temperature: 0.1, // Lower temperature for more grounded answers
      }
    });

    const prompt = `
Waxaad tahay khabiir ku takhasusay Dastuurka Federaalka ee Soomaaliya. 
Hoos waxaa ku qoran qaybo ka mid ah Dastuurka oo laga soo saaray xogta rasmiga ah:

XOGTA DASTUURKA:
${context}

SU'AASHA:
${question}

ADIGOO ISTICMAALAYA KALIYA XOGTA KOR KU QORAN, fadlan uga jawaab su'aasha si kooban oo cad adigoo isticmaalaya luuqadda Soomaaliga. 
Haddii jawaabta aysan ku jirin xogta kor ku qoran, waxaad ku jawaabtaa: "Waa kaxunahay su aasha aad naweydiiso, kuma jirto dastuurka fadlan nawedyii wax kusabsan dasturka federalka somalia mahadsanid".
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    answerCache.set(normKey, text);
    saveCache();
    return text;
  });
}
