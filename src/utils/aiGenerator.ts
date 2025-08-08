import { Flashcard, QuizQuestion, GenerationOptions } from '../types';

// OpenRouter API configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function generateFlashcardsFromText(
  text: string, 
  options: GenerationOptions = { quantity: 10, creativity: 0.7, useAI: true }
): Promise<Flashcard[]> {
  if (!options.useAI || !text.trim()) {
    return generateFlashcardsLocally(text, options.quantity);
  }

  try {
    // Limit text length to prevent token issues
    const maxTextLength = 6000;
    const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) + '...' : text;

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StudyMate AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',  // Using cheaper model
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator. Create exactly ${options.quantity} high-quality flashcards from the provided text. Each flashcard should test important concepts, definitions, or key facts. Return your response as a valid JSON array of objects with "question" and "answer" fields. Make the questions clear and the answers concise but complete. Focus on the most important information.

Response format:
[
  {"question": "What is...", "answer": "..."},
  {"question": "Define...", "answer": "..."}
]

IMPORTANT: Respond ONLY with the JSON array, no additional text.`
          },
          {
            role: 'user',
            content: `Create ${options.quantity} flashcards from this text:\n\n${truncatedText}`
          }
        ],
        temperature: options.creativity,
        max_tokens: 1500  // Reduced to fit within credit limits
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // Clean up the response to extract JSON
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const flashcardData = JSON.parse(jsonContent);
    
    // Convert to our Flashcard format
    const flashcards: Flashcard[] = flashcardData.map((item: any, index: number) => ({
      id: `ai-card-${index}`,
      question: item.question,
      answer: item.answer
    }));

    return flashcards.slice(0, options.quantity);
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
    // Limit text length to prevent token issues
    const maxTextLength = 6000;
    const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) + '...' : text;

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StudyMate AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',  // Using cheaper model
        messages: [
          {
            role: 'system',
            content: `You are an expert educational content creator. Create exactly ${options.quantity} diverse quiz questions from the provided text. Create a mix of multiple choice questions (4 options each), true/false questions, and fill-in-the-blank questions. For multiple choice questions, make sure ALL incorrect options are plausible but clearly wrong and related to the content. The incorrect options should be realistic alternatives that someone might confuse with the correct answer.

For multiple choice questions:
{
  "type": "mcq",
  "question": "Question text",
  "options": ["correct answer", "related wrong option", "plausible alternative", "another realistic distractor"],
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

Create questions that test understanding. Make distractors relevant to the content. Use creativity level ${options.creativity}.

IMPORTANT: Respond ONLY with a JSON array, no additional text.`
          },
          {
            role: 'user',
            content: `Create ${options.quantity} quiz questions from this text:\n\n${truncatedText}`
          }
        ],
        temperature: options.creativity,
        max_tokens: 1500  // Reduced to fit within credit limits
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in API response');
    }

    // Clean up the response to extract JSON
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const quizData = JSON.parse(jsonContent);
    
    // Convert to our QuizQuestion format
    const questions: QuizQuestion[] = quizData.map((item: any, index: number) => ({
      id: `ai-q-${index}`,
      type: item.type,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation
    }));

    return questions.slice(0, options.quantity);
  } catch (error) {
    console.error('Failed to generate quiz with AI:', error);
    // Fallback to local generation
    return generateQuizLocally(text, options.quantity);
  }
}

// Improved local fallback functions
function generateFlashcardsLocally(text: string, quantity: number): Flashcard[] {
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  const flashcards: Flashcard[] = [];
  
  // Extract key terms and concepts
  const keyTerms = extractKeyTerms(text);
  const concepts = extractConcepts(text);
  const definitions = extractDefinitions(text);
  
  // Create flashcards from definitions
  definitions.forEach((def, index) => {
    if (flashcards.length < quantity) {
      flashcards.push({
        id: `local-def-${index}`,
        question: `What is ${def.term}?`,
        answer: def.definition
      });
    }
  });

  // Create flashcards from key terms
  keyTerms.forEach((term, index) => {
    if (flashcards.length < quantity) {
      const context = findContextForTerm(text, term);
      flashcards.push({
        id: `local-term-${index}`,
        question: `In the context of the text, what does "${term}" refer to?`,
        answer: context || `${term} is a key concept mentioned in the text.`
      });
    }
  });
  
  // Create concept-based questions
  concepts.forEach((concept, index) => {
    if (flashcards.length < quantity) {
      flashcards.push({
        id: `local-concept-${index}`,
        question: `Explain the significance of "${concept}" in this context.`,
        answer: `${concept} is an important concept that relates to the main topics discussed in the material.`
      });
    }
  });
  
  return flashcards.slice(0, quantity);
}

function generateQuizLocally(text: string, quantity: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 20);
  const keyTerms = extractKeyTerms(text);
  const concepts = extractConcepts(text);
  
  // Create multiple choice questions from key terms
  keyTerms.forEach((term, index) => {
    if (questions.length < quantity) {
      const context = findContextForTerm(text, term);
      const otherTerms = keyTerms.filter(t => t !== term).slice(0, 3);
      
      questions.push({
        id: `local-mcq-${index}`,
        type: 'mcq',
        question: `Which term is most relevant to: ${context?.substring(0, 100)}...?`,
        options: [term, ...otherTerms, 'None of the above'].slice(0, 4),
        correctAnswer: 0,
        explanation: `"${term}" is the correct answer based on the context in the text.`
      });
    }
  });
  
  // Create true/false questions
  concepts.slice(0, Math.floor(quantity / 2)).forEach((concept, index) => {
    if (questions.length < quantity) {
      questions.push({
        id: `local-tf-${index}`,
        type: 'true-false',
        question: `The text discusses "${concept}" as a main topic.`,
        correctAnswer: 0, // True
        explanation: `This statement is true based on the content provided.`
      });
    }
  });

  // Create fill-in-the-blank questions
  sentences.slice(0, Math.floor(quantity / 3)).forEach((sentence, index) => {
    if (questions.length < quantity) {
      const words = sentence.trim().split(' ');
      const importantWords = words.filter(word => word.length > 6 && !['however', 'therefore', 'because', 'although'].includes(word.toLowerCase()));
      
      if (importantWords.length > 0) {
        const blankWord = importantWords[0];
        const questionText = sentence.replace(blankWord, '____');
        
        questions.push({
          id: `local-fill-${index}`,
          type: 'fill-blank',
          question: `Fill in the blank: ${questionText}`,
          correctAnswer: blankWord,
          explanation: `The correct answer is "${blankWord}" based on the original text.`
        });
      }
    }
  });
  
  return questions.slice(0, quantity);
}

function extractKeyTerms(text: string): string[] {
  // Extract capitalized words and phrases that appear multiple times
  const words = text.match(/\b[A-Z][a-z]{2,}\b/g) || [];
  const phrases = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
  
  const termCounts: Record<string, number> = {};
  [...words, ...phrases].forEach(term => {
    termCounts[term] = (termCounts[term] || 0) + 1;
  });
  
  return Object.entries(termCounts)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([term, _]) => term)
    .slice(0, 10);
}

function extractConcepts(text: string): string[] {
  // Look for concepts using pattern matching
  const conceptPatterns = [
    /(?:concept of|principle of|theory of|method of|process of)\s+([A-Z][a-z\s]+)/gi,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is defined as|refers to|means)/gi,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*:\s*/gi
  ];
  
  const concepts: string[] = [];
  conceptPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 3) {
        concepts.push(match[1].trim());
      }
    }
  });
  
  return [...new Set(concepts)].slice(0, 8);
}

function extractDefinitions(text: string): Array<{term: string, definition: string}> {
  const definitions: Array<{term: string, definition: string}> = [];
  
  // Look for definition patterns
  const definitionPatterns = [
    /([A-Z][a-z\s]+)\s+is\s+([^.!?]+[.!?])/gi,
    /([A-Z][a-z\s]+)\s+refers to\s+([^.!?]+[.!?])/gi,
    /([A-Z][a-z\s]+)\s+means\s+([^.!?]+[.!?])/gi
  ];
  
  definitionPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[2] && match[1].length > 2 && match[2].length > 10) {
        definitions.push({
          term: match[1].trim(),
          definition: match[2].trim()
        });
      }
    }
  });
  
  return definitions.slice(0, 5);
}

function findContextForTerm(text: string, term: string): string | null {
  const sentences = text.split(/[.!?]+/);
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(term.toLowerCase()) && sentence.length > 20) {
      return sentence.trim();
    }
  }
  return null;
}

// Add support for handling large documents by chunking
export function chunkText(text: string, maxChunkSize: number = 6000): string[] {
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
