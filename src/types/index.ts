export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  isKnown?: boolean;
  needsReview?: boolean;
}

export interface Quiz {
  id: string;
  name: string;
  timestamp: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  timestamp: number;
  flashcards: Flashcard[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
  answers: Record<string, any>;
}

export type GenerationType = 'flashcards' | 'quizzes' | 'both';

export interface GenerationOptions {
  quantity: number;
  creativity: number; // 0-1 scale for temperature
  useAI: boolean;
}

export interface StudyMaterialSource {
  type: 'text' | 'pdf';
  content: string;
  filename?: string;
}
