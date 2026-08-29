export type Question = {
  id: string;
  number: string;
  text: string;
  order: number;
  marks?: number;
};

export type AnswerRegion = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Answer = {
  id: string;
  questionNumber: string | null;
  text: string;
  regions: AnswerRegion[];
};

export type AnswerMapping = {
  questionId: string | null; // null if unmatched
  answerId: string;
  confidence: number;
};

export type GradingResult = {
  questionId: string;
  score: number;
  maxScore: number;
  status: "correct" | "partially_correct" | "incorrect" | "unanswered";
  feedback: string;
};

export type AssessmentDocument = {
  file: File;
  previewUrl: string; // Object URL for rendering
  pages: number;
};

export type AssessmentStatus = 
  | "idle" 
  | "uploading" 
  | "processing" 
  | "complete" 
  | "error";

export type AssessmentState = {
  id: string;
  questionPaper: AssessmentDocument | null;
  answerSheet: AssessmentDocument | null;
  questions: Question[];
  answers: Answer[];
  mappings: AnswerMapping[];
  grading: GradingResult[];
  status: AssessmentStatus;
  processingProgress: number;
  processingStage: string;
  selectedQuestionId: string | null;
};
