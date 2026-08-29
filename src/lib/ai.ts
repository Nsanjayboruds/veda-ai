import { GoogleGenAI } from "@google/genai";
import { Question, Answer, AnswerMapping, GradingResult } from "@/types/assessment";

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Ensure structured output schemas for Gemini 2.5 Pro
export async function extractQuestions(base64Images: string[]): Promise<Question[]> {
  const ai = getClient();
  const prompt = `
You are extracting questions from an examination paper.
Extract EVERY question. Preserve printed numbering exactly.
Treat labelled subparts such as 11(a) and 11(b) as separate questions. Do not merge subquestions.
Return questions in the exact printed order.

Provide the output as a JSON array of objects, where each object has:
- id: a unique string identifier (e.g. 'q-1', 'q-11-a')
- number: the exact printed string (e.g. '1', '11(a)')
- text: the text of the question
- order: integer representing its order of appearance
- marks: (optional) integer representing marks if visible
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        prompt,
        ...base64Images.map(img => ({
          inlineData: { mimeType: "image/jpeg", data: img }
        }))
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const json = JSON.parse(response.text || "[]");
    return json;
  } catch (e) {
    console.error("AI Error:", e);
    throw new Error("Failed to extract questions.");
  }
}

export async function extractAnswers(base64Images: string[]): Promise<Answer[]> {
  const ai = getClient();
  const prompt = `
You are analyzing a student's handwritten answer sheet.
Identify each answer. Detect the question number whenever possible.
Extract the answer text. Identify the page number (1-indexed based on the order of images provided).
Identify the exact visual region occupied by the answer. Answers can span multiple pages.

Provide the output as a JSON array of objects, where each object has:
- id: a unique string identifier
- questionNumber: the question number if detected, or null
- text: the extracted text of the answer
- regions: an array of objects containing { page (integer), x (0-1), y (0-1), width (0-1), height (0-1) } representing normalized coordinates for the bounding box.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        prompt,
        ...base64Images.map(img => ({
          inlineData: { mimeType: "image/jpeg", data: img }
        }))
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    const json = JSON.parse(response.text || "[]");
    return json;
  } catch (e) {
    console.error("AI Error:", e);
    throw new Error("Failed to extract answers.");
  }
}

export async function mapAnswersToQuestions(questions: Question[], answers: Answer[]): Promise<AnswerMapping[]> {
  const ai = getClient();
  const prompt = `
Map each extracted student answer to the most likely question.
Prefer exact question-number matches. Do not assume page order or answer order.
If there is insufficient evidence, mark the answer as unmatched (questionId: null).

Questions: ${JSON.stringify(questions)}
Answers: ${JSON.stringify(answers)}

Provide the output as a JSON array of objects, where each object has:
- questionId: string or null
- answerId: string
- confidence: number between 0 and 1
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [prompt],
      config: {
        responseMimeType: "application/json",
      }
    });

    const json = JSON.parse(response.text || "[]");
    return json;
  } catch (e) {
    console.error("AI Error:", e);
    throw new Error("Failed to map answers.");
  }
}

export async function gradeAnswer(question: Question, answer: Answer): Promise<GradingResult> {
  const ai = getClient();
  const maxScore = question.marks || 5;
  const prompt = `
Grade the following student answer.

Question: ${question.text}
Student Answer: ${answer.text}
Max possible score: ${maxScore}

Return a JSON object with:
- questionId: "${question.id}"
- score: assigned score (integer)
- maxScore: ${maxScore}
- status: "correct", "partially_correct", "incorrect", or "unanswered"
- feedback: brief feedback for the student
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [prompt],
      config: {
        responseMimeType: "application/json",
      }
    });

    const json = JSON.parse(response.text || "{}");
    return json as GradingResult;
  } catch (e) {
    console.error("AI Error:", e);
    throw new Error("Failed to grade answer.");
  }
}
