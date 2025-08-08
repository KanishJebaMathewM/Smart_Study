import React, { useState } from 'react';
import { Flashcard } from '../types';
import { Edit2, Trash2, RotateCcw } from 'lucide-react';

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onUpdate: (flashcards: Flashcard[]) => void;
  editable?: boolean;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ flashcards, onUpdate, editable = true }) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [editingCard, setEditingCard] = useState<string | null>(null);

  const toggleFlip = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    const updatedFlashcards = flashcards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    );
    onUpdate(updatedFlashcards);
    setEditingCard(null);
  };

  const deleteFlashcard = (id: string) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== id);
    onUpdate(updatedFlashcards);
  };

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg">No flashcards available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((card) => (
        <FlashcardComponent
          key={card.id}
          card={card}
          isFlipped={flippedCards.has(card.id)}
          isEditing={editingCard === card.id}
          editable={editable}
          onFlip={() => toggleFlip(card.id)}
          onEdit={() => setEditingCard(card.id)}
          onUpdate={(updates) => updateFlashcard(card.id, updates)}
          onDelete={() => deleteFlashcard(card.id)}
          onCancelEdit={() => setEditingCard(null)}
        />
      ))}
    </div>
  );
};

interface FlashcardComponentProps {
  card: Flashcard;
  isFlipped: boolean;
  isEditing: boolean;
  editable: boolean;
  onFlip: () => void;
  onEdit: () => void;
  onUpdate: (updates: Partial<Flashcard>) => void;
  onDelete: () => void;
  onCancelEdit: () => void;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({
  card,
  isFlipped,
  isEditing,
  editable,
  onFlip,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}) => {
  const [editQuestion, setEditQuestion] = useState(card.question);
  const [editAnswer, setEditAnswer] = useState(card.answer);

  const handleSave = () => {
    onUpdate({
      question: editQuestion,
      answer: editAnswer,
    });
  };

  const handleCancel = () => {
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    onCancelEdit();
  };

  return (
    <div className="relative">
      <div
        className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
          onClick={!isEditing ? onFlip : undefined}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex-1 flex items-center justify-center">
            {isEditing ? (
              <textarea
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="w-full h-full text-center text-slate-800 text-lg font-medium resize-none border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter question..."
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-center text-slate-800 text-lg font-medium leading-relaxed">
                {card.question}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-slate-500 font-medium">QUESTION</span>
            {!isFlipped && <RotateCcw className="h-4 w-4 text-slate-400" />}
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col rotate-y-180"
          onClick={!isEditing ? onFlip : undefined}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex items-center justify-center">
            {isEditing ? (
              <textarea
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                className="w-full h-full text-center text-slate-800 text-lg resize-none border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter answer..."
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-center text-slate-800 text-lg leading-relaxed">
                {card.answer}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-blue-600 font-medium">ANSWER</span>
            {isFlipped && <RotateCcw className="h-4 w-4 text-blue-400" />}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {editable && (
        <div className="absolute top-2 right-2 flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-sm transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="bg-slate-500 hover:bg-slate-600 text-white p-2 rounded-full shadow-sm transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-sm transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-sm transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FlashcardGrid;