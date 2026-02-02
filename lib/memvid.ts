import fs from 'fs';
import path from 'path';

export interface Chunk {
  id: string;
  text: string;
  embedding: number[];
  metadata?: any;
}

// Simple in-memory store
let store: Chunk[] = [];
let isLoaded = false;

const DATA_PATH = path.join(process.cwd(), 'data', 'embeddings.json');

export function loadStore() {
  if (isLoaded) return;
  
  if (fs.existsSync(DATA_PATH)) {
    console.log("Loading embeddings from disk...");
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    store = JSON.parse(raw);
    isLoaded = true;
    console.log(`Loaded ${store.length} chunks.`);
  } else {
    console.warn("No embeddings file found at " + DATA_PATH);
  }
}

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Basic token-based scoring to boost exact matches (Hybrid Search Lite)
function keywordScore(query: string, text: string): number {
  // Split by space, remove punctuation, filter short words
  const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '');
  const qTerms = normalize(query).split(/\s+/).filter(t => t.length > 3);
  
  if (qTerms.length === 0) return 0;
  
  const textLower = normalize(text);
  let hits = 0;
  for (const term of qTerms) {
    if (textLower.includes(term)) {
      hits++;
    }
  }
  return hits / qTerms.length;
}

export function search(queryEmbedding: number[], topK: number = 5, queryText: string = ""): Chunk[] {
  if (!isLoaded) loadStore();

  const scored = store.map(chunk => {
    const cosine = cosineSimilarity(queryEmbedding, chunk.embedding);
    let score = cosine;
    
    // Boost if keywords match (weighted mix)
    // If queryText is provided, mix in keyword score
    if (queryText) {
       const kwScore = keywordScore(queryText, chunk.text);
       // Weighting: 70% vector, 30% keyword. 
       // Adjust as needed. If vector is ~0.6 and keyword is 1.0 => 0.42 + 0.3 = 0.72.
       score = (cosine * 0.7) + (kwScore * 0.3);
       
       // Strong boost for specific structural headers (Qodobka/Cutubka)
       if (/qodobka|cutubka/i.test(queryText)) {
          // If query mentions specialized headers, and chunk has them as headers (start of line or similar), boost more
          // This is a heuristic.
       }
    }
    
    return { chunk, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(s => s.chunk);
}
