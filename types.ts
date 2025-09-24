export enum Topic {
  RECYCLING = 'Recycling',
  RENEWABLE_ENERGY = 'Renewable Energy',
  CLIMATE_CHANGE = 'Climate Change',
  CONSERVATION = 'Conservation',
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export interface Question {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface RLState {
  score: number;
  correctStreak: number;
  incorrectStreak: number;
  topicPerformance: Record<Topic, { correct: number; total: number }>;
  topicConfidence: Record<Topic, number>; // For RLHF
}

export enum GamePhase {
  START,
  PLAYING,
  ANSWERED,
  LOADING,
  FINISHED,
  REVIEW,
}

export type FeedbackType = 'simple' | 'encouraging' | 'detailed';