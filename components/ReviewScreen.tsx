import React from 'react';
import { Question } from '../types';
import QuestionReviewCard from './QuestionReviewCard';
import { SproutIcon } from './Icons';

interface ReviewScreenProps {
  history: {
    question: Question;
    userAnswer: string;
  }[];
  onStartNewGame: () => void;
  onGoToMenu: () => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ history, onStartNewGame, onGoToMenu }) => {
  return (
    <div className="w-full animate-bounce-in">
        <div className="text-center mb-6">
            <SproutIcon className="w-16 h-16 text-green-500 mx-auto mb-2"/>
            <h2 className="text-3xl font-black text-gray-800">Round Review</h2>
            <p className="text-md text-gray-600">Let's see how you did and grow even smarter!</p>
        </div>
      
        <div className="max-h-[50vh] overflow-y-auto pr-2">
            {history.map((item, index) => (
                <QuestionReviewCard 
                    key={index}
                    questionIndex={index}
                    question={item.question}
                    userAnswer={item.userAnswer}
                />
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 border-t pt-6">
            <button 
                onClick={onStartNewGame} 
                className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-200"
            >
                Play Again
            </button>
            <button 
                onClick={onGoToMenu} 
                className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-200"
            >
                Main Menu
            </button>
        </div>
    </div>
  );
};

export default ReviewScreen;
