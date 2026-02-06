import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { storeChunk, initMemory } from '../lib/memvid';
import { getEmbedding } from '../lib/gemini';

const PDF_PATH = path.join(process.cwd(), 'pdf', 'Dastuurka_ku_meelgaarka_SOM_03092012-1_2.pdf');

async function main() {
  console.log("Reading PDF from:", PDF_PATH);
  if (!fs.existsSync(PDF_PATH)) {
    console.error("PDF not found!");
    process.exit(1);
  }

  // Pre-initialize memory to ensure settings are applied
  const memory = await initMemory();
  await memory.setVectorCompression(true);

  const dataBuffer = fs.readFileSync(PDF_PATH);
  
  // Parse PDF
  const parser = new PDFParse({ data: dataBuffer });
  const data = await parser.getText();
  
  const text = data.text;
  console.log(`Extracted ${text.length} characters.`);

  // Simple chunking by paragraph or double newline
  let chunks = text.split(/\n\s*\n/);
  chunks = chunks.filter((c: string) => c.trim().length > 50);

  console.log(`Split into ${chunks.length} chunks.`);

  // Store chunks using Gemini embeddings + Memvid storage
  console.log(`Starting storage process for ${chunks.length} chunks...`);
  
  let successCount = 0;
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i].trim();
    // console.log(`Processing chunk ${i + 1}/${chunks.length}...`); // Reduce noise
    process.stdout.write(`\rProcessing chunk ${i + 1}/${chunks.length}...`);
    
    try {
      // 1. Get embedding from Gemini
      const embedding = await getEmbedding(chunkText);
      
      // 2. Store in Memvid with manual embedding
      await storeChunk(chunkText, embedding, {
        index: i,
        source: 'Dastuurka_ku_meelgaarka_SOM_03092012-1_2.pdf',
        processedAt: new Date().toISOString()
      });
      
      successCount++;
      
      // Delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500)); 
    } catch (e) {
      console.error(`\nFailed to store chunk ${i}:`, e);
    }
  }

  console.log(`\nSuccessfully ingested ${successCount}/${chunks.length} chunks to constitution.mv2`);
}

main().catch(console.error);
