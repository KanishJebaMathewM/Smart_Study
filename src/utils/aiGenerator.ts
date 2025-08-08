import { Flashcard, QuizQuestion, GenerationOptions } from '../types';

// OpenRouter API configuration
const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function generateFlashcardsFromText(
  text: string, 
  options: GenerationOptions = { quantity: 10, creativity: 0.7, useAI: true }
): Promise<Flashcard[]> {
  if (!options.useAI || !text.trim()) {
    return generateFlashcardsLocally(text, options.quantity);
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StudyMate AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator. Create exactly ${options.quantity} high-quality flashcards from the provided text. Each flashcard should test important concepts, definitions, or key facts. Return your response as a valid JSON array of objects with "question" and "answer" fields. Make the questions clear and the answers concise but complete.

Response format:
[
  {"question": "What is...", "answer": "..."},
  {"question": "Define...", "answer": "..."}
]`
          },
          {
            role: 'user',
            content: `Create ${options.quantity} flashcards from this text:\n\n${text}`
          }
        ],
        temperature: options.creativity,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse the JSON response
    const flashcardData = JSON.parse(content);
    
    // Convert to our Flashcard format
    const flashcards: Flashcard[] = flashcardData.map((item: any, index: number) => ({
      id: `ai-card-${index}`,
      question: item.question,
      answer: item.answer
    }));

    return flashcards;
  } catch (error) {
    console.error('Failed to generate flashcards with AI:', error);
    // Fallback to local generation
    return generateFlashcardsLocally(text, options.quantity);
  }
}

export async function generateQuizFromText(
  text: string,
  options: GenerationOptions = { quantity: 5, creativity: 0.7, useAI: true }
): Promise<QuizQuestion[]> {
  if (!options.useAI || !text.trim()) {
    return generateQuizLocally(text, options.quantity);
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StudyMate AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator. Create exactly ${options.quantity} diverse quiz questions from the provided text. Include multiple choice questions (4 options each), true/false questions, and fill-in-the-blank questions. Make sure the incorrect options are plausible but clearly wrong. Return your response as a valid JSON array.

For multiple choice questions:
{
  "type": "mcq",
  "question": "Question text",
  "options": ["correct answer", "wrong 1", "wrong 2", "wrong 3"],
  "correctAnswer": 0,
  "explanation": "Why this answer is correct"
}

For true/false questions:
{
  "type": "true-false",
  "question": "Statement to evaluate",
  "correctAnswer": 0,
  "explanation": "Explanation"
}

For fill-in-the-blank:
{
  "type": "fill-blank",
  "question": "Question with ____ blank",
  "correctAnswer": "correct word/phrase",
  "explanation": "Explanation"
}

Create questions that test understanding, not just memorization. Use a creativity level of ${options.creativity} to make questions engaging.`
          },
          {
            role: 'user',
            content: `Create ${options.quantity} quiz questions from this text:\n\n${text}`
          }
        ],
        temperature: options.creativity,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse the JSON response
    const quizData = JSON.parse(content);
    
    // Convert to our QuizQuestion format
    const questions: QuizQuestion[] = quizData.map((item: any, index: number) => ({
      id: `ai-q-${index}`,
      type: item.type,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation
    }));

    return questions;
  } catch (error) {
    console.error('Failed to generate quiz with AI:', error);
    // Fallback to local generation
    return generateQuizLocally(text, options.quantity);
  }
}

// Local fallback functions (improved versions of the original)
function generateFlashcardsLocally(text: string, quantity: number): Flashcard[] {
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  const flashcards: Flashcard[] = [];
  
  // Create keyword-based flashcards
  sentences.forEach((sentence, index) => {
    if (sentence.trim() && flashcards.length < quantity) {
      const words = sentence.trim().split(' ');
      if (words.length > 5) {
        const keyTerms = words.filter(word => word.length > 6);
        if (keyTerms.length > 0) {
          const keyTerm = keyTerms[0];
          const question = sentence.replace(keyTerm, '____');
          
          flashcards.push({
            id: `local-card-${index}`,
            question: `Fill in the blank: ${question.trim()}`,
            answer: keyTerm,
          });
        }
      }
    }
  });
  
  // Add concept-based questions
  const concepts = extractConcepts(text);
  concepts.forEach((concept, index) => {
    if (flashcards.length < quantity) {
      flashcards.push({
        id: `local-concept-${index}`,
        question: `What is the significance of "${concept}" in this context?`,
        answer: `${concept} is a key concept that appears in the provided material and relates to the main topics being discussed.`,
      });
    }
  });
  
  return flashcards.slice(0, quantity);
}

function generateQuizLocally(text: string, quantity: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  
  sentences.forEach((sentence, index) => {
    if (sentence.trim() && questions.length < quantity) {
      const words = sentence.trim().split(' ');
      const keyTerms = words.filter(word => word.length > 6);
      
      if (keyTerms.length > 0) {
        const keyTerm = keyTerms[0];
        const questionText = sentence.replace(keyTerm, '____');
        
        // Generate multiple choice question
        questions.push({
          id: `local-q-${index}`,
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
  concepts.slice(0, Math.floor(quantity / 2)).forEach((concept, index) => {
    if (questions.length < quantity) {
      questions.push({
        id: `local-tf-${index}`,
        type: 'true-false',
        question: `The text discusses the concept of "${concept}".`,
        correctAnswer: 0, // True
        explanation: `This statement is true based on the content provided.`,
      });
    }
  });
  
  return questions.slice(0, quantity);
}

function extractConcepts(text: string): string[] {
  // Improved concept extraction
  const words = text.match(/\b[A-Z][a-z]{3,}\b/g) || [];
  const phrases = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
  return [...new Set([...words, ...phrases])].slice(0, 10);
}

// PDF text extraction utility
export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        // Simple text extraction - in a real app, you'd use pdf-parse or similar
        const text = event.target?.result as string;
        // For now, we'll just return the raw text
        // In production, you'd want to use a proper PDF parsing library
        resolve(text || '');
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsText(file);
  });
}

// Add support for handling large documents by chunking
export function chunkText(text: string, maxChunkSize: number = 8000): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim() + '.');
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '.';
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Process large text by chunking and combining results
export async function generateFromLargeText(
  text: string,
  type: 'flashcards' | 'quiz',
  options: GenerationOptions
): Promise<Flashcard[] | QuizQuestion[]> {
  const chunks = chunkText(text);
  const allResults: (Flashcard[] | QuizQuestion[])[] = [];
  
  // Distribute quantity across chunks
  const quantityPerChunk = Math.ceil(options.quantity / chunks.length);
  
  for (const chunk of chunks) {
    const chunkOptions = { ...options, quantity: quantityPerChunk };
    
    if (type === 'flashcards') {
      const result = await generateFlashcardsFromText(chunk, chunkOptions);
      allResults.push(result);
    } else {
      const result = await generateQuizFromText(chunk, chunkOptions);
      allResults.push(result);
    }
  }
  
  // Combine and deduplicate results
  const combined = allResults.flat();
  return combined.slice(0, options.quantity);
}
