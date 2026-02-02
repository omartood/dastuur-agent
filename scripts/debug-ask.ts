import dotenv from 'dotenv';
dotenv.config();

import { getEmbedding, generateAnswer } from "@/lib/gemini";
import { search, loadStore } from "@/lib/memvid";
import path from "path";

async function main() {
  console.log("=== Debugging API Logic ===");
  console.log("CWD:", process.cwd());
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing from env");
    return;
  }
  console.log("API Key present (length):", process.env.GEMINI_API_KEY.length);

  try {
    console.log("1. Loading Store...");
    loadStore();
    
    const question = "cutub-ka koowad maxuu kahadlayaa";
    console.log(`2. Question: "${question}"`);

    console.log("3. Generating Embedding...");
    const embedding = await getEmbedding(question);
    console.log("   Embedding generated. Length:", embedding.length);

    console.log("4. Searching Memvid...");
    const chunks = search(embedding, 5);
    console.log(`   Found ${chunks.length} chunks.`);
    if (chunks.length > 0) {
      console.log("   Top chunk text preview:", chunks[0].text.substring(0, 100));
    } else {
      console.warn("   WARNING: No chunks found. This implies dot product failed or store empty.");
    }

    if (chunks.length === 0) {
        console.log("Skipping generation as no chunks found.");
        return;
    }

    console.log("5. Generating Answer...");
    const context = chunks.map(c => c.text).join("\n\n---\n\n");
    const answer = await generateAnswer(context, question);
    
    console.log("\n=== ANSWER ===");
    console.log(answer);
    console.log("==============");

  } catch (e) {
    console.error("!!! CRITICAL ERROR !!!");
    console.error(e);
  }
}

main();
