'use server';

/**
 * @fileOverview A Genkit flow that generates quiz questions about the Mahabharata.
 *
 * - generateQuizQuestions - A function that returns a list of quiz questions.
 */

import {ai, geminiFlash} from '@/ai/genkit';
import {QuizQuestionsOutputSchema, type QuizQuestionsOutput} from '@/ai/schemas/quiz-schema';


export async function generateQuizQuestions(): Promise<QuizQuestionsOutput> {
  return quizGeneratorFlow();
}

const quizGeneratorPrompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  model: geminiFlash,
  output: {schema: QuizQuestionsOutputSchema},
  prompt: `Generate 5 multiple-choice quiz questions about the Mahabharata for kids. The questions should be fun and educational. Each question must have exactly 4 possible answers. Ensure you specify the correct answer's index.`,
});

const quizGeneratorFlow = ai.defineFlow(
  {
    name: 'quizGeneratorFlow',
    outputSchema: QuizQuestionsOutputSchema,
  },
  async () => {
    const {output} = await quizGeneratorPrompt();
    return output!;
  }
);
