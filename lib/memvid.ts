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
  
  // Special boost for article number queries (e.g., "Qodobka 3aad")
  // Extract article number from query
  const articleMatch = query.match(/qodobka\s+(\d+)(?:aad|naad|saad|aad)/i);
  if (articleMatch) {
    const articleNum = articleMatch[1];
    // Check if the text contains this specific article with actual content (not just TOC)
    const articlePattern = new RegExp(`qodobka\\s+${articleNum}(?:aad|naad|saad)\\s*\\.\\s*\\w+`, 'i');
    if (articlePattern.test(text)) {
      // Strong boost if we find the actual article header with content
      hits += 5;
    }
  }
  
  return hits / (qTerms.length + 1); // +1 to account for potential article boost
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
       // Weighting: 60% vector, 40% keyword for better article matching
       score = (cosine * 0.6) + (kwScore * 0.4);
    }
    
    return { chunk, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(s => s.chunk);
}
