import 'dotenv/config';
import { getEmbedding } from '../lib/gemini.js';
import { search, loadStore } from '../lib/memvid.js';

async function testSearch() {
  console.log('Loading store...');
  loadStore();
  
  const question = "Qodobka 3aad maxuu kahadlayaa";
  console.log(`\nSearching for: "${question}"\n`);
  
  const embedding = await getEmbedding(question);
  console.log(`Generated embedding with ${embedding.length} dimensions\n`);
  
  const results = search(embedding, 5, question);
  
  console.log(`Found ${results.length} results:\n`);
  
  results.forEach((chunk, i) => {
    console.log(`--- Result ${i + 1} ---`);
    console.log(`ID: ${chunk.id}`);
    console.log(`Text preview: ${chunk.text.substring(0, 200)}...`);
    console.log('');
  });
}

testSearch().catch(console.error);
