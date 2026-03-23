'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RotateCcw, Brain } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizComponentProps {
  courseId?: number;
  lessonId?: number;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function QuizComponent({ courseId, lessonId, onComplete }: QuizComponentProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [courseId, lessonId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          numQuestions: 5
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
        setSelectedAnswers(new Array(data.questions.length).fill(-1));
      } else {
        setError('Failed to load quiz questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index]?.correctAnswer ? 1 : 0);
    }, 0);
    
    if (onComplete) {
      onComplete(score, questions.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(-1));
    setShowResults(false);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Excellent work! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad, keep practicing! 📚';
    return 'Keep studying and try again! 💪';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Generating your personalized quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchQuestions}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No quiz questions available.</p>
      </div>
    );
  }

  if (showResults) {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index]?.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600">{getScoreMessage(score, questions.length)}</p>
          </div>

          <div className="mb-8">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
              {score} / {questions.length}
            </div>
            <div className="text-lg text-gray-600">
              {Math.round((score / questions.length) * 100)}% correct
            </div>
          </div>

          <div className="space-y-4 mb-8 text-left">
            {questions.map((question, index) => (
              <div key={index} className="border rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {index + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded text-sm ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800'
                          : selectedAnswers[index] === optionIndex
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {option}
                      {optionIndex === question.correctAnswer && (
                        <CheckCircle className="inline h-4 w-4 ml-2" />
                      )}
                      {selectedAnswers[index] === optionIndex && optionIndex !== question.correctAnswer && (
                        <XCircle className="inline h-4 w-4 ml-2" />
                      )}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-sm text-blue-800">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={resetQuiz}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center mx-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== -1;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentQuestion
                    ? 'bg-primary-600'
                    : selectedAnswers[index] !== -1
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}