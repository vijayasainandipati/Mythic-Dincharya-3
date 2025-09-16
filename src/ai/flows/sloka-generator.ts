'use server';

/**
 * @fileOverview A Genkit flow that generates a daily sloka.
 *
 * - generateSloka - A function that returns a sloka and its translation.
 */

import {ai, geminiFlash} from '@/ai/genkit';
import {SlokaOutputSchema, type SlokaOutput} from '@/ai/schemas/quiz-schema';
import { z } from 'genkit';


const SlokaInputSchema = z.object({
  theme: z.string().optional().describe("An optional theme for the sloka (e.g., 'Dharma', 'Courage')."),
});

export type SlokaInput = z.infer<typeof SlokaInputSchema>;


export async function generateSloka(input?: SlokaInput): Promise<SlokaOutput> {
  return slokaGeneratorFlow(input ?? {});
}

const slokaGeneratorPrompt = ai.definePrompt({
  name: 'slokaGeneratorPrompt',
  model: geminiFlash,
  input: { schema: SlokaInputSchema },
  output: {schema: SlokaOutputSchema},
  prompt: `Generate a single, profound sloka from the Bhagavad Gita or other well-known Hindu scriptures that is suitable for children.
  {{#if theme}}
  The sloka should be related to the theme of: {{{theme}}}.
  {{/if}}
  Provide the sloka in Sanskrit and a simple, clear English translation. The sloka should be inspiring and easy to understand.`,
});

const slokaGeneratorFlow = ai.defineFlow(
  {
    name: 'slokaGeneratorFlow',
    inputSchema: SlokaInputSchema,
    outputSchema: SlokaOutputSchema,
  },
  async (input) => {
    const {output} = await slokaGeneratorPrompt(input);
    return output!;
  }
);
