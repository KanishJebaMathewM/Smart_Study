import { FlashcardDeck, Quiz, QuizResult } from '../types';

const FLASHCARD_DECKS_KEY = 'flashcard_decks';
const QUIZZES_KEY = 'quizzes';
const QUIZ_RESULTS_KEY = 'quiz_results';

export const storageUtils = {
  // Flashcard Decks
  saveFlashcardDeck: (deck: FlashcardDeck): void => {
    const decks = storageUtils.getFlashcardDecks();
    const existingIndex = decks.findIndex(d => d.id === deck.id);
    
    if (existingIndex >= 0) {
      decks[existingIndex] = deck;
    } else {
      decks.push(deck);
    }
    
    localStorage.setItem(FLASHCARD_DECKS_KEY, JSON.stringify(decks));
  },

  getFlashcardDecks: (): FlashcardDeck[] => {
    const stored = localStorage.getItem(FLASHCARD_DECKS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getFlashcardDeck: (id: string): FlashcardDeck | null => {
    const decks = storageUtils.getFlashcardDecks();
    return decks.find(deck => deck.id === id) || null;
  },

  deleteFlashcardDeck: (id: string): void => {
    const decks = storageUtils.getFlashcardDecks();
    const filtered = decks.filter(deck => deck.id !== id);
    localStorage.setItem(FLASHCARD_DECKS_KEY, JSON.stringify(filtered));
  },

  // Quizzes
  saveQuiz: (quiz: Quiz): void => {
    const quizzes = storageUtils.getQuizzes();
    const existingIndex = quizzes.findIndex(q => q.id === quiz.id);
    
    if (existingIndex >= 0) {
      quizzes[existingIndex] = quiz;
    } else {
      quizzes.push(quiz);
    }
    
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
  },

  getQuizzes: (): Quiz[] => {
    const stored = localStorage.getItem(QUIZZES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getQuiz: (id: string): Quiz | null => {
    const quizzes = storageUtils.getQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  },

  deleteQuiz: (id: string): void => {
    const quizzes = storageUtils.getQuizzes();
    const filtered = quizzes.filter(quiz => quiz.id !== id);
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(filtered));
  },

  // Quiz Results
  saveQuizResult: (result: QuizResult): void => {
    const results = storageUtils.getQuizResults();
    results.push(result);
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
  },

  getQuizResults: (): QuizResult[] => {
    const stored = localStorage.getItem(QUIZ_RESULTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },
};