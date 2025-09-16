
'use server';

/**
 * @fileOverview A Genkit flow that generates a random fun fact or sloka about the Mahabharata.
 *
 * - generateFact - A function that returns a single fact or sloka.
 * - FactOutput - The return type for the generateFact function.
 */

import {ai, geminiFlash} from '@/ai/genkit';
import {z} from 'genkit';

const FactOutputSchema = z.object({
  title: z.string().describe('A short, catchy title for the fun fact (e.g., "The Unbreakable Vow", "A Divine Secret").'),
  fact: z.string().describe('A fun, kid-friendly fact or a simple sloka from the Mahabharata or related scriptures. If it is a sloka, provide a simple translation.'),
});

export type FactOutput = z.infer<typeof FactOutputSchema>;

export async function generateFact(): Promise<FactOutput> {
  return factGeneratorFlow();
}

const factGeneratorPrompt = ai.definePrompt({
  name: 'factGeneratorPrompt',
  model: geminiFlash,
  output: {schema: FactOutputSchema},
  prompt: `Generate a single fun fact or a simple sloka (with translation) about the Mahabharata. It should be kid-friendly, inspiring, and easy to understand. Also provide a short, catchy title for the fact.`,
});

const factGeneratorFlow = ai.defineFlow(
  {
    name: 'factGeneratorFlow',
    outputSchema: FactOutputSchema,
  },
  async () => {
    const {output} = await factGeneratorPrompt();
    return output!;
  }
);
