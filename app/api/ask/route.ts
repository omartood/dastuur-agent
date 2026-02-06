import { NextRequest, NextResponse } from "next/server";
import { generateAnswer } from "@/lib/gemini";
import { searchMemory, loadStore } from "@/lib/memvid";

// Ensure store is ready
// Store initialization happens on demand

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    console.log(`Processing question: ${question}`);

    // 1. Search relevant chunks in Memvid (using Memvid's internal embeddings)
    const hits = await searchMemory(question, undefined, 5);
    
    if (!hits || hits.length === 0) {
      return NextResponse.json({ 
        answer: "Waa kaxunahay su aasha aad naweydiiso, kuma jirto dastuurka fadlan nawedyii wax kusabsan dasturka federalka somalia mahadsanid",
        context: [] 
      });
    }

    // 3. Prepare context for Gemini
    const context = hits.map(hit => hit.snippet).join("\n\n---\n\n");
    console.log(`Found ${hits.length} relevant chunks for context.`);

    // 4. Generate answer via Gemini
    const answer = await generateAnswer(context, question);

    return NextResponse.json({
      answer: answer,
      context: hits.map(hit => hit.snippet)
    });

  } catch (error: any) {
    console.error("Error in /api/ask:", error);
    
    // Check for rate limits and return a user-friendly message
    if (error.status === 429 || error.message?.includes('429')) {
      return NextResponse.json({ 
        error: "Waa ku mahadsantahay isticmaalkaaga. Nasiib darro, hadda waxaa jira culays badan oo dhinaca adeegga AI ah. Fadlan sug dhowr ilbiriqsi ka dibna mar kale isku day." 
      }, { status: 429 });
    }

    return NextResponse.json({ 
      error: "Xaalad aan la filayn ayaa dhacday. Fadlan mar kale isku day." 
    }, { status: 500 });
  }
}
