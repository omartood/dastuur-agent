import 'dotenv/config';
import { searchMemory, loadStore } from '../lib/memvid.js';

async function testSearch() {
  console.log('Loading store...');
  loadStore();
  
  const question = "Qodobka 3aad maxuu kahadlayaa";
  console.log(`\nSearching for: "${question}"\n`);
  
  const hits = await searchMemory(question, undefined, 5);
  
  console.log(`Found ${hits.length} results:\n`);
  
  hits.forEach((hit: any, i: number) => {
    console.log(`--- Result ${i + 1} ---`);
    console.log(`Frame ID: ${hit.frame_id || 'N/A'}`);
    console.log(`Score: ${hit.score?.toFixed(3) || 'N/A'}`);
    console.log(`Snippet: ${hit.snippet?.substring(0, 200) || 'N/A'}...`);
    console.log('');
  });
}

testSearch().catch(console.error);
