'use server';

/**
 * @fileOverview A Genkit flow that generates a single daily quiz question about the Mahabharata.
 *
 * - generateDailyQuiz - A function that returns one quiz question.
 */

import {ai, geminiFlash} from '@/ai/genkit';
import {QuizQuestionSchema, type QuizQuestion} from '@/ai/schemas/quiz-schema';
import { z } from 'genkit';

const DailyQuizOutputSchema = z.object({
    question: QuizQuestionSchema,
});

export type DailyQuizOutput = z.infer<typeof DailyQuizOutputSchema>;


export async function generateDailyQuiz(): Promise<DailyQuizOutput> {
  return dailyQuizGeneratorFlow();
}

const dailyQuizGeneratorPrompt = ai.definePrompt({
  name: 'dailyQuizGeneratorPrompt',
  model: geminiFlash,
  output: {schema: DailyQuizOutputSchema},
  prompt: `Generate 1 multiple-choice quiz question about the Mahabharata for kids. The question should be fun and educational. The question must have exactly 4 possible answers. Ensure you specify the correct answer's index.`,
});

const dailyQuizGeneratorFlow = ai.defineFlow(
  {
    name: 'dailyQuizGeneratorFlow',
    outputSchema: DailyQuizOutputSchema,
  },
  async () => {
    const {output} = await dailyQuizGeneratorPrompt();
    return output!;
  }
);
