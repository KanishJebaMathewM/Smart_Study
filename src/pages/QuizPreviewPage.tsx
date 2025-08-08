import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Quiz, QuizQuestion } from '../types';
import { exportToPDF } from '../utils/pdfExport';
import { storageUtils } from '../utils/storage';
import { ArrowLeft, Save, FileDown, Play, Plus, Edit2, Trash2 } from 'lucide-react';

const QuizPreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions: initialQuestions, originalText, source } = location.state || {};
  
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions || []);
  const [quizName, setQuizName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const handleSaveQuiz = () => {
    if (!quizName.trim()) {
      alert('Please enter a quiz name.');
      return;
    }

    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      name: quizName.trim(),
      timestamp: Date.now(),
      questions,
    };

    storageUtils.saveQuiz(quiz);
    setShowSaveModal(false);
    alert('Quiz saved successfully!');
  };

  const handleExportPDF = () => {
    const quiz: Quiz = {
      id: 'export',
      name: quizName || 'Quiz',
      timestamp: Date.now(),
      questions,
    };

    exportToPDF.quiz(quiz);
  };

  const handleStartQuiz = () => {
    const quiz: Quiz = {
      id: `quiz-${Date.now()}`,
      name: quizName || 'Practice Quiz',
      timestamp: Date.now(),
      questions,
    };

    navigate('/quiz', { state: { quiz } });
  };

  const addNewQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      type: 'mcq',
      question: 'New Question',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    setEditingQuestion(null);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  if (!initialQuestions) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Quiz Found</h1>
          <p className="text-slate-600 mb-6">
            It looks like you navigated here without generating a quiz.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Generate Quiz
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
          <span>Back to Home</span>
        </Link>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-slate-900">Quiz Preview</h1>
          <p className="text-slate-600">{questions.length} questions generated</p>
          {source && (
            <p className="text-sm text-slate-500">Source: {source}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={addNewQuestion}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </button>
        
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save Quiz</span>
        </button>

        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FileDown className="h-4 w-4" />
          <span>Export PDF</span>
        </button>

        <button
          onClick={handleStartQuiz}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>Start Quiz</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isEditing={editingQuestion === question.id}
            onEdit={() => setEditingQuestion(question.id)}
            onUpdate={(updates) => updateQuestion(question.id, updates)}
            onDelete={() => deleteQuestion(question.id)}
            onCancelEdit={() => setEditingQuestion(null)}
          />
        ))}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Save Quiz</h3>
            
            <div className="mb-4">
              <label htmlFor="quizName" className="block text-sm font-medium text-slate-700 mb-2">
                Quiz Name
              </label>
              <input
                type="text"
                id="quizName"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Enter quiz name..."
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
                onClick={handleSaveQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<QuizQuestion>) => void;
  onDelete: () => void;
  onCancelEdit: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  isEditing,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}) => {
  const [editQuestion, setEditQuestion] = useState(question.question);
  const [editOptions, setEditOptions] = useState(question.options || []);
  const [editCorrectAnswer, setEditCorrectAnswer] = useState(question.correctAnswer);

  const handleSave = () => {
    onUpdate({
      question: editQuestion,
      options: editOptions,
      correctAnswer: editCorrectAnswer,
    });
  };

  const handleCancel = () => {
    setEditQuestion(question.question);
    setEditOptions(question.options || []);
    setEditCorrectAnswer(question.correctAnswer);
    onCancelEdit();
  };

  const addOption = () => {
    setEditOptions([...editOptions, 'New Option']);
  };

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...editOptions];
    newOptions[optionIndex] = value;
    setEditOptions(newOptions);
  };

  const removeOption = (optionIndex: number) => {
    if (editOptions.length > 2) {
      const newOptions = editOptions.filter((_, i) => i !== optionIndex);
      setEditOptions(newOptions);
      if (editCorrectAnswer === optionIndex) {
        setEditCorrectAnswer(0);
      } else if ((editCorrectAnswer as number) > optionIndex) {
        setEditCorrectAnswer((editCorrectAnswer as number) - 1);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Question {index + 1}
          </span>
          <span className="bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-full capitalize">
            {question.type.replace('-', ' ')}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800 p-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleCancel}
                className="text-slate-600 hover:text-slate-800 p-1"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={editQuestion}
            onChange={(e) => setEditQuestion(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Enter question..."
          />
        ) : (
          <p className="text-lg text-slate-800 font-medium">{question.question}</p>
        )}
      </div>

      {question.type === 'mcq' && (
        <div className="space-y-2">
          {isEditing ? (
            <div>
              <div className="space-y-2">
                {editOptions.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={editCorrectAnswer === optionIndex}
                      onChange={() => setEditCorrectAnswer(optionIndex)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(optionIndex, e.target.value)}
                      className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {editOptions.length > 2 && (
                      <button
                        onClick={() => removeOption(optionIndex)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addOption}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Option
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`flex items-center space-x-3 p-2 rounded-md ${
                    question.correctAnswer === optionIndex
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-600 w-8">
                    {String.fromCharCode(65 + optionIndex)}.
                  </span>
                  <span className="text-slate-800">{option}</span>
                  {question.correctAnswer === optionIndex && (
                    <span className="text-green-600 text-sm font-medium ml-auto">✓ Correct</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {question.type === 'true-false' && !isEditing && (
        <div className="flex space-x-4">
          <div className={`p-2 rounded-md ${question.correctAnswer === 0 ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
            <span className="text-slate-800">True</span>
            {question.correctAnswer === 0 && <span className="text-green-600 text-sm font-medium ml-2">✓</span>}
          </div>
          <div className={`p-2 rounded-md ${question.correctAnswer === 1 ? 'bg-green-50 border border-green-200' : 'bg-slate-50'}`}>
            <span className="text-slate-800">False</span>
            {question.correctAnswer === 1 && <span className="text-green-600 text-sm font-medium ml-2">✓</span>}
          </div>
        </div>
      )}

      {question.type === 'fill-blank' && !isEditing && (
        <div className="bg-slate-50 p-3 rounded-md">
          <span className="text-sm text-slate-600">Correct Answer: </span>
          <span className="text-slate-800 font-medium">{question.correctAnswer}</span>
        </div>
      )}
    </div>
  );
};

export default QuizPreviewPage;
