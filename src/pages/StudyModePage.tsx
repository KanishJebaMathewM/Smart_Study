import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Flashcard } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Check, Clock } from 'lucide-react';

const StudyModePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flashcards } = location.state || {};
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Flashcards Found</h1>
          <p className="text-slate-600 mb-6">
            It looks like you navigated here without any flashcards to study.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Flashcards
          </Link>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const goToNext = () => {
    if (isLastCard) {
      setShowSummary(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markAsKnown = () => {
    setKnownCards(prev => new Set([...prev, currentCard.id]));
    setReviewCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    goToNext();
  };

  const markForReview = () => {
    setReviewCards(prev => new Set([...prev, currentCard.id]));
    setKnownCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    goToNext();
  };

  const resetStudySession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards(new Set());
    setReviewCards(new Set());
    setShowSummary(false);
  };

  if (showSummary) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Study Session Complete!</h1>
          <p className="text-slate-600 text-lg">Great job! Here's how you did:</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{flashcards.length}</div>
              <div className="text-slate-600">Total Cards</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{knownCards.size}</div>
              <div className="text-slate-600">Known</div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">{reviewCards.size}</div>
              <div className="text-slate-600">Need Review</div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 mb-2">
                {Math.round((knownCards.size / flashcards.length) * 100)}%
              </div>
              <div className="text-slate-600">Mastery Score</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetStudySession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Study Again
          </button>
          
          <Link
            to="/decks"
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
          >
            My Decks
          </Link>
          
          <Link
            to="/"
            className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-medium text-center transition-colors"
          >
            Create New
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Exit Study Mode</span>
        </Link>
        
        <div className="text-center">
          <div className="text-sm text-slate-600 mb-1">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
          <div className="w-64 bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-slate-600">Session Progress</div>
          <div className="font-semibold text-slate-900">{Math.round(progress)}%</div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8 flex justify-center">
        <div
          className={`relative w-full max-w-2xl h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-slate-800 text-2xl font-medium leading-relaxed">
                {currentCard.question}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 font-semibold">QUESTION</span>
              <RotateCcw className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex-1 flex items-center justify-center">
              <p className="text-center text-slate-800 text-2xl leading-relaxed">
                {currentCard.answer}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600 font-semibold">ANSWER</span>
              <RotateCcw className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-6">
        {/* Flip Instruction */}
        {!isFlipped && (
          <p className="text-slate-600 text-center">
            Click the card to reveal the answer
          </p>
        )}

        {/* Knowledge Buttons */}
        {isFlipped && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={markForReview}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Clock className="h-5 w-5" />
              <span>Need More Review</span>
            </button>
            
            <button
              onClick={markAsKnown}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Check className="h-5 w-5" />
              <span>I Know This</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={goToNext}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <span>{isLastCard ? 'Finish' : 'Next'}</span>
            {!isLastCard && <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Session Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{knownCards.size}</div>
            <div className="text-sm text-slate-600">Known</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{reviewCards.size}</div>
            <div className="text-sm text-slate-600">Review</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-600">
              {flashcards.length - knownCards.size - reviewCards.size}
            </div>
            <div className="text-sm text-slate-600">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyModePage;