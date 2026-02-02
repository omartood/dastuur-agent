import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY missing");
    return;
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // We can't list models directly via the high-level SDK easily in some versions, 
  // but let's try via the model manager if available or just a simple fetch if SDK allows.
  // Actually, the SDK doesn't expose listModels in the main class in some versions, 
  // but looking at source or docs: requires `genAI.getGenerativeModel`... wait.
  // There is `genAI.makeRequest` or similar.
  // Let's use `genAI` manager? No, usually it's not exposed on `GoogleGenerativeAI` instance directly?
  // Docs say: `const model = genAI.getGenerativeModel...`.
  // Wait, the error message said "Call ListModels".
  
  // Let's try to just test "gemini-1.5-flash-001" or "gemini-pro" in a simple generation call.
  // That's faster than figuring out how to call ListModels with the typed SDK if it's not obvious.
  
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-flash-8b",
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  for (const m of modelsToTry) {
    console.log(`Trying model: ${m}...`);
    try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`SUCCESS with ${m}:`, response.text());
        return; // found one
    } catch (e: any) {
        console.log(`FAILED ${m}: ${e.message.split('\n')[0]}`);
    }
  }
}

main();
