import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Quiz, QuizResult } from '../types';
import { storageUtils } from '../utils/storage';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Award, RefreshCw } from 'lucide-react';

const QuizAttemptPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz } = location.state || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  React.useEffect(() => {
    if (timeRemaining && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining]);

  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">No Quiz Found</h1>
          <p className="text-slate-600 mb-6">
            It looks like you navigated here without a quiz to take.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Quiz
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    const result: QuizResult = {
      quizId: quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      timestamp: Date.now(),
      answers,
    };

    storageUtils.saveQuizResult(result);
    setQuizResult(result);
    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(null);
    setShowResults(false);
    setQuizResult(null);
  };

  if (showResults && quizResult) {
    const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className={`p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Award className={`h-12 w-12 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Quiz Complete!</h1>
          <p className="text-slate-600 text-lg">Here are your results:</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{quizResult.score}</div>
              <div className="text-slate-600">Correct Answers</div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl">
              <div className="text-3xl font-bold text-slate-600 mb-2">{quizResult.totalQuestions}</div>
              <div className="text-slate-600">Total Questions</div>
            </div>
            
            <div className={`p-6 rounded-xl ${passed ? 'bg-green-50' : 'bg-orange-50'}`}>
              <div className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                {percentage}%
              </div>
              <div className="text-slate-600">Score</div>
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              passed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {passed ? 'Great Job! 🎉' : 'Keep Studying! 📚'}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Question Review</h3>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="border-b border-slate-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-slate-900 flex-1">
                      {index + 1}. {question.question}
                    </h4>
                    <span className={`ml-4 px-2 py-1 rounded text-sm font-medium ${
                      isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  {question.type === 'mcq' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded border ${
                              isCorrectAnswer
                                ? 'border-green-300 bg-green-50'
                                : isUserAnswer && !isCorrect
                                ? 'border-red-300 bg-red-50'
                                : 'border-slate-200'
                            }`}
                          >
                            <span className="text-sm font-medium text-slate-600">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>{' '}
                            {option}
                            {isCorrectAnswer && (
                              <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="ml-2 text-red-600 font-medium">Your answer</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="flex space-x-4">
                      <div className={`p-2 rounded border ${
                        question.correctAnswer === 0
                          ? 'border-green-300 bg-green-50'
                          : userAnswer === 0 && !isCorrect
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-200'
                      }`}>
                        True {question.correctAnswer === 0 && '✓'}
                        {userAnswer === 0 && userAnswer !== question.correctAnswer && ' (Your answer)'}
                      </div>
                      <div className={`p-2 rounded border ${
                        question.correctAnswer === 1
                          ? 'border-green-300 bg-green-50'
                          : userAnswer === 1 && !isCorrect
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-200'
                      }`}>
                        False {question.correctAnswer === 1 && '✓'}
                        {userAnswer === 1 && userAnswer !== question.correctAnswer && ' (Your answer)'}
                      </div>
                    </div>
                  )}

                  {question.type === 'fill-blank' && (
                    <div className="space-y-2">
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm font-medium text-green-800">Correct: </span>
                        {question.correctAnswer}
                      </div>
                      {userAnswer && userAnswer !== question.correctAnswer && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded">
                          <span className="text-sm font-medium text-red-800">Your answer: </span>
                          {userAnswer}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={retakeQuiz}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Retake Quiz</span>
          </button>
          
          <Link
            to="/decks"
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
          >
            My Quizzes
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
          <span>Exit Quiz</span>
        </Link>
        
        <div className="text-center">
          <div className="text-sm text-slate-600 mb-1">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </div>
          <div className="w-64 bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {timeRemaining && (
          <div className="text-right">
            <div className="flex items-center space-x-2 text-orange-600">
              <Clock className="h-5 w-5" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.type === 'mcq' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="mr-4 h-4 w-4 text-blue-600"
                  />
                  <span className="text-slate-800 font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-slate-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'true-false' && (
            <div className="flex space-x-4">
              {['True', 'False'].map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-colors flex-1 ${
                    answers[currentQuestion.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={index}
                    checked={answers[currentQuestion.id] === index}
                    onChange={() => handleAnswerChange(currentQuestion.id, index)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <span className="text-slate-800 font-medium text-lg">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fill-blank' && (
            <div>
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center space-x-2 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmitQuiz}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={goToNext}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quiz Progress</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(answers).length}
            </div>
            <div className="text-sm text-slate-600">Answered</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-600">
              {quiz.questions.length - Object.keys(answers).length}
            </div>
            <div className="text-sm text-slate-600">Remaining</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-sm text-slate-600">Complete</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;