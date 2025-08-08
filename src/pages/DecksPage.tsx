import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FlashcardDeck, Quiz } from '../types';
import { storageUtils } from '../utils/storage';
import { exportToPDF } from '../utils/pdfExport';
import { BookOpen, Brain, Calendar, Trash2, FileDown, Play, Edit2, Search } from 'lucide-react';

const DecksPage: React.FC = () => {
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'flashcards' | 'quizzes'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<{ type: 'deck' | 'quiz'; id: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setFlashcardDecks(storageUtils.getFlashcardDecks());
    setQuizzes(storageUtils.getQuizzes());
  };

  const handleDeleteDeck = (id: string) => {
    storageUtils.deleteFlashcardDeck(id);
    loadData();
    setShowDeleteModal(null);
  };

  const handleDeleteQuiz = (id: string) => {
    storageUtils.deleteQuiz(id);
    loadData();
    setShowDeleteModal(null);
  };

  const handleExportDeck = (deck: FlashcardDeck) => {
    exportToPDF.flashcardDeck(deck);
  };

  const handleExportQuiz = (quiz: Quiz) => {
    exportToPDF.quiz(quiz);
  };

  const filteredDecks = flashcardDecks.filter(deck =>
    (filterType === 'all' || filterType === 'flashcards') &&
    deck.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuizzes = quizzes.filter(quiz =>
    (filterType === 'all' || filterType === 'quizzes') &&
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allItems = [
    ...filteredDecks.map(deck => ({ ...deck, type: 'flashcards' as const })),
    ...filteredQuizzes.map(quiz => ({ ...quiz, type: 'quizzes' as const }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Study Materials</h1>
          <p className="text-slate-600">
            Manage your saved flashcard decks and quizzes
          </p>
        </div>
        
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mt-4 sm:mt-0 inline-block text-center"
        >
          Create New
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your study materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'flashcards', label: 'Flashcards' },
              { value: 'quizzes', label: 'Quizzes' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterType(value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{flashcardDecks.length}</div>
          <div className="text-slate-600">Flashcard Decks</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <Brain className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{quizzes.length}</div>
          <div className="text-slate-600">Quizzes</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <div className="bg-teal-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {flashcardDecks.reduce((sum, deck) => sum + deck.flashcards.length, 0) +
             quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}
          </div>
          <div className="text-slate-600">Total Items</div>
        </div>
      </div>

      {/* Items List */}
      {allItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="bg-slate-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">No study materials yet</h3>
          <p className="text-slate-600 mb-6">
            Create your first flashcard deck or quiz to get started with studying.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your First Deck
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {item.type === 'flashcards' ? (
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Brain className="h-5 w-5 text-indigo-600" />
                      </div>
                    )}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.type === 'flashcards' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {item.type === 'flashcards' ? 'Flashcards' : 'Quiz'}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-4">
                  <span>
                    {item.type === 'flashcards' 
                      ? `${(item as FlashcardDeck).flashcards.length} cards`
                      : `${(item as Quiz).questions.length} questions`
                    }
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {item.type === 'flashcards' ? (
                    <Link
                      to="/study"
                      state={{ flashcards: (item as FlashcardDeck).flashcards }}
                      className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center"
                    >
                      <Play className="h-4 w-4" />
                      <span>Study</span>
                    </Link>
                  ) : (
                    <Link
                      to="/quiz"
                      state={{ quiz: item as Quiz }}
                      className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center"
                    >
                      <Play className="h-4 w-4" />
                      <span>Take Quiz</span>
                    </Link>
                  )}

                  <button
                    onClick={() => item.type === 'flashcards' 
                      ? handleExportDeck(item as FlashcardDeck)
                      : handleExportQuiz(item as Quiz)
                    }
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Export PDF"
                  >
                    <FileDown className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setShowDeleteModal({ 
                      type: item.type === 'flashcards' ? 'deck' : 'quiz', 
                      id: item.id 
                    })}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Delete {showDeleteModal.type === 'deck' ? 'Flashcard Deck' : 'Quiz'}?
            </h3>
            
            <p className="text-slate-600 mb-6">
              This action cannot be undone. The {showDeleteModal.type === 'deck' ? 'flashcard deck' : 'quiz'} will be permanently deleted.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteModal.type === 'deck') {
                    handleDeleteDeck(showDeleteModal.id);
                  } else {
                    handleDeleteQuiz(showDeleteModal.id);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecksPage;