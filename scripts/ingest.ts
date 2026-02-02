import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const pdf = require('pdf-parse');
import { PDFParse } from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

import { getEmbedding } from '../lib/gemini';

// Or assume user runs with `export GEMINI_API_KEY=... ts-node scripts/ingest.ts`
// Better to just try reading process.env if available or error out.

const PDF_PATH = path.join(process.cwd(), 'pdf', 'Dastuurka_ku_meelgaarka_SOM_03092012-1_2.pdf');
const OUT_PATH = path.join(process.cwd(), 'data', 'embeddings.json');

// Ensure data dir exists
if (!fs.existsSync(path.dirname(OUT_PATH))) {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
}

async function main() {
  console.log("Reading PDF from:", PDF_PATH);
  if (!fs.existsSync(PDF_PATH)) {
    console.error("PDF not found!");
    process.exit(1);
  }

  const dataBuffer = fs.readFileSync(PDF_PATH);
  
  // New API usage
  const parser = new PDFParse({ data: dataBuffer });
  const data = await parser.getText();
  
  const text = data.text;
  console.log(`Extracted ${text.length} characters.`);

  // Simple chunking by paragraph or double newline
  // For a constitution, articles are often separated by clear headings or whitespace.
  // We'll use a pragmatic approach: split by double newlines, then merge small chunks.
  
  let chunks = text.split(/\n\s*\n/);
  chunks = chunks.filter((c: string) => c.trim().length > 50); // Remove noise

  console.log(`Split into ${chunks.length} chunks.`);

  const embeddedChunks = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i].trim();
    console.log(`Embedding chunk ${i + 1}/${chunks.length}...`);
    try {
      const embedding = await getEmbedding(chunkText);
      embeddedChunks.push({
        id: uuidv4(),
        text: chunkText,
        embedding
      });
      // Rate limiting precaution
      await new Promise(resolve => setTimeout(resolve, 200)); 
    } catch (e) {
      console.error(`Failed to embed chunk ${i}`, e);
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(embeddedChunks, null, 2));
  console.log(`Saved ${embeddedChunks.length} embeddings to ${OUT_PATH}`);
}

main().catch(console.error);
