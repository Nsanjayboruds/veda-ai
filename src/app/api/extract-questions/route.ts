import { NextResponse } from "next/server";
import { extractQuestions } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { images } = await request.json();
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Missing images" }, { status: 400 });
    }

    const questions = await extractQuestions(images);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("API Error (extract-questions):", error);
    return NextResponse.json({ error: "Failed to extract questions" }, { status: 500 });
  }
}
