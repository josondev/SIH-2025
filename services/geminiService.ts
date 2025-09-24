import { GoogleGenAI, Type } from "@google/genai";
import { Topic, Difficulty, Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    questionText: { type: Type.STRING, description: "The text of the question." },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 4 possible answers.",
    },
    correctAnswer: { type: Type.STRING, description: "The correct answer from the options array." },
    explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." },
  },
  required: ["questionText", "options", "correctAnswer", "explanation"],
};

export const generateQuestion = async (topic: Topic, difficulty: Difficulty): Promise<Question> => {
  try {
    const prompt = `Generate a new, unique, ${difficulty.toLowerCase()} multiple-choice question about ${topic}. The question should have 4 options. Ensure the correct answer is one of the options. Provide a short explanation for the correct answer. Do not repeat questions.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    // Basic validation to ensure the response matches our Question interface
    if (
      !parsed.questionText ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      !parsed.correctAnswer ||
      !parsed.explanation
    ) {
      throw new Error("Invalid question format received from API.");
    }
    
    // Ensure correct answer is actually in the options
    if(!parsed.options.includes(parsed.correctAnswer)){
        // Simple fix: replace the last option with the correct answer
        parsed.options[parsed.options.length - 1] = parsed.correctAnswer;
    }


    return parsed as Question;
  } catch (error) {
    console.error("Error generating question:", error);
    // Fallback question in case of API error
    return {
      questionText: "Which of these is a renewable energy source?",
      options: ["Coal", "Natural Gas", "Solar", "Oil"],
      correctAnswer: "Solar",
      explanation: "Solar power is a renewable energy source because it comes from the sun, which is a naturally replenishing resource.",
    };
  }
};