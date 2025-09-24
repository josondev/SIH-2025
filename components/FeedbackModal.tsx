import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ThumbsUpIcon, ThumbsDownIcon, SproutIcon } from './Icons';
import Confetti from './Confetti';

interface FeedbackModalProps {
  isCorrect: boolean;
  explanation: string;
  feedbackMessage: string;
  onNext: () => void;
  onExplanationFeedback: (feedback: 'good' | 'bad') => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isCorrect, explanation, feedbackMessage, onNext, onExplanationFeedback }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (feedback: 'good' | 'bad') => {
    onExplanationFeedback(feedback);
    setFeedbackGiven(true);
  };

  const bgColor = isCorrect ? 'bg-green-500' : 'bg-orange-500';
  const textColor = isCorrect ? 'text-green-800' : 'text-orange-800';
  const icon = isCorrect ? <CheckCircleIcon className="h-8 w-8 text-white" /> : <XCircleIcon className="h-8 w-8 text-white" />;
  const title = isCorrect ? 'Awesome!' : 'Good Try!';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
       {isCorrect && <Confetti />}
      <div className={`w-full max-w-2xl rounded-t-2xl shadow-lg transition-transform transform translate-y-0 animate-slide-up`}>
        <div className={`${bgColor} text-white p-4 flex items-center space-x-4 rounded-t-2xl`}>
          {icon}
          <div>
            <h2 className="text-3xl font-black">{title}</h2>
          </div>
        </div>
        <div className="bg-white p-6">
          <div className="flex items-center space-x-4 mb-4">
              <SproutIcon className="h-20 w-20 text-green-500 flex-shrink-0" />
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="font-semibold text-green-800 text-lg">{feedbackMessage}</p>
              </div>
          </div>
          <div className="flex justify-between items-start mt-4">
            <div>
              <p className={`${textColor} font-bold mb-2`}>Here's why:</p>
              <p className="text-gray-700 text-lg">{explanation}</p>
            </div>
            <div className="flex flex-col items-center space-y-2 ml-4">
              <p className="text-sm font-semibold text-gray-600">Helpful?</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleFeedback('good')} 
                  disabled={feedbackGiven}
                  className={`p-2 rounded-full transition-colors ${feedbackGiven ? 'text-gray-400' : 'text-green-500 hover:bg-green-100'}`}
                  aria-label="Good explanation"
                >
                  <ThumbsUpIcon className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => handleFeedback('bad')} 
                  disabled={feedbackGiven}
                  className={`p-2 rounded-full transition-colors ${feedbackGiven ? 'text-gray-400' : 'text-red-500 hover:bg-red-100'}`}
                  aria-label="Bad explanation"
                >
                  <ThumbsDownIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 flex justify-end rounded-b-2xl">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform"
          >
            Next Question!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;