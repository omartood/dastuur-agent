import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("No key");
    return;
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  console.log("Fetching models list...");
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach((m: any) => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
           console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("No models found or error:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}

main();
