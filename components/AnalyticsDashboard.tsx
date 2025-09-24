import React, { useState } from 'react';
import { RLState } from '../types';
import { TOPICS, TOPIC_COLORS } from '../constants';
import { SproutIcon, TrophyIcon, StarIcon } from './Icons';
import PieChart from './PieChart';

interface AnalyticsDashboardProps {
  rlState: RLState;
  onNextRound: () => void;
  onReview: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ rlState, onNextRound, onReview }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  const totalCorrect = Object.values(rlState.topicPerformance).reduce((sum, { correct }) => sum + correct, 0);
  const totalAnswered = Object.values(rlState.topicPerformance).reduce((sum, { total }) => sum + total, 0);
  const overallAccuracy = totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(0) : 0;

  const pieChartData = TOPICS.map(topic => ({
    name: topic,
    value: rlState.topicPerformance[topic].total,
    color: TOPIC_COLORS[topic],
  })).filter(item => item.value > 0);

  const RLExplanation = () => (
    <div className="text-left p-4 mt-6 bg-slate-50 border border-slate-200 rounded-lg">
        <h4 className="font-bold text-lg text-gray-800 mb-2">How Sprout Helps You Learn</h4>
        <p className="text-gray-600 mb-4">This app acts like a smart tutor to help you learn best. Here’s how:</p>
        <ul className="space-y-3 list-disc list-inside text-gray-700">
            <li>
                <span className="font-semibold">The Perfect Challenge:</span> If you get a few right, the questions get a little trickier. If you stumble, they get a bit easier, so you can always do your best!
            </li>
            <li>
                <span className="font-semibold">Practice Makes Perfect:</span> The app notices which topics are tough for you and gives you more questions on them to help you master them.
            </li>
            <li>
                <span className="font-semibold">You're the Teacher!:</span> Your "thumbs up" or "thumbs down" on explanations teaches the app what's helpful, so it can give better hints next time.
            </li>
        </ul>
    </div>
  );

  return (
    <div className="text-center bg-white/70 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-2xl w-full animate-bounce-in">
        <SproutIcon className="w-24 h-24 text-green-500 mx-auto mb-2"/>
      <h2 className="text-4xl font-black text-green-600 mb-2">Amazing Growth!</h2>
      <p className="text-lg text-gray-600 mb-6">You're making a real difference. Look at your results!</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8 text-center">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex flex-col items-center justify-center">
            <TrophyIcon className="w-8 h-8 text-blue-500 mb-1" />
            <p className="text-sm font-bold text-blue-600 uppercase">Total Score</p>
            <p className="text-4xl font-extrabold text-blue-800">{rlState.score}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex flex-col items-center justify-center">
            <StarIcon className="w-8 h-8 text-yellow-500 mb-1" />
            <p className="text-sm font-bold text-yellow-600 uppercase">Accuracy</p>
            <p className="text-4xl font-extrabold text-yellow-800">{overallAccuracy}%</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Topic Mix</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-4 bg-gray-50 rounded-lg">
          <PieChart data={pieChartData} />
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            {pieChartData.map(item => (
              <div key={item.name} className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                <span className="font-semibold text-gray-700 text-sm">{item.name} ({((item.value / totalAnswered) * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6 mt-6">
        <button onClick={() => setShowExplanation(!showExplanation)} className="text-blue-600 hover:underline mb-4">
            {showExplanation ? 'Hide Secret' : 'How does it work?'}
        </button>
        {showExplanation && <RLExplanation />}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <button 
            onClick={onNextRound} 
            className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-200"
        >
          Keep Growing!
        </button>
        <button 
            onClick={onReview} 
            className="w-full sm:w-auto px-8 py-3 bg-gray-600 text-white font-bold text-lg rounded-full shadow-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-200"
        >
          Review Answers
        </button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;