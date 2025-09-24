import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  isAnswered: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedAnswer, onSelectAnswer, isAnswered }) => {
  const getButtonClass = (option: string) => {
    // State: Before the user submits an answer
    if (!isAnswered) {
      return selectedAnswer === option
        ? 'bg-yellow-200 border-yellow-400 ring-2 ring-yellow-400 text-yellow-900 font-semibold' // Selected option
        : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800'; // Unselected options
    }

    // State: After the user has submitted an answer
    const isCorrect = option === question.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-200 border-green-400 text-green-900 font-bold'; // The correct answer
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-200 border-red-400 text-red-900 font-bold'; // The user's incorrect selection
    }
    // Other options that were not selected
    return 'bg-gray-100 border-gray-200 text-gray-500';
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">{question.questionText}</h2>
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 rounded-lg border-2 text-lg transition-all duration-200 focus:outline-none ${getButtonClass(option)} disabled:cursor-not-allowed`}
          >
            <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;