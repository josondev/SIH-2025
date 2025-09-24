
import React, { useState, useCallback } from 'react';
import { Topic, Difficulty, Question, RLState, GamePhase } from './types';
import { TOPICS, REWARDS, TOTAL_QUESTIONS } from './constants';
import { generateQuestion } from './services/geminiService';
import ProgressBar from './components/ProgressBar';
import LoadingSpinner from './components/LoadingSpinner';
import FeedbackModal from './components/FeedbackModal';
import QuestionCard from './components/QuestionCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { SproutIcon } from './components/Icons';
import ReviewScreen from './components/ReviewScreen';

const App: React.FC = () => {
  const initialRLState: RLState = {
    score: 0,
    correctStreak: 0,
    incorrectStreak: 0,
    topicPerformance: TOPICS.reduce((acc, topic) => {
      acc[topic] = { correct: 0, total: 0 };
      return acc;
    }, {} as Record<Topic, { correct: number; total: number }>),
    topicConfidence: TOPICS.reduce((acc, topic) => {
      acc[topic] = 0;
      return acc;
    }, {} as Record<Topic, number>),
  };

  const [rlState, setRlState] = useState<RLState>(initialRLState);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic>(TOPICS[0]);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.START);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<{ question: Question; userAnswer: string }[]>([]);

  const determineNextAction = useCallback((): { topic: Topic; difficulty: Difficulty } => {
    // RL Policy Simulation
    let nextDifficulty = Difficulty.MEDIUM;
    if (rlState.correctStreak >= 2) nextDifficulty = Difficulty.HARD;
    if (rlState.incorrectStreak >= 2) nextDifficulty = Difficulty.EASY;

    // Select topic with the worst performance to reinforce learning
    let worstTopic = TOPICS[0];
    let minPerformance = 1.1;

    for (const topic of TOPICS) {
      const { correct, total } = rlState.topicPerformance[topic];
      if (total === 0) { // Prioritize new topics
        worstTopic = topic;
        break;
      }
      const performance = correct / total;
      if (performance < minPerformance) {
        minPerformance = performance;
        worstTopic = topic;
      }
    }
    
    // Randomly pick a new topic sometimes to keep it fresh
    if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * TOPICS.length);
        worstTopic = TOPICS[randomIndex];
    }

    return { topic: worstTopic, difficulty: nextDifficulty };
  }, [rlState.correctStreak, rlState.incorrectStreak, rlState.topicPerformance]);

  const fetchQuestion = useCallback(async () => {
    setGamePhase(GamePhase.LOADING);
    const { topic, difficulty } = determineNextAction();
    setCurrentTopic(topic);
    const question = await generateQuestion(topic, difficulty);

    // Increment question number only after a new question has been successfully fetched.
    setQuestionNumber(prev => prev + 1);

    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setGamePhase(GamePhase.PLAYING);
  }, [determineNextAction]);

  const startInitialGame = () => {
    setQuestionNumber(0);
    setRlState(initialRLState);
    setSessionHistory([]);
    fetchQuestion();
  };
  
  const handleNextQuestion = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setGamePhase(GamePhase.FINISHED);
    } else {
      fetchQuestion();
    }
  };
  
  const handleNextRound = () => {
    setQuestionNumber(0);
    setSessionHistory([]);
    fetchQuestion();
  }
  
  const handleGoToMenu = () => {
    setGamePhase(GamePhase.START);
  }

  const handleReview = () => {
    setGamePhase(GamePhase.REVIEW);
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;

    setSessionHistory(prev => [...prev, { question: currentQuestion, userAnswer: selectedAnswer }]);

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setRlState(prev => {
      const newTopicPerformance = { ...prev.topicPerformance };
      newTopicPerformance[currentTopic] = {
        correct: newTopicPerformance[currentTopic].correct + (isCorrect ? 1 : 0),
        total: newTopicPerformance[currentTopic].total + 1,
      };

      return {
        ...prev,
        score: prev.score + (isCorrect ? REWARDS.CORRECT_FIRST_TRY : REWARDS.INCORRECT),
        correctStreak: isCorrect ? prev.correctStreak + 1 : 0,
        incorrectStreak: isCorrect ? 0 : prev.incorrectStreak + 1,
        topicPerformance: newTopicPerformance,
      };
    });

    setGamePhase(GamePhase.ANSWERED);
  };
  
  const handleExplanationFeedback = (feedback: 'good' | 'bad') => {
    setRlState(prev => {
      const newConfidence = { ...prev.topicConfidence };
      newConfidence[currentTopic] += (feedback === 'good' ? 1 : -1);
      return { ...prev, topicConfidence: newConfidence };
    });
  };
  
  const getFeedbackMessage = (): string => {
      if(rlState.incorrectStreak > 1) return "No worries, every expert was once a beginner! Let's check out why.";
      if(rlState.correctStreak > 2) return "Wow! You're a true Eco-Hero! Keep up the amazing work!";
      if(rlState.correctStreak > 0) return "You got it! You're helping the planet grow stronger!";
      return "That's a great first step on our learning adventure!";
  }

  const renderContent = () => {
    switch (gamePhase) {
      case GamePhase.START:
        return (
          <div className="text-center animate-bounce-in">
            <SproutIcon className="w-32 h-32 text-green-500 mx-auto mb-4" />
            <h1 className="text-5xl font-black text-gray-800 mb-2">EcoLearner!</h1>
            <p className="text-xl text-gray-600 mb-8">Join Sprout on an adventure to save the planet!</p>
            <button onClick={startInitialGame} className="px-10 py-4 bg-green-600 text-white font-bold text-xl rounded-full shadow-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transform hover:scale-105 transition-transform duration-200">
              Let's Go!
            </button>
          </div>
        );
      case GamePhase.LOADING:
        return <LoadingSpinner />;
      case GamePhase.PLAYING:
      case GamePhase.ANSWERED:
        return currentQuestion && (
          <div className="w-full flex flex-col items-center">
            <QuestionCard 
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleAnswerSelect}
                isAnswered={gamePhase === GamePhase.ANSWERED}
            />
            {gamePhase === GamePhase.PLAYING && (
                 <button 
                    onClick={handleSubmit} 
                    disabled={!selectedAnswer}
                    className="mt-8 px-10 py-4 bg-blue-600 text-white font-bold text-xl rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 transition-transform"
                >
                    Check Answer
                </button>
            )}
            {gamePhase === GamePhase.ANSWERED && currentQuestion && (
                <FeedbackModal 
                    isCorrect={selectedAnswer === currentQuestion.correctAnswer}
                    explanation={currentQuestion.explanation}
                    feedbackMessage={getFeedbackMessage()}
                    onNext={handleNextQuestion}
                    onExplanationFeedback={handleExplanationFeedback}
                />
            )}
          </div>
        );
      case GamePhase.FINISHED:
        return (
            <AnalyticsDashboard 
                rlState={rlState}
                onNextRound={handleNextRound}
                onReview={handleReview}
            />
        );
      case GamePhase.REVIEW:
        return (
            <ReviewScreen 
                history={sessionHistory}
                onStartNewGame={handleNextRound}
                onGoToMenu={handleGoToMenu}
            />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
            {gamePhase !== GamePhase.START && gamePhase !== GamePhase.FINISHED && gamePhase !== GamePhase.REVIEW && (
                <header className="w-full mb-6">
                    <div className="flex justify-between items-center mb-2 text-gray-700 font-bold text-lg">
                        <p>Score: {rlState.score}</p>
                        <p>Question: {questionNumber} / {TOTAL_QUESTIONS}</p>
                    </div>
                    <ProgressBar current={questionNumber} total={TOTAL_QUESTIONS} />
                </header>
            )}
            <div className="bg-white/70 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-lg min-h-[400px] flex items-center justify-center">
                {renderContent()}
            </div>
        </div>
    </main>
  );
};

export default App;