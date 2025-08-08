import { Flashcard, QuizQuestion } from '../types';

export function generateFlashcardsFromText(text: string): Flashcard[] {
  // Simple text processing to create flashcards
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  const flashcards: Flashcard[] = [];
  
  sentences.forEach((sentence, index) => {
    if (sentence.trim()) {
      const words = sentence.trim().split(' ');
      if (words.length > 5) {
        // Create question by removing key terms
        const keyTerms = words.filter(word => word.length > 6);
        if (keyTerms.length > 0) {
          const keyTerm = keyTerms[0];
          const question = sentence.replace(keyTerm, '____');
          
          flashcards.push({
            id: `card-${index}`,
            question: `What is: ${question.trim()}?`,
            answer: keyTerm,
          });
        }
      }
    }
  });
  
  // Add some concept-based questions
  const concepts = extractConcepts(text);
  concepts.forEach((concept, index) => {
    flashcards.push({
      id: `concept-${index}`,
      question: `Explain the concept of "${concept}"`,
      answer: `Based on the text: ${concept} is a key concept that appears in the context of the provided material.`,
    });
  });
  
  return flashcards.slice(0, 10); // Limit to 10 cards
}

export function generateQuizFromText(text: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  
  sentences.forEach((sentence, index) => {
    if (sentence.trim() && index < 5) {
      const words = sentence.trim().split(' ');
      const keyTerms = words.filter(word => word.length > 6);
      
      if (keyTerms.length > 0) {
        const keyTerm = keyTerms[0];
        const questionText = sentence.replace(keyTerm, '____');
        
        // Generate multiple choice question
        questions.push({
          id: `q-${index}`,
          type: 'mcq',
          question: `Complete the sentence: ${questionText}`,
          options: [keyTerm, 'Alternative A', 'Alternative B', 'Alternative C'],
          correctAnswer: 0,
          explanation: `The correct answer is "${keyTerm}" as found in the original text.`,
        });
      }
    }
  });
  
  // Add true/false questions
  const concepts = extractConcepts(text);
  concepts.slice(0, 2).forEach((concept, index) => {
    questions.push({
      id: `tf-${index}`,
      type: 'true-false',
      question: `The text discusses the concept of "${concept}".`,
      correctAnswer: 0, // True
      explanation: `This statement is true based on the content provided.`,
    });
  });
  
  return questions;
}

function extractConcepts(text: string): string[] {
  // Simple concept extraction - look for capitalized words and terms
  const words = text.match(/\b[A-Z][a-z]{4,}\b/g) || [];
  return [...new Set(words)].slice(0, 5);
}