import { NextRequest, NextResponse } from "next/server";
import { getEmbedding, generateAnswer } from "@/lib/gemini";
import { search, loadStore } from "@/lib/memvid";

// Ensure store is loaded (this might run on every serverless invocation, 
// so caching usually happens at module scope, which works for long-running nodes 
// but might re-load for lambdas. For simple usage, it's fine).
loadStore();

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    console.log(`Processing question: ${question}`);

    // 1. Generate embedding for question
    const embedding = await getEmbedding(question);

    // 2. Search relevant chunks
    const chunks = search(embedding, 5, question); // top 5 with hybrid search
    console.log(`Found ${chunks.length} relevant chunks`);

    if (chunks.length === 0) {
      return NextResponse.json({ 
        answer: "I cannot find any relevant information in the constitution regarding your question.",
        context: [] 
      });
    }

    // 3. Construct context
    const context = chunks.map(c => c.text).join("\n\n---\n\n");

    // 4. Generate answer
    const answer = await generateAnswer(context, question);

    return NextResponse.json({
      answer,
      context: chunks.map(c => c.text) // Optional: return sources
    });

  } catch (error: any) {
    console.error("Error in /api/ask:", error);
    
    // Check for specific API error status codes
    const status = error?.status || error?.response?.status || 500;
    const message = status === 429 
      ? "Rate limit reached. Please wait a moment before trying again." 
      : "Internal Server Error";

    return NextResponse.json({ error: message }, { status });
  }
}
