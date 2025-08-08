import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Flashcard, FlashcardDeck } from '../types';
import FlashcardGrid from '../components/FlashcardGrid';
import { exportToPDF } from '../utils/pdfExport';
import { storageUtils } from '../utils/storage';
import { ArrowLeft, Save, FileDown, Play, Plus } from 'lucide-react';

const FlashcardPreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flashcards: initialFlashcards, originalText, quiz, source } = location.state || {};
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards || []);
  const [deckName, setDeckName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSaveDeck = () => {
    if (!deckName.trim()) {
      alert('Please enter a deck name.');
      return;
    }

    const deck: FlashcardDeck = {
      id: `deck-${Date.now()}`,
      name: deckName.trim(),
      timestamp: Date.now(),
      flashcards,
    };

    storageUtils.saveFlashcardDeck(deck);
    setShowSaveModal(false);
    alert('Deck saved successfully!');
  };

  const handleExportPDF = () => {
    const deck: FlashcardDeck = {
      id: 'export',
      name: deckName || 'Flashcard Deck',
      timestamp: Date.now(),
      flashcards,
    };

    exportToPDF.flashcardDeck(deck);
  };

  const handleStartStudyMode = () => {
    navigate('/study', { state: { flashcards } });
  };

  const addNewCard = () => {
    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      question: 'New Question',
      answer: 'New Answer',
    };
    setFlashcards([...flashcards, newCard]);
  };

  if (!initialFlashcards) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Flashcards Found</h1>
          <p className="text-slate-600 mb-6">
            It looks like you navigated here without generating any flashcards.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Generate Flashcards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-slate-900">Flashcard Preview</h1>
          <p className="text-slate-600">{flashcards.length} flashcards generated</p>
          {source && (
            <p className="text-sm text-slate-500">Source: {source}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={addNewCard}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Card</span>
        </button>
        
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Deck</span>
        </button>

        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FileDown className="h-4 w-4" />
          <span>Export PDF</span>
        </button>

        <button
          onClick={handleStartStudyMode}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>Start Study Mode</span>
        </button>

        {quiz && (
          <Link
            to="/preview/quiz"
            state={{ questions: quiz, originalText }}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span>View Quiz</span>
          </Link>
        )}
      </div>

      {/* Flashcards Grid */}
      <FlashcardGrid
        flashcards={flashcards}
        onUpdate={setFlashcards}
        editable={true}
      />

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Save Flashcard Deck</h3>
            
            <div className="mb-4">
              <label htmlFor="deckName" className="block text-sm font-medium text-slate-700 mb-2">
                Deck Name
              </label>
              <input
                type="text"
                id="deckName"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Enter deck name..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeck}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardPreviewPage;
