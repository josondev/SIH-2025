import React from 'react';
import { Question } from '../types';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface QuestionReviewCardProps {
  question: Question;
  userAnswer: string;
  questionIndex: number;
}

const QuestionReviewCard: React.FC<QuestionReviewCardProps> = ({ question, userAnswer, questionIndex }) => {
  const isCorrect = userAnswer === question.correctAnswer;

  const getOptionClass = (option: string) => {
    const isCorrectAnswer = option === question.correctAnswer;
    const isUserAnswer = option === userAnswer;

    if (isCorrectAnswer) {
      return 'bg-green-100 border-green-300 text-green-800';
    }
    if (isUserAnswer && !isCorrectAnswer) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    return 'bg-gray-100 border-gray-200 text-gray-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start mb-3">
        <span className="text-xl font-bold text-gray-500 mr-3">{questionIndex + 1}.</span>
        <h3 className="text-lg font-semibold text-gray-800">{question.questionText}</h3>
      </div>

      <div className="space-y-2 mb-4 pl-8">
        {question.options.map((option, index) => (
          <div key={index} className={`p-2 border rounded-md text-md ${getOptionClass(option)}`}>
            {option}
          </div>
        ))}
      </div>
      
      <div className="pl-8">
        <div className={`p-3 rounded-lg flex items-start space-x-3 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex-shrink-0">
            {isCorrect ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <XCircleIcon className="w-6 h-6 text-red-500" />}
          </div>
          <div>
              <p className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? "You got it right!" : "The correct answer was:"}
              </p>
              {!isCorrect && <p className="font-semibold text-gray-800 mb-1">{question.correctAnswer}</p>}
              <p className="text-gray-600">{question.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionReviewCard;
