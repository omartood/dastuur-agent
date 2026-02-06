import dotenv from 'dotenv';
dotenv.config();

import { searchMemory, loadStore } from "../lib/memvid";
import { getEmbedding, generateAnswer } from "../lib/gemini";

async function main() {
  console.log("=== Debugging Split RAG (Memvid + Gemini) ===");
  console.log("CWD:", process.cwd());
  
  try {
    console.log("1. Initializing Stores...");
    loadStore();
    
    const question = process.argv[2] || "cutub-ka koowad maxuu kahadlayaa";
    console.log(`2. Question: "${question}"`);

    console.log("3. (Skipping Embedding to avoid dimension mismatch)...");
    // const embedding = await getEmbedding(question);

    console.log("4. Searching Memvid Memory (Lexical)...");
    const hits = await searchMemory(question, undefined, 5);
    
    if (!hits || hits.length === 0) {
      console.log("No relevant chunks found in memory.");
      return;
    }

    console.log(`Found ${hits.length} relevant chunks.`);
    const context = hits.map(hit => hit.snippet).join("\n\n---\n\n");

    console.log("5. Generating Answer via Gemini...");
    const answer = await generateAnswer(context, question);
    
    console.log("\n=== FINAL RESPONSE ===");
    console.log("Answer:", answer);
    console.log("\nSources Used:");
    hits.forEach((s: any, i: number) => {
      console.log(`[${i + 1}] Score: ${s.score?.toFixed(3)} | Snippet: ${s.snippet.substring(0, 100)}...`);
    });
    console.log("========================\n");

  } catch (e) {
    console.error("!!! CRITICAL ERROR !!!");
    console.error(e);
  }
}

main();
