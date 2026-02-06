import { create, open, configure, type Memvid, type FindResult, type AskResult } from '@memvid/sdk';
import path from 'path';
import fs from 'fs';

const MEMORY_PATH = path.join(process.cwd(), 'data', 'constitution.mv2');

let memoryInstance: Memvid | null = null;

/**
 * Initialize or open the Memvid memory file
 */
export async function initMemory(): Promise<Memvid> {
  if (memoryInstance) return memoryInstance;

  // Configure global defaults
  configure({
    apiKey: process.env.MEMVID_API_KEY,
    defaultEmbeddingProvider: 'memvid',
  });

  try {
    // Check if memory file exists
    if (fs.existsSync(MEMORY_PATH)) {
      console.log('Opening existing memory file:', MEMORY_PATH);
      memoryInstance = await open(MEMORY_PATH);
    } else {
      console.log('Creating new memory file:', MEMORY_PATH);
      // Ensure data directory exists
      const dir = path.dirname(MEMORY_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      memoryInstance = await create(MEMORY_PATH);
      // Enable vector search features on new create
      await memoryInstance.setVectorCompression(true);
      await memoryInstance.enableLex();
    }
    
    // Always ensure lexical search is enabled for the session
    try {
      await memoryInstance.enableLex();
    } catch (e) {
      console.log('Lexical search already enabled or not needed');
    }
    
    if (!memoryInstance) {
        throw new Error("Failed to initialize Memvid instance");
    }
    return memoryInstance;
  } catch (error) {
    console.error('Error initializing memory:', error);
    throw error;
  }
}

/**
 * Store a document chunk in memory with manual embedding from Gemini
 */
export async function storeChunk(text: string, embedding?: number[], metadata?: Record<string, any>) {
  const memory = await initMemory();
  
  try {
    const frameId = await memory.put({
      text,
      metadata: metadata || {},
      embedding, // Manual embedding from Gemini
      enableEmbedding: false, // Disable auto-embedding to avoid API key errors
    });
    console.log('Stored chunk with frame ID:', frameId, '-', text.substring(0, 50) + '...');
    return frameId;
  } catch (error) {
    console.error('Error storing chunk:', error);
    throw error;
  }
}

/**
 * Extract key search terms from Somali questions
 */
function extractSearchTerms(query: string): string {
  // Extract patterns like "qodobka Xaad" (article X) from questions
  const articleMatch = query.match(/qodobka\s+(\d+)(?:aad)?/i);
  if (articleMatch) {
    return `qodobka ${articleMatch[1]}aad`;
  }
  
  // Remove common question words in Somali
  const stopWords = ['maxuu', 'maxay', 'maxaan', 'ka', 'hadlayaa', 'hadlayaan', 'yihiin', 'waa', 'yahay', 'tahay'];
  const words = query.toLowerCase().replace(/[?!.,]/g, '').split(/\s+/);
  const filtered = words.filter(w => !stopWords.includes(w) && w.length > 2);
  
  return filtered.slice(0, 3).join(' ') || query;
}

/**
 * Search integration for low-level access
 */
export async function searchMemory(query: string, queryEmbedding?: number[], limit: number = 5) {
  const memory = await initMemory();
  try {
    // For lexical search, extract key terms from the query
    const searchQuery = queryEmbedding ? query : extractSearchTerms(query);
    console.log('Search query:', searchQuery, '(original:', query, ')');
    
    const results = await memory.find(searchQuery, {
      k: limit,
      mode: queryEmbedding ? 'auto' : 'lex',  // Use lexical search if no custom embedding
      queryEmbedding: queryEmbedding,
    }) as FindResult;
    return results.hits || [];
  } catch (error) {
    console.error('Error searching memory:', error);
    throw error;
  }
}

/**
 * Legacy compatibility: Load store
 */
export function loadStore() {
  console.log('loadStore called');
}

export async function search(queryEmbedding: number[], topK: number = 5, queryText: string = "") {
  const hits = await searchMemory(queryText, queryEmbedding, topK);
  return hits.map((hit: any) => ({
    id: hit.frame_id?.toString() || hit.uri || '',
    text: hit.snippet || '',
    embedding: [], 
    metadata: {},
  }));
}
