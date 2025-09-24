import { Topic, Difficulty } from './types';

export const TOPICS: Topic[] = [
  Topic.RECYCLING,
  Topic.RENEWABLE_ENERGY,
  Topic.CLIMATE_CHANGE,
  Topic.CONSERVATION,
];

export const DIFFICULTIES: Difficulty[] = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
];

export const REWARDS = {
  CORRECT_FIRST_TRY: 10,
  INCORRECT: -5,
};

export const TOTAL_QUESTIONS = 10;

export const TOPIC_COLORS: Record<Topic, string> = {
  [Topic.RECYCLING]: '#34d399', // emerald-400
  [Topic.RENEWABLE_ENERGY]: '#fbbf24', // amber-400
  [Topic.CLIMATE_CHANGE]: '#60a5fa', // blue-400
  [Topic.CONSERVATION]: '#a78bfa', // violet-400
};
