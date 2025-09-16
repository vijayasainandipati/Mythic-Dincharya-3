
'use server';

/**
 * @fileOverview A Genkit flow that generates a mini-crossword puzzle about the Mahabharata.
 *
 * - generateCrossword - A function that returns a list of words and clues.
 * - Crossword - The return type for the generateCrossword function.
 */

import {ai, geminiFlash} from '@/ai/genkit';
import {z} from 'genkit';

const CrosswordWordSchema = z.object({
  word: z.string().describe('A 4-8 letter word from the Mahabharata (character, place, event).'),
  clue: z.string().describe('A short, clear clue for the word (less than 12 words).'),
});

const CrosswordSchema = z.object({
  words: z.array(CrosswordWordSchema).min(3).max(5).describe('An array of 3 to 5 words for the crossword.'),
});

export type Crossword = z.infer<typeof CrosswordSchema>;

export async function generateCrossword(): Promise<Crossword> {
  return crosswordGeneratorFlow();
}

const crosswordGeneratorPrompt = ai.definePrompt({
  name: 'crosswordGeneratorPrompt',
  model: geminiFlash,
  output: {schema: CrosswordSchema},
  prompt: `You are a Mahabharata quiz master.

Generate a mini-crossword puzzle with 3 to 5 words based on the Mahabharata.
- Each word must be between 4 and 8 letters long.
- Words should be names of Mahabharata characters, places, or important events.
- Each word must have one short, clear clue (less than 12 words).
- The output must be strict JSON with no extra text.
`,
});

const crosswordGeneratorFlow = ai.defineFlow(
  {
    name: 'crosswordGeneratorFlow',
    outputSchema: CrosswordSchema,
  },
  async () => {
    const {output} = await crosswordGeneratorPrompt();
    return output!;
  }
);
