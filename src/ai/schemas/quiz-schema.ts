/**
 * @fileOverview Defines the Zod schemas and TypeScript types for the quiz and sloka features.
 *
 * - QuizQuestionSchema - The schema for a single quiz question.
 * - QuizQuestionsOutputSchema - The schema for the output of the quiz generation flow.
 * - SlokaOutputSchema - The schema for the output of the sloka generation flow.
 * - QuizQuestion - The TypeScript type for a single quiz question.
 * - QuizQuestionsOutput - The TypeScript type for the quiz generation output.
 * - SlokaOutput - The TypeScript type for the sloka generation output.
 */

import {z} from 'genkit';

export const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  answers: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correctAnswerIndex: z.number().min(0).max(3).describe('The index of the correct answer in the answers array.'),
});

export const QuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).length(5).describe('An array of 5 quiz questions.'),
});

export const SlokaOutputSchema = z.object({
  sloka: z.string().describe('A sloka from the Bhagavad Gita or other Hindu scriptures, in Sanskrit.'),
  translation: z.string().describe('The English translation of the sloka.'),
});


export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizQuestionsOutput = z.infer<typeof QuizQuestionsOutputSchema>;
export type SlokaOutput = z.infer<typeof SlokaOutputSchema>;
