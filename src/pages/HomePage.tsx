import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenerationType } from '../types';
import { generateFlashcardsFromText, generateQuizFromText } from '../utils/aiGenerator';
import { ArrowRight, Sparkles, BookOpen, Brain, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [noteText, setNoteText] = useState('');
  const [generationType, setGenerationType] = useState<GenerationType>('flashcards');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!noteText.trim()) {
      alert('Please enter some text to generate study materials.');
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (generationType === 'flashcards') {
        const flashcards = generateFlashcardsFromText(noteText);
        navigate('/preview/flashcards', { 
          state: { 
            flashcards, 
            originalText: noteText 
          } 
        });
      } else if (generationType === 'quizzes') {
        const quiz = generateQuizFromText(noteText);
        navigate('/preview/quiz', { 
          state: { 
            questions: quiz, 
            originalText: noteText 
          } 
        });
      } else {
        // Both - navigate to flashcards first
        const flashcards = generateFlashcardsFromText(noteText);
        const quiz = generateQuizFromText(noteText);
        navigate('/preview/flashcards', { 
          state: { 
            flashcards, 
            quiz,
            originalText: noteText 
          } 
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToInput = () => {
    document.getElementById('note-input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
            Turn Your Notes into{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Interactive Study Materials
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
            Paste your notes and create flashcards & quizzes instantly. Study smarter with AI-powered 
            content generation — works offline, no signup needed.
          </p>
          
          <button
            onClick={scrollToInput}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 mx-auto transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Flashcards</h3>
              <p className="text-slate-600">
                AI automatically identifies key concepts and creates interactive flashcards from your notes.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Interactive Quizzes</h3>
              <p className="text-slate-600">
                Generate multiple choice, true/false, and fill-in-the-blank questions for effective testing.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Instant & Offline</h3>
              <p className="text-slate-600">
                Works completely offline with local storage. No internet required after initial load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Note Input Section */}
      <section id="note-input-section" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
              Paste Your Notes
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-3">
                  Your Study Material
                </label>
                <textarea
                  id="notes"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Paste your notes, textbook excerpts, or any study material here. The AI will analyze the content and create interactive study materials for you."
                  className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800 leading-relaxed"
                />
                <div className="mt-2 text-sm text-slate-500">
                  {noteText.length} characters • Minimum 100 characters recommended
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  What would you like to generate?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { value: 'flashcards', label: 'Flashcards', icon: BookOpen },
                    { value: 'quizzes', label: 'Quizzes', icon: Brain },
                    { value: 'both', label: 'Both', icon: Sparkles },
                  ].map(({ value, label, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        generationType === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="generationType"
                        value={value}
                        checked={generationType === value}
                        onChange={(e) => setGenerationType(e.target.value as GenerationType)}
                        className="hidden"
                      />
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!noteText.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Study Materials...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Study Materials</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;