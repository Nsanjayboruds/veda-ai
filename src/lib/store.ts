import { create } from 'zustand';
import { AssessmentState, AssessmentDocument, Question, Answer, AnswerMapping, GradingResult, AssessmentStatus } from '@/types/assessment';

interface AssessmentStore extends AssessmentState {
  setQuestionPaper: (doc: AssessmentDocument | null) => void;
  setAnswerSheet: (doc: AssessmentDocument | null) => void;
  setStatus: (status: AssessmentStatus) => void;
  setProcessingProgress: (progress: number, stage: string) => void;
  setAssessmentData: (
    questions: Question[],
    answers: Answer[],
    mappings: AnswerMapping[],
    grading?: GradingResult[]
  ) => void;
  setSelectedQuestionId: (id: string | null) => void;
  reset: () => void;
  loadDemoData: () => Promise<void>;
}

const initialState: AssessmentState = {
  id: '',
  questionPaper: null,
  answerSheet: null,
  questions: [],
  answers: [],
  mappings: [],
  grading: [],
  status: 'idle',
  processingProgress: 0,
  processingStage: '',
  selectedQuestionId: null,
};

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  ...initialState,
  
  setQuestionPaper: (doc) => set({ questionPaper: doc }),
  setAnswerSheet: (doc) => set({ answerSheet: doc }),
  setStatus: (status) => set({ status }),
  setProcessingProgress: (progress, stage) => set({ processingProgress: progress, processingStage: stage }),
  
  setAssessmentData: (questions, answers, mappings, grading = []) => 
    set({ questions, answers, mappings, grading, status: 'complete', processingProgress: 100, processingStage: 'Complete' }),
    
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
  
  reset: () => set({ ...initialState, id: crypto.randomUUID() }),
  
  loadDemoData: async () => {
    // Generate mock demo data tailored to the uploaded "Distributed Computing" PDF
    const demoQuestions: Question[] = [
      { id: 'q1', number: '1', text: 'What is Distributed System? What are the main characteristics of distributed system?', order: 1, marks: 5 },
      { id: 'q2', number: '2', text: 'Explain different issues and goals related to design of distributed system.', order: 2, marks: 5 },
      { id: 'q3', number: '3', text: 'Explain fundamentals models of distributed system.', order: 3, marks: 5 },
      { id: 'q4', number: '4', text: 'Explain any 5 applications of distributed computing system.', order: 4, marks: 5 },
      { id: 'q5', number: '5', text: 'Distinguish between Inter Process Communication and Inter Node Communication with example.', order: 5, marks: 5 },
    ];
    
    const demoAnswers: Answer[] = [
      { 
        id: 'a1', 
        questionNumber: '1', 
        text: 'A distributed system is a collection of independent computers connected through a network that work together and appear to users as a single coherent system. The machines may be located in the same building, different cities, or countries. It has resource sharing, concurrency, lack of global clock, independent failures, message passing, and scalability.', 
        regions: [{ page: 1, x: 0.08, y: 0.55, width: 0.84, height: 0.4 }] 
      },
      { 
        id: 'a2', 
        questionNumber: '2', 
        text: 'Designing a distributed system is more difficult than a single machine system. Major design goals: Resource Sharing (hardware, software, data), Transparency (hide unnecessary details of distribution from user), Openness (well-defined interfaces), Scalability (continue to work efficiently as users increase), Reliability (provide service consistently).', 
        regions: [{ page: 2, x: 0.08, y: 0.48, width: 0.84, height: 0.48 }]
      },
      { 
        id: 'a3', 
        questionNumber: '3', 
        text: 'Fundamental models include architectural models and fundamental models...', 
        regions: [{ page: 3, x: 0.08, y: 0.1, width: 0.84, height: 0.4 }] 
      },
      { 
        id: 'a4', 
        questionNumber: '4', 
        text: 'Applications include cloud computing, finance, multiplayer games...', 
        regions: [{ page: 4, x: 0.08, y: 0.1, width: 0.84, height: 0.4 }] 
      },
      { 
        id: 'a99', 
        questionNumber: '99', 
        text: 'Stray scribbles or unmatched answer text on page 3.', 
        regions: [{ page: 5, x: 0.1, y: 0.5, width: 0.8, height: 0.1 }] 
      },
    ];
    
    const demoMappings: AnswerMapping[] = [
      { questionId: 'q1', answerId: 'a1', confidence: 0.99 },
      { questionId: 'q2', answerId: 'a2', confidence: 0.95 },
      { questionId: 'q3', answerId: 'a3', confidence: 0.98 },
      { questionId: 'q4', answerId: 'a4', confidence: 0.90 },
      // q5 is intentionally unmapped to show "Not Attempted"
      // a99 is intentionally unmapped to show "Unmatched Extra Answer"
      { questionId: null, answerId: 'a99', confidence: 0.85 },
    ];
    
    set({ processingStage: 'Generating AI Feedback...', processingProgress: 90 });

    const realGrading: GradingResult[] = [];
    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";

    for (const mapping of demoMappings) {
      if (!mapping.questionId) continue;
      const q = demoQuestions.find(x => x.id === mapping.questionId);
      const a = demoAnswers.find(x => x.id === mapping.answerId);
      if (!q || !a) continue;

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              {
                role: "system",
                content: "You are an expert teacher grading a student's answer. Output your evaluation STRICTLY as a JSON object with three fields: 'score' (integer out of max marks), 'status' (string: 'correct', 'partially_correct', or 'incorrect'), and 'feedback' (a 1-2 sentence explanation of why this grade was given). Do not include markdown formatting or any other text."
              },
              {
                role: "user",
                content: `Question: ${q.text}\nMax Marks: ${q.marks}\nStudent Answer: ${a.text}`
              }
            ],
            response_format: { type: "json_object" }
          })
        });

        const data = await response.json();
        
        if (!response.ok || !data.choices) {
          throw new Error(data.error?.message || "Invalid response from API");
        }

        const result = JSON.parse(data.choices[0].message.content);
        
        realGrading.push({
          questionId: q.id,
          score: result.score,
          maxScore: q.marks,
          status: result.status,
          feedback: result.feedback
        });
      } catch (err) {
        console.error("Groq API error", err);
        realGrading.push({
          questionId: q.id,
          score: 0,
          maxScore: q.marks,
          status: 'incorrect',
          feedback: 'Failed to generate AI feedback due to an API error.'
        });
      }
    }
    
    set({
      id: 'demo-123',
      status: 'complete',
      questions: demoQuestions,
      answers: demoAnswers,
      mappings: demoMappings,
      grading: realGrading,
      selectedQuestionId: 'q1',
    });
  }
}));
